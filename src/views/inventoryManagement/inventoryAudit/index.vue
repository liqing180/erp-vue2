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
          @click="handleAddAudit"
          v-hasPermi="['inventoryManagement:inventoryAudit:addAudit']"
          >{{ $t('menu.addAudit') }}</el-button
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
      <!-- <el-table-column
        v-if="checkPermi(['inventoryManagement:transferOrder:export'])"
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      /> -->
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
          <template v-if="item.prop === 'qtyOnHand'">
            <template>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else-if="item.prop === 'auditQty'">
            <template>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <svg-icon
            icon-class="list2"
            class="primary-pointer"
            style="font-size: 20px"
            @click="handleOperationLog(scope.row)"
          />
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
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />
  </div>
</template>

<script>
import {
  queryInventoryAuditListForERP,
  querySearchListForERP,
  queryOperationLogList
} from '@/api/inventoryManagement/inventoryAudit'
import locale from '@/views/inventoryManagement/lang/index'
import pageMixin from '@/mixins/tableMinx'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
export default {
  name: 'InventoryAudit',
  components: { systemOperationLogTableDlg },
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
        downFileUrl: '/system/product/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/product/checkImportData',
        // 提交导入
        importUrl: '/system/product/importData',
        // 下载文件名
        fileName: 'Product Info'
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
          placeholder: `${this.$t('INVENTORY.inventoryAuditNo')}`
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
          name: 'inventoryAuditStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
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
        },
        {
          name: 'operatorIdList',
          label: this.$t('INVENTORY.operator'),
          type: 'MultipleSelectEle',
          filterable: true,
          multiple: false,
          selectValue: 'operatorId',
          selectLabel: 'operatorBy',
          selectData: []
        },
        {
          name: 'dateRange1',
          label: vm.$t('INVENTORY.time'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateOperatorTime',
          endDate: 'endDateOperatorTime'
        },
        {
          name: 'dateRange2',
          label: vm.$t('ui.approvedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateApprovedTime',
          endDate: 'endDateApprovedTime'
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'inventoryAuditNo',
          label: vm.$t('INVENTORY.inventoryAuditNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'inventoryAuditStatus',
          propBy: 'inventoryAuditStatusStr',
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
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'inventoryAuditType',
          propBy: 'inventoryAuditTypeStr',
          label: vm.$t('INVENTORY.documentType'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'startEndTime',
          label: vm.$t('INVENTORY.startEndTime'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'totalProduct',
          label: vm.$t('INVENTORY.totalProduct'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        /* {
          prop: 'qtyOnHand',
          label: vm.$t('INVENTORY.qtyOnHand'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'auditQty',
          label: vm.$t('INVENTORY.auditQTY'),
          minWidth: 160,
          padding: 60,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        }, */
        {
          prop: 'operatorBy',
          label: vm.$t('INVENTORY.operator'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'operatorTime',
          label: vm.$t('INVENTORY.time'),
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

      statusDicts: [],
      approvedStatusDicts: [],
      inventoryAuditTypeDicts: []
    }
  },
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
  },
  async created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    const a = this.MyDictDataClass.getDictFn('inventory_audit_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    const c = this.MyDictDataClass.getDictFn('inventory_audit_type')
    await Promise.all([a, b, c]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      const res3 = res[2] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.approvedStatusDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.inventoryAuditTypeDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData.forEach((item) => {
      if (item.name === 'inventoryAuditStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryOperationLogList, {
        inventoryAuditId: row.inventoryAuditId
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.transferOrderId) {
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
      this.$store.dispatch('getInventoryTaskCount')
      this.querySearchListForERP()
      this.loading = true
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)

      queryInventoryAuditListForERP(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.scheduledTransferDate = this.parseTime(item.scheduledTransferDate, this.fmtForYmdhms)
          item.dateStockOut = this.parseTime(item.dateStockOut, this.fmtForYmdhms)
          item.dateStockIn = this.parseTime(item.dateStockIn, this.fmtForYmdhms)
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.operatorTime = this.parseTime(item.operatorTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          if (item.startTime && item.endTime) {
            item.startEndTime = `${this.parseTime(
              item.startTime,
              this.fmtForYmd
            )} - ${this.parseTime(item.endTime, this.fmtForYmd)}`
          }

          item.inventoryAuditStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.inventoryAuditStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
          )
          item.inventoryAuditTypeStr = this.selectDictLabel(
            this.inventoryAuditTypeDicts,
            item.inventoryAuditType
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    querySearchListForERP() {
      querySearchListForERP({}).then((res) => {
        const data = res.data || {}
        const warehouseList = data.warehouseList || []
        const operatorList = data.operatorList || []
        this.searchData.forEach((item) => {
          if (item.name === 'operatorIdList') {
            this.$set(item, 'selectData', operatorList)
          } else if (item.name === 'warehouseIdList') {
            this.$set(item, 'selectData', warehouseList)
          }
        })
      })
    },

    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {},

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.transferOrderId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAddAudit() {
      this.$router.push({
        path: '/inventoryManagement/addInventoryAudit',
        query: {
          timeId: Date.now()
        }
      })
    },
    /* handleAddAdjustment() {
      this.$router.push({
        path: '/warehouseManagement/addInventoryAdjustment',
        query: {
          timeId: Date.now()
        }
      })
    }, */
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (row.inventoryAuditType === '2') {
        this.$router.push({
          path: '/inventoryManagement/editInventoryAdjustment',
          query: {
            id: row.inventoryAuditId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/inventoryManagement/editInventoryAudit',
          query: {
            id: row.inventoryAuditId,
            timeId: Date.now()
          }
        })
      }
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
        params.exportIdList = vm.tableList.map((item) => item.transferOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/inventory/transferOrder/export',
        params,
        `${this.getFileNameDate('Inventory Audit')}.xlsx`
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
