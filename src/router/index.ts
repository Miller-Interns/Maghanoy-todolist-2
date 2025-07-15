import { createRouter, createWebHistory } from 'vue-router'
import toDoLists from '@/views/todo-lists.vue'
import trainee from '@/views/trainee-info.vue'
import {RouteNames} from '@/enum/route-name'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',
      name: RouteNames.TODOLISTS,
      component: toDoLists,
    },

    {
      path: '/TRAINEE',
      name: RouteNames.TRAINEE,
      component: trainee,
    }
  ],
})

export default router
