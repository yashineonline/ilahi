<template>
  <div class="container mx-auto p-4" v-if="currentSong">
    <h1 class="text-4xl font-bold mb-4 text-center text-green-600">{{ currentSong.title }}</h1>
    <div v-if="currentSong">
      <div class="lyrics bg-gray-100 p-6 rounded-lg shadow-lg text-center" :style="{ fontSize: `${fontSize}px` }">
        <h2 class="text-2xl font-semibold mb-4">Lyrics</h2>
        <div v-for="(stanza, index) in currentSong.lyrics" :key="index" class="mb-4">
          <p v-for="line in stanza" :key="line" class="mb-1">{{ line }}</p>
        </div>
      </div>
      <div v-if="showTranslationFlag" class="translation mt-4 bg-gray-100 p-6 rounded-lg shadow-lg text-center" :style="{ fontSize: `${fontSize}px` }">
        <h2 class="text-2xl font-semibold mb-4">Translation</h2>
        <div v-for="(stanza, index) in currentSong.translation" :key="index" class="mb-4">
          <p v-for="line in stanza" :key="line" class="mb-1">{{ line }}</p>
        </div>
      </div>
      <div v-if="currentSong.youtubeLink" class="youtube-link mt-4 text-center">
        <h2 class="text-2xl font-semibold mb-4">YouTube</h2>
        <a :href="currentSong.youtubeLink" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
          Watch on YouTube
        </a>
      </div>
      <div class="qr-code mt-4 flex justify-center">
        <img :src="qrCodeDataUrl" alt="QR Code" class="w-48 h-48" />
      </div>
      <div class="buttons mt-4 flex justify-center space-x-4">
        <button class="btn btn-primary" @click="showTranslation">Toggle Translation</button>
        <button class="btn btn-accent" @click="generatePDF">Generate PDF</button>
      </div>
      <div class="zoom-controls mt-4 flex justify-center space-x-4">
        <button class="btn btn-sm" @click="decreaseFont">A-</button>
        <button class="btn btn-sm" @click="increaseFont">A+</button>
      </div>
    </div>
    <div v-else>Loading song...</div>
  </div>
  <div class="mt-4 text-center text-sm">
    This app is maintained by the AQRT. 
    <a href="https://aqrtsufi.org" target="_blank" class="text-blue-600 hover:underline">Visit aqrtsufi.org</a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useSongStore } from '../stores/songStore'
import { generateSingleSongPDF } from '../utils/pdfGenerator'
import { generateQRCode } from '../utils/qrCodeGenerator'
import { useZoom } from '../utils/zoom'

const route = useRoute()
const songStore = useSongStore()
const showTranslationFlag = ref(false)
const qrCodeDataUrl = ref('')

const currentSong = computed(() => {
  const decodedTitle = decodeURIComponent(route.params.title as string)
  return songStore.songs.find(song => song.title === decodedTitle)
})

// Use the zoom utility
const { fontSize, increaseFont, decreaseFont } = useZoom()

const showTranslation = () => {
  showTranslationFlag.value = !showTranslationFlag.value
}

const generatePDF = async () => {
  if (currentSong.value) {
    try {
      await generateSingleSongPDF(currentSong.value, qrCodeDataUrl.value || '');
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  } else {
    console.error('Current song not available');
  }
}


const loadQRCode = async () => {
  if (currentSong.value?.youtubeLink) {
    qrCodeDataUrl.value = await generateQRCode(currentSong.value.youtubeLink)
  }
}

onMounted(async () => {
  if (songStore.songs.length === 0) {
    await songStore.fetchSongs()
  }
})

watchEffect(() => {
  if (currentSong.value) {
    loadQRCode()
  }
})
</script>