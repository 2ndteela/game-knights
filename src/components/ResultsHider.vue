<script>
export default {
    name: 'ResultsHider',
    props: ['text', 'reveal']
}
</script>

<template>
  <div class="hider-container" >
      <div :class="{'hider-screen': true, 'reveal-text': this.reveal}"></div>
      <slot></slot>
  </div>
</template>

<style scoped>
    .hider-container {
        position: relative;
        width: 100%;
    }

    .hider-screen {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #333;
        opacity: 1;
        transition: 1s;
    }

    .reveal-text {
        opacity: 0 !important;
    }
</style>