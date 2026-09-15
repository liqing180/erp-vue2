<template>
  <el-table border ref="tables" max-height="600px" :data="tableList">
    <el-table-column
      type="index"
      key="index"
      :label="$t('ui.sn')"
      width="60"
      fixed="left"
      align="center"
      class-name="allowDrag"
    >
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="item in visibleColumn"
      :key="item.prop + item.colSortIndex"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :min-width="getMinWidth(item)"
      :show-overflow-tooltip="item.tooltip"
      :fixed="item.fixed"
      :sortable="item.sortable"
      :align="item.align || 'left'"
      header-align="center"
    >
      <template slot-scope="scope">
        <template>{{ scope.row[item.prop] }}</template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

export default {
  components: {},
  mixins: [pageMixin],
  props: {},
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '5',
      /* 表格部分 */
      columns: [
        {
          prop: 'projectName',
          label: vm.$t('PRODUCT.projectName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      tableList: []
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(data = []) {
      this.tableList = JSON.parse(JSON.stringify(data))
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    }
  }
}
</script>

<style lang="scss" scoped></style>
