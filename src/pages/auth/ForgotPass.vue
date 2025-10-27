<script setup>
import AuthNavbar from '@/layouts/AuthNavbar.vue'
import { useRouter } from 'vue-router'
import { CButton, CCard } from '@coreui/vue'
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { forgotPassword } from '@/api/auth'

const router = useRouter()
const loading = ref(false)
const isCooldown = ref(false)

const schema = yup.object({
  email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
})

const onSubmit = async (values) => {
  if (isCooldown.value) return

  loading.value = true

  try {
    const res = await forgotPassword({ email: values.email })

    if (res.responseCode === 200) {
      localStorage.setItem('resetEmail', values.email)
      localStorage.setItem('otpExpireAt', Date.now() + 300000)

      Swal.fire({
        icon: 'success',
        title: 'OTP Dikirim!',
        text: `Kode OTP telah dikirim ke email ${values.email}`,
      }).then(() => {
        router.push('/validate-otp')
      })
    }
  } catch (err) {
    const res = err.response?.data

    if (res?.responseCode === 404) {
      Swal.fire({
        icon: 'error',
        title: 'Email Tidak Ditemukan',
        html: 'Email yang anda gunakan tidak terdaftar!',
        confirmButtonText: 'Coba Lagi',
      })
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
          <h2 class="fw-semibold fs-3 text-center">Lupa Password</h2>
          <p class="text-center mb-4 text-muted-light">Silahkan masukkan email anda</p>

          <Form @submit="onSubmit" :validation-schema="schema">
            <div class="form-group">
              <div class="position-relative">
                <Field name="email" type="email" id="email" placeholder=" " class="form-control" />
                <label for="email">Email</label>
                <span class="input-icon">
                  <i class="bi bi-envelope-fill"></i>
                </span>
              </div>
              <ErrorMessage name="email" class="d-block text-danger m-1" />
            </div>

            <CButton class="btn-email w-100 mb-3" type="submit" :disabled="isCooldown || loading">
              <template v-if="!isCooldown">
                {{ loading ? 'Tunggu sebentar...' : 'Kirim Email' }}
              </template>
            </CButton>
          </Form>

          <div class="text-center">
            <router-link to="/login" class="btn-new-account">Sudah punya akun?</router-link>
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

.btn-email,
.btn-email:active,
.btn-email:focus,
.btn-email:disabled,
.btn-email:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 12px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-email:hover {
  background-color: #0069d9;
  color: rgba(235, 235, 235, 0.897);
  font-weight: bold;
}

.btn-new-account {
  display: inline-block;
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
}

.btn-new-account:hover {
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
</style>
