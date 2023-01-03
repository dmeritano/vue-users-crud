import apiDms from "@/services/service-apidms"
import { getErrorResponse } from '../../helpers'

function initialState () {
  return {
    dmsInfo:{},
    users:[],
    error: getErrorResponse(null)
  }
}

const moduleUsers = {
  namespaced: true,
  state: initialState(),
  getters : {
    dmsInfo(state){
      return state.dmsInfo
    },
    users(state){
      return state.users
    },
    error(state){
      return state.error
    }
  },
  mutations: {
    setError(state, payload){
      state.error = payload.error
    },
    dmsInfo(state, payload){
      state.dmsInfo = payload.meta.platform + " (" + payload.meta.name + ")"
    },
    users(state, payload){      
      state.users = payload
    },
    addUser(state, payload){
      state.users.push(payload)
    },
    updateUser(state, payload){
      var found = state.users.find(function (item) {
        return item.user == payload.user;
      })
      if (found){
        var index = state.users.indexOf({
          user : payload.user
        })        
        found.name = payload.name
        found.surname = payload.surname
        state.users[index] = found
      }
    },
    deleteUser(state, username){
      var found = state.users.find(function (item) {
        return item.user == username;
      })
      if (found){
        var index = state.users.indexOf({
          user : username
        })        
        state.users.splice(index,1)
      }
    },
    resetState(state){
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })      
    }
  },
  actions: {    
    async login(context, payload) {
      context.commit("isLoading", {status:true}, { root: true })
      context.commit("setError", {error : getErrorResponse(null) })
      await apiDms
        .login(payload)
        .then(() => {          
          context.commit("setAuthenticatedStatus", {status:true}, { root: true })
        })
        .catch((error) => { 
          context.commit("setError", {error : getErrorResponse(error) })
        })
        .finally( () => {
          context.commit("isLoading", {status:false}, { root: true })
        })        
    },
    async logout(context) {
      await apiDms
        .logout()
        .then(() => {})
        .catch( () => {})                
          
        context.commit("setAuthenticatedStatus", {status:false}, { root: true })
        context.commit("resetState", null, { root: true })
        context.commit("resetState")
    },
    async dmsInfo(context) {
      await apiDms
        .getDmsInfo()
        .then((res) => {
          context.commit("dmsInfo", res.data)
        })
        .catch((error) => console.log(error))
    },
    async getUsers(context) {
      context.commit("isLoading", {status:true}, { root: true })
      context.commit("setError", {error : getErrorResponse(null) })
      await apiDms
        .getUsers()
        .then((res) => {
          context.commit("users", res.data.users)
        })
        .catch( (error) => {
          context.commit("setError", {error : getErrorResponse(error) })                    
        })
        .finally( ()=> {
          context.commit("isLoading", {status:false}, { root: true })    
        })    
    },
    async addUser(context, payload){
      context.commit("isLoading", {status:true}, { root: true })
      context.commit("setError", {error : getErrorResponse(null) })
      await apiDms
        .addUser(payload)
        .then( (res) => {
          context.commit("addUser", res.data)
        })
        .catch( (error) => {
          context.commit("setError", {error : getErrorResponse(error) })                    
        })
        .finally( ()=> {
          context.commit("isLoading", {status:false}, { root: true })    
        })           
    },
    async updateUser(context, payload){
      context.commit("isLoading", {status:true}, { root: true })   
      context.commit("setError", {error : getErrorResponse(null) }) 
      await apiDms
        .updateUser(payload)
        .then( (res) => {
          context.commit("updateUser", res.data)
        })
        .catch( (error) => {
          context.commit("setError", {error : getErrorResponse(error) })
        })
        .finally( ()=> {
          context.commit("isLoading", {status:false}, { root: true })    
        })                   
    },
    async deleteUser(context, username){
      context.commit("isLoading", {status:true}, { root: true })   
      context.commit("setError", {error : getErrorResponse(null) }) 
      await apiDms
        .deleteUser(username)
        .then( () => {
          context.commit("deleteUser", username)          
        })
        .catch((error) => {
          context.commit("setError", {error : getErrorResponse(error) })
        })
        .finally( ()=> {
          context.commit("isLoading", {status:false}, { root: true })    
        })         
    },
    clearError(context){
      context.commit("setError", {error : getErrorResponse(null) })
    }
  },
}


export default moduleUsers
