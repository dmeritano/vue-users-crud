import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import moduleUsers from './modules/users'

function initialState () {
    return {
      authenticated:false,
      loggedInUser: "",
      isLoading:false,
      version: require('../../package.json').version
    }
  }

export const store = createStore({
    state:initialState(),
    getters:{
        authenticated(state){
            return state.authenticated
        },
        isLoading(state){
            return state.isLoading
        },
        user(state){
            return state.loggedInUser
        },
        version(state){
            return state.version
        }
    },
    mutations:{
        setAuthenticatedStatus:(state, payload) => {
            state.authenticated = payload.status
        },
        setLoggedUser:(state, payload) => {
            state.loggedInUser = payload.userData.user
        },
        isLoading(state, payload){
            state.isLoading = payload.status
        },
        resetState(state){
            const s = initialState()
            Object.keys(s).forEach(key => {
              state[key] = s[key]
            })             
        }
    },
    actions:{
        isLoading(context, value){
            context.commit("isLoading", value)
        }
    },
    modules:{
        moduleUsers
    },
    plugins:[
        new VuexPersistence({
            storage: window.localStorage
        }).plugin
    ]
})

