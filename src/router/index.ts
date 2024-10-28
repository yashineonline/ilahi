import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SongList from '../components/SongList.vue'
import SongDisplay from '../components/SongDisplay.vue'
import BookView from '../views/BookView.vue'
import AboutView from '../views/AboutView.vue'
import YouTubePlayer from '../components/YouTubePlayer.vue'
import Poems from '../views/Poems.vue'
import Entrance from '../components/Entrance.vue'
import Wirds from '../views/Wirds.vue'
import BooksView from '../views/BooksView.vue'
import HistoryView from '../views/HistoryView.vue'
import MiscellaneousView from '../views/MiscellaneousView.vue'
import AuthorPoems from '../views/AuthorPoems.vue';
import { useSongStore } from '../stores/songStore'
import ZikrPlayer from '../components/ZikrPlayer.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/book',
    name: 'Book',
    component: BookView
  },
  {
    path: '/songs',
    name: 'SongList',
    component: SongList,
    beforeEnter: (to, from, next) => {
      const songStore = useSongStore()
      if (to.query.search) {
        songStore.setSearchQuery(to.query.search as string)
      }
      next()
    }
  },
  {
    path: '/player/:slug',
    name: 'SongDisplay',
    component: SongDisplay,
  
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Home // or create a dedicated NotFound component
  },
  {
    path: '/youtube-player',
    name: 'YouTubePlayer',
    component: YouTubePlayer
  },
  {
    path: '/entrance',
    name: 'Entrance',
    component: Entrance
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems
  },
  {
    path: '/wirds',
    name: 'wirds',
    component: Wirds
  },
  {
    path: '/history',
    name: 'History',
    component: HistoryView
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView
  },
  {
    path: '/miscellaneous',
    name: 'Miscellaneous',
    component: MiscellaneousView
  },
  {
    path: '/poems/:authorName',
    name: 'AuthorPoems',
    component: AuthorPoems
  },
  {
    path: '/zikr-practice',
    name: 'ZikrPlayer',
    component: ZikrPlayer
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router