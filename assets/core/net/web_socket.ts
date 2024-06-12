import { NetBuff, NetConnOpt, NetSocket } from "./network";

/**
 * ws連線
 */
export class WSocket implements NetSocket {
    // 收訊
    public message: (buff: NetBuff) => void = null;

    // 連線成功
    public connected: (event: any) => void = null;

    // 錯誤
    public error: (event: any) => void = null;

    // 斷線
    public closed: (event: any) => void = null;

    // socket
    private _socket: WebSocket = null;

    /**
     * 連線
     * @param opt 參數
     */
    public connect(opt: NetConnOpt): boolean {
        let addr = opt.addr;

        if (this._socket && this._socket.readyState == WebSocket.CONNECTING) {
            console.warn(`conn failed, type=ws, res=${addr} already connecting`)
            return false;
        }

        this._socket = new WebSocket(new URL(addr));
        this._socket.binaryType = "arraybuffer";

        this._socket.onmessage = (event) => this.message(event.data)
        this._socket.onopen = this.connected;
        this._socket.onerror = this.error;
        this._socket.onclose = this.closed;

        console.log(`start conn, type=ws, addr=${addr}`);
        
        return true;
    }

    /**
     * 送訊
     * @param buff 數據
     */
    public send(buff: NetBuff): boolean {
        if (this._socket == null || this._socket.readyState != WebSocket.OPEN) {
            console.error(`send failed, type=ws, res=conn not ready`);
            return false;
        }

        this._socket.send(buff);
        
        return true;
    }

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    public close(code?: number, reason?: string): void {
        console.log(`close ws, code=${code}, res=${reason}`)
        this._socket?.close(code, reason);
    }
}
