<script setup>
import { defineEmits } from 'vue'
import { CNavbar, CButton } from '@coreui/vue'

const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
  <CNavbar class="navbar custom-navbar shadow px-4 d-flex justify-content-between">
    <CButton class="btn btn-navbar" @click="emit('toggle-sidebar')">
      <i class="bi bi-list"></i>
    </CButton>

    <h4 class="m-0 fw-bold">Dashboard Koor Cabang</h4>

    <div>
      <router-link to="/profile" class="btn-icon fs-2">
        <i class="bi bi-person-circle" style="cursor: pointer"></i>
      </router-link>
    </div>
  </CNavbar>
</template>

<style scoped>
.custom-navbar {
  background-color: #ebebeb;
}

.btn-navbar,
.btn-navbar:active,
.btn-navbar:focus,
.btn-navbar:disabled,
.btn-navbar:not(:disabled):not(:disabled):active {
  border-color: #0dcaf0;
  color: #0dcaf0;
  font-weight: bold;
  border-radius: 6px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-navbar:hover {
  background-color: #007bff;
  color: rgba(235, 235, 235, 0.897);
  font-weight: bold;
}

.btn-icon,
.btn-icon:active,
.btn-icon:focus,
.btn-icon:disabled,
.btn-icon:not(:disabled):not(:disabled):active {
  border-color: #007bff;
  color: #007bff;
  font-weight: bold;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.btn-icon:hover {
  color: #0069d9;
  font-weight: bold;
}
</style>
