<template>
  <div class="audio-player-container">
    <div class="player-wrapper" v-if="playerType === 'youtube'">
      <YouTube 
        :src="audioSrc" 
        @ready="onYoutubeReady" 
        ref="youtubePlayer"
        width="100%"
        height="100%"
        class="youtube-player" 
      />
    </div>
    <div class="player-wrapper" v-else-if="playerType === 'googledrive'">
      <iframe
        :src="getGoogleDriveEmbedUrl(audioSrc)"
        frameborder="0"
        allowfullscreen
        @load="onIframeLoad"
        class="google-drive-player"
      ></iframe>
    </div>
    <div class="player-wrapper" v-else-if="playerType === 'soundcloud'">
      <iframe
        width="100%"
        height="166"
        scrolling="no"
        frameborder="no"
        :src="getSoundCloudEmbedUrl(audioSrc)"
      ></iframe>
    </div>
    <div v-else class="audio-controls">
      <audio ref="audioElement" :src="audioSrc" preload="auto"></audio>
    </div>
    <div class="controls mt-2 flex justify-center space-x-2">
      <button @click="togglePlay" class="btn btn-primary btn-sm">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button @click="seekBackward" class="btn btn-primary btn-sm">-5s</button>
      <button @click="seekForward" class="btn btn-primary btn-sm">+5s</button>
      <button @click="decreaseSpeed" class="btn btn-primary btn-sm">Slower</button>
      <button @click="increaseSpeed" class="btn btn-primary btn-sm">Faster</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue';
import YouTube from 'vue3-youtube';
import { Howl } from 'howler';

export type PlayerType = 'youtube' | 'audio' | 'googledrive' | 'soundcloud'

const props = defineProps<{
  audioSrc: string;
  playerType: 'youtube' | 'audio' | 'googledrive' | 'soundcloud';
  startTime?: number;
  endTime?: number;
}>();

const emit = defineEmits(['player-ready']);

const youtubePlayer = ref<InstanceType<typeof YouTube> | null>(null);
const howl = ref<Howl | null>(null);
const startTime = ref(0);
const endTime = ref(0);
const isPlaying = ref(false);
const isLoaded = ref(false);
const playbackRate = ref(1);

const getAudioSrc = computed(() => {
  if (props.playerType === 'googledrive') {
    const directUrl = getGoogleDriveDirectUrl(props.audioSrc);
    console.log('Google Drive direct URL:', directUrl);
    return directUrl;
  }
  console.log('Audio source:', props.audioSrc);
  return props.audioSrc;
});

function initHowl() {
  if (howl.value) {
    howl.value.unload();
  }
  console.log('Initializing Howl with source:', getAudioSrc.value);
  howl.value = new Howl({
    src: [getAudioSrc.value],
    html5: true,
    format: ['mp3', 'ogg', 'wav'],
    xhr: {
      method: 'GET',
      headers: {
        'Origin': window.location.origin
      },
      withCredentials: false
    },
    onload: () => {
      console.log('Howl loaded successfully');
      isLoaded.value = true;
      emit('player-ready', wrapHowlInstance(howl.value!));
    },
    onloaderror: (id, error) => {
      console.error('Howl error loading audio:', error);
      console.error('Error details:', howl.value?.state());
      isLoaded.value = false;
      // Try to load the audio using an audio element as a fallback
      tryFallbackAudio();
    },
  });
}

function tryFallbackAudio() {
  const audio = new Audio(getAudioSrc.value);
  audio.oncanplaythrough = () => {
    console.log('Audio loaded successfully using fallback method');
    isLoaded.value = true;
    emit('player-ready', wrapAudioElement(audio));
  };
  audio.onerror = (error) => {
    console.error('Fallback audio loading error:', error);
    isLoaded.value = false;
  };
}

function wrapAudioElement(audio: HTMLAudioElement) {
  return {
    pauseVideo: () => audio.pause(),
    playVideo: () => audio.play(),
    getCurrentTime: () => audio.currentTime,
    seekTo: (time: number) => { audio.currentTime = time; },
    getPlaybackRate: () => audio.playbackRate,
    setPlaybackRate: (rate: number) => { audio.playbackRate = rate; }
  };
}

