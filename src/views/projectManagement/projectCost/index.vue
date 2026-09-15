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
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-hasPermi="['projectManagement:projectCost:export']"
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
        v-if="checkPermi(['projectManagement:projectCost:export'])"
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
          <el-tag v-else-if="item.prop === 'alert'" :type="scope.row.alert === '1' ? '' : 'danger'">
            {{ scope.row.alert === '1' ? $t('ui.y') : $t('ui.n') }}
          </el-tag>
          <el-tag
            v-else-if="item.prop === 'isDefault'"
            :type="scope.row.alert === '1' ? '' : 'danger'"
          >
            {{ scope.row.isDefault === '1' ? $t('ui.y') : $t('ui.n') }}
          </el-tag>
          <el-tag
            v-else-if="item.prop === 'consignment'"
            :type="scope.row.consignment === '1' ? '' : 'danger'"
          >
            {{ scope.row.consignment === '1' ? $t('ui.y') : $t('ui.n') }}
          </el-tag>
          <template v-else-if="item.prop === 'amount'">{{
            $numberStr(scope.row.amount, 2)
          }}</template>
          <template v-else-if="['salesInquiryNo', 'customerName'].includes(item.prop)">
            <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <!-- <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="80"
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

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />
  </div>
</template>

<script>
import {
  queryProjectCostList,
  querySearchList,
  queryProjectCostOperationLog
} from '@/api/projectManagement/projectCost'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/productManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'

export default {
  name: 'ProjectCost',
  dicts: ['approved_status', 'project_cost_status'],
  mixins: [pageMixin],
  components: { systemOperationLogTableDlg },

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
          placeholder: `${vm.$t('PRODUCT.salesInquiryNo')}`
        },
        {
          name: 'projectCostNo',
          label: vm.$t('PRODUCT.projectCostNo'),
          type: 'InputEle',
          isLine: false
        },
        {
          name: 'projectCostStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'project_cost_status',
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
          name: 'customerIdList',
          label: vm.$t('PRODUCT.customer'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'businessPartnerId',
          selectLabel: 'businessPartnerName',
          selectData: []
        },
        {
          name: 'SelectAnMultipleSelectName',
          minSelectWidth: 140,
          label: '',
          type: 'SelectAnMultipleSelect',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.createdBy'), value: 'createdIdList' },
            { label: this.$t('ui.modifiedBy'), value: 'modifiedIdList' },
            { label: this.$t('ui.approvedBy'), value: 'approvedIdList' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: 'modifiedIdList',
          inputVal: [],
          filterable: true,
          selectData2: [],
          selectValue2: 'value',
          selectLabel2: 'label'
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
          prop: 'projectCostNo',
          label: vm.$t('PRODUCT.projectCostNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true,
          fixed: true
        },
        {
          prop: 'salesInquiryNo',
          label: vm.$t('PRODUCT.salesInquiryNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'customerName',
          label: vm.$t('PRODUCT.customer'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'salesPersonBy',
          label: vm.$t('PRODUCT.salesPerson'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'projectCostStatus',
          propBy: 'projectCostStatusStr',
          label: vm.$t('ui.status'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'approvedStatus',
          propBy: 'approvedStatusStr',
          label: vm.$t('ui.processStatus'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'amount',
          label: vm.$t('PRODUCT.amount'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          align: 'right',
          sortable: 'custom',
          padding: 50
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
      ],
      createdList: [],
      approvedList: [],
      modifiedList: []
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
      return this.checkPermi(['projectManagement:projectCost:edit'])
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
    this.initQueryParams()
    this.getList()
    this.querySearchList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.queryParams.selectId = 'modifiedIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'SelectAnMultipleSelectName') {
          item.selectId = 'modifiedIdList'
          item.inputVal = []
        }
      })

      this.searchFormKey = Date.now()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.projectCostId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    // 搜索下拉值
    querySearchList() {
      querySearchList({}).then((res) => {
        const { customerList, createdList, approvedList, modifiedList } = res.data
        this.searchData.forEach((x) => {
          if (x.name === 'customerIdList') {
            this.$set(x, 'selectData', customerList)
          }
        })

        this.createdList = (createdList || []).map((item) => {
          return {
            value: item.createdId,
            label: item.createdBy
          }
        })
        this.approvedList = (approvedList || []).map((item) => {
          return {
            value: item.approvedId,
            label: item.approvedBy
          }
        })
        this.modifiedList = (modifiedList || []).map((item) => {
          return {
            value: item.modifiedId,
            label: item.modifiedBy
          }
        })
        this.setCreatedListData()
      })
    },
    setCreatedListData() {
      this.searchData.forEach((item) => {
        if (item.name === 'SelectAnMultipleSelectName') {
          if (item.selectId === 'createdIdList') {
            this.$set(item, 'selectData2', this.createdList)
          } else if (item.selectId === 'approvedIdList') {
            this.$set(item, 'selectData2', this.approvedList)
          } else if (item.selectId === 'modifiedIdList') {
            this.$set(item, 'selectData2', this.modifiedList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      params = this.$trimOfObj(params)
      queryProjectCostList(params)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
            item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
            item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
            item.approvedStatusStr = this.selectDictLabel(
              this.dict.type.approved_status,
              item.approvedStatus
            )
            item.projectCostStatusStr = this.selectDictLabel(
              this.dict.type.project_cost_status,
              item.projectCostStatus
            )
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.approvedStatusStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.approvedStatus
        )
        item.projectCostStatusStr = this.selectDictLabel(
          this.dict.type.project_cost_status,
          item.projectCostStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryProjectCostOperationLog, {
        projectCostId: row.projectCostId
      })
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
      if (item.name === 'SelectAnMultipleSelectName') {
        if (e.childType === 'all') {
          item.selectId = ''
          item.inputVal = []
          this.setCreatedListData()
        } else if (e.childType === 'select') {
          item.selectId = e.value
          item.inputVal = []
          this.setCreatedListData()
        } else {
          item.inputVal = e.value || []
        }
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.projectCostId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (this.editAuth) {
        this.$router.push({
          path: '/projectManagement/editProjectCost',
          query: {
            id: row.projectCostId,
            timeId: Date.now()
          }
        })
        return
      }
      this.$router.push({
        path: '/projectManagement/viewProjectCost',
        query: {
          id: row.projectCostId,
          timeId: Date.now()
        }
      })
    },
    nav(row, type) {
      if (type === 'salesInquiryNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesInquiry',
          query: {
            id: row.salesInquiryId,
            timeId: Date.now()
          }
        })
      } else if (type === 'customerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.customerId,
            timeId: Date.now()
          }
        })
      }
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
        params.exportIdList = vm.tableList.map((item) => item.projectCostId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/projectCost/export',
        params,
        `${this.getFileNameDate('Project Cost')}.xlsx`
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
