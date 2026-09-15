<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PRODUCT.actualCost')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="right-title">
      <div class="mr20" :title="form.costProjectName">
        <span style="font-weight: 700">{{ $t('PRODUCT.projectName') }}：</span>
        {{ form.costProjectName }}
      </div>
      <div class="mr20" :title="form.costProjectCode">
        <span style="font-weight: 700">{{ $t('PRODUCT.projectCode') }}：</span>
        {{ form.costProjectCode }}
      </div>
      <div class="mr20" :title="form.productName">
        <span style="font-weight: 700">{{ $t('PRODUCT.productName') }}：</span>
        {{ form.productName }}
      </div>
      <div class="mr20" :title="form.internalPartNo">
        <span style="font-weight: 700">{{ $t('PRODUCT.internalPartNo') }}：</span>
        {{ form.internalPartNo }}
      </div>
    </div>

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
            scope.row.costProjectInventoryProductId
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
          <template v-else-if="item.prop === 'qty'">
            <template v-if="scope.row.costProjectInventoryProductId">
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
            <template v-else>
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
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

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCostProjectProductDocumentList } from '@/api/inventoryManagement/summaryByProject'
import locale from '@/views/inventoryManagement/lang/index'
import locale1 from '@/views/productManagement/lang/index'
import locale2 from '@/views/purchaseManagement/lang/index'

// import { queryCostProjectInventoryProductList } from '@/api/projectManagement/project'
export default {
  mixins: [pageMixin],
  data() {
    const vm = this
    return {
      saveKey: '1221',
      savePath: 'inventoryProductDetail',
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      rowIdKey: 'businessPartnerMainId',
      visible: false,
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
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'costProjectUpdateType',
          propBy: 'costProjectUpdateTypeShowStr',
          label: vm.$t('ui.type'),
          visible: true,
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
          visible: true,
          sortable: 'custom',
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseDepositAmount'),
          minWidth: 160,
          visible: true,
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
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      form: {},
      warehouseId: ''
    }
  },
  computed: {
    configCurColumn() {
      let arr = [...this.columns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectName')
      } else {
        const flag = this.tableList.some((x) => x.costProjectName)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectName')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectName')
      } else {
        const flag = this.tableList.some((x) => x.costProjectName)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectName')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.form = row || {}
      this.visible = true
      this.resetSearchForm()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      this.$trimOfObj(param)
      param.costProjectId = this.form.costProjectId
      param.productId = this.form.productId
      queryCostProjectProductDocumentList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.qtyOnHand = this.$numberStr(item.qtyOnHand, this.$getDecNum(item.decimalNum))
            item.unqualifiedQty = this.$numberStr(
              item.unqualifiedQty,
              this.$getDecNum(item.decimalNum)
            )

            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.purchaseCost = this.$numberStr(item.purchaseCost, 2)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 2)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.inventoryCost = this.$numberStr(item.inventoryCost, 2)
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
          })
          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.purchaseCost = this.$numberStr(summary.purchaseCost, 2)
            summary.inventoryCost = this.$numberStr(summary.inventoryCost, 2)
            summary.purchaseAmount = this.$numberStr(summary.purchaseAmount, 2)
            summary.expenseProportion = this.$numberStr(summary.expenseProportion, 2)
            summary.expenseAmount = this.$numberStr(summary.expenseAmount, 2)
            summary.inventoryAmount = this.$numberStr(summary.inventoryAmount, 2)
            rows.push(summary)
          }
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.table_loading = false
          window.console.error(err)
        })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      this.getList()
    },
    handleBack() {
      const vm = this
      vm.visible = false
    },
    closed() {
      this.tableList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.right-title {
  flex: 1;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  div {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  div:first-child {
    max-width: 50%;
  }
}
</style>
