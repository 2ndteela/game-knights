<script>
import { dbListen, dbReadOnce, dbUpdate, dbWrite } from '../../assets/services'
import { clearLocal, getFromLocal, setInLocal } from '../../assets/utilities'
import MessageDialog from '../../components/MessageDialog.vue'

export default {
  components: { MessageDialog },
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
            gameSyncd: false,
            submitted: false,
            currentRound: 0,
            firstPass: true
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.qIdx]
        },
        playerId() {
            return getFromLocal('playerId')
        }
    }, 

    watch: {
        slowReminder(newVal, Oldval) {
            console.log('slow')
            if(newVal) {
                const arr = [
                    'Bruh',
                    'Nana types faster',
                    'Daylight',
                    'No, please take your time'
                ]

                const rand = Math.floor(Math.random() * arr.length)
                this.reminders[this.reminderIdx] = arr[rand]
                this.reminderIdx++

                console.log(this.reminders)

                setTimeout(() => {
                    this.reminders[this.reminderDeleteIdx] = ''
                    this.reminderDeleteIdx++
                }, 2000)

                this.slowReminder = false
            }
        }
    }, 

    methods: {
        async submit() {
            const check = await this.postResponse()
            if(check) {
                if(this.qIdx < this.questions.length - 1) {
                    this.userResponse = ''
                    this.submitted = true
                }
                
                else {
                    if(getFromLocal('playerId') == 0)
                        dbUpdate(`games/${getFromLocal('gameCode')}`, { state: 'finished' })

                    this.$router.push('/he-said-results')
                }
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
            const round = getFromLocal('currentRound')
            const playerId = getFromLocal('playerId')

            const check = await dbReadOnce(`games/${gameCode}`)

            if(!gameCode || round === null || round === undefined || playerId === null || playerId === undefined || !check) { 
                this.showMessage = true
                this.messageBody = 'Looks like your game ended, try going back to the home screen and joining another one.'
                this.messageHeader = 'Game Over'
            }

            if(playerId === 0) {

                if(!this.gameSyncd) {
                    const data = await dbReadOnce(`games/${gameCode}`)
                    this.submissions = data.submissions
                    this.qIdx = data.currentRound
                    this.gameSyncd = true
                }

                dbListen(`stories/${gameCode}`, async snap => {
                    const data = snap.val()
                    const players = getFromLocal('playerCount')
                    const round = getFromLocal('currentRound')
                    
                    
                    if(data && !this.firstPass)
                        this.submissions++

                    else {
                        this.firstPass = false
                        
                        const subCheck = data[0][this.qIdx]
                        if(subCheck)
                            this.submitted = true
                    }

                    if(this.submissions === players) {
                        await dbUpdate(`games/${gameCode}`, { currentRound: this.qIdx + 1, submissions: 0 })
                        this.qIdx++
                        this.submitted = false
                        this.submissions = 0
                    }
                    else
                        await dbUpdate(`games/${gameCode}`, { submissions: this.submissions })
                })
            }
            else {
                dbListen(`games/${gameCode}`, async snap => {
                    const data = snap.val()

                    if(data.submissions === 0 && this.gameSyncd) {
                        this.submitted = false
                        this.qIdx++
                    }
                    
                    else if (!this.gameSyncd) {
                        this.gameSyncd = true
                        this.qIdx = data.currentRound

                        const story = await dbReadOnce(`stories/${gameCode}/${getFromLocal('playerId')}/${this.qIdx}`)
                        if(story)
                            this.submitted = true
                    }
                })

                // dbListen(`games/${gameCode}/remind`, snap => {
                //     if(snap.val()) {
                //         console.log('snap', snap.val())
                //         this.slowReminder = true
                //         dbWrite(`games/${gameCode}/remind`, false)
                //     }
                // })
            }

        },
        goBack() {
            clearLocal()
            this.$router.push('he-said-home')
        }
    },
    mounted() {
        this.syncGame()
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px">
        <v-layout v-if="submitted" justify-center align-center fill-height column style="width: 100%">
            <div>Waiting on your friends to submit...</div>
        </v-layout>
        <v-layout v-else justify-center align-center fill-height column style="width: 100%">
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