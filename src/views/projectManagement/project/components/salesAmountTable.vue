<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      :data="tableList"
      @row-dblclick="handleUpdate"
      @sort-change="handleSortChange"
      :max-height="600"
      style="cursor: pointer"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="80" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.costProjectSalesId
              ? scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1
              : $t('PURCHASE.subTotal')
          }}</span>
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
          <template v-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :saveKey="saveKey"
      :savePath="savePath"
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
import locale from '@/views/purchaseManagement/lang/index'

import { queryCostProjectSalesList } from '@/api/projectManagement/project'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    rowId: {
      type: String,
      default: ''
    }
  },
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '15',
      savePath: 'salesAmountTable',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      loading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      columns: [
        {
          prop: 'salesOrderNo',
          label: vm.$t('PURCHASE.salesOrderNo1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesQuotationType',
          propBy: 'salesQuotationTypeShowStr',
          label: vm.$t('PURCHASE.salesOrderType'),
          visible: true,
          minWidth: 120,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesAmount',
          label: vm.$t('PURCHASE.salesAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'receivedAmount',
          label: vm.$t('PURCHASE.receivedAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          visible: true,
          sortable: 'custom'
        }
      ],
      rowIdKey: 'costProjectSalesId'
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init() {
      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.getList()
    },
    queryTable() {
      this.queryParams.isAsc = this.queryParams.orderByColumn = undefined
      this.$refs.tables && this.$refs.tables.clearSort()
      this.getList()
      this.$emit('updateById')
    },
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      param.costProjectId = this.rowId
      this.loading = true
      queryCostProjectSalesList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.salesAmount = this.$numberStr(item.salesAmount, 2)
            item.receivedAmount = this.$numberStr(item.receivedAmount, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.salesAmount = this.$numberStr(summary.salesAmount, 2)
            summary.receivedAmount = this.$numberStr(summary.receivedAmount, 2)

            rows.push(summary)
          }
          this.tableList = rows
          this.loading = false
          this.total = response.total

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
    },
    handleUpdate(row) {
      if (!row.costProjectSalesId) return
      this.$emit('handleUpdate', row, 'salesAmount')
    }
  }
}
</script>

<style></style>
