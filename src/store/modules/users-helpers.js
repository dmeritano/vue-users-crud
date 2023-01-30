/* Helper/Utilities functions for use en store's users module */

import { appConfig } from '@/main'
import apiDms from "@/services/service-apidms"
import i18n from '@/i18n.js'

export function getProfileObjectWithConfiguredKeys(allFieldsObj, fieldsToInclude){  
    let response = {}
    for ( const field of fieldsToInclude){
      if (field in allFieldsObj){
        response[field] = allFieldsObj[field]
      }
    }
    return response
}

export function getUsersAllowed(username, userProfileDocument){
    
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

export function composeProfileDocument(user, isNewDocument){

  const pluginData = {
    "user" : user
  }
  let document = {
    "attributes" : {}
  }

  if (isNewDocument){
    document.meta = {
        "item" : "false",
        "type" : appConfig.userProfileDocument
    }
  }
  
  for (let i = 0; i < appConfig.userProfileAttributes.length; i++){    
    const elem = appConfig.userProfileAttributes[i]
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


export async function searchAndGetUserProfileDocument(username){  
  try {
    const headers = {
      "query": appConfig.userProfileDocument + "$" + appConfig.userProfileLinkedAttribute + "='" + username + "'",
      "deleted": "false"
    }      
    const busqueda = await apiDms.search(headers)
    const documento = await apiDms.getDocumentById(busqueda.data.docs[0]["#Id"])
    return Promise.resolve(documento)

  } catch (error) {
    //console.error("Error buscando documento de perfil para usuario",username,error);
    const errorResponse = {
      status: "404",
      url: "",
      responseData: "",
      message: i18n.global.t("APP_USER_DOCUMENT_PROFILE_NOT_FOUND",{user:username})
    }
    return Promise.reject(errorResponse)
  }
}

export async function deleteUserProfileDocuments(username){
  try {
    const headers = {
      "query": appConfig.userProfileDocument + "$" + appConfig.userProfileLinkedAttribute + "='" + username + "'",
      "deleted": "false"
    }      
    const busqueda = await apiDms.search(headers)
    for (let i = 0; i < busqueda.data.docs.length; i++) {
      let docId = busqueda.data.docs[i]["#Id"]
      await apiDms.deleteDocumentById(docId)
    }    
    return Promise.resolve("OK (" + busqueda.data.docs.length + ")")
  } catch (error) {    
    console.error("deleteUserProfileDocuments",error);   
    return Promise.resolve("NOK")
  }
}


export function getProfileFieldValue(fn, data){
    
    switch (fn.toLowerCase()) {
        case "fn_user":            
            return data.user

        case "fn_last_password_update":
            return yyyymmdd()

        default:
            return "S/D";
    }
}

export function passwordChangeValidations(payload){
  try {
    let valid = true
    for (let [, value] of Object.entries(payload)) {    
      if (value === null || value.trim().length === 0){
        valid = false
        break
      }
    }
    if (valid){
      if (payload.newpass !== payload.newpassrepeat){
        valid = false
      }
    }
    return valid
  } catch (error) {
    console.error(error);
    return false
  }
}

export function isPasswordExpired(lastUpdate,passwordAge){
  if (lastUpdate === null || 
      lastUpdate === undefined ||
      lastUpdate.length !== 8 ||
      isNaN(lastUpdate)){
    console.warn("Invalid value for attribute");
    return true
  }
  const start = lastUpdate.substring(0,4) + "-" + lastUpdate.substring(4,6) + "-" + lastUpdate.substring(6)
  const aux = yyyymmdd()
  const end = aux.substring(0,4) + "-" + aux.substring(4,6) + "-" + aux.substring(6)
  const dStart = new Date(start).getTime()
  const dEnd = new Date(end).getTime()
  const diff = (dEnd - dStart) / (1000*60*60*24)
  if (diff < passwordAge){
    return false
  }
  return true
}

/* Private functions */

function yyyymmdd() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
}