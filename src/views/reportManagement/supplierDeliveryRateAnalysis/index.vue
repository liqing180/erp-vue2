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
        @updateSearchData="updateSearchData"
      />

      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            :loading="exportLoading"
            @click="openExport"
            v-hasPermi="['reportManagement:purchaseSummary:export']"
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
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleDblclick"
        style="cursor: pointer"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
          align="center"
          v-if="checkPermi(['reportManagement:purchaseSummary:export'])"
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
    </div>
    <supplierDeliveryRateProductAnalysis
      ref="supplierDeliveryRateProductAnalysis"
      :dateRange="queryParams.dateRange"
      :queryParamsProp="queryParams2"
      @currentIndexChange="currentIndexChange"
      @handleUpdate="navToProductDetail"
      v-else-if="currentIndex === 1"
    />
    <supplierDeliveryRateDetails
      ref="supplierDeliveryRateDetails"
      :dateRange="queryParams.dateRange"
      :queryParamsProp="queryParams3"
      @currentIndexChange="currentIndexChange"
      v-else-if="currentIndex === 2"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import supplierDeliveryRateProductAnalysis from './supplierDeliveryRateProductAnalysis'
import supplierDeliveryRateDetails from './supplierDeliveryRateDetails'

import {
  queryListForSupplier,
  querySearchList
} from '@/api/reportManagement/supplierDeliveryRateAnalysis'

export default {
  name: 'SupplierDeliveryRateAnalysis',
  dicts: ['p_purchase_order_status'],
  mixins: [pageMixin],
  components: { supplierDeliveryRateProductAnalysis, supplierDeliveryRateDetails },
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
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('PURCHASE.country'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseOrderCount',
          label: vm.$t('PURCHASE.purchaseOrderQTY'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'purchaseOrderCountForAccurate',
          label: vm.$t('PURCHASE.accurateDeliveryOrderQTY'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        // {
        //   prop: 'currency',
        //   label: vm.$t('ui.currency'),
        //   minWidth: 160,
        //   visible: true,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        // {
        //   prop: 'reallyPurchaseAmountForBasic',
        //   label: vm.$t('PURCHASE.purchaseAmount'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   padding: 50,
        //   sortable: 'custom',
        //   align: 'right'
        // },
        // {
        //   prop: 'stockInAmountForBasic',
        //   label: vm.$t('PURCHASE.depositAmount'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   padding: 50,
        //   sortable: 'custom',
        //   align: 'right'
        // },
        // {
        //   prop: 'accurateDeliveryAmountForBasic',
        //   label: vm.$t('PURCHASE.amountToBePaid'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   padding: 50,
        //   sortable: 'custom',
        //   align: 'right'
        // },
        {
          prop: 'accurateDeliveryRateShowStr',
          label: vm.$t('PURCHASE.accurateDeliveryRate'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
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
          placeholder: `${this.$t('PURCHASE.supplierNameCode')}`
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
      conditionForPOList: [],
      conditionForStockInNoList: [],
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
    },
    editAuth() {
      return this.checkPermi(['organization:role:edit'])
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
      // this.querySearchList()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
      param = this.$trimOfObj(param)
      this.loading = true
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      queryListForSupplier(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.reallyPurchaseAmountForBasic = this.$numberStr(
              item.reallyPurchaseAmountForBasic,
              2
            )
            item.stockInAmountForBasic = this.$numberStr(item.stockInAmountForBasic, 2)
            item.accurateDeliveryAmountForBasic = this.$numberStr(
              item.accurateDeliveryAmountForBasic,
              2
            )
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.reallyPurchaseAmountForBasic = this.$numberStr(
              summary.reallyPurchaseAmountForBasic,
              2
            )
            summary.stockInAmountForBasic = this.$numberStr(summary.stockInAmountForBasic, 2)
            summary.accurateDeliveryAmountForBasic = this.$numberStr(
              summary.accurateDeliveryAmountForBasic,
              2
            )

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
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const {
          // departmentList,
          // vendorList,
          // purchasePersonList,
          // receiveAddressList,
          conditionForPOList,
          conditionForStockInNoList,
          purchaseOrganizationList,
          purchasePersonList,
          countryList,
          receiveAddressList,
          currencyList,
          incotermList,
          paymentTermList,
          purchaseOrderStatusList
        } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'purchaseOrganizationIdList') {
            this.$set(x, 'selectData', purchaseOrganizationList)
          } else if (x.name === 'purchasePersonIdList') {
            this.$set(x, 'selectData', purchasePersonList)
          } else if (x.name === 'countryIdList') {
            this.$set(x, 'selectData', countryList)
          } else if (x.name === 'receiveAddressIdList') {
            this.$set(x, 'selectData', receiveAddressList)
          } else if (x.name === 'currencyIdList') {
            this.$set(x, 'selectData', currencyList)
          } else if (x.name === 'incotermIdList') {
            this.$set(x, 'selectData', incotermList)
          } else if (x.name === 'paymentTermIdList') {
            this.$set(x, 'selectData', paymentTermList)
          } else if (x.name === 'purchaseOrderStatusList') {
            this.$set(x, 'selectData', purchaseOrderStatusList)
          }
        })
        this.conditionForPOList = this.handle(conditionForPOList)
        this.conditionForStockInNoList = this.handle(conditionForStockInNoList)
        this.setFuzzyData()
      })
    },
    handle(data = []) {
      if (!data || data.length <= 0) return []
      return data.map((item) => {
        return {
          value: item,
          label: item
        }
      })
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
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      /* 第一层双击重置第二层搜索条件 */
      this.currentIndex = 1
      this.queryParams2 = {
        pageNum: 1,
        pageSize: 25,
        businessPartnerId: row.businessPartnerId
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
        this.getList()
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
      this.searchFormKey = Date.now()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      if (e.childType === 'all') {
        this.searchData[e.index].selectId = ''
        this.searchData[e.index].inputVal = ''
        this.setFuzzyData()
      } else if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].inputVal = ''
        this.setFuzzyData()
      } else {
        this.searchData[e.index].inputVal = e.value || ''
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForPO') {
            this.$set(item, 'fuzzyData', this.conditionForPOList)
          } else if (item.selectId === 'conditionForStockInNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockInNoList)
          }
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item[this.rowIdKey])
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    settingHandleCommand(command) {
      switch (command) {
        case 'active':
          this.handleChangeUsersStatus('active')
          break
        case 'inactive':
          this.handleChangeUsersStatus('inactive')
          break
        default:
          break
      }
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
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/report/supplierDeliveryRateAnalysis/exportForSupplier',
        params,
        `${this.getFileNameDate('Supplier Delivery Rate Analysis')}.xlsx`
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
