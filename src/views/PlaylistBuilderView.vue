<template>
    <div class="w-full max-w-4xl mx-auto p-6 bg-base-100 text-base-content space-y-6">
      <h1 class="text-2xl font-bold text-center mb-2">ilahi Playlist</h1>
      <p class="text-center text-base-content/70">
        Choose ilahis to create your own playlist, or use all ilahis with YouTube links.
      </p>
      <p>Note: This is a new feature in testing phase. Contact admin for details of how to be able to connect from the ilahi app to your YouTube account.</p>
      <p>Contact email: ilahipractice@gmail.com</p>
  
      <!-- Controls -->
      <div class="flex flex-wrap justify-center gap-3">
        <button
          class="btn btn-primary btn-sm"
          @click="showSongSelector = !showSongSelector"
        >
          {{ showSongSelector ? 'Hide ilahi list' : 'Select ilahis' }}
        </button>
  
        <button
          class="btn btn-secondary btn-sm"
          @click="selectAllWithYoutube"
          :disabled="isLoading || songsWithYoutube.length === 0"
        >
          Use all ilahis with YouTube
        </button>
  
        <button
          class="btn btn-accent btn-sm"
          @click="clearSelection"
          :disabled="selectedSongs.length === 0"
        >
          Clear selection
        </button>
      </div>
  
      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-4">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
  
      <!-- Song selection list -->
      <div v-if="showSongSelector && !isLoading" class="space-y-2">
        <p class="font-semibold">Tap ilahis to add/remove from the playlist:</p>
        <div class="space-y-2 max-h-[50vh] overflow-y-auto">
          <button
            v-for="song in songsWithYoutube"
            :key="song.slug"
            @click="toggleSong(song)"
            class="w-full text-left px-4 py-2 rounded border transition-colors"
            :class="selectedSongsMap[song.slug]
              ? 'bg-purple-600 text-green-300 border-purple-600'
              : 'bg-base-100 text-purple-700 border-purple-700'
            "
          >
          <span>{{ song.title }}</span>
  <span v-if="selectedSongs.includes(song)" class="badge badge-accent ml-2">
    {{ selectedSongs.indexOf(song) + 1 }}
  </span>
          </button>
        </div>
  
        <!-- Order manager -->
        <div v-if="selectedSongs.length > 0" class="mt-4">
          <SelectedSongsManager
            :selectedSongs="selectedSongs"
            @update:selectedSongs="selectedSongs = $event"
          />
        </div>
      </div>
  
      <!-- Summary + Save -->
    <div class="text-center">
      <p v-if="playlistVideoUrls.length > 0" class="text-sm text-base-content/70">
        Playlist has {{ playlistVideoUrls.length }} YouTube link<span v-if="playlistVideoUrls.length > 1">s</span>.
      </p>
      <p v-else-if="!isLoading" class="text-sm text-base-content/60">
        Select ilahis or use "Use all ilahis with YouTube" to create a playlist.
      </p>

      <!-- Playlist summary -->
      <!-- <div v-if="playlistVideoUrls.length > 0" class="mt-4 text-center"> -->
        <!-- <p class="text-sm text-base-content/70"> -->
          <!-- Playlist has {{ playlistVideoUrls.length }} YouTube link<span v-if="playlistVideoUrls.length > 1">s</span>. -->
        <!-- </p> -->
      <!-- </div> -->
      <!-- <div v-else-if="!isLoading" class="mt-4 text-center text-sm text-base-content/60"> -->
        <!-- Select ilahis or use "Use all ilahis with YouTube" to create  a playlist. -->
      <!-- </div> -->
  <!-- NEW: Save playlist (commit preview) -->
  <div class="mt-3 flex gap-2 justify-center">
        <button class="btn btn-success btn-sm"
                :disabled="playlistVideoUrls.length === 0"
                @click="savePlaylist">
          Save playlist (preview)
        </button>
        <button class="btn btn-outline btn-sm"
                :disabled="!isSaved || committedUrls.length === 0"
                @click="saveCurrentPlaylistToYouTube(committedUrls)">
          Save to my YouTube
        </button>
      </div>
    </div>
<!-- Player appears only after Save; shows first video but does NOT autoplay -->
<div v-if="isSaved && committedUrls.length" class="mt-6">
      <YouTubePlaylist :video-urls="committedUrls" :autoplay="false" />
    </div>
  </div>
      <!-- Actual player -->
      <!-- <div v-if="playlistVideoUrls.length > 0" class="mt-6"> -->
        <!-- <YouTubePlaylist :videoUrls="playlistVideoUrls" /> -->
      <!-- </div> -->
