<template>
  <div>
    <el-select
      size="small"
      :style="{ width: maxTextWidth ? maxTextWidth + 'px' : '120px' }"
      :value="selectVal"
      :placeholder="placeholder || ''"
      clearable
      @change="
        $emit('updateForm', { value: $event, type, childType: 'select', selectName, inputName })
      "
    >
      <el-option
        v-for="child in selectData"
        :key="child[selectValue]"
        :label="child[selectLabel]"
        :value="child[selectValue]"
      >
      </el-option>
    </el-select>
    <el-autocomplete
      ref="autocomplete"
      :key="selectVal"
      :fetch-suggestions="querySearch"
      size="small"
      style="width: 240px"
      :placeholder="placeholder"
      :value="inputValue"
      :suffixIcon="(fuzzyData || []).length > 0 ? 'el-icon-arrow-up' : ''"
      :clearable="true"
      :trigger-on-focus="true"
      @input="
        $emit('updateForm', { value: $event, type, childType: 'input', selectName, inputName })
      "
      @keyup.enter.native="$emit('search')"
      @blur="blurFn"
      @focus="focusFn"
      @clear="clear"
      @select="handleSelect"
      :maxlength="maxlength || 50"
      :autofocus="autofocus"
      :valueKey="defaultProps ? defaultProps.label : 'label'"
    />
  </div>
</template>

<script>
export default {
  name: 'SelectAnInput',
  props: [
    'inputVal',
    'selectId',
    'placeholder',
    'selectData',
    'value',
    'selectValue',
    'selectLabel',
    'type',
    'width',
    'tooltip',
    'maxlength',
    'name',
    'selectName',
    'inputName',
    'maxTextWidth',
    'fuzzyData',
    'defaultProps',
    'autofocus'
  ],
  data() {
    return {
      selectVal: this.selectId || undefined,
      inputValue: this.inputVal || '',
      mouseType: 'blur'
    }
  },
  watch: {
    selectId(newVal, oldVal) {
      this.selectVal = newVal || undefined
    },
    inputVal(newVal, oldVal) {
      this.inputValue = newVal || ''
    }
  },
  methods: {
    querySearch(queryString, cb) {
      const fuzzyData = this.fuzzyData || []
      if (fuzzyData.length <= 0) return cb(fuzzyData)
      queryString = queryString.trim()
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
    },
    handleSelect(item) {
      this.$emit('search')
      // console.log(item)
    }
  }
}
</script>

<style lang="scss" scoped></style>
