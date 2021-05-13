<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <v-card>
      <v-card-title>
        <v-toolbar style="padding-top: 0.5em" flat>
          <v-toolbar-title>Roles del Sistema</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="">
              <v-btn color="primary" dark class="mb-2" :to="routeNewRole">
                Nuevo Rol
              </v-btn>
            </template>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title>Estas seguro de eliminar este Rol?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          disable-pagination
          sort-by="calories"
          class="elevation-1"
          dense
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <p>No hay resultados</p>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CerrarSesion from "../components/CerrarSesion";
import Drawer from "../layouts/Drawer";
export default {
  components: {
    CerrarSesion,
    Drawer,
  },
  data: () => ({
    //STRINGS
    search: "",

    //BOOLEANS
    dialog: false,
    dialogDelete: false,

    //NUMBERS
    editedIndex: -1,

    //JSONS
    routeNewRole: { name: "NuevoRol" },
    editedItem: {},
    defaultItem: {},

    //ARRAYS
    headers: [
      {
        text: "Codigo",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Rol", value: "name" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
  }),

  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
    ...mapState("apisRoles", ["message", "listRoles", "rolePermissions"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    listRoles() {
      this.desserts = this.listRoles;
    },

    message() {
      this.$swal.fire({
        title: this.message.msj,
        icon: this.message.icon,
      });
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getRoles();
  },

  methods: {
    ...mapActions("permisos", ["addArrayPermissions", "addRol"]),
    ...mapActions("apisRoles", ["deleteRol", "getRoles", "retrieveRoles"]),
    ...mapActions("usuario", ["closeSession"]),

    async editItem(item) {
      await this.retrieveRoles(item.id);
      const dataArr = new Set(this.rolePermissions);
      this.addArrayPermissions([...dataArr]);
      this.addRol(item.name);

      this.$router.push({ name: "EditarRol", params: { id: item.id } });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.closeDelete();

      const idRol = this.editedItem.id;

      await this.deleteRol({ id: this.editedItem.id });

      if (this.message.msj === "Rol Eliminado!") {
        this.desserts.forEach(({ id }, index) => {
          if (idRol === id) {
            this.desserts.splice(index, 1);
          }
        });
      }
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style>
</style>