<template>
  <div v-if="hasPronunciation">
    <button 
      @click="togglePronunciation" 
      class="btn btn-primary mb-4"
      :disabled="isGenerating"
      :aria-expanded="showPronunciation"
      aria-controls="pronunciation-guide"
    >
      {{ showPronunciation ? 'Hide' : 'Show' }} Pronunciation Guide
    </button>

    <div v-if="isGenerating" class="text-center" role="status">
      Generating pronunciation guide...
    </div>

    <div v-if="error" class="text-red-500 mb-4" role="alert">
      {{ error }}
    </div>

    <div 
      v-if="showPronunciation && pronunciation" 
      class="pronunciation-container"
      v-html="pronunciation"
      id="pronunciation-guide"
      role="region"
      aria-label="Pronunciation guide"
    >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generatePronunciation } from '../utils/pronunciationService'
import { useSongStore } from '../stores/songStore'

const props = defineProps<{
  songId: string
  lyrics: string[][]
}>()

const songStore = useSongStore()
const showPronunciation = ref(false)
const pronunciation = ref('')
const isGenerating = ref(false)
const error = ref('')
const hasPronunciation = ref(false)

onMounted(async () => {
  // Check if this song has pronunciation data
  const song = songStore.songs.find(s => s.slug === props.songId)
  hasPronunciation.value = song?.pronunciation && song.pronunciation.length > 0
})

const togglePronunciation = async () => {
  showPronunciation.value = !showPronunciation.value
  if (showPronunciation.value && !pronunciation.value) {
    isGenerating.value = true
    try {
      pronunciation.value = await generatePronunciation(props.lyrics)
    } catch (e) {
      error.value = 'Failed to generate pronunciation guide'
      console.error(e)
    } finally {
      isGenerating.value = false
    }
  }
}
</script>

<style scoped lang="postcss">
.pronunciation-container {
  @apply mt-4 bg-white rounded-lg shadow-sm p-6;
}

.pronunciation-container :deep(.stanza-guide) {
  @apply border-l-4 border-primary pl-4 py-2 mb-8;
}

.pronunciation-container :deep(.line-guide) {
  @apply mb-2;
}

.pronunciation-container :deep(.original) {
  @apply text-base font-medium;
}

.pronunciation-container :deep(.phonetic) {
  @apply text-sm text-gray-600 ml-4 font-mono;
}

.pronunciation-container :deep(.phonetic-char) {
  @apply font-semibold text-primary cursor-help;
}

.pronunciation-container :deep(.special-rule) {
  @apply font-semibold text-blue-600 cursor-help;
}

.pronunciation-container :deep(.stanza-break) {
  @apply my-6 border-t border-gray-200;
}

.pronunciation-container :deep(.pronunciation-tips) {
  @apply mt-8 p-4 bg-gray-50 rounded-lg;
}
</style>