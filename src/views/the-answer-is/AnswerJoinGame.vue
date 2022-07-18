<script>
import JoinGame from '../../components/JoinGame.vue'
export default {
    name: 'AnswerJoin',
    components: { JoinGame },
    data: () =>({
        gameExplaination: 'The Answer Is... is a game all about twisting your friends words. ' +
        'One player is going to be assigned to come up with an answer. From there, the rest of you are going to come up '+
        'questions that make that answer seem wild. From there, the answer writer will pick their favorite question ' + 
        'kind of like Cards Against Humanity or Apples to Apples.'
    })
}
</script>

<template>
    <join-game gameType="AnswerIs" />
</template>