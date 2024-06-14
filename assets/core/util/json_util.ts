/**
 * json
 */
export class JsonUtil {
    /**
     * json轉map
     * @param src 
     */
    public static toMap<TK, TV>(src: string): Map<TK, TV> {
        const execute = function(src: {}): Map<TK, TV> {
            let res = new Map<TK, TV>();

            for (const key in src) {
                res.set(<TK>key, <TV>src[key]);
            }

            return res;
        }

        return execute(JSON.parse(src));
    }

    /**
     * map轉json
     * @param src 
     */
    public static fromMap(src: Map<any, any>): string {
        return JSON.stringify(() => {
            let res = {};
            src.forEach((value, key) => res[key] = value);
            return res;
        });
    }
}
