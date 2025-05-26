// songStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { processSongsFile } from '../utils/songProcessor.ts'
import { ZikrItem } from '../utils/types.ts'
import { searchSongs } from '../utils/search.ts'
import { setSubcategories, CATEGORIES, categoryShortcuts } from '../utils/categoryUtils.ts'
import type { SongData } from '@/utils/types'


export interface Categories {
  [key: string]: string[]
}

export type ParsedZikr = Record<string, string[]>;  // Same structure as Categories

// export interface ParsedZikr {
//   [key: string]: string[]
// }




export const useSongStore = defineStore('song', () => {
  // const filteredSongs = ref<SongData[]>([])
  const categories = ref<Categories>({})
  const songs = ref<SongData[]>([]);
  const suggestedZikrs = ref<ParsedZikr>({})
  const zikrItems = ref<ZikrItem[]>([]);
  const searchQuery = ref('');
  const selectedSongs = ref<SongData[]>([]);
  const youtubeLinks = ref<string[]>([]);
  const selectedZikrs = ref<string[]>([]);
  const currentPath = ref('ilahi.txt'); // Default path


  const getAllYoutubeLinks = computed<string[]>(() => {
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

const filteredByZikr = computed(() => {
  console.log('[Store] Selected Zikrs:', selectedZikrs.value);
  if (selectedZikrs.value.length === 0) {
    return songs.value; // Return all songs if no Zikrs are selected
  }

  return songs.value.filter(song => {
    if (song.suggestedZikrs.length === 0) {
      return false; // Skip songs without suggested Zikrs
    }

    return selectedZikrs.value.every(zikr => 
      song.suggestedZikrs.includes(zikr)
    );
  });
  
});

//   if (!selectedZikrs.value.length) {
//     console.log('[Store] No zikrs selected, returning all songs');
//     return songs.value;
//   }

//   const filtered = songs.value.filter(song => {
//     console.log(`[Store] Checking song: "${song.title}"`);
//     console.log('Song zikrs:', song.suggestedZikrs);
    

//     const hasZikr = selectedZikrs.value.some(selectedZikr => 
//       song.suggestedZikrs.includes(selectedZikr) 
//     );
//     console.log(`Song "${song.title}" has matching zikr?`, hasZikr);
//     console.log(`Has matching Zikr? ${hasZikr}`);
//        });

//   console.log('[Store] Filtered songs:', filtered.map(s => s.title));


//   return filtered;
// });




  const filteredSongs = computed(() => {
    return searchSongs(songs.value, searchQuery.value);
  });

  // Add a new flag to localStorage to track the version of the fix
  const CATEGORY_FIX_VERSION = '1.0'; // Increment this if you need to apply the fix again


  const fetchSongs = async (forceRefresh = false, pathOverride?: string) => {
    try {
      // Use new cache keys with a timestamp to force a refresh
      const NEW_CACHE_PREFIX = 'v11_'; // Change this prefix to force a refresh

      // Use the provided path or the currentPath
      const path = pathOverride || currentPath.value || 'ilahi.txt';
      currentPath.value = path;

      const cachedSongs = localStorage.getItem(NEW_CACHE_PREFIX + 'cachedSongs_' + path)
      const cachedSubcategories = localStorage.getItem(NEW_CACHE_PREFIX + 'cachedSubcategories_' + path)
      const cachedCategories = localStorage.getItem(NEW_CACHE_PREFIX + 'cachedCategories_' + path)

      if (!forceRefresh && cachedSongs && cachedSubcategories && cachedCategories) {
        songs.value = JSON.parse(cachedSongs);
        setSubcategories(JSON.parse(cachedSubcategories));
        categories.value = JSON.parse(cachedCategories);
        return categories.value;
      }

      const owner = 'yashineonline';
      const repo = 'ilahiRepository';
      // const path = 'ilahi.txt'; // Now dynamic
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
      const { songs: processedSongs, subcategories, zikrItems: processedZikrItems, allZikrs } = processSongsFile(text)
      songs.value = processedSongs
      zikrItems.value = processedZikrItems
      youtubeLinks.value = getAllYoutubeLinks.value;
      suggestedZikrs.value = allZikrs; // Add this line

      // Properly structure categories as an object with arrays
      const categoriesObj: Categories = {
        'All': [],
        [CATEGORIES.BASIC]: [],
        [CATEGORIES.INTERMEDIATE]: [],
      };
      processedSongs.forEach(song => {
        song.categories.forEach(category => {
          const mainCategory = category.split('/')[0].trim();
          if (!categoriesObj[mainCategory]) {
            categoriesObj[mainCategory] = [];
          }
        });
      });

      categories.value = categoriesObj;
      setSubcategories(subcategories)

      // Store with the new cache keys
      localStorage.setItem(NEW_CACHE_PREFIX + 'cachedSongs_' + path, JSON.stringify(songs.value))
      localStorage.setItem(NEW_CACHE_PREFIX + 'cachedSubcategories_' + path, JSON.stringify(subcategories))
      localStorage.setItem(NEW_CACHE_PREFIX + 'cachedCategories_' + path, JSON.stringify(categories.value))

      return categories.value // Return the categories
    } catch (error) {
      console.error('Error fetching songs:', error)
      songs.value = []
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
    suggestedZikrs,
    selectedZikrs, 
    filteredByZikr,
    zikrItems,
    filteredSongs,
    youtubeLinks, // Expose YouTube links
    getAllYoutubeLinks, // Expose computed property
    fetchSongs,
    setSearchQuery,
    searchQuery,
    selectedSongs,
    selectSong,
    deselectSong,
    clearSelectedSongs,
    songsWithHistory,
    getSongsWithHistory,
    currentPath // Expose currentPath
  }
})