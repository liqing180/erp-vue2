<template>
  <div class="app-container">
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
          v-hasPermi="['salesReportManagement:salesPerformance:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
        ref="rightToolbar"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['salesReportManagement:salesPerformance:export'])"
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

    <el-radio-group v-model="chartType" @input="radioChange" class="mt20">
      <el-radio-button label="0">{{ $t('SALES.amount') }}</el-radio-button>
      <el-radio-button label="1">{{ $t('SALES.qty') }}</el-radio-button>
    </el-radio-group>

    <div class="flex mt20">
      <div style="width: 50%">
        <PieChart
          ref="PieChart1"
          :title="
            chartType === '0'
              ? $t('SALES.amountProportionAnalysisSalesQuotation')
              : $t('SALES.qtyProportionAnalysisSalesQuotation')
          "
        />
      </div>
      <div style="width: 50%">
        <PieChart
          ref="PieChart2"
          :title="
            chartType === '0'
              ? $t('SALES.amountProportionAnalysisSalesOrder')
              : $t('SALES.qtyProportionAnalysisSalesOrder')
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import {
  queryListForCustomer,
  queryImageForCustomer
} from '@/api/salesReportManagement/salesPerformanceSummary'

import PieChart from './PieChart'
export default {
  name: 'SalesPerformance',
  dicts: [],
  mixins: [pageMixin],
  components: { PieChart },
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
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('SALES.customerCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'branchCompanyName',
        //   label: vm.$t('SALES.companyName'),
        //   visible: true,
        //   minWidth: 160,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        // {
        //   prop: 'departmentName',
        //   label: vm.$t('SALES.salesDepartment'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'totalCountSq',
          label: vm.$t('SALES.quotedQty'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'totalCountSo',
          label: vm.$t('SALES.qty1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'totalAmountSq',
          label: vm.$t('SALES.quotedAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'totalAmountSo',
          label: vm.$t('SALES.salesAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'transactionRateShowStr',
          label: vm.$t('SALES.transactionRate'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        dateRange: []
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.customerSearch')}`
        },
        {
          name: 'dateRange',
          label: vm.$t('SALES.timeLimit'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
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
      rowIdKey: 'businessPartnerId',
      chartType: '0'
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
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
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
            item.totalAmountSo = this.$numberStr(item.totalAmountSo, 2)
            item.totalAmountSq = this.$numberStr(item.totalAmountSq, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.totalAmountSo = this.$numberStr(summary.totalAmountSo, 2)
            summary.totalAmountSq = this.$numberStr(summary.totalAmountSq, 2)
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
      this.queryImageForCustomer()
    },
    queryImageForCustomer() {
      const { endDateCreatedTime, startDateCreatedTime } = this.queryParams

      queryImageForCustomer({ endDateCreatedTime, startDateCreatedTime }).then((res) => {
        const data = res.data || {}
        const totalAmountSo = data.totalAmountSo || ''
        const totalAmountSq = data.totalAmountSq || ''
        const totalCountSo = data.totalCountSo || ''
        const totalCountSq = data.totalCountSq || ''

        const imageForSalesPersonList = data.imageForSalesPersonList || []
        const chartData1 = []
        const chartData2 = []
        const chartData3 = []
        const chartData4 = []
        imageForSalesPersonList.forEach((x) => {
          if (x.totalAmountSq) {
            chartData1.push({
              name: x.businessPartnerName,
              totalAmount: totalAmountSq,
              value: x.totalAmountSq,
              label1: this.$t('SALES.customerName'),
              label2: this.$t('SALES.totalAmount'),
              label3: this.$t('SALES.amount'),
              isAmount: true
            })
          }
          if (x.totalAmountSo) {
            chartData2.push({
              name: x.businessPartnerName,
              totalAmount: totalAmountSo,
              value: x.totalAmountSo,
              label1: this.$t('SALES.customerName'),
              label2: this.$t('SALES.totalAmount'),
              label3: this.$t('SALES.amount'),
              isAmount: true
            })
          }

          if (x.totalCountSq) {
            chartData3.push({
              name: x.businessPartnerName,
              totalAmount: totalCountSq,
              value: x.totalCountSq,
              label1: this.$t('SALES.customerName'),
              label2: this.$t('SALES.totalCount'),
              label3: this.$t('SALES.count')
            })
          }

          if (x.totalCountSo) {
            chartData4.push({
              name: x.businessPartnerName,
              totalAmount: totalCountSo,
              value: x.totalCountSo,
              label1: this.$t('SALES.customerName'),
              label2: this.$t('SALES.totalCount'),
              label3: this.$t('SALES.count')
            })
          }
        })
        this.chartData1 = chartData1
        this.chartData2 = chartData2
        this.chartData3 = chartData3
        this.chartData4 = chartData4
        this.radioChange()
      })
    },
    radioChange() {
      if (this.chartType === '0') {
        this.$nextTick(() => {
          this.$refs.PieChart1 && this.$refs.PieChart1.initChart(this.chartData1)
          this.$refs.PieChart2 && this.$refs.PieChart2.initChart(this.chartData2)
        })
      }
      if (this.chartType === '1') {
        this.$nextTick(() => {
          this.$refs.PieChart1 && this.$refs.PieChart1.initChart(this.chartData3)
          this.$refs.PieChart2 && this.$refs.PieChart2.initChart(this.chartData4)
        })
      }
    },
    /* querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const { departmentList } = res.data || {}
        this.searchData.forEach((item) => {
          if (item.name === 'departmentIdList') {
            this.$set(item, 'selectData', departmentList)
          }
        })
        this.setFuzzyData()
      })
    }, */

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
        '/sales/salesPerformanceSummary/exportForCustomer',
        params,
        `${this.getFileNameDate('Sales Performance')}.xlsx`
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
