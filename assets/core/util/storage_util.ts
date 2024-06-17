import { sys } from "cc";

/**
 * 本地存儲
 */
export class StorageUtil {
    /**
     * 清空本地存檔
     */
    public static rmrf(): void {
        sys.localStorage.clear();
    }

    /**
     * 刪除
     * @param key 
     */
    public static delete(key: string): void {
        if (!key) {
            console.warn(`storage del key is null`);
            return
        }

        sys.localStorage.removeItem(key);
    }

    /**
     * 存檔
     * @param key 
     * @param value 
     */
    public static save(key: string, value: any): void {
        if (!key) {
            console.warn(`storage save key is null`);
            return;
        }

        // 無值則刪除此鍵
        if (!value) {
            this.delete(key);
            return;
        }

        if (typeof value === `function`) {
            return;
        }
        else if (typeof value === `object`) {
            try {
                value = JSON.stringify(value);
            }
            catch (e) {
                console.warn(`storage save trans to json failed, key=${key}, value=${value}`);
                return;
            }
        }
        
        sys.localStorage.setItem(key, value);
    }

    /**
     * 讀檔
     * @param key 
     * @param def 預設值
     */
    private static load(key: string, def: any): any {
        if (!key) {
            console.warn(`storage load key is null`);
            return def;
        }

        let res = sys.localStorage.getItem(key);

        return res ? res : def;
    }

    /**
     * 取數值
     * @param key 
     * @param def 預設值
     */
    public static getNumber(key: string, def: number = 0): number {
        return Number(this.load(key, def));
    }

    /**
     * 取布林
     * @param key 
     * @param def 預設值
     */
    public static getBool(key: string, def: boolean = false): boolean {
        return Boolean(this.load(key, def));
    }

    /**
     * 取字串
     * @param key 
     * @param def 預設值
     */
    public static getStr(key: string, def: string = ``): string {
        return String(this.load(key, def));
    }

    /**
     * 取json
     * @param key 
     * @param def 預設值
     */
    public static getJson(key: string, def: object = {}): any {
        return JSON.parse(this.load(key, def));
    }
}
