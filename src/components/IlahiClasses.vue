<template>
    <!-- <div v-if="$route.path === '/'" class="ilahiClasses"> -->
      <!-- <button @click="handleClick" class="btn btn-primary rounded-full shadow-lg">
        Join ilahi classes
      </button> -->
      
      <!-- Popup -->
      <div v-if="showPopup" class="modal modal-open fixed inset-0 flex items-center justify-center z-50" @click="closePopup">
        <div class="modal-overlay absolute inset-0 opacity-50"></div>
        <div class="modal-box relative" p-6 rounded-lg shadow-xl max-w-md mx-auto z-50 @click.stop>
          <button @click="closePopup" class="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
          <h2 class="text-2xl font-bold mb-4">Join the ilahi Community</h2>
          <p class="mb-4">Connect with us via WhatsApp to join ilahi classes on Zoom 
            and to hear first hand about the updates in the app. 
            Practice singing within a community 
          and get feedback on your singing regularly!</p>
          <button @click="openWhatsApp" class="btn btn-primary btn-block">
            Open WhatsApp
          </button>
        </div>
      </div>
    <!-- </div> -->
  </template>

  

  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const showPopup = ref(false)
  
  // const handleClick = () => {
  //   showPopup.value = true
  // }

  const openPopup = () => {
    console.log('Opening popup') // Debug log
  showPopup.value = true
}
  
  const closePopup = () => {
    showPopup.value = false
  }
  
  const openWhatsApp = () => {
    window.open('https://chat.whatsapp.com/F7vWb3S3qIG2sht3hTPsjp', '_blank')
    closePopup()
  }

  // Expose the openPopup method
defineExpose({ openPopup })
  </script>
  
  <style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 32rem;
  width: 90%;
  position: relative;
  z-index: 60;
}

.btn-circle {
  border-radius: 9999px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}  </style>