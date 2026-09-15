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
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['salesManagement:serviceOrder:import']"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['salesManagement:serviceOrder:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
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
          v-hasPermi="['salesManagement:serviceOrder:export']"
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
        v-if="checkPermi(['salesManagement:serviceOrder:export'])"
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
          <template v-else-if="['salesQuotationNo'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="salesQuotation"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="['salesOrderNo'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="salesOrder"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="['businessPartnerName'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="120"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <svg-icon
              icon-class="list2"
              class="primary-pointer"
              style="font-size: 20px"
              @click="handleOperationLog(scope.row)"
            />
          </div>
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
  queryServiceOrderList,
  querySearchList,
  queryServiceOrderOperationLog
} from '@/api/salesManagement/serviceOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
export default {
  name: 'ServiceOrder',
  dicts: ['service_order_status', 'service_order_type'],
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
        downFileUrl: '/sales/salesPriceStrategy/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/salesPriceStrategy/checkImportData',
        // 提交导入
        importUrl: '/sales/salesPriceStrategy/importData',
        // 下载文件名
        fileName: 'salesPriceStrategy'
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
          placeholder: `${this.$t('ui.customerSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('SALES.serviceOrderNo'), value: 'conditionForServiceOrder' },
            { label: this.$t('SALES.SQNo'), value: 'conditionForSQ' },
            { label: this.$t('SALES.salesOrderNo'), value: 'conditionForSO' },
            { label: this.$t('SALES.jobSheetNo'), value: 'conditionForJS' },
            { label: this.$t('SALES.storeIssueChitNo'), value: 'conditionForStoreIssueChitNo' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: '',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
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
          name: 'modifiedIdList',
          label: vm.$t('ui.modifiedBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'modifiedId',
          selectLabel: 'modifiedBy',
          selectData: []
        },
        {
          name: 'serviceOrderStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'service_order_status',
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
          name: 'dateRange1',
          label: vm.$t('ui.modifiedTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateModifiedTime',
          endDate: 'endDateModifiedTime'
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'serviceOrderNo',
          label: vm.$t('SALES.serviceOrderNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('SALES.customerName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'serviceOrderStatus',
          propBy: 'serviceOrderStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'jobSheetNo',
          label: vm.$t('SALES.jobSheetNo1'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesQuotationNo',
          label: vm.$t('SALES.salesQuotationNo'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesOrderNo',
          label: vm.$t('SALES.salesOrderNo'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'storeIssueChitNo',
          label: vm.$t('SALES.storeIssueChitNo'),
          minWidth: 160,
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
        }
        // {
        //   prop: 'approvedBy',
        //   label: vm.$t('ui.approvedBy'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        // {
        //   prop: 'approvedTime',
        //   label: vm.$t('ui.approvedTime'),
        //   minWidth: 160,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // }
      ],
      conditionForServiceOrderNoList: [],
      conditionForSQList: [],
      conditionForSOList: [],
      conditionForJobSheetNoList: [],
      conditionForStoreIssueChitNoList: []
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
      return this.checkPermi(['salesManagement:serviceOrder:edit'])
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
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.queryParams.selectId = 'conditionForServiceOrder'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForServiceOrder'
          item.inputVal = ''
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.serviceOrderId) {
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
      this.querySearchList()
      this.loading = true
      // const params = this.$trimOfObj(this.queryParams)
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)
      queryServiceOrderList(params).then((response) => {
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.storeIssueChitNo = item.storeIssueChitNo || 'N/A'
          item.serviceOrderStatusStr = this.selectDictLabel(
            this.dict.type.service_order_status,
            item.serviceOrderStatus
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
        item.serviceOrderStatusStr = this.selectDictLabel(
          this.dict.type.service_order_status,
          item.serviceOrderStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    querySearchList() {
      querySearchList({}).then((res) => {
        const data = res.data || {}
        const createdList = data.createdList || []
        const modifiedList = data.modifiedList || []
        this.searchData.forEach((item) => {
          if (item.name === 'modifiedIdList') {
            this.$set(item, 'selectData', modifiedList)
          } else if (item.name === 'createdIdList') {
            this.$set(item, 'selectData', createdList)
          }
        })
        this.conditionForServiceOrderNoList = (data.conditionForServiceOrderNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.conditionForSQList = (data.conditionForSQList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForSOList = (data.conditionForSOList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForJobSheetNoList = (data.conditionForJobSheetNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForStoreIssueChitNoList = (data.conditionForStoreIssueChitNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )

        this.setFuzzyData()
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
    resetSearchForm() {
      this.initQueryParams()
      this.$refs.tables.clearSort()
      this.getList()
    },
    updateSearchData(e) {
      const item = this.searchData[e.index]
      if (item.name === 'selectAnInputName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = ''
          this.setFuzzyData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = ''
          this.setFuzzyData()
        } else {
          item.inputVal = e.value || ''
        }
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForServiceOrder') {
            this.$set(item, 'fuzzyData', this.conditionForServiceOrderNoList || [])
          } else if (item.selectId === 'conditionForSQ') {
            this.$set(item, 'fuzzyData', this.conditionForSQList || [])
          } else if (item.selectId === 'conditionForSO') {
            this.$set(item, 'fuzzyData', this.conditionForSOList || [])
          } else if (item.selectId === 'conditionForJS') {
            this.$set(item, 'fuzzyData', this.conditionForJobSheetNoList || [])
          } else if (item.selectId === 'conditionForStoreIssueChitNo') {
            this.$set(item, 'fuzzyData', this.conditionForStoreIssueChitNoList || [])
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.serviceOrderId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/salesManagement/addServiceOrder',
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
      if (this.editAuth) {
        this.$router.push({
          path: '/salesManagement/editServiceOrder',
          query: {
            id: row.serviceOrderId,
            timeId: Date.now()
          }
        })
        return
      }
      this.$router.push({
        path: '/salesManagement/viewServiceOrder',
        query: {
          id: row.serviceOrderId,
          timeId: Date.now()
        }
      })
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'salesQuotationNo') {
        this.$router.push({
          path: '/salesManagement/editSalesQuotation',
          query: {
            id: row.salesQuotationMainId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      }
      if (type === 'salesOrderNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesOrder',
          query: {
            id: row.salesOrderId,
            timeId: Date.now()
          }
        })
      }
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      }
    },

    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryServiceOrderOperationLog, {
        serviceOrderId: row.serviceOrderId
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
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.serviceOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/serviceOrder/export',
        params,
        `${this.getFileNameDate('Service Order')}.xlsx`
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
