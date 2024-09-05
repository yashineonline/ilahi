<template>
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold mb-6 text-center text-green-800">Poems on Love by Shaykh Taner</h1>
      <div v-for="(poem, index) in POEMS" :key="index" class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4">{{ poem.title }}</h2>
        <p class="mb-4 whitespace-pre-wrap">{{ poem.content }}</p>
      </div>
    </div>
    <Entrance />
  </template>
  
  <script setup lang="ts">
  import { POEMS } from '../utils/contentConfig';
  import Entrance from '@/components/Entrance.vue';
  </script>