<script setup>
import { ref, onMounted, watch } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { CRow, CCol, CCard, CButton, CPagination } from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilPlus } from '@coreui/icons'
import Swal from 'sweetalert2'

import JamaahTable from '@/pages/dashboard/jamaah-management/JamaahTable.vue'
import JamaahFilters from '@/pages/dashboard/jamaah-management/JamaahFilters.vue'
import ModalJamaah from '@/pages/dashboard/jamaah-management/ModalJamaah.vue'

import { searchJamaah } from '@/api/jamaah'

const jamaahData = ref([])
const isLoading = ref(true)
const totalData = ref(0)
const currentPage = ref(1)
const pageSize = ref(15)
const totalPage = ref(1)

const filterState = ref({
  name: '',
  kojaId: '',
  occupationId: '',
  status: '',
})

const fetchJamaahData = async () => {
  try {
    isLoading.value = true
    const params = {
      name: filterState.value.name || '',
      kojaId: filterState.value.kojaId || '',
      occupationId: filterState.value.occupationId || '',
      status: filterState.value.status || '',
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
    }

    const response = await searchJamaah(params)
    if (response.responseCode === 200) {
      jamaahData.value = response.data?.content || response.data || []
      totalData.value = response.data?.totalData || jamaahData.value.length
      totalPage.value = response.data?.totalPage || 1
      currentPage.value = response.data?.pageNumber || 1
    } else {
      jamaahData.value = []
      totalData.value = 0
      totalPage.value = 1
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

const refreshJamaahList = async () => {
  await fetchJamaahData()
}

watch(filterState, () => {
  currentPage.value = 1
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

const handleSaveJamaah = async () => {
  try {
    await refreshJamaahList()
  } catch (error) {
    console.error('Gagal memperbarui daftar jamaah:', error)
  } finally {
    modalVisible.value = false
  }
}

const handleDeleteJamaah = async (id) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Anda yakin menghapus data ini?',
    text: 'Data jamaah yang dihapus tidak dapat dikembalikan!',
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
          <CPagination align="center" class="mt-3">
            <CPaginationItem
              v-for="page in totalPage"
              :key="page"
              :active="page === currentPage + 1"
              @click="
                () => {
                  currentPage.valueOf = page - 1
                  fetchJamaahData()
                }
              "
            >
              {{ page }}
            </CPaginationItem>
          </CPagination>
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
