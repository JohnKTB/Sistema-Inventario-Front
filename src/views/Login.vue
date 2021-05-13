<template>
  <v-container>
    <v-card max-width="900" elevation="5" class="text-center">
      <v-card-title></v-card-title>
      <br />
      <v-card-text>
        <v-row>
          <v-col>
            <v-img
              max-height="600"
              max-width="400"
              :src="require('../assets/login.jpg')"
            ></v-img>
          </v-col>
          <v-col class="mt-16">
            <form @submit.prevent="login">
              <v-text-field
                v-model="usuario.username"
                :counter="10"
                :rules="[rules.requiredUser]"
                label="Usuario"
                required
              ></v-text-field>
              <v-text-field
                v-model="usuario.password"
                label="Contraseña"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="show = !show"
                :rules="[rules.requiredPass]"
                required
                :type="show ? 'text' : 'password'"
              ></v-text-field>
              <v-btn color="success" class="mr-4" type="submit">
                Acceder
              </v-btn>
            </form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-alert elevation="4" type="error" width="400" :class="[error, activo]">
        Datos Invalidos!
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      show: false,
      activo: "ocultar",
      error: "",
      message: "",
      usuario: {
        username: "",
        password: "",
      },
      rules: {
        requiredUser: (v) => !!v || "Usuario es requerido",
        requiredPass: (v) => !!v || "Contraseña es requerida",
      },
    };
  },
  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
  },
  methods: {
    ...mapActions("usuario", ["saveUser"]),
    reset() {
      this.$refs.form.reset();
    },
    async login() {
      try {
        const dato = await fetch(`${this.url}api/token/`, {
          method: "POST",
          body: JSON.stringify(this.usuario),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await dato.json();
        if (response.detail) {
          this.activo = "";
          setTimeout(() => {
            this.activo = "ocultar";
          }, 3000);
        }
        const token = response.access;
        this.saveUser(token);
      } catch (error) {}
    },
  },
};
</script>

<style scoped>
.card-form {
  text-align: center;
}
.container {
  margin: 0;
}

.error {
  margin-left: 5.5em;
  margin-top: 5em;
}

.ocultar {
  display: none;
}
</style>