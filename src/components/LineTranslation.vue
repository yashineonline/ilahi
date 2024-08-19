<template>
    <div class="mt-2">
      <p>{{ translation }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { translateText } from '../utils/translator';
  
  const props = defineProps<{ line: string }>();
  const translation = ref('');
  
  watch(() => props.line, async (newLine) => {
    translation.value = await translateText(newLine);
  }, { immediate: true });
  </script>
  