<template>
  <div class="container mt-5">
    <div class="login-container">
      <h4 class="text-center py-4">{{$t("LOGIN_MAIN_TITLE")}}</h4>

      <form class="login-form" @submit.prevent>
        <div class="row">
          <div class="col-md-12 form-group">
            <input
              type="text"
              class="form-control custom-input"
              id="user"
              v-model="user"
              placeholder="Usuario"
            />
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-12 form-group">
            <input
              type="password"
              class="form-control custom-input"
              id="pass"
              v-model="pass"
              placeholder="Contraseña"
            />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12 form-group text-center">
            <button
              type="submit"
              class="btn btn-default"
              @click="authenticate()"
            >
              Entrar
            </button>
            <div class="text-center text-muted pt-2"><small>v1.0</small></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  data() {
    return {
      user: "admin",
      pass: "admin",
    }
  },
  mounted() {
    document.title =
      this.$t("HTML_HEAD_TITLE_BASE") + " - " + this.$t("HTML_HEAD_TITLE_LOGIN")
  },
  methods: {
    ...mapActions({
      login: "moduleUsers/login",
      dmsInfo: "moduleUsers/dmsInfo",
      setLoading: "isLoading",
    }),
    idioma(idioma) {
      if (idioma === "en") {
        this.$i18n.locale = "en"
      } else {
        this.$i18n.locale = "es"
      }
    },
    async authenticate() {
      const payload = {
        user: this.user,
        pass: this.pass,
      }
      try {
        this.setLoading(true)
        await this.login(payload)
        await this.dmsInfo()
        this.setLoading(false)

        this.$router.push("/")
      } catch (error) {
        console.log(error)
      }
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
</style>
