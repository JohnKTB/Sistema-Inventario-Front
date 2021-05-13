<template>
  <v-container>
    <CerrarSesion @accion="closeSession()"/>
    <Drawer />
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>
            <p>Nueva Venta</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox
              @keyup="filterNameClient()"
              v-model="ClientSelected"
              :search-input.sync="searchClient"
              ref="idClient"
              :items="clients"
              label="Elegir Cliente"
              dense
              solo
              clearable
              outlined
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> No hay resultados </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>
          </v-col>
          <v-col>
            <v-toolbar style="margin-top: -0.5em" flat>
              <v-dialog v-model="dialog" max-width="950px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="info"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon large> mdi-magnify </v-icon>
                    Buscar Producto
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline"> Buscar Producto </span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <DataTableProd />
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Salir
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title
                    >Estas seguro de eliminar este producto?</v-card-title
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
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          :items-per-page="100000"
          dense
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:[`body.append`]="">
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Precio Neto:</td>
              <td>{{ netPrice }}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <v-checkbox
                  v-model="igvSelected"
                  :label="`IGV: ${igv}`"
                ></v-checkbox>
              </td>
              <td>{{ igvPrice }}</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Precio Total:</td>
              <td>{{ totalPrice }}</td>
              <td></td>
            </tr>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <p>Agregue producto</p>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="makeSale()">
          Realizar Venta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import DataTableProd from "../components/DataTableProd";
import CerrarSesion from "../components/CerrarSesion";
import Drawer from '../layouts/Drawer'

export default {
  components: {
    CerrarSesion,
    DataTableProd,
    Drawer
  },
  data() {
    return {
      //STRINGS
      ClientSelected: "",
      searchClient: "",

      //NUMBERS
      netPrice: 0,
      totalPrice: 0,
      igvPrice: 0,
      igv: 0.18,
      page: 1,
      editedIndex: -1,

      //BOOLEANS
      igvSelected: false,
      dialog: false,
      dialogDelete: false,

      //ARRAYS
      clients: [],
      headers: [
        {
          text: "Codigo",
          align: "id",
          sortable: false,
          value: "id",
        },
        { text: "Cant", value: "stockIn" },
        { text: "Descripcion", value: "nombre" },
        { text: "Precio Unit.", value: "precioVenta" },
        { text: "Precio Total", value: "precioTotal" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      desserts: [],

      //JSONS
      editedItem: {},
      defaultItem: {},
    };
  },

  computed: {
    ...mapState("getsNuevaVenta", ["newProduct"]),
    ...mapState("apisNuevaVenta", ["listClients"]),
    ...mapState('usuario', ['token', ]),
  },

  watch: {
    listClients() {
      this.clients = [];
      this.listClients.forEach(({ nombreCli, id }) => {
        this.clients.push({ text: nombreCli, value: id });
      });
    },
    newProduct() {
      this.totalPrice = 0;
      this.desserts = this.newProduct;

      this.desserts.forEach(({ precioTotal }) => {
        this.totalPrice += precioTotal;
      });
      this.netPrice = this.precioTotal;
    },

    igvSelected() {
      if (this.igvSelected) {
        this.igvPrice = 0;
        this.totalPrice = 0;
        this.desserts.forEach(({ precioTotal }) => {
          this.totalPrice += precioTotal;
        });
        this.igvPrice = this.totalPrice * 0.18;
        this.totalPrice -= this.igvPrice;
      } else {
        this.igvPrice = 0;
        this.totalPrice = 0;
        this.desserts.forEach(({ precioTotal }) => {
          this.totalPrice += precioTotal;
        });
      }
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.getCliPro();
    //RESETEAMOS EL ARRAY "NEWPRODUCT" CUANDO CAMBIAMOS DE VISTA
    this.initializeNewProduct();
  },

  methods: {
    ...mapActions("apisNuevaVenta", ["getCliPro", "filterClients"]),
    ...mapMutations("getsNuevaVenta", [
      "initializeNewProduct",
      "setProductDeleted",
      "setProductDeleted",
    ]),
    ...mapActions('usuario', ['closeSession']),
    
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //AQUI TENEMOS EL ELEMENTO ELIMINADO
      //DEBEMOS REGRESAR EL STOCK AL COMPONENTE DATATABLEPROD

      this.setProductDeleted({
        id: this.editedItem.id,
        stock: this.editedItem.stockIn,
      });

      this.desserts.splice(this.editedIndex, 1);
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

    async makeSale() {
      
      if (this.ClientSelected === "") {
        this.$swal.fire({
          title: "clic en algun cliente!",
          icon: "error",
        });
      }
      if (this.$refs.idClient.value.text === undefined) {
        this.$swal.fire({
          title: "clic en algun cliente!",
          icon: "error",
        });
      } else {
        try {
          let products = [],
            quantities = [];
          this.desserts.forEach(({ id, stockIn }) => {
            products.push(id);
            quantities.push(stockIn);
          });
          let sale = {
            cliente: this.$refs.idClient.value.value,
            productos: products,
            cantidades: quantities,
            precioTotal: this.totalPrice,
          };
          const data = await fetch(`http://127.0.0.1:8000/ventas/`, {
            method: "POST",
            body: JSON.stringify(sale),
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          });
          const { msj } = await data.json();
          this.$swal.fire({
            title: msj,
            icon: "success",
          });
        } catch (error) {
          this.$swal.fire({
            title: "Error de servidor!",
            icon: "error",
          });
        }
      }
    },

    //GETS

    //FILTERS
    async filterNameClient() {
      
      if (this.searchClient !== null) {
        if (this.searchClient.length > 1) {
          await this.filterClients({ client: this.searchClient });

          //Menos de la tercera letra regresa la lista normal
        } else {
          await this.getCliPro();
        }
      } else {
        await this.getCliPro();
      }
    },
  },
};
</script>

<style>
</style>