/**
 * 數字擴充
 */
interface Number {
    /**
     * 限制範圍
     * @param min 含
     * @param max 含
     * @returns 新值
     */
    limit(min: number, max: number): number;

    /**
     * 是否在兩值間
     * @param min 含
     * @param max 含
     */
    between(min: number, max: number): boolean;
}

/**
 * 限制範圍
 */
Number.prototype.limit = function(this: number, min: number, max: number): number {
    let value = this.valueOf();
    return value >= max ? max : (value <= min ? min : value);
}

/**
 * 是否在兩值間
 */
Number.prototype.between = function(this: number, min: number, max: number): boolean {
    let value = this.valueOf();
    return value >= min && value <= max;
}
