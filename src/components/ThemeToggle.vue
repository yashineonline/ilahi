<template>
    <div>
    <button @click="toggleTheme" 
    class="p-0 mt-12  rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
    >
    {{ isDark ? '🌙' : '☀️' }}
    </button>
  </div>
  </template>
  
  <script setup lang="ts">
  import { useThemeStore } from '../stores/themeStore'
  import { ref, onMounted } from 'vue'

  const themeStore = useThemeStore()
  const isDark = ref(themeStore.theme === 'dark')


  const toggleTheme = () => {
    themeStore.toggleTheme()
    isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
    // document.body.className = themeStore.theme
  }


onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  // document.body.className = themeStore.theme; // Set initial theme
});
  </script>