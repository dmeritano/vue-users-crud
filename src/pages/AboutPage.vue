<template>
  <div class="container px-5">
    <h3 class="my-4">About</h3>
    <p v-html="text1"></p>
    <p class="text-secondary">
      {{ $t("ABOUTPAGE_TEXT_VERSION", { version: version }) }}
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    appName() {
      return this.$t("APP_SHORT_NAME")
    },
    text1() {
      return this.$t("ABOUTPAGE_TEXT_1", { appname: this.appName })
    },
    version() {
      return this.$AppConfig.version
    },
  },
}
</script>
