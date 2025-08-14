// src/vite-plugin-pwa.d.ts
// declare module 'virtual:pwa-register' {
//     export function registerSW(options?: { immediate?: boolean }): Promise<void>;
//   }

  declare module 'virtual:pwa-register' {
    export interface RegisterSWOptions {
      immediate?: boolean;
      onNeedRefresh?: () => void;
      onOfflineReady?: () => void;
    }
    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => void;
  }