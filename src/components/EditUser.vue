<template>
  <!-- Modal -->
  <div
    class="modal fade show d-block"
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">
            {{title}}
          </h1>
        </div>
        <div class="modal-body">
            <p v-if="errors.length">
              <b>{{$t("EDITUSER_ERRORS_WARNING",errors.length)}}:</b>
              <ul>
                <li v-for="(entry, index) in errors" :key="index" class="text-danger">{{ entry }}</li>
              </ul>
          </p>
          <div class="row mb-3">
            <label class="col-sm-4 col-form-label">{{$t("EDITUSER_USERNAME")}}</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="form-control custom-input"
                v-model="user.user"
                :disabled="isDisabled"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-4 col-form-label">{{$t("EDITUSER_NAME")}}</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="form-control custom-input"
                v-model="user.name"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-4 col-form-label">{{$t("EDITUSER_SURNAME")}}</label>
            <div class="col-sm-8">
              <input
                type="text"
                class="form-control custom-input"
                v-model="user.surname"
              />
            </div>
          </div>
          <div class="row mb-3">
            <label class="col-sm-4 col-form-label">{{$t("EDITUSER_PASSWORD")}}</label>
            <div class="col-sm-8">
              <input
                type="password"
                class="form-control custom-input"
                v-model="user.pass"
              />
            </div>
          </div>           
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hideModal()">
            {{$t("GENERAL_CANCEL_BTN")}}
          </button>
          <button type="button" class="btn btn-default" @click="save()">{{$t("GENERAL_SAVE_BTN")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: ["currentUser","isNewUser"],
  data() {
    return {
      user: this.currentUser,
      errors: []
    }
  },
  computed: {
    title(){
        if (this.isNewUser){
            return this.$t("EDITUSER_TITLE_CREATE")
        }else{
            return this.$t("EDITUSER_TITLE_EDIT")
        }
    },
    isDisabled(){
      return !this.isNewUser
    }
  },
  methods: {
    hideModal() {
      this.$emit("hideModalEvt")
    },
    ...mapActions({
      saveUser: "moduleUsers/addUser",
      updateUser: "moduleUsers/updateUser",
      setLoading: "isLoading"
    }),
    async save(){
      this.errors = []
      if (this.isNewUser){
        if(this.currentUser.user == ''){
          this.errors.push(this.$t("EDITUSER_VALIDATION_USERNAME"))        
        }
        if(this.currentUser.pass == ''){
          this.errors.push(this.$t("EDITUSER_VALIDATION_PASSWORD"))        
        }
        if (this.errors.length > 0){
          return
        }
      }
      //Create or update user
      this.setLoading(true)
      this.isNewUser ? 
        await this.saveUser(this.currentUser) :
        await this.updateUser(this.currentUser)              
      this.setLoading(false)
      this.hideModal()
    }
  },
}

</script>

<style scoped></style>
