import { createRouter, createWebHistory } from 'vue-router'
import ChurchView from '../views/ChurchView.vue'
import LoginView from '../views/LoginView.vue'
import SheepsView from '../views/SheepsView.vue'
import ServantsView from '../views/ServantsView.vue'
import VerifyEmail from '@/views/VerifyEmail.vue'
import SingIn from '@/views/SingIn.vue'
import MinisterServices from '@/views/MinisterServices.vue'
import CursesView from '@/views/CursesView.vue'
import MyCourses from '@/views/MyCourses.vue'
import CoursesInCharge from '@/views/CoursesInCharge.vue'
import HomeUser from '@/views/HomeUser.vue'
import HomeView from '@/views/HomeView.vue'
import IncomeStatement from '@/views/IncomeStatement.vue'
import GroupsChurch from '@/views/GroupsChurch.vue'
import MyGroup from '@/views/MyGroup.vue'
import WorshipServicesGroups from '@/views/WorshipServicesGroups.vue'
import ProfileView from '@/views/ProfileView.vue'
import ConfigutarionView from '@/views/ConfigutarionView.vue'
import AdministrativeView from '@/views/AdministrativeView.vue'
import InfoChurchPDF from '@/components/Church/InfoChurchPDF.vue'

import store from '@/store'

const routes = [
  
  {
    path: '/',
    name: 'feed',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      const user = store.state.user;
      if (user) {
        next({ name: 'home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeUser,
    beforeEnter: (to, from, next) => {
      const user = store.state.user;
  
      if (!user) {
        // Si no hay usuario autenticado, redirige al feed
        next({ name: 'feed' });
      } else if (user.rol === 'Admin App') {
        // Si el usuario es "Admin App", redirige a administrative
        next({ name: 'administrative' });
      } else {
        // En cualquier otro caso, permite el acceso a la ruta
        next();
      }
    },
  },
  {
    path: '/info-church',
    name: 'info-church-pdf',
    component: InfoChurchPDF,
  },
  {
    path: '/my-church',
    name: 'church',
    component: ChurchView,
  },
  {
    path: '/services-group',
    name: 'services-group',
    component: WorshipServicesGroups,
  },
  {
    path: '/worship-services',
    name: 'worship-services',
    component: MinisterServices,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
  },
  {
    path: '/administrative',
    name: 'administrative',
    component: AdministrativeView,
    beforeEnter: (to, from, next) => {
      const user = store.state.user;
  
      if (user?.rol === 'Admin App') {
        // Si el rol es "Admin App", permite el acceso
        next();
      } else {
        // Si no, redirige al home
        next({ name: 'home' });
      }
    },
  },
  {
    path: '/configuration',
    name: 'configuration',
    component: ConfigutarionView,
  },
  {
    path: '/sheeps',
    name: 'sheeps',
    component: SheepsView,
  },  
  {
    path: '/servants',
    name: 'servants',
    component: ServantsView,
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail,
  },
  {
    path: '/sing-in/:email/:type',
    name: 'sing-in',
    component: SingIn,
  },
  {
    path: '/courses',
    name: 'curses',
    component: CursesView,
  },
  {
    path: '/my-courses',
    name: 'my-courses',
    component: MyCourses,
  },
  {
    path: '/contributions',
    name: 'contributions',

  },
  {
    path: '/courses-in-charge',
    name: 'courses-in-charge',
    component: CoursesInCharge,
  },
  {
    path: '/income-statement',
    name: 'income-statement',
    component: IncomeStatement,
  },
  {
    path: '/groups-church',
    name: 'groups-church',
    component: GroupsChurch,
  },
  {
    path: '/my-group',
    name: 'my-group',
    component: MyGroup,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to,from,savedPosition){
    return {top:0}
  },
  routes,
});

export default router;