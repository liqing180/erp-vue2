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
          type="primary"
          size="mini"
          v-hasPermi="['salesManagement:salesCost:profitMarginSettings']"
          @click="handleAdd"
          >{{ $t('menu.profitMarginSettings') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['salesManagement:salesCost:import']"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
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
          <span>{{
            scope.row.salesRecommendedPriceId
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
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon el-icon-s-data pointer"
              style="font-size: 20px; color: #1890ff"
              v-if="scope.row.salesRecommendedPriceId"
              @click="handleChart(scope.$index, scope.row)"
            ></i>
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
    <profitMarginSettingsDlg ref="profitMarginSettingsDlg" />
    <chartDlg ref="chartDlg" path="recommendedRetailPrice" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import profitMarginSettingsDlg from './components/profitMarginSettingsDlg.vue'
import {
  recommendedPriceQueryRecommendedPriceList,
  recommendedPriceQuerySearchList
} from '@/api/salesManagement/salesCost'
import chartDlg from './components/chartDlg'

export default {
  name: 'RecommendedRetailPrice',
  dicts: [],
  mixins: [pageMixin],
  components: { profitMarginSettingsDlg, chartDlg },
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
          tooltip: true
        },
        {
          prop: 'salesCost',
          label: vm.$t('SALES.overheadsAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'profit',
          label: vm.$t('PURCHASE.profitMargin'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.recommendedRetailPrice'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
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
          name: 'brandList',
          label: vm.$t('PURCHASE.brand'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          filterable: true,
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('PURCHASE.endDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
        }
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/inventory/recommendedPrice/exportImportTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/inventory/recommendedPrice/checkImportData',
        // 提交导入
        importUrl: '/inventory/recommendedPrice/importData',
        // 下载文件名
        fileName: 'Recommended Retail Price'
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
      this.recommendedPriceQuerySearchList()

      this.ids = []
      this.single = true
      this.multiple = true
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      recommendedPriceQueryRecommendedPriceList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.salesCost = this.$numberStr(item.salesCost, 2)
            item.recommendedRetailPrice = this.$numberStr(item.recommendedRetailPrice, 2)
            item.profit = this.$numberStr(item.profit, 2)
          })

          if (rows.length > 0 && response.summary) {
            const { summary } = response
            summary.salesCost = this.$numberStr(summary.salesCost, 2)
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
    recommendedPriceQuerySearchList() {
      recommendedPriceQuerySearchList({}).then((res) => {
        const businessGroupName = res.data.businessGroupName
        let conditionForBrandList = res.data.conditionForBrandList || []
        conditionForBrandList = conditionForBrandList.map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.queryParams.businessGroupName = businessGroupName
        this.searchData.forEach((x) => {
          if (x.name === 'brandList') {
            this.$set(x, 'selectData', conditionForBrandList)
          }
        })
      })
    },
    handleAdd(row) {
      this.$refs.profitMarginSettingsDlg.handleOpen(row)
    },
    handleChart(index, row) {
      this.$refs.chartDlg.openChart({
        productId: row.productId,
        startDate: this.queryParams.startDate,
        endDate: this.queryParams.endDate
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.salesRecommendedPriceId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      if (!row.salesRecommendedPriceId) return false
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
      this.ids = selection.map((item) => item.salesRecommendedPriceId)
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
        params.exportIdList = vm.tableList.map((item) => item.salesRecommendedPriceId)
        params.exportIdList = params.exportIdList.filter((item) => item)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/recommendedPrice/exportRecommendedPriceList',
        params,
        `${this.getFileNameDate('Recommended Retail Price')}.xlsx`
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
