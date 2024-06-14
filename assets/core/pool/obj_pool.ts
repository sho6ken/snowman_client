import { Node } from "cc";
import { Singleton } from "../util/singleton";

/**
 * 物件池
 */
export abstract class ObjPool<TK, TV> implements Singleton {
    // 名稱
    public abstract get name(): string;

    // 數據
    protected _data: Map<TK, TV[]> = new Map();

    /**
     * 釋放
     */
    public free(): void {
        this.clear();
    }

    /**
     * 清除
     * @param key 未傳代表全刪
     */
    public clear(key: TK = null): void {
        if (key) {
            let list = this._data.get(key);

            if (list) {
                for (let elm of list) {
                    (elm as Node)?.destroy();
                    elm = null;
                }

                list = [];
                this._data.delete(key);
            }
        }
        else {
            Array.from(this._data.keys()).forEach(key => this.clear(key), this);
            this._data.clear();
        }
    }

    /**
     * 容器數量
     * @param key 
     */
    public size(key: TK): number {
        return this._data.get(key)?.length ?? 0;
    }

    /**
     * 取得
     * @param key 
     */
    public get(key: TK): TV {
        return this._data.get(key)?.shift();
    }

    /**
     * 回收
     * @param key 
     * @param value 
     * @returns 回收成功
     */
    public put(key: TK, value: TV): boolean {
        if (key && value) {
            let list = this._data.get(key);

            if (list === null) {
                list = [];
                this._data.set(key, list);
            }
            // 重複回收
            else if (list.indexOf(value) !== -1) {
                console.warn(``);

                (value as Node)?.destroy();
                value = null;

                return false;
            }

            (value as Node)?.removeFromParent();
            list.push(value);

            return true;
        }

        return false;
    }

    /**
     * 打印資訊
     */
    public info(): void {
        console.group(this.name);

        this._data.forEach((list, key) => {
            console.log(`${this.name} pool, key=${key}, size=${this.size(key)}`);
        }, this);

        console.groupEnd();
    }
}
