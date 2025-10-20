import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/auth/Login.vue'
import ForgotPass from '@/pages/auth/ForgotPass.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'
import OtpVerify from '@/pages/auth/OtpVerify.vue'
import NewPass from '@/pages/auth/NewPass.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPass,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/otp-verify',
    name: 'OtpVerify',
    component: OtpVerify,
  },
  {
    path: '/new-pass',
    name: 'NewPass',
    component: NewPass,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
