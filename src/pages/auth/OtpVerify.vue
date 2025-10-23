<script setup>
import AuthNavbar from '@/layouts/AuthNavbar.vue'
import { useRouter } from 'vue-router'
import { ref, nextTick, onUnmounted } from 'vue'
import { CButton, CCard } from '@coreui/vue'
import Swal from 'sweetalert2'
import { validateOtp, forgotPassword } from '@/api/auth'

const router = useRouter()
const otp = ref(['', '', '', ''])
const inputRefs = ref([])

const isCooldown = ref(false)
const countdown = ref(0)
let cooldownTimer = null

const email = localStorage.getItem('resetEmail')

function handleInput(e, index) {
  const value = e.target.value
  if (!/^\d?$/.test(value)) {
    otp.value[index] = ''
    return
  }
  if (value && index < otp.value.length - 1) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }
}

function handleBackspace(e, index) {
  if (e.key === 'Backspace' && !otp.value[index] && index > 0) {
    nextTick(() => inputRefs.value[index - 1]?.focus())
  }
}

async function handleSubmitOtp() {
  const otpCode = otp.value.join('')
  if (otpCode.length < 4) {
    Swal.fire({
      icon: 'error',
      title: 'OTP Salah',
      text: 'Masukkan 4 digit kode OTP!',
    })
    return
  }

  try {
    const res = await validateOtp({ email, otp: otpCode })

    if (res.responseCode === 200) {
      Swal.fire({
        icon: 'success',
        title: 'OTP Berhasil!',
        text: 'Kode OTP berhasil diverifikasi.' || response.responseMessage,
      }).then(() => {
        otp.value = ['', '', '', '']
        router.push('/change-password')
      })
    }
  } catch (err) {
    const res = err?.response?.data

    if (res?.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'OTP Tidak Valid!',
        html: 'Kode OTP salah atau kadaluarsa.',
        confirmButtonText: 'Coba Lagi',
      })
    }

    if (res?.responseCode === 404) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Tidak Ditemukan!',
        html: 'Email anda tidak terdaftar.',
      })
    }

    if (res?.responseCode === 410) {
      Swal.fire({
        icon: 'info',
        title: 'Kode OTP Kadaluarsa!',
        html: 'Silahkan masukkan email kembali.',
      }).then(() => {
        router.push('/forgot-pass')
      })
    }
  }
}

function startCooldown(seconds = 60) {
  isCooldown.value = true
  countdown.value = seconds
  cooldownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(coolddownTimer)
      isCooldown.value = false
    }
  }, 1000)
}

async function handleResendOtp() {
  if (isCooldown.value) return

  try {
    const res = await forgotPassword({ email })
    Swal.fire({
      icon: 'success',
      title: 'OTP Dikirim Ulang!',
      html: 'Kode OTP telah dikirim ke email Anda.' || res.responseMessage,
    })
    otp.value = ['', '', '', '']
    nextTick(() => inputRefs.value[0]?.focus())
    startCooldown()
  } catch (err) {
    const res = err.response?.data
    const status = err.response?.status

    if (status === 429) {
      const locked = res?.lockedTime || 60
      Swal.fire({
        icon: 'warning',
        title: 'Terlalu Banyak Permintaan',
        html: `Silakan coba dalam ${locked} detik.`,
        confirmButtonText: 'OK',
      })
      startCooldown(locked)
      return
    }
  }
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<template>
  <AuthNavbar>
    <div class="container d-flex flex-column align-items-center justify-content-center">
      <CCard class="p-4 shadow-md border-0" style="max-width: 430px; width: 100%">
        <div class="w-100" style="max-width: 400px">
          <h2 class="fw-semibold fs-3 text-center">Lupa Password</h2>
          <p class="text-center mb-4 text-muted-light">Masukkan kode OTP</p>

          <div class="otp-input-group d-flex justify-content-center mb-4">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              ref="inputRefs"
              type="text"
              placeholder=" "
              class="otp-input text-center mx-1"
              maxlength="1"
              v-model="otp[index]"
              @input="(e) => handleInput(e, index)"
              @keydown="(e) => handleBackspace(e, index)"
            />
          </div>

          <CButton class="btn-otp w-100 mb-3" type="submit" @click="handleSubmitOtp">
            Verifikasi OTP
          </CButton>

          <div class="text-center">
            <button class="btn-resend-otp" :disabled="isCooldown" @click="handleResendOtp">
              <span v-if="!isCooldown">Kirim ulang code</span>
              <span v-else>Kirim ulang kode dalam {{ countdown }}</span>
            </button>
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

.otp-input-group {
  gap: 15px;
}

.otp-input {
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: 2px solid #000;
  border-radius: 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0,
    2s ease;
}

.otp-input:focus,
.otp-input:not(:placeholder-shown) {
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.btn-otp,
.btn-otp:active,
.btn-otp:focus,
.btn-otp:disabled,
.btn-otp:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-radius: 12px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-otp:hover {
  background-color: #0069d9;
  color: rgba(235, 235, 235, 0.897);
  font-weight: bold;
}

.text-muted-light {
  color: rgba(108, 117, 125, 0.8);
}

.btn-resend-otp {
  display: inline-block;
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
  border: none;
  background: none;
  transition:
    color 0.2s ease,
    text-decoration 0.2s ease;
}

.btn-resend-otp:hover {
  color: #0056b3;
  text-decoration: underline;
}
</style>
