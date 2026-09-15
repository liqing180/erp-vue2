<template>
  <div class="app-container">
    <el-tabs ref="tabsRef" type="card" v-model="activeName" @tab-click="tabClickHandler">
      <el-tab-pane size="" v-for="(item, index) in tabs" :key="index" :name="item.value">
        <span slot="label">
          <div class="tabs-item-title">
            {{ item.name }}
          </div>
        </span>
      </el-tab-pane>
    </el-tabs>

    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
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
          v-hasPermi="['inventoryManagement:inventoryReport:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        ref="rightToolbar"
        :saveKey="activeName"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      :max-height="tableMaxHeight"
    >
      <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
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
          <template v-else-if="item.prop === 'qtyOnHandInWarehouse'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>
            <span v-else-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <span class="primary-link" @click="qtyOnHandDetail(scope.row)" v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
          </template>
          <template v-else-if="item.prop === 'putAwayQty'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>
            <span v-else-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <span v-else-if="scope.row.isPhantom === '1'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <span class="primary-link" @click="qtyOnHandDetail(scope.row)" v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
          </template>

          <template v-else-if="item.prop === 'unqualifiedQty'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>

            <template v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>

            <template v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQtyNoUnqualified'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>

            <template v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'occupiedQty'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>
            <span v-else-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <template v-else>
              <span
                v-if="activeName === '0'"
                class="primary-link"
                @click="openReservedDetail(scope.row)"
                >{{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}</span
              >
              <span v-else>{{
                $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
              }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'reservedQty'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>
            <span v-else-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <template v-else>
              <span
                v-if="activeName === '0'"
                class="primary-link"
                @click="openReservedDetail(scope.row)"
                >{{ $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum)) }}</span
              >
              <span v-else>{{
                $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
              }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'inTransitQty' && activeName === '0'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>
            <span v-else-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>

            <span class="primary-link" @click="openInTransitDetail(scope.row)" v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
          </template>
          <template v-else-if="item.prop === 'anticipateQty'">
            <span v-if="scope.row.nonInventoryItem === '1'">-</span>

            <template v-else>{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</template>
          </template>
          <template v-else-if="item.prop === 'sicQty'">
            <span v-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <span v-else class="primary-link" @click="openSicQtyDetail(scope.row)">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
          </template>
          <template v-else-if="item.prop === 'lockedAvailableQty'">
            <span v-if="scope.row.warehouseType === '3'">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
            <span v-else class="primary-link" @click="numberOfLocksDetail(scope.row)">{{
              $numberStr(scope.row[item.prop], $getDecNum(scope.row.decimalNum))
            }}</span>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="
          checkPermi([
            'inventoryManagement:inventoryReport:purchaseQuotationRecord',
            'inventoryManagement:stockLog:list'
          ])
        "
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <svg-icon
              class="primary-pointer mr5"
              icon-class="line"
              style="font-size: 20px"
              @click.stop="handleViewHistoryChart(scope.row)"
              v-if="checkPermi(['inventoryManagement:inventoryReport:purchaseQuotationRecord'])"
            />
            <svg-icon
              icon-class="list2"
              class="primary-pointer"
              style="font-size: 20px"
              v-if="checkPermi(['inventoryManagement:stockLog:list'])"
              @click="handleOperationLog(scope.row)"
            />
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
    <!-- 占用详情 -->
    <reservedDetailsDlg ref="reservedDetailsDlg" />
    <!-- 在途详情 -->
    <inTransitDetailsDlg ref="inTransitDetailsDlg" />
    <!-- 借货数量 -->
    <sicQtyDetailDlg ref="sicQtyDetailDlg" />
    <!-- 库存数量 -->
    <qtyOnHandForTabDlg ref="qtyOnHandForTabDlg" />
    <!-- 锁定详情 -->
    <umberOfLocksDetailDlg ref="umberOfLocksDetailDlg" @onSuccess="getList" />
    <historyQuotationRecordsDlg ref="historyQuotationRecordsDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/inventoryManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import {
  queryAllProductCategoryTreeList,
  queryActiveWarehouseList,
  queryWarehouseProductList,
  queryWarehouseBatchList
} from '@/api/inventoryManagement/inventoryReport'
import reservedDetailsDlg from './reservedDetailsDlg'
import inTransitDetailsDlg from './inTransitDetailsDlg'
import sicQtyDetailDlg from './sicQtyDetailDlg'
import qtyOnHandForTabDlg from './qtyOnHandForTabDlg'
import umberOfLocksDetailDlg from './umberOfLocksDetailDlg'
import historyQuotationRecordsDlg from '@/views/purchaseManagement/purchaseQuotation/components/historyQuotationRecordsDlg.vue'
export default {
  name: 'InventoryReport',
  dicts: ['warehouse_type'],
  mixins: [pageMixin, tableDataMixin],
  components: {
    reservedDetailsDlg,
    inTransitDetailsDlg,
    sicQtyDetailDlg,
    historyQuotationRecordsDlg,
    qtyOnHandForTabDlg,
    umberOfLocksDetailDlg
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      loading: false,
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
      selectList: [],
      // 显示搜索条件
      showSearch: true,
      tabs: [
        { value: '0', name: vm.$t('INVENTORY.productList') },
        { value: '1', name: vm.$t('INVENTORY.batchList') }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: []
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    configCurColumn() {
      const arr = [...this.curColumns]
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      const arr = this.curColumns.filter((column) => column.visible === true)
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
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
    this.searchData = this.searchData0
    this.getList()
    this.queryActiveWarehouseList()
    this.queryAllProductCategoryTreeList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryActiveWarehouseList()
    this.queryAllProductCategoryTreeList()
  },
  methods: {
    handleViewHistoryChart(row) {
      const params = {
        productId: row.productId,
        businessPartnerIdList: []
      }
      this.$refs.historyQuotationRecordsDlg.handleOpen(params)
    },
    openReservedDetail(row) {
      this.$refs.reservedDetailsDlg.handleOpen(row)
    },
    openInTransitDetail(row) {
      this.$refs.inTransitDetailsDlg.handleOpen(row)
    },
    openSicQtyDetail(row) {
      this.$refs.sicQtyDetailDlg.handleOpen(row)
    },
    qtyOnHandDetail(row) {
      this.$refs.qtyOnHandForTabDlg.handleOpen(row)
    },
    numberOfLocksDetail(row) {
      this.$refs.umberOfLocksDetailDlg.handleOpen(row)
    },
    tabClickHandler() {
      if (this.activeName === '0') {
        this.searchData = this.searchData0
      } else {
        this.searchData = this.searchData1
      }
      this.queryActiveWarehouseList()
      this.queryAllProductCategoryTreeList()
      this.tableList = []
      this.resetSearchForm()
    },
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      // if (this.queryParams.productCategoryId && this.queryParams.productCategoryId.length > 0) {
      //   param.productCategoryId =
      //     this.queryParams.productCategoryId[this.queryParams.productCategoryId.length - 1]
      // } else {
      //   param.productCategoryId = undefined
      // }
      if (param.productCategoryId && param.productCategoryId.length > 0) {
        param.productCategoryIdList = param.productCategoryId.map((item) => item[item.length - 1])
      } else {
        param.productCategoryIdList = undefined
      }
      delete param.productCategoryId
      this.loading = true
      const api = {
        0: queryWarehouseProductList,
        1: queryWarehouseBatchList
      }
      const timer = Date.now()
      this.queryTimer = timer
      api[this.activeName](param)
        .then((response) => {
          if (this.queryTimer !== timer) return
          const rows = response.rows || []
          this.tableList = rows
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
    },
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$router.push({
        path: '/inventoryManagement/stockLog',
        query: {
          warehouseId: row.warehouseId,
          warehouseName: row.warehouseName,
          productId: row.productId,
          timeId: Date.now()
        }
      })
    },
    queryActiveWarehouseList() {
      queryActiveWarehouseList({ menuPerms: this.menuKey.inventoryReport }).then((res) => {
        const arr = res.data || []
        this.$set(this.searchData[2], 'selectData', arr)
      })
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList({}).then((res) => {
        const arr = res.data
        this.handle(arr)
        this.$set(this.searchData[1], 'selectData', arr)
      })
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          }
        })
      }
    },
    nav(row) {
      this.$router.push({
        path: '/productManagement/viewExtendedProductInfo',
        query: {
          id: row.productId,
          timeId: Date.now()
        }
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
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
      // if (params.productCategoryId && params.productCategoryId.length > 0) {
      //   params.productCategoryId = params.productCategoryId[params.productCategoryId.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }

      if (params.productCategoryId && params.productCategoryId.length > 0) {
        params.productCategoryIdList = params.productCategoryId.map((item) => item[item.length - 1])
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryId
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.id)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)

      vm.exportLoading = true
      const api = {
        0: '/inventory/inventoryReport/exportWarehouseProductList',
        1: 'inventory/inventoryReport/exportWarehouseBatchList'
      }
      this.$importOrExportDownFile(
        `${api[this.activeName]}`,
        params,
        `${this.getFileNameDate('Inventory Report')}.xlsx`
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
