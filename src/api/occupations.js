import api from './index'

const OCCUPATION_API = '/occupation_services/api/v1/occupation-management'

export async function getAllOccupation(params = {}) {
  try {
    const response = await api.get(`${OCCUPATION_API}/occupations`, { params })
    const result = Array.isArray(response.data?.data) ? response.data.data : response.data
    return result
  } catch (error) {
    console.error('Gagal mengambil data Pekerjaan:', error)
    return []
  }
}
