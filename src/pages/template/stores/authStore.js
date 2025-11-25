import { defineStore } from 'pinia'
import { ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { validateOtp, forgotPassword, login, changePassword } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false)
  const isCooldown = ref(false)
  const remainingTime = ref(0)
  let countdownInterval = null
  const cooldownEndTime = ref(parseInt(localStorage.getItem('cooldownEndTime')) || 0)

  resumeCooldown()

  async function handleLogin(payload) {
    loading.value = true
    try {
      const res = await login(payload)

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
        startCooldown(end)
      }
    } finally {
      loading.value = false
    }
  }

  async function handleForgotPassword(email) {
    loading.value = true
    try {
      const res = await forgotPassword({ email })

      if (res.responseCode === 200) {
        const expireAt = Date.now() + 300000

        localStorage.setItem('resetEmail', email)
        localStorage.setItem('otpExpireAt', String(expireAt))

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: `Kode OTP telah dikirim ke email ${email}`,
          confirmButtonText: 'OK',
          timer: 4000,
        }).then(() => {
          router.push('/validate-otp')
        })
      }
    } catch (err) {
      const res = err.response?.data

      if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Email yang anda gunakan tidak terdaftar!',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      }
    } finally {
      loading.value = false
    }
  }

  async function handleVerifyOtp(payload) {
    loading.value = true

    try {
      const res = await validateOtp(payload)

      if (res.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Kode OTP berhasil diverifikasi.',
          confirmButtonText: 'OK',
          timer: 4000,
        }).then(() => {
          localStorage.setItem('otpVerified', 'true')
          router.push('/change-password')
        })
      }
    } catch (err) {
      const res = err.response?.data

      if (res?.responseCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Kode OTP salah atau telah kadaluarsa.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'warning',
          title: 'Peringatan',
          text: 'Email anda tidak terdaftar.',
          confirmButtonText: 'OK',
          timer: 4000,
        })
      } else if (res?.responseCode === 410) {
        Swal.fire({
          icon: 'info',
          title: 'Informasi',
          html: 'Kode OTP Kadaluarsa!<br>Silakan masukkan email kembali.',
          confirmButtonText: 'OK',
          timer: 4000,
        }).then(() => {
          router.push('/forgot-password')
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Silakan coba beberapa saat lagi.',
          confirmButtonText: 'OK',
          timer: 4000,
        })
      }
    } finally {
      loading.value = false
    }
  }

  async function handleResendOtp(email) {
    loading.value = true
    try {
      const res = await forgotPassword({ email })

      if (res.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Kode OTP telah dikirim ke email Anda.',
          confirmButtonText: 'OK',
          timer: 4000,
        })

        return { ok: true }
      }
    } catch (err) {
      const res = err.response?.data
      const status = err.response?.status

      if (status === 429) {
        const locked = res?.lockedTime || 60

        Swal.fire({
          icon: 'warning',
          title: 'Peringatan',
          html: `Terlalu banyak permintaan!<br>Silakan coba dalam ${locked} detik.`,
          confirmButtonText: 'OK',
          timer: 4000,
        })

        return { ok: false, locked }
      }
      return { ok: false }
    } finally {
      loading.value = false
    }
  }

  async function handleResetPassword(payload) {
    loading.value = true

    try {
      const res = await changePassword(payload)

      if (res.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          html: 'Password berhasil diubah!<br>Silahkan login kembali.',
          confirmButtonText: 'OK',
          timer: 4000,
        }).then(() => {
          localStorage.removeItem('resetEmail')
          localStorage.removeItem('otpExpireAt')
          localStorage.removeItem('otpVerified')
          router.push('/login')
        })
      }
    } catch (err) {
      const res = err.response?.data

      if (res?.responseCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          html: 'Password yang anda masukkan tidak sama.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (res.responseCode === 404) {
        Swal.fire({
          icon: 'warning',
          title: 'Peringatan',
          html: 'Email tidak ditemukan!<br>Silakan masukkan email kembali.',
          confirmButtonText: 'OK',
          timer: 4000,
        }).then(() => router.push('/forgot-password'))
      } else if (res.responseCode === 410) {
        Swal.fire({
          icon: 'info',
          title: 'Informasi',
          text: 'Silakan masukkan email kembali.',
          confirmButtonText: 'OK',
          timer: 4000,
        }).then(() => router.push('/forgot-password'))
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Silakan coba beberapa saat lagi.',
          confirmButtonText: 'OK',
          timer: 4000,
        })
      }
    } finally {
      loading.value = false
    }
  }

  function initCooldown() {
    const storeEnd = localStorage.getItem('cooldownEndTime')
    if (!storeEnd) return

    const end = Number(storeEnd)
    if (Date.now() < end) {
      startCooldown(end)
    } else {
      localStorage.removeItem('cooldownEndTime')
    }
  }

  function startCooldown(endTimestamp) {
    clearInterval(countdownInterval)

    countdownInterval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, Math.ceil((endTimestamp - now) / 1000))

      remainingTime.value = diff
      isCooldown.value = diff > 0

      if (diff <= 0) finishCooldown()
    }, 1000)
  }

  function finishCooldown() {
    clearInterval(countdownInterval)
    countdownInterval = null
    isCooldown.value = false
    remainingTime.value = 0
    localStorage.removeItem('cooldownEndTime')
  }

  function resumeCooldown() {
    const end = cooldownEndTime.value
    if (!end) return

    const now = Date.now()
    if (now >= end) {
      isCooldown.value = false
      remainingTime.value = 0
      localStorage.removeItem('cooldownEndTime')
      return
    }

    isCooldown.value = true
    remainingTime.value = Math.ceil((end - now) / 1000)

    countdownInterval = setInterval(() => {
      const now = Date.now()
      remainingTime.value = Math.ceil((end - now) / 1000)

      if (remainingTime.value <= 0) {
        clearInterval(countdownInterval)
        isCooldown.value = false
        remainingTime.value = 0
        localStorage.removeItem('cooldownEndTime')
      }
    }, 1000)
  }

  return {
    loading,
    isCooldown,
    remainingTime,
    resumeCooldown,

    handleLogin,
    handleForgotPassword,
    handleVerifyOtp,
    handleResendOtp,
    handleResetPassword,
    initCooldown,
  }
})
