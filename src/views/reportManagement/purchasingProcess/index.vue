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
          v-hasPermi="['reportManagement:purchasingProcess:export']"
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
      max-height="600px"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['reportManagement:purchasingProcess:export'])"
      >
      </el-table-column>
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.id ? scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 : ''
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
          <template v-if="item.prop === 'purchaseOrderNo'">
            <span class="primary-link" @click="nav(scope.row, 'purchaseOrderNo')">{{
              scope.row.purchaseOrderNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'purchaseRequisiteNo'">
            <span class="primary-link" @click="nav(scope.row, 'purchaseRequisiteNo')">{{
              scope.row.purchaseRequisiteNo
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
          <template v-else-if="item.prop === 'rfqDetailStatus'">
            <div
              @mouseenter="showPop($event, scope.row, 'rfqDetailStatus')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">{{ scope.row.rfqDetailStatusStr }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'purchaseQuotationStatus'">
            <div
              @mouseenter="showPop($event, scope.row, 'purchaseQuotationStatus')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">{{ scope.row.purchaseQuotationStatusStr }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'stockInNoteNo'">
            <div
              @mouseenter="showPop($event, scope.row, 'stockInNoteNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">{{ scope.row.stockInNoteNo }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'returnedNoteNo'">
            <div
              @mouseenter="showPop($event, scope.row, 'returnedNoteNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">{{ scope.row.returnedNoteNo }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'prUom'">
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
    <!-- 申请人 -->
    <selectPicTable ref="selectPicTable" @onSuccess="updateRequiredBy" />

    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'

import { queryPurchaseProcessList, querySearchList } from '@/api/reportManagement/purchasingProcess'
import selectProductTable from './selectProductTable.vue'
import selectPicTable from './selectPicTable.vue'
import ToolTipShowListForFN from './toolTip.vue'

export default {
  name: 'PurchasingProcess',
  dicts: ['p_purchase_order_detail_status', 'p_rfq_detail_status', 'p_purchase_quotation_status'],
  mixins: [pageMixin],
  components: { selectProductTable, selectPicTable, ToolTipShowListForFN },
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
          prop: 'purchaseRequisiteNo',
          label: vm.$t('PURCHASE.purchaseRequisiteNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'prOrganizationName',
          label: vm.$t('PURCHASE.legalEntity'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'prRequiredBy',
          label: vm.$t('PURCHASE.requiredBy'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseRequisiteStatusShowStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'prDeliveryDate',
          label: vm.$t('PURCHASE.scheduledDeliveryDate'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'prQty',
          label: vm.$t('PURCHASE.qtyPR1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'prUom',
          label: vm.$t('PURCHASE.uomPR'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'rfqDetailStatus',
          propBy: 'rfqDetailStatusStr',
          label: vm.$t('PURCHASE.statusRFQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inquiryClerkBy',
          label: vm.$t('PURCHASE.inquiryClerk'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseQuotationStatus',
          propBy: 'purchaseQuotationStatusStr',
          label: vm.$t('PURCHASE.statusPQ'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'quoterBy',
          label: vm.$t('PURCHASE.quoter'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseTime',
          label: vm.$t('PURCHASE.purchaseDate'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.purchaseAmount'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true,
          padding: 50,
          align: 'right'
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
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiptTime',
          label: vm.$t('PURCHASE.receiptTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiptQtyForBasic',
          label: vm.$t('PURCHASE.qtyAck'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'receiptAmountForBasic',
          label: vm.$t('PURCHASE.signedAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'rejectedQtyForBasic',
          label: vm.$t('PURCHASE.rejectedQty'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'rejectedAmountForBasic',
          label: vm.$t('PURCHASE.rejectedAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'stockInNoteNo',
          label: vm.$t('PURCHASE.stockInNo'),
          minWidth: 160,
          visible: true,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'stockInTime',
          label: vm.$t('PURCHASE.inboundTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'stockInQty',
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
          prop: 'stockInAmount',
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
          prop: 'returnedNoteNo',
          label: vm.$t('PURCHASE.goodsReturnNote'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PURCHASE.returnedQty'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
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
        pageSize: 25
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch')}`,
          type: 'InputEle'
        },
        {
          name: 'conditionForPR',
          label: vm.$t('PURCHASE.purchaseRequisiteNo'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'prOrganizationIdList',
          label: vm.$t('PURCHASE.legalEntity'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'prOrganizationId',
          selectLabel: 'prOrganizationName',
          selectData: []
        },
        {
          name: 'prRequiredIdList',
          label: vm.$t('PURCHASE.requiredBy'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'prRequiredId',
          selectLabel: 'prRequiredBy',
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
          name: 'productIdList',
          label: vm.$t('PURCHASE.productName'),
          // type: 'SelectInput',
          type: 'MultipleSelectEle',
          width: '200px',
          openDialogSelect: true,
          callback: this.productNameOpen,
          selectList: [],
          selectValue: 'productId',
          selectLabel: 'productName'
        },
        {
          name: 'purchaseRequisiteStatusList',
          label: vm.$t('PURCHASE.purchaseRequisiteStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
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
          name: 'dateRange1',
          label: vm.$t('PURCHASE.scheduledDeliveryDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDatePrDeliveryDate',
          endDate: 'endDatePrDeliveryDate'
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
      refDetailStatusData: [],
      pqStatusData: []
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
    this.getDict()
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
      this.$set(this.queryParams, 'productIdList', [])
      this.searchFormKey = Date.now()
    },
    getDict() {
      this.MyDictDataClass.getDictFn('p_rfq_detail_status').then((res) => {
        this.refDetailStatusData = res || []
      })
      this.MyDictDataClass.getDictFn('p_purchase_quotation_status').then((res) => {
        this.pqStatusData = res || []
      })
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
      if (param.orderByColumn === 'purchaseRequisiteStatusShowStr') {
        param.orderByColumn = 'purchaseRequisiteStatus'
      }
      param = this.$trimOfObj(param)
      this.loading = true
      queryPurchaseProcessList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.prQty = this.$numberStr(item.prQty, this.$getDecNum(item.decimalNum))
            item.purchaseQty = this.$numberStr(item.purchaseQty, this.$getDecNum(item.decimalNum))
            item.receiptQtyForBasic = this.$numberStr(
              item.receiptQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.stockInQty = this.$numberStr(item.stockInQty, this.$getDecNum(item.decimalNum))
            item.qcFailedQty = this.$numberStr(item.qcFailedQty, this.$getDecNum(item.decimalNum))
            item.returnedQty = this.$numberStr(item.returnedQty, this.$getDecNum(item.decimalNum))
            item.rejectedQtyForBasic = this.$numberStr(
              item.rejectedQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )

            item.purchaseAmount = this.$numberStr(item.purchaseAmount, 2)
            item.receiptAmountForBasic = this.$numberStr(item.receiptAmountForBasic, 2)
            item.rejectedAmountForBasic = this.$numberStr(item.rejectedAmountForBasic, 2)
            item.stockInAmount = this.$numberStr(item.stockInAmount, 2)
            item.qcFailedAmount = this.$numberStr(item.qcFailedAmount, 2)
            item.returnedAmount = this.$numberStr(item.returnedAmount, 2)
            item.purchaseTime = this.parseTime(item.purchaseTime, this.fmtForYmdhms)
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.stockInTime = this.parseTime(item.stockInTime, this.fmtForYmdhms)
            item.receiptTime = this.parseTime(item.receiptTime, this.fmtForYmdhms)
            item.prDeliveryDate = this.parseTime(item.prDeliveryDate, this.fmtForYmd)
            item.committedDate = this.parseTime(item.committedDate, this.fmtForYmd)
            item.rfqDetailStatusStr = this.selectDictLabel(
              this.dict.type.p_rfq_detail_status,
              item.rfqDetailStatus
            )
            item.purchaseQuotationStatusStr = this.selectDictLabel(
              this.dict.type.p_purchase_quotation_status,
              item.purchaseQuotationStatus
            )
          })
          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.purchaseAmount = this.$numberStr(summary.purchaseAmount, 2)
            summary.receiptAmountForBasic = this.$numberStr(summary.receiptAmountForBasic, 2)
            summary.stockInAmount = this.$numberStr(summary.stockInAmount, 2)
            summary.qcFailedAmount = this.$numberStr(summary.qcFailedAmount, 2)
            summary.returnedAmount = this.$numberStr(summary.returnedAmount, 2)
            summary.rejectedAmountForBasic = this.$numberStr(summary.rejectedAmountForBasic, 2)

            summary.prQty = this.$numberStr(summary.prQty, 3)
            summary.purchaseQty = this.$numberStr(summary.purchaseQty, 3)
            summary.receiptQtyForBasic = this.$numberStr(summary.receiptQtyForBasic, 3)
            summary.stockInQty = this.$numberStr(summary.stockInQty, 3)
            summary.qcFailedQty = this.$numberStr(summary.qcFailedQty, 3)
            summary.returnedQty = this.$numberStr(summary.returnedQty, 3)
            summary.rejectedQtyForBasic = this.$numberStr(summary.rejectedQtyForBasic, 3)
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
        item.rfqDetailStatusStr = this.selectDictLabel(
          this.dict.type.p_rfq_detail_status,
          item.rfqDetailStatus
        )
        item.purchaseQuotationStatusStr = this.selectDictLabel(
          this.dict.type.p_purchase_quotation_status,
          item.purchaseQuotationStatus
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
          prRequiredList,
          purchasePersonList,
          receiveAddressList,
          prOrganizationList,
          purchaseRequisiteStatusList,
          ivtProductList
        } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'purchasePersonIdList') {
            this.$set(x, 'selectData', purchasePersonList)
          } else if (x.name === 'receiveAddressIdList') {
            this.$set(x, 'selectData', receiveAddressList)
          } else if (x.name === 'prRequiredIdList') {
            this.$set(x, 'selectData', prRequiredList)
          } else if (x.name === 'prOrganizationIdList') {
            this.$set(x, 'selectData', prOrganizationList)
          } else if (x.name === 'purchaseRequisiteStatusList') {
            this.$set(x, 'selectData', purchaseRequisiteStatusList)
          } else if (x.name === 'productIdList') {
            this.$set(x, 'selectData', ivtProductList)
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
    dictLabel(data, status) {
      const arr = data.filter((x) => x.dictValue === status)
      if (arr && arr.length > 0) {
        return arr[0].dictLabel
      }
      return ''
    },
    showPop(e, row, type) {
      const { rfqMsgList, pqMsgList, stockInMsgList, returnedNoteNo, returnedMsg } = row
      let list = []
      let params = {}
      if (type === 'rfqDetailStatus') {
        list = rfqMsgList
        list.forEach((x) => {
          x.statusStr = this.dictLabel(this.refDetailStatusData, x.rfqDetailStatus)
        })
        params = {
          popoverTitle: '',
          itemClass: '',
          list,
          type: 'rfqDetailStatus'
        }
      } else if (type === 'purchaseQuotationStatus') {
        list = pqMsgList
        list.forEach((x) => {
          x.statusStr = this.dictLabel(this.pqStatusData, x.purchaseQuotationStatus)
        })
        params = {
          popoverTitle: '',
          itemClass: '',
          list,
          type: 'purchaseQuotationStatus'
        }
      } else if (type === 'stockInNoteNo') {
        list = stockInMsgList
        list.forEach(
          (x) =>
            (x.customTitle =
              x.stockInNoteNo + '：' + this.parseTime(x.createdTime, this.fmtForYmdhms))
        )
        params = {
          popoverTitle: '',
          labelKey0: 'customTitle',
          itemClass: '',
          single: true,
          list
        }
      } else if (type === 'returnedNoteNo') {
        if (returnedNoteNo) {
          list = JSON.parse(returnedMsg)
          params = {
            popoverTitle: '',
            labelKey0: 'purchaseReturnNo',
            itemClass: '',
            single: true,
            list
          }
        }
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    requiredByOpen(type) {
      if (type === 'clear') {
        this.$set(this.searchData[3], 'selectList', [])
        this.$set(this.queryParams, 'requiredByIdList', [])
        this.getList()
        return
      }
      this.$refs.selectPicTable.handleOpen()
    },
    updateRequiredBy(list) {
      const rows = JSON.parse(JSON.stringify(list))
      this.$set(this.searchData[3], 'selectList', rows)
      const ids = rows.map((x) => x.userId)
      this.$set(this.queryParams, 'requiredByIdList', ids)
      this.getList()
    },
    productNameOpen(type) {
      console.log(type, '=============862')
      if (type === 'clear') {
        // this.$set(this.searchData[5], 'selectList', [])
        this.$set(this.queryParams, 'productIdList', [])
        this.getList()
        return
      }
      // this.$refs.selectProductTable.handleAdd(this.searchData[5].selectList)
      this.$refs.selectProductTable.handleAdd(this.queryParams.productIdList)
    },
    updateTable(ids = []) {
      // const rows = JSON.parse(JSON.stringify(list))
      // this.$set(this.searchData[5], 'selectList', rows)
      // const ids = rows.map((x) => x.productId)
      // this.$set(this.queryParams, 'productIdList', ids)
      this.$set(this.queryParams, 'productIdList', ids)
      this.getList()
    },

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      if (!row.id) return false
      return true // 不禁用
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (!row.purchaseRequisiteId) return
      this.$router.push({
        path: '/purchaseManagement/viewPurchaseRequisition',
        query: {
          id: row.purchaseRequisiteId,
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
        console.log('object')
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseOrder',
          query: {
            id: row.purchaseOrderId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        if (row.isAdhocEntry === '1') {
          this.$router.push({
            path: '/productManagement/viewProductInfo',
            query: {
              id: row.productId,
              timeId: Date.now()
            }
          })
        } else {
          this.$router.push({
            path: '/productManagement/viewExtendedProductInfo',
            query: {
              id: row.productId,
              timeId: Date.now()
            }
          })
        }
      } else if (type === 'purchaseRequisiteNo') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseRequisition',
          query: {
            id: row.purchaseRequisiteId,
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
      this.ids = selection.map((item) => item.id)
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
        params.exportIdList = vm.tableList.map((item) => item.id)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/report/purchaseProcess/exportPurchaseProcessList',
        params,
        `${this.getFileNameDate('Procurement Execution Report')}.xlsx`
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
