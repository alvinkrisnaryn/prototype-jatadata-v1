<script setup>
import { CButton, CCard } from '@coreui/vue'
import AuthNavbar from '@/layouts/AuthNavbar.vue'
import { ref, onMounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import router from '@/router'

const showPassword = ref(false)
const isPasswordFocused = ref(false)

const loginAttempts = ref(parseInt(localStorage.getItem('loginAttempts')) || 0)
const cooldownEndtime = ref(localStorage.getItem('cooldownEndtime'))
const isCooldown = ref(false)
const remainingTime = ref(0)
let countdownInterval = null
let hasShowCooldownEndAlert = false

const schema = yup.object({
  email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
  password: yup
    .string()
    .required('Password wajib diisi')
    .min(8, 'Minimal 8 karakter')
    .matches(/[A-Z]/, 'Harus ada huruf besar')
    .matches(/[a-z]/, 'Harus ada huruf kecil')
    .matches(/[0-9]/, 'Harus ada angka')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Harus ada karakter spesial'),
})

const correctEmail = 'akunpomosda@gmail.com'
const correctPassword = '#Pomosdabangkit2025'

function togglePassword() {
  showPassword.value = !showPassword.value
}

function checkCooldown() {
  if (!cooldownEndtime.value) return
  const now = Date.now()
  if (now < cooldownEndtime.value) {
    isCooldown.value = true
    updateRemainingTime()
    startCountdown()
  } else {
    resetCooldown()
  }
}

function updateRemainingTime() {
  const now = Date.now()
  const diff = Math.max(0, Math.floor((cooldownEndtime.value - now) / 1000))
  remainingTime.value = diff
  if (diff <= 0) resetCooldown()
}

function startCountdown() {
  clearInterval(countdownInterval)
  countdownInterval = setInterval(updateRemainingTime, 1000)
}

function resetCooldown() {
  clearInterval(countdownInterval)
  isCooldown.value = false
  remainingTime.value = 0
  loginAttempts.value = 0
  localStorage.removeItem('loginAttempts')
  localStorage.removeItem('cooldownEndtime')

  if (hasShowCooldownEndAlert === false) {
    hasShowCooldownEndAlert = true
    Swal.fire({
      title: 'Waktu tunggu berakhir',
      text: 'Sekarang anda dapat login kembali',
      icon: 'info',
      confirmButtonText: 'OK',
    })
  }
}

const onSubmit = (values) => {
  if (isCooldown.value) {
    Swal.fire({
      title: 'Terlalu banyak percobaan!',
      text: 'Coba lagi setelah beberapa menit.',
      icon: 'warning',
      confirmButtonText: 'OK',
    })
    return
  }

  const { email, password } = values

  if (email !== correctEmail) {
    loginAttempts.value++
    localStorage.setItem('loginAttempts', loginAttempts.value)
    Swal.fire({
      title: 'Email salah!',
      text: 'Email yang Anda masukkan salah.',
      icon: 'error',
      confirmButtonText: 'Coba Lagi',
    })
    checkLockCondition()
    return
  }

  if (password !== correctPassword) {
    loginAttempts.value++
    localStorage.setItem('loginAttempts', loginAttempts.value)
    Swal.fire({
      title: 'Password salah!',
      text: 'Password yang Anda masukkan salah.',
      icon: 'error',
      confirmButtonText: 'Coba Lagi',
    })
    checkLockCondition()
    return
  }

  resetCooldown()
  sessionStorage.setItem('email', email)
  sessionStorage.setItem('password', password)

  Swal.fire({
    title: 'Login Berhasil',
    text: 'Anda berhasil login',
    icon: 'success',
    confirmButtonText: 'OK',
  }).then(() => {
    router.push('/dashboard')
  })
}

function checkLockCondition() {
  if (loginAttempts.value >= 3) {
    const fiveMinutes = 5 * 60 * 1000
    const end = Date.now() + fiveMinutes
    cooldownEndtime.value = end
    localStorage.setItem('cooldownEndtime', end)
    isCooldown.value = true
    Swal.fire({
      title: 'Terlalu banyak percobaan!',
      text: 'Harap tunggu selama 5 menit.',
      icon: 'warning',
      confirmButtonText: 'OK',
    })
    checkCooldown()
  }
}

onMounted(() => {
  checkCooldown()
})
</script>

<template>
  <AuthNavbar>
    <div class="container d-flex flex-column align-items-center justify-content-center">
      <CCard class="p-4 shadow-md border-0" style="max-width: 430px; width: 100%">
        <div class="w-100" style="max-width: 400px">
          <h2 class="fw-semibold fs-3 text-center">Selamat Datang Kembali</h2>
          <p class="text-center mb-4 text-muted-light">Silahkan masuk ke akun Anda</p>

          <Form @submit="onSubmit" :validation-schema="schema">
            <div class="form-group">
              <div class="position-relative">
                <Field name="email" type="email" placeholder=" " class="form-control" />
                <label for="email">Email</label>
                <span class="input-icon">
                  <i class="bi bi-person-fill"></i>
                </span>
              </div>
              <ErrorMessage name="email" class="d-block text-danger m-1" style="font-size: 14px" />
            </div>

            <div class="form-group">
              <div class="position-relative">
                <Field
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder=" "
                  class="form-control"
                  @focus="isPasswordFocused = true"
                  @blur="isPasswordFocused = false"
                />
                <label for="password">Password</label>
                <span
                  class="input-icon"
                  @mousedown.prevent
                  @click="togglePassword"
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  <i
                    :class="[
                      'bi',
                      showPassword
                        ? 'bi-eye-slash-fill'
                        : isPasswordFocused
                          ? 'bi-eye-fill'
                          : 'bi-lock-fill',
                    ]"
                  ></i>
                </span>
              </div>
              <ErrorMessage name="password" class="d-block text-danger small m-1" />
            </div>

            <CButton class="btn-login w-100 mb-2" type="submit" :disabled="isCooldown">
              <template v-if="!isCooldown">Login</template>
              <template v-else>
                Tunggu {{ Math.floor(remainingTime / 60) }}:{{
                  (remainingTime % 60).toString().padStart(2, '0')
                }}
              </template>
            </CButton>
          </Form>

          <div class="text-center">
            <router-link to="/forgot-password" class="forgot-link"> Lupa Password? </router-link>
          </div>
        </div>
      </CCard>
    </div>
  </AuthNavbar>
