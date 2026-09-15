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
      :topShowCount="1"
      @updateSearchData="updateSearchData"
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          v-if="activeName === '0' && addAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          v-if="activeName === '1' && noQuotationAuth && tableList.length > 0"
          :disabled="multiple"
          type="primary"
          size="mini"
          @click="handleNoQuotation"
          >{{ $t('menu.noQuotation') }}</el-button
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
      stripe
      ref="tables"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      @row-click="handleRowClick"
      row-key="purchaseQuotationId"
      :tree-props="{ children: 'reviseList', hasChildren: 'hasChildren' }"
      max-height="500"
      :key="'table' + activeName"
      style="cursor: pointer"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        v-if="selectionShow"
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
          <el-switch
            v-if="item.prop === 'isActive'"
            v-model="scope.row[item.prop]"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="['internalPartNo'].includes(item.prop)">
            <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="['businessPartnerName'].includes(item.prop)">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            />
          </template>
          <template v-else-if="item.prop === 'rfqNo'">
            <div
              @mouseenter="showPop($event, scope.row, 'rfqNo')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text" :class="{ 'primary-link': rfqAuth }">
                {{ scope.row[item.prop] }}
              </div>
            </div>
          </template>
          <template v-else-if="item.prop === 'productName'">
            <div
              @mouseenter="showPop($event, scope.row, 'productName')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div class="ellipsis-text">{{ scope.row.productName }}</div>
            </div>
          </template>
          <template v-else-if="item.prop === 'purchaseQuotationStatus'">
            <el-tag type="success" v-if="scope.row.purchaseQuotationStatus === '6'">{{
              scope.row[item.propBy]
            }}</el-tag>
            <el-tag type="warning" v-else-if="scope.row.purchaseQuotationStatus === '1'">{{
              scope.row[item.propBy]
            }}</el-tag>
            <el-tag type="info" v-else-if="scope.row.purchaseQuotationStatus === '5'">{{
              scope.row[item.propBy]
            }}</el-tag>
            <el-tag type="danger" v-else-if="scope.row.purchaseQuotationStatus === '4'">{{
              scope.row[item.propBy]
            }}</el-tag>
            <el-tag v-else>{{ scope.row[item.propBy] }}</el-tag>
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
    <noQuotationDialog ref="noQuotationDialog" @submitSuccess="getList" />
    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />
    <ToolTipShowListForFN ref="ToolTipShowList" @clickItem="clickItem" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/purchaseManagement/lang/index'
