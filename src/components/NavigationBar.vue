<template>
  <nav class="navbar shadow-lg flex-col w-full bg-base-100 text-base-content" aria-label="Main navigation">
    <div class="w-full px-4 flex flex-col items-center">
      <ul class="flex flex-col w-full mb-4 list-none p-0">
        <li class="flex justify-center items-center gap-2 w-full">

          <div class="flex items-center gap-2">
          <button 
          v-if="!isHomePage"
              @click="goBack" 
              class="btn btn-ghost btn-circle"
              aria-label="Go back"
            >
              <font-awesome-icon icon="arrow-left" class="text-xl" />
            </button>

            <div v-if="isHomePage" class="dropdown">
              <label 
                tabindex="0" 
                class="btn btn-ghost btn-circle"
                aria-label="Open menu"
              >
                <font-awesome-icon icon="bars" class="text-xl" />
              </label>

              <ul 
              tabindex="0" 
              class="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-base-100 text-base-content" 
              :class="{
                'bg-gray-800/90 text-white': themeStore.theme === 'dark', 
                'bg-white/90 text-gray-800': themeStore.theme === 'light'
                }"
                >
        <li><router-link to="/zikr-practice" class="btn btn-ghost btn-sm">Zikr Practice</router-link></li>
        <li><router-link to="/wirds" class="btn btn-ghost btn-sm">Wird Slide</router-link></li>
        <li><router-link to="/book" class="btn btn-ghost btn-sm">Download ilahi Book</router-link></li>
        <li><router-link to="/about" class="btn btn-ghost btn-sm">About ilahi</router-link></li>
        <li> <button @click="handleIlahiClassesClick" class="btn btn-ghost btn-sm w-full text-left">Join ilahi Community</button></li>
        <li><router-link to="/history" class="btn btn-ghost btn-sm">History</router-link></li>
        <li><router-link to="/poems" class="btn btn-ghost btn-sm">Poems</router-link></li>
        <li><router-link to="/books" class="btn btn-ghost btn-sm">Other ilahi Books</router-link></li>
        <li><router-link to="/miscellaneous" class="btn btn-ghost btn-sm">Miscellaneous</router-link></li>
      </ul>
    </div>

            <router-link 
            v-if="!isHomePage"
              to="/" 
              class="btn btn-ghost btn-circle"
              aria-label="Home"
            >
              <font-awesome-icon icon="home" class="text-xl" />
            </router-link>
          </div>

            <router-link 
            to="/songs" 
            class="btn btn-primary text-xl transform hover:scale-105 transition-transform duration-200 flex items-center gap-2 flex-grow justify-center"
          >
            <font-awesome-icon icon="music" />
            ilahi List
            <span class="text-sm opacity-75" v-if="!isSongListView">(Tap to Browse)</span>
            <span class="text-sm opacity-75" v-else>(Scroll Down)</span>
          </router-link>

          <div class="flex items-center gap-2"> 
          <Installation v-if="!isSongListView"/>
      </div>
        </li>    
      </ul>         
      
          
         

      
      <div class="flex items-center space-x-4" role="group" aria-label="Additional actions">
                <button v-if="isHomePage" class="btn btn-ghost" @click="handleIconClick('youtube')" aria-label="Play ilahis">
          Play ilahis
          <font-awesome-icon :icon="['fab', 'youtube']" style="color: #ff3d3d;" size="2xl" aria-hidden="true" />
        </button>
      </div>

      <IlahiClasses ref="ilahiClasses" />

      <!-- Large pop-up box -->
      <div v-if="showPopup" class="modal modal-open fixed inset-0 flex items-center justify-center z-50" @click="closePopup">
        <div class="modal-overlay absolute inset-0 bg-black/50"></div>
  <div class="modal-box relative bg-base-100 text-base-content p-6 rounded-lg shadow-2xl max-w-md mx-auto z-50" @click.stop role="dialog" aria-labelledby="popupTitle">
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Installation from './Installation.vue'
import IlahiClasses from './IlahiClasses.vue' // Import the IlahiClasses component


const themeStore = useThemeStore()
const songStore = useSongStore()
const route = useRoute()
const router = useRouter()

const isSongListView = computed(() => route.path === '/songs')

const showPopup = ref(false)
const popupContent = ref({
  title: '',
  description: '',
  actionText: '',
  action: () => {}
})

const goBack = () => {
  window.history.back()
}

const ilahiClasses = ref<InstanceType<typeof IlahiClasses> | null>(null)

// const ilahiClasses = ref(null) // Create a ref for IlahiClasses

// Add computed property to check if we're on the Home page
const isHomePage = computed(() => route.path === '/')

 

const handleIlahiClassesClick = () => {
  // console.log('Click handled', ilahiClasses.value) // Debug log
  if (ilahiClasses.value) {
    ilahiClasses.value.openPopup()
  }
}

const handleIconClick = (type: 'whatsapp' | 'youtube') => {
  if (type === 'whatsapp') {
    popupContent.value = {
      title: 'Join ilahi Classes',
      description: 'Connect with us via WhatsApp to join weekly ilahi classes on Zoom.',
      actionText: 'Open WhatsApp',
      action: () => window.open('https://chat.whatsapp.com/F7vWb3S3qIG2sht3hTPsjp', '_blank')
    }
  } else {
    popupContent.value = {
      title: 'Play ilahis',
      description: 'Listen to ilahis here!',
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

// Expose the ilahiClasses ref
defineExpose({ ilahiClasses })
</script>

<style scoped>
/* .navbar {
  background-color: var(--bg-color);
  color: var(--text-color);
} */

/* Add these new styles */
/* .modal-box {
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
} */
</style>