/**
 * 數據型態
 */
export type NetBuff = string | ArrayBufferLike | Blob | ArrayBufferView;

/**
 * 協定編號
 */
export type NetCmd = string;

/**
 * 協議事件
 */
export type NetEvent = (cmd: NetCmd, buff: NetBuff) => void;

/**
 * 連線物件
 */
export interface NetObj {
    // 調用對象
    target: any;

    // 觸發事件
    event: NetEvent;
}

/**
 * 協議請求
 */
export interface NetReq {
    // 編號
    cmd: NetCmd;

    // 數據
    buff: NetBuff;

    // 完成回調
    done: NetObj;
}

/**
 * 數據處理
 */
export interface NetHandler {
    /**
     * 數據是否合法
     * @param buff 
     */
    isLegal(buff: NetBuff): boolean;

    /**
     * 取得心跳包
     */
    getBeat(): { cmd: NetCmd, buff: NetBuff };
}

/**
 * 連線參數
 */
export interface NetConnOpt {
    // 連線位置
    addr: string;

    // 重連次數
    reconn: number;
}

/**
 * socket介面
 */
export interface NetSocket {
    // 收訊
    message: (buff: NetBuff) => void;

    // 連線成功
    connected: (event: any) => void;

    // 錯誤
    error: (event: any) => void;

    // 斷線
    closed: (event: any) => void;

    /**
     * 連線
     * @param opt 參數
     */
    connect(opt: NetConnOpt): boolean;

    /**
     * 送訊
     * @param buff 數據
     */
    send(buff: NetBuff): boolean;

    /**
     * 主動斷線
     * @param code 錯誤碼
     * @param reason 錯誤原因
     */
    close(code?: number, reason?: string): void;
}

/**
 * 連線狀態
 */
export enum NetState {
    Closed,      // 斷線
    Connecting,  // 連線中
    Connected,   // 已連線
    Resending,   // 重送訊息中
}

/**
 * 連線提示
 * @summary 介面接口
 */
export interface NetHint {
    /**
     * 連線中
     * @param value 
     */
    onConn(value: boolean): void;

    /**
     * 重連中
     * @param value 
     */
    onReconn(value: boolean): void;

    /**
     * 請求中
     * @param value 
     */
    onReq(value: boolean): void;
}
