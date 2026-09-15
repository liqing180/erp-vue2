<template>
  <div>
    <el-table v-loading="loading" border ref="tables" :max-height="500" :data="showTabList">
      <!-- <el-table-column
      type="index"
      key="index"
      :label="$t('ui.sn')"
      width="60"
      fixed="left"
      align="center"
    >
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column> -->
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
    <pagination
      :saveKey="saveKey"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
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
      saveKey: 'Log',
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
      ],
      showTabList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 25
      }
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
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
  },
  methods: {
    changeTable() {
      this.tableList.forEach((item) => {
        item.operatorTimeStr = this.parseTime(item.operatorTime, this.fmtForYmdhms)
      })
      this.total = this.tableList.length
      this.queryParams.pageNum = 1

      this.getList()
    },
    getList() {
      const pageNum = this.queryParams.pageNum
      const pageSize = this.queryParams.pageSize
      // const total = this.comTotal
      const startIndex = (pageNum - 1) * pageSize
      const endIndex = pageNum * pageSize
      this.showTabList = this.tableList.slice(startIndex, endIndex)
      this.$$getColumnContentMaxWidth(this.columns, this.showTabList)
    }
  }
}
</script>

<style></style>
