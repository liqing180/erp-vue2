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
            v-hasPermi="['reportManagement:supplierSummary:export']"
            >{{ $t('uiBtn.export') }}</el-button
          >
        </el-col>
        <right-toolbar
          ref="rightToolbar"
          :saveKey="saveKey"
          savePath="supplierSummary"
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
        style="cursor: pointer"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
          align="center"
          v-if="checkPermi(['reportManagement:supplierSummary:export'])"
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
            <template
              v-if="
                [
                  'shippedAmount',
                  'rejectedAmount',
                  'rejectionRate',
                  'warehouseUnqualifiedAmount'
                ].indexOf(item.prop) !== -1
              "
            >
              {{ $numberStr(scope.row[item.prop], 2) }}
            </template>
            <template
              v-else-if="
                [
                  'allStockInQtyForBasic',
                  'shippedQty',
                  'stockInQtyForBasic',
                  'rejectedQty'
                ].indexOf(item.prop) !== -1
              "
            >
              {{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}
            </template>

            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          align="center"
          width="180"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleView(scope.row)">
              {{ $t('uiBtn.view') }}
            </el-button>
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
        <PieChart ref="PieChart" height="500px" />
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
    <productDetail
      :dateRange="queryParams.dateRange"
      :queryParamsProp="queryParams3"
      ref="productDetail"
      @currentIndexChange="currentIndexChange"
      v-else-if="currentIndex === 2"
    />

    <viewDlg ref="viewDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import {
  queryListForCustomer,
  queryTopImageForCustomer
} from '@/api/reportManagement/customerRejectionAnalysis'
import PieChart from './PieChart'
import productAnalysis from './productAnalysis'
import productDetail from './productDetail'
import viewDlg from './viewDlg'

import { mapGetters } from 'vuex'

export default {
  name: 'WarehouseIncomingMaterialForPoorAnalysis',
  dicts: [],
  mixins: [pageMixin],
  components: { PieChart, productAnalysis, productDetail, viewDlg },
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
          label: vm.$t('PURCHASE.customerCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.customerName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesOrderQTY',
          label: vm.$t('PURCHASE.salesOrderQTY'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'rejectedOrderQTY',
          label: vm.$t('PURCHASE.rejectedOrderQTY'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'shippedQty',
        //   label: vm.$t('PURCHASE.shippedQty'),
        //   visible: true,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   padding: 60,
        //   tooltip: true
        // },
        // {
        //   prop: 'shippedAmount',
        //   label: vm.$t('PURCHASE.shippedAmount'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom',
        //   padding: 50,
        //   align: 'right'
        // },
        // {
        //   prop: 'rejectedQty',
        //   label: vm.$t('PURCHASE.rejectedQty'),
        //   visible: true,
        //   minWidth: 160,
        //   sortable: 'custom',
        //   padding: 60,
        //   tooltip: true
        // },
        // {
        //   prop: 'rejectedAmount',
        //   label: vm.$t('PURCHASE.rejectedAmount'),
        //   visible: true,
        //   minWidth: 160,
        //   sortable: 'custom',
        //   tooltip: true,
        //   align: 'right'
        // },
        {
          prop: 'rejectionRateShowStr',
          label: vm.$t('PURCHASE.rejectionRate'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        dateRange: [],
        currency: undefined
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
          name: 'conditionForCustomer',
          type: 'InputEle',
          placeholder: `${this.$t('ui.customerSearch')}`
        },
        {
          name: 'currency',
          label: vm.$t('ui.currency'),
          type: 'InputEle',
          disabled: true,
          isLine: false
        },
        {
          name: 'dateRange1',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'dateRange',
          label: vm.$t('PURCHASE.timeLimit'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateAcknowledgedTime',
          endDate: 'endDateAcknowledgedTime'
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
    ...mapGetters(['legalEntityInfo']),
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    currency() {
      return this.legalEntityInfo.currency
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
      const { pageSize, currency } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, currency }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateAcknowledgedTime', startTimer)
      this.$set(this.queryParams, 'endDateAcknowledgedTime', end)
      this.searchFormKey = Date.now()
    },
    getList(query) {
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
      queryListForCustomer(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.reallyPurchaseAmountForBasic = this.$numberStr(
              item.reallyPurchaseAmountForBasic,
              2
            )
            // item.salesOrderQTY = this.$numberStr(item.salesOrderQTY, 2)
            // item.rejectedOrderQTY = this.$numberStr(item.rejectedOrderQTY, 2)
          })

          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$set(this.queryParams, 'currency', this.currency)
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
      this.queryTopImageForCustomer()
    },
    queryTopImageForCustomer() {
      const {
        startDateCreatedTime,
        endDateCreatedTime,
        startDateAcknowledgedTime,
        endDateAcknowledgedTime
      } = this.queryParams
      queryTopImageForCustomer({
        startDateCreatedTime,
        endDateCreatedTime,
        startDateAcknowledgedTime,
        endDateAcknowledgedTime
      }).then((res) => {
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(res.data)
        })
      })
    },
    handleView(row) {
      const params = {
        ...this.queryParams,
        businessPartnerId: row.businessPartnerId
      }
      this.$refs.viewDlg.handleOpen(params)
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
        startDateCreatedTime: this.queryParams.startDateCreatedTime,
        endDateCreatedTime: this.queryParams.endDateCreatedTime,
        startDateAcknowledgedTime: this.queryParams.startDateAcknowledgedTime,
        endDateAcknowledgedTime: this.queryParams.endDateAcknowledgedTime
      }
    },
    navToProductDetail(row) {
      /* 第二层双击重置第三层搜索条件 */
      this.currentIndex = 2
      this.queryParams3 = {
        pageNum: 1,
        pageSize: 25,
        businessPartnerId: row.businessPartnerId,
        productId: row.productId,
        startDateCreatedTime: this.queryParams.startDateCreatedTime,
        endDateCreatedTime: this.queryParams.endDateCreatedTime,
        startDateAcknowledgedTime: this.queryParams.startDateAcknowledgedTime,
        endDateAcknowledgedTime: this.queryParams.endDateAcknowledgedTime
      }
    },
    currentIndexChange(index) {
      this.currentIndex = index
      if (this.currentIndex === 0) {
        // this.resetSearchForm()
        this.getList()
      } else if (this.currentIndex === 1) {
        this.$refs.productAnalysis && this.$refs.productAnalysis.getList()
      } else if (this.currentIndex === 2) {
        this.$refs.productDetail && this.$refs.productDetail.getList()
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
        '/sales/report/rejectionAnalysis/exportForCustomer',
        params,
        `${this.getFileNameDate('Customer Rejection Analysis')}.xlsx`
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
