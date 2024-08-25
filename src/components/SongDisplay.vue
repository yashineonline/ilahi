<template>
  <div :class="['container', 'mx-auto', 'p-4', 'flex', 'flex-col', 'items-center', themeStore.theme === 'dark' ? 'bg-gray-800' : 'bg-white']">
    <router-link to="/songs" class="btn btn-secondary mb-4 self-start">Back to Song List</router-link>
    <div v-if="currentSong" class="w-full max-w-3xl">
      <h1 class="text-3xl font-bold mb-4 text-center">{{ currentSong.title }}</h1>
      <div class="mb-6" v-html="renderedSong"></div>
      <div class="qr-code mb-6 flex justify-center" aria-hidden="true">
        <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="" class="w-48 h-48" />
      </div>
      <div class="buttons mb-6 flex justify-center space-x-4" role="group" aria-label="Song actions">
        <button class="btn btn-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="showTranslation" :aria-pressed="showTranslationFlag">
          {{ showTranslationFlag ? 'Hide' : 'Show' }} Translation
        </button>
        <button class="btn btn-accent focus:ring-2 focus:ring-offset-2 focus:ring-accent" @click="generatePDF">Generate PDF</button>
      </div>
      <div class="zoom-controls mb-6 flex justify-center space-x-4" role="group" aria-label="Font size controls">
        <button class="btn btn-sm btn-outline focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="decreaseFont" aria-label="Decrease font size">A-</button>
        <button class="btn btn-sm btn-outline focus:ring-2 focus:ring-offset-2 focus:ring-primary" @click="increaseFont" aria-label="Increase font size">A+</button>
      </div>
    </div>
    <div v-else-if="!loading" class="text-center text-xl text-base-content" aria-live="polite">Song not found</div>
    <div v-else class="text-center text-xl text-base-content" aria-live="polite">Loading song...</div>
    <div v-if="errorMessage" class="mt-4 p-4 bg-error text-error-content rounded-lg" role="alert" aria-live="assertive">
      {{ errorMessage }}
    </div>
    <div class="mt-6 text-center text-sm text-base-content">
      This app is maintained by the AQRT. 
      <a href="https://aqrtsufi.org" target="_blank" rel="noopener noreferrer" class="link link-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary">Visit aqrtsufi.org</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useSongStore } from '../stores/songStore'
import { useThemeStore } from '../stores/themeStore'
import { generateSingleSongPage } from '../utils/singleSongPDF'
import { generateQRCode } from '../utils/qrCodeGenerator'
import { useZoom } from '../utils/zoom'
import { renderSong } from '../utils/songProcessor'
import { PDFDocument as PDFLib, StandardFonts } from 'pdf-lib'
import { downloadPDF } from '../utils/pdfBookUtils'

const route = useRoute()
const songStore = useSongStore()
const themeStore = useThemeStore()
const showTranslationFlag = ref(false)
const qrCodeDataUrl = ref('')
const errorMessage = ref('')
const loading = ref(true)

const currentSong = computed(() => {
  const decodedTitle = decodeURIComponent(route.params.title as string)
  return songStore.songs.find(song => song.title === decodedTitle)
})

const { fontSize, increaseFont, decreaseFont } = useZoom()

const renderedSong = computed(() => {
  if (currentSong.value) {
    return renderSong(currentSong.value, { 
      fontSize: fontSize.value, 
      showTranslation: showTranslationFlag.value,
      theme: themeStore.theme
    })
  }
  return ''
})

const showTranslation = () => {
  showTranslationFlag.value = !showTranslationFlag.value
}

const generatePDF = async () => {
  if (currentSong.value) {
    try {
      const pdfDoc = await PDFLib.create();
      await generateSingleSongPage(pdfDoc, currentSong.value);
      const pdfBytes = await pdfDoc.save();
      
      await downloadPDF(pdfBytes, `${currentSong.value.title}.pdf`);
      
      errorMessage.value = '';
    } catch (error) {
      console.error('Error generating PDF:', error);
      errorMessage.value = 'Failed to generate PDF. Please try again later.';
    }
  } else {
    errorMessage.value = 'Song data is not available. Please try reloading the page.';
  }
}

const loadQRCode = async () => {
  if (currentSong.value?.youtubeLink) {
    try {
      qrCodeDataUrl.value = await generateQRCode(currentSong.value.youtubeLink)
    } catch (error) {
      console.error('Error generating QR code:', error);
      errorMessage.value = 'Failed to generate QR code. YouTube link may be unavailable.';
    }
  }
}

watch(() => route.params.title, async () => {
  loading.value = true
  await songStore.fetchSongs()
  if (currentSong.value) {
    loadQRCode()
  }
  loading.value = false
})

onMounted(async () => {
  loading.value = true
  if (songStore.songs.length === 0) {
    try {
      await songStore.fetchSongs()
    } catch (error) {
      console.error('Error fetching songs:', error);
      errorMessage.value = 'Failed to load songs. Please try reloading the page.';
    }
  }
  if (currentSong.value) {
    loadQRCode()
  }
  loading.value = false
})
</script>

<style scoped>
p {
  line-height: 1.6;
}

:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
</style>