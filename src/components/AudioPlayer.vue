<template>
  <div class="w-full max-w-full overflow-hidden">
    <div v-if="playerType === 'youtube'" class="relative w-full pt-[56.25%]">
      <YouTube :src="audioSrc" @ready="onYoutubeReady" ref="youtubePlayer" class="absolute top-0 left-0 w-full h-full" />
    </div>
    <div v-else-if="playerType === 'googledrive'" class="w-full max-w-md">
      <iframe
        :src="getGoogleDriveEmbedUrl(audioSrc)"
        width="100%"
        height="100"
        frameborder="0"
        allowfullscreen
        @load="onIframeLoad"
      ></iframe>
    </div>
    <div v-else class="w-full max-w-md">
      <button @click="togglePlay" class="btn btn-primary" :disabled="!isLoaded">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <p v-if="!isLoaded">Loading audio...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import YouTube from 'vue3-youtube';
import { Howl } from 'howler';

const props = defineProps<{
  audioSrc: string;
  playerType: 'youtube' | 'audio' | 'googledrive';
}>();

const emit = defineEmits(['player-ready']);

const youtubePlayer = ref<InstanceType<typeof YouTube> | null>(null);
const howl = ref<Howl | null>(null);
const startTime = ref(0);
const endTime = ref(0);
const isPlaying = ref(false);
const isLoaded = ref(false);

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

watch(() => props.audioSrc, () => {
  console.log('Audio source changed:', props.audioSrc);
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    const { videoId, startTime: start, endTime: end } = getYoutubeVideoId(props.audioSrc);
    console.log('YouTube video ID:', videoId);
    youtubePlayer.value.loadVideoById({ videoId, startSeconds: start });
    startTime.value = start;
    endTime.value = end;
  } else {
    isLoaded.value = false;
    // Don't initialize Howl here, wait for user interaction
  }
});

function onYoutubeReady(event: any) {
  console.log('YouTube player ready');
  if (startTime.value > 0) {
    console.log('Seeking to start time:', startTime.value);
    event.target.seekTo(startTime.value);
  }
  emit('player-ready', { player: event.target, type: 'youtube' });

  if (endTime.value > 0) {
    console.log('Setting up end time check for:', endTime.value);
    const checkTime = setInterval(() => {
      const currentTime = event.target.getCurrentTime();
      console.log('Current time:', currentTime, 'End time:', endTime.value);
      if (currentTime >= endTime.value) {
        console.log('Reached end time, pausing video');
        event.target.pauseVideo();
        clearInterval(checkTime);
      }
    }, 1000); // Check every second
  }
}

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
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : '';
  
  const startTimeRegExp = /[?&]t=(\d+)/;
  const startTimeMatch = url.match(startTimeRegExp);
  const startTime = startTimeMatch ? parseInt(startTimeMatch[1], 10) : 0;

  const endTimeRegExp = /[?&]end=(\d+)/;
  const endTimeMatch = url.match(endTimeRegExp);
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
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-w-16 :deep(iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>