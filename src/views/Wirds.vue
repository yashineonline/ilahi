<template>
    <div class="wirds-container">
      <h1 class="text-3xl font-bold mb-4" v-if="!showQadiriWird">Wirds</h1>
      <div class="flex flex-col gap-4" v-if="!showQadiriWird">
        <button class="btn btn-secondary text-xl" disabled>
          Rifai Wird (Coming Soon)
        </button>
        <button @click="toggleQadiriWird" class="btn btn-primary text-xl">
          Show Qadiri Wird
        </button>
      </div>
      <Suspense v-if="showQadiriWird">
        <template #default>
          <QadiriWird @go-back="toggleQadiriWird" />
        </template>
        <template #fallback>
          <div>Loading Qadiri Wird...</div>
        </template>
      </Suspense>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineAsyncComponent, watch } from 'vue';
  import { useNavigationStore } from '../stores/navigationStore';

  const QadiriWird = defineAsyncComponent(() => import('@/components/QadiriWird.vue'));

  const showQadiriWird = ref(false);
  const navigationStore = useNavigationStore();

  const toggleQadiriWird = () => {
    showQadiriWird.value = !showQadiriWird.value;
    navigationStore.setNavigationVisibility(!showQadiriWird.value);
  };

  // Ensure navigation is visible when Qadiri Wird is not shown
  watch(showQadiriWird, (newValue) => {
    if (!newValue) {
      navigationStore.setNavigationVisibility(true);
    }
  });
  </script>