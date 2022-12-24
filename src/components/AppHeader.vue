<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand logo-menu" href="#">
        <img src="@/assets/images/logo-addalia-header.png" alt="Logo" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link">{{$t("HEADER_HOME_LINK")}}</router-link>
          </li>
        </ul>
        <ul class="navbar-nav me-5">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img :src="flag" /><span><small class="ms-1">{{$t("HEADER_LOCALE_SHORT_NAME")}}</small></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown" style="margin: 0"> <!-- margin 0 to remove poper warning -->
              <li><a class="dropdown-item" href="#" @click="idioma('es')">{{$t("HEADER_LOCALE_LONG_NAME_ES")}}</a></li>
              <li><a class="dropdown-item" href="#" @click="idioma('en')">{{$t("HEADER_LOCALE_LONG_NAME_EN")}}</a></li>
            </ul>
          </li>

          <li class="nav-item" v-if="!authenticated">
            <router-link
              to="/login"
              v-if="!authenticated"
              class="nav-link text-white me-3"
              >{{$t("HEADER_LOGIN_LINK")}}</router-link
            >
          </li>
          <li class="nav-item" v-if="authenticated">
            <a
              href="#"
              @click.prevent="logout"
              v-if="authenticated"
              class="nav-link text-white me-3"
              >{{$t("HEADER_LOGOUT_LINK")}}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      flag : ""
    }    
  },  
  computed: {
    authenticated() {
      return this.$store.getters.authenticated
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch("moduleUsers/logout")
      this.$router.push("/login")
    },
    idioma(idioma) {
      if (idioma === "es") {
        this.$i18n.locale = "es"
        this.flag = require("@/assets/images/spain.svg")
      } else {
        this.$i18n.locale = "en"
        this.flag = require("@/assets/images/great_britain.svg")
      }
    }    
  },
  mounted() {
      document.title = this.$t("HTML_HEAD_TITLE_BASE")
      this.$i18n.locale === "es" ?
      this.flag = require("@/assets/images/spain.svg") :
      this.flag = require("@/assets/images/great_britain.svg")
  },
}
</script>

<style scoped>
.navbar-dark .navbar-brand {
  color: #fff;
  font-weight: bold;
}
.navbar-dark .navbar-nav > li > a {
  color: #fff;
}
.navbar-inverse .navbar-nav > li > a:hover {
  font-weight: bold;
}
.navbar-dark {
  background: linear-gradient(to right, #0a969c, #c4d826);
}
.logo-menu {
  padding-top: 10px;
}
.logo-menu > img {
  width: 135px;
  height: 33px;
}
</style>
