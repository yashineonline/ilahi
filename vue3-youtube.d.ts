declare module 'vue3-youtube' {
  import { DefineComponent } from 'vue';
  const C: DefineComponent<{}, {}, any> & {
    playVideo(): void;
    pauseVideo(): void;
    getCurrentTime(): number;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    setPlaybackRate(rate: number): void;
    loadVideoById(opts: { videoId: string; startSeconds?: number; endSeconds?: number }): void;
  };
  export default C;
}

declare namespace YT {
  enum PlayerState { ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3, CUED=5 }
  interface OnStateChangeEvent { data: PlayerState }
}

