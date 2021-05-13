<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <v-card>
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>Listado de Productos</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            @keyup="filterName()"
            v-model="searchFilter"
            style="width: 1em"
            label="Buscar por Nombre"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Producto
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-subtitle>Detalle del Producto</v-card-subtitle>
              <v-card-text>
                <v-form ref="forms">
                  <v-img
                    alt="Imagen de producto"
                    height="80"
                    width="80"
                    :src="editedItem.imagen"
                  ></v-img>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-text-field disabled label="Codigo"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.modelo"
                          label="Modelo"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.nombre"
                          label="Nombre"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.presentacion"
                          label="Presentacion"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.descripcion"
                          label="Descripcion"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-combobox
                          @keyup="filterNameFab()"
                          v-model="manufacturerSelected"
                          ref="idManufacturer"
                          :search-input.sync="searchManufacturer"
                          :items="listManufacturers"
                          :rules="[(v) => !!v || 'Campo requerido!']"
                          clearable
                          label="Eliga Fabricante"
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
                      </v-col>
                      <v-col>
                        <v-select
                          prepend-icon="mdi-map"
                          v-model="editedItem.estado"
                          :items="items"
                          label="Estado"
                          dense
                          solo
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.costo"
                          label="Costo"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.utilidad"
                          label="Utilidad"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.precioVenta"
                          label="Precio Venta"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          v-model="editedItem.stockIn"
                          label="Stock"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <input
                          type="file"
                          ref="file"
                          v-on:change="handleFileUpload()"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
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
              <v-card-title class="headline"
                >Seguro que desea eliminar este producto?</v-card-title
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
          dense
        >
          <template v-slot:[`item.imagen`]="{ item }">
            <v-img
              alt="Imagen de producto"
              height="80"
              width="80"
              :src="item.imagen"
            ></v-img>
          </template>
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
            color="info"
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
    Drawer,
  },

  data: () => ({
    //STRINGS
    manufacturerSelected: "",
    file: "",
    searchManufacturer: "",
    searchFilter: "",

    //BOOLEANS
    dialog: false,
    dialogFab: false,
    dialogDelete: false,
    image: undefined,

    //NUMBERS
    page: 1,
    countPaginator: 0,
    editedIndex: -1,

    //JSONS
    editedItem: {
      nombre: "",
      modelo: "",
      presentacion: "",
      descripcion: "",
      fabricante: "",
      estado: 0,
      costo: 0,
      utilidad: 0,
      precioVenta: 0,
      stockIn: 0,
    },
    defaultItem: {
      nombre: "",
      modelo: "",
      presentacion: "",
      descripcion: "",
      fabricante: "",
      estado: "",
      costo: 0,
      utilidad: 0,
      precioVenta: 0,
      stockIn: 0,
    },

    //ARRAYS

    items: ["Activo", "Inactivo"],
    headers: [
      {
        text: "Codigo",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Imagen", value: "imagen" },
      { text: "Modelo", value: "modelo" },
      { text: "Producto", value: "nombre" },
      { text: "Fabricante", value: "fabricante.descripcion" },
      { text: "Estado", value: "estado" },
      { text: "Stock", value: "stockIn" },
      { text: "Precio", value: "precioVenta" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    desserts: [],
  }),

  computed: {
    ...mapState(["url"]),
    ...mapState("usuario", ["token"]),
    ...mapState("apisProductos", [
      "message",
      "detailProduct",
      "listManufacturers",
      "listProducts",
      "newProduct",
      "editedProduct",
    ]),

    async getProductos() {
      const data = await fetch(`${this.url}productos/?page=${this.page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token.replace(/['"]+/g, "")}`,
        },
      });
      const { results } = await data.json();
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
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },
  },

  watch: {
    searchManufacturer() {
      this.manufacturerSelected = this.searchManufacturer;
    },
    message() {
      this.$swal.fire({
        title: this.message.msj,
        icon: this.message.icon,
      });
    },

    listProducts() {
      this.desserts = this.listProducts;
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getProductos;
    this.getCountPaginator();
    this.getManufacturers();
  },

  methods: {
    ...mapActions("usuario", ["closeSession"]),
    ...mapActions("apisProductos", [
      "retrieveProducts",
      "deleteProduct",
      "getManufacturers",
      "filterNameProduct",
      "getProducts",
      "filterNameManufacturer",
      "saveProduct",
      "updateProduct",
    ]),

    changePage(page) {
      this.page = page <= 0 || page > this.countPaginator ? this.page : page;
      this.getProductos;
    },

    async editItem(item) {
      await this.retrieveProducts(item.id);
      this.manufacturerSelected = this.detailProduct.fabricante;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, this.detailProduct);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.closeDelete();

      const idProd = this.editedItem.id;
      await this.deleteProduct(this.editedItem.id);

      if (this.message.msj === "Producto Eliminado!") {
        this.desserts.forEach(({ id }, index) => {
          if (idProd === id) {
            this.desserts.splice(index, 1);
            this.getCountPaginator();
          }
        });
      }
    },

    close() {
      this.$refs.forms.resetValidation()
      this.dialog = false;
      this.$nextTick(() => {
        this.$refs.file.value = "";
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

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    //GETS
    getColor(estado) {
      if (estado === "Inactivo") return "red";
      else if (estado === "Activo") return "orange";
      else return "green";
    },

    async getCountPaginator() {
      try {
        const data = await fetch(`${this.url}productos/`, {
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

    async filterName() {
      if (this.searchFilter.length > 1)
        return this.filterNameProduct(this.searchFilter);
      return this.getProducts();
    },

    async filterNameFab() {
      if (this.searchManufacturer.length > 1)
        return this.filterNameManufacturer(this.searchManufacturer);
      return this.getManufacturers();
    },

    async save() {
      //ACTUALIZAR PRODUCTO

      if (this.editedIndex > -1) {
        const idManufacturer = this.listManufacturers.filter(
          ({ text, value }) => {
            if (text == this.$refs.idManufacturer.value) return value;
          }
        );

        const $idProd = this.editedItem.id;
        delete this.editedItem.id;

        this.editedItem.estado === "Activo"
          ? (this.editedItem.estado = 0)
          : (this.editedItem.estado = 1);

        let $data = new FormData();
        $data.append("nombre", this.editedItem.nombre);
        $data.append("modelo", this.editedItem.modelo);
        $data.append("presentacion", this.editedItem.presentacion);
        $data.append("descripcion", this.editedItem.descripcion);
        $data.append("fabricante", idManufacturer[0].value);
        $data.append("estado", this.editedItem.estado);
        $data.append("costo", this.editedItem.costo);
        $data.append("utilidad", this.editedItem.utilidad);
        $data.append("precioVenta", this.editedItem.precioVenta);
        $data.append("stockIn", this.editedItem.stockIn);
        this.file != undefined
          ? $data.append("imagen", this.file)
          : console.log("");

        await this.updateProduct({ id: $idProd, Product: $data });

        this.editedProduct.fabricante = {
          descripcion: idManufacturer[0].text,
        };

        if (this.message.msj == "Producto Actualizado!") {
          Object.assign(this.desserts[this.editedIndex], this.editedProduct);
          this.close();
        }

        //NUEVO PRODUCTO
      } else {
        const idManufacturer = this.listManufacturers.filter(
          ({ text, value }) => {
            if (text == this.$refs.idManufacturer.value) return value;
          }
        );

        this.editedItem.estado === "Activo"
          ? (this.editedItem.estado = 0)
          : (this.editedItem.estado = 1);

        let $data = new FormData();
        $data.append("nombre", this.editedItem.nombre);
        $data.append("modelo", this.editedItem.modelo);
        $data.append("presentacion", this.editedItem.presentacion);
        $data.append("descripcion", this.editedItem.descripcion);
        $data.append("fabricante", idManufacturer[0].value);
        $data.append("estado", this.editedItem.estado);
        $data.append("costo", this.editedItem.costo);
        $data.append("utilidad", this.editedItem.utilidad);
        $data.append("precioVenta", this.editedItem.precioVenta);
        $data.append("stockIn", this.editedItem.stockIn);
        this.file != undefined
          ? $data.append("imagen", this.file)
          : console.log("");

        await this.saveProduct($data);

        this.newProduct.fabricante = {
          descripcion: idManufacturer[0].text,
        };

        if (this.message.msj == "Producto Agregado!") {
          this.getCountPaginator();
          this.desserts.push(this.newProduct);
          this.close();
        }
      }
    },
  },
};
</script>
<style>
</style>