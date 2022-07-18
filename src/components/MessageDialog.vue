<template>
    <v-dialog
        v-model="showSelf"
        persistent
    >
        <v-card>
            <v-card-title>{{header}}</v-card-title>
            <v-card-text>
                {{body}}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="hideDialog">Okay</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'MessageDialog',
    props: ['value', 'header', 'body', 'callback'],
    data() {
        return {
            showSelf: false
        }
    },
    watch: {
        value(newVal) {
            if(newVal)
                this.showSelf = true

            else 
                this.showSelf = false
        }
    },
    methods: {
        hideDialog() {
            if(this.callback)
                this.callback()
                
            this.$emit('input', false)
        }
    }
}
</script>

<style>

</style>