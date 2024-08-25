<template>
  <div class="p-6 bg-blue-500 text-white rounded-lg space-y-4">
    <h1 class="text-2xl font-bold">Ilahi Book</h1>
    <p>Download our collection of Ilahis as a PDF book.</p>
    <div v-if="isLoading" class="text-center">
      <p>Loading... Please wait.</p>
    </div>
    <div v-else class="space-y-2">
      <button @click="downloadFullBook" :disabled="isLoading" class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Download Full PDF Book
      </button>
      <button @click="downloadBasicBook" :disabled="isLoading" class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Download Basic-Ilahi PDF Book (Coming soon!)
      </button>
      <button @click="showSongSelector = true" :disabled="isLoading" class="px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded hover:bg-purple-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Create Custom Book
      </button>
    </div>
    <div v-if="showSongSelector && !isLoading" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">
        Select ilahis for your custom book.<br>
        Then scroll down to order them.
      </h2>
      <div class="space-y-2">
        <button
          v-for="song in songStore.songs"
          :key="song.title"
          @click="toggleSongSelection(song)"
          :class="['w-full text-left px-4 py-2 rounded transition-colors']"
          :style="selectedSongs.includes(song) ? 'background-color: #9333ea; color: #4ade80;' : 'background-color: white; color: #9333ea; border: 1px solid #9333ea;'"
        >
          {{ song.title }}
        </button>
      </div>
      <div v-if="selectedSongs.length > 0" class="mt-4">
        <SelectedSongsManager
          :selectedSongs="selectedSongs"
          @update:selectedSongs="selectedSongs = $event"
          @generate-book="generateCustomBook"
        />
      </div>
      <div class="mt-4 space-x-2">
        <button
          v-if="selectedSongs.length > 0"
          @click="generateCustomBook"
          :disabled="isLoading"
          class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download My Custom Book
        </button>
        <button
          @click="resetSelection"
          class="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
        >
          Reset Selection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSongStore } from '../stores/songStore';
import { generateFullBookPDF } from '../utils/fullSongBookPDF';
import { downloadPDF } from '../utils/pdfBookUtils';
import { SongData } from '../utils/types';
import SelectedSongsManager from '../components/SelectedSongsManager.vue';

const songStore = useSongStore();
const showSongSelector = ref(false);
const selectedSongs = ref<SongData[]>([]);
const isLoading = ref(false);

onMounted(async () => {
  if (songStore.songs.length === 0) {
    isLoading.value = true;
    await songStore.fetchSongs();
    isLoading.value = false;
  }
});

const downloadFullBook = async () => {
  if (songStore.songs.length === 0) {
    alert('No songs available. Please try again later.');
    return;
  }
  isLoading.value = true;
  const { pdfBytes } = await generateFullBookPDF(songStore.songs);
  await downloadPDF(pdfBytes, 'AQRT_Ilahi_DraftBook.pdf');
  isLoading.value = false;
};

const downloadBasicBook = () => {
  alert('This feature is coming soon!');
};

const generateCustomBook = async () => {
  if (selectedSongs.value.length === 0) {
    alert('Please select at least one song for your custom book.');
    return;
  }
  isLoading.value = true;
  const { pdfBytes } = await generateFullBookPDF(selectedSongs.value, true); 
  await downloadPDF(pdfBytes, 'AQRT_Custom_Ilahi_Book.pdf');
  isLoading.value = false;
};

const toggleSongSelection = (song: SongData) => {
  const index = selectedSongs.value.findIndex(s => s.title === song.title);
  if (index === -1) {
    selectedSongs.value = [...selectedSongs.value, song];
  } else {
    selectedSongs.value = selectedSongs.value.filter(s => s.title !== song.title);
  }
  console.log('Selected songs:', selectedSongs.value);
};

const resetSelection = () => {
  selectedSongs.value = [];
  showSongSelector.value = true;
};
</script>