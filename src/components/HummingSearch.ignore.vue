// This file will be ignored during build

<template>
    <div class="mt-4">
      <button @click="startRecording" class="btn btn-primary" :disabled="isRecording">
        {{ isRecording ? 'Recording...' : 'Hum a tune' }}
      </button>
      <p v-if="result" class="mt-2">Matching song: {{ result }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useSongStore } from '../stores/songStore';
  <!-- import { recordAudio, identifySong } from '../utils/audioRecognition'; -->
  
  const isRecording = ref(false);
  const result = ref('');
  const songStore = useSongStore();
  
  const startRecording = async () => {
  isRecording.value = true;
  try {
    const audio = await recordAudio();
    const songId = await identifySong(audio);
    result.value = songStore.songs.find(song => song.title === songId)?.title || 'No match found';
  } catch (error) {
    console.error('Error recording or identifying audio:', error);
  } finally {
    isRecording.value = false;
  }
};  </script>
