import { sp } from "cc";
import { AssetMgr } from "../comm/asset/asset-mgr";
import { SingleMgr } from "../comm/util/singleton";

/**
 * spine種類
 */
export enum SpineType{
    None = `路徑`,  // 無
}

/**
 * 設定參數
 */
const setting = {
    // 常駐不釋放
    HOLD: false,

    // 包體名稱
    BUNDLE: `spine`,
};

/**
 * 取得spine
 * @param type spine種類
 */
export const getSpine = async function(type: SpineType): Promise<sp.SkeletonData> {
    return await SingleMgr.get(AssetMgr).loadLocal(sp.SkeletonData, type, setting.HOLD, setting.BUNDLE);
}
