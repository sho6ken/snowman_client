import { Game, game, sys } from "cc";
import { SingleMgr, Singleton } from "./singleton";
import { EventMgr } from "../event/event-mgr";
import { EventConf } from "../../conf/event-conf";

/**
 * 不支援的瀏覽器
 */
const NOT_SUPPORT = [sys.BrowserType.UC];

/**
 * 網頁聚焦失焦
 */
export class FocusBlur implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    /**
     * 
     */
    public init(): void {
        if (this.isSupport()) {
            game.on(Game.EVENT_SHOW, this.onFocus.bind(this));
            game.on(Game.EVENT_HIDE, this.onBlur.bind(this));
        } 
    }

    /**
     * 
     */
    public free(): void {
        if (this.isSupport()) {
            game.off(Game.EVENT_SHOW, this.onFocus.bind(this));
            game.off(Game.EVENT_HIDE, this.onBlur.bind(this));
        } 
    }

    /**
     * 是否支援當前瀏覽器
     */
    private isSupport(): boolean {
        return sys.isBrowser && NOT_SUPPORT.indexOf(sys.browserType) === -1;
    }

    /**
     * 聚焦
     */
    private onFocus(): void {
        SingleMgr.get(EventMgr).emit(EventConf.Focus);
    }

    /**
     * 失焦
     */
    private onBlur(): void {
        SingleMgr.get(EventMgr).emit(EventConf.Blur);
    }
}
