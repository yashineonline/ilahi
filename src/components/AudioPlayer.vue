<template>
  <div class="flex justify-center items-center w-full">
    <YouTube v-if="playerType === 'youtube'" :src="audioSrc" @ready="onYoutubeReady" ref="youtubePlayer" class="max-w-full" />
    <audio v-else-if="playerType === 'audio'" ref="audioElement" :src="audioSrc" @canplay="onAudioReady" class="w-full max-w-md"></audio>
    <iframe v-else-if="playerType === 'googledrive'" :src="getGoogleDriveEmbedUrl(audioSrc)" frameborder="0" width="100%" height="200"></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import YouTube from 'vue3-youtube';

const props = defineProps<{
  audioSrc: string;
  playerType: 'youtube' | 'audio' | 'googledrive';
}>();

const emit = defineEmits(['player-ready']);

const youtubePlayer = ref<InstanceType<typeof YouTube> | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);
const startTime = ref(0);
const endTime = ref(0);

onMounted(() => {
  if (props.playerType === 'audio' && audioElement.value) {
    emit('player-ready', wrapAudioElement(audioElement.value));
  }
});

watch(() => props.audioSrc, () => {
  if (props.playerType === 'youtube' && youtubePlayer.value) {
    const { videoId, startTime: start, endTime: end } = getYoutubeVideoId(props.audioSrc);
    console.log('YouTube link:', props.audioSrc);
    console.log('Extracted video ID:', videoId);
    console.log('Start time:', start);
    console.log('End time:', end);
    youtubePlayer.value.loadVideoById({ videoId, startSeconds: start });
    startTime.value = start;
    endTime.value = end;
  } else if (props.playerType === 'audio' && audioElement.value) {
    audioElement.value.src = props.audioSrc;
    audioElement.value.load();
  }
  // Google Drive links are handled directly in the template
});

function onYoutubeReady(event: any) {
  console.log('YouTube player ready');
  if (startTime.value > 0) {
    console.log('Seeking to start time:', startTime.value);
    event.target.seekTo(startTime.value);
  }
  emit('player-ready', event.target);

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

function onAudioReady() {
  if (audioElement.value) {
    emit('player-ready', wrapAudioElement(audioElement.value));
  }
}

function wrapAudioElement(audio: HTMLAudioElement) {
  return {
    pauseVideo: () => audio.pause(),
    playVideo: () => audio.play(),
    getCurrentTime: () => audio.currentTime,
    seekTo: (time: number) => audio.currentTime = time,
    getPlaybackRate: () => audio.playbackRate,
    setPlaybackRate: (rate: number) => audio.playbackRate = rate
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

function getGoogleDriveEmbedUrl(url: string): string {
  const fileId = url.match(/[-\w]{25,}/);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId[0]}/preview`;
  }
  return url;
}
</script>