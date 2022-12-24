import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import moduleUsers from './modules/users'

export const store = createStore({
    state:{
        authenticated:false,
        isLoading:false
    },
    getters:{
        authenticated(state){
            return state.authenticated
        },
        isLoading(state){
            return state.isLoading
        }
    },
    mutations:{
        login:(state)=>{        
            state.authenticated = true
        },
        logout:(state) => {
            state.authenticated = false
        },
        isLoading(state, value){
            state.isLoading = value
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