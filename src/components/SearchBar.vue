<template>
  <div class="mb-4">
    <form @submit.prevent="handleSearch">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search ilahis..." 
        class="w-full px-3 py-2 border rounded-md bg-base-200 text-base-content"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSongStore } from '../stores/songStore';

const router = useRouter();
const songStore = useSongStore();
const searchQuery = ref(localStorage.getItem('recentSearch') || '');

watch(searchQuery, useDebounce((val: string) => {
  songStore.setSearchQuery(val);
  localStorage.setItem('recentSearch', val);
}, 300));


// const searchQuery = ref('');

// const search = ref(localStorage.getItem('recentSearch') || '');
// watch(search, useDebounce((val: string) => {
//   songStore.setSearchQuery(val);
//   localStorage.setItem('recentSearch', val);
// }, 300));

function useDebounce<T extends Function>(fn: T, ms = 300) {
  let t: number | undefined;
  return (...args: any[]) => {
    clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

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