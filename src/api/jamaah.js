import api from './index'

const MEMBER_API = '/member_services/api/v1/member-management'

export async function searchJamaah(params = {}) {
  const response = await api.get(`${MEMBER_API}/members/search`, {
    params,
  })
  return response.data
}

export async function addJamaah(params = {}) {
  const response = await api.post(`${MEMBER_API}/members`, params)
  return response.data
}
