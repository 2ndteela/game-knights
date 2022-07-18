import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import HeSaidSheSaidHome from '../views/he-said-she-said/HeSaidSheSaidHome.vue'
import HeSaidJoinGame from '../views/he-said-she-said/HeSaidJoinGame.vue'
import HeSaidNewGame from '../views/he-said-she-said/HeSaidNewGame.vue'
import HeSaidLobby from '../views/he-said-she-said/HeSaidLobby.vue'
import HeSaidResults from '../views/he-said-she-said/HeSaidResults.vue'

import AnswerHome from '../views/the-answer-is/AnswerHome.vue'
import AnswerJoin from '../views/the-answer-is/AnswerJoinGame.vue'
import AnswerNewGame from '../views/the-answer-is/AnswerNewGame.vue'
import AnswerQuestion from '../views/the-answer-is/AnswerQuestion.vue'
import AnswerResponse from '../views/the-answer-is/AnswerResponse.vue'
import AnswerLeaderBoard from '../views/the-answer-is/AnswerLeaderBoard.vue'

import WordFightHome from '../views/word-fight/WordFightHome'
import WordFightJoin from '../views/word-fight/WordFightJoin'
import WordFightNewGame from '../views/word-fight/WordFightNewGame'
import WordFightCreate from '../views/word-fight/WordFightCreate'
import WordFightPlay from '../views/word-fight/WordFightPlay'

import CownterLandingPage from '../views/cownter/CownterLandingPage'
import CownterJoinGame from '../views/cownter/CownterJoinGame'
import CownterCreateGame from '../views/cownter/CownterCreateGame'

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
  },
  {
    path: '/answer-home',
    name: 'AnswerHome',
    component: AnswerHome
  },
  {
    path: '/answer-join',
    name: 'AnswerJoin',
    component: AnswerJoin
  },
  {
    path: '/answer-new',
    name: 'AnswerNewGame',
    component: AnswerNewGame
  },
  {
    path: '/answer-question',
    name: 'AnswerQuestion',
    component: AnswerQuestion
  },
  {
    path: '/answer-response',
    name: 'AnswerQuestion',
    component: AnswerResponse
  },
  {
    path: '/answer-leader-board',
    name: 'AnswerLeaderBoard',
    component: AnswerLeaderBoard
  }, 
  {
    path: '/word-home',
    name: 'WordHome',
    component: WordFightHome
  },
  {
    path: '/word-new',
    name: 'WordNew',
    component: WordFightNewGame
  },
  {
    path: '/word-join',
    name: 'WordJoin',
    component: WordFightJoin
  },
  {
    path: '/word-play',
    name: 'WordPlay',
    component: WordFightPlay,
  },
  {
    path: '/word-create',
    name: 'WordCreate',
    component: WordFightCreate
  },
  {
    path: '/cownter-create',
    name: 'CownterCreate',
    component: CownterCreateGame
  },
  {
    path: '/cownter-join',
    name: 'CownterJoin',
    component: CownterJoinGame
  },
  {
    path: '/cownter-home',
    name: 'CownterLandingPage',
    component: CownterLandingPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
