<script setup>
import { CContainer } from '@coreui/vue'
import AppHeader from '@/pages/template/components/AppHeader.vue'
import AppSidebar from '@/pages/template/components/AppSidebar.vue'
import AppFooter from '@/pages/template/components/AppFooter.vue'
</script>

<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <slot />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
