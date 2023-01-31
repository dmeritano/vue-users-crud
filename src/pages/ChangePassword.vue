<template>
  <div class="container mt-5">
    <div class="changepass-container">
      <h4 class="text-center py-4">{{$t("CHANGEPASSWORD_MAIN_TITLE")}}</h4>
      <p class="text-danger" v-if="mustChangePassword">{{$t("CHANGEPASSWORD_WARNING_MUST_CHANGEPASS")}}</p>
      <form class="login-form" @submit.prevent>
        <div class="row mt-2">
          <div class="col-md-12 form-group">
            <!-- TRICK para evitar autocompletado de los navegadores 
              readonly
              onfocus="this.removeAttribute('readonly');"
              Poniendolo en este campo tambien me soluciona el autocomplete del campo siguiente (pass)            
            -->             
            <input
              type="password"
              readonly
              onfocus="this.removeAttribute('readonly');"
              class="form-control custom-input"
              id="currentpass"
              v-model="currentpass"
              :placeholder="$t('CHANGEPASSWORD_INPUT_CURRENTPASS')"
            />
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12 form-group">
            <input
              type="password"
              class="form-control custom-input"
              id="newpass"
              v-model="newpass"
              :placeholder="$t('CHANGEPASSWORD_INPUT_NEWPASS')"
            />
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12 form-group">
            <input
              type="password"
              class="form-control custom-input"
              id="newpassrepeat"
              v-model="newpassrepeat"
              :placeholder="$t('CHANGEPASSWORD_INPUT_NEWPASSREPEAT')"
            />
          </div>
        </div>                
        <div class="row my-3">
          <div class="col-md-12 text-center">
              <p class="text-danger" v-if="error.hasError">{{error.i18nMsg}}</p>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12 form-group text-center">
            <button
              type="submit"
              class="btn btn-default"
              @click="changePassword()"
            >
              {{$t("CHANGEPASSWORD_UPDATEPASS_BTN")}}
            </button>            
          </div>
        </div>
      </form>
    </div>

    <alert-modal v-if="showAlertDialog" :messageType="dialogAlertMessageType" :message="alertDialogText" @closeAlert="hideAlertDialog"/>

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { alertModalErrorTypes } from '../helpers'
import AlertModal from '../components/AlertModal.vue'

export default {
  components: {
    'alert-modal' : AlertModal
  },   
  data() {
    return {
      currentpass: null,
      newpass: null,
      newpassrepeat : null,

      showAlertDialog : false,
      dialogAlertMessageType : alertModalErrorTypes.DEFAULT,
      alertDialogText : "",
    }
  },
  computed:{
    ...mapGetters({error: 'moduleUsers/error'}),
    ...mapGetters({user: 'user'}),  
    mustChangePassword() {
      return this.$store.getters.userMustChangePassword
    }
  },
  mounted() {
    document.title =  this.$t("HTML_HEAD_TITLE_BASE") + " - " + this.$t("HTML_HEAD_TITLE_CHANGEPASS")
    this.clearError()
  },
  methods: {
    ...mapActions({
      updateUserPassword: "moduleUsers/updateUserPassword",
      clearError : "moduleUsers/clearError" 
    }),
    async changePassword() {
      const payload = {
        "user" : this.user,
        "currentpass" : this.currentpass,
        "newpass" : this.newpass,
        "newpassrepeat" : this.newpassrepeat  
      }
      await this.updateUserPassword(payload)
      if (!this.error.hasError){
        this.alertDialogText = this.$t('CHANGEPASSWORD_PASSWORD_UPDATED')
        this.showAlertDialog = true        
      }    
    },
    hideAlertDialog(){
      this.showAlertDialog = false
      this.$router.push("/")
    }
  },
}
</script>

<style scoped>
.changepass-container {
  width: 320px;
  max-width: 100%;
  margin: 80px auto;
}
</style>
