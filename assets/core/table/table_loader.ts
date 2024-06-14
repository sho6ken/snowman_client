import { JsonAsset } from "cc";
import { AssetMgr } from "../asset/asset_mgr";
import { SingleMgr } from "../util/singleton";
import { TableData } from "./table_data";

/**
 * 資料表加載
 */
export class TableLoader {
    /**
     * 執行加載
     * @param tables 需加載的表格
     * @param progress 加載進度
     */
    public static async load(tables: TableData<any>[], progress: Function): Promise<void> {
        let len = tables.length;
        let count = 0;

        progress(count, len);

        return new Promise(async resolve => {
            let tag = `start load data tables, size=${len}`;
            console.time(tag);

            // 將數據注入各表
            for (let i = 0; i < len; i++) {
                let table = tables[i];
                let asset = await SingleMgr.get(AssetMgr).loadLocal(JsonAsset, table.path, true, table.bundle);
                table.init(asset.json);

                progress(++count, len);
            }

            console.timeEnd(tag);

            resolve();
        });
    }
}
