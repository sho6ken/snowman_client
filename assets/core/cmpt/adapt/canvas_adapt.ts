import { _decorator, Canvas, Component, Node, ResolutionPolicy, view } from 'cc';
import { SingleMgr } from '../../util/singleton';
import { EventMgr } from '../../event/event-mgr';
import { EventConf } from '../../../conf/event-conf';

const { ccclass, property, menu, requireComponent, disallowMultiple } = _decorator;

/**
 * canvas適配
 * @summary canvas使用定寬高, 方便其他適配元件計算變化
 */
@ccclass
@menu(`adapt/canvas`)
@requireComponent(Canvas)
@disallowMultiple
export class CanvasAdapt extends Component {
    /**
     * 
     */
    protected onLoad(): void {
        view.setResolutionPolicy(ResolutionPolicy.SHOW_ALL);
        view.on(`canvas-resize`, () => SingleMgr.get(EventMgr).emit(EventConf.Resize) );
    }
}
