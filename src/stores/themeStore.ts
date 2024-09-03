import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light-theme' | 'dark-theme'>('light-theme')

  function toggleTheme() {
    theme.value = theme.value === 'light-theme' ? 'dark-theme' : 'light-theme'
    document.body.className = theme.value
  }

  return { theme, toggleTheme }
})