<template>
  <el-tooltip
    class="item"
    effect="light"
    :content="tooltip"
    placement="bottom"
    :disabled="!(tooltip && tooltipVisible)"
  >
    <el-input
      v-if="isLine"
      class="custom-input"
      style="vertical-align: baseline"
      size="small"
      prefix-icon="el-icon-search"
      :style="{ width: mouseType === 'focus' ? '360px' : '240px' }"
      :placeholder="placeholder"
      :value="value"
      clearable
      @input="handleInput"
      @keyup.enter.native="handleEnter"
      @blur="blurFn"
      @focus="focusFn"
      @clear="clear"
      :maxlength="maxlength || 50"
    >
    </el-input>
    <el-input
      v-else
      style="width: 100%; vertical-align: baseline"
      size="small"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="value"
      clearable
      @input="handleInput"
      @keyup.enter.native="handleEnter"
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
  props: {
    placeholder: undefined,
    value: undefined,
    maxlength: undefined,
    tooltip: undefined,
    width: undefined,
    type: undefined,
    disabled: undefined,
    isLine: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      tooltipVisible: true,
      mouseType: 'blur',
      searchTimer: null
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
    },
    clear() {
      this.clearSearchTimer()
      this.$emit('search')
    },
    clearSearchTimer() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
        this.searchTimer = null
      }
    },
    handleInput(value) {
      // console.log(this.interval, '===================97')
      this.$emit('updateForm', { value, type: this.type })
      // 输入节流：静止2秒后触发搜索
      this.clearSearchTimer()
      this.searchTimer = setTimeout(() => {
        this.$emit('search')
      }, this.interval)
    },
    handleEnter() {
      this.clearSearchTimer()
      this.$emit('search')
    }
  },
  beforeDestroy() {
    this.clearSearchTimer()
  }
}
</script>
<style lang="scss" scoped>
.custom-input {
  transition: width 0.2s;
  /deep/ .el-input__inner {
    border-left: 0;
    border-right: 0;
    border-top: 0;
    // background-color: inherit;
    border-radius: 0;
    // border-radius: 20px; /* 将输入框内部边框的圆角设置为0，保持输入框内部为直角 */
  }

  /* /deep/ .el-input__inner:focus {
    .el-input__icon.el-icon-search {
      color: #1090ff;
    }
  } */
}
</style>
