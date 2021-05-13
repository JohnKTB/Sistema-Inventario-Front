
export default{
    namespaced: true,
    state() {
      return{
        message: '',
        
        //JSONS
        editedRole: {},
        newRole: {},

        //ARRAYS
        listRoles: [],
        rolePermissions: []
      }
    },
    mutations: {
      setListRoles(state, list){
        state.listRoles = list
      },

      setEditedRole(state, editedRole){
        state.editedRole = editedRole
      },

    setDetailRole(state, permissions){
        state.rolePermissions = permissions;
      },
    
    addNewRole(state, RoleCreated){
        state.newRole = RoleCreated
      },
      setMessage(state, message){
        state.message = message
      },
    },
    actions: {
      //GETS
      async getRoles({commit, rootState}){
        try {
          const data = await fetch(`${rootState.url}grupos/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
            },
          });
          const response = await data.json();
            commit('setListRoles', response)
        } catch (error) {
          commit('setMessage', {msj: 'Error de servidor!', 
                                icon: 'error'})
        }

        },

      //DELETE
      async deleteRol({commit, rootState}, payload){
        try {
        const data = await fetch(
            `${rootState.url}grupos/${payload.id}`,
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
        commit('setMessage', 'Error de servidor!')
        }
    },
    //DETAIL
    async retrieveRoles({commit, rootState}, idRole){
      try {
        const data = await fetch(`${rootState.url}grupos/${idRole}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
          },
        });
        const { permissions } = await data.json();
        let arrayPermissions = [];
        permissions.forEach(({ name }) => {
          arrayPermissions.push(name.split(" ")[2]);
        });
        commit('setDetailRole', arrayPermissions)
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


