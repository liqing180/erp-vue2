<template>
  <div @click="clickFn">
    <el-input
      size="small"
      class="tree-view-item"
      placeholder=""
      readonly
      :disabled="disabled"
      :value="showName"
    >
      <span slot="suffix" class="icon-box">
        <i class="el-input__icon el-icon-arrow-down"></i>
        <i
          @click.stop="clear"
          v-if="showName && clearable && !disabled"
          :class="{ 'tree-view-right': true }"
          class="el-input__icon el-icon-circle-close el-input__clear"
        ></i>
      </span>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'SelectInput',
  props: {
    disabled: {
      type: [Boolean],
      default() {
        return false
      }
    },
    clearable: {
      type: [Boolean],
      default() {
        return true
      }
    },
    callback: {
      type: Function
    },
    selectList: {
      type: Array,
      default: () => []
    },
    selectLabel: {
      type: String
    }
  },
  data() {
    return {
      showName: ''
    }
  },
  watch: {
    selectList: {
      handler(newVal) {
        this.showName = newVal.map((x) => x[this.selectLabel]).join(', ') || ''
      },
      deep: true
    }
  },
  methods: {
    clickFn() {
      if (this.disabled) {
        return
      }
      this.callback()
    },
    clear() {
      if (this.disabled) {
        return
      }
      this.callback('clear')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-box {
  position: relative;
}
.tree-view-right {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  background-color: inherit;
  line-height: 16px !important;
  height: 100%;
  background-color: #fff;
}
.tree-view-item:hover /deep/ .tree-view-right {
  display: inline;
}

.tree-view-item /deep/ .el-input__inner {
  cursor: pointer;
}
.tree-view-item /deep/ .el-input__suffix {
  cursor: pointer;
}
</style>
