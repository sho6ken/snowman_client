import { AssetMgr } from "../comm/asset/asset-mgr";
import { Node, Prefab, instantiate } from "cc";
import { SingleMgr } from "../comm/util/singleton";

/**
 * prefab種類
 */
export enum PrefabType{
    None = `路徑`,  // 無
}

/**
 * 設定參數
 */
const setting = {
    // 常駐不釋放
    HOLD: false,

    // 包體名稱
    BUNDLE: `prefab`,
};

/**
 * 取得prefab
 * @param type prefab種類
 */
export const getPrefab = async function(type: PrefabType): Promise<Prefab> {
    return await SingleMgr.get(AssetMgr).loadLocal(Prefab, type, setting.HOLD, setting.BUNDLE);
}

/**
 * 生成prefab
 * @param type prefab種類 
 */
export const genPrefab = async function(type: PrefabType): Promise<Node> {
    return instantiate(await getPrefab(type));
}
