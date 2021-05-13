<script>

import { setInLocal, getFromLocal } from '../../assets/utilities.js'
import { connect, getSocket } from '../../assets/services.js'

export default {
    name: 'HeSaidJoinGame',
    data() {
        return {
            gameCode: '',
            isJoined: false,
            playerCount: 0
        }
    },
    methods: {
        joinGame() {

            const toSend = {
                client: getFromLocal('socketId'),
                lobbyCode: this.gameCode
            }

            getSocket().emit('join-he-said', toSend)
        },
        checkForActiveLobby() {
            const lobby = getFromLocal('gameCode')

            // if(!!lobby)
            //     this.$router.push('/he-said-lobby')
        }
    },
    mounted() {
        connect()
        this.checkForActiveLobby()

        getSocket().on('he-said-joined', resp => {
            if(resp.status === 200) {
                setInLocal('gameCode', this.gameCode)
                setInLocal('currentRound', 0)
                setInLocal('game', 'He Said She Said')
            }
            else console.error(resp)
        })

        getSocket().on('updated-player-count', resp => {
            if(resp.status === 200) {
                this.playerCount = resp.data
            }
        })

        getSocket().on('he-said-started', resp => {
            if(resp.status === 200) {
                this.$router.push('/he-said-lobby')
            }
        })
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