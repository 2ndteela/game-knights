<template>
  <v-layout style="width: 100%; padding: 16px; height: 100%" column justify-center align-center>
        <div style="width: 100%" v-if="!submitted">
            <v-layout style="padding-bottom: 16px" align-center> 
                <count-down :start="45" :callback="forceAnswer"></count-down>
                <!-- add info blurb  -->
                <div style="padding-left: 8px">What is the answer?</div> 
            </v-layout>
            <v-textarea
            v-model="response"
            hide-details
            outlined 
            style="width: 100%"></v-textarea>
            <v-layout style="width: 100%; padding-top: 16px" justify-end>
                <v-btn style="margin-right: 8px" @click="createRandomQuestion" >Help Me Out</v-btn>
                <v-btn color="primary" @click="submitResponse" >Submit</v-btn>
            </v-layout>
        </div>
        <v-layout column v-else-if="submitted && pick" style="width: 100%">
            <div id="answer-prompt">
                <div>The Answer is:</div>
                <h3>{{response}}</h3>
                <div>What's the question?</div>
            </div>

            <div 
                v-for="(q, itr) in questionsList" 
                :key="itr + '-q'" 
                class="big-button"
                width="100%"
                :class="{'selected-question': q.selected}"
                @click="pickBestAnswer(itr)"
            >{{q.question}}</div>

            <div style="width: 92vw; position: fixed; bottom: 16px">
                <v-btn 
                    color="primary" 
                    style="width: 100%" 
                    :disabled="this.pickedIdx === -1"
                    @click="submitPick"
                >Submit</v-btn>
            </div>

        </v-layout>
        <div v-else>
            <waiting-screen message="Your friends are working on their questions, just sit tight for a second." ></waiting-screen>
        </div>
  </v-layout>
</template> 

<script>

import WaitingScreen from '../../components/WaitingScreen.vue'
import CountDown from '../../components/CountDown.vue'
import { dbReadOnce, dbUpdate, dbListen, getAnswers, dbRemoveListener } from '../../assets/services'
import { gameCodeString, getFromLocal, playersString } from '../../assets/utilities'

