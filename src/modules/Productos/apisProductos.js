import axios from "axios";

export default{
    namespaced: true,
    state() {
        return{
          message: '',

          //JSONS
          editedProduct: {},
          detailProduct: {},
          newProduct: {},

    
          // ARRAYS
          listProducts: [],
          listManufacturers: []
        }
      },

      mutations: {
        setMessage(state, message){
            state.message = message
          },
          
        setListProducts(state, list){
            state.listProducts = list
          },
        
        setEditedProduct(state, editedProduct){
            state.editedProduct = editedProduct
          },

        setDetailProduct(state, detailProduct){
            state.detailProduct = detailProduct
          },
        
        addNewProduct(state, ProductCreated){
            state.newProduct = ProductCreated
          },

        setListManufacturers(state, list){
            state.listManufacturers = list
          },

      },
      actions: {
        //GETS
        async getProducts({commit, rootState}){
          try {
            const data = await fetch(`${rootState.url}productos/`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                },
              });
              const { results } = await data.json();
              
              results.forEach(({ estado }, i) => {
                if (estado === 0) return results[i].estado = "Activo";
                    return results[i].estado = "Inactivo";
              });
              commit('setListProducts', results)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                  icon: 'error'})
          }
  
          },

          async getManufacturers({commit, rootState}){
            try {
                let arrayManufacturers = []
                const data = await fetch(`${rootState.url}fabricantes/`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                    },
                  });
                  const { results } = await data.json();
                  
                  results.forEach(({ descripcion, id }) => {
                    arrayManufacturers.push({ text: descripcion, value: id });
                  });
                  commit('setListManufacturers', arrayManufacturers)
            } catch (error) {
                commit('setMessage', {msj: 'Error de servidor!', 
                      icon: 'error'})
            }
        },

        //DELETES
        async deleteProduct({commit, rootState}, idProduct){
            try {
                const data = await fetch(
                    `${rootState.url}productos/${idProduct}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                      },
                    }
                  );
                  const { msj } = await data.json();
                  commit('setMessage', {msj: msj, 
                                        icon: 'success'})
            } catch (error) {
              console.log(error)
              commit('setMessage', {msj: 'Error de servidor!', 
              icon: 'error'})
            }
        },

        //DETAIL
        async retrieveProducts({commit, rootState}, idProduct){
          try {
            const data = await fetch(`${rootState.url}productos/${idProduct}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                },
              });
              const response = await data.json();
              
              response.fabricante = response.fabricante.descripcion;
              response.estado === 0
                ? (response.estado = "Activo")
                : (response.estado = "Inactivo");
            commit('setDetailProduct', response)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                    icon: 'error'})
          }
        },

        //UPDATE
        async updateProduct({commit, rootState}, editedProduct){
            
          try {
            const { data } = await axios.put(
                `${rootState.url}productos/${editedProduct.id}/`,
                editedProduct.Product,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                  },
                }
              );
              
              data.estado === 0
            ? (data.estado = "Activo")
            : (data.estado = "Inactivo");
            commit('setEditedProduct', data)
            commit('setMessage', {msj: 'Producto Actualizado!', 
                                icon: 'success'})
        } catch (error) {
            console.log(error)
          commit('setMessage', {msj: 'Error de servidor!', 
                                icon: 'error'})
        }
        },

        //SAVE
        async saveProduct({commit, rootState}, newProduct){
            
          try {
            const { data } = await axios.post(`${rootState.url}productos/`, newProduct, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                },
              });
              data.estado === 0
            ? (data.estado = "Activo")
            : (data.estado = "Inactivo");
            commit('addNewProduct', data)
            commit('setMessage', {msj: 'Producto Agregado!', 
                                icon: 'success'})
        } catch (error) {
          commit('setMessage', {msj: 'Error de servidor!', 
                                icon: 'error'})
        }
        },

          //FILTERS
        async filterNameProduct({commit, rootState}, NameProduct){
          try {
            const data = await fetch(
                `${rootState.url}api/filtrar-producto/${NameProduct}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                  },
                }
              );
              const response = await data.json();
              response.forEach(({ estado }, i) => {
                if (estado === 0) return response[i].estado = "Activo";
                    return response[i].estado = "Inactivo";
              });
            commit('setListProducts', response)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                    icon: 'error'})
          }
            
          },

          async filterNameManufacturer({commit, rootState}, manufacturer){
            try {
                let arrayManufacturers = []
                const data = await fetch(`${rootState.url}api/filtrar-fabricante-activo/${manufacturer}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                    },
                  });
                  const response = await data.json();
                  
                  response.forEach(({ descripcion, id }) => {
                    arrayManufacturers.push({ text: descripcion, value: id });
                  });
                  commit('setListManufacturers', arrayManufacturers)
            } catch (error) {
              commit('setMessage', {msj: 'Error de servidor!', 
                                    icon: 'error'})
            }
            
          },
      },
      getters:{
      },
      modules:{
      }
}