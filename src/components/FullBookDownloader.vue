<template>
  <div>
    <button @click="downloadFullBook" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
      Download Full PDF Book
    </button>
  </div>
</template>

<script setup lang="ts">
import { generateFullBookPDF } from '../utils/pdfGenerator';
import { useSongStore } from '../stores/songStore';

const songStore = useSongStore();

const downloadFullBook = async () => {
  await generateFullBookPDF(songStore.songs);
};
</script>
