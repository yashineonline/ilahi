<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Tarih: History</h1>
    <p>Here you can find links to ilahis for which a brief history and/or explanation is provided.:</p>
    <ul class="list-disc pl-5">
      <li v-for="song in songsWithHistory" :key="song.title" class="mb-2">
        <router-link 
          :to="{ 
            name: 'SongDisplay', 
            params: { slug: slugify(song.title) },
            hash: '#history'
          }" 
          class="text-blue-600 hover:text-purple-800"
        >
          {{ song.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSongStore } from '../stores/songStore';
import { slugify } from '../utils/search';

const songStore = useSongStore();
const songsWithHistory = ref<any[]>([]);

onMounted(async () => {
  await songStore.fetchSongs();
  songsWithHistory.value = songStore.getSongsWithHistory();
});
</script>