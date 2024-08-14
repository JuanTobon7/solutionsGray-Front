import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
import vuex from './store/index.js'
import Ripple from 'primevue/ripple';

import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(router)
app.use(vuex)

app.use(PrimeVue,{
    unstyled: true,     
});


app.component('toast', Toast)
app.directive('ripple', Ripple);
app.use(ToastService)


app.mount('#app')
