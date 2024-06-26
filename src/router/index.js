import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Pots from '../views/Pots/Pots.vue'
import PotDetails from '../views/Pots/PotDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/pots',
    name: 'Pots',
    component: Pots
  },
  {
    path: '/pots/:id',
    name: 'PotDetails',
    component: PotDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
