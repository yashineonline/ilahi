// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile } from '../utils/songProcessor'
import { SongData } from '../utils/types'
import { searchSongs } from '../utils/search'

export const useSongStore = defineStore('song', () => {
  const songs = ref<SongData[]>([]);
  const searchQuery = ref('');
  const selectedSongs = ref<SongData[]>([]);

  const filteredSongs = computed(() => {
    return searchSongs(songs.value, searchQuery.value);
  });

  const fetchSongs = async (forceRefresh = false) => {
    try {
      if (forceRefresh || songs.value.length === 0) {
        // const url = 'https://raw.githubusercontent.com/yashineonline/ilahi/main/ilahi.txt';
        // const cacheOption = forceRefresh ? 'no-store' : 'default';
        // const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        // const url = 'https://raw.githubusercontent.com/yashineonline/ilahi/main/ilahi.txt';
        // const url = 'https://github.com/yashineonline/ilahi/blob/main/ilahi.txt';

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
        songs.value = processSongsFile(text)
        localStorage.setItem('cachedSongs', JSON.stringify(songs.value))
      } else {
        console.log('Using existing cached songs')
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
      // If there's no cached data, try to load from localStorage
      const cachedSongs = localStorage.getItem('cachedSongs')
      if (cachedSongs) {
        songs.value = JSON.parse(cachedSongs)
        console.log('Loaded songs from localStorage cache')
      } else {
        console.log('No localStorage cache, trying local file');
        // Try loading from local file
        try {
          const response = await fetch('/ilahi.txt');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const text = await response.text();
          songs.value = processSongsFile(text);
          localStorage.setItem('cachedSongs', JSON.stringify(songs.value));
        } catch (localError) {
          console.error('Error loading local file:', localError);
          songs.value = []; // Set to empty array if all attempts fail
        }
      }
    }

    // Save fetched songs to localStorage for future use
    if (songs.value.length > 0) {
      localStorage.setItem('cachedSongs', JSON.stringify(songs.value))
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

  return { songs, filteredSongs, fetchSongs, setSearchQuery, selectedSongs, selectSong, deselectSong, clearSelectedSongs }
})