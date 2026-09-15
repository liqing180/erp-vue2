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
          :topShowCount="3"
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
              v-hasPermi="['reportManagement:supplierDeliveryRateDetails:export']"
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
          style="cursor: pointer"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectable"
            align="center"
            v-if="checkPermi(['reportManagement:supplierDeliveryRateDetails:export'])"
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
              <template v-if="item.prop === 'basicUom'">
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
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'

import {
  queryListForSupplierProductOrder,
  querySearchListForSupplierProductOrder
} from '@/api/reportManagement/supplierDeliveryRateAnalysis'

export default {
  name: 'SupplierDeliveryRateProductAnalysis',
  dicts: ['p_purchase_order_status'],
  mixins: [pageMixin],
  components: {},
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
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
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
          label: vm.$t('PURCHASE.country'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
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
          prop: 'purchasePersonBy',
          label: vm.$t('PURCHASE.purchasePerson'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
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
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'basicUom',
          label: vm.$t('PURCHASE.uom'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
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
          prop: 'reallyPurchaseAmountForBasic',
          label: vm.$t('PURCHASE.purchaseAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'stockInQtyForBasic',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockInAmountForBasic',
          label: vm.$t('PURCHASE.depositAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'accurateDeliveryQtyForBasic',
          label: vm.$t('PURCHASE.accurateDeliveryQTY'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'accurateDeliveryAmountForBasic',
          label: vm.$t('PURCHASE.amountToBePaid'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'goodsReceiptNoteNo',
          label: vm.$t('PURCHASE.goodsReceiptNoteNo'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'submittedTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
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
          prop: 'timeDelayed',
          label: vm.$t('PURCHASE.timeDelayed'),
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
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('PURCHASE.purchaseOrderNo'), value: 'conditionForPurchaseOrderNo' },
            {
              label: this.$t('PURCHASE.goodsReceiptNoteNo'),
              value: 'conditionForGoodsReceiptNoteNo'
            }
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
      conditionForPurchaseOrderNoList: [],
      conditionForGoodsReceiptNoteNo: [],
      rowIdKey: 'mainId'
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
      this.queryParams.selectId = 'conditionForPurchaseOrderNo'
      this.searchFormKey = Date.now()
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForPurchaseOrderNo'
          item.inputVal = ''
        }
      })
    },
    getList() {
      this.querySearchListForSupplierProductOrder()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
      }
      if (this.dateRange.length === 2) {
        param.startDateSubmittedTime = this.dateRange[0]
        param.endDateSubmittedTime = this.appointTime(this.dateRange[1], '23:59:59')
      }
      param = this.$trimOfObj(param)
      this.loading = true
      queryListForSupplierProductOrder(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.submittedTime = this.parseTime(item.submittedTime, this.fmtForYmdhms)
            item.stockInTime = this.parseTime(item.stockInTime, this.fmtForYmdhms)
            item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
            item.reallyPurchaseQtyForBasic = this.$numberStr(
              item.reallyPurchaseQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.stockInQtyForBasic = this.$numberStr(
              item.stockInQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )
            item.accurateDeliveryQtyForBasic = this.$numberStr(
              item.accurateDeliveryQtyForBasic,
              this.$getDecNum(item.decimalNum)
            )

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
            summary.reallyPurchaseQtyForBasic = this.$numberStr(
              summary.reallyPurchaseQtyForBasic,
              3
            )
            summary.stockInQtyForBasic = this.$numberStr(summary.stockInQtyForBasic, 3)
            summary.accurateDeliveryQtyForBasic = this.$numberStr(
              summary.accurateDeliveryQtyForBasic,
              3
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
    querySearchListForSupplierProductOrder() {
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
        const {
          conditionForPurchaseOrderNoList,
          conditionForGoodsReceiptNoteNo,
          purchasePersonList
        } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'purchasePersonIdList') {
            this.$set(x, 'selectData', purchasePersonList)
          }
        })
        this.conditionForPurchaseOrderNoList = this.handle(conditionForPurchaseOrderNoList)
        this.conditionForGoodsReceiptNoteNo = this.handle(conditionForGoodsReceiptNoteNo)
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
      // if (type === 'clear') {
      //   this.$set(this.searchData[5], 'selectList', [])
      //   this.$set(this.queryParams, 'businessPartnerIdList', [])
      //   this.getList()
      //   return
      // }
      // this.$refs.selectSupplierTable.handleOpen(this.searchData[5].selectList)
    },
    updateSupplier(list) {
      const rows = JSON.parse(JSON.stringify(list))
      this.$set(this.searchData[5], 'selectList', rows)
      const ids = rows.map((x) => x.businessPartnerId)
      this.$set(this.queryParams, 'businessPartnerIdList', ids)
      this.getList()
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
      // if (column && column.type === 'selection') {
      //   return
      // }
      // if (!row.purchaseOrderId) return
      // this.$router.push({
      //   path: '/purchaseManagement/viewPurchaseOrder',
      //   query: {
      //     id: row.purchaseOrderId,
      //     timeId: Date.now()
      //   }
      // })
    },
    back() {
      this.$emit('currentIndexChange', 0)
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
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
          if (item.selectId === 'conditionForPurchaseOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForPurchaseOrderNoList)
          } else if (item.selectId === 'conditionForGoodsReceiptNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForGoodsReceiptNoteNo)
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
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/report/supplierDeliveryRateAnalysis/exportForSupplierProductOrder',
        params,
        `${this.getFileNameDate('Supplier Delivery Rate Details')}.xlsx`
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
