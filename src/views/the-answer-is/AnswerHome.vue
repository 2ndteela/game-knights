<script>
export default {
  name: 'AnswerHome',
  methods: {
        goTo(route) {
            this.$router.push(route)
        }
    }
}
</script>

<template>
  <v-layout column align-center fill-height>
      <h2 style="padding: 16px 0px">The Answer Is</h2>
      <v-layout justify-center align-center column>
          <v-flex class="option-tile" @click="goTo('/answer-new')">
              <v-layout justify-center align-center fill-height>
                  <span>Start New Game</span>
              </v-layout>
          </v-flex>
          <v-flex class="option-tile" @click="goTo('/answer-join')">
              <v-layout justify-center align-center fill-height>
                  <span>Join A Game</span>
              </v-layout>
          </v-flex>
      </v-layout>
  </v-layout>
</template>

<style>
    .option-tile span {
        width: 92vw;
        text-align: center;
        font-size: 36px;
    }

    .option-tile {
        background-color: #232323;
        margin: 16px;
        margin-top: 0px;
        height: 36vh;
        border-radius: 4px;
    }
</style>