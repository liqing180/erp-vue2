<template>
  <div class="app-container">
    <!-- <el-tabs
      ref="tabsRef"
      type="card"
      :key="'tabs_' + tabsKey"
      v-model="activeName"
      @tab-click="tabClickHandler"
    >
      <template v-for="(item, index) in tabs">
        <el-tab-pane size="" :key="index" :name="item.value">
          <span slot="label">
            <div class="tabs-item-title">
              {{ item.name }}
              <el-badge
                :max="99"
                :key="item.value + badgeKey"
                class="tabs-item-badge"
                style="margin-left: 3px"
                :value="item.num"
              />
            </div>
          </span>
        </el-tab-pane>
      </template>
    </el-tabs> -->
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-if="addAuth" type="primary" size="mini" @click="handleAdd">{{
          $t('uiBtn.add')
        }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          v-hasPermi="['productManagement:productConfigurationTable:edit']"
          @click="handleEdit"
          :disabled="multiple"
          >{{ $t('uiBtn.edit') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => settingHandleCommand(command)"
          v-hasPermi="['productManagement:productConfigurationTable:edit']"
          v-if="!multiple"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="active" icon="el-icon-open"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item command="inactive" icon="el-icon-turn-off"
              >{{ $t('uiBtn.inactiveBtn') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="importAuth"
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
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
          v-hasPermi="['productManagement:productConfigurationTable:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :saveKey="activeName"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      max-height="500"
      row-key="id"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        key="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
          </template>
          <template v-else-if="item.prop === 'uomCoefficient'">
            {{ $numberStr(scope.row.uomCoefficient, 3, false) }}
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="false"
      >
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleChangeActive(scope.row)">
            <span v-if="scope.row.isActive === '0'">{{ $t('uiBtn.activeBtn') }}</span>
            <span v-else style="color: #ff4949">{{ $t('uiBtn.inactiveBtn') }}</span>
          </el-button>
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

    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="comImportOptions" @onSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/businessPartner/lang/index'
import {
  queryProductExpansionSalesList,
  queryProductExpansionPurchaseList,
  querySearchListPurchase,
  updateActivePurchase,
  updateActiveSales
} from '@/api/productManagement/productConfigurationTable'
import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'

export default {
  name: 'ProductConfigurationTable',
  mixins: [pageMixin, tableDataMixin],
  data() {
    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      supplierTypeDicts: [],
      supplierGroupDicts: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['productManagement:productConfigurationTable:add'])
    },
    importAuth() {
      return this.checkPermi(['productManagement:productConfigurationTable:import'])
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
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comImportOptions() {
      if (this.activeName === '0') {
        return {
          // 下载模板
          downFileUrl: '/system/productExpansionPurchase/downTemplate',
          // 上传校验
          uploadUrl:
            process.env.VUE_APP_BASE_API + '/system/productExpansionPurchase/checkImportData',
          // 提交导入
          importUrl: '/system/productExpansionPurchase/importData',
          // 下载文件名
          fileName: 'Sales Product Info'
        }
      } else {
        return {
          // 下载模板
          downFileUrl: '/system/productExpansionSales/downTemplate',
          // 上传校验
          uploadUrl: process.env.VUE_APP_BASE_API + '/system/productExpansionSales/checkImportData',
          // 提交导入
          importUrl: '/system/productExpansionSales/importData',
          // 下载文件名
          fileName: 'Sales Product Info'
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'ProductConfigurationTable') {
          this.resetSearchForm(false)
          const params = route.params || {}
          console.log(params)
          this.$set(this.queryParams, 'jumpToIds', params.ids)
          this.createdInitTimer = Date.now()
          this.getList()
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  async created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)

    this.getDictsFN()
    // $$initColumnVisible 在 ./tableDataMixin.js 调用了

    this.searchData = this.searchData1
    this.queryAllProductCategoryTreeList()

    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllProductCategoryTreeList()
  },

  methods: {
    async getDictsFN() {
      const a = this.MyDictDataClass.getDictFn('bp_supplier_type')
      const b = this.MyDictDataClass.getDictFn('bp_supplier_group')
      const c = this.MyDictDataClass.getDictFn('system_active')
      await Promise.all([a, b, c]).then((res) => {
        const res1 = res[0] || {}
        const res2 = res[1] || {}
        const res3 = res[2] || {}
        this.supplierTypeDicts = (res1 || []).map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue
          }
        })
        this.supplierGroupDicts = (res2 || []).map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue
          }
        })
        this.isActiveDicts = (res3 || []).map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue
          }
        })
      })

      this.searchData0.forEach((item) => {
        if (item.name === 'supplierTypeList') {
          item.selectData = this.supplierTypeDicts
        } else if (item.name === 'supplierGroupList') {
          item.selectData = this.supplierGroupDicts
        } else if (item.name === 'isActiveList') {
          item.selectData = this.isActiveDicts
        }
      })
      this.searchData1.forEach((item) => {
        if (item.name === 'isActiveList') {
          item.selectData = this.isActiveDicts
        }
      })
    },
    tabClickHandler() {
      if (this.activeName === '0') {
        this.searchData = this.searchData0
      } else if (this.activeName === '1') {
        this.searchData = this.searchData1
      }
      this.resetSearchForm()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }

      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    /** 查询用户列表 */
    getList(query) {
      const timer = Date.now()
      this.queryTime = timer
      this.querySearchList()
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryId = params.productCategoryIds[params.productCategoryIds.length - 1]
      // } else {
      //   params.productCategoryId = undefined
      // }
      // delete params.productCategoryIds
      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryIdList = params.productCategoryIds.map(
      //     (item) => item[item.length - 1]
      //   )
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds
      let queryFN
      if (this.activeName === '0') {
        queryFN = queryProductExpansionPurchaseList
      } else if (this.activeName === '1') {
        queryFN = queryProductExpansionSalesList
      }
      queryFN(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    querySearchList() {
      const params = {}
      let queryFN
      if (this.activeName === '0') {
        queryFN = querySearchListPurchase
      }
      if (!queryFN) return
      queryFN(params).then((res) => {
        const data = res.data || {}
        const countryList = data.countryList || []
        const vendorList = data.vendorList || []

        const conditionForExternalPartNoList = (data.conditionForExternalPartNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )

        this.searchData.forEach((item) => {
          if (item.name === 'countryIdList') {
            this.$set(item, 'selectData', countryList)
          } else if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', vendorList)
          } else if (item.name === 'conditionForExternalPartNo') {
            this.$set(item, 'fuzzyData', conditionForExternalPartNoList)
          }
        })
      })
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.searchData0.forEach((item) => {
          if (item.name === 'productCategoryIds') {
            this.$set(item, 'selectData', arr)
          }
        })
        this.searchData1.forEach((item) => {
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

    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
    },
    updateSearchData(e) {},

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
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
    /** 批量修改用户状态 */
    handleChangeUsersStatus(type) {
      const isActive = type === 'active' ? '1' : '0'
      let confirmMsg = this.$t('PRODUCT.productConfigurationInactive')
      if (type === 'active') {
        confirmMsg = this.$t('PRODUCT.productConfigurationActive')
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return updateActiveSales({ ids: this.ids, isActive })
        })
        .then(() => {
          this.getList()
        })
        .catch(() => {})
    },
    /** 新增按钮操作 */
    handleAdd() {
      if (this.activeName === '1') {
        this.$router.push({
          path: '/productManagement/addSalesExpansionInformation',
          query: {
            timeId: Date.now()
          }
        })
      }
    },
    handleEdit() {
      this.$router.push({
        path: '/productManagement/batchEditSalesExpansionInformation',
        query: { id: this.ids.join(','), timeId: Date.now() }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }

      if (this.activeName === '1') {
        this.$router.push({
          path: '/productManagement/editSalesExpansionInformation',
          query: {
            timeId: Date.now(),
            id: row.id
          }
        })
      }
    },
    handleChangeActive(row) {
      const isActive = row.isActive === '1' ? '0' : '1'
      let confirmMsg = this.$t('PRODUCT.productConfigurationActive')
      if (row.isActive === '1') {
        confirmMsg = this.$t('PRODUCT.productConfigurationInactive')
      }
      let changeActiveFN
      if (this.activeName === '0') {
        changeActiveFN = updateActivePurchase
      } else {
        changeActiveFN = updateActiveSales
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return changeActiveFN({ ids: [row.id], isActive })
        })
        .then(() => {
          this.getList()
        })
        .catch(() => {})
    },
    /* 查看操作日志 */
    handleOperationLog(row) {},
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
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

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.id)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      // if (params.productCategoryIds && params.productCategoryIds.length > 0) {
      //   params.productCategoryIdList = params.productCategoryIds.map(
      //     (item) => item[item.length - 1]
      //   )
      // } else {
      //   params.productCategoryIdList = undefined
      // }
      if (params.productCategoryIds && params.productCategoryIds.length > 0) {
        params.productCategoryIdList = params.productCategoryIds.map((x) => x.value)
      } else {
        params.productCategoryIdList = undefined
      }
      delete params.productCategoryIds

      vm.exportLoading = true
      let exportFN
      if (this.activeName === '0') {
        exportFN = '/system/productExpansionPurchase/export'
      } else {
        exportFN = '/system/productExpansionSales/export'
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)
      this.$importOrExportDownFile(
        exportFN,
        params,
        `${this.getFileNameDate('Sales Product Info')}.xlsx`
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
