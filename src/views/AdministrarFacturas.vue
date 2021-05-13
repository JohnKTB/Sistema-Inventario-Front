<template>
  <v-container>
    <CerrarSesion @accion="closeSession()" />
    <Drawer />
    <v-card>
      <v-card-title>
        <v-toolbar style="padding-top: 0.5em" flat>
          <v-toolbar-title>Listado Ventas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="">
              <v-btn color="info" dark class="mb-2" :to="routeNewSale">
                Nueva venta
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container> fsdfwfew </v-container>
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
          dense
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon class="mr-2" @click="GeneratePDF(item)">
              mdi-file-pdf
            </v-icon>

            <!--<v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon> -->
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
import { mapActions, mapState } from "vuex";
import Drawer from "../layouts/Drawer";
import CerrarSesion from "../components/CerrarSesion";

export default {
  components: {
    CerrarSesion,
    Drawer,
  },
  data() {
    return {
      rutaPDF: "",
      dialog: false,
      dialogDelete: false,

      //NUMBERS
      editedIndex: -1,
      page: 1,
      countPaginator: 0,

      //JSONS
      routeNewSale: { name: "NuevaVenta" },
      editedItem: {},
      defaultItem: {},

      //ARRAYS
      headers: [
        {
          text: "Factura Nro.",
          align: "id",
          sortable: false,
          value: "id",
        },
        { text: "Cantidad Productos", value: "cantidad" },
        { text: "Cliente", value: "venta.cliente.cliente" },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      desserts: [],
    };
  },

  computed: {
    ...mapState(["url", "test"]),
    ...mapState("usuario", ["token"]),
    ...mapState("apisAdmVent", ["message", "listDetSale"]),

    async getDetailsSales() {
      const response = await fetch(
        `${this.url}detalle-venta/?page=${this.page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, '')}`
        },
      });
      const { results } = await response.json();
      console.log(results);
      results.forEach(({ venta }, index) => {
        results[index].venta.cliente = {
          cliente: `${venta.cliente.apellidoCli} ${venta.cliente.nombreCli}`,
        };
      });

      this.desserts = results;
    },

    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
    this.getDetailsSales;
    this.getCountPaginator();
  },

  methods: {
    ...mapActions("apisAdmVent", ["getDetailSale", "deleteDetSale"]),
    ...mapActions('usuario', ['closeSession']),

    async GeneratePDF(item) {
      const data = await fetch(`${this.url}api/pdf/`, {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, '')}`
        },
      });

      const response = await data.blob();
      const file = URL.createObjectURL(response);
      this.rutaPDF = file;
      window.open(this.rutaPDF);
    },

    changePage(page) {
      this.page = page <= 0 || page > this.countPaginator ? this.page : page;
      this.getDetailsSales;
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
      this.closeDelete();

      const idDetSale = this.editedItem.id;

      await this.deleteDetSale({ id: this.editedItem.id });
      this.desserts.forEach(({ id }, index) => {
        if (idDetSale === id) {
          this.desserts.splice(index, 1);
          this.$swal.fire({
            title: this.message,
            icon: "success",
          });
          this.getCountPaginator();
        }
      });
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

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },

    //GETS
    async getCountPaginator() {
      try {
        const data = await fetch(`${this.url}detalle-venta/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${this.token.replace(/['"]+/g, '')}`
        },
      });
        const { count, results } = await data.json();
        this.countPaginator = Math.ceil(count / results.length);
      } catch (error) {}
    },
  },
};
</script>

<style>
</style>