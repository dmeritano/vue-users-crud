/* Users store actions */
import apiDms from "@/services/service-apidms"
import { getErrorResponse } from '../../helpers'
import { appConfig } from '@/main'
import i18n from '@/i18n.js'
import * as utils from './users-helpers'

export const login = async (context, payload) => {

    try {
      context.commit("loading", {status:true}, { root: true })
      context.commit("error", {error : getErrorResponse() })      
      //Authenticate
      await apiDms.login(payload)      
      if (appConfig.getUserProfileDocument){
        const foundDocument = await utils.searchAndGetUserProfileDocument(payload.user)
        const profile = utils.getProfileObjectWithConfiguredKeys(foundDocument.data.attributes
            ,appConfig.userProfileAttributes)
  
        context.commit("userProfile", {profile}, { root: true })
        console.info("User profile document loaded")
        if (appConfig.controlPasswordExpiration){          
          const lastUpdate = profile[appConfig.passwordExpirationDateAttribute]
          if (utils.isPasswordExpired(lastUpdate,appConfig.maximumPasswordAge)){
            context.commit("userMustChangePassword", {status:true}, { root: true })
          }
        }
      }      
      //Were able to authenticate - 
      context.commit("authenticatedStatus", {status:true}, { root: true })          
      context.commit("loggedUser", {userData: payload}, { root: true })       
      console.info("Loggin successfully")      
      return Promise.resolve(true)
    } catch (error) {      
      context.commit("error", {error : getErrorResponse(error) })
    }finally{
      context.commit("loading", {status:false}, { root: true })      
    }
  }


export const logout = async (context) => {
    try{
      context.commit("loading", {status:true}, { root: true })
      await apiDms.logout()  
    }catch(error){  
      console.log("Logout",error);
    }finally{
      context.commit("loading", {status:false}, { root: true })
      context.commit("authenticatedStatus", {status:false}, { root: true })
      context.commit("resetState", null, { root: true })
      context.commit("resetState")
      console.info("User logged out");  
    }    
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
    
    let error = getErrorResponse()
    const info = context.getters["dmsInfo"];    
    
    if (info.platform !== "Atril6"){
      error.hasError = true
      error.i18nMsg = i18n.global.t("APP_INVALID_DMS_VERSION", {version:info.platform})
      context.commit("error", {error:error})
      return
    }

    if (utils.getUsersAllowed(context.rootGetters["user"], context.rootGetters["userProfile"])){
      context.commit("loading", {status:true}, { root: true })
      context.commit("error", {error : getErrorResponse() })
      await apiDms
        .getUsers()
        .then((res) => {
          context.commit("users", res.data.users)
          context.commit("usersLoadedFromServer", {status:true})
        })
        .catch( (error) => {
          context.commit("error", {error : getErrorResponse(error) })                    
        })
        .finally( ()=> {
          context.commit("loading", {status:false}, { root: true })    
        })  
    }else{
      let error = getErrorResponse()
      error.hasError = true
      error.message = "Sin acceso a lista de usuarios"
      error.i18nMsg = i18n.global.t("APP_USERPERMISIONS_ERROR")
      context.commit("error", {error:error})
    }

  
}

export const addUser = async (context, payload) => {

    try {
      context.commit("loading", {status:true}, { root: true })
      context.commit("error", {error : getErrorResponse() })

      //In case there was any profile left without deleting for the user, we proceed to delete them.
      await utils.deleteUserProfileDocuments(payload.user)

      const response = await apiDms.addUser(payload)
      context.commit("addUser", response.data)
      console.info("User created");

      if (appConfig.createOrEditUserProfileDocument){
        //Get ServerTime updated 
        context.dispatch("dmsInfo")
        const dmsinfo = context.getters["dmsInfo"];
        //        
        const profileDoc = utils.composeProfileDocument(payload.user,dmsinfo.server_time)
        await apiDms.addDocument(appConfig.userProfileDocumentsParentIdContainer,profileDoc)
        console.info("User profile document created");  
      }      
    } catch (error) {
      context.commit("error", {error : getErrorResponse(error) })
    }finally{
      context.commit("loading", {status:false}, { root: true })
    }

} 

