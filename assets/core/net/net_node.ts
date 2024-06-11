import { NetBuff, NetCmd, NetConnOpt, NetEvent, NetHandler, NetHint, NetObj, NetReq, NetSocket, NetState } from "./network";

/**
 * 連線節點
 */
export class NetNode {
    // 狀態
    private _state: NetState = NetState.Closed;

    // socket
    private _socket: NetSocket = null;

    // socket是否準備完成
    private _readied: boolean = false;

    // 數據處理
    private _handler: NetHandler = null;

    // 介面顯示
    private _hint: NetHint = null;

    // 請求列表
    private _requests: NetReq[] = [];

    // 協議監聽
    private _listeners: Map<NetCmd, NetObj[]> = new Map();

    // 連線參數
    private _connOpt: NetConnOpt = null;

    // 剩餘重連次數
    private _reconn: number = 0;

    // 心跳計時器
    private _beatTimer: number = -1;

    // 斷線計時器
    private _disconnTimer: number = -1;

    // 重連計時器
    private _reconnTimer: number = -1;

    /**
     * 初始化
     * @param socket 
     * @param handler 數據處理 
     * @param hint 介面提示
     */
    public init(socket: NetSocket, handler: NetHandler, hint?: NetHint): void {
        this._socket = socket;
        this._handler = handler;
        this._hint = hint;
    }

    /**
     * 連線
     * @param opt 連線參數
     */
    public connect(opt: NetConnOpt): boolean {
        if (this._state != NetState.Closed) {
            return false;
        }

        let addr = opt.addr;
        this._state = NetState.Connecting;

        console.log(`net node start conn, addr=${addr}`);

        this.setSocket();

        if (this._socket.connect(opt) == false) {
            console.error(`net node conn failed, addr=${addr}`);
            this._hint?.onConn(false);

            return false;
        }

        this._connOpt = opt;
        this._reconn = opt.reconn;

        return true;
    }

    /**
     * 配置socket
     */
    private setSocket(): void {
        if (!this._readied) {
            this._readied = true;

            this._socket.message = this.onMsg.bind(this);
            this._socket.connected = this.onConn.bind(this);
            this._socket.error = this.onErr.bind(this);
            this._socket.closed = this.onClose.bind(this);
        }
    }

    /**
     * 發送訊息
     * @param cmd 協議編號
     * @param buff 數據
     * @param force 強制發送
     * @summary 當斷線時強制發送不會進行斷線後重送
     */
    public send(cmd: NetCmd, buff: NetBuff, force: boolean = false): boolean {
        // 已連線或是強制發送
        if (this._state == NetState.Connected || force) {
            return this._socket.send(buff);
        }
        // 重連或是重送中
        else if (this._state == NetState.Connecting || this._state == NetState.Resending) {
            this._requests.push({ cmd: cmd, buff: buff, done: null });
            return true;
        }
        // 錯誤
        else {
            console.error(`net node send failed, cmd=${cmd}`, buff);
        }
    }

    /**
     * 發送請求
     * @param cmd 協議編號
     * @param buff 數據
     * @param done 完成回調
     * @param hint 是否顯示介面提示
     * @param force 強制發送
     * @summary 當斷線時強制發送不會進行斷線後重送
     */
    public request(cmd: NetCmd, buff: NetBuff, done: NetObj, hint: boolean = false, force: boolean = false): boolean {
        if (this._state == NetState.Connected || force) {
            this._socket.send(buff);
        }

        this._requests.push({ cmd: cmd, buff: buff, done: done });
        this._hint?.onReq(true);

        return true;
    }

    /**
     * 發送唯一請求
     * @param cmd 協議編號
     * @param buff 數據
     * @param done 完成回調
     * @param hint 是否顯示介面提示
     * @param force 強制發送
     * @summary 當斷線時強制發送不會進行斷線後重送
     */
    public unique(cmd: NetCmd, buff: NetBuff, done: NetObj, hint: boolean = false, force: boolean = false): boolean {
        for (const elm of this._requests) {
            if (elm.cmd == cmd) {
                console.warn(`net node unique failed, cmd=${cmd}`);
                return false;
            }
        }

        return this.request(cmd, buff, done, hint, force);
    }

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 斷線原因
     */
    public close(code?: number, reason?: string): void {
        console.warn(`net node proactive disconn, code=${code}, res=${reason}`);

        this.clearTimers();
        this.clearRPC();

        this._socket.message = null;
        this._socket.connected = null;
        this._socket.error = null;
        this._socket.closed = null;

        this._readied = false;
        this._state = NetState.Closed;

        this._requests = [];

        this._hint?.onConn(false);
        this._hint?.onReconn(false);
        this._hint?.onReq(false);
    }

