<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle slot="title" :title="$t('ui.basicInfo')">
            </FormCollapseItemTitle>
            <el-form
              ref="form"
              :model="createForm"
              :rules="{}"
              label-width="140px"
              :disabled="true"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('history.module')}`">
                    <el-input :value="createForm.moduleKeyShowStr" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('history.documentNo')}`">
                    <el-input :value="createForm.documentNo" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('history.instanceId')}`">
                    <el-input :value="createForm.processInstance" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('history.processStatus')}`">
                    <el-input
                      :value="selectDictLabel(dict.type.approved_status, createForm.processStatus)"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('history.processName')}`">
                    <el-input v-model="createForm.processName" maxlength="5" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('history.processHistoryTracking')">
            </FormCollapseItemTitle>
            <div class="chart-legend-color-box">
              <div class="chart-legend-item">
                <div class="chart-legend-item-a bg1"></div>
                <div class="chart-legend-item-b">{{ $t('history.legendTxt1') }}</div>
              </div>
              <div class="chart-legend-item">
                <div class="chart-legend-item-a bg2"></div>
                <div class="chart-legend-item-b">{{ $t('history.legendTxt2') }}</div>
              </div>
              <div class="chart-legend-item">
                <div class="chart-legend-item-a bg3"></div>
                <div class="chart-legend-item-b">{{ $t('history.legendTxt3') }}</div>
              </div>
              <div class="chart-legend-item">
                <div class="chart-legend-item-a bg4"></div>
                <div class="chart-legend-item-b">{{ $t('history.legendTxt4') }}</div>
              </div>
            </div>
            <div class="imgs-box">
              <el-image
                class="img-box"
                fit="contain"
                :src="flowChartImgUrl"
                :preview-src-list="srcList"
                :z-index="2023"
                :initial-index="12"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
                <div slot="placeholder" class="image-slot">loading<span class="dot">...</span></div>
              </el-image>
            </div>
            <div class="flowchart-info-box">
              <div class="flowchart-info-box-a">
                <span>{{ $t('history.startDateTime') }}&nbsp;:&nbsp;</span>
                <span>{{ parseTime(createForm.startTime, fmtForYmdhms) }}</span>
              </div>
              <div class="flowchart-info-box-a">
                <span>{{ $t('history.endDateTime') }}&nbsp;:&nbsp;</span>
                <span>{{ parseTime(createForm.realEndTime, fmtForYmdhms) }}</span>
              </div>
              <div class="flowchart-info-box-a">
                <span>{{ $t('history.timeConsuming') }}&nbsp;:&nbsp;</span>
                <span>{{ createForm.realTimeConsumingShowStr }}</span>
              </div>
            </div>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle slot="title" :title="$t('history.processHistoryTracking')">
            </FormCollapseItemTitle>
            <div class="pb20">
              <el-row :gutter="10" class="mb8">
                <right-toolbar
                  :saveKey="saveKey"
                  :savePath="savePath"
                  :showSearchBtn="false"
                  @queryTable="queryTable"
                  :columns="configColumn"
                  :columnsInit="columns"
                ></right-toolbar>
              </el-row>
              <el-table
                border
                @sort-change="handleSortChange"
                width="100%"
                ref="tables"
                v-loading="loading"
                :data="tableList"
              >
                <el-table-column
                  type="index"
                  :label="$t('ui.sn')"
                  width="60"
                  fixed="left"
                  align="center"
                >
                  <template slot-scope="scope">
                    <span>{{
                      scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1
                    }}</span>
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
                    <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                :saveKey="saveKey"
                :savePath="savePath"
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
              />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  getProcessImgByProcessInstance,
  queryBizProcessManagementById,
  getBizTaskHistoryByInstanceIdForEnd
} from '@/api/bpm/bpm'
export default {
  mixins: [pageMixin],
  dicts: ['bpm_task_status', 'bpm_task_handle_result', 'approved_status'],
  props: {
    instanceId: {
      type: String
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      savePath: 'bpmTable',
      createForm: {},
      activeNames: ['1', '2', '3'],
      flowChartImgUrl: '',
      srcList: [],

      /* 表格部分 */
      // 遮罩层
      loading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        status: undefined
      },
      total: 0,
      tableList: [],
      // 列信息
      columns: [
        {
          prop: 'taskName',
          label: vm.$t('history.taskName'),
          visible: true,
          minWidth: 350,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'taskIdShow',
          label: vm.$t('history.taskId'),
          minWidth: 160,
          tooltip: true,
          visible: true
        },
        {
          prop: 'handleUserName',
          label: vm.$t('history.handledBy'),
          minWidth: 160,
          tooltip: true,
          visible: true
        },
        {
          prop: 'taskStatus',
          propBy: 'taskStatusShowStr',
          label: vm.$t('history.taskStatus'),
          minWidth: 160,
          tooltip: true,
          visible: true
        },
        {
          prop: 'isTimeOut',
          label: vm.$t('history.isTimeout'),
          minWidth: 140,
          tooltip: true,
          visible: true
        },
        {
          prop: 'realStartTime',
          label: vm.$t('history.startDateTime'),
          visible: true,
          tooltip: true,
          minWidth: 200,
          sortable: 'custom'
        },
        {
          prop: 'realEndTime',
          label: vm.$t('history.endDateTime'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 200
        },
        {
          prop: 'predictEndTime',
          label: vm.$t('history.dueDate'),
          visible: true,
          tooltip: true,
          minWidth: 200,
          sortable: 'custom'
        },
        {
          prop: 'realTimeConsumingShowStr',
          label: vm.$t('history.timeConsuming'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 200
        },
        {
          prop: 'handleResult',
          propBy: 'handleResultShowStr',
          label: vm.$t('history.outcome'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 160
        },
        {
          prop: 'handleComment',
          label: vm.$t('history.feedbackDetail'),
          visible: true,
          tooltip: false,
          minWidth: 160
        }
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.getProcessImgByProcessInstance()
    this.queryBizProcessManagementById()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        processInstance: this.instanceId,
        ...this.queryParams
      }
      this.$trimOfObj(params)
      getBizTaskHistoryByInstanceIdForEnd(params)
        .then((res) => {
          const list = res.rows || []
          this.tableList = list.map((item) => {
            item.realStartTime = this.parseTime(item.realStartTime, this.fmtForYmdhms)
            item.realEndTime = this.parseTime(item.realEndTime, this.fmtForYmdhms)
            item.predictEndTime = this.parseTime(item.predictEndTime, this.fmtForYmdhms)
            item.taskStatusShowStr = this.selectDictLabel(
              this.dict.type.bpm_task_status,
              item.taskStatus
            )
            item.handleResultShowStr = this.selectDictLabel(
              this.dict.type.bpm_task_handle_result,
              item.handleResult
            )
            return item
          })
          this.total = res.total || 0
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch(() => {
          this.loading = false
        })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.taskStatusShowStr = this.selectDictLabel(
          this.dict.type.bpm_task_status,
          item.taskStatus
        )
        item.handleResultShowStr = this.selectDictLabel(
          this.dict.type.bpm_task_handle_result,
          item.handleResult
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    getProcessImgByProcessInstance() {
      // 2680032
      getProcessImgByProcessInstance(this.instanceId).then((res) => {
        const vm = this
        vm.$nextTick(() => {
          vm.flowChartImgUrl = window.URL.createObjectURL(res)
          vm.srcList = [vm.flowChartImgUrl]

          vm.$once('hook:beforeDestroy', () => {
            window.URL.revokeObjectURL(vm.flowChartImgUrl)
          })
        })
      })
    },
    queryBizProcessManagementById() {
      // 2680032
      queryBizProcessManagementById(this.instanceId).then((res) => {
        this.createForm = res.data || {}
        this.createForm.documentNo = this.createForm.businessNo
      })
    },

    back() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.imgs-box {
  box-sizing: border-box;
  margin-top: 4px;
  border: 1px solid #dcdfe6;

  .img-box {
    margin: 0 auto;
    padding: 5px;
    width: 100%;
    height: 480px;
    // image-rendering: crisp-edges; /* Firefox (20+) */
    image-rendering: auto;
  }
}
.chart-legend-color-box {
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  // margin-bottom: -15px;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;

  .chart-legend-item {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    line-height: 20px;
    margin-left: 20px;

    .chart-legend-item-a {
      margin-right: 5px;
      width: 20px;
      height: 20px;
      border-radius: 3px;
    }

    .chart-legend-item-b {
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bg1 {
      background-color: rgb(0, 205, 0);
    }
    .bg2 {
      background-color: rgb(255, 0, 0);
    }
    .bg3 {
      background-color: rgb(255, 255, 0);
    }
    .bg4 {
      background-color: rgb(187, 187, 187);
    }
  }
}

.flowchart-info-box {
  line-height: 20px;
  padding: 20px;
  padding-top: 4px;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  flex-direction: row;

  .flowchart-info-box-a {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    span {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
