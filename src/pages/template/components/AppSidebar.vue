<script setup>
import Swal from 'sweetalert2'
import router from '@/router'

import { AppSidebarNav } from '@/pages/template/components/AppSidebarNav.js'
import { useSidebarStore } from '@/pages/template/stores/sidebar.js'
import { useThemeStore } from '@/pages/template/stores/theme'
import { CSidebarHeader, CImage, CButton } from '@coreui/vue'

const sidebar = useSidebarStore()
const theme = useThemeStore()
const pomosdaLogo = '/pomosda.png'

async function handleLogout() {
  try {
    localStorage.clear()
    sessionStorage.clear()

    Swal.fire({
      title: 'Logout Berhasil',
      html: 'Anda berhasil keluar.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => router.push('/login'))
  } catch (err) {
    console.error('Logout error:', err)
    Swal.fire({
      title: 'Terjadi Kesalahan',
      html: 'Gagal melakukan logout, silakan coba lagi.',
      icon: 'error',
      confirmButtonText: 'OK',
    })
  }
}
</script>

<template>
  <CSidebar
    class="border-end"
    :colorScheme="theme.colorMode"
    position="fixed"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <CSidebarHeader class="sidebar-header">
      <div class="d-flex align-items-center me-3">
        <CImage :src="pomosdaLogo" alt="Pomosda Logo" class="pomosda-logo" />
        <span class="jatadata-text">Jatadata</span>
      </div>
    </CSidebarHeader>
    <div class="flex-grow-1">
      <AppSidebarNav />
    </div>
    <div class="sidebar-footer-custom p-3 border-top">
      <CButton
        class="btn-logout-minimal"
        color="danger"
        variant="ghost"
        @click="handleLogout"
        style="cursor: pointer; font-weight: 700"
      >
        Logout
      </CButton>
    </div>
  </CSidebar>
</template>

<style lang="scss" scoped>
@use '@coreui/coreui/scss/mixins/color-mode' as *;

.sidebar-header {
  padding-top: 13px !important;
  padding-bottom: 12px !important;
  border-bottom: 1px solid var(--cui-border-color);
}

.pomosda-logo {
  height: 2.5rem;
  width: 2.5rem;
  margin-right: 0.7rem;
}

.jatadata-text {
  font-size: 1.3rem;
  font-weight: 700;
}

@include color-mode(light) {
  .jatadata-text {
    color: #212529 !important;
  }
}

@include color-mode(dark) {
  .jatadata-text {
    color: #fff !important;
  }
}

.flex-grow-1 {
  flex-grow: 1;
  overflow-y: auto;
}

.sidebar-footer-custom {
  text-align: center;
}
</style>
