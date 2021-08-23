<template>
  <v-container>
    <v-layout column>
      <div class="link-container" style="padding-top: 8px" >
        <v-btn width="100%" height="68px" @click="goTo('/he-said-home')">He Said She Said</v-btn>
      </div>
      <!-- <div class="link-container" style="padding-top: 8px" >
        <v-btn width="100%" height="68px" @click="goTo('/answer-home')">The Answer is...</v-btn>
      </div> -->
    </v-layout>
  </v-container>
</template>

<script>

  export default {
    name: 'Home',
    methods: {
      goTo(link) {
        this.$router.push(link)
      }
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
