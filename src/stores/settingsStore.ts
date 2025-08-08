import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type TranslationLayout = 'below' | 'side'

export const useSettingsStore = defineStore('settings', () => {
  const storedShowTranslation = localStorage.getItem('showTranslation')
  const storedLayout = localStorage.getItem('translationLayout') as TranslationLayout | null

  const showTranslation = ref(storedShowTranslation ? storedShowTranslation === 'true' : false)
  const translationLayout = ref<TranslationLayout>(storedLayout ?? 'below')

  watch(showTranslation, (val) => {
    localStorage.setItem('showTranslation', String(val))
  }, { immediate: true })

  watch(translationLayout, (val) => {
    localStorage.setItem('translationLayout', val)
  }, { immediate: true })

  function toggleTranslationVisibility () {
    showTranslation.value = !showTranslation.value
  }

  function toggleTranslationLayout () {
    translationLayout.value = translationLayout.value === 'below' ? 'side' : 'below'
  }

  return {
    showTranslation,
    translationLayout,
    toggleTranslationVisibility,
    toggleTranslationLayout,
  }
}) 