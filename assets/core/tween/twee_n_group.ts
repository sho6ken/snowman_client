import { TimerCmpt } from "../cmpt/timer_cmpt";
import { SingleMgr, Singleton } from "../util/singleton";
import { TweeN } from "./twee_n";

/**
 * 緩動群組
 */
export class TweeNGroup {
    // 工作中緩動
    private _working: { [id: number]: TweeN } = {};

    // 等待加入工作的緩動
    private _rookies: { [id: number]: TweeN } = {};

    /**
     * 新增
     * @param tween 
     */
    public add(tween: TweeN): void {
        let id = tween.id;
        this._working[id] = tween;
        this._rookies[id] = tween;
    }

    /**
     * 取得
     * @param id 編號, 不傳代表取得全部工作中的緩動
     */
    public get(id?: number): TweeN[] {
        let list = this._working;
        return id ? [list[id]] : Object.keys(list).map(id => { return list[id]; });
    } 

    /**
     * 移除
     * @param ref 緩動或是編號
     */
    public remove(ref: TweeN | number): void {
        let id = ref instanceof TweeN ? ref.id : ref;
        this._working[id] = null;
        this._rookies[id] = null;
    }

    /**
     * 移除全部
     */
    public removeAll(): void {
        Object.keys(this._working).forEach(id => this.remove(Number(id)), this);
        this._working = {};
        this._rookies = {};
    }

    /**
     * 更新
     * @param dt 
     */
    public update(dt: number): void {
        let keys = Object.keys(this._working);
        let len = keys.length;

        while (len > 0) {
            this._rookies = {};

            for (let i = 0; i < len; i++) {
                let id = keys[i];
                let tween = this._working[id];

                // 已完畢
                if (tween && tween.update(dt)) {
                    this._working[id] = null;
                }
            }

            // 處理過程中新加入的緩動
            keys = Object.keys(this._rookies);
            len = keys.length;
        }
    }
}

/**
 * 固定速度緩動
 */
export class FixedTweeN extends TweeNGroup implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 初始化
     */
    public init(): void {
        SingleMgr.get(TimerCmpt).addFixed(this.update);
    }
}

/**
 * 變動速度緩動
 */
export class BounceTweeN extends TweeNGroup implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 初始化
     */
    public init(): void {
        SingleMgr.get(TimerCmpt).addBounce(this.update);
    }
}
