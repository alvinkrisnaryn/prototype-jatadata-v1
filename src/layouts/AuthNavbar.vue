<script setup>
import { CNavbar, CNavbarBrand } from '@coreui/vue'
</script>

<template>
  <div class="auth-navbar">
    <CNavbar>
      <CNavbarBrand href="/login" class="d-flex align-items-center justify-content-center">
        <img src="/pomosda.png" alt="Logo" height="45" class="me-2 ms-4" />
        <p class="fw-semibold" style="font-size: 1.25rem; margin: 0">Jatadata</p>
      </CNavbarBrand>
    </CNavbar>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-navbar {
  font-family: 'Inter', sans-serif;
}

.auth-navbar .navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent !important;
  box-shadow: none !important;
  border: none;
  z-index: 10;
}

.auth-navbar .navbar-brand span {
  font-size: 1.5rem;
}
</style>
