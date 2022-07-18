<template>
    <div  id="quick-message-body" class="primary" :style="`left: ${x}vw; top: ${y}vh`">{{text}}</div>
</template>

<script>
export default {
    name: 'QuickMessage',
    props: ['text'],
    data() {
        return {
            x: '',
            y: '',
            show: false
        }
    },
    mounted() {
        this.x = Math.floor(Math.random() * 80) 
        this.y = Math.floor(Math.random() * 90) 
    },
    watch: {
        text(newVal, oldVal) {
            if(newVal === '') {
                this.show = false
            }

            else {
                this.show = true
            }
        }
    }
}
</script>

<style>
    #quick-message-body {
        padding: 8px 24px;
        border-radius: 24px;
        position: fixed;
    }
</style>