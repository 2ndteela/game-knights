import { gameCodeString, getFromLocal, playersString, setInLocal } from './utilities.js'
import firebase from './firebase.js'

export const dbWrite = async (path, data) => {
    try { 
        await firebase.database().ref(path).set(data)
        return true
    }
    catch(err) {
        throw err
    }
}

export const dbUpdate = async (path, data) => {
    try { 
        await firebase.database().ref(path).update(data)
        return true
    }
    catch(err) {
        throw err
    }
}

export const dbReadOnce = async path => {
    try {
        const promise = await firebase.database().ref(path).get()
        if(promise.exists()) 
            return promise.val()

        return false
    }
    catch (err) {
        throw err
    }
}

export const dbListen = (path, callback) => {
    try {
        const data = firebase.database().ref(path).on('value', callback)
        return data
    }
    catch(err) {
        throw err
    }
}

export const dbRemoveListener = path => {
    try {
        firebase.database().ref(path).off()
        return true
    }
    catch (err) {
        throw err
    }
}

export const getAnswers = async () => {
    try {
        const players = await dbReadOnce(playersString())
        const arr = []

        for(let p in players) {
            if(players[p].question)
                arr.push( {
                    player: p,
                    question: players[p].question 
                })
        }
        return arr
    }
    catch (err) {
        throw err
    }
}

export const getPlayerScores = async () => {
    try {
        const players = await dbReadOnce(playersString())
        const arr = []

        for(let p in players) {
            arr.push( {
                name: p,
                score: players[p].score 
            })
        }
        return arr
    }
    catch (err) {
        throw err
    }
} 

// Fix player picking order!!!!
export const getNextPlayer = async (player) => {
    let list = getFromLocal('playerOrder')

    if(list === undefined || !list) {
        list = await dbReadOnce(gameCodeString('order'))
        setInLocal('playerOrder', list)
    }

    const listSplit = list.split('-')
    const idx = listSplit.indexOf(player)

    if(idx === -1) 
        throw "ERROR: Player not found!"

    const next = (idx + 1) % listSplit.length
    return listSplit[next]
}