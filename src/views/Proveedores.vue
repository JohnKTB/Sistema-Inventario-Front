<template>
  <v-container>
    <CerrarSesion @accion="closeSession()"/>
    <Drawer />
    <v-card>
      <v-card-title>
        <v-toolbar style="padding-top: 0.5em" flat>
          <v-toolbar-title>Listado de Proveedores</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            @keyup="filterName()"
            v-model="search"
            style="width: 1em"
            label="Buscar por Nombre"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Proveedor
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
                    <v-tab> Proveedor </v-tab>
                    <v-tab> Direccion </v-tab>
                  </v-tabs>

                  <v-tabs-items v-model="tab">
                    <v-tab-item>
                      <v-card flat>
                        <v-card-text>
                          <v-text-field
                            v-model="editedItem.nombreEmp"
                            label="Nombre Empresa"
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
                            v-model="editedItem.nombreProv"
                            label="Nombre Proveedor"
                          ></v-text-field>
                          <v-text-field
                            v-model="editedItem.apellidoProv"
                            label="Apellido Proveedor"
                          ></v-text-field>
                          <v-text-field
                            v-model="editedItem.emailProv"
                            label="Correo"
                          ></v-text-field>
                          <v-text-field
                            v-model="editedItem.telefonoProv"
                            label="Telefono Proveedor"
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
                            :search-input.sync="searchCountry"
                            :items="countries"
                            clearable
                            label="Elegir Pais"
                          >
                          </v-combobox>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title
                >Estas seguro de eliminar a este Proveedor?</v-card-title
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
      <template v-slot:[`item.nombreProv`]="{ item }">
        <div>
          {{ item.nombreProv }}
        </div>
        <div>
          {{ item.telefonoProv }}
        </div>
        <div>
          {{ item.emailProv }}
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
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <p>No hay resultados</p>
      </template>
    </v-data-table>
    <div class="pt-2">
      <v-pagination
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
import CerrarSesion from "../components/CerrarSesion";
import Drawer from "../layouts/Drawer";

