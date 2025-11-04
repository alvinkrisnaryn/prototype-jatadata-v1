import api from './index'

const CABANG_API = '/cabang_services/api/v1/cabang-management'

export async function getAllCabang(params = {}) {
  try {
    const response = await api.get(`${CABANG_API}/cabangs`, { params })
    const result = Array.isArray(response.data?.data) ? response.data.data : response.data
    return result
  } catch (error) {
    console.error('Gagal mengambil data Cabang:', error)
    return []
  }
}
