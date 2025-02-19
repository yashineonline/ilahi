<template>
  <div class="w-full max-w-4xl mx-auto p-2 flex flex-col items-center">
    <div class="w-full flex flex-wrap gap-1 mb-2">
      <PronunciationGuide
        v-if="currentSong"
        :song-id="currentSong.slug"
        :lyrics="currentSong.lyrics"
        @shown="scrollToPronunciation"
      />
      <button v-if="hasAudioLinks" class="btn btn-primary btn-sm" @click="toggleMusicPlayer">
        <font-awesome-icon :icon="['fas', hideMusicPlayer ? 'music' : 'pause']" class="mr-2" />
        {{ hideMusicPlayer ? 'Show' : 'Hide' }} Music
      </button>
    </div>
    <div class="w-full flex flex-wrap items-center gap-2 mb-4">
      <button 
        v-if="currentSong?.translation && currentSong.translation.length > 0"
        class="btn btn-primary btn-sm" 
        @click="showTranslation" 
        :aria-pressed="showTranslationFlag"
      >
        <font-awesome-icon :icon="['fas', 'language']" class="mr-2" />
        {{ showTranslationFlag ? 'Hide' : 'Show' }} Translation
      </button>
      <Modal v-if="showNoTranslationModal" @close="showNoTranslationModal = false">
    <p>Translation of this ilahi will be available in future insha Allah.</p>
  </Modal>
      <div class="flex items-center gap-2">
        <span class="text-sm">Smaller</span>
        <input 
          type="range" 
          min="12" 
          max="132" 
          :value="fontSize" 
          class="range range-xs range-primary custom-range" 
          @input="updateFontSize"
        />
        <span class="normal-case">Larger</span>
      </div>
    </div>
    <div v-if="currentSong" class="w-full">
      <h1 class="text-3xl font-bold mb-4 text-center">{{ currentSong.title }}</h1>
      <div v-if="!hideMusicPlayer && currentSong.mainLinks && currentSong.mainLinks.length > 0" class="mb-4">
        <audio-player
          :audio-src="currentSong.mainLinks[0]"
          :player-type="getPlayerType(currentSong.mainLinks[0])"
          @player-ready="onPlayerReady"
        />
      </div>
      <div class="mb-6" v-html="renderedSong"></div>
      <div v-if="!hideMusicPlayer && currentSong.mainLinks && currentSong.mainLinks.length > 1" class="mt-4">
        <h2 class="text-2xl font-semibold mb-2">More Versions</h2>
        <div v-for="(link, index) in currentSong.mainLinks.slice(1)" :key="index" class="mb-2">
          <audio-player
            :audio-src="link"
            :player-type="getPlayerType(link)"
            @player-ready="onPlayerReady"
          />
        </div>
      </div>
      <div v-if="!hideMusicPlayer && currentSong.alternateTunes && currentSong.alternateTunes.length > 0" class="mt-4">
        <h2 class="text-2xl font-semibold mb-2">Alternate Tunes</h2>
        <div v-for="link in currentSong.alternateTunes" :key="link" class="mb-2">
          <audio-player
            :audio-src="link"
            :player-type="getPlayerType(link)"
            @player-ready="onPlayerReady"
          />
        </div>
      </div>
      <div v-if="showQRCodeFlag && qrCodeDataUrl" class="mt-4 text-center">
        <h3 class="text-xl font-semibold mb-2">QR Code For This ilahi</h3>
        <img :src="qrCodeDataUrl" alt="QR Code" class="mx-auto" />
      </div>
    </div>
    <div v-else-if="!loading" class="text-center text-xl text-base-content" aria-live="polite">Song not found</div>
    <div v-else class="text-center text-xl text-base-content" aria-live="polite">Loading song...</div>
    <div v-if="errorMessage || playerError" class="mt-4 p-4 bg-error text-error-content rounded-lg" role="alert" aria-live="assertive">
      {{ errorMessage || playerError }}
    </div>
    <div class="w-full flex flex-wrap items-center gap-4 mb-4">
      <button class="btn btn-accent" @click="generatePDF">
        <font-awesome-icon :icon="['fas', 'file-pdf']" class="mr-2" size="2xl" />
      </button>
      <button v-if="hasAudioLinks" class="btn btn-secondary" @click="showQRCode">
        <font-awesome-icon :icon="['fas', 'qrcode']" class="mr-2" size="2xl" />
      </button>
    </div>

    <div class="mt-6 text-center text-sm text-base-content">
      This app is maintained by the AQRT. 
      <a href="https://aqrtsufi.org" target="_blank" rel="noopener noreferrer" class="link link-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary">Visit aqrtsufi.org</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilePdf, faQrcode, faMusic, faPause, faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { PlayerType } from './AudioPlayer.vue' // Assuming you've exported this type from AudioPlayer.vue
import PronunciationGuide from './PronunciationGuide.vue'
// import { parseHyperlinks } from '@/utils/hyperlinkParser.ts';
// import { useHyperlinkNavigation } from '@/composables/useHyperlinkNavigation';




library.add(faFilePdf, faQrcode, faMusic, faPause, faLanguage)

