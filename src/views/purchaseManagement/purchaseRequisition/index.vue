<template>
  <div class="app-container">
    <el-tabs
      ref="tabsRef"
      type="card"
      :key="'tabs_' + tabsKey"
      v-model="activeName"
      @tab-click="tabClickHandler"
    >
      <el-tab-pane size="" v-for="(item, index) in tabs" :key="index" :name="item.value">
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['purchaseManagement:purchaseRequisition:add']"
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
          v-hasPermi="['purchaseManagement:purchaseRequisition:export']"
          >{{ $t('uiBtn.export') }}</el-button
        >
      </el-col>
      <el-col :span="10" class="ml20" v-show="['0', '1', '2', '3', '4'].indexOf(activeName) !== -1">
        <div class="flexStart" style="height: 30px">
          <div class="mr10 fs-0" style="font-size: 12px">
            <svg-icon icon-class="filter" />
            {{ $t('PURCHASE.deliveryStatus') }} ：
          </div>
          <ul class="flex" style="margin-bottom: 0">
            <li
              v-for="(item, index) in filterList"
              :key="index"
              :class="[
                'tag',
                'fs-0',
                'pointer',
                'tag-' + index,
                item.id === queryParams.deliveryStatus ? 'tag-active-' + index : ''
              ]"
              @click="deliveryStatusChange(item)"
            >
              <svg-icon
                :icon-class="
                  item.id === queryParams.deliveryStatus
                    ? 'filter-active-' + item.id
                    : 'filter-' + item.id
                "
                class="mr5"
                style="font-size: 18px"
                v-if="item.id !== '0'"
              />
              <span>{{ item.name }}</span>
              <span v-if="item.num"> ({{ item.num }})</span>
            </li>
          </ul>
        </div>
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
      row-key="purchaseRequisiteId"
      style="cursor: pointer"
      :max-height="tableMaxHeight - 80"
    >
      <el-table-column
        v-if="checkPermi(['purchaseManagement:purchaseRequisition:export'])"
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
          <template v-else-if="item.prop === 'productName'">
            <div @mouseenter="showPop($event, scope.row)" @mouseleave="hidePop($event, scope.row)">
              <div class="ellipsis-text">{{ scope.row.productName }}</div>
            </div>
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
  queryPurchaseRequisiteList,
  queryPROperationLog,
  queryDeliveryStatusCount
} from '@/api/purchaseManagement/purchaseRequisition'
import systemOperationLogTableDlg from '@/views/components/systemOperationLog/systemOperationLogTableDlg.vue'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'

