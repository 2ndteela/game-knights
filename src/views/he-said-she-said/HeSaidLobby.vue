<script>
import { dbListen, dbReadOnce, dbWrite, dbRemoveListener } from '../../assets/services'
import { clearLocal, getFromLocal } from '../../assets/utilities'
import MessageDialog from '../../components/MessageDialog.vue'
import ProgressLoader from '../../components/ProgressLoader.vue'
import WaitingScreen from '../../components/WaitingScreen.vue'

export default {
  components: { MessageDialog, WaitingScreen, ProgressLoader },
    name: 'HeSaidLobby',
    data() {
        return {
            questions: [
                {text: 'Write the name of a boy'},
                {text: 'Now the name of a girl'},
                {text: 'Where are they?' },
                {text: 'What are they doing?', area: true },
                {text: 'The boy starts the conversation, he says', area: true},
                {text: 'The girl responds', area: true},
                {text: 'Next, the boy says', area: true},
                {text: 'The girl then says', area: true},
                {text: "What's the moral of the story?", helpText: 'In the results screen whatever you write here will have "And so we see" before it.' },
                {text: 'Finally, give this all a hash tag'}
            ],
            started: true,
            qIdx: 0,
            userResponse: '',
            showMessage: false,
            messageBody: '',
            messageHeader: '',
            submissions: 0,
            submitted: false,
            currentRound: 0,
            firstPass: true,
            completed: false,
            counter: 45,
            percent: 100,
            interval: null
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.qIdx]
        },
        playerId() {
            return getFromLocal('playerId')
        },  
        playerCount() {
            return getFromLocal('playerCount')
        },
        counterStart() {
            if (this.qIdx > 0) return 45
            return 45
        }
    }, 
    watch : {
        qIdx(val) {
            if (val === 10) {
                this.completed = true
                clearInterval(this.interval)
                const story = getFromLocal('gameCode')
                dbListen(`stories/${story}`, snap => {
                    const data = snap.val()
                    let count = 0
                    data.forEach(s => {
                        if(s.length >= 10)
                            count++
                    })

                    this.submissions = count
                    if (count === this.playerCount) {

                        if(this.playerId == 0) 
                            dbWrite(`games/${story}/status`, 'finished')

                        dbRemoveListener(`stories/${story}`)
                        this.$router.push('/he-said-results')
                    }
                })
            }
        }
    },

    methods: {
        async submit() {
            if(!this.userResponse)
                return

            const check = await this.postResponse()
            if(check) {
                this.submitted = true
                this.userResponse = ''
                this.qIdx++
                this.counter = 30
            }
            else {
                this.showMessage = true
                this.messageBody = 'There was an error submitting your response. You game might be over or out of sync'
                this.messageHeader = 'Error'
            }
        },
        async postResponse() {
            try {
                const story = getFromLocal('gameCode')
                const playerId = getFromLocal('playerId')
                await dbWrite(`stories/${story}/${playerId}/${this.qIdx}`, this.userResponse)
                return true
            }
            catch(err) {
                console.error(err)
                return false
            }
        },
        async syncGame() {
            const gameCode = getFromLocal('gameCode')
            const playerId = getFromLocal('playerId')

            const check = await dbReadOnce(`games/${gameCode}`)

            if(!gameCode || playerId === null || playerId === undefined || !check) { 
                this.showMessage = true
                this.messageBody = 'Looks like your game ended, try going back to the home screen and joining another one.'
                this.messageHeader = 'Game Over'
            }

            this.qIdx = parseInt(getFromLocal('currentRound'), 10)
        },
        goBack() {
            clearLocal()
            this.$router.push('he-said-home')
        }
    },
    mounted() {
        this.syncGame()

        this.interval = setInterval(async () => { 

            if(this.qIdx > 10) {
                this.completed = true
                return
            }

            if(this.counter <= 0) {
                this.userResponse = 'REDACTED'
                await this.submit()
                this.counter = 30
                this.percent = 100
                
            }
            else if(this.showMessage) { /* do nothing on error */ }
            else if(this.completed) {

            }
            else {
                this.counter--   
                this.percent = Math.floor((this.counter / this.counterStart) * 100)
            }
              
        }, 1000)
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px">
        <v-layout v-if="completed" justify-center align-center fill-height column style="width: 100%">
            <h1 style="padding-bottom: 16px">Players Submitted</h1>
            <progress-loader :current="submissions" :total="playerCount" ></progress-loader>
        </v-layout>
        
        <v-layout v-else justify-center align-center fill-height column style="width: 100%">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center; height: 100px">
                <div style="position: relative">
                    <v-progress-circular :value="percent" size="50" :color=" counter > 10 ? 'accent' : 'error'" width="4"></v-progress-circular>
                    <div style="position: absolute; top: 15px; left: 12px; text-align: center; width: 24px;">{{counter}}</div>
                </div>
            </div>
            <div style="width: 100%">
                <div style="padding-bottom: 4px">{{currentQuestion.text}}</div>
                
                <v-textarea 
                v-if="currentQuestion.area"
                outlined
                v-model="userResponse"
                hide-details
                ></v-textarea>

                <v-text-field
                v-else
                outlined
                v-model="userResponse"
                hide-details
                ></v-text-field>
                
                <v-btn color="primary" style="margin-top: 8px; width: 100%" @click="submit">Submit</v-btn>
                <div style="padding-top: 16px; text-align: center" v-if="currentQuestion.helpText" >{{currentQuestion.helpText}}</div>
            </div>
        </v-layout>
        <message-dialog
            v-model="showMessage"
            :body="messageBody"
            :header="messageHeader"
            :callback="goBack"
        >
        </message-dialog>
    </v-layout>
</template>

<style>

</style>