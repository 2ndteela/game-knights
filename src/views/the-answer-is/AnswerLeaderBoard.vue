<template>
  <v-layout column style="width: 100%; height: 100%; padding: 16px" align-end>
      <div id="leader-board-container">
            <div class="leader-board-labels">
                <div class="leader-board-player-name" v-for="p in players" :key="p.name" >
                    <span>{{p.name}}</span>
                </div>
            </div>
            <div class="leader-board-row" :class="{'bottom-row': i === 1}" v-for="i in max" :key="i + '-score'">
                <div class="row-header" >{{i}}</div>
                <div class="row-cell-container">
                    <div 
                        class="row-cell" 
                        v-for="(p, j) in players" 
                        :key="p.name + '-' + i + '-' + j" 
                        
                    >
                        <div :class="{'filled-cell' : i <= p.score}"></div>
                    </div>
                </div>
            </div>
      </div>
  </v-layout>
</template>

<script>
import { dbReadOnce, getPlayerScores } from '../../assets/services'
import { gameCodeString, getFromLocal, playersString } from '../../assets/utilities'
export default {
    name: 'AnswerLeaderBoard',
    data() {
        return { 
            max: 3,
            players: []
        }
    },
    async mounted() {
        const gameData = await dbReadOnce(gameCodeString())
        const playerData = await getPlayerScores()

        this.max = gameData.pointsToWin
        this.players = playerData
    },
    methods: {
        async nextRound() {
            const me = getFromLocal('playerId')
            const currentQ = await dbReadOnce(gameCodeString('currentQuestioner'))

            if(me === currentQ) {
                const players = await getPlayerScores()
            }
        }
    }
}
</script>

<style>
    #leader-board-container {
        height: 50vh;
        width: 90vw;    
        display: flex;
        flex-direction: column-reverse;
        position: relative;
    }

    .leader-board-labels {
        display: flex;
        padding-left: 16px;
        height: 84px;
        width: 100%;
        bottom: -112px;
    }

    .leader-board-player-name {
        display: flex;
        flex: 1 0 auto;
        align-items: flex-start ;
        justify-content: center;
        position: relative;
    }

    .leader-board-player-name span {
        transform: rotate(90deg);
        height: 84px;
        overflow: hidden;
        position: absolute;
    }

    .leader-board-row {
        display: flex;
        flex: 1 1 auto;
    }

    .bottom-row .row-cell-container {
        border-bottom: 1px solid grey;
    }

    .row-header {
        width: 24px;
    }

    .row-cell-container {
        width: calc(100% - 12px);
        border-left: 1px solid grey;
        display: flex;
    }

    .row-cell {
        display: flex;
        flex: 1 1 auto;
        height: 100%;
        box-sizing: border-box;
        padding: 0px 8px ;
    }

    .row-cell .filled-cell {
        background-color: #01579B !important;
        height: 100%;
        width: 100%;
    }
</style>