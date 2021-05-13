import router from '../router';

export default{
    namespaced: true,
    state: {
        $id: 0,
        $name: ''
      },
      mutations: {
          
        setId(state, payload) {
            let newId = 0;
            payload.array.forEach(({ descripcion, id }) => {
              if (payload.string === descripcion) {
                newId = id;
              }
              state.$id = newId
            });
          },
        
        setName(state, payload) {
            let $nameCountry = "";
            payload.array.forEach(({ descripcion, id }) => {
              if (payload.id == id) {
                state.$name = descripcion;
              }
            });
            return $nameCountry;
          },
      },
      actions: {
        getId({commit}, payload){
            commit('setId', payload)
        },

        getName({commit}, payload){
            commit('setName', payload)
        },
      },
      getters:{
      },
      modules:{
      }
}