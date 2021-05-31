<script>

import { setInLocal, getFromLocal } from '../../assets/utilities.js'
import { connect, getSocket } from '../../assets/services.js'

export default {
    name: 'HeSaidJoinGame',
    data() {
        return {
            gameCode: '',
            isJoined: false,
            playerCount: 0,
            playerName: ''
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
            getSocket().emit('check-open-lobby', lobby)
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

        getSocket().on('he-said-checked', resp => {
            if(resp.status === 200) {

                if(resp.data.GameStatusId === 2) {
                    setInLocal('currentRound', resp.data.CurrentRound)
                    this.$router.push('/he-said-lobby')
                }

                else if (resp.data.GameStatusId === 3) {
                    this.$router.push('/he-said-results')
                }
            }
        })
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px" justify-center align-center column >
        <v-flex style="width: 100%">
            <v-layout column justify-end fill-height>
                <div style="padding-bottom: 16px">
                    <v-text-field
                        outlined
                        label="What's your name?"
                        v-model="playerName"
                        hide-details
                        color="accent"
                    ></v-text-field>
                </div>
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
        <v-flex style="padding-top: 16px; width: 100%">
            <v-layout justify-end align-end>
                <v-btn @click="joinGame" color="primary">Join</v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<style>

</style>