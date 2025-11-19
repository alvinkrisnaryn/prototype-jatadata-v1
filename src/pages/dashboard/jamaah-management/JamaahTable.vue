<script setup>
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilPencil, cilTrash, cilMagnifyingGlass } from '@coreui/icons'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  pageNumber: Number,
  pageSize: Number,
})

const emit = defineEmits(['edit', 'delete', 'view-detail'])
const columns = [
  { key: 'no', label: 'No', _style: { width: '5%' } },
  { key: 'name', label: 'Nama', _style: { width: '25%' } },
  { key: 'phoneNumber', label: 'No. Telepon', _style: { width: '15%' } },
  { key: 'occupationName', label: 'Pekerjaan', _style: { width: '20%' } },
  { key: 'kojaName', label: 'Koja', _style: { width: '10%' } },
  { key: 'status', label: 'Status', _style: { width: '15%' } },
  { key: 'aksi', label: 'Aksi', _style: { width: '15%' } },
]
</script>

<template>
  <CTable responsive striped hover class="table-bordered">
    <CTableHead color="dark" class="table-header-custom">
      <CTableRow class="text-center">
        <CTableHeaderCell v-for="column in columns" :key="column.key" :style="column._style">
          {{ column.label }}
        </CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      <CTableRow v-for="(item, index) in data" :key="item.id" class="text-center">
        <CTableDataCell>{{ (props.pageNumber - 1) * props.pageSize + (index + 1) }}</CTableDataCell>
        <CTableDataCell class="fw-semibold">{{ item.name }}</CTableDataCell>
        <CTableDataCell>{{ item.phoneNumber }}</CTableDataCell>
        <CTableDataCell>{{ item.occupation?.name }}</CTableDataCell>
        <CTableDataCell>{{ item.koja?.name }}</CTableDataCell>
        <CTableDataCell>
          <span
            :class="[
              'badge',
              {
                'bg-success': item.status === 'MEMBER',
                'bg-danger': item.status === 'NON_MEMBER',
              },
            ]"
          >
            {{ item.status === 'MEMBER' ? 'Jamaah' : 'Non Jamaah' }}
          </span>
        </CTableDataCell>
        <CTableDataCell class="d-flex justify-content-center gap-2">
          <CButton
            color="primary"
            size="sm"
            @click="emit('view-detail', item.id)"
            title="Lihat Detail"
          >
            <CIcon :icon="cilMagnifyingGlass" />
          </CButton>
          <CButton color="info" size="sm" @click="emit('edit', item)">
            <CIcon :icon="cilPencil" />
          </CButton>
          <CButton color="danger" size="sm" @click="emit('delete', item.id)">
            <CIcon :icon="cilTrash" />
          </CButton>
        </CTableDataCell>
      </CTableRow>
      <CTableRow v-if="data.length === 0">
        <CTableDataCell colspan="7" class="text-center text-muted">
          Tidak ada data jamaah yang ditemukan
        </CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>

<style scoped>
.table-header-custom {
  border-bottom: 3px solid var(--cui-border-color, #dee2e6);
}

.text-start {
  text-align: left !important;
}
</style>
