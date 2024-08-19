<template>
    <div class="p-6 bg-blue-500 text-white rounded-lg space-y-4">
      <h1>Ilahi Book</h1>
      <p>Download the complete collection of Ilahi songs as a PDF book.</p>
      <FullBookDownloader />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import FullBookDownloader from '@/components/FullBookDownloader.vue';
  
  export default defineComponent({
    name: 'BookView',
    components: {
      FullBookDownloader
    }
  });
  </script>
  