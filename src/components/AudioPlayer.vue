<template>
  <div class="flex justify-center items-center w-full">
    <YouTube v-if="isYoutube" :src="audioSrc" @ready="onYoutubeReady" ref="youtubePlayer" class="max-w-full" />
    <audio v-else ref="audioElement" :src="audioSrc" @canplay="onAudioReady" class="w-full max-w-md"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import YouTube from 'vue3-youtube';

const props = defineProps<{
  audioSrc: string;
  isYoutube: boolean;
}>();

const emit = defineEmits(['player-ready']);

const youtubePlayer = ref<InstanceType<typeof YouTube> | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);

onMounted(() => {
  if (!props.isYoutube && audioElement.value) {
    emit('player-ready', wrapAudioElement(audioElement.value));
  }
});

watch(() => props.audioSrc, () => {
  if (props.isYoutube && youtubePlayer.value) {
    youtubePlayer.value.loadVideoById(getYoutubeVideoId(props.audioSrc));
  }
});

function onYoutubeReady(event: any) {
  emit('player-ready', event.target);
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

function getYoutubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
}
</script>