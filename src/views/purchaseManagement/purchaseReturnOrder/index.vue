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
          v-if="addPurchaseReturnAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd('addPurchaseReturn')"
          >{{ $t('PURCHASE.addPurchaseReturn') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="addConsignmentReturnAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd('addConsignmentReturn')"
          >{{ $t('PURCHASE.addConsignmentReturn') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="addPurchaseDirectShippingReturnAuth"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd('addPurchaseDirectShippingReturn')"
          >{{ $t('menu.addPurchaseDirectShippingReturn') }}</el-button
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
        :saveKey="curSaveKey"
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
          <template v-if="['documentNo'].includes(item.prop)">
            <!-- <span class="primary-link" @click="nav(scope.row, item.prop)">{{
              scope.row[item.prop]
            }}</span> -->

            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseOrder"
              @click="nav(scope.row, 'purchaseOrder')"
              v-if="scope.row.documentType === '1'"
            />
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="consignmentOrder"
              @click="nav(scope.row, 'consignmentOrder')"
              v-if="scope.row.documentType === '30'"
            />
          </template>
          <template v-else-if="item.prop === 'totalReturnedQty'">
            <template>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else-if="item.prop === 'goodsReceivedNoteNo'">
            <div
              @mouseenter="showPop($event, scope.row)"
              @mouseleave="hidePop($event, scope.row)"
              v-if="
                scope.row.goodsReceivedNoteNoList && scope.row.goodsReceivedNoteNoList.length > 1
              "
            >
              <div class="ellipsis-text">{{ scope.row.goodsReceivedNoteNo }}</div>
            </div>
            <div v-else :title="scope.row.goodsReceivedNoteNo">
              {{ scope.row.goodsReceivedNoteNo }}
            </div>
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

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
    <systemOperationLogTableDlg ref="systemOperationLogTableDlg" />
    <ToolTipShowListForFN ref="ToolTipShowList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/purchaseManagement/lang/index'
import {
  queryCountList,
  querySearchList,
  queryPurchaseReturnList,
  queryPurchaseReturnOperationLog
} from '@/api/purchaseManagement/purchaseReturnOrder'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'PurchaseReturnOrder',
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
      approvedStatusDicts: [],
      deliveryStatusDicts: [],
      purchaseReturnTypeDicts: [],
      // 请求的时间戳
      queryTime: undefined,
      conditionForDocumentNoList: []
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:add'])
    },
    addPurchaseReturnAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:addPurchaseReturn'])
    },
    addConsignmentReturnAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:addConsignmentReturn'])
    },
    addPurchaseDirectShippingReturnAuth() {
      return this.checkPermi([
        'purchaseManagement:purchaseReturnOrder:addPurchaseDirectShippingReturn'
      ])
    },

    exportAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:export'])
    },
    curColumns() {
      return this.columnsData[this.activeName] || []
    },
    curSaveKey() {
      return this.columnsSaveKeys[this.activeName] || []
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
    const a = this.MyDictDataClass.getDictFn('purchase_return_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    const c = this.MyDictDataClass.getDictFn('sales_goods_delivery_status')
    const d = this.MyDictDataClass.getDictFn('purchase_return_type')
    await Promise.all([a, b, c, d]).then((res) => {
      const res1 = res[0] || {}
      const res2 = res[1] || {}
      const res3 = res[2] || {}
      const res4 = res[3] || {}
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
      this.deliveryStatusDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
      this.purchaseReturnTypeDicts = (res4 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData0.forEach((item) => {
      if (item.name === 'purchaseReturnStatusList') {
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
    showPop(e, row, type) {
      const list = row.goodsReceivedNoteNoList || []
      const params = {
        // popoverTitle: this.$t('PURCHASE.DocNo'),
        // labelKey: 'goodsReceivedNoteNo',
        // itemClass: 'primary-pointer',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    initQueryParams(isResetDate = true) {
      const {
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime,
        dateRange1,
        startDateReturnDate,
        endDateReturnDate
      } = this.queryParams
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
      } else {
        this.$set(this.queryParams, 'dateRange1', dateRange1)
        this.$set(this.queryParams, 'startDateReturnDate', startDateReturnDate)
        this.$set(this.queryParams, 'endDateReturnDate', endDateReturnDate)
      }

      this.queryParams.selectId = 'conditionForPurchaseReturnNo'
      this.queryParams.selectId2 = 'createdIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForPurchaseReturnNo'
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
      } else if (this.activeName === '1') {
        this.searchData = this.searchData1
      } else if (this.activeName === '2') {
        this.searchData = this.searchData1
      } else if (this.activeName === '7') {
        this.searchData = this.searchData1
      } else if (this.activeName === '4' || this.activeName === '5') {
        this.searchData = this.searchData45
      } else {
        this.searchData = this.searchData2
      }
      this.initQueryParams(false)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.purchaseReturnId) {
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
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      queryPurchaseReturnList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item) => {
          item.returnDate = this.parseTime(item.returnDate, this.fmtForYmd)
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.totalReturnedAmount = this.$numberStr(item.totalReturnedAmount, 2)
          item.purchaseReturnStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.purchaseReturnStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
          )
          item.deliveryStatusStr = this.selectDictLabel(
            this.deliveryStatusDicts,
            item.deliveryStatus
          )
          item.purchaseReturnTypeStr = this.selectDictLabel(
            this.purchaseReturnTypeDicts,
            item.purchaseReturnType
          )
        })
        this.tableList = rows
        this.loading = false
        this.total = response.total

        this.$$getColumnContentMaxWidth(this.curColumns, this.tableList)
      })
    },
    querySearchList() {
      querySearchList({ labelType: this.activeName }).then((res) => {
        const data = res.data || {}
        const warehouseList = data.warehouseList || []
        this.conditionForPurchaseReturnNoList = (data.conditionForPurchaseReturnNoList || []).map(
          (item) => {
            return {
              value: item,
              label: item
            }
          }
        )
        this.conditionForDocumentNoList = (data.conditionForDocumentNoList || []).map((item) => {
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
        this.conditionForGoodsReceiptNoteNoList = (
          data.conditionForGoodsReceiptNoteNoList || []
        ).map((item) => {
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
        this.purchasePersonList = (data.purchasePersonList || []).map((item) => {
          return {
            value: item.purchasePersonId,
            label: item.purchasePersonBy
          }
        })
        this.picUserList = (data.picUserList || []).map((item) => {
          return {
            value: item.picUserId,
            label: item.picUserBy
          }
        })

        this.searchData.forEach((item) => {
          if (item.name === 'warehouseIdList') {
            this.$set(item, 'selectData', warehouseList)
          } else if (item.name === 'purchaseReturnTypeList') {
            item.selectData = this.purchaseReturnTypeDicts
          }
        })
        this.setFuzzyData()
        this.setCreatedListData()
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
          if (item.selectId === 'conditionForPurchaseReturnNo') {
            this.$set(item, 'fuzzyData', this.conditionForPurchaseReturnNoList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForDocumentNoList)
          } else if (item.selectId === 'conditionForDeliveryNoticeNo') {
            this.$set(item, 'fuzzyData', this.conditionForDeliveryNoticeNoList)
          } else if (item.selectId === 'conditionForGoodsReceiptNoteNo') {
            this.$set(item, 'fuzzyData', this.conditionForGoodsReceiptNoteNoList)
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
          } else if (item.selectId === 'purchasePersonIdList') {
            this.$set(item, 'selectData2', this.purchasePersonList)
          } else if (item.selectId === 'picUserIdList') {
            this.$set(item, 'selectData2', this.picUserList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.purchaseReturnId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd(type) {
      if (type === 'addPurchaseDirectShippingReturn') {
        this.$router.push({
          path: '/purchaseManagement/addPurchaseDirectShippingReturn',
          query: {
            timeId: Date.now()
          }
        })
      } else if (type === 'addConsignmentReturn') {
        this.$router.push({
          path: '/purchaseManagement/addConsignmentReturnOrder',
          query: {
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/purchaseManagement/addPurchaseReturnOrder',
          query: {
            timeId: Date.now()
          }
        })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (row.purchaseReturnType === '2') {
        this.$router.push({
          path: '/purchaseManagement/editConsignmentReturnOrder',
          query: {
            id: row.purchaseReturnId,
            timeId: Date.now()
          }
        })
      } else {
        this.$router.push({
          path: '/purchaseManagement/editPurchaseReturnOrder',
          query: {
            id: row.purchaseReturnId,
            timeId: Date.now()
          }
        })
      }
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      switch (row.documentType) {
        case '1':
          this.$router.push({
            path: '/purchaseManagement/viewPurchaseOrder',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
          break
        case '30':
          this.$router.push({
            path: '/purchaseManagement/viewConsignmentOrder',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
          break
      }
      // if (type === 'purchaseOrderNo') {
      //   this.$router.push({
      //     path: '/purchaseManagement/viewPurchaseOrder',
      //     query: {
      //       id: row.purchaseOrderId,
      //       timeId: Date.now()
      //     }
      //   })
      // }
      // if (type === 'businessPartnerName') {
      //   this.$router.push({
      //     path: '/businessPartner/viewBusinessPartner',
      //     query: {
      //       id: row.businessPartnerId,
      //       timeId: Date.now()
      //     }
      //   })
      // }
    },

    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryPurchaseReturnOperationLog, {
        purchaseReturnId: row.purchaseReturnId
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

      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.purchaseReturnId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/purchaseReturn/export',
        params,
        `${this.getFileNameDate('Purchase Return')}.xlsx`
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
