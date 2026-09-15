<template>
  <el-autocomplete
    ref="autocomplete"
    :fetch-suggestions="querySearch"
    :value="inputValue"
    :suffixIcon="(canSelectOptions || []).length > 0 ? 'el-icon-arrow-up' : ''"
    :clearable="true"
    :trigger-on-focus="true"
    @input="inputFn"
    @blur="blurFn"
    @focus="focusFn"
    @clear="clear"
    @keyup.enter.native="$emit('search')"
    @select="handleSelect"
    :maxlength="100"
    :valueKey="'receiveAddressName'"
    highlight-first-item
    select-when-unmatched
    :disabled="disabled"
  />
</template>

<script>
export default {
  name: 'AutocompleteEle',
  props: {
    disabled: {
      type: [Boolean],
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    canSelectOptions: {
      type: [Array],
      default() {
        return []
      }
    },
    allOptions: {
      type: [Array],
      default() {
        return []
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.inputValue = newValue
      }
    }
  },
  data() {
    return {
      inputValue: '',
      mouseType: 'blur',
      isNoChange: false
    }
  },
  methods: {
    inputFn(value) {
      this.isNoChange = false
      this.inputValue = value
      this.$emit('input', value)
    },
    querySearch(queryString, cb) {
      const fuzzyData = this.canSelectOptions || []
      if (fuzzyData.length <= 0) return cb(fuzzyData)
      queryString = (queryString || '').trim()
      const results = queryString ? fuzzyData.filter(this.createFilter(queryString)) : fuzzyData
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (x) => {
        return x.receiveAddressName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }
    },
    blurFn() {
      this.mouseType = 'blur'
      if (this.isNoChange) return
      this.handleSelect()
    },
    focusFn() {
      this.isNoChange = true
      this.mouseType = 'focus'
    },
    clear() {
      this.isNoChange = false
      if (this.mouseType === 'focus') {
        this.$refs.autocomplete.activated = true
      }
      this.$emit('change', {})
    },
    handleSelect() {
      this.inputValue = (this.inputValue || '').trim()
      const item = this.canSelectOptions.find((i) => i.receiveAddressName === this.inputValue)
      if (item) {
        this.$emit('change', item)
      } else {
        this.$emit('change', {
          receiveAddressName: this.inputValue
        })
      }
      // console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped></style>
