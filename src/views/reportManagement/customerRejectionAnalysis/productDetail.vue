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
          max-height="600"
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
  queryListForCustomerProductOrder,
  querySearchListForCustomerProductOrder
} from '@/api/reportManagement/customerRejectionAnalysis'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'ProductDetail',
  mixins: [pageMixin],
  components: { ToolTipShowListForFN },
  data() {
    const vm = this
    return {
      saveKey: '3',
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
          prop: 'salesOrderNo',
          label: vm.$t('PURCHASE.salesOrderNo1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'deliveryOrderNo',
          label: vm.$t('PURCHASE.deliveryOrderNo1'),
          visible: true,
          minWidth: 200,
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
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'shippedQty',
          label: vm.$t('PURCHASE.shippedQty'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'shippedAmount',
          label: vm.$t('PURCHASE.shippedAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason1'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'rejectedAmount',
          label: vm.$t('PURCHASE.rejectedAmount'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
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
        businessGroupName: undefined
      },
      searchData: [
        {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            // {
            //   label: this.$t('PURCHASE.stockInNoteNo'),
            //   value: 'conditionForDeliveryOrderNo'
            // },
            // { label: this.$t('PURCHASE.purchaseOrderNo'), value: 'conditionForDeliveryOrderNoList' }

            { label: this.$t('PURCHASE.deliveryOrderNo1'), value: 'conditionForDeliveryOrderNo' },
            { label: this.$t('PURCHASE.salesOrderNo1'), value: 'conditionForSalesOrderNo' }
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
          name: 'returnedReasonList',
          label: vm.$t('PURCHASE.returnReason1'),
          type: 'MultipleSelectEle',
          width: '200px',
          filterable: true,
          selectValue: 'returnedReason',
          selectLabel: 'returnedReasonShowStr',
          // dict: 'sales_returned_reason',
          selectData: []
        }
      ],
      conditionForDeliveryOrderNoList: [],
      conditionForSalesOrderNoList: []
    }
  },
  props: {
    queryParamsProp: {
      type: Object,
      default() {
        return {}
      }
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
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.initQueryParams()
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

      if (param.inputVal && param.selectId) {
        param[param.selectId] = param.inputVal
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
      queryListForCustomerProductOrder(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.shippedAmount = this.$numberStr(item.shippedAmount, 2)
            item.rejectedAmount = this.$numberStr(item.rejectedAmount, 2)
            item.shippedQty = this.$numberStr(item.shippedQty, this.$getDecNum(item.decimalNum))
            item.rejectedQty = this.$numberStr(item.rejectedQty, this.$getDecNum(item.decimalNum))
          })

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
    initQueryParams() {
      this.queryParams.selectId = 'conditionForDeliveryOrderNo'
      this.searchFormKey = Date.now()
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForDeliveryOrderNo'
          item.inputVal = ''
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
    // 取消按钮
    back() {
      this.$emit('currentIndexChange', 1)
    },
    // 搜索下拉值
    querySearchList() {
      const {
        businessPartnerId,
        productId,
        startDateCreatedTime,
        endDateCreatedTime,
        startDateAcknowledgedTime,
        endDateAcknowledgedTime
      } = this.queryParams

      querySearchListForCustomerProductOrder({
        businessPartnerId,
        productId,
        startDateCreatedTime,
        endDateCreatedTime,
        startDateAcknowledgedTime,
        endDateAcknowledgedTime
      }).then((res) => {
        const {
          conditionForSalesOrderNoList,
          conditionForDeliveryOrderNoList,
          returnedReasonList
        } = res.data
        this.conditionForSalesOrderNoList = (conditionForSalesOrderNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForDeliveryOrderNoList = (conditionForDeliveryOrderNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.searchData.forEach((item) => {
          if (item.name === 'returnedReasonList') {
            this.$set(item, 'selectData', returnedReasonList)
          }
        })
        this.setFuzzyData()
      })
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
          if (item.selectId === 'conditionForSalesOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForSalesOrderNoList)
          } else if (item.selectId === 'conditionForDeliveryOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForDeliveryOrderNoList)
          }
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
        '/sales/report/rejectionAnalysis/exportForCustomerProductOrder',
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
