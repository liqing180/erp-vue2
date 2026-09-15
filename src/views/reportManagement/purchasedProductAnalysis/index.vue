<template>
  <div>
    <div class="app-container" v-if="currentIndex === 0">
      <search-form
        ref="searchForm"
        v-model="queryParams"
        :searchData="searchData"
        :handleQuery="handleSearchForm"
        :resetQuery="resetSearchForm"
        :showCustom="false"
        :topShowCount="1"
        :isBtn="true"
        v-show="showSearch"
      />

      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="openExport"
            v-hasPermi="['reportManagement:purchasedProductAnalysis:export']"
            >{{ $t('uiBtn.export') }}</el-button
          >
        </el-col>
        <right-toolbar
          ref="rightToolbar"
          :saveKey="saveKey"
          :showSearch.sync="showSearch"
          :showSearchBtn="false"
          @queryTable="queryTable"
          :columns="configColumn"
          :columnsInit="columns"
          @autoRefresh="autoRefresh"
          :refreshTimeSaveKey="'1'"
        ></right-toolbar>
      </el-row>

      <el-table
        border
        ref="tables"
        class="mt10"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        :data="tableList"
        @row-dblclick="handleUpdate"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        max-height="600px"
        style="cursor: pointer"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
          align="center"
          v-if="checkPermi(['reportManagement:purchasedProductAnalysis:export'])"
        >
        </el-table-column>
        <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row[rowIdKey]
                ? scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1
                : ''
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
            <!-- <template v-if="item.prop === 'reallyPurchaseQtyForBasic'">
              {{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}
            </template>
            <template v-else-if="item.prop === 'stockInQtyForBasic'">
              {{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}
            </template> -->
            <template>{{ scope.row[item.propBy || item.prop] }}</template>
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

      <!-- 导出 -->
      <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
      <!-- 导入 -->
      <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />

      <div class="flexCen mt20">
        <div style="width: 50%; min-width: 500px">
          <PieChart ref="PieChart" />
        </div>
      </div>
    </div>

    <productAnalysis
      ref="productAnalysis"
      :dateRange="queryParams.dateRange"
      :queryParamsProp="queryParams2"
      @currentIndexChange="currentIndexChange"
      @handleUpdate="navToProductDetail"
      v-else-if="currentIndex === 1"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import {
  queryListForSupplierProduct,
  queryImageForSupplierProduct,
  querySearchListForSupplierProduct
} from '@/api/reportManagement/supplierSummary'

import PieChart from '@/views/reportManagement/PieChart'
import productAnalysis from './productAnalysis'
export default {
  name: 'PurchasedProductAnalysis',
  dicts: [],
  mixins: [pageMixin],
  components: { PieChart, productAnalysis },
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      // 导出遮罩层
      exportLoading: false,
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      columns: [
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PRODUCT.supplierCode'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
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
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'reallyPurchaseQtyForBasic',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockInQtyForBasic',
          label: vm.$t('PURCHASE.stockInQty'),
          minWidth: 160,
          visible: true,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'reallyPurchaseAmountForBasic',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'stockInAmountForBasic',
          label: vm.$t('PURCHASE.depositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'qcFailedQtyForBasic',
          label: vm.$t('PURCHASE.iqcBadNumber'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qcFailedAmountForBasic',
          label: vm.$t('PURCHASE.iqcBadMoney'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        dateRange: []
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 25
      },
      queryParams3: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'businessPartnerIdForSearchList',
          label: vm.$t('PRODUCT.supplierName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
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
          name: 'dateRange',
          label: vm.$t('PURCHASE.timeLimit'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateSubmittedTime',
          endDate: 'endDateSubmittedTime'
        }
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/system/productSheet/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productSheet/checkImportData',
        // 提交导入
        importUrl: '/system/productSheet/importData',
        // 下载文件名
        fileName: 'productInformationSheet'
      },
      currentIndex: 0,
      rowIdKey: 'mainId'
    }
  },
  watch: {},
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateSubmittedTime', startTimer)
      this.$set(this.queryParams, 'endDateSubmittedTime', end)
      this.searchFormKey = Date.now()
    },
    getList(query) {
      this.querySearchListForSupplierProduct()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      queryListForSupplierProduct(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.reallyPurchaseAmountForBasic = this.$numberStr(
              item.reallyPurchaseAmountForBasic,
              2
            )
            item.stockInAmountForBasic = this.$numberStr(item.stockInAmountForBasic, 2)
            item.reallyPurchaseQtyForBasic = this.$numberStr(
              item.reallyPurchaseQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.stockInQtyForBasic = this.$numberStr(
              item.stockInQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )

            item.qcFailedQtyForBasic = this.$numberStr(
              item.qcFailedQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.qcFailedAmountForBasic = this.$numberStr(item.qcFailedAmountForBasic, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.reallyPurchaseAmountForBasic = this.$numberStr(
              summary.reallyPurchaseAmountForBasic,
              2
            )
            summary.stockInAmountForBasic = this.$numberStr(summary.stockInAmountForBasic, 2)
            summary.reallyPurchaseQtyForBasic = this.$numberStr(
              summary.reallyPurchaseQtyForBasic,
              3
            )
            summary.stockInQtyForBasic = this.$numberStr(summary.stockInQtyForBasic, 3)
            summary.qcFailedQtyForBasic = this.$numberStr(summary.qcFailedQtyForBasic, 3)
            summary.qcFailedAmountForBasic = this.$numberStr(summary.qcFailedAmountForBasic, 2)
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
      this.queryImageForSupplierProduct()
    },
    // 搜索下拉值
    querySearchListForSupplierProduct() {
      querySearchListForSupplierProduct({}).then((res) => {
        const { businessPartnerList, countryList } = res.data
        this.searchData.forEach((x, i) => {
          if (x.name === 'businessPartnerIdForSearchList') {
            this.$set(x, 'selectData', businessPartnerList)
          } else if (x.name === 'countryIdList') {
            this.$set(x, 'selectData', countryList)
          }
        })
      })
    },
    queryImageForSupplierProduct() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      queryImageForSupplierProduct(param).then((res) => {
        const data = res.data || {}
        let productAmountImageList = data.productAmountImageList || []
        const totalAmountForProduct = data.totalAmountForProduct || ''
        productAmountImageList = productAmountImageList.map((x) => {
          return {
            value: x.reallyPurchaseAmountForBasic,
            name: x.productName + ' ' + (this.$numberStr(x.reallyPurchaseAmountForBasic, 2) || ''),
            topLabel: this.$t('PRODUCT.productName'),
            showName: x.productName,
            totalAmount: totalAmountForProduct
          }
        })
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(productAmountImageList)
        })
      })
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      /* 第一层双击重置第二层搜索条件 */
      this.currentIndex = 1
      this.queryParams2 = {
        pageNum: 1,
        pageSize: 25,
        businessPartnerId: row.businessPartnerId,
        productId: row.productId
      }
    },
    navToProductDetail(row) {
      /* 第二层双击重置第三层搜索条件 */
      this.currentIndex = 2
      this.queryParams3 = {
        pageNum: 1,
        pageSize: 25,
        businessPartnerId: row.businessPartnerId,
        productId: row.productId
      }
    },
    currentIndexChange(index) {
      this.currentIndex = index
      if (this.currentIndex === 0) {
        // this.resetSearchForm()
        this.getList()
      } else if (this.currentIndex === 1) {
        this.$nextTick(() => {
          this.$refs.productAnalysis && this.$refs.productAnalysis.resetSearchForm()
        })
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row[this.rowIdKey]) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      if (!row[this.rowIdKey]) return false
      return true // 不禁用
    },
    nav(row, type) {
      if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      }
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item[this.rowIdKey])
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = this.addDateRange(this.queryParams, this.dateRange)
      params = JSON.parse(JSON.stringify(params))
      params = this.$trimOfObj(params)
      params.exportType = exportType
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item[this.rowIdKey])
        params.exportIdList = params.exportIdList.filter((item) => item)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        'purchase/report/supplierSummary/exportForSupplierProduct',
        params,
        `${this.getFileNameDate('Purchased Product Analysis')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
          vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportLoading = false
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    }
  }
}
</script>

<style scoped></style>
