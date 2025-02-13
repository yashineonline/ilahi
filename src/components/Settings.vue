<template>
    <button @click="resetLanguage" class="btn btn-secondary">Reset Language Choice</button>
  </template>
  
  <script setup lang="ts">
  import { resetLanguageChoice } from '../utils/pronunciationService';
  
  const resetLanguage = () => {
    resetLanguageChoice();
    alert('Language choice has been reset. You will be prompted to choose again.');
  };
  </script>