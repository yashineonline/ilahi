<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-green-600 text-white p-4">
      <h1 class="text-2xl font-bold">Ilahi Book App</h1>
    </header>
    <NavigationBar />
    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <SearchBar ref="searchBarRef" />
      <RouterView />
    </main>
    <footer class="bg-green-600 text-white p-4 mt-8">
      <p class="text-center">&copy; AQRT Ilahi Book App 2024. All rights reserved.</p>
    </footer>
    <ThemeToggle class="fixed bottom-4 right-4" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from './components/NavigationBar.vue'
import SearchBar from './components/SearchBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { useThemeStore } from './stores/themeStore'
import { ref, provide } from 'vue'

const themeStore = useThemeStore()
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