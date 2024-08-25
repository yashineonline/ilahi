<template>
  <nav :class="['navbar shadow-lg', themeStore.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800']" aria-label="Main navigation">
    <div class="container mx-auto px-4">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost normal-case text-xl" aria-label="Home">AQRT Sufi Songs</router-link>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/about" class="btn btn-ghost btn-sm rounded-btn">About</router-link></li>
          <li><router-link to="/songs" class="btn btn-ghost btn-sm rounded-btn">Song List</router-link></li>
          <li><router-link to="/book" class="btn btn-primary btn-sm rounded-btn">Download Full Book</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
</script>