// src/stores/notificationStore.ts
import { defineStore } from 'pinia';

interface NotificationState {
    updateAvailable: boolean;
  }

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    updateAvailable: false,
  }),
  actions: {
    setUpdateAvailable(value: boolean) {
      this.updateAvailable = value;
    },
    resetUpdateAvailable() {
      this.updateAvailable = false;
    },
  },
});