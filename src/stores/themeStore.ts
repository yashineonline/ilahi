import { ref, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const storedTheme = localStorage.getItem('theme') as 'light' 
  const theme = ref(storedTheme as 'light' | 'dark')


  // Persist theme changes
  // watch(theme, (val) => {
  //   localStorage.setItem('theme', val)
  //   document.documentElement.classList.toggle('dark', val === 'dark')
  // }, { immediate: true })
  

function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    console.log("Dark class present:", document.documentElement.classList.contains('dark'))

    // Remove both classes first
    document.documentElement.classList.remove('light', 'dark')
    // Then add the correct one
    document.documentElement.classList.add(theme.value)
    
    console.log("Applied theme:", theme.value)
    console.log("HTML classes:", document.documentElement.className)
 
     // Set both class and data-theme for maximum compatibility
     document.documentElement.classList.toggle('dark', theme.value === 'dark')
     document.documentElement.setAttribute('data-theme', theme.value)



    // applyTheme()
  }

  // function applyTheme() {
  //   // This is critical for DaisyUI theme-aware classes
  //   document.documentElement.classList.toggle('dark', theme.value === 'dark')
  // }

  // Initialize theme
  // if (typeof window !== 'undefined') {
  //   applyTheme()
  // }

  return { theme, toggleTheme }
})