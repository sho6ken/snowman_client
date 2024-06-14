import { Singleton } from "../util/singleton";

/**
 * 資料表結構
 */
export interface TableStruct {
    // 編號
    id: number;

    // /**
    //  * 
    //  * @param data 單筆資料的json
    //  */
    // constructor(data: any) {
    //     this.id = data.id;
    //     // TODO: 實作類別決定如何填寫資料結構內容, 因為數值有時會需進行2次處理
    // }
}

/**
 * 資料表
 */
export abstract class TableData<T extends TableStruct> implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 加載路徑
    public abstract get path(): string;

    // 加載包名
    public abstract get bundle(): string;

    // 資料內容
    protected _data: Map<number, T> = new Map();

    /**
     * 初始化
     * @param data 整張表的json
     */
    public init(data: any): void {
        if (data) {
            let len = data.length;

            for (let i = 0; i < len; i++) {
                let id = data[i].id;

                if (this._data.has(id)) {
                    console.warn(`data table repeat, table=${this.name}, id=${id}`);
                    continue;
                }

                this._data.set(id, this.generate(data));
            }
        }
    }

    /**
     * 釋放
     */
    public free(): void {
        this._data.forEach(elm => elm = null);
        this._data.clear();
    }

    /**
     * 生成單筆資料內容
     * @param data 單筆資料的json
     */
    protected abstract generate(data: any): T /*{
        return new TableStruct(data);
    }*/

    /**
     * 取得單筆資料
     * @param id 
     */
    public get(id: number): T {
        return this._data.get(id);
    }

    /**
     * 打印資訊
     */
    public info(): void {
        console.group(this.name);
        console.table(this._data.values());
        console.groupEnd();
    }
}
