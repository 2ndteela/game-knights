<template>
    <div style="position: relative">
        <v-progress-circular :value="percent" color="accent" ></v-progress-circular>
        <div style="position: absolute; top: 6px; font-size: 14px; width: 100%; text-align: center">{{count === -1 ? 0 : count}}</div>
    </div>
</template>

<script>
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

    },
    watch: {
        count(val) {
            this.percent = Math.floor( (val / this.start ) * 100 )
        }
    },
    mounted() {
        if(!!this.start) {
            this.count = this.start
            this.interval = setInterval(async () => {
                if(this.count > 0) {
                    this.count--
                }
                else {
                    clearInterval(this.interval)
                    this.callback()
                }              
           }, 1000)
        }
    }
}
</script>

<style>

</style>