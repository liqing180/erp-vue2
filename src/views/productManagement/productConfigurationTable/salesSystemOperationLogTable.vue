<template>
  <el-table
    :cell-class-name="cellClassName"
    v-loading="loading"
    border
    ref="tables"
    :max-height="300"
    :data="tableList"
  >
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
  mixins: [pageMixin],
  props: {
    tableList: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      /* 表格部分 */
      columns: [
        {
          prop: 'operationTypeShowStr',
          label: vm.$t('sysOL.operationType'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'operatorBy',
          label: vm.$t('sysOL.operator'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'operationResultShowStr',
          label: vm.$t('sysOL.result'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'operatorTimeStr',
          label: vm.$t('sysOL.time'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'operationDescriptionShowStr',
          label: vm.$t('sysOL.description'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  watch: {
    tableList: {
      immediate: true,
      handler: function () {
        this.changeTable()
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', {
      sysOL: {
        operationType: '操作类型',
        operator: '操作人',
        result: '操作结果',
        time: '操作时间',
        description: '操作说明'
      }
    })
    this.$i18n.mergeLocaleMessage('en', {
      sysOL: {
        operationType: 'Operation Type',
        operator: 'Operator',
        result: 'Result',
        time: 'Time',
        description: 'Description'
      }
    })
  },
  created() {
    this.$$initColumnHeaderWidth(this.columns)
  },
  methods: {
    changeTable() {
      this.tableList.forEach((item) => {
        item.operatorTimeStr = this.parseTime(item.operatorTime, this.fmtForYmdhms)
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (column.property === 'remarks' && row.logModifyType === '1') {
        cellClass = 'text-red'
      }
      return cellClass
    }
  }
}
</script>

<style lang="scss">
.text-red {
  .cell {
    color: #ff4949;
  }
}
</style>
