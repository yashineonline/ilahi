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
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
      // external: [/\.ignore\.(ts|vue)$/]
    }
  },
  // Add this section to ignore files
  optimizeDeps: {
    exclude: [
      '**/*.ignore.ts', 
      '**/*.ignore.vue',
    
    ]
  }
})



