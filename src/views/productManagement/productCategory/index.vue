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
          v-hasPermi="['productManagement:productCategory:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => settingHandleCommand(command)"
          v-hasPermi="['productManagement:productCategory:edit']"
          v-if="!multiple"
          trigger="click"
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
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['productManagement:productCategory:import']"
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
          v-hasPermi="['productManagement:productCategory:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="collapseAllBtn">{{
          comIsAllExpanded ? $t('PRODUCT.collapseAll') : $t('PRODUCT.expandAll')
        }}</el-button>
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
      row-key="id"
      lazy
      :tree-props="{ children: 'child', hasChildren: 'hasChildren' }"
      @sort-change="handleSortChange"
      @row-dblclick="handleDblclick"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @expand-change="expandChange"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="
          checkPermi([
            'productManagement:productCategory:action',
            'productManagement:productCategory:export'
          ])
        "
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
        :min-width="item.minWidth"
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
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-hasPermi="['productManagement:productCategory:edit']"
              @click="handleUpdate(scope.row)"
            ></i>
            <i
              class="el-icon-plus pointer"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.add')"
              v-if="scope.row.coatIndex < 6"
              v-hasPermi="['productManagement:productCategory:add']"
              @click="handleAdd(scope.row)"
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
    <!-- <importExcelDlg ref="importExcelDlg" @onSuccess="getList" /> -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import {
  queryProductCategoryList,
  queryAllCategoryTreeList,
  updateActive
} from '@/api/productManagement/productCategory'
// import importExcelDlg from './importExcelDlg.vue'
export default {
  name: 'ProductCategory',
  dicts: ['role_status'],
  mixins: [pageMixin],
  // components: { importExcelDlg },
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
          prop: 'categoryName',
          label: vm.$t('PRODUCT.categoryName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          align: 'left'
        },
        {
          prop: 'uniqueNo',
          label: vm.$t('PRODUCT.categoryCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'parentName',
          label: vm.$t('PRODUCT.parentCategory1'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 100
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 170,
          visible: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 170,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 170,
          visible: true
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
          placeholder: `${vm.$t('PRODUCT.categoryName')} / ${vm.$t('PRODUCT.code')}`
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
        },
        {
          name: 'parentId',
          label: this.$t('PRODUCT.productCategory1'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'id',
          mapLabel: 'categoryName',
          checkStrictly: true,
          multiple: false,
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
        downFileUrl: '/system/productCategory/importTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/productCategory/checkImportData',
        // 提交导入
        importUrl: '/system/productCategory/importData',
        // 下载文件名
        fileName: 'Product Category'
      },
      // 当前列表所有行的key
      allRowKeys: [],
      // 历史用户手动折叠起来的行
      collapseRowKeys: []
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:role:edit'])
    },
    comIsAllExpanded() {
      const allKeys = this.allRowKeys
      const isOneCollapse = allKeys.find((key) => this.collapseRowKeys.includes(key))
      // 只要有一行是折叠起来的，则当前按钮显示全部展开
      return !isOneCollapse
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
    this.getList()
    this.queryAllCategoryTreeList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.queryAllCategoryTreeList()
  },
  methods: {
    getList() {
      this.ids = []
      this.single = true
      this.multiple = true

      const param = { ...this.queryParams }
      if (this.queryParams.parentId && this.queryParams.parentId.length > 0) {
        param.parentId = this.queryParams.parentId[this.queryParams.parentId.length - 1]
      } else {
        param.parentId = undefined
      }
      this.loading = true
      queryProductCategoryList(param)
        .then((response) => {
          this.tableList = response.rows
          this.setTableIndex(this.tableList)
          this.allRowKeys = this.getAllExpandableRowKeys(this.tableList)
          this.restoreExpand()
          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    setTableIndex(arr, index = 0) {
      arr.forEach((item, key) => {
        item.coatIndex = index + 1
        if (item.child) {
          this.setTableIndex(item.child, item.coatIndex)
        }
      })
    },
    queryAllCategoryTreeList() {
      queryAllCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.$set(this.searchData[2], 'selectData', arr)
      })
    },
    getAllExpandableRowKeys(rows) {
      let keys = []
      rows.forEach((row) => {
        if (row.child && row.child.length) {
          keys.push(row.id) // 当前行可展开
          keys = keys.concat(this.getAllExpandableRowKeys(row.child)) // 递归子节点
        }
      })
      return keys
    },
    collapseAllBtn() {
      const isExpanded = !this.comIsAllExpanded
      this.collapseAll(isExpanded)
    },
    collapseAll(isExpanded) {
      const expandRow = (rows) => {
        rows.forEach((row) => {
          this.$refs.tables.toggleRowExpansion(row, isExpanded)
          if (row.child) expandRow(row.child)
        })
      }
      expandRow(this.tableList)
    },
    /* 正常刷新数据时，保留历史折叠行,只要不在collapseRowKeys内，则默认展开 */
    restoreExpand() {
      this.$nextTick(() => {
        const expandRow = (rows) => {
          rows.forEach((row) => {
            if (this.collapseRowKeys.includes(row.id)) {
              this.$refs.tables.toggleRowExpansion(row, false)
            } else {
              this.$refs.tables.toggleRowExpansion(row, true)
            }
            if (row.child) expandRow(row.child)
          })
        }
        expandRow(this.tableList)
      })
    },
    expandChange(row, expanded) {
      const key = row.id
      if (expanded) {
        this.collapseRowKeys = this.collapseRowKeys.filter((k) => k !== key)
      } else {
        if (!this.collapseRowKeys.includes(key)) this.collapseRowKeys.push(key)
      }
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
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.salesOrderId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    handleAdd(row) {
      this.$router.push({
        path: '/productManagement/addProductCategory',
        query: { id: row.id, isActive: row.isActive, timeId: +new Date() }
      })
    },
    handleDblclick(row, column, event) {
      if (column && column.type === 'selection') {
        return
      }
      /* 展开收起的时候会触发行双击 */
      if (event && event.target && event.target.className === 'el-icon-arrow-right') {
        return
      }
      this.handleUpdate(row)
    },
    handleUpdate(row) {
      this.$router.push({
        path: '/productManagement/editProductCategory',
        query: { id: row.id, timeId: +new Date() }
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
    handleSelectAll() {
      const isAllSelected = this.$refs.tables.store.states.isAllSelected
      const _handleSelectAll = (data) => {
        data.forEach((item) => {
          this.$refs.tables.toggleRowSelection(item, isAllSelected)
          _handleSelectAll(item.child || [])
        })
      }
      _handleSelectAll(this.tableList)
    },
    handleSelect(selection, current) {
      // 判断selection中是否存在current,若是存在那么就代表是被勾选上了,若是不存在代表是取消勾选了
      const isChecked = !!selection.find((item) => item.id === current.id)
      // 如果当前项被取消勾选
      if (!isChecked) {
        // 那么其所有的祖先也应该被取消勾选
        // this.uncheckedParents(selection, current)
        // 那么其所有的后代也应该被取消勾选
        this.toggleCheckedChildrens(selection, current, false)
      } else {
        // 如果当前项被勾选
        // 那么若同一组的元素都被勾选了,那么父元素将也被勾选,依次往上类推
        // this.checkedParents(selection)
        // 那么其所有的后代都要被勾选
        this.toggleCheckedChildrens(selection, current, true)
      }
    },
    toggleCheckedChildrens(selection, item, isChecked) {
      const _toggleCheckedChildrens = (data) => {
        // eslint-disable-next-line array-callback-return
        data.find((element) => {
          this.$refs.tables.toggleRowSelection(element, isChecked)
          if (isChecked && !selection.find((item) => item.id === element.id)) {
            selection.push(element)
          } else if (!isChecked && selection.find((item) => item.id === element.id)) {
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].id === element.id) {
                selection.splice(i, 1)
                break
              }
            }
          }
          _toggleCheckedChildrens(element.child || [])
        })
      }
      _toggleCheckedChildrens(item.child || [])
    },
    checkedParents(selection) {
      const _checkedParents = (element) => {
        const children = element.child
        if (children && children.length) {
          const allChildrenChecked = children.every((child) => {
            return _checkedParents(child)
          })
          if (allChildrenChecked) {
            this.$refs.tables.toggleRowSelection(element, true)
            if (!selection.find((item) => item.id === element.id)) {
              selection.push(element)
            }
          }
        }
        return selection.find((item) => item.id === element.id)
      }
      this.tableList.forEach((element) => {
        _checkedParents(element)
      })
    },
    uncheckedParents(selection, item) {
      const _uncheckedParents = (data) => {
        return data.find((element) => {
          if (element.id === item.id) {
            return true
          } else if (_uncheckedParents(element.child || [])) {
            this.$refs.tables.toggleRowSelection(element, false)
            for (let i = selection.length - 1; i >= 0; i--) {
              if (selection[i].id === element.id) {
                selection.splice(i, 1)
                break
              }
            }
            return true
          } else {
            return false
          }
        })
      }
      _uncheckedParents(this.tableList)
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
      const userNames = this.selectList.map((item) => item.categoryName).join(', ')
      const isActive = type === 'active' ? '1' : '0'
      let confirmMsg = this.$t('PRODUCT.productCategoryInactive').replace('$1', userNames)
      if (type === 'active') {
        confirmMsg = this.$t('PRODUCT.productCategoryActive').replace('$1', userNames)
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          // eslint-disable-next-line no-undef
          return updateActive({ ids: this.ids, isActive })
        })
        .then(() => {
          this.getList()
        })
        .catch(() => {})
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
      if (this.queryParams.parentId && this.queryParams.parentId.length > 0) {
        params.parentId = this.queryParams.parentId[this.queryParams.parentId.length - 1]
      } else {
        params.parentId = undefined
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/productCategory/export',
        params,
        `${this.getFileNameDate('Product Category')}.xlsx`
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
