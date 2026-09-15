<template>
  <el-select
    :value="comShow"
    :disabled="disabled"
    placeholder=""
    style="width: 100%"
    :loading="loading"
    :clearable="clearable"
    :filterable="filterable"
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
    filterable: {
      type: [Boolean],
      default: true
    },
    clearable: {
      type: [Boolean],
      default: true
    },
    size: {
      type: String
    }
  },
  watch: {
    /* 解决下拉框先有值，鼠标焦点在下拉框内，选项返回时，导致下拉框内显示了下拉ID */
    options: {
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
    return {}
  },
  computed: {
    comShow() {
      if (this.id && this.options.find((item) => item[this.idKey] === this.id)) {
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
      const dom = this.$refs.mySelect
      if (dom.query) {
        this.$set(dom, 'query', '')
      }
      this.$emit('visible-change', value)
    }
  }
}
</script>

<style></style>
