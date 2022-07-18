<template>
  <v-container>
    <v-layout column>
      <div class="link-container" style="padding-top: 8px" >
        <v-btn width="100%" height="68px" @click="goTo('/he-said-home')">He Said She Said</v-btn>
      </div>
      <div class="link-container" style="padding-top: 8px" >
        <v-btn width="100%" height="68px" @click="goTo('/answer-home')">The Answer is...</v-btn>
      </div> 
      <div class="link-container" style="padding-top: 8px">
        <v-btn width="100%" height="68px" @click="goTo('/cownter-home')">Cownter</v-btn>
      </div>
      <div class="link-container" style="padding-top: 8px" >
        <v-btn width="100%" height="68px" @click="goTo('/word-home')">Word Fight!</v-btn>
      </div> 
    </v-layout>
  </v-container>
</template>

<script>
import { dbReadOnce, dbWrite } from '../assets/services'

  export default {
    name: 'Home',
    methods: {
      goTo(link) {
        this.$router.push(link)
      }
    },
    async mounted() {
      const games = await dbReadOnce('/games')
      const NOW = new Date()


      const allGames =  Object.keys(games)
      const oneWeek = 7 * 24 * 60 * 60 * 1000

      allGames.forEach(g => {
        const game = games[g]
        if(!game.startTime) {
          dbWrite(`/games/${g}`, null)
          dbWrite(`/players/${g}`, null)
          dbWrite(`/stories/${g}`, null)
          
        }
        else if(game.startTime) {
          const startTime = new Date(game.startTime)
          const diff = NOW - startTime
          if(diff > oneWeek) {
            dbWrite(`/games/${g}`, null)
            dbWrite(`/players/${g}`, null)
            dbWrite(`/stories/${g}`, null)
          }
        }
        

      })
    }
  }
</script>

<style>
  .link-container {
    padding-top: 16px;
    display: flex;
    justify-content: center;
  }
</style>
