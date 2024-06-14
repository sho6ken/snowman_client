import { _decorator, Component, Node, ParticleSystem, ParticleSystem2D, sp, Animation, CCBoolean } from 'cc';
import { SPINE_TRACK } from './spine_cmpt';

const { ccclass, property } = _decorator;

/**
 * 特效重播
 */
@ccclass
export class ReplayFX extends Component {
    // 重整
    @property(CCBoolean)
    public get refresh(): boolean { return false; }
    public set refresh(value: boolean) { this.research(); }

    // 3d粒子, 執行時如果報warn, 是因為`項目設置/功能剪裁/3D粒子系統`為關閉, 簡單說就是實作專案沒必要使用到3d粒子
    @property([ParticleSystem])
    public p3d: ParticleSystem[] = [];

    // 2d粒子
    @property([ParticleSystem2D])
    public p2d: ParticleSystem2D[] = [];

    // spine
    @property([sp.Skeleton])
    public spines: sp.Skeleton[] = [];

    // animation
    @property([Animation])
    public anim: Animation[] = [];

    /**
     * 清空容器
     */
    private clear(): void {
        this.p3d = [];
        this.p2d = [];
        this.spines = [];
        this.anim = [];
    }

    /**
     * 重新搜尋目標
     */
    private research(): void {
        this.clear();

        // 通用搜尋
        let search = function<T extends Component>(type: T): T[] {
            return this.getComponentsInChildren(type).filter(cmpt => cmpt.enabled);
        }.bind(this);

        // 可在各自搜尋後再加入客製化條件
        this.p3d = search(ParticleSystem);
        this.p2d = search(ParticleSystem2D);
        this.spines = search(sp.Skeleton);
        this.anim = search(Animation);
    }

    /**
     * 播放
     * @summary this.node.active會設定成true
     */
    public play(): void {
        this.stop();

        this.p3d.forEach(elm => elm.play());
        this.p2d.forEach(elm => elm.resetSystem());
        this.anim.forEach(elm => elm.play());

        this.spines.forEach(elm => {
            elm.setAnimation(SPINE_TRACK, elm.animation, elm.loop);
            elm.node.active = true;
        });

        this.node.active = true;
    }

    /**
     * 停止
     * @summary this.node.active會設定成false
     */
    public stop(): void {
        this.node.active = false;

        this.p3d.forEach(elm => elm.stop());
        this.p2d.forEach(elm => elm.stopSystem());
        this.spines.forEach(elm => elm.node.active = false);
        this.anim.forEach(elm => elm.stop());
    }
}
