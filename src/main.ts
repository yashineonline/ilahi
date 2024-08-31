import { createApp } from 'vue'
import { createPinia } from 'pinia'
import YouTube from 'vue3-youtube'
import App from './App.vue'
import router from './router'
import './assets/tailwind.postcss' // Or './main.css'
import Installation from './components/Installation.vue'
import { FontAwesomeIcon } from './plugins/font-awesome'

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
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
