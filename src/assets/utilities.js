export const getLocalState = () => {
    try {
        const string = localStorage['state']
        return JSON.parse(string)
    }
    catch {
        localStorage['state'] = '{}'
        return {}
    }

}

export const getFromLocal = (attribute) => {
    const state = getLocalState()
    return state[attribute]
}

export const setInLocal = (attribute, value) => {
    const state = getLocalState()
    state[attribute] = value

    localStorage['state'] = JSON.stringify(state)
}

export const generateCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = ''

    for(let i = 0; i < 6; i++)
        code += letters[Math.floor(Math.random() * 26)]

    return code
}