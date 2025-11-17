<script setup>
import AuthNavbar from '@/layouts/AuthNavbar.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CButton, CCard } from '@coreui/vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { changePassword } from '@/api/auth'
import { useThemeStore } from '@/pages/template/stores/theme'
import { useColorModes } from '@coreui/vue'

const router = useRouter()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isPasswordFocused = ref(false)
const isConfirmFocused = ref(false)

const otpExpired = ref(0)
let otpTimer = null

const themeStore = useThemeStore()
const { setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

const schema = yup.object({
  password: yup
    .string()
    .required('Password wajib diisi')
    .min(8, 'Minimal 8 karakter')
    .matches(/[A-Z]/, 'Harus ada huruf besar')
    .matches(/[a-z]/, 'Harus ada huruf kecil')
    .matches(/[0-9]/, 'Harus ada angka')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Harus ada karakter spesial'),

  confirmPassword: yup
    .string()
    .required('Konfirmasi password wajib diisi')
    .oneOf([yup.ref('password')], 'Password tidak cocok'),
})

function togglePassword(type) {
  if (type === 'main') showPassword.value = !showPassword.value
  else showConfirmPassword.value = !showConfirmPassword.value
}

const onSubmit = async (values) => {
  const email = localStorage.getItem('resetEmail')

  try {
    const res = await changePassword({
      email,
      newPassword: values.password,
      confirmNewPassword: values.confirmPassword,
    })

    if (res.responseCode === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Password berhasil diubah!',
        text: 'Silakan login dengan password baru Anda.' || response.responseMessage,
      }).then(() => {
        localStorage.removeItem('resetEmail')
        localStorage.removeItem('otpExpireAt')
        localStorage.removeItem('otpVerified')
        router.push('/login')
      })
    }
  } catch (err) {
    const res = err?.response?.data

    if (res?.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Password Tidak Valid!',
        html: 'Password yang anda masukkan tidak sama.',
        confirmButtonText: 'Coba Lagi',
      })
    } else if (res?.responseCode === 404) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Tidak Ditemukan!',
        text: 'Silakan masukkan email kembali.',
      }).then(() => router.push('/forgot-password'))
    } else if (res?.responseCode === 410) {
      Swal.fire({
        icon: 'info',
        title: 'Kode OTP Kadaluarsa!',
        text: 'Silakan masukkan email kembali.',
      }).then(() => router.push('/forgot-password'))
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Silakan coba beberapa saat lagi.',
      })
    }
  }
}

function startOtpTimer(seconds) {
  otpExpired.value = seconds
  if (otpTimer) clearInterval(otpTimer)

  otpTimer = setInterval(() => {
    otpExpired.value--
    if (otpExpired.value <= 0) {
      clearInterval(otpTimer)
      localStorage.removeItem('otpExpireAt')
      Swal.fire({
        icon: 'info',
        title: 'Kode OTP Kadaluarsa!',
        text: 'Silakan masukkan email kembali.',
      }).then(() => {
        router.push('/forgot-password')
      })
    }
  }, 1000)
}

onMounted(() => {
  const expireAt = localStorage.getItem('otpExpireAt')
  const remaining = expireAt ? Math.floor((expireAt - Date.now()) / 1000) : 0

  if (!remaining || remaining <= 0) {
    Swal.fire({
      icon: 'info',
      title: 'Kode OTP Kadaluarsa!',
      text: 'Silakan masukkan email kembali.',
    }).then(() => {
      localStorage.removeItem('otpExpireAt')
      router.push('/forgot-password')
    })
  } else {
    startOtpTimer(remaining)
  }
})

onUnmounted(() => {
  if (otpTimer) clearInterval(otpTimer)
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
</script>

<template>
  <AuthNavbar>
    <div class="container d-flex flex-column align-items-center justify-content-center">
      <CCard class="p-4 shadow-md border-0" style="max-width: 430px; width: 100%">
        <div class="w-100" style="max-width: 400px">
          <h2 class="fw-semibold fs-3 text-center">Lupa Password</h2>
          <p class="text-center mb-4 text-muted-light">Silahkan masukkan password baru</p>

          <Form @submit="onSubmit" :validation-schema="schema">
            <div class="form-group">
              <div class="position-relative">
                <Field
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Masukkan Password Baru"
                  class="form-control"
                  @focus="isPasswordFocused = true"
                  @blur="isPasswordFocused = false"
                />
                <span
                  class="input-icon"
                  @mousedown.prevent
                  @click="togglePassword('main')"
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
                          : 'none',
                    ]"
                  ></i>
                </span>
              </div>
              <ErrorMessage name="password" class="d-block text-danger small m-1" />
            </div>

            <div class="form-group">
              <div class="position-relative">
                <Field
                  name="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  placeholder="Konfirmasi Password Baru"
                  class="form-control"
                  @focus="isConfirmFocused = true"
                  @blur="isConfirmFocused = false"
                />
                <span
                  class="input-icon"
                  @mousedown.prevent
                  @click="togglePassword('confirm')"
                  role="button"
                  aria-label="Toggle password visibility"
                >
                  <i
                    :class="[
                      'bi',
                      showConfirmPassword
                        ? 'bi-eye-slash-fill'
                        : isConfirmFocused
                          ? 'bi-eye-fill'
                          : 'none',
                    ]"
                  ></i>
                </span>
              </div>
              <ErrorMessage name="confirmPassword" class="d-block text-danger small m-1" />
            </div>

            <CButton class="btn-new-pass w-100 mb-3" type="submit"> Ganti Password </CButton>
          </Form>
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
  margin-bottom: 20px;
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

.input-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: #777;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-new-pass,
.btn-new-pass:active,
.btn-new-pass:focus,
.btn-new-pass:disabled,
.btn-new-pass:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 12px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-new-pass:hover {
  background-color: #0069d9;
  color: rgba(235, 235, 235, 0.897);
  font-weight: bold;
}

.text-muted-light {
  color: rgba(108, 117, 125, 0.8);
}
</style>
