import { EventConf } from "../../conf/event_conf";
import { SingleMgr } from "../util/singleton";
import { EventMgr, EventType } from "./event_mgr";

/**
 * 事件類別裝飾
 * @param on 調用此函式時註冊事件
 * @param off 調用此函式時註銷事件
 * @summary 使用函數同時進行註冊, 如果沒有需求的話可不使用
 * @summary 非cmpt使用需自定義函式名稱
 */
export function eventClass(on: string = `onEnable`, off: string = `onDisable`): Function {
    return function(self: any): void {
        if (on) {
            let func = self.prototype[on];

            // 替換原始函式
            self.prototype[on] = function(): void {
                EventMgr.register(this);
                func && func.call(this);
            }
        }
        else {
            console.warn(`event class=${self.name} on=${on} register failed`);
        }

        if (on && off) {
            let func = self.prototype[off];

            // 替換原始函式
            self.prototype[off] = function(): void {
                EventMgr.unregister(this);
                func && func.call(this);
            }
        }
        else if (!on) {
            console.warn(`event class=${self.name} off=${off} without register`);
        }
    }
}

/**
 * 事件函式裝飾
 * @param type 事件種類
 * @param once 單次觸發
 * @summary 監聽事件
 */
export function eventFunc(type: EventType, once: boolean = false): Function {
    return function(self: any, name: string, desc: PropertyDescriptor): void {
        let list = EventMgr.rec.get(self.constructor);

        if (!list) {
            list = [];
            EventMgr.rec.set(self.constructor, list);
        }

        list.push({ type: type, cb: name, once: once });
    }
}

/**
 * 事件變數裝飾
 * @param type 事件種類
 * @summary 修改變數會觸發事件
 * @summary 使用getter與setter取代原始變數
 */
export function eventVar(type: EventType): Function {
    return function(self: any, name: string): void {
        delete self[name];
        let field = `_${name}`;

        Object.defineProperty(self, field, {
            writable: true,
            enumerable: true,
            configurable: true,
        });

        const getter = function(this: any): any {
            return this[field];
        }

        const setter = function(this: any, value: any): void {
            let old = this[field];

            if (value !== old) {
                this[field] = value;

                let str = typeof type === `string` ? type : EventConf[type];
                SingleMgr.get(EventMgr).emit(str, value, old);
            }
        }

        Object.defineProperty(self, name, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    }
}
