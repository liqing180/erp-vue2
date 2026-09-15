<template>
  <a-tree-select
    v-model="selectedValue"
    style="width: 100%"
    :tree-data="treeData"
    allow-clear
    :maxTagCount="1"
    multiple
    tree-checkable
    :labelInValue="true"
  />
  <!--  v-model="selectedValue"
    :tree-data="treeData"
    allow-clear
    :maxTagCount="1"
    :multiple="true"
    tree-checkable
    :labelInValue="true"
    style="width: 200px"
    :showCheckedStrategy="SHOW_PARENT" -->
</template>

<script>
import { TreeSelect } from 'ant-design-vue'

export default {
  name: 'ATreeSelectCustom',
  props: {
    // value: {
    //   type: [String, Number, Array, Object]
    // },
    // multiple: {
    //   type: Boolean,
    //   default: true
    // },
    // treeData: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      SHOW_PARENT: TreeSelect.SHOW_PARENT,
      selectedValue: undefined, // 选中的值
      treeData: [
        // 树形数据结构
        {
          title: 'Node1',
          value: '0-0',
          children: [
            { title: 'Child Node1', value: '0-0-1' },
            { title: 'Child Node2', value: '0-0-2' }
          ]
        },
        {
          title: 'Node2',
          value: '0-1'
        }
      ]
    }
  },
  watch: {
    // value(newVal) {
    //   this.selectedValue = newVal || []
    // },
    // selectedValue(newVal) {
    //   this.$emit('input', newVal)
    // }
  }
}
</script>