export const updateUser = async (context, payload) => {
    
  try {
    context.commit("loading", {status:true}, { root: true })   
    context.commit("error", {error : getErrorResponse() }) 
    
    //User pass must be updated with other api endpoint
    let passToUpdate = ""
    if(payload.pass.trim().length > 0){
      passToUpdate = payload.pass.trim()
      payload.pass = "" //Update user endpoint not working (not update pass)
    }
    //Update user perse
    const response = await apiDms.updateUser(payload) 
    console.info("User updated")

    if (passToUpdate != ""){
      //Update password
      await apiDms.updatePassword({
        "user" : payload.user,
        "currentpass" : "",
        "newpass" : passToUpdate
      })
      console.info("User password updated")
    }

    if(passToUpdate != "" &&
      appConfig.createOrEditUserProfileDocument &&
      appConfig.controlPasswordExpiration){

        //Get ServerTime updated 
        context.dispatch("dmsInfo")
        const dmsinfo = context.getters["dmsInfo"];
        //        
        const pluginData = {
          "user" : payload.user,
          "serverTime" : dmsinfo.server_time
        }        

        const foundDocument = await utils.searchAndGetUserProfileDocument(payload.user)                
        let docPayload = {
          "attributes" : {}
        }     
        docPayload.attributes[appConfig.passwordExpirationDateAttribute] = 
          utils.getProfileFieldValue(appConfig.expirationAttributeSetValueFunction,pluginData)
        await apiDms.updateDocument(foundDocument.data.attributes["#Id"], docPayload)     
        console.log("Update profile document updated");   
    }          
    context.commit("updateUser", response.data) 
  } catch (error) {
    context.commit("error", {error : getErrorResponse(error) })      
  } finally {
    context.commit("loading", {status:false}, { root: true })    
  }
}

export const getUserProfileDocument = async (context, username) => {

  context.commit("loading", {status:true}, { root: true })   
  context.commit("error", {error : getErrorResponse() }) 

  let response = {}
  try {
    const foundDocument = await utils.searchAndGetUserProfileDocument(username)      
    const profileAttributes = utils.getProfileObjectWithConfiguredKeys(foundDocument.data.attributes
      ,appConfig.userProfileAttributes) 
    
    response["id"] = foundDocument.data.attributes["#Id"]
    response["profileAttributes"] = profileAttributes
    
    console.info("Profile loaded for user", username)
    return response

  } catch (error) {
    context.commit("error", {error : getErrorResponse(error) })      
  } finally {
    context.commit("loading", {status:false}, { root: true })    
  }

}

export const updateUserProfileDocument = async (context, payload) => {
  
  context.commit("loading", {status:true}, { root: true })   
  context.commit("error", {error : getErrorResponse() }) 
  
  try {
    let docPayload = {
      "attributes" : payload.attributes
    }    
    await apiDms.updateDocument(payload.id, docPayload) 
    console.info("Profile updated for user", payload.user)   
  } catch (error) {    
    context.commit("error", {error : getErrorResponse(error) })      
  } finally {
    context.commit("loading", {status:false}, { root: true })    
  }

}

export const deleteUser = async (context, username) => {

  context.commit("loading", {status:true}, { root: true })   
  context.commit("error", {error : getErrorResponse() }) 
  
  await apiDms.deleteUser(username)
    .then(() => {
      console.info("User deleted", username);
      context.commit("deleteUser", username) 
    })
    .then(() => {
      if (appConfig.createOrEditUserProfileDocument){
        utils.deleteUserProfileDocuments(username)
          .then((response)=>{
            console.info("User profile documents deleted:",response);      
          })
      }
    })
    .catch((error) => {
      context.commit("error", {error : getErrorResponse(error) })
    })
    .finally(()=> {
      context.commit("loading", {status:false}, { root: true })    
    })   
}

export const updateUserPassword = async (context, payload) => {

  let error = getErrorResponse()
  try {
    context.commit("loading", {status:true}, { root: true })   
    context.commit("error", {error : getErrorResponse() }) 

    if (!utils.passwordChangeValidations(payload)){
      error.hasError = true
      error.i18nMsg = i18n.global.t("CHANGEPASSWORD_PASSWORDS_FIELDS_ERROR")
      context.commit("error", {error:error})
      return      
    }

    delete payload.newpassrepeat //No required on PUT payload
    await apiDms.updatePassword(payload)
    
    if (appConfig.controlPasswordExpiration){

        //Get ServerTime updated 
        context.dispatch("dmsInfo")
        const dmsinfo = context.getters["dmsInfo"];
        //        
        const pluginData = {
          "user" : payload.user,
          "serverTime" : dmsinfo.server_time
        }        

        const foundDocument = await utils.searchAndGetUserProfileDocument(payload.user)                
        let docPayload = {
          "attributes" : {}
        }     
        docPayload.attributes[appConfig.passwordExpirationDateAttribute] = 
          utils.getProfileFieldValue(appConfig.expirationAttributeSetValueFunction,pluginData)
        await apiDms.updateDocument(foundDocument.data.attributes["#Id"], docPayload)     
        console.log("Update profile document updated");  


      //Finnaly
      context.commit("userMustChangePassword", {status:false}, { root: true })
    }

    console.info("Password updated");      
  } catch (error) {
    context.commit("error", {error : getErrorResponse(error) })
  }finally{
    context.commit("loading", {status:false}, { root: true })    
  }

}

export const clearError = (context) => {
    context.commit("error", {error : getErrorResponse() })
}
