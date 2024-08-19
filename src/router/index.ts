import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SongList from '../components/SongList.vue'
import SongDisplay from '../components/SongDisplay.vue'
import BookView from '../views/BookView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/book',
    name: 'Book',
    component: BookView
  },
  {
    path: '/songs',
    name: 'SongList',
    component: SongList
  },
  {
    path: '/player/:id',
    name: 'SongDisplay',
    component: SongDisplay
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
