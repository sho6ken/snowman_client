import { Asset, AssetManager, assetManager } from "cc";
import { Singleton } from "../util/singleton";
import { BundleLoader, FolderLoader, LocalLoader } from "./asset_loader";

/**
 * 資源數據
 */
export interface AssetData {
    // 資源
    asset: Asset;

    // 常駐不釋放
    hold?: boolean;

    // 釋放時間
    expire?: number;
}

/**
 * 資源管理
 */
export class AssetMgr implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 已加載bundle
    private _bundles: Map<string, AssetManager.Bundle> = new Map();

    // 使用中資源
    private _assets: Map<string, AssetData> = new Map();

    // 現在時間
    private get _now(): number { return Date.now() / 1000; }

    // 逾期時間
    private get _expire(): number { return this._now + (5 * 60); }

    /**
     * 釋放
     */
    public free(): void {
        this._assets.forEach(data => data.asset = null);
        this._assets.clear();

        this._bundles.forEach(bundle => {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        });

        this._bundles.clear();
    }

    /**
     * 清除
     */
    public clear(): void {
        let jobs = [];

        this._assets.forEach((data, key) => {
            if (!data.hold && this._now >= data.expire) {
                data.asset = null;
                jobs.push(key);
            }
        });

        jobs.forEach(key => this._assets.delete(key), this);
    }

    /**
     * 打印資訊
     */
    public info(): void {
        console.group(this.name);
        console.table(this._bundles.keys());
        console.table(this._assets.keys());
        console.groupEnd();
    }

    /**
     * 新增資源
     * @param path 加載路徑
     * @param asset 資源
     * @param hold 常駐不釋放
     */
    private add<T extends Asset>(path: string, asset: T, hold: boolean): void {
        path && this._assets.set(path, { asset: asset, hold: hold, expire: hold ? null : this._expire });
    }

    /**
     * 本地加載
     * @param type 資源種類
     * @param path 加載路徑
     * @param hold 常駐不釋放
     * @param bundle 包名
     */
    public async loadLocal<T extends Asset>(type: { prototype: T }, path: string, hold: boolean = true, bundle?: string): Promise<T> {
        if (!this._assets.has(path)) {
            console.timeEnd(path);

            // 先佔位防止多次加載
            this.add(path, null, true);

            try {
                await this.loadBundle(bundle);
                this.add(path, await LocalLoader.load(<any>type, path, bundle), hold);
            }
            catch (err) {
                this._assets.delete(path);
            }

            console.timeEnd(path);
        }

        return await this.doLoadLocal(path) as T;
    }

    /**
     * 實作本地加載
     * @param path 加載路徑
     * @summary 處理重複加載問題
     */
    private async doLoadLocal(path: string): Promise<Asset> {
        return await new Promise((resolve, reject) => {
            let data = null;

            do {
                data = this._assets.get(path);

                // 鍵值因故被移除
                if (!data) {
                    reject();
                }
            }
            while (!data.asset)

            resolve(data.asset);
        });
    }

    /**
     * bundle加載
     * @param name 包名
     */
    private async loadBundle(name: string): Promise<void> {
        if (name && !this._bundles.has(name)) {
            console.time(name);
            this._bundles.set(name, await BundleLoader.load(name));
            console.timeEnd(name);
        }
    }

    /**
     * 資料夾加載
     * @param type 資源種類
     * @param path 加載路徑
     * @param hold 常駐不釋放
     * @param bundle 包名
     */
    public async loadFolder<T extends Asset>(type: { prototype: T }, path: string, hold: boolean = true, bundle?: string): Promise<void> {
        console.time(path);

        await BundleLoader.load(bundle);

        let list = await FolderLoader.load(<any>type, path, bundle);
        list.forEach(elm => this.add(path, elm.asset, hold));

        console.timeEnd(path);
    }
}
