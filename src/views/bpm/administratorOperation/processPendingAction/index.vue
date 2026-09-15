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
      v-show="showSearch"
    />

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          :loading="batchApproveLoading"
          size="mini"
          @click="handleBatchApprove"
          :disabled="multiple"
          >{{ $t('uiBtn.approve') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          :loading="withdrawApproveLoading"
          size="mini"
          @click="handleBatchWithdraw"
          :disabled="multiple"
          >{{ $t('menu.withdraw') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          :loading="batchRejectedLoading"
          size="mini"
          @click="handleBatchRejected"
          :disabled="multiple"
          >{{ $t('menu.reject1') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          :loading="cancelLoading"
          size="mini"
          @click="handleBatchCancel"
          :disabled="multiple"
          >{{ $t('uiBtn.cancel') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          :loading="batchSkipOverLoading"
          size="mini"
          @click="handleBatchSkipOver"
          :disabled="multiple"
          >{{ $t('menu.SKipOver') }}</el-button
        >
      </el-col>

      <right-toolbar
        ref="rightToolbar"
        :refreshTimeSaveKey="saveKey"
        @autoRefresh="autoRefresh"
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
      class="mt10"
      v-loading="loading"
      :data="tableList"
      max-height="600"
      @sort-change="handleSortChange"
      @row-dblclick="handleDblclick"
      style="cursor: pointer"
      :row-class-name="tableRowClassName"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
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
          <el-tag
            v-if="item.prop === 'isTimeOut'"
            :type="scope.row.isTimeOut === 1 ? '' : 'danger'"
          >
            {{ scope.row.isTimeOut === 1 ? $t('ui.y') : $t('ui.n') }}
          </el-tag>
          <template v-else-if="item.prop === 'todoUserName'">
            <el-popover
              :key="scope.$index"
              trigger="hover"
              placement="bottom"
              effect="light"
              :open-delay="500"
              :disabled="!scope.row.todoUserNamesList"
            >
              <el-scrollbar class="scroll-bar-box">
                <div class="pp-title">
                  {{ $t('bpm.currentParticipants') }}
                </div>
                <div>
                  <div
                    v-for="(list, index) in scope.row.todoUserNamesList || []"
                    :key="index"
                    class="pp-item"
                  >
                    <span>{{ $t('bpm.nameStr') }} {{ Number(index + 1) }} : &nbsp;</span>
                    <span>{{ list }}</span>
                  </div>
                </div>
              </el-scrollbar>
              <div slot="reference" style="height: 100%; line-height: 20px">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                  {{ scope.row.todoUserName }}
                </div>
              </div>
            </el-popover>
          </template>
          <template v-else-if="item.prop === 'businessNo'">
            <div
              @mouseenter="showPop1($event, scope.row, scope.$index)"
              @mouseleave="hidePop1($event, scope.row)"
            >
              <div
                class="ellipsis-text"
                :class="{
                  pointer: ![
                    'inventoryInitializationKey',
                    'requestTrialKey',
                    'approvedSupplierKey',
                    'purchaseContractKey'
                  ].includes(scope.row.moduleKey)
                }"
              >
                <span
                  v-if="
                    $resultOfBoolean(scope.row.businessApprovalStatus) &&
                    Number(scope.row.businessApprovalStatus) !== 1
                  "
                  style="color: #f66c6c"
                  >{{ scope.row[item.prop] }}</span
                >
                <span v-else>{{ scope.row[item.prop] }}</span>
              </div>
            </div>
            <!-- <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template> -->
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        min-width="180"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div @dblclick.stop>
            <el-popover :ref="'popover_' + scope.$index" placement="bottom">
              <!-- 1:"Pending",2:"Closed",3:"Cancelled" -->
              <dl class="pop-list-inrow">
                <dt>{{ $t('bpm.moreActions') }}</dt>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'returnProcessDlg', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:return']"
                  v-if="scope.row.isCanReturned === '1'"
                >
                  {{ $t('bpm.return') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'transferDlg', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:transfer']"
                >
                  {{ $t('bpm.transfer') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'approvalSkipOverDlg', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:SKipOver']"
                  v-if="scope.row.isCanSkipped === '1'"
                >
                  {{ $t('bpm.SKipOver') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'cancelDialog', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:cancel']"
                  v-if="showCancel(scope.row)"
                >
                  {{ $t('bpm.cancel') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'reminder', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:reminder']"
                >
                  {{ $t('bpm.reminder') }}
                </dd>
                <dd
                  @click.stop.prevent="actionHandle(scope.row, 'toDo', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:toDo']"
                >
                  {{ $t('bpm.toDo') }}
                </dd>
                <!-- <dd
                  @click.stop.prevent="actionHandle(scope.row, 'history', scope.$index)"
                  v-hasPermi="['bpm:processPendingAction:history']"
                >
                  {{ $t('bpm.history') }}
                </dd> -->
              </dl>
              <el-button type="text" slot="reference">{{ $t('uiBtn.more') }}</el-button>
            </el-popover>
          </div>
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

    <!-- 回退 -->
    <returnProcessDlg ref="returnProcessDlg" @onSuccess="getList" />
    <!-- 转审 -->
    <transferDlg ref="transferDlg" @onSuccess="getList" />
    <!-- 跳审 -->
    <approvalSkipOverDlg ref="approvalSkipOverDlg" @onSuccess="getList" />
    <!-- 取消 -->
    <cancelDialog ref="cancelDialog" fromType="3" @onSuccess="getList" />
    <!-- 催办提醒 -->
    <reminder ref="reminder" @onSuccess="getList" />
    <!-- 文件号码悬浮 -->
    <documentNoTipShow ref="documentNoTipShow" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/bpm/lang/index'
import {
  getSystemTodoTaskList,
  querySearchListForSystemTodoTaskList,
  batchApprovedBusiness,
  batchWithdrawToRestart,
  batchRejectedBusiness,
  batchCancelledBusiness,
  batchSkipOverProcessToNextNode
} from '@/api/bpm/bpm'
import returnProcessDlg from '@/views/bpm/history/returnProcessDlg/returnProcessDlg'
import transferDlg from '@/views/bpm/history/transferDlg/transferDlg'
import approvalSkipOverDlg from '@/views/bpm/history/approvalSkipOverDlg/approvalSkipOverDlg'
import cancelDialog from '@/views/bpm/history/cancelDialog/cancelDialog'
import reminder from '@/views/bpm/history/reminder/reminder'
import documentNoTipShow from '@/views/bpm/documentNoTipShow/documentNoTipShow.vue'

export default {
  name: 'ProcessPendingAction',
  components: {
    returnProcessDlg,
    transferDlg,
    approvalSkipOverDlg,
    cancelDialog,
    reminder,
    documentNoTipShow
  },
  mixins: [pageMixin],
  dicts: ['bpm_task_status'],
  data() {
    const vm = this
    return {
      ccVisible: false,
      saveKey: '1',
      searchFormKey: Date.now(),
      // 总条数
      total: 0,
      // 角色表格数据
      tableList: [],
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25
      },
      columns: [
        {
          prop: 'taskName',
          label: vm.$t('bpm.taskName'),
          minWidth: 200,
          tooltip: true,
          visible: true,
          fixed: true
        },
        {
          prop: 'businessNo',
          label: vm.$t('bpm.documentNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'ourRef',
          label: vm.$t('bpm.ourRef'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'moduleKeyShowStr',
          label: vm.$t('bpm.module'),
          minWidth: 180,
          sortable: 'custom',
          tooltip: true,
          visible: true
        },
        /* {
          prop: 'taskIdShow',
          label: vm.$t('bpm.instanceId'),
          visible: true,
          tooltip: true,
          minWidth: 160
        }, */
        {
          prop: 'applyUserName',
          label: vm.$t('bpm.initiator'),
          visible: true,
          tooltip: true,
          minWidth: 160
        },
        {
          prop: 'todoUserName',
          label: vm.$t('bpm.currentParticipants'),
          minWidth: 160,
          tooltip: false,
          visible: true
        },
        {
          prop: 'taskStatus',
          propBy: 'taskStatusStr',
          label: vm.$t('bpm.taskStatus'),
          visible: true,
          tooltip: true,
          minWidth: 180
        },
        {
          prop: 'isTimeOut',
          label: vm.$t('bpm.isTimeout'),
          visible: true,
          tooltip: true,
          minWidth: 140
        },
        {
          prop: 'realStartTime',
          label: vm.$t('bpm.startDateTime'),
          sortable: 'custom',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'predictEndTime',
          label: vm.$t('bpm.dueDate'),
          sortable: 'custom',
          visible: true,
          minWidth: 180
        }
      ],
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('bpm.taskName')} / ${vm.$t('bpm.documentNo')}`
        },
        {
          name: 'moduleKeyList',
          label: vm.$t('bpm.module'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'moduleKey',
          selectLabel: 'moduleKeyShowStr',
          filterable: true,
          selectData: []
        },
        {
          name: 'applyUserIdList',
          label: vm.$t('bpm.initiator'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'applyUserId',
          selectLabel: 'applyUserName',
          filterable: true,
          selectData: []
        },
        {
          name: 'isTimeOutList',
          label: vm.$t('bpm.isTimeout'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'value',
          selectLabel: 'label',
          selectData: [
            { label: this.$t('ui.y'), value: '1' },
            { label: this.$t('ui.n'), value: '0' }
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
      batchApproveLoading: false,
      batchRejectedLoading: false,
      withdrawApproveLoading: false,
      cancelLoading: false,
      batchSkipOverLoading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    withdrawAuth() {
      return this.checkPermi(['bpm:processPendingAction:withdraw'])
    },
    cancelAuth() {
      return this.checkPermi(['bpm:processPendingAction:cancel'])
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getCreateDate()
    this.getList()
    this.getSearchData()
    this.initEventBus()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.getSearchData()
  },
  mounted() {},
  beforeDestroy() {
    this.destroyEventBus()
  },
  methods: {
    initEventBus() {
      this.destroyEventBus()
      this.$EventBus.$on('processPendingActionQueryList', () => {
        if (!this.loading) {
          this.getList()
        }
      })
    },
    destroyEventBus() {
      this.$EventBus.$off('processPendingActionQueryList')
    },
    showPop1(e, data) {
      const params = {
        businessId: data.businessId,
        moduleKey: data.moduleKey
      }
      if (this.$refs.documentNoTipShow) {
        this.$refs.documentNoTipShow.showPop(e, params)
      }
    },
    hidePop1(e) {
      this.$refs.documentNoTipShow && this.$refs.documentNoTipShow.hidePop(e)
    },
    getCreateDate() {
      const timer = Date.now()
      const endDate = this.appointTime(timer, '23:59:59')
      const startDate = this.appointTime(timer - 90 * 60 * 60 * 24 * 1000, '00:00:00')
      this.$set(this.queryParams, 'dateRange', [startDate, endDate])
      this.$set(this.queryParams, 'startDateCreatedTime', startDate)
      this.$set(this.queryParams, 'endDateCreatedTime', endDate)
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleBatchApprove() {
      const curIds = this.selectList.map((item) => item.taskId)
      const confirmMsg = this.$t('bpm.batchApproveConfirm')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          this.batchApproveLoading = true
          return batchApprovedBusiness({ taskIdList: curIds })
        })
        .then((res) => {
          this.showBatchActionMsg(res.data || {})
          this.batchApproveLoading = false
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {
          this.batchApproveLoading = false
        })
    },
    handleBatchWithdraw() {
      const curIds = this.selectList.map((item) => item.taskId)
      const confirmMsg = this.$t('bpm.batchWithdrawConfirm')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          this.withdrawApproveLoading = true
          return batchWithdrawToRestart({ taskIdList: curIds })
        })
        .then((res) => {
          this.showBatchActionMsg(res.data || {})
          this.withdrawApproveLoading = false
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {
          this.withdrawApproveLoading = false
        })
    },
    handleBatchRejected() {
      const curIds = this.selectList.map((item) => item.taskId)
      const confirmMsg = this.$t('bpm.batchRejectedConfirm')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          this.batchRejectedLoading = true
          return batchRejectedBusiness({ taskIdList: curIds })
        })
        .then((res) => {
          this.showBatchActionMsg(res.data || {})
          this.batchRejectedLoading = false
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {
          this.batchRejectedLoading = false
        })
    },

    handleBatchCancel() {
      const curIds = this.selectList.map((item) => item.taskId)
      const confirmMsg = this.$t('bpm.batchCancelConfirm')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          this.cancelLoading = true
          return batchCancelledBusiness({ taskIdList: curIds })
        })
        .then((res) => {
          this.showBatchActionMsg(res.data || {})
          this.cancelLoading = false
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {
          this.cancelLoading = false
        })
    },
    handleBatchSkipOver() {
      const curIds = this.selectList.map((item) => item.taskId)
      const confirmMsg = this.$t('bpm.batchSkipOverConfirm')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          this.batchSkipOverLoading = true
          return batchSkipOverProcessToNextNode({ taskIdList: curIds })
        })
        .then((res) => {
          this.showBatchActionMsg(res.data || {})
          this.batchSkipOverLoading = false
          this.getList()
          // this.$modal.msgSuccess(this.$t('ui.changeBPActiveSuccess'))
        })
        .catch(() => {
          this.batchSkipOverLoading = false
        })
    },
    showBatchActionMsg(params) {
      const vm = this
      const { ignoredQty, successQty } = params
      if (successQty > 0 && ignoredQty <= 0) {
        vm.$message.success(`${vm.$t('bpm.batchActionSuccess').replace('$1', `${successQty}`)}`)
      } else if (successQty > 0 && ignoredQty > 0) {
        vm.$message.success(
          `${vm
            .$t('bpm.batchActionSuccessAndFailed')
            .replace('$1', `${successQty}`)
            .replace('$2', `${ignoredQty}`)}`
        )
      } else {
        vm.$modal.msgError(vm.$t('bpm.batchActionFailed'))
      }
    },
    // 主列表
    getList(query) {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.ids = []
      this.selectList = []
      this.loading = true
      if (query && this.$TypeJudge.isObject(query)) {
        if (query.noLoading) {
          this.loading = false
        }
      }
      if (this.$refs.rightToolbar) {
        this.$refs.rightToolbar.autoRefreshSecond = 0
      }

      this.$store.dispatch('getBPMTaskCount')

      getSystemTodoTaskList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.predictStartTime = this.parseTime(item.predictStartTime, this.fmtForYmdhms)
            item.predictEndTime = this.parseTime(item.predictEndTime, this.fmtForYmdhms)
            item.realStartTime = this.parseTime(item.realStartTime, this.fmtForYmdhms)
            item.taskStatusStr = this.selectDictLabel(
              this.dict.type.bpm_task_status,
              item.taskStatus
            )
            item.ourRef = (item.bizVariables || {}).ourRef
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
    autoRefresh() {
      this.getList({ noLoading: true })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.taskStatusStr = this.selectDictLabel(this.dict.type.bpm_task_status, item.taskStatus)
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 下拉搜索列表
    getSearchData() {
      querySearchListForSystemTodoTaskList({}).then((res) => {
        const { applyUserList, moduleKeyList } = res.data
        this.$set(this.searchData[1], 'selectData', moduleKeyList)
        this.$set(this.searchData[2], 'selectData', applyUserList)
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置 */
    resetSearchForm() {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.getCreateDate()
      this.$refs.tables.clearSort()
      this.getList()
      this.getSearchData()
    },
    showReturn(row) {
      const { moduleKey } = row
      const moduleKeys = ['bidEvaluationKey']
      const isShow = moduleKeys.includes(moduleKey)
      return !isShow
    },
    showSkipOver(row) {
      const { moduleKey } = row
      const moduleKeys = ['bidEvaluationKey']
      const isShow = moduleKeys.includes(moduleKey)
      return !isShow
    },
    showCancel(row) {
      const { moduleKey } = row
      const moduleKeys = [
        'specialOrderKey',
        'projectTaskKey',
        'projectCostKey',
        'materialListKey',
        'salesQuotationKey',
        'sysBomKey',
        'requestTrialKey'
      ]
      const isShow = moduleKeys.includes(moduleKey)
      if (moduleKey === 'purchaseOrderKey' && row.isCanCancelled === '0') {
        return false
      }
      return !isShow
    },
    actionHandle(row, type, index) {
      this.$refs[`popover_${index}`].doClose()
      if (type === 'toDo' || type === 'history') {
        const fromSrcPath = encodeURIComponent('/bpm/administratorOperation/processPendingAction')
        let moduleKey = row.moduleKey
        if (row.moduleKey === 'ivtProductKey') {
          moduleKey = moduleKey = row.moduleKey + (row.productType === '2' ? '2' : '1')
        }
        if (row.moduleKey === 'inventoryAuditKey') {
          moduleKey = row.moduleKey + row.inventoryAuditType
        }
        const query = {
          id: row.businessId,
          taskId: row.taskId,
          taskName: row.taskName,
          instanceId: row.processInstance,
          moduleKey: moduleKey,
          // toDo: 1, history: 2, 管理员todo: 3
          dataType: '3',
          fromSrcPath,
          timeId: Date.now()
        }
        if (type === 'history') {
          query.dataType = '3'
          // query.dataType = '2'
        }
        this.$router.push({
          path: '/bpm/history',
          query
        })
        return
      }
      this.$refs[type].handleOpen(row)
    },
    handleDblclick(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      this.handleUpdate(row)
    },

    handleUpdate(row) {
      const fromSrcPath = encodeURIComponent('/bpm/administratorOperation/processPendingAction')
      let moduleKey = row.moduleKey
      if (row.moduleKey === 'ivtProductKey') {
        moduleKey = moduleKey = row.moduleKey + (row.productType === '2' ? '2' : '1')
      }
      if (row.moduleKey === 'inventoryAuditKey') {
        moduleKey = row.moduleKey + row.inventoryAuditType
      }
      this.$router.push({
        path: '/bpm/history',
        query: {
          id: row.businessId,
          taskId: row.taskId,
          taskName: row.taskName,
          instanceId: row.processInstance,
          moduleKey: moduleKey,
          // toDo: 1, history: 2, 管理员todo: 3
          dataType: '3',
          fromSrcPath,
          timeId: Date.now()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.searchWidth {
  width: 240px;
}
.clearfix {
  content: '';
  clear: both;
  zoom: 1;
}

// 滚动条内部内容的效果
.pp-title {
  padding: 1px 5px;
  line-height: 28px;
  vertical-align: middle;
  color: #000000;
  text-align: left;
  font-weight: bold;
  border: 1px solid #efefef;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  // background-color: #aaaaaa;
}
.pp-item {
  padding: 1px 5px;
  line-height: 28px;
  vertical-align: middle;
  color: #000000;
  text-align: left;
  border-left: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  border-right: 1px solid #efefef;
}
.pp-item:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.remarks {
  position: relative;
  padding-left: 210px;
  padding-right: 66px;
  margin: 22px 0;
  > label {
    width: 210px;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.reason {
  position: relative;
  padding-left: 180px;
  padding-right: 60px;
  > label {
    width: 180px;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.searchWidth {
  width: 240px;
}

div.clearfix {
  height: 40px;
  line-height: 40px;
  margin-bottom: 16px;
  overflow: hidden;
}

.pop-list-inrow {
  margin: 0;
  padding: 0;
  line-height: 32px;
  border: 1px solid #efefef;
  border-radius: 4px;

  dt {
    padding: 0 12px;
    font-weight: bold;
    text-align: center;
  }
  dd {
    cursor: pointer;
    border-top: 1px solid #efefef;
    padding: 0 12px;
    margin: 0;
    text-align: center;
  }
}
</style>
