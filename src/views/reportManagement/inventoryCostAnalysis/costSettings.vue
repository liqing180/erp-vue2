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
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['reportManagement:inventoryCostAnalysis:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['reportManagement:inventoryCostAnalysis:export']"
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
        v-if="checkPermi(['reportManagement:inventoryCostAnalysis:export'])"
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
          <template v-else-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
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

    <!-- 导出 -->
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
    <stockOutOrStockInDlg ref="stockOutOrStockInDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import locale2 from '@/views/salesManagement/lang/index'

import stockOutOrStockInDlg from './components/stockOutOrStockInDlg.vue'
import {
  queryInventoryCostSettingsList,
  costSettingsQuerySearchList
} from '@/api/reportManagement/inventoryCostAnalysis'
import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'

export default {
  name: 'InventoryCostAnalysis',
  dicts: [],
  mixins: [pageMixin],
  components: { stockOutOrStockInDlg },
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
          prop: 'expenseItemName',
          label: vm.$t('PURCHASE.expenseItem1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'expenseItemType',
          propBy: 'expenseItemTypeStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'expenseProportion',
          label: vm.$t('PURCHASE.expenseProportion'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'expenseAmount',
          label: vm.$t('PURCHASE.expenseAmount'),
          visible: true,
          minWidth: 160,
          sortable: 'custom',
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'productCategoryNames',
          label: vm.$t('PURCHASE.assignedCategory'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'productCount',
          label: vm.$t('PURCHASE.assignedProduct'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
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
        // {
        //   name: 'conditionForExpenseItemNameList',
        //   label: vm.$t('PURCHASE.expenseItem1'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'value',
        //   selectLabel: 'label',
        //   filterable: true,
        //   selectData: []
        // },
        {
          name: 'conditionForExpenseItemName',
          label: this.$t('PURCHASE.expenseItem1'),
          type: 'AutocompleteEle',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        },
        {
          name: 'expenseItemTypeList',
          label: vm.$t('ui.type'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          filterable: true,
          selectData: [
            {
              label: vm.$t('SALES.expenseProportion6'),
              value: '1'
            },
            {
              label: vm.$t('SALES.amount6'),
              value: '2'
            }
          ]
        },
        // {
        //   name: 'productCategoryName',
        //   label: vm.$t('SALES.productCategory'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'value',
        //   selectLabel: 'label',
        //   filterable: true,
        //   selectData: []
        // },
        // {
        //   name: 'productCategoryIds',
        //   label: this.$t('SALES.productCategory'),
        //   type: 'ElcascaderEle',
        //   width: '230px',
        //   mapValue: 'id',
        //   mapLabel: 'categoryName',
        //   checkStrictly: true,
        //   multiple: false,
        //   selectData: []
        // },
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
        },
        {
          name: 'isActiveList',
          label: vm.$t('ui.isActive'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
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
      typeDicts: [
        {
          label: vm.$t('SALES.expenseProportion6'),
          value: '1'
        },
        {
          label: vm.$t('SALES.amount6'),
          value: '2'
        }
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
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    // this.queryAllProductCategoryTreeList()
    // this.getList()
  },
  activated() {
    // if (Date.now() - this.createdInitTimer < 1000) return
    // this.getList()
  },
  methods: {
    init() {
      this.queryAllProductCategoryTreeList()
      this.getList()
    },
    getList() {
      this.costSettingsQuerySearchList()

      this.ids = []
      this.single = true
      this.multiple = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)
      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryId = params.productCategoryIds[params.productCategoryIds.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      this.loading = true
      queryInventoryCostSettingsList(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.expenseProportion = this.$numberStr(item.expenseProportion, 1)
            item.expenseAmount = this.$numberStr(item.expenseAmount, 2)
            item.productCount = this.$numberStr(item.productCount, 0)

            item.expenseItemTypeStr =
              item.expenseItemType === '1'
                ? this.$t('SALES.expenseProportion6')
                : this.$t('SALES.amount6')
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
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
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
    // 搜索下拉值
    costSettingsQuerySearchList() {
      costSettingsQuerySearchList({}).then((res) => {
        let { conditionForExpenseItemNameList } = res.data
        conditionForExpenseItemNameList = conditionForExpenseItemNameList.map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.searchData.forEach((x) => {
          if (x.name === 'conditionForExpenseItemName') {
            this.$set(x, 'fuzzyData', conditionForExpenseItemNameList)
          }
        })
      })
    },
    handleAdd(row) {
      this.$router.push({
        path: '/reportManagement/addCostSettings',
        query: { timeId: +new Date() }
      })
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/reportManagement/editCostSettings',
        query: { id: row.inventoryCostSettingsId, timeId: +new Date() }
      })
    },
    handleDetail(row) {
      this.$refs.stockOutOrStockInDlg.handleOpen(row)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.inventoryCostSettingsId) {
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
      const { pageSize, businessGroupName } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize, businessGroupName }
      this.searchFormKey = Date.now()
      this.$refs.tables.clearSort()
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.inventoryCostSettingsId)
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
        params.exportIdList = vm.tableList.map((item) => item.inventoryCostSettingsId)
        params.exportIdList = params.exportIdList.filter((item) => item)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryId = params.productCategoryIds[params.productCategoryIds.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds

      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/inventoryCostSettings/export',
        params,
        `${this.getFileNameDate('Inventory Cost Settings')}.xlsx`
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
