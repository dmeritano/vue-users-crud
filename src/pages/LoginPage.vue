<template>
  <div class="container mt-5">
    <div class="login-container">
      <h4 class="text-center py-4">{{$t("LOGIN_MAIN_TITLE")}}</h4>

      <form class="login-form" @submit.prevent>
        <div class="row">
          <div class="col-md-12 form-group">
            <!-- TRICK para evitar autocompletado de los navegadores 
                readonly
                onfocus="this.removeAttribute('readonly');"
                Poniendolo en este campo tambien me soluciona el autocomplete del campo siguiente (pass)            
              -->             
            <input
              type="text"
              readonly
              onfocus="this.removeAttribute('readonly');"
              class="form-control custom-input"
              id="user"
              v-model="user"
              :placeholder="$t('LOGIN_INPUT_USERNAME')"
            />
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12 form-group">
            <input
              type="password"
              autocomplete="off"
              class="form-control custom-input"
              id="pass"
              v-model="pass"
              :placeholder="$t('LOGIN_INPUT_PASSWORD')"
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
              @click="authenticate()"
            >
              {{$t("LOGIN_ENTER_BTN")}}
            </button>            
            <div class="text-center pt-2"><small class="custom-version">v{{appVersion}}</small></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  data() {
    return {
      user: null,
      pass: null,
    }
  },
  computed:{
    ...mapGetters({error: 'moduleUsers/error'}),
    ...mapGetters({appVersion: 'version'})
  },
  mounted() {
    document.title =  this.$t("HTML_HEAD_TITLE_BASE") + " - " + this.$t("HTML_HEAD_TITLE_LOGIN")
    this.clearError()
  },
  methods: {
    ...mapActions({
      login: "moduleUsers/login",
      dmsInfo: "moduleUsers/dmsInfo",
      clearError : "moduleUsers/clearError" 
    }),
    authenticate() {
      const payload = {
        user: this.user,
        pass: this.pass,
      }
      this.login(payload)
        .then((success) => {
          if (success){
            this.dmsInfo().then(()=>{
              this.$router.push("/")
            })            
          }
        })                      
    },
  },
}
</script>

<style scoped>
.login-container {
  width: 320px;
  max-width: 100%;
  margin: 80px auto;
}
.custom-version{
  font-size: smaller;
  font-weight: lighter;
  color:lightgrey;
}
</style>
