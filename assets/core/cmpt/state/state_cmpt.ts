import { _decorator, Component, Node } from 'cc';
import { StateCtrl } from './state_ctrl';

const { ccclass, property } = _decorator;

/**
 * 狀態機基礎
 */
@ccclass
export abstract class StateCmpt extends Component {
    // 編號
    abstract get id(): number;

    // 所屬控制器
    protected _ctrl: StateCtrl = null;

    /**
     * 初始化
     * @param ctrl 控制器
     * @param params 初始化參數
     */
    init(ctrl: StateCtrl, ...params: any[]): void {
        this._ctrl = ctrl;
    }

    /**
     * 狀態更新
     * @param dt 
     * @summary 當前為此狀態時才會更新
     */
    abstract onDraw(dt: number): void;

    /**
     * 狀態開始
     * @param params 
     */
    abstract onBegin(...params: any[]): Promise<void>;

    /**
     * 狀態結束
     */
    abstract onEnd(): void;
}
