import { createI18n } from 'vue-i18n'

/**
 * IMPORTANTE - Se cargan por el loader, en la compilacion
 * Load locale messages
 * 
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  
  /* -- 
     Load APP messages contained en @/locales 
     APP configurators cannot modify these messages because build process 
     no exposes these language [lang].json files, like any other resources 
     under src folder.
  -- */
  
  let locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key).default
    }
  })
  

  /* --
    No we load any translations that may be in the /public/locales folder. 
    These translations are maintained by the App's configurators, and are the ones 
    that are mainly used in the configuration of the attributes that is done 
    in /public/config.json.  
  -- */ 

  locales = require.context('/public/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      for (const [k, v] of Object.entries(locales(key))) {
        messages[locale][k]=v
      }      
    }
  })

  return messages
}

export default createI18n({
  legacy: false,
  locale: getStartingLocale(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
})

function getStartingLocale() {
  if (localStorage.getItem('last-locale')) {
      return localStorage.getItem('last-locale')
  }
  return process.env.VUE_APP_I18N_LOCALE || "en"
}