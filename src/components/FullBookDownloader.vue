<template>
  <div>
    <button @click="downloadFullBook" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
      Download Full PDF Book
    </button>
    <button @click="downloadBasicBook" class="btn btn-secondary">
      Download Basic Zikr Book
    </button>
    <button @click="downloadIntermediateBook" class="btn btn-accent">
      Download Intermediate Book
    </button>
  </div>
</template>

<script setup lang="ts">
import { generateFullBookPDF } from '../utils/fullSongBookPDF';
import { useSongStore } from '../stores/songStore';
import { downloadPDF } from '../utils/pdfBookUtils';
import { CATEGORIES, filterSongsByCategory } from '../utils/categoryUtils';

const songStore = useSongStore();

const downloadFullBook = async () => {
  const { pdfBytes } = await generateFullBookPDF(songStore.songs);
  await downloadPDF(pdfBytes, 'AQRT_ilahi_FullBook.pdf');
};

const downloadBasicBook = async () => {
  const basicSongs = filterSongsByCategory(songStore.songs, [CATEGORIES.BASIC]);
  const { pdfBytes } = await generateFullBookPDF(basicSongs);
  await downloadPDF(pdfBytes, 'AQRT_ilahi_BasicBook.pdf');
};

const downloadIntermediateBook = async () => {
  const intermediateSongs = filterSongsByCategory(songStore.songs, [CATEGORIES.INTERMEDIATE]);
  const { pdfBytes } = await generateFullBookPDF(intermediateSongs);
  await downloadPDF(pdfBytes, 'AQRT_ilahi_IntermediateBook.pdf');
};
</script>