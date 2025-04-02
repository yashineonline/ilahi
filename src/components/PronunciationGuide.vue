<template>
  <div v-if="hasPronunciation">
    <button 
    @click="handlePronunciationButtonClick" 
    class="btn btn-primary mb-4"
      :aria-expanded="showPronunciation"
      aria-controls="pronunciation-guide"
    >
      {{ showPronunciation ? 'Hide' : 'Show' }} Pronunciation Guide
    </button>

    <button 
        @click="openLanguagePopup" 
        class="btn btn-ghost"
        aria-label="Change language settings"
      >
        <font-awesome-icon :icon="['fas', 'language']" class="text-lg" />
      </button>

 <!-- Language Selection Popup -->
 <LanguageSelection v-if="showLanguagePopup" @close="closeLanguagePopup" />

    <div 
      v-if="showPronunciation && pronunciation" 
      class="pronunciation-container"
      id="pronunciation-guide"
      role="region"
      aria-label="Pronunciation guide"
    >


        <div class="feedback-line mb-4">
        <p class="text-sm italic">
          Second phase testing for pronunciation.
Now you have the turkish sounds replaced 
in the langauge that you can relate to:
English, French, German, Spanish.
Note that this is only for basic ilahis for now.
        </p>
      </div>

    <!-- Feedback Line for German or Spanish -->
    <div v-if="showFeedbackLine" class="feedback-line mb-4">
        <p class="text-sm italic">
          Please give feedback on how we can improve the pronunciation, especially if you speak {{ selectedLanguage }}. 
          Thank you!
        </p>
      </div>

    <div v-for="(stanza, index) in pronunciation" :key="index" class="stanza-guide">
        <div v-for="(line, lineIndex) in stanza" :key="lineIndex" class="line-guide">
          <p class="original">{{ line }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { getSelectedLanguage, applyPhoneticReplacements } from '../utils/pronunciationService';
import { useSongStore } from '../stores/songStore'
import LanguageSelection from './LanguageSelection.vue';
import { SongData } from '../utils/types.ts';


const props = defineProps<{
  songId: string
  // lyrics: string[][]
}>()

const songStore = useSongStore()
const showPronunciation = ref(false)
const pronunciation = ref<string[][]>([]) // Update type to string[][]
const hasPronunciation = ref(false)
const showLanguagePopup = ref(false);
// const selectedLanguage = ref(getSelectedLanguage());

const selectedLanguage = ref<string | undefined>(getSelectedLanguage() || undefined);


// Computed property to determine if the feedback line should be shown
const showFeedbackLine = computed(() => {
  return selectedLanguage.value === 'german' || selectedLanguage.value === 'spanish' || selectedLanguage.value === 'french' || selectedLanguage.value === 'english'
});

// Fetch and process pronunciation data
const processPronunciationData = () => {
  const song = songStore.songs.find((s: SongData) => s.slug === props.songId);
  if (song?.pronunciation && song.pronunciation.length > 0) {
    // console.log('Pronunciation data found for song:', song.title);
    hasPronunciation.value = true;

    // Log the raw pronunciation data
    // console.log('Raw pronunciation data:', song.pronunciation);

    // Apply phonetic replacements
    // console.log('Selected language for replacements:', selectedLanguage.value);
    pronunciation.value = song.pronunciation.map(stanza =>
      stanza.map(line => applyPhoneticReplacements(line, selectedLanguage.value))
    );

    // Log the processed pronunciation data
    // console.log('Processed pronunciation data:', pronunciation.value);
  } else {
    // console.log('No pronunciation data found for song:', song?.title);
  }
};

// Watch for changes in the selected language
watch(selectedLanguage, () => {
  // console.log('Language changed to:', selectedLanguage.value);
  processPronunciationData();
});

onMounted(() => {
  // console.log('PronunciationGuide mounted');
  processPronunciationData();
});

const handlePronunciationButtonClick = () => {
  // console.log('Pronunciation button clicked');
  if (!selectedLanguage.value) {
    // console.log('No language selected, showing popup');
    showLanguagePopup.value = true;
  } else {
    // console.log('Language already selected, toggling pronunciation guide');
    togglePronunciation();
  }
};


const openLanguagePopup = () => {
  // console.log('Opening language popup');
  showLanguagePopup.value = true;
};

const togglePronunciation = async () => {
  // console.log('Toggling pronunciation guide. Current state:', showPronunciation.value);
  showPronunciation.value = !showPronunciation.value;
  // console.log('New state:', showPronunciation.value);
};

const closeLanguagePopup = () => {
  // console.log('Closing language popup');
  showLanguagePopup.value = false;
  // After selecting a language, show the pronunciation guide
  selectedLanguage.value = getSelectedLanguage() || undefined; // Convert null to undefined
  togglePronunciation();
};
</script>

<style scoped lang="postcss">
.pronunciation-container {
  @apply mt-4 rounded-lg shadow-sm p-6;
}


.stanza-guide {
  @apply border-l-4 border-primary pl-4 py-2 mb-8;
}

.line-guide {
  @apply mb-2;
}

.original {
  @apply text-base font-medium;
}

.feedback-line {
  @apply bg-gray-100 p-3 rounded-lg text-gray-700;
}

</style>