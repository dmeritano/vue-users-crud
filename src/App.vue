<template>
   <div>
      <app-header/>
      <div><router-view></router-view></div>
      <app-footer v-if="showAppFooter" />
      <app-loading />
   </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AppLoading from './components/AppLoading.vue'
export default {
  name: 'App',
  components: {
    'app-header' : AppHeader,
    'app-footer' : AppFooter,
    'app-loading': AppLoading
  },
  data() {
    return {
      showAppFooter: this.$EnvConfig.showAppFooter
    }
  },
  mounted() {}
}
</script>    
  