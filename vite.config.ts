import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  define: {
    '__BUILD_DATE__': JSON.stringify(new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })),
    },
  base: '/ilahi/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
          skipWaiting: true, // Immediately activates new service worker
          cleanupOutdatedCaches: true, // Remove old caches
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 3MB
      },     
      includeAssets: [
'512.png', '1024.png'
      ],
      manifest: {
        name: "ilahi Book App",
        short_name: "ilahi",
        description: "Collection of ilahis",
        start_url: "/ilahi/",
        scope: "/ilahi/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#16a34a",
        orientation: "any",
        icons: [
          { src: '/512.png', sizes: '512x512', type: 'image/png' },
          { src: '/1024.png', sizes: '1024x1024', type: 'image/png' }
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
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