function wrapYoutubePlayer(player: any) {
  return {
    pauseVideo: () => player.pauseVideo(),
    playVideo: () => player.playVideo(),
    getCurrentTime: () => player.getCurrentTime(),
    seekTo: (time: number) => player.seekTo(time, true),
    getPlaybackRate: () => player.getPlaybackRate(),
    setPlaybackRate: (rate: number) => player.setPlaybackRate(rate)
  };
}

// watch(() => props.audioSrc, () => {
//   console.log('Audio source changed:', props.audioSrc);
//   if (props.playerType === 'youtube' && youtubePlayer.value) {
//     const { videoId, startTime: start, endTime: end } = getYoutubeVideoId(props.audioSrc);
//     console.log('YouTube video ID:', videoId);
//     youtubePlayer.value.loadVideoById({ videoId, startSeconds: start });
//     startTime.value = start;
//     endTime.value = end;
//   } else {
//     isLoaded.value = false;
//     // Don't initialize Howl here, wait for user interaction
//   }
// });

function onYoutubeReady(event: any) {
  console.log('YouTube player ready');
  const player = event.target;
// Immediately stop any playback
player.stopVideo();

  const { videoId, startTime: start, endTime: end } = getYoutubeVideoId(props.audioSrc);
  startTime.value = start;
  endTime.value = end;

  // Use cueVideoById instead of loadVideoById
  player.cueVideoById({
    videoId: videoId,
    startSeconds: start,
    endSeconds: end || undefined
  });

  isLoaded.value = true;
  emit('player-ready', { 
    player: wrapYoutubePlayer(player),
    type: 'youtube' 
  });
}
watch(() => props.audioSrc, () => {
  console.log('Audio source changed:', props.audioSrc);
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    const { videoId, startTime: start, endTime: end } = getYoutubeVideoId(props.audioSrc);
    console.log('YouTube video ID:', videoId);
    youtubePlayer.value.cueVideoById({ 
      videoId, 
      startSeconds: start,
      endSeconds: end || undefined
     });
    startTime.value = start;
    endTime.value = end;
  } else {
    isLoaded.value = false;
  }
});
//   if (endTime > 0) {
//     console.log('Setting up end time check for:', endTime);
//     const checkTime = setInterval(() => {
//       const currentTime = event.target.getCurrentTime();
//       if (currentTime >= endTime) {
//         console.log('Reached end time, pausing video');
//         event.target.pauseVideo();
//         clearInterval(checkTime);
//       }
//     }, 1000); // Check every second
//   }
// }

function wrapHowlInstance(howl: Howl) {
  return {
    pauseVideo: () => howl.pause(),
    playVideo: () => howl.play(),
    getCurrentTime: () => howl.seek() as number,
    seekTo: (time: number) => howl.seek(time),
    getPlaybackRate: () => howl.rate(),
    setPlaybackRate: (rate: number) => howl.rate(rate)
  };
}

function getYoutubeVideoId(url: string): { videoId: string, startTime: number, endTime: number } {
  console.log('Processing URL:', url);
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^\/&\?]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  
  const startTimeMatch = url.match(/[?&]t=(\d+)/);
  const startTime = startTimeMatch ? parseInt(startTimeMatch[1], 10) : 0;

  const endTimeMatch = url.match(/[?&]end=(\d+)/);
  const endTime = endTimeMatch ? parseInt(endTimeMatch[1], 10) : 0;

  console.log('Extracted video ID:', videoId);
  console.log('Extracted start time:', startTime);
  console.log('Extracted end time:', endTime);

  return { videoId, startTime, endTime };
}

function isGoogleDriveLink(url: string): boolean {
  return url.includes('drive.google.com');
}

function getGoogleDriveDirectUrl(url: string): string {
  console.log('Processing Google Drive URL:', url);
  const fileId = url.match(/[-\w]{25,}/);
  if (fileId) {
    const directUrl = `https://docs.google.com/uc?export=download&id=${fileId[0]}`;
    console.log('Generated direct URL:', directUrl);
    return directUrl;
  }
  console.error('Failed to extract file ID from Google Drive URL');
  return url;
}

function togglePlay() {
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    if (isPlaying.value) {
      youtubePlayer.value.pauseVideo();
    } else {
      youtubePlayer.value.playVideo();
    }
    isPlaying.value = !isPlaying.value;
  } else if (props.playerType === 'googledrive') {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      if (isPlaying.value) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      isPlaying.value = !isPlaying.value;
    }
  } else {
    if (!howl.value && !isLoaded.value) {
      initHowl();
    }
    if (isLoaded.value) {
      const player = howl.value ? wrapHowlInstance(howl.value) : wrapAudioElement(document.querySelector('audio')!);
      if (isPlaying.value) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      isPlaying.value = !isPlaying.value;
    }
  }
}

