<!-- src/components/SelectedSongsManager.vue -->
<template>
  <div>
    <h3 class="text-lg font-semibold mb-2">Selected Ilahis:</h3>
    <div class="space-y-2">
      <div class="flex items-center mb-2">
        <span class="w-16 mr-2 font-semibold">Order</span>
        <span class="flex-grow">Title</span>
      </div>
      <div v-for="(song, index) in localSelectedSongs" :key="song.title" class="flex items-center">
        <input 
          v-model.number="song.order" 
          type="number" 
          min="1" 
          :max="localSelectedSongs.length" 
          class="w-16 mr-2 text-black bg-white" 
          @change="reorderSongs"
        >
        <span class="flex-grow text-white">{{ song.title }}</span>
        <button @click="removeSong(index)" class="ml-2 text-red-600 hover:text-red-800">&times;</button>
      </div>
    </div>
    <div class="mt-4 space-x-2">
      <button @click="sortAlphabetically" class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
        Sort Alphabetically
      </button>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, watch } from 'vue';
import { SongData } from '../utils/types';
  
const props = defineProps<{
  selectedSongs: SongData[]
}>();
  
const emit = defineEmits<{
  (e: 'update:selectedSongs', value: SongData[]): void
  (e: 'generate-book'): void
}>();
  
const localSelectedSongs = ref(props.selectedSongs.map((song, index) => ({ ...song, order: index + 1 })));
  
watch(() => props.selectedSongs, (newSongs) => {
  localSelectedSongs.value = newSongs.map((song, index) => ({ ...song, order: index + 1 }));
}, { deep: true });
  
function reorderSongs() {
  const newOrder = [...localSelectedSongs.value].sort((a, b) => a.order - b.order);
  newOrder.forEach((song, index) => {
    const originalSong = localSelectedSongs.value.find(s => s.title === song.title);
    if (originalSong) {
      originalSong.order = index + 1;
    }
  });
  emit('update:selectedSongs', localSelectedSongs.value);
}
  
function removeSong(index: number) {
  localSelectedSongs.value.splice(index, 1);
  localSelectedSongs.value.forEach((song, i) => song.order = i + 1);
  emit('update:selectedSongs', localSelectedSongs.value);
}
  
function sortAlphabetically() {
  localSelectedSongs.value.sort((a, b) => a.title.localeCompare(b.title));
  localSelectedSongs.value.forEach((song, i) => song.order = i + 1);
  emit('update:selectedSongs', localSelectedSongs.value);
}
</script>