<!-- <div> -->
  <!-- <button class="btn btn-secondary btn-sm" @click="saveCurrentPlaylistToYouTube(playlistVideoUrls)"> -->
  <!-- Save to my YouTube -->
<!-- </button> -->
<!-- </div> -->
    <!-- </div> -->
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useSongStore } from '../stores/songStore';
  import SelectedSongsManager from '../components/SelectedSongsManager.vue';
  import YouTubePlaylist from '../components/YouTubePlaylist.vue';
  import type { SongData } from '../utils/types';
  import { getYoutubeLinks } from '../utils/audioUtils';
  import { parseYouTubeUrl } from '../utils/youtubeUtils';
  // import { savePlaylistToYouTube } from '@/utils/youtubeApi';
// import { getAccessToken } from '@/composables/useYouTubeAuth';
import { ensureToken } from '@/utils/googleAuth';
import { createPlaylist, addVideoToPlaylist } from '@/utils/youtubeApi';

  const songStore = useSongStore();
  
  const isLoading = ref(false);
  const showSongSelector = ref(false);
  const selectedSongs = ref<SongData[]>([]);
  
  // NEW: “Save” state
const isSaved = ref(false);
const committedUrls = ref<string[]>([]);

  // Fast lookup to highlight selected songs
  const selectedSongsMap = computed(() => {
    const map: Record<string, boolean> = {};
    selectedSongs.value.forEach(song => { map[song.slug] = true; });
    return map;
  });
  
  // All songs that actually have at least one YouTube link
  const songsWithYoutube = computed(() =>
    songStore.songs.filter(song => getYoutubeLinks(song).length > 0)
  );
   
const playlistVideoUrls = computed(() =>
  selectedSongs.value
    .flatMap(s => getYoutubeLinks(s))
    .filter(u => !!parseYouTubeUrl(u).videoId)   // keep only valid
);

// NEW: Save (commit) playlist to preview (no autoplay)
function savePlaylist() {
  committedUrls.value = [...playlistVideoUrls.value];
  isSaved.value = committedUrls.value.length > 0;
}

async function saveCurrentPlaylistToYouTube(videoUrls: string[]) {
  console.log('[PBV] save -> urls=', videoUrls.length, videoUrls.slice(0,3));
  const name = (window.prompt('Name your YouTube playlist:', 'AQRT ilahi Playlist') || '').trim();
  if (!name) return; // user cancelled or empty

  // Ask for token (popup) – user will consent once
  await ensureToken('consent');
  const p = await createPlaylist(name, 'Created from ilahi app');
  console.log('[PBV] created playlist id=', p.id);
  // const p = await createPlaylist('AQRT ilahi Playlist', 'Created from ilahi app');
  for (const u of videoUrls) {
    const id = parseYouTubeUrl(u).videoId;
    console.log('[PBV] add video id=', id);
    await addVideoToPlaylist(p.id, u);
  }
  console.log('[PBV] done adding videos');

// nudge reactivity so YouTubePlaylist re-computes links (if needed)
selectedSongs.value = [...selectedSongs.value];

  }
  // toast: done


watch(playlistVideoUrls, (v) => {
  const first = v[0] || '';
  const id = first ? parseYouTubeUrl(first).videoId : '';
  console.log('[PBV] playlistVideoUrls len=', v.length, 'first=', first, 'id=', id);
});
  // Ensure songs are loaded
  onMounted(async () => {
    if (songStore.songs.length === 0) {
      isLoading.value = true;
      try {
        await songStore.fetchSongs();
      } finally {
        isLoading.value = false;
      }
    }
  });
  
  // Toggle selection
  function toggleSong(song: SongData) {
    const idx = selectedSongs.value.findIndex(s => s.slug === song.slug);
    if (idx === -1) {
      selectedSongs.value = [...selectedSongs.value, song];
    } else {
      selectedSongs.value = selectedSongs.value.filter(s => s.slug !== song.slug);
    }
  }
  
  // Use all songs that have at least one YouTube link
  function selectAllWithYoutube() {
    selectedSongs.value = [...songsWithYoutube.value];
    showSongSelector.value = true;
  }
  
  // Clear
  function clearSelection() {
    selectedSongs.value = [];
    isSaved.value = false;
  committedUrls.value = [];
  }


// async function onSaveToYouTube() {
//   const videoIds = playlistVideoUrls.value
//     .map(u => parseYouTubeUrl(u).videoId)
//     .filter(Boolean) as string[];
//   if (!videoIds.length) return;
//   const playlistId = await savePlaylistToYouTube(videoIds, 'My ilahi playlist', () => getAccessToken('consent'));
//   // optional: notify user or open the playlist URL
//   // window.open(`https://www.youtube.com/playlist?list=${playlistId}`, '_blank');
// }

  </script>
  