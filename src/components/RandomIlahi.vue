<!-- src/components/RandomIlahi.vue -->
<template>
    <div v-if="loading" class="text-center">
      <p class="text-neutral-content">Loading ilahi of the day...</p>
    </div>
    <div v-else-if="error" class="text-center">
      <p class="text-error">Failed to load ilahi. Showing default ilahi.</p>
      <button 
        @click="navigateToIlahi" 
        class="btn btn-link text-primary hover:text-primary-focus focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Navigate to default ilahi"
      >
        {{ randomIlahi.title }}
      </button>
    </div>
    <div v-else class="random-ilahi text-center">
      <h2 class="text-xl text-red-600 font-semibold mb-2">EID MUBARAK</h2>
      <h2 class="text-xl font-semibold mb-2">ilahi of the Day</h2>
      <button
        @click="navigateToIlahi"
        class="btn btn-link text-primary hover:text-primary-focus text-lg focus:ring-2 focus:ring-primary focus:ring-offset-2"
        :aria-label="`Navigate to ${randomIlahi.title}`"
      >
        {{ randomIlahi.title }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSongStore } from '../stores/songStore';
  
  const DEFAULT_ILAHI = {
  title: 'Asma ul Husna - Kadiri Esma',
  slug: 'asma-ul-husna-kadiri-esma'
};
  const songStore = useSongStore();
  const router = useRouter();
  const randomIlahi = ref(DEFAULT_ILAHI);
const loading = ref(true);
const error = ref(false);
  
  const getRandomIlahi = () => {
    try {
    const songs = songStore.songs; 
    if (!songs || songs.length === 0) {
      throw new Error('No songs available');
    }
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem('randomIlahiDate');
      const storedIlahi = localStorage.getItem('randomIlahi');
  
      if (storedDate === today && storedIlahi) {
        randomIlahi.value = JSON.parse(storedIlahi);
      } else {
        const randomIndex = Math.floor(Math.random() * songs.length);
        randomIlahi.value = songs[randomIndex];
        localStorage.setItem('randomIlahiDate', today);
        localStorage.setItem('randomIlahi', JSON.stringify(randomIlahi.value));
      }
    } 
    catch (e) {
    console.error('Error getting random ilahi:', e);
    error.value = true;
    randomIlahi.value = DEFAULT_ILAHI;
  } finally {
    loading.value = false;
  }
  };
  
const navigateToIlahi = () => {
  try {
    if (randomIlahi.value) {
      router.push({ name: 'SongDisplay', params: { slug: randomIlahi.value.slug } });
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to home or song list
    router.push({ name: 'Home' });
  }
};


  
  // Watch for songs to be loaded
watch(() => songStore.songs, (newSongs) => {
  if (newSongs && newSongs.length > 0) {
    getRandomIlahi();
  }
}, { immediate: true });

onMounted(() => {
  // If songs are already loaded, get random ilahi immediately
  if (songStore.songs && songStore.songs.length > 0) {
    getRandomIlahi();
  }
});
  </script>
  
  <style scoped>
  .random-ilahi {
    cursor: pointer;
    text-align: center;
  }
  </style>