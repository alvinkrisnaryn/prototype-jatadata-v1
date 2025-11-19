import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth.routes'
import dashRoutes from './dashboard.routes'
import Swal from 'sweetalert2'

const routes = [...authRoutes, ...dashRoutes]

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
    Swal.fire({
      icon: 'warning',
      title: 'Peringatan',
      html: 'Sesi berakhir!<br>Silahkan login kembali.',
      confirmButtonText: 'OK',
      timer: 4000,
    }).then(() => {
      router.push({ name: 'Login' })
    })
    return
  }

  if (
    isLoggedIn &&
    ['Login', 'ForgotPassword', 'ValidateOtp', 'ChangePassword'].includes(to.name)
  ) {
    next({ name: 'Home' })
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
