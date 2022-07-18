<template>
    <div style="position: relative; width: 32px">
        <v-progress-circular :value="percent" :color="percent > 25 ? 'accent': 'error'" ></v-progress-circular>
        <div style="position: absolute; top: 8px; font-size: 12px; width: 100%; text-align: center">{{count === -1 ? 0 : count}}</div>
    </div>
</template>

<script>
import { setInLocal, getFromLocal } from '../assets/utilities.js'

export default {
    name: 'CountDown',
    props: ['start', 'callback', 'size'],
    data() {
        return {
            count: -1,
            interval: null,
            percent: 100
        }
    },
    methods: {
        setTimer() {
            const s = parseInt(getFromLocal('currentCount'))

            if(s < this.start && s > 0)
                this.count = s

            else if(!!this.start) {
                this.count = this.start
                setInLocal('canReset', 'false')
                setInLocal('currentCount', this.start)
            }

            this.interval = setInterval(async () => {
                if(this.count > 0) {
                    this.count--
                    setInLocal('currentCount', this.count)
                }
                else {
                    clearInterval(this.interval)
                    setInLocal('canReset', 'true')
                    setInLocal('currentCount', -1)
                    this.callback()
                }              
            }, 1000)
        }
    },
    watch: {
        count(val) {
            this.percent = Math.floor( (val / this.start ) * 100 )
        }
    },
    mounted() {
        this.setTimer()
    },
    destroyed() {
        setInLocal('canReset', 'true')
    }
}
</script>

<style>

</style>