<template>
  <div class="container px-5">

    <h3 class="my-4">{{ $t("HOME_MAIN_TITLE") }}</h3>
    <div class="row justify-space-between">
      <div class="col mb-3">
        <button class="btn btn-sm btn-default" @click="addUser()">{{$t("HOME_CREATE_USER_BTN")}}</button>
      </div>
      <div class="col mb-3 pe-3">
        <div class="d-flex flex-row-reverse">
          <input type="text" class="form-control search-input custom-input" v-model="searchTerm" :placeholder="$t('HOME_SEARCH_BOX')" @keyup="search"/>
        </div>        
      </div>  
    </div>
    <div>      
      <table class="table table-responsive table-striped">
        <thead>
          <tr>
            <th scope="col">{{$t("HOME_TABLE_COL_1")}}</th>
            <th scope="col">{{$t("HOME_TABLE_COL_2")}}</th>
            <th scope="col">{{$t("HOME_TABLE_COL_3")}}</th>
            <th scope="col">{{$t("HOME_TABLE_COL_4")}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in users" :key="index">
            <td>{{entry.user}}</td>
            <td>{{entry.name}}</td>
            <td>{{entry.surname}}</td>
            <td>
              <button class="btn btn-sm btn-default btn-actions-w" @click="editUser(index)">{{$t("HOME_TABLE_EDIT_BTN")}}</button>
              &nbsp;
              <button class="btn btn-sm btn-secondary btn-actions-w" @click="deleteUserIntent(index)">{{$t("HOME_TABLE_DELETE_BTN")}}</button>
            </td>
          </tr>          
        </tbody>
      </table>
    </div>
  </div>
  
  <edit-user v-if="showModal" @hideModalEvt="showModal=false" :currentUser="user" :isNewUser="isNewUser"/>   
  <confirm-modal v-if="showConfirmDialog" @hideConfirmDialogEvt="showConfirmDialog=false" @confirmResponse="confirmDeleteUser()" :message="confirmDialogText"/>
</template>


<script>
import { mapActions } from "vuex"
import { emptyUser, createUser } from '../helpers'
import EditUser from '../components/EditUser.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

export default {
  components: {
    'edit-user' : EditUser,
    'confirm-modal' : ConfirmModal
  },  
  data() {
    return {
      showModal : false,
      showConfirmDialog : false,
      confirmDialogText : "",
      user : emptyUser(),
      isNewUser : false,
      searchTerm : ""
      //users : this.$store.getters["moduleUsers/users"] 
    }
  },
  watch:{

  },
  computed: {    
    users(){
      let usersSorted = this.$store.getters["moduleUsers/users"] 
      if (this.searchTerm.length > 1){
        return usersSorted.filter(entry => findUserOrNameOrSurname(entry, this.searchTerm.toLowerCase()))
          .sort( (a,b) => a.user.localeCompare(b.user))
      }else{
        return usersSorted.sort( (a,b) => a.user.localeCompare(b.user))
      }      
    }
  },
  mounted() {
    document.title =
      this.$t("HTML_HEAD_TITLE_BASE") +
      " - " +
      this.$t("HTML_HEAD_TITLE_HOMEPAGE")
  },
  methods: {
    ...mapActions({
      getUsers: "moduleUsers/getUsers",
      deleteUser : "moduleUsers/deleteUser",
      setLoading: "isLoading"
    }),
    editUser(index){
      //this.user = this.users[index] - NOOO - no queremos que queden bindeados
      this.user = createUser(this.users[index])      
      this.isNewUser = false
      this.showModal = true
    },
    addUser(){
      this.user = emptyUser()
      this.isNewUser = true
      this.showModal = true
    },
    deleteUserIntent(index){
      this.user = createUser(this.users[index])
      this.confirmDialogText = this.$t('HOME_DELETE_USER_CONFIRMATION',{user : this.user.user})
      this.showConfirmDialog = true
    },
    async confirmDeleteUser(){
      this.showConfirmDialog = false
      this.setLoading(true)
      await this.deleteUser(this.user.user)
      this.setLoading(false)
    }
  },  
  created() {
    //Esto tambien podria hacer luego del login exitoso y no aqui
    this.getUsers()
  },
}

function findUserOrNameOrSurname(current, searchTerm){
  return (current.user.toLowerCase().includes(searchTerm) ||
    current.name.toLowerCase().includes(searchTerm) ||
    current.surname.toLowerCase().includes(searchTerm)
  )
}
</script>
<style scoped>
.btn-actions-w{
  width: 80px;
}
.search-input{
  width: 200px;
}
</style>
