<script setup>
import { onMounted, ref } from 'vue'
import { useColorModes } from '@coreui/vue'

import AppHeaderDropdownAccnt from '@/pages/template/components/AppHeaderDropdownAccnt.vue'
import { useSidebarStore } from '@/pages/template/stores/sidebar.js'

const headerClassNames = ref('mb-4 p-0')
const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
const sidebar = useSidebarStore()

const role = ref('')
const dashboardTitle = ref('Dashboard')

const formatRoleTitle = (roleValue) => {
  if (!roleValue) return
  switch (roleValue) {
    case 'ROLE_CABANG':
      return 'Koor Cabang'
    case 'ROLE_KOJA':
      return 'Koor Koja'
    case 'ROLE_ADMIN':
      return 'Super Admin'
    default:
      return roleValue.replace('ROLE_', '').toLowerCase()
  }
}

onMounted(() => {
  const storedRole = localStorage.getItem('role')
  if (storedRole) {
    role.value = storedRole
    dashboardTitle.value = `Dashboard ${formatRoleTitle(storedRole)}`
  }

  document.addEventListener('scroll', () => {
    headerClassNames.value =
      document.documentElement.scrollTop > 0 ? 'mb-4 p-0 shadow-md' : 'mb-4 p-0'
  })
})

const debugToggleSidebar = () => {
  sidebar.toggleVisible()
}
</script>

<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="px-4" fluid>
      <CHeaderToggler @click="debugToggleSidebar()" style="margin-inline-start: -14px">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex fw-5">
        <CNavItem class="fs-3 fw-semibold">{{ dashboardTitle }}</CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
            <CIcon v-else icon="cil-contrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              :active="colorMode === 'light'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('light')"
            >
              <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'dark'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('dark')"
            >
              <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'auto'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('auto')"
            >
              <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
  </CHeader>
</template>
