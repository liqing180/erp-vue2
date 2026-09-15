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
      stripe
      ref="tables"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      row-key="salesQuotationMainIdKey"
      :tree-props="{ children: 'reviseList', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      max-height="500"
      :cellClassName="cellClassName"
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
          <template v-if="['documentNo'].includes(item.prop)">
            <span
              :class="{ 'primary-link': documentTypeGetAuth(scope.row.documentType) }"
              @click="nav(scope.row, item.prop)"
              >{{ scope.row[item.prop] }}</span
            >
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
              v-if="scope.row.documentType !== '23'"
              :showStr="scope.row[item.prop]"
              moduleKey="businessPartner"
              @click="nav(scope.row, item.prop)"
            />
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>

          <template v-else-if="item.prop === 'salesQuotationStatus'">
            <div class="flexStart">
              <!-- border-color: red -->
              <el-tag
                :style="`color:${colorObj[scope.row[item.prop]].fontColor};border-color:${
                  colorObj[scope.row[item.prop]].bdColor
                }`"
                :color="colorObj[scope.row[item.prop]].bgColor"
                >{{ scope.row[item.propBy] }}</el-tag
              >
              <!-- <span
                class="inReviseIcon"
                :title="$t('ui.inRevision')"
                v-if="scope.row.isRevise === '1' && scope.row.approvedStatus === '1'"
              >
                <svg-icon icon-class="in-revision" />
              </span> -->
            </div>
          </template>
          <template v-else-if="item.prop === 'totalAmount'">
            {{ $numberStr(scope.row.totalAmount, 2) }}
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import tableDataMixin from './tableDataMixin'
import locale from '@/views/salesManagement/lang/index'
import {
  queryLabelCount,
  querySearchList,
  querySalesQuotationList,
  querySalesQuotationOperationLog
} from '@/api/salesManagement/salesQuotation'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
export default {
  name: 'SalesQuotation',
  mixins: [pageMixin, tableDataMixin],
  components: { systemOperationLogTableDlg },
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
      salesQuotationTypeDicts: [],
      // 请求的时间戳
      queryTime: undefined,
      colorObj: {
        1: { bgColor: 'e3f2fd', fontColor: '#1565c0', bdColor: '#2196f3' },
        9: { bgColor: '#e1f5fe', fontColor: '#01579b', bdColor: '#03a9f4' },
        2: { bgColor: '#fff8e1', fontColor: '#f57f17', bdColor: '#fbc02d' },
        3: { bgColor: '#ffe3b8', fontColor: '#e65100', bdColor: '#ff9800' },
        4: { bgColor: '#e0f7fa', fontColor: '#00838f', bdColor: '#00acc1' },
        5: { bgColor: '#e8f5e9', fontColor: '#2e7d32', bdColor: '#4caf50' },
        6: { bgColor: '#f5f5f5', fontColor: '#616161', bdColor: '#9e9e9e' },
        7: { bgColor: '#ffebee', fontColor: '#c62828', bdColor: '#e53935' },
        8: { bgColor: '#fce4ec', fontColor: '#ad1457', bdColor: '#e91e63' },
        10: { bgColor: '#f3e5f5', fontColor: '#6a1b9a', bdColor: '#9c27b0' },
        11: { bgColor: '#efebe9', fontColor: '#4e342e', bdColor: '#795548' }
      }
    }
  },
  computed: {
    addAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:add'])
    },

    exportAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:export'])
    },
    exportPDFAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:exportPDF'])
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
    },
    salesInquiryAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:list'])
    },
    serviceOrderAuth() {
      return this.checkPermi(['salesManagement:serviceOrder:list'])
    },
    SICAuth() {
      return this.checkPermi(['projectManagement:storeIssueChit:list'])
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
    const a = this.MyDictDataClass.getDictFn('sales_quotation_status')
    const b = this.MyDictDataClass.getDictFn('approved_status')
    const c = this.MyDictDataClass.getDictFn('sales_inquiry_type')
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
      this.salesQuotationTypeDicts = (res3 || []).map((item) => {
        return {
          label: item.dictLabel,
          value: item.dictValue
        }
      })
    })

    this.searchData0.forEach((item) => {
      if (item.name === 'salesQuotationStatusList') {
        item.selectData = this.statusDicts
      } else if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      } else if (item.name === 'salesQuotationTypeList') {
        item.selectData = this.salesQuotationTypeDicts.filter((x) => x.value !== 'Service')
      }
    })
    this.searchData1.forEach((item) => {
      if (item.name === 'salesQuotationTypeList') {
        item.selectData = this.salesQuotationTypeDicts.filter((x) => x.value !== 'Service')
      }
    })
    this.searchData2.forEach((item) => {
      if (item.name === 'salesQuotationTypeList') {
        item.selectData = this.salesQuotationTypeDicts.filter((x) => x.value !== 'Service')
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
            colWidth: item.colWidth + 20
          }
        }
        return item
      })
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (column.property === 'salesQuotationStatus') {
        cellClass = 'sq-name-flex-cell'
      }
      return cellClass
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

      this.queryParams.selectId = 'conditionForSQ'
      this.queryParams.selectId2 = 'createdIdList'
      this.searchData.forEach((item) => {
        if (item.name === 'selectAnInputName') {
          item.selectId = 'conditionForSQ'
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
      } else if (this.activeName === '4') {
        this.searchData = this.searchData2
      } else if (this.activeName === '5') {
        this.searchData = this.searchData2
      } else {
        this.searchData = this.searchData1
      }
      this.initQueryParams(false)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.salesQuotationMainId) {
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
    queryLabelCount() {
      queryLabelCount({}).then((res) => {
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
      this.queryLabelCount()
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
      querySalesQuotationList(params).then((response) => {
        if (timer !== this.queryTime) return
        const rows = response.rows || []
        rows.forEach((item, index) => {
          // item.salesQuotationMainId = item.salesQuotationMainId + index
          item.indexI = (this.queryParams.pageNum - 1) * this.queryParams.pageSize + index + 1
          item.salesQuotationMainIdKey = item.salesQuotationMainId + index
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.committedDate = this.parseTime(item.committedDate, this.fmtForYmd)
          item.validity = this.parseTime(item.validity, this.fmtForYmd)
          item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)
          item.salesQuotationStatusStr = this.selectDictLabel(
            this.statusDicts,
            item.salesQuotationStatus
          )
          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
          )
          item.salesQuotationTypeStr = this.selectDictLabel(
            this.salesQuotationTypeDicts,
            item.salesQuotationType
          )
          if (item.reviseList) {
            item.reviseList.forEach((child, childIndex) => {
              child.salesQuotationMainIdKey = child.salesQuotationMainId + childIndex
              child.createdTime = this.parseTime(child.createdTime, this.fmtForYmdhms)
              child.modifiedTime = this.parseTime(child.modifiedTime, this.fmtForYmdhms)
              child.approvedTime = this.parseTime(child.approvedTime, this.fmtForYmdhms)
              child.committedDate = this.parseTime(child.committedDate, this.fmtForYmd)
              child.validity = this.parseTime(child.validity, this.fmtForYmd)
              child.deliveryDate = this.parseTime(child.deliveryDate, this.fmtForYmd)
              child.salesQuotationStatusStr = this.selectDictLabel(
                this.statusDicts,
                child.salesQuotationStatus
              )
              child.approvedStatusStr = this.selectDictLabel(
                this.approvedStatusDicts,
                child.approvedStatus
              )
              child.salesQuotationTypeStr = this.selectDictLabel(
                this.salesQuotationTypeDicts,
                child.salesQuotationType
              )
            })
          }
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
        const incotermList = data.incotermList || []
        const paymentTermList = data.paymentTermList || []
        const vendorList = data.vendorList || []
        const receiveAddressList = data.receiveAddressList || []

        this.conditionForDocumentNoList = (data.conditionForDocumentNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })
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
        this.modifiedList = (data.modifiedList || []).map((item) => {
          return {
            value: item.modifiedId,
            label: item.modifiedBy
          }
        })
        this.salesPersonList = (data.salesPersonList || []).map((item) => {
          return {
            value: item.salesPersonId,
            label: item.salesPersonBy
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
          } else if (item.name === 'receiveAddressList') {
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
          if (item.selectId === 'conditionForSQ') {
            this.$set(item, 'fuzzyData', this.conditionForSQList)
          } else if (item.selectId === 'conditionForSO') {
            this.$set(item, 'fuzzyData', this.conditionForSOList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForDocumentNoList)
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
          } else if (item.selectId === 'modifiedIdList') {
            this.$set(item, 'selectData2', this.modifiedList)
          } else if (item.selectId === 'salesPersonIdList') {
            this.$set(item, 'selectData2', this.salesPersonList)
          } else {
            this.$set(item, 'selectData2', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.salesQuotationMainId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/salesManagement/addSalesQuotation',
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
        path: '/salesManagement/editSalesQuotation',
        query: {
          id: row.salesQuotationMainId,
          timeId: Date.now()
        }
      })
    },
    documentTypeGetAuth(documentType) {
      const auth = {
        SalesInquiry: this.salesInquiryAuth,
        ServiceOrder: this.serviceOrderAuth,
        23: this.SICAuth
      }
      return auth[documentType]
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'documentNo') {
        if (!this.documentTypeGetAuth(row.documentType)) {
          return
        }
        if (row.documentType === 'SalesInquiry') {
          this.$router.push({
            path: '/salesManagement/viewSalesInquiry',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === 'ServiceOrder') {
          this.$router.push({
            path: '/salesManagement/viewServiceOrder',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
        if (row.documentType === '23') {
          this.$router.push({
            path: '/projectManagement/viewStoreIssueChit',
            query: {
              id: row.documentId,
              timeId: Date.now()
            }
          })
        }
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
      this.$refs.systemOperationLogTableDlg.handleOpen(querySalesQuotationOperationLog, {
        salesQuotationMainId: row.salesQuotationMainId
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
        params.exportIdList = vm.tableList.map((item) => item.salesQuotationMainId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/salesQuotation/export',
        params,
        `${this.getFileNameDate('Sales Quotation')}.xlsx`
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
        '/sales/salesQuotation/downloadPDF',
        {
          idList: this.ids
        },
        `${this.getFileNameDate('SQ PDF')}.zip`
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
