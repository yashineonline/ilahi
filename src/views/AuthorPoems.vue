<template>
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-6 text-center text-green-800">{{ authorName }}</h1>
      
      <router-link to="/poems" class="text-green-700 hover:text-green-900 mb-4 inline-block">
        &larr; Back to Authors
      </router-link>
  
      <div v-for="poem in authorPoems" :key="poem.slug" class="shadow-lg rounded-lg p-6 mb-8">
        <h3 class="text-2xl font-semibold mb-4">{{ poem.title }}</h3>
        <div v-for="(paragraph, index) in poem.content" :key="index" class="mb-4">
          <p v-if="paragraph" class="whitespace-pre-wrap">{{ paragraph }}</p>
          <br v-else>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { fetchAllPoems } from '../utils/poemFetcher';
  
  const route = useRoute();
  const authorName = computed(() => route.params.authorName as string);
  const authorPoems = ref<any[]>([]);
  
  onMounted(async () => {
    const allAuthors = await fetchAllPoems();
    const author = allAuthors.find(a => a.name === authorName.value);
    if (author) {
      authorPoems.value = author.poems;
    }
  });
  </script>