// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile } from '../utils/songProcessor.ts'
import { SongData, ZikrItem } from '../utils/types.ts'
import { searchSongs } from '../utils/search.ts'
import {  setSubcategories, CATEGORIES } from '../utils/categoryUtils.ts'

export const useSongStore = defineStore('song', () => {
  const songs = ref<SongData[]>([]);
  const categories = ref<string[]>([]);
  const zikrItems = ref<ZikrItem[]>([]);
  const searchQuery = ref('');
  const selectedSongs = ref<SongData[]>([]);
  const youtubeLinks = ref<string[]>([]);

  const getAllYoutubeLinks = computed(() => {
    const links: string[] = [];
    
    songs.value.forEach(song => {
      if (song.mainLinks) {
        links.push(...song.mainLinks.filter(link => 
          link.includes('youtube.com') || link.includes('youtu.be')
        ));
      }
      
      if (song.alternateTunes) {
        links.push(...song.alternateTunes.filter(link => 
          link.includes('youtube.com') || link.includes('youtu.be')
        ));
      }
    });
    
    return links;
  });

  const filteredSongs = computed(() => {
    return searchSongs(songs.value, searchQuery.value);
  });

  // Add a new flag to localStorage to track the version of the fix
const CATEGORY_FIX_VERSION = '1.0'; // Increment this if you need to apply the fix again


  const fetchSongs = async (forceRefresh = false) => {
    try {
    // Use new cache keys with a timestamp to force a refresh
    const NEW_CACHE_PREFIX = 'v8_'; // Change this prefix to force a refresh
    
    const cachedSongs = localStorage.getItem(NEW_CACHE_PREFIX + 'cachedSongs')
    const cachedSubcategories = localStorage.getItem(NEW_CACHE_PREFIX + 'cachedSubcategories')
    const cachedCategories = localStorage.getItem(NEW_CACHE_PREFIX + 'cachedCategories')


      if (!forceRefresh && cachedSongs && cachedSubcategories && cachedCategories) {
        songs.value = JSON.parse(cachedSongs);
        setSubcategories(JSON.parse(cachedSubcategories));
        categories.value = JSON.parse(cachedCategories);
         console.log('Loaded categories from cache:', categories.value);
        return categories.value;
      }

      const owner = 'yashineonline';
      const repo = 'ilahiRepository';
      const path = 'ilahi.txt';
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text()
      const { songs: processedSongs, subcategories, zikrItems: processedZikrItems } = processSongsFile(text)
      songs.value = processedSongs
      zikrItems.value = processedZikrItems

      youtubeLinks.value = getAllYoutubeLinks.value;

      // const processedCategories = ['All', CATEGORIES.BASIC, CATEGORIES.INTERMEDIATE];

      
// const processedCategories = getAllCategories(processedSongs).filter(category => {
//   const trimmedCategory = category.trim();
//   if (!trimmedCategory) return false;
//   console.log('trimmedCategory', trimmedCategory);
   
//   return true;
// });


      setSubcategories(subcategories)
      // categories.value = processedCategories // getAllCategories(processedSongs)
     // Store with the new cache keys
    localStorage.setItem(NEW_CACHE_PREFIX + 'cachedSongs', JSON.stringify(songs.value))
    localStorage.setItem(NEW_CACHE_PREFIX + 'cachedSubcategories', JSON.stringify(subcategories))
    localStorage.setItem(NEW_CACHE_PREFIX + 'cachedCategories', JSON.stringify(categories.value))

    console.log('Updated categories with new cache keys:', categories.value) 
    
      return categories.value // Return the categories
    } catch (error) {
      console.error('Error fetching songs:', error)
      songs.value = []
      categories.value = []
      zikrItems.value = []
      youtubeLinks.value = [] // Clear YouTube links on error
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

  const songsWithHistory = computed(() => {
    return songs.value.filter(song => song.lyrics.some(stanza => stanza.some(line => line.includes('History:'))));
  });
  
  function getSongsWithHistory() {
    return songsWithHistory.value;
  }

  return { 
    songs, 
    categories,
    zikrItems,
    filteredSongs, 
    youtubeLinks, // Expose YouTube links
    getAllYoutubeLinks, // Expose computed property
    fetchSongs, 
    setSearchQuery, 
    selectedSongs, 
    selectSong, 
    deselectSong, 
    clearSelectedSongs,
    songsWithHistory,
    getSongsWithHistory
  }
})