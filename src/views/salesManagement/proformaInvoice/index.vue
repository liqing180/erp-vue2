<template>
  <div class="app-container">
    <el-tabs
      ref="tabsRef"
      type="card"
      :key="'tabs_' + tabsKey"
      v-model="activeName"
      @tab-click="tabClickHandler"
    >
      <template v-for="(item, index) in tabs">
        <el-tab-pane size="" :key="index" :name="item.value">
          <span slot="label">
            <div class="tabs-item-title">
              {{ item.name }}
              <el-badge
                :max="99"
                :key="item.value + badgeKey"
                class="tabs-item-badge"
                style="margin-left: 3px"
                :value="item.num"
              />
            </div>
          </span>
        </el-tab-pane>
      </template>
    </el-tabs>
    <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :isBtn="true"
      :topShowCount="1"
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="openExport"
          v-if="exportAuth"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columnsInit="curColumns"
        :columns="configCurColumn"
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
        v-for="item in visibleCurColumns"
        :key="item.prop + item.colSortIndex + activeName"
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
              <div class="primary ellipsis-text">{{ scope.row.documentNoListShowStr }}</div>
            </div>
          </template>
          <template v-else-if="['salesQuotationNo'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="salesQuotation"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="item.prop === 'documentNo'">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="salesOrder"
              @click="nav(scope.row, item.prop)"
              v-if="scope.row.documentType === '13'"
            />
          </template>
          <!-- <template v-else-if="['businessPartnerName'].includes(item.prop)">
            <DocumentNoLink
              v-if="scope.row.salesQuotationType !== 'Staff'"
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            />
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template> -->
          <template v-else-if="item.prop === 'proformaInvoiceStatus'">
            <div
              class="status-tag"
              :class="'status-tag-' + scope.row.proformaInvoiceStatus"
              v-if="scope.row.proformaInvoiceStatus"
            >
              {{ scope.row[item.propBy] }}
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

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="documentClick" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/salesManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import {
  queryCountList,
  querySearchList,
  queryProformaInvoiceList
} from '@/api/salesManagement/proformaInvoice'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
export default {
  dicts: ['approved_status'],
  name: 'ProformaInvoice',
  mixins: [pageMixin, tableDataMixin],
  components: { systemOperationLogTableDlg, ToolTipShowListForFN },
  data() {
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
      statusDicts: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['salesManagement:proformaInvoice:add'])
    },

    exportAuth() {
      return this.checkPermi(['salesManagement:proformaInvoice:export'])
    },
    curColumns() {
      return this.columnsData[0] || []
    },
    configCurColumn() {
      let arr = [...this.curColumns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.curColumns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },

    isShowAction() {
      return this.tableList.find((item) => {
        return (item.buttonAuthMsg || {}).isCanOpenBlanketOrder === '1'
      })
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  async created() {
    this.createdInitTimer = Date.now()

    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    // $$initColumnVisible 在 ./tableDataMixin.js 调用了
    const a = this.MyDictDataClass.getDictFn('proforma_invoice_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    await Promise.all([a, b]).then((res) => {
      const res1 = res[0] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      const res2 = res[1] || {}
      this.approvedList = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData0.forEach((item) => {
      if (item.name === 'proformaInvoiceStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedList
      }
    })

    this.searchData = this.searchData0

    this.initQueryParams()
    this.getList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
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
      }
    },
    initQueryParams(isResetDate = true) {
      const { pageSize, dateRange, startDateCreatedTime, endDateCreatedTime } = this.queryParams
      this.queryParams = {
        pageNum: 1,
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime
      }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 29
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
    },
    tabClickHandler() {
      if (this.activeName === '0') {
        this.searchData = this.searchData0
      } else {
        this.searchData = this.searchData1
      }
      this.initQueryParams(false)
      this.getList()
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
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      return true // 不禁用
    },
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    queryCountList() {
      queryCountList({}).then((res) => {
        const data = res.data || {}
        this.tabs.forEach((item, index) => {
          this.$set(item, 'num', data[item.value])
        })
        // this.$set(this.tabs[0], 'num', '')
        // this.$set(this.tabs[1], 'num', data['0'])
        this.$nextTick(() => {
          this.badgeKey++
        })
      })
    },
    /** 查询用户列表 */
    getList(query) {
      this.$store.dispatch('getSalesTaskCount')
      const timer = Date.now()
      this.queryTime = timer
      this.queryCountList()
      this.querySearchList()
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
      params.labelType = this.activeName
      params = this.$trimOfObj(params)
      queryProformaInvoiceList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)

          item.totalAmount = this.$numberStr(item.totalAmount, 2)
          item.proformaInvoiceDate = this.parseTime(item.proformaInvoiceDate, this.fmtForYmd)
          item.issueDate = this.parseTime(item.issueDate, this.fmtForYmd)
          item.dueDate = this.parseTime(item.dueDate, this.fmtForYmd)

          item.proformaInvoiceStatusShowStr = this.selectDictLabel(
            this.statusDicts,
            item.proformaInvoiceStatus
          )
          item.approvedStatusShowStr = this.selectDictLabel(
            this.dict.type.approved_status,
            item.approvedStatus
          )
          item.soTotalAmount = item.currencySymbol + ' ' + this.$numberStr(item.soTotalAmount, 2)
          item.paymentTermStagePercentage = item.paymentTermStagePercentage + '%'
          item.proformaInvoiceAmount =
            item.currencySymbol + ' ' + this.$numberStr(item.proformaInvoiceAmount, 2)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.proformaInvoiceStatusShowStr = this.selectDictLabel(
          this.statusDicts,
          item.proformaInvoiceStatus
        )
        item.approvedStatusShowStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.approvedStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        this.searchData.forEach((item) => {
          if (item.name === 'createdIdList') {
            this.$set(item, 'selectData', data.createdList)
          } else if (item.name === 'currencyIdList') {
            this.$set(item, 'selectData', data.currencyList)
          } else if (item.name === 'incotermIdList') {
            this.$set(item, 'selectData', data.incotermList)
          }
        })
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

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.salesOrderId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/salesManagement/addProformaInvoice',
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
        path: '/salesManagement/editProformaInvoice',
        query: {
          id: row.proformaInvoiceId,
          timeId: Date.now()
        }
      })
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'salesQuotationNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesQuotation',
          query: {
            id: row.salesQuotationMainId,
            timeId: Date.now()
          }
        })
      } else if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'documentNo') {
        if (row.documentType === '13') {
          this.$router.push({
            path: '/salesManagement/viewSalesOrder',
            query: {
              id: row.salesOrderId,
              backType: '2',
              timeId: Date.now()
            }
          })
        }
      }
    },
    handleSchedule(row) {
      if ((row.buttonAuthMsg || {}).isCanOpenBlanketOrder === '1') {
        this.$router.push({
          path: '/salesManagement/deliverySchedule',
          query: {
            id: row.salesOrderId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/salesManagement/addPreDeliveryNotice',
          query: {
            timeId: Date.now(),
            soId: row.salesOrderId,
            backType: '2'
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
      let params = { ...this.queryParams }
      params = JSON.parse(JSON.stringify(params))
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
      params.labelType = this.activeName
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.salesOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/salesOrder/export',
        params,
        `${this.getFileNameDate('Sales Order')}.xlsx`
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
.status-tag {
  display: inline-block;
  color: #1890ff;
  font-size: 12px;
  height: 20px;
  line-height: 18px;
  padding: 0 7px;
  border-radius: 10px;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: #e8f4ff;
  border: 1px solid #d1e9ff;
}
.status-tag-1 {
  color: #597ef7;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
}
.status-tag-2 {
  color: #fa8c16;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
}
.status-tag-3 {
  color: #13c2c2;
  background-color: #f6fffd;
  border: 1px solid #87e8de;
}
.status-tag-4 {
  color: #52c41a;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
.status-tag-5 {
  color: #8c6e63;
  background-color: #f5f0ee;
  border: 1px solid #d7ccc8;
}
.status-tag-6 {
  color: #8c8c8c;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
}
</style>