    /**
     * 重連成功後處理
     */
    private afterReconn(): void {
        this._hint?.onConn(false);
        this._hint?.onReconn(false);
        this._hint?.onReq(false);

        // 重送訊息
        console.log(`net node start resend`);
        this._requests.forEach(elm => elm.buff && this._socket.send(elm.buff), this);
    }

    /**
     * 收訊
     * @param buff 
     */
    private onMsg(buff: NetBuff): void {
        if (!this._handler.isLegal(buff)) {
            console.warn(`net node rcv legal`, buff);
            return;
        }

        this.resetDisconn();
        this.resetBeat();

        let cmd = this._handler.getCmd(buff);

        // 刪除對應請求
        for (const idx in this._requests) {
            let elm = this._requests[idx];

            if (elm.cmd == cmd) {
                elm.done.event.call(elm.done.target, cmd, buff);
                this._requests.splice(Number(idx), 1);

                break;
            }
        }

        this._hint?.onReq(this._requests.length > 0);

        // 監聽回調
        this._listeners.get(cmd)?.forEach(elm => elm.event.call(elm.target, cmd, buff));
    }

    /**
     * 連線成功
     * @param event 
     */
    private onConn(event: any): void {
        console.log(`net node conn succeed, addr=${this._connOpt.addr}`);

        this.clearTimers();

        this._reconn = this._connOpt.reconn;
        this._state = NetState.Resending;

        // 重連後處理
        this.afterReconn();

        this._state = NetState.Connected;
    }

    /**
     * 發送錯誤
     * @param event 
     */
    private onErr(event: any): void {
        console.error(`net node err, res=${event}`);
    }

    /**
     * 連線中斷
     * @param event 
     */
    private onClose(event: any): void {
        // 重連中
        if (this._reconnTimer != -1) {
            return;
        }

        this.clearTimers();

        // 重連次數用完
        if (this._reconn <= 0) {
            console.warn(`close net node`, event);
            this._state = NetState.Closed;

            return;
        }

        this._hint?.onReconn(true);

        // 實作重連
        this._reconnTimer = window.setTimeout(() => {
            this._state = NetState.Closed;

            if (this._reconn <= 0) {
                console.warn(`net node runout of reconn`)
                this.clearTimers();

                return;
            }

            console.log(`start net node reconn, addr=${this._connOpt.addr}, count=${this._reconn}`)

            this._socket.close();
            this.connect(this._connOpt);

            this._reconn--;
        }, 5 * 1000);
    }

    /**
     * 註冊rpc
     * @param cmd 協議編號
     * @param event 回調事件
     * @param target 觸發對象
     */
    public registerRPC(cmd: NetCmd, event: NetEvent, target?: any): void {
        if (!this._listeners.has(cmd)) {
            this._listeners.set(cmd, []);
        }

        this._listeners.get(cmd).push({ target: target, event: event });
    }

    /**
     * 清除rpc
     */
    private clearRPC(): void {
        this._listeners.forEach(elm => elm = []);
        this._listeners.clear();
    }

    /**
     * 重設心跳計時
     */
    private resetBeat(): void {
        window.clearTimeout(this._beatTimer);

        this._beatTimer = window.setTimeout(() => {
            let { cmd, buff } = this._handler.getBeat();
            this.send(cmd, buff);
        }, 30 * 1000);
    }

    /**
     * 重設斷線計時
     */
    private resetDisconn(): void {
        window.clearInterval(this._disconnTimer)
        this._disconnTimer = window.setTimeout(() => this._socket.close(), 60 * 1000); 
    }

    /**
     * 清空所有計時器
     */
    private clearTimers(): void {
        window.clearTimeout(this._beatTimer);
        window.clearTimeout(this._disconnTimer);
        window.clearTimeout(this._reconn);
    }
}
