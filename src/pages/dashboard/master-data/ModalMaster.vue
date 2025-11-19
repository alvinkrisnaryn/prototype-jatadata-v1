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
const title = computed(() => (props.isEdit ? 'Edit Data Koordinator' : 'Tambah Data Koordinator'))
const buttonText = computed(() => (props.isEdit ? 'Simpan Perubahan' : 'Tambah Koordinator'))

const initialValues = ref({})

const passwordSchema = yup
  .string()
  .required('Password wajib diisi')
  .min(8, 'Minimal 8 karakter')
  .matches(/[A-Z]/, 'Harus ada huruf besar')
  .matches(/[a-z]/, 'Harus ada huruf kecil')
  .matches(/[0-9]/, 'Harus ada angka')
  .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Harus ada karakter spesial')

const schema = computed(() => {
  const baseSchema = {
    nama: yup.string().required('Nama wajib diisi'),
    email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
    role: yup.string().required('Role wajib diisi'),
    cabang: yup.string().required('Cabang wajib diisi'),
    koja: yup.string().required('Koja wajib diisi'),
  }

  if (!props.isEdit) {
    baseSchema.password = passwordSchema
  } else {
    baseSchema.password = yup
      .string()
      .optional()
      .test({
        name: 'password-if-filled',
        test(value) {
          if (value) {
            return passwordSchema.isValidSync(value)
          }
          return value
        },
        message:
          'Password tidak memenuhi kriteria (minimal 8 karakter, ada huruf besar/kecil, angka, simbol)',
      })
  }
  return yup.object(baseSchema)
})

watch(
  () => props.initialData,
  (newVal) => {
    if (props.isEdit && newVal) {
      initialValues.value = { ...newVal, password: '' }
    } else {
      initialValues.value = {
        nama: '',
        email: '',
        password: '',
        role: 'Koor Koja',
        cabang: 'Bekasi',
        koja: 'Kecapi',
      }
    }
  },
  { immediate: true },
)

const closeModal = () => {
  emit('update:visible', false)
}

const onSubmit = (values) => {
  if (!props.isEdit && !values.password) {
    delete values.password
  }

  emit('save', values)

  if (!props.isEdit) {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data Koordinator berhasil ditambahkan',
      confirmButtonText: 'OK',
    })
  }
  closeModal()
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
          <CCol :md="4" class="mb-3">
            <CFormLabel for="nama">Nama</CFormLabel>
            <Field name="nama" v-slot="{ field }">
              <CFormInput v-bind="field" id="nama" placeholder="Masukkan Nama" />
            </Field>
            <ErrorMessage name="nama" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="4" class="mb-3">
            <CFormLabel for="email">Email</CFormLabel>
            <Field name="email" v-slot="{ field }">
              <CFormInput v-bind="field" id="email" type="email" placeholder="Masukkan Email" />
            </Field>
            <ErrorMessage name="email" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="4" class="mb-3">
            <CFormLabel for="password">Password {{ isEdit ? '(Kosongkan jika )' : '' }}</CFormLabel>
            <Field name="password" v-slot="{ field }">
              <CFormInput
                v-bind="field"
                id="password"
                type="password"
                placeholder="Masukkan Password"
              />
            </Field>
            <ErrorMessage name="password" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="4" class="mb-3">
            <CFormLabel for="role">Role</CFormLabel>
            <Field name="role" v-slot="{ field }">
              <CFormSelect v-bind="field" id="role">
                <option value="" disabled>Pilih Role</option>
                <option value="Koor Cabang">Koor Cabang</option>
                <option value="Koor Koja">Koor Koja</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="pekerjaan" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="4" class="mb-3">
            <CFormLabel for="cabang">Cabang</CFormLabel>
            <Field name="cabang" v-slot="{ field }">
              <CFormSelect v-bind="field" id="cabang">
                <option value="" disabled>Pilih Cabang</option>
                <option value="Bekasi">Bekasi</option>
                <option value="Jakarta">Jakarta</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="cabang" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="4" class="mb-3">
            <CFormLabel for="koja">Koja</CFormLabel>
            <Field name="koja" v-slot="{ field }">
              <CFormSelect v-bind="field" id="koja">
                <option value="" disabled>Pilih Koja</option>
                <option value="Koja A">Koja A</option>
                <option value="Koja B">Koja B</option>
                <option value="Koja C">Koja C</option>
                <option value="Koja D">Koja D</option>
                <option value="Kecapi">Kecapi</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="koja" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton class="btn-batal" @click="closeModal">Kembali</CButton>
        <CButton class="btn-tambah-koor" type="submit">{{ buttonText }}</CButton>
      </CModalFooter>
    </Form>
  </CModal>
</template>

<style scoped>
.btn-tambah-koor,
.btn-tambah-koor:active,
.btn-tambah-koor:focus,
.btn-tambah-koor:disabled,
.btn-tambah-koor:not(:disabled):not(:disabled):active {
  background-color: #007bff;
  color: #fff;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-tambah-koor:hover {
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
