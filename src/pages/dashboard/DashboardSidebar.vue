<script setup>
import { CNavItem, CNavLink, CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()
const router = useRouter()

const menuItems = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Jamaah Management', path: '/jamaah' },
  { name: 'Master Data', path: '/master-data' },
  { name: 'Report', path: '/report' },
]

const isActive = (path) => route.path === path

function handleLogout() {
  sessionStorage.removeItem('email')
  sessionStorage.removeItem('password')
  sessionStorage.clear
  router.push('/')
}
</script>

<template>
  <CSidebar v-if="visible" class="sidebar-container d-flex flex-column justify-content-between">
    <CSidebarBrand class="d-flex align-items-center justify-content-start p-3 fw-bold fs-5">
      <img src="/pomosda.png" alt="Logo Pomosda" height="40" class="me-2" />
      <p class="d-block fw-bold" style="font-size: 1.25rem; margin: 0">Jatadata</p>
    </CSidebarBrand>

    <CSidebarNav>
      <CNavItem v-for="item in menuItems" :key="item.path">
        <CNavLink :href="item.path" :active="isActive(item.path)">
          {{ item.name }}
        </CNavLink>
      </CNavItem>
    </CSidebarNav>

    <div class="p-3 border-top">
      <button class="btn btn-outline-danger w-100 fw-semibold" @click="handleLogout">
        <i class="bi bi-box-arrow-right me-2"></i> Logout
      </button>
    </div>
  </CSidebar>
</template>

<style scoped>
.sidebar-container {
  width: 240px;
  border-right: 1px solid #ccc;
  height: 100vh;
  position: relative;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

::v-deep(.c-sidebar) {
  background: linear-gradient(
    135deg,
    hsl(30 25% 97%) 0%,
    hsl(150 20% 96%) 50%,
    hsl(30 20% 98%) 100%
  ) !important;
  color: #000; /* biar teks tetap kontras */
  border-right: 1px solid #ccc;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
}

.sidebar .nav-link {
  color: #007bff !important;
  font-weight: 500;
  padding: 10px 20px;
  margin-left: 15px;
  display: block;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  background-color: transparent !important;
}

.sidebar .nav-link.active {
  background-color: #e9ecef !important;
  border-left: 5px solid #007bff !important;
  font-weight: 700 !important;
}

/* .slide-sidebar-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-sidebar-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-sidebar-enter-active {
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
}

.slide-sidebar-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-sidebar-leave-active {
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
} */
</style>
