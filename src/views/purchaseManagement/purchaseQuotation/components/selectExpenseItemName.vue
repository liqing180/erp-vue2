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
    :valueKey="'expenseItemName'"
    highlight-first-item
    select-when-unmatched
    :size="size"
  />
</template>

<script>
export default {
  name: 'AutocompleteEle',
  props: {
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
    },
    size: {
      type: String
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
      mouseType: 'blur'
    }
  },
  methods: {
    inputFn(value) {
      this.inputValue = value
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
        return x.expenseItemName.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }
    },
    blurFn() {
      this.mouseType = 'blur'
      this.handleSelect()
    },
    focusFn() {
      this.mouseType = 'focus'
    },
    clear() {
      if (this.mouseType === 'focus') {
        this.$refs.autocomplete.activated = true
      }
      this.$emit('change', {})
    },
    handleSelect() {
      this.inputValue = (this.inputValue || '').trim()
      if (!this.inputValue) {
        this.$emit('change', {})
        return
      }
      const item = this.allOptions.find((i) => i.expenseItemName === this.inputValue)
      if (item) {
        this.$emit('change', item)
      } else {
        this.$emit('change', {
          expenseItemName: this.inputValue,
          includeDecimal: '1',
          decimalNum: 3,
          qtyLimit: 999,
          isCustom: '1'
        })
      }
      // console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped></style>
