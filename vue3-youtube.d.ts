declare module 'vue3-youtube'

declare namespace YT {
    interface Player {
      loadVideoById(options: { videoId: string; startSeconds: number; endSeconds: number }): void;
      playVideo(): void;
      getIframe(): HTMLIFrameElement;
    }
  
    enum PlayerState {
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5
    }
  
    interface OnStateChangeEvent {
      data: PlayerState;
    }
  }