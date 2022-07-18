<script>

import { setInLocal, getFromLocal, clearLocal } from '../../assets/utilities.js'
import { dbUpdate, dbReadOnce, dbListen, dbRemoveListener } from '../../assets/services.js'
import MessageDialog from '../../components/MessageDialog.vue'
import InfoButton from '../../components/InfoButton.vue'

export default {
    name: 'HeSaidJoinGame',
    components: { MessageDialog, InfoButton },
    data() {
        return {
            gameCode: '',
            isJoined: false,
            playerCount: 0,
            messageDailog: false,
            messageHeader: '',
            messageBody:'',
            infoMessage: 'He Said/She Said is like writting a story with your friends. ' +
            'Imagine you were all sitting in a circle with a pen and paper. There are 10 prompts to the story, '+
            'and you write your response to one of them and then pass your paper to the right. You write and pass ' + 
            '10 times until the story is complete and it forms a mad lib.'
        }
    },
    methods: {
        async joinGame() {
           const check = await dbReadOnce(`games/${this.gameCode}`)
           if(!check) {
               this.messageHeader = 'No Dice'
               this.messageBody = 'No game with the code: ' + this.gameCode + ' exsits'
               this.messageDailog = true
           }
           else {
               await dbUpdate(`games/${this.gameCode}`, { playerCount: check.playerCount + 1 })
               setInLocal('gameCode', this.gameCode)
               setInLocal('playerId', check.playerCount)
               setInLocal('currentRound', 0)
               this.isJoined = true

               dbListen(`games/${this.gameCode}`, snap => {
                   const data = snap.val()

                   this.playerCount = data.playerCount

                   if(data.state === 'started') {
                        setInLocal('playerCount', this.playerCount)
                        dbRemoveListener(`games/${this.gameCode}`)
                        this.$router.push('/he-said-lobby')
                   }
               })
           }
        },
        async checkForActiveLobby() {
            const lobby = getFromLocal('gameCode')

            if(!lobby) return

            const check = await dbReadOnce(`games/${lobby}`)
            if(check) {
                if (check.state === 'started') 
                    this.$router.push('he-said-lobby')

                else if (check.state === 'finished') {
                    this.$router.push('he-said-results/')
                }

                else {
                    this.isJoined = true
                    this.playerCount = check.playerCount
                    
                    dbListen(`games/${lobby}`, snap => {
                        const data = snap.val()
                        this.playerCount = data.playerCount

                        if(data.state === 'started') {
                            setInLocal('playerCount', this.playerCount)
                            dbRemoveListener(`games/${this.gameCode}`)
                            this.$router.push('/he-said-lobby')
                        }
                    })
                }
            }

        },
        cancel() {
            dbUpdate('games/' + this.gameCode, { playerCount: this.playerCount = this.playerCount - 1 })
            dbRemoveListener(`games/${this.gameCode}`)
            clearLocal()
            this.isJoined = false
        }
    },
    mounted() {
        this.checkForActiveLobby()
    },
    watch: {
        gameCode(value, old) {
            this.gameCode = value.toUpperCase()
        }
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px" justify-center align-center column >
        <info-button :message="infoMessage" header="The Basics" ></info-button>
        <v-flex style="width: 100%" v-if="!isJoined">
            <v-layout column justify-end fill-height>
                <div>
                    <v-text-field 
                        outlined
                        label="Game Code"
                        v-model="gameCode"
                        hide-details
                        color="accent"
                    ></v-text-field>
                </div>
            </v-layout>
        </v-flex>
        <v-flex style="padding-top: 16px; width: 100%" v-if="!isJoined">
            <v-layout justify-end align-end>
                <v-btn @click="joinGame" color="primary">Join</v-btn>
            </v-layout>
        </v-flex>
        <v-flex v-else>
            <v-layout column justify-center align-center style="height: 100%" >
                <h1 class="accent--text" style="text-align: center">{{gameCode}}</h1>
                <div>Waiting on your friends...</div>
                <div>So far {{playerCount}} have joined</div>
                <v-btn @click="cancel" style="margin-top: 16px">Cancel</v-btn>
            </v-layout>
        </v-flex>
        <message-dialog
            v-model="messageDailog"
            :body="messageBody"
            :header="messageHeader"
        ></message-dialog>
    </v-layout>
</template>