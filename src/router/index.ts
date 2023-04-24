import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

export enum RouteNames {
  HOME = '/',
  LOGIN = '/login',
  USER = '/user',
}

const routes: RouteConfig[] = [
  {
    path: RouteNames.LOGIN,
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: `${RouteNames.USER}/:id`,
    name: 'User',
    component: () => import('../views/User.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
});

export default router;
