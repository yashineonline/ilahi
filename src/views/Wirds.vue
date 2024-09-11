<template>
    <div class="wirds-container">
      <h1 class="text-3xl font-bold mb-4">Wirds</h1>
      <button @click="toggleQadiriWird" class="btn btn-primary text-xl mb-4">
        {{ showQadiriWird ? 'Hide' : 'Show' }} Qadiri Wird
      </button>
      <Suspense>
        <template #default>
          <QadiriWird v-if="showQadiriWird" />
        </template>
        <template #fallback>
          <div>Loading Qadiri Wird...</div>
        </template>
      </Suspense>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineAsyncComponent } from 'vue';
  import { useNavigationStore } from '../stores/navigationStore'; // Add this import

  const QadiriWird = defineAsyncComponent(() => import('@/components/QadiriWird.vue'));

  const showQadiriWird = ref(true);
  const navigationStore = useNavigationStore(); // Add this line

  const toggleQadiriWird = () => {
    showQadiriWird.value = !showQadiriWird.value;
    navigationStore.setNavigationVisibility(!showQadiriWird.value);
  };
  </script>