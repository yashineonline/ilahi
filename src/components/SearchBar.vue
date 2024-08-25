<template>
  <div class="mb-4">
    <input 
      v-model="searchQuery" 
      @input="search"
      type="text" 
      placeholder="Search songs..." 
      class="w-full px-3 py-2 border rounded-md text-gray-800 bg-white dark:text-white dark:bg-gray-700"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSongStore } from '../stores/songStore';

const songStore = useSongStore();
const searchQuery = ref('');

const search = () => {
  songStore.setSearchQuery(searchQuery.value);
};
</script>