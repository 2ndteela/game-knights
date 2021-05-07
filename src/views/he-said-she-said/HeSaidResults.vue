<script>
import ResultsHider from '../../components/ResultsHider.vue'

export default {
    name: 'HeSaidResults',
    components: {ResultsHider},
    data() {    
        return {
            results: [
                'Geoff',
                'Laney',
                'the Walmart parking lot',
                'Throwing rocks at the protestors',
                'Give me the formula Crabs!',
                'No Whiskey for me',
                'Dinklebeeeeerg',
                'Not in this economy!',
                'Never start a land war in Asia',
                'YOLO'
            ],
            intros: [
                'Our tale begins like many others...',
                'Once upon a time...',
                'So, this one time...',
                "Y'all ain't gonna believe this but,",
                'Shut your pie and listen up,'
            ],
            blurArray: [0,0,0,0,0,0,0,0],
            lastShown: 0
        }
    },
    computed: {
        randomIntro() {
            return this.intros[Math.floor(Math.random() * this.intros.length)]
        }
    },
    methods: {
        showNext() {
            this.blurArray[this.lastShown] = 1
            this.lastShown++
        }
    }
}
</script>

<template>
    <v-layout column align-center style="padding: 16px">
        <h3 style="width: 100%; text-align: left">{{ randomIntro }}</h3>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[0]">
            <div> <span class="accent--text"> {{results[0]}} </span> and <span class="accent--text"> {{results[1]}} </span> </div>
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[1]">
            <div> Were at <span class="accent--text"> {{results[2]}},  {{results[3]}}</span> </div>
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[2]">
            <div> When <span class="accent--text"> {{results[0]}} </span> says <span class="accent--text"> "{{results[4]}}" </span> </div>
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[3]">
            <div> And <span class="accent--text"> {{results[1]}} </span> responds <span class="accent--text"> "{{results[5]}}" </span> </div>
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[4]">
            <div> <span class="accent--text"> {{results[0]}} </span> then says <span class="accent--text"> "{{results[6]}}" </span> </div>
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[5]">
            <div> So <span class="accent--text"> {{results[1]}} </span> says <span class="accent--text"> "{{results[7]}}" </span> </div>
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[6]">
            <div> Moral of the story is <span class="accent--text"> {{results[8]}} </span></div>    
        </results-hider>
        <div class="line-break"></div>

        <results-hider :reveal="blurArray[7]">

            <div v-if="results[9].includes('#')" ><span class="accent--text"> {{results[9]}} </span></div>

            <div v-else>#<span class="accent--text">{{results[9]}}</span> </div>
        </results-hider>
        <div class="line-break"></div>

        <v-btn v-if="lastShown < this.blurArray.length"  @click="showNext()" style="position: fixed; bottom: 24px; width: 92%"  >Go On...</v-btn>
    </v-layout>
</template>

<style scoped>
    .line-break {
        height: 12px;
    }
</style>