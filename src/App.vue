<template>
  <div :class="['min-h-screen flex flex-col', themeStore.theme === 'dark' ? 'dark-theme' : 'light-theme']">
    <header class="bg-green-600 text-white p-4">
      <h1 class="text-2xl font-bold">Ilahi Book App</h1>
    </header>
    <NavigationBar />
    <main class="flex-grow container mx-auto p-4">
      <SearchBar />
      <RouterView />
    </main>
    <footer class="bg-green-600 text-white p-4 mt-8">
      <p class="text-center">&copy; Ilahi App 2024 AQRT. All rights reserved.</p>
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

const themeStore = useThemeStore()
</script>

<style>
@import './style.css';
</style>