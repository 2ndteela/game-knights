<script>
import MessageDialog from '../../components/MessageDialog.vue'
import InfoButton from '../../components/InfoButton.vue'
import { setInLocal, getFromLocal, clearLocal, gameCodeString } from '../../assets/utilities'
import { dbUpdate, dbReadOnce, dbListen, dbRemoveListener } from '../../assets/services'

export default {
    name: 'AnswerJoin',
    components: { MessageDialog, InfoButton },
    data() {
        return {
            gameCode: '',
            screenName: '',
            isJoined: false,
            playerCount: 0,
            messageDailog: false,
            messageHeader: '',
            messageBody:'',
            infoMessage: 'The Answer Is... is a game all about twisting your friends words. ' +
            'One player is going to be assigned to come up with an answer. From there, the rest of you are going to come up '+
            'questions that make that answer seem wild. From there, the answer writer will pick their favorite question ' + 
            'kind of like Cards Against Humanity or Apples to Apples.'
        }
    },
    methods: {
        async joinGame() {
            const name = this.screenName.trim()
            const gameCode = this.gameCode.trim()
            const check = await dbReadOnce(`games/${gameCode}`)
            const nameCheck = await dbReadOnce(`/players/${gameCode}/${name}`)
            if(!check) {
                this.messageHeader = 'No Dice'
                this.messageBody = 'No game with the code: ' + gameCode + ' exsits'
                this.messageDailog = true
            }

            else if(!!nameCheck) {
                this.messageHeader = 'Same name... Awkward...'
                this.messageBody = 'Sorry, someone else already has that name in this game. You\'re gonna need a new one.'
                this.messageDailog = true
            }
            else {
                await dbUpdate(`games/${gameCode}`, { playerCount: check.playerCount + 1 })
                await dbUpdate(`players/${gameCode}/${name}`, {score: 0})
                setInLocal('gameCode', gameCode)
                setInLocal('playerId', name)
                this.isJoined = true

                dbListen(`games/${gameCode}`, async snap => {
                    // console.log('fired from join game in AnswerJoinGame')
                    const data = snap.val()

                    this.playerCount = data.playerCount

                    if(data.state === 'started') {
                        dbRemoveListener(`games/${gameCode}`)

                        const players = await dbReadOnce(`players/${this.gameCode}`)
                        const playersArr = []
                        for(const p in players)
                            playersArr.push(p)

                        setInLocal('players', playersArr)

                        this.$router.push('/answer-question')
                    }
                })
            }
        },
        async checkForActiveLobby() {
            const lobby = getFromLocal('gameCode')

            if(!lobby) return

            const check = await dbReadOnce(gameCodeString())
            if(check) {
                if (check.state === 'started' || check.state === 'answering' || check.state === 'answered' || check.state === 'picking' ) 
                    this.$router.push('/answer-question')

                else if (check.state === 'finished') {
                    this.$router.push('/answer-leader-board')
                }

                else {
                    this.isJoined = true
                    this.playerCount = check.playerCount
                    
                    dbListen(gameCodeString(), snap => {
                        // console.log('fired from checkFromActiveLobby in AnswerJoinGame')
                        const data = snap.val()
                        this.playerCount = data.playerCount

                        if(data.state === 'started') {
                            setInLocal('currentRound', 0)
                            dbRemoveListener(gameCodeString())
                            this.$router.push('/answer-response')
                        }
                    })
                }
            }

        },
        cancel() {
            dbUpdate('games/' + this.gameCode, { playerCount: this.playerCount = this.playerCount - 1 })
            dbRemoveListener(gameCodeString())
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
                        label="Screen Name"
                        v-model="screenName"
                        hide-details
                        color="accent"
                    ></v-text-field>
                </div>
                <div style="padding-top: 16px">
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