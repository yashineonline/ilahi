<template>
  <nav class="navbar shadow-lg flex-col w-full bg-base-100 text-base-content" aria-label="Main navigation">
<!-- Add this after your nav opening tag -->
<div 
  v-if="!isHomePage"
  class="fixed top-16 left-0 transition-all duration-300 z-50"
  :class="{
  'translate-x-0 opacity-100': showFloatingNav || isDesktop,
  '-translate-x-full opacity-0': !showFloatingNav && !isDesktop
}"
  @mouseenter="handleFloatingNavOpen"
  @mouseleave="handleFloatingNavLeave"
>
  <div class="bg-base-200 rounded-r-lg shadow-lg px-4 py-2 flex flex-col items-start gap-4">
          <button 
              @click="goBack" 
              class="btn btn-ghost btn-circle"
              aria-label="Go back"
            >
              <font-awesome-icon icon="arrow-left" class="text-xl" />
            </button>

    <button 
      @click.stop="toggleMenu" 
                class="btn btn-ghost btn-circle"
                aria-label="Open menu"
              >
                <font-awesome-icon icon="bars" class="text-xl" />
    </button>
    <div v-if="menuOpen" class="relative">
    <MenuItems 
      class="absolute top-2 left-16 z-[100]" 
      @ilahi-classes-click="handleIlahiClassesClick" 
      @menu-item-click="menuOpen = false"

    />
  </div>

            <router-link 
              to="/" 
              class="btn btn-ghost btn-circle"
              aria-label="Home"
            >
              <font-awesome-icon icon="home" class="text-xl" />
            </router-link>
          </div>
</div>

<div v-if="isHomePage" class="fixed top-16 left-4 z-50">
  <div class="flex flex-row gap-2">
    <button @click="goBack" class="btn btn-ghost btn-circle" aria-label="Go back">
      <font-awesome-icon icon="arrow-left" class="text-xl" />
    </button>
    <button @click.stop="toggleMenu" class="btn btn-ghost btn-circle" aria-label="Open menu">
      <font-awesome-icon icon="bars" class="text-xl" />
    </button>
  </div>
  
  <div v-if="menuOpen" class="relative">
    <MenuItems 
      class="absolute top-2 left-0 z-[100]" 
      @ilahi-classes-click="handleIlahiClassesClick" 
      @menu-item-click="menuOpen = false"

    />
  </div>
