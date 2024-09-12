<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold mb-6 text-center text-base-content">{{ EXPLANATION_TEXT.title }}</h1>
    <div v-for="(section, index) in EXPLANATION_TEXT.sections" :key="index" class="bg-base-100 shadow-lg rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-base-content">{{ section.title }}</h2>
      <template v-for="(content, contentIndex) in section.content" :key="contentIndex">
        <p v-if="content.type === 'paragraph'" class="mb-4 text-base-content" v-html="content.text"></p>
        <blockquote v-else-if="content.type === 'quote'" class="italic text-base-content border-l-4 border-primary pl-4 my-4">
          <p v-html="content.text"></p>
        </blockquote>
      </template>
      <p v-if="section.author" class="mt-2 text-right text-base-content">- {{ section.author }}</p>
    </div>
    <p class="text-center mt-8">
      <a href="https://aqrtsufi.org/ilahis/" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary-focus underline">
        Read more about Ilahis
      </a>
    </p>
    <router-link to="/poems" class="btn btn-link text-primary hover:text-primary-focus underline">
      Poems on Love by Shaykh Taner
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { EXPLANATION_TEXT } from '../utils/contentConfig';
</script>