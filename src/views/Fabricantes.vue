<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <v-card>
      <v-card-title>
        <v-toolbar style="padding-top: 0.5em" flat>
          <v-toolbar-title>Listado de Fabricante</v-toolbar-title>
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
                Nuevo Fabricante
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    v-model="editedItem.descripcion"
                    label="Nombre"
                    :rules="manufacturerRules"
                  ></v-text-field>
                  <div v-if="editedIndex > -1">
                    <v-select
                      v-model="editedItem.estado"
                      :items="items"
                      label="Estado"
                      dense
                      solo
                    ></v-select>
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
                >Estas seguro de eliminar a este Fabricante?</v-card-title
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
          <template v-slot:[`item.estado`]="{ item }">
            <v-chip :color="getColor(item.estado)" dark>
              {{ item.estado }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary"> Reset </v-btn>
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
import Drawer from "../layouts/Drawer";
import CerrarSesion from "../components/CerrarSesion";

export default {
  components: {
    CerrarSesion,
    Drawer,
  },
  data: () => ({
    search: "",

    //JSONS
    editedItem: {
      descripcion: "",
      estado: 0,
    },
    defaultItem: {
      descripcion: "",
      estado: 0,
      Agregado: "",
    },

    //NUMBERS
    page: 1,
    countPaginator: 0,
    editedIndex: -1,

    //VALIDATES
    manufacturerRules: [
      (v) => !!v || "Campo requerido",
      (v) => !/^\s/.test(v) || "Ingrese Fabricante",
    ],

    //BOOLEANS
    valid: true,
    dialog: false,
    dialogDelete: false,

    //ARRAYS
    items: ["Activo", "Inactivo"],
    headers: [
      {
        text: "Codigo",
        align: "id",
        sortable: false,
        value: "id",
      },
      { text: "Fabricante", value: "descripcion" },
      { text: "Estado", value: "estado" },
      { text: "Agregado", value: "created" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    desserts: [],
  }),

  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
    ...mapState("apisFabricantes", [
      "listManufacturer",
      "message",
      "newManufacturer",
    ]),

    async getFabricantes() {
      const response = await fetch(
        `${this.url}fabricantes/?page=${this.page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token.replace(/['"]+/g, "")}`,
          },
        }
      );
      const { results } = await response.json();
      results.forEach(({ estado }, i) => {
        if (estado === 0) {
          results[i].estado = "Activo";
          this.desserts = results;
        } else {
          results[i].estado = "Inactivo";
          this.desserts = results;
        }
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Fabricante" : "Editar Fabricante";
    },
  },

  watch: {
    listManufacturer() {
      this.desserts = this.listManufacturer;
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
    this.getFabricantes;
    this.getCountPaginator();
  },

  methods: {
    ...mapActions("usuario", ["closeSession"]),
    ...mapActions("apisFabricantes", [
      "filterManufactures",
      "getManufactures",
      "deleteManufacturer",
      "updateManufacturer",
      "SaveNewManufacturer",
    ]),

    getColor(estado) {
      if (estado === "Inactivo") return "red";
      else if (estado === "Activo") return "orange";
      else return "green";
    },

    async filterName() {
      //Filtra desde la tercera letra
      if (this.search.length > 1) return await this.filterManufactures(this.search);
      //Menos de la tercera letra regresa la lista normal
        return this.getManufactures();
    },

    changePage(page) {
      this.page = page <= 0 || page > this.countPaginator ? this.page : page;
      this.getFabricantes;
    },

    async getCountPaginator() {
      try {
        const data = await fetch(`${this.url}fabricantes/`, {
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

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      const idFab = this.editedItem.id;

      await this.deleteManufacturer(this.editedItem.id);

      if (this.message.msj == "Fabricante Eliminado") {
        this.desserts.forEach(({ id }, index) => {
          if (idFab === id) {
            this.desserts.splice(index, 1);
          }
          this.getCountPaginator();
        });
      }

      this.closeDelete();
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

    async save() {
      //ACTUALIZAR FABRICANTE
      if (this.editedIndex > -1) {
        let $idFabricante = this.editedItem.id;
        delete this.editedItem.id;
        delete this.editedItem.created;
        this.editedItem.estado === "Activo"
          ? (this.editedItem.estado = 0)
          : (this.editedItem.estado = 1);

        await this.updateManufacturer({
          id: $idFabricante,
          manufacturer: this.editedItem,
        });

        if (this.message.msj === "Fabricante Actualizado!") {
          this.editedItem.estado === 0
            ? (this.editedItem.estado = "Activo")
            : (this.editedItem.estado = "Inactivo");

          Object.assign(this.desserts[this.editedIndex], this.editedItem);
        }

        //NUEVO FABRICANTE
      } else {
        
        delete this.editedItem.estado;

        await this.SaveNewManufacturer(this.editedItem);

        this.getCountPaginator();
        this.desserts.push(this.newManufacturer);
      }
      this.close();
    },
  },
};
</script>
<style>
</style>