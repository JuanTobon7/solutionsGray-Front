import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import PrimeVue from 'primevue/config';
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice';
import store from './store/index.js'
import Ripple from 'primevue/ripple';



//in main.js
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import "/node_modules/flag-icons/css/flag-icons.min.css";

const app = createApp(App)

app.use(router)
app.use(store)

app.use(PrimeVue);


app.component('toast', Toast)
app.directive('ripple', Ripple);
app.use(ToastService)

const ROLE_HIERARCHY = {
    User: 1,
    Admin: 2,
    SuperAdmin: 3,
    Pastor: 4,
};

app.config.globalProperties.$hasRole = (role) => {
    const session = store.getters.userSession;
    const user = JSON.parse(session);
    if (!ROLE_HIERARCHY[user.rol] || !ROLE_HIERARCHY[role]) {
        return false;
    }
    return ROLE_HIERARCHY[user.rol] >= ROLE_HIERARCHY[role];
};

app.config.globalProperties.$isAdminApp = () => {
    const session = store.getters.userSession;
    const user = JSON.parse(session);
    return user.rol === 'AdminApp';
}

app.mount('#app')
