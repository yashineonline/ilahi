import { createApp } from 'vue'
import { createPinia } from 'pinia'
import YouTube from 'vue3-youtube'
import App from './App.vue'
import router from './router'
import './assets/tailwind.postcss' // Or './main.css'
import Installation from './components/Installation.vue'
import { FontAwesomeIcon } from './plugins/font-awesome'
import { registerSW } from 'virtual:pwa-register';
import { useNotificationStore } from './stores/notificationStore'; // Import your notification store


// Register the service worker
registerSW({ immediate: true });

const app = createApp(App)
const pinia = createPinia()
app.component('YouTube', YouTube)
app.component('Installation', Installation)
app.component('font-awesome-icon', FontAwesomeIcon)


app.use(pinia)
app.use(router)

app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ilahi/service-worker.js', {scope: '/ilahi/'})
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      
         // Check for updates
         registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Notify the notification store about the update
                const notificationStore = useNotificationStore();
                notificationStore.setUpdateAvailable(true);
              }
            };
          }
        };
      
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
