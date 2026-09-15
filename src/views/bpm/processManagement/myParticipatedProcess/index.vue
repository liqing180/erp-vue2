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
      class="mt10"
      v-loading="loading"
      :data="tableList"
      max-height="600"
      @sort-change="handleSortChange"
      @row-dblclick="handleUpdate"
      style="cursor: pointer"
    >
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
          <template v-else-if="item.prop === 'handleUserNameListShowStr'">
            <el-popover
              :key="scope.$index"
              trigger="hover"
              placement="bottom"
              effect="light"
              :open-delay="500"
              :disabled="!scope.row.handleUserNameList"
            >
              <el-scrollbar class="scroll-bar-box">
                <div class="pp-title">
                  {{ $t('bpm.pastParticipants') }}
                </div>
                <div>
                  <div
                    v-for="(list, index) in scope.row.handleUserNameList || []"
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
                  {{ scope.row.handleUserNameListShowStr }}
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
                <template v-if="scope.row.processStatus === 1 || scope.row.processStatus === 2">
                  <dd @click.stop.prevent="actionHandle(scope.row, 'reminder', scope.$index)">
                    {{ $t('bpm.reminder') }}
                  </dd>
                  <dd
                    v-if="showCancel(scope.row)"
                    @click.stop.prevent="actionHandle(scope.row, 'cancelDialog', scope.$index)"
                  >
                    {{ $t('bpm.cancel') }}
                  </dd>
                </template>
                <dd @click.stop.prevent="actionHandle(scope.row, 'history', scope.$index)">
                  {{ $t('bpm.history') }}
                </dd>
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
    <cancelDialog ref="cancelDialog" @onSuccess="getList" />
    <!-- 催办提醒 -->
    <reminder ref="reminder" @onSuccess="getList" />
    <!-- 文件号码悬浮 -->
    <documentNoTipShow ref="documentNoTipShow" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/bpm/lang/index'
import { queryParticipatedProcess, querySearchListForParticipatedProcess } from '@/api/bpm/bpm'
import returnProcessDlg from '@/views/bpm/history/returnProcessDlg/returnProcessDlg'
import transferDlg from '@/views/bpm/history/transferDlg/transferDlg'
import approvalSkipOverDlg from '@/views/bpm/history/approvalSkipOverDlg/approvalSkipOverDlg'
import cancelDialog from '@/views/bpm/history/cancelDialog/cancelDialog'
import reminder from '@/views/bpm/history/reminder/reminder'
import documentNoTipShow from '@/views/bpm/documentNoTipShow/documentNoTipShow.vue'

