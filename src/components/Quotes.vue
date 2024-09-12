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
import { QUOTES, AUTHOR } from '@/utils/contentConfig';

const dailyQuote = ref({ text: '', author: '' });

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * QUOTES.length);
  return { text: QUOTES[randomIndex], author: AUTHOR };
};

const updateQuote = () => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem('quoteDate');
  const storedQuote = localStorage.getItem('dailyQuote');

  if (storedDate !== today || !storedQuote) {
    const newQuote = getRandomQuote();
    dailyQuote.value = newQuote;
    localStorage.setItem('quoteDate', today);
    localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
  } else {
    dailyQuote.value = JSON.parse(storedQuote);
  }
};

onMounted(() => {
  updateQuote();
});
</script>