import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/auth/Login.vue'
import ForgotPass from '@/pages/auth/ForgotPass.vue'
import OtpVerify from '@/pages/auth/OtpVerify.vue'
import NewPass from '@/pages/auth/NewPass.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'

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
    meta: { requiresAuth: true },
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

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch (error) {
    return true
  }
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token && !isTokenExpired(token)

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    localStorage.clear()
    next({ name: 'Login' })
    return
  }

  if (isLoggedIn && ['Login', 'ForgotPassword', 'OtpVerify', 'NewPass'].includes(to.name)) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

export default router
