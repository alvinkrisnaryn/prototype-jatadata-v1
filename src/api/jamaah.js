import api from './index'

const MEMBER_API = '/member_services/api/v1/member-management'

export async function searchJamaah(params = {}) {
  const response = await api.get(`${MEMBER_API}/members/search`, {
    params,
  })
  return response.data
}
