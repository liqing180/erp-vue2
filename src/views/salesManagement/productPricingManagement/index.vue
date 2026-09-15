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
          v-hasPermi="['salesManagement:salesCost:export']"
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
        v-if="checkPermi(['salesManagement:salesCost:export'])"
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
          <template v-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'inventoryAmount'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'monthlySalesVolume'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'salesRetailPriceShowStr'">
            <div
              @mouseenter="showPop1($event, scope.row)"
              @mouseleave="hidePop1($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'minPriceShowStr'">
            <div
              @mouseenter="showPop1($event, scope.row)"
              @mouseleave="hidePop1($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'maxPriceShowStr'">
            <div
              @mouseenter="showPop1($event, scope.row)"
              @mouseleave="hidePop1($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'salesRetailPriceProfitShowStr'">
            <div
              @mouseenter="showPop2($event, scope.row, '1')"
              @mouseleave="hidePop2($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'salesRetailPriceActualMarginShowStr'">
            <div
              @mouseenter="showPop2($event, scope.row, '2')"
              @mouseleave="hidePop2($event, scope.row)"
            >
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexStart">
            <div class="flexCen flex-1">
              <svg-icon
                v-if="scope.row.productId"
                icon-class="list2"
                class="primary-pointer"
                style="font-size: 20px"
                @click="handleDetail(scope.row)"
              />
            </div>
          </div>
        </template>
      </el-table-column> -->
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
    <popover1 ref="popover1" />
    <popover2 ref="popover2" />
  </div>
</template>
<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import { queryProductPricingManagementList } from '@/api/salesManagement/productPricingManagement'

