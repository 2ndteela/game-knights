<template>
  <v-layout column style="width: 100%; height: 100%; padding: 16px">
      <v-layout column style="width: 100%; height: 100%;" v-if="winner === null">
        <div>
            <v-layout justify-space-between align-center style="border-bottom: 1px solid white; margin-bottom: 8px">
                <h2 >Leader Board</h2>
                <div>Play to: {{max}}</div>
            </v-layout>
        </div>
        <div id="leader-board-container">
                <div 
                    class="leader-board-row"  
                    v-for="(p, j) in sortedPlayers" 
                    :key="p.name + '-' + j"
                    >     
                    <div class="leader-board-bar" :style="`width: ${((p.score / max) * 150) + 100}px`">
                        <div style="max-width: 92px">{{p.name}}</div>
                    </div>
                    <div style="padding-left: 8px">{{p.score}}</div>
                </div>
        </div>
        <div class="next-round">
            <v-btn @click="nextRound" style="width: 87%" color="primary" >Next Round</v-btn>
            <count-down :start="10" :callback="nextRound" ></count-down>
        </div>
      </v-layout>
      <v-layout v-else style="height: 100%; width: 100%" column justify-center align-center >
          <h1>{{winner.name}} Wins!!!</h1>
          <div>Hit the home icon to end the game</div>
      </v-layout>
  </v-layout>
</template>

<script>
import { dbReadOnce, dbUpdate, getNextPlayer, getPlayerScores } from '../../assets/services'
import { gameCodeString, getFromLocal, playersString } from '../../assets/utilities'
import CountDown from '../../components/CountDown.vue'
export default {
    name: 'AnswerLeaderBoard',
    components: {CountDown},
    data() {
        return { 
            max: 3,
            players: [],
        }
    },
    async mounted() {
        const gameData = await dbReadOnce(gameCodeString())
        const playerData = await getPlayerScores()

        this.max = gameData.pointsToWin
        this.players = playerData

        const me = getFromLocal('playerId')
        const currentQ = await dbReadOnce(gameCodeString('currentQuestioner'))

        if(me === currentQ) {
            const next = await getNextPlayer(me)

            try {

                await dbUpdate(gameCodeString(), {
                    currentQuestioner: next,
                    state: 'answering',
                    response: '',
                    submissions: 0
                })
            }
            catch (err) {
                console.error(err)
            }
        }
    },
    methods: {
        async nextRound() {
            this.$router.push('/answer-question')
        }
    },
    computed: {
        sortedPlayers() {
            const arr = this.players.sort((a,b) => {
                if (a.score < b.score) 
                    return 1

                else if (a.score > b.score)
                    return -1
                
                if(a.name < b.name) 
                    return 1
                
                return -1
            })

            return arr
        },
        winner() {
            let t = null

            this.players.forEach(p => {
                if(p.score >= this.max) {
                    t = p
                }
            })

            return t
        }   
    },
    watch: {
        winner(val) {
            if(val) {

                this.$confetti.update({
                    particlesPerFrame: 1,
                    particles: [
                        'circle', 'rect', 'heart'
                    ]
                })

                this.$confetti.start()
            }
        } 
    },
    destroyed() {
        this.$confetti.stop()
    }
}
</script>

<style>
    #leader-board-container {
        width: 90vw;    
        display: flex;
        position: relative;
        flex-direction: column;
    }

    .leader-board-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-bottom: 8px;
    }

    .leader-board-bar {
        min-width: 100px;
        background-color: #01579B;
        height: 36px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 8px;
    }

    .next-round {
        display: flex;
        position: fixed; 
        bottom: 16px; 
        width: 92%;
        justify-content: space-between;
        align-items: center;
    }
    

</style>