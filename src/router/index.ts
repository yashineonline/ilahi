import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import Home from '../views/Home.vue'

// import SongList from '../components/SongList.vue'
// import SongDisplay from '../components/SongDisplay.vue'
// import BookView from '../views/BookView.vue'
// import AboutView from '../views/AboutView.vue'
// import YouTubePlayer from '../components/YouTubePlayer.vue'
// import Poems from '../views/Poems.vue'
// import Entrance from '../components/Entrance.vue'
// import Wirds from '../views/Wirds.vue'
// import BooksView from '../views/BooksView.vue'
// import HistoryView from '../views/HistoryView.vue'
// import MiscellaneousView from '../views/MiscellaneousView.vue'
// import AuthorPoems from '../views/AuthorPoems.vue';
import { useSongStore } from '../stores/songStore'
// import ZikrPlayer from '../components/ZikrPlayer.vue'
// import IlahiClasses from '../components/IlahiClasses.vue'

// Lazy (split chunks)
const SongList = () => import('../components/SongList.vue')
const SongDisplay = () => import('../components/SongDisplay.vue')
const BookView = () => import('../views/BooksView.vue')
const BooksView = () => import('../views/BooksView.vue')
const Poems = () => import('../views/Poems.vue')
const AboutView = () => import('../views/AboutView.vue')
const YouTubePlayer = () => import('../components/YouTubePlayer.vue')
const Entrance = () => import('../components/Entrance.vue')
const Wirds = () => import('../views/Wirds.vue')
const HistoryView = () => import('../views/HistoryView.vue')
const MiscellaneousView = () => import('../views/MiscellaneousView.vue')
const AuthorPoems = () => import('../views/AuthorPoems.vue')
const ZikrPlayer = () => import('../components/ZikrPlayer.vue')
const GlobalToast = () => import('../components/GlobalToast.vue')


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
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
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
    path: '/globalToast',
    name: 'GlobalToast',
    component: GlobalToast ,
  
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
    path: '/poems/:authorName',
    name: 'AuthorPoems', 
    component: () => import('../views/AuthorPoems.vue')
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
  {
    path: '/naat',
    name: 'NaatList',
    component: SongList,
    props: { filePath: 'naat.txt' }
  },
  // {
  //   path: '/ilahi-classes',
  //   name: 'IlahiClasses',
  //   component: IlahiClasses
  // },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router