import { createRouter, createWebHistory } from 'vue-router'
import HomepageView from '@/pages/HomepageView.vue'
import HistoryView from '@/pages/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: HomepageView,
    },
    {
      name: 'history',
      path: '/:type/:id',
      component: HistoryView,
    },
  ],
})

export default router
