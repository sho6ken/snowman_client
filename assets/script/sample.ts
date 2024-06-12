import { _decorator, Component, Label } from 'cc';
import { SingleMgr } from '../core/util/singleton';
import { NetBuff, NetCmd, NetHandler } from '../core/net/network';
import { NetNode } from '../core/net/net_node';
import { WSocket } from '../core/net/web_socket';
import { NetMgr } from '../core/net/net_mgr';

const { ccclass, property } = _decorator;

/**
 * 數據處理
 */
export class SampleHandler implements NetHandler {
    /**
     * 數據是否合法
     * @param buff 
     */
    public isLegal(buff: NetBuff): boolean {
        return true;
    }

    /**
     * 取得心跳包
     */
    public getBeat(): { cmd: NetCmd, buff: NetBuff } {
        return null;
    }
}

/**
 * 範例
 */
@ccclass
export class Sample extends Component {
    // 顯示收到的訊息
    @property(Label)
    private label: Label = null;

    // 計數器
    private _count: number = 0;

    /**
     * 
     */
    protected onLoad(): void {
        // 連線節點
        let node = new NetNode();
        node.init(new WSocket(), new SampleHandler());

        // 加入管理
        SingleMgr.get(NetMgr).add(node);

        // 註冊協議
        node.registerRPC("sample_echo", (cmd, buff) => {
            this.label.string = `rcv protocol, buff=${buff}`;
        }, this);
    }

    /**
     * 
     */
    protected start(): void {
        // 連線
        if (!SingleMgr.get(NetMgr).connect({ addr: "ws://localhost:55688/ws?uid=player", reconn: 0 })) {
            console.error(`sample conn failed`);
        }
    }

    /**
     * 
     */
    protected onDestroy(): void {
        // 釋放單例
        SingleMgr.freeAll(); 
    }

    /**
     * 
     * @param event 
     * @param data 
     */
    private onBtnClick(event: Event, data: any): void {
        // 發送訊息
        SingleMgr.get(NetMgr).send("sample_echo", `say hello to my little friend, count=${this._count}`);
        this._count++;
    }
}
