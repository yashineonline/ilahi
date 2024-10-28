<template>
  <nav class="navbar shadow-lg flex-col w-full" aria-label="Main navigation">
    <div class="w-full px-4 flex flex-col items-center">
      <Installation class="mb-2" />
      <ul class="flex flex-col w-full mb-4 list-none p-0 space-x-2">
        <li><router-link to="/wirds" class="btn btn-ghost btn-sm text-xl mb-2">Wirds</router-link></li>
        <li><router-link to="/songs" class="btn btn-ghost btn-sm text-xl mb-2">View Ilahi List</router-link></li>
        <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost btn-sm text-xl mb-2">More</label>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li><router-link to="/zikr-practice" class="btn btn-ghost btn-sm">Zikr Practice</router-link></li>
        <li><router-link to="/book" class="btn btn-ghost btn-sm">Download Ilahi Book</router-link></li>
        <li><router-link to="/about" class="btn btn-ghost btn-sm">About Ilahi</router-link></li>
        <li><router-link to="/history" class="btn btn-ghost btn-sm">History</router-link></li>
        <li><router-link to="/poems" class="btn btn-ghost btn-sm">Poems</router-link></li>
        <li><router-link to="/books" class="btn btn-ghost btn-sm">Other Ilahi Books</router-link></li>
        <li><router-link to="/miscellaneous" class="btn btn-ghost btn-sm">Miscellaneous</router-link></li>
      </ul>
    </div>
        <li><router-link to="/" class="btn btn-ghost btn-sm text-xl mb-2" aria-label="Home">Home</router-link></li>
      </ul>
      <div class="flex items-center space-x-4" role="group" aria-label="Additional actions">
        <button @click="refreshSongs" class="btn btn-ghost btn-circle" aria-label="Refresh songs">
          <font-awesome-icon :icon="['fas', 'rotate']" spin style="color: #17a6ee;" aria-hidden="true" />
        </button>
        <button class="btn btn-ghost" @click="handleIconClick('whatsapp')" aria-label="Join Ilahi Classes via WhatsApp">
          <font-awesome-icon :icon="['fab', 'whatsapp']" style="color: #63E6BE;" size="2xl" aria-hidden="true" />
        </button>
        <button class="btn btn-ghost" @click="handleIconClick('youtube')" aria-label="Play Ilahis on YouTube">
          <font-awesome-icon :icon="['fab', 'youtube']" style="color: #ff3d3d;" size="2xl" aria-hidden="true" />
        </button>
        
      </div>
      <!-- Large pop-up box -->
      <div v-if="showPopup" class="modal modal-open" @click="closePopup">
        <div class="modal-box relative" @click.stop role="dialog" aria-labelledby="popupTitle">
          <button @click="closePopup" class="btn btn-sm btn-circle absolute right-2 top-2" aria-label="Close">✕</button>
          <h2 id="popupTitle" class="text-2xl font-bold mb-4">{{ popupContent.title }}</h2>
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

<style scoped>
.navbar {
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* Add these new styles */
.modal-box {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.modal-box h2 {
  color: var(--text-color);
}

.modal-box p {
  color: var(--text-color);
}

.modal-box button {
  background-color: var(--primary-color);
  color: var(--primary-content);
}
</style>