
export default{
    namespaced: true,
    state() {
        return{
          message: '',
    
          // ARRAYS
          listDetSale: [],
        }
      },

      mutations: {
        setMessage(state, message){
            state.message = message
          },
          
          setLisDetSale(state, list){
            state.listDetSale = list
          },
      },
      actions: {
        //GETS
        async getDetailSale({commit, rootState}, payload){
            const data = await fetch(`${rootState.url}detalle-venta/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
          },
        });
            const { results } = await data.json();
            commit('setLisDetSale', results)
          },

        //DELETES
        async deleteDetSale({commit, rootState}, payload){
            try {
            const data = await fetch(
                `${rootState.url}detalle-venta/${payload.id}`,
                {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
                },
                }
            );
            const { msj } = await data.json();
            commit('setMessage', msj)
            } catch (error) {
            commit('setMessage', 'Error de servidor!')
            }
        },

          //FILTERS
        /*async filterCliPro({commit, rootState}, payload){
            const data = await fetch(
                `${rootState.url}api/filtrar-cliente-nombre/${payload.cliPro}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const response = await data.json();
            commit('setListCliPro', response)
          },

          async filterCountries({commit, rootState}, payload){
            const data = await fetch(
                `${rootState.url}api/filtrar-pais/${payload.country}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const response = await data.json();
              commit('setCountries', response)
          },*/
      },
      getters:{
      },
      modules:{
      }
}