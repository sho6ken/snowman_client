import { _decorator, Component, Node, UITransform, view, Widget, screen, size } from 'cc';
import { eventFunc } from '../../event/event-decor';
import { EDITOR } from 'cc/env';
import { EventConf } from '../../../conf/event-conf';

const { ccclass, property, menu, requireComponent } = _decorator;

/**
 * widget適配
 * @summary 將widget寬高設與canvas相同
 */
@ccclass
@menu(`adapt/widget`)
@requireComponent(Widget)
@requireComponent(UITransform)
export class WidgetAdapt extends Component {
    //
    private _trans: UITransform = null;

    /**
     * 
     */
    protected onEnable(): void {
        this._trans = this.getComponent(UITransform);
        this._trans.setContentSize(view.getDesignResolutionSize());

        this.adjust();
    }

    /**
     * 校正範圍
     */
    @eventFunc(EventConf.Resize)
    private adjust(): void {
        if (this._trans) {
            let from = size(this._trans.width, this._trans.height);
            let ref = EDITOR ? view.getDesignResolutionSize() : screen.windowSize;

            let scale = Math.min(ref.width / from.width, ref.height / from.height);
            let to = size(from.width * scale, from.height * scale);

            let width = from.width * (ref.width / to.width);
            let height = from.height * (ref.height / to.height);

            this._trans.setContentSize(width, height);
        }
    }
}
