import Home from '@/pages/dashboard/Home.vue'
import JamaahManagement from '@/pages/dashboard/JamaahManagement.vue'
import MasterData from '@/pages/dashboard/MasterData.vue'
import Report from '@/pages/dashboard/Report.vue'

export default [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/jamaah-management',
    name: 'JamaahManagement',
    component: JamaahManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/master-data',
    name: 'MasterData',
    component: MasterData,
    meta: { requiresAuth: true },
  },
  {
    path: '/report',
    name: 'Report',
    component: Report,
    meta: { requiresAuth: true },
  },
]
