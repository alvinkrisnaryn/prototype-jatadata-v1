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

import { getAllOccupation } from '@/api/occupations'
import { getAllKoja } from '@/api/koja'
import { getAllCabang } from '@/api/cabang'
import { addJamaah } from '@/api/jamaah'

const props = defineProps({
  visible: Boolean,
  isEdit: Boolean,
  initialData: Object,
})

const emit = defineEmits(['update:visible', 'save'])
const title = computed(() => (props.isEdit ? 'Edit Data Jamaah' : 'Tambah Data Jamaah'))
const buttonText = computed(() => (props.isEdit ? 'Simpan Perubahan' : 'Tambah Jamaah'))
const initialValues = ref({})
const hasLoadedOptions = ref(false)

const occupationOptions = ref([{ value: '', label: 'Semua Pekerjaan' }])
const kojaOptions = ref([{ value: '', label: 'Semua Koja' }])
const cabangOptions = ref([{ value: '', label: 'Semua Cabang' }])
const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'Member', label: 'Jamaah' },
  { value: 'Non Member', label: 'Non Jamaah' },
]

const schema = yup.object({
  name: yup.string().required('Nama wajib diisi'),
  phoneNumber: yup
    .string()
    .required('No. Telepon wajib diisi')
    .matches(/^[0-9]+$/, 'Hanya angka yang diizinkan')
    .min(10, 'Minimal 10 digit'),
  address: yup.string().required('Alamat wajib diisi'),
  birthDate: yup.string().required('Tanggal Lahir wajib diisi'),
  gender: yup.string().required('Jenis Kelamin wajib diisi'),
  status: yup.string().required('Status wajib diisi'),
  occupationName: yup.string().required('Pekerjaan wajib diisi'),
  cabangName: yup.string().required('Cabang wajib diisi'),
  kojaName: yup.string().required('Koja wajib diisi'),
})

watch(
  () => props.initialData,
  (newVal) => {
    if (props.isEdit && newVal) {
      initialValues.value = { ...newVal }
    } else {
      initialValues.value = {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthDate: '',
        gender: '',
      }
    }
  },
  { immediate: true },
)

const loadOccupationOptions = async () => {
  try {
    const data = await getAllOccupation()
    if (Array.isArray(data) && data.length > 0) {
      occupationOptions.value = [
        { value: '', label: 'Semua Pekerjaan' },
        ...data.map((p) => ({
          value: p.id,
          label: `${p.name}`,
        })),
      ]
    }
  } catch (error) {
    console.error('Gagal memuat data pekerjaan', error)
  }
}

const loadCabangOptions = async () => {
  try {
    const data = await getAllCabang()
    if (Array.isArray(data) && data.length > 0) {
      cabangOptions.value = [
        { value: '', label: 'Semua Cabang' },
        ...data.map((c) => ({
          value: c.uuid,
          label: `${c.name}`,
        })),
      ]
    }
  } catch (error) {
    console.error('Gagal memuat data cabang', error)
  }
}

const loadKojaOptions = async () => {
  try {
    const data = await getAllKoja()
    if (Array.isArray(data) && data.length > 0) {
      kojaOptions.value = [
        { value: '', label: 'Semua Koja' },
        ...data.map((k) => ({
          value: k.uuid,
          label: `${k.name}`,
        })),
      ]
    }
  } catch (error) {
    console.error('Gagal memuat data koja', error)
  }
}

watch(
  () => props.visible,
  async (val) => {
    if (val && !hasLoadedOptions.value) {
      await Promise.all([loadOccupationOptions(), loadCabangOptions(), loadKojaOptions()])
      hasLoadedOptions.value = true
    }
  },
)

const onSubmit = async (values) => {
  try {
    const payload = {
      memberName: values.name,
      memberEmail: values.email,
      memberNumberPhone: values.phoneNumber,
      memberAddress: values.address,
      memberBirthDate: values.birthDate,
      memberGender: values.gender,
      memberStatus: values.status,
      occupationId: values.occupationName,
      cabangId: values.cabangName,
      kojaId: values.kojaName,
    }

    const response = await addJamaah(payload)
    if (response.responseCode === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data Jamaah berhasil ditambahkan',
        confirmButtonText: 'OK',
      })
      emit('save', response.data)
      closeModal()

      initialValues.value = {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthDate: '',
        gender: '',
        status: 'MEMBER',
        occupationName: '',
        cabangName: '',
        kojaName: '',
      }
    }
  } catch (err) {
    const res = err.response?.data

    if (res?.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        html: 'Anda gagal menambahkan data.',
        confirmButtonText: 'Coba Lagi',
      })
    } else if (res?.responseCode === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Anda bukan Admin!',
        html: 'Data harus ditambahkan oleh Admin.',
        confirmButtonText: 'Coba Lagi',
      })
    } else if (res?.responseCode === 409) {
      Swal.fire({
        icon: 'error',
        title: 'Data Tersedia!',
        html: 'Data yang anda tambahkan sudah ada.',
        confirmButtonText: 'Coba Lagi',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: 'Silakan coba beberapa saat lagi.',
      })
    }
  }
}

