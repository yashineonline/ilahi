<template>
    <div class="rifai-wird-container p-4" :class="{ 'fullscreen': isFullscreen }">
      <div class="flex justify-between items-center mb-4">
        <button @click="goBack" class="btn btn-circle btn-sm">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </button>
        <h1 class="text-3xl font-bold" v-if="!isFullscreen">Rifai Wird</h1>
        <div class="flex gap-2">
          <button @click="toggleFullscreen" class="btn btn-circle btn-sm">
            <font-awesome-icon :icon="['fas', isFullscreen ? 'compress' : 'expand']" />
          </button>
          <button @click="toggleSettings" class="btn btn-circle btn-sm">
            <font-awesome-icon :icon="['fas', 'cog']" />
          </button>
        </div>
      </div>
  
      <div class="controls mb-4 p-4 bg-base-200 text-base-content rounded-lg" v-if="showSettings">
        <div class="collapse collapse-arrow">
          <input type="checkbox" /> 
          <div class="collapse-title text-xl font-medium">
            Settings
          </div>
          <div class="collapse-content">
            <div class="flex flex-wrap items-center gap-4 mb-2">
              <div class="flex items-center">
                <label for="fontSize" class="mr-2">Font Size:</label>
                <input type="range" id="fontSize" min="16" max="132" v-model="fontSize" class="range range-primary w-32 custom-range" />
                <span class="ml-2">{{ fontSize }}px</span>
              </div>
              <div class="flex items-center">
                <label for="textColor" class="mr-2">Text:</label>
                <input type="color" id="textColor" v-model="textColor" class="w-8 h-8" />
              </div>
              <div class="flex items-center">
                <label for="backgroundColor" class="mr-2">Background:</label>
                <input type="color" id="backgroundColor" v-model="backgroundColor" class="w-8 h-8" />
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <label for="transitionSelect" class="mr-2">Transition:</label>
              <select id="transitionSelect" v-model="selectedTransition" class="select select-primary select-sm">
                <option v-for="option in transitionOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <div class="flex flex-wrap items-center gap-2 mt-2">
                <button @click="restartWird" class="btn btn-primary btn-sm">Restart</button>
                <button @click="togglePrevious" class="btn btn-secondary btn-sm">
                  {{ showPrevious ? 'Hide' : 'Show' }} Previous
                </button>
                <button @click="toggleNext" class="btn btn-secondary btn-sm">
                  {{ showNext ? 'Hide' : 'Show' }} Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div 
        class="wird-display p-4 rounded-lg shadow-lg flex flex-col items-center" 
        :style="{ fontSize: `${adjustedFontSize}px`, color: textColor, backgroundColor }"
        ref="wirdDisplay"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        tabindex="0"
        @keydown="handleKeydown"
      >
        <div v-if="loading" class="loading loading-spinner loading-lg"></div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else class="relative flex flex-col h-[60vh] w-full mx-auto shadow-lg rounded-lg" :style="{ backgroundColor }">
          <div v-if="showPrevious" class="flex-shrink-0 w-full p-2 text-gray-400 text-center" :style="{ fontSize: `${prevNextFontSize}px` }">
            <div v-html="formatPrevNext(wird[currentIndex - 1])"></div>
          </div>
          <transition :name="selectedTransition" mode="out-in">
  <div
    v-if="wird[currentIndex] !== undefined"
    :key="currentIndex"
    class="w-full h-full flex items-center justify-center p-4 overflow-y-auto"
  >
    <div class="wird-part-content" v-html="wird[currentIndex]"></div>
  </div>
