import api from './index'

const KOJA_API = '/koja_services/api/v1/koja-management'

export async function getAllKoja(params = {}) {
  try {
    const response = await api.get(`${KOJA_API}/kojas`, { params })
    const result = Array.isArray(response.data?.data) ? response.data.data : response.data
    return result
  } catch (error) {
    console.error('Gagal mengambil data Koja:', error)
    return []
  }
}
