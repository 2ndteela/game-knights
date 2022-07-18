<script>
import InfoButton from '../../components/InfoButton.vue'
import MessageDialog from '../../components/MessageDialog.vue'

export default {
    name: 'CownterCreateGame',
    components: { InfoButton, MessageDialog },
    data: () => ({
        playerCount: 1,
        screenName: '',
        gameCode: '',
        isJoined: false,
        infoMessage: 'Ever shout "COWS" on a road trip? Ever want to see who is the supiror bovine dectector? '
        + 'Well, now you can! Join up this game to keep track or your own herd and see how your friends are doing too! ',
        messageBody: '',
        messageHeader: '',
        messageDialog: false
    }),
    methods: {
        async joinGame() {
            const name = this.screenName.trim()
            const gameCode = this.gameCode.trim()
            const check = await dbReadOnce(`games/${gameCode}`)
            const nameCheck = await dbReadOnce(`/players/${gameCode}/${name}`)
            if(!check) {
                this.messageHeader = 'No Dice'
                this.messageBody = 'No game with the code: ' + gameCode + ' exsits'
                this.messageDialog = true
            }

            else if(!!nameCheck) {
                this.messageHeader = 'Same name... Awkward...'
                this.messageBody = 'Sorry, someone else already has that name in this game. You\'re gonna need a new one.'
                this.messageDialog = true
            }
            else {
                await dbUpdate(`games/${gameCode}`, { playerCount: check.playerCount + 1 })
                await dbUpdate(`players/${gameCode}/${name}`, {cows: 0})
                setInLocal('gameCode', gameCode)
                setInLocal('playerId', name)
                this.isJoined = true

                dbListen(`games/${gameCode}`, async snap => {
                    const data = snap.val()

                    this.playerCount = data.playerCount

                    if(data.state === 'started') {
                        dbRemoveListener(`games/${gameCode}`)

                        const players = await dbReadOnce(`players/${this.gameCode}`)
                        const playersArr = []
                        for(const p in players)
                            playersArr.push(p)

                        setInLocal('players', playersArr)

                        this.$router.push('/cownter-field')
                    }
                })
            }
        },
        },
        cancel() {
            this.isJoined = false
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
                <v-btn @click="joinGame" color="primary" :disabled="gameCode === '' || screenName === ''" >Join</v-btn>
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
            v-model="messageDialog"
            :body="messageBody"
            :header="messageHeader"
        ></message-dialog>
    </v-layout>
</template>

<style>

</style>