</div>


      
      
          <!-- Main content area with centered ilahi List button and right-aligned icons -->
        <!--           <div class="w-full grid grid-cols-3 items-center"> -->
        
          <div class="w-full grid items-center" style="grid-template-columns: 1fr auto 1fr;">
            <div></div> <!-- Empty left column for spacing -->
            
            
              <div class="relative" justify-self: center>
                <button 
                class="btn btn-primary transform hover:scale-105 transition-transform duration-200 flex items-center gap-2 justify-center"
                @mouseenter="showTooltip = true"
                @mouseleave="showTooltip = false"
                @click="handleSongListClick"
          >
            <font-awesome-icon icon="music" />
            ilahi List
          </button>

              <div 
                v-if="showTooltip" 
                class="fixed-tooltip p-4 bg-base-200 rounded-lg shadow-lg text-base-content w-64 mt-2 tooltip-bounce"
                :class="{'bg-gray-700 text-white': themeStore.theme === 'dark'}"
                style="height: auto; min-height: 80px;"
              >
                <span v-if="!isSongListView" class="text-lg font-medium">Tap me again to browse ilahis</span>
                <span v-else class="text-lg font-medium">Scroll down to see ilahis</span>
                <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-base-200"
                   :class="{'bg-gray-700': themeStore.theme === 'dark'}"></div>
              </div>
      </div>
            
            <div style="display: flex; gap: 0;" class="justify-self-end" v-if="isHomePage"> 
              <div class="relative" style="margin-right: -10px; padding: 1px;">
                <button 
                  class="btn btn-ghost btn-circle" 
                  @mouseenter="showYoutubeTooltip = true"
                  @mouseleave="showYoutubeTooltip = false"
                  @touchstart.prevent="onTooltipTouch('youtube')"
                  @click="handleIconClick('youtube')" 

                >
                  <font-awesome-icon :icon="['fab', 'youtube']" style="color: #ff3d3d;" size="lg" aria-hidden="true" />
                </button>
                
                <div 
                  v-if="showYoutubeTooltip" 
                  class="fixed-tooltip p-4 bg-base-200 rounded-lg shadow-lg text-base-content w-64 mt-2 tooltip-bounce"
                  :class="{'bg-gray-700 text-white': themeStore.theme === 'dark'}"
                  style="height: auto; min-height: 80px;"
                >
                  <span class="text-lg font-medium">Tap me again to play ilahis</span>
                  <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-base-200"
                    :class="{'bg-gray-700': themeStore.theme === 'dark'}"></div>
                </div>
              </div>
              
              <div class="relative" style="margin-right: -10px; padding: 1px;">
                <button 
                  class="btn btn-ghost btn-circle" 
                  @click="handleIlahiClassesClick"
                  @mouseenter="showWhatsappTooltip = true"
                  @mouseleave="showWhatsappTooltip = false"
                  @touchstart.prevent="onTooltipTouch('whatsapp')"
                >
                  <font-awesome-icon :icon="['fab', 'whatsapp']" style="color: #25D366;" size="lg" aria-hidden="true" />
                </button>
                
                <div 
                  v-if="showWhatsappTooltip" 
                  class="fixed-tooltip p-6 bg-base-200 rounded-lg shadow-lg text-base-content w-64 mt-2 tooltip-star-animation"
                  :class="{'bg-gray-700 text-white': themeStore.theme === 'dark'}"
                >
                  <div class="flex flex-col items-center">
                    <span class="text-xl font-bold animate-pulse-text">Tap me</span>
                    <span class="text-xl font-bold animate-pulse-text">again to</span>
                    <span class="text-xl font-bold animate-pulse-text">join</span>
                    <span class="text-xl font-bold animate-pulse-text animation-delay-100">our</span>
                    <span class="text-xl font-bold animate-pulse-text animation-delay-200">ilahi</span>
                    <span class="text-xl font-bold animate-pulse-text animation-delay-300">community</span>
                  </div>
                  <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-base-200"
                    :class="{'bg-gray-700': themeStore.theme === 'dark'}"></div>
                    
                  <!-- Star shapes animation -->
                  <div class="stars-container">
                    <div class="star star1"></div>
                    <div class="star star2"></div>
                    <div class="star star3"></div>
                  </div>
                </div>
              </div>
              
              <div class="relative" style="margin-right: -10px; padding: 1px;" v-if="!isAppInstalled">
                <button 
                class="btn btn-ghost btn-circle" 
                @mouseenter="showInstallTooltip = true"
                  @mouseleave="showInstallTooltip = false"
                  @click="handleInstallClick"
                  @touchstart.prevent="onTooltipTouch('install')"
                >
                <font-awesome-icon :icon="['far', 'circle-down']" shake class="text-primary" size="lg" />
        </button>
                <div 
                  v-if="showInstallTooltip" 
                  class="fixed-tooltip p-4 bg-base-200 rounded-lg shadow-lg text-base-content w-64 mt-2 tooltip-bounce"
                  :class="{'bg-gray-700 text-white': themeStore.theme === 'dark'}"
                  style="height: auto; min-height: 40px;"
                >
                  <span class="text-lg font-medium">Tap me again to install the ilahi app</span>
                  <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-base-200"
                    :class="{'bg-gray-700': themeStore.theme === 'dark'}"></div>
                </div>
                <Installation ref="installationComponent" @app-installed="isAppInstalled = true" />
              </div>
            </div>
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
    
  </nav>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/themeStore'
import { useSongStore } from '../stores/songStore'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Installation from './Installation.vue'
import IlahiClasses from './IlahiClasses.vue' // Import the IlahiClasses component
import MenuItems from './MenuItems.vue'

declare const window: Window & typeof globalThis

const isDesktop = computed(() => window.innerWidth >= 768);
const themeStore = useThemeStore()
const songStore = useSongStore()
const route = useRoute()
const router = useRouter()
const installationComponent = ref<InstanceType<typeof Installation> | null>(null)
const isAppInstalled = ref(false)


