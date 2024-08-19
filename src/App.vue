<template>
<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-green-600 text-white p-4">
      <h1 class="text-2xl font-bold">Ilahi App</h1>
    </header>
    <main class="container mx-auto p-4">
      <!-- ... router view or main content ... -->
      <div id="app" class="font-sans antialiased text-center text-gray-800 mt-16">
    <Header />
    <RouterView />
    <SongDisplay />
  </div>

    </main>
    <footer class="bg-green-600 text-white p-4 mt-8">
      <p class="text-center">&copy; 2023 Ilahi App. All rights reserved.</p>
    </footer>
  </div>
</template>



<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from "./components/Header.vue"
import SongDisplay from "./components/SongDisplay.vue"
</script>

