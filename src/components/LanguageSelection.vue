<template>
    <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 class="text-2xl font-bold mb-4">Choose Your Language</h2>
        <p class="mb-4">Select a language to replace Turkish sounds with familiar equivalents:</p>
        <div class="space-y-2">
          <button
            v-for="language in languages"
            :key="language"
            @click="selectLanguage(language)"
            class="btn btn-primary btn-block"
            :aria-label="`Select ${language} as your language`"

          >
            {{ language }}
          </button>
        </div>
        <button @click="closePopup" class="btn btn-ghost mt-4" aria-label="Close language selection popup">Close</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { setSelectedLanguage } from '../utils/pronunciationService';
  
  const emit = defineEmits(['close']);

  const showPopup = ref(true);
  const languages = ['English', 'French', 'German', 'Spanish'];
  
  const selectLanguage = (language: string) => {
    console.log('Language selected:', language);
    setSelectedLanguage(language.toLowerCase());
    closePopup();
  };
  
  const closePopup = () => {
    console.log('Closing language popup');
    showPopup.value = false;
    emit('close');
  };
  </script>