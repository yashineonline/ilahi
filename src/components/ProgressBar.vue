<template>
    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
      <div class="bg-blue-400 h-2.5 rounded-full" :style="{ width: `${Math.min(100, progress)}%` }"></div>
    </div>
    <div class="text-center mt-2">{{ Math.min(100, Math.round(progress)) }}%</div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    progress: number;
  }>();
  </script>