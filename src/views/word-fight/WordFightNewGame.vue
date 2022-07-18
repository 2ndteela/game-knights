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

<script>
import MessageDialog from '../../components/MessageDialog.vue'
import { generateCode, getFromLocal } from '../../assets/utilities'
import {dbListen, dbWrite, dbReadOnce, dbRemoveListener, dbUpdate } from '../../assets/services'

export default {
    name: 'WordFightNewGame',
    components: { MessageDialog },
    data() {
        return {
            messageBody: '',
            messageHeader: '',
            showMessage: false,
            screenName: '',
            playerCount: 1,
            lobbyCode: ''
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
                type: 'Word Fight',
                playerCount: 1,
                state: 'lobby'
            })

            dbListen(`/games/${this.lobbyCode}`, (snap) => {
                const data = snap.val()
                this.playerCount = data.playerCount
            })
        },
        async startGame() {

            if(this.playerCount === 1) {
                this.messageBody = "Looks like no one is in the game yet. And you can't really play this game alone."
                this.messageHeader = 'Awkward...' 
                this.showMessage = true
                return
            }

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
                        submissions: 0
                    }
                    await dbUpdate(`/games/${this.lobbyCode}`, toSend )

                    dbRemoveListener(`games/${this.gameCode}`)

                    setInLocal('gameCode', this.lobbyCode)
                    setInLocal('playerCount', this.playerCount)
                    setInLocal('playerId', name)

                    this.$router.push('/word-create')
                }
            }
            catch(err) {
                console.error(err)
            }
            
        },
        cancel() {
            dbWrite(`/games/${this.lobbyCode}`, null)
            clearLocal()
            this.$router.push('/word-home')
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

<style>

</style>