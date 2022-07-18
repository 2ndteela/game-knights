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

<script>
import MessageDialog from '../../components/MessageDialog.vue'
import InfoButton from '../../components/InfoButton.vue'
import { setInLocal, getFromLocal, clearLocal, gameCodeString } from '../../assets/utilities'
import { dbUpdate, dbReadOnce, dbListen, dbRemoveListener } from '../../assets/services'

export default {
    
    name: 'WordFightJoin',
    data() {
        return {}
    },
    components: { MessageDialog, InfoButton },
    data() {
        return {
            gameCode: '',
            screenName: '',
            isJoined: false,
            playerCount: 0,
            messageDailog: false,
            messageHeader: '',
            messageBody:'',
            infoMessage: 'Word Fight is like Worlde... But you have to compete with your friends! ' +
            'Everyone is going to come up with a REAL 5 letter word. From there the game will cycle '+
            'through every word everyone submitted trying to guess it. Getting it right in less time will mean more points. ' + 
            'Winner is going to be who ever is quickest, or luckiest!'
        }
    },
}
</script>

<style>

</style>