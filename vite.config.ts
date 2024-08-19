// <!-- This component is temporarily ignored during build. -->
// <!-- TODO: Implement proper functionality before re-enabling. -->


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/songApp-step3/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // to ignore the files that are ignored
  build: {
    rollupOptions: {
      external: [/\.ignore\.(ts|vue)$/]
    }
  }
})



