<template>
  <div class="card bg-base-200 shadow-xl m-4">
    <div class="card-body">
      <blockquote class="text-lg italic text-center text-base-content">
        "{{ dailyQuote.text }}"
      </blockquote>
      <p class="text-right font-semibold mt-2 text-base-content">— {{ dailyQuote.author }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAllQuotes } from '@/utils/quoteFetcher';
import { Quote, AuthorQuotes } from '@/utils/types';

// import { QUOTES, AUTHOR } from '@/utils/contentConfig';

const authors = ref<AuthorQuotes[]>([]);
const dailyQuote = ref({ text: '', author: '' });
const loading = ref(true);
const error = ref('');

const getRandomQuote = () => {
  const allQuotes = authors.value.flatMap(author => author.quotes.map(quote => ({ text: quote.text, author: author.name })));
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
};

const updateQuote = () => {
  // const today = new Date().toDateString();
  // const storedDate = localStorage.getItem('quoteDate');
  // const storedQuote = localStorage.getItem('dailyQuote');

  // if (storedDate !== today || !storedQuote) {
    const newQuote = getRandomQuote();
    dailyQuote.value = newQuote;
    // localStorage.setItem('quoteDate', today);
    localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
  // } else {
    // dailyQuote.value = JSON.parse(storedQuote);
  }
// };

onMounted(async () => {
  try {
    authors.value = await fetchAllQuotes();
    updateQuote();
  } catch (err) {
    console.error('Error fetching quotes:', err);
    error.value = 'Failed to load quotes. Please try again later.';
  } finally {
    loading.value = false;
  }
});

</script>