import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/auth/Login.vue'
import ForgotPass from '@/pages/auth/ForgotPass.vue'
import ValidateOtp from '@/pages/auth/OtpVerify.vue'
import ChangePassword from '@/pages/auth/NewPass.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'

const routes = [
  {
    path: '/login',
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
    path: '/validate-otp',
    name: 'ValidateOtp',
    component: ValidateOtp,
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
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
  const resetEmail = localStorage.getItem('resetEmail')
  const otpExpireAt = localStorage.getItem('otpExpireAt')
  const now = Date.now()
  const otpValid = otpExpireAt && now < otpExpireAt
  const otpVerified = localStorage.getItem('otpVerified') === 'true'

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    localStorage.clear()
    next({ name: 'Login' })
    return
  }

  if (
    isLoggedIn &&
    ['Login', 'ForgotPassword', 'ValidateOtp', 'ChangePassword'].includes(to.name)
  ) {
    next({ name: 'Dashboard' })
    return
  }

  if (to.name === 'ValidateOtp' && !resetEmail) {
    next({ name: 'ForgotPassword' })
    return
  }

  if (to.name === 'ChangePassword') {
    if (!resetEmail) {
      next({ name: 'ForgotPassword' })
      return
    }

    if (!otpValid) {
      localStorage.removeItem('otpExpireAt')
      next({ name: 'ForgotPassword' })
      return
    }
  }

  if (to.name === 'ChangePassword' && !otpVerified) {
    next({ name: 'ValidateOtp' })
    return
  }

  if (
    ['ForgotPassword', 'Login'].includes(to.name) &&
    localStorage.getItem('otpExpireAt') &&
    Date.now() < localStorage.getItem('otpExpireAt')
  ) {
    next({ name: 'ValidateOtp' })
    return
  }

  next()
})

export default router
