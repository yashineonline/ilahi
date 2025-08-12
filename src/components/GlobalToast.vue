<template>
  <transition name="slide-down">
    <div
        v-if="visible"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-base-100 text-base-content px-6 py-3 rounded-lg shadow-lg cursor-pointer z-50 max-w-md w-full"
        @click="handleClick"
           role="alert"
      aria-live="assertive"
      >
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const visible = ref(false);
  const message = ref('');
  let onClickHandler = null;
  
  function show(msg, onClick) {
    message.value = msg;
    onClickHandler = onClick;
    visible.value = true;
  }
  
  function hide() {
    visible.value = false;
    onClickHandler = null;
  }
  
  function handleClick() {
    if (onClickHandler) onClickHandler();
    hide();
  }
  
  // Expose globally so SW code can trigger it
  window.showGlobalToast = show;
  </script>
  
  <style>
.slide-down-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
  </style>
  