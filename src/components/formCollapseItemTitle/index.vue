<template>
  <div class="collapse-title">
    <span class="title-left">
      <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
      <strong>{{ title }}</strong>
      <i class="el-icon-warning ml5" v-if="warning" style="font-size: 16px; color: red"></i>
    </span>
    <span class="collapse-item-info ml20" style="font-size: 14px; color: #909399">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    warning: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