import { queryAllCategoryTreeList } from '@/api/productManagement/productCategory'
import popover1 from './popover1.vue'
import popover2 from './popover2.vue'
export default {
  name: 'SalesCost',
  dicts: [],
  mixins: [pageMixin],
  components: { popover1, popover2 },
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
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('SALES.SKUPartNo'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'basicUom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: false,
          minWidth: 160,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'brand',
          label: vm.$t('SALES.SupplierBrand'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('SALES.ProductCategory'),
          visible: true,
          sortable: 'custom',
          minWidth: 200
          // tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: false,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchasePrice',
          label: vm.$t('SALES.SupplierUnitPrice'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'logisticsCostPerUnit',
          label: vm.$t('SALES.InboundFreightCostperUnit'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'purchaseCost',
          label: vm.$t('SALES.LandedCostperUnit'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'expenseProportion',
          label: vm.$t('SALES.VariableOverheadRate'),
          visible: false,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'overheadAllocationPerUnit',
          label: vm.$t('SALES.AllocatedOverheadperUnit'),
          visible: false,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'inventoryCost',
          label: vm.$t('SALES.TotalCostofGoodsperUnit'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('SALES.CurrentStock'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'inventoryAmount',
          label: vm.$t('SALES.InventoryValuation'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom'
        },
        {
          prop: 'monthlySalesVolume',
          label: vm.$t('SALES.MonthlySalesVolume'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50
        },
        {
          prop: 'daysInventoryOutstanding',
          label: vm.$t('SALES.DaysInventoryOutstanding'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50
        },
        {
          prop: 'salesExpenseProportion',
          label: vm.$t('SALES.overheadsProportion1'),
          minWidth: 160,
          visible: false,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'salesExpenseAmount',
          label: vm.$t('SALES.fixedOverheads1'),
          minWidth: 160,
          visible: false,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'salesCost',
          label: vm.$t('SALES.CostofSalesperUnit'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'targetMargin',
          label: vm.$t('SALES.TargetProfitMargin'),
          minWidth: 160,
          visible: false,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.CalculatedSellingPrice'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'salesRetailPriceShowStr',
          label: vm.$t('SALES.PublishedListPrice'),
          minWidth: 160,
          visible: true,
          tooltip: false,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'minRateShowStr',
          label: vm.$t('SALES.MinimumMarginRate'),
          minWidth: 160,
          visible: false,
          tooltip: true
        },
        {
          prop: 'minPriceShowStr',
          label: vm.$t('SALES.MinimumSellingPrice'),
          minWidth: 160,
          visible: true,
          tooltip: false,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'maxRateShowStr',
          label: vm.$t('SALES.MaximumMarginRate'),
          minWidth: 160,
          visible: false,
          tooltip: true
        },
        {
          prop: 'maxPriceShowStr',
          label: vm.$t('SALES.MaximumSellingPrice'),
          minWidth: 160,
          visible: true,
          tooltip: false,
          padding: 50,
          align: 'right'
        },

        {
          prop: 'salesRetailPriceProfitShowStr',
          label: vm.$t('SALES.ProfitperUnit'),
          minWidth: 160,
          visible: true,
          tooltip: false,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'salesRetailPriceActualMarginShowStr',
          label: vm.$t('SALES.ActualProfitMargin'),
          minWidth: 160,
          visible: true,
          tooltip: false
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
          placeholder: `${this.$t('ui.productSearch1')}`
        },
        {
          name: 'productCategoryIds',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ATreeSelectCustom',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: false,
          emitPath: false,
          multiple: true,
          selectData: []
        }
        /* {
          name: 'dateRange',
          label: vm.$t('PURCHASE.endDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
        } */
      ]
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
    this.queryAllCategoryTreeList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllCategoryTreeList()
  },
  methods: {
    showPop1(e, row) {
      const list = row.salesPriceProductList || []
      if (list.length <= 0) return
      /* row = {
        salesPriceProductList: [
          {
            salesPartNo: '111',
            salesRetailPrice: 100,
            currencyCode: '$'
          },
          {
            salesPartNo: '222',
            salesRetailPrice: 200,
            currencyCode: '$'
          }
        ]
      } */
      this.$refs.popover1.showPop(e, row)
    },
    hidePop1(e, row) {
      this.$refs.popover1.hidePop()
    },
    showPop2(e, row, showType) {
      // showType (1: 利润  2：利润率)
      const list = row.salesPriceProductList || []
      if (list.length <= 0) return
      const showList = list.map((item) => {
        if (showType === '1') {
          return {
            currencyCode: row.currencyCode,
            salesPartNo: item.salesPartNo,
            colValue1: item.salesRetailPriceProfit,
            colValue2: item.minPriceProfit,
            colValue3: item.maxPriceProfit
          }
        } else {
          return {
            currencyCode: row.currencyCode,
            salesPartNo: item.salesPartNo,
            colValue1: item.salesRetailPriceActualMargin,
            colValue2: item.minPriceActualMargin,
            colValue3: item.maxPriceActualMargin
          }
        }
      })

      const params = {
        salesPriceProductList: showList
      }
      this.$refs.popover2.showPop(e, params, showType)
    },
    hidePop2(e, row) {
      this.$refs.popover2.hidePop()
    },
    init() {
      this.getList()
    },
    getList() {
      this.ids = []
      this.single = true
      this.multiple = true
      let params = { ...this.queryParams }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      params = this.$trimOfObj(params)
      this.loading = true
      queryProductPricingManagementList(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)

            item.purchasePrice = this.$numberStr(item.purchasePrice, 2)
            item.logisticsCostPerUnit = this.$numberStr(item.logisticsCostPerUnit, 2)
            item.purchaseCost = this.$numberStr(item.purchaseCost, 2)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 3)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.overheadAllocationPerUnit = this.$numberStr(item.overheadAllocationPerUnit, 2)
            item.inventoryCost = this.$numberStr(item.inventoryCost, 2)
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
            item.salesExpenseProportion = this.$numberStr(item.salesExpenseProportion, 2)
            item.salesExpenseAmount = this.$numberStr(item.salesExpenseAmount, 2)
            item.salesCost = this.$numberStr(item.salesCost, 2)
            item.targetMargin = this.$numberStr(item.targetMargin, 2)
            item.recommendedRetailPrice = this.$numberStr(item.recommendedRetailPrice, 2)
          })

          // if (rows.length > 0 && response.summary) {
          //   const { summary } = response
          //   summary.inventoryAmount = this.$numberStr(summary.inventoryAmount, 2)
          //   rows.push(summary)
          // }
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
    queryAllCategoryTreeList() {
      queryAllCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.searchData.forEach((item) => {
          if (item.name === 'productCategoryIds') {
            this.$set(item, 'selectData', arr)
          }
        })
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          } else {
            x.children = undefined
          }
        })
      }
    },
    /* // 搜索下拉值
    salesCostQuerySearchList() {
      salesCostQuerySearchList({}).then((res) => {
        let conditionForBrandList = res.data.conditionForBrandList || []
        conditionForBrandList = conditionForBrandList.map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData.forEach((x) => {
          if (x.name === 'brandList') {
            this.$set(x, 'selectData', conditionForBrandList)
          }
        })
      })
    }, */

    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.productId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      // if (!row.productId) return false
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
      this.ids = selection.map((item) => item.productId)
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
      let params = JSON.parse(JSON.stringify(this.queryParams))
      params = this.$trimOfObj(params)
      params.exportType = exportType
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.productId)
        params.exportIdList = params.exportIdList.filter((item) => item)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/productPricingManagement/exportProductPricingManagementList',
        params,
        `${this.getFileNameDate('Product Pricing Management')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
          vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportLoading = false
        })
    }
  }
}
</script>

<style scoped></style>
