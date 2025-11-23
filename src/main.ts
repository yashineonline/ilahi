// main.ts
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

if (import.meta.env.PROD) {
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh: () => window.showGlobalToast?.('New version available. Tap to update.', () => updateSW(true)),
  onOfflineReady: () => window.showGlobalToast?.('App is ready to work offline.'),
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    navigator.serviceWorker?.getRegistrations().then(rs => rs.forEach(r => r.update()));
  }
});
}

// Register/unregister Service Worker depending on env
const enableSWInDev = import.meta.env.VITE_SW_DEV === 'true'
// Only poll and prompt in production
if (import.meta.env.PROD) {

  // Force check for new SW on load
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.update());
  });

} else {
  // Development: ensure no SW controls the page to avoid stale caches
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
}

app.mount('#app')


