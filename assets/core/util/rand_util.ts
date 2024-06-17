/**
 * 隨機
 */
export class RandUtil {
    /**
     * 隨機整數
     * @param max 不含 
     * @param min 含
     */
    public static int(max: number, min: number = 0): number {
        max = Math.floor(max);
        min =  Math.ceil(min);

        return Math.floor(this.float(max, min));
    }

    /**
     * 隨機浮點數
     * @param max 不含 
     * @param min 含
     */
    public static float(max: number, min: number = 0): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 百分比
     * @param value 不含
     */
    public static rate(value: number): boolean {
        return this.float(100) < value;
    }

    /**
     * 權重
     * @param src 容器
     * @returns 容器索引
     */
    public static weights(src: number[]): number {
        let len = src.length;

        if (len > 0) {
            let sum = 0;

            src.forEach(elm => {
                if (elm < 0) {
                    console.warn(`rand weights elm value < 0`, src);
                    return -1;
                }
                

                sum += elm;
            });

            let rand = this.float(sum);
            let curr = 0;

            for (let i = 0; i < len; i++) {
                curr += src[i];

                if (curr > rand) {
                    return i;
                }
            }

            return len - 1;
        }

        console.warn(`rand weights elm is null`);

        return -1;
    }

    /**
     * 亂數種子
     * @param value 
     * @returns 0~1
     */
    public static seed(value: number): number {
        if (value === 0) {
            console.warn(`rand seed is 0`);
            value = Date.now();
        }

        return (value * 16807) % 2147483647 / 2147483647;
    }
}
