import api from './index'

const MEMBER_API = '/member_services/api/v1/member-management'

export async function getAllJamaah() {
  const response = await api.get(`${MEMBER_API}/members`)
  return response.data
}

export async function addJamaah(payload) {
  const response = await api.post(`${MEMBER_API}/members`, payload)
  return response.data
}
export async function importBulkJamaah(formData) {
  const response = await api.post(`${MEMBER_API}/members/bulk`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
export async function searchJamaah(params) {
  const response = await api.get(`${MEMBER_API}/members/search`, { params })
  return response.data
}
