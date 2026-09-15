<template>
  <div>
    <div class="app-container" v-if="currentIndex === 0">
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
            v-hasPermi="['reportManagement:libraryAgeDistribution:export']"
            >{{ $t('uiBtn.export') }}</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="handlerLibraryAgeSettings"
            v-hasPermi="['reportManagement:libraryAgeDistribution:libraryAgeSettings']"
            >{{ $t('menu.libraryAgeSettings') }}</el-button
          >
        </el-col>
        <right-toolbar
          ref="rightToolbar"
          :saveKey="saveKey"
          savePath="libraryAgeDistribution"
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
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
        max-height="600"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectable"
          align="center"
          v-if="checkPermi(['reportManagement:libraryAgeDistribution:export'])"
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
            <template>{{ scope.row[item.propBy || item.prop] }}</template>
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

      <libraryAgeSettingsDlg ref="libraryAgeSettingsDlg" @onSuccess="getList" />

      <div class="flexCen mt20">
        <div style="width: 50%; min-width: 500px">
          <PieChart ref="PieChart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import {
  queryStorageDurationAnalysisList,
  queryImageForStorageDurationAnalysis,
  querySearchListForStorageDurationAnalysis
} from '@/api/reportManagement/libraryAgeDistribution'
import libraryAgeSettingsDlg from './libraryAgeSettingsDlg.vue'
import PieChart from './PieChart'

export default {
  name: 'LibraryAgeDistribution',
  dicts: [],
  mixins: [pageMixin],
  components: { libraryAgeSettingsDlg, PieChart },
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
      columns: [],
      createdColumns: [
        {
          prop: 'warehouseName',
          label: vm.$t('PURCHASE.warehouseName'),
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
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.stockTotal'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'inventoryAmount',
          label: vm.$t('PURCHASE.inventoryCost1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right'
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
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'conditionForWarehouseName',
          label: this.$t('PURCHASE.warehouseName'),
          type: 'AutocompleteEle',
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
      currentIndex: 0,
      rowIdKey: 'id'
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
    this.$$initColumnVisible(this.saveKey, this.createdColumns)
    this.columns = JSON.parse(JSON.stringify(this.createdColumns))
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
      this.$set(this.queryParams, 'startDateSubmittedTime', startTimer)
      this.$set(this.queryParams, 'endDateSubmittedTime', end)
      this.searchFormKey = Date.now()
    },
    getList(query) {
      this.querySearchList()
      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      if (this.loading) return
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      queryStorageDurationAnalysisList(param)
        .then((response) => {
          this.loading = false
          const rows = response.rows || []
          rows.forEach((item) => {
            item.qtyOnHand = this.$numberStr(item.qtyOnHand, this.$getDecNum(item.decimalNum))
            item.inventoryAmount = this.$numberStr(item.inventoryAmount, 2)
            if (item.storageDurationSettingList && item.storageDurationSettingList.length > 0) {
              item.storageDurationSettingList.forEach((x, i) => {
                item['inventoryPerShowStr_' + i] = x.inventoryPerShowStr
                item['inventoryQty_' + i] = this.$numberStr(
                  x.inventoryQty,
                  this.$getDecNum(item.decimalNum)
                )
                item['inventoryAmount_' + i] = this.$numberStr(x.inventoryAmount, 2)
              })
            }
          })
          this.tableList = rows
          if (this.tableList.length > 0) {
            const { storageDurationSettingList } = this.tableList[0]
            if (storageDurationSettingList && storageDurationSettingList.length > 0) {
              this.updateTable(storageDurationSettingList)
            }
          }
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.tableList = []
          this.loading = false
        })
      this.queryImageForStorageDurationAnalysis()
    },
    // 搜索下拉值
    querySearchList() {
      querySearchListForStorageDurationAnalysis({}).then((res) => {
        let { conditionForWarehouseNameList } = res.data

        conditionForWarehouseNameList = (conditionForWarehouseNameList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData.forEach((x) => {
          if (x.name === 'conditionForWarehouseName') {
            this.$set(x, 'fuzzyData', conditionForWarehouseNameList)
          }
        })
      })
    },
    queryImageForStorageDurationAnalysis() {
      const { pageNum, pageSize, ...param } = this.queryParams
      queryImageForStorageDurationAnalysis(param).then((res) => {
        console.log(res, '===')
        const data = res.data || {}
        let storageDurationSettingList = data.storageDurationSettingList || []
        // const totalAmountForProduct = data.totalAmountForProduct || ''
        storageDurationSettingList = storageDurationSettingList.map((x) => {
          return {
            value: x.inventoryAmount,
            inventoryQty: x.inventoryQty,
            name: this.$t('PURCHASE.days').replace('$1', x.days),
            days: x.days,
            inventoryAmount: data.inventoryAmount,
            qtyOnHand: data.qtyOnHand,
            decimalNum: data.decimalNum
          }
        })
        this.$nextTick(() => {
          this.$refs.PieChart && this.$refs.PieChart.initChart(storageDurationSettingList)
        })
      })
    },
    handlerLibraryAgeSettings() {
      this.$refs.libraryAgeSettingsDlg.handleOpen()
    },
    updateTable(data) {
      const columns = JSON.parse(JSON.stringify(this.createdColumns))

      data.forEach((x, i) => {
        columns.push(
          {
            prop: 'inventoryPerShowStr_' + i,
            label: this.$t('PURCHASE.daysPer').replace('$1', x.days),
            visible: true,
            minWidth: 200,
            tooltip: true
          },
          {
            prop: 'inventoryQty_' + i,
            label: this.$t('PURCHASE.daysInventoryQty').replace('$1', x.days),
            visible: true,
            minWidth: 200,
            tooltip: true
          },
          {
            prop: 'inventoryAmount_' + i,
            label: this.$t('PURCHASE.daysInventoryAmount').replace('$1', x.days),
            visible: true,
            minWidth: 200,
            tooltip: true,
            align: 'right'
          }
        )
      })
      this.$$initColumnVisible(this.saveKey, columns)
      this.columns = columns
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      /* 第一层双击重置第二层搜索条件 */
      this.currentIndex = 1
      this.queryParams2 = {
        pageNum: 1,
        pageSize: 25,
        businessPartnerId: row.businessPartnerId
      }
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
      } else if (this.currentIndex === 2) {
        this.$refs.productDetail && this.$refs.productDetail.getList()
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
      this.initQueryParams()
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
        '/inventory/storageDuration/export',
        params,
        `${this.getFileNameDate('Storage Duration Analysis_')}.xlsx`
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
