// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile } from '../utils/songProcessor'
import { SongData } from '../utils/types'
import { searchSongs } from '../utils/search'
import { setSubcategories, getAllCategories } from '../utils/categoryUtils'

export const useSongStore = defineStore('song', () => {
  const songs = ref<SongData[]>([]);
  const categories = ref<string[]>([]);
  const searchQuery = ref('');
  const selectedSongs = ref<SongData[]>([]);

  const filteredSongs = computed(() => {
    return searchSongs(songs.value, searchQuery.value);
  });

  const fetchSongs = async (forceRefresh = false) => {
    try {
      const cachedSongs = localStorage.getItem('cachedSongs')
      const cachedSubcategories = localStorage.getItem('cachedSubcategories')
      const cachedCategories = localStorage.getItem('cachedCategories')

      if (!forceRefresh && cachedSongs && cachedSubcategories && cachedCategories) {
        songs.value = JSON.parse(cachedSongs)
        setSubcategories(JSON.parse(cachedSubcategories))
        categories.value = JSON.parse(cachedCategories)
        console.log('Loaded songs, subcategories, and categories from localStorage cache')
        return
      }

      const owner = 'yashineonline';
      const repo = 'ilahiRepository';
      const path = 'ilahi.txt';
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text()
      const { songs: processedSongs, subcategories } = processSongsFile(text)
      songs.value = processedSongs
      setSubcategories(subcategories)
      categories.value = getAllCategories(processedSongs)
      localStorage.setItem('cachedSongs', JSON.stringify(songs.value))
      localStorage.setItem('cachedSubcategories', JSON.stringify(subcategories))
      localStorage.setItem('cachedCategories', JSON.stringify(categories.value))
      return categories.value // Return the categories
    } catch (error) {
      console.error('Error fetching songs:', error)
      songs.value = []
      categories.value = []
      throw error // Rethrow the error
    }
  };

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

  return { 
    songs, 
    categories,
    filteredSongs, 
    fetchSongs, 
    setSearchQuery, 
    selectedSongs, 
    selectSong, 
    deselectSong, 
    clearSelectedSongs 
  }
})