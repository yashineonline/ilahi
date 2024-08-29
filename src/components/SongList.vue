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

    <!-- Category filter -->
    <div class="flex justify-center my-4">
      <select v-model="selectedCategories" multiple class="form-multiselect block w-64 bg-white text-black">
        <option value="">All</option>
        <option v-for="category in allCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
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
          <span v-else class="text-gray-500">All</span>
        </h3>
        <div class="text-sm text-gray-600">
          <!-- {{ song.categories.join(', ') }} -->
        </div>
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
const selectedCategories = ref<string[]>([])

const resetGlobalSearch = inject('resetGlobalSearch') as () => void

const turkishToEnglish = (str: string) => {
  const map: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  }
  return str.replace(/[çğıöşüÇĞİÖŞÜ]/g, letter => map[letter] || letter)
}

const allCategories = computed(() => {
  const categories = new Set<string>()
  filteredSongs.value.forEach(song => {
    song.categories.forEach(category => {
      if (category.trim() !== '') {
        categories.add(category.trim())
      }
    })
  })
  return Array.from(categories).sort((a, b) => 
    turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase()))
  )
})

const sortedFilteredSongs = computed(() => {
  let songsToDisplay = filteredSongs.value

  if (currentLetter.value) {
    songsToDisplay = songsToDisplay.filter(song => 
      turkishToEnglish(song.title[0].toUpperCase()) === turkishToEnglish(currentLetter.value)
    )
  }

  if (selectedCategories.value.length > 0 && !selectedCategories.value.includes('')) {
    songsToDisplay = songsToDisplay.filter(song => 
      selectedCategories.value.some(category => 
        song.categories.some(songCategory => 
          songCategory.trim() !== '' &&
          turkishToEnglish(songCategory.toLowerCase()) === turkishToEnglish(category.toLowerCase())
        )
      )
    )
  }

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
  updateQueryParams()
}

const updateQueryParams = () => {
  const query: Record<string, string | string[]> = {}
  if (currentLetter.value) query.letter = currentLetter.value
  if (selectedCategories.value.length > 0) query.categories = selectedCategories.value
  router.push({ query })
}

watch([filteredSongs, currentLetter, selectedCategories], () => {
  currentPage.value = 1
  updateQueryParams()
})

watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    songStore.setSearchQuery(newSearch as string)
    currentPage.value = 1
    currentLetter.value = ''
    selectedCategories.value = []
  }
})

onMounted(async () => {
  await songStore.fetchSongs()
  if (route.query.search) {
    songStore.setSearchQuery(route.query.search as string)
  }
  if (route.query.categories) {
    selectedCategories.value = Array.isArray(route.query.categories) 
      ? route.query.categories 
      : [route.query.categories as string]
  }
})

const resetSearch = () => {
  songStore.setSearchQuery('')
  currentLetter.value = ''
  selectedCategories.value = []
  router.push({ query: {} })
  resetGlobalSearch()
}

watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    songStore.setSearchQuery(newQuery.search as string)
    currentPage.value = 1
    currentLetter.value = ''
    selectedCategories.value = []
  } else if (newQuery.letter) {
    currentLetter.value = newQuery.letter as string
    currentPage.value = 1
    songStore.setSearchQuery('')
  } else if (newQuery.categories) {
    selectedCategories.value = Array.isArray(newQuery.categories) 
      ? newQuery.categories 
      : [newQuery.categories as string]
    currentPage.value = 1
    songStore.setSearchQuery('')
  } else {
    songStore.setSearchQuery('')
    currentLetter.value = ''
    selectedCategories.value = []
    currentPage.value = 1
  }
}, { immediate: true })

const app = getCurrentInstance()?.appContext.app
</script>