import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig({
  base: '/ilahi/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['192.png', '48.png', '72.png', '96.png', '144.png', '512.png'],
      manifest: {
        name: "ilahi Book App",
        short_name: "Ilahi",
        description: "Collection of Ilahis",
        start_url: "/ilahi/",
        scope: "/ilahi/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#16a34a",
        icons: [
          {
            src: '/48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'docs', // convention is keep this dist, but we make docs for
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  optimizeDeps: {
    exclude: [
      // '**/*.ignore.ts', 
      // '**/*.ignore.vue',
    ]
  }
})