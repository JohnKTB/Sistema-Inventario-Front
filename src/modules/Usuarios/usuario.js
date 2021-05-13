import router from '../../router';
import decode from "jwt-decode";

export default{
    namespaced: true,
    state() {
      return{
        token:'',
        user: '',
      }
      },
      mutations: {
        getUser(state, payload){
          state.token = payload 
          if(payload === ''){
            state.user = ''
          }else{
            
            state.user = decode(payload)
            router.push({name:'Home'})
          }
        },
      },
      actions: {
        saveUser({commit}, payload){
          localStorage.setItem('token', JSON.stringify(payload))
          commit('getUser', payload)
        },
        closeSession({commit}){
          
          commit('getUser', '')
          localStorage.removeItem('token')
          router.push({name:'Login'})
        },
        readToken({commit}){
          const token = localStorage.getItem('token')
          if(token){
            commit('getUser', token)
          }else{
            commit('getUser', '')
          }
      },
      },
      getters:{
        isActive: state => !!state.token
      },
      modules:{
      }
}