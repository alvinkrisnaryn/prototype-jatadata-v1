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

// router.beforeEach((to, from, next) => {
//   const email = sessionStorage.getItem('email')
//   const password = sessionStorage.getItem('password')

//   const isLoggedIn = email && password

//   if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
//     next({ name: 'Login' })
//   } else if ((to.name === 'Login' || to.name === 'ForgotPassword') && isLoggedIn) {
//     next({ name: 'Dashboard' })
//   } else {
//     next()
//   }
// })

export default router
