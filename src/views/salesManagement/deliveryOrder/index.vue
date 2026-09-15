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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleExportPDF"
          :loading="exportPDFLoading"
          v-if="exportPDFAuth"
          :disabled="ids.length <= 0"
          >{{ $t('menu.batchDownloadPDF') }}</el-button
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
        :columns="configCurColumn"
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
        v-if="exportAuth || exportPDFAuth"
        :selectable="selectable"
      />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleCurColumns"
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
          <template
            v-if="
              ['salesOrderNo', 'preDeliveryNoticeNo', 'businessPartnerName'].includes(item.prop)
            "
          >
            <!-- <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span> -->
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="salesOrder"
              @click="nav(scope.row, item.prop)"
              v-if="item.prop === 'salesOrderNo'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
              v-if="item.prop === 'businessPartnerName'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="preDeliveryNotice"
              @click="nav(scope.row, item.prop)"
              v-if="item.prop === 'preDeliveryNoticeNo'"
            />
          </template>
          <template v-else-if="item.prop === 'totalQty'">
            <template>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="220"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="isShowAction"
      >
        <template slot-scope="scope">
          <el-button
            v-if="(scope.row.buttonAuthMsg || {}).isCanAcknowledge === '1'"
            type="text"
            size="mini"
            :disabled="scope.row.rejectedLoading"
            :loading="scope.row.acknowledgeLoading"
            @click.stop="handleAcknowledge(scope.row)"
            >{{ $t('menu.acknowledge') }}</el-button
          >
          <el-button
            v-if="(scope.row.buttonAuthMsg || {}).isCanRejected === '1'"
            type="text"
            size="mini"
            :disabled="scope.row.acknowledgeLoading"
            :loading="scope.row.rejectedLoading"
            @click.stop="handleRejected(scope.row)"
            >{{ $t('menu.rejected') }}</el-button
          >
          <el-button
            type="text"
            size="mini"
            @click.stop="handleCancel(scope.row)"
            v-if="cancelAuth && (scope.row.buttonAuthMsg || {}).isCanCancelled === '1'"
            >{{ $t('menu.cancel') }}</el-button
          >
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
    <AcknowledgeDlg @submitSuccess="acknowledgeSuccess" ref="AcknowledgeDlg" />
    <addDeliveryOrderDlg ref="addDeliveryOrderDlg" @onSuccess="getList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/salesManagement/lang/index'
