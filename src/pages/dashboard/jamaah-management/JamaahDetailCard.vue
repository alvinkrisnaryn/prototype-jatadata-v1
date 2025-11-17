<script setup>
import { CCard, CCardHeader, CCardBody, CRow, CCol, CListGroup, CListGroupItem } from '@coreui/vue'

const props = defineProps({
  jamaah: {
    type: Object,
    required: true,
  },
})

const formatStatus = (status) => {
  if (status === 'MEMBER') return 'Jamaah'
  if (status === 'NON_MEMBER') return 'Non Jamaah'
  return status
}

const formatGender = (gender) => {
  if (gender === 'MALE') return 'Laki-laki'
  if (gender === 'FEMALE') return 'Perempuan'
  return gender
}
</script>

<template>
  <CCard class="mb-4 shadow-md border-start border-primary border-4">
    <CCardHeader class="fw-bold fs-5 bg-primary text-white">
      <CIcon icon="cil-user" class="me-2" /> Detail Profil Jamaah
    </CCardHeader>
    <CCardBody class="p-4">
      <CRow>
        <CCol :md="6" class="border-end">
          <h6 class="text-primary mb-3">Informasi Jamaah</h6>
          <CListGroup flush>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Nama Lengkap :</span>
              <span class="text-end">{{ jamaah.name || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Jenis Kelamin :</span>
              <span class="text-end">{{ formatGender(jamaah.gender) || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Tanggal Lahir :</span>
              <span class="text-end">{{ jamaah.birthDate || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Pekerjaan :</span>
              <span class="text-end">{{ jamaah.occupation?.name || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold mb-1">Alamat :</span>
              <span class="text-muted small">{{ jamaah.address || '-' }}</span>
            </CListGroupItem>
          </CListGroup>
        </CCol>

        <CCol :md="6">
          <h6 class="text-primary mb-3">Kontak & Keanggotaan</h6>
          <CListGroup flush>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Status :</span>
              <span
                :class="[
                  'badge',
                  {
                    'bg-success': jamaah.status === 'MEMBER',
                    'bg-danger': jamaah.status === 'NON_MEMBER',
                  },
                ]"
              >
                {{ formatStatus(jamaah.status) || '-' }}
              </span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Cabang :</span>
              <span class="text-end">{{ jamaah.cabang?.name || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Koja :</span>
              <span class="text-end">{{ jamaah.koja?.name || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">Email :</span>
              <span class="text-end">{{ jamaah.email || '-' }}</span>
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between py-2">
              <span class="fw-semibold">No. Telepon :</span>
              <span class="text-end">{{ jamaah.phoneNumber || '-' }}</span>
            </CListGroupItem>
          </CListGroup>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>
