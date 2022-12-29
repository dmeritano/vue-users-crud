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
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{$t("ALERT_DIALOG_TITLE")}}</h1>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
              <p v-bind:class="color">
                {{message}}
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <!--
          <button type="button" class="btn btn-secondary" @click="$emit('hideConfirmDialogEvt')">
            {{$t("GENERAL_CANCEL_BTN")}}
          </button>
          -->
          <button type="button" class="btn btn-default" @click="$emit('closeAlert')">{{$t("GENERAL_CONFIRM_BTN")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { alertModalErrorTypes } from '../helpers'
export default {
    props: ["message","messageType"],
    computed:{
      color() {
        switch (this.messageType) {
          case alertModalErrorTypes.WARNING:
            return "text-warning"
          case alertModalErrorTypes.ERROR:
            return "text-danger"
          default:
            return "text-body"
        }
      }
    }
}
</script>