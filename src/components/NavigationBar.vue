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
        <div class="icon-btn group relative" @click="handleIconClick('whatsapp')">
          <img src="/whatsapp.jpeg" alt="Join Ilahi Classes" class="w-10 h-10" />
        </div>
        <div class="icon-btn group relative" @click="handleIconClick('youtube')">
          <img src="/youtube.jpeg" alt="Play Ilahis" class="w-8 h-8" />
        </div>
      </div>
      <!-- Large pop-up box -->
      <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closePopup">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full m-4 relative" @click.stop>
          <button @click="closePopup" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="text-2xl font-bold mb-4">{{ popupContent.title }}</h2>
          <p class="mb-4">{{ popupContent.description }}</p>
          <button @click="handlePopupAction" class="bg-white hover:bg-blue-500 text-blue-500 hover:text-white font-bold py-2 px-4 rounded w-full border border-blue-500 transition-colors duration-300">
            {{ popupContent.actionText }}
          </button>
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

const showPopup = ref(false)
const popupContent = ref({
  title: '',
  description: '',
  actionText: '',
  action: () => {}
})

function refreshSongs() {
  songStore.fetchSongs(true)
}

const handleIconClick = (type: 'whatsapp' | 'youtube') => {
  if (type === 'whatsapp') {
    popupContent.value = {
      title: 'Join Ilahi Classes',
      description: 'Connect with us via WhatsApp to join weekly Ilahi classes on Zoom.',
      actionText: 'Open WhatsApp',
      action: () => window.open('https://chat.whatsapp.com/F7vWb3S3qIG2sht3hTPsjp', '_blank')
    }
  } else {
    popupContent.value = {
      title: 'Play Ilahis',
      description: 'Listen to Ilahis here!',
      actionText: 'Open YouTube Player',
      action: () => router.push({ name: 'YouTubePlayer' })
    }
  }
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const handlePopupAction = () => {
  popupContent.value.action()
  closePopup()
}


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
  @apply relative inline-block cursor-pointer;
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