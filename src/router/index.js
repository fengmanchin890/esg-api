// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Input from '../views/Input.vue';
import Analyze from '../views/Analyze.vue';
import LoginPage from '../views/Login.vue';
import useUser from '@/hooks/useUser';
const { isAuthenticated } = useUser();

const routes = [
  {
    path: '/',
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next('/home');
      } else {
        next();
      }
    },
  },
  {
    path: '/home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/');
      }
    },
    children: [
      { path: 'input', component: Input },
      { path: 'analyze', component: Analyze },
      { path: '', redirect: 'input' },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;