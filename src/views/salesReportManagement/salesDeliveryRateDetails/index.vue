<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      @updateSearchData="updateSearchData"
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
          v-hasPermi="['salesReportManagement:salesDeliveryRateDetails:export']"
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
        v-if="checkPermi(['salesReportManagement:salesDeliveryRateDetails:export'])"
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
          <template v-if="item.prop === 'stockInNoteNo'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">{{ scope.row.stockInNoteNo }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'salesQtyForBasic'">
            <template>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'stockOutQtyForBasic'">
            <template>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'accurateDeliveryQtyForBasic'">
            <template>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'basicUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
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
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import {
  queryListForCustomerProductOrder,
  querySearchListForCustomerProductOrder
} from '@/api/salesReportManagement/salesDeliveryRateAnalysis'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'

import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'SalesDeliveryRateDetails',
  dicts: ['s_sales_order_detail_status'],
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
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
      rowIdKey: 'mainId',
      columns: [
        {
          prop: 'businessPartnerNo',
          label: vm.$t('SALES.customerCode'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesOrderNo',
          label: vm.$t('SALES.salesOrderNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'deliveryOrderNo',
          label: vm.$t('SALES.deliveryOrderNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'salesPersonBy',
          label: vm.$t('SALES.salesPerson'),
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
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'basicUom',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'salesQtyForBasic',
          label: vm.$t('SALES.salesQTY'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 60,
          tooltip: true
        },
        {
          prop: 'salesAmountForBasic',
          label: vm.$t('SALES.salesAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'stockOutQtyForBasic',
          label: vm.$t('SALES.outboundQTY'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 60
        },
        {
          prop: 'stockOutAmountForBasic',
          label: vm.$t('SALES.outboundAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'accurateDeliveryQtyForBasic',
          label: vm.$t('SALES.accurateDeliveryQTY'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 60,
          sortable: 'custom'
        },
        {
          prop: 'accurateDeliveryAmountForBasic',
          label: vm.$t('SALES.amountToBePaid'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },

        {
          prop: 'deliveryDate',
          label: vm.$t('SALES.expectedDeliveryDate'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        },
        {
          prop: 'ackTime',
          label: vm.$t('SALES.receiptTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        },

        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        },
        {
          prop: 'timeDelayed',
          label: vm.$t('SALES.timeDelayed'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        businessGroupName: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSalesOrderNo' },
            { label: this.$t('SALES.deliveryOrderNo'), value: 'conditionForDeliveryOrderNo' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        },
        {
          name: 'businessPartnerIdForSearchList',
          label: vm.$t('INVENTORY.customerName'),
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
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'dateRange2',
          label: vm.$t('SALES.receiptTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateReceiptTime',
          endDate: 'endDateReceiptTime'
        }
      ]
    }
  },
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
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateReceiptTime', startTimer)
      this.$set(this.queryParams, 'endDateReceiptTime', end)
      this.queryParams.selectId = 'conditionForSalesOrderNo'

      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForSalesOrderNo'
          item.inputVal = ''
        }
      })
    },
    getList(query) {
      this.querySearchList()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
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
      queryListForCustomerProductOrder(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
            item.ackTime = this.parseTime(item.ackTime, this.fmtForYmdhms)
            item.salesAmountForBasic = this.$numberStr(item.salesAmountForBasic, 2)
            item.stockOutAmountForBasic = this.$numberStr(item.stockOutAmountForBasic, 2)
            item.accurateDeliveryAmountForBasic = this.$numberStr(
              item.accurateDeliveryAmountForBasic,
              2
            )
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.salesAmountForBasic = this.$numberStr(summary.salesAmountForBasic, 2)
            summary.stockOutAmountForBasic = this.$numberStr(summary.stockOutAmountForBasic, 2)
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
    showPop(e, row) {
      const list = row.stockInMsgList || []
      list.forEach(
        (x) =>
          (x.customTitle =
            x.stockInNoteNo + '：' + this.parseTime(x.createdTime, this.fmtForYmdhms))
      )
      const params = {
        popoverTitle: '',
        labelKey: 'customTitle',
        itemClass: '',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },

    // 搜索下拉值
    querySearchList() {
      querySearchListForCustomerProductOrder({}).then((res) => {
        const data = res.data || {}
        const businessPartnerList = data.businessPartnerList || []
        const countryList = data.countryList || []
        const salesPersonList = data.salesPersonList || []
        this.conditionForDeliveryOrderNoList = (data.conditionForDeliveryOrderNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.conditionForSOList = (data.conditionForSalesOrderNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        this.searchData.forEach((x) => {
          if (x.name === 'businessPartnerIdForSearchList') {
            this.$set(x, 'selectData', businessPartnerList)
          } else if (x.name === 'countryIdList') {
            this.$set(x, 'selectData', countryList)
          } else if (x.name === 'salesPersonIdList') {
            this.$set(x, 'selectData', salesPersonList)
          }
        })
        this.setFuzzyData()
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
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
          this.setFuzzyData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
          this.setFuzzyData()
        } else {
          item.inputVal = e.value || ''
        }
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForSalesOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForSOList)
          } else if (item.selectId === 'conditionForDeliveryOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForDeliveryOrderNoList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.$refs.tables.clearSort()
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
      let params = { ...this.queryParams }
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
        '/sales/report/salesDeliveryRateAnalysis/exportForCustomerProductOrder',
        params,
        `${this.getFileNameDate('Sales Delivery Rate Details')}.xlsx`
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
