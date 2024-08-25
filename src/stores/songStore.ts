// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile, SongData } from '../utils/songProcessor'
import { searchSongs } from '../utils/search'

export const useSongStore = defineStore('song', () => {
  const songs = ref<SongData[]>([])
  const searchQuery = ref('')

  const filteredSongs = computed(() => {
    return searchSongs(songs.value, searchQuery.value)
  })

  async function fetchSongs() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/yashineonline/ilahi/main/ilahi.txt')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const fileContent = await response.text()
      const cleanContent = fileContent.replace(/^.*?```([\s\S]*?)```.*?$/m, '$1').trim();
      songs.value = processSongsFile(cleanContent);
      
    } catch (error) {
      console.error('Error loading songs:', error);
      songs.value = [];
      
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return { songs, filteredSongs, fetchSongs, setSearchQuery }
})