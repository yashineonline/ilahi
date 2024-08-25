<template>
    <button @click="themeStore.toggleTheme" class="p-2 rounded-full">
      {{ themeStore.theme === 'light' ? '🌙' : '☀️' }}
    </button>
  </template>
  
  <script setup lang="ts">
  import { useThemeStore } from '../stores/themeStore'
  
  const themeStore = useThemeStore()
  </script>