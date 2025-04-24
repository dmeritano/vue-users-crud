const { defineConfig } = require("@vue/cli-service")
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "." : "/",
  devServer: {
    proxy: {
      "^/DmsRestServiceDTOP": {
        target: "http://localhost/",
        ws: true,
        changeOrigin: true,
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: "es",
      fallbackLocale: "es",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
})
