<template>
  <el-autocomplete
    ref="autocomplete"
    :fetch-suggestions="querySearch"
    size="small"
    style="width: 100%"
    :placeholder="placeholder"
    :value="value"
    :suffixIcon="(fuzzyData || []).length > 0 ? 'el-icon-arrow-up' : ''"
    :clearable="true"
    :trigger-on-focus="true"
    @input="$emit('updateForm', { value: $event, type })"
    @blur="blurFn"
    @focus="focusFn"
    @clear="clear"
    @keyup.enter.native="$emit('search')"
    @select="handleSelect"
    :maxlength="maxlength || 50"
    :autofocus="autofocus"
    :valueKey="defaultProps ? defaultProps.label : 'label'"
  />
</template>

<script>
export default {
  name: 'AutocompleteEle',
  props: [
    'value',
    'placeholder',
    'type',
    'width',
    'tooltip',
    'maxlength',
    'name',
    'selectName',
    'inputName',
    'fuzzyData',
    'defaultProps',
    'autofocus'
  ],
  data() {
    return {
      mouseType: 'blur'
    }
  },
  watch: {},
  methods: {
    querySearch(queryString, cb) {
      const fuzzyData = this.fuzzyData || []
      if (fuzzyData.length <= 0) return cb(fuzzyData)
      queryString = (queryString || '').trim()
      const results = queryString ? fuzzyData.filter(this.createFilter(queryString)) : fuzzyData
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (x) => {
        return x[this.defaultProps.label].toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }
    },
    blurFn() {
      this.mouseType = 'blur'
    },
    focusFn() {
      this.mouseType = 'focus'
    },
    clear() {
      if (this.mouseType === 'focus') {
        this.$refs.autocomplete.activated = true
      }
      this.$emit('search')
    },
    handleSelect(item) {
      this.$emit('search')
      // console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped></style>
