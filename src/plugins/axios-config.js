import axios from "axios"

let dmsClient = null;
let otherServiceApiClient = null;



export function createDmsClientInstance(baseURL){
    dmsClient = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json'        
        }
    });
    dmsClient.interceptors.response.use(
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
