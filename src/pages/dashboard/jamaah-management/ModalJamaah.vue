<script setup>
import { ref, watch, computed } from 'vue'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import Swal from 'sweetalert2'

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  initialData: Object,
})

const emit = defineEmits(['update:visible', 'save'])
const title = computed(() => (props.isEdit ? 'Edit Data Jamaah' : 'Tambah Data Jamaah'))
const buttonText = computed(() => (props.isEdit ? 'Simpan Perubahan' : 'Tambah Jamaah'))

const initialValues = ref({})

const schema = yup.object({
  nama: yup.string().required('Nama wajib diisi'),
  noTelp: yup
    .string()
    .required('No. Telepon wajib diisi')
    .matches(/^[0-9]+$/, 'Hanya angka yang diizinkan')
    .min(10, 'Minimal 10 digit'),
  pekerjaan: yup.string().required('Pekerjaan wajib diisi'),
  koja: yup.string().required('Koja wajib diisi'),
  status: yup.string().required('Status wajib diisi'),
})

watch(
  () => props.initialData,
  (newVal) => {
    if (props.isEdit && newVal) {
      initialValues.value = { ...newVal }
    } else {
      initialValues.value = {
        nama: '',
        noTelp: '',
        pekerjaan: 'Swasta',
        koja: 'Koja A',
        status: 'Status',
      }
    }
  },
  { immediate: true },
)

const onSubmit = (values) => {
  emit('save', values)

  if (!props.isEdit) {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data Jamaah berhasil ditambahkan',
      confirmButtonText: 'OK',
    })
  }
  closeModal()
}

const closeModal = () => {
  emit('update:visible', false)
}
</script>

<template>
  <CModal :visible="visible" @close="closeModal" backdrop="static" size="lg">
    <CModalHeader>
      <CModalTitle>{{ title }}</CModalTitle>
    </CModalHeader>

    <Form @submit="onSubmit" :validation-schema="schema" :initial-values="initialValues">
      <CModalBody>
        <CRow>
          <CCol :md="6" class="mb-3">
            <CFormLabel for="nama">Nama Jamaah</CFormLabel>
            <Field name="nama" v-slot="{ field }">
              <CFormInput v-bind="field" id="nama" placeholder="Nama lengkap" />
            </Field>
            <ErrorMessage name="nama" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="6" class="mb-3">
            <CFormLabel for="noTelp">No. Telepon</CFormLabel>
            <Field name="noTelp" v-slot="{ field }">
              <CFormInput v-bind="field" id="noTelp" placeholder="Contoh: 0812xxxxxxx" />
            </Field>
            <ErrorMessage name="noTelp" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="6" class="mb-3">
            <CFormLabel for="pekerjaan">Pekerjaan</CFormLabel>
            <Field name="pekerjaan" v-slot="{ field }">
              <CFormSelect v-bind="field" id="pekerjaan">
                <option value="" disabled>Pilih Pekerjaan</option>
                <option value="Swasta">Swasta</option>
                <option value="PNS">PNS</option>
                <option value="Wiraswasta">Wiraswasta</option>
                <option value="Mahasiswa">Mahasiswa</option>
                <option value="Petani">Petani</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="pekerjaan" class="d-block text-danger small m-1" />
          </CCol>

          <CCol>
            <CFormLabel for="koja">Koja</CFormLabel>
            <Field name="koja" v-slot="{ field }">
              <CFormSelect v-bind="field" id="koja">
                <option value="" disabled>Pilih Koja</option>
                <option value="Koja A">Koja A</option>
                <option value="Koja B">Koja B</option>
                <option value="Koja C">Koja C</option>
                <option value="Koja D">Koja D</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="koja" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="12" class="mb-3">
            <CFormLabel for="status">Status</CFormLabel>
            <Field name="status" v-slot="{ field }">
              <CFormSelect v-bind="field" id="status">
                <option value="" disabled>Pilih Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non-Aktif</option>
                <option value="Baru">Baru</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="status" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton class="btn-batal" @click="closeModal">Batal</CButton>
        <CButton class="btn-tambah-jamaah" type="submit">{{ buttonText }}</CButton>
      </CModalFooter>
    </Form>
  </CModal>
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

.btn-batal,
.btn-batal:active,
.btn-batal:focus,
.btn-batal:disabled,
.btn-batal:not(:disabled):not(:disabled):active {
  background-color: #dc3545;
  color: #fff;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-batal:hover {
  background-color: #c82333;
  color: rgba(235, 235, 235, 0.897);
}
</style>
