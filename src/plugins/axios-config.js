import axios from "axios"
import { router } from '../router'
import { store } from '../store'

let dmsClient = null
let otherServiceApiClient = null

export function createDmsClientInstance(apiUrl) {
  dmsClient = axios.create({
    baseURL : apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  })
  dmsClient.interceptors.request.use(
    function (config) {
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
  dmsClient.interceptors.response.use(
    (response) => {
      return response
    },
    function (error) {
      const hasResponse = "response" in error
      const data = {
        status: hasResponse ? error.response.status : "",
        message: error.message,
        code: error.code,
        url: error.config.baseURL + error.config.url,
        method: error.config.method,
        responseData: hasResponse ? error.response.data : ""
      }

      //Controlling "Atril session not present" due timeout or desconection
      if (data.status == "401"){
        if (data.responseData.status == "0001"){
          console.warn("Atril session not present. Disconnecting");       
          const clear = async () => {
            await store.dispatch("moduleUsers/logout")            
            router.push("/login")
          }
          clear()            
        }else{
          return Promise.reject(data)
        }      
      }else{
        return Promise.reject(data)
      }     
    }
  )
}

//Sample: To consume another API in the same application
export function createOtherServiceClientInstance(baseURL) {
  otherServiceApiClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })
  otherServiceApiClient.interceptors.response.use(
    (response) => {
      return response
    },
    function (error) {
      const data = {
        status: error.response.status,
        message: error.message,
        url: error.request.responseURL,
      }
      return Promise.reject(data)
    }
  )
}

export { dmsClient, otherServiceApiClient }
