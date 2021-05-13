
export default{
    namespaced: true,
    state() {
        return{
          message: '',

          //JSONS
          editedCliPro: {},
          detailCliPro: {},
          newCliPro: {},

    
          // ARRAYS
          listCountries: [],
          listCliPro: [],
        }
      },

      mutations: {
        setMessage(state, message){
            state.message = message
          },
          
        setListCliPro(state, list){
            state.listCliPro = list
          },
        
        setEditedCliPro(state, editedCliPro){
            state.editedCliPro = editedCliPro
          },

        setDetailCliPro(state, detailCliPro){
            state.detailCliPro = detailCliPro
          },
        
        addNewCliPro(state, CliProCreated){
            state.newCliPro = CliProCreated
          },

        setCountries(state, countries){
            state.listCountries = countries
          },
      },
      actions: {
        //GETS
        async getCliPro({commit, rootState}){
          try {
            const data = await fetch(`${rootState.url}clientes/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
                
              },
            });
                const { results } = await data.json();
                commit('setListCliPro', results)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                  icon: 'error'})
          }
  
          },

        async getCountries({commit, rootState}){
          try {
            let arrayCountries = []
            const data = await fetch(`${rootState.url}api/paises/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
              },
            });
                const results = await data.json();
                results.forEach(({ descripcion, id }) => {
                  arrayCountries.push({ text: descripcion, value: id });
                });
                
                commit('setCountries', arrayCountries)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
              icon: 'error'})
          }
            
          },

        //DELETES
        async deleteCliPro({commit, rootState}, payload){
            try {
            const data = await fetch(
                `${rootState.url}clientes/${payload}`,
                {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
                },
                }
            );
            const { msj } = await data.json();
            commit('setMessage', {msj: msj, 
            icon: 'success'})
            } catch (error) {
              commit('setMessage', {msj: 'Error de servidor!', 
              icon: 'error'})
            }
        },

        //DETAIL
        async retrieveCliPro({commit, rootState}, idCliPro){
          try {
            const data = await fetch(`${rootState.url}clientes/${idCliPro}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
              },
            });
            const response = await data.json();
            response.pais = response.pais.descripcion;
            commit('setDetailCliPro', response)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                    icon: 'error'})
          }
        },

        //UPDATE
        async updateCliPro({commit, rootState}, editedCliPro){
            
          try {
            const data = await fetch(`${rootState.url}clientes/${editedCliPro.id}/`, {
              method: "PUT",
              body: JSON.stringify(editedCliPro.CliPro),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
              },
            });
              const response = await data.json();
              
              commit('setEditedCliPro', response)
              commit('setMessage', {msj: 'Cliente Actualizado!', 
                                icon: 'success'})
        } catch (error) {
          commit('setMessage', {msj: 'Error de servidor!', 
                                icon: 'error'})
        }
        },

        //SAVE
        async saveCliPro({commit, rootState}, newCliPro){
            
          try {
            const data = await fetch(`${rootState.url}clientes/`, {
              method: "POST",
              body: JSON.stringify(newCliPro),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
              },
            });
            const response = await data.json();
            commit('addNewCliPro', response)
              commit('setMessage', {msj: 'Cliente Agregado!', 
                                icon: 'success'})
        } catch (error) {
          commit('setMessage', {msj: 'Error de servidor!', 
                                icon: 'error'})
        }
        },

          //FILTERS
        async filterCliPro({commit, rootState}, payload){
          try {
            const data = await fetch(
              `${rootState.url}api/filtrar-cliente-nombre/${payload}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
                },
              }
            );
            const response = await data.json();
          commit('setListCliPro', response)
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                    icon: 'error'})
          }
            
          },

          async filterCountries({commit, rootState}, payload){
            try {
              let arrayCountries = []
              const data = await fetch(
                `${rootState.url}api/filtrar-pais/${payload}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
                  },
                }
              );
              const response = await data.json();
              response.forEach(({ descripcion, id }) => {
                  arrayCountries.push({ text: descripcion, value: id });
                });
              commit('setCountries', arrayCountries)
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