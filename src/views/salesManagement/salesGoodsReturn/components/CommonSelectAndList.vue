<template>
  <div class="input-switch-box">
    <div class="con-left">
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
    <div class="con-right" v-if="!disabled">
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
      this.$emit('visible-change', value)
    }
  }
}
</script>

<style></style>
