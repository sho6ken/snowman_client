import { Asset, AssetManager, assetManager, resources } from "cc";

/**
 * 本地加載
 */
export class LocalLoader {
    /**
     * 加載
     * @param type 資源總類
     * @param path 加載路徑
     * @param bundle 包名
     */
    public static async load<T extends Asset>(type: typeof Asset, path: string, bundle?: string): Promise<T> {
        return new Promise((resolve, reject) => {
            let loader = bundle ? assetManager.getBundle(bundle) : resources;

            if (!loader) {
                console.error(`local load failed, bundle=${bundle}`);
                return;
            }

            loader.load(path, type, (err, asset) => {
                if (err) {
                    console.error(`local load failed, path=${path}, bundle=${bundle}`);
                    reject(err);
                }

                resolve(<T>asset);
            });
        });
    }
}

/**
 * bundle加載
 */
export class BundleLoader {
    /**
     * 加載
     * @param name 包名
     */
    public static async load(name: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(name, (err, bundle) => {
                if (err) {
                    console.error(`bundle load failed, bundle=${name}`);
                    reject(err);
                }

                resolve(bundle);
            });
        });
    }
}

/**
 * 資料夾加載
 */
export class FolderLoader {
    /**
     * 加載
     * @param type 資源總類
     * @param path 加載路徑
     * @param bundle 包名
     */
    public static async load<T extends Asset>(type: typeof Asset, path: string, bundle?: string): Promise<{ path: string, asset: T }[]> {
        return new Promise((resolve, reject) => {
            let loader = bundle ? assetManager.getBundle(bundle) : resources;

            if (!loader) {
                console.error(`folder assets load failed, bundle=${bundle}`);
                return;
            }

            loader.loadDir(path, type, (err, assets) => {
                if (err) {
                    console.error(`folder assets load failed, path=${path}, bundle=${bundle}`);
                    reject(err);
                }

                let infos = loader.getDirWithPath(path, type);
                let res = [];

                assets.forEach((asset, idx) => {
                    res.push({ path: infos[idx].path, asset: <T>asset });
                });

                return res;
            });
        });
    }
}
