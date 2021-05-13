<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <p class="text-h3">Bienvenido {{ user }}</p>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Drawer from "../layouts/Drawer";
import CerrarSesion from "../components/CerrarSesion";

export default {
  components: {
    CerrarSesion,
    Drawer,
  },
  data() {
    return {
      user: "",
    };
  },
  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
  },

  created() {
    this.getUser();
  },

  methods: {
    async getUser() {
      const data = await fetch(`${this.url}api/usuario-logeado/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
      const response = await data.json();
      this.user = response[0].username;
    },
  },
};
</script>