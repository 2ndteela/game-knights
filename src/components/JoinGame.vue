

<script>
import MessageDialog from '../../components/MessageDialog.vue'
import InfoButton from '../../components/InfoButton.vue'
import { setInLocal, getFromLocal, clearLocal, gameCodeString } from '../../assets/utilities'
import { dbUpdate, dbReadOnce, dbListen, dbRemoveListener } from '../../assets/services'
export default {
    name: "GameJoiner",
    props: ['cownterPicker', 'explainBody', 'gameType'],
    components: { MessageDialog, InfoButton },
    data: () => ({
        gameCode: '',
        screenName: '',
        isJoined: false,
        playerCount: 0,
        messageDailog: false,
        messageHeader: '',
        messageBody:'',
    }),
    computed: {
        initalPlayerState() {
            return { socre: 0 }
        },
        startGameRoute() {
            if(this.gameType === 'AnswerIs')
                return '/answer-question'
        }
    },
    methods: {

        continueIntoStartedGame(game) {
            if(this.gameType === 'AnswerIs') {
                if(game.state === 'started' || game.state === 'answering' || game.state === 'answered' || game.state === 'picking')
                    this.$router.push('/answer-question')

                else if (game.state === 'finished') {
                    this.$router.push('/answer-leader-board')
                }
                else {
                    this.isJoined = true
                    this.playerCount = check.playerCount
                    
                    dbListen(gameCodeString(), snap => {
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
                    const data = snap.val()

                    this.playerCount = data.playerCount

                    if(data.state === 'started') {
                        dbRemoveListener(`games/${gameCode}`)

                        if(this.gameType === 'AnswerIs') {
                            const players = await dbReadOnce(`players/${this.gameCode}`)
                            const playersArr = []
                            for(const p in players)
                                playersArr.push(p)

                            setInLocal('players', playersArr)
                        }

                        this.$router.push(this.startGameRoute)
                    }
                })
            }
        },
        async checkForActiveLobby() {
            const lobby = getFromLocal('gameCode')
            if(!lobby) return

            const check = await dbReadOnce(gameCodeString())

            if(check) {
                continueIntoStartedGame(check)
            }
        },
        cancel() {
            dbUpdate(`games/${this.gameCode}`, { playerCount: this.playerCount = this.playerCount - 1 })
            dbWrite(`players/${this.gameCode}`, null)
            dbRemoveListener(gameCodeString())
            clearLocal()
            this.isJoined = false
        }
    },
    mounted() {
        this.checkForActiveLobby()
    },
    watch: {
        gameCode(value) {
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

<style>

</style>