</transition>
                    <div v-if="showNext" class="flex-shrink-0 w-full p-2 text-gray-400 text-center" :style="{ fontSize: `${prevNextFontSize}px` }">
            <div v-html="formatPrevNext(wird[currentIndex + 1])"></div>
          </div>
        </div>
        <div class="navigation mt-4 flex justify-between items-center w-full" :class="{ 'mobile': isMobileLayout }">
          <button @click="goToPreviousPart" class="btn btn-circle" :disabled="currentIndex === 0">
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <div class="flex items-center">
            <input 
              v-model.number="currentIndexInput" 
              type="number" 
              min="1" 
              :max="wird.length" 
              class="w-16 text-center mr-2"
              @change="handleIndexChange"
            />
            <span>/ {{ wird.length }}</span>
          </div>
          <button @click="goToNextPart" class="btn btn-circle" :disabled="currentIndex === wird.length - 1">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch, watchEffect, onUnmounted } from 'vue';
  import { useNavigationStore } from '../stores/navigationStore';
  import { FontAwesomeIcon } from '@/plugins/font-awesome';
  
  const slideDirection = ref('left');
  
  const wird = ref<string[]>([]);
  const currentIndex = ref(0);
  const showPrevious = ref(true);
  const showNext = ref(true);
  const loading = ref(false);
  const error = ref('');
  const fontSize = ref(parseInt(localStorage.getItem('rifaiWirdFontSize') || '24'));
  const textColor = ref(localStorage.getItem('rifaiWirdTextColor') || '#000000');
  const backgroundColor = ref(localStorage.getItem('rifaiWirdBackgroundColor') || '#E1D5D0');
  const wirdDisplay = ref<HTMLElement | null>(null);
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  const transitionOptions = [
    { value: 'slide', label: 'Slide' },
    { value: 'fade', label: 'Fade' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'flip', label: 'Flip' },
    { value: 'slideFade', label: 'Slide and Fade' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'pageTurn', label: 'Page Turn' },
  ];
  
  const selectedTransition = ref(localStorage.getItem('rifaiWirdTransition') || 'slide');
  
  const handleIndexChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    currentIndexInput.value = value;
  };
  
  const restartWird = () => {
    currentIndex.value = 0;
  };
  
  const togglePrevious = () => {
    showPrevious.value = !showPrevious.value;
  };
  
  const toggleNext = () => {
    showNext.value = !showNext.value;
  };
  
  const formatPrevNext = (text: string | undefined): string => {
    if (!text) return '';
    return text.replace(/<br>/g, ' ');
  };
  
  const splitWird = (text: string): string[] => {
    return text.split(/\n\s*\n/)
      .map(part => part.trim())
      .filter(part => part.length > 0 && part !== 'Rifai Wird')
      .map(part => part.replace(/\n/g, '<br>'));
  };
  
  
  const currentPart = computed(() => wird.value[currentIndex.value] || '');
  const previousPart = computed(() => wird.value[currentIndex.value - 1] || '');
  const nextPart = computed(() => wird.value[currentIndex.value + 1] || '');
  const currentIndexInput = computed({
    get: () => currentIndex.value + 1,
    set: (value: number) => {
      currentIndex.value = validateIndex(value - 1);
    }
  });
  
  const prevNextFontSize = computed(() => {
    if (isMobileLayout.value) {
      return Math.min(adjustedFontSize.value * 0.75, 18); // Adjust for mobile
    }
    return adjustedFontSize.value * 0.75;
  });
  
  const fetchWird = async () => {
    loading.value = true;
    error.value = '';
    try {
      // First, try to fetch from GitHub
      const owner = 'yashineonline';
      const repo = 'ilahiRepository';
      const path = 'rifaiWird.txt';
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      // console.log('Fetching Rifai Wird from GitHub:', url);
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const text = await response.text();
      // console.log('Fetched text:', text.substring(0, 100) + '...'); // Log first 100 characters
      wird.value = splitWird(text);
      // console.log('Split wird:', wird.value);
    } catch (err) {
      console.error('Error fetching Rifai Wird from GitHub:', err);
      
      // If GitHub fetch fails, try to fetch from local file
      try {
        // console.log('Fetching Rifai Wird from local file');
        const response = await fetch('/rifaiWird.txt');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        // console.log('Fetched text from local file:', text.substring(0, 100) + '...'); // Log first 100 characters
        wird.value = splitWird(text);
        // console.log('Split wird from local file:', wird.value);
      } catch (localErr) {
        console.error('Error fetching local Rifai Wird:', localErr);
        error.value = 'Failed to load Rifai Wird. Please try again later.';
      }
    } finally {
      loading.value = false;
      currentIndex.value = 0;
    }
  };
  
  const goToNextPart = () => {
    if (currentIndex.value < wird.value.length - 1) {
      currentIndex.value = validateIndex(currentIndex.value + 1);
      slideDirection.value = 'left';
    }
  };
  const goToPreviousPart = () => {
    if (currentIndex.value > 0) {
      currentIndex.value = validateIndex(currentIndex.value - 1);
      slideDirection.value = 'right';
    }
  };
  
  let lastKeyPressTime = 0;
  const keyPressDelay = 300; // milliseconds
  
  const handleKeydown = (e: KeyboardEvent) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastKeyPressTime > keyPressDelay) {
      if (e.key === 'ArrowLeft') {
        goToPreviousPart();
      } else if (e.key === 'ArrowRight') {
        goToNextPart();
      }
      lastKeyPressTime = currentTime;
    }
  };
  
  const touchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  
  const touchMove = (e: TouchEvent) => {
    touchEndX = e.touches[0].clientX;
  };
  
  const touchEnd = () => {
    const swipeDistance = touchStartX - touchEndX;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        goToNextPart();
      } else {
        goToPreviousPart();
      }
    }
  };
  
  const validateIndex = (index: number): number => {
    return Math.max(0, Math.min(index, wird.value.length - 1));
  };
  
  watch([fontSize, textColor, backgroundColor], ([newFontSize, newTextColor, newBackgroundColor]) => {
    localStorage.setItem('rifaiWirdFontSize', newFontSize.toString());
    localStorage.setItem('rifaiWirdTextColor', newTextColor);
    localStorage.setItem('rifaiWirdBackgroundColor', newBackgroundColor);
  });
  
  watch(selectedTransition, (newTransition) => {
    localStorage.setItem('rifaiWirdTransition', newTransition);
  });
  
  watchEffect(() => {
    if (!localStorage.getItem('rifaiWirdFontSize')) {
      localStorage.setItem('rifaiWirdFontSize', fontSize.value.toString());
    }
    if (!localStorage.getItem('rifaiWirdTextColor')) {
      localStorage.setItem('rifaiWirdTextColor', textColor.value);
    }
    if (!localStorage.getItem('rifaiWirdBackgroundColor')) {
      localStorage.setItem('rifaiWirdBackgroundColor', backgroundColor.value);
    }
  });
  
  // Add a new ref for mobile layout
  const isMobileLayout = ref(false);
  
  // Define checkMobileLayout outside of onMounted
  const checkMobileLayout = () => {
    isMobileLayout.value = window.innerWidth < 768; // Adjust this breakpoint as needed
  };
  
  // Update the onMounted hook
  onMounted(async () => {
    // console.log('RifaiWird component mounted');
    try {
      await fetchWird();
      // console.log('Fetched Wird:', wird.value);
      // console.log('Number of parts:', wird.value.length);
      // console.log('First part:', wird.value[0]);
      // console.log('Last part:', wird.value[wird.value.length - 1]);
    } catch (error) {
      console.error('Error fetching Wird:', error);
    }
    document.addEventListener('keydown', handleKeydown);
  
    // Check for mobile layout
    checkMobileLayout();
    window.addEventListener('resize', checkMobileLayout);
  });
  
  // Update onUnmounted to remove the resize event listener
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('resize', checkMobileLayout);
  });
  
  const isFullscreen = ref(false);
  const showSettings = ref(false);
  const navigationStore = useNavigationStore();
  
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
    navigationStore.setNavigationVisibility(!isFullscreen.value);
  };
  
  const toggleSettings = () => {
    showSettings.value = !showSettings.value;
  };
  
  const goBack = () => {
    isFullscreen.value = false;
    navigationStore.setNavigationVisibility(true);
  };
  
  const adjustedFontSize = computed(() => {
    if (isMobileLayout.value) {
      return Math.min(fontSize.value, 24); // Adjust max font size for mobile
    }
    return fontSize.value;
  });
  </script>
  
  <style scoped>
  @media (min-width: 1024px) {
    .wird-display {
      min-height: 80vh;
    }
  }
  
  /* Page Turn transition */
  .pageTurn-enter-active,
  .pageTurn-leave-active {
    transition: all 0.6s ease;
    transform-origin: left center;
  }
  .pageTurn-enter-from {
    opacity: 0;
    transform: rotateY(-90deg);
  }
  .pageTurn-leave-to {
    opacity: 0;
    transform: rotateY(90deg);
  }
  
  
  /* Flying transition */
  .flying-enter-active,
  .flying-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .flying-enter-from {
    opacity: 0;
    transform: translate(30px, 0) rotate(10deg);
  }
  .flying-leave-to {
    opacity: 0;
    transform: translate(-30px, 0) rotate(-10deg);
  }
  
  /* Add this to preserve existing transitions */
  .slide-enter-active,
  .slide-leave-active,
  .fade-enter-active,
  .fade-leave-active,
  .zoom-enter-active,
  .zoom-leave-active,
  .flip-enter-active,
  .flip-leave-active,
  .slideFade-enter-active,
  .slideFade-leave-active,
  .bounce-enter-active,
  .bounce-leave-active {
    transition: all 0.01s ease;
  }
  
  /* Slide transition */
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease-out;
  }
  .slide-enter-from.left,
  .slide-leave-to.right {
    transform: translateX(100%);
  }
  .slide-leave-to.left,
  .slide-enter-from.right {
    transform: translateX(-100%);
  }
  
  /* Fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Zoom transition */
  .zoom-enter-active,
  .zoom-leave-active {
    transition: all 0.5s ease;
  }
  .zoom-enter-from,
  .zoom-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  
  /* Flip transition */
  .flip-enter-active,
  .flip-leave-active {
    transition: all 0.5s ease;
  }
  .flip-enter-from {
    opacity: 0;
    transform: rotateY(-90deg);
  }
  .flip-leave-to {
    opacity: 0;
    transform: rotateY(90deg);
  }
  
  /* Slide and fade transition */
  .slideFade-enter-active,
  .slideFade-leave-active {
    transition: all 0.5s ease;
  }
  .slideFade-enter-from {
    opacity: 0;
    transform: translateX(50px);
  }
  .slideFade-leave-to {
    opacity: 0;
    transform: translateX(-50px);
  }
  
  /* Bounce transition */
  @keyframes bounce-in {
    0% { transform: scale(0); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  @keyframes bounce-out {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(0); }
  }
  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  .bounce-leave-active {
    animation: bounce-out 0.5s;
  }
  
  .wird-display {
    min-height: 60vh;
    overflow: hidden;
    position: relative;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  
  .wird-part-content {
    max-height: 100%;
    overflow-y: auto;
    padding: 1rem;
  }
  
  
  
  @media (max-width: 768px) {
    .wird-display {
      flex-direction: column;
    }
  
    .wird-part-content {
      padding: 0.5rem;
    }
  }
  
  .navigation {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem;
    z-index: 10;
  }
  
  @media (max-width: 768px) {
    .navigation {
      position: fixed;
    }
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
    border-radius: 100%;
  }
  
  .custom-range::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #4CAF50;
    cursor: pointer;
    border-radius: 50%;
  }
  
  /* Add styles for mobile layout */
  @media (max-width: 639px) {
    .wird-display {
      min-height: calc(100vh - 16rem); /* Adjust based on your layout */
    }
  
    .navigation {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 0.5rem;
      z-index: 10;
    }
  }
  </style>