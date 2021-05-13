import Vue from 'vue'
import Vuex from 'vuex'
import gets from '../modules/gets'
import getsNuevaVenta from '../modules/NuevaVenta/getsNuevaVenta'
import apisNuevaVenta from '../modules/NuevaVenta/apisNuevaVenta'
import apisAdmVent from '../modules/AdministrarVenta/apisAdmVent'
import apisClientes from '../modules/ClienteProveedor/apisClientes'
import apisRoles from '../modules/Roles/apisRoles'
import apisUsuarios from '../modules/Usuarios/apisUsuarios'
import apisFabricantes from '../modules/Fabricantes/apisFabricantes'
import apisProductos from '../modules/Productos/apisProductos'
import permisos from '../modules/Roles/permisos'
import usuario from '../modules/Usuarios/usuario'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: 'http://127.0.0.1:8000/',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    gets,
    getsNuevaVenta,
    apisNuevaVenta,
    apisAdmVent,
    apisClientes,
    apisRoles,
    apisUsuarios,
    apisFabricantes,
    apisProductos,
    permisos,
    usuario,
  }
})
