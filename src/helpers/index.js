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
        group:""    
    }
}

const emptyErrorResponse = {    
    hasError : false,
    message: i18n.global.t("APP_UNKNOWN_ERROR"),
    i18nMsg: "",
    errorAtrilSessionNotPresent : false    
}

export function getErrorResponse(error){

    const resp = {...emptyErrorResponse}
    if (error == null) //Sin error
        return resp;

    resp.hasError = true
    resp.message = error.message

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
        }else{
          //Tratar otros codigo de error del api. Por ahora queda lo que viene en response.data
          resp.i18nMsg = error.responseData.message //Sin traduccion
        }
      }
      return resp
    }
    
    if (error.status == "404"){      
      if (error.responseData != ""){
        if (error.responseData.status == "0022"){
          resp.i18nMsg = i18n.global.t("API_ERRORS_USER_NOT_EXIST")
        }else{
          //Tratar otros codigo de error del api. Por ahora queda lo que viene en response.data
          resp.i18nMsg = error.responseData.message //Sin traduccion
        }
      }
      return resp    
    }

    /*Atril Session not present -> Se trata en axios-config.js*/ 

    return resp  
}

