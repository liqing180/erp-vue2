<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.detailsSummary')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-row type="flex" justify="space-between">
      <el-col>
        <right-toolbar
          :saveKey="saveKey"
          :savePath="savePath"
          :showRefreshBtn="true"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
      </el-col>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      :max-height="tableMaxHeight"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
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
import { inventoryQuerySummaryListByProduct } from '@/api/reportManagement/inventoryCostAnalysis'
import locale from '@/views/inventoryManagement/lang/index'

export default {
  dicts: ['i_stock_certificate_document_type', 'i_inventory_type'],
  mixins: [pageMixin],
  components: {},
  data() {
    const vm = this
    return {
      saveKey: '11',
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
          prop: 'revisedDocumentNo',
          label: vm.$t('PURCHASE.documentNo'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'logisticsNo',
          label: vm.$t('PURCHASE.logisticsCostNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'preStockOutInNoteNo',
          label: vm.$t('PURCHASE.preStockOutStockInNote'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'stockOutInNoteNo',
          label: vm.$t('PURCHASE.stockOutStockInNote'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentType',
          propBy: 'revisedDocumentTypeShowStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'inventoryType',
          propBy: 'inventoryTypeShowStr',
          label: vm.$t('INVENTORY.inventoryType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'revisedQty',
          propBy: 'revisedQtyShowStr',
          label: vm.$t('INVENTORY.revisedQtyQualified'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'revisedUnqualifiedQtyShowStr',
          label: vm.$t('INVENTORY.revisedQtyUnqualified'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'revisedAmount',
          propBy: 'revisedAmountShowStr',
          label: vm.$t('PURCHASE.revisedAmount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'purchaseCostForProduct',
          label: vm.$t('PURCHASE.purchaseCost'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'qtyOnHandForProduct',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unqualifiedQtyForProduct',
          label: vm.$t('PURCHASE.unqualifiedQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseAmountForProduct',
          label: vm.$t('PURCHASE.purchaseDepositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'expenseProportion',
          label: vm.$t('PURCHASE.expenseProportion'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'expenseAmount',
          label: vm.$t('PURCHASE.expenseAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'inventoryCostForProduct',
          label: vm.$t('PURCHASE.inventoryCost'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'inventoryAmountForProduct',
          label: vm.$t('PURCHASE.inventoryCost1'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('PURCHASE.updatedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      }
    }
  },
  computed: {},
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(id) {
      this.productId = id
      this.visible = true
      this.resetSearchForm()
    },
    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      param.productId = this.productId
      this.$trimOfObj(param)
      inventoryQuerySummaryListByProduct(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.qtyOnHandForProduct = this.$numberStr(
              item.qtyOnHandForProduct,
              this.$getDecNum(item.decimalNum)
            )
            item.unqualifiedQtyForProduct = this.$numberStr(
              item.unqualifiedQtyForProduct,
              this.$getDecNum(item.decimalNum)
            )

            item.unqualifiedQty = this.$numberStr(
              item.unqualifiedQty,
              this.$getDecNum(item.decimalNum)
            )

            item.purchaseAmountForProduct = this.$numberStr(item.purchaseAmountForProduct, 2)
            item.purchaseCostForProduct = this.$numberStr(item.purchaseCostForProduct, 2)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 2)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.inventoryCostForProduct = this.$numberStr(item.inventoryCostForProduct, 2)
            item.inventoryAmountForProduct = this.$numberStr(item.inventoryAmountForProduct, 2)

            item.inventoryTypeStr = this.selectDictLabel(
              this.dict.type.i_inventory_type,
              item.inventoryType
            )
          })
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
  span {
    display: inline-block;
    max-width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
