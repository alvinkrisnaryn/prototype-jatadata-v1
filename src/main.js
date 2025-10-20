import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/override.css'

import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(router).mount('#app')
