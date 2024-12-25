import { createRouter, createWebHistory } from 'vue-router'
import ChurchView from '../views/ChurchView.vue'
import LoginView from '../views/LoginView.vue'
import SheepsView from '../views/SheepsView.vue'
import ServantsView from '../views/ServantsView.vue'
import InvitationBoarding from '@/views/InvitationBoarding.vue'
import SingIn from '@/views/SingIn.vue'
import MinisterServices from '@/views/MinisterServices.vue'
import CursesView from '@/views/CursesView.vue'
import MyCourses from '@/views/MyCourses.vue'
import CoursesInCharge from '@/views/CoursesInCharge.vue'
import HomeUser from '@/views/HomeUser.vue'
import IncomeStatement from '@/views/IncomeStatement.vue'
import GroupsChurch from '@/views/GroupsChurch.vue'
import MyGroup from '@/views/MyGroup.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeUser,
  },
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
  routes,
});

export default router;