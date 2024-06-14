import { Component } from "cc";

/**
 * 異步等待
 */
export class WaitUtil {
    /**
     * 毫秒
     * @param ms 
     * @param cmpt 
     */
    public static async forMS(ms: number, cmpt?: Component): Promise<void> {
        cmpt ? await this.forSec(ms / 1000, cmpt) : await new Promise(resolve => window.setTimeout(resolve, ms));
    }

    /**
     * 秒
     * @param sec 
     * @param cmpt 
     */
    public static async forSec(sec: number, cmpt?: Component): Promise<void> {
        cmpt ? await new Promise(resolve => cmpt.scheduleOnce(resolve, sec)) : await this.forMS(sec * 1000);
    }
}
