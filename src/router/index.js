import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '../router/routes'

const production = "/" + window.location.pathname.split('/')[1] + "/"
export const router = createRouter({
    history: process.env.NODE_ENV === 'production' ? createWebHistory(production) : createWebHistory(),    
    routes,
})