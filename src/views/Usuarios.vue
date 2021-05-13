<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <v-card>
      <v-card-title>
        <v-toolbar style="padding-top: 0.5em" flat>
          <v-toolbar-title>Listado de Usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-text-field
            @keyup="filterNameUser()"
            v-model="searchUser"
            style="width: 1em"
            label="Buscar por Nombre"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                <v-icon> mdi-account-plus </v-icon>
                
                Nuevo Usuario
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    v-model="editedItem.Nombres"
                    label="Nombres"
                    :rules="nameRules"
                    required
                    solo
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.ApePat"
                    label="Apellido Pat"
                    error-messages=""
                    :rules="apePatRules"
                    required
                    solo
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.ApeMat"
                    label="Apellido Mat"
                    :rules="apeMatRules"
                    required
                    solo
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.username"
                    label="Usuario"
                    :rules="userRules"
                    :counter="10"
                    required
                    solo
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.email"
                    label="Email"
                    :rules="emailRules"
                    required
                    solo
                    dense
                  ></v-text-field>
                  <v-select
                    v-model="editedItem.groups"
                    :items="roles"
                    label="Roles"
                    ref="idRol"
                    :rules="[(v) => !!v || 'Campo requerido']"
                    required
                    dense
                    solo
                  ></v-select>
                  <div v-if="editedIndex === -1">
                    <v-text-field
                      v-model="editedItem.password"
                      label="Contraseña"
                      :rules="passwordRules"
                      :type="show ? 'text' : 'password'"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show = !show"
                      required
                      solo
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.password2"
                      label="Repetir Contraseña"
                      :rules="passwordRules"
                      :type="show ? 'text' : 'password'"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show = !show"
                      required
                      solo
                      dense
                    ></v-text-field>
                  </div>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :disabled="!valid"
                  text
                  @click="save"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title
                >Estas seguro de eliminar a este Usuario?</v-card-title
              >
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
            <p>No se encontraron resultados!</p>
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
    //VALIDATES
    nameRules: [(v) => !!v || "Campo requerido"],
    apePatRules: [(v) => !!v || "Campo requerido"],
    apeMatRules: [(v) => !!v || "Campo requerido"],
    emailRules: [
      (v) => !!v || "Campo requerido",
      (v) =>
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
          v
        ) || "email no valido",
    ],
    passwordRules: [
      (v) => !!v || "Campo requerido",
      (v) => !/\s/.test(v) || "contraseña no debe contener epacios",
    ],
    userRules: [
      (v) => !!v || "Campo requerido",
      (v) =>
        (v && v.length <= 10) ||
        "El usuario no debe tener mas de 10 caracteres",
    ],

    //BOOLEANS
    show: false,
    valid: true,
    dialog: false,
    dialogDelete: false,

    //STRINGS
    searchUser: "",

    //NUMBERS
    editedIndex: -1,
    //JSON
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
      { text: "Nombre", value: "NombreCompleto" },
      { text: "Usuario", value: "username" },
      { text: "Rol", value: "groups" },
      { text: "Email", value: "email" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
  }),

  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
    ...mapState("apisUsuarios", [
      "ListUsers",
      "message",
      "UserCreated",
      "editedUser",
      "filteredUser",
      "detailUser",
      "roles",
    ]),

    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
    },
  },

  watch: {
    filteredUser() {
      this.desserts = this.filteredUser;
    },
    message() {
      this.$swal.fire({
        title: this.message.msj,
        icon: this.message.icon,
      });
    },
    ListUsers() {
      this.desserts = this.ListUsers;
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
    this.getRoles();
  },

  methods: {
    ...mapActions("apisUsuarios", [
      "Users",
      "SaveNewUsers",
      "deletUser",
      "updateUser",
      "filterUserxName",
      "retrieveUser",
      "getRoles",
    ]),
    ...mapActions("usuario", ["closeSession"]),

    initialize() {
      this.Users();
    },

    async editItem(item) {
      await this.retrieveUser(item.id);
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, this.detailUser);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      const idUser = this.editedItem.id;

      await this.deletUser(this.editedItem.id);

      //CUANDO HAY ERROR DE SERVIDOR IGUAL SE ELIMINA
      //BUG CORREGIDO
      if (this.message.msj == "Usuario Eliminado!")
        this.desserts.splice(this.editedIndex, 1);

      this.closeDelete();
    },

    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async addUserCreated() {
      this.editedItem.groups = [this.$refs.idRol.value];

      await this.SaveNewUsers(this.editedItem);

      if (this.message.msj == "Usuario Creado!") {
        this.desserts.push(this.UserCreated);
        this.close();
      }
    },

    async save() {
      if (this.editedIndex > -1) {
        let $idCliente = this.editedItem.id;
        delete this.editedItem.id;
        this.editedItem.groups = [this.editedItem.groups];
        await this.updateUser({ id: $idCliente, user: this.editedItem });

        //Obtenemos el texto del rol filtrando por su id
        const rol = this.roles.filter(
          ({ value }) => value == this.editedUser.groups[0]
        );

        this.editedUser.groups = rol[0].text;

        Object.assign(this.desserts[this.editedIndex], this.editedUser);
        this.close();
      } else {
        if (this.editedItem.password != this.editedItem.password2) {
          this.$swal.fire({
            title: "Contraseñas no coinciden!",
            icon: "error",
          });
        }
        if (this.editedItem.password === this.editedItem.password2) {
          this.addUserCreated();
        }
      }
    },

    //FILTERS
    async filterNameUser() {
      if (this.searchUser.length > 1)
        return await this.filterUserxName(this.searchUser);
      return this.Users();
    },
  },
};
</script>

<style scoped>
</style>