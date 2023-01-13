import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { store } from './store'
import loadAppConfig from './services/service-config'
import i18n from './i18n'
import { createDmsClientInstance } from './plugins/axios-config'


//Bootstraop 5.x
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'

//Global styles
import '@/assets/css/global.css';


//Configure router
router.beforeEach( (to, from, next) => {
    if (to.matched.some(route => route.meta.requiresAuth)){
        if(!store.getters.authenticated){
            next('/login')
        }else{
            next()
        }
    }else if (to.fullPath.toLocaleLowerCase() === "/login" &&
            store.getters.authenticated){
        next('/home')
    }else{
        next()
    }
})

//Exportamos la configuracion cargada para usar fuera de los componentes 
//  (en vuex store, por ejemplo)
export var appConfig = {}

//Loading configuration
const promiseConfig = loadAppConfig()
    .then(response => {
        appConfig = response
        return new Promise( (resolve) => {
            resolve(response)
        })
    })
    .catch(error => {
        throw new Error("Error loading app config", error)
    })

//Create application
promiseConfig.then( config => {    
    const app = createApp(App)
    app.config.globalProperties.$AppConfig = config
    createDmsClientInstance(config.serviceBaseUrl)
    app.use(router)
    app.use(store)
    app.use(i18n)
    app.mount('#app')      
})




/*
getEnvConfig()
.then( response => {    
    //loadedConfig = response             
    const app = createApp(App)
    app.config.globalProperties.$AppConfig = response
    createDmsClientInstance(response.serviceBaseUrl)
    app.use(router)
    app.use(store)
    app.use(i18n)
    app.mount('#app')            
})
.catch( (error) => console.error("ERROR: configuration file not loaded", error))
*/