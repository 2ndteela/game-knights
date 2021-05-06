<script>

import { setInLocal, getFromLocal } from '../../assets/utilities.js'

export default {
    name: 'HeSaidJoinGame',
    data() {
        return {
            gameCode: ''
        }
    },
    methods: {
        joinGame() {
            setInLocal('gameCode', this.gameCode)
            setInLocal('currentRound', 0)
            setInLocal('game', 'He Said She Said')

            this.$router.push('/he-said-lobby')
        },
        checkForActiveLobby() {
            const lobby = getFromLocal('gameCode')

            // if(!!lobby)
            //     this.$router.push('/he-said-lobby')
        }
    },
    mounted() {
        this.checkForActiveLobby()
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px" justify-center align-center column >
        <v-flex style="width: 100%">
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
        <v-flex style="padding-top: 8px; width: 100%">
            <v-layout justify-end align-end>
                <v-btn @click="joinGame" color="primary">Join</v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<style>

</style>