export default {
  name: 'PurchaseRequisition',
  dicts: ['p_required_type'],
  mixins: [pageMixin, tableDataMixin],
  components: { systemOperationLogTableDlg, ToolTipShowListForFN },
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
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/system/product/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/system/product/checkImportData',
        // 提交导入
        importUrl: '/system/product/importData',
        // 下载文件名
        fileName: 'Purchase Requisition'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined,
        selectId: 'conditionForPurchaseRequisiteNo',
        inputVal: '',
        deliveryStatus: '0'
      },
      statusDicts: [],
      approvedStatusDicts: [],
      searchData: [],
      searchData1: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          label: '',
          minSelectWidth: 140,
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            {
              label: this.$t('PURCHASE.purchaseRequisitionNo'),
              value: 'conditionForPurchaseRequisiteNo'
            },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: 'conditionForPurchaseRequisiteNo',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'purchaseRequisiteStatusList',
          label: vm.$t('ui.status'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'approvedStatusList',
          label: vm.$t('ui.processStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: []
        },
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('PURCHASE.department'),
        //   type: 'MultipleSelectEle',
        //   filterable: true,
        //   width: '200px',
        //   selectValue: 'departmentId',
        //   selectLabel: 'departmentName',
        //   selectData: []
        // },
        {
          name: 'departmentIdList',
          label: vm.$t('PURCHASE.department'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'requiredIdList',
          label: vm.$t('PURCHASE.requiredBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'requiredId',
          selectLabel: 'requiredBy',
          selectData: []
        },
        {
          name: 'dropShippingList',
          label: vm.$t('PURCHASE.dropShipping'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: [
            {
              dictValue: '1',
              dictLabel: vm.$t('uiBtn.active')
            },
            {
              dictValue: '0',
              dictLabel: vm.$t('uiBtn.inactive')
            }
          ]
        },
        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      searchData2: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('PURCHASE.projectCode')} / ${this.$t('ui.productSearch')}`
        },
        /* {
          name: 'selectAnInputName',
          label: '',
          minSelectWidth: 140,
          type: 'SelectAnInput',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            {
              label: this.$t('PURCHASE.purchaseRequisitionNo'),
              value: 'conditionForPurchaseRequisiteNo'
            },
            { label: this.$t('PURCHASE.DocNo'), value: 'conditionForDocumentNo' }
          ],
          selectName: 'selectId',
          inputName: 'inputVal',
          selectId: 'conditionForPurchaseRequisiteNo',
          inputVal: '',
          fuzzyData: [],
          defaultProps: {
            value: 'value',
            label: 'label'
          }
        }, */
        {
          name: 'receiveAddressNameList',
          label: vm.$t('PURCHASE.deliveryAddress'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'receiveAddressName',
          selectLabel: 'receiveAddressName',
          selectData: []
        },
        // {
        //   name: 'departmentIdList',
        //   label: vm.$t('PURCHASE.department'),
        //   type: 'MultipleSelectEle',
        //   filterable: true,
        //   width: '200px',
        //   selectValue: 'departmentId',
        //   selectLabel: 'departmentName',
        //   selectData: []
        // },
        {
          name: 'departmentIdList',
          label: vm.$t('PURCHASE.department'),
          type: 'ElcascaderEle',
          width: '230px',
          mapValue: 'value',
          mapLabel: 'label',
          selectData: []
        },
        {
          name: 'requiredIdList',
          label: vm.$t('PURCHASE.requiredBy'),
          type: 'MultipleSelectEle',
          filterable: true,
          width: '200px',
          selectValue: 'requiredId',
          selectLabel: 'requiredBy',
          selectData: []
        },
        {
          name: 'dropShippingList',
          label: vm.$t('PURCHASE.dropShipping'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          selectData: [
            {
              dictValue: '1',
              dictLabel: vm.$t('uiBtn.active')
            },
            {
              dictValue: '0',
              dictLabel: vm.$t('uiBtn.inactive')
            }
          ]
        },

        {
          name: 'dateRange',
          label: vm.$t('ui.createdTime'),
          type: 'DatePickerEleShortcuts',
          format: 'timestamp',
          startDate: 'startDateCreatedTime',
          endDate: 'endDateCreatedTime'
        }
      ],
      searchFormKey: Date.now(),
      filterList: [
        { id: '0', name: vm.$t('PURCHASE.all'), value: 'all', num: 0 },
        { id: '2', name: vm.$t('PURCHASE.overdue'), value: 'overdue', num: 0 },
        { id: '1', name: vm.$t('PURCHASE.dueSoon'), value: 'dueSoon', num: 0 }
      ]
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.params.isGetList && route.name === 'PurchaseRequisition') {
          this.activeName = '0'
          this.searchData = this.searchData1
          this.resetSearchForm(false)
          const params = route.params || {}
          if (this.createdInitTimer) {
            this.createdInitTimer = Date.now()
            setTimeout(() => {
              this.searchData[1].selectId = 'conditionForDocumentNo'
              this.searchData[1].inputVal = params.salesOrderNo
              this.$set(this.queryParams, 'selectId', 'conditionForDocumentNo')
              this.$set(this.queryParams, 'inputVal', params.salesOrderNo)
              this.getList()
              this.querySearchList()
            }, 100)
          } else {
            this.$set(this.queryParams, 'selectId', 'conditionForDocumentNo')
            this.$set(this.queryParams, 'inputVal', params.salesOrderNo)
            this.searchData[1].selectId = 'conditionForDocumentNo'
            this.searchData[1].inputVal = params.salesOrderNo
          }
        }
      },
      immediate: true
    }
  },
  computed: {
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
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  async created() {
    this.createdInitTimer = Date.now()
    this.searchData = this.searchData1
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.initCreatedTime()
    // $$initColumnVisible 在 ./tableDataMixin.js 调用了
    const res = await this.MyDictDataClass.getDictFn('p_purchase_requisite_status')
    const res1 = await this.MyDictDataClass.getDictFn('approved_status')
    this.statusDicts = (res || []).map((item) => {
      return {
        label: item.dictLabel,
        value: item.dictValue
      }
    })
    this.approvedStatusDicts = (res1 || []).map((item) => {
      return {
        label: item.dictLabel,
        value: item.dictValue
      }
    })
    this.searchData1.forEach((item) => {
      if (item.name === 'purchaseRequisiteStatusList') {
        item.selectData = this.statusDicts
      }
      if (item.name === 'approvedStatusList') {
        item.selectData = this.approvedStatusDicts
      }
    })
    this.getList()
    this.querySearchList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.querySearchList()
  },
  methods: {
    showPop(e, row) {
      const list = row.purchaseRequisiteDetailList || []
      const params = {
        // popoverTitle: this.$t('PURCHASE.DocNo'),
        labelKey: 'productName',
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
    initCreatedTime() {
      const end = this.appointTime(Date.now(), '23:59:59')
      const startTimer = this.appointTime(Date.now(), '00:00:00') - 3600 * 1000 * 24 * 179
      this.$set(this.queryParams, 'dateRange', [startTimer, end])
      this.$set(this.queryParams, 'startDateCreatedTime', startTimer)
      this.$set(this.queryParams, 'endDateCreatedTime', end)
    },
    tabClickHandler() {
      if (this.activeName === '0') {
        this.searchData = this.searchData1
      } else {
        this.searchData = this.searchData2
      }
      const { pageSize, dateRange, startDateCreatedTime, endDateCreatedTime } = this.queryParams
      this.queryParams = {
        pageNum: 1,
        pageSize,
        dateRange,
        startDateCreatedTime,
        endDateCreatedTime
      }
      this.searchData[1].selectId = 'conditionForPurchaseRequisiteNo'
      this.queryParams.selectId = 'conditionForPurchaseRequisiteNo'
      this.queryParams.deliveryStatus = '0'
      this.searchData[1].inputVal = ''
      // this.initCreatedTime()
      this.getList()
      this.querySearchList()
    },
    deliveryStatusChange(item) {
      this.$set(this.queryParams, 'deliveryStatus', item.id)
      this.getList()
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (
        ['0', '1', '2', '3', '4'].indexOf(this.activeName) !== -1 &&
        (row.deliveryStatus === '1' || row.deliveryStatus === '2') &&
        row.requiredType !== '7' &&
        ['6', '7', '8'].indexOf(row.purchaseRequisiteStatus) === -1
      ) {
        color = 'row-deliveryStatus-' + row.deliveryStatus
      }
      for (const item of this.ids.values()) {
        if (item === row.purchaseRequisiteId) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      if (row.isWarning === '1') {
        color = 'table-warning-bgcolor'
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
    queryDeliveryStatusCount() {
      let params = { ...this.queryParams }
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
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
      queryDeliveryStatusCount(params).then((res) => {
        const data = res.data || {}
        this.filterList.forEach((item, index) => {
          this.$set(item, 'num', data[item.value])
        })
        console.log(this.filterList, '=========691')
      })
    },
    /** 查询用户列表 */
    getList(query) {
      this.$store.dispatch('getPurchaseTaskCount')
      this.queryCountList()
      this.queryDeliveryStatusCount()
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
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      if (params.orderByColumn === 'purchaseRequisiteStatusShowStr') {
        params.orderByColumn = 'purchaseRequisiteStatus'
      }
      params = this.$trimOfObj(params)
      params.labelType = this.activeName
      const timer = Date.now()
      this.queryTime = timer
      queryPurchaseRequisiteList(params).then((response) => {
        if (timer !== this.queryTime) return
        this.tableList = []
        const rows = response.rows || []
        rows.forEach((item) => {
          item.createdTime = this.parseTime(item.createdTime, this.fmtForYmdhms)
          item.modifiedTime = this.parseTime(item.modifiedTime, this.fmtForYmdhms)
          item.approvedTime = this.parseTime(item.approvedTime, this.fmtForYmdhms)
          item.deliveryDate = this.parseTime(item.deliveryDate, this.fmtForYmd)

          item.requiredTypeStr = this.selectDictLabel(
            this.dict.type.p_required_type,
            item.requiredType
          )

          item.approvedStatusStr = this.selectDictLabel(
            this.approvedStatusDicts,
            item.approvedStatus
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
        const receiveAddressList = data.receiveAddressList || []
        // const departmentList = data.departmentList || []
        const userList = data.userList || []
        /* const topRow = { ...userList[0] }
        topRow.requiredBy = 'admin123'
        userList.push({ ...topRow })
        userList.forEach((item, index) => {
          item.requiredId = item.requiredId + '-' + '李青' + index
        }) */

        this.conditionForPurchaseRequisiteNoList = (
          data.conditionForPurchaseRequisiteNoList || []
        ).map((item) => {
          return {
            value: item,
            label: item
          }
        })
        this.conditionForDocumentNoList = (data.conditionForDocumentNoList || []).map((item) => {
          return {
            value: item,
            label: item
          }
        })

        const departmentList = data.branchCompanyList || []
        this.handle(departmentList)
        this.searchData.forEach((item) => {
          if (item.name === 'receiveAddressNameList') {
            this.$set(item, 'selectData', receiveAddressList)
          } else if (item.name === 'departmentIdList') {
            this.$set(item, 'selectData', departmentList)
          } else if (item.name === 'requiredIdList') {
            this.$set(item, 'selectData', userList)
          }
        })

        this.setFuzzyData()
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
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }

      this.searchData[1].selectId = 'conditionForPurchaseRequisiteNo'
      this.queryParams.selectId = 'conditionForPurchaseRequisiteNo'
      this.queryParams.deliveryStatus = '0'

      this.searchData[1].inputVal = ''
      this.initCreatedTime()
      this.$refs.tables && this.$refs.tables.clearSort()
      if (isGetList) {
        this.getList()
      }
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
          if (item.selectId === 'conditionForPurchaseRequisiteNo') {
            this.$set(item, 'fuzzyData', this.conditionForPurchaseRequisiteNoList)
          } else if (item.selectId === 'conditionForDocumentNo') {
            this.$set(item, 'fuzzyData', this.conditionForDocumentNoList)
          } else {
            this.$set(item, 'fuzzyData', [])
          }
        }
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.purchaseRequisiteId)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/purchaseManagement/addPurchaseRequisition',
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
        path: '/purchaseManagement/editPurchaseRequisition',
        query: {
          id: row.purchaseRequisiteId,
          timeId: Date.now()
        }
      })
    },
    /* 查看操作日志 */
    handleOperationLog(row) {
      this.$refs.systemOperationLogTableDlg.handleOpen(queryPROperationLog, {
        purchaseRequisiteId: row.purchaseRequisiteId
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
      params.labelType = this.activeName
      params.exportType = exportType
      if (params.inputVal && params.selectId) {
        params[params.selectId] = params.inputVal
      }
      if (params.departmentIdList && params.departmentIdList.length > 0) {
        params.departmentIdList = params.departmentIdList.map((x) => {
          return x[x.length - 1]
        })
      } else {
        params.departmentIdList = undefined
      }
      if (exportType === 2) {
        params.exportIdList = vm.tableList.map((item) => item.purchaseRequisiteId)
      }
      if (exportType === 3) {
        params.exportIdList = vm.ids
      }
      params.exportFields = this.getTablePropListForSort(this.visibleCurColumns)
      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/purchase/purchaseRequisite/export',
        params,
        `${this.getFileNameDate('Purchase Requisite')}.xlsx`
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
.tag {
  font-size: 12px;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
  border-radius: 5px;
  margin-right: 10px;
  background-color: #f3f4f6;
}
.tag-active-0 {
  color: #fff;
  background-color: #2f3846;
}
.tag-1 {
  color: #e86e6d;
  background-color: #fff1f0;
}
.tag-active-1 {
  color: #fff;
  background-color: #ef4444;
}
.tag-2 {
  color: #e39842;
  background-color: #fffbe6;
}
.tag-active-2 {
  color: #fff;
  background-color: #f59e0b;
}
</style>
