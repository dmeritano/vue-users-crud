/* Users store actions */
import apiDms from "@/services/service-apidms"
import { getErrorResponse } from '../../helpers'
import { appConfig } from '@/main'
import i18n from '@/i18n.js'
import { getProfileFieldValue } from '../../helpers/fields-completion-plugins'

export const login = async (context, payload) => {

    context.commit("loading", {status:true}, { root: true })
    context.commit("error", {error : getErrorResponse(null) })      

    const searchProfile = async (username) => {
      const headers = {
        "query": appConfig.userProfileDocument + "$" + appConfig.userProfileLinkedField + "='" + username + "'",
        "deleted": "false"
      }      
      return await apiDms.search(headers)
    }    

    const getUserDocument = async (id) => {
      return await apiDms.getDocumentById(id)
    }

    const makeLogin = async (payload) => {
      return await apiDms.login(payload)
    }

    await makeLogin(payload)
      .then(()=>{
        context.commit("authenticatedStatus", {status:true}, { root: true })          
        context.commit("loggedUser", {userData: payload}, { root: true })        
        console.info("Loggin succesfully")
        if (appConfig.getUserProfileDocument){
          return searchProfile(payload.user)
        }
      })
      .then((resp) =>{
        if (appConfig.getUserProfileDocument){
          if (resp.data.meta.total == "1"){
            return getUserDocument(resp.data.docs[0]["#Id"])
          }else{
            console.error("User had not a associated profile document");
          }          
        }
      })
      .then((resp)=>{
        if (appConfig.getUserProfileDocument){
          const profile = getProfileObjectWithConfiguredKeys(resp.data.attributes
            ,appConfig.userProfileDocumentSelectedFields)
          context.commit("userProfile", {profile}, { root: true })
          console.info("User profile document loaded")          
        }
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
    
    let error = getErrorResponse(null)
    const info = context.getters["dmsInfo"];
    
    if (info.platform !== "Atril6"){
      error.hasError = true
      error.message = "La aplicacion funciona con repositorios versión 6 o superior. Repo configurado: " + info.platform
      error.i18nMsg = i18n.global.t("APP_INVALID_DMS_VERSION", {version:info.platform})
      context.commit("error", {error:error})
      return
    }

    if (getUsersAllowed(context.rootGetters["user"], context.rootGetters["userProfile"])){
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
    }else{
      let error = getErrorResponse(null)
      error.hasError = true
      error.message = "Sin acceso a lista de usuarios"
      error.i18nMsg = i18n.global.t("APP_USERPERMISIONS_ERROR")
      context.commit("error", {error:error})
    }

  
}

export const addUser = async (context, payload) => {
    context.commit("loading", {status:true}, { root: true })
    context.commit("error", {error : getErrorResponse(null) })

    const addProfileDocumentTask = async (profileDoc) => {
      return await apiDms.addDocument(appConfig.userProfileDocumentsParentIdContainer,profileDoc)
    }    
    const addUser = async (payload) => {
      return await apiDms.addUser(payload)
    }

    await addUser(payload)
      .then( (res) => {
        console.info("User created");
        context.commit("addUser", res.data)
      })
      .then(()=> {
        if (appConfig.createOrEditUserProfileDocument){
          const profileDoc = composeProfileDocument(payload.user)
          return addProfileDocumentTask(profileDoc)
        }
      })
      .then(()=>{
        if (appConfig.createOrEditUserProfileDocument){
          console.info("User profile created");      
        }
      })
      .catch((error)=>{
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
  
  const searchProfile = async (username) => {
    const headers = {
      "query": appConfig.userProfileDocument + "$" + appConfig.userProfileLinkedField + "='" + username + "'",
      "deleted": "false"
    }      
    return await apiDms.search(headers)
  }  
  const deleteProfileDocumentTask = async (id) => {
    return await apiDms.deleteDocumentById(id)
  } 
  const deleteUser = async (username) => {
    return await apiDms.deleteUser(username)
  }

  await deleteUser(username)
    .then(() => {
      console.info("User deleted", username);
      context.commit("deleteUser", username) 
    })
    .then(() => {
      if (appConfig.createOrEditUserProfileDocument){
        return searchProfile(username)
      }
    })
    .then((resp) => {
      if (appConfig.createOrEditUserProfileDocument){
        const id = resp.data.docs[0]["#Id"]
        return deleteProfileDocumentTask(id) 
      }
    })
    .then(()=>{
      if (appConfig.createOrEditUserProfileDocument){
        console.info("User profile document deleted");      
      }      
    })
    .catch((error) => {
      context.commit("error", {error : getErrorResponse(error) })
    })
    .finally(()=> {
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

function getUsersAllowed(username, userProfileDocument){
    
  let response = false  
  const exist = appConfig.allowedUsers.some(user => {
    return user.toLowerCase() === username.toLowerCase()
  })
  if (exist){
    return true
  }else if (Object.keys(userProfileDocument).length == 0){
    console.warn("Usuario no configurado para gestionar usuarios del sistema");
    return false
  }else if (Object.keys(userProfileDocument).length > 0){
    if (appConfig.allowUsersCrudAttribute in userProfileDocument){
      if (userProfileDocument[appConfig.allowUsersCrudAttribute].toLowerCase === "true"){
        return true
      }
    }else{
      console.warn("El perfil de usuario no tiene configurado atributo para especificar permisos [allowUsersCrudAttribute]")
      return false
    }
  }
  console.warn("Usuario sin permisos para gestionar lista de usuarios");
  return response
}

function composeProfileDocument(user){

  const pluginData = {
    "user" : user
  }
  let document = {
    "meta" : {
      "item" : "false",
      "type" : appConfig.userProfileDocument
    },
    "attributes" : {}
  }
  for (let i = 0; i < appConfig.userProfileFields.length; i++){    
    const elem = appConfig.userProfileFields[i]
    let value = ""
    if (elem.completion.toLowerCase() === "default"){
      value = elem.defaultValue
    }else if (elem.completion.toLowerCase() === "auto"){
      //plugin
      value = getProfileFieldValue(elem.completionAutoFunction, pluginData)
    }else{
      console.log("Metodo de completado de campos de perfil no implementado");
    }    
    document.attributes[elem.name] = value
  }
  return document
}


      /* codigo original ---- addUser

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

      */