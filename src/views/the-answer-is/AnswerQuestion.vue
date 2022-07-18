<template>
  <v-layout 
  column 
  style="height: 100%; width: 100%; padding: 16px">
      <v-layout v-if="answerReady && !submitted" column style="height: 100%; width: 100%;" justify-start>
        <v-layout column style="width: 100%; flex: 0 0 auto" align-center > 
          <div>The answer is:</div>
          <h2 style="text-align: center">{{response}}</h2>
        </v-layout>
        <v-layout column style="flex: 1 0 auto" justify-center>
          <!-- Make a timer for the question -->
          <!-- Add info blurb -->
          <div style="padding-bottom: 4px">What is the question?</div>
          <div>
            <v-textarea
              v-model="question"
              outlined
              hide-details
            ></v-textarea>
          </div>
          <div style="padding-top: 8px; width: 100%">
            <v-btn @click="submitQuestion" color="primary" style="width: 100%">Submit</v-btn>
          </div>
        </v-layout>
      </v-layout>
      <v-layout v-else-if="submitted && answerReady" column style="height: 100%; width: 100%;" justify-start>
        <v-layout column align-center style="width: 100%; flex-grow: 0">
          <div>The Answer Was</div>
          <h2>{{response}}</h2>
        </v-layout>
        <v-layout column style="padding-top: 8px">
          <div>Here's everyone's responses</div>
          <div v-for="(p, itr) in responseList" :key="itr" > 
            <div v-if="p.question" class="question-bubble">
              {{p.question}}
            </div>
          </div>
        </v-layout>
      </v-layout>
      <v-layout v-else>
        <waiting-screen message="Waiting for an answer" ></waiting-screen>
      </v-layout>
  </v-layout> 
</template>

<script>
import { dbListen, dbReadOnce, dbRemoveListener, dbUpdate, dbWrite } from '../../assets/services'
import { gameCodeString, getFromLocal, playersString } from '../../assets/utilities'
import WaitingScreen from '../../components/WaitingScreen.vue'
export default {
    name: 'AnswerResponse',
    components: { WaitingScreen },
    data() {
        return {
            answerReady: false,
            submitted: false,
            response: '',
            question: '',
            playerResponses: [],
        }
    },
    computed: {
      waitMessage() {
        if (!this.submitted && !this.answerReady)
          return 'Waiting for the answer to be sumbitted'

        return 'Waiting on a winner to be chosen'
      },
      responseList() {
        console.log('responses', this.playerResponses)
        if(!this.playerResponses) 
          return []

        const arr = []
        for(let el in this.playerResponses) {
          arr.push({
            player: el,
            question: this.playerResponses[el].question
          })
        }

        return arr
      }
    },

    methods: {
      listenForMyTurn() {
          dbListen(`games/${getFromLocal('gameCode')}/currentQuestioner`, snap => {
            console.log('fired from listenForMyTurn in AnswerQuestion')

            if(snap.val() === getFromLocal('playerId'))
              this.$router.push('answer-response')
          })
      },
      listenForResponse() {
        dbListen(`games/${getFromLocal('gameCode')}/state`, snap => {
          console.log('fired from listenForResponse in AnswerQuestion')
          const data = snap.val()

          if(data === 'answered') {
            this.getPrompt()
            this.answerReady = true
          }

          else if(data === 'picking') {
            this.answerReady = true
            this.submitted = true

            if(!this.playerResponses.length) {
              this.listenForPlayerResponses()
              this.getPrompt()
            }

          }

          else if(data === 'standings') {
            this.$router.push('/answer-leader-board')
          }
        })
      },
      listenForPlayerResponses() {
        dbListen(`players/${getFromLocal('gameCode')}`, snap => {
          console.log('fired from listenForPlayerResponses')
          const data = snap.val()
          console.log('players', data)

          this.playerResponses = data

        })
      },
      async getPrompt() {
        const data = await dbReadOnce(gameCodeString('response'))
        this.response = data
      },

      async submitQuestion() {
        if(!this.response) return 

        await dbUpdate(playersString(getFromLocal('playerId')), { question: this.question})
        const submissions = await dbReadOnce(gameCodeString('submissions'))
        await dbUpdate(gameCodeString(), {submissions: submissions + 1})
        this.submitted = true

        this.listenForPlayerResponses()
      }
    },
    mounted() {
      this.listenForMyTurn()
      this.listenForResponse()
    },
    destroyed() {
      dbRemoveListener(`games/${getFromLocal('gameCode')}/currentQuestioner`)
      dbRemoveListener(gameCodeString('state'))
      dbRemoveListener(`games/${getFromLocal('gameCode')}/state`)
    }
}
</script>

<style>
  .question-bubble {
    width: 100%;
    background-color: #222;
    padding: 8px 16px;
    border-radius: 4px;
    margin-top: 8px;
  }
</style>