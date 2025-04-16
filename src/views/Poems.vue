<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-6 text-center text-green-800">Poems and Reflections</h1>
    
    <div v-if="loading" class="text-center text-xl">Loading poems...</div>
    
    <div v-else-if="error" class="text-center text-xl text-red-600">{{ error }}</div>
    
    <template v-else>
      <section v-if="shaykhTanerPoems" class="mb-8">
        <router-link 
          :to="{ name: 'AuthorPoems', params: { authorName: shaykhTanerPoems.name } }" 
          class="text-2xl font-semibold text-blue-700 hover:text-red-900"
        >
        Poems on Love by Shaykh Taner
        </router-link>
      </section>

      <section v-if="otherAuthors.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 ">More Poems</h2>
        <ul class="space-y-4">
          <li v-for="author in otherAuthors" :key="author.name">
            <router-link 
              :to="{ name: 'AuthorPoems', params: { authorName: author.name } }" 
              class="text-xl font-semibold text-blue-700 hover:text-red-900"
            >
              {{ author.name }}
            </router-link>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchAllPoems } from '../utils/poemFetcher';

interface Author {
  name: string;
  poems: {
    title: string;
    content: string[];
    slug: string;
  }[];
}

const authors = ref<Author[]>([]);
const loading = ref(true);
const error = ref('');

const shaykhTanerPoems = computed(() => authors.value.find(author => author.name === "Shaykh Taner Vargonen Ansari"));
const otherAuthors = computed(() => authors.value.filter(author => author.name !== "Shaykh Taner Vargonen Ansari"));

onMounted(async () => {
  try {
    authors.value = await fetchAllPoems();
  } catch (err) {
    console.error('Error fetching poems:', err);
    error.value = 'Failed to load poems. Please try again later.';
  } finally {
    loading.value = false;
  }
});
</script>