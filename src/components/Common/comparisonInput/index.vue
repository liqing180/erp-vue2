<template>
  <div
    class="comparison-box el-input"
    :class="[inputSize ? 'el-input--' + inputSize : '', comShowType]"
  >
    <div
      class="old-value"
      :title="beforeValue"
      v-if="beforeValueShow || comShowType === 'comp-add'"
    >
      {{ beforeValue }}
    </div>
    <div class="new-value" :title="afterValue">
      {{ afterValue }}
    </div>
  </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
export default {
  mixins: [emitter],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    size: String,
    showEditType: Boolean, // 固定显示为编辑样式
    beforeValue: [String, Number],
    afterValue: [String, Number]
  },
  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    inputSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    beforeValueShow() {
      return this.$resultOfBoolean(this.beforeValue)
    },
    afterValueShow() {
      return this.$resultOfBoolean(this.afterValue)
    },
    comShowType() {
      const bv = this.beforeValueShow
      const av = this.afterValueShow
      if (!bv && !av) {
        return ''
      }
      if (this.showEditType) {
        return 'comp-edit'
      }
      if (!bv && av) {
        return 'comp-add'
      }
      if (bv && !av) {
        return 'comp-delete'
      }
      return 'comp-edit'
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import 'element-ui/packages/theme-chalk/src/common/var.scss';
.comparison-box {
  box-sizing: border-box;
  -webkit-appearance: none;
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  font-size: inherit;
  outline: none;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  display: flex;
  align-items: center;
}
.el-input--mini {
  height: $--input-mini-height;
  line-height: $--input-mini-height;
}
.el-input--small {
  height: $--input-small-height;
  line-height: $--input-small-height;
}
.el-input--medium {
  height: $--input-medium-height;
  line-height: $--input-medium-height;
}

.comp-edit {
  background: #f0f7ff;
  border-left: 3px solid #c2d7fb;
  padding-left: 12px;
}
.comp-add {
  background: #d2e3fc;
  border-left: 3px solid #1a73e8;
  padding-left: 12px;
  .old-value::before {
    content: '—';
  }
}
.comp-delete {
  background: #f5f5f4;
  border-left: 3px solid #78716c;
  padding-left: 12px;
}

.old-value {
  text-decoration: line-through;
  color: #bbb;
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 6px;
}
.new-value {
  max-width: 70%;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1557b0;
}
</style>
