import { ref } from 'vue'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

import { searchJamaah, addJamaah, editJamaah, deleteJamaah, showJamaah } from '@/api/jamaah'
import { getAllKoja } from '@/api/koja'
import { getAllOccupation } from '@/api/occupations'
import { getAllCabang } from '@/api/cabang'

export const useJamaahStore = defineStore('jamaah', () => {
  const jamaahData = ref([])
  const singleJamaah = ref(null)
  const isLoading = ref(false)
  const isDetailLoading = ref(false)
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
    { value: 'Member', label: 'Jamaah', apiValue: 'MEMBER' },
    { value: 'Non Member', label: 'Non Jamaah', apiValue: 'NON_MEMBER' },
  ])
  const genderOptions = ref([
    { value: '', label: 'Pilih Gender' },
    { value: 'Male', label: 'Laki-laki', apiValue: 'MALE' },
    { value: 'Female', label: 'Perempuan', apiValue: 'FEMALE' },
  ])
  const getApiValue = (options, vueValue) => {
    const option = options.find((opt) => opt.value === vueValue)
    return option?.apiValue || vueValue
  }

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
        status: getApiValue(statusOptions.value, filterState.value.status) || '',
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

  async function editJamaahData(id, values) {
    try {
      const payload = {
        id: id,
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

      const response = await editJamaah({ id, ...payload })

      if (response.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data Jamaah berhasil diperbarui',
          confirmButtonText: 'OK',
        })
        fetchFilterJamaah()
        return { success: true }
      }
    } catch (err) {
      const res = err.response?.data
      const status = err.response?.status

      if (status === 400) {
        const errorList = res?.errors || []
        const formattedErrors = errorList
          .map((e) => {
            let cleanMessage = e.trim().replace(/^.+: /, '')
            return `<li>${cleanMessage}</li>`
          })
          .join('')

        const defaultMessage = 'Silahkan periksa kembali semua kolom input.'

        Swal.fire({
          icon: 'error',
          title: 'Gagal Memperbarui Data!',
          html: `
            <p style="text-align: center; margin-bottom: 1rem; font-weight: 500;">
              Terjadi kesalahan saat memproses data. Beberapa kolom tidak valid:
            </p>
            <ul style="text-align: left; padding-left: 20px; color: #dc3545;">
              ${formattedErrors.length > 0 ? formattedErrors : `<li>${defaultMessage}</li>`}
            </ul>
            <p style="text-align: center; margin-top: 1rem;">
              Mohon **Perbaiki Data** dan coba simpan kembali.
            </p>
          `,
          confirmButtonText: 'Perbaiki Data',
          customClass: {
            htmlContainer: 'text-start',
          },
        })
      } else if (status === 401 || status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak!',
          html: 'Data harus diperbarui oleh Admin.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data tidak Ditemukan!',
          html: 'Data yang ingin diperbarui tidak ditemukan.',
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

  async function showJamaahData(id) {
    if (!id) return

    try {
      isDetailLoading.value = true
      const response = await showJamaah(id)

      if (response.responseCode === 200) {
        singleJamaah.value = response.data
      } else {
        singleJamaah.value = null
        Swal.fire({
          icon: 'warning',
          title: 'Data Tidak Valid',
          text: 'Respons data tidak valid.',
        })
      }
    } catch (error) {
      const status = error.response?.status
      const res = error.response?.data
      singleJamaah.value = null

      if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Tidak Ditemukan!',
          html: 'Data Jamaah tidak ditemukan.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (status === 401 || status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Anda bukan Admin!',
          html: 'Data harus dihapus oleh Admin.',
          confirmButtonText: 'Coba Lagi',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Detail',
          text: 'Terjadi kesalahan saat mengambil data dari server.',
        })
      }
    } finally {
      isDetailLoading.value = false
    }
  }

  async function deleteJamaahData(id) {
    try {
      const response = await deleteJamaah(id)

      if (response.responseCode === 204) {
        await Swal.fire({
          icon: 'success',
          title: 'Data Dihapus!',
          text: 'Data Jamaah berhasil dihapus',
          confirmButtonText: 'OK',
        })
        fetchFilterJamaah()
        return { success: true }
      }
    } catch (err) {
      const res = err.response?.data

      if (res?.responseCode === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Anda bukan Admin!',
          html: 'Data harus dihapus oleh Admin.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Data tidak Ditemukan!',
          html: 'Data yang ingin hapus tidak ditemukan.',
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
    singleJamaah,
    isLoading,
    isDetailLoading,
    totalData,
    filterState,
    kojaOptions,
    occupationOptions,
    statusOptions,
    cabangOptions,
    genderOptions,
    // Actions
    updateFilter,
    fetchFilterJamaah,
    loadKojaOptions,
    loadOccupationOptions,
    loadCabangOptions,
    addJamaahData,
    editJamaahData,
    showJamaahData,
    deleteJamaahData,
  }
})
