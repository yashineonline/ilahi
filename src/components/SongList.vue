<template>
  <div>
    <h2>Song List</h2>
    <div v-if="sortedSongs.length">
  <div v-for="(song, index) in sortedSongs" :key="`${song.title}-${index}`">
    <h3>{{ song.title }}</h3>
    <p>YouTube Link: {{ song.youtubeLink }}</p>
  </div>
</div>
    <div v-else>Loading songs...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSongStore } from '../stores/songStore'

const songStore = useSongStore()
const { songs } = storeToRefs(songStore)
const sortedSongs = computed(() => 
  [...songs.value].sort((a, b) => a.title.localeCompare(b.title))
)

onMounted(() => {
  songStore.fetchSongs()
})
</script>
