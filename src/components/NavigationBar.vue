<template>
  <nav :class="['navbar shadow-lg', themeStore.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800']" aria-label="Main navigation">
    <div class="container mx-auto px-4">
      <div class="flex-1">
        <router-link to="/songs" class="btn btn-ghost normal-case text-xl">View Ilahi List Here</router-link>        
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/book" class="btn btn-primary btn-sm rounded-btn">Download Ilahi Book</router-link></li>
          <li><router-link to="/about" class="btn btn-ghost btn-sm rounded-btn">About Ilahi</router-link></li>
          <li><router-link to="/" class="btn btn-ghost normal-case text-xl" aria-label="Home">Home</router-link></li>          
        </ul>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="refreshSongs" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Refresh
      </button>
        <div class="icon-btn group relative" @touchstart="handleTouchStart($event, 'whatsapp')" @touchend="handleTouchEnd('whatsapp')">
          <a href="https://chat.whatsapp.com/F7vWb3S3qIG2sht3hTPsjp" target="_blank" rel="noopener noreferrer" @click="handleClick">
            <img src="/whatsapp.jpeg" alt="Join Ilahi Classes" class="w-10 h-10" />
          </a>
          <div :class="['hover-text', { 'show-mobile': showWhatsAppText }]">Join Ilahi Classes</div>
        </div>
        <div class="icon-btn group relative" @touchstart="handleTouchStart($event, 'youtube')" @touchend="handleTouchEnd('youtube')">
          <img src="/youtube.jpeg" alt="Play Ilahis" class="w-8 h-8" @click="toggleYouTubeText" />
          <div :class="['hover-text', { 'show-mobile': showYouTubeText }]" @click="openYouTubePlayer">Play Ilahis</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/themeStore'
import { useSongStore } from '../stores/songStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const themeStore = useThemeStore()
const songStore = useSongStore()
const router = useRouter()

const showWhatsAppText = ref(false)
const showYouTubeText = ref(false)
let touchTimer: number | null = null
let touchedElement: HTMLElement | null = null
let lastClickTime = 0;

function refreshSongs() {
  songStore.fetchSongs(true)
}

const handleTouchStart = (event: TouchEvent, type: 'whatsapp' | 'youtube') => {
  const target = event.currentTarget as HTMLElement
  touchedElement = target
  touchTimer = window.setTimeout(() => {
    const link = target.querySelector('a')
    if (link) {
      window.open(link.href, '_blank')
    }
  }, 500) // Long press duration (500ms)

  if (type === 'whatsapp') {
    showWhatsAppText.value = true
  } else {
    showYouTubeText.value = true
  }
}

const handleTouchEnd = (type: 'whatsapp' | 'youtube') => {
  if (touchTimer) {
    clearTimeout(touchTimer)
  }
  setTimeout(() => {
    if (type === 'whatsapp') {
      showWhatsAppText.value = false
    } else {
      showYouTubeText.value = false
    }
  }, 2000) // Hide text after 2 seconds
}

const handleClick = (event: MouseEvent) => {
  const currentTime = new Date().getTime();
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;

  if (isDesktop) {
    if (currentTime - lastClickTime < 300) { // Double click within 300ms
      // Allow the link to open
      lastClickTime = 0;
    } else {
      // Prevent default on first click
      event.preventDefault();
      lastClickTime = currentTime;
    }
  } else {
    // Prevent default behavior on mobile
    event.preventDefault();
  }
}

const toggleYouTubeText = () => {
  showYouTubeText.value = !showYouTubeText.value;
};

const openYouTubePlayer = () => {
  router.push({ name: 'YouTubePlayer' });
};
</script>

<style scoped lang="postcss">
.btn-lg {
  @apply text-lg px-6 py-3 rounded-lg shadow-md;
}

.whatsapp-btn {
  @apply relative flex items-center;
}

.whatsapp-text {
  @apply absolute hidden group-hover:flex flex-col md:flex-row md:items-center md:ml-2 bg-white p-2 rounded shadow-md;
  right: 0;
  top: 100%;
}

@media (min-width: 768px) {
  .whatsapp-text {
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
  }
}

.whatsapp-text span {
  display: block;
  @media (min-width: 768px) {
    display: inline;
    margin-right: 0.25rem;
  }
}

.icon-btn {
  @apply relative inline-block;
}

.hover-text {
  @apply absolute hidden bg-white text-black p-2 rounded shadow-md text-sm whitespace-nowrap;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 768px) {
  .hover-text {
    @apply group-hover:block;
  }
}

.show-mobile {
  @apply block;
}

/* For mobile */
@media (max-width: 767px) {
  .hover-text {
    @apply mt-1 text-center;
  }
}

/* For desktop */
@media (min-width: 768px) {
  .hover-text {
    @apply absolute hidden whitespace-nowrap;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>