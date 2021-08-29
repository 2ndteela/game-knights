
<script>
import { generateCode, setInLocal, getFromLocal, clearLocal } from '../../assets/utilities.js'
import { dbRemoveListener, dbListen, dbReadOnce, dbUpdate, dbWrite } from '../../assets/services.js'
import messageDialog from '../../components/MessageDialog.vue'

export default {
    name: 'AnswerNewGame',
    components: { messageDialog },
    data() {
        return {
            lobbyCode: '',
            playerCount: 0,
            pointsToWin: 5,
            screenName: '',
            showMessage: false,
            messageBody: '',
            messageHeader: ''
        }
    },
    methods: {
        async openNewLobby() {
            let gameCheck = await dbReadOnce(`/games/${this.lobbyCode}`)
            while (gameCheck) {
                this.lobbyCode = generateCode()
                gameCheck = await dbReadOnce(`/games/${this.lobbyCode}`)
            }

            dbWrite(`/games/${this.lobbyCode}`, {
                type: 'Answer Is',
                playerCount: 1,
                state: 'lobby'
            })

            dbListen(`/games/${this.lobbyCode}`, (snap) => {
                const data = snap.val()
                this.playerCount = data.playerCount
            })
        },
        async startGame() {
            try {
                const name = this.screenName.trim()
                const nameCheck = await dbReadOnce(`/players/${this.lobbyCode}/${name}`)
                if(!!nameCheck) {
                    this.messageBody = 'Someone already has that name in this lobby. You\'re gonna need a new one.'
                    this.messageHeader = 'Same name... Awkward...'
                    this.showMessage = true
                }
                else {
                    await dbUpdate(`/players/${this.lobbyCode}/${name}`, {score: 0} )
                    const names = await dbReadOnce(`players/${this.lobbyCode}`)
                    const nameList = []

                    for(const n in names)
                        nameList.push(n)

                    const toSend = {
                        state: 'started',
                        submissions: 0,
                        pointsToWin: this.pointsToWin,
                        currentQuestioner: nameList[Math.floor(Math.random() * this.playerCount)],
                        order: nameList.join('-')
                    }
                    console.log(toSend)
                    await dbUpdate(`/games/${this.lobbyCode}`, toSend )

                    dbRemoveListener(`games/${this.gameCode}`)

                    setInLocal('gameCode', this.lobbyCode)
                    setInLocal('playerCount', this.playerCount)
                    setInLocal('playerId', name)

                    this.$router.push('/answer-question')
                }
            }
            catch(err) {
                console.error(err)
            }
            
        },
        cancel() {
            dbWrite(`/games/${this.lobbyCode}`, null)
            clearLocal()
            this.$router.push('/answer-home')
        }
    },
    mounted() {
        let code = getFromLocal('gameCode')
        if (!code) code = generateCode()

        this.lobbyCode = code

        this.openNewLobby()
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px" justify-center align-center column>
        <div style="padding-bottom: 16px">
            <div>Friends in lobby: {{playerCount}}</div>
            <div style="font-size: 24px; padding-top: 24px">Game Code:</div> 
            <h1 class="accent--text" style="text-align: center">{{lobbyCode}}</h1>
        </div>
        <div style="width: 100%">
            <v-text-field
                outlined
                label="Screen Name"
                v-model="screenName"
            ></v-text-field>
        </div>
        <div style="width: 100%">
            <v-text-field
                outlined
                label="Points To Win"
                v-model="pointsToWin"
            ></v-text-field>
        </div>
        <div>
            <v-btn style="margin-right: 8px" @click="cancel">Cancel</v-btn>
            <v-btn color="primary" @click="startGame">Everybody's in!</v-btn>
        </div>
        <message-dialog
            v-model="showMessage"
            :body="messageBody"
            :header="messageHeader"
        ></message-dialog>
    </v-layout>
</template>