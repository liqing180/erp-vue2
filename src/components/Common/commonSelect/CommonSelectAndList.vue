<template>
  <div class="input-switch-box">
    <div class="con-left">
      <el-select
        :value="comShow"
        :title="title"
        :disabled="disabled"
        placeholder=""
        style="width: 100%"
        :loading="loading"
        :clearable="clearable"
        :filterable="filterable"
        :filter-method="filterMethod"
        :size="size"
        @change="change"
        @visible-change="visibleChange"
        default-first-option
        ref="mySelect"
      >
        <el-option
          v-for="item in options"
          :key="item[idKey]"
          :label="item[labelKey]"
          :value="item[idKey]"
        >
          <slot :item="item"></slot>
        </el-option>
      </el-select>
    </div>
    <div class="con-right" v-if="!disabled && showAdd">
      <svg-icon
        icon-class="list2"
        class="primary-pointer"
        style="font-size: 26px"
        @click="$emit('handleOpen')"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    loading: {
      type: [Boolean],
      default: false
    },
    labelKey: {
      type: [String],
      default: 'label'
    },
    idKey: {
      type: [String],
      default: 'value'
    },
    options: {
      type: [Array],
      default() {
        return []
      }
    },
    optionsAll: {
      type: [Array],
      default() {
        return undefined
      }
    },
    filterable: {
      type: [Boolean],
      default: true
    },
    filterMethod: Function,
    clearable: {
      type: [Boolean],
      default: true
    },
    size: {
      type: String
    },
    title: {
      type: String
    },
    showAdd: {
      type: [Boolean],
      default: true
    }
  },
  watch: {
    /* 解决下拉框先有值，鼠标焦点在下拉框内，选项返回时，导致下拉框内显示了下拉ID */
    options: {
      immediate: true,
      handler: function (value) {
        if (this.show && this.filterMethod) return
        this.$nextTick(() => {
          if (this.$refs.mySelect) {
            this.$refs.mySelect.setSelected()
          }
        })
      }
    },
    optionsAll: {
      immediate: true,
      handler: function (value) {
        this.$nextTick(() => {
          if (this.$refs.mySelect) {
            this.$refs.mySelect.setSelected()
          }
        })
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    comShow() {
      const options = this.optionsAll || this.options
      if (this.id && options.find((item) => item[this.idKey] === this.id)) {
        return this.id
      } else {
        return this.label || this.id
      }
    }
  },
  methods: {
    change(value) {
      const item = this.options.find((item) => item[this.idKey] === value) || {}
      this.$emit('change', item)
    },
    visibleChange(value) {
      this.show = value
      const dom = this.$refs.mySelect
      if (dom.query) {
        this.$set(dom, 'query', '')
      }
      this.$emit('visible-change', value)
    },
    handleBlur() {
      this.$refs.mySelect.blur()
    }
  }
}
</script>

<style></style>
