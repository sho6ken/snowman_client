import { _decorator, Component, Node, sp } from 'cc';
import { eventClass, eventFunc } from '../event/event_decor';
import { TimerCmpt } from './timer_cmpt';
import { WaitUtil } from '../util/wait_util';
import { EventConf } from '../../conf/event_conf';

const { ccclass, property, menu } = _decorator;

/**
 * spine track
 */
export const SPINE_TRACK = 99;

/**
 * spine控件
 */
@ccclass
@menu(`spine`)
@eventClass()
export class SpineCmpt extends sp.Skeleton {
    /**
     * 
     */
    public onEnable(): void {
        super.onEnable();
        this.setTimeScale(TimerCmpt.currScale);
    }

    /**
     * 設定spine資料
     * @param data 
     */
    public setData(data: sp.SkeletonData): void {
        this.skeletonData = data;
    }

    /**
     * 調整播放倍率
     * @param value 
     */
    @eventFunc(EventConf.Scale)
    public setTimeScale(value: number): void {
        this.timeScale = value;
    }

    /**
     * 停止
     */
    public stop(): void {
        this.clearTrack(SPINE_TRACK);
        this.setToSetupPose();
        this.resume();
    }

    /**
     * 暫停
     */
    public pause(): void {
        this.paused = true;
    }

    /**
     * 恢復
     */
    public resume(): void {
        this.paused = false;
    }

    /**
     * 監聽動畫事件
     * @param entry 
     * @param act 事件回調 
     */
    private listen(entry: sp.spine.TrackEntry, act: Function): void {
        if (entry && act) {
            this.setTrackEventListener(entry, (entry, event) => {
                let key = event instanceof sp.spine.Event ? event.data.name : event.toString();
                act(key);
            });
        }
    }

    /**
     * 單次播放
     * @param anim 動畫名稱
     * @param event 事件回調
     */
    public async playOnce(anim: string = this.defaultAnimation, event?: (key: string) => void): Promise<void> {
        if (anim) {
            this.stop();

            let entry = this.setAnimation(SPINE_TRACK, anim, false);

            if (entry) {
                event && this.listen(entry, event);

                return new Promise(async resolve => {
                    await WaitUtil.forSec(entry.animation.duration, this);
                    resolve();
                });
            }
            else {
                console.warn(`spine play once failed, cmpt=${this.constructor.name}, anim=${anim}`);
            }
        }
    }

    /**
     * 循環播放
     * @param anim 動畫名稱
     * @param event 事件回調
     */
    public playLoop(anim: string = this.defaultAnimation, event?: (key: string) => void): void {
        if (anim) {
            this.stop();

            let entry = this.setAnimation(SPINE_TRACK, anim, true);

            if (entry) {
                event && this.listen(entry, event);
            }
            else {
                console.warn(`spine play loop failed, cmpt=${this.constructor.name}, anim=${anim}`);
            }
        }
    }

    /**
     * 步進播放
     * @param anim 
     * @param event 
     */
    public async playSteps(anim: string[], event?: (key: string) => void): Promise<void> {
        for (const elm of anim) {
            await this.playOnce(elm, event);
        }
    }

    /**
     * 將物件綁定骨骼
     * @param path 目標骨骼的路徑
     * @param node 物件
     * @summary 將物件設定成骨骼的子物件
     */
    public bind(path: string, node: Node): void {
        this.sockets.push(new sp.SpineSocket(path, node));
        this.sockets = this.sockets;  // 看起來怪怪的, 但官方範例就是這樣寫的
    }
}
