<template>
  <div class="w-full max-w-4xl mx-auto p-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">AQRT Zikr Practice</h1>
      <p class="text-base-content/70">Do zikr and follow along with the audio recordings of Shaykh Taner!</p>

      <!-- Add instruction message when no zikrs are loaded -->
      <div v-if="songStore.zikrItems.length === 0 && !loading" class="alert alert-info shadow-lg mt-4">
        <font-awesome-icon icon="info-circle" class="h-6 w-6" />
        <span>Click the refresh button <font-awesome-icon icon="rotate" class="text-primary mx-1" /> above to load the zikr recordings.</span>
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
        class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1"
        @click="togglePlayer(index)"
      >
        <div class="card-body">
          <h2 class="card-title text-2xl">{{ zikr.zikrTitle }}</h2>

          <div 
            v-if="expandedIndex === index" 
            class="mt-6 space-y-6"
          >
            <div class="card bg-base-200">
              <div class="card-body">
                <audio-player
                  :audio-src="zikr.zikrLink"
                  player-type="googledrive"
                  @player-ready="onPlayerReady"
                />
              </div>
            </div>

            <div 
              v-if="zikr.zikrLyrics" 
              class="card bg-base-200"
            >
              <div class="card-body prose max-w-none">
                <h3 class="card-title text-xl mb-4">Words</h3>
                <div 
                  v-for="(stanzaLines, stanzaIndex) in zikr.zikrLyrics" 
                  :key="stanzaIndex" 
                  class="mb-6 last:mb-0"
                >
                  <p 
                    v-for="(line, lineIndex) in stanzaLines"
                    :key="lineIndex"
                    class="text-lg leading-relaxed"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSongStore } from "../stores/songStore";
import AudioPlayer from "./AudioPlayer.vue";

const songStore = useSongStore();
const loading = ref(true);
const error = ref("");
const expandedIndex = ref(-1);

const togglePlayer = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? -1 : index;
};

const onPlayerReady = (playerData: any) => {
  console.log("Player ready:", playerData);
};

const fetchData = async () => {
  loading.value = true;
  try {
    await songStore.fetchSongs();
  } catch (err) {
    console.error("Error:", err);
    error.value = "Failed to load zikr samples. Please try again later.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);
</script>
