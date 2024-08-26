import { App } from 'vue'

declare module '@vue/runtime-core' {
  interface App {
    resetGlobalSearch?: () => void
  }
}