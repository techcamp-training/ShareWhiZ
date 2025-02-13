import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/reset.css'
import './assets/style.css'
import { Modal } from '@kouts/vue-modal'
import '@kouts/vue-modal/dist/vue-modal.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('Modal', Modal);
app.mount('#app')