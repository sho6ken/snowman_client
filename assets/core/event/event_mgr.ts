import { EventConf } from "../../conf/event-conf";
import { SingleMgr, Singleton } from "../util/singleton";

/**
 * 事件種類
 */
export type EventType = string | EventConf;

/**
 * 事件管理
 */
export class EventMgr implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 類別事件紀錄
    public static rec: Map<Function, { type: EventType, cb: string, once: boolean }[]> = new Map();

    // 監聽註冊
    private static _register: Function = null;

    // 監聽註銷
    private static _unregister: Function = null;

    // 回調列表
    private _events: Map<EventType, Map<Object, { cb: Function, once: boolean }[]>> = new Map();

    /**
     * 註冊
     * @param src 目標類別
     */
    public static register(src: Object): void {
        this._register && this.rec.get(src.constructor).forEach(elm => {
            this._register(src, elm.type, src[elm.cb], elm.once);
        }, this);
    }

    /**
     * 註銷
     * @param src 目標類別
     */
    public static unregister(src: Object): void {
        this._unregister && this._unregister(src);
    }

    /**
     * 
     */
    constructor() {
        // 註冊
        EventMgr._register = this.add.bind(this);

        // 註銷
        EventMgr._unregister = function(obj: Object): void {
            this._events.forEach((map, type) => {
                map.get(obj).length = 0;
                map.delete(obj);
                map.size <= 0 && this._events.delete(type);
            }, this);
        }.bind(this);
    }

    /**
     * 釋放
     */
    public free(): void {
        EventMgr._register = null;
        EventMgr._unregister = null;

        this._events.forEach(map => {
            map.forEach(list => list = []);
            map.clear();
        });

        this._events.clear();

        EventMgr.rec.forEach(list => list = []);
        EventMgr.rec.clear();
    }

    /**
     * 加入回調列表
     * @param obj 目標類別
     * @param type 事件種類
     * @param cb 事件回調
     * @param once 是否只觸發單次
     */
    private add(obj: Object, type: EventType, cb: Function, once: boolean): void {
        let map = this._events.get(type);
        let list = [];

        if (map) {
            list = map.get(obj);

            if (!list) {
                list = [];
                map.set(obj, list);
            }
        }
        else {
            map = new Map();
            map.set(obj, list);
            this._events.set(type, map);
        }

        list.push({ cb: cb, once: once });
    }

    /**
     * 從回調列表中移除
     * @param obj 目標類別
     * @param type 事件種類
     * @param cb 事件回調
     */
    private remove(obj: Object, type: EventType, cb: Function): void {
        let map = this._events.get(type);
        let list = map?.get(obj);

        let idx = list?.findIndex(elm => { return elm.cb === cb }) ?? -1;
        idx !== -1 && list.splice(idx, 1);

        if (list && list.length > 0) {
            map.delete(obj);
            map.size <= 0 && this._events.delete(type);
        }
    }

    /**
     * 觸發事件
     * @param type 事件種類
     * @param params 
     */
    public emit(type: EventType, ...params: any[]): void {
        this.getEvents(type).forEach(elm => elm.cb.apply(elm.obj, params));
    }

    /**
     * 取得事件回調
     * @param type 事件種類
     */
    private getEvents(type: EventType): { obj: Object, cb: Function }[] {
        let map = this._events.get(type);

        if (!map) {
            return [];
        }

        let res = [];
        let wait = [];

        map.forEach((list, obj) => {
            list.forEach(elm => {
                // 回調
                let params = { obj: obj, cb: elm.cb };
                res.push(Object.assign({}, params));

                // 單次
                elm.once && wait.push(res.push(Object.assign({}, params)));
            });
        });

        // 刪除單次
        wait.forEach(elm => this.remove(elm.obj, type, elm.cb), this);

        return res;
    }

    /**
     * 資訊
     */
    public info(): void {
        console.group(this.name);

        this._events.forEach((map, type) => {
            console.group(type);
            
            map.forEach((list, obj) => {
                console.group(obj.constructor.name);
                console.table(list);
                console.groupEnd();
            });

            console.groupEnd();
        });

        console.groupEnd();
    }
}

/**
 * 讓事件管理在cocos之前啟動
 */
SingleMgr.get(EventMgr);
