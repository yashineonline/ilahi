import { defineStore } from 'pinia'
import { ref } from 'vue'
import { processSongsFile, SongData } from '../utils/songProcessor'

export const useSongStore = defineStore('song', () => {
  const songs = ref<SongData[]>([])

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

  return { songs, fetchSongs }
})
