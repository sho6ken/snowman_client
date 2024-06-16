/**
 * 工作鏈
 */
export abstract class WorkChain {
    // 子鏈
    private _child: WorkChain = null;

    /**
     * 加入
     * @param chain 
     * @returns 被加入子鏈的母鏈
     * @summary 已有子鏈則向後搜尋至末端後加入
     */
    public push(chain: WorkChain): WorkChain {
        if (this._child) {
            return this._child.push(chain);
        }
        else {
            this._child = chain;
            return this;
        }
    }

    /**
     * 插入
     * @param chain 
     * @returns 原本的子鏈
     * @summary 斷開原本的母子鏈, 中間插入此鏈並接上
     */
    public insert(chain: WorkChain): WorkChain {
        chain._child = this._child;
        this._child = chain;

        return chain;
    }

    /**
     * 執行
     * @param params 
     * @returns 是否全鏈都正常執行完畢
     */
    public async execute(...params: any): Promise<boolean> {
        if (!await this.business(...params)) {
            return false;
        }

        return this._child ? await this._child.execute(...params) : true;
    }

    /**
     * 自身的業務
     * @param params 
     * @returns 是否繼續向後執行
     */
    protected abstract business(...params: any): Promise<boolean>;
}
