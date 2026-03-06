import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/auth/Login.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/product.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/checkout.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/history.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/Register.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/errors/404.vue')
    },
  ],
})

export default router
