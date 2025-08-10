<template>
    <div class="flex flex-wrap gap-2">
      <button class="btn btn-ghost btn-sm gap-2" @click="shareSong">
        <font-awesome-icon :icon="['fas', 'share-alt']" />
        Share
      </button>
      <button class="btn btn-ghost btn-sm gap-2" @click="copyLink">
        <font-awesome-icon :icon="['fas', 'copy']" />
        Copy Link
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { buildSongUrl } from '@/utils/linkUtils'
  
  const props = defineProps<{
    songSlug: string
    songTitle: string
  }>()
  
  async function shareSong() {
    const url = buildSongUrl(props.songSlug)
    try {
      if (navigator.share) {
        await navigator.share({ title: props.songTitle, url })
      } else {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard')
      }
    } catch {}
  }
  
  async function copyLink() {
    const url = buildSongUrl(props.songSlug)
    await navigator.clipboard.writeText(url)
    alert('Link copied to clipboard')
  }
  </script>