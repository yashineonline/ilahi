import { createApp } from 'vue'
import { createPinia } from 'pinia'
import YouTube from 'vue3-youtube'
import App from './App.vue'
import router from './router'
import './assets/tailwind.postcss' // Or './main.css'
import Installation from './components/Installation.vue'
import { FontAwesomeIcon } from './plugins/font-awesome'
import { registerSW } from 'virtual:pwa-register';
// import { useNotificationStore } from './stores/notificationStore'; // Import your notification store

registerSW({ immediate: true }) // Ensures updates are applied immediately



const app = createApp(App)
const pinia = createPinia()
app.component('YouTube', YouTube)
app.component('Installation', Installation)
app.component('font-awesome-icon', FontAwesomeIcon)


app.use(pinia)
app.use(router)

app.mount('#app')

