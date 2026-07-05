import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: import('@/pages/HomepageView.vue'),
    },
    {
      name: 'history',
      path: '/:type/:id',
      component: import('@/pages/HistoryView.vue'),
    },
  ],
})

export default router
