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
          v-if="addPOASLAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAddPOASL"
          >{{ $t('menu.addPOASL') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="activeName === '3' && sendAuth"
          type="primary"
          size="mini"
          @click="handleSend"
          >{{ $t('menu.sendPO') }}</el-button
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
      row-key="purchaseOrderMainIdKey"
      :tree-props="{ children: 'reviseList', hasChildren: 'hasChildren' }"
      style="cursor: pointer"
      :cellClassName="cellClassName"
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
          <!-- <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span> -->
          <span>{{ scope.row.indexI }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in getVisibleColumn(visibleCurColumns)"
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
            <div
              @mouseenter="showPop($event, scope.row)"
              @mouseleave="hidePop($event, scope.row)"
              class="ellipsis-text"
            >
              <div class="primary-link ellipsis-text">
                {{ scope.row.documentNoListShowStr }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'purchaseOrderNo'">
            <div class="flexStart ellipsis-text">
              <div class="ellipsis-text">
                {{ scope.row[item.prop] }}
              </div>
              <div :title="$t('PURCHASE.triggeredByEGR')" class="flexStart ml5">
                <svg-icon
                  icon-class="shandian"
                  style="font-size: 20px"
                  v-if="scope.row.isEmergencyGoodsReceipt === '1'"
                />
              </div>
            </div>
          </template>
          <template v-else-if="['businessPartnerName'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="['totalAmount', 'totalAmountShowStr'].includes(item.prop)">
            {{ $numberStr(scope.row.totalAmount, 6, false, 2) }}
          </template>
          <template v-else-if="item.prop === 'dropShipping'">
            <el-tag v-if="scope.row.dropShipping === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.dropShipping === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="130"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="
          ['0', '9', '10'].includes(activeName) &&
          tableList.find((x) => x.isCanConfirmDelivery === '1')
        "
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isCanConfirmDelivery === '1'"
            @click="handleConfirmDelivery(scope.row)"
            type="text"
            size="mini"
            >{{ $t('PURCHASE.confirmDelivery') }}</el-button
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

    <POacknowledgeDlg @submitSuccess="getList" ref="POacknowledgeDlg" />

    <SendPODlg ref="SendPODlg" @submitSuccess="getList" />

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />

    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="documentClick" />
    <deliveryConfirmationDlg
      ref="deliveryConfirmationDlg"
      :formData="formData"
      @onSuccess="getList"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/purchaseManagement/lang/index'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import {
  queryCountList,
  querySearchList,
  queryPurchaseOrderList,
  queryPOOperationLog
} from '@/api/purchaseManagement/purchaseOrder'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import POacknowledgeDlg from './acknowledgeDlg/POacknowledgeDlg'
import SendPODlg from '@/views/purchaseManagement/purchaseOrder/sendPODlg.vue'
import deliveryConfirmationDlg from './components/deliveryConfirmationDlg'
export default {
  name: 'PurchaseOrder',
  mixins: [pageMixin, tableDataMixin],
  components: {
    systemOperationLogTableDlg,
    ToolTipShowListForFN,
    SendPODlg,
    POacknowledgeDlg,
    deliveryConfirmationDlg
  },
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
      approvedStatusDicts: [],
      quoteFromDicts: [],
      // 请求的时间戳
      queryTime: undefined,
      formData: {}
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:add'])
    },
    addPOASLAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:addPOASL'])
    },

    sendAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:sendPO'])
    },
    exportAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:export'])
    },
    exportPDFAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:exportPDF'])
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
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
    PRAuth() {
      return this.checkPermi(['purchaseManagement:purchaseRequisition:list'])
    },
    PQAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:list'])
    },
    POAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:list'])
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
    const a = this.MyDictDataClass.getDictFn('p_purchase_order_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    const c = this.MyDictDataClass.getDictFn('p_pq_quote_from')
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
      this.quoteFromDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData0.forEach((item) => {
      if (item.name === 'purchaseOrderStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
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
      if (column.property === 'purchaseOrderNo' || column.property === 'documentNoListShowStr') {
        cellClass = 'sq-name-flex-cell'
      }
      return cellClass
    },
    documentTypeGetAuth(documentType) {
      const auth = {
        0: this.PRAuth,
        1: this.PQAuth,
        2: true,
        3: this.POAuth
      }
      return auth[documentType]
    },
    showPop(e, row) {
      const list = row.documentMsgList || []
      list.forEach((item) => {
        item.itemClass = this.documentTypeGetAuth(item.priceType) ? 'primary-pointer' : ''
      })
      const params = {
        popoverTitle: this.$t('PURCHASE.DocNo'),
        labelKey: 'documentNo',
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
    initQueryParams(isResetDate = true) {
      const { pageSize, dateRange, startDateCreatedTime, endDateCreatedTime } = this.queryParams
      this.queryParams = {
        pageNum: 1,
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime
      }
      if (isResetDate) {
        const end = this.appointTime(Date.now(), '23:59:59')
        const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
        this.$set(this.queryParams, 'dateRange', [startTimer, end])
        this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
        this.$set(this.queryParams, 'endDateCreatedTime', end)
      }

      this.queryParams.selectId = 'conditionForPO'
      this.queryParams.selectId2 = 'createdIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForPO'
          item.inputVal = ''
        }
        if (item.name === 'SelectAnMultipleSelectName') {
          item.selectId = 'createdIdList'
          item.inputVal = []
        }
      })
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
        if (item === row.purchaseOrderId) {
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
      this.$store.dispatch('getPurchaseTaskCount')
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
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      queryPurchaseOrderList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item, index) => {
          item.indexI = (this.queryParams.pageNum - 1) * this.queryParams.pageSize + index + 1
          item.purchaseOrderMainIdKey = item.purchaseOrderId + index
          this.setRowData(item)
          if (item.reviseList) {
            item.reviseList.forEach((child, childIndex) => {
              child.purchaseOrderMainIdKey = child.purchaseOrderId + childIndex
              this.setRowData(child)
            })
          }
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    setRowData(item) {
      item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
      item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
      item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
      item.committedDate = this.parseTime(item.committedDate, this.fmtForYmd)
      item.validity = this.parseTime(item.validity, this.fmtForYmd)
      item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
      item.purchaseOrderStatusStr = this.selectDictLabel(this.statusDicts, item.purchaseOrderStatus)
      item.approvedStatusStr = this.selectDictLabel(this.approvedStatusDicts, item.approvedStatus)
      item.quoteFrom = this.selectDictLabel(this.quoteFromDicts, item.quoteFrom)
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const incotermList = data.incotermList || []
        const paymentTermList = data.paymentTermList || []
        const vendorList = data.vendorList || []
        const receiveAddressList = data.receiveAddressList || []

        this.conditionForPOList = (data.conditionForPOList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForDNList = (data.conditionForDNList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForDOList = (data.conditionForDOList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        this.createdList = (data.createdList || []).map((item) => {
          return {
            value: item.createdId,
            label: item.createdBy
          }
        })
        this.approvedList = (data.approvedList || []).map((item) => {
          return {
            value: item.approvedId,
            label: item.approvedBy
          }
        })
        this.purchasePersonList = (data.purchasePersonList || []).map((item) => {
          return {
            value: item.purchasePersonId,
            label: item.purchasePersonBy
          }
        })
        const departmentList = data.branchCompanyList || []
        this.handle(departmentList)
        this.searchData.forEach((item) => {
          if (item.name === 'incotermIdList') {
            this.$set(item, 'selectData', incotermList)
          } else if (item.name === 'paymentTermIdList') {
            this.$set(item, 'selectData', paymentTermList)
          } else if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', vendorList)
          } else if (item.name === 'receiveAddressNameList') {
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
          } else {
            x.children = undefined
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
      this.ids = selection.map((item) => item.purchaseOrderId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          timeId: Date.now()
        }
      })
    },
    handleAddPOASL() {
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          timeId: Date.now(),
          createdType: '2'
        }
      })
    },

    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.$router.push({
        path: '/purchaseManagement/editPurchaseOrder',
        query: {
          id: row.purchaseOrderId,
          timeId: Date.now()
        }
      })
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
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
    handleSend() {
      this.$refs.SendPODlg.handleAdd(this.selectList)
    },
    handleSendDetail(row) {
      this.$refs.SendPODlg.handleEdit(row)
    },
    /* 寄卖采购订单直接入库 */
    handleAcknowledge(row) {
      this.$refs.POacknowledgeDlg.handleOpen(row)
    },

    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryPOOperationLog, {
        purchaseOrderId: row.purchaseOrderId
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
      let params = { ...this.queryParams }
      params = JSON.parse(JSON.stringify(params))
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.inputVal2 && params.selectId2) {
        params[params.selectId2] = params.inputVal2
      }
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      params.exportType = exportType
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.purchaseOrderId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)
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
    },
    handleExportPDF() {
      const vm = this
      this.exportPDFLoading = true
      this.$importOrExportDownFile(
        '/purchase/purchaseOrder/downloadPDF',
        {
          idList: this.ids
        },
        `${this.getFileNameDate('PO PDF')}.zip`
      )
        .then((res) => {
          vm.exportPDFLoading = false
          // vm.$refs.ExportDlgRef.hide()
          vm.$modal.msgSuccess(vm.$t('ui.exportSuccess'))
        })
        .catch(() => {
          vm.exportPDFLoading = false
        })
    },
    handleConfirmDelivery(row) {
      this.formData = row
      this.$nextTick(() => {
        this.$refs.deliveryConfirmationDlg.handleOpen()
      })
    }
  }
}
</script>
<style lang="scss">
/* 处理特殊单元格内容与展开折叠列的样式冲突 */
.sq-name-flex-cell {
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
.flexSb {
  display: flex;
  justify-content: space-between;
}
.flexCen {
  display: flex;
  justify-content: center;
}
</style>
