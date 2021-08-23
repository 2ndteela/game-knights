<template>
  <div>Answer Response</div>
</template>

<script>
import { dbListen } from '../../assets/services'
import { getFromLocal } from '../../assets/utilities'
export default {
    name: 'AnswerResponse',
    data() {
        return {

        }
    },
    methods: {
      listenForMyTurn() {
          dbListen(`games/${getFromLocal('gameCode')}/currentQuestioner`, snap => {
            if(snap.val() === getFromLocal('playerId'))
              this.$router.push('answer-response')
          })
      }
    },
    mounted() {
      this.listenForMyTurn()
    }
}
</script>

<style>

</style>