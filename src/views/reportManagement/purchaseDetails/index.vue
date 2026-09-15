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
          v-hasPermi="['reportManagement:purchaseDetails:export']"
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
        v-if="checkPermi(['reportManagement:purchaseDetails:export'])"
      >
      </el-table-column>
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
          <template v-if="item.prop === 'stockInNoteNo'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">{{ scope.row.stockInNoteNo }}</div>
            </div>
          </template>
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

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />

    <!-- 选产品 -->
    <selectProductTable ref="selectProductTable" @onSuccess="updateTable" />
    <!-- 选供应商 -->
    <selectSupplierTable ref="selectSupplierTable" @onSuccess="updateSupplier" />

    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import { queryPurchaseDetailsList, querySearchList } from '@/api/reportManagement/purchaseDetails'
import selectProductTable from './selectProductTable.vue'
import selectSupplierTable from './selectSupplierTable.vue'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
export default {
  name: 'PurchasedProductAnalysis',
  dicts: ['p_purchase_order_detail_status'],
  mixins: [pageMixin],
  components: { selectProductTable, selectSupplierTable, ToolTipShowListForFN },
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
          prop: 'abbreviation',
          label: vm.$t('ui.abbreviation'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrderNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchasePersonBy',
          label: vm.$t('PURCHASE.purchasePerson'),
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
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.warehouse'),
          minWidth: 160,
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
          prop: 'purchaseOrderDetailStatus',
          propBy: 'purchaseOrderDetailStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'basicUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'basicQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockInQtyForBasic',
          label: vm.$t('PURCHASE.stockInQty'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseAmountForBasic',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          // sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'stockInAmountForBasic',
          label: vm.$t('PURCHASE.depositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          // sortable: 'custom',
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
          // sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'stockInNoteNo',
          label: vm.$t('PURCHASE.stockInNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'stockInTime',
          label: vm.$t('PURCHASE.inboundTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        },
        {
          prop: 'committedDate',
          label: vm.$t('PURCHASE.committedDate'),
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
        pageSize: 25,
        dateRange: []
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.PONo'), value: 'conditionForPurchaseOrderNo' },
            { label: this.$t('PURCHASE.stockInNo'), value: 'conditionForStockInNo' }
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
          name: 'purchaseOrderDetailStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'p_purchase_order_detail_status',
          selectData: []
        },
        {
          name: 'businessPartnerNames',
          label: vm.$t('PURCHASE.supplierName'),
          type: 'SelectInput',
          width: '200px',
          callback: this.supplierNameOpen,
          selectList: [],
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName'
        },
        {
          name: 'productIdList',
          label: vm.$t('PURCHASE.productName'),
          type: 'SelectInput',
          width: '200px',
          callback: this.productNameOpen,
          selectList: [],
          selectValue: 'productId',
          selectLabel: 'productName'
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
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      conditionForPOList: [],
      conditionForStockInNoList: [],
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
      rowIdKey: 'purchaseOrderDetailId'
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

      this.searchData[1].selectId = 'conditionForPurchaseOrderNo'
      this.queryParams.selectId = 'conditionForPurchaseOrderNo'
      this.searchData[1].inputVal = ''
      this.$set(this.searchData[4], 'selectList', [])
      this.$set(this.searchData[5], 'selectList', [])

      this.searchFormKey = Date.now()
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
      queryPurchaseDetailsList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.basicQty = this.$numberStr(item.basicQty, this.$getDecNum(item.decimalNum))
            item.stockInQtyForBasic = this.$numberStr(
              item.stockInQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )

            item.purchaseAmountForBasic = this.$numberStr(item.purchaseAmountForBasic, 2)
            item.stockInAmountForBasic = this.$numberStr(item.stockInAmountForBasic, 2)
            item.purchaseOrderDetailStatusStr = this.selectDictLabel(
              this.dict.type.p_purchase_order_detail_status,
              item.purchaseOrderDetailStatus
            )
            item.stockInTime = this.parseTime(item.stockInTime, this.fmtForYmdhms)
            item.committedDate = this.parseTime(item.committedDate, this.fmtForYmd)
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
            item.qcFailedQtyForBasic = this.$numberStr(
              item.qcFailedQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.qcFailedAmountForBasic = this.$numberStr(item.qcFailedAmountForBasic, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.purchaseAmountForBasic = this.$numberStr(summary.purchaseAmountForBasic, 2)
            summary.stockInAmountForBasic = this.$numberStr(summary.stockInAmountForBasic, 2)
            summary.basicQty = this.$numberStr(summary.basicQty, 3)
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
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.purchaseOrderDetailStatusStr = this.selectDictLabel(
          this.dict.type.p_purchase_order_detail_status,
          item.purchaseOrderDetailStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const {
          purchasePersonList,
          receiveAddressList,
          conditionForPOList,
          conditionForStockInNoList,
          countryList
        } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'purchasePersonIdList') {
            this.$set(x, 'selectData', purchasePersonList)
          } else if (x.name === 'receiveAddressIdList') {
            this.$set(x, 'selectData', receiveAddressList)
          } else if (x.name === 'countryIdList') {
            this.$set(x, 'selectData', countryList)
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
    supplierNameOpen(type) {
      const searchItem = this.searchData.find((item) => item.name === 'businessPartnerNames')
      if (type === 'clear') {
        this.$set(searchItem, 'selectList', [])
        this.$set(this.queryParams, 'businessPartnerIdList', [])
        this.getList()
        return
      }
      this.$refs.selectSupplierTable.handleOpen(searchItem.selectList)
    },
    updateSupplier(list) {
      const searchItem = this.searchData.find((item) => item.name === 'businessPartnerNames')
      const rows = JSON.parse(JSON.stringify(list))
      this.$set(searchItem, 'selectList', rows)
      const ids = rows.map((x) => x.businessPartnerId)
      this.$set(this.queryParams, 'businessPartnerIdList', ids)
      this.getList()
    },
    productNameOpen(type) {
      const searchItem = this.searchData.find((item) => item.name === 'productIdList')
      if (type === 'clear') {
        this.$set(searchItem, 'selectList', [])
        this.$set(this.queryParams, 'productIdList', [])
        this.getList()
        return
      }
      this.$refs.selectProductTable.handleAdd(searchItem.selectList)
    },
    updateTable(list) {
      const searchItem = this.searchData.find((item) => item.name === 'productIdList')
      const rows = JSON.parse(JSON.stringify(list))
      this.$set(searchItem, 'selectList', rows)
      const ids = rows.map((x) => x.productId)
      this.$set(this.queryParams, 'productIdList', ids)
      this.getList()
    },

    handleUpdate(row, column) {
      // if (column && column.type === 'selection') {
      //   return
      // }
      /* 第一层双击重置第二层搜索条件 */
      // this.currentIndex = 1
      // this.queryParams2 = {
      //   pageNum: 1,
      //   pageSize: 25,
      //   businessPartnerId: row.businessPartnerId
      // }
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
        this.$refs.productAnalysis && this.$refs.productAnalysis.getList()
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
      return true // 不禁用
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
          if (item.selectId === 'conditionForPurchaseOrderNo') {
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
        '/purchase/report/purchaseDetails/exportPurchaseDetailsList',
        params,
        `${this.getFileNameDate('Purchase Details')}.xlsx`
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
