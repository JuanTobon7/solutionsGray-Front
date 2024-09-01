import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
import vuex from './store/index.js'
import Ripple from 'primevue/ripple';


//in main.js
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(router)
app.use(vuex)

app.use(PrimeVue);


app.component('toast', Toast)
app.directive('ripple', Ripple);
app.use(ToastService)


app.mount('#app')
