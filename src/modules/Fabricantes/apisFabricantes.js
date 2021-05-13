
export default{
    namespaced: true,
    state() {
      return{
        message: '',

        //JSONS
        newManufacturer: {},

        // ARRAYS
        listManufacturer: [],
      }
      },
      mutations: {
        setMessage(state, message){
            state.message = message
          },

        addNewManufacturer(state, manufacturerCreated){
            state.newManufacturer = manufacturerCreated
          },
          
        setListManufacturer(state, list){
            
            state.listManufacturer = list
          },
      },
      actions: {
        //GETS
        async getManufactures({commit, rootState}, payload){
            try {
                const data = await fetch(`${rootState.url}fabricantes/`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                    },
                  });
                  const { results } = await data.json();
                  results.forEach(({ estado }, i) => {
                    if (estado === 0) {
                      results[i].estado = "Activo";
                      commit('setListManufacturer', results)
                    } else {
                      results[i].estado = "Inactivo";
                      commit('setListManufacturer', results)
                    }
                  });
            } catch (error) {
                commit('setMessage', {msj: 'Error de servidor!', 
                      icon: 'error'})
            }
        },

        //DELETES
        async deleteManufacturer({commit, rootState}, payload){
            try {
                const data = await fetch(
                    `${rootState.url}fabricantes/${payload}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
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

        //UPDATE
        async updateManufacturer({commit, rootState}, editedManufacturer){
            
            try {
                const data = await fetch(`${rootState.url}fabricantes/${editedManufacturer.id}/`, {
                    method: "PUT",
                    body: JSON.stringify(editedManufacturer.manufacturer),
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                    },
                  });
                  const { msj } = await data.json();
                commit('setMessage', {msj: msj, 
                                  icon: 'success'})
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                  icon: 'error'})
          }
          },

        //SAVE
        async SaveNewManufacturer({commit, rootState}, newManufacturer){
            try {
                const data = await fetch(`${rootState.url}fabricantes/`, {
                    method: "POST",
                    body: JSON.stringify(newManufacturer),
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
                    },
                  });
                  const response = await data.json();
                  if (response.estado === 0) {
                    response.estado = "Activo"
                  }else{
                    return response.estado = "Inactivo"
                  }
                  commit('addNewManufacturer', response)
                  commit('setMessage', {msj: 'Usuario Agregado!', 
                                    icon: 'success'})
            } catch (error) {
              commit('setMessage', {msj: 'Error de servidor!', 
                                    icon: 'error'})
            }
        },

        //FILTERS 
        async filterManufactures({commit, rootState}, payload){
            console.log(payload)
            try{
                const data = await fetch(
                    `${rootState.url}api/filtrar-fabricante/${payload}`,
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
                    if (estado === 0) {
                      response[i].estado = "Activo";
                      commit('setListManufacturer', response)
                    } 
                    if (estado === 1) {
                      response[i].estado = "Inactivo";
                      commit('setListManufacturer', response)
                    }
                  });
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