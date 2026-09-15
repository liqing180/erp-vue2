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
          v-hasPermi="['salesReportManagement:salesPerformanceSummary:export']"
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
        v-if="checkPermi(['salesReportManagement:salesPerformanceSummary:export'])"
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

    <div style="font-weight: 700">{{ $t('SALES.salesTrend') }}</div>
    <el-radio-group v-model="chartType" @change="radioChange" class="mt20">
      <el-radio-button label="0">{{ $t('SALES.month') }}</el-radio-button>
      <el-radio-button label="1">{{ $t('SALES.year') }}</el-radio-button>
    </el-radio-group>
    <div class="mt20">
      <div>
        <PieChart ref="PieChart" />
      </div>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import {
  queryListForSalesPerson,
  querySalesTrendCurveForSalesPerson,
  querySearchListForSalesPerson
} from '@/api/salesReportManagement/salesPerformanceSummary'
import PieChart from '@/views/salesReportManagement/salesPerformanceTrend/PieChart'

export default {
  name: 'SalesPerformanceTrend',
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
          prop: 'branchCompanyName',
          label: vm.$t('SALES.companyName'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'departmentName',
          label: vm.$t('SALES.salesDepartment'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesPersonBy',
          label: vm.$t('SALES.salesPerson'),
          minWidth: 160,
          visible: true,
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
          placeholder: `${this.$t('SALES.companyName')} / ${this.$t('SALES.salesDepartment')}`
        },
        {
          name: 'departmentIdList',
          label: vm.$t('SALES.salesDepartment'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'salesPersonIdList',
          label: vm.$t('SALES.salesPerson'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'salesPersonId',
          selectLabel: 'salesPersonBy',
          selectData: []
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
      rowIdKey: 'salesPersonId',
      chartType: '0',
      monthOptions: {},
      yearOptions: {}
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
      this.querySearchListForSalesPerson()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      if (param.departmentIdList && param.departmentIdList.length > 0) {
        param.departmentIdList = param.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        param.departmentIdList = undefined
      }

      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      queryListForSalesPerson(param)
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
      this.querySalesTrendCurveForSalesPerson()
    },
    querySearchListForSalesPerson() {
      querySearchListForSalesPerson({}).then((res) => {
        const { branchCompanyList, salesPersonList } = res.data || {}
        const arr = branchCompanyList
        this.handle(arr)
        this.searchData.forEach((item) => {
          if (item.name === 'salesPersonIdList') {
            this.$set(item, 'selectData', salesPersonList)
          } else if (item.name === 'departmentIdList') {
            this.$set(item, 'selectData', arr)
          }
        })
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          x.value = x.branchCompanyId
          x.label = x.branchCompanyName
          if (x.departmentList && x.departmentList.length > 0) {
            x.children = x.departmentList.map((k) => {
              return {
                value: k.departmentId,
                label: k.departmentName
              }
            })
          }
        })
      }
    },
    querySalesTrendCurveForSalesPerson() {
      const params = {
        startDateCreatedTime: this.queryParams.startDateCreatedTime,
        endDateCreatedTime: this.queryParams.endDateCreatedTime,
        salesPersonIdList: this.queryParams.salesPersonIdList,
        departmentIdList: this.queryParams.departmentIdList
      }

      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      querySalesTrendCurveForSalesPerson(params).then((res) => {
        const data = res.data || {}
        const salesTrendCurveForMonth = data.salesTrendCurveForMonth || {}
        const imageLineList = salesTrendCurveForMonth.imageLineList || []
        const imageXList = salesTrendCurveForMonth.imageXList || []
        this.monthOptions = {
          legendData: imageLineList.map((item) => item.salesPersonBy),
          xAxisData: imageXList.map((item) => item.subShow),
          yAxisTitle: data.currencyCode,
          series: imageLineList.map((item) => {
            const lineDropList = item.lineDropList || []
            return {
              name: item.salesPersonBy,
              type: 'line',
              data: lineDropList.map((item) => this.$num(item.totalAmountSo, 2))
            }
          })
        }

        const salesTrendCurveForYear = data.salesTrendCurveForYear || {}
        const imageLineList1 = salesTrendCurveForYear.imageLineList || []
        const imageXList1 = salesTrendCurveForYear.imageXList || []
        this.yearOptions = {
          legendData: imageLineList1.map((item) => item.salesPersonBy),
          xAxisData: imageXList1.map((item) => item.subShow),
          yAxisTitle: data.currencyCode,
          series: imageLineList1.map((item) => {
            const lineDropList = item.lineDropList || []
            return {
              name: item.salesPersonBy,
              type: 'line',
              data: lineDropList.map((item) => this.$num(item.totalAmountSo, 2))
            }
          })
        }

        this.radioChange()
      })
    },
    radioChange() {
      if (this.chartType === '0') {
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(this.monthOptions)
        })
      }
      if (this.chartType === '1') {
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(this.yearOptions)
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
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
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
        '/sales/salesPerformanceSummary/exportForSalesPerson',
        params,
        `${this.getFileNameDate('Sales Performance Trend')}.xlsx`
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
