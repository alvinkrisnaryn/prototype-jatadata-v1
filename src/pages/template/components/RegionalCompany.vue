<script setup>
import { CCard, CCardBody, CRow, CCol, CListGroup, CListGroupItem } from '@coreui/vue'
import { regionalSummary } from '@/data/dashboard-chart'

const totalAreaJamaah =
  regionalSummary.jakartaPusat + regionalSummary.jakartaTimur + regionalSummary.bekasi
const getPercentage = (count) => {
  return ((count / totalAreaJamaah) * 100).toFixed(1) + '%'
}
</script>

<template>
  <CCard class="mb-4 regional-card">
    <CCardBody class="p-0">
      <CRow class="g-0">
        <CCol :xs="12" :md="6" class="position-relative">
          <div class="map-visual">
            <img
              src="/foto-jakarta.jpeg"
              alt="Peta Jakarta"
              class="img-fluid w-100 h-100"
              style="object-fit: cover; filter: grayscale(50%); opacity: 0.8"
            />
            <div class="map-overlay">
              <h4 class="text-white fw-bold">Ringkasan Regional (DKI & Bekasi)</h4>
              <p class="text-white-50">{{ regionalSummary.statusMessage }}</p>
            </div>
          </div>
        </CCol>
        <CCol :xs="12" :md="6" class="p-4">
          <h5 class="fw-semibold mb-3">Distribusi Jamaah Berdasarkan Area</h5>
          <CListGroup flush>
            <CListGroupItem class="d-flex justify-content-between align-items-center">
              Jakarta Pusat
              <span class="fw-bold text-primary"
                >{{ regionalSummary.jakartaPusat }} ({{
                  getPercentage(regionalSummary.jakartaPusat)
                }})</span
              >
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between align-items-center">
              Jakarta Timur
              <span class="fw-bold text-success"
                >{{ regionalSummary.jakartaTimur }} ({{
                  getPercentage(regionalSummary.jakartaTimur)
                }})</span
              >
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between align-items-center">
              Bekasi
              <span class="fw-bold text-info"
                >{{ regionalSummary.bekasi }} ({{ getPercentage(regionalSummary.bekasi) }})</span
              >
            </CListGroupItem>
            <CListGroupItem class="d-flex justify-content-between align-items-center bg-light">
              Total Jamaah Area
              <span class="fw-bolder">{{ totalAreaJamaah.toLocaleString('id-ID') }}</span>
            </CListGroupItem>
          </CListGroup>
          <div class="mt-3 small text-muted">
            *Data ini mewakili ringkasan dari Koordinator Jakarta & Bekasi.
          </div>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<style scoped>
.regional-card {
  overflow: hidden;
}

.map-visual {
  height: 300px;
  position: relative;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
}
</style>
