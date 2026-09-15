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
          v-hasPermi="['projectManagement:projectProduction:add']"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => seetingHandleCommand(command)"
          v-hasPermi="['projectManagement:projectProduction:edit']"
          v-if="!multiple"
          trigger="click"
        >
          <el-button size="mini" type="primary" :disabled="multiple">
            {{ $t('ui.action') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="active"
              icon="el-icon-open"
              v-hasPermi="['projectManagement:projectProduction:edit']"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="inactive"
              icon="el-icon-turn-off"
              v-hasPermi="['projectManagement:projectProduction:edit']"
              >{{ $t('uiBtn.inactiveBtn') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
      @selection-change="handleSelectionChange"
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
          <template v-else-if="item.prop === 'projectName'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'salesOrderNo'">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="salesOrder"
              @click="nav(scope.row, item.prop)"
            />
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
    <!-- <importExcelDlg ref="importExcelDlg" @onSuccess="getList" /> -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />

    <popover-svc
      ref="pop1"
      trigger="hover"
      placement="top"
      :close-delay="0"
      :visible-arrow="true"
      popper-class="pop-warp"
      :offset="-30"
    >
      <div @mouseenter="mouseenterCur($event)" class="pop-box">
        <el-table :data="popoverData.purchaseRequisiteList || []" border>
          <el-table-column
            :label="$t('PRODUCT.accessoriesName')"
            width="160"
            align="center"
            prop="productName"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.productName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('PRODUCT.productionQty')"
            width="160"
            align="center"
            prop="productionQty"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.productionQty }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </popover-svc>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import {
  querySearchList,
  queryProjectProductionList
} from '@/api/projectManagement/projectProduction'
import { Popover } from 'element-ui'
const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  name: 'ProjectProduction',
  dicts: ['project_production_status', 'approved_status', 'project_production_type'],
  mixins: [pageMixin],
  components: { popoverSvc },
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
          prop: 'projectProductionNo',
          label: vm.$t('PRODUCT.productionNo'),
          visible: true,
          minWidth: 140,
          sortable: 'custom'
        },
        {
          prop: 'salesOrderNo',
          label: vm.$t('PRODUCT.salesOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'projectProductionStatus',
          propBy: 'projectProductionStatusStr',
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
          prop: 'projectName',
          label: vm.$t('PRODUCT.associatedProjectName'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'projectProductionType',
          propBy: 'projectProductionTypeStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
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
          placeholder: `${vm.$t('PRODUCT.productionNo')} / ${vm.$t('PRODUCT.salesOrderNo')}`
        },
        {
          name: 'projectProductionStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'project_production_status',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('ui.processStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'approved_status',
          selectData: []
        },
        {
          name: 'createdIdList',
          label: vm.$t('ui.createdBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'createdId',
          selectLabel: 'createdBy',
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
      popoverData: []
    }
  },
  watch: {},
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['projectManagement:projectProduction:edit'])
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
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    nav(row) {
      this.$router.push({
        path: '/salesManagement/viewSalesOrder',
        query: {
          id: row.salesOrderId,
          timeId: Date.now()
        }
      })
    },
    showPop(e, obj) {
      this.$set(
        this.popoverData,
        'purchaseRequisiteList',
        obj.projectProductionAccessoriesList || []
      )

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
    },
    hidePop(e, obj) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {},
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
    },
    getList() {
      this.querySearchList()
      const param = { ...this.queryParams }
      this.loading = true
      queryProjectProductionList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
            item.projectProductionStatusStr = this.selectDictLabel(
              this.dict.type.project_production_status,
              item.projectProductionStatus
            )
            item.approvedStatusStr = this.selectDictLabel(
              this.dict.type.approved_status,
              item.approvedStatus
            )
            item.projectProductionTypeStr = this.selectDictLabel(
              this.dict.type.project_production_type,
              item.projectProductionType
            )
          })
          this.tableList = rows
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)

          this.total = response.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.projectTemplateStatusStr = this.selectDictLabel(
          this.dict.type.project_production_status,
          item.projectTemplateStatus
        )
        item.approvedStatusStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.approvedStatus
        )
        item.projectProductionTypeStr = this.selectDictLabel(
          this.dict.type.project_production_type,
          item.projectProductionType
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { createdList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'createdIdList') {
            this.$set(x, 'selectData', createdList)
          }
        })
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.projectProductionId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    seetingHandleCommand(command) {
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
        if (item === row.projectProductionId) {
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
        path: '/projectManagement/addProjectProduction',
        query: { timeId: +new Date() }
      })
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/projectManagement/editProjectProduction',
        query: { id: row.projectProductionId, timeId: +new Date() }
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
      this.initQueryParams()
      this.getList()
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
        params.exportIdList = vm.tableList.map((item) => item.projectProductionId)
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
