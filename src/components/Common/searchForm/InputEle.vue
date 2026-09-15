<template>
  <el-tooltip
    class="item"
    effect="light"
    :content="tooltip"
    placement="bottom"
    :disabled="!(tooltip && tooltipVisible)"
  >
    <el-input
      class="custom-input"
      style="vertical-align: baseline"
      size="small"
      :style="{ width: mouseType === 'focus' && !noChangeWidth ? '300px' : '240px' }"
      :placeholder="placeholder"
      :value="value"
      clearable
      @input="$emit('updateForm', { value: $event, type })"
      @keyup.enter.native="$emit('search')"
      @blur="blurFn"
      @focus="focusFn"
      :maxlength="maxlength || 50"
    >
    </el-input>
  </el-tooltip>
</template>

<script>
export default {
  name: 'InputEle',
  components: {},
  props: ['placeholder', 'value', 'maxlength', 'tooltip', 'width', 'type', 'noChangeWidth'],
  data() {
    return {
      tooltipVisible: true,
      mouseType: 'blur'
    }
  },
  methods: {
    blurFn() {
      this.mouseType = 'blur'
      setTimeout(() => {
        if (this.mouseType === 'blur') {
          this.tooltipVisible = true
        }
      }, 100)
    },
    focusFn() {
      this.mouseType = 'focus'
      this.tooltipVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-input {
  transition: width 0.3s;
  /deep/ .el-input__inner {
    // border-radius: 20px; /* 将输入框内部边框的圆角设置为0，保持输入框内部为直角 */
  }
}
</style>
