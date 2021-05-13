import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/inicio',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/productos',
    name: 'producto',
    component: () => import(/* webpackChunkName: "about" */ '../views/Productos.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/fabricantes',
    name: 'fabricante',
    component: () => import(/* webpackChunkName: "about" */ '../views/Fabricantes.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/clientes',
    name: 'cliente',
    component: () => import(/* webpackChunkName: "about" */ '../views/Clientes.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/proveedores',
    name: 'proveedor',
    component: () => import(/* webpackChunkName: "about" */ '../views/Proveedores.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/nueva-venta',
    name: 'NuevaVenta',
    component: () => import(/* webpackChunkName: "about" */ '../views/NuevaVenta.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/administrar-facturas',
    name: 'AdministrarFacturas',
    component: () => import(/* webpackChunkName: "about" */ '../views/AdministrarFacturas.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import(/* webpackChunkName: "about" */ '../views/Usuarios.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/roles',
    name: 'Roles',
    component: () => import(/* webpackChunkName: "about" */ '../views/Roles.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/nuevo-rol',
    name: 'NuevoRol',
    component: () => import(/* webpackChunkName: "about" */ '../views/NuevoRol.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/rol/:id',
    name: 'EditarRol',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditarRol.vue'),
    meta: {requiresAuth: true}
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next)=>{

  const rutaProtegida = to.matched.some(record=>record.meta.requiresAuth)
  
  if(rutaProtegida && store.state.usuario.token === ''){
    next({name: 'Login'})
  }else{
    next();
  }
})

export default router
