<template>
  <v-navigation-drawer
    app
    permanent
    expand-on-hover
    style="background: #242a33"
    width="20em"
  >
    <v-list dense rounded>
      <v-list-group
        v-for="primero in items"
        :key="primero.title"
        v-model="primero.active"
        :prepend-icon="primero.icon"
        color="white"
        no-action
      >
        <v-icon slot="prependIcon" color="white">{{ primero.icon }}</v-icon>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title
              style="color: white"
              v-text="primero.title"
            ></v-list-item-title>
          </v-list-item-content>
        </template>

        <div v-for="item in primero.items" :key="item.title">
          <v-list-item-group color="info">
            <v-list-item v-if="item.rol" :to="item.ruta">
              <v-list-item-icon>
                <v-icon style="color: white" v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  style="color: white"
                  v-text="item.title"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </div>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Drawer",
  data() {
    return {
      roles: [],
      items: [
        {
          title: "Productos",
          icon: "mdi-sticker-emoji",
          items: [
            {
              title: "Consultar Productos",
              icon: "mdi-lead-pencil",
              ruta: { name: "producto" },
              rol: "",
            },
          ],
        },
        {
          title: "Fabricantes",
          icon: "mdi-sticker-emoji",
          items: [
            {
              title: "Consultar Fabricantes",
              icon: "mdi-lead-pencil",
              ruta: { name: "fabricante" },
              rol: "",
            },
          ],
        },
        {
          title: "Contacto",
          icon: "mdi-sticker-emoji",
          items: [
            {
              title: "Clientes",
              icon: "mdi-lead-pencil",
              ruta: { name: "cliente" },
              rol: "",
            },
            {
              title: "Proveedores",
              icon: "mdi-lead-pencil",
              ruta: { name: "proveedor" },
              rol: "",
            },
          ],
        },
        {
          title: "Facturacion",
          icon: "mdi-sticker-emoji",
          items: [
            {
              title: "Nueva Venta",
              icon: "mdi-lead-pencil",
              ruta: { name: "NuevaVenta" },
              rol: "",
            },
            {
              title: "Administrar Facturas",
              icon: "mdi-lead-pencil",
              ruta: { name: "AdministrarFacturas" },
              rol: "",
            },
          ],
        },
        {
          title: "Gestion Usuarios",
          icon: "mdi-sticker-emoji",
          items: [
            {
              title: "Usuarios",
              icon: "mdi-lead-pencil",
              ruta: { name: "Usuarios" },
              rol: "",
            },
            {
              title: "Roles",
              icon: "mdi-lead-pencil",
              ruta: { name: "Roles" },
              rol: "",
            },
          ],
        },
      ],
    };
  },
  watch: {},
  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
  },
  created() {
    this.getRol();
  },
  methods: {
    async getRol() {
      let arrayPermissions = [];
      //ESTOY TRAYENDO TODOS LOS ROLES, PERO DEBO TRAER AL
      //USUARIO Y A ESE USUARIO CAPTURAR SU ROL
      const data = await fetch(`${this.url}api/usuario-logeado/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
      const response = await data.json();
      response[0].groups[0].permissions.forEach(({ codename }) => {
        arrayPermissions.push(codename.split("_")[1]);
      });

      const setPerm = new Set(arrayPermissions);
      const arrayPerm = Array.from(setPerm);
      
      arrayPerm.forEach((data, i) => {
        if (data == "venta") arrayPerm[i] = "NuevaVenta";
        if (data == "detventa") arrayPerm[i] = "AdministrarFacturas";
        if (data == "group") arrayPerm[i] = "Roles";
        if (data == "user") arrayPerm[i] = "Usuarios";
      });
      console.log('====')
      console.log(arrayPerm)
      this.items.forEach(({ items }) => {
        items.forEach(({ ruta }, index) => {
          //SI EL NOMBRE DE LA RUTA ESTA DENTRO DE 'arrayPerm'
          //ENTONCES AGREGAMOS AL ROL
          if ([...arrayPerm].includes(ruta.name)) items[index].rol = ruta.name;
        });
      });
    },
  },
};
</script>

<style scoped>
</style>