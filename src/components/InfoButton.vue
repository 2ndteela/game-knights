<template>
  <div id="info-button-container">
        <v-btn icon>
            <v-icon @click="toggleInfo">mdi-information-outline</v-icon>
        </v-btn>
        <v-slide-x-reverse-transition>
            <div id="info-card-text" v-if="show">
                <h2>{{header}}</h2> 
                <div>{{message}}</div>
                <div justify-end id="info-button-action">
                    <v-btn @click="toggleInfo" text color="accent">Got it</v-btn>
                </div>
            </div>
        </v-slide-x-reverse-transition>
  </div>
</template>

<script>
export default {
    name: 'InfoButton',
    props: ['message', 'header'],
    data() {
        return {
            show: false
        }
    },
    methods: {
        toggleInfo() {
            this.show = !this.show
        }
    }
}
</script>

<style>
    #info-button-container {
        position: fixed; 
        top: 68px; 
        right: 12px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        z-index: 50;
    }

    #info-card-text {
        max-width: calc(100vw - 32px);
        background-color: #232323;
        padding: 16px;
        border-radius: 4px;
        position: absolute;
    }

    #info-button-action {
        display: flex;
        justify-content: flex-end;
    }
</style>