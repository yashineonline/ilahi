<template>
    <div class="p-4">
      <button 
        class="btn btn-success mb-4 w-full"
        @click="playWelcomeSequence"
        v-show="!isPlayingWelcome"
        
      >
        Welcome
      </button>
      <button 
        class="btn btn-secondary mb-4 w-full"
        @click="playFirstSegment"
        v-show="!isPlayingFirst"
        
      >
        Walking to the Dergah
      </button>
      
      <button 
        class="btn btn-secondary mb-4 w-full"
        @click="playSecondSegment"
        v-show="!isPlayingSecond"
        
      >
        Entering the Dergah
      </button>
      <div class="player-container" v-show="isAnySegmentPlaying">
        <YouTube
          ref="player"
          :video-id="videoId"
          @ready="onPlayerReady"
          @state-change="onPlayerStateChange"
        />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import YouTube from 'vue3-youtube';
  
  export default defineComponent({
    name: 'Entrance',
    components: {
      YouTube,
    },
    setup() {
      const player = ref<InstanceType<typeof YouTube> | null>(null);
      const videoId = 'f97Eyr8gYUo';
      const segments = [
        { start: 216, end: 231 },
        { start: 257, end: 274 },  //273 is best, 274 to allow to stop share
      ];

      const isPlayingFirst = ref(false);
      const isPlayingSecond = ref(false);
      const isAnySegmentPlaying = ref(false);
      const isPlayingWelcome = ref(false);
      const currentSegmentIndex = ref(0);

      const onPlayerReady = () => {
        // Do nothing on initial ready event
      };

      const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
        if (event.data === YT.PlayerState.ENDED) {
          if (isPlayingWelcome.value) {
            if (currentSegmentIndex.value === 0) {
              currentSegmentIndex.value = 1;
              playSegment(1, true);
            } else {
              isPlayingWelcome.value = false;
              currentSegmentIndex.value = 0;
            }
          }
          isPlayingFirst.value = false;
          isPlayingSecond.value = false;
        }
      };

      const playSegment = (index: number, fullscreen: boolean = false) => {
        if (player.value) {
          const segment = segments[index];
          player.value.loadVideoById({
            videoId: videoId,
            startSeconds: segment.start,
            endSeconds: segment.end,
          });
          player.value.playVideo();
          if (fullscreen) {
            requestFullscreen();
          }
        }
      };

      const requestFullscreen = () => {
        if (player.value) {
          const iframe = player.value.getIframe();
          if (iframe) {
            setTimeout(() => {
              if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
              } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
              } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
              } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
              }
            }, 1000); // Delay to ensure video has started
          }
        }
      };

      const playFirstSegment = () => {
        isPlayingFirst.value = true;
        isPlayingSecond.value = false;
        isAnySegmentPlaying.value = true;
        playSegment(0);
      };

      const playSecondSegment = () => {
        isPlayingFirst.value = false;
        isPlayingSecond.value = true;
        isAnySegmentPlaying.value = true;
        playSegment(1);
      };

      const playWelcomeSequence = () => {
        isPlayingWelcome.value = true;
        isAnySegmentPlaying.value = true;
        currentSegmentIndex.value = 0;
        playSegment(0, true);
      };

      return {
        player,
        videoId,
        onPlayerReady,
        onPlayerStateChange,
        isPlayingFirst,
        isPlayingSecond,
        isAnySegmentPlaying,
        isPlayingWelcome,
        currentSegmentIndex,
        playFirstSegment,
        playSecondSegment,
        playWelcomeSequence,
      };
    },
  });
  </script>
  
  <style scoped>
  .player-container {
    width: 640px;
    height: 390px;
    margin: 0 auto;
  }
  </style>