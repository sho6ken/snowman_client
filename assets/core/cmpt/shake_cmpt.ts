import { _decorator, CCFloat, CCInteger, Component, math, Node, Tween, Vec3 } from 'cc';

const { ccclass, property, disallowMultiple, menu } = _decorator;

/**
 * 物件震動
 */
@ccclass
@disallowMultiple
@menu(`shake`)
export class ShakeCmpt extends Component {
    // 震動幅度
    @property(CCFloat)
    private power: number = 5;

    // 單次位移s
    @property(CCFloat)
    private time: number = 0.16;

    // 晃動複雜度
    @property({ type: CCInteger, min: 2 })
    private complex: number = 8;

    // tween
    private _tween: Tween<Node> = null;

    /**
     * 震動
     * @param count 震動次數
     */
    public async shake(count: number = 5): Promise<void> {
        // 震動中或參數錯誤
        if (this._tween || count <= 1 || this.power <= 0 || this.time <= 0) {
            return;
        }

        let list = this.range();

        // 至少要有2個點才能跳動
        if (list.length > 1) {
            return new Promise(resolve => {
                this._tween = new Tween(this.node);
    
                // -1是讓最後一動要回到原位
                for (let i = 0; i < count - 1; i++) {
                    this._tween.to(this.time, { position: list.rand() });
                }
    
                this._tween.to(this.time, { position: Vec3.ZERO });
                this._tween.call(() => resolve());
                this._tween.start();
            });
        }
    }

    /**
     * 取得震動範圍
     */
    private range(): Vec3[] {
        let res = [];

        for (let i = 1; i <= this.complex; i++) {
            let vec = math.v2(0, this.power).rotate(Math.PI / 4 * (i * 3));
            res.push(math.v3(vec.x, vec.y, 0));
        }

        return res;
    }
}
