<template>
  <div class="w-full max-w-4xl mx-auto p-6 bg-blue-500 text-white rounded-lg space-y-4">
    <h1 class="text-2xl font-bold">ilahi Book</h1>
    <p>Download our collection of ilahis as a PDF book.</p>
    <div v-if="isLoading" class="text-center">
      <p>Loading... Please wait.</p>
      <ProgressBar :progress="progress" />
    </div>
    <div v-else class="space-y-2">
      <button @click="downloadBasicBook" :disabled="isLoading" class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Download {{ basicSongs.length }} Basic ilahis
      </button>
      <button @click="downloadIntermediateBook" :disabled="isLoading" class="px-4 py-2 bg-white text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {{ intermediateSongs.length }} ilahis (including Basic)
      </button>
      <button @click="showSongSelector = true" :disabled="isLoading" class="px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded hover:bg-purple-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Create Custom Book
      </button>
      <button @click="confirmDownload('all')" :disabled="isLoading" class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        {{ songStore.songs.length }} ilahis
      </button>
    </div>
    <div v-if="showSongSelector && !isLoading" class="mt-4">
      <h2 class="text-xl font-semibold mb-2">
        Select ilahis below by tapping on them in the order that you would like for your custom book.<br>
        Then scroll down to generate the book as a PDF.
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

  <!-- Confirmation Modal -->
  <div class="modal" :class="{ 'modal-open': showConfirmModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm Download</h3>
      <p class="py-4">Are you sure you want to download all {{ songStore.songs.length }} ilahis?</p>
      <div class="modal-action">
        <button @click="downloadFullBook" class="btn btn-primary">Yes, Download them all!</button>
        <button @click="showConfirmModal = false" class="btn">No, this is too much!</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSongStore } from '../stores/songStore';
import { generateFullBookPDF } from '../utils/fullSongBookPDF';
import { downloadPDF } from '../utils/pdfBookUtils';
import { SongData } from '../utils/types';
import SelectedSongsManager from '../components/SelectedSongsManager.vue';
import { CATEGORIES, filterSongsByCategory } from '../utils/categoryUtils';
import ProgressBar from '../components/ProgressBar.vue';

const songStore = useSongStore();
const showSongSelector = ref(false);
const selectedSongs = ref<SongData[]>([]);
const isLoading = ref(false);
const showConfirmModal = ref(false);
const progress = ref(0);

const basicSongs = computed(() => filterSongsByCategory(songStore.songs, ['basic']));
const intermediateSongs = computed(() => filterSongsByCategory(songStore.songs, ['intermediate']));

onMounted(async () => {
  if (songStore.songs.length === 0) {
    isLoading.value = true;
    await songStore.fetchSongs();
    isLoading.value = false;
  }
});

const confirmDownload = (type: 'all' | 'basic' | 'intermediate') => {
  if (type === 'all') {
    showConfirmModal.value = true;
  } else if (type === 'basic') {
    downloadBasicBook();
  } else if (type === 'intermediate') {
    downloadIntermediateBook();
  }
};

const downloadFullBook = async () => {
  showConfirmModal.value = false;
  if (songStore.songs.length === 0) {
    alert('No songs available. Please try again later.');
    return;
  }
  isLoading.value = true;
  progress.value = 0;
  try {
    const { pdfBytes, logs } = await generateFullBookPDF(songStore.songs, false, (p) => {
      progress.value = p;
    });
    progress.value = 99; // Set to 99% before starting download
    await downloadPDF(pdfBytes, 'AQRT_ilahi_DraftBook.pdf');
    progress.value = 100; // Set to 100% when download is complete
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};

const downloadBasicBook = async () => {
  if (basicSongs.value.length === 0) {
    alert('No basic ilahis available. Please try again later.');
    return;
  }
  
  isLoading.value = true;
  progress.value = 0;
  try {
    // Sort basic songs by order number before generating PDF
    const sortedBasicSongs = [...basicSongs.value].sort((a, b) => 
      (a.order || 999999) - (b.order || 999999)
    );
    
    const { pdfBytes, logs } = await generateFullBookPDF(sortedBasicSongs, false, (p) => {
      progress.value = p;
    });
    progress.value = 99; // Set to 99% before starting download
    await downloadPDF(pdfBytes, 'AQRT_Basic_ilahi.pdf');
    progress.value = 100; // Set to 100% when download is complete
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};

const downloadIntermediateBook = async () => {
  if (intermediateSongs.value.length === 0) {
    alert('No intermediate ilahis available. Please try again later.');
    return;
  }
  isLoading.value = true;
  progress.value = 0;
  try {
    const { pdfBytes, logs } = await generateFullBookPDF(intermediateSongs.value, false, (p) => {
      progress.value = p;
    });
    progress.value = 99; // Set to 99% before starting download
    await downloadPDF(pdfBytes, 'AQRT_Intermediate_ilahi.pdf');
    progress.value = 100; // Set to 100% when download is complete
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Please try again later.');
  } finally {
    isLoading.value = false;
  }
};

const generateCustomBook = async () => {
  if (selectedSongs.value.length === 0) {
    alert('Please select at least one song for your custom book.');
    return;
  }
  isLoading.value = true;
  const { pdfBytes } = await generateFullBookPDF(selectedSongs.value, true);
  await downloadPDF(pdfBytes, 'AQRT_Custom_ilahi_Book.pdf');
  isLoading.value = false;
};

const toggleSongSelection = (song: SongData) => {
  const index = selectedSongs.value.findIndex(s => s.title === song.title);
  if (index === -1) {
    selectedSongs.value = [...selectedSongs.value, song];
  } else {
    selectedSongs.value = selectedSongs.value.filter(s => s.title !== song.title);
  }
  // console.log('Selected songs:', selectedSongs.value);
};

const resetSelection = () => {
  selectedSongs.value = [];
  showSongSelector.value = true;
};
</script>