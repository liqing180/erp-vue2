<template>
  <!-- form-page-btn--hide -->
  <div class="formPage" :class="formClass">
    <div class="form-page-btn" style="text-align: left">
      <slot name="btn"></slot>
    </div>
    <div class="form-page-tabs">
      <slot name="tabs"></slot>
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
<style lang="scss">
.form-page-tabs {
  // padding-left: 20px;
  // background-color: #fff;
  .el-tabs__header {
    margin: 0 0 0px;
  }
  .el-tabs__nav-wrap {
    background-color: #fff;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #e8edf0;
    border-bottom-color: #e8edf0;
  }
  .el-tabs__item {
    height: 34px;
    line-height: 34px;
  }
}
</style>
