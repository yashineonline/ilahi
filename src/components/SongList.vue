<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Song List</h2>
    
    <!-- A-Z filter -->
    <div class="flex flex-wrap justify-center my-4">
      <button v-for="letter in 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'" :key="letter"
              @click="filterByLetter(letter)"
              :class="['btn btn-sm m-1', { 'btn-primary': currentLetter === letter }]">
        {{ letter }}
      </button>
    </div>

    <div class="flex justify-center my-4">
      <button @click="resetSearch" class="btn btn-secondary">
        Reset Search
      </button>
    </div>

    <div v-if="paginatedSongs.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(song, index) in paginatedSongs" :key="`${song.title}-${index}`" class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-xl font-semibold mb-2">
          <router-link 
            v-if="song.title"
            :to="{ name: 'SongDisplay', params: { title: encodeURIComponent(song.title) } }" 
            class="text-blue-600 hover:text-blue-800"
          >
            {{ song.title }}
          </router-link>
          <span v-else class="text-gray-500">Empty</span>
        </h3>
      </div>
    </div>
    <div v-else class="text-center text-xl text-gray-600">No songs found</div>
    
    <div class="mt-6 flex justify-center">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-primary mr-2">&lt; Previous</button>
      <span class="mx-2 self-center">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-primary ml-2">Next &gt;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useSongStore } from '../stores/songStore'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import SearchBar from './SearchBar.vue'
import { getCurrentInstance } from 'vue'

const route = useRoute()
const router = useRouter()
const songStore = useSongStore()
const { filteredSongs } = storeToRefs(songStore)

const currentPage = ref(1)
const itemsPerPage = 12
const currentLetter = ref('')

const resetGlobalSearch = inject('resetGlobalSearch') as () => void

const sortedFilteredSongs = computed(() => {
  let songsToDisplay = currentLetter.value ? 
    filteredSongs.value.filter(song => song.title.startsWith(currentLetter.value)) :
    filteredSongs.value
  return songsToDisplay.sort((a, b) => a.title.localeCompare(b.title))
})

const totalPages = computed(() => Math.ceil(sortedFilteredSongs.value.length / itemsPerPage))

const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedFilteredSongs.value.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const filterByLetter = (letter: string) => {
  currentLetter.value = currentLetter.value === letter ? '' : letter;
  currentPage.value = 1;
  if (currentLetter.value) {
    router.push({ query: { letter: currentLetter.value } })
  } else {
    router.push({ query: {} })
  }
}

watch([filteredSongs, currentLetter], () => {
  currentPage.value = 1
})

watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    songStore.setSearchQuery(newSearch as string)
    currentPage.value = 1
    currentLetter.value = ''
  }
})

onMounted(() => {
  songStore.fetchSongs()
  if (route.query.search) {
    songStore.setSearchQuery(route.query.search as string)
  }
})

const resetSearch = () => {
  songStore.setSearchQuery('')
  currentLetter.value = ''
  if (route.query.search || route.query.letter) {
    router.push({ query: {} })
  }
  resetGlobalSearch()
}

watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    songStore.setSearchQuery(newQuery.search as string)
    currentPage.value = 1
    currentLetter.value = ''
  } else if (newQuery.letter) {
    currentLetter.value = newQuery.letter as string
    currentPage.value = 1
    songStore.setSearchQuery('')
  } else {
    songStore.setSearchQuery('')
    currentLetter.value = ''
    currentPage.value = 1
  }
}, { immediate: true })

const app = getCurrentInstance()?.appContext.app
</script>