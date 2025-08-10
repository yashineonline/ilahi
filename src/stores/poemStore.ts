import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchAllPoems } from '../utils/poemFetcher';

export const usePoemStore = defineStore('poems', () => {
  const authors = ref<any[]>([]);
  const loading = ref(false);
  const error = ref('');

  async function fetchPoems(forceRefresh = false) {
    loading.value = true;
    error.value = '';
    
    try {
      // Clear cache if forcing refresh
      if (forceRefresh) {
        localStorage.removeItem('v1_cachedPoems');
      }
      
      authors.value = await fetchAllPoems();
    } catch (err) {
      console.error('Error fetching poems:', err);
      error.value = 'Failed to load poems. Please try again later.';
    } finally {
      loading.value = false;
    }
  }

  return { authors, loading, error, fetchPoems };
});