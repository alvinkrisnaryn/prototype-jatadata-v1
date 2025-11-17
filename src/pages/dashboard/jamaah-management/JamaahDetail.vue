<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { CCard, CCardBody, CRow, CCol, CButton } from '@coreui/vue'
import { cilArrowLeft } from '@coreui/icons'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import JamaahDetailCard from '@/pages/dashboard/jamaah-management/JamaahDetailCard.vue'
import { useJamaahStore } from '@/pages/template/stores/jamaahStore'

const route = useRoute()
const router = useRouter()
const store = useJamaahStore()
const { singleJamaah, isDetailLoading } = storeToRefs(store)
const { showJamaahData } = store

const jamaahId = ref(route.params.id)

const loadData = async (id) => {
  singleJamaah.value = {}
  await showJamaahData(id)
}

onMounted(() => {
  if (jamaahId.value) {
    loadData(jamaahId.value)
  }
})

const goBack = () => {
  router.push({ name: 'JamaahManagement' })
}
</script>

<template>
  <DashboardLayout>
    <CRow class="mb-3">
      <CCol :xs="12">
        <CButton color="secondary" @click="goBack" class="mb-3 btn-kembali">
          <CIcon :icon="cilArrowLeft" class="me-1" /> Kembali
        </CButton>
        <CCard class="p-4 shadow-sm">
          <CCardBody class="p-0">
            <h4 class="mb-4 fw-semibold">Detail Jamaah: {{ singleJamaah?.name || 'Memuat...' }}</h4>

            <div v-if="isDetailLoading" class="text-center py-5 text-muted">
              Memuat detail data jamaah...
            </div>
            <div v-else-if="singleJamaah">
              <JamaahDetailCard :jamaah="singleJamaah" />
            </div>
            <div v-else class="text-center py-5 text-muted">Data jamaah tidak ditemukan.</div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </DashboardLayout>
</template>

<style scoped>
.btn-kembali {
  background-color: #6c757d;
  color: #fff;
  border-color: #6c757d;
}
</style>
