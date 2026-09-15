<template>
  <a-tree-select
    v-model="selectedValue"
    :tree-data="selectData"
    :dropdown-style="{
      maxHeight: '300px',
      overflow: 'auto'
    }"
    allow-clear
    :maxTagCount="1"
    :multiple="multiple"
    tree-checkable
    :labelInValue="true"
    @change="change"
    :replaceFields="{
      value: mapValue || 'value',
      label: mapLabel || 'title',
      children: 'children'
    }"
    :show-checked-strategy="SHOW_ALL"
    :filterTreeNode="fillterFUN"
    :maxTagPlaceholder="customMaxTagPlaceholder"
    dropdownClassName="customTreeRef"
    ref="customTreeRef"
    :getPopupContainer="getPopupContainer"
  />
</template>

<script>
import { TreeSelect } from 'ant-design-vue'
export default {
  name: 'ATreeSelectCustom',
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
  data() {
    return {
      SHOW_ALL: TreeSelect.SHOW_ALL,
      selectedValue: undefined
    }
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal
    }
    // selectedValue(newVal) {
    // console.log(newVal, '===========40')
    // this.$emit('input', newVal)
    // }
  },
  mounted() {
    // 获取子组件实例
    // const childComp = this.$refs.customTreeRef
    // if (childComp) {
    // 获取父级组件实例（当前组件就是父级，这里仅作示例）
    // const parentComp = childComp.$parent
    // console.log('父级组件实例：', parentComp)
    // 可以调用父级组件的方法或访问数据
    // parentComp.parentMethod();
    // console.log(parentComp.parentData);
    // }
  },
  methods: {
    fillterFUN(searchVal, treeNode) {
      return treeNode.data.props[this.mapLabel].toLowerCase().includes(searchVal.toLowerCase())
    },
    change(e) {
      this.$emit('updateForm', { value: this.selectedValue, type: this.type })
    },
    customMaxTagPlaceholder(omittedValues) {
      return `+ ${omittedValues.length}`
    },
    getPopupContainer(triggerNode) {
      const container = document.createElement('div')
      container.style.position = 'relative'
      container.style.zIndex = '9999999'
      document.body.appendChild(container)
      return container
    }
  }
}
</script>
<style lang="scss" scoped></style>
