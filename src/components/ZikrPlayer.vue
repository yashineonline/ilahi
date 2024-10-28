<template>
  <div class="w-full max-w-4xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">AQRT Zikr Practice</h1>

    <div v-if="loading" class="text-center">
      <div class="loading loading-spinner loading-lg"></div>
    </div>

    <div v-else-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(zikr, index) in songStore.zikrItems"
        :key="index"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body">
          <div class="flex justify-between items-center">
            <h2 class="card-title">{{ zikr.zikrTitle }}</h2>
            <button class="btn btn-primary btn-sm" @click="togglePlayer(index)">
              {{ expandedIndex === index ? "Hide" : "Show" }} Player and Lyrics
            </button>
          </div>

          <div v-if="expandedIndex === index" class="mt-4">
            <audio-player
              :audio-src="zikr.zikrLink"
              player-type="googledrive"
              @player-ready="onPlayerReady"
            />
            <!-- Add lyrics display -->
            <div v-if="zikr.zikrLyrics" class="mt-4 p-4 bg-base-200 rounded-lg">
              <div 
                v-for="(stanzaLines, stanzaIndex) in zikr.zikrLyrics" 
                :key="stanzaIndex" 
                class="mb-6 border-b border-base-300 pb-4"
                >
                <div
                  v-for="(line, lineIndex) in stanzaLines"
                  :key="lineIndex"
                  class="text-lg leading-relaxed"
                  >
                  {{ line }}
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

onMounted(async () => {
  loading.value = true;
  try {
    if (songStore.songs.length === 0) {
      await songStore.fetchSongs();
    }
// Add debug logging
console.log('Zikr items:', songStore.zikrItems);
    songStore.zikrItems.forEach((zikr, index) => {
      console.log(`Zikr ${index}:`, {
        title: zikr.zikrTitle,
        hasLyrics: !!zikr.zikrLyrics,
        lyricsLength: zikr.zikrLyrics?.length
      });
    });

  } catch (err) {
    console.error("Error:", err);
    error.value = "Failed to load zikr samples. Please try again later.";
  } finally {
    loading.value = false;
  }
});
</script>