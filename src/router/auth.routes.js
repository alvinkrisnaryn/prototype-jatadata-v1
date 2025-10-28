import Login from '@/pages/auth/Login.vue'
import ForgotPass from '@/pages/auth/ForgotPass.vue'
import ValidateOtp from '@/pages/auth/OtpVerify.vue'
import ChangePassword from '@/pages/auth/NewPass.vue'
import { login } from '@/api/auth'

export default [
  { path: '/login', name: login, component: Login },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPass },
  { path: '/validate-otp', name: 'ValidateOtp', component: ValidateOtp },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
]
