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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['productManagement:BOMManagement:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
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
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
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
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'combinationProductNo'">
            <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
              scope.row.internalPartNo
            }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="180"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['productManagement:productInfo:edit']"
            @click="handleUpdate(scope.row)"
          >
            {{ $t('uiBtn.edit') }}
          </el-button>
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
    <!-- 导入 -->
    <!-- <importExcelDlg ref="importExcelDlg" @onSuccess="getList" /> -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import { updateActive } from '@/api/productManagement/productCategory'
import { queryBomList } from '@/api/productManagement/BOMManagement'
export default {
  name: 'BOMManagement',
  dicts: ['bom_status', 'approved_status'],
  mixins: [pageMixin],
  // components: { },
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
          prop: 'bomNo',
          label: vm.$t('PRODUCT.BOMNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          align: 'left'
        },
        {
          prop: 'combinationProductNo',
          label: vm.$t('PRODUCT.combinationProductNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'combinationProductName',
          label: vm.$t('PRODUCT.combinationProductName'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'bomStatus',
          propBy: 'bomStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 150,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'approvedStatus',
          propBy: 'approvedStatusStr',
          label: vm.$t('ui.processStatus'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
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
          minWidth: 170,
          sortable: 'custom',
          visible: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 170,
          sortable: 'custom',
          visible: true
        },
        {
          prop: 'approvedBy',
          label: vm.$t('ui.approvedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedTime',
          label: vm.$t('ui.approvedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
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
          placeholder: `${vm.$t('PRODUCT.BOMSearchTip')}`
        },
        {
          name: 'bomStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'bom_status',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('ui.processStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
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
      }
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['productManagement:BOMManagement:edit'])
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
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    nav(row) {
      this.$router.push({
        path: '/productManagement/viewProductInfo',
        query: {
          id: row.productMainId,
          timeId: Date.now()
        }
      })
    },
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
      queryBomList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
            item.bomStatusStr = this.selectDictLabel(this.dict.type.bom_status, item.bomStatus)
            item.approvedStatusStr = this.selectDictLabel(
              this.dict.type.approved_status,
              item.approvedStatus
            )
          })
          this.tableList = rows

          // this.setTableIndex(this.tableList)
          this.total = response.total
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.bomStatusStr = this.selectDictLabel(this.dict.type.bom_status, item.bomStatus)
        item.approvedStatusStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.approvedStatus
        )
      })
      this.searchData.forEach((item) => {
        if (item.name === 'approvedStatusList') {
          item.selectData = this.dict.type.approved_status.filter((item) => item.value !== '4')
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    setTableIndex(arr, index = 0) {
      arr.forEach((item, key) => {
        item.coatIndex = index + 1
        if (item.child) {
          this.setTableIndex(item.child, item.coatIndex)
        }
      })
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
        path: '/productManagement/addBOMManagement',
        query: { timeId: +new Date() }
      })
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/productManagement/editBOMManagement',
        query: { id: row.bomId, timeId: +new Date() }
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
