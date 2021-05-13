<template>
  <v-container>
    <p style="color: #2196f3" class="text-h5">Detalles del Rol</p>
    <v-row>
      <v-col
        ><v-card :width="width" elevation="0">
          <v-card-text>
            <v-form ref="form">
              <label>Nombre</label>
              <v-text-field
                prepend-inner-icon="mdi-account-plus"
                label="Nombre del Rol"
                v-model="nameRole"
                solo
                dense
                required
              ></v-text-field>
              <h3 class="mb-2">Opciones Asignadas</h3>
              <v-card elevation="2" max-width="500" class="mx-auto">
                <v-card-text>
                  <v-list-item
                    v-for="(permission, index) in permissionsAsigned"
                    :key="index"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ permission }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn @click="deletePermission(index)" icon>
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" class="mb-2" :to="routeRoles">
              <v-icon> mdi-undo </v-icon>
              Regresar
            </v-btn>
            <v-btn dark color="#06d79c" class="mb-2" @click="save()">
              <v-icon>mdi-floppy</v-icon>
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card></v-col
      >
      <v-col
        ><v-card elevation="0" max-width="800">
          <v-card-text>
            <table class="table color-table">
              <thead>
                <tr>
                  <th>Menu</th>
                  <th>Asignar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(items, index) in menus" :key="index">
                  <td class="td-title">{{ items.menu }}</td>
                  <td>
                    <v-card
                      :style="widthCardSubmenu()"
                      elevation="2"
                      max-width="500"
                      :height="heightCardSubmenus(items.submenus)"
                      class="mx-auto"
                    >
                      <v-virtual-scroll
                        :bench="benched"
                        :items="items.submenus"
                        height="150"
                        item-height="110"
                      >
                        <template v-slot:default="{ item }">
                          <div :style="styleCardTrTable()">
                            <div>{{ item }}</div>
                            <v-btn
                              color="#06d79c"
                              elevation="3"
                              @click="assignPermissions(item)"
                              depressed
                              fab
                              outlined
                              tile
                              small
                            >
                              <v-icon> mdi-plus </v-icon>
                            </v-btn>
                          </div>
                          <v-divider></v-divider>
                        </template>
                      </v-virtual-scroll>
                    </v-card>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text> </v-card
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  props: {
    view: String,
  },
  data() {
    return {
      //NUMBERS
      benched: 2,

      //STRINGS
      nameRole: "",

      //JSONS
      routeRoles: { name: "Roles" },

      //ARRAYS
      menus: [
        {
          menu: "Producto",
          submenus: ["Producto"],
        },
        {
          menu: "Fabricante",
          submenus: ["Fabricante"],
        },
        {
          menu: "Contacto",
          submenus: ["Cliente", "Proveedor"],
        },
        {
          menu: "Facturacion",
          submenus: ["Venta", "Detalle de Venta"],
        },
        {
          menu: "Gestion de Usuarios",
          submenus: ["Usuarios", "Roles"],
        },
      ],
    };
  },
  watch: {
    permissionsAsigned(){
      console.log(this.permissionsAsigned)
    }
  },
  computed: {
    ...mapState(["url"]),
    ...mapState("permisos", ["permissionsAsigned", "rol"]),
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm":
          return 800;
        case "md":
          return 450;
      }
    },
  },
  created() {
    this.nameRol();
  },
  methods: {
    ...mapActions("permisos", [
      "addPermissions",
      "deletePermission",
      "resetPermissions",
    ]),

    nameRol() {
      if (this.rol != "") this.nameRole = this.rol;
    },

    save() {
      // CREAMOS NUEVO ROL
      if (this.view == "nuevo rol") return this.saveRole();
      return this.editedRole();
    },

    assignPermissions(submenu) {
      if (!this.permissionsAsigned.includes(submenu))
        this.addPermissions(submenu);
    },

    //ASYNC

    async saveRole() {
      this.permissionsAsigned.forEach((data, i) => {
        if (data == "Usuarios") this.permissionsAsigned[i] = "user";
        if (data == "Roles") this.permissionsAsigned[i] = "group";
      });

      const data = await fetch(`${this.url}grupos/`, {
        method: "POST",
        body: JSON.stringify({
          rol: this.nameRole,
          permisos: this.permissionsAsigned,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { msj } = await data.json();
      this.$swal.fire({
        title: msj,
        icon: "success",
      });

      //RESETEAMOS CAMPOS
      this.$refs.form.reset();
      this.resetPermissions();
    },
    async editedRole() {
      this.permissionsAsigned.forEach((data, i) => {
        if (data == "Usuarios") this.permissionsAsigned[i] = "user";
        if (data == "Roles") this.permissionsAsigned[i] = "group";
      });
      const data = await fetch(`${this.url}grupos/${this.$route.params.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          rol: this.nameRole,
          permisos: this.permissionsAsigned,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { msj } = await data.json();
      this.$swal.fire({
        title: msj,
        icon: "success",
      });
    },

    //STYLES 

    styleCardTrTable() {
      if (
        this.$vuetify.breakpoint.name == "md" ||
        this.$vuetify.breakpoint.name == "lg"
      )
        return "display: flex; justify-content: space-evenly";
    },
    widthCardSubmenu() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "width: 100%";
        case "sm":
          return "width: 130%";
        case "md":
          return "width: 100%";
        case "lg":
          return "width: 100%";
      }
    },
    heightCardSubmenus(item) {
      if (item.length == 1) {
        switch (this.$vuetify.breakpoint.name) {
          case "xs":
            return 130;
          case "sm":
            return 107;
          case "md":
            return 65;
          case "lg":
            return 65;
        }
      }
    },
  },
};
</script>

<style scope>
.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 1rem;
}
table {
  border-collapse: collapse;
}
.color-table thead th {
  background-color: #398bf7;
  color: #ffffff;
}
.table thead th,
.table th {
  font-weight: 500;
}
.table td,
.table th {
  padding: 0.75rem;
}
.td-title {
  width: 5em;
}
td {
  border-bottom: 1px solid #ccd1d1;
}
tr:hover {
  background: #ccd1d1;
}
</style>