<template>
  <div :class="['container', 'mx-auto', 'p-4', 'flex', 'flex-col', 'items-center', themeStore.theme === 'dark' ? 'bg-gray-800' : 'bg-white']">
    <div class="w-full flex justify-between items-center mb-4">
      <div class="flex flex-col space-y-2 w-full">
        <router-link to="/songs" class="btn btn-secondary self-start">Back to Ilahi List</router-link>
        <div class="flex justify-end space-x-2">
          <button class="btn btn-primary" @click="showTranslation" :aria-pressed="showTranslationFlag">
            {{ showTranslationFlag ? 'Hide' : 'Show' }} Translation
          </button>
          <button class="btn btn-accent" @click="generatePDF">Generate PDF</button>
          <button class="btn btn-outline" @click="decreaseFont">Smaller</button>
          <button class="btn btn-outline" @click="increaseFont">Bigger</button>
          <button v-if="currentSong?.audioLink" class="btn btn-primary" @click="toggleMusicPlayer">
            {{ hideMusicPlayer ? 'Show' : 'Hide' }} Music Player
          </button>
          <button v-if="currentSong?.audioLink" class="btn btn-secondary" @click="showQRCode">
            Get QR Code
          </button>
        </div>
      </div>
    </div>
    <div v-if="currentSong" class="w-full max-w-3xl">
      <h1 class="text-3xl font-bold mb-4 text-center">{{ currentSong.title }}</h1>
      <div v-if="showMusicPlayer && currentSong.audioLink" class="mt-4 w-full max-w-3xl mb-6">
        <h2 class="text-2xl font-semibold mb-2">Music Player</h2>
        <audio-player
          :audio-src="currentSong.audioLink"
          :player-type="getPlayerType(currentSong.audioLink)"
          @player-ready="onPlayerReady"
        />
        <div v-if="playerType !== 'googledrive'" class="mt-2 flex justify-center space-x-2">
          <button @click="playPause" class="btn btn-primary">{{ isPlaying ? 'Pause' : 'Play' }}</button>
          <button @click="seekBackward" class="btn btn-secondary">-5s</button>
          <button @click="seekForward" class="btn btn-secondary">+5s</button>
          <button @click="decreaseSpeed" class="btn btn-secondary">Slower</button>
          <button @click="increaseSpeed" class="btn btn-secondary">Faster</button>
        </div>
      </div>
      <div class="mb-6" v-html="renderedSong"></div>
      <div v-if="showQRCodeFlag && qrCodeDataUrl && isYoutubeLink(currentSong.audioLink)" class="mt-4 text-center">
        <h3 class="text-xl font-semibold mb-2">QR Code for YouTube Link</h3>
        <img :src="qrCodeDataUrl" alt="QR Code" class="mx-auto" />
      </div>
    </div>
    <div v-else-if="!loading" class="text-center text-xl text-base-content" aria-live="polite">Song not found</div>
    <div v-else class="text-center text-xl text-base-content" aria-live="polite">Loading song...</div>
    <div v-if="errorMessage || playerError" class="mt-4 p-4 bg-error text-error-content rounded-lg" role="alert" aria-live="assertive">
      {{ errorMessage || playerError }}
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
import AudioPlayer from './AudioPlayer.vue'
import { slugify } from '../utils/search';

const route = useRoute()
const songStore = useSongStore()
const themeStore = useThemeStore()
const showTranslationFlag = ref(false)
const qrCodeDataUrl = ref('')
const errorMessage = ref('')
const playerError = ref<string | null>(null)
const loading = ref(true)
const showMusicPlayer = computed(() => {
  return !!currentSong.value?.audioLink && !hideMusicPlayer.value
})
const hideMusicPlayer = ref(false)
const player = ref(null)
const isPlaying = ref(false)
const showQRCodeFlag = ref(false)
const playerType = ref<'youtube' | 'audio' | 'googledrive' | null>(null)

const currentSong = computed(() => {
  const slugParam = route.params.slug as string;
  return songStore.songs.find(song => slugify(song.title) === slugParam);
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
  if (currentSong.value?.audioLink && isYoutubeLink(currentSong.value.audioLink)) {
    try {
      qrCodeDataUrl.value = await generateQRCode(currentSong.value.audioLink)
    } catch (error) {
      console.error('Error generating QR code:', error);
      errorMessage.value = 'Failed to generate QR code. YouTube link may be unavailable.';
    }
  }
}

const toggleMusicPlayer = () => {
  hideMusicPlayer.value = !hideMusicPlayer.value
}

const onPlayerReady = (playerData: { player: any, type: 'youtube' | 'audio' | 'googledrive' }) => {
  player.value = playerData.player;
  playerType.value = playerData.type;
}

const playPause = () => {
  if (player.value && playerType.value !== 'googledrive') {
    if (isPlaying.value) {
      player.value.pauseVideo();
    } else {
      player.value.playVideo();
    }
    isPlaying.value = !isPlaying.value;
  }
}

const seekBackward = () => {
  if (player.value && playerType.value !== 'googledrive') {
    const currentTime = player.value.getCurrentTime()
    player.value.seekTo(currentTime - 5, true)
  }
}

const seekForward = () => {
  if (player.value && playerType.value !== 'googledrive') {
    const currentTime = player.value.getCurrentTime()
    player.value.seekTo(currentTime + 5, true)
  }
}

const decreaseSpeed = () => {
  if (player.value && playerType.value !== 'googledrive') {
    const currentRate = player.value.getPlaybackRate()
    player.value.setPlaybackRate(Math.max(0.25, currentRate - 0.25))
  }
}

const increaseSpeed = () => {
  if (player.value && playerType.value !== 'googledrive') {
    const currentRate = player.value.getPlaybackRate()
    player.value.setPlaybackRate(Math.min(2, currentRate + 0.25))
  }
}

const showQRCode = async () => {
  if (currentSong.value?.audioLink && !qrCodeDataUrl.value) {
    await loadQRCode()
  }
  showQRCodeFlag.value = true
}

const isYoutubeLink = (url: string) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function getPlayerType(url: string): 'youtube' | 'audio' | 'googledrive' {
  if (isYoutubeLink(url)) {
    return 'youtube';
  } else if (url.includes('drive.google.com')) {
    return 'googledrive';
  } else {
    return 'audio';
  }
}

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    loading.value = true;
    await songStore.fetchSongs();
    if (currentSong.value) {
      loadQRCode();
    }
    loading.value = false;
  }
});

onMounted(async () => {
  loading.value = true
  try {
    if (songStore.songs.length === 0) {
      await songStore.fetchSongs()
    }
    if (currentSong.value) {
      loadQRCode()
    }
    if (currentSong.value?.audioLink) {
      console.log('Detected audio link:', currentSong.value.audioLink)
    } else {
      console.log('No audio link detected for this song')
    }
  } catch (error) {
    console.error('Error loading song:', error)
    errorMessage.value = 'Failed to load song. Please try again later.'
  } finally {
    loading.value = false
  }
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