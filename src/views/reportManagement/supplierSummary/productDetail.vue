<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div class="form-card app-container">
        <search-form
          ref="searchForm"
          v-model="queryParams"
          :searchData="searchData"
          :handleQuery="handleSearchForm"
          :resetQuery="resetSearchForm"
          :showCustom="false"
          :topShowCount="0"
          :isBtn="true"
          :isShowTopRow="false"
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
              v-hasPermi="['reportManagement:purchaseDetails:export']"
              >{{ $t('uiBtn.export') }}</el-button
            >
          </el-col>
          <right-toolbar
            :saveKey="saveKey"
            savePath="productDetail"
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
          max-height="600px"
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
                <div
                  @mouseenter="showPop($event, scope.row)"
                  @mouseleave="hidePop($event, scope.row)"
                >
                  <div class="ellipsis-text">{{ scope.row.stockInNoteNo }}</div>
                </div>
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
      </div>
    </template>

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </FormPageLayout>
</template>

<script>
import {
  queryListForSupplierProductOrder,
  querySearchListForSupplierProductOrder
} from '@/api/reportManagement/supplierSummary'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'

import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'ProductDetail',
  dicts: ['p_purchase_order_detail_status'],
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
          prop: 'reallyPurchaseQtyForBasic',
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
          prop: 'submittedTime',
          label: vm.$t('ui.createdTime'),
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
          name: 'conditionForPurchaseOrderNo',
          label: this.$t('PURCHASE.purchaseOrderNo'),
          type: 'AutocompleteEle',
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
          name: 'receiveAddressIdList',
          label: vm.$t('PURCHASE.warehouse1'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'receiveAddressId',
          selectLabel: 'receiveAddressName',
          selectData: []
        }
      ]
    }
  },
  props: {
    queryParamsProp: {
      type: Object,
      default() {
        return {}
      }
    },
    dateRange: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    queryParamsProp: {
      immediate: true,
      handler: function (newVal) {
        this.queryParams = newVal || {}
      }
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
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    getList(query) {
      this.querySearchList()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      if (this.dateRange.length === 2) {
        param.startDateSubmittedTime = this.dateRange[0]
        param.endDateSubmittedTime = this.appointTime(this.dateRange[1], '23:59:59')
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      queryListForSupplierProductOrder(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.submittedTime = this.parseTime(item.submittedTime, this.fmtForYmdhms)

            item.reallyPurchaseQtyForBasic = this.$numberStr(
              item.reallyPurchaseQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.stockInQtyForBasic = this.$numberStr(
              item.stockInQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )

            item.reallyPurchaseAmountForBasic = this.$numberStr(
              item.reallyPurchaseAmountForBasic,
              2
            )
            item.stockInAmountForBasic = this.$numberStr(item.stockInAmountForBasic, 2)
            item.purchaseOrderDetailStatusStr = this.selectDictLabel(
              this.dict.type.p_purchase_order_detail_status,
              item.purchaseOrderDetailStatus
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
    // 取消按钮
    back() {
      this.$emit('currentIndexChange', 1)
    },
    // 搜索下拉值
    querySearchList() {
      const { businessPartnerId, productId } = this.queryParams
      const param = {
        businessPartnerId,
        productId
      }
      if (this.dateRange.length === 2) {
        param.startDateSubmittedTime = this.dateRange[0]
        param.endDateSubmittedTime = this.appointTime(this.dateRange[1], '23:59:59')
      }
      querySearchListForSupplierProductOrder(param).then((res) => {
        let { purchasePersonList, receiveAddressList, conditionForPurchaseOrderNoList } = res.data
        conditionForPurchaseOrderNoList = (conditionForPurchaseOrderNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData.forEach((x) => {
          if (x.name === 'purchasePersonIdList') {
            this.$set(x, 'selectData', purchasePersonList)
          } else if (x.name === 'receiveAddressIdList') {
            this.$set(x, 'selectData', receiveAddressList)
          } else if (x.name === 'conditionForPurchaseOrderNo') {
            this.$set(x, 'fuzzyData', conditionForPurchaseOrderNoList)
          }
        })
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
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize, businessGroupName } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, businessGroupName }
      this.searchFormKey = Date.now()
      this.$refs.tables && this.$refs.tables.clearSort()
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
      params = this.$trimOfObj(params)
      if (this.dateRange.length === 2) {
        params.startDateSubmittedTime = this.dateRange[0]
        params.endDateSubmittedTime = this.appointTime(this.dateRange[1], '23:59:59')
      }
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
        '/purchase/report/supplierSummary/exportForSupplierProductOrder',
        params,
        `${this.getFileNameDate('Product Details')}.xlsx`
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
