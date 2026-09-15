<template>
  <!-- form-page-btn--hide -->
  <div class="formPage" :class="formClass">
    <div class="form-page-btn" style="text-align: left">
      <slot name="btn"></slot>
    </div>
    <div ref="pageContent" class="form-page-content" style="text-align: left">
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    formClass: {
      type: String,
      default: ''
    }
  }
}
</script>
