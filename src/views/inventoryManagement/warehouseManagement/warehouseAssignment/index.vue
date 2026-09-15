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
      v-show="showSearch"
    />

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['inventoryManagement:warehouseAssignment:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          @click="handleDelete"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="ids.length <= 0"
          v-hasPermi="['inventoryManagement:warehouseAssignment:delete']"
          >{{ $t('uiBtn.delete') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['inventoryManagement:warehouseAssignment:import']"
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
          v-hasPermi="['inventoryManagement:warehouseAssignment:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        :refreshTimeSaveKey="saveKey"
        @autoRefresh="autoRefresh"
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
    >
      <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row.isActive"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <el-switch
            v-else-if="item.prop === 'isDefault'"
            v-model="scope.row.isDefault"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="item.prop === 'warehouseType'">
            {{ selectDictLabel(dict.type.warehouse_type, scope.row.warehouseType) }}
          </template>
          <template v-else-if="item.prop === 'internalPartNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'warehouseCode'">
            <span class="primary-link" @click="nav(scope.row, 'warehouseCode')">{{
              scope.row.warehouseCode
            }}</span>
          </template>
          <template v-else-if="item.prop === 'businessPartnerNo'">
            <span class="primary-link" @click="nav(scope.row, 'businessPartnerNo')">{{
              scope.row.businessPartnerNo
            }}</span>
          </template>
          <template v-else-if="item.prop === 'createdTime'">{{
            parseTime(scope.row.createdTime, fmtForYmdhms)
          }}</template>
          <template v-else-if="item.prop === 'modifiedTime'">{{
            parseTime(scope.row.modifiedTime, fmtForYmdhms)
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        min-width="120"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.row)"
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
    <selectProductNameTable ref="selectProductNameTable" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/inventoryManagement/lang/index'
import {
  queryAssignmentList,
  deleteAssignment,
  queryActiveWarehouseList
} from '@/api/inventoryManagement/warehouseAssignment'
import { queryAllProductCategoryTreeList } from '@/api/productManagement/productCategory'
import selectProductNameTable from '@/views/inventoryManagement/warehouseManagement/warehouseAssignment/selectProductNameTable'

export default {
  name: 'WarehouseAssignment',
  dicts: ['warehouse_type'],
  mixins: [pageMixin],
  components: { selectProductNameTable },
  data() {
    const vm = this
    return {
      saveKey: '1',
      searchFormKey: Date.now(),
      loading: false,
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
      selectList: [],
      // 显示搜索条件
      showSearch: true,
      columns: [
        {
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'warehouseCode',
          label: vm.$t('INVENTORY.warehouseCode'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('INVENTORY.productName'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('INVENTORY.internalPartNo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          width: 170,
          sortable: 'custom',
          visible: true,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('ui.productSearch')}`
        },
        {
          name: 'warehouseTypeList',
          label: vm.$t('INVENTORY.warehouseType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'warehouse_type',
          selectData: []
        },
        {
          name: 'warehouseIdList',
          label: vm.$t('INVENTORY.warehouseName'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'warehouseId',
          selectLabel: 'warehouseName',
          selectData: []
        },
        {
          name: 'productCategoryId',
          label: this.$t('INVENTORY.productCategory1'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: true,
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      importOptions: {
        // 下载模板
        downFileUrl: '/inventory/warehouseAssignment/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/inventory/warehouseAssignment/checkImportData',
        // 提交导入
        importUrl: '/inventory/warehouseAssignment/importData',
        // 下载文件名
        fileName: 'Warehouse Product Exclusion List'
      }
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryActiveWarehouseList()
    this.queryAllProductCategoryTreeList()
    this.getCreateDate()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.queryActiveWarehouseList()
    this.queryAllProductCategoryTreeList()
    this.getList()
  },
  methods: {
    queryActiveWarehouseList() {
      queryActiveWarehouseList({}).then((res) => {
        this.$set(this.searchData[2], 'selectData', res.data || [])
      })
    },
    queryAllProductCategoryTreeList() {
      queryAllProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.$set(this.searchData[3], 'selectData', arr)
      })
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
    getCreateDate() {
      const timer = Date.now()
      const endDate = this.appointTime(timer, '23:59:59')
      const startDate = this.appointTime(timer - 90 * 60 * 60 * 24 * 1000, '00:00:00')
      this.$set(this.queryParams, 'dateRange', [startDate, endDate])
      this.$set(this.queryParams, 'startDateCreatedTime', startDate)
      this.$set(this.queryParams, 'endDateCreatedTime', endDate)
    },
    getList(query) {
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
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      queryAssignmentList(param)
        .then((response) => {
          this.tableList = response.rows
          this.total = response.total
          this.loading = false

          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    nav(row, type) {
      if (type === 'businessPartnerNo') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      } else if (type === 'warehouseCode') {
        this.$router.push({
          path: '/inventoryManagement/warehouseManagement/viewWarehouse',
          query: { id: row.warehouseId, timeId: +new Date() }
        })
      }
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.warehouseAssignmentId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleRowClick(row) {
      const index = this.selectList.findIndex(
        (item) => item.warehouseAssignmentId === row.warehouseAssignmentId
      )
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList.push(row)
      }
      this.ids = this.selectList.map((item) => item.warehouseAssignmentId)
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    handleAdd(row) {
      this.$refs.selectProductNameTable.handleOpen()
    },
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          return deleteAssignment({ selectIdList: this.ids })
        })
        .then(() => {
          this.$message.success(`${this.$t('ui.deleteSuccess')}`)
          this.getList()
        })
    },
    handleDelRow(row) {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          return deleteAssignment({ selectIdList: [row.warehouseAssignmentId] })
        })
        .then(() => {
          this.$message.success(`${this.$t('ui.deleteSuccess')}`)
          this.getList()
        })
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/inventoryManagement/warehouseManagement/viewWarehouse',
        query: { id: row.warehouseId, timeId: +new Date() }
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
      this.getCreateDate()
      this.$refs.tables.clearSort()
      this.getList()
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
        params.exportIdList = vm.tableList.map((item) => item.warehouseAssignmentId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/warehouseAssignment/export',
        params,
        `${this.getFileNameDate('Warehouse Product Exclusion List')}.xlsx`
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
