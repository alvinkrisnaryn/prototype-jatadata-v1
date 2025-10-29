<script setup>
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilOptions, cilPencil, cilTrash } from '@coreui/icons'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits('edit', 'delete')
const columns = [
  { key: 'no', label: 'No', _style: { width: '5%' } },
  { key: 'nama', label: 'Nama', _style: { width: '20%' } },
  { key: 'noTelp', label: 'No Telp', _style: { width: '15%' } },
  { key: 'pekerjaan', label: 'Pekerjaan', _style: { width: '15%' } },
  { key: 'koja', label: 'Koja', _style: { width: '15%' } },
  { key: 'status', label: 'Status', _style: { width: '10%' } },
  { key: 'aksi', label: 'Aksi', _style: { width: '20%' } },
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
        <CTableDataCell>{{ index + 1 }}</CTableDataCell>
        <CTableDataCell class="fw-semibold">{{ item.nama }}</CTableDataCell>
        <CTableDataCell>{{ item.noTelp }}</CTableDataCell>
        <CTableDataCell>{{ item.pekerjaan }}</CTableDataCell>
        <CTableDataCell>{{ item.koja }}</CTableDataCell>
        <CTableDataCell>
          <span
            :class="[
              'badge',
              {
                'bg-success': item.status === 'Aktif',
                'bg-danger': item.status === 'Non-Aktif',
                'bg-info': item.status === 'Baru',
              },
            ]"
          >
            {{ item.status }}
          </span>
        </CTableDataCell>
        <CTableDataCell>
          <CDropdown variant="btn-group">
            <CDropdownToggle color="light" size="sm">
              <CIcon :icon="cilOptions" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem @click="$emit('edit', item)">
                <CIcon :icon="cilPencil" class="me-2" /> Edit
              </CDropdownItem>
              <CDropdownItem @click="$emit('delete', item.id)">
                <CIcon :icon="cilTrash" class="me-2" /> Hapus
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
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
