import { createRouter, createWebHistory } from 'vue-router'
import ChurchView from '../views/ChurchView.vue'
import LoginView from '../views/LoginView.vue'
import SheepsView from '../views/SheepsView.vue'
import MySheepsView from '../views/MySheepsView.vue'
import ServantsView from '../views/ServantsView.vue'
import InvitationBoarding from '@/views/InvitationBoarding.vue'
import SingIn from '@/views/SingIn.vue'
import MinisterServices from '@/views/MinisterServices.vue'
import CursesView from '@/views/CursesView.vue'

const routes = [
  {
    path: '/my-church',
    name: 'church',
    component: ChurchView,
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
    path: '/sheeps',
    name: 'sheeps',
    component: SheepsView,
  },
  {
    path: '/my-sheeps',
    name: 'mysheeps',
    component: MySheepsView,
  },
  {
    path: '/servants',
    name: 'servants',
    component: ServantsView,
  },
  {
    path: '/invitation-boarding',
    name: 'invitation-boarding',
    component: InvitationBoarding,
  },
  {
    path: '/sing-in',
    name: 'sing-in',
    component: SingIn,
  },
  {
    path: '/curses',
    name: 'curses',
    component: CursesView,
  },
  {
    path: '/contributions',
    name: 'contributions',

  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;