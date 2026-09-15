<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('PURCHASE.productDetail')"
    :visible.sync="visible"
    width="1200px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div class="right-title">
      <span class="mr20" :title="form.productName">
        {{ $t('PRODUCT.productName') }}：{{ form.productName }}
      </span>
      <span class="mr20" :title="form.internalPartNo">
        {{ $t('PRODUCT.internalPartNo') }}：{{ form.internalPartNo }}
      </span>
      <span class="mr20" v-show="form.brand" :title="form.brand">
        {{ $t('PURCHASE.brand') }}：{{ form.brand }}
      </span>
      <span class="mr20" v-show="form.basicUom" :title="showUomLabel(form.basicUom)">
        {{ $t('PURCHASE.uom') }}：{{ form.basicUom }}
      </span>
    </div>

    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      class="mt20"
    >
    </search-form>

    <el-row type="flex" justify="space-between" class="mt20">
      <el-col>
        <el-button type="primary" size="mini" @click="detailsSummary">{{
          $t('PURCHASE.detailsSummary')
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

    <productDetailChartDlg ref="productDetailChartDlg" />
    <!-- 明细汇总 -->
    <detailsSummaryDlg ref="detailsSummaryDlg" />
    <!-- 明细 -->
    <productDetailDetail ref="productDetailDetail" />
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  queryPurchaseCostProductDocumentList,
  queryPurchaseCostProductDocumentSearchList
} from '@/api/reportManagement/inventoryCostAnalysis'
import locale from '@/views/inventoryManagement/lang/index'
import productDetailChartDlg from './productDetailChartDlg'
import detailsSummaryDlg from './detailsSummaryDlg'
import productDetailDetail from './productDetailDetail'

export default {
  mixins: [pageMixin],
  components: { productDetailChartDlg, detailsSummaryDlg, productDetailDetail },
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'productDetail',
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
          label: vm.$t('PURCHASE.documentNo'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'documentType',
          propBy: 'documentTypeShowStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          sortable: 'custom',
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          minWidth: 160,
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
          prop: 'purchaseCost',
          label: vm.$t('PURCHASE.purchaseCost'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
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
          prop: 'deliveryTimeDays',
          label: vm.$t('PURCHASE.deliveryTimeDays'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
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
          name: 'countryList',
          label: vm.$t('ui.country'),
          type: 'MultipleSelectEle',
          filterable: true,
          selectValue: 'country',
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
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    async handleOpen(row) {
      this.form = row || {}
      this.productId = row.productId
      this.visible = true
      // this.queryParams.pageNum = 1
      // this.getList()
      this.resetSearchForm()
    },
    openChart() {
      const params = Object.assign(this.queryParams, { productId: this.productId })
      this.$refs.productDetailChartDlg.openChart(params)
    },
    // 搜索下拉值
    queryPurchaseCostProductDocumentSearchList() {
      queryPurchaseCostProductDocumentSearchList({ productId: this.productId }).then((res) => {
        const { businessPartnerList, countryList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'countryList') {
            this.$set(x, 'selectData', countryList)
          } else if (x.name === 'businessPartnerIdList') {
            this.$set(x, 'selectData', businessPartnerList)
          }
        })
      })
    },
    getList() {
      this.queryPurchaseCostProductDocumentSearchList()

      const vm = this
      this.loading = true
      const param = this.queryParams
      this.$trimOfObj(param)
      param.productId = this.productId
      queryPurchaseCostProductDocumentList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
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
    detailsSummary() {
      this.$refs.detailsSummaryDlg.handleOpen(this.productId)
    },
    handleDetail(row) {
      this.$refs.productDetailDetail.handleOpen(row)
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
