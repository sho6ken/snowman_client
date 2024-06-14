import { _decorator, Component, Node, UITransform, screen, size, Sprite, math } from 'cc';
import { eventFunc } from '../../event/event-decor';
import { EventConf } from '../../../conf/event-conf';

const { ccclass, property, menu, requireComponent } = _decorator;

/**
 * desktop適配
 * @summary 將圖片切出一塊區域後再縮放至與canvas同寬高
 */
@ccclass
@menu(`adapt/desktop`)
@requireComponent(Sprite)
@requireComponent(UITransform)
export class DesktopAdapt extends Component {
    //
    private _trans: UITransform = null;

    // 
    private _img: Sprite = null;

    /**
     * 
     */
    protected onEnable(): void {
        this._trans = this.getComponent(UITransform);
        this._img = this.getComponent(Sprite);

        this.adjust();
    }

    /**
     * 校正範圍
     */
    @eventFunc(EventConf.Resize)
    private adjust(): void {
        if (this._trans && this._img) {
            let from = size(this._trans.width, this._trans.height);
            let ref = screen.windowSize;

            let scale = Math.min(ref.width / from.width, ref.height / from.height);
            let to = size(from.width * scale, from.height * scale);

            let rate = Math.max(ref.width / to.width, ref.height / to.height);
            this.node.scale = math.v3(rate, rate, 1);
        }
    }
}