import {
  queryCountList,
  querySearchList,
  queryPurchaseQuotationList,
  queryPQOperationLog
} from '@/api/purchaseManagement/purchaseQuotation'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import noQuotationDialog from './noQuotationDialog.vue'
export default {
  name: 'PurchaseQuotation',
  mixins: [pageMixin, tableDataMixin],
  components: { systemOperationLogTableDlg, ToolTipShowListForFN, noQuotationDialog },
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
      approvedStatusDicts: [],
      quoteFromDicts: [],
      // 请求的时间戳
      queryTime: undefined
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:add'])
    },
    exportAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:export'])
    },
    noQuotationAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:noQuotation'])
    },
    selectionShow() {
      if (this.activeName === '1') {
        return this.exportAuth || this.noQuotationAuth
      }
      return this.exportAuth
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
    rfqAuth() {
      return this.checkPermi(['purchaseManagement:requestForQuotation:list'])
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
    const a = this.MyDictDataClass.getDictFn('p_purchase_quotation_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    const c = this.MyDictDataClass.getDictFn('p_pq_quote_from')
    await Promise.all([a, b, c]).then((res) => {
      console.log(res)
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
      if (item.name === 'purchaseQuotationStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })
    this.searchData = this.searchData0

    this.initQueryParams()
    this.getList()
    this.querySearchList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.querySearchList()
  },
  methods: {
    showPop(e, row, type) {
      if (type === 'productName') {
        const list = row.purchaseQuotationDetailList || []
        const params = {
          // popoverTitle: this.$t('PURCHASE.DocNo'),
          labelKey: 'productName',
          // itemClass: 'primary-pointer',
          list
        }
        if (list.length > 0 && this.$refs.ToolTipShowList) {
          this.$refs.ToolTipShowList.showPop(e, params)
        }
      }
      if (type === 'rfqNo') {
        const list = row.rfqList || []
        list.forEach((item) => {
          item.type = type
        })
        const params = {
          // popoverTitle: this.$t('PURCHASE.DocNo'),
          labelKey: 'rfqNo',
          itemClass: this.rfqAuth ? 'primary-pointer' : '',
          list
        }
        if (list.length > 0 && this.$refs.ToolTipShowList) {
          this.$refs.ToolTipShowList.showPop(e, params)
        }
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    clickItem(item) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      const { type, rfqId } = item
      if (type === 'rfqNo') {
        this.$router.push({
          path: '/purchaseManagement/viewRequestForQuotation',
          query: {
            id: rfqId,
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
      this.searchData[1].selectId = 'conditionForPQ'
      this.queryParams.selectId = 'conditionForPQ'
      this.searchData[1].inputVal = ''

      this.searchFormKey = Date.now()
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
      let color = 'pointer'
      for (const item of this.ids.values()) {
        if (item === row.purchaseQuotationId) {
          color = 'pointer table-SelectedRow-bgcolor'
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
      params = this.$trimOfObj(params)

      params.labelType = this.activeName
      queryPurchaseQuotationList(params).then((response) => {
        console.log('=================533')
        if (timer !== this.queryTime) return
        console.log('=================535')
        const rows = response.rows || []
        rows.forEach((item, index) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.validity = this.parseTime(item.validity, this.fmtForYmd)
          item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
          item.purchaseQuotationStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.purchaseQuotationStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
          )
          item.quoteFrom = this.selectDictLabel(this.quoteFromDicts, item.quoteFrom)
          // item.purchaseQuotationIdKey = item.purchaseQuotationId + index
          this.setItemDict(item)
          if (item.reviseList) {
            item.reviseList.forEach((child) => {
              child.createdTime = this.parseTime(child.createdTime, this.fmtForYmdhms)
              child.modifiedTime = this.parseTime(child.modifiedTime, this.fmtForYmdhms)
              child.approvedTime = this.parseTime(child.approvedTime, this.fmtForYmdhms)
              child.validity = this.parseTime(child.validity, this.fmtForYmd)
              child.deliveryDate = this.parseTime(child.deliveryDate, this.fmtForYmd)

              // child.purchaseQuotationIdKey = child.purchaseQuotationId + index
              this.setItemDict(child)
            })
          }
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        this.setItemDict(item)
        item.reviseList.forEach((child) => {
          this.setItemDict(child)
        })
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    setItemDict(item) {
      item.purchaseQuotationStatusStr = this.selectDictLabel(
        this.statusDicts,
        item.purchaseQuotationStatus
      )
      item.approvedStatusStr = this.selectDictLabel(this.approvedStatusDicts, item.approvedStatus)
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const incotermList = data.incotermList || []
        const paymentTermList = data.paymentTermList || []
        const vendorList = data.vendorList || []
        const receiveAddressList = data.receiveAddressList || []

        this.conditionForPQList = (data.conditionForPQList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForPRList = (data.conditionForPRList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForRFQList = (data.conditionForRFQList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        this.searchData.forEach((item) => {
          if (item.name === 'incotermIdList') {
            this.$set(item, 'selectData', incotermList)
          } else if (item.name === 'paymentTermIdList') {
            this.$set(item, 'selectData', paymentTermList)
          } else if (item.name === 'businessPartnerIdList') {
            this.$set(item, 'selectData', vendorList)
          } else if (item.name === 'receiveAddressNameList') {
            this.$set(item, 'selectData', receiveAddressList)
          } else if (item.name === 'modifiedIdList') {
            this.$set(item, 'selectData', data.modifiedList)
          }
        })

        this.setFuzzyData()
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
          if (item.selectId === 'conditionForPQ') {
            this.$set(item, 'fuzzyData', this.conditionForPQList)
          } else if (item.selectId === 'conditionForPR') {
            this.$set(item, 'fuzzyData', this.conditionForPRList)
          } else if (item.selectId === 'conditionForRFQ') {
            this.$set(item, 'fuzzyData', this.conditionForRFQList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.purchaseQuotationId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    handleNoQuotation() {
      this.$refs.noQuotationDialog.handleOpen(this.ids)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/purchaseManagement/addPurchaseQuotation',
        query: {
          timeId: Date.now()
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row, column, event) {
      if (column && column.type === 'selection') {
        return
      }
      if (event && event.target && event.target.className === 'el-icon-arrow-right') {
        return
      }
      if (row.purchaseQuotationStatus === '1') {
        this.$router.push({
          path: '/purchaseManagement/addPurchaseQuotation',
          query: {
            id: row.purchaseQuotationId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/purchaseManagement/editPurchaseQuotation',
          query: {
            id: row.purchaseQuotationId,
            timeId: Date.now()
          }
        })
      }
    },
    handleRowClick(row) {
      if (this.activeName !== '3') {
        this.curClickRow = row
      }
    },
    nav(row, type) {
      if (type === 'businessPartnerName') {
        this.$router.push({
          path: '/businessPartner/viewBusinessPartner',
          query: {
            id: row.businessPartnerId,
            timeId: Date.now()
          }
        })
      } else if (type === 'internalPartNo') {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productId,
            timeId: Date.now()
          }
        })
      } else if (type === 'purchaseQuotationNo') {
        console.log('purchaseQuotationNo')
      } else if (type === 'purchaseOrderNo') {
        console.log('purchaseOrderNo')
      }
    },
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryPQOperationLog, {
        purchaseQuotationId: row.purchaseQuotationId
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
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      params.exportType = exportType

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.purchaseQuotationId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }

      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/purchaseQuotation/export',
        params,
        `${this.getFileNameDate('Purchase Quotation')}.xlsx`
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