export default {
  name: 'MyParticipatedProcess',
  components: {
    returnProcessDlg,
    transferDlg,
    approvalSkipOverDlg,
    cancelDialog,
    reminder,
    documentNoTipShow
  },
  mixins: [pageMixin],
  dicts: ['approved_status'],
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
          prop: 'processName',
          label: vm.$t('bpm.processName'),
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
        {
          prop: 'subject',
          label: vm.$t('bpm.subject'),
          minWidth: 180,
          tooltip: true,
          visible: true
        },
        /* {
          prop: 'processInstance',
          label: vm.$t('bpm.instanceId'),
          visible: true,
          tooltip: true,
          minWidth: 160
        }, */
        {
          prop: 'applyUserName',
          label: vm.$t('bpm.initiator'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 160
        },
        {
          prop: 'handleUserNameListShowStr',
          label: vm.$t('bpm.pastParticipants'),
          minWidth: 160,
          tooltip: false,
          visible: true
        },
        {
          prop: 'processStatus',
          propBy: 'processStatusStr',
          label: vm.$t('bpm.processStatus'),
          visible: true,
          tooltip: true,
          minWidth: 180
        },
        {
          prop: 'priority',
          label: vm.$t('bpm.priority'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 160
        },
        {
          prop: 'isTimeOut',
          label: vm.$t('bpm.isTimeout'),
          visible: true,
          tooltip: true,
          minWidth: 140
        },
        {
          prop: 'startTime',
          label: vm.$t('bpm.startDateTime'),
          sortable: 'custom',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'realEndTime',
          label: vm.$t('bpm.endDateTime'),
          sortable: 'custom',
          visible: true,
          minWidth: 180
        },
        {
          prop: 'realTimeConsumingShowStr',
          label: vm.$t('bpm.timeConsuming'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 180
        }
      ],
      searchData: [
        {
          name: 'condition',
          type: 'InputEle',
          placeholder: `${vm.$t('bpm.processName')} / ${vm.$t('bpm.documentNo')} / ${vm.$t(
            'bpm.subject'
          )}`
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
          name: 'handleUserNameList',
          label: vm.$t('bpm.pastParticipants'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'handleUserId',
          selectLabel: 'handleUserName',
          filterable: true,
          selectData: []
        },
        {
          name: 'processStatusList',
          label: vm.$t('bpm.processStatus'),
          type: 'MultipleSelectEle',
          width: '200px',
          selectValue: 'dictValue',
          selectLabel: 'dictLabel',
          dict: 'approved_status',
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
      ]
    }
  },
  computed: {
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
  created() {
    this.createdInitTimer = Date.now()
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getCreateDate()
    this.getList()
    this.getSearchData()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
    this.getSearchData()
  },
  mounted() {},
  methods: {
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
    getList() {
      let param = { ...this.queryParams }
      param = this.$trimOfObj(param)
      this.loading = true
      queryParticipatedProcess(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.realEndTime = this.parseTime(item.realEndTime, this.fmtForYmdhms)
            item.startTime = this.parseTime(item.startTime, this.fmtForYmdhms)
            item.processStatusStr = this.selectDictLabel(
              this.dict.type.approved_status,
              item.processStatus
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
    onDictReady() {
      this.tableList.forEach((item) => {
        item.processStatusStr = this.selectDictLabel(
          this.dict.type.approved_status,
          item.processStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    // 下拉搜索列表
    getSearchData() {
      querySearchListForParticipatedProcess({}).then((res) => {
        const { applyUserList, moduleKeyList, handleUserList } = res.data
        this.$set(this.searchData[1], 'selectData', moduleKeyList)
        this.$set(this.searchData[2], 'selectData', applyUserList)
        this.$set(this.searchData[3], 'selectData', handleUserList)
      })
    },
    showCancel(row) {
      const { moduleKey } = row
      const moduleKeys = [
        'specialOrderKey',
        'projectTaskKey',
        'projectCostKey',
        'materialListKey',
        'salesQuotationKey',
        'requestTrialKey',
        'sysBomKey'
      ]
      const isShow = moduleKeys.includes(moduleKey)
      if (moduleKey === 'purchaseOrderKey' && row.isCanCancelled === '0') {
        return false
      }
      return !isShow
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
    actionHandle(row, type, index) {
      this.$refs[`popover_${index}`].doClose()
      if (type === 'toDo' || type === 'history') {
        const fromSrcPath = encodeURIComponent('/bpm/processManagement/myParticipatedProcess')
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
          dataType: '1',
          fromSrcPath,
          timeId: Date.now()
        }
        if (type === 'history') {
          query.dataType = '2'
        }
        this.$router.push({
          path: '/bpm/history',
          query
        })
        return
      }
      this.$refs[type].handleOpen(row)
    },
    ccVisibleChange(data) {
      this.ccVisible = data || false
    },
    ccSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm
          .$t('adminOperation.cancelledSuccess')
          .replace('$1', `[${vm.curRowDataInRow.processName}]`)}`
      )
      vm.ccVisible = false
      vm.queryTableList()
    },
    handleAdd() {
      this.$router.push({ path: '/system/addTax' })
    },
    handleUpdate(row) {
      const fromSrcPath = encodeURIComponent('/bpm/processManagement/myParticipatedProcess')
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
          dataType: '1',
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
