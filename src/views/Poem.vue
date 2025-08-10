<template>
    <div class="container mx-auto p-4">
      <router-link to="/poems" class="text-green-700 hover:text-green-900 mb-4 inline-block">
        &larr; Back to Poems
      </router-link>
      
      <div v-if="loading" class="text-center text-xl">Loading poem...</div>
      
      <div v-else-if="error" class="text-center text-xl text-red-600">{{ error }}</div>
      
      <div v-else-if="poem" class="shadow-lg rounded-lg p-6">
        <h1 class="text-3xl font-bold mb-6">{{ poem.title }}</h1>
        <div v-for="(paragraph, index) in poem.content" :key="index" class="mb-4">
          <p v-if="paragraph" class="whitespace-pre-wrap" v-html="parseHyperlinks(paragraph)"></p>
          <br v-else>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { fetchAllPoems } from '../utils/poemFetcher';
  import { parseHyperlinks } from '../utils/hyperlinkParser';
  
  const route = useRoute();
  const poem = ref<any>(null);
  const loading = ref(true);
  const error = ref('');
  
  onMounted(async () => {
    try {
      const allAuthors = await fetchAllPoems();
      const targetSlug = route.params.slug as string;
      
      for (const author of allAuthors) {
        const foundPoem = author.poems.find(p => p.slug === targetSlug);
        if (foundPoem) {
          poem.value = foundPoem;
          break;
        }
      }
      
      if (!poem.value) {
        error.value = 'Poem not found';
      }
    } catch (err) {
      error.value = 'Failed to load poem';
    } finally {
      loading.value = false;
    }
  });
  </script>