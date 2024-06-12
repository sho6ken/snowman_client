import { Singleton } from "../util/singleton";
import { NetNode } from "./net_node";
import { NetBuff, NetCmd, NetConnOpt, NetObj } from "./network";

/**
 * 連線管理
 */
export class NetMgr implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 不做釋放
    public get keep(): boolean { return true; }

    // 頻道
    private _channels: Map<number, NetNode> = new Map();

    /**
     * 釋放
     */
    public free(): void {
        Array.from(this._channels.keys()).forEach(id => this.remove(id), this);
        this._channels.clear();
    }

    /**
     * 新增連線
     * @param node 
     * @param id 頻道編號
     */
    public add(node: NetNode, id: number = 0): boolean {
        if (this._channels.has(id)) {
            console.error(`net mgr add channel failed, id=${id}, res=id repeat`);
            return false;
        }

        console.log(`net mgr add channel succeed, id=${id}`);
        this._channels.set(id, node);

        return true;
    }

    /**
     * 移除連線
     * @param id 頻道編號
     */
    public remove(id: number = 0): boolean {
        if (this._channels.has(id) == false) {
            console.warn(`net mgr remove channel failed, id=${id}, res=id not found`);
            return false;
        }

        let elm = this._channels.get(id);
        elm = null;

        this._channels.delete(id);
        console.log(`net node remove channel succeed, id=${id}`);

        return true;
    }

    /**
     * 開始連線
     * @param opt 連線參數
     * @param id 頻道編號
     */
    public connect(opt: NetConnOpt, id: number = 0): boolean {
        let elm = this._channels.get(id);

        if (elm == null) {
            console.error(`net mgr conn failed, id=${id}, res=id not found`);
            return false;
        }

        return elm.connect(opt);
    }

    /**
     * 發送訊息
     * @param cmd 協議編號
     * @param buff 數據
     * @param force 強制發送
     * @param id 頻道編號
     * @summary 當斷線時強制發送不會進行斷線後重送
     */
    public send(cmd: NetCmd, buff: NetBuff, force: boolean = false, id: number = 0): boolean {
        let elm = this._channels.get(id);

        if (elm == null) {
            console.error(`net mgr send failed, id=${id}, res=id not found`);
            return false;
        }

        return elm.send(cmd, buff, force);
    }

    /**
     * 發送請求
     * @param cmd 協議編號
     * @param buff 數據
     * @param done 完成回調
     * @param hint 是否顯示介面提示
     * @param force 強制發送
     * @param id 頻道編號
     * @summary 當斷線時強制發送不會進行斷線後重送
     */
    public request(cmd: NetCmd, buff: NetBuff, done: NetObj, hint: boolean = false, force: boolean = false, id: number = 0): boolean {
        let elm = this._channels.get(id);

        if (elm == null) {
            console.error(`net mgr request failed, id=${id}, res=id not found`);
            return false;
        }

        return elm.request(cmd, buff, done, force);
    }

    /**
     * 發送請求
     * @param cmd 協議編號
     * @param buff 數據
     * @param done 完成回調
     * @param hint 是否顯示介面提示
     * @param force 強制發送
     * @param id 頻道編號
     * @summary 當斷線時強制發送不會進行斷線後重送
     */
    public unique(cmd: NetCmd, buff: NetBuff, done: NetObj, hint: boolean = false, force: boolean = false, id: number = 0): boolean {
        let elm = this._channels.get(id);

        if (elm == null) {
            console.error(`net mgr unique failed, id=${id}, res=id not found`);
            return false;
        }

        return elm.unique(cmd, buff, done, force);
    }
}
