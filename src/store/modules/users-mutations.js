/* Users store mutations */

import { initialStateUsersStore } from './users-helpers'

export const error = (state, payload) => {
    state.error = payload.error
}

export const dmsInfo = (state, payload) => {
        state.dmsInfo = payload.meta
}

export const users = (state, payload) => {      
    state.users = payload
}

export const addUser = (state, payload) => {
    state.users.push(payload)
}

export const usersLoadedFromServer = (state, payload) => {
    state.usersLoadedFromServer = payload.status
}

export const updateUser = (state, payload) => {
    var found = state.users.find(function (item) {
        return item.user == payload.user;
    })
    if (found){
        var index = state.users.indexOf({user:payload.user})        
        found.name = payload.name
        found.surname = payload.surname
        state.users[index] = found
    }
}

export const deleteUser = (state, username) => {
    var found = state.users.find(function (item) {
        return item.user == username;
    })
    if (found){
        var index = state.users.map( (elem) => {return elem.user }).indexOf(username)
        state.users.splice(index,1)
    }
}

export const resetState = (state) => {
    const s = initialStateUsersStore()
    Object.keys(s).forEach(key => {
        state[key] = s[key]
    })      
}
