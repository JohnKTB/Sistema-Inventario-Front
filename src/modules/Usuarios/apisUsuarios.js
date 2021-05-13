
export default{
    namespaced: true,
    state() {
      return{
        ListUsers: [],
        roles:[],
        message: {},
        UserCreated: {},
        editedUser: {},
        filteredUser: {},
        detailUser: {}
      }
      },
    mutations: {
      setListUsers(state, listUsers){
        state.ListUsers = listUsers
      },
      setNewUser(state, newUser){
        
        state.UserCreated = newUser
      },
      setEditedUser(state, editUser){
        state.editedUser = editUser
      },
      setFilteredUser(state, searchedUser){
        state.filteredUser = searchedUser
      },
      setDetailUser(state, detailUser){
        state.detailUser = detailUser
      },
      setRoles(state, roles){
        state.roles = roles.map(({ name, id }) => {
          return { text: name, value: id };
        });
      },
      setMessage(state, message){
        state.message = message
      },
    },
    actions: {
        async Users({commit, rootState}){
            try {
            const data = await fetch(
                `${rootState.url}usuarios/`,
                {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
                },
                }
            );
            const response = await data.json();
            response.forEach((element, i) => {
                element.groups.forEach( ({ name }) =>{
          
                    response[i].groups = name
                })
            });
            commit('setListUsers', response)
            } catch (error) {
            commit('setMessage', 'Error de servidor!')
            }
        },
        async SaveNewUsers({commit, rootState}, newUser){
          try {
            const data = await fetch(`${rootState.url}usuarios/`, {
              method: "POST",
              body: JSON.stringify(newUser),
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
              },
            });
            const response = await data.json();
            
            if(response.groups){
            response.groups = response.groups[0].name
            commit('setNewUser', response)
            commit('setMessage', {msj: 'Usuario Creado!', 
                                  icon: 'success'})
            }else{
              commit('setNewUser', '')
              commit('setMessage', {msj: 'Nombre de usuario ya existe!', 
                                  icon: 'error'})
            }
          } catch (error) {
            commit('setMessage', {msj: 'Error de servidor!', 
                                  icon: 'error'})
          }
      },
      async updateUser({commit, rootState}, editedUser){
        try {
        const data = await fetch(
          `${rootState.url}usuarios/${editedUser.id}/`,
          {
            method: "PUT",
            body: JSON.stringify(editedUser.user),
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
            },
          }
        );
        const response = await data.json();
        commit('setEditedUser', response)
        commit('setMessage', {msj: 'Usuario Actualizado!', 
                              icon: 'success'})
      } catch (error) {
        commit('setMessage', {msj: 'Error de servidor!', 
                              icon: 'error'})
      }
      },
      async deletUser({commit, rootState}, idUser){
        try {
          const data = await fetch(`${rootState.url}usuarios/${idUser}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
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

      async retrieveUser({commit, rootState}, idUser){
        try {
          const data = await fetch(`${rootState.url}usuarios/${idUser}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
            },
          });
          const response = await data.json();
          response.groups = response.groups[0];
          commit('setDetailUser', response)
        } catch (error) {
          commit('setMessage', {msj: 'Error de servidor!', 
                                  icon: 'error'})
        }
      },

      async filterUserxName({commit, rootState}, nameUser){
        try {
          const data = await fetch(`${rootState.url}api/filtrar-usuario/${nameUser}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${rootState.usuario.token.replace(/['"]+/g, '')}`
            },
          });
          const response = await data.json();
          response.forEach((element, i) => {
            element.groups.forEach( ({ name }) =>{
      
                response[i].groups = name
            })
        });
        
          commit('setFilteredUser', response)
        } catch (error) {
          commit('setMessage', {msj: 'Error de servidor!', 
                                  icon: 'error'})
        }
      },

      //ROLES
      async getRoles({commit, rootState}){
        try {
          const data = await fetch(`${rootState.url}grupos/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${rootState.usuario.token.replace(/['"]+/g, "")}`,
            },
          });
          const response = await data.json();
          commit('setRoles', response)
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

