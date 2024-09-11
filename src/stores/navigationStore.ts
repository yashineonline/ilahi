import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    isNavigationVisible: true,
  }),
  actions: {
    setNavigationVisibility(isVisible: boolean) {
      this.isNavigationVisible = isVisible;
    },
  },
});