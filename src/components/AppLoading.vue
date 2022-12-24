<template>
  <div class="spinnerfullmodal" v-if="isLoading">
    <div class="spinner">
      <img
        id="img-spinner"
        src="@/assets/images/ajax-loader-new.gif"
        alt="Ajax Loader"
      />
    </div>
  </div>
</template>

<script>
export default {
    data() { return {}},
    computed: {
        isLoading() {
            return this.$store.getters.isLoading;
        },
    },
    methods(){}
}
</script>

<style scoped>
.spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -33px; /* half width of the spinner gif */
  margin-top: -33px; /* half height of the spinner gif */
  text-align: center;
  overflow: auto;
  width: 100px; /* width of the spinner gif */
  height: 102px; /*hight of the spinner gif +2px to fix IE8 issue */
}
.spinnerfullmodal {
  z-index: 2147483647; /*numero máximo para poder tapar incluso la barra de navegacion*/
  position: absolute;
  left: 0%;
  top: 0%;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: white;
  opacity: 0.4;
  filter: alpha(opacity=40); /* For IE8 and earlier */
}
</style>