const closeModal = () => {
  emit('update:visible', false)
}
</script>

<template>
  <CModal :visible="visible" @close="closeModal" backdrop="static" size="xl">
    <CModalHeader>
      <CModalTitle>{{ title }}</CModalTitle>
    </CModalHeader>

    <Form @submit="onSubmit" :validation-schema="schema" :initial-values="initialValues">
      <CModalBody>
        <CRow>
          <CCol :md="12" class="mb-3">
            <CFormLabel for="name">Nama Jamaah</CFormLabel>
            <Field name="name" v-slot="{ field }">
              <CFormInput v-bind="field" id="name" placeholder="Nama lengkap" />
            </Field>
            <ErrorMessage name="name" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="6" class="mb-3">
            <CFormLabel for="gender">Jenis Kelamin</CFormLabel>
            <Field name="gender" v-slot="{ field }">
              <CFormSelect v-bind="field" id="gender">
                <option value="" disabled>Pilih Gender</option>
                <option value="Male">Laki-laki</option>
                <option value="Female">Perempuan</option>
              </CFormSelect>
            </Field>
            <ErrorMessage name="gender" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="6" class="mb-3">
            <CFormLabel for="birthDate">Tanggal Lahir</CFormLabel>
            <Field name="birthDate" v-slot="{ field }">
              <CFormInput v-bind="field" id="birthDate" type="date" />
            </Field>
            <ErrorMessage name="birthDate" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="12" class="mb-3">
            <CFormLabel for="address">Alamat</CFormLabel>
            <Field name="address" v-slot="{ field }">
              <CFormInput v-bind="field" id="address" placeholder="Alamat Lengkap" />
            </Field>
            <ErrorMessage name="address" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="6" class="mb-3">
            <CFormLabel for="email">Email</CFormLabel>
            <Field name="email" v-slot="{ field }">
              <CFormInput v-bind="field" id="email" placeholder="Email" />
            </Field>
            <ErrorMessage name="email" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="6" class="mb-3">
            <CFormLabel for="phoneNumber">No. Telepon</CFormLabel>
            <Field name="phoneNumber" v-slot="{ field }">
              <CFormInput v-bind="field" id="phoneNumber" placeholder="Contoh: 0812xxxxxxx" />
            </Field>
            <ErrorMessage name="phoneNumber" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="6" class="mb-3">
            <CFormLabel for="occupationName">Pekerjaan</CFormLabel>
            <Field name="occupationName" v-slot="{ field }">
              <CFormSelect
                v-bind="field"
                id="occupationName"
                :options="occupationOptions"
                aria-label="Pilih Pekerjaan"
              />
            </Field>
            <ErrorMessage name="occupationName" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="6" class="mb-3">
            <CFormLabel for="status">Status</CFormLabel>
            <Field name="status" v-slot="{ field }">
              <CFormSelect
                v-bind="field"
                id="status"
                :options="statusOptions"
                aria-label="Pilih Status"
              />
            </Field>
            <ErrorMessage name="status" class="d-block text-danger small m-1" />
          </CCol>
        </CRow>

        <CRow>
          <CCol :md="6" class="mb-3">
            <CFormLabel for="cabangName">Cabang</CFormLabel>
            <Field name="cabangName" v-slot="{ field }">
              <CFormSelect
                v-bind="field"
                id="cabangName"
                :options="cabangOptions"
                aria-label="Pilih Cabang"
              />
            </Field>
            <ErrorMessage name="cabangName" class="d-block text-danger small m-1" />
          </CCol>

          <CCol :md="6" class="mb-3">
            <CFormLabel for="kojaName">Koja</CFormLabel>
            <Field name="kojaName" v-slot="{ field }">
              <CFormSelect
                v-bind="field"
                id="kojaName"
                :options="kojaOptions"
                aria-label="Pilih Koja"
              />
            </Field>
            <ErrorMessage name="kojaName" class="d-block text-danger small m-1" />
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
