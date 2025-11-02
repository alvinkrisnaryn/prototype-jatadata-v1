<script setup>
import { ref, onMounted, watch } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { CRow, CCol, CCard, CButton } from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilPlus } from '@coreui/icons'
import Swal from 'sweetalert2'

import JamaahTable from '@/pages/dashboard/jamaah-management/JamaahTable.vue'
import JamaahFilters from '@/pages/dashboard/jamaah-management/JamaahFilters.vue'
import ModalJamaah from '@/pages/dashboard/jamaah-management/ModalJamaah.vue'

import { searchJamaah } from '@/api/jamaah'

const jamaahData = ref([])
const isLoading = ref(true)
const totalElement = ref(0)
const currentPage = ref(0)
const pageSize = ref(0)

const filterState = ref({
  name: '',
  kojaName: '',
  occupationName: '',
  status: '',
})

const fetchJamaahData = async () => {
  try {
    isLoading.value = true
    const params = {
      name: filterState.value.name || null,
      kojaId: filterState.value.kojaId || null,
      occupationId: filterState.value.occupationId || null,
      status: filterState.value.status || null,
      page: currentPage.value,
      size: pageSize.value,
    }

    const response = await searchJamaah(params)
    if (response.responseCode === 200) {
      jamaahData.value = response.data?.content || response.data || []
      totalElement.value = response.data?.totalElements || jamaahData.value.length
    } else {
      jamaahData.value = []
      totalElement.value = 0
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

watch(filterState, () => {
  currentPage.value = 0
  fetchJamaahData()
})

const modalVisible = ref(false)
const isEditMode = ref(false)
const currentJamaah = ref(null)

const handleOpenModal = (mode, data = null) => {
  isEditMode.value = mode === 'edit'
  currentJamaah.value = data
  modalVisible.value = true
}

const handleSaveJamaah = async (newJamaahData) => {
  try {
    if (isEditMode.value) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Jamaah berhasil diperbarui',
      })
    } else {
      await addJamaah(newJamaahData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Jamaah berhasil ditambahkan',
      })
      fetchJamaahData()
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan',
      text: 'Pastikan data valid atau server tidak bermasalah.',
    })
  } finally {
    modalVisible.value = false
  }
}

const handleDeleteJamaah = async (id) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Anda yakin menghapus data ini?',
    text: 'Data jaamaah yang dihapus tidak dapat dikembalikan!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    jamaahData.value = jamaahData.value.filter((j) => j.id !== id)
    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Data Jamaah berhasil dihapus.',
      confirmButtonText: 'OK',
    })
  }
}

onMounted(() => {
  fetchJamaahData()
})
</script>

<template>
  <DashboardLayout>
    <CRow class="mb-3">
      <CCol :xs="12">
        <CCard class="p-4 shadow-sm">
          <CRow class="g-3 mb-3">
            <CCol :xs="12">
              <JamaahFilters
                @update:filters="filterState = $event"
                :current-filters="filterState"
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol :xs="12" class="text-end">
              <CButton @click="handleOpenModal('add')" class="px-3 mb-3 btn-tambah-jamaah">
                <CIcon :icon="cilPlus" class="me-1" /> Tambah Jamaah
              </CButton>
            </CCol>
          </CRow>

          <JamaahTable
            v-if="!isLoading"
            :data="jamaahData"
            @edit="(data) => handleOpenModal('edit', data)"
            @delete="handleDeleteJamaah"
          />
          <div v-else class="text-center py-5 text-muted">Memuat data jamaah...</div>
        </CCard>
      </CCol>
    </CRow>

    <ModalJamaah
      :visible="modalVisible"
      :is-edit="isEditMode"
      :initial-data="currentJamaah"
      @update:visible="modalVisible = $event"
      @save="handleSaveJamaah"
    />
  </DashboardLayout>
</template>

<style scoped>
.btn-tambah-jamaah,
.btn-tambah-jamaah:active,
.btn-tambah-jamaah:focus,
.btn-tambah-jamaah:disabled,
.btn-tambah-jamaah:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-tambah-jamaah:hover {
  background-color: #0069d9;
  color: rgba(235, 235, 235, 0.897);
}
</style>
