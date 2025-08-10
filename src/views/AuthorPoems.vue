<template>
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-6 text-center text-green-800">{{ authorName }}</h1>
      
      <router-link to="/poems" class="text-green-700 hover:text-green-900 mb-4 inline-block">
        &larr; Back to Authors
      </router-link>
  
      <div v-for="poem in authorPoems" :key="poem.slug" :id="poem.slug" class="shadow-lg rounded-lg p-6 mb-8"
        :class="{ 'ring-4 ring-blue-500': highlightedPoem === poem.slug }">
        <h3 class="text-2xl font-semibold mb-4">{{ poem.title }}</h3>
        <div v-for="(paragraph, index) in poem.content" :key="index" class="mb-4">
          <p v-if="paragraph" class="whitespace-pre-wrap" v-html="parseHyperlinks(paragraph)"></p>
          <br v-else>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  // import { fetchAllPoems } from '../utils/poemFetcher';
  import { parseHyperlinks } from '../utils/hyperlinkParser';
  import { usePoemStore } from '../stores/poemStore';


  const route = useRoute();
  const authorName = computed(() => route.params.authorName as string);
  // const authoroems = ref<any[]>([]);
  const highlightedPoem = ref<string | null>(null);
  const poemStore = usePoemStore();

  // Computed property that updates when store changes
const authorPoems = computed(() => {
  const author = poemStore.authors.find(a => a.name === authorName.value);
  return author ? author.poems : [];
});

  onMounted(async () => {
     // Fetch poems if not already loaded
  if (poemStore.authors.length === 0) {
    await poemStore.fetchPoems();
  }
    // const allAuthors = await fetchAllPoems();
    // const author = allAuthors.find(a => a.name === authorName.value);
    // if (author) {
      // authorPoems.value = author.poems;

       // Check for poem parameter and scroll to it
    await nextTick();
    if (route.query.poem) {
      const targetSlug = route.query.poem as string;
      scrollToPoem(targetSlug);
    }
    // }
  });

// Watch for route changes (in case user navigates to a different poem)
watch(() => route.query.poem, async (newPoem, oldPoem) => {
  if (newPoem && newPoem !== oldPoem) {
    await nextTick();
    scrollToPoem(newPoem as string);
  }
}, { immediate: false });

function scrollToPoem(slug: string) {
  const targetElement = document.getElementById(slug);
  if (targetElement) {
    // Highlight the poem briefly
    highlightedPoem.value = slug;
    setTimeout(() => {
      highlightedPoem.value = null;
    }, 3000);
    
    // Scroll to the poem with smooth behavior
    targetElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

  </script>

<style scoped>
.ring-4 {
  animation: pulse 2s;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>