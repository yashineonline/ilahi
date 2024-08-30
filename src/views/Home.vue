<template>
  <div class="container mx-auto">
    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <QuotesAndPoems />
    </div>
    
    <div class="p-4">
      <h1 class="text-4xl font-bold text-green-800 mb-6">Welcome to Ilahi Book App</h1>
      

      <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <p class="text-xl mb-4">Explore our collection of Sacred Sufi Songs and Hymns.</p>
        <p class="mb-4">The intention of this Ilahi Book App is to eventually provide a comprehensive library of spiritual songs, complete with translations and audio links.</p>
        <div class="flex justify-center">
          <router-link to="/songs" class="btn btn-primary">View Ilahi List</router-link>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-semibold mb-4">Features</h2>
          <ul class="list-disc pl-5">
            <li>Browse a vast collection of Ilahis</li>
            <li>By Categories (Newest Feature)</li>
            <li>By who is singing (coming soon)</li>
            <li>Lyrics with translations (other languages coming soon)</li>
            <li>Listen to audio recordings (Now Available!)</li>
            <li>Generate PDF version of each Ilahi</li>
            <li>Customize your own Book of Ilahis (New Cover)</li>
            <li>Create your own book design (Coming Soon)</li>
          </ul>
        </div>
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-2xl font-semibold mb-4">About Us</h2>
          <p>The Ilahi Book App is maintained by the Ansari Qadiri Rifai Tariqa (AQRT), dedicated to preserving and sharing Sufi spiritual traditions.</p>
          <a href="https://aqrtsufi.org" target="_blank" rel="noopener noreferrer" class="btn btn-secondary mt-4">Learn more about AQRT</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { defineComponent } from 'vue';
import QuotesAndPoems from '@/components/QuotesAndPoems.vue';


</script>
