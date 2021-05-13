
export default{
    namespaced: true,
    state: {
        productDeleted: {},
        newProduct: [],
        newStock: 0,
      },
      mutations: {
          initializeNewProduct(state){
            state.newProduct = []
          },
          setProductDeleted(state, product){
            state.productDeleted = product
          },
          setNewProduct(state, product){

              state.newProduct.forEach((data, index) =>{
                
                if( product.id === data.id){
                  //SUMO LA CANTIDAD ANTERIOR CON LA NUEVA
                  state.newProduct[index].stockIn += product.stockIn
                  
                  //AGREGO LA NUEVA CANTIDAD
                  product.stockIn = data.stockIn

                  //ELIMINO EL ELEMENTO DUPLICADO
                  delete state.newProduct[index]
                }
              })
            
            state.newProduct.push( product )
          }
          
      },
      actions: {
          //GETS
          getNewProduct({commit, }, payload){
            
            payload.precioTotal = payload.precioVenta * payload.stockIn
            commit('setNewProduct', payload)
          }
      },
      getters:{
      },
      modules:{
      }
}