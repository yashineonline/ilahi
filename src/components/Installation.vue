<template>
  <div>
    
  
  <div v-if="!isAppInstalled" class="cursor-pointer" @click="showInstallInstructions">
    <font-awesome-icon :icon="['far', 'circle-down']" shake style="color: #B197FC;" class="mr-2" size="lg" />
    <!-- <span class="text-sm font-medium">Install App</span> -->
  </div>
  <div v-if="showInstructions" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeInstructions">
    <div class="p-6 rounded-lg shadow-xl max-w-sm w-full m-4 relative" @click.stop>
      <button @click="closeInstructions" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
      <h2 class="text-2xl font-bold mb-4">{{ getCurrentInstructions.title }}</h2>
      <div v-if="isIOS || isAndroid">
        <p class="mb-4">To install this app on your device:</p>
        <ol class="list-decimal list-inside mb-4">
          <li v-for="step in getCurrentInstructions.steps" :key="step">{{ step }}</li>
        </ol>
      </div>
      <div v-else>
        <p class="mb-4">{{ installInstructions.default.description }}</p>
        <button @click="promptInstall" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Install App
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const deferredPrompt = ref<any>(null);
const showInstructions = ref(false);
const isIOS = ref(false);
const isAndroid = ref(false);
const isAppInstalled = ref(false);

const installInstructions = {
  ios: {
    title: "Install on iOS",
    steps: [
      "Tap the Share button in Safari",
      "Scroll down and tap \"Add to Home Screen\"",
      "Tap \"Add\" in the top right corner"
    ]
  },
  android: {
    title: "Install on Android",
    steps: [
      "Open the link",
      "If using Google Chrome,",
      "Tap on the 3 dots at the top right corner",
      "Scroll down and tap on \"Add to Home screen\"",
      "Choose \"Install\"",
      " ",
      "If using Samsung Internet Browswer,",
      "Tap on More (horizontal 3-bar icon) for the menu.", 
      "Tap on + (Add page to)",
      "Choose Home screen",
    ]
  },
  default: {
    title: "Install App",
    description: "Relevant if you are on a phone or tablet. Ignore if you are on a computer."
  }
};

const promptInstall = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    deferredPrompt.value.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt.value = null;
    });
  }
};

const handleBeforeInstallPrompt = (e: Event) => {
  e.preventDefault();
  deferredPrompt.value = e;
};

const showInstallInstructions = () => {
  showInstructions.value = true;
};

const closeInstructions = () => {
  showInstructions.value = false;
};

const checkIfInstalled = () => {
  if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
    isAppInstalled.value = true;
  }
};

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  checkIfInstalled();
  window.addEventListener('appinstalled', () => {
    isAppInstalled.value = true;
  });
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  isAndroid.value = /Android/.test(navigator.userAgent);
});

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

const getCurrentInstructions = computed(() => {
  if (isIOS.value) return installInstructions.ios;
  if (isAndroid.value) return installInstructions.android;
  return { ...installInstructions.default, steps: [] };
});
</script>