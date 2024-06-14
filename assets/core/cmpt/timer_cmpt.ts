import { _decorator, Component, Node, SceneAsset } from 'cc';
import { SingleMgr, Singleton } from '../util/singleton';
import { EventMgr } from '../event/event-mgr';
import { EventConf } from '../../conf/event-conf';

const { ccclass, property, menu, disallowMultiple, executionOrder } = _decorator;

/**
 * 全局唯一計時器
 */
@ccclass
@menu(`timer`)
@disallowMultiple
@executionOrder(-1000)
export class TimerCmpt extends Component implements Singleton {
    // 實例
    private static _inst: TimerCmpt = null;
    public static get inst(): TimerCmpt { return this._inst; }

    // 當前時間縮放
    private _currScale: number = 1;
    public static get currScale(): number { return TimerCmpt.inst ? TimerCmpt.inst._currScale : 1; }

    // 最後時間縮放
    private _lastScale: number = 1;

    // 暫停次數
    private _pauseCount: number = 0;

    // 是否暫停中
    public get paused(): boolean { return this._pauseCount > 0; }

    // 啟動至今的秒數
    private _gameSec: number = 0;
    public get gameSec(): number { return this._gameSec; }

    // 固定更新
    private _fixed: Function[] = [];

    // 變動更新
    private _bounces: Function[] = [];

    /**
     * 
     */
    constructor() {
        super();
        TimerCmpt._inst = this;
    }

    /**
     * 
     * @param dt 
     */
    protected update(dt: number): void {
        if (TimerCmpt.inst === this) {
            // 更新遊戲進行秒數
            this._gameSec += dt;

            // 固定更新
            this._fixed.forEach(func => func(dt));

            // 變動更新
            if (!this.paused) {
                let temp = dt * this._currScale;
                this._bounces.forEach(func => func(temp));
            }
        }
    }

    /**
     * 清除
     */
    public clear(): void {
        this._pauseCount = 0;
        this._currScale = 1;
        this._lastScale = 1;

        this.setScale(1);
    }

    /**
     * 加入固定更新
     * @param update 更新回調
     * @summary 不可操作delta time快慢
     */
    public addFixed(update: Function): void {
        this._fixed.push(update);
    }

    /**
     * 加入彈性更新
     * @param update 更新回調
     * @summary 可操作delta time快慢
     */
    public addBounce(update: Function): void {
        this._bounces.push(update);
    }

    /**
     * 設定時間縮放
     * @param value 0~1
     */
    public setScale(value: number): void {
        // 暫停中禁止更新
        if (!this.paused) {
            value = value.limit(0, 1);

            if (value != this._currScale) {
                this._lastScale = this._currScale;
                this._currScale = value;

                // 全局事件觸發
                SingleMgr.get(EventMgr).emit(EventConf.Scale, value);
            }
        }
    }

    /**
     * 暫停
     */
    public pause(): void {
        if (this._pauseCount === 0) {
            this.setScale(0);
        }

        this._pauseCount++;
    }

    /**
     * 恢復
     * @summary 幾次暫停就要幾次恢復才會恢復更新
     */
    public resume(): void {
        if (this._pauseCount > 0) {
            this._pauseCount--;
            this._pauseCount === 0 && this.setScale(this._lastScale);
        }
    }
}
