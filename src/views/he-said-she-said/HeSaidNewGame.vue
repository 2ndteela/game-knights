<script>
import { generateCode, setInLocal } from '../../assets/utilities.js'

export default {
    name: 'HeSaidNewGame',
    data() {
        return {
            lobbyCode: ''
        }
    },
    methods: {
        startGame() {
            setInLocal('currentRound', 0)

            this.$router.push('/he-said-lobby')
        }
    },
    mounted() {
        const code = generateCode()
        this.lobbyCode = code

        setInLocal('isHost', true)
        setInLocal('game', 'He Said She Said')
        setInLocal('gameCode', code)
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px" justify-center align-center column>
        <div column style="padding-bottom: 36px">
            <div>Friends in lobby: 5</div>
            <div style="font-size: 24px; padding-top: 24    px">Game Code:</div> 
            <h1 class="accent--text" style="text-align: center">{{lobbyCode}}</h1>
        </div>
        <v-btn color="primary" @click="startGame">Everybody's in!</v-btn>
    </v-layout>
</template>

<style>

</style>