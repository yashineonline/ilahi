<template>
    <div class="p-4">
      <button 
        class="btn btn-primary mb-4 w-full"
        @click="playFirstSegment"
        v-show="!isPlayingFirst"
      >
        Walking to the Dergah with Shaykh Taner and Shaykha Muzeyyen
      </button>
      <button 
        class="btn btn-secondary mb-4 w-full"
        @click="playSecondSegment"
        v-show="!isPlayingSecond"
      >
        Entering the Dergah with Shaykh Taner and Shaykha Muzeyyen
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
        { start: 257, end: 273 },
      ];

      const isPlayingFirst = ref(false);
      const isPlayingSecond = ref(false);
      const isAnySegmentPlaying = ref(false);

      const onPlayerReady = () => {
        // Do nothing on initial ready event
      };

      const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
        if (event.data === YT.PlayerState.ENDED) {
          isPlayingFirst.value = false;
          isPlayingSecond.value = false;
        
        }
      };

      const playSegment = (index: number) => {
        if (player.value) {
          const segment = segments[index];
          player.value.loadVideoById({
            videoId: videoId,
            startSeconds: segment.start,
            endSeconds: segment.end,
          });
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

      return {
        player,
        videoId,
        onPlayerReady,
        onPlayerStateChange,
        isPlayingFirst,
        isPlayingSecond,
        isAnySegmentPlaying,
        playFirstSegment,
        playSecondSegment,
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