export default {
  components: {
    CerrarSesion,
    Drawer
  },
  data: () => ({
    //BOOLEANS
    dialog: false,
    dialogDelete: false,
    tab: null,

    //STRINGS
    search: "",
    searchCountry: "",
    countrySelected: "",

    //NUMEBRS
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
      { text: "Proveedor", value: "nombreProv" },
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

    async getProveedores() {
      const response = await fetch(
        `${this.url}proveedores/?page=${this.page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
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
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getProveedores;
    this.getCountPaginator();
    this.getComboCoutries();
  },

  methods: {
    ...mapActions('usuario', ['closeSession']),

    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    changePage(page) {
      this.page = page <= 0 || page > this.countPaginator ? this.page : page;
      this.getProveedores;
    },

    async editItem(item) {
      const data = await fetch(`${this.url}proveedores/${item.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
      const response = await data.json();
      console.log(response)
      response.pais = response.pais.desc;
      this.countrySelected = response.pais;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, response);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.closeDelete();
      try {
        const idFab = this.editedItem.id;
        const data = await fetch(
          `${this.url}proveedores/${this.editedItem.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          }
        );
        const { msj } = await data.json();
        this.desserts.forEach(({ id }, index) => {
          if (idFab === id) {
            this.desserts.splice(index, 1);
          }
          this.$swal.fire({
            title: msj,
            icon: "success",
          });
          this.getCountPaginator();
        });
      } catch (error) {
        this.$swal.fire({
          title: "No se pudo eliminar Proveedor!",
          icon: "error",
        });
      }
    },

    close() {
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

    async getComboCoutries() {
      const data = await fetch(`${this.url}api/paises/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
      const results = await data.json();
      results.forEach(({ desc, id }) => {
        const $nameId = {};
        $nameId.desc = desc;
        $nameId.id = id;
        this.nameIdCountry.push($nameId);
      });
    },

    async getCountPaginator() {
      try {
        const data = await fetch(`${this.url}proveedores/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
        const { count, results } = await data.json();
        this.countPaginator = Math.ceil(count / results.length);
      } catch (error) {}
    },

    getIdCountry(nameIdCoun, country) {
      const newWord = this.removeAccents(country);
      let $idCountry = 0;
      nameIdCoun.forEach(({ desc, id }) => {
        if (newWord == desc) {
          $idCountry = id;
        }
      });
      return $idCountry;
    },

    getNameCountry(nameIdCoun, idCoun) {
      let $nameCountry = "";
      nameIdCoun.forEach(({ desc, id }) => {
        if (idCoun == id) {
          $nameCountry = desc;
        }
      });
      return $nameCountry;
    },

    //FILTERS

    async filterName() {
      //Filtra desde la tercera letra
      if (this.search.length > 1) {
        const data = await fetch(
          `${this.url}api/filtrar-proveedor-nombre/${this.search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          }
        );
        const response = await data.json();
        
        this.desserts = response;
        //Menos de la tercera letra regresa la lista normal
      } else {
        const data = await fetch(`${this.url}proveedores/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
          },
        });
        const { results } = await data.json();
        this.desserts = results;
        //Para que se seleccione de nuevo la primera pagina
        this.page = 1;
      }
    },

    async filterNameCountry() {
      if (this.searchCountry.length > 1) {
        const data = await fetch(
          `${this.url}api/filtrar-pais/${this.searchCountry}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          }
        );
        const response = await data.json();
        response.forEach(({ desc, id }) => {
          const $nameId = {};
          $nameId.desc = desc;
          $nameId.id = id;
          this.nameIdCountry.push($nameId);
          this.countries.push(desc);
        });

        //Menos de la tercera letra regresa la lista normal
      } else {
        const data = await fetch(`${this.url}api/paises/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
          },
        });
        const results = await data.json();
        results.forEach(({ desc, id }) => {
          const $nameId = {};
          $nameId.desc = desc;
          $nameId.id = id;
          this.nameIdCountry.push($nameId);
          this.countries.push(desc);
        });
      }
    },

    async save() {
      //ACTUALIZAR PROVEEDOR
      if (this.editedIndex > -1) {
        let $idProveedor = this.editedItem.id;
        delete this.editedItem.id;
        const $idPais = this.getIdCountry(
          this.nameIdCountry,
          this.countrySelected
        );
        this.editedItem.pais = $idPais;
        try {
          const data = await fetch(
            `${this.url}proveedores/${$idProveedor}/`,
            {
              method: "PUT",
              body: JSON.stringify(this.editedItem),
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
              },
            }
          );
          const response = await data.json();
          const $nameCountry = this.getNameCountry(
            this.nameIdCountry,
            response.pais
          );
          response.pais = $nameCountry;
          this.$swal.fire({
            title: "Proveedores Actualizado",
            icon: "success",
          });

          Object.assign(this.desserts[this.editedIndex], response);
        } catch (error) {
          this.$swal.fire({
            title: "No se pudo actualizar Proveedores!",
            icon: "error",
          });
        }
        //NUEVO PROVEEDOR
      } else {
        try {
          delete this.editedItem.estado;
          const $idCountry = this.getIdCountry(
            this.nameIdCountry,
            this.searchCountry
          );
          this.editedItem.pais = $idCountry;
          console.log("this.editedItem");
          console.log(this.editedItem);
          const data = await fetch(`${this.url}proveedores/`, {
            method: "POST",
            body: JSON.stringify(this.editedItem),
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          });
          const response = await data.json();
          this.getCountPaginator();
          this.desserts.push(response);
          this.$swal.fire({
            title: "Proveedor Agregado!",
            icon: "success",
          });
        } catch (error) {
          this.$swal.fire({
            title: "No se pudo agregar Proveedor!",
            icon: "error",
          });
        }
      }
      this.close();
    },
  },
};
</script>
<style>
</style>