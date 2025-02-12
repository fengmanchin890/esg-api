// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Input from './src/views/Input.vue';
import Analyze from './src/views/Analyze.vue';
import WaterTable from '@/components/WaterTable.vue';
import EnergyTable from '@/components/EnergyTable.vue';
import LoginPage from './src/views/Login.vue';
import useUser from '@/hooks/useUser';
import MainPage from './src/views/MainPage.vue';
import Settings from './src/views/Settings.vue';


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
            component: WaterTable, // Chỉ hiển thị WaterTable khi vào /mainPage/input/water
          },
          {
            path: 'energy',
            component: EnergyTable, // Chỉ hiển thị EnergyTable khi vào /mainPage/input/energy
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
