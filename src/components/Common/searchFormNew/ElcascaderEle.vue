<template>
  <el-cascader
    :show-all-levels="false"
    placeholder=""
    size="small"
    :value="value"
    :options="selectData"
    :props="{
      multiple: multiple === false ? multiple : true,
      checkStrictly: checkStrictly,
      emitPath: emitPath === false ? emitPath : true,
      value: mapValue || 'id',
      label: mapLabel || 'label'
    }"
    clearable
    :collapse-tags="true"
    @change="$emit('updateForm', { value: $event, type })"
    class="cascader"
    ref="cascader"
    popper-class="hide-cascader-scrollbar"
    :style="{ width: '100%' }"
  ></el-cascader>
</template>

<script>
export default {
  name: 'ElcascaderEle',
  components: {},
  props: [
    'placeholder',
    'selectData',
    'value',
    'selectValue',
    'selectLabel',
    'width',
    'type',
    'mapValue',
    'mapLabel',
    'checkStrictly',
    'multiple',
    'emitPath'
  ],
  methods: {
    getCheckedNodes() {
      const nodes = this.$refs.cascader.getCheckedNodes()
      return nodes.map((x) => x.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.cascader ::v-deep .el-cascader__tags > span {
  display: flex;
  max-width: 120px;
}
</style>
