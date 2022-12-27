import axios from "axios"
//import { router } from '../router'
//import { store } from '../store'

let dmsClient = null;
let otherServiceApiClient = null;



export function createDmsClientInstance(baseURL){
    dmsClient = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'        
        }
    });
    dmsClient.interceptors.request.use(function (config) {
        // Do something before request is sent
        //console.log("Request");
        return config;
      }, function (error) {
        return Promise.reject(error);
      });
          
    dmsClient.interceptors.response.use(
        (response) => { 
            //console.log("Response");
            return response; 
        },
        function (error) {
            /*
            if (error.response.status == 9){
                console.log("It's necesary to make login");
                const logout = async () => {
                    await store.dispatch("moduleUsers/logout")
                }
                logout()
                store.dispatch("moduleUsers/logout")
                //router.push("/login")
            }else{*/
                const data = {
                    status: error.response.status ? error.response.status : "",
                    message : error.message,
                    code : error.code,
                    url: error.config.baseURL + error.config.url,
                    method: error.config.method
                }            
                return Promise.reject(data);
    
            //}
        }
    );    
}

export function createOtherServiceClientInstance(baseURL){
    otherServiceApiClient = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'        
        }
    });
    otherServiceApiClient.interceptors.response.use(
        (response) => { return response; },
        function (error) {
            console.log(error);
            const data = {
                status: error.response.status,
                message : error.message,
                url: error.request.responseURL
            }
            return Promise.reject(data);
        }
    );       
}

export {
    dmsClient,
    otherServiceApiClient
}
