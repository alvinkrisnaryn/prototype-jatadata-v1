import api from './index'

const AUTH_BASE = '/auth'

export async function login(payload) {
  const response = await api.post(`${AUTH_BASE}/login`, payload)
  return response.data
}

export async function forgotPassword(payload) {
  const response = await api.post(`${AUTH_BASE}/forgot-password`, payload)
  return response.data
}

export async function validateOtp(payload) {
  const response = await api.post(`${AUTH_BASE}/validate-otp`, payload)
  return response.data
}

export async function changePassword(payload) {
  const response = await api.post(`${AUTH_BASE}/change-password`, payload)
  return response.data
}

export async function logout() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenType')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    sessionStorage.clear()
  } catch (err) {
    console.warn('Logout local cleanup error:', err)
  }
}
