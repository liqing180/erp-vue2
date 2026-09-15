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
          v-hasPermi="['businessPartner:businessPartner:add']"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-dropdown
          @command="(command) => seetingHandleCommand(command)"
          v-hasPermi="['businessPartner:businessPartner:edit']"
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
              v-hasPermi="['businessPartner:businessPartner:edit']"
              >{{ $t('uiBtn.activeBtn') }}
            </el-dropdown-item>
            <el-dropdown-item
              command="inactive"
              icon="el-icon-turn-off"
              v-hasPermi="['businessPartner:businessPartner:edit']"
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
          v-hasPermi="['businessPartner:businessPartner:import']"
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
          v-hasPermi="['businessPartner:businessPartner:export']"
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
      row-key="businessPartnerMainIdKey"
      :tree-props="{ children: 'reviseList', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      :cellClassName="cellClassName"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="
          checkPermi([
            'businessPartner:businessPartner:export',
            'businessPartner:businessPartner:edit'
          ])
        "
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.indexI }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in getVisibleColumn(visibleColumn)"
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
          <template v-else-if="item.prop === 'shippingAgent'">
            <el-tag v-if="scope.row.shippingAgent === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.shippingAgent === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'businessPartnerName'">
            <div class="flexSb flex-1">
              <div class="flow1" :title="scope.row.businessPartnerName">
                {{ scope.row.businessPartnerName }}
              </div>
              <div
                v-if="scope.row.trademarkUrl"
                style="flex-shrink: 0; line-height: 0; width: 30px; height: 30px"
              >
                <el-image
                  style="width: 100%; height: 100%"
                  :src="scope.row.trademarkUrl"
                  :preview-src-list="[scope.row.trademarkUrl]"
                  fit="scale-down"
                  @click.stop="preview"
                />
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'businessPartnerStatus'">
            <div class="flexStart">
              <span class="flow1">{{ scope.row[item.propBy] }}</span>
              <span
                class="inReviseIcon"
                :title="$t('ui.inRevision')"
                v-if="scope.row.isRevise === '1' && scope.row.approvedStatus === '1'"
              >
                <svg-icon icon-class="in-revision" />
              </span>
            </div>
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
    <!-- 导入 -->
    <importExcelDlg ref="importExcelDlg" @onSuccess="getList" />

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </div>
</template>

<script>
import {
  queryBusinessPartnerList,
  changeBPIsActive,
  querySearchList
} from '@/api/businessPartner/businessPartner'
import pageMixin from '@/mixins/tableMinx'
import importExcelDlg from './importExcelDlg.vue'
import locale from '@/views/businessPartner/lang/index'

