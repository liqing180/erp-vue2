<template>
  <!-- :filter-method="fileterFn" -->

  <el-select
    v-model="country"
    filterable
    :placeholder="placeholder"
    clearable
    :disabled="!!disabled"
    @change="handleChange"
    @blur="handleBlur"
    @clear="handleClear"
    style="width: 100%"
    :size="size"
  >
    <!-- no-match-text="No data" -->

    <el-option
      v-for="item in options"
      :key="item.name"
      :label="item.name"
      :value="item.name"
    ></el-option>
  </el-select>
</template>

<script>
// import { queryCountryList } from '@/api/bp/common'
import { queryCountryListBySelect } from '@/api/basic/basic.js'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  mixins: [emitter],
  props: {
    placeholder: {
      type: [String],
      default: ''
    },
    disabled: [Boolean],
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Number]
  },
  data() {
    return {
      options: [],
      cloneOptions: [],
      country: ''
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  watch: {
    country(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      if (val === undefined) return
      this.dispatch('ElFormItem', 'el.form.change', [val])
    },
    value(val) {
      this.country = val
    }
  },
  updated() {
    this.country = this.value
  },
  created() {
    this.country = this.value
    this.queryCountryListBySelect()
  },
  methods: {
    fileterFn(str) {
      if ((str + '').trim() !== '') {
        const res = []
        this.cloneOptions.forEach((item) => {
          if (item.name.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) === 0) {
            res.push(item)
          }
        })
        this.options = res
      } else {
        this.options = this.cloneOptions
      }
    },
    handleChange(name) {
      const row = this.options.find((item) => item.name === name)
      this.$emit('select', row)
    },
    handleClear() {
      this.options = this.cloneOptions
    },
    handleBlur() {
      setTimeout(() => {
        this.options = this.cloneOptions
      }, 80)
    },
    queryCountryListBySelect() {
      const vm = this
      queryCountryListBySelect().then((res) => {
        const results = res.data
        vm.options = results
        vm.cloneOptions = results
        if (vm.value) {
          vm.country = vm.value
        }
      })
    }
  }
}
</script>
