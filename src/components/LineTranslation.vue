<template>
  <div class="mt-2">
    <p>{{ translatedLine }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { translateText } from '../utils/translator';

const props = defineProps<{ line: string }>();
const translatedLine = ref('');

watchEffect(async () => {
  translatedLine.value = await translateText(props.line);
});
</script>