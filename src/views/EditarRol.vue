<template>
<v-container>
  <CerrarSesion @accion="closeSession()"/>
  <Drawer />
  <rolesGestionUsuarios view='editar rol' />
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import rolesGestionUsuarios from "../components/rolesGestionUsuarios";
import Drawer from '../layouts/Drawer';
import CerrarSesion from "../components/CerrarSesion";

export default {
  components: {
    rolesGestionUsuarios,
    CerrarSesion,
    Drawer
  },
  data() {
    return {};
  },
  watch: {
  },
  computed: {},
  created() {
  },
  methods: {
    ...mapActions('usuario', ['closeSession']),
  },
};
</script>

<style scope>
</style>