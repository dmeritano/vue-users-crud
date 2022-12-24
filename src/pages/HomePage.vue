<template>
  <div class="container px-5">

    <h3 class="my-4">{{ $t("HOME_MAIN_TITLE") }}</h3>
    <div class="row">
      <div class="col mb-3">
        <button class="btn btn-sm btn-default" @click="addUser()">{{$t("HOME_CREATE_USER_BTN")}}</button>
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
            </td>
          </tr>          
        </tbody>
      </table>
    </div>
  </div>
  <edit-user v-if="showModal" @hideModalEvt="hideModal()" :currentUser="user" :isNewUser="isNewUser"/>
</template>



<script>
import { mapActions } from "vuex"
import { emptyUser, createUser } from '../helpers'
import EditUser from '../components/EditUser.vue'

export default {
  components: {
    'edit-user' : EditUser,
  },  
  data() {
    return {
      showModal : false,
      user : emptyUser(),
      isNewUser : false
    }
  },
  computed: {
    users(){
      return this.$store.getters["moduleUsers/users"]
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
    }),    
    editUser(index){
      //this.user = this.users[index] - NOOO quedan enganchados
      this.user = createUser(this.users[index])      
      this.isNewUser = false
      this.showModal = true
    },
    addUser(){
      this.user = emptyUser()
      this.isNewUser = true
      this.showModal = true
    },
    hideModal(){
      this.showModal = false
    }
  },  
  created() {
    this.getUsers()
  },
}
</script>
<style scoped>
.btn-actions-w{
  width: 80px;
}
</style>
