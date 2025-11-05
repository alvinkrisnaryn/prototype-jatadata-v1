import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

import { searchJamaah, addJamaah } from '@/api/jamaah'
import { getAllKoja } from '@/api/koja'
import { getAllOccupation } from '@/api/occupations'
import { getAllCabang } from '@/api/cabang'

export const useJamaahStore = defineStore('jamaah', () => {
  const jamaahData = ref([])
  const isLoading = ref(false)
  const totalData = ref(0)

  const filterState = ref({
    name: '',
    kojaId: '',
    occupationId: '',
    status: '',
  })

  const kojaOptions = ref([{ value: '', label: 'Semua Koja' }])
  const occupationOptions = ref([{ value: '', label: 'Semua Pekerjaan' }])
  const cabangOptions = ref([{ value: '', label: 'Semua Cabang' }])
  const statusOptions = ref([
    { value: '', label: 'Semua Status' },
    { value: 'Member', label: 'Jamaah' },
    { value: 'Non Member', label: 'Non Jamaah' },
  ])

  function updateFilter(key, value) {
    filterState.value[key] = value
  }

  async function fetchFilterJamaah() {
    try {
      isLoading.value = true
      const params = {
        name: filterState.value.name || '',
        kojaId: filterState.value.kojaId || '',
        occupationId: filterState.value.occupationId || '',
        status: filterState.value.status || '',
      }

      const response = await searchJamaah(params)
      if (response.responseCode === 200) {
        jamaahData.value = response.data?.content || response.data || []
      } else {
        jamaahData.value = []
      }
    } catch (error) {
      console.error('Gagal memuat data jamaah:', error)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Terjadi kesalahan saat mengambil data dari server.',
      })
    } finally {
      isLoading.value = false
    }
  }

  const loadOccupationOptions = async () => {
    try {
      const data = await getAllOccupation()
      if (Array.isArray(data) && data.length > 0) {
        occupationOptions.value = [
          { value: '', label: 'Semua Pekerjaan' },
          ...data.map((p) => ({
            value: p.id,
            label: `${p.name}`,
          })),
        ]
      }
    } catch (error) {
      console.error('Gagal memuat data pekerjaan', error)
    }
  }

  const loadCabangOptions = async () => {
    try {
      const data = await getAllCabang()
      if (Array.isArray(data) && data.length > 0) {
        cabangOptions.value = [
          { value: '', label: 'Semua Cabang' },
          ...data.map((c) => ({
            value: c.id,
            label: `${c.name}`,
          })),
        ]
      }
    } catch (error) {
      console.error('Gagal memuat data cabang', error)
    }
  }

  const loadKojaOptions = async () => {
    try {
      const data = await getAllKoja()
      if (Array.isArray(data) && data.length > 0) {
        kojaOptions.value = [
          { value: '', label: 'Semua Koja' },
          ...data.map((k) => ({
            value: k.id,
            label: `${k.name}`,
          })),
        ]
      }
    } catch (error) {
      console.error('Gagal memuat data koja', error)
    }
  }

  async function addJamaahData(values) {
    try {
      const payload = {
        memberName: values.name,
        memberEmail: values.email,
        memberNumberPhone: values.phoneNumber,
        memberAddress: values.address,
        memberBirthDate: values.birthDate,
        memberGender: values.gender,
        memberStatus: values.status,
        occupationId: values.occupationName,
        cabangId: values.cabangName,
        kojaId: values.kojaName,
      }

      const response = await addJamaah(payload)

      if (response.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data Jamaah berhasil ditambahkan',
          confirmButtonText: 'OK',
        })
        fetchFilterJamaah()
        return { success: true, data: response.data }
      }
    } catch (err) {
      const res = err.response?.data

      if (res?.responseCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          html: 'Anda gagal menambahkan data.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (res?.responseCode === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Anda bukan Admin!',
          html: 'Data harus ditambahkan oleh Admin.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (res?.responseCode === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Data Tersedia!',
          html: 'Data yang anda tambahkan sudah ada.',
          confirmButtonText: 'Coba Lagi',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Silakan coba beberapa saat lagi.',
        })
      }
      throw err
    }
  }

  return {
    // State
    jamaahData,
    isLoading,
    totalData,
    filterState,
    kojaOptions,
    occupationOptions,
    statusOptions,
    cabangOptions,
    // Actions
    updateFilter,
    fetchFilterJamaah,
    loadKojaOptions,
    loadOccupationOptions,
    loadCabangOptions,
    addJamaahData,
  }
})
