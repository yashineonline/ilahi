<template>
    <div>
      <div v-if="notificationStore.updateAvailable" 
           role="alert" 
           aria-live="assertive" 
           class="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded shadow-lg transition-opacity duration-300"
           :class="{ 'opacity-100': showNotification, 'opacity-0': !showNotification }">
        Your app has been updated! 
      </div>
      <footer class="mt-4 text-center">
        <p class="text-sm text-gray-600">Version: {{ version }}</p>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useNotificationStore } from '../stores/notificationStore'; // Import the notification store
  import version from '../version.js'; // Import the version from the version module

  const notificationStore = useNotificationStore(); 
const showNotification = ref(true);

// Watch for updates in the notification store
watch(() => notificationStore.updateAvailable, 
(newValue) => {
  if (newValue) {
    setTimeout(() => {
      showNotification.value = false; // Hide notification after 10 seconds
      notificationStore.resetUpdateAvailable(); // Reset the update flag
    }, 10000); // Adjust duration as needed
  }
});
  </script>
  
  <style scoped>
  /* Optional: Add any additional styles here */
  </style>