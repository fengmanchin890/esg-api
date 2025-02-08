  // router/index.js
  import { createRouter, createWebHistory } from 'vue-router';
  import Input from '../views/Input.vue';
  import Analyze from '../views/Analyze.vue';
  import LoginPage from '../views/Login.vue';
  import useUser from '@/hooks/useUser';
  import MainPage from '../views/MainPage.vue';
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
        },
        {
          path: 'analyze',
          component: Analyze,
        },
      ],
    },
    
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