const isSongListView = computed(() => route.path === '/songs')
const showTooltip = ref(false)
const showYoutubeTooltip = ref(false)
const showInstallTooltip = ref(false)
const showWhatsappTooltip = ref(false)
const showFloatingNav = ref(false)
const menuOpen = ref(false)
const touchedButton = ref<null | string>(null)

// Add computed property to check if we're on the Home page
const isHomePage = computed(() => route.path === '/')


const handleFloatingNavLeave = () => {
  // Only hide the floating nav if the menu is closed and on mobile
  if (!menuOpen.value && isDesktop.value) {
    showFloatingNav.value = false
  }
}

watch(menuOpen, (newVal) => {
  if (!newVal && isDesktop.value) {
    showFloatingNav.value = false
  }
})

// Add this new function to handle the song list click
const handleSongListClick = () => {
  // Navigate immediately for both desktop and mobile
  router.push('/songs');

  // Always refresh with ilahi.txt when clicking the ilahi list button
  songStore.fetchSongs(false, 'ilahi.txt');

  if (isDesktop.value) { // 768px is a common breakpoint for desktop
    showTooltip.value = true
    setTimeout(() => {
      showTooltip.value = false
    }, 2000) // Close tooltip after 2 seconds
    }
};

// Add this to close the tooltip after 2 seconds
watch(showTooltip, (newVal) => {
  if (newVal && window.innerWidth >= 768) {
    setTimeout(() => {
      showTooltip.value = false
    }, 2000)
  }
})


// Toggle menu
const toggleMenu = (event?: Event) => {
  if (event) event.stopPropagation()
  menuOpen.value = !menuOpen.value
}

// Handle touch events for mobile devices
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches && e.touches[0];
  const target = e.target as HTMLElement;
  // const isInteractiveElement = target.closest('button, a, input, textarea, select, [data-no-float-nav]');
// const isNotInteractive = !isInteractiveElement;

  // Ignore taps on interactive elements
  if (target && target.closest('button, a, input, select, textarea, [role="button"], [data-no-float-nav]')) {
    return;
  }
  if (touch) {

  // Only open when swiping/tapping from the very left edge and near top
  // const edgeThreshold = 24; // px from left edge
  // const topThreshold = 20; // px from top scroll
  // if (touch && touch.clientX <= edgeThreshold && window.scrollY < topThreshold) {
    handleFloatingNavOpen();
  }
}

const handleScroll = () => {
  if (window.scrollY > 100) {
    showFloatingNav.value = false
  }
}

// Handle tooltip touch for mobile - two-tap behavior
const onTooltipTouch = (button: string) => {
  // Close all tooltips first
  showTooltip.value = false
  showYoutubeTooltip.value = false
  showInstallTooltip.value = false
  showWhatsappTooltip.value = false
  
  // If this is second tap on same button, perform action
  if (touchedButton.value === button) {   
    // Perform button action
    if (button === 'youtube') {
      handleIconClick('youtube')
    } else if (button === 'whatsapp') {
      handleIlahiClassesClick()
    } else if (button === 'install') {
      if (installationComponent.value) {
        installationComponent.value.showInstallInstructions()
      }
    } else if (button === 'songList') {
      router.push('/songs')
    }
    touchedButton.value = null
    return
  }
  
  // First tap, show tooltip
  touchedButton.value = button
  
  if (button === 'youtube') {
    showYoutubeTooltip.value = true
  } else if (button === 'whatsapp') {
    showWhatsappTooltip.value = true
  } else if (button === 'install') {
    showInstallTooltip.value = true
  } else if (button === 'songList') {
    showTooltip.value = true
  }
  
  // Auto-hide tooltip after timeout
  setTimeout(() => {
    showTooltip.value = false
    showYoutubeTooltip.value = false
    showInstallTooltip.value = false
    showWhatsappTooltip.value = false
    setTimeout(() => {
      touchedButton.value = null
    }, 300)
  }, 2000)
}

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('scroll', handleScroll)
  
