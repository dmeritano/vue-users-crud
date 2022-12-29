import i18n from '@/i18n.js'

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
    i18nMsg: ""    
}

export function getErrorResponse(error){

    const resp = {...emptyErrorResponse}
    if (error == null) //Sin error
        return resp;

    resp.hasError = true

    if (error.code == "ERR_NETWORK"){
      resp.i18nMsg = i18n.global.t("APP_NETWORK_ERROR")
      resp.message = "original error"
      return resp
    }
  
    if (error.url.indexOf("authenticate") && error.method === "post"){          
      if (error.status == "401"){      
        resp.i18nMsg = i18n.global.t("API_ERRORS_INVALID_USER_PASS")
        resp.message = "original error"
      }else{
        resp.i18nMsg = i18n.global.t("API_ERRORS_GENERAL")
        resp.message = "original error"
      }      
      return resp
    }
    
    return resp  
}

