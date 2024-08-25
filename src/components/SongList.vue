<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Song List</h2>
    <div v-if="paginatedSongs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(song, index) in paginatedSongs" :key="`${song.title}-${index}`" class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-xl font-semibold mb-2">
          <router-link :to="{ name: 'SongDisplay', params: { title: encodeURIComponent(song.title) } }" class="text-blue-600 hover:text-blue-800">
            {{ song.title }}
          </router-link>
        </h3>
        <p v-if="song.youtubeLink" class="text-sm text-gray-600">
          <a :href="song.youtubeLink" target="_blank" rel="noopener noreferrer" class="hover:underline">Watch on YouTube</a>
        </p>
      </div>
    </div>
    <div v-else class="text-center text-xl text-gray-600">Loading songs...</div>
    
    <div class="mt-6 flex justify-center">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-primary mr-2">&lt; Previous</button>
      <span class="mx-2 self-center">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-primary ml-2">Next &gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSongStore } from '../stores/songStore'
import { RouterLink } from 'vue-router'

const songStore = useSongStore()
const { songs } = storeToRefs(songStore)

const currentPage = ref(1)
const itemsPerPage = 12

const sortedSongs = computed(() => 
  [...songs.value].sort((a, b) => a.title.localeCompare(b.title))
)

const totalPages = computed(() => Math.ceil(sortedSongs.value.length / itemsPerPage))

const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedSongs.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

watch(songs, () => {
  currentPage.value = 1
})

onMounted(() => {
  songStore.fetchSongs()
})
</script>