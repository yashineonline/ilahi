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
        v-show="!!currentVideoUrl"
  :key="'yt-player'"                  
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
import { ref, computed, onMounted, watch, nextTick } from "vue";
import YouTube from "vue3-youtube";
import { useSongStore } from '../stores/songStore';
import { parseYouTubeUrl } from '@/utils/youtubeUtils';

const props = defineProps<{
  videoUrls?: string[];
  autoplay?: boolean; // default false
}>();

const autoplay = computed(() => props.autoplay ?? false);

const songStore = useSongStore();

const youtubePlayer = ref<InstanceType<typeof YouTube> | null>(null);
const isPlaying = ref(false);
const isShuffled = ref(false);
const currentIndex = ref(0);
const shuffledIndices = ref<number[]>([]);
const playbackRate = ref(1);

const youtubeLinks = computed(() => {
  const src = (props.videoUrls?.length ? props.videoUrls : songStore.youtubeLinks) || [];
  // keep only entries that yield a valid videoId
  return src.filter(u => !!parseYouTubeUrl(u).videoId);
});

const currentVideoUrl = computed(() => {
  const idx = isShuffled.value ? shuffledIndices.value[currentIndex.value] : currentIndex.value;
  return youtubeLinks.value[idx] || '';
});

const currentVideoId = computed(() => parseYouTubeUrl(currentVideoUrl.value).videoId || '');

// add this helper
function cueCurrent() {
  const id = parseYouTubeUrl(currentVideoUrl.value).videoId;
  const p: any = youtubePlayer.value;
  console.log('[YT] cueCurrent id=', id, 'player?', !!p);
  if (!p || !id) return;
  if (p.cueVideoById) p.cueVideoById({ videoId: id });
  else { p.loadVideoById({ videoId: id }); p.pauseVideo(); }
}

watch(youtubeLinks, async () => {
  currentIndex.value = 0;
  initializeShuffleIndices();
  await nextTick();
  cueOrLoad();  // prepare the first video without autoplay (if autoplay=false)

  // loadCurrentVideo();                         // ← important
});

watch(currentVideoId, () => cueOrLoad());



watch(currentVideoUrl, (u) => {
  if (!u || !youtubePlayer.value) return;
  const { videoId } = parseYouTubeUrl(u);
  if (!videoId) return;
  const p:any = youtubePlayer.value;
  if (p.cueVideoById) p.cueVideoById({ videoId });
  else { p.loadVideoById({ videoId }); p.pauseVideo(); } // fallback
  console.log('URL ->', u, parseYouTubeUrl(u));
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
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

function cueOrLoad() {
  const p = getPlayer();
  const id = currentVideoId.value;
  if (!p || !id) return;
  if (!autoplay.value && p.cueVideoById) {
    p.cueVideoById({ videoId: id });   // shows first frame, no play
  } else if (p.loadVideoById) {
    p.loadVideoById({ videoId: id });  // may autoplay if policies allow
    if (!autoplay.value && p.pauseVideo) p.pauseVideo(); // enforce no autoplay
  }
}

function toggleShuffle() {
  isShuffled.value = !isShuffled.value;
  initializeShuffleIndices();
  // Reset to first video when toggling shuffle mode
  currentIndex.value = 0;
  cueOrLoad();
  // loadCurrentVideo();
};

function getPlayer() {
  return youtubePlayer.value?.player || null; // vue3-youtube exposes .player
}

// === use component instance methods directly (like your old code) ===
const togglePlay = () => {
  const p = getPlayer();
  if (!p) return;
  isPlaying.value ? p.pauseVideo() : p.playVideo();
  // if (!youtubePlayer.value) return;
  // isPlaying.value ? youtubePlayer.value.pauseVideo() : youtubePlayer.value.playVideo();
  isPlaying.value = !isPlaying.value;
};

function playNext(){
  currentIndex.value = (currentIndex.value + 1) % Math.max(1, youtubeLinks.value.length);
  cueOrLoad();
  // loadCurrentVideo();
}

function loadCurrentVideo(){
  if (!youtubePlayer.value) return;
  const { videoId } = parseYouTubeUrl(currentVideoUrl.value);
  if (!videoId) { playNext(); return; }
  youtubePlayer.value.loadVideoById({ videoId });
}

function onPlayerReady(e:any){
  // const { videoId } = parseYouTubeUrl(currentVideoUrl.value);
  // if (!videoId) return;
  const player = e.target;
  player.addEventListener('onStateChange', (evt:any)=>{
    isPlaying.value = evt.data === 1;   // playing
    if (evt.data === 0) playNext();     // ended
  });
  cueOrLoad(); // prepare first video on ready
  console.log('[YT] onPlayerReady');
  cueCurrent();            // ensure first render shows a thumbnail


  // if (player.cueVideoById) player.cueVideoById({ videoId });
  // else { player.loadVideoById({ videoId }); player.pauseVideo(); }
  // loadCurrentVideo();
  // player.playVideo();                    // kick autoplay if user interacted
}

watch(currentVideoUrl, (u) => {
  console.log('[YT] currentVideoUrl ->', u);
  cueCurrent();
});

const onStateChange = (e: any) => {
  // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused
  isPlaying.value = e.data === 1;
  if (e.data === 0) playNext();
};

watch(youtubeLinks, (L) => console.log('[YT] youtubeLinks len=', L.length));
watch(currentVideoUrl, (u) => console.log('[YT] currentVideoUrl=', u, 'id=', parseYouTubeUrl(u).videoId));

function onPlayerError(err:any){
  console.error('YT error', err);
  playNext();
}



function seekBackward(){ if (youtubePlayer.value){ const t=youtubePlayer.value.getCurrentTime(); youtubePlayer.value.seekTo(t-5,true);} }
function seekForward(){  if (youtubePlayer.value){ const t=youtubePlayer.value.getCurrentTime(); youtubePlayer.value.seekTo(t+5,true);} }
function setPlaybackRate(){ if (youtubePlayer.value){ youtubePlayer.value.setPlaybackRate(playbackRate.value);} }
function decreaseSpeed(){ playbackRate.value = Math.max(0.25, playbackRate.value-0.25); setPlaybackRate(); }
function increaseSpeed(){ playbackRate.value = Math.min(2, playbackRate.value+0.25); setPlaybackRate(); }

onMounted(()=>{ 
  initializeShuffleIndices();
  if (youtubeLinks.value.length) cueCurrent();
 });

// // Announce to screen readers that the player is ready
//   const announcement = document.createElement('div');
//   announcement.setAttribute('role', 'status');
//   announcement.setAttribute('aria-live', 'polite');
//   announcement.textContent = 'YouTube playlist player is ready';
//   document.body.appendChild(announcement);
//   setTimeout(() => announcement.remove(), 1000);
// });

</script>

<style scoped lang="css">
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
  aspect-ratio: 16 / 9;
  min-height: 600px;   
  margin: 0 auto;
  border-radius: 12px;
  /* padding-bottom: 56.25%; */
  overflow: hidden;
  /* min-height: 280px;            ensures a visible “box” on first paint */
}

.youtube-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Fallback for very old browsers */
@supports not (aspect-ratio: 1){
  .youtube-player-container{ height:0; padding-bottom:56.25%; }
  .youtube-player{ position:absolute; top:0; left:0; width:100%; height:100%; }
}

/* Larger on desktop */
@media (min-width: 1024px) {
  .youtube-player-container {
    min-height: 600px;
    /* padding-bottom: 0; */
    /* height: 600px; Fixed height for desktop */
  }

.youtube-player{ 
  position:relative; 
  height:100%; }
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



