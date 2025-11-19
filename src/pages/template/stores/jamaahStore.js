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
  const pageNumber = ref(1)
  const pageSize = ref(15)
  const totalPage = ref(0)
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

  async function fetchFilterJamaah(page = 1) {
    try {
      isLoading.value = true

      pageNumber.value = page

      const params = {
        name: filterState.value.name || '',
        kojaId: filterState.value.kojaId || '',
        occupationId: filterState.value.occupationId || '',
        status: getApiValue(statusOptions.value, filterState.value.status) || '',
        page: page - 1,
        size: pageSize.value,
      }

      const response = await searchJamaah(params)
      if (response.responseCode === 200) {
        jamaahData.value = response.data || []

        pageNumber.value = response.pageNumber || 1
        pageSize.value = response.pageSize || 15
        totalPage.value = response.totalPage || 1
        totalData.value = response.totalData || 0
      } else {
        jamaahData.value = []
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat mengambil data dari server.',
        confirmButtonText: 'OK',
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
          title: 'Berhasil',
          text: 'Data Jamaah berhasil ditambahkan',
          confirmButtonText: 'OK',
          timer: 4000,
        })
        fetchFilterJamaah()
        return { success: true, data: response.data }
      }
    } catch (err) {
      const res = err.response?.data

      if (res?.responseCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Anda gagal menambahkan data.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else if (res?.responseCode === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          html: 'Anda bukan Admin!<br>Data harus ditambahkan oleh Admin.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else if (res?.responseCode === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Data yang anda tambahkan sudah ada.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Silakan coba beberapa saat lagi.',
          confirmButtonText: 'OK',
          timer: 4000,
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
          title: 'Berhasil',
          text: 'Data Jamaah berhasil diperbarui',
          confirmButtonText: 'OK',
          timer: 4000,
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
          title: 'Gagal Memperbarui Data',
          html: `
    <div style="margin-bottom: 1rem; font-size: 15px; line-height: 1.5;">
      Beberapa data tidak dapat diproses karena terdapat isian yang tidak valid.
      Silakan cek kembali detail berikut:
    </div>

    <ul style="
      text-align: left;
      padding-left: 18px;
      color: #dc3545;
      margin-bottom: 1rem;
      font-size: 14px;
    ">
      ${formattedErrors.length > 0 ? formattedErrors : `<li>${defaultMessage}</li>`}
    </ul>

    <div style="font-size: 14px; color: #444;">
      Setelah diperbaiki, lakukan penyimpanan ulang.
    </div>
  `,
          confirmButtonText: 'Perbaiki Sekarang',
          customClass: {
            htmlContainer: 'text-start',
          },
        })
      } else if (status === 401 || status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          html: 'Anda bukan Admin!<br>Data harus diperbarui oleh Admin.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Data yang ingin diperbarui tidak ditemukan.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Silakan coba beberapa saat lagi.',
          confirmButtonText: 'OK',
          timer: 4000,
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
          title: 'Peringatan',
          text: 'Data Jamaah tidak ditemukan.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      }
    } catch (error) {
      const status = error.response?.status
      const res = error.response?.data
      singleJamaah.value = null

      if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Data Jamaah tidak ditemukan.',
          confirmButtonText: 'Coba Lagi',
        })
      } else if (status === 401 || status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          html: 'Anda bukan Admin!<br>Data dapat diakses oleh Admin.',
          confirmButtonText: 'Coba Lagi',
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Terjadi kesalahan saat mengambil data dari server.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
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
          title: 'Berhasil',
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
          title: 'Gagal',
          html: 'Anda bukan Admin!<br>Data dapat dihapus oleh Admin.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else if (res?.responseCode === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Data yang ingin hapus tidak ditemukan.',
          confirmButtonText: 'Coba Lagi',
          timer: 4000,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Silakan coba beberapa saat lagi.',
          confirmButtonText: 'OK',
          timer: 4000,
        })
      }
      throw err
    }
  }

  function setPage(page) {
    fetchFilterJamaah(page)
  }

  return {
    // State
    jamaahData,
    singleJamaah,
    isLoading,
    isDetailLoading,
    pageNumber,
    pageSize,
    totalPage,
    totalData,
    setPage,
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
