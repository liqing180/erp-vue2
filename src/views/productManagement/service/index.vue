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
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['productManagement:service:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['productManagement:service:import']"
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
          v-hasPermi="['productManagement:service:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
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
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="checkPermi(['productManagement:service:export'])"
        type="selection"
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
          <template v-else-if="item.prop === 'categoryNameShowStr'">
            <ToolTipShowCategory :list="scope.row.categoryNameList || []">
              <div class="flow1">{{ scope.row[item.prop] }}</div>
            </ToolTipShowCategory>
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
            v-hasPermi="['productManagement:service:edit']"
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
    <!-- 导入 -->
    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </div>
</template>

<script>
import { queryServiceList } from '@/api/productManagement/service'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
export default {
  name: 'Service',
  dicts: ['ivt_service_status', 'approved_status', 'service_type', 'valuation_unit'],
  mixins: [pageMixin],
  data() {
    const vm = this

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
      // 日期范围
      dateRange: [],
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/system/service/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/service/checkImportData',
        // 提交导入
        importUrl: '/system/service/importData',
        // 下载文件名
        fileName: 'Service'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${this.$t('PRODUCT.serviceSearch')}`
        },

        {
          name: 'serviceStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'ivt_service_status',
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
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        },
        {
          name: 'serviceTypeList',
          label: vm.$t('PRODUCT.serviceType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'service_type',
          selectData: []
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'serviceName',
          label: vm.$t('PRODUCT.serviceName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'serviceNo',
          label: vm.$t('PRODUCT.serviceNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'serviceStatus',
          propBy: 'serviceStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
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
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'categoryNameShowStr',
          label: vm.$t('PRODUCT.productCategory'),
          visible: true,
          minWidth: 200
          // tooltip: true
          // sortable: 'custom' // 不能排序
        },
        {
          prop: 'serviceType',
          propBy: 'serviceTypeStr',
          label: vm.$t('PRODUCT.serviceType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'valuationAmount',
          label: vm.$t('PRODUCT.amount'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom',
          align: 'right'
        },
        {
          prop: 'valuationCurrency',
          label: vm.$t('ui.currency'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'valuationUnit',
          propBy: 'valuationUnitStr',
          label: vm.$t('PRODUCT.salesUnit'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
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
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
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
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['organization:user:edit'])
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
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.serviceMainId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.adminFlag === 1) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    /** 查询用户列表 */
    getList() {
      /* querySearchList({}).then((res) => {
        const projectDictList = res.data.countryList || []
        this.searchData.forEach((item) => {
          if (item.name === 'countryIdList') {
            this.$set(item, 'selectData', projectDictList)
          }
        })
      }) */
      this.loading = true
      // const params = this.$trimOfObj(this.queryParams)
      let params = { ...this.queryParams }

      params = this.$trimOfObj(params)
      queryServiceList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.valuationAmount = this.$numberStr(item.valuationAmount, 2)
          item.serviceStatusStr = this.selectDictLabel(
            this.dict.type.ivt_service_status,
            item.serviceStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.dict.type.approved_status,
            item.approvedStatus
          )
          item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
          item.valuationUnitStr = this.selectDictLabel(
            this.dict.type.valuation_unit,
            item.valuationUnit
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.serviceStatusStr = this.selectDictLabel(
          this.dict.type.ivt_service_status,
          item.serviceStatus
        )
        item.approvedStatusStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.approvedStatus
        )
        item.serviceTypeStr = this.selectDictLabel(this.dict.type.service_type, item.serviceType)
        item.valuationUnitStr = this.selectDictLabel(
          this.dict.type.valuation_unit,
          item.valuationUnit
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
    updateSearchData(e) {
      if (e.childType === 'select') {
        this.searchData[e.index].selectId = e.value
        this.searchData[e.index].date = []
      } else {
        this.searchData[e.index].date = e.value
      }
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.serviceMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/productManagement/addService',
        query: {
          timeId: Date.now()
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/productManagement/editService',
        query: {
          id: row.serviceMainId,
          timeId: Date.now()
        }
      })
    },

    /** 导出按钮操作 */
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
        params.exportIdList = vm.tableList.map((item) => item.serviceMainId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/service/exportService',
        params,
        `${this.getFileNameDate('Service')}.xlsx`
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

<style lang="scss" scoped>
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
    margin-right: 10px;
  }
}
.dept-select {
  /deep/ .vue-treeselect--disabled .vue-treeselect__control {
    background-color: #f5f7fa;
  }
  /deep/ .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
