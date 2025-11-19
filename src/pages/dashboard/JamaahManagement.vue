<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { CRow, CCol, CCard, CButton, CPagination, CPaginationItem } from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilPlus } from '@coreui/icons'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

import JamaahTable from '@/pages/dashboard/jamaah-management/JamaahTable.vue'
import JamaahFilters from '@/pages/dashboard/jamaah-management/JamaahFilters.vue'
import ModalJamaah from '@/pages/dashboard/jamaah-management/ModalJamaah.vue'

import { useJamaahStore } from '@/pages/template/stores/jamaahStore'

const store = useJamaahStore()
const router = useRouter()

const { jamaahData, isLoading, pageNumber, totalPage } = storeToRefs(store)
const { fetchFilterJamaah, deleteJamaahData, setPage } = store

const modalVisible = ref(false)
const isEditMode = ref(false)
const currentJamaah = ref(null)

const handleOpenModal = (mode, data = null) => {
  isEditMode.value = mode === 'edit'
  currentJamaah.value = data
  modalVisible.value = true
}

const handleViewDetail = (id) => {
  router.push({ name: 'JamaahDetail', params: { id } })
}

const handleDeleteJamaah = async (id) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Anda yakin menghapus data ini?',
    text: 'Data Jamaah yang dihapus tidak dapat dikembalikan!',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      await deleteJamaahData(id)
    } catch (error) {}
  }
}

onMounted(() => {
  fetchFilterJamaah()
})
</script>

<template>
  <DashboardLayout>
    <CRow class="mb-3">
      <CCol :xs="12">
        <CCard class="p-4 shadow-sm">
          <CRow class="g-3 mb-3">
            <CCol :xs="12">
              <JamaahFilters />
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
            :page-number="pageNumber"
            :page-size="15"
            @edit="handleOpenModal('edit', $event)"
            @delete="handleDeleteJamaah"
            @view-detail="handleViewDetail"
          />
          <div v-else class="text-center py-5 text-muted">Memuat data jamaah...</div>

          <CRow v-if="totalPage > 1" class="mt-4">
            <CCol :xs="12">
              <CPagination align="center" aria-label="Page navigation">
                <CPaginationItem :disabled="pageNumber === 1" @click="setPage(pageNumber - 1)">
                  &laquo;
                </CPaginationItem>

                <CPaginationItem
                  v-for="p in totalPage"
                  :key="p"
                  :active="p === pageNumber"
                  @click="setPage(p)"
                >
                  {{ p }}
                </CPaginationItem>

                <CPaginationItem
                  :disabled="pageNumber === totalPage"
                  @click="setPage(pageNumber + 1)"
                >
                  &raquo;
                </CPaginationItem>
              </CPagination>
              <div class="text-center small text-muted mt-2">
                Halaman {{ pageNumber }} dari {{ totalPage }}
              </div>
            </CCol>
          </CRow>
        </CCard>
      </CCol>
    </CRow>

    <ModalJamaah
      :visible="modalVisible"
      :is-edit="isEditMode"
      :initial-data="currentJamaah"
      @update:visible="modalVisible = $event"
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
