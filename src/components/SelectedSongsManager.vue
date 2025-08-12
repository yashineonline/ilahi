<!-- src/components/SelectedSongsManager.vue -->
<template>
  <div>
    <p class="text-lg mb-2">Sorry, the reordering by number is not working at the moment. So please reset, and choose again if you wish to change the order of your selected ilahis. Thank you.</p>
    <div class="space-y-2">
      <div class="flex items-center mb-2">
        <span class="w-16 mr-2 font-semibold">"Order (Not working)"</span>
        <span class="flex-grow">Title</span>
      </div>
      <div v-for="(song, index) in localSelectedSongs" :key="song.title" class="flex items-center">
        <input 
          v-model.number="song.order" 
          type="number" 
          min="1" 
          :max="localSelectedSongs.length" 
          class="w-16 mr-2 text-black bg-base-100" 
          @input="(e) => reorderSongs(index, (e.target as HTMLInputElement).valueAsNumber)"
        >
        <span class="flex-grow text-white">{{ song.title }}</span>
        <button @click="removeSong(index)" class="ml-2 text-red-600 hover:text-red-800">&times;</button>
      </div>
    </div>
    <div class="mt-4 space-x-2">
      <button @click="sortAlphabetically" class="px-4 py-2 bg-base-100 text-base-content border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
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
  
function reorderSongs(index: number, newOrder: number) {
  const newOrderArray = [...localSelectedSongs.value];
  newOrderArray[index].order = newOrder;
  newOrderArray.sort((a, b) => a.order - b.order);
  localSelectedSongs.value = newOrderArray;
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