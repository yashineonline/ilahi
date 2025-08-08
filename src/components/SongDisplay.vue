<template>
  <div class="w-full max-w-4xl mx-auto p-2 flex flex-col items-center bg-base-100 text-base-content">
    <div class="w-full flex flex-wrap gap-1 mb-2">
      <PronunciationGuide
        v-if="currentSong"
        :song-id="currentSong.slug"
        :lyrics="currentSong.lyrics"
        @shown="scrollToPronunciation"
      />

      <button @click="slideMode = !slideMode" class="btn btn-primary btn-sm">
     {{ slideMode ? 'show full ilahi' : 'Slide Mode' }}
   </button>
      <button v-if="hasAudioLinks" class="btn btn-primary btn-sm" @click="toggleMusicPlayer">
        <font-awesome-icon :icon="['fas', hideMusicPlayer ? 'music' : 'pause']" class="mr-2" />
        {{ hideMusicPlayer ? 'Show' : 'Hide' }} Music
      </button>
    </div>
    <div class="w-full flex flex-wrap items-center gap-2 mb-4">
      <button 
        v-if="currentSong?.translation && currentSong.translation.length > 0"
        class="btn btn-primary btn-sm" 
        @click="toggleTranslation" 
        :aria-pressed="settings.showTranslation"
      >
        <font-awesome-icon :icon="['fas', 'language']" class="mr-2" />
        {{ settings.showTranslation ? 'Hide' : 'Show' }} Translation
      </button>
      <button 
        v-if="currentSong?.translation && currentSong.translation.length > 0 && settings.showTranslation"
        class="btn btn-outline btn-sm"
        @click="settings.toggleTranslationLayout"
      >
        {{ settings.translationLayout === 'below' ? 'Side-by-side' : 'Below lyrics' }}
      </button>
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
      <div v-if="currentSong.suggestedZikrs && currentSong.suggestedZikrs.length" class="flex flex-wrap gap-2 mb-4 justify-center">
        <span class="text-sm text-gray-500 mr-2 font-medium">Suggested zikr:</span>
        <span v-for="zikr in currentSong.suggestedZikrs" :key="zikr" class="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold border border-green-200">
          {{ zikr }}
        </span>
      </div>
      <div v-if="!hideMusicPlayer && currentSong.mainLinks && currentSong.mainLinks.length > 0" class="mb-4">
        <audio-player
          :audio-src="currentSong.mainLinks[0]"
          :player-type="getPlayerType(currentSong.mainLinks[0])"
          @player-ready="onPlayerReady"
        />
      </div>

      <div v-if="slideMode" class="fixed inset-0 z-50 bg-base-100 text-base-content flex flex-col items-center justify-center">
        <div class="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <div class="flex flex-col items-center w-full max-w-2xl mx-auto">
          <div class="flex justify-between items-center w-full mb-4">
            <button @click="slideMode = false" class="btn btn-circle btn-ghost" aria-label="Back">
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
            </button>
            <h1 class="text-3xl font-bold text-center flex-1">{{ currentSong?.title }}</h1>
            <div style="width:40px;"></div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center w-full mb-4 gap-4">
            <div class="flex items-center gap-0">
              <button @click="decreaseStanzaCount" :disabled="slideCount <= 1" class="btn btn-circle btn-primary text-lg">
                <font-awesome-icon :icon="['fas', 'minus']" />
              </button>
              <span class="text-xl font-bold w-10 text-center select-none">{{ slideCount }}</span>
              <button @click="increaseStanzaCount" :disabled="slideCount >= slides.length" class="btn btn-circle btn-primary text-lg">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </button>
            <span class="mx-4"></span>
              <button @click="decreaseFontSize" :disabled="fontSize <= 12" class="btn btn-circle btn-secondary text-lg">
                <font-awesome-icon :icon="['fas', 'minus']" />
              </button>
              <span class="text-xl font-bold w-10 text-center select-none">{{ fontSize }}</span>
              <button @click="increaseFontSize" :disabled="fontSize >= 132" class="btn btn-circle btn-secondary text-lg">
                <font-awesome-icon :icon="['fas', 'plus']" />
              </button>
            </div>
            <button @click="toggleFullIlahi" class="btn btn-accent btn-sm text-lg">
              {{ showingFullIlahi ? 'By stanza' : 'Full ilahi' }}
            </button>

          </div>
          <transition name="slide" mode="out-in">
            <div :key="currentSlideIndex + '-' + slideCount" class="w-full p-4 overflow-y-auto" :style="{ fontSize: fontSize + 'px', maxHeight: '70vh' }">
              <template v-for="(stanza, idx) in slidesToShow" :key="currentSlideIndex + idx">
                <div v-html="stanza"></div>
                <hr v-if="idx < slidesToShow.length - 1" class="my-2 border-t border-base-300" />
              </template>
            </div>
          </transition>
          <div class="flex justify-center gap-4 mt-4">
            <button @click="prevSlide" :disabled="currentSlideIndex === 0 || showingFullIlahi" class="btn btn-secondary">
              Previous
            </button>
            <button @click="nextSlide" :disabled="currentSlideIndex + slideCount >= slides.length || showingFullIlahi" class="btn btn-secondary">
              Next
            </button>
          </div>
        </div>
      </div>
      <div v-else class="mb-6" v-html="renderedSong"></div>

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
    <div v-else-if="!loading" class="text-center text-xl text-base-content" aria-live="polite">ilahi not found</div>
    <div v-else class="text-center text-xl text-base-content" aria-live="polite">Loading ilahi...</div>
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
import ThemeToggle from './ThemeToggle.vue'
import { useSettingsStore } from '@/stores/settingsStore'

