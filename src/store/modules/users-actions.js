/* Users store actions */
import apiDms from "@/services/service-apidms"
import { getErrorResponse } from '../../helpers'
import { appConfig } from '@/main'

export const login = async (context, payload) => {
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
  }


export const logout = async (context) => {
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
}

export const dmsInfo = async (context) => {
    await apiDms
      .getDmsInfo()
      .then((res) => {
        context.commit("dmsInfo", res.data)
      })
      .catch((error) => console.log(error))
}

export const getUsers = async (context) => {
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
}

export const addUser = async (context, payload) => {
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
}

export const updateUser = async (context, payload) => {
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
}

export const deleteUser = async (context, username) => {
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
}

export const clearError = (context) => {
    context.commit("error", {error : getErrorResponse(null) })
}

//Private functions
function getProfileObjectWithConfiguredKeys(allFieldsObj, fieldsToInclude){  
    let response = {}
    for ( const field of fieldsToInclude){
      if (field in allFieldsObj){
        response[field] = allFieldsObj[field]
      }
    }
    return response
}