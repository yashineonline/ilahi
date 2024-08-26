<template>
    <audio
      ref="audioElement"
      :src="audioSrc"
      @canplay="onCanPlay"
      controls
    ></audio>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  const props = defineProps<{
    audioSrc: string
  }>()
  
  const emit = defineEmits<{
    (e: 'player-ready', player: HTMLAudioElement): void
  }>()
  
  const audioElement = ref<HTMLAudioElement | null>(null)
  
  const onCanPlay = () => {
    if (audioElement.value) {
      emit('player-ready', audioElement.value)
    }
  }
  
  onMounted(() => {
    if (audioElement.value) {
      emit('player-ready', audioElement.value)
    }
  })
  </script>