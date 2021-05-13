<script>
import { generateCode, setInLocal } from '../../assets/utilities.js'
import { connect, getSocket } from '../../assets/services.js'

export default {
    name: 'HeSaidNewGame',
    data() {
        return {
            lobbyCode: '',
            playerCount: 0
        }
    },
    methods: {
        startGame() {
            getSocket().emit('start-he-said', this.lobbyCode)
        }
    },
    mounted() {
        const code = generateCode()
        this.lobbyCode = code

        connect()

        getSocket().emit('new-he-said', code)

        getSocket().on('game-created', data => {
            console.log('got back:')
            console.log(data)

            setInLocal('isHost', true)
            setInLocal('game', 'He Said She Said')
            setInLocal('gameCode', code)
        })

        getSocket().on('he-said-started', data => {
            if(data.status === 200) {
                setInLocal('gameStarted', true)
                this.$router.push('/he-said-lobby')
            }
        })

        getSocket().on('updated-player-count', resp => {
            if(resp.status === 200) {
                this.playerCount = resp.data
            }
        })
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px" justify-center align-center column>
        <div column style="padding-bottom: 36px">
            <div>Friends in lobby: {{playerCount}}</div>
            <div style="font-size: 24px; padding-top: 24    px">Game Code:</div> 
            <h1 class="accent--text" style="text-align: center">{{lobbyCode}}</h1>
        </div>
        <v-btn color="primary" @click="startGame">Everybody's in!</v-btn>
    </v-layout>
</template>

<style>

</style>