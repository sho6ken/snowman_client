import { LaneChain } from "./lane_chain";

/**
 * 雙向工作鏈
 * @summary 依執行成功或失敗來決定後續行為
 */
export abstract class ResChain extends LaneChain {
    // 成功
    private _succeed: LaneChain = null;

    // 失敗
    private _failed: LaneChain = null;

    /**
     * 棄用
     * @param chain 
     */
    public push(chain: LaneChain): LaneChain {
        return null;
    }

    /**
     * 棄用
     * @param chain 
     */
    public insert(chain: LaneChain): LaneChain {
        return null;
    }

    /**
     * 設定執行結果行為
     * @param succeed 成功
     * @param failed 失敗
     */
    public set(succeed: LaneChain, failed: LaneChain): void {
        this._succeed = succeed;
        this._failed = failed;
    }

    /**
     * 執行
     * @param params 
     * @returns 是否全鏈都正常執行完畢
     */
    public async execute(...params: any): Promise<boolean> {
        let res = await this.business(...params);
        let func = res ? this._succeed.execute : this._failed.execute;

        return func(...params);
    }
}
