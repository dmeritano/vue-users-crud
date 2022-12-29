import axios from "axios"
//import { router } from '../router'
//import { store } from '../store'

let dmsClient = null
let otherServiceApiClient = null

export function createDmsClientInstance(baseURL) {
  dmsClient = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })
  dmsClient.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      // Por ejemplo, agregar el bearer token, si hay
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
      var hasResponse = "response" in error
      const data = {
        status: hasResponse ? error.response.status : "",
        message: error.message,
        code: error.code,
        url: error.config.baseURL + error.config.url,
        method: error.config.method,
        responseData: hasResponse ? error.response.data : ""
      }
      return Promise.reject(data)
    }
  )
}

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
      console.log(error)
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
