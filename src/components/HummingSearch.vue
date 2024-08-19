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
  import { identifySong } from '../utils/audioRecognition';
  
  const isRecording = ref(false);
  const result = ref('');
  const songStore = useSongStore();
  
  const startRecording = async () => {
    isRecording.value = true;
    let audio: Blob;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.start();
      
      await new Promise(resolve => setTimeout(resolve, 5000)); // Record for 5 seconds
      
      mediaRecorder.stop();
      await new Promise(resolve => mediaRecorder.onstop = resolve);
      
      audio = new Blob(chunks, { type: 'audio/webm' });
    } catch (error) {
      console.error('Error recording audio:', error);
      isRecording.value = false;
      return;
    }
    
    isRecording.value = false;
    const songId = await identifySong(audio);
    result.value = songStore.songs.find(song => song.title === songId)?.title || 'No match found';
  };
  </script>
  