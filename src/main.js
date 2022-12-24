import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './router'
import { store } from './store'
import makeEnvConfig from './services/service-config'
import i18n from './i18n'
import { createDmsClientInstance } from './plugins/axios-config'


//Bootstraop 5.x
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'

//Global styles
import '@/assets/css/global.css';


const router = createRouter({
    history: createWebHistory(),
    routes,
})

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

makeEnvConfig().then(
    function(response){
        const EnvConfig = response
        const app = createApp(App)
        app.config.globalProperties.$EnvConfig = EnvConfig

        createDmsClientInstance(EnvConfig.serviceBaseUrl)




        app.use(router)
        app.use(store)
        app.use(i18n)
        app.mount('#app')            
    }
)
.catch( (error) => console.error("ERROR: configuration file not loaded", error))
