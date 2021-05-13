<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <v-card style="margin-bottom: 2em">
      <v-card-title>
        <v-toolbar style="padding-top: 0.5em" flat>
          <v-toolbar-title>Listado de Clientes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            @keyup="filterNameCli()"
            v-model="search"
            style="width: 1em"
            label="Buscar por Nombre"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Cliente
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-tabs v-model="tab" background-color="primary" dark>
                    <v-tab> Empresa </v-tab>
                    <v-tab> Cliente </v-tab>
                    <v-tab> Direccion </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-form ref="form" v-model="valid">
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-text-field
                              v-model="editedItem.nombreEmp"
                              label="Nombre Empresa"
                              :rules="nameRules"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.numeroImp"
                              label="Num Impuesto"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.sitioWeb"
                              label="Sitio Web"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.telefonoEmp"
                              label="Telefono Empresa"
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-text-field
                              v-model="editedItem.nombreCli"
                              label="Nombre Cliente"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.apellidoCli"
                              label="Apellido Cliente"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.emailCli"
                              label="Correo"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.telefonoCli"
                              label="Telefono Cliente"
                            ></v-text-field>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text>
                            <v-text-field
                              v-model="editedItem.direccion"
                              label="Direccion"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.ciudad"
                              label="Ciudad"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.regionProvincia"
                              label="Region/Provincia"
                            ></v-text-field>
                            <v-text-field
                              v-model="editedItem.codPostal"
                              label="Cod Postal"
                            ></v-text-field>
                            <v-combobox
                              @keyup="filterNameCountry()"
                              v-model="countrySelected"
                              ref="idCountry"
                              :search-input.sync="searchCountry"
                              :items="listCountries"
                              :rules="[(v) => !!v || 'Campo requerido!']"
                              clearable
                              label="Elegir Pais"
                            >
                              <template v-slot:no-data>
                                <v-list-item>
                                  <v-list-item-content>
                                    <v-list-item-title>
                                      No hay resultados
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </template>
                            </v-combobox>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-form>
                  </v-tabs-items>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" :disabled="!valid" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title
                >Estas seguro de eliminar a este Cliente?</v-card-title
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
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:[`item.nombreCli`]="{ item }">
            <div>
              {{ item.nombreCli }}
            </div>
            <div>
              {{ item.telefonoCli }}
            </div>
            <div>
              {{ item.emailCli }}
            </div>
          </template>
          <template v-slot:[`item.nombreEmp`]="{ item }">
            <div>
              {{ item.nombreEmp }}
            </div>
            <div>
              {{ item.telefonoEmp }}
            </div>
            <div>
              {{ item.sitioWeb }}
            </div>
          </template>
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
        <div class="pt-2">
          <v-pagination
            color="info"
            v-model="page"
            :length="countPaginator"
            @previous="changePage(page--)"
            @next="changePage(page++)"
            @input="changePage(page)"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Drawer from "../layouts/Drawer";
import CerrarSesion from "../components/CerrarSesion";

export default {
  components: {
    CerrarSesion,
    Drawer,
  },
  data: () => ({
    //VALIDATES
    nameRules: [(v) => !!v || "Campo requerido"],

    //STRINGS
    countrySelected: "",
    searchCountry: "",
    search: "",

    //BOOLEANS
    valid: true,
    dialog: false,
    dialogDelete: false,
    tab: null,

    //NUMBERS
    page: 1,
    countPaginator: 0,
    editedIndex: -1,

    //JSONS
    editedItem: {},
    defaultItem: {
      descripcion: "",
      estado: 0,
      Agregado: "",
    },

    //ARRAYS
    TypePer: ["Persona", "Empresa"],
    nameIdCountry: [],
    countries: [],
    headers: [
      {
        text: "Codigo",
        align: "id",
        sortable: false,
        value: "id",
      },
      { text: "# de Impuesto", value: "numeroImp" },
      { text: "Cliente", value: "nombreCli" },
      { text: "Direccion", value: "direccion" },
      { text: "Empresa", value: "nombreEmp" },
      { text: "Agregado", value: "created" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    desserts: [],
  }),

  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
    ...mapState("apisClientes", [
      "message",
      "listCliPro",
      "listCountries",
      "detailCliPro",
      "editedCliPro",
      "newCliPro",
    ]),

    async getClients() {
      const response = await fetch(`${this.url}clientes/?page=${this.page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
      const { results } = await response.json();

      this.desserts = results;
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Cliente" : "Editar Cliente";
    },
  },

  watch: {
    message() {
      this.$swal.fire({
        title: this.message.msj,
        icon: this.message.icon,
      });
    },
    listCountries() {
      console.log(this.listCountries);
    },

    listCliPro() {
      this.desserts = this.listCliPro;
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getClients;
    this.getCountPaginator();
    this.getCountries();
  },

  methods: {
    ...mapActions("apisClientes", [
      "filterCountries",
      "filterCliPro",
      "getCliPro",
      "getCountries",
      "deleteCliPro",
      "retrieveCliPro",
      "updateCliPro",
      "updateCliPro",
      "saveCliPro",
    ]),
    ...mapActions("usuario", ["closeSession"]),

    changePage(page) {
      this.page = page <= 0 || page > this.countPaginator ? this.page : page;
      this.getClients;
    },

    async editItem(item) {
      await this.retrieveCliPro(item.id);

      this.countrySelected = this.detailCliPro.pais;

      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, this.detailCliPro);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.closeDelete();

      const idCliPro = this.editedItem.id;

      await this.deleteCliPro(this.editedItem.id);

      if (this.message.msj == "Cliente Eliminado") {
        this.desserts.forEach(({ id }, index) => {
          if (idCliPro === id) {
            this.desserts.splice(index, 1);
            this.getCountPaginator();
          }
        });
      }
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

    //GETS

    async getCountPaginator() {
      try {
        const data = await fetch(`${this.url}clientes/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token.replace(/['"]+/g, "")}`,
          },
        });
        const { count, results } = await data.json();
        this.countPaginator = Math.ceil(count / results.length);
      } catch (error) {}
    },

    //FILTERS

    async filterNameCli() {
      //Filtra desde la tercera letra
      if (this.search.length > 1) return this.filterCliPro(this.search);
      return this.getCliPro();
    },

    async filterNameCountry() {
      if (this.searchCountry.length > 1)
        return await this.filterCountries(this.searchCountry);
      return await this.getCountries();
    },

    async save() {
      //ACTUALIZAR CLIENTE
      if (this.editedIndex > -1) {
        
        if (this.$refs.idCountry.value.text != this.searchCountry) {
          this.$swal.fire({
            title: "Seleccione un pais",
            icon: "error",
          });
        } else {
          let $idClient = this.editedItem.id;
          delete this.editedItem.id;
          this.editedItem.pais = this.$refs.idCountry.value.value;

          await this.updateCliPro({ id: $idClient, CliPro: this.editedItem });
          
          if(this.message.msj == "Cliente Actualizado!"){
            this.close();
            Object.assign(this.desserts[this.editedIndex], this.editedCliPro);
          }
        }
        
        //NUEVO CLIENTE
      } else {
        if (this.$refs.idCountry.value.text != this.searchCountry) {
          this.$swal.fire({
            title: "Seleccione un pais",
            icon: "error",
          });
        } else {
          delete this.editedItem.estado;
          this.editedItem.pais = this.$refs.idCountry.value.value;
          await this.saveCliPro(this.editedItem);
          this.getCountPaginator();
          this.desserts.push(this.newCliPro);

          this.close();
        }
      }
    },
  },
};
</script>
<style>
</style>