function getGoogleDriveEmbedUrl(url: string): string {
  const fileId = url.match(/[-\w]{25,}/);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId[0]}/preview?enablejsapi=1`;
  }
  return '';
}

// Add this function to handle iframe load event
function onIframeLoad(event: Event) {
  const iframe = event.target as HTMLIFrameElement;
  iframe.contentWindow?.postMessage('{"event":"listening"}', '*');
  isLoaded.value = true;
  emit('player-ready', { 
    player: {
      pauseVideo: () => iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'),
      playVideo: () => iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*'),
      getCurrentTime: () => {
        // Note: Getting current time from Google Drive embed is not straightforward
        // You might need to implement a custom solution or use approximations
        return 0;
      },
      seekTo: (time: number) => iframe.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${time},true]}`, '*'),
      getPlaybackRate: () => 1, // Google Drive embed doesn't support playback rate control
      setPlaybackRate: () => {} // No-op for Google Drive embed
    }, 
    type: 'googledrive'
  });
}

const playSegment = () => {
  if (youtubePlayer.value && props.playerType === 'youtube') {
    const { videoId, startTime, endTime } = getYoutubeVideoId(props.audioSrc);
    youtubePlayer.value.cueVideoById({
      videoId: videoId,
      startSeconds: startTime,
      endSeconds: endTime || undefined,
    });
  }
};

// watch(() => props.audioSrc, playSegment);

onMounted(playSegment);

const seekBackward = () => {
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    const currentTime = youtubePlayer.value.getCurrentTime()
    youtubePlayer.value.seekTo(currentTime - 5, true)
  } else if (props.playerType === 'audio' && howl.value) {
    const currentTime = howl.value.seek() as number
    howl.value.seek(currentTime - 5)
  }
}

const seekForward = () => {
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    const currentTime = youtubePlayer.value.getCurrentTime()
    youtubePlayer.value.seekTo(currentTime + 5, true)
  } else if (props.playerType === 'audio' && howl.value) {
    const currentTime = howl.value.seek() as number
    howl.value.seek(currentTime + 5)
  }
}

const decreaseSpeed = () => {
  playbackRate.value = Math.max(0.25, playbackRate.value - 0.25)
  setPlaybackRate()
}

const increaseSpeed = () => {
  playbackRate.value = Math.min(2, playbackRate.value + 0.25)
  setPlaybackRate()
}

const setPlaybackRate = () => {
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    youtubePlayer.value.setPlaybackRate(playbackRate.value)
  } else if (props.playerType === 'audio' && howl.value) {
    howl.value.rate(playbackRate.value)
  }
}

const getSoundCloudEmbedUrl = (url: string) => {
  const trackUrl = encodeURIComponent(url);
  return `https://w.soundcloud.com/player/?url=${trackUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
};

const currentTime = ref(0);
const duration = ref(0);
const progressInterval = ref<NodeJS.Timeout | null>(null);
const intersectionObserver = ref<IntersectionObserver | null>(null);

onBeforeUnmount(() => {
  // Clean up Howler.js
  if (howl.value) {
    howl.value.off('play');
    howl.value.off('pause');
    howl.value.off('end');
    howl.value.off('load');
    howl.value.stop();
    howl.value.unload();
  }

  // Clean up YouTube player
  if (youtubePlayer.value) {
    youtubePlayer.value.destroy();
  }

  // Clean up Google Drive iframe
  const iframe = document.getElementById('google-drive-iframe');
  if (iframe) {
    iframe.remove();
  }

  // Clean up timers
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
  }

  // Clean up observers
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect();
  }

  // Reset reactive state
  currentTime.value = 0;
  duration.value = 0;
  isPlaying.value = false;
});

</script>

<style scoped>
.audio-player-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.player-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
}

.youtube-player,
.google-drive-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.audio-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

@media (min-width: 1024px) {
  .audio-player-container {
    max-width: 600px;
  }

  .player-wrapper {
    padding-bottom: 0;
    height: 337.5px; 
  }

  .youtube-player,
  .google-drive-player {
    position: relative;
    height: 100%;
  }
}
</style>