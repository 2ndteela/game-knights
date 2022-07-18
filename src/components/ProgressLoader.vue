<template>
  <div id="progress-container">
      <v-progress-circular style="z-index: 15" size="220" color="primary" :value="percent" :width="15" ></v-progress-circular>
      <div id="progress-numbers">
          <div id="progress-current">{{this.current}}</div>
          <div id="progress-slash" ></div>
          <div id="progress-total" >{{this.total}}</div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'ProgressLoader',
    props: ['total', 'current'],
    computed: {
        percent() {
            return Math.floor((this.current / this.total) * 100)
        }
    }
}
</script>

<style>
    #progress-container {
        position: relative;
    }

    #progress-numbers * {
        position: absolute;
        font-size: 56px;
        opacity: .4;
    }

    #progress-current {
        top: 42px;
        left: 28px;
        width: 74px;
        text-align: right;
    }

    #progress-slash {
        top: 36px;
        left: 108px;
        height: 140px;
        width: 8px;
        background-color: white;
        transform: rotate(34deg);
    }

    #progress-total {
        top: 96px;
        left: 118px;
        width: 74px;
        text-align: left;
    }
</style>