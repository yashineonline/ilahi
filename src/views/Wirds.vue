<template>
    <div class="wirds-container">
      <h1 class="text-3xl font-bold mb-4" v-if="!showQadiriWird && !showRifaiWird">Wirds</h1>
      <div class="flex flex-col gap-4" v-if="!showQadiriWird && !showRifaiWird">
        <button @click="toggleRifaiWird" class="btn btn-primary text-xl">
          Show Rifai Wird
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
      <Suspense v-if="showRifaiWird">
        <template #default>
          <RifaiWird @go-back="toggleRifaiWird" />
        </template>
        <template #fallback>
          <div>Loading Rifai Wird...</div>
        </template>
      </Suspense>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineAsyncComponent, watch } from 'vue';
  import { useNavigationStore } from '../stores/navigationStore';

  const QadiriWird = defineAsyncComponent(() => import('@/components/QadiriWird.vue'));
  const RifaiWird = defineAsyncComponent(() => import('@/components/RifaiWird.vue'));

  const showQadiriWird = ref(false);
  const showRifaiWird = ref(false);
  const navigationStore = useNavigationStore();

  const toggleQadiriWird = () => {
    showQadiriWird.value = !showQadiriWird.value;
    showRifaiWird.value = false;
    navigationStore.setNavigationVisibility(!showQadiriWird.value);
  };

  const toggleRifaiWird = () => {
    showRifaiWird.value = !showRifaiWird.value;
    showQadiriWird.value = false;
    navigationStore.setNavigationVisibility(!showRifaiWird.value);
  };


  // Ensure navigation is visible when Qadiri Wird is not shown
  watch([showQadiriWird, showRifaiWird], ([newQadiriValue, newRifaiValue]) => {
    if (!newQadiriValue && !newRifaiValue) {
      navigationStore.setNavigationVisibility(true);
    }
  });
  </script>