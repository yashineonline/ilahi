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
import { ref, watch } from 'vue';
import { useSongStore } from '../stores/songStore';

const songStore = useSongStore();
const searchQuery = ref('');

const search = () => {
  songStore.setSearchQuery(searchQuery.value);
};
</script>