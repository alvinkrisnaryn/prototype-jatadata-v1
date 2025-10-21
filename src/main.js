import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import '@coreui/coreui/dist/css/coreui.min.css'
import '@coreui/icons/css/all.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/styles/override.css'

const app = createApp(App)
app.use(CoreuiVue)
app.use(createPinia())
app.use(router)
app.provide('icons', { CIcon })
app.mount('#app')
