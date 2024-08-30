<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Song List</h2>
    
    <!-- A-Z filter -->
    <div class="flex flex-wrap justify-center my-4">
      <button
        v-for="letter in 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'"
        :key="letter"
        @click="filterByLetter(letter)"
        :class="['btn btn-sm m-1', { 'btn-primary': currentLetter === letter }]"
      >
        {{ letter }}
      </button>
    </div>

    <!-- Category filter -->
    <div class="flex justify-center my-4">
      <div class="flex flex-col items-center">
        <label class="mb-2 font-bold text-lg">Categories</label>
        <div class="flex items-center mb-2">
          <input
            type="checkbox"
            id="basicCategory"
            v-model="selectedCategories"
            value="Basic"
            class="checkbox checkbox-primary mr-2"
          />
          <label for="basicCategory" class="text-lg font-semibold text-primary">Basic</label>
        </div>
        <div class="dropdown">
          <label tabindex="0" class="btn m-1" @click="isDropdownOpen = !isDropdownOpen">More Categories</label>
          <ul v-if="isDropdownOpen" tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto">
            <li v-for="category in mainCategories" :key="category" class="text-left">
              <template v-if="Object.keys(subcategories).includes(category)">
                <details class="dropdown">
                  <summary>{{ category }}</summary>
                  <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                    <li v-for="subCategory in sortedSubcategories[category]" :key="subCategory" class="text-left">
                      <label>
                        <input
                          type="checkbox"
                          :value="subCategory.split(',')[0].trim()"
                          v-model="selectedCategories"
                          class="checkbox"
                        />
                        {{ subCategory }}
                      </label>
                    </li>
                  </ul>
                </details>
              </template>
              <label v-else-if="category !== 'Basic' && category !== 'All'">
                <input
                  type="checkbox"
                  :value="category"
                  v-model="selectedCategories"
                  class="checkbox"
                />
                {{ category }}
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex justify-center my-4">
      <button @click="resetSearch" class="btn btn-secondary">Reset Search</button>
    </div>

    <div
      v-if="paginatedSongs.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="(song, index) in paginatedSongs"
        :key="`${song.title}-${index}`"
        class="bg-white shadow-md rounded-lg p-4"
      >
        <h3 class="text-xl font-semibold mb-2">
          <router-link
            v-if="song.title"
            :to="{
              name: 'SongDisplay',
              params: { title: encodeURIComponent(song.title) },
            }"
            class="text-blue-600 hover:text-blue-800"
          >
            {{ song.title }}
          </router-link>
          <span v-else class="text-gray-500">All</span>
        </h3>
        <div class="text-sm text-gray-600">
          <!-- {{ song.categories.join(', ') }} -->
        </div>
      </div>
    </div>
    <div v-else class="text-center text-xl text-gray-600">No songs found</div>

    <div class="mt-6 flex justify-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="btn btn-primary mr-2"
      >
        &lt; Previous
      </button>
      <span class="mx-2 self-center">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-primary ml-2"
      >
        Next &gt;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from "vue";
import { storeToRefs } from "pinia";
import { useSongStore } from "../stores/songStore";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SearchBar from "./SearchBar.vue";
import { getCurrentInstance } from "vue";

const route = useRoute();
const router = useRouter();
const songStore = useSongStore();
const { filteredSongs } = storeToRefs(songStore);

const currentPage = ref(1);
const itemsPerPage = 12;
const currentLetter = ref("");
const selectedCategories = ref<string[]>([]);

const resetGlobalSearch = inject("resetGlobalSearch") as () => void;

const turkishToEnglish = (str: string) => {
  const map: { [key: string]: string } = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "C",
    Ğ: "G",
    İ: "I",
    Ö: "O",
    Ş: "S",
    Ü: "U",
  };
  return str.replace(/[çğıöşüÇĞİÖŞÜ]/g, (letter) => map[letter] || letter);
};

const subcategories = {
  "Pen Name": ["Aşık Yunus", "Yunus Emre", "Niyaz", "Fakirullah", "Nesimi", "Üftade", "Şemseddin Sivası", "Ruhi", "Muhyi", "Hatayi", "Hudayi", "Aşık Hüdai", "Kul Yusuf"],
  // "Sung By": ["Shaykh Taner", "Shaykh Muhyiddin"],
  "Pirs": ["Geylani", "Rifai", "Ansari", "Ensari", "Hashimi", "Muhammed", "Muhyiddin"],
  "Awliya": ["Mevlana", "Haci Bektas", "Evliya", "Awliya"],
  "Sahaba": ["Abu Bakr", "Umar", "Usman", "Ali", "Sahaba"],
  "Anbiya": ["Nuh", "Hud", "Salih", "Ibrahim", "Musa", "Isa", "Muhammad", "Anbiya", "Enbiya", "Prophets"],
  "Dervish Orders": ["Rifai", "Ansari", "Qadiri", "Bektashi", "Nakshbandi", "Mevlevi"],
};

const categoryShortcuts = {
  "sbt": ["Sung By", "Shaykh Taner"],
  "sbm": ["Sung By", "Shaykh Muhyiddin"],
  // Add more shortcuts as needed
};

const sortedSubcategories = computed(() => {
  const sorted = {};
  for (const [key, value] of Object.entries(subcategories)) {
    sorted[key] = value.sort((a, b) => turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase())));
  }
  return sorted;
});

const processShortcuts = () => {
  const processedCategories = { ...subcategories };
  const processedShortcuts = {};

  Object.entries(categoryShortcuts).forEach(([shortcut, [mainCategory, subCategory]]) => {
    if (!processedCategories[mainCategory]) {
      processedCategories[mainCategory] = [];
    }
    if (!processedCategories[mainCategory].includes(subCategory)) {
      processedCategories[mainCategory].push(subCategory);
    }
    processedShortcuts[shortcut] = subCategory;
  });

  return { processedCategories, processedShortcuts };
};

