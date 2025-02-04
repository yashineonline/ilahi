<template>
  <footer class="mt-4 text-center">
    <p class="text-sm text-gray-600">Version: {{ version }}</p>
    <p class="text-sm text-gray-600">Last updated on: {{ buildDate }}</p>
  </footer>
</template>

<script setup lang="ts">
import versionData from '../version.mts'; // Import version module

const { version, buildDate } = versionData;
</script>
