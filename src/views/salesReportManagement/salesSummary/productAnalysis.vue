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
              v-hasPermi="['salesReportManagement:salesProductAnalysis:export']"
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
          @row-dblclick="handleUpdate"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange"
          style="cursor: pointer"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectable"
            align="center"
            v-if="checkPermi(['salesReportManagement:salesProductAnalysis:export'])"
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
              <template v-if="item.prop === 'salesQtyForBasic'">
                <template>{{
                  $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
                }}</template>
              </template>
              <template v-else-if="item.prop === 'stockOutQtyForBasic'">
                <template>{{
                  $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
                }}</template>
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

        <div class="flexCen mt20">
          <div style="width: 50%; min-width: 500px">
            <PieChart ref="PieChart" />
          </div>
        </div>
      </div>
    </template>
    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </FormPageLayout>
</template>

<script>
import {
  queryListForCustomerProduct,
  queryImageForCustomerProduct
} from '@/api/salesReportManagement/salesSummary'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'
import PieChart from './PieChart'

export default {
  name: 'ProductAnalysis',
  dicts: [],
  mixins: [pageMixin],
  components: { PieChart },
  data() {
    const vm = this
    return {
      saveKey: '2',
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
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 170,
          visible: true,
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
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
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
          prop: 'salesQtyForBasic',
          label: vm.$t('SALES.salesQTY'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 60,
          tooltip: true
        },
        {
          prop: 'stockOutQtyForBasic',
          label: vm.$t('SALES.outboundQTY'),
          minWidth: 160,
          visible: true,
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
          prop: 'stockOutAmountForBasic',
          label: vm.$t('SALES.outboundAmount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
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
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      if (this.dateRange.length === 2) {
        param.startDateCreatedTime = this.dateRange[0]
        param.endDateCreatedTime = this.appointTime(this.dateRange[1], '23:59:59')
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
      queryListForCustomerProduct(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.salesAmountForBasic = this.$numberStr(item.salesAmountForBasic, 2)
            item.stockOutAmountForBasic = this.$numberStr(item.stockOutAmountForBasic, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.salesAmountForBasic = this.$numberStr(summary.salesAmountForBasic, 2)
            summary.stockOutAmountForBasic = this.$numberStr(summary.stockOutAmountForBasic, 2)
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
      this.queryImageForCustomerProduct()
    },
    queryImageForCustomerProduct() {
      let param = { ...this.queryParams }
      if (this.dateRange.length === 2) {
        param.startDateCreatedTime = this.dateRange[0]
        param.endDateCreatedTime = this.appointTime(this.dateRange[1], '23:59:59')
      }
      param = this.$trimOfObj(param)

      queryImageForCustomerProduct(param).then((res) => {
        const data = res.data || {}
        let { salesProductAmountImageList } = data
        const totalAmountForProduct = data.totalAmountForProduct || ''
        salesProductAmountImageList = (salesProductAmountImageList || []).map((x) => {
          return {
            value: x.salesAmountForBasic,
            name: x.productName + ' ' + (this.$numberStr(x.salesAmountForBasic, 2) || ''),
            topLabel: this.$t('PRODUCT.productName'),
            showName: x.productName,
            totalAmount: totalAmountForProduct
          }
        })
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(salesProductAmountImageList)
        })
      })
    },
    // 取消按钮
    back() {
      this.$emit('currentIndexChange', 0)
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$emit('handleUpdate', row)
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
      if (this.dateRange.length === 2) {
        params.startDateCreatedTime = this.dateRange[0]
        params.endDateCreatedTime = this.appointTime(this.dateRange[1], '23:59:59')
      }
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
        '/sales/report/salesSummary/exportForCustomerProduct',
        params,
        `${this.getFileNameDate('Sales Product Analysis')}.xlsx`
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
