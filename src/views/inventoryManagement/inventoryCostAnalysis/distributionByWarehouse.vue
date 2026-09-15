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
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['inventoryManagement:inventoryCostAnalysis:export']"
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
      :max-height="tableMaxHeight"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="checkPermi(['inventoryManagement:inventoryCostAnalysis:export'])"
      >
      </el-table-column>
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{
            scope.row.inventoryCostProductWarehouseId
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
          <template v-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'inventoryAmount'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexStart">
            <div class="flexCen flex-1">
              <svg-icon
                v-if="scope.row.inventoryCostProductWarehouseId"
                icon-class="list2"
                class="primary-pointer"
                style="font-size: 20px"
                @click="handleInventoryProductDetail(scope.row)"
              />
            </div>
            <div class="flexCen flex-1">
              <svg-icon
                v-if="scope.row.inventoryCostProductWarehouseId"
                icon-class="cost-item"
                class="primary-pointer"
                style="font-size: 20px"
                @click="handleDetail(scope.row)"
              />
            </div>
          </div>
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
    <detailsOfExpensesDlg ref="detailsOfExpensesDlg" />

    <chartDlg ref="chartDlg" />
    <inventoryProductDetail ref="inventoryProductDetail" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import {
  queryInventoryCostProductWarehouseList,
  queryInventoryCostProductWarehouseSearchList
} from '@/api/inventoryManagement/distributionByWarehouse'
import detailsOfExpensesDlg from './componentsWarehouse/detailsOfExpensesDlg.vue'
import chartDlg from './componentsWarehouse/chartDlg'
import inventoryProductDetail from './componentsWarehouse/inventoryProductDetail'

export default {
  name: 'InventoryCostAnalysis',
  dicts: [],
  mixins: [pageMixin],
  components: { detailsOfExpensesDlg, chartDlg, inventoryProductDetail },
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
          prop: 'warehouseName',
          label: vm.$t('PURCHASE.warehouse2'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PURCHASE.alias'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'brand',
          label: vm.$t('PURCHASE.brand'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseCost',
          label: vm.$t('PURCHASE.purchaseCost'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'expenseProportion',
          label: vm.$t('PURCHASE.expenseProportion'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'expenseAmount',
          label: vm.$t('PURCHASE.expenseAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'inventoryCost',
          label: vm.$t('PURCHASE.inventoryCost'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'qtyOnHandShowStr',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'unqualifiedQtyShowStr',
          label: vm.$t('PURCHASE.unqualifiedQTY'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          padding: 60,
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
          prop: 'inventoryAmountShowStr',
          label: vm.$t('PURCHASE.inventoryCost1'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          padding: 50,
          align: 'right'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('PURCHASE.updatedTime'),
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
        businessGroupName: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('PURCHASE.warehouse2'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'brandList',
          label: vm.$t('PURCHASE.brand'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'brand',
          selectLabel: 'brand',
          filterable: true,
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('PURCHASE.updatedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
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
      }
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
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.queryInventoryCostProductWarehouseSearchList()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      queryInventoryCostProductWarehouseList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.inventoryUnitPriceAllWarehouse = this.$numberStr(
              item.inventoryUnitPriceAllWarehouse,
              2
            )
            item.qtyOnHand = this.$numberStr(item.qtyOnHand, this.$getDecNum(item.decimalNum))
            item.unqualifiedQty = this.$numberStr(
              item.unqualifiedQty,
              this.$getDecNum(item.decimalNum)
            )
            item.purchaseCost = this.$numberStr(item.purchaseCost, 2)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 2)
            item.inventoryCost = this.$numberStr(item.inventoryCost, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.inventoryAmount = this.$numberStr(summary.inventoryAmount, 2)
            summary.qtyOnHand = this.$numberStr(summary.qtyOnHand, 3)
            summary.unqualifiedQty = this.$numberStr(summary.unqualifiedQty, 3)
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
    queryInventoryCostProductWarehouseSearchList() {
      queryInventoryCostProductWarehouseSearchList({}).then((res) => {
        const conditionForBrandList = res.data.brandList || []
        const warehouseList = res.data.warehouseList || []
        this.searchData.forEach((x) => {
          if (x.name === 'brandList') {
            this.$set(x, 'selectData', conditionForBrandList)
          } else if (x.name === 'warehouseIdList') {
            this.$set(x, 'selectData', warehouseList)
          }
        })
      })
    },
    // 产品明细
    handleInventoryProductDetail(row) {
      this.$refs.inventoryProductDetail.handleOpen(row)
    },
    // 费用项明细
    handleDetail(row) {
      this.$refs.detailsOfExpensesDlg.handleOpen(row)
    },
    handleChart(index, row) {
      this.$refs.chartDlg.openChart(row)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.inventoryCostProductWarehouseId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      if (!row.inventoryCostProductWarehouseId) return false
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
      this.ids = selection.map((item) => item.inventoryCostProductWarehouseId)
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
        params.exportIdList = vm.tableList.map((item) => item.inventoryCostProductWarehouseId)
        params.exportIdList = params.exportIdList.filter((item) => item)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/inventoryCostProductWarehouse/exportInventoryCostProductWarehouseList',
        params,
        `${this.getFileNameDate('Inventory Cost Analysis')}.xlsx`
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
