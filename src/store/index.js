import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import moduleUsers from './modules/users'

function initialState () {
    return {
      authenticated:false,
      isLoading:false
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
        }
    },
    mutations:{
        setAuthenticatedStatus:(state, payload) => {
            state.authenticated = payload.status
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
        },
        clearAll(context){
            context.commit("reset")
            context.commit("moduleUsers/reset")
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