const allCategories = computed(() => {
  const { processedCategories, processedShortcuts } = processShortcuts();
  const categories = new Set<string>(["Basic"]);
  filteredSongs.value.forEach((song) => {
    song.categories.forEach((category) => {
      const normalizedCategory = category.trim().toLowerCase();
      const matchedMainCategory = Object.keys(processedCategories).find((key) => 
        key.toLowerCase() === normalizedCategory || 
        processedCategories[key].some((sub) => sub.toLowerCase().startsWith(normalizedCategory))
      );
      if (matchedMainCategory) {
        categories.add(matchedMainCategory);
      } else if (category.trim() !== '' && !processedShortcuts[normalizedCategory]) {
        categories.add(category.trim());
      }
    });
  });
  return Array.from(categories);
});

const mainCategories = computed(() => {
  const orderedCategories = ['All', 'Basic', 'Sung By', 'Pirs', 'Pen Name'].map(cat => cat.toLowerCase() === 'basic' ? 'basic' : cat);
  const otherMainCategories = Object.keys(subcategories).filter(cat => !orderedCategories.includes(cat));
  const standaloneCategories = allCategories.value.filter(cat => 
    !orderedCategories.includes(cat) && 
    !otherMainCategories.includes(cat) &&
    cat !== 'Basic' // Exclude 'Basic' from standalone categories
  );
  
  return [
    ...orderedCategories,
    ...otherMainCategories.sort((a, b) => turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase()))),
    ...standaloneCategories.sort((a, b) => turkishToEnglish(a.toLowerCase()).localeCompare(turkishToEnglish(b.toLowerCase())))
  ];
});

const sortedFilteredSongs = computed(() => {
  const { processedCategories, processedShortcuts } = processShortcuts();
  let songsToDisplay = filteredSongs.value;

  if (selectedCategories.value.length > 0 && !selectedCategories.value.includes('All')) {
    songsToDisplay = songsToDisplay.filter((song) => 
      selectedCategories.value.some((category) => {
        const normalizedCategory = category.toLowerCase();
        if (Object.keys(processedCategories).includes(category)) {
          return processedCategories[category].some((subCategory) => 
            song.categories.some((songCategory) => 
              turkishToEnglish(songCategory.toLowerCase()) === turkishToEnglish(subCategory.toLowerCase())
            )
          );
        }
        return song.categories.some((songCategory) => 
          turkishToEnglish(songCategory.trim().toLowerCase()) === turkishToEnglish(normalizedCategory) ||
          (processedShortcuts[normalizedCategory] && 
           turkishToEnglish(songCategory.trim().toLowerCase()) === turkishToEnglish(processedShortcuts[normalizedCategory].toLowerCase()))
        );
      })
    );
  }

  if (currentLetter.value && selectedCategories.value.length === 0) {
    songsToDisplay = songsToDisplay.filter(
      (song) =>
        turkishToEnglish(song.title[0].toUpperCase()) ===
        turkishToEnglish(currentLetter.value)
    );
  }

  return songsToDisplay.sort((a, b) => a.title.localeCompare(b.title));
});

const totalPages = computed(() =>
  Math.ceil(sortedFilteredSongs.value.length / itemsPerPage)
);

const paginatedSongs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedFilteredSongs.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const filterByLetter = (letter: string) => {
  currentLetter.value = currentLetter.value === letter ? "" : letter;
  currentPage.value = 1;
  updateQueryParams();
};

const updateQueryParams = () => {
  const query: Record<string, string | string[]> = {};
  if (currentLetter.value) query.letter = currentLetter.value;
  if (selectedCategories.value.length > 0) query.categories = selectedCategories.value;
  router.push({ query });
};

watch([filteredSongs, currentLetter, selectedCategories], () => {
  currentPage.value = 1;
  updateQueryParams();
});

watch(
  () => route.query.search,
  (newSearch) => {
    if (newSearch) {
      songStore.setSearchQuery(newSearch as string);
      currentPage.value = 1;
      currentLetter.value = "";
      selectedCategories.value = [];
    }
  }
);

onMounted(async () => {
  await songStore.fetchSongs();
  if (route.query.search) {
    songStore.setSearchQuery(route.query.search as string);
  }
  if (route.query.categories) {
    selectedCategories.value = Array.isArray(route.query.categories)
      ? route.query.categories
      : [route.query.categories as string];
  }
});

const resetSearch = () => {
  songStore.setSearchQuery("");
  currentLetter.value = "";
  selectedCategories.value = [];
  router.push({ query: {} });
  resetGlobalSearch();
};

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.search) {
      songStore.setSearchQuery(newQuery.search as string);
      currentPage.value = 1;
      currentLetter.value = "";
      selectedCategories.value = [];
    } else if (newQuery.letter) {
      currentLetter.value = newQuery.letter as string;
      currentPage.value = 1;
      songStore.setSearchQuery("");
    } else if (newQuery.categories) {
      selectedCategories.value = Array.isArray(newQuery.categories)
        ? newQuery.categories
        : [newQuery.categories as string];
      currentPage.value = 1;
      songStore.setSearchQuery("");
    } else {
      songStore.setSearchQuery("");
      currentLetter.value = "";
      selectedCategories.value = [];
      currentPage.value = 1;
    }
  },
  { immediate: true }
);

const isDropdownOpen = ref(false);

const app = getCurrentInstance()?.appContext.app;
</script>

<style>
.select option:checked {
  background-color: theme("colors.white");
  /* color: white; */
}

.select option {
  background-color: white;
  color: black;
}
</style>
