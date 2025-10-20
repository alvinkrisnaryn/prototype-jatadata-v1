<script setup>
import { ref } from 'vue'
import DashboardNavbar from '@/layouts/DashboardNavbar.vue'
import DashboardSidebar from '@/pages/dashboard/DashboardSidebar.vue'
import DashboardGreeting from '@/pages/dashboard/DashboardGreeting.vue'

const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="container-main">
    <DashboardSidebar v-if="isSidebarOpen" />

    <div class="flex-grow-1 d-flex flex-column">
      <DashboardNavbar @toggle-sidebar="toggleSidebar" />

      <main class="container-dashboard p-3 flex-grow-1">
        <DashboardGreeting username="Alvin Krisna" />
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.container-main {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 100vh;
}

.container-dashboard {
  background: linear-gradient(
    135deg,
    hsl(30 25% 97%) 0%,
    hsl(150 20% 96%) 50%,
    hsl(30 20% 98%) 100%
  );
}
</style>
