<template>
    <div class="mb-4">
      <input 
        v-model="searchQuery" 
        @input="search"
        type="text" 
        placeholder="Search songs..." 
        class="w-full px-3 py-2 border rounded-md"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useSongStore } from '../stores/songStore';
  import { searchSongs } from '../utils/search';
  
  const songStore = useSongStore();
  const searchQuery = ref('');
  
  const search = () => {
    songStore.setFilteredSongs(searchSongs(songStore.songs, searchQuery.value));
  };
  </script>
  