import AcknowledgeDlg from './acknowledgeDlg/acknowledgeDlg'
import {
  querySearchList,
  queryDeliveryOrderList,
  cancelledDeliveryOrder,
  checkAcknowledgeOrRejectedIsTrue
} from '@/api/salesManagement/deliveryOrder'
import addDeliveryOrderDlg from './addDeliveryOrderDlg.vue'
export default {
  name: 'DeliveryOrder',
  mixins: [pageMixin, tableDataMixin],
  components: { AcknowledgeDlg, addDeliveryOrderDlg },
  data() {
    return {
      saveKey: '1',
      // 遮罩层
      loading: true,
      exportPDFLoading: false,
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
      logisticsTypeDicts: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['salesManagement:deliveryOrder:add'])
    },
    cancelAuth() {
      return this.checkPermi(['salesManagement:deliveryOrder:add'])
    },
    exportAuth() {
      return this.checkPermi(['salesManagement:deliveryOrder:export'])
    },
    exportPDFAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:exportPDF'])
    },
    acknowledgeAuth() {
      return this.checkPermi(['salesManagement:deliveryOrder:acknowledge'])
    },
    isShowAction() {
      if (!this.acknowledgeAuth) {
        return false
      }
      return this.tableList.find((item) => {
        const auth = item.buttonAuthMsg || {}
        return (
          auth.isCanAcknowledge === '1' ||
          auth.isCanRejected === '1' ||
          (this.cancelAuth && auth.isCanCancelled === '1')
        )
      })
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    configCurColumn() {
      const arr = [...this.columns]
      /* if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      } */
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
      let arr = this.columns.filter((column) => column.visible === true)
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
    const a = this.MyDictDataClass.getDictFn('delivery_order_status')
    const b = this.MyDictDataClass.getDictFn('logistics_type')

    await Promise.all([a, b]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      this.statusDicts = (res1 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.logisticsTypeDicts = (res2 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData.forEach((item) => {
      if (item.name === 'deliveryOrderStatusList') {
        item.selectData = this.statusDicts
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
    initQueryParams() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
      this.queryParams.selectId = 'conditionForDeliveryOrderNo'
      this.queryParams.selectId2 = 'createdIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForDeliveryOrderNo'
          item.inputVal = ''
        }
        if (item.name === 'SelectAnMultipleSelectName') {
          item.selectId = 'createdIdList'
          item.inputVal = []
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.deliveryOrderId) {
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
        params[params.selectId2] = [...params.inputVal2]
      }
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      delete params.SelectAnMultipleSelectName
      delete params.inputVal2
      params = this.$trimOfObj(params)
      queryDeliveryOrderList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.completedTime = this.parseTime(item.completedTime, this.fmtForYmdhms)
          item.totalAmount = this.$numberStr(item.totalAmount, 2)
          item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
          item.deliveryOrderStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.deliveryOrderStatus
          )
          item.logisticsTypeStr = this.selectDictLabel(this.logisticsTypeDicts, item.logisticsType)
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    querySearchList() {
      querySearchList({}).then((res) => {
        const data = res.data || {}
        const salesOrganizationList = data.salesOrganizationList || []
        const shipWarehouseList = data.shipWarehouseList || []
        const vendorList = data.vendorList || []
        const receiveAddressList = data.receiveAddressList || []

        this.conditionForDeliveryOrderNoList = (data.conditionForDeliveryOrderNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )

        this.conditionForPreDeliveryNoticeNoList = (
          data.conditionForPreDeliveryNoticeNoList || []
        ).map((item) => {
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

        this.conditionForDeliveryNoticeNoList = (data.conditionForDeliveryNoticeNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )

        this.createdList = (data.createdList || []).map((item) => {
          return {
            value: item.createdId,
            label: item.createdBy
          }
        })
        this.salesPersonList = (data.salesPersonList || []).map((item) => {
          return {
            value: item.salesPersonId,
            label: item.salesPersonBy
          }
        })
        this.completedByList = (data.completedByList || []).map((item) => {
          return {
            value: item.completedBy.trim(),
            label: item.completedBy.trim()
          }
        })
        const departmentList = data.branchCompanyList || []
        this.handle(departmentList)
        this.searchData.forEach((item) => {
          if (item.name === 'salesOrganizationIdList') {
            this.$set(item, 'selectData', salesOrganizationList)
          } else if (item.name === 'shipWarehouseIdList') {
            this.$set(item, 'selectData', shipWarehouseList)
          } else if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', vendorList)
          } else if (item.name === 'receiveAddressIdList') {
            this.$set(item, 'selectData', receiveAddressList)
          } else if (item.name === 'departmentIdList') {
            this.$set(item, 'selectData', departmentList)
          }
        })
        this.setFuzzyData()
        this.setCreatedListData()
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          x.value = x.branchCompanyId
          x.label = x.branchCompanyName
          if (x.departmentList && x.departmentList.length > 0) {
            x.children = x.departmentList.map((k) => {
              return {
                value: k.departmentId,
                label: k.departmentName
              }
            })
          }
        })
      }
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
        console.log(e, item, this.queryParams)
      }
    },
    setFuzzyData() {
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          if (item.selectId === 'conditionForDeliveryOrderNo') {
            this.$set(item, 'fuzzyData', this.conditionForDeliveryOrderNoList)
          } else if (item.selectId === 'conditionForDeliveryNoticeNo') {
            this.$set(item, 'fuzzyData', this.conditionForDeliveryNoticeNoList)
          } else if (item.selectId === 'conditionForSO') {
            this.$set(item, 'fuzzyData', this.conditionForSOList)
          } else if (item.selectId === 'conditionForPreDeliveryNoticeNo') {
            this.$set(item, 'fuzzyData', this.conditionForPreDeliveryNoticeNoList)
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
          } else if (item.selectId === 'salesPersonIdList') {
            this.$set(item, 'selectData2', this.salesPersonList)
          } else if (item.selectId === 'completedByList') {
            this.$set(item, 'selectData2', this.completedByList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },
    handleAdd() {
      this.$refs.addDeliveryOrderDlg.handleOpen()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deliveryOrderId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/salesManagement/editDeliveryOrder',
        query: {
          id: row.deliveryOrderId,
          timeId: Date.now()
        }
      })
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'salesOrderNo') {
        this.$router.push({
          path: '/salesManagement/viewSalesOrder',
          query: {
            id: row.salesOrderId,
            timeId: Date.now()
          }
        })
      } else if (type === 'preDeliveryNoticeNo') {
        this.$router.push({
          path: '/salesManagement/viewPreDeliveryNotice',
          query: {
            id: row.preDeliveryNoticeId,
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
      }
    },

    /* 查看操作日志 */
    handleAcknowledge(row) {
      this.$set(row, 'acknowledgeLoading', true)
      checkAcknowledgeOrRejectedIsTrue({ deliveryOrderId: row.deliveryOrderId })
        .then((res) => {
          console.log(res)
          this.$set(row, 'acknowledgeLoading', false)
          this.$refs.AcknowledgeDlg.handleOpen(row)
        })
        .catch(() => {
          this.$set(row, 'acknowledgeLoading', false)
        })
    },
    acknowledgeSuccess() {
      this.$message.success(this.$t('SALES.acknowledgedSuccessfully'))
      this.getList()
    },
    handleRejected(row) {
      this.$set(row, 'rejectedLoading', true)
      checkAcknowledgeOrRejectedIsTrue({ deliveryOrderId: row.deliveryOrderId })
        .then((res) => {
          console.log(res)
          this.$set(row, 'rejectedLoading', false)
          this.$router.push({
            path: '/salesManagement/rejectDeliveryOrder',
            query: {
              id: row.deliveryOrderId,
              timeId: Date.now()
            }
          })
        })
        .catch(() => {
          this.$set(row, 'rejectedLoading', false)
        })
    },
    handleCancel(row) {
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm2'))
        .then(() => {
          return cancelledDeliveryOrder({ businessId: row.deliveryOrderId })
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('SALES.deliveryNoticeCancelledSuccessfully').replace('$1', row.deliveryOrderNo)
          )
          this.getList()
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
        params.exportIdList = vm.tableList.map((item) => item.deliveryOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/deliveryOrder/export',
        params,
        `${this.getFileNameDate('Delivery Order')}.xlsx`
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
    handleExportPDF() {
      const vm = this
      this.exportPDFLoading = true
      this.$importOrExportDownFile(
        '/sales/deliveryOrder/downloadPDF',
        {
          idList: this.ids
        },
        `${this.getFileNameDate('DO PDF')}.zip`
      )
        .then((res) => {
          vm.exportPDFLoading = false
          // vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportPDFLoading = false
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
