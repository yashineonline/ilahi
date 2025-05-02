<template>
  <div class="w-full max-w-4xl mx-auto p-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">AQRT Zikr Practice</h1>
      <p class="text-base-content/70">Do zikr by following along with Shaykh Taner and Shaykha Muzeyyen Ansari!</p>

      <!-- Add instruction message when no zikrs are loaded -->
      <div v-if="songStore.zikrItems.length === 0 && !loading" class="alert alert-info shadow-lg mt-4">
        <font-awesome-icon icon="info-circle" class="h-6 w-6" />
        <span>Tap on the refresh button <font-awesome-icon icon="rotate" class="text-primary mx-1" /> above to load the zikr recordings.</span>
      </div>

      <!-- Add instruction for using the cards -->
      <div v-else class="alert alert-info shadow-lg mt-4">
        <span>Tap on the zikr below that you wish to listen and recite at the same time.</span>
        <font-awesome-icon icon="hand-point-down" class="h-6 w-6" />
      </div>
    </div>

    <div v-if="loading" class="min-h-[200px] flex items-center justify-center">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>

    <div v-else-if="error" class="alert alert-error shadow-lg">
      <font-awesome-icon icon="triangle-exclamation" class="h-6 w-6" />
      <span>{{ error }}</span>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(zikr, index) in songStore.zikrItems"
        :key="index"
        :data-zikr-index="index"
        class="card zikr-fullwidth-card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1"
        :class="{'bg-gray-800/90 text-white': themeStore.theme === 'dark', 'bg-white/90 text-gray-800': themeStore.theme === 'light'}"
      >
        <div class="card-body">
          <h2 
          class="card-title text-2xl"
          @click="togglePlayer(index)"
          >{{ zikr.zikrTitle }}</h2>
         
          <transition name="fade">
          <div 
          v-show="expandedIndex === index" 
          class="mt-6 space-y-6"
          >
            <!-- <div class="card bg-base-200"> -->
              <!-- <div class="card-body"> -->
                <div v-if="expandedIndex === index">
                  <suspense>
                <audio-player
                :key="`player-${index}`"
                :audio-src="zikr.zikrLink"
                  :player-type="getPlayerType(zikr.zikrLink)"
                  @player-ready="onPlayerReady"
                />
              </suspense>
              <!-- </div> -->
            <!-- </div> -->
          </div>

            <div 
              v-if="zikr.zikrLyrics" 
              class="card-body prose max-w-none"
            >
              <!-- <div class="card-body prose max-w-none"> -->
                <!-- <h3 class="card-title text-xl mb-4">Words</h3> -->
                <div 
                  v-for="(stanzaLines, stanzaIndex) in zikr.zikrLyrics" 
                  :key="stanzaIndex" 
                  class="mb-6 last:mb-0"
                >
                  <div
                    v-for="(line, lineIndex) in stanzaLines"
                    :key="lineIndex"
                    class="text-lg leading-relaxed"
                    v-html="parseHyperlinks(line)"  
                    >
                    
              </div>
                </div>
              <!-- </div> -->
            </div>
          </div>
        </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useSongStore } from "../stores/songStore";
import AudioPlayer from "./AudioPlayer.vue";
import { parseHyperlinks } from '@/utils/hyperlinkParser.ts';  // Import from 
import { getPlayerType } from '@/utils/playerUtils.ts'; // Update this import
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
const songStore = useSongStore();
const loading = ref(true);
const error = ref("");
const expandedIndex = ref(-1);
const toggleInProgress = ref(false);



const togglePlayer = async (index: number) => {
  // Prevent multiple toggles at once
  if (toggleInProgress.value) return;
  
  toggleInProgress.value = true;
  // console.log(`Toggling card ${index}, current expanded: ${expandedIndex.value}`);
  
  try {
    // If clicking the same card, close it
    if (expandedIndex.value === index) {
      expandedIndex.value = -1;
    } else {
      // First close any open player 
      if (expandedIndex.value !== -1) {
        expandedIndex.value = -1;
        // Wait for unmount to complete
        await nextTick();
      }
      
      // Then open the new one
      expandedIndex.value = index;

      // Add scroll behavior after expanding
      await nextTick();
      const element = document.querySelector(`[data-zikr-index="${index}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
   
    }
    
    // console.log(`After toggle: expanded index is now ${expandedIndex.value}`);
  } catch (err) {
    console.error('Error toggling player:', err);
  } finally {
    // Allow toggles again after a short delay
    setTimeout(() => {
      toggleInProgress.value = false;
    }, 100);
  }
};

// const parseHyperlinksWithIcon = (text: string) => {
//   console.log('text:', text);  
//   const parsedText = parseHyperlinks(text);
//   console.log('parsedText:', parsedText);  
//   return parsedText.replace(
//     /<a\s+href="([^"]+)"/g, 
//     '<a href="$1" class="inline-flex items-center gap-2"><font-awesome-icon icon="music" class="text-primary" />'
//   );
// };

// Add this to ensure pages start at the top
onMounted(async () => {
  window.scrollTo(0, 0);
  // ... rest of your existing onMounted code ...
});

const onPlayerReady = (playerData: any) => {
  // console.log("Player ready:", playerData);
};

onMounted(async () => {
  try {
    loading.value = true;
    if (songStore.zikrItems.length === 0) {
      await songStore.fetchSongs(true);
    }
  } catch (err) {
    error.value = "Failed to load zikr samples. Please try again later.";
  } finally {
    loading.value = false;
  }
});

</script>

<style>
.music-link::before {
  content: "🎵 ";
  color: var(--primary-color);
}
/* Add transitions for a smoother experience */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Add some hover effect for the hyperlinks */
:deep(a) {
  transition: all 0.2s;
}

:deep(a:hover) {
  color: var(--primary-color);
  transform: scale(1.05);
}

.zikr-fullwidth-card {
  width: 100vw;
  max-width: 100vw;
  margin-left: -16px;
  margin-right: -16px;
  border-radius: 0;
}
@media (min-width: 640px) {
  .zikr-fullwidth-card {
    width: 100%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 1rem;
  }
}
</style>