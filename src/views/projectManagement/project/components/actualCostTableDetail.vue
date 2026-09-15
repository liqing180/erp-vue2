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
      :max-height="600"
      @sort-change="handleSortChange"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="80" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.costProjectInventoryId
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
          <!-- <template v-else-if="item.prop === 'qty'">
            <template v-if="scope.row.costProjectInventoryProductId">
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
            <template v-else>
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
          </template> -->
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
import locale1 from '@/views/productManagement/lang/index'

import { queryCostProjectInventoryProductList } from '@/api/projectManagement/project'
export default {
  mixins: [pageMixin],
  components: {},
  props: {
    comDisFrom: {
      type: Boolean,
      default: false
    },
    pqProductList: {
      type: Array,
      default() {
        return []
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    warehouseId: {
      type: String,
      default: ''
    },
    storeIssueChitId: {
      type: String,
      default: ''
    }
  },
  watch: {},
  data() {
    const vm = this
    return {
      saveKey: '14',
      savePath: 'actualCostTableDetail',
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
          prop: 'documentNo',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeShowStr',
          label: vm.$t('PURCHASE.documentType'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'preStockOutInNoteNo',
        //   label: vm.$t('PURCHASE.preStockOutStockInNote'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'logisticsNo',
          label: vm.$t('PURCHASE.logisticsCostNo1'),
          visible: false,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: false,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'costProjectUpdateType',
          propBy: 'costProjectUpdateTypeShowStr',
          label: vm.$t('ui.type'),
          visible: false,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseCost',
          label: vm.$t('PURCHASE.purchaseCost'),
          visible: false,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseDepositAmount'),
          minWidth: 160,
          visible: false,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'inventoryCost',
          label: vm.$t('PURCHASE.inventoryCost'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'inventoryAmount',
          label: vm.$t('PURCHASE.projectCost'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
        }
        // {
        //   prop: 'totalInventoryAmount',
        //   label: vm.$t('PURCHASE.subTotalInventoryCost'),
        //   minWidth: 220,
        //   visible: true,
        //   sortable: 'custom',
        //   tooltip: true,
        //   padding: 50,
        //   align: 'right'
        // }
      ],
      rowIdKey: 'costProjectInventoryId',
      rowId: null
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
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init(id) {
      this.$refs.tables && this.$refs.tables.clearSort()

      this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
      this.rowId = id
      this.getList()
    },
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      param.costProjectInventoryId = this.rowId
      this.loading = true
      queryCostProjectInventoryProductList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.purchaseCost = this.$numberStr(item.purchaseCost, 2)
            item.inventoryCost = this.$numberStr(item.inventoryCost, 2)
            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 2)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
            item.totalInventoryAmount = this.$numberStr(item.totalInventoryAmount, 2)
            item.qty = this.$numberStr(item.qty, item.decimalNum)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.purchaseCost = this.$numberStr(summary.purchaseCost, 2)
            summary.inventoryCost = this.$numberStr(summary.inventoryCost, 2)
            summary.purchaseAmount = this.$numberStr(summary.purchaseAmount, 2)
            summary.expenseProportion = this.$numberStr(summary.expenseProportion, 2)
            summary.expenseAmount = this.$numberStr(summary.expenseAmount, 2)
            summary.inventoryAmount = this.$numberStr(summary.inventoryAmount, 2)
            summary.qty = this.$numberStr(summary.qty, summary.decimalNum)

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
    }
  }
}
</script>

<style></style>
