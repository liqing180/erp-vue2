<template>
  <el-select
    :value="comShow"
    :disabled="disabled"
    placeholder=""
    style="width: 100%"
    :loading="loading"
    :clearable="clearable"
    :filterable="filterable"
    @change="change"
    :size="size"
    @visible-change="visibleChange"
    :popper-append-to-body="appendToBody"
    ref="mySelect"
  >
    <el-option-group v-for="group in options" :key="group.label" :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item[idKey]"
        :label="item[labelKey]"
        :value="item[idKey]"
      >
      </el-option>
    </el-option-group>
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
      type: [String],
      default: undefined
    },
    appendToBody: {
      type: [Boolean],
      default: true
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
      const list = []
      this.options.forEach((item) => {
        if (item.options) {
          list.push(...item.options)
        }
      })
      if (this.id && list.find((item) => item[this.idKey] === this.id)) {
        return this.id
      } else {
        return this.label || this.id
      }
    }
  },
  methods: {
    change(value) {
      const list = []
      this.options.forEach((item) => {
        if (item.options) {
          list.push(...item.options)
        }
      })
      const item = list.find((item) => item[this.idKey] === value) || {}
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