// Add a type for the player
type Player = {
  playVideo: () => void;
  pauseVideo: () => void;
} | null;


library.add(faFilePdf, faQrcode, faMusic, faPause, faLanguage)

// Update the player ref with the correct type
const player = ref<Player>(null);

const playerType = ref<PlayerType | null>(null)
const route = useRoute()
const songStore = useSongStore()
const themeStore = useThemeStore()
const settings = useSettingsStore()
const qrCodeDataUrl = ref('')
const errorMessage = ref('')
const playerError = ref<string | null>(null)
const loading = ref(true)
const showMusicPlayer = computed(() => {
  return hasAudioLinks.value && !hideMusicPlayer.value
})
const hideMusicPlayer = ref(true)
// const player = ref(null)
const isPlaying = ref(false)
const showQRCodeFlag = ref(false)
// const showNoTranslationModal = ref(false)
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
      showTranslation: settings.showTranslation,
      translationLayout: settings.translationLayout,
      theme: themeStore.theme === 'light' ? 'light' : 'dark'
    })
  }
  return ''
})

const toggleTranslation = () => {
  if (currentSong.value?.translation && currentSong.value.translation.length > 0) {
    settings.toggleTranslationVisibility()
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
    //   const songUrl = `${window.location.origin}/songs/${currentSong.value.slug}`;
    const songUrl = `${window.location.origin}${import.meta.env.BASE_URL}player/${currentSong.value.slug}`;
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
  // console.log('Player ready:', playerData);
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
    // if (hasAudioLinks.value) {
    //   // console.log('Detected audio links for this song')
    // } else {
    //   // console.log('No audio links detected for this song')
    // }
  } catch (error) {
    console.error('Error loading song:', error)
    errorMessage.value = 'Failed to load song. Please try again later.'
  } finally {
    loading.value = false
  }
})



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

// Slide mode state
const slideMode = ref(false);
const currentSlideIndex = ref(0);
const slideCount = ref(1);
const previousSlideCount = ref(1);
const showingFullIlahi = computed(() => slideCount.value === slides.value.length);

const slides = computed(() => {
  if (!currentSong.value) return [];
  return currentSong.value.lyrics.map(stanza => stanza.join('<br>'));
});

const slidesToShow = computed(() => {
  return slides.value.slice(currentSlideIndex.value, currentSlideIndex.value + slideCount.value);
});

function prevSlide() {
  currentSlideIndex.value = Math.max(0, currentSlideIndex.value - slideCount.value);
}
function nextSlide() {
  currentSlideIndex.value = Math.min(slides.value.length - slideCount.value, currentSlideIndex.value + slideCount.value);
}
function toggleFullIlahi() {
  if (!showingFullIlahi.value) {
    previousSlideCount.value = slideCount.value;
    slideCount.value = slides.value.length;
    currentSlideIndex.value = 0;
  } else {
    slideCount.value = previousSlideCount.value || 1;
    currentSlideIndex.value = 0;
  }
}

// Reset index and slideCount when toggling slide mode or changing song
watch([slideMode, currentSong], () => {
  currentSlideIndex.value = 0;
  slideCount.value = 1;
  previousSlideCount.value = 1;
});

function increaseStanzaCount() {
  if (slideCount.value < slides.value.length) slideCount.value++;
}
function decreaseStanzaCount() {
  if (slideCount.value > 1) slideCount.value--;
}
function increaseFontSize() {
  if (fontSize.value < 132) fontSize.value += 2;
}
function decreaseFontSize() {
  if (fontSize.value > 12) fontSize.value -= 2;
}

</script>

<style scoped>
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