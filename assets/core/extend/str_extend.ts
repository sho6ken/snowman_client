/**
 * 字串擴充
 */
interface String {
    /**
     * 格式化
     * @param params 
     * @example `{0}-{1}.format(`a`, 9) -> a-9`
     */
    format(...params: (string | number)[]): string;

    /**
     * 全部取代
     * @param passive 被取代的字段
     * @param active 取代成的字段
     */
    exchange(passive: string, active: string): string;
}

/**
 * 格式化
 */
String.prototype.format = function(this: string, ...params: (string | number)[]): string {
    return this.replace(/\{(\d+)\}/g, (src, idx) => params[idx as string]);
}

/**
 * 全部取代
 */
String.prototype.exchange = function(this: string, passive: string, active: string): string {
    return this.replace(new RegExp(passive, `gm`), active);
}