// Check if app is installed
isAppInstalled.value = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true
  

  // Click outside to close menu
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    // Ignore clicks on elements that opt-out (e.g., translation toggle)
    if ((target as HTMLElement).closest('[data-no-float-nav]')) return
    if (menuOpen.value && !target.closest('.dropdown-open-on-click')) {
      menuOpen.value = false
    }
  }
  
  window.addEventListener('click', handleClickOutside)
  
  // Clean up
  onUnmounted(() => {
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('click', handleClickOutside)
  })
})

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


const handleIlahiClassesClick = () => {
  if (ilahiClasses.value) {
    ilahiClasses.value.openPopup()
  }
  // Close menu after clicking
  menuOpen.value = false
}

// Add this new function
const handleInstallClick = () => {
  console.log('Install button clicked');
  if (installationComponent.value) {
    console.log('Installation component found');
    installationComponent.value.showInstallInstructions()
  } else {
    console.log('Installation component not found');
  }
}

const handleIconClick = (type: 'whatsapp' | 'youtube') => {
  if (type === 'whatsapp') {
    popupContent.value = {
      title: 'Join ilahi Community',
      description: 'Connect with us via WhatsApp to join weekly ilahi classes on Zoom. Have questions about ilahis or anything in this app? Join our welcoming community where we share music, knowledge, and spiritual insights together.',
      actionText: 'Open WhatsApp',
      action: () => window.open('https://chat.whatsapp.com/F7vWb3S3qIG2sht3hTPsjp', '_blank')
    }
  } else {
    popupContent.value = {
      title: 'Play ilahis',
      description: 'Listen to all the audio ilahis available on this app here!',
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

const handleFloatingNavOpen = () => {
  showFloatingNav.value = true;
  // On mobile, auto-hide after 2 seconds
  if (!isDesktop.value && !menuOpen.value) {
    setTimeout(() => {
      if (!menuOpen.value) {
      showFloatingNav.value = false;
      }
    }, 2000);
  }
}

// Expose the ilahiClasses ref
defineExpose({ ilahiClasses })
</script>

<style scoped>
.tap-target {
  position: relative;
  padding: 10px;
  margin: -10px;
  z-index: 10;
}

   @media (max-width: 768px) {
    .tap-target {
    padding: 15px;
    margin: -15px;
  }

    /* Override for Installation tapping */
    .relative .tap-target {
    display: block;
    min-width: 48px;
    }
    
     .fixed-tooltip {
       width: 80vw; /* Use viewport width instead of fixed width */
       left: 10vw;
       transform: none; /* Remove the -50% transform on mobile */
       z-index: 100;
     }

 /* Larger tap area for mobile */
 .btn-circle {
    min-height: 3rem;
    min-width: 3rem;
    padding: 0.75rem;
  }


   }
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

/* Add these new styles */
.tooltip-bounce {
  animation: bounce 0.5s;
}

.tooltip-star-animation {
  animation: bounce 0.5s;
  overflow: hidden;
  position: relative;
}

.fixed-tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
  width: 16rem; /* w-64 equivalent */
  height: 180px; /* Fixed height to prevent layout shifts */
  top: calc(100% + 0.5rem);
}

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none; /* Ensure clicks pass through */
}

.star {
  position: absolute;
  background-color: rgba(255, 255, 0, 0.5);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: float 3s infinite;
  pointer-events: none; /* Ensure clicks pass through */
}

.star1 {
  width: 20px;
  height: 20px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.star2 {
  width: 15px;
  height: 15px;
  top: 40%;
  right: 20%;
  animation-delay: 0.5s;
}

.star3 {
  width: 25px;
  height: 25px;
  bottom: 20%;
  left: 30%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) rotate(20deg);
    opacity: 0.8;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-5px) translateX(-50%);
  }
  60% {
    transform: translateY(-2px) translateX(-50%);
  }
}

.animate-pulse-text {
  animation: pulse-text 2s infinite;
}

.animation-delay-100 {
  animation-delay: 0.2s;
}

.animation-delay-200 {
  animation-delay: 0.4s;
}

.animation-delay-300 {
  animation-delay: 0.6s;
}

@keyframes pulse-text {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* For touch devices */
@media (hover: none) {
  .fixed.top-0.left-0.w-full.h-8 {
    height: 24px; /* Larger touch area on mobile */
  }
}
</style>