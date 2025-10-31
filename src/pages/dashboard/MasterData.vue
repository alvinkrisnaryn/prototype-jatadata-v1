<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { CRow, CCol, CCard, CButton } from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilPlus } from '@coreui/icons'
import Swal from 'sweetalert2'

import MasterTable from '@/pages/dashboard/master-data/MasterTabel.vue'
import MasterFilters from '@/pages/dashboard/master-data/MasterFilters.vue'
import ModalMaster from '@/pages/dashboard/master-data/ModalMaster.vue'

const masterData = ref([
  {
    id: 1,
    nama: 'Ahmad Nuril Huda',
    email: 'nuril021@gmail.com',
    role: 'Koor Cabang',
    cabang: 'Bekasi',
    koja: 'Kecapi',
  },
  {
    id: 2,
    nama: 'Frendi Ar Rahman',
    email: 'fren321@gmail.com',
    role: 'Koor Koja',
    cabang: 'Bekasi',
    koja: 'Kecapi',
  },
  {
    id: 3,
    nama: 'Alvin Krisna',
    email: 'krisna321@gmail.com',
    role: 'Koor Cabang',
    cabang: 'Jakarta',
    koja: 'Koja C',
  },
  {
    id: 4,
    nama: 'Ibnu Sodik',
    email: 'sodik021@gmail.com',
    role: 'Koor Koja',
    cabang: 'Jakarta',
    koja: 'Koja B',
  },
  {
    id: 5,
    nama: 'Haidar Akbar',
    email: 'Haidar234@gmail.com',
    role: 'Koor Cabang',
    cabang: 'Jakarta',
    koja: 'Koja A',
  },
])

const filterState = ref({
  searchTerm: '',
  role: 'Semua Role',
  cabang: 'Semua Cabang',
  koja: 'Semua Koja',
})

const modalVisible = ref(false)
const isEditMode = ref(false)
const currentMaster = ref(null)

const filteredMaster = computed(() => {
  return masterData.value.filter((master) => {
    const term = filterState.value.searchTerm.toLowerCase()
    const emailMatch = master.email.toLowerCase().includes(term)

    const roleMatch =
      filterState.value.role === 'Semua Role' || master.role === filterState.value.role

    const cabangMatch =
      filterState.value.cabang === 'Semua Cabang' || master.cabang === filterState.value.cabang

    const kojaMatch =
      filterState.value.koja === 'Semua Koja' || master.koja === filterState.value.koja

    return emailMatch && roleMatch && cabangMatch && kojaMatch
  })
})

const handleOpenModal = (mode, data = null) => {
  isEditMode.value = mode === 'edit'
  currentMaster.value = data
  modalVisible.value = true
}

const handleSaveMaster = (newMasterData) => {
  if (isEditMode.value) {
    const index = masterData.value.findIndex((u) => u.id === newMasterData.id)
    if (index !== -1) {
      masterData.value[index] = { ...masterData.value[index], ...newMasterData }
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Koordinator berhasil diperbarui',
        confirmButtonText: 'OK',
      })
    }
  } else {
    newMasterData.id = Date.now()
    masterData.value.push(newMasterData)
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data Koordinator berhasil diperbarui',
      confirmButtonText: 'OK',
    })
  }
  modalVisible.value = false
}

const handleDeleteMaster = async (id) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Anda yakin menghapus data ini?',
    text: 'Data Koordinator yang dihapus tidak dapat dikembalikan!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    masterData.value = masterData.value.filter((u) => u.id !== id)
    Swal.fire({
      icon: 'success',
      title: 'Dihapus!',
      text: 'Data Koordinator berhasil dihapus.',
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
              <MasterFilters
                @update:filters="filterState = $event"
                :current-filters="filterState"
              />
            </CCol>
          </CRow>

          <CRow>
            <CCol :xs="12" class="text-end">
              <CButton @click="handleOpenModal('add')" class="px-3 mb-3 btn-tambah-koor">
                <CIcon :icon="cilPlus" class="me-1" /> Tambah Koordinator
              </CButton>
            </CCol>
          </CRow>

          <MasterTable
            :data="filteredMaster"
            @edit="(data) => handleOpenModal('edit', data)"
            @delete="handleDeleteMaster"
          />
        </CCard>
      </CCol>
    </CRow>

    <ModalMaster
      :visible="modalVisible"
      :is-edit="isEditMode"
      :initial-data="currentMaster"
      @update:visible="modalVisible = $event"
      @save="handleSaveMaster"
    />
  </DashboardLayout>
</template>

<style scoped>
.btn-tambah-koor,
.btn-tambah-koor:active,
.btn-tambah-koor:focus,
.btn-tambah-koor:disabled,
.btn-tambah-koor:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-tambah-koor:hover {
  background-color: #0069d9;
  color: rgba(235, 235, 235, 0.897);
}
</style>
