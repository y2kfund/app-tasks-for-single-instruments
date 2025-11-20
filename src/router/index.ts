import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import TasksForSingleInstrument from '../views/TasksForSingleInstrument.vue'
// Use the correct type for the routes array
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'TasksForSingleInstrument',
    component: TasksForSingleInstrument
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router