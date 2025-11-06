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

export async function showJamaah(id) {
  const response = await api.get(`${MEMBER_API}/members/${id}`)
  return response.data
}

export async function editJamaah(params) {
  const response = await api.patch(`${MEMBER_API}/members/${params.id}`, params)
  return response.data
}

export async function deleteJamaah(id) {
  const response = await api.delete(`${MEMBER_API}/members/${id}`)

  if (response.status === 204) {
    return {
      responseCode: 204,
      responseMessage: 'Successfully deleted ',
    }
  }
  return response.data
}
