/* eslint-disable */

import apiDms from "@/services/service-apidms"
import { getErrorResponse } from '../../helpers'
import { appConfig } from '@/main'

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
    error(state, payload){
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
      context.commit("loading", {status:true}, { root: true })
      context.commit("error", {error : getErrorResponse(null) })      
      await apiDms
        .login(payload)
        .then( response => {          
          if (appConfig.getUserProfileDocument){
            const headers = {
              "query": appConfig.userProfileDocument + "$" + appConfig.userProfileLinkedField + "='" + response.data.user + "'",
              "deleted": "false"
            }            
            const searchProfile = async () => {
              await apiDms.search(headers).then( response => {                
                if (response.data.meta.total == "1"){
                  const id = response.data.docs[0]["#Id"];
                  const getUserDocument = async () => {
                    await apiDms.getDocumentById(id)
                      .then( response => {
                        const profile = getProfileObjectWithConfiguredKeys(response.data.attributes
                          ,appConfig.userProfileDocumentSelectedFields)
                        context.commit("userProfile", {profile}, { root: true })               
                      })
                  }
                  getUserDocument()                  
                }else{
                  throw new Error("no hay un perfil para el usuario")
                }                
              })
            }                        
            searchProfile()            
          }          
          context.commit("authenticatedStatus", {status:true}, { root: true })          
          context.commit("loggedUser", {userData: payload}, { root: true })
        })
        .catch((error) => { 
          context.commit("error", {error : getErrorResponse(error) })
        })
        .finally( () => {
          context.commit("loading", {status:false}, { root: true })
        })        
    },
    async logout(context) {
      context.commit("loading", {status:true}, { root: true })
      await apiDms
        .logout()
        .then(() => {})
        .catch( () => {})
        .finally( () => {
          context.commit("loading", {status:false}, { root: true })
        })             
          
        context.commit("authenticatedStatus", {status:false}, { root: true })
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
      context.commit("loading", {status:true}, { root: true })
      context.commit("error", {error : getErrorResponse(null) })
      await apiDms
        .getUsers()
        .then((res) => {
          context.commit("users", res.data.users)
        })
        .catch( (error) => {
          context.commit("error", {error : getErrorResponse(error) })                    
        })
        .finally( ()=> {
          context.commit("loading", {status:false}, { root: true })    
        })    
    },
    async addUser(context, payload){
      context.commit("loading", {status:true}, { root: true })
      context.commit("error", {error : getErrorResponse(null) })
      await apiDms
        .addUser(payload)
        .then( (res) => {
          context.commit("addUser", res.data)
        })
        .catch( (error) => {
          context.commit("error", {error : getErrorResponse(error) })                    
        })
        .finally( ()=> {
          context.commit("loading", {status:false}, { root: true })    
        })           
    },
    async updateUser(context, payload){
      context.commit("loading", {status:true}, { root: true })   
      context.commit("error", {error : getErrorResponse(null) }) 
      await apiDms
        .updateUser(payload)
        .then( (res) => {
          context.commit("updateUser", res.data)
        })
        .catch( (error) => {
          context.commit("error", {error : getErrorResponse(error) })
        })
        .finally( ()=> {
          context.commit("loading", {status:false}, { root: true })    
        })                   
    },
    async deleteUser(context, username){
      context.commit("loading", {status:true}, { root: true })   
      context.commit("error", {error : getErrorResponse(null) }) 
      await apiDms
        .deleteUser(username)
        .then( () => {
          context.commit("deleteUser", username)          
        })
        .catch((error) => {
          context.commit("error", {error : getErrorResponse(error) })
        })
        .finally( ()=> {
          context.commit("loading", {status:false}, { root: true })    
        })         
    },
    clearError(context){
      context.commit("error", {error : getErrorResponse(null) })
    }
  },
}

function getProfileObjectWithConfiguredKeys(allFieldsObj, fieldsToInclude){  
  let response = {}
  for (const [key, value] of Object.entries(allFieldsObj)) {
    if (fieldsToInclude.includes(key)){
      response[key] = value
    }  
  }
  return response
}

export default moduleUsers
