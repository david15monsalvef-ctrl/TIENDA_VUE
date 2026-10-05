import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import MovementsView from '../views/MovementsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/productos', component: ProductsView },
  { path: '/movimientos', component: MovementsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router