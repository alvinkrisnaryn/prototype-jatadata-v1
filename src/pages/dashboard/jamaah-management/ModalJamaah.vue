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

import { storeToRefs } from 'pinia'
import { useJamaahStore } from '@/pages/template/stores/jamaahStore'

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
const isSubmitting = ref(false)

const store = useJamaahStore()
const { occupationOptions, kojaOptions, cabangOptions, statusOptions, genderOptions } =
  storeToRefs(store)
const { loadOccupationOptions, loadCabangOptions, loadKojaOptions, addJamaahData, editJamaahData } =
  store

const findOptionValue = (options, apiValue, isApiValueLookup = false) => {
  if (!apiValue) return ''

  if (isApiValueLookup) {
    const found = options.find((opt) => opt.apiValue === apiValue)
    return found ? found.value : ''
  } else {
    const found = options.find((opt) => opt.label === apiValue)
    return found ? found.value : ''
  }
}

const findByLabel = (options, label) => {
  const option = options.find((opt) => opt.label === label)
  return option ? option.value : ''
}

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
      initialValues.value = {
        name: newVal.name || '',
        email: newVal.email || '',
        phoneNumber: newVal.phoneNumber || '',
        address: newVal.address || '',
        birthDate: newVal.birthDate || '',
        gender: findOptionValue(genderOptions.value, newVal.gender, true) || '',
        status: findOptionValue(statusOptions.value, newVal.status, true) || '',
        occupationName: findByLabel(occupationOptions.value, newVal.occupation?.name) || '',
        cabangName: findByLabel(cabangOptions.value, newVal.cabang?.name) || '',
        kojaName: findByLabel(kojaOptions.value, newVal.koja?.name) || '',
      }
    } else {
      initialValues.value = {
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthDate: '',
        gender: '',
        status: '',
        occupationName: '',
        cabangName: '',
        kojaName: '',
      }
    }
  },
  { immediate: true },
)

watch(
  () => props.visible,
  async (val) => {
    if (val && !hasLoadedOptions.value) {
      await Promise.all([loadOccupationOptions(), loadCabangOptions(), loadKojaOptions()])
      hasLoadedOptions.value = true
    }
    if (val && props.isEdit && props.initialData) {
      const newVal = props.initialData
      initialValues.value = {
        name: newVal.name || '',
        email: newVal.email || '',
        phoneNumber: newVal.phoneNumber || '',
        address: newVal.address || '',
        birthDate: newVal.birthDate || '',
        gender: findOptionValue(genderOptions.value, newVal.gender, true) || '',
        status: findOptionValue(statusOptions.value, newVal.status, true) || '',
        occupationName: findByLabel(occupationOptions.value, newVal.occupation?.name) || '',
        cabangName: findByLabel(cabangOptions.value, newVal.cabang?.name) || '',
        kojaName: findByLabel(kojaOptions.value, newVal.koja?.name) || '',
      }
    }
    if (!val) isSubmitting.value = false
  },
)

const onSubmit = async (values) => {
  isSubmitting.value = true

  if (!props.isEdit) {
    try {
      const response = await addJamaahData(values)
      if (response?.success) {
        closeModal()
      }
    } catch (error) {
      console.error('Gagal menambah jamaah:', error)
    } finally {
      isSubmitting.value = false
    }
  } else {
    try {
      const response = await editJamaahData(props.initialData.id, values)
      if (response?.success) {
        closeModal()
      }
    } catch (error) {
      console.error('Gagal mengedit jamaah:', error)
    } finally {
      isSubmitting.value = false
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
              <CFormSelect v-bind="field" id="gender" :options="genderOptions" />
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
        <CButton class="btn-tambah-jamaah" type="submit" :disabled="isSubmitting">{{
          isSubmitting ? 'Memproses...' : buttonText
        }}</CButton>
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
