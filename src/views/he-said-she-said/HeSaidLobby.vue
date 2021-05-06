<script>
export default {
    name: 'HeSaidLobby',
    data() {
        return {
            questions: [
                {text: 'Write the name of a boy'},
                {text: 'Now the name of a girl'},
                {text: 'Where are they?' },
                {text: 'What are they doing?', area: true },
                {text: 'The boy starts the conversation, he says', area: true},
                {text: 'The girl responds', area: true},
                {text: 'Next, the boy says', area: true},
                {text: 'The girl then says', area: true},
                {text: "What's the moral of the story?", helpText: 'In the results screen whatever you write here will have "And so we see" before it.' },
                {text: 'Finally, give this all a hash tag'}
            ],
            started: true,
            qIdx: 0,
            userResponse: ''
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.qIdx]
        }
    }, 
    methods: {
        submit() {
            if(this.qIdx < this.questions.length - 1)
                this.qIdx++
            
            else this.$router.push('/he-said-results')
        }
    }
}
</script>

<template>
    <v-layout fill-height style="padding: 16px">
        <v-btn icon style="position: fixed; top: 68px; right: 12px" >
            <v-icon>mdi-information-outline</v-icon>
        </v-btn>
        <v-layout v-if="!started" justify-center align-center column>
            <h2 class="accent--text"     style="text-align: center; padding-bottom: 32px">Hold up, your friends are still joining...</h2>
            <div>If you have questions, hit the icon in the top right to learn about He Said She Said</div>
        </v-layout>
        <v-layout v-else justify-center align-center fill-height column style="width: 100%">
            <div style="width: 100%">
                <div style="padding-bottom: 4px">{{currentQuestion.text}}</div>
                
                <v-textarea 
                v-if="currentQuestion.area"
                outlined
                v-model="userResponse"
                hide-details
                ></v-textarea>

                <v-text-field
                v-else
                outlined
                v-model="userResponse"
                hide-details
                ></v-text-field>

                <v-btn color="primary" style="margin-top: 8px; width: 100%" @click="submit">Submit</v-btn>
            </div>
        </v-layout>

    </v-layout>
</template>

<style>

</style>