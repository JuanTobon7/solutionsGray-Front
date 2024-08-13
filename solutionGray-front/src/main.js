import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
import vuex from './store/index.js'

const app = createApp(App)

app.use(router)
app.use(vuex)
app.use(PrimeVue, { unstyled: true });
app.component('toast', Toast)
app.use(ToastService)


app.mount('#app')
