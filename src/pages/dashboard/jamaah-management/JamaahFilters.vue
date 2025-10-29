<script setup>
import { CFormInput, CFormSelect, CButton } from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilFilter, cilCloudDownload, cilPrint } from '@coreui/icons'
import { computed } from 'vue'
import Swal from 'sweetalert2'

const props = defineProps({
  currentFilters: Object,
})
const emit = defineEmits(['update:filters'])
const filterOptions = {
  koja: ['Semua Koja', 'Koja A', 'Koja B', 'Koja C', 'Koja D'],
  pekerjaan: ['Semua Pekerjaan', 'Swasta', 'PNS', 'Wiraswasta', 'Mahasiswa', 'Petani'],
  status: ['Semua Status', 'Aktif', 'Non-Aktif', 'Baru'],
}
const filters = computed({
  get: () => props.currentFilters,
  set: (value) => emit('update:filters', value),
})
const updateFilter = (key, value) => {
  filters.value = { ...filters.value, [key]: value }
}
const handleExport = () => {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: 'Data jamaah sedang disiapkan untuk diunduh.',
    confirmButtonText: 'OK',
  })
}
const handlePrint = () => {
  Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: 'Dokumen sedang disiapkan untuk dicetak.',
    confirmButtonText: 'OK',
  })
}
</script>

<template>
  <div class="d-flex flex-nowrap align-items-center gap-2 filter-container">
    <div class="d-flex align-items-center gap-2 flex-shrink-0">
      <CIcon :icon="cilFilter" class="text-muted" size="lg" />
      <div class="position-relative" style="width: 250px">
        <CFormInput
          :value="filters.searchTerm"
          @input="updateFilter('searchTerm', $event.target.value)"
          placeholder="Cari berdasarkan nama"
          class="ps-2"
        />
      </div>
    </div>

    <CFormSelect
      :value="filters.koja"
      @change="updateFilter('koja', $event.target.value)"
      :options="filterOptions.koja"
      class="filter-select"
      aria-label="Filter Koja"
    />

    <CFormSelect
      :value="filters.pekerjaan"
      @change="updateFilter('pekerjaan', $event.target.value)"
      :options="filterOptions.pekerjaan"
      class="filter-select"
      aria-label="Filter Pekerjaan"
    />

    <CFormSelect
      :value="filters.status"
      @change="updateFilter('status', $event.target.value)"
      :options="filterOptions.status"
      class="filter-select"
      aria-label="Filter Status"
    />

    <CButton @click="handleExport" class="btn-icon-adaptive flex-shrink-0">
      <CIcon :icon="cilCloudDownload" />
    </CButton>
    <CButton @click="handlePrint" class="btn-icon-adaptive flex-shrink-0">
      <CIcon :icon="cilPrint" />
    </CButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@coreui/coreui/scss/mixins/color-mode' as *;

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: var(--cui-body-color-tertiary);
  pointer-events: none;
}

.filter-select {
  width: 140px;
}

.btn-icon-adaptive {
  background-color: transparent;
  border: 1px solid var(--cui-border-color);
  color: var(--cui-body-color);

  &:hover {
    background-color: var(--cui-tertiary-bg);
  }
}

@include color-mode(light) {
  .btn-icon-adaptive {
    border-color: var(--cui-border-color-translucent);
    color: var(--cui-body-color);
    background-color: var(--cui-body-bg);

    &:hover {
      background-color: var(--cui-light);
      color: var(--cui-body-color);
    }
  }
}

@include color-mode(dark) {
  .btn-icon-adaptive {
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--cui-body-color);
    background-color: var(--cui-body-bg);

    &:hover {
      background-color: var(--cui-secondary-bg);
      color: #fff;
    }
  }
  .text-muted {
    color: var(--cui-gray-500) !important;
  }
}
</style>
