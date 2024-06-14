/**
 * 網址
 */
export class UrlUtil {
    /**
     * 解析參數
     */
    public static parse(): { [key: string]: string } {
        let res = {};
        let str = window.location.href.split(`/?`)[1];

        // key1=value1&key2=value2&...依此類推
        if (str) {
            str.split(`&`).forEach(slice => {
                let pair = slice.split(`=`);
                res[pair[0]] = pair[1];
            });
        }

        return res;
    }

    /**
     * 合併參數
     * @param url 
     * @param params 
     */
    public static combine(url: string, params?: { key: string, value: string | number }[]): void {
        if (params) {
            url += `/?`;
            params.forEach(param => url += `${param.key}=${param.value}&`);
            url = url.slice(0, -1);  // 去掉最後的&
        }

        window.history.pushState(null, ``, url);
    }
}
