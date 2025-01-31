// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile } from '../utils/songProcessor'
import { SongData, ZikrItem } from '../utils/types'
import { searchSongs } from '../utils/search'
import { setSubcategories, getAllCategories } from '../utils/categoryUtils'
// import.meta.env.VITE_GITHUB_TOKEN

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

  const fetchSongs = async (forceRefresh = false) => {
    try {
      const cachedSongs = localStorage.getItem('cachedSongs')
      const cachedSubcategories = localStorage.getItem('cachedSubcategories')
      const cachedCategories = localStorage.getItem('cachedCategories')

      if (!forceRefresh && cachedSongs && cachedSubcategories && cachedCategories) {
        songs.value = JSON.parse(cachedSongs);
        setSubcategories(JSON.parse(cachedSubcategories));
        categories.value = JSON.parse(cachedCategories);
        console.log('Loaded categories from cache:', categories.value);
        return categories.value;
      }

      const owner = 'yashineonline';
      const repo = 'ilahiRepository';
      const path = 'ilahiHU.txt';
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          // 'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
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

      setSubcategories(subcategories)
      categories.value = getAllCategories(processedSongs)
      localStorage.setItem('cachedSongs', JSON.stringify(songs.value))
      localStorage.setItem('cachedSubcategories', JSON.stringify(subcategories))
      localStorage.setItem('cachedCategories', JSON.stringify(categories.value))
      console.log('Updated categories:', categories.value) 
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