<template>
  <v-layout style="width: 100%; padding: 16px; height: 100%" column justify-center align-center>
        <div style="width: 100%" v-if="!submitted">
            <div style="padding-bottom: 16px">What is the answer?</div>
            <v-textarea
            v-model="response"
            hide-details
            outlined 
            style="width: 100%"></v-textarea>
            <v-layout style="width: 100%; padding-top: 16px" justify-end>
                <v-btn color="primary" @click="submitResponse" >Submit</v-btn>
            </v-layout>
        </div>
        <v-layout column v-else-if="submitted && pick" style="width: 100%">
            <div id="answer-prompt">
                <div>The Answer is:</div>
                <h3>{{response}}</h3>
                <div>What's the question?</div>
            </div>

            <div 
                v-for="(q, itr) in questions" 
                :key="itr + '-q'" 
                class="big-button"
                width="100%"
                :class="{'selected-question': q.selected}"
                @click="pickBestAnswer(itr)"
                >{{q.question}}</div>
            <div>{{rawQuestions}}</div>
        </v-layout>
        <div v-else>
            <waiting-screen message="Your friends are working on their questions, just sit tight for a second." ></waiting-screen>
            <v-btn @click="showQuestions">Next</v-btn>
        </div>
  </v-layout>
</template> 

<script>

import WaitingScreen from '../../components/WaitingScreen.vue'

export default {
    name: 'AnswerResponse',
    components: { WaitingScreen },
    data() {
        return {
            response: '',
            questions: [],
            rawQuestions: [
                { player: 'Jerm', question: 'How old are you?'}, 
                { player: 'Kylo', question: 'What are the odds?'}, 
                { player: 'Daddo', question: 'huh?'},
                { player: 'Rando', question: 'Really long question text to test how a multi-line button is finna look'}
            ],
            submitted: true,
            pick: true
        }
    },
    methods: {
        submitResponse() {
            this.submitted = true
        },
        pickBestAnswer(itr) {
            const qs = [...this.rawQuestions]
            qs[itr].selected = true

            this.questions = qs
        },
        showQuestions() {
            const arr = [...this.rawQuestions]
            this.questions = arr
            this.pick = true
        }
    },
    mounted() {
        this.showQuestions()
    }
}
</script>

<style>
    .big-button {
        margin-bottom: 8px; 
        background-color: #222;
        text-align: center;
        padding: 8px 16px;
        border-radius: 4px;
        border: 3px solid #222;
        transition: .2s;

    }
    #answer-prompt {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 0px;
    }
    .selected-question {
        border-color: #01579B;
    }
</style>