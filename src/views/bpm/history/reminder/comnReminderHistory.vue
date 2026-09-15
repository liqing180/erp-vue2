<template>
  <div class="reminder-box">
    <el-table
      ref="tables"
      v-loading="loading"
      :data="tableList"
      stripe
      border
      @sort-change="handleSortChange"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + (queryParams.pageNum - 1) * queryParams.pageSize + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in visibleColumn"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :sortable="item.sortable"
        :min-width="getMinWidth(item)"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fixed"
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
          <template v-else-if="item.prop === 'participant'">
            <el-popover
              :key="scope.$index"
              trigger="hover"
              placement="bottom"
              effect="light"
              :open-delay="500"
              :disabled="!scope.row.participant"
              popper-class="td-proper-box"
            >
              <div class="pp-title">
                {{ $t('reminder.approvalParticipant') }}
              </div>
              <el-scrollbar class="scroll-bar-box" style="max-height: 500px">
                <div>
                  <div
                    v-for="(list, index) in strTransArray(scope.row.participant)"
                    :key="index"
                    class="pp-item"
                  >
                    <span>{{ $t('reminder.nameStr') }} {{ Number(index + 1) }} : &nbsp;</span>
                    <span>{{ list }}</span>
                  </div>
                </div>
              </el-scrollbar>
              <div slot="reference" style="height: 100%; line-height: 20px">
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                  {{ scope.row.participant }}
                </div>
              </div>
            </el-popover>
          </template>
          <template v-else-if="item.prop === 'reminderType'">{{
            reminderTypeTa(scope.row[item.prop])
          }}</template>
          <template v-else>{{ scope.row[item.prop] }}</template>
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

    <div style="margin-top: 60px; text-align: right">
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleBack">{{ $t('ui.back') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import locale from './locale'
import { queryReminderMessageList } from '@/api/bpm/bpm'
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  dicts: ['bpm_process_status'],
  props: {
    rowData: {
      type: Object,
      default: function () {
        return null
      }
    },
    curPath: {
      type: [String],
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'bpmTable',
      btnLoading: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      tableList: [],
      searchForm: {},
      searchRules: {
        // condition: [{ max: 20, trigger: 'blur' }]
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined
      },
      columns: [
        {
          prop: 'taskName',
          label: vm.$t('reminder.taskName'),
          visible: true,
          // sortable: 'custom',
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'participant',
          label: vm.$t('reminder.participant'),
          minWidth: 180,
          // sortable: 'custom',
          tooltip: false,
          visible: true
        },
        {
          prop: 'reminderType',
          label: vm.$t('reminder.reminderType'),
          minWidth: 160,
          tooltip: true,
          visible: true
        },
        {
          prop: 'reminderContent',
          label: vm.$t('reminder.reminderContent'),
          minWidth: 160,
          tooltip: true,
          visible: true
        },
        {
          prop: 'reason',
          label: vm.$t('reminder.reason'),
          visible: true,
          tooltip: true,
          minWidth: 200
        },
        {
          prop: 'handledName',
          label: vm.$t('reminder.handledBy'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 160
        },
        {
          prop: 'handledTime',
          label: vm.$t('reminder.dateHandled'),
          sortable: 'custom',
          visible: true,
          tooltip: true,
          minWidth: 170
        }
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    init() {
      this.getList()
    },
    reminderTypeTa(strType) {
      const vm = this

      if (!strType) {
        return ''
      }

      const ta = strType.split(',')
      const len = ta.length

      if (len <= 0) {
        return ''
      }

      const strTa = [
        vm.$t('reminder.systemNotice'),
        vm.$t('reminder.email'),
        vm.$t('reminder.phoneMessage'),
        vm.$t('reminder.whatsapp')
      ]

      const rsTa = ta.map((item) => {
        return strTa[parseInt(item) - 1]
      })

      return rsTa.toString()
    },

    handleBack() {
      this.$emit('onBack')
    },

    strTransArray(strObj) {
      if (!strObj) {
        return []
      }

      const ta = strObj.split(',')

      if (Array.isArray(ta)) {
        const len = ta.length
        if (len <= 0) {
          return []
        }

        return ta
      } else {
        return []
      }
    },
    getList() {
      const vm = this

      const param = {
        ...vm.searchForm,
        ...vm.queryParams,
        taskId: !vm.rowData ? '' : vm.rowData.taskId || '',
        processInstance: !vm.rowData ? '' : vm.rowData.processInstance || ''
      }

      this.$trimOfObj(param)
      vm.loading = true
      // eslint-disable-next-line no-undef
      queryReminderMessageList(param)
        .then((response) => {
          const rows = response.rows || []
          rows.forEach((item) => {
            item.handledTime = this.parseTime(item.handledTime, this.fmtForYmdhms)
          })
          this.tableList = rows
          this.loading = false
          this.total = response.total
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.reminder .sub-content {
  min-height: 600px;
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
// .pp-item:nth-child(even){
//     background-color: #FFFFFF;
// }
// .pp-item:nth-child(odd){
//     background-color: #efefef;
// }
</style>
