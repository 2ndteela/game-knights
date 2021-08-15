<script>
import { generateCode, setInLocal, getFromLocal, clearLocal } from '../../assets/utilities.js'
import { dbRemoveListener, dbListen, dbReadOnce, dbUpdate, dbWrite } from '../../assets/services.js'

export default {
    name: 'HeSaidNewGame',
    data() {
        return {
            lobbyCode: '',
            playerCount: 0
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
                type: 'He Said She Said',
                playerCount: 1,
                state: 'lobby'
            })

            dbListen(`/games/${this.lobbyCode}`, (snap) => {
                const data = snap.val()
                this.playerCount = data.playerCount
            })

            setInLocal('playerId', 0)
        },
        async startGame() {
            try {
                const toSend = {
                    state: 'started',
                    currentRound: 0,
                    submissions: 0
                }
                await dbUpdate(`/games/${this.lobbyCode}`, toSend )

                const stories = {}

                for(let i = 0; i < this.playerCount; i++) stories[i] = {}

                await dbWrite(`/stories/${this.lobbyCode}`, stories)
                dbRemoveListener(`games/${this.gameCode}`)

                setInLocal('gameCode', this.lobbyCode)
                setInLocal('currentRound', 0)
                setInLocal('playerCount', this.playerCount)

                this.$router.push('/he-said-lobby')
            }
            catch(err) {
                console.error(err)
            }
            
        },
        cancel() {
            dbWrite(`/games/${this.lobbyCode}`, null)
            clearLocal()
            this.$router.push('/he-said-home')
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
        <div style="padding-bottom: 36px">
            <div>Friends in lobby: {{playerCount}}</div>
            <div style="font-size: 24px; padding-top: 24    px">Game Code:</div> 
            <h1 class="accent--text" style="text-align: center">{{lobbyCode}}</h1>
        </div>
        <div>
            <v-btn style="margin-right: 16px" @click="cancel">Cancel</v-btn>
            <v-btn color="primary" @click="startGame">Everybody's in!</v-btn>
        </div>
    </v-layout>
</template>

<style>

</style>