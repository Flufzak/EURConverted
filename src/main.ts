import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import 'primeicons/primeicons.css'
import './styling/main.css'
import { registerServiceWorker } from './services/registerServiceWorker'

createApp(App).use(PrimeVue, { unstyled: true }).mount('#app')
registerServiceWorker()
