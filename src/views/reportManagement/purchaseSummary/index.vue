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
      @row-dblclick="handleDblclick"
      :max-height="tableMaxHeight"
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
            scope.row.purchaseOrderId
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <el-switch
            v-else-if="item.prop === 'isDefault'"
            v-model="scope.row.isDefault"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'purchaseOrderNo'">
            <span class="primary-link" @click="nav(scope.row, 'purchaseOrderNo')">{{
              scope.row.purchaseOrderNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <span class="primary-link" @click="nav(scope.row, 'businessPartnerName')">{{
              scope.row.businessPartnerName
            }}</span>
          </template>
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <span class="primary-link" @click="nav(scope.row, 'documentNo')">{{
              scope.row.documentNo
            }}</span>
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

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />

    <!-- 选供应商 -->
    <selectSupplierTable ref="selectSupplierTable" @onSuccess="updateSupplier" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'

import { queryPurchaseSummaryList, querySearchList } from '@/api/reportManagement/purchaseSummary'
import selectSupplierTable from './selectSupplierTable.vue'

export default {
  name: 'PurchaseSummary',
  dicts: ['p_purchase_order_status'],
  mixins: [pageMixin],
  components: { selectSupplierTable },
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
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseOrderStatus',
          propBy: 'purchaseOrderStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseOrganizationName',
          label: vm.$t('PURCHASE.purchasingOrganization'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'purchasePersonBy',
          label: vm.$t('PURCHASE.purchasePerson'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
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
          label: vm.$t('PURCHASE.country'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'incotermAbbreviation',
          label: vm.$t('PURCHASE.incoterm'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.warehouse1'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productQty',
          label: vm.$t('PURCHASE.qty1'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productStockInQty',
          label: vm.$t('PURCHASE.stockInQty'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'qcFailedQty',
          label: vm.$t('PURCHASE.iqcBadNumber'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productPendStockInQty',
          label: vm.$t('PURCHASE.pengStorageQty'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'depositAmount',
          label: vm.$t('PURCHASE.depositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'qcFailedAmount',
          label: vm.$t('PURCHASE.iqcBadMoney'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'amountNotStored',
          label: vm.$t('PURCHASE.amountNotStored'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedTime',
          label: vm.$t('ui.approvedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }
      ],
      // 查询参数
      queryParams: {
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
          name: 'conditionForPO',
          label: vm.$t('PURCHASE.purchaseOrderNo'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'purchaseOrganizationIdList',
          label: vm.$t('PURCHASE.purchasingOrganization'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'purchaseOrganizationId',
          selectLabel: 'purchaseOrganizationName',
          selectData: []
        },
        {
          name: 'purchasePersonIdList',
          label: vm.$t('PURCHASE.purchasePerson'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'purchasePersonId',
          selectLabel: 'purchasePersonBy',
          selectData: []
        },
        {
          name: 'purchaseOrderStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: []
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('PURCHASE.supplierName'),
          type: 'MultipleSelectEle',
          width: '200px',
          openDialogSelect: true,
          callback: this.supplierNameOpen,
          selectList: [],
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName'
        },
        {
          name: 'countryIdList',
          label: vm.$t('ui.country'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'countryId',
          selectLabel: 'country',
          selectData: []
        },
        {
          name: 'receiveAddressIdList',
          label: vm.$t('PURCHASE.warehouse1'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        /* {
          name: 'currencyIdList',
          label: vm.$t('ui.currency'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'currencyId',
          selectLabel: 'currency',
          selectData: []
        }, */
        {
          name: 'incotermIdList',
          label: vm.$t('PURCHASE.incoterm'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'incotermId',
          selectLabel: 'incotermAbbreviation',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
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
      conditionForPOList: [],
      conditionForStockInNoList: []
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
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      this.$set(this.searchData[5], 'selectList', [])
      this.$set(this.queryParams, 'businessPartnerIdList', [])
      this.searchFormKey = Date.now()
    },
    getList() {
      this.querySearchList()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
      param = this.$trimOfObj(param)
      this.loading = true
      queryPurchaseSummaryList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)

            item.productQty = this.$numberStr(item.productQty, this.$getDecNum(item.decimalNum))
            item.productStockInQty = this.$numberStr(
              item.productStockInQty,
              this.$getDecNum(item.decimalNum)
            )
            item.productPendStockInQty = this.$numberStr(
              item.productPendStockInQty,
              this.$getDecNum(item.decimalNum)
            )
            item.qcFailedQty = this.$numberStr(item.qcFailedQty, this.$getDecNum(item.decimalNum))
            item.qcFailedAmount = this.$numberStr(item.qcFailedAmount, 2)
            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.depositAmount = this.$numberStr(item.depositAmount, 2)
            item.amountNotStored = this.$numberStr(item.amountNotStored, 2)
            item.purchaseOrderStatusStr = this.selectDictLabel(
              this.dict.type.p_purchase_order_status,
              item.purchaseOrderStatus
            )
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.purchaseAmount = this.$numberStr(summary.purchaseAmount, 2)
            summary.depositAmount = this.$numberStr(summary.depositAmount, 2)
            summary.amountNotStored = this.$numberStr(summary.amountNotStored, 2)
            summary.productQty = this.$numberStr(summary.productQty, 3)
            summary.productStockInQty = this.$numberStr(summary.productStockInQty, 3)
            summary.productPendStockInQty = this.$numberStr(summary.productPendStockInQty, 3)
            summary.qcFailedQty = this.$numberStr(summary.qcFailedQty, 3)
            summary.qcFailedAmount = this.$numberStr(summary.qcFailedAmount, 2)
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
    onDictReady() {
      this.tableList.forEach((item) => {
        item.purchaseOrderStatusStr = this.selectDictLabel(
          this.dict.type.p_purchase_order_status,
          item.purchaseOrderStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
          purchaseOrderStatusList,
          businessPartnerList
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
          } else if (x.name === 'businessPartnerIdList') {
            this.$set(x, 'selectData', businessPartnerList)
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
    supplierNameOpen(type) {
      console.log(type, '==================621')
      if (type === 'clear') {
        // this.$set(this.searchData[5], 'selectList', [])
        this.$set(this.queryParams, 'businessPartnerIdList', [])
        this.getList()
        return
      }
      // this.$refs.selectSupplierTable.handleOpen(this.searchData[5].selectList)
      this.$refs.selectSupplierTable.handleOpen(this.queryParams.businessPartnerIdList)
    },
    updateSupplier(ids = []) {
      // const rows = JSON.parse(JSON.stringify(list))
      // this.$set(this.searchData[5], 'selectList', rows)
      // const ids = rows.map((x) => x.businessPartnerId)
      this.$set(this.queryParams, 'businessPartnerIdList', ids)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.purchaseOrderId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      if (!row.purchaseOrderId) return false
      return true // 不禁用
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (!row.purchaseOrderId) return
      this.$router.push({
        path: '/purchaseManagement/viewPurchaseOrder',
        query: {
          id: row.purchaseOrderId,
          timeId: Date.now()
        }
      })
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'stockCertificateNo') {
        this.$router.push({
          path: '/inventoryManagement/viewStockCertificate',
          query: {
            id: row.stockCertificateId,
            timeId: Date.now()
          }
        })
      } else if (type === 'purchaseOrderNo') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseOrder',
          query: {
            id: row.purchaseOrderId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
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
      this.ids = selection.map((item) => item.purchaseOrderId)
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
        params.exportIdList = vm.tableList.map((item) => item.purchaseOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/report/purchaseSummary/exportPurchaseSummaryList',
        params,
        `${this.getFileNameDate('Purchase Order List')}.xlsx`
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
