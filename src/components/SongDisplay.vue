<template>
  <div class="container mx-auto p-4">
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
      <div class="youtube-link mt-4 text-center">
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
    This app is maintained by the AQRT. Your donations are most welcome. 
    <a href="https://aqrtsufi.org" target="_blank" class="text-blue-600 hover:underline">Visit aqrtsufi.org</a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSongStore } from '../stores/songStore'
import { generateSingleSongPDF } from '../utils/pdfGenerator'
import { generateQRCode } from '../utils/qrCodeGenerator'
import { useZoom } from '../utils/Zoom'

const songStore = useSongStore()
const currentSong = computed(() => songStore.songs[0])
const showTranslationFlag = ref(false)
const qrCodeDataUrl = ref('')

// Use the zoom utility
const { fontSize, increaseFont, decreaseFont } = useZoom()

const showTranslation = () => {
  showTranslationFlag.value = !showTranslationFlag.value
}

const generatePDF = async () => {
  if (currentSong.value) {
    await generateSingleSongPDF(currentSong.value, qrCodeDataUrl.value)
  }
}

onMounted(async () => {
  if (currentSong.value?.youtubeLink) {
    qrCodeDataUrl.value = await generateQRCode(currentSong.value.youtubeLink)
  }
})
</script>