export default {
  name: 'BusinessPartner',
  dicts: [
    'bp_business_partner_status',
    'approved_status',
    'bp_supplier_type',
    'bp_supplier_group',
    'bp_customer_type',
    'bp_customer_group'
  ],
  mixins: [pageMixin],
  components: { importExcelDlg },
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
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: vm.$t('ui.userImport'),
        // 是否禁用上传
        isUploading: false,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
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
          placeholder: vm.$t('ui.bpSearch1')
        },

        {
          name: 'businessPartnerStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'bp_business_partner_status',
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
        // {
        //   name: 'supplierTypeList',
        //   label: vm.$t('ui.supplierType'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_supplier_type',
        //   selectData: []
        // },
        // {
        //   name: 'supplierGroupList',
        //   label: vm.$t('ui.supplierGroup'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_supplier_group',
        //   selectData: []
        // },
        // {
        //   name: 'customerTypeList',
        //   label: vm.$t('ui.customerType'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_customer_type',
        //   selectData: []
        // },
        // {
        //   name: 'customerGroupList',
        //   label: vm.$t('ui.customerGroup'),
        //   type: 'MultipleSelectEle',
        //   width: '200px',
        //   selectValue: 'dictValue',
        //   selectLabel: 'dictLabel',
        //   dict: 'bp_customer_group',
        //   selectData: []
        // },
        {
          name: 'businessPartnerTypeList',
          label: vm.$t('bp.businessPartnerType'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: [
            {
              dictLabel: vm.$t('ui.customer'),
              dictValue: '0'
            },
            {
              dictLabel: vm.$t('ui.supplier'),
              dictValue: '1'
            }
          ]
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
          name: 'countryIdList',
          label: vm.$t('ui.country'),
          type: 'MultipleSelectEle',
          filterable: true,
          selectValue: 'countryId',
          selectLabel: 'country',
          width: '200px',
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
          name: 'shippingAgentList',
          label: vm.$t('bp.shippingAgent'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'system_active',
          selectData: []
        }
      ],
      // 列信息
      columns: [
        {
          prop: 'businessPartnerNoShowStr',
          label: vm.$t('ui.businessPartnerCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('ui.businessPartnerName'),
          visible: true,
          minWidth: 200,
          padding: 70,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'abbreviation',
          label: vm.$t('ui.abbreviation'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerStatus',
          propBy: 'businessPartnerStatusStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 40,
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
          prop: 'supplierType',
          propBy: 'supplierTypeStr',
          label: vm.$t('ui.supplierType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'supplierGroup',
          propBy: 'supplierGroupStr',
          label: vm.$t('ui.supplierGroup'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'customerType',
          propBy: 'customerTypeStr',
          label: vm.$t('ui.customerType'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'customerGroup',
          propBy: 'customerGroupStr',
          label: vm.$t('ui.customerGroup'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'country',
          label: vm.$t('ui.country'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'currency',
        //   label: vm.$t('ui.currency'),
        //   minWidth: 200,
        //   visible: true,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'currencyCodeForSupplier',
          label: vm.$t('bp.supplierCurrency'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'currencyCodeForCustomer',
          label: vm.$t('bp.customerCurrency'),
          minWidth: 140,
          visible: true,
          tooltip: true
        },
        {
          prop: 'mobilePhone',
          label: vm.$t('ui.phone'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },

        {
          prop: 'email',
          label: vm.$t('ui.email'),
          minWidth: 140,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'shippingAgent',
          label: vm.$t('bp.shippingAgent'),
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
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'BusinessPartner') {
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
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)

    if (this.createdInitTimer && Date.now() - (this.createdInitTimer || 0) < 2000) return
    this.createdInitTimer = Date.now()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            colWidth: item.colWidth + 30
          }
        }
        return item
      })
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (
        column.property === 'businessPartnerName' ||
        column.property === 'businessPartnerStatus'
      ) {
        cellClass = 'bp-name-flex-cell'
      }
      return cellClass
    },
    preview() {},
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.businessPartnerMainId) {
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
      querySearchList({}).then((res) => {
        const projectDictList = res.data.countryList || []
        this.searchData.forEach((item) => {
          if (item.name === 'countryIdList') {
            this.$set(item, 'selectData', projectDictList)
          }
        })
      })
      this.loading = true
      let params = { ...this.queryParams }
      params = this.$trimOfObj(params)

      queryBusinessPartnerList(params).then((response) => {
        const rows = response.rows
        rows.forEach((item, index) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.indexI = (this.queryParams.pageNum - 1) * this.queryParams.pageSize + index + 1
          // item.businessPartnerMainId = item.businessPartnerMainId + index
          item.businessPartnerMainIdKey = item.businessPartnerMainId + index
          this.setItemDict(item)
          if (item.reviseList) {
            item.reviseList.forEach((child) => {
              child.createdTime = this.parseTime(child.createdTime, this.fmtForYmdhms)
              child.modifiedTime = this.parseTime(child.modifiedTime, this.fmtForYmdhms)
              child.approvedTime = this.parseTime(child.approvedTime, this.fmtForYmdhms)
              child.businessPartnerMainIdKey = child.businessPartnerMainId + index
              this.setItemDict(child)
            })
          }
        })
        this.tableList = rows
        this.total = response.total
        this.loading = false
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },

    onDictReady() {
      this.tableList.forEach((item) => {
        this.setItemDict(item)

        if (item.reviseList) {
          item.reviseList.forEach((child) => {
            this.setItemDict(child)
          })
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    setItemDict(item) {
      item.businessPartnerStatusStr = this.selectDictLabel(
        this.dict.type.bp_business_partner_status,
        item.businessPartnerStatus
      )
      item.approvedStatusStr = this.selectDictLabel(
        this.dict.type.approved_status,
        item.approvedStatus
      )
      item.supplierTypeStr = this.selectDictLabel(
        this.dict.type.bp_supplier_type,
        item.supplierType
      )
      item.supplierGroupStr = this.selectDictLabel(
        this.dict.type.bp_supplier_group,
        item.supplierGroup
      )
      item.customerTypeStr = this.selectDictLabel(
        this.dict.type.bp_customer_type,
        item.customerType
      )
      item.customerGroupStr = this.selectDictLabel(
        this.dict.type.bp_customer_group,
        item.customerGroup
      )
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
      this.ids = selection.map((item) => item.businessPartnerMainId)
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
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/businessPartner/addBusinessPartner',
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
        path: '/businessPartner/editBusinessPartner',
        query: {
          id: row.businessPartnerMainId,
          timeId: Date.now()
        }
      })
    },

    /** 批量修改用户状态 */
    handleChangeUsersStatus(type) {
      const names = this.selectList.map((item) => item.businessPartnerName).join(', ')
      const isActive = type === 'active' ? '1' : '0'
      let confirmMsg = this.$t('bp.changeBPInactive').replace('$1', names)
      if (type === 'active') {
        confirmMsg = this.$t('bp.changeBPActive').replace('$1', names)
      }
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return changeBPIsActive(this.ids, isActive)
        })
        .then(() => {
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {})
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
        params.exportIdList = vm.tableList.map((item) => item.businessPartnerMainId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/system/businessPartner/export',
        params,
        `${this.getFileNameDate('Business Partner')}.xlsx`
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
      this.$refs.importExcelDlg.show()
    }
  }
}
</script>
<style lang="scss">
/* 处理特殊单元格内容与展开折叠列的样式冲突 */
.bp-name-flex-cell {
  .cell {
    display: flex;
    align-items: center;
  }
}
</style>
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

.flow1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
