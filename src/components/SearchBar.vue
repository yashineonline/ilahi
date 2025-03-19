<template>
  <div class="mb-4">
    <form @submit.prevent="handleSearch">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search ilahis..." 
        class="w-full px-3 py-2 border rounded-md text-gray-800 dark:text-white dark:bg-gray-700"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSongStore } from '../stores/songStore';

const router = useRouter();
const songStore = useSongStore();
const searchQuery = ref('');

const handleSearch = () => {
  songStore.setSearchQuery(searchQuery.value);
  if (router.currentRoute.value.name !== 'SongList') {
    router.push({ name: 'SongList', query: { search: searchQuery.value } });
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  songStore.setSearchQuery('');
};

defineExpose({ clearSearch });
</script>