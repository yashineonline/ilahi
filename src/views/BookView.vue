<template>
  <div class="p-6 bg-blue-500 text-white rounded-lg space-y-4">
    <h1>Ilahi Book</h1>
    <p>Download the complete collection of Ilahi songs as a PDF book.</p>
    <button @click="downloadFullBook" class="px-4 py-2 bg-white text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors">
      Download Full PDF Book
    </button>
  </div>
</template>

<script setup lang="ts">
import { generateFullBookPDF } from '../utils/fullSongBookPDF';
import { useSongStore } from '../stores/songStore';
import { downloadPDF } from '../utils/pdfBookUtils';

const songStore = useSongStore();

const downloadFullBook = async () => {
  const pdfBytes = await generateFullBookPDF(songStore.songs);
  await downloadPDF(pdfBytes, 'AQRT_Ilahi_Book.pdf');
};
</script>