import { createRouter, createWebHistory } from 'vue-router'
import TodoList from '../views/todo-lists.vue'
import TRAINEE from '../views/trainee-info.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/TODOLISTS',
      name: 'TODOLISTS',
      component: TodoList,
    },

    {
      path: '/TRAINEE',
      name: 'TRAINEE',
      component: TRAINEE,
    }
  //   {
  //     path: '/about',
  //     name: 'about',
  //     // route level code-splitting
  //     // this generates a separate chunk (About.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () => import('../views/AboutView.vue'),
  // //   },
  // //       {
  // //     path: '/',
  // //     name: 'HomeView',
  // //     component: HomeView,
  // //   },
  ],
})

export default router
