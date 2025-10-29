<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { CRow, CCol, CCard, CButton } from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilPlus } from '@coreui/icons'
import Swal from 'sweetalert2'

import JamaahTable from '@/pages/dashboard/jamaah-management/JamaahTable.vue'
import JamaahFilters from '@/pages/dashboard/jamaah-management/JamaahFilters.vue'
import ModalJamaah from '@/pages/dashboard/jamaah-management/ModalJamaah.vue'

const jamaahData = ref([
  {
    id: 1,
    nama: 'Budi Sudarsono',
    noTelp: '082392839284',
    pekerjaan: 'Swasta',
    koja: 'Koja A',
    status: 'Aktif',
  },
  {
    id: 2,
    nama: 'Siti Rahayu',
    noTelp: '082392839234',
    pekerjaan: 'Petani',
    koja: 'Koja B',
    status: 'Non-Aktif',
  },
  {
    id: 3,
    nama: 'Agus Salim',
    noTelp: '082392549284',
    pekerjaan: 'Mahasiswa',
    koja: 'Koja C',
    status: 'Baru',
  },
  {
    id: 4,
    nama: 'Mamat Maliki',
    noTelp: '082393459284',
    pekerjaan: 'Polisi',
    koja: 'Koja C',
    status: 'Aktif',
  },
  {
    id: 5,
    nama: 'Joko Mulyono',
    noTelp: '082322149284',
    pekerjaan: 'Presiden',
    koja: 'Koja A',
    status: 'Non-Aktif',
  },
])

const filterState = ref({
  searchTerm: '',
  koja: 'Semua Koja',
  pekerjaan: 'Semua Pekerjaan',
  status: 'Semua Status',
})

const modalVisible = ref(false)
const isEditMode = ref(false)
const currentJamaah = ref(null)

const filteredJamaah = computed(() => {
  return jamaahData.value.filter((jamaah) => {
    const term = filterState.value.searchTerm.toLowerCase()
    const nameMatch = jamaah.nama.toLowerCase().includes(term)

    const kojaMatch =
      filterState.value.koja === 'Semua Koja' || jamaah.koja === filterState.value.koja

    const pekerjaanMatch =
      filterState.value.pekerjaan === 'Semua Pekerjaan' ||
      jamaah.pekerjaan === filterState.value.pekerjaan

    const statusMatch =
      filterState.value.status === 'Semua Status' || jamaah.status === filterState.value.status

    return nameMatch && kojaMatch && pekerjaanMatch && statusMatch
  })
})

const handleOpenModal = (mode, data = null) => {
  isEditMode.value = mode === 'edit'
  currentJamaah.value = data
  modalVisible.value = true
}

const handleSaveJamaah = (newJamaahData) => {
  if (isEditMode.value) {
    const index = jamaahData.value.findIndex((j) => j.id === newJamaahData.id)
    if (index !== -1) {
      jamaahData.value[index] = newJamaahData
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Jamaah berhasil diperbarui',
        confirmButtonText: 'OK',
      })
    }
  } else {
    newJamaahData.id = Date.now()
    jamaahData.value.push(newJamaahData)
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data Jamaah berhasil diperbarui',
      confirmButtonText: 'OK',
    })
  }
  modalVisible.value = false
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
              <CButton color="primary" @click="handleOpenModal('add')" class="px-3 mb-3">
                <CIcon :icon="cilPlus" class="me-1" /> Tambah Jamaah
              </CButton>
            </CCol>
          </CRow>

          <JamaahTable
            :data="filteredJamaah"
            @edit="(data) => handleOpenModal('edit', data)"
            @delete="handleDeleteJamaah"
          />
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
