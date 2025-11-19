<script setup>
import { CButton, CCard } from '@coreui/vue'
import AuthNavbar from '@/layouts/AuthNavbar.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import router from '@/router'
import { login } from '@/api/auth'
import { useThemeStore } from '@/pages/template/stores/theme'
import { useColorModes } from '@coreui/vue'

const showPassword = ref(false)
const isPasswordFocused = ref(false)
const loading = ref(false)
const isCooldown = ref(false)
const remainingTime = ref(0)
let countdownInterval = null

const themeStore = useThemeStore()
const { setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

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

function togglePassword() {
  showPassword.value = !showPassword.value
}

function startCountdownFromEnd(endTimestamp) {
  clearInterval(countdownInterval)
  const updateRemaining = () => {
    const now = Date.now()
    const diff = Math.max(0, Math.ceil((endTimestamp - now) / 1000))
    remainingTime.value = diff
    if (diff <= 0) finishCountdown()
  }
  updateRemaining()
  countdownInterval = setInterval(updateRemaining, 1000)
  isCooldown.value = true
}

function finishCountdown() {
  clearInterval(countdownInterval)
  countdownInterval = null
  isCooldown.value = false
  remainingTime = 0
  localStorage.removeItem('cooldownEndTime')
  Swal.fire({
    icon: 'info',
    title: 'Informasi',
    text: 'Waktu tunggu berakhir! Silahkan login kembali',
    confirmButtonText: 'OK',
  })
}

onMounted(() => {
  const storeEnd = localStorage.getItem('cooldownEndTime')
  if (storeEnd) {
    const end = parseInt(storeEnd, 10)
    if (!Number.isNaN(end) && Date.now() < end) {
      startCountdownFromEnd(end)
    } else {
      localStorage.removeItem('cooldownEndTime')
    }
  }
})

onMounted(() => {
  setColorMode('light')
  themeStore.toggleTheme('light')
  document.body.classList.remove('dark')
  document.body.classList.add('light')
})

onUnmounted(() => {
  document.body.classList.remove('light')
})

const onSubmit = async (values) => {
  if (isCooldown.value) return

  loading.value = true
  try {
    const res = await login({
      email: values.email,
      password: values.password,
    })

    if (res.responseCode === 200) {
      const data = res.data
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('tokenType', data.tokenType)
      localStorage.setItem('username', data.username)
      localStorage.setItem('role', data.role.name)

      localStorage.removeItem('cooldownEndtime')

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `Selamat datang, ${data.username}!`,
        confirmButtonText: 'OK',
        timer: 4000,
      })
      router.push('/home')
    }
  } catch (err) {
    const res = err.response?.data

    if (res?.responseCode === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Email atau Password salah.',
        confirmButtonText: 'Coba Lagi',
      })
    }

    if (res?.responseCode === 423) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: `Silakan coba lagi dalam ${res.lockedTime} detik.`,
        confirmButtonText: 'OK',
      })
      const end = Date.now() + res.lockedTime * 1000
      localStorage.setItem('cooldownEndTime', String(end))
      startCountdownFromEnd(end)
    }
  } finally {
    loading.value = false
  }
}
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

            <CButton class="btn-login w-100 mb-2" type="submit" :disabled="isCooldown || loading">
              <template v-if="!isCooldown">
                {{ loading ? 'Tunggu sebentar...' : 'Login' }}
              </template>
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
</style>
