import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config';

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { unstyled: true });


app.mount('#app')
