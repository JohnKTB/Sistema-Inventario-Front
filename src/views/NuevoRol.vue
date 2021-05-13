<template>
<v-container>
  <CerrarSesion @accion="closeSession()"/>
  <Drawer />
  <rolesGestionUsuarios view='nuevo rol' />
  </v-container>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import CerrarSesion from "../components/CerrarSesion";
import rolesGestionUsuarios from "../components/rolesGestionUsuarios";
import Drawer from '../layouts/Drawer'


export default {
  components: {
    CerrarSesion,
    rolesGestionUsuarios,
    Drawer
  },
  data() {
    return {};
  },
  watch: {
  },
  computed: {},
  created() {
    this.initializeNameRol();
    this.initializePermissions();
  },
  methods: {
    ...mapActions('usuario', ['closeSession']),
    ...mapMutations("permisos", ["initializeNameRol", "initializePermissions"]),
  },
};
</script>

<style scope>
</style>