<template>
  <div @click="clickFn">
    <el-input class="tree-view-item" placeholder="" readonly :disabled="disabled" :value="value">
      <span slot="suffix" class="icon-box">
        <i class="el-input__icon el-icon-arrow-down"></i>
        <i
          @click.stop="clear"
          v-if="value && clearable && !disabled"
          :class="{ 'tree-view-right': true }"
          class="el-input__icon el-icon-circle-close el-input__clear"
        ></i>
      </span>
    </el-input>
  </div>
  <!-- <div class="el-select w100" @click="addDriver">
    <div class="el-input el-input--suffix el-input--default w100" :class="{ 'is-disabled': false }">
      <input
        :value="value"
        type="text"
        readonly="readonly"
        autocomplete="off"
        placeholder
        class="el-input__inner"
      />
      <span class="el-input__suffix">
        <span class="el-input__suffix-inner">
          <i class="el-select__caret el-input__icon el-icon-arrow-up" />
        </span>
      </span>
    </div>
  </div> -->
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number]
    },
    disabled: {
      type: [Boolean],
      default() {
        return false
      }
    },
    clearable: {
      type: [Boolean],
      default() {
        return false
      }
    }
  },
  methods: {
    clickFn() {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    },
    clear() {
      if (this.disabled) {
        return
      }
      this.$emit('clear')
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