export default {
    name: 'AnswerResponse',
    components: { WaitingScreen, CountDown },
    data() {
        return {
            response: '',
            rawQuestions: [],
            submitted: false,
            pick: false,
            pickedIdx: -1
        }
    },
    methods: {
        forceAnswer() {
            
            if(!this.response)
                this.createRandomQuestion()

            this.submitResponse()
        },
        createRandomQuestion() {
            const nouns = [
                {single: 'Idiot', plural: 'Idiots'},
                {single: 'Man', plural: 'Men'},
                {single: 'Jedi', plural: 'Jedi'},
                {single: 'Thespian', plural: 'Thespians'},
                {single: 'Drunkerd', plural: 'Drunkerds'},
                {single: 'Unicorn', plural: 'Unicorns'},
                {single: 'Baker', plural: 'Bakers'},
                {single: 'Flower', plural: 'Flowers'},
                {single: 'Elon Musk', plural: 'Elongated Muskrats'},
                {single: 'Utahn', plural: 'Utahns'},
                {single: 'Shifting Mass', plural: 'Shifting Masses'},
                {single: 'Shadow', plural: 'Shadows'},
                {single: 'Pokemon', plural: 'Pokemon'},
                {single: 'Lover', plural: 'Lovers'},
                {single: 'Streamer', plural: 'Streamers'},
                {single: 'Infulancer', plural: 'Influancers'},
                {single: 'Vegan', plural: 'Vegans'},
                {single: 'Crossfitter', plural: 'Crossfitters'},
                {single: 'Friend', plural: 'Friends'},
                {single: 'Otter', plural: 'Otters'},
                {single: 'Dwayne The Rock Johnson', plural: 'Dwayne The Rock Johnson-s'},
                {single: 'Jock', plural: 'Jocks'},
                {single: 'Sock', plural: 'Socks'},
                {single: 'Ninja', plural: 'Ninjas'},
                {single: 'Cow', plural: 'Cows'},
                {single: 'RomCom', plural: 'RomComs'},
                {single: 'Doggo', plural: 'Doggos'},
                {single: 'Pupper', plural: 'Puppers'},
                {single: 'Flooy Woofer', plural: 'Floofy Woofers'},
            ]

            const adjs = [
                'Shady', 'Weird', 'Sketched Out', 'Stinky', 'Broken', 'Questionable', 
                'Cowerdly', 'Heinus', 'Ugly', 'Sexy', 'Green', 'Yellow-Bellied', 'Sad',
                'Drunken', 'High', 'Effeminate', 'Ephemeral', 'Initangible', 'Hawty',
                'Mighty', 'Alluring', 'Heat-Packing', 'Murderous', 'Flying', 'Absolutely Jacked',
                'Utterly Shredded', 'Violated', 'Crusty', 'Hidden', 'Disgusting', 'Scholarly',
                'Twerking', 'Vlogging', 'Gamer', 'Distracted', 'Sanitized', 'Milky', 
                'Scadalous', 'Punk Rock', 'Shaved', 'Crafty', 'Seemingly Normal'
            ]

            const amounts = [
                'A Solitary', 'A Single', 'One', 'A Lone', 'A Couple', 'A Group of', 
                'A bunch of', 'A Butt-load of', 'An Innumberal horde of', 'Thousands of',
                'An Unending Line of', 'A Heap of' 
            ]

            const noun = nouns[Math.floor(Math.random() * nouns.length)]
            const adj = adjs[Math.floor(Math.random() * adjs.length)]

            const amountIdx = Math.floor(Math.random() * amounts.length)

            const amount = amounts[amountIdx]

            this.response = `${amount} ${adj} ${ amountIdx < 4 ? noun.single : noun.plural}`
        },

        async submitResponse() {
            if(!this.response)
                return 

            await dbUpdate(gameCodeString(), {response: this.response, state: 'answered'})
            this.submitted = true

            dbListen(gameCodeString(), async snap => {
                // console.log('fired from SubmitResponse in AnswerResponse')
                const data = snap.val()

                if(data.submissions === data.playerCount - 1) {
                    await dbUpdate(gameCodeString(), {submissions: 0, state: 'picking'})
                    this.pick = true
                }
            })
        },
        pickBestAnswer(idx) {
            this.pickedIdx = idx
        },
        showQuestions() {
            const arr = [...this.rawQuestions]
            this.questions = arr
            this.pick = true
        },
        async submitPick() {
            const picked = this.rawQuestions[this.pickedIdx]
            const player = picked.player
            const playerData = await dbReadOnce(playersString(player))
            
            await dbUpdate(playersString(player), {score: playerData.score + 1})
            await dbUpdate(gameCodeString(), { state: 'standings' })
            this.$router.push('/answer-leader-board')

        },
        async syncGame() {
            const gameData = await dbReadOnce(gameCodeString())

            if(gameData.state === 'answering') {
                this.submitted = false
                this.pick = false
            }
            else if (gameData.state === 'answered') {
                this.submitted = true
                this.pick = false
            }
            else if (gameData.state === 'picking') {
                this.submitted = true
                this.pick = true
            }
            else if (gameData.state === 'standings') {
                this.$router.push('/answer-leader-board')
            }
            else {
                this.submitted = false
                this.pick = false
                await dbUpdate(gameCodeString(), {state: 'answering'})
            }
        }
    },
    mounted() {
        this.syncGame()
        dbUpdate(playersString(getFromLocal('playerId')), {question: null})
    },
    destroyed() {
        dbRemoveListener(gameCodeString())
    },
    computed: {
        questionsList() {
            const newArr = []

            this.rawQuestions.forEach((item, itr) => {
                const cpy = {...item}
                if(itr === this.pickedIdx)
                    cpy.selected = true

                newArr.push(cpy)
            })

            return newArr
        }
    },
    watch: {
        pick: async function(newVal) {
            if(newVal) {
                const answerList = await getAnswers()
                this.rawQuestions = answerList
            }
        }
    }
}
</script>

<style>
    .big-button {
        margin-bottom: 8px; 
        background-color: #222;
        text-align: center;
        padding: 8px 16px;
        border-radius: 4px;
        border: 3px solid #222;
        transition: .2s;

    }
    #answer-prompt {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 0px;
    }
    .selected-question {
        border-color: #01579B;
    }
</style>