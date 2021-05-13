
export default{
    namespaced: true,
    state() {
      return{
        permissionsAsigned: [],
        rol: '',
      }
      },
    mutations: {
      initializeNameRol(state){
        state.rol = ""
      },
      initializePermissions(state){
        state.permissionsAsigned = []
      },
      setPermissions(state, payload) {
            state.permissionsAsigned.push(payload)
      },
      setArrayPermissions(state, payload) {
        
        state.permissionsAsigned = payload
      },
      setRol(state, payload){
        state.rol = payload
      },
      removePermissions(state, payload) {
        state.permissionsAsigned.splice(payload, 1)
      },
      reset(state) {
        state.permissionsAsigned = []
  },
    },
    actions: {
        addPermissions({commit}, payload){
            commit('setPermissions', payload)
        },
        addArrayPermissions({commit}, payload){
          commit('setArrayPermissions', payload)
      },
        deletePermission({commit}, payload){
          commit('removePermissions', payload)
      },
        addRol({commit}, payload){
          commit('setRol', payload)
      },
      resetPermissions({commit}){
        commit('reset')
      }
      },
      getters:{
      },
      modules:{
      }
}

