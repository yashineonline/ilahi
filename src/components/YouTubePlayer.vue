<template>
  <div class="card shadow-lg w-full max-w-4xl mx-auto">
    <div class="card-body">
      <!-- <h1 class="text-3xl font-bold mb-4" id="playlist-title">AQRT ilahi Playlist</h1> -->
      <div class="controls mb-4 flex flex-wrap justify-center gap-2" role="toolbar" aria-label="Playlist controls">
        <button 
          @click="togglePlay" 
          class="btn btn-primary"
          aria-label="Toggle play"
          :aria-pressed="isPlaying"
        >
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <button 
          @click="toggleShuffle" 
          class="btn btn-primary"
          aria-label="Toggle shuffle mode"
          :aria-pressed="isShuffled"
        >
          {{ isShuffled ? 'Sequential' : 'Shuffle' }}
        </button>
        <button 
          @click="playNext" 
          class="btn btn-primary"
          aria-label="Play next video"
        >
          Next
        </button>
        <button 
          @click="seekBackward" 
          class="btn btn-primary"
          aria-label="Rewind 5 seconds"
        >
          -5s
        </button>
        <button 
          @click="seekForward" 
          class="btn btn-primary"
          aria-label="Forward 5 seconds"
        >
          +5s
        </button>
        <button 
          @click="decreaseSpeed" 
          class="btn btn-primary"
          aria-label="Decrease playback speed"
        >
          Slower
        </button>
        <button 
          @click="increaseSpeed" 
          class="btn btn-primary"
          aria-label="Increase playback speed"
        >
          Faster
        </button>
      </div>
      <div 
        class="youtube-player-container w-full"
        role="region" 
        aria-label="YouTube video player"
      >
        <YouTube
          :src="currentVideoUrl"
          @ready="onPlayerReady"
          @error="onPlayerError"
          ref="youtubePlayer"
          width="100%"
          height="100%"
          class="youtube-player"
          :title="`Playing video ${currentIndex + 1} of ${youtubeLinks.length}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import YouTube from "vue3-youtube";
import { useSongStore } from '../stores/songStore';

const songStore = useSongStore();
const youtubePlayer = ref<InstanceType<typeof YouTube> | null>(null);
const isPlaying = ref(false);
const isShuffled = ref(false);
const currentIndex = ref(0);
const shuffledIndices = ref<number[]>([]);
const playbackRate = ref(1);

// Get YouTube links from store
const youtubeLinks = computed(() => songStore.youtubeLinks);

// Compute current video URL based on playlist index
const currentVideoUrl = computed(() => {
  const index = isShuffled.value 
    ? shuffledIndices.value[currentIndex.value] 
    : currentIndex.value;
  return youtubeLinks.value[index] || '';
});

// Initialize shuffle indices
const initializeShuffleIndices = () => {
  shuffledIndices.value = Array.from(
    { length: youtubeLinks.value.length }, 
    (_, i) => i
  );
  if (isShuffled.value) {
    shuffleArray(shuffledIndices.value);
  }
};

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const toggleShuffle = () => {
  isShuffled.value = !isShuffled.value;
  initializeShuffleIndices();
  // Reset to first video when toggling shuffle mode
  currentIndex.value = 0;
  loadCurrentVideo();
};

const togglePlay = () => {
  if (youtubePlayer.value) {
    if (isPlaying.value) {
      youtubePlayer.value.pauseVideo();
    } else {
      youtubePlayer.value.playVideo();
    }
    isPlaying.value = !isPlaying.value;
  }
};

// const playlistId = "PLGbOdksmscwmkifuD5H2aqXRivVN-3gvO";
const playNext = () => {
  if (currentIndex.value < youtubeLinks.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0; // Loop back to start
  }
  loadCurrentVideo();
};

// const playlistUrl = `https://www.youtube.com/watch?v=YkREmirC8C4&list=${playlistId}`;
const loadCurrentVideo = () => {
  if (youtubePlayer.value) {
    const currentUrl = currentVideoUrl.value;
    // console.log('Current URL:', currentUrl); // Debug log
    
    const { videoId } = getYoutubeVideoId(currentUrl);
    // console.log('Extracted Video ID:', videoId); // Debug log
    
    if (!videoId) {
      console.error('Invalid video ID for URL:', currentUrl);
      playNext(); // Skip invalid videos
      return;
    }
    
    youtubePlayer.value.loadVideoById({ videoId });
  }
};

const getYoutubeVideoId = (url: string) => {
  if (!url) {
    console.error('Empty URL provided');
    return { videoId: '', startTime: 0, endTime: 0 };
  }

  // Updated regex to handle more YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube.com\/embed\/)([^&?/]+)/,
    /^([^&?/]+)$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        videoId: match[1],
        startTime: 0,
        endTime: 0
      };
    }
  }

  console.error('Could not extract video ID from URL:', url);
  return { videoId: '', startTime: 0, endTime: 0 };
};

const onPlayerReady = (event: any) => {
  // console.log("YouTube player is ready");
  const player = event.target;
  
  // Add event listener for video end
  player.addEventListener('onStateChange', (event: any) => {
    // Update isPlaying based on player state
    isPlaying.value = event.data === 1; // 1 = playing
    
    // When video ends (state = 0), play next video
    if (event.data === 0) {
      playNext();
    }
  });
};

const onPlayerError = (error: any) => {
  console.error("YouTube player error:", error);
  console.error("Error data:", error.data);
  console.error("Current video URL:", currentVideoUrl.value);
  
  // YouTube error codes
  const errorCodes = {
    2: "Invalid parameter",
    5: "HTML5 player error",
    100: "Video not found",
    101: "Embedding not allowed",
    150: "Embedding not allowed"
  };
  
  console.error("Error meaning:", errorCodes[error.data as keyof typeof errorCodes] || "Unknown error");
  
  // Skip to next video on error
  playNext();
};

// Playback control methods
const seekBackward = () => {
  if (youtubePlayer.value) {
    const currentTime = youtubePlayer.value.getCurrentTime();
    youtubePlayer.value.seekTo(currentTime - 5, true);
  }
};

const seekForward = () => {
  if (youtubePlayer.value) {
    const currentTime = youtubePlayer.value.getCurrentTime();
    youtubePlayer.value.seekTo(currentTime + 5, true);
  }
};

const decreaseSpeed = () => {
  playbackRate.value = Math.max(0.25, playbackRate.value - 0.25);
  setPlaybackRate();
};

const increaseSpeed = () => {
  playbackRate.value = Math.min(2, playbackRate.value + 0.25);
  setPlaybackRate();
};

const setPlaybackRate = () => {
  if (youtubePlayer.value) {
    youtubePlayer.value.setPlaybackRate(playbackRate.value);
  }
};

// Initialize when component mounts
onMounted(() => {
  initializeShuffleIndices();
  // Announce to screen readers that the player is ready
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = 'YouTube playlist player is ready';
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
});
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

/* Add focus styles for better accessibility */
button:focus {
  outline: 2px solid #4CAF50;
  outline-offset: 2px;
}

/* Make sure controls are visible on all backgrounds */
.controls button {
  margin: 0.25rem;
  min-width: 80px;
}

/* Ensure text contrast */
.btn-primary {
  color: white;
  background-color: #2563eb;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

/* Maintain aspect ratio on all screen sizes */
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
    height: 600px;
  }

  .youtube-player {
    position: relative;
  }
}

/* Add high contrast mode support */
@media (prefers-contrast: high) {
  .btn-primary {
    background-color: #000;
    border: 2px solid #fff;
  }
  
  .btn-primary:hover {
    background-color: #333;
  }
}
</style>



