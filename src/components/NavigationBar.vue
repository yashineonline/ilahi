<template>
  <nav :class="['navbar shadow-lg', themeStore.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800']" aria-label="Main navigation">
    <div class="container mx-auto px-4">
      <div class="flex-1">
        <router-link to="/songs" class="btn btn-ghost normal-case text-xl">View Ilahi List Here</router-link>        
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/book" class="btn btn-primary btn-sm">Download Ilahi Book</router-link></li>
          <li><router-link to="/about" class="btn btn-ghost btn-sm">About Ilahi</router-link></li>
          <li><router-link to="/" class="btn btn-ghost normal-case text-xl" aria-label="Home">Home</router-link></li>          
        </ul>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="refreshSongs" class="btn btn-ghost btn-circle">
          <font-awesome-icon :icon="['fas', 'rotate']" spin style="color: #17a6ee;" />
        </button>
        <button class="btn btn-circle btn-outline" @click="handleIconClick('whatsapp')" aria-label="Join Ilahi Classes via WhatsApp">
          <font-awesome-icon :icon="['fab', 'whatsapp']"  style="color: #63E6BE;" size="2xl" />
        </button>
        <button class="btn btn-circle btn-outline" @click="handleIconClick('youtube')" aria-label="Play Ilahis on YouTube">
          <font-awesome-icon :icon="['fab', 'youtube']" style="color: #ff3d3d;" size="2xl" />
        </button>
        <Installation />
      </div>
      <!-- Large pop-up box -->
      <div v-if="showPopup" class="modal modal-open" @click="closePopup">
        <div class="modal-box relative" @click.stop>
          <button @click="closePopup" class="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
          <h2 class="text-2xl font-bold mb-4">{{ popupContent.title }}</h2>
          <p class="mb-4">{{ popupContent.description }}</p>
          <button @click="handlePopupAction" class="btn btn-primary btn-block">
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
import Installation from './Installation.vue'

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