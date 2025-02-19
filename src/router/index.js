// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Input from '@/views/Input.vue';
import Analyze from '@/views/Analyze.vue';
import WaterTable from '@/components/WaterTable.vue';
import EnergyTable from '@/components/EnergyTable.vue';
import LoginPage from '@/views/Login.vue';
import MainPage from '@/views/MainPage.vue';
import Settings from '@/views/Settings.vue';

import useUser from '@/hooks/useUser';

const { isAuthenticated } = useUser();

const routes = [
  {
    path: '/',
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/mainPage/input');
      } else {
        next();
      }
    },
  },
  {
    path: '/mainPage',
    component: MainPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/');
      }
    },
    children: [
      {
        path: 'input',
        component: Input,
        children: [
          {
            path: 'water',
            component: WaterTable,
          },
          {
            path: 'energy',
            component: EnergyTable,
          },
        ],
      },
      {
        path: 'analyze',
        component: Analyze,
      },
      {
        path: 'settings',
        component: Settings,
      }
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
