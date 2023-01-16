<template>
  <!-- Confirm Modal -->
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
          <h1 class="modal-title fs-5" id="staticBackdropLabel">{{$t("CONFIRM_DIALOG_TITLE")}}</h1>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col">
                {{message}}
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('hideConfirmDialogEvt')">
            {{$t("GENERAL_CANCEL_BTN")}}
          </button>
          <button type="button" class="btn btn-danger" @click="$emit('confirmResponse')">{{$t("GENERAL_CONFIRM_BTN")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ["message"]
}
</script>