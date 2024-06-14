import { AssetMgr } from "../comm/asset/asset-mgr";
import { AudioClip } from "cc";
import { SingleMgr } from "../comm/util/singleton";

/**
 * audio種類
 */
export enum AudioType{
    None = `路徑`,  // 無
}

/**
 * 設定參數
 */
const setting = {
    // 常駐不釋放
    HOLD: false,

    // 包體名稱
    BUNDLE: `audio`,
};

/**
 * 取得audio
 * @param type audio種類
 */
export const getAudio = async function(type: AudioType): Promise<AudioClip> {
    return await SingleMgr.get(AssetMgr).loadLocal(AudioClip, type, setting.HOLD, setting.BUNDLE);
}
