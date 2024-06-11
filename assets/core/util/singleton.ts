/**
 * 單例介面
 */
export interface Singleton {
    // 名稱
    name: string;

    // 不做釋放
    keep?: boolean;

    /**
     * 初始化
     * @param param 
     */
    init?(...param: any[]): any

    /**
     * 釋放
     * @param param 
     */
    free?(...param: any[]): any

    /**
     * 清除
     * @param param 
     */
    clear?(...param: any[]): any
}

/**
 * 單例型別
 * @summary 限制傳參物件必須具備下列功能
 */
interface SingleType<T extends Singleton> {
    // 名稱
    name: string;

    // 實例, 指定在其他地方建立的實體, 用在cmpt的單例
    inst?: T;

    // 建構子
    new(): T;
}

/**
 * 單例管理
 */
export class SingleMgr implements Singleton {
    // 實例
    private static _inst: SingleMgr = null;
    public static get inst(): SingleMgr { return this._inst || (this._inst = new SingleMgr()); }

    // 名稱
    public get name(): string { return this.constructor.name; }

    // 不做釋放
    public get keep(): boolean { return true; }

    // 單例列表
    private _list: Map<string, Singleton> = new Map();

    /**
     * 取得單例
     * @param type 單例種類
     * @param isCreate 取不到實例時是否進行生成
     * @param params 建構時的建構子
     */
    public static get<T extends Singleton>(type: SingleType<T>, isCreate: boolean = true, ...params: any[]): T {
        let map = this.inst._list;
        let name = type.name;

        if (map.has(name)) {
            return <T>map.get(name);
        }
        else if (isCreate) {
            // 優先使用已建立實體
            let inst = type.inst ?? new type();
            map.set(name, inst);

            console.log(`singleton created, name=${name}`)
            inst.init && inst.init(...params);

            return inst;
        }

        return null;
    }

    /**
     * 釋放單一單例
     * @param type 單例種類
     */
    public static free<T extends Singleton>(type: SingleType<T>): void {
        this.doFree(type.name);
    }

    /**
     * 釋放全部單例
     */
    public static freeAll(): void {
        Array.from(this.inst._list.keys()).forEach(key => this.doFree(key), this);
    }

    /**
     * 實作釋放單例
     * @param key 
     */
    private static doFree(key: string): void {
        let map = this.inst._list;
        let inst = map.get(key);

        if (inst) {
            if (inst.keep) {
                inst.free && inst.free();
                inst = null;

                map.delete(key);

                console.log(`singleton free succeed, name=${key}`)
            }
            else {
                console.warn(`singleton do free failed, name=${key}`);
            }
        }
        else {
            console.warn(`singleton not found, name=${key}`);
        }
    }

    /**
     * 清除單一單例
     * @param type 單例種類
     */
    public static clear<T extends Singleton>(type: SingleType<T>): void {
        this.doClear(type.name);
    }

    /**
     * 清除全部單例
     */
    public static clearAll(): void {
        Array.from(this.inst._list.keys()).forEach(key => this.doClear(key), this);
    }

    /**
     * 實作清除
     * @param key 
     */
    private static doClear(key: string): void {
        let elm = this.inst._list.get(key);
        elm && elm.clear && elm.clear();
    }
}
