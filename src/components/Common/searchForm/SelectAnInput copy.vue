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
    <el-input
      size="small"
      style="width: 240px"
      :placeholder="placeholder"
      :value="inputValue"
      clearable
      @input="
        $emit('updateForm', { value: $event, type, childType: 'input', selectName, inputName })
      "
      @keyup.enter.native="$emit('search')"
      :maxlength="maxlength || 50"
    >
    </el-input>
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
    'maxTextWidth'
  ],
  data() {
    return {
      selectVal: this.selectId || undefined,
      inputValue: this.inputVal || ''
    }
  },
  watch: {
    selectId(newVal, oldVal) {
      this.selectVal = newVal || undefined
    },
    inputVal(newVal, oldVal) {
      this.inputValue = newVal || ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
