<template>
  <div class="card shadow-lg w-full max-w-4xl mx-auto">
    <div class="card-body">

        <h1 class="text-3xl font-bold mb-4">AQRT ilahi Playlist</h1>
        <div class="youtube-player-container w-full">
          <YouTube
            :src="playlistUrl"
            @ready="onPlayerReady"
            @error="onPlayerError"
            width="100%"
            height="100%"
            class="youtube-player"
          />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import YouTube from "vue3-youtube";

const playlistId = "PLGbOdksmscwmkifuD5H2aqXRivVN-3gvO";

const playlistUrl = `https://www.youtube.com/watch?v=YkREmirC8C4&list=${playlistId}`;

const onPlayerReady = (event: any) => {
  console.log("YouTube player is ready", event);
};

const onPlayerError = (error: any) => {
  console.error("YouTube player error:", error);
};
</script>

<style scoped>
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.youtube-player-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
}

.youtube-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (min-width: 1024px) {
  .youtube-player-container {
    padding-bottom: 0;
    height: 600px; /* Fixed height for desktop */
  }

  .youtube-player {
    position: relative;
  }
}
</style>



