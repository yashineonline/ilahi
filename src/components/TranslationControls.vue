<template>
    <div class="flex flex-wrap gap-2">
      <button 
        v-if="hasTranslation"
        class="btn btn-primary btn-sm gap-2"
        data-no-float-nav
        @click.stop="$emit('toggle-translation')"
        :aria-pressed="showTranslation"
      >
        <font-awesome-icon :icon="['fas', 'language']" />
        {{ showTranslation ? 'Hide' : 'Show' }} Translation
      </button>
      
      <button 
        v-if="hasTranslation && showTranslation"
        class="btn btn-outline btn-sm gap-2"
        @click="$emit('toggle-layout')"
      >
        <font-awesome-icon :icon="['fas', layout === 'below' ? 'columns' : 'bars']" />
        {{ layout === 'below' ? 'Side-by-side' : 'Below lyrics' }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    hasTranslation: boolean
    showTranslation: boolean
    layout: 'below' | 'side'
  }>()
  
  defineEmits<{
    'toggle-translation': []
    'toggle-layout': []
  }>()
  </script>