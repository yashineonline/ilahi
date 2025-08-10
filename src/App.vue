<template>
    <div class="min-h-screen flex flex-col bg-base-100 text-base-content">
  <!-- <div class="min-h-screen flex flex-col"> -->
    <header class="bg-green-600 text-white p-4" v-if="navigationStore.isNavigationVisible">
      <h1 class="text-2xl font-bold">ilahi Book App</h1>
    </header>
    <NavigationBar v-if="navigationStore.isNavigationVisible" />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      
      <SearchBar ref="searchBarRef" v-if="navigationStore.isNavigationVisible" />
      <RouterView />

      <transition name="fade">
    <button 
      v-show="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 btn btn-lg btn-primary shadow-2xl w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform"
      :class="{'bg-primary text-primary-content': true}"
      aria-label="Scroll to top"
    >
    <font-awesome-icon icon="chevron-up" class="text-2xl" />
  </button>
  </transition>
    </main>
    <footer class="bg-green-600 text-white p-4 mt-8" v-if="navigationStore.isNavigationVisible">
      <button 
          @click="refreshSongs" 
          class="btn btn-ghost btn-circle" 
          aria-label="Update ilahi list and clear cache">
          <font-awesome-icon :icon="['fas', 'rotate']" spin style="color: #17a6ee;" aria-hidden="true" />
        </button>
      <VersionDisplay /> <!-- Import and use the Notification component here -->
      <p class="text-center">&copy; 2024-2025 Copyright by AQRT. </p>
       <p class="text-center">ilahi Book App. All rights reserved.</p>
    </footer>
    <ThemeToggle class="fixed top-16 right-4" />

  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import VersionDisplay from './components/VersionDisplay.vue'; // Import the Notification component
import SearchBar from './components/SearchBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { ref, provide, onMounted, onUnmounted } from 'vue'
 import { useNavigationStore } from './stores/navigationStore'
 import { useSongStore } from './stores/songStore';
 import { setupHyperlinkNavigation, initializePoemCache } from '@/utils/hyperlinkParser';
 import { useThemeStore } from './stores/themeStore'
 import { usePoemStore } from './stores/poemStore';

const poemStore = usePoemStore();
const songStore = useSongStore();
const navigationStore = useNavigationStore()
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const showScrollTop = ref(false)
const themeStore = useThemeStore()
  // const props = defineProps<{ filePath?: string }>();


setupHyperlinkNavigation();
    // ... other setup code


// Automatically fetch songs when the app is mounted
onMounted(async () => {
  await songStore.fetchSongs();
  await initializePoemCache(false); // Add this line
  // refreshSongs();
  document.documentElement.classList.toggle('dark', themeStore.theme === 'dark')
});

const resetGlobalSearch = () => {
  if (searchBarRef.value) {
    searchBarRef.value.clearSearch()
  }
}

provide('resetGlobalSearch', resetGlobalSearch)

function refreshSongs() {
  songStore.fetchSongs(true, songStore.currentPath || 'ilahi.txt');
  // songStore.fetchSongs(true)
  // Also refresh poems
  // Clear all caches and reload
  refreshPoems();
  clearAppCache();
}

// Add this new function
async function clearAppCache() {
  try {
    // Clear localStorage caches
    localStorage.removeItem('v1_cachedPoems');
    localStorage.removeItem('cachedSongs');
    
    // Clear service worker cache
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    // Force service worker update
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
    }
    
    // Reload the page to get fresh content
    window.location.reload();
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}





// Add this new function
async function refreshPoems() {
  console.log('🔄 refreshPoems called');
  localStorage.removeItem('v1_cachedPoems'); // Force clear cache
  await initializePoemCache(true); // Force refresh
  // await poemStore.fetchPoems(true); // this line could work too.
}




const checkScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Add scroll listener
onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})


</script>

<!-- <style scoped>
@import './style.css';

</style> -->