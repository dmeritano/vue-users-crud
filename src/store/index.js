import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import moduleUsers from './modules/users'

function initialState () {
    return {
      authenticated:false,
      loggedInUser: "",
      userProfile : {},
      loading:false,
      version: require('../../package.json').version,    
    }
  }

export const store = createStore({
    state:initialState(),
    getters:{
        authenticated(state){
            return state.authenticated
        },
        loading(state){
            return state.loading
        },
        user(state){
            return state.loggedInUser
        },
        version(state){
            return state.version
        },
        userProfile(state){
            return state.userProfile
        }
    },
    mutations:{
        authenticatedStatus:(state, payload) => {
            state.authenticated = payload.status
        },
        loggedUser:(state, payload) => {
            state.loggedInUser = payload.userData.user
        },
        userProfile:(state, payload) => {
            state.userProfile = payload.profile
        },
        loading(state, payload){
            state.loading = payload.status
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
            context.commit("loading", value)
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

