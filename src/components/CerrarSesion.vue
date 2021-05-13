<template>
  <div class="logout">
    <v-btn class="mx-2" fab dark small color="primary" @click="accion()">
      <v-icon dark> mdi-minus </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "CerrarSesion",
  methods: {
    accion() {
      this.$emit("accion");
    },
  },
};
</script>

<style>
</style>