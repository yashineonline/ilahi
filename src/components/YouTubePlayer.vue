<template>
  <div class="w-full max-w-4xl mx-auto px-2 sm:px-4">
    <h1 class="text-3xl font-bold mb-4">AQRT Ilahi Playlist</h1>
    <div>
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

