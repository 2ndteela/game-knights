import io from 'socket.io-client';
import { getFromLocal, setInLocal } from './utilities.js'

let socket = null


const APIUrl = () => {
    return 'http://localhost:4000/'
}

export const connect = () => {

    if(!socket) {
        socket = io(APIUrl())
        socket.on('connection', resp => {
            console.log('got it!')
            console.log(resp)
            setInLocal('connected', true)
            setInLocal('socketId', resp.data)
        })
    }
}

export const getSocket = () => {
    return socket
}