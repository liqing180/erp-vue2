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
          v-hasPermi="['projectManagement:project:add']"
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
      @selection-change="handleSelectionChange"
      :max-height="600"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="55"
        :selectable="selectable"
        align="center"
        v-if="false"
      />
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
          <template v-else-if="item.prop === 'actualCostNew'">
            <div class="ellipsis-text primary-link" @click="nav(scope.row)">
              {{ scope.row[item.prop] }}
            </div>
          </template>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <ToolTipShowList
              :list="(scope.row.businessPartnerList || []).map((x) => x.businessPartnerName)"
              popoverTitle=""
            >
              <div class="ellipsis-text">{{ scope.row.businessPartnerName }}</div>
            </ToolTipShowList>
          </template>
          <template v-else-if="item.prop === 'salesAmount'">
            <div class="ellipsis-text primary-link" @click="nav(scope.row)">
              {{ scope.row[item.prop] }}
            </div>
          </template>
          <template v-else-if="item.prop === 'projectProgress'">
            <div v-if="$resultOfBoolean(scope.row[item.prop])">
              {{ $numberStr(scope.row[item.prop], 2) }}%
            </div>
          </template>
          <!-- <template v-else-if="item.prop === 'profit'">
            <div v-if="$resultOfBoolean(scope.row[item.prop])">
              {{ $numberStr(Math.abs(scope.row[item.prop]), 2) }}
            </div>
          </template> -->
          <template v-else-if="item.prop === 'profitLoss'">
            <div v-if="$resultOfBoolean(scope.row.profit)">
              {{ scope.row.profit >= 0 ? $t('PRODUCT.profit1') : $t('PRODUCT.loss') }}
            </div>
          </template>
          <template v-else-if="item.prop === 'costProjectDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/salesManagement/lang/index'

import { querySearchList, queryCostProjectList } from '@/api/projectManagement/project'
export default {
  name: 'Project',
  dicts: ['project_template_status', 'cost_project_status'],

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
          prop: 'costProjectCode',
          label: vm.$t('PRODUCT.projectCode'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'costProjectName',
          label: vm.$t('PRODUCT.projectName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'costProjectDescription',
          label: vm.$t('PRODUCT.projectDescription'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customer'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'actualCostNew',
          label: vm.$t('PRODUCT.actualCost'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'salesAmount',
          label: vm.$t('PRODUCT.salesAmount'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'receivedAmount',
          label: vm.$t('SALES.receivedAmount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        /* {
          prop: 'profitLoss',
          label: vm.$t('PRODUCT.profitLoss'),
          visible: true,
          minWidth: 150,
          tooltip: true
          // sortable: 'custom'
        }, */
        {
          prop: 'profit',
          label: vm.$t('PRODUCT.amount'),
          visible: true,
          minWidth: 150,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'profitMargin',
          label: vm.$t('SALES.profitMargin'),
          visible: true,
          minWidth: 150,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'projectProgress',
          label: vm.$t('SALES.collectionProgress'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'costProjectStatus',
          propBy: 'costProjectStatusStr',
          label: vm.$t('ui.status'),
          minWidth: 170,
          visible: true,
          sortable: 'custom',
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
          placeholder: `${vm.$t('PRODUCT.projectTemplateSearch')}`
        },
        {
          name: 'businessPartnerIdList',
          label: vm.$t('SALES.customer'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDate',
          endDate: 'endDate'
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
      return this.checkPermi(['projectManagement:project:edit'])
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
    getList() {
      this.querySearchList()
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
      queryCostProjectList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.actualCostNew = this.$numberStr(item.actualCostNew, 2)
            item.salesAmount = this.$numberStr(item.salesAmount, 2)
            item.receivedAmount = this.$numberStr(item.receivedAmount, 2)
            item.profit = this.$numberStr(item.profit, 2)
            // item.profit = this.$numberStr(Math.abs(item.profit), 2)
            item.profitMargin = this.$numberStr(item.profitMargin, 2)
            item.projectTemplateStatusStr = this.selectDictLabel(
              this.dict.type.project_template_status,
              item.projectTemplateStatus
            )
            item.costProjectStatusStr = this.selectDictLabel(
              this.dict.type.cost_project_status,
              item.costProjectStatus
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
          this.dict.type.project_template_status,
          item.projectTemplateStatus
        )
        item.costProjectStatusStr = this.selectDictLabel(
          this.dict.type.cost_project_status,
          item.costProjectStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { businessPartnerList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'businessPartnerIdList') {
            this.$set(x, 'selectData', businessPartnerList)
          }
        })
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.costProjectId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
        if (item === row.costProjectId) {
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
        path: '/projectManagement/addProject',
        query: { timeId: +new Date() }
      })
    },
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/projectManagement/editProject',
        query: { id: row.costProjectId, timeId: +new Date() }
      })
    },
    nav(row, type) {
      this.$router.push({
        path: '/projectManagement/viewDetail',
        query: {
          id: row.costProjectId,
          costProjectName: row.costProjectName,
          costProjectCode: row.costProjectCode,
          timeId: +new Date()
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
        params.exportIdList = vm.tableList.map((item) => item.costProjectId)
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
