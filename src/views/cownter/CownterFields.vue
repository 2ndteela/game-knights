<template>
  
</template>

<script>
export default {
    name: 'CowtnerField',
    data: () => ({
        myCows: 0
    }),
    methods: {
        marryCows() {
            console.log('married cows')
        },
        addCows() {
            console.log('adding cows')
        },
        showAddCowsDialog() {
            console.log('show add cows')
        },
        killCows() {
            console.log('killing cows')
        }
    }
}
</script>

<style>

</style>