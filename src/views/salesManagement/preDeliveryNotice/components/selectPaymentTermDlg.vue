<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.paymentTerm')"
    :visible.sync="visible"
    width="1140px"
    append-to-body
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <!-- <search-form
      ref="searchForm"
      v-model="queryParams"
      :searchData="searchData"
      :handleQuery="handleSearchForm"
      :resetQuery="resetSearchForm"
      :showCustom="false"
      :showMenu="false"
      v-show="showSearch"
    > -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :saveKey="saveKey"
        :savePath="savePath"
        :showRefreshBtn="true"
        @queryTable="queryTable"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>

    <!-- </search-form> -->

    <el-table
      border
      ref="tables"
      class="mt10 tables"
      v-loading="loading"
      :data="tableList"
      @sort-change="handleSortChange"
      @row-click="handleRowClick"
      :row-class-name="'pointer'"
      @select="handleSelectionChange"
      :max-height="tableMaxHeight"
      tooltip-effect="light"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      :row-key="rowIdKey"
    >
      <el-table-column type="selection" width="55" :selectable="selectable" align="center" />
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stage }}</span>
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
          <template v-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'stageShowStr'">
            <ToolTipPaymentTerm :paymentTermObj="scope.row || {}">
              {{ scope.row[item.prop] }}
            </ToolTipPaymentTerm>
          </template>
          <template v-else-if="item.prop === 'dueBasis'">
            {{ selectDictLabel(dict.type.payment_term_detail_due_basis, scope.row[item.prop]) }}
          </template>
          <el-tag
            v-else-if="item.prop === 'downPayment' || item.prop === 'goodsIssue'"
            :type="scope.row[item.prop] === '1' ? '' : 'info'"
            >{{ scope.row[item.prop] === '1' ? $t('uiBtn.yes') : $t('uiBtn.no') }}</el-tag
          >
          <template v-else-if="item.prop === 'days'">{{
            $numberStr(scope.row[item.prop], 0)
          }}</template>
          <template v-else-if="item.prop === 'trigger'">
            <span v-if="scope.row.trigger">
              {{ selectDictLabel(dict.type.payment_term_detail_trigger, scope.row[item.prop]) }}
            </span>
            <span v-else>
              {{
                selectDictLabel(
                  dict.type.payment_term_detail_trigger_civil_works_progress_milestone,
                  scope.row.triggerCivilWorksProgressMilestone
                )
              }}
            </span>
          </template>
          <template v-else-if="item.prop === 'triggerDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'stageDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
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
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="handleBack">{{ $t('ui.back') }}</el-button>
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submit"
        :disabled="selectList.length === 0 && canCreatePi"
      >
        <!-- 有可以勾选的付款条款才需要勾选才能提交，没有可以勾选的付款条款也可以直接提交 -->
        {{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryCanSelectPaymentTerm } from '@/api/system/paymentTerm'
import {
  submitFinishedGoodPreDeliveryNotice,
  submitAssignTask
} from '@/api/salesManagement/preDeliveryNotice'
export default {
  dicts: [
    'payment_term_type',
    'payment_term_purpose',
    'payment_term_detail_trigger',
    'payment_term_detail_due_basis',
    'payment_term_detail_trigger_civil_works_progress_milestone'
  ],
  mixins: [pageMixin],
  props: {
    paymentTermPurposeList: {
      type: Array,
      default() {
        return []
      }
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    paymentTermId: {
      type: String,
      default: ''
    },
    salesOrderId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'IMTable',
      searchFormKey: Date.now(),
      btnLoading: false,
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      tableList: [],
      selectList: [],
      rowIdKey: 'paymentPlanDetailId',
      tableMaxHeightResize: true,
      selected: '',
      visible: false,
      columns1: [
        {
          prop: 'paymentTermNo',
          label: vm.$t('ui.paymentTermNo'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'paymentTermCode',
          label: vm.$t('ui.paymentTermCode'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('menu.paymentTerm'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermType',
          propBy: 'paymentTermTypeStr',
          label: vm.$t('ui.type'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'paymentTermPurpose',
          propBy: 'paymentTermPurposeStr',
          label: vm.$t('ui.purpose'),
          minWidth: 160,
          visible: true,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'stageShowStr',
          label: vm.$t('ui.stage'),
          minWidth: 160,
          visible: true,
          tooltip: true
          // sortable: 'custom'
        },

        {
          prop: 'description',
          label: vm.$t('ui.description'),
          minWidth: 160,
          visible: true,
          sortable: 'custom'
        }
      ],
      columns: [
        {
          prop: 'stageName',
          label: vm.$t('ui.stageName'),
          visible: true,
          minWidth: 400,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'percentage',
          label: vm.$t('ui.paymentPercentage'),
          visible: true,
          width: 160,
          tooltip: true
        },
        {
          prop: 'trigger',
          label: vm.$t('ui.trigger'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'dueBasis',
          label: vm.$t('ui.dueBasis'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'days',
          label: vm.$t('ui.dueDays'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'triggerDescription',
          label: vm.$t('ui.triggerDescription'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'stageDescription',
          label: vm.$t('ui.stageDescription'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'downPayment',
          label: vm.$t('ui.downPayment'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'goodsIssue',
          label: vm.$t('ui.goodsIssue'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 25,
        condition: ''
      },
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.paymentTerm')} / ${this.$t('ui.description')}`,
          type: 'InputEle'
        }
      ],
      param: {},
      canCreatePi: false
    }
  },
  computed: {},
  beforeCreate() {},
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleAdd(param) {
      this.param = param
      this.queryParams.condition = ''
      this.queryParams.pageNum = 1
      this.visible = true
      this.getList()
    },
    treeToTile(treeData, childKey = 'childList') {
      const arr = []
      const expanded = (data) => {
        if (data && data.length > 0) {
          data.forEach((e) => {
            arr.push({
              ...e,
              nodeList: data
            })
            expanded(e[childKey] || [])
          })
        }
      }
      expanded(treeData)
      return arr
    },
    getList() {
      const vm = this
      // const param = this.queryParams
      // param.paymentTermPurposeList = ['3']
      // param.businessPartnerId = this.businessPartnerId
      this.loading = true
      // this.$trimOfObj(param)

      queryCanSelectPaymentTerm({ salesOrderId: this.salesOrderId })
        .then((response) => {
          this.loading = false
          const paymentTermDetailList = response.data || []
          this.resetStageNum(paymentTermDetailList)
          this.tableList = paymentTermDetailList || []
          // 是否有可以勾选的付款条款
          this.canCreatePi = this.hasCanCreatePi(this.tableList)
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        })
        .catch((err) => {
          vm.loading = false
          window.console.error(err)
        })
    },
    hasCanCreatePi(nodes) {
      // 防御性判断：如果不是数组直接返回 false
      if (!Array.isArray(nodes)) return false
      for (const node of nodes) {
        // 1. 检查当前节点本身
        if (node.canCreatePi) {
          return true // 找到了，立刻返回 true，不再继续遍历
        }
        // 2. 如果有子级，递归检查子级
        if (node.children && node.children.length > 0) {
          if (this.hasCanCreatePi(node.children)) {
            return true // 子级中找到了，立刻向上层返回 true
          }
        }
      }
      return false // 整棵树遍历完都没找到，返回 false
    },

    // 重置阶段名称前面的序号 stage 字段
    resetStageNum(list, plantStage) {
      list.forEach((item, index) => {
        item.stage = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.children && item.children.length > 0) {
          this.resetStageNum(item.children, item.stage)
        }
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.paymentTermTypeStr = this.selectDictLabel(
          this.dict.type.payment_term_type,
          item.paymentTermType
        )
        item.paymentTermPurposeStr = this.selectDictLabels(
          this.dict.type.payment_term_purpose,
          item.paymentTermPurpose || ''
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },

    handleBack() {
      const vm = this
      vm.visible = false
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
      this.$refs.tables.clearSort()
      this.getList()
    },
    selectable(row, rowIndex) {
      // if (row.isAlreadyUse === '1') return false
      if (!row.canCreatePi) return false
      return true // 不禁用
    },
    handleSelectionChange(selection, row) {
      if (selection.length > 1) {
        this.$refs.tables.clearSelection()
        this.$refs.tables.toggleRowSelection(selection[selection.length - 1], true)
      }
      this.selectList = selection
    },
    handleRowClick(row, column) {
      if (column && column.property === 'picture') {
        return
      }
      if (!row.canCreatePi) return
      this.$refs.tables.clearSelection()
      const index = this.selectList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      const isSelected = index > -1
      if (isSelected) {
        this.selectList.splice(index, 1)
      } else {
        this.selectList = [row]
      }
      this.$refs.tables.toggleRowSelection(row, !isSelected)
    },
    closed() {
      this.param = {}
      this.$refs.tables && this.$refs.tables.clearSelection()
    },
    submit() {
      const confirmMsg = this.$t('SALES.preDeliveryNoticeSubmitConfirm')
      // const successMsg = this.$t('SALES.preDeliveryNoticeSubmitSuccess')
      const { productType } = this.param.preDeliveryNoticeProductList[0] || {}
      let submitFn
      if (productType === '3') {
        submitFn = submitFinishedGoodPreDeliveryNotice
      } else {
        submitFn = submitAssignTask
      }
      const param = this.param
      if (this.selectList.length > 0) {
        param.paymentPlanDetailId = this.selectList[0].paymentPlanDetailId
      }
      // param.stageName = this.selectList[0].stageName
      // console.log(param, submitFn, '======353')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          this.btnLoading = true
          return submitFn(param)
        })
        .then((response) => {
          // if (response.msg) {
          //   this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
          // } else {
          // }
          this.$modal.msgSuccess(this.$t('SALES.preDeliveryNoticeSubmitSuccess1'))
          this.btnLoading = false
          this.$emit('onSuccess')
          this.visible = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.txt-color {
  color: #f66c6c !important;
}
.tables {
  /deep/ .el-table__fixed-header-wrapper .el-checkbox {
    display: none;
  }
}
</style>
