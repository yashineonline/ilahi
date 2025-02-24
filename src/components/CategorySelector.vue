<template>
    <div class="w-full max-w-4xl mx-auto p-4">
        <div class="flex flex-col items-center">
        <!-- <div class="dropdown dropdown-hover">
        <label tabindex="0" class="btn btn-primary m-1">
          <font-awesome-icon :icon="['fas', 'filter']" class="mr-2" />
          Filter by Category
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64"> -->

                  <!-- Basic ilahis checkbox - prominently displayed -->
                  <div class="flex items-center mb-4 w-full justify-center">
                    <input
          type="checkbox"
          id="basicCategory"
          v-model="selectedCategories"
          :value="CATEGORIES.BASIC"
          class="checkbox checkbox-primary mr-2 custom-checkbox"
        />
        <label for="basicCategory" class="text-lg font-semibold text-primary">Basic ilahis For Zikr</label>
      </div>

 <!-- <li class="p-2">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="selectedCategories"
              value="Basic"
              class="checkbox checkbox-primary mr-2"
            />
            <span class="text-base">Basic ilahis For Zikr</span>
          </label>
        </li> -->

 <!-- Popular Categories -->
 <div class="flex items-center gap-4 mb-4">
        <button 
          v-for="shortcut in ['sbt', 'sbm']" 
          :key="shortcut"
          @click="toggleCategory(categoryShortcuts[shortcut][1])"
          class="btn btn-outline btn-sm"
          :class="{ 'btn-primary': selectedCategories.includes(categoryShortcuts[shortcut][1]) }"
        >
          {{ categoryShortcuts[shortcut].join(' ') }}
        </button>
      </div>

       <!-- Dropdown for other categories -->
       <div class="dropdown dropdown-hover">
        <label tabindex="0" class="btn m-1">
          <font-awesome-icon :icon="['fas', 'filter']" class="mr-2" />
          More Categories
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52 max-h-60 overflow-y-auto custom-dropdown">
          <li v-for="category in mainCategories" :key="category" class="text-left">
            <template v-if="Object.keys(subcategories).includes(category)">
              <details class="dropdown">
                <summary class="text-base-content">{{ category }}</summary>
                <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                  <li v-for="subCategory in sortedSubcategories[category]" :key="subCategory" class="text-left">
                    <label class="text-base-content">
                      <input
                        type="checkbox"
                        :value="subCategory"
                        v-model="selectedCategories"
                        class="checkbox custom-checkbox"
                      />
                      {{ subCategory }}
                    </label>
                  </li>
                </ul>
              </details>
            </template>
            <label v-else class="text-base-content">
              <input
                type="checkbox"
                :value="category"
                v-model="selectedCategories"
                class="checkbox custom-checkbox"
              />
              {{ category }}
            </label>
          </li>
        </ul>
      </div>

       <!-- Selected categories display
       <div v-if="selectedCategories.length > 0" class="mt-4">
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="category in selectedCategories" 
            :key="category"
            class="badge badge-primary badge-lg"
          >
            {{ category }}
            <button 
              @click="removeCategory(category)"
              class="ml-2"
              :aria-label="`Remove ${category} filter`"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useSongStore } from '../stores/songStore';
import { useCategoryState, getSubcategories, getSortedSubcategories, getMainCategories, categoryShortcuts, CATEGORIES } from '../utils/categoryUtils';

// Use the category state hook
const { selectedCategories, toggleCategory, removeCategory } = useCategoryState();

// const selectedCategories = ref([]);
const currentLetter = ref('');

// Emitting changes to parent
const emit = defineEmits(['update:categories', 'update:letter']);

watch(selectedCategories, (newCategories) => {
  emit('update:categories', newCategories);
}, { deep: true });


watch(currentLetter, (newLetter) => {
  emit('update:letter', newLetter);
});
// Store
const songStore = useSongStore();

// const selectedCategories = ref<string[]>([]);

// // Watch for changes and filter songs
// watch(selectedCategories, (newCategories) => {
//   songStore.filterByCategories(newCategories);
// }, { immediate: true });



// Computed properties
const subcategories = computed(() => getSubcategories());
const sortedSubcategories = computed(() => getSortedSubcategories(subcategories.value));
const mainCategories = computed(() => getMainCategories(songStore.categories));


// Expose selectedCategories to parent components
defineExpose({ selectedCategories });
</script>

  <style>
.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 1.5em;
  height: 1.5em;
  border: 2px solid currentColor;
  border-radius: 0.25em;
  display: inline-grid;
  place-content: center;
}

.custom-checkbox::before {
  content: "";
  width: 0.85em;
  height: 0.85em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em currentColor;
  transform-origin: center;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.custom-checkbox:checked::before {
  transform: scale(1);
}

:root[data-theme="dark"] .custom-checkbox {
  border-color: hsl(var(--bc));
}

:root[data-theme="dark"] .custom-checkbox::before {
  background-color: hsl(var(--bc));
}

.custom-dropdown {
  background-color: white;
  color: black;
  border: 1px solid #e2e8f0;
}

:root[data-theme="dark"] .custom-dropdown {
  background-color: #2d3748;
  color: #e2e8f0;
  border: 1px solid #4a5568;
}

.custom-dropdown li > * {
  color: inherit;
}

.custom-dropdown li > *:hover {
  background-color: #f7fafc;
}

:root[data-theme="dark"] .custom-dropdown li > *:hover {
  background-color: #4a5568;
}

.custom-dropdown .dropdown .dropdown-content {
  background-color: white;
  color: black;
}

:root[data-theme="dark"] .custom-dropdown .dropdown .dropdown-content {
  background-color: #2d3748;
  color: #e2e8f0;
}

.custom-dropdown .dropdown .dropdown-content li > * {
  color: inherit;
}

.custom-dropdown .dropdown .dropdown-content li > *:hover {
  background-color: #f7fafc;
}

:root[data-theme="dark"] .custom-dropdown .dropdown .dropdown-content li > *:hover {
  background-color: #4a5568;
}
  </style>