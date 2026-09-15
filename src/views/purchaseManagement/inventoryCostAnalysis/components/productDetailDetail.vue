<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.details')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="right-title">
      <div class="mr20" :title="form.productName">
        <span style="font-weight: 700">{{ $t('PRODUCT.productName') }}：</span>
        {{ form.productName }}
      </div>
      <div class="mr20" :title="form.internalPartNo">
        <span style="font-weight: 700">{{ $t('PRODUCT.internalPartNo') }}：</span>
        {{ form.internalPartNo }}
      </div>
      <div class="mr20" v-show="form.brand" :title="form.brand">
        <span style="font-weight: 700">{{ $t('PURCHASE.brand') }}：</span>
        {{ form.brand }}
      </div>
      <div class="mr20" v-show="form.basicUom" :title="showUomLabel(form.basicUom)">
        <span style="font-weight: 700">{{ $t('PURCHASE.uom') }}：</span>
        {{ form.basicUom }}
      </div>
    </div>

    <el-row type="flex" justify="space-between" class="mt20">
      <el-col>
        <el-button type="primary" size="mini" @click="revisionSummaryRecord">{{
          $t('PURCHASE.revisionSummaryRecord')
        }}</el-button>
      </el-col>
      <el-col>
        <right-toolbar
          :saveKey="saveKey"
          :savePath="savePath"
          :showRefreshBtn="true"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
        ></right-toolbar>
        <div
          class="pointer"
          style="float: right; border: 1px solid #dcdfe6; border-radius: 50%; padding: 5px"
          @click="openChart"
        >
          <svg-icon icon-class="line" style="font-size: 16px; color: #333" />
        </div>
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
      @row-dblclick="handleDetail"
      style="cursor: pointer"
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
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <svg-icon
              icon-class="list2"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handleDetail(scope.row)"
            />
          </div>
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

    <chartDlg ref="chartDlg" />
    <!-- 明细汇总 -->
    <revisionSummaryRecordDlg ref="revisionSummaryRecordDlg" />
    <!-- 变更记录 -->
    <revisionRecordDlg ref="revisionRecordDlg" />
    <productDetailDetailChartDlg ref="productDetailDetailChartDlg" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryPurchaseCostProductDocumentLogisticsList } from '@/api/reportManagement/inventoryCostAnalysis'
import chartDlg from './chartDlg1'
import revisionSummaryRecordDlg from './revisionSummaryRecordDlg'
import revisionRecordDlg from './revisionRecordDlg'
import productDetailDetailChartDlg from './productDetailDetailChartDlg'

export default {
  dicts: ['i_stock_certificate_document_type', 'i_inventory_type'],
  mixins: [pageMixin],
  components: {
    chartDlg,
    revisionSummaryRecordDlg,
    revisionRecordDlg,
    productDetailDetailChartDlg
  },
  data() {
    const vm = this
    return {
      saveKey: '31',
      savePath: 'productDetailDetail',
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
          prop: 'detailDocumentNo',
          label: vm.$t('PURCHASE.documentNo'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'detailDocumentType',
          propBy: 'detailDocumentTypeShowStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          sortable: 'custom',
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'logisticsNo',
          label: vm.$t('PURCHASE.logisticsCostNo'),
          visible: true,
          // sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'shippingAgentName',
          label: vm.$t('PURCHASE.shippingAgent'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'deliveryTimeDays',
          label: vm.$t('PURCHASE.deliveryTimeDays'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
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
          prop: 'purchasePrice',
          label: vm.$t('PURCHASE.unitPrice1'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'purchaseCost',
          label: vm.$t('PURCHASE.landedCost'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('PURCHASE.updatedTime'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        }
      ],
      searchData: [
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
        },
        {
          name: 'countryIdList',
          label: vm.$t('ui.country'),
          type: 'MultipleSelectEle',
          filterable: true,
          selectValue: 'countryId',
          selectLabel: 'country',
          width: '200px',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PURCHASE.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      form: {}
    }
  },
  computed: {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.form = row || {}
      this.productId = row.productId
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    openChart() {
      this.$refs.productDetailDetailChartDlg.openChart(this.form)
    },

    getList() {
      const vm = this
      this.loading = true
      const param = this.queryParams
      param.productId = this.form.productId
      param.documentId = this.form.documentId
      this.$trimOfObj(param)
      queryPurchaseCostProductDocumentLogisticsList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.purchasePrice = this.$numberStr(item.purchasePrice, 2)
            item.purchaseCost = this.$numberStr(item.purchaseCost, 2)
            item.qty = this.$numberStr(item.qty, this.$getDecNum(item.decimalNum))

            item.revisedAmountAllWarehouse = this.$numberStr(item.revisedAmountAllWarehouse, 2)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.revisedQtyShowStr = this.$numberStr(
              item.revisedQty,
              this.$getDecNum(item.decimalNum)
            )
            item.afterQtyAllWarehouse = this.$numberStr(
              item.afterQtyAllWarehouse,
              this.$getDecNum(item.decimalNum)
            )
            item.inventoryAmountAllWarehouse = this.$numberStr(item.inventoryAmountAllWarehouse, 2)
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
    revisionSummaryRecord() {
      this.$refs.revisionSummaryRecordDlg.handleOpen(this.form)
    },
    handleDetail(row) {
      this.$refs.revisionRecordDlg.handleOpen(row)
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
