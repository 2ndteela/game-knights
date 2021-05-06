<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-title>Game Knights</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
  .v-application {
    font-family: 'Montserrat' !important;
  }
  .v-application > h1, .v-application > h2, .v-application > h3, .v-application > h4, .v-application > h5, .v-application > h6, .v-toolbar {
    font-family: 'Mukta' !important;
  }
</style>
