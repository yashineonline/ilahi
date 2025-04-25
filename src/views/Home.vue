<template>
      <div class="min-h-screen bg-base-100 text-base-content">
    <!-- <div class="container mx-auto p-4">    -->
    <RandomIlahi/> 
    <div class="bg-base-200 p-4 rounded-lg mb-6">
      <Quotes />
      
    </div>
    
    <div class="p-4">
      <h1 class="text-4xl font-bold text-green-800 mb-6">Welcome to ilahi Book App</h1>
      
      <div class="card bg-base-200 shadow-xl m-4">
    <div class="card-body">
      <blockquote class="text-lg italic text-center text-base-content">
        "İlahis are the flowers that sprout from the hearts of lovers"
      </blockquote>
      <p class="text-right font-semibold mt-2 text-base-content">— Shaykh Nishaat Ahmed Siddiqi</p>
    </div>
  </div>

      <div class="shadow-lg rounded-lg p-6 mb-8 bg-base-200">
        <p class="text-xl mb-4">Explore our collection of Sacred Sufi Songs and Hymns.</p>
        <p class="mb-4">The intention of this ilahi Book App is to eventually provide a comprehensive library of sacred songs (ilahis, kasides, nats, tevşihs, and other traditional spiritual songs sung in tekke), complete with translations and audio links, insha Allah [if The Highest Power wills].</p>
        <div class="flex justify-center">
          <router-link to="/songs" class="btn btn-secondary mt-4">View ilahi List</router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="shadow-lg rounded-lg p-6 bg-base-200">
          <h2 class="text-2xl font-semibold mb-4">Features</h2>
          <ul class="list-disc pl-5 text-left">
            <li>Browse our extensive collection of ilahis</li>
            <li>Listen to authentic audio recordings</li>
            <li>Search ilahis by categories and themes</li>
            <li>Filter ilahis by specific zikr practices</li>
            <li>Explore the history and context of ilahis</li>
            <li>Generate and download PDFs of individual ilahis</li>
            <li>Create and customize your own PDF book of ilahis</li>
            <li>Join our vibrant ilahi community and attend free classes</li>
            <li>Discover poems by Shaykh Taner and Shaykha Muzeyyen and their representatives and followers and lovers</li> 
          </ul>
          <h1> - </h1>
          <h2 class="text-2xl font-semibold mb-4">Upcoming Features</h2>
          <ul class="list-disc pl-5 text-left">            
            <li>ilahi lyrics with translations in other languages</li>
            <li>Create your own ilahi book design</li>
            <li>Record yourself singing and get feedback</li>
          </ul>

        </div>
        <div class="shadow-lg rounded-lg p-6 bg-base-200">
          <h2 class="text-2xl font-semibold mb-4">About Us</h2>
          <p>The ilahi Book App is maintained by the Ansari Qadiri Rifai Tariqa (AQRT), dedicated to preserving and sharing Sufi spiritual traditions.</p>
          <p>Are you enjoying the ilahi Book App? Would you like to see more apps like this — perhaps a modern, interactive Quran app? You can support the development of such projects by donating on the AQRT website. Use 'app' as your donation reference.</p>
          
          <a href="https://aqrtsufi.org" target="_blank" rel="noopener noreferrer" class="btn btn-secondary mt-4">Learn more about AQRT</a>
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Quotes from '@/components/Quotes.vue';
import RandomIlahi from '@/components/RandomIlahi.vue';
import { useThemeStore } from '../stores/themeStore';
import { ref, onMounted } from 'vue';

const themeStore = useThemeStore();
const isDark = ref(themeStore.theme === 'dark');


// const toggleTheme = () => {
//   themeStore.toggleTheme();
//   isDark.value = !isDark.value;
//   document.documentElement.classList.toggle('dark', isDark.value);
//   console.log(`Theme toggled to: ${themeStore.theme}`);
// };

onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value);
  console.log(`Initial theme: ${themeStore.theme}`);
});

</script>
