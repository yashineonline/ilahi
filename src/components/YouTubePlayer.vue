<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">AQRT Ilahi Playlist</h1>
      <div class="aspect-w-16 aspect-h-9">
        <YouTube
          :src="playlistUrl"
          @ready="onPlayerReady"
          @error="onPlayerError"
        />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import YouTube from 'vue3-youtube';

const playlistId = 'PLGbOdksmscwmkifuD5H2aqXRivVN-3gvO';

const playlistUrl = `https://www.youtube.com/watch?v=YkREmirC8C4&list=${playlistId}`;

const onPlayerReady = (event: any) => {
  console.log('YouTube player is ready', event);
};

const onPlayerError = (error: any) => {
  console.error('YouTube player error:', error);
};
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-w-16 :deep(iframe) {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>