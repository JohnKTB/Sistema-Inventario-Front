
export default{
    namespaced: true,
    state() {
      return{
        listClients: [],
      }
      },
      mutations: {
        setCliPro(state, clients){
          
          state.listClients = clients
        },
      },
      actions: {
        //GETS
        async getCliPro({commit, rootState}, payload){
          const data = await fetch(`${rootState.url}clientes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
        },
      });
          const { results } = await data.json();
          commit('setCliPro', results)
        },

        //FILTERS
        async filterClients({commit, rootState}, payload){
          const data = await fetch(
            `${rootState.url}api/filtrar-cliente-nombre/${payload.client}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
              },
            }
          );
          const results = await data.json();
          commit('setCliPro', results)
        },
      },
      getters:{
      },
      modules:{
      }
}