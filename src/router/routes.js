import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import ChangePassword from '../pages/ChangePassword'

export const routes = [
    { path: '/login', component: LoginPage},
    { path: '/about', component: AboutPage},
    { path: '/credentials', component: ChangePassword, meta: { requiresAuth: true }},
    { path: '/home', component: HomePage, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect:'/home'}
]