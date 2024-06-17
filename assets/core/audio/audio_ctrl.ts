import { AudioClip, AudioSource } from "cc";
import { Singleton } from "../util/singleton";

/**
 * 音源控制
 */
export abstract class AudioCtrl implements Singleton {
    // 名稱
    public get name(): string { return this.constructor.name; }

    // 播放元件
    protected _player: AudioSource = null;

    // 是否播放中
    public get playing(): boolean { return this._player.playing; }

    // 音量
    public get vol(): number { return this._player.volume; }
    public set vol(value: number) { this._player.volume = value.limit(0, 1); }

    // 暫停中
    protected _paused: boolean = false;
    public get paused(): boolean { return this._paused; }
    public set paused(value: boolean) { value ? this.pause() : this.resume(); }

    /**
     * 初始化
     * @param player 播放元件
     * @param vol 音量
     */
    public init(player: AudioSource, vol: number = 1): void {
        this._player = player;
        this.vol = vol;
    }

    /**
     * 播放
     * @param audio 
     */
    public abstract play(audio: AudioClip): void;

    /**
     * 停止
     */
    public stop(): void {
        this._player?.stop();
    }

    /**
     * 暫停
     */
    public pause(): void {
        if (!this._paused) {
            this._paused = true;
            this._player?.pause();
        }
    }

    /**
     * 恢復
     */
    public resume(): void {
        if (this._paused) {
            this._paused = false;
            this._player?.play();
        }
    }
}
