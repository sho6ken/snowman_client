/**
 * 分幀處理
 * @summary 解決單次大量處理造成的畫面卡頓
 */
export abstract class Framing {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 操作間隔
    protected _interval: number = 300;

    /**
     * 執行
     * @param count 執行次數
     */
    public async execute(count: number): Promise<void> {
        let tag = `${this.name} framing total time`;
        console.time(tag);

        this.doExecute(this.generator(count));

        console.timeEnd(tag);
    }

    /**
     * 實作分幀處理
     * @param generator 生成器
     */
    private async doExecute(generator: Generator): Promise<void> {
        return new Promise(resolve => {
            // 處理
            const func = function(): void {
                let start = Date.now();

                for (let iter = generator.next(); ; iter = generator.next()) {
                    if (iter === null || iter.done) {
                        resolve();
                        return;
                    }

                    // 逾時等下幀再檢查是否完畢
                    if (Date.now() - start >= this._interval) {
                        this.scheduleOnce(() => func());
                    }
                }
            }.bind(this);

            // 開始
            func();
        });
    }

    /**
     * 生成器
     * @param count 執行次數
     * @summary es6協程處理, 函式前要加*做為與一般函式的分別
     */
    private *generator(count: number): Generator {
        for (let i = 0; i < count; i++) {
            let tag = `${this.name} frame=${i} spend time`;
            console.time(tag);

            yield this.business(i);

            console.timeEnd(tag);
        }
    }

    /**
     * 實際業務邏輯
     * @param curr 當前執行到第幾次
     */
    protected abstract business(curr: number): void;
}
