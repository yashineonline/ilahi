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

registerSW({ immediate: true }) // Ensures updates are applied immediately


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.update(); // Force update
      });
    });
  }


app.mount('#app')

