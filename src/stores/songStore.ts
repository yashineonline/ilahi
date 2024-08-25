// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile } from '../utils/songProcessor'
import { SongData } from '../utils/types'
import { searchSongs } from '../utils/search'

export const useSongStore = defineStore('song', () => {
  const songs = ref<SongData[]>([])
  const searchQuery = ref('')
  const selectedSongs = ref<SongData[]>([])

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
      songs.value = processSongsFile(fileContent);
    } catch (error) {
      console.error('Error loading songs:', error);
      songs.value = [];
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function selectSong(song: SongData) {
    selectedSongs.value.push(song)
  }

  function deselectSong(song: SongData) {
    selectedSongs.value = selectedSongs.value.filter(s => s.title !== song.title)
  }

  function clearSelectedSongs() {
    selectedSongs.value = []
  }

  return { songs, filteredSongs, fetchSongs, setSearchQuery, selectedSongs, selectSong, deselectSong, clearSelectedSongs }
})