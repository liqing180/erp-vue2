<template>
  <!-- dark/light -->
  <div class="tooltip-row">
    <el-popover
      trigger="hover"
      placement="top"
      :disabled="!(value || '').trim() || editPopShow"
      :open-delay="400"
    >
      <div class="desc-tooltip">
        <div v-if="value" style="line-height: 20px; white-space: pre-wrap; word-break: break-word">
          <div>{{ value }}</div>
        </div>
      </div>
      <slot slot="reference">
        <div class="flexStart" v-if="!disabled" @click="showPop($event)">
          <div v-if="(value || '').trim()" class="primary-pointer tooltip-row flex-1">
            {{ value }}
          </div>
          <div v-else class="primary-pointer tooltip-row flex-1">
            <div style="color: #0000">{{ '-------------' }}</div>
          </div>
          <div class="fs-0 primary-pointer flexStart" style="padding-left: 5px">
            <i class="el-icon-edit" style="font-size: 20px"></i>
          </div>
        </div>
        <div v-else :class="{ 'tooltip-row': true }">
          {{ value }}
        </div>
      </slot>
    </el-popover>

    <popover-svc ref="pop1" trigger="manual" placement="top" width="600">
      <div class="mb10">
        <MyInput
          ref="textareaRef"
          type="textarea"
          v-model="editValue"
          @input="handleInput"
          :autosize="{ minRows: 1, maxRows: 8 }"
          resize="none"
          show-word-limit
          :maxlength="maxlength"
        ></MyInput>
      </div>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" @click="hidePop('cancel')">{{ $t('menu.cancel') }}</el-button>
        <el-button type="primary" size="mini" @click="hidePop('comFirm')">{{
          $t('uiBtn.confirm1')
        }}</el-button>
      </div>
    </popover-svc>
  </div>
</template>
<script>
import { Popover } from 'element-ui'

// 表格内只允许一个描述编辑框处于打开状态
let activeDescriptionEditor = null

const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}

export default {
  components: {
    popoverSvc
  },
  props: {
    value: {
      type: [String, Number]
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    maxlength: {
      type: [String, Number]
    }
  },
  data() {
    return {
      timeout: null,
      editValue: undefined,
      editPopShow: false
    }
  },
  beforeCreate() {},
  beforeDestroy() {
    if (activeDescriptionEditor === this) {
      activeDescriptionEditor = null
    }
  },
  methods: {
    handleInput() {
      // console.log(this.$refs.pop1)
      const requestAnimFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 0)
          }
        )
      })()
      requestAnimFrame(() => {
        this.$refs.pop1?.updatePopper()
      })
    },
    showPop(e) {
      if (this.disabled) return

      if (activeDescriptionEditor && activeDescriptionEditor !== this) {
        activeDescriptionEditor.hidePop('comFirm')
      }
      activeDescriptionEditor = this

      this.editPopShow = true
      this.editValue = this.value
      this.$refs.pop1.popBy(e.target)
      setTimeout(() => {
        this.$refs.textareaRef?.resizeTextarea()
        this.$refs.textareaRef?.focus()
        const textareaDom = this.$refs.textareaRef.$el.querySelector('textarea')
        if (textareaDom) {
          textareaDom.scrollTop = 0
        }
      }, 0)
    },
    hidePop(type) {
      if (type === 'comFirm') {
        this.$emit('input', this.editValue)
      }

      this.editPopShow = false
      if (activeDescriptionEditor === this) {
        activeDescriptionEditor = null
      }

      setTimeout(() => {
        !this.editPopShow && this.$refs.pop1.close()
      }, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}

// 产品名悬浮 description 样式
.desc-tooltip {
  max-width: 800px;
  max-height: 400px;
  overflow-y: auto;
  font-size: 12px;
  padding-right: 8px;

  .desc-title {
    color: chartreuse;
  }
  & > pre {
    white-space: pre-wrap;
    max-width: 800px;
    line-height: 24px;
  }
}
.tooltip-row {
  white-space: nowrap;
  min-width: 50px;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.desc-tooltip::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: initial;
}

.desc-tooltip::-webkit-scrollbar-thumb {
  border-radius: 4px;
  // background-color: rgba(255, 255, 255, 0.5);
  background: #c1c1c1;
}

.desc-tooltip::-webkit-scrollbar-track {
  width: 8px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
