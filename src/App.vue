<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-title>Game Knights</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="goHome">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { clearLocal, getFromLocal } from './assets/utilities.js';
import { dbWrite } from './assets/services.js';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  methods: {
    goHome() {
      dbWrite(`games/${getFromLocal('gameCode')}`, null)
      dbWrite(`stories/${getFromLocal('gameCode')}`, null)

      clearLocal()
      this.$router.push('/')
    }
  }
};
</script>

<style>

  div   {
    color: rgba(255, 255, 255, .87);
  }

  .v-application {
    font-family: 'Montserrat' !important;
  }
  .v-application h1, .v-application h2, .v-application h3, .v-application h4, .v-application h5, .v-application h6, .v-toolbar {
    font-family: 'Mukta' !important;
    color: rgba(255, 255, 255, .87);
  }
</style>
