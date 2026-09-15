<template>
  <el-select
    size="small"
    :style="{ width: '240px' }"
    :value="value"
    :placeholder="placeholder || ''"
    clearable
    :filterable="filterable"
    @change="$emit('updateForm', { value: $event, type })"
  >
    <el-option
      v-for="child in selectData"
      :key="child[selectValue]"
      :label="child[selectLabel]"
      :value="child[selectValue]"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectEle',
  components: {},
  props: [
    'placeholder',
    'selectData',
    'value',
    'selectValue',
    'selectLabel',
    'width',
    'type',
    'filterable'
  ]
}
</script>
