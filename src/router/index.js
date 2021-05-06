import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import HeSaidSheSaidHome from '../views/he-said-she-said/HeSaidSheSaidHome.vue'
import HeSaidJoinGame from '../views/he-said-she-said/HeSaidJoinGame.vue'
import HeSaidNewGame from '../views/he-said-she-said/HeSaidNewGame.vue'
import HeSaidLobby from '../views/he-said-she-said/HeSaidLobby.vue'
import HeSaidResults from '../views/he-said-she-said/HeSaidResults.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/he-said-home',
    name: 'HeSaidSheSaidHome',
    component: HeSaidSheSaidHome
  },
  {
    path: '/he-said-host',
    name: 'HeSaidNewGame',
    component: HeSaidNewGame
  },
  {
    path: '/he-said-join',
    name: 'HeSaidJoinGame',
    component: HeSaidJoinGame
  },
  {
    path: '/he-said-lobby',
    name: 'HeSaidLobby',
    component: HeSaidLobby
  },
  {
    path: '/he-said-results',
    name: 'HeSaidResults',
    component: HeSaidResults
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
