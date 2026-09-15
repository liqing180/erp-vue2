<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" class="mt20" @tab-click="tabClickHandler">
      <el-tab-pane
        v-for="item in tabDictList"
        :label="item.label"
        :key="item.label"
        :name="item.value"
      >
      </el-tab-pane>
    </el-tabs>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-if="activeName === '28'"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
      <right-toolbar
        :saveKey="saveKey"
        :showSearch.sync="showSearch"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
        :showSearchBtn="false"
      ></right-toolbar>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      :key="tableKey"
      @row-dblclick="handleEdit"
      style="cursor: pointer"
    >
      <el-table-column
        v-if="false"
        type="selection"
        key="column1"
        width="50"
        align="center"
        :selectable="selectable"
      />
      <el-table-column
        type="index"
        key="column2"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
      >
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
        :min-width="item.minWidth"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
        header-align="center"
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'isActive'">
            <el-tag v-if="scope.row.isActive === '1'">{{ $t('uiBtn.active') }}</el-tag>
            <el-tag v-if="scope.row.isActive === '0'" type="danger">{{
              $t('uiBtn.inactive')
            }}</el-tag>
          </template>
          <template v-else-if="['rubberStamp'].includes(item.prop)">
            <el-tag v-if="scope.row[item.prop] === '1'">{{ $t('ui.y') }}</el-tag>
            <el-tag v-if="scope.row[item.prop] === '0'" type="danger">{{ $t('ui.n') }}</el-tag>
          </template>
          <template v-else-if="item.prop === 'modifiedTime'">
            {{ parseTime(scope.row.modifiedTime, fmtForYmdhms) }}
          </template>
          <template v-else-if="item.prop === 'createdTime'">
            {{ parseTime(scope.row.createdTime, fmtForYmdhms) }}
          </template>
          <template v-else-if="item.prop === 'moduleItBelongsTo'"
            >{{ selectDictLabel(tabDictList, scope.row.moduleItBelongsTo) }}
          </template>
          <template v-else-if="item.prop === 'deliveryProcedure'"
            >{{
              selectDictLabel(dict.type.dm_delivery_procedure_type, scope.row.deliveryProcedure)
            }}
          </template>
          <template v-else-if="item.prop === 'notificationMethod'">
            <span>{{ notificationMethodHandler(scope.row.notificationMethod) }}</span>
          </template>
          <template v-else-if="item.prop === 'application'"
            >{{ handler(salesOrderTypeList, scope.row) }}
          </template>
          <template v-else-if="item.prop === 'reminderTime'"
            >{{ $resultOfBoolean(scope.row.reminderTime) ? scope.row.reminderTime + ' s' : '' }}
          </template>
          <template v-else-if="item.prop === 'timeOffline'"
            >{{ scope.row.timeOffline + ' ' + scope.row.route_tracking_unit }}
          </template>
          <template v-else-if="item.prop === 'scheduledDispatchTime'"
            >{{ scope.row.scheduledDispatchTime + ' s' }}
          </template>
          <el-switch
            v-else-if="
              [
                'automaticDispatchIsOpen',
                'insertTruck',
                'exitQueueIsOpen',
                'noticeOfShipmentGoods',
                'arrivalNotice'
              ].includes(item.prop)
            "
            v-model="scope.row[item.prop]"
            active-value="1"
            inactive-value="0"
            :disabled="true"
          ></el-switch>
          <template v-else-if="activeName === '28' && item.prop === 'status'">
            <el-switch
              v-model="scope.row[item.prop]"
              active-value="0"
              inactive-value="1"
              :disabled="true"
            ></el-switch>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        key="customerDisplay"
        :label="$t('ui.customerDisplay')"
        width="180"
        align="center"
        v-if="activeName === '6'"
      >
        <template slot-scope="scope">
          <!-- <el-tag v-if="scope.row.customerDisplay === '1'">{{ $t('uiBtn.open') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('uiBtn.close') }}</el-tag> -->

          <el-tag v-if="scope.row.customerDisplay === '1'">{{ $t('uiBtn.active') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('uiBtn.inactive') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
        v-if="editAuth"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr5"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-hasPermi="['operation:setup:edit']"
              @click="handleEdit(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-if="false"
      :saveKey="'1'"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <editFieldDlg :editAuth="editAuth" ref="editFieldDlg" @onSuccess="getList" />
    <editGeofenceFieldDlg :editAuth="editAuth" ref="editGeofenceFieldDlg" @onSuccess="getList" />
    <editAllowOrderExcessDlg
      :editAuth="editAuth"
      ref="editAllowOrderExcessDlg"
      @onSuccess="getList"
    />
    <editTimeThresholdDlg :editAuth="editAuth" ref="editTimeThresholdDlg" @onSuccess="getList" />
    <editReminderTimeDlg :editAuth="editAuth" ref="editReminderTimeDlg" @onSuccess="getList" />
    <editRubberStampDlg :editAuth="editAuth" ref="editRubberStampDlg" @onSuccess="getList" />
    <editRouteTrackingDlg :editAuth="editAuth" ref="editRouteTrackingDlg" @onSuccess="getList" />
    <editDispatchRuleDlg :editAuth="editAuth" ref="editDispatchRuleDlg" @onSuccess="getList" />
    <editDeliveryProcedureDlg
      :editAuth="editAuth"
      ref="editDeliveryProcedureDlg"
      @onSuccess="getList"
    />
    <addOrEditRejectReasonDlg
      ref="addOrEditRejectReasonDlg"
      :editAuth="editAuth"
      @onSuccess="getList"
    />
    <addOrEditWaybillNoticeDlg
      ref="addOrEditWaybillNoticeDlg"
      :editAuth="editAuth"
      @onSuccess="getList"
    />
  </div>
</template>

<script>
import { querySetupFieldList, queryModuleDic, queryRejectReasons } from '@/api/operation/setup'
import editFieldDlg from '@/views/components/setup/editFieldDlg.vue'
import editGeofenceFieldDlg from '@/views/components/setup/editGeofenceFieldDlg.vue'
import editAllowOrderExcessDlg from '@/views/components/setup/editAllowOrderExcessDlg.vue'
import editTimeThresholdDlg from '@/views/components/setup/editTimeThresholdDlg.vue'
import editReminderTimeDlg from '@/views/components/setup/editReminderTimeDlg.vue'
import editRubberStampDlg from '@/views/components/setup/editRubberStampDlg.vue'
import editRouteTrackingDlg from '@/views/components/setup/editRouteTrackingDlg.vue'
import editDispatchRuleDlg from '@/views/components/setup/editDispatchRuleDlg.vue'
import editDeliveryProcedureDlg from '@/views/components/setup/editDeliveryProcedureDlg.vue'
import addOrEditRejectReasonDlg from '@/views/components/setup/addOrEditRejectReasonDlg.vue'
import addOrEditWaybillNoticeDlg from '@/views/components/setup/addOrEditWaybillNoticeDlg.vue'

import pageMixin from '@/mixins/tableMinx'
import { downloadFile } from '@/api/basic/basic'
import downFile from '@/utils/downFile.js'
const queryParams = {
  pageNum: 1,
  pageSize: 25
}
export default {
  dicts: ['dm_delivery_procedure_type'],
  mixins: [pageMixin],
  components: {
    editFieldDlg,
    editGeofenceFieldDlg,
    editAllowOrderExcessDlg,
    editTimeThresholdDlg,
    editReminderTimeDlg,
    editRubberStampDlg,
    editRouteTrackingDlg,
    editDispatchRuleDlg,
    editDeliveryProcedureDlg,
    addOrEditRejectReasonDlg,
    addOrEditWaybillNoticeDlg
  },
  props: {
    from: {
      type: String,
      default: '1'
    },
    editAuth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      activeName: '1',
      // 选中数组
      ids: [],
      selectList: [],
      // 非单个禁用
      single: true,
      // 遮罩层
      loading: true,
      // 非多个禁用
      multiple: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      tableList: [],
      // 请求参数
      queryParams: { ...queryParams },
      columns: [],
      columns1: [
        {
          prop: 'fieldId',
          label: vm.$t('Operation.fieldId'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'fieldName',
          label: vm.$t('Operation.fieldName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      columns14: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'geofenceRadius',
          label: vm.$t('Operation.geofenceRadius'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'geofenceRadiusUom',
          label: vm.$t('ui.unit'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'geofenceTime',
          label: vm.$t('Operation.geofenceTime_s'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      columns17: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'application',
          label: vm.$t('Operation.application'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      columns18: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'divertReworkTimeThreshold',
          label: vm.$t('Operation.divertReworkTimeThreshold'),
          visible: true,
          minWidth: 230,
          tooltip: true
        },
        {
          prop: 'timeThresholdUom',
          label: vm.$t('ui.unit'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      columns19: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'reminderTime',
          label: vm.$t('Operation.reminderTime'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'exitQueueIsOpen',
          label: vm.$t('Operation.exitQueue'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns20: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'rubberStamp',
          label: vm.$t('Operation.rubberStamp'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns25: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'timeOffline',
          label: vm.$t('Operation.timeOffline'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns26: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'automaticDispatchIsOpen',
          label: vm.$t('Operation.automaticDispatch'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'scheduledDispatchTime',
          label: vm.$t('Operation.scheduledDispatchTime'),
          visible: true,
          minWidth: 220,
          tooltip: true
        },
        {
          prop: 'loadOrderAmount',
          label: vm.$t('Operation.loadOrderAmount'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'insertTruck',
          label: vm.$t('Operation.insertTruck'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns27: [
        {
          prop: 'moduleItBelongsTo',
          label: vm.$t('Operation.moduleItBelongsTo'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'deliveryProcedure',
          label: vm.$t('Operation.deliveryProcedure'),
          visible: true,
          minWidth: 180,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns28: [
        {
          prop: 'dictLabel',
          label: vm.$t('Operation.rejectReason'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'status',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      columns29: [
        {
          prop: 'noticeOfShipmentGoods',
          label: vm.$t('Operation.noticeOfShipmentGoods'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'arrivalNotice',
          label: vm.$t('Operation.arrivalNotice'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'notificationMethod',
          label: vm.$t('Operation.notificationMethod'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 120,
          visible: true,
          tooltip: true
        },
        {
          prop: 'createdTime',
          label: vm.$t('ui.createdTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedBy',
          label: vm.$t('ui.modifiedBy'),
          minWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'modifiedTime',
          label: vm.$t('ui.modifiedTime'),
          minWidth: 160,
          visible: true,
          tooltip: true
        }
      ],
      tabDictList: [],
      tableKey: 0,
      salesOrderTypeList: []
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
    // this.$i18n.mergeLocaleMessage('zh', locale.zh)
    // this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.createdInitTimer = Date.now()
    this.saveKey = '1'
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns1)
    this.columns = this.columns1
    this.queryModuleDic()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.getList()
  },
  methods: {
    handleAdd() {
      this.$refs.addOrEditRejectReasonDlg.handleAdd()
    },
    async queryModuleDic() {
      queryModuleDic(this.from).then(async (res) => {
        const data = res.data || []
        this.tabDictList = data.map((item) => {
          return {
            value: item.dictValue,
            label: item.dictLabel
          }
        })
        if (this.tabDictList.length > 0) {
          this.activeName = this.tabDictList[0].value
        } else {
          this.activeName = undefined
        }
        const dictList = await this.MyDictDataClass.getDictFn('sales_order_type')
        this.salesOrderTypeList = dictList
        this.getList()
      })
    },
    handleViewDetail(row) {
      console.log(row)
      const url = downloadFile
      const param = { id: row.id }
      downFile('post', url, param)
    },
    handler(list, row) {
      const { application } = row
      if (application && application.length > 0) {
        const newArr = list.filter((x) => application.indexOf(x.dictValue) !== -1)
        return newArr.map((x) => x.dictLabel).join(',')
      }
      return ''
    },
    notificationMethodHandler(type) {
      const list = [
        { value: '1', label: 'Email' },
        { value: '2', label: 'WhatsApp' }
      ]
      if (!type) return ''
      return list
        .filter((x) => type.indexOf(x.value) !== -1)
        .map((x) => x.label)
        .join(',')
    },
    async tabClickHandler(value) {
      if (this.activeName === '14' || this.activeName === '15') {
        this.saveKey = '14'
        this.columns = this.columns14
      } else if (this.activeName === '17') {
        this.saveKey = '17'
        this.columns = this.columns17
      } else if (this.activeName === '18') {
        this.saveKey = '18'
        this.columns = this.columns18
      } else if (this.activeName === '19') {
        this.saveKey = '19'
        this.columns = this.columns19
      } else if (this.activeName === '20') {
        this.saveKey = '20'
        this.columns = this.columns20
      } else if (this.activeName === '25') {
        this.saveKey = '25'
        this.columns = this.columns25
      } else if (this.activeName === '26') {
        this.saveKey = '26'
        this.columns = this.columns26
      } else if (this.activeName === '27') {
        this.saveKey = '27'
        this.columns = this.columns27
      } else if (this.activeName === '28') {
        this.saveKey = '28'
        this.columns = this.columns28
      } else if (this.activeName === '29') {
        this.saveKey = '29'
        this.columns = this.columns29
      } else {
        this.saveKey = '1'
        this.columns = this.columns1
      }
      this.$$initColumnVisible(this.saveKey, this.columns)
      this.getList()
    },
    /** 查询用户列表 */
    getList() {
      if (!this.activeName) {
        this.loading = false
        return
      }
      this.loading = true
      let { dateRange, ...params } = this.queryParams
      params = this.$trimOfObj(params)
      params.moduleItBelongsTo = this.activeName
      if (params.moduleItBelongsTo === '28') {
        queryRejectReasons().then((response) => {
          console.log(response, '===')
          this.tableList = response.data || []
          this.total = 0
          this.loading = false
        })
      } else {
        querySetupFieldList(params).then((response) => {
          const rows = response.rows
          rows.forEach((item) => {
            if (item.customConfigFields) {
              /* 地理围栏半径 */
              item.geofenceRadius = item.customConfigFields.RADIUS
              item.geofenceRadiusUom = item.customConfigFields.UOM
              item.geofenceTime = item.customConfigFields.TIME

              item.application = item.customConfigFields.APPLICATION

              /* 调度管理 - 处理时限 */
              item.divertReworkTimeThreshold = item.customConfigFields.TIME_THRESHOLD_TIME
              item.timeThresholdUom = item.customConfigFields.TIME_THRESHOLD_UNIT

              /* 调度管理 - 接单时限 */
              item.reminderTime = item.customConfigFields.REMINDER_TIME
              item.exitQueueIsOpen = item.customConfigFields.EXIT_QUEUE_IS_OPEN

              /* 调度管理 - 第三方验证 */
              item.rubberStamp = item.customConfigFields.RUBBER_STAMP

              /* 调度管理 - 运输轨迹 */
              item.timeOffline = item.customConfigFields.ROUTE_TRACKING_TIME_OFFLINE
              item.route_tracking_unit = item.customConfigFields.ROUTE_TRACKING_UNIT

              /* 调度管理 - 调度策略 */
              item.automaticDispatchIsOpen = item.customConfigFields.AUTOMATIC_DISPATCH_IS_OPEN
              item.scheduledDispatchTime = item.customConfigFields.SCHEDULED_DISPATCH_TIME
              item.loadOrderAmount = item.customConfigFields.LOAD_ORDER_AMOUNT
              item.insertTruck = item.customConfigFields.INSERT_TRUCK
              /* 调度管理 - 交付流程 */
              item.deliveryProcedure = item.customConfigFields.DELIVERY_PROCEDURE

              /* 调度管理 - 运单通知  */
              item.noticeOfShipmentGoods = item.customConfigFields.DELIVERY_NOTIFICATION_IS_OPEN
              item.arrivalNotice = item.customConfigFields.ARRIVAL_NOTIFICATION_IS_OPEN
              item.notificationMethod = item.customConfigFields.NOTIFICATION_METHOD
            }
          })
          this.tableList = rows
          this.total = response.total
          this.loading = false
        })
      }
    },
    /** 搜索 */
    resetQuery() {
      this.getList()
    },
    /** 重置 */
    resetSearchForm(isGetList = true) {
      const { pageSize } = this.queryParams
      this.queryParams = { pageNum: 1, pageSize }
      this.$refs.tables.clearSort()
      isGetList && this.getList()
    },
    // 选中行背景色
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      for (const item of this.ids.values()) {
        if (item === row.id) {
          color = 'table-SelectedRow-bgcolor'
        }
      }
      return color
    },
    // eslint-disable-next-line no-unused-vars
    selectable(row, rowIndex) {
      if (row.status === '4') {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.selectList = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleEdit(row, column) {
      if (column && column.type === 'selection') {
        return
      }
      if (row.moduleItBelongsTo === '14' || row.moduleItBelongsTo === '15') {
        this.$refs.editGeofenceFieldDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '17') {
        this.$refs.editAllowOrderExcessDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '18') {
        this.$refs.editTimeThresholdDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '19') {
        this.$refs.editReminderTimeDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '20') {
        this.$refs.editRubberStampDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '25') {
        this.$refs.editRouteTrackingDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '26') {
        this.$refs.editDispatchRuleDlg.handleUpdate(row)
      } else if (row.moduleItBelongsTo === '27') {
        this.$refs.editDeliveryProcedureDlg.handleUpdate(row)
      } else if (this.activeName === '28') {
        this.$refs.addOrEditRejectReasonDlg.handleUpdate(row)
      } else if (this.activeName === '29') {
        this.$refs.addOrEditWaybillNoticeDlg.handleUpdate(row)
      } else {
        this.$refs.editFieldDlg.handleUpdate(row)
      }
    }
  }
}
</script>
