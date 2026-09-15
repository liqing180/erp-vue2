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
              <template v-else-if="item.prop === 'stockInAmountForBasic'">
                {{ $numberStr(scope.row[item.prop], 2) }}
              </template>
              <template v-else-if="item.prop === 'unqualifiedAmountForBasic'">
                {{ $numberStr(scope.row[item.prop], 2) }}
              </template>
              <template v-else-if="item.prop === 'unqualifiedRate'">
                {{ $numberStr(scope.row[item.prop], 2) }}
              </template>
              <template v-else-if="item.prop === 'stockInQtyForBasic'">
                {{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}
              </template>
              <template v-else-if="item.prop === 'unqualifiedQtyForBasic'">
                {{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}
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
  queryListForBusinessProductOrder,
  querySearchListForBusinessProductOrder
} from '@/api/reportManagement/supplierIncomingMaterialForPoorAnalysis'
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
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'stockInNoteNo',
          label: vm.$t('PURCHASE.stockInNoteNo'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrderNo'),
          visible: true,
          minWidth: 160,
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
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stockInQtyForBasic',
          label: vm.$t('PURCHASE.purchaseStockInQty'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 60,
          tooltip: true
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
          prop: 'unqualifiedQtyForBasic',
          label: vm.$t('PURCHASE.iqcBadNumber'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          padding: 60,
          tooltip: true
        },
        {
          prop: 'unqualifiedAmountForBasic',
          label: vm.$t('PURCHASE.iqcBadMoney'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'unqualifiedRateShowStr',
          label: vm.$t('PURCHASE.iqcBadRate'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
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
            {
              label: this.$t('PURCHASE.stockInNoteNo'),
              value: 'conditionForStockInNoteNo'
            },
            { label: this.$t('PURCHASE.purchaseOrderNo'), value: 'conditionForPurchaseOrderNo' }
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
      conditionForStockInNoList: [],
      conditionForPurchaseOrderNoList: []
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
      if (this.dateRange.length === 2) {
        param.startDate = this.dateRange[0]
        param.endDate = this.appointTime(this.dateRange[1], '23:59:59')
      }
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
      queryListForBusinessProductOrder(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.submittedTime = this.parseTime(item.submittedTime, this.fmtForYmdhms)
            item.reallyPurchaseAmountForBasic = this.$numberStr(
              item.reallyPurchaseAmountForBasic,
              2
            )
            item.purchaseOrderDetailStatusStr = this.selectDictLabel(
              this.dict.type.p_purchase_order_detail_status,
              item.purchaseOrderDetailStatus
            )
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
      this.queryParams.selectId = 'conditionForStockInNoteNo'
      this.searchFormKey = Date.now()
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForStockInNoteNo'
          item.inputVal = ''
        }
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
      querySearchListForBusinessProductOrder({ businessPartnerId, productId }).then((res) => {
        const { conditionForPurchaseOrderNoList, conditionForStockInNoList } = res.data
        this.conditionForPurchaseOrderNoList = (conditionForPurchaseOrderNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.conditionForStockInNoList = (conditionForStockInNoList || []).map((item) => {
          return {
            value: item,
            label: item
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
          if (item.selectId === 'conditionForPurchaseOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForPurchaseOrderNoList)
          } else if (item.selectId === 'conditionForStockInNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForStockInNoList)
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
      if (this.dateRange.length === 2) {
        params.startDate = this.dateRange[0]
        params.endDate = this.appointTime(this.dateRange[1], '23:59:59')
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
        '/purchase/report/incomingAnalysis/exportForBusinessProductOrder',
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
