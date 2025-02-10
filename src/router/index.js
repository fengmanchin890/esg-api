// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Input from '@v/Input.vue';
import Analyze from '@v/Analyze.vue';
import WaterTable from '@/components/WaterTable.vue';
import EnergyTable from '@/components/EnergyTable.vue';
import LoginPage from '@v/Login.vue';
import useUser from '@/hooks/useUser';
import MainPage from '@v/MainPage.vue';
import Settings from '@v/Settings.vue';


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
