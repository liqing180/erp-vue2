<template>
  <el-steps
    v-if="activeIndex !== lastIndex"
    class="formSteps"
    process-status="wait"
    :active="activeIndex"
    align-center
  >
    <el-step
      v-for="item in statusList || []"
      :key="'partner_status' + item.value"
      :title="item.label"
    ></el-step>
  </el-steps>
  <el-steps
    v-else
    class="formSteps"
    process-status="finish"
    finish-status="wait"
    :active="activeIndex - 1"
    align-center
  >
    <el-step
      v-for="item in statusList || []"
      :key="'partner_status' + item.value"
      :title="item.label"
    ></el-step>
  </el-steps>
</template>

<script>
export default {
  props: {
    statusList: {
      type: Array,
      default() {
        return []
      }
    },
    status: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    lastIndex() {
      return (this.statusList || []).length
    },
    activeIndex() {
      return (this.statusList || []).findIndex((item) => item.value === this.status) + 1
    }
  }
}
</script>

<style lang="scss">
.formSteps {
  padding: 10px 0;
  .el-step__icon {
    height: 38px;
    width: 38px;
    border: 1px solid;
    font-size: 18px;
  }
  .el-step__icon-inner {
    font-weight: 400;
  }
  .el-step.is-horizontal .el-step__line {
    top: 18px;
  }
  .el-step__title {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
