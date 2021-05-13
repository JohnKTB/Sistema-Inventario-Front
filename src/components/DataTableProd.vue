<template>
  <v-container>
    <v-card>
      <v-card-title style="padding-left: 4em; padding-right: 15em">
        <v-text-field
          @keyup="filterProd()"
          v-model="searchProd"
          label="Buscar por Nombre"
          append-icon="mdi-magnify"
          color="info"
          solo
          dense
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <font-awesome-icon
              size="2x"
              @click="AddProduct(item)"
              icon="cart-plus"
            />
          </template>
          <template v-slot:[`item.cantidad`]="{ item }">
            <v-text-field
              v-model="item.cantidad"
              @click="ValidateQuantity(item)"
              @keyup="ValidateQuantity(item)"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
            ></v-text-field>
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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "DataTableProd",
  data() {
    return {
      page: 1,
      countPaginator: 0,
      editedIndex: -1,

      //DATA SELECTED
      numberSelected: 0,

      //SEARCH DATA
      searchProd: "",

      //ARRAYS
      idStock: [],
      desserts: [],
      headers: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Producto", value: "nombre" },
        { text: "Fabricante", value: "fabricante.descripcion" },
        { text: "Stock", value: "stockIn" },
        { text: "Precio", value: "precioVenta" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Acciones", value: "actions", sortable: false },
      ],

      //JSONS
      editedItem: {},
      defaultItem: {},
    };
  },

  watch: {
    //REGRESAMOS EL STOCK DEL PRODUCTO QUE YA NO COMPRAREMOS
    productDeleted() {
      this.idStock.forEach((data, iSto) => {
          if (data.id === this.productDeleted.id) {
            delete this.idStock[iSto];
          }
      });
    
    //CUANDO ABRIMOS EL COMPONENTE DATATABLE, NO SE LE SUMABA
    //EL STOCK DEL PRODUCTO ELIMINADO, CON ESTO SE SOLUCIONA
      this.desserts.forEach((data, iDess) => {
          if (data.id === this.productDeleted.id) {
            this.desserts[iDess].stockIn += this.productDeleted.stock;
          }
      });
    },
  },

  created() {
    this.getCountPaginator();
    this.getProductos;
  },

  computed: {
    ...mapState("getsNuevaVenta", ["newProduct", "productDeleted"]),
    ...mapState('usuario', ['token', ]),

    async getProductos() {
      const data = await fetch(
        `http://127.0.0.1:8000/productos/?page=${this.page}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          });
      const { results } = await data.json();

      this.replaceNewStock(results);

      this.desserts = results;
    },
  },

  methods: {
    ...mapActions("getsNuevaVenta", ["getNewProduct"]),

    replaceNewStock(results) {
      results.forEach((data, iRes) => {
        this.idStock.forEach((element, iSto) => {
          if (data.id === element.id) {
            results[iRes].stockIn = this.idStock[iSto].stock;
          }
        });
      });
    },

    ValidateQuantity(item) {
      if (item.cantidad < 0) {
        this.$swal.fire({
          title: "Eliga cantidad mayores a 0!",
          icon: "error",
        });
        item.cantidad = 0;
        Object.assign(this.desserts, item);
      }
      if (item.cantidad > item.stockIn) {
        this.$swal.fire({
          title: "No hay stock suficiente!",
          icon: "error",
        });
        item.cantidad = 0;
        Object.assign(this.desserts, item);
      }
    },

    changePage(page) {
      this.page = page <= 0 || page > this.countPaginator ? this.page : page;
      this.getProductos;
    },

    async AddProduct(item) {
      if (item.cantidad === undefined) {
        this.$swal.fire({
          title: "Eliga una cantidad!",
          icon: "error",
        });
      } else {
        const data = await fetch(`http://127.0.0.1:8000/productos/${item.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
          },
        });
        const response = await data.json();

        response.stockIn = Number(item.cantidad);

        item.stockIn -= item.cantidad;
        item.cantidad = 0;
        this.ValidateQuantity(item);
        this.idStock.push({ id: item.id, stock: item.stockIn });
        this.getNewProduct(response);
      }
    },

    //GETS
    async getCountPaginator() {
      try {
        const data = await fetch(`http://127.0.0.1:8000/productos/`, {
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

    //FILTERS

    async filterProd() {
      if (this.searchProd.length > 1) {
        const data = await fetch(
          `http://127.0.0.1:8000/api/filtrar-producto/${this.searchProd}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
            },
          }
        );
        const response = await data.json();
        this.replaceNewStock(response);
        this.desserts = response;

        //Menos de la tercera letra regresa la lista normal
      } else {
        const data = await fetch(`http://127.0.0.1:8000/productos/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${this.token.replace(/['"]+/g, "")}`,
          },
        });
        const { results } = await data.json();
        this.replaceNewStock(results);
        this.desserts = results;
        //Para que se seleccione de nuevo la primera pagina
        this.page = 1;
      }
    },
  },
};
</script>

<style>
</style>