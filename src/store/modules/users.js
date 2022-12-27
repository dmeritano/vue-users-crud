import apiDms from "@/services/service-apidms"

function initialState () {
  return {
    dmsInfo:{},
    users:[]
  }
}

const moduleUsers = {
  namespaced: true,
  state: initialState(),
  /*
  state: () => ({
    dmsInfo : {},
    users:[],
  }),*/
  getters : {
    dmsInfo(state){
      return state.dmsInfo
    },
    users(state){
      return state.users
    }
  },
  mutations: {
    dmsInfo(state, payload){
      state.dmsInfo = payload.meta.platform + " (" + payload.meta.name + ")"
    },
    users(state, payload){      
      state.users = payload
    },
    addUser(state, payload){
      state.users.push(payload)
    },
    updateUser(state, payload){
      var found = state.users.find(function (item) {
        return item.user == payload.user;
      })
      if (found){
        var index = state.users.indexOf({
          user : payload.user
        })        
        found.name = payload.name
        found.surname = payload.surname
        state.users[index] = found
      }
    },
    deleteUser(state, username){
      var found = state.users.find(function (item) {
        return item.user == username;
      })
      if (found){
        var index = state.users.indexOf({
          user : username
        })        
        state.users.splice(index,1)
      }
    },
    resetState(state){
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })      
    }
  },
  actions: {
    async login(context, payload) {
      await apiDms
        .login(payload)
        .then(() => {
          context.commit("setAuthenticatedStatus", {status:true}, { root: true })
        })
        .catch((error) => console.log(error))
    },
    async logout(context) {
      await apiDms
        .logout()
        .then(() => {})
        .catch( (error) => {
          console.log(error)
        })        
        
        context.commit("setAuthenticatedStatus", {status:false}, { root: true })
        context.commit("resetState", null, { root: true })
        context.commit("resetState")
    },
    async dmsInfo(context) {
      await apiDms
        .getDmsInfo()
        .then((res) => {
          context.commit("dmsInfo", res.data)
        })
        .catch((error) => console.log(error))
    },
    async getUsers(context) {
      await apiDms
        .getUsers()
        .then((res) => {
          context.commit("users", res.data.users)
        })
        .catch((error) => console.log(error))
    },
    async addUser(context, payload){
      await apiDms
        .addUser(payload)
        .then( (res) => {
          context.commit("addUser", res.data)
        })
        .catch( (error) => {
          console.log(error);
        })
    },
    async updateUser(context, payload){
      await apiDms
        .updateUser(payload)
        .then( (res) => {
          context.commit("updateUser", res.data)
        })
        .catch( (error) => {
          console.log(error);
        })
    },
    async deleteUser(context, username){
      await apiDms
        .deleteUser(username)
        .then( (res) => {
          console.log(res);
          context.commit("deleteUser", username)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  },
}

/*function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}*/

export default moduleUsers
