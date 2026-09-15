<template>
  <div>
    <div class="flexEnd">
      <div class="desc mr20">
        <span class="mr20"
          >{{ $t('STOCKIN.checklistTemplate') }} ：{{ topMsg.checklistTemplateCount || 0 }}</span
        >
        <span>
          {{ $t('STOCKIN.unqualified') }}
          /
          {{ $t('STOCKIN.qualified1') }}
          /
          {{ $t('STOCKIN.total1') }}
        </span>
        <span
          >：{{ topMsg.failedItemCount || 0 }} / {{ topMsg.passItemCount || 0 }} /
          {{ topMsg.allItemCount || 0 }}</span
        >
      </div>
      <right-toolbar
        ref="rightToolbar"
        :saveKey="saveKey"
        :savePath="savePath"
        :showSearch.sync="showSearch"
        :showSearchBtn="false"
        :showRefreshBtn="false"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </div>
    <el-table
      border
      ref="tables"
      class="mt10 mb20"
      max-height="600px"
      :data="tableList"
      v-loading="loading"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
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
          <template v-if="item.prop === 'qcResult'">
            <div
              @mouseenter="showPop($event, scope.row, 'productionLine')"
              @mouseleave="hidePop($event, scope.row)"
            >
              <div
                v-if="scope.row.qcResult === '1'"
                style="width: 100%; background: #67c23a; color: #fff; padding-left: 5px"
              >
                {{
                  scope.row.samplingType === '1' && (scope.row.labelQcMsgList || []).length <= 1
                    ? $numberStr(scope.row.testingCriteriaResult, 2)
                    : 'OK'
                }}
              </div>
              <div
                style="width: 100%; background: #f56c6c; color: #fff; padding-left: 5px"
                v-if="scope.row.qcResult === '2'"
              >
                {{
                  scope.row.samplingType === '1' && (scope.row.labelQcMsgList || []).length <= 1
                    ? $numberStr(scope.row.testingCriteriaResult, 2)
                    : 'NG'
                }}
              </div>
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <popover-svc
      ref="pop1"
      trigger="hover"
      placement="top"
      :close-delay="0"
      :visible-arrow="true"
      popper-class="pop-warp"
      :offset="-30"
    >
      <div @mouseenter="mouseenterCur($event)" class="pop-box">
        <el-table :data="popoverData.labelDetailList || []" border max-height="300">
          <el-table-column
            :label="$t('STOCKIN.labelNo')"
            width="160"
            align="center"
            prop="labelNo"
            is-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.labelNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('STOCKIN.result')"
            width="160"
            align="center"
            prop="qcResult"
            is-overflow-tooltip
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.qcResult === '1'"
                style="width: 100%; background: #67c23a; color: #fff; padding-left: 5px"
              >
                {{
                  scope.row.samplingType === '1'
                    ? $numberStr(scope.row.testingCriteriaResult, 2)
                    : 'OK'
                }}
              </div>
              <div
                style="width: 100%; background: #f56c6c; color: #fff; padding-left: 5px"
                v-if="scope.row.qcResult === '2'"
              >
                {{
                  scope.row.samplingType === '1'
                    ? $numberStr(scope.row.testingCriteriaResult, 2)
                    : 'NG'
                }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </popover-svc>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { Popover } from 'element-ui'

const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}

export default {
  components: { popoverSvc },
  mixins: [pageMixin],
  dicts: ['i_sampling_type', 'i_testing_tier', 'i_sampling_method'],
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    topMsg: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    list: {
      immediate: true,
      handler: function (list) {
        const rows = list || []
        rows.forEach((item) => {
          item.samplingTypeStr = this.selectDictLabel(
            this.dict.type.i_sampling_type,
            item.samplingType
          )
          item.testingTierStr = this.selectDictLabel(
            this.dict.type.i_testing_tier,
            item.testingTier
          )
          item.samplingMethodStr = this.selectDictLabel(
            this.dict.type.i_sampling_method,
            item.samplingMethod
          )
        })
        this.tableList = rows
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '1',
      showSearch: true,
      savePath: 'checkListTable',
      loading: false,
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'checklistTemplateName',
          label: vm.$t('STOCKIN.checklistTemplate'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'checklistTemplateNo',
          label: vm.$t('STOCKIN.templateNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'checklistItemNo',
          label: vm.$t('STOCKIN.checklistCode'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'checklistItemName',
          label: vm.$t('STOCKIN.checklistName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'samplingType',
          propBy: 'samplingTypeStr',
          label: vm.$t('STOCKIN.samplingType'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'testingCriteriaShowStr',
          label: vm.$t('STOCKIN.testingCriteria'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'testingTier',
          propBy: 'testingTierStr',
          label: vm.$t('STOCKIN.testingTier'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'samplingMethod',
          propBy: 'samplingMethodStr',
          label: vm.$t('STOCKIN.samplingMethod'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'badLabel',
          label: vm.$t('STOCKIN.badLabel'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'qcResult',
          label: vm.$t('STOCKIN.result'),
          visible: true,
          width: 120,
          tooltip: true
        },
        {
          prop: 'picture',
          label: vm.$t('STOCKIN.picture'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      tableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: undefined,
        dateRange: undefined,
        goodsReceiptNoteNo: undefined
      },
      rowIdKey: 'goodsReceiptNoteId',
      selectRow: {},
      popoverData: {}
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
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    onDictReady() {
      this.tableList.forEach((item) => {
        item.samplingTypeStr = this.selectDictLabel(
          this.dict.type.i_sampling_type,
          item.samplingType
        )
        item.testingTierStr = this.selectDictLabel(this.dict.type.i_testing_tier, item.testingTier)
        item.samplingMethodStr = this.selectDictLabel(
          this.dict.type.i_sampling_method,
          item.samplingMethod
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    showPop(e, obj) {
      if (this.topMsg.labelType === '1') return
      const showList = obj.labelQcMsgList || []
      if (this.topMsg.labelQty <= 1) return
      this.$set(this.popoverData, 'labelDetailList', showList)

      this.$set(this.popoverData, 'hide', false)
      this.$refs.pop1.popBy(e.target)
    },
    hidePop(e, obj) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  /deep/ .el-form-item {
    margin-bottom: 8px;
  }
}

.flexEnd {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.desc {
  font-size: 12px;
}
</style>
