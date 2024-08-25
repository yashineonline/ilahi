<template>
  <div>
    <button @click="downloadFullBook" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
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