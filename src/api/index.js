import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const tokenType = localStorage.getItem('token_type') || 'Bearer'

    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.error('Server mengembalikan HTML, kemungkinan koneksi ngrok bermasalah.')
      throw new Error('Ngrok HTML error detected')
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
