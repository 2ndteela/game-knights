import { getFromLocal, setInLocal } from './utilities.js'
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