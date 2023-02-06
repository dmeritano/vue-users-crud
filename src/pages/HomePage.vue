<template>
  <div class="container px-5">

    <h3 class="my-4">{{ $t("HOME_MAIN_TITLE") }}</h3>
    <div class="row justify-space-between">
      <div class="col mb-3">
        <button v-if="addUserBtnEnabled" class="btn btn-sm btn-default" @click="addUser()">{{$t("HOME_CREATE_USER_BTN")}}</button>
      </div>
      <div class="col mb-3 pe-3">
        <div class="d-flex flex-row-reverse">
          <input type="text" ref="searchBox" class="form-control search-input custom-input" v-model="searchTerm" :placeholder="$t('HOME_SEARCH_BOX')" @keyup="search"/>
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
              <button class="btn btn-sm btn-default buttons-fixed-width" @click="editUser(index)">{{$t("HOME_TABLE_EDIT_BTN")}}</button>
              &nbsp;
              <button class="btn btn-sm btn-secondary buttons-fixed-width" 
                :disabled="allowDelete(entry.user)"
                @click="deleteUserIntent(index)">
                {{$t("HOME_TABLE_DELETE_BTN")}}
              </button>
            </td>
          </tr>          
        </tbody>
      </table>
    </div>
  </div>
  
  <edit-user v-if="showModal" @hideModalEvt="hideEditModal" :currentUser="user" :isNewUser="isNewUser"/>   
  <confirm-modal v-if="showConfirmDialog" @hideConfirmDialogEvt="showConfirmDialog=false" @confirmResponse="confirmDeleteUser()" :message="confirmDialogText"/>
  <alert-modal v-if="showAlertDialog" :messageType="dialogAlertMessageType" :message="alertDialogText" @closeAlert="showAlertDialog=false"/>
</template>


<script>
import { mapActions, mapGetters } from "vuex"
import { emptyUser, createUser, alertModalErrorTypes } from '../helpers'
import EditUser from '../components/EditUser.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import AlertModal from '../components/AlertModal.vue'

export default {
  components: {
    'edit-user' : EditUser,
    'confirm-modal' : ConfirmModal,
    'alert-modal' : AlertModal
  },  
  data() {
    return {
      showModal : false,
      showConfirmDialog : false,
      confirmDialogText : "",
      showAlertDialog : false,
      dialogAlertMessageType : alertModalErrorTypes.DEFAULT,
      alertDialogText : "",
      user : emptyUser(),
      isNewUser : false,
      searchTerm : "",
      addUserBtnEnabled : true
    }
  },
  computed: {
    ...mapGetters({error: 'moduleUsers/error'}),
    ...mapGetters({usersLoaded: 'moduleUsers/usersLoadedFromServer'}),
    ...mapGetters({userName: 'user'}),
    users(){
      let usersSorted = this.$store.getters["moduleUsers/users"] 
      if (this.searchTerm.length >= 1){
        return usersSorted.filter(entry => findUserOrNameOrSurname(entry, this.searchTerm.toLowerCase()))
          .sort( (a,b) => a.user.localeCompare(b.user))
      }else{
        return usersSorted.sort( (a,b) => a.user.localeCompare(b.user))
      }      
    },
    allowedUsers(){
      return this.$AppConfig.allowedUsers
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
      deleteUser : "moduleUsers/deleteUser"      
    }),
    editUser(index){
      //this.user = this.users[index] - NO queremos que queden bindeados
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
      await this.deleteUser(this.user.user)
      
      if (this.error.hasError){
        this.dialogAlertMessageType = alertModalErrorTypes.ERROR
        this.alertDialogText = this.error.i18nMsg
        this.showAlertDialog = true
      }            
    },
    allowDelete(user){
      return (this.userName.toLowerCase() === user.toLowerCase()) ? true : false
    },    
    hideEditModal(){
      this.showModal = false
      this.$refs.searchBox.focus()
    }
  },
  created() {
    const loadUsers = async () => {
      await this.getUsers()
      if (this.error.hasError){
        this.addUserBtnEnabled = false
        this.dialogAlertMessageType = alertModalErrorTypes.ERROR
        this.alertDialogText = this.error.i18nMsg
        this.showAlertDialog = true
      }        
    }
    if (!this.usersLoaded){
      loadUsers()
    }    
  }
}

function findUserOrNameOrSurname(current, searchTerm){
  return (current.user.toLowerCase().includes(searchTerm) ||
    current.name.toLowerCase().includes(searchTerm) ||
    current.surname.toLowerCase().includes(searchTerm)
  )
}
</script>


<style scoped>
.search-input{
  width: 200px;
}
.btn-secondary:hover{
  color:red;
}
</style>
