<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-6 text-center text-green-800">{{ EXPLANATION_TEXT.title }}</h1>
    <div v-for="(section, index) in EXPLANATION_TEXT.sections" :key="index" class="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4">{{ section.title }}</h2>
      <template v-for="(content, contentIndex) in section.content" :key="contentIndex">
        <p v-if="content.type === 'paragraph'" class="mb-4" v-html="content.text"></p>
        <blockquote v-else-if="content.type === 'quote'" class="italic text-gray-700 border-l-4 border-green-500 pl-4 my-4">
          <p v-html="content.text"></p>
        </blockquote>
      </template>
      <p v-if="section.author" class="mt-2 text-right">- {{ section.author }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EXPLANATION_TEXT } from '../utils/contentConfig';
</script>