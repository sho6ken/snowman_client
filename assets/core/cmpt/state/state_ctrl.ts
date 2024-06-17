import { _decorator, Component, Node } from 'cc';
import { StateCmpt } from './state_cmpt';

const { ccclass, property } = _decorator;

/**
 * 狀態改變事件
 * @param last 舊狀態
 * @param next 新狀態
 */
export type StateEvent = (last: StateCmpt, next: StateCmpt) => void;

/**
 * 狀態機控制
 */
@ccclass
export class StateCtrl extends Component {
    // 狀態列表
    private _states: Map<number, StateCmpt> = new Map();

    // 當前狀態
    private _curr: StateCmpt = null;
    public get curr(): StateCmpt { return this._curr; }

    // 事件列表
    private _events: StateEvent[] = [];

    /**
     * 初始化
     * @param params 
     * @summary 抓取所有子物件中帶有狀態機組件的對象
     */
    public init(...params: any[]): void {
        this.getComponentsInChildren(typeof StateCmpt).forEach(elm => {
            let state = <StateCmpt>elm;
            let id = state.id;

            if (this._states.has(id)) {
                console.warn(`add state ctrl repeat, id=${id}, state=${state.name}`);
                return;
            }

            this._states.set(id, state);
            state.init(this, ...params);
        }, this);
    }

    /**
     * 
     * @param dt 
     */
    protected update(dt: number): void {
        this.curr?.onDraw(dt);
    }

    /**
     * 變更狀態
     * @param id 狀態編號
     * @param params 
     */
    public async change(id: number, ...params: any[]): Promise<void> {
        if (!this._states.has(id)) {
            console.warn(`state not found, id=${id}`);
            return;
        }

        if (this.curr != null && this.curr.id == id) {
            console.warn(`change state failed, id=${id}, res=the same id`);
            return;
        }

        let last = this._curr;
        let next = this._states.get(id);
        this._curr = next;

        // 新狀態開始
        await next?.onBegin(...params);

        // 舊狀態結束
        last?.onEnd();

        // 觸發事件
        this._events.forEach(event => event(last, next));
    }

    /**
     * 註冊狀態改變事件
     * @param event 
     */
    public register(event: StateEvent): void {
        this._events.push(event);
    }
}