</template>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    hsl(30 25% 97%) 0%,
    hsl(150 20% 96%) 50%,
    hsl(30 20% 98%) 100%
  );
}

.card {
  background-color: hsl(30, 20%, 96%);
  border-radius: 1rem;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.form-group {
  position: relative;
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 12px 40px 12px 12px;
  margin: none;
  border: 1px solid #ccc;
  border-radius: 14px;
  outline: none;
  font-size: 14px;
}

.form-group label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #777;
  font-size: 0.9rem;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  top: 1px;
  left: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  background: #fff;
  padding: 0 4px;
  border-radius: 8px;
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #777;
  font-size: 1.1rem;
  cursor: default;
}

input:focus,
.form-control:focus,
.form-group input:focus,
.form-group .form-control:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: #ced4da !important;
}

.form-group input:focus {
  border-color: #fff !important;
}

.btn-login,
.btn-login:active,
.btn-login:focus,
.btn-login:disabled,
.btn-login:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 12px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-login:hover {
  background-color: #0069d9;
  color: rgba(235, 235, 235, 0.897);
  font-weight: bold;
}

.forgot-link {
  display: inline-block;
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
}

.forgot-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.text-muted-light {
  color: rgba(108, 117, 125, 0.8);
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
  box-shadow: 0 0 0 1000px #fff inset !important;
  -webkit-text-fill-color: #374151 !important;
  transition: background-color 5000s ease-in-out 0s;
}

input:-moz-autofill {
  box-shadow: 0 0 0 1000px #fff inset !important;
  -moz-text-fill-color: #374151 !important;
}

input[type='password'] {
  color: #374151;
}

input[type='password']:-webkit-autofill {
  -webkit-text-fill-color: #374151 !important;
}
</style>