const playerType = ref<PlayerType | null>(null)
const route = useRoute()
const songStore = useSongStore()
const themeStore = useThemeStore()
const showTranslationFlag = ref(false)
const qrCodeDataUrl = ref('')
const errorMessage = ref('')
const playerError = ref<string | null>(null)
const loading = ref(true)
const showMusicPlayer = computed(() => {
  return hasAudioLinks.value && !hideMusicPlayer.value
})
const hideMusicPlayer = ref(true)
const player = ref(null)
const isPlaying = ref(false)
const showQRCodeFlag = ref(false)
const showNoTranslationModal = ref(false)
// const { navigateToContent } = useHyperlinkNavigation();

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
      theme: themeStore.theme === 'light-theme' ? 'light' : 'dark'
    })
  }
  return ''
})

const showTranslation = () => {
  if (currentSong.value?.translation && currentSong.value.translation.length > 0) {
    showTranslationFlag.value = !showTranslationFlag.value;
  } else {
    showNoTranslationModal.value = true;
  }
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

const hasAudioLinks = computed(() => {
  return (currentSong.value?.mainLinks && currentSong.value.mainLinks.length > 0) ||
         (currentSong.value?.alternateTunes && currentSong.value.alternateTunes.length > 0);
});

const currentAudioLink = computed(() => {
  if (currentSong.value?.mainLinks && currentSong.value.mainLinks.length > 0) {
    return currentSong.value.mainLinks[0];
  }
  if (currentSong.value?.alternateTunes && currentSong.value.alternateTunes.length > 0) {
    return currentSong.value.alternateTunes[0];
  }
  return '';
});

const loadQRCode = async () => {
  if (currentSong.value) {
    const songUrl = `${window.location.origin}/songs/${currentSong.value.slug}`;
    try {
      qrCodeDataUrl.value = await generateQRCode(songUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      errorMessage.value = 'Failed to generate QR code.';
    }
  }
}


const toggleMusicPlayer = () => {
  hideMusicPlayer.value = !hideMusicPlayer.value
}

const onPlayerReady = (playerData: { player: any, type: PlayerType }) => {
  player.value = playerData.player;
  playerType.value = playerData.type;
  // You might want to handle multiple players differently
  console.log('Player ready:', playerData);
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


const showQRCode = async () => {
  if (currentSong.value) {
    if (!qrCodeDataUrl.value) {
      await loadQRCode();
    }
    showQRCodeFlag.value = true;
  }
}


const isYoutubeLink = (url: string) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function getPlayerType(url: string): 'youtube' | 'audio' | 'googledrive' | 'soundcloud' {
  if (isYoutubeLink(url)) {
    return 'youtube';
  } else if (url.includes('drive.google.com')) {
    return 'googledrive';
  } else if (url.includes('soundcloud.com')) {
    return 'soundcloud';
  } else {
    return 'audio';
  }
}
const getLinkType = (url: string) => {
  if (isYoutubeLink(url)) return 'YouTube';
  if (url.includes('soundcloud.com')) return 'SoundCloud';
  if (url.includes('drive.google.com')) return 'Google Drive';
  return 'Listen';
}

// Modify the computed property to get all YouTube links
const youtubeLinks = computed(() => {
  const links: string[] = [];
  
  if (currentSong.value?.mainLinks) {
    links.push(...currentSong.value.mainLinks.filter(link => 
      link.includes('youtube.com') || link.includes('youtu.be')
    ));
  }
  
  if (currentSong.value?.alternateTunes) {
    links.push(...currentSong.value.alternateTunes.filter(link => 
      link.includes('youtube.com') || link.includes('youtu.be')
    ));
  }
  
  return links;
});

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
      songStore.fetchSongs(true)
    }
    if (currentSong.value) {
      loadQRCode()
    }
    if (hasAudioLinks.value) {
      console.log('Detected audio links for this song')
    } else {
      console.log('No audio links detected for this song')
    }
  } catch (error) {
    console.error('Error loading song:', error)
    errorMessage.value = 'Failed to load song. Please try again later.'
  } finally {
    loading.value = false
  }
})

// onMounted(() => {
//   document.addEventListener('click', (e) => {
//     const target = e.target as HTMLElement;
//     if (target.classList.contains('hyperlink')) {
//       e.preventDefault();
//       const slug = target.getAttribute('data-slug');
//       if (slug) {
//         navigateToContent(slug);
//       }
//     }
//   });
// });

// const renderedLyrics = computed(() => {
//   return currentSong.value.lyrics.map(stanza => 
//     stanza.map(line => parseHyperlinks(line)).join('<br>')
//   ).join('<br><br>');
// });

// const renderedLyrics = computed(() => {
//   return currentSong.value.lyrics.map(stanza =>
//     stanza.map(line => parseHyperlinks(line)).join('<br>')
//   ).join('<br><br>');
// });


const updateFontSize = (event: Event) => {
  const newSize = parseInt((event.target as HTMLInputElement).value);
  fontSize.value = newSize;
}

const scrollToHistory = () => {
  if (route.hash === '#history') {
    nextTick(() => {
      const historyElement = document.getElementById('history');
      if (historyElement) {
        historyElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

const scrollToPronunciation = () => {
  nextTick(() => {
    const pronunciationElement = document.getElementById('pronunciation')
    if (pronunciationElement) {
      pronunciationElement.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

onMounted(scrollToHistory);
watch(() => route.hash, scrollToHistory);
</script>

<style scoped>
.container {
  background-color: var(--bg-color);
  color: var(--text-color);
}

p {
  line-height: 1.6;
}

:deep(*:focus) {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.card-body {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.custom-range {
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.custom-range:hover {
  opacity: 1;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4CAF50;
  cursor: pointer;
  border-radius: 50%;
}

.custom-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4CAF50;
  cursor: pointer;
  border-radius: 50%;
}


</style>