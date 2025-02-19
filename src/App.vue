<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-green-600 text-white p-4" v-if="navigationStore.isNavigationVisible">
      <h1 class="text-2xl font-bold">İlahi Book App</h1>
    </header>
    <NavigationBar v-if="navigationStore.isNavigationVisible" />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      
      <SearchBar ref="searchBarRef" v-if="navigationStore.isNavigationVisible" />
      <RouterView />
    </main>
    <footer class="bg-green-600 text-white p-4 mt-8" v-if="navigationStore.isNavigationVisible">
      <VersionDisplay /> <!-- Import and use the Notification component here -->
      <p class="text-center">&copy; 2024-2025 Copyright by AQRT. </p>
       <p class="text-center">İlahi Book App. All rights reserved.</p>
    </footer>
    <ThemeToggle class="fixed top-16 right-4" />

  </div>
</template>

<script setup lang="ts">
import RandomIlahi from './components/RandomIlahi.vue';
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import VersionDisplay from './components/VersionDisplay.vue'; // Import the Notification component
import SearchBar from './components/SearchBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { ref, provide, onMounted } from 'vue'
 import { useNavigationStore } from './stores/navigationStore'
 import { useSongStore } from './stores/songStore';
 import { setupHyperlinkNavigation } from '@/utils/hyperlinkParser';

 const songStore = useSongStore();


setupHyperlinkNavigation();
    // ... other setup code


// Automatically fetch songs when the app is mounted
onMounted(async () => {
  await songStore.fetchSongs();
});

const navigationStore = useNavigationStore()
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)

const resetGlobalSearch = () => {
  if (searchBarRef.value) {
    searchBarRef.value.clearSearch()
  }
}

provide('resetGlobalSearch', resetGlobalSearch)





</script>

<style>
@import './style.css';

</style>