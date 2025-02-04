<template>
    <div>
    <button @click="toggleTheme" class="p-2 rounded-full">
      {{ themeStore.theme === 'light-theme' ? '🌙' : '☀️' }}
    </button>
  </div>
  </template>
  
  <script setup lang="ts">
  import { useThemeStore } from '../stores/themeStore'
  import { ref, onMounted } from 'vue'

  const themeStore = useThemeStore()

  const toggleTheme = () => {
    themeStore.toggleTheme()
    document.body.className = themeStore.theme
  }


onMounted(() => {
  document.body.className = themeStore.theme; // Set initial theme

});
  </script>