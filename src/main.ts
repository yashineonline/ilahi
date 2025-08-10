import { createApp } from 'vue'
import { createPinia } from 'pinia'
import YouTube from 'vue3-youtube'
import App from './App.vue'
import router from './router'
// import './assets/tailwind.postcss' // Or './main.css'
import './style.css'
import Installation from './components/Installation.vue'
import { FontAwesomeIcon } from './plugins/font-awesome'
import { registerSW } from 'virtual:pwa-register';
// import { useNotificationStore } from './stores/notificationStore'; // Import your notification store
// import { initializeGlobalHyperlinks } from '@/utils/hyperlinkParser.ts';

router.beforeEach((to, from, next) => {
  // This will ensure all page navigations start at the top
  window.scrollTo(0, 0)
  next()
})

const app = createApp(App)
const pinia = createPinia()
app.component('YouTube', YouTube)
app.component('Installation', Installation)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)

// Initialize global hyperlink handling
// initializeGlobalHyperlinks();

// Register/unregister Service Worker depending on env
const enableSWInDev = import.meta.env.VITE_SW_DEV === 'true'
if (import.meta.env.PROD || enableSWInDev) {
  const updateServiceWorker = registerSW({ immediate: true })

  // Listen for the custom event dispatched by the injected runtime when a new SW is waiting
  // We implement a simple polling to check for a waiting SW and prompt the user
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed')
    })
 // only poll and prompt in production
 if (import.meta.env.PROD) {
    setInterval(async () => {
      const regs = await navigator.serviceWorker.getRegistrations()
      for (const reg of regs) {
        if (reg.waiting) {
          const accept = window.confirm('A new version of ilahi is available. Reload now?')
          if (accept) {
            // Ask the waiting SW to take control, then reload on controller change
            reg.waiting.postMessage({ type: 'SKIP_WAITING' })
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              window.location.reload()
            }, { once: true })
          }
          break
        }
      }
    }, 15000)
  }
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.update())
    })
  }
} else {
  // Development default: ensure no SW controls the page to avoid stale caches
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
}

app.mount('#app')


