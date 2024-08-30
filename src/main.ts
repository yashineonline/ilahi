import { createApp } from 'vue'
import { createPinia } from 'pinia'
import YouTube from 'vue3-youtube'
import App from './App.vue'
import router from './router'
import './assets/tailwind.postcss' // Or './main.css'

const app = createApp(App)
const pinia = createPinia()
app.component('YouTube', YouTube)

app.use(pinia)
app.use(router)

app.mount('#app')
