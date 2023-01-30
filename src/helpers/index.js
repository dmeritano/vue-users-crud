import i18n from '@/i18n.js'

export const alertModalErrorTypes = {
  DEFAULT:"DEFAULT",
  WARNING:"WARNING",
  ERROR:"ERROR"
}

export function emptyUser() {
    return{
        user:"",
        name:"",
        surname:"",
        pass:"",
        group:"Administrators"    
    }
}
export function createUser(payload){
    return{
        user:payload.user,
        name:payload.name,
        surname:payload.surname,
        pass:"",
        group:"Administrators"    
    }
}

const emptyErrorResponse = {    
    hasError : false,
    message: "",
    i18nMsg: i18n.global.t("APP_UNKNOWN_ERROR"),
    errorAtrilSessionNotPresent : false    
}

export function initialStateUsersStore () {
  return {
    dmsInfo:{},
    users:[],
    error: getErrorResponse(null)
  }
}

export function getErrorResponse(error){

    const resp = {...emptyErrorResponse}
    if (error === null){
      return resp;  //No error
    }

    console.error(error);

    resp.hasError = true
    resp.message = error.message
    resp.i18nMsg = error.message

    if (error.code == "ERR_NETWORK"){
      resp.i18nMsg = i18n.global.t("APP_NETWORK_ERROR")
      return resp
    }
  
    if (error.url.indexOf("authenticate") >0 && error.method === "post"){
      if (error.status == "401"){      
        resp.i18nMsg = i18n.global.t("API_ERRORS_INVALID_USER_PASS")
      }else{
        resp.i18nMsg = i18n.global.t("API_ERRORS_GENERAL")
      }      
      return resp
    }

    if (error.status == "400"){      
      if (error.responseData != ""){
        if (error.responseData.status == "0016"){
          resp.i18nMsg = i18n.global.t("API_ERRORS_USER_EXIST")

        }else if (error.responseData.status == "0023"){
          resp.i18nMsg = i18n.global.t("API_ERRORS_USER_COULD_NOT_UPDATE_PASSWORD")        

        }else if (error.responseData.status == "0008"){
          resp.i18nMsg = i18n.global.t("APP_BADREQUEST_ERROR")
        }else{
          //Tratar otros codigo de error del api. Por ahora queda lo que viene en response.data
          resp.i18nMsg = error.responseData.message //Sin traduccion
        }
      }
      return resp
    }
    
    if (error.status == "404"){      

      resp.i18nMsg = i18n.global.t("API_ERRORS_RESOURCE_NOT_FOUND") 

      if (error.responseData != "" && error.responseData?.status){
        if (error.responseData.status == "0022"){
          resp.i18nMsg = i18n.global.t("API_ERRORS_USER_NOT_EXIST")
        }else if (error.url.indexOf("users") >0 && error.method === "get"){   
            /* users list */
            resp.i18nMsg = i18n.global.t("API_ERRORS_COULD_NOT_GET_USERS")
        }else{
          //Tratar otros codigo de error del api. Por ahora queda lo que viene en response.data
          resp.i18nMsg = error.responseData.message //Sin traduccion
        }
      }
      
      return resp    
    }

    if (error.code == "ERR_BAD_REQUEST"){
      resp.i18nMsg = i18n.global.t("APP_BADREQUEST_ERROR")
      return resp      
    }

    /*Atril Session not present -> Se trata en axios-config.js*/ 

    return resp  
}

