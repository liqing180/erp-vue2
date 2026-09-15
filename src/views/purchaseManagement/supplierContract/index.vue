<template>
  <div class="app-container">
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :isBtn="true"
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="addAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        @autoRefresh="autoRefresh"
        :refreshTimeSaveKey="'1'"
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
      max-height="500"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="exportAuth"
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
          <template v-if="item.prop === 'documentNoListShowStr'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="primary-link ellipsis-text">
                {{ scope.row.documentNoListShowStr }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'businessPartnerNo'">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, 'businessPartnerNo')"
            />
          </template>
          <template v-else-if="item.prop === 'purchaseAmount'">
            {{ $numberStr(scope.row.purchaseAmount, 2) }}
          </template>
          <template v-else-if="item.prop === 'totalAmount'">
            {{ $numberStr(scope.row.totalAmount, 2) }}
          </template>
          <template v-else-if="item.prop === 'supplierContractNo'">
            <div class="flexSb">
              <div class="flow1" :title="scope.row.supplierContractNo">
                {{ scope.row.supplierContractNo }}
              </div>
              <div
                v-if="scope.row.commonFileList && scope.row.commonFileList.length > 0"
                class="flexCen"
                style="
                  flex-shrink: 0;
                  width: 30px;
                  height: 30px;
                  font-size: 22px;
                  color: #1890ff;
                  cursor: pointer;
                "
                @click="preview(scope.row.commonFileList)"
              >
                <i class="el-icon-folder-opened"></i>
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'po'">
            <div class="flexSb">
              <div class="flow1" :title="scope.row.po">
                {{ scope.row.po }}
              </div>
              <div
                v-if="scope.row.commonPOFileList && scope.row.commonPOFileList.length > 0"
                class="flexCen"
                style="
                  flex-shrink: 0;
                  width: 30px;
                  height: 30px;
                  font-size: 22px;
                  color: #1890ff;
                  cursor: pointer;
                "
                @click="preview(scope.row.commonPOFileList)"
              >
                <i class="el-icon-folder-opened"></i>
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'so'">
            <div class="flexSb">
              <div class="flow1" :title="scope.row.so">
                {{ scope.row.so }}
              </div>
              <div
                v-if="scope.row.commonSOFileList && scope.row.commonSOFileList.length > 0"
                class="flexCen"
                style="
                  flex-shrink: 0;
                  width: 30px;
                  height: 30px;
                  font-size: 22px;
                  color: #1890ff;
                  cursor: pointer;
                "
                @click="preview(scope.row.commonSOFileList)"
              >
                <i class="el-icon-folder-opened"></i>
              </div>
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

    <SendPODlg ref="SendPODlg" @submitSuccess="getList" />

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="documentClick" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import { querySupplierContractList } from '@/api/purchaseManagement/supplierContract'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import SendPODlg from '@/views/purchaseManagement/purchaseOrder/sendPODlg.vue'
export default {
  name: 'SupplierContract',
  mixins: [pageMixin],
  dicts: ['supplier_contract_status'],
  components: { systemOperationLogTableDlg, ToolTipShowListForFN, SendPODlg },
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      columns: [
        {
          prop: 'supplierContractNo',
          label: vm.$t('PURCHASE.supplierContractNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          padding: 70
        },
        {
          prop: 'po',
          label: vm.$t('PURCHASE.po'),
          visible: true,
          minWidth: 160,
          tooltip: false,
          padding: 70
        },
        {
          prop: 'so',
          label: vm.$t('PURCHASE.so'),
          visible: true,
          minWidth: 160,
          tooltip: false,
          padding: 70
        },
        {
          prop: 'businessPartnerName',
          label: vm.$t('PURCHASE.supplierName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'businessPartnerNo',
          label: vm.$t('PURCHASE.supplierCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'abbreviation',
          label: vm.$t('ui.abbreviation'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'country',
          label: vm.$t('PURCHASE.country'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseOrderNo',
          label: vm.$t('PURCHASE.purchaseOrder'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'purchaseAmount',
          label: vm.$t('PURCHASE.amount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'contractDate',
          label: vm.$t('PURCHASE.contractDate'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'deliveryDate',
          label: vm.$t('PURCHASE.deliveryDate'),
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
        }
      ],
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.supplierContractNo')} / ${vm.$t('PURCHASE.po')} / ${vm.$t(
            'PURCHASE.so'
          )} / ${vm.$t('PURCHASE.supplierName')} / ${vm.$t('PURCHASE.purchaseOrder')} / ${vm.$t(
            'ui.abbreviation'
          )}`
        },
        {
          name: 'contractDate',
          label: vm.$t('PURCHASE.contractDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateContractDate',
          endDate: 'endDateContractDate'
        },
        {
          name: 'deliveryDate',
          label: vm.$t('PURCHASE.deliveryDate'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateDeliveryDate',
          endDate: 'endDateDeliveryDate'
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
          name: 'supplierContractStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'supplier_contract_status',
          selectData: []
        }
      ],
      // 请求的时间戳
      queryTime: undefined,
      searchFormKey: Date.now()
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['purchaseManagement:supplierContract:add'])
    },
    sendAuth() {
      return this.checkPermi(['purchaseManagement:supplierContract:sendPO'])
    },
    exportAuth() {
      return this.checkPermi(['purchaseManagement:supplierContract:export'])
    },
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

    // $$initColumnVisible 在 ./tableDataMixin.js 调用了
    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    preview(file) {
      const { url } = file[0]
      window.open(url, '_blank')
    },
    showPop(e, row) {
      const list = row.documentMsgList || []
      const params = {
        popoverTitle: this.$t('PURCHASE.DocNo'),
        labelKey: 'documentNo',
        itemClass: 'primary-pointer',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    documentClick(item) {
      console.log(item)
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (item.priceType === '0') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseRequisition',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      } else if (item.priceType === '1') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseQuotation',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      } else if (item.priceType === '2') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseContract',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      } else if (item.priceType === '3') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseOrder',
          query: {
            id: item.documentId,
            timeId: Date.now()
          }
        })
      }
    },
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'contractDate', [startTimer, end])
      this.$set(this.queryParams, 'startDateContractDate', startTimer)
      this.$set(this.queryParams, 'endDateContractDate', end)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.supplierContractId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    /** 查询用户列表 */
    getList(query) {
      const timer = Date.now()
      this.queryTime = timer
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.inputVal2 && params.selectId2) {
        params[params.selectId2] = params.inputVal2
      }
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      params = this.$trimOfObj(params)
      querySupplierContractList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.contractDate = this.parseTime(item.contractDate, this.fmtForYmd)
          item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
          item.validity = this.parseTime(item.validity, this.fmtForYmd)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    /** 搜索 */
    handleSearchForm() {
      // const param = this.$trimOfObj(query)
      // this.queryParams = { ...param }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      this.initQueryParams()

      // this.searchFormKey = Date.now()
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
      } else if (item.name === 'SelectAnMultipleSelectName') {
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
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForPO') {
            this.$set(item, 'fuzzyData', this.conditionForPOList)
          } else if (item.selectId === 'conditionForDN') {
            this.$set(item, 'fuzzyData', this.conditionForDNList)
          } else if (item.selectId === 'conditionForDO') {
            this.$set(item, 'fuzzyData', this.conditionForDOList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },
    setCreatedListData() {
      this.searchData.forEach((item) => {
        if (item.name === 'SelectAnMultipleSelectName') {
          if (item.selectId === 'createdIdList') {
            this.$set(item, 'selectData2', this.createdList)
          } else if (item.selectId === 'approvedIdList') {
            this.$set(item, 'selectData2', this.approvedList)
          } else if (item.selectId === 'purchasePersonIdList') {
            this.$set(item, 'selectData2', this.purchasePersonList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.supplierContractId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/purchaseManagement/addSupplierContract',
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
      if (row.isLogistics === '1') {
        this.$router.push({
          path: '/purchaseManagement/editLogistics',
          query: {
            id: row.supplierContractId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/purchaseManagement/editSupplierContract',
          query: {
            id: row.supplierContractId,
            timeId: Date.now()
          }
        })
      }
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'businessPartnerNo') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      }
    },
    handleSend() {
      this.$refs.SendPODlg.handleAdd(this.selectList)
    },
    handleSendDetail(row) {
      this.$refs.SendPODlg.handleEdit(row)
    },
    /** 导出按钮操作 */
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const { exportType } = data
      let params = { ...this.queryParams }
      params = JSON.parse(JSON.stringify(params))
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.inputVal2 && params.selectId2) {
        params[params.selectId2] = params.inputVal2
      }
      params = this.$trimOfObj(params)
      params.exportType = exportType
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.supplierContractId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.columns.map((item) => item.prop)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/purchaseOrder/export',
        params,
        `${this.getFileNameDate('Purchase Order')}.xlsx`
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
.flexSb {
  display: flex;
  justify-content: space-between;
}
.flexCen {
  display: flex;
  justify-content: center;
}
</style>
