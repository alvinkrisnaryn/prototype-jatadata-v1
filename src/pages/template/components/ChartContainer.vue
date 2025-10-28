<script setup>
import { CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/vue'
import { CChartBar } from '@coreui/vue-chartjs'
import {
  allJamaahData,
  statusJamaahData,
  jamaahPerKojaData,
  pekerjaanData,
  chartOptions,
} from '@/data/dashboard-chart'
</script>

<template>
  <CRow>
    <CCol :xs="12" :md="6" class="mb-4">
      <CCard class="h-100">
        <CCardHeader>
          <h5 class="mb-0">Data Semua Jamaah</h5>
        </CCardHeader>
        <CCardBody>
          <CChartBar :data="allJamaahData" :options="chartOptions" />
        </CCardBody>
      </CCard>
    </CCol>

    <CCol :xs="12" :md="6" class="mb-4">
      <CCard class="h-100">
        <CCardHeader>
          <h5 class="mb-0">Data Status Jamaah</h5>
        </CCardHeader>
        <CCardBody>
          <CChartBar :data="statusJamaahData" :options="chartOptions" />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12" :md="6" class="mb-4">
      <CCard class="h-100">
        <CCardHeader>
          <h5 class="mb-0">Data Jamaah per Koja</h5>
        </CCardHeader>
        <CCardBody>
          <CChartBar :data="jamaahPerKojaData" :options="chartOptions" />
        </CCardBody>
      </CCard>
    </CCol>

    <CCol :xs="12" :md="6" class="mb-4">
      <CCard class="h-100">
        <CCardHeader>
          <h5 class="mb-0">Data Pekerjaan Jamaah</h5>
        </CCardHeader>
        <CCardBody>
          <CChartBar :data="pekerjaanData" :options="chartOptions" />
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>
