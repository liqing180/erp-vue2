<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="18">
        <div style="line-height: 30px; font-size: 16px">{{ $t('SALES.paymentSchedule') }}</div>
      </el-col>

      <el-col :span="6">
        <right-toolbar
          :showSearchBtn="false"
          :showRefreshBtn="true"
          :saveKey="saveKey"
          :savePath="savePath"
          :columns="configColumn"
          :columnsInit="columns"
          @queryTable="queryTable"
        >
        </right-toolbar>
      </el-col>
    </el-row>

    <el-table
      border
      ref="tables"
      class="mt10"
      :row-key="rowIdKey"
      :row-class-name="tableRowClassName"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :data="comTableList"
      default-expand-all
      :key="tableKey"
      style="cursor: pointer"
      @sort-change="handleSortChange"
      max-height="600"
      v-loading="loading"
    >
      <el-table-column
        v-if="false"
        type="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.isTotal !== '1'"
            :class="[scope.row.stage.indexOf('.') === -1 ? 'serial-number' : '']"
            >{{ scope.row.stage }}</span
          >
          <span
            :class="[scope.row.isTotal === '1' ? 'weight' : '']"
            v-if="scope.row.isTotal === '1'"
            >{{ $t('SALES.total') }}</span
          >
        </template>
      </el-table-column>

      <el-table-column
        key="stageName"
        :label="$t('SALES.paymentStage')"
        width="300"
        fixed="left"
        align="left"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.isTotal !== '1'">
            <span
              v-if="
                (scope.row.children || []).length <= 0 && scope.row.levelNum === 1 && existLevel2
              "
              style="display: inline-block; width: 23px"
            ></span>
            <span
              v-if="(scope.row.children || []).length <= 0 && scope.row.levelNum === 2"
              style="display: inline-block; width: 4px"
            ></span>
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                font-size: 12px;
                /* font-weight: bold; */
                /* color: #409eff; */
              "
              :class="[`level-${scope.row.levelNum}`, scope.row.isTopItem ? 'topItem' : '']"
              >{{ scope.row.stage + '. ' }}</span
            >
            <span v-if="scope.row.isTotal !== '1'">{{ `${scope.row.stageName}` }}</span>
          </template>
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
            v-if="item.prop === 'downPayment' || item.prop === 'goodsIssue'"
            :type="scope.row[item.prop] === '1' ? '' : 'info'"
            >{{ scope.row[item.prop] === '1' ? $t('uiBtn.yes') : $t('uiBtn.no') }}</el-tag
          >
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
          <template v-else-if="item.prop === 'dueBasis'">
            {{ selectDictLabel(dict.type.payment_term_detail_due_basis, scope.row[item.prop]) }}
          </template>
          <template v-else-if="item.prop === 'triggerDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'stageDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'percentage'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row[item.prop])"
              >{{ $numberStr(scope.row[item.prop], 0) }}%</span
            >
          </template>
          <template v-else-if="item.prop === 'stageAmount'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row.stageAmountStr)"
              >{{ scope.row.stageAmountStr }}</span
            >
          </template>
          <template v-else-if="item.prop === 'reservedAmount'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row.reservedAmountStr)"
              >{{ scope.row.reservedAmountStr }}</span
            >
          </template>
          <template v-else-if="item.prop === 'issuedAmount'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row.issuedAmountStr)"
              >{{ scope.row.issuedAmountStr }}</span
            >
          </template>
          <template v-else-if="item.prop === 'remainingAmount'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row.remainingAmountStr)"
              >{{ scope.row.remainingAmountStr }}</span
            >
          </template>
          <template v-else-if="item.prop === 'currentPiAmount'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row.currentAmountStr)"
              >{{ scope.row.currentAmountStr }}</span
            >
          </template>
          <template v-else-if="item.prop === 'piCount'">
            <span
              :class="[scope.row.isTotal === '1' ? 'weight' : '']"
              v-if="$resultOfBoolean(scope.row.piCountStr)"
              >{{ scope.row.piCountStr }}</span
            >
          </template>
          <template v-else-if="item.prop === 'stageStatus'">
            <div
              class="status-tag"
              :class="'status-tag-' + scope.row.stageStatus"
              v-if="scope.row.stageStatus"
            >
              {{ selectDictLabel(dict.type.payment_plan_stage_status, scope.row[item.prop]) }}
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <!-- pi模块不显示 -->
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="isPath !== 'pi'"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleComplete(scope.row)"
            v-if="
              scope.row.isTotal !== '1' &&
              checkPermi(['salesManagement:salesOrder:paymentSchedule:complete']) &&
              scope.row.downPayment !== '1' &&
              scope.row.canCreatePi &&
              scope.row.stageStatus !== '2'
            "
            >{{ $t('SALES.complete') }}</el-button
          >
          <el-button type="text" @click="handleCreatePI(scope.row)" v-if="scope.row.canCreatePi">{{
            $t('SALES.createPI')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryBySalesOrderId, autoCompletePI } from '@/api/salesManagement/salesOrder'
import { buildProformaInvoiceForSalesOrder } from '@/api/salesManagement/proformaInvoice'
export default {
  dicts: [
    'payment_term_status',
    'payment_term_type',
    'business_partner_payment_method',
    'payment_term_purpose',
    'payment_term_detail_trigger',
    'payment_term_detail_trigger_civil_works_progress_milestone',
    'payment_term_detail_due_basis',
    'payment_plan_stage_status'
  ],
  mixins: [pageMixin],
  props: {
    propRowId: {
      type: String,
      default: ''
    },
    isPath: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '115',
      savePath: 'paymentScheduleTable',

      rowId: '',
      // 是否自动生成 EmployeeNo
      submitLoading: false,
      form: {},
      /* 表格表单部分 */
      /* 表格部分 */
      columns: [
        /* {
          prop: 'stageName',
          label: vm.$t('SALES.paymentStage'),
          visible: true,
          minWidth: 300,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        }, */
        {
          prop: 'trigger',
          label: vm.$t('SALES.triggerMilestone'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'percentage',
          label: vm.$t('SALES.percentage1'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stageAmount',
          propBy: 'stageAmountStr',
          label: vm.$t('SALES.stageAmount'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          align: 'right',
          tooltip: true
        },
        {
          prop: 'reservedAmount',
          propBy: 'reservedAmountStr',
          label: vm.$t('SALES.reservedPIAmount'),
          visible: false,
          minWidth: 200,
          sortable: 'custom',
          align: 'right',
          tooltip: true
        },
        {
          prop: 'issuedAmount',
          propBy: 'issuedAmountStr',
          label: vm.$t('SALES.issuedPIAmount'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          align: 'right',
          tooltip: true
        },
        {
          prop: 'remainingAmount',
          propBy: 'remainingAmountStr',
          label: vm.$t('SALES.remainingAmount'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          align: 'right',
          tooltip: true
        },
        {
          prop: 'currentPiAmount',
          propBy: 'currentAmountStr',
          label: vm.$t('SALES.currentPlAmount'),
          visible: false,
          minWidth: 200,
          sortable: 'custom',
          align: 'right',
          tooltip: true
        },
        {
          prop: 'piCount',
          propBy: 'piCountStr',
          label: vm.$t('SALES.noOfPls'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'stageStatus',
          label: vm.$t('SALES.stageStatus'),
          visible: false,
          colMinWidth: 130,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'dueDate',
          label: vm.$t('SALES.dueDate2'),
          visible: false,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        }
      ],
      tableList: [],
      tableKey: Date.now(),
      sortableDom: undefined,
      rowIdKey: 'paymentPlanDetailId',
      sortProp: undefined,
      sortOrder: undefined,
      currencySymbol: undefined,
      salesOrderId: undefined,
      acrossStageCount: undefined,
      loading: false
    }
  },
  created() {
    this._stableCounter = 0

    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  watch: {
    propRowId: {
      immediate: true,
      handler(val) {
        console.log(val, '==========282')
        if (val) {
          this.getList()
        }
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    existLevel2() {
      const item = this.tableList.find((item) => (item.children || []).length > 0)
      return !!item
    },
    comTableList() {
      let table = this.tableList

      let stageAmountStr = 0
      let reservedAmountStr = 0
      let issuedAmountStr = 0
      let remainingAmountStr = 0
      let overIssuedAmountStr = 0
      let currentAmountStr = 0
      let piCountStr = 0

      table.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
        if (this.$resultOfBoolean(row.stageAmount)) {
          stageAmountStr += row.stageAmount * 1
        }
        if (this.$resultOfBoolean(row.reservedAmount)) {
          reservedAmountStr += row.reservedAmount * 1
        }
        if (this.$resultOfBoolean(row.issuedAmount)) {
          issuedAmountStr += row.issuedAmount * 1
        }
        if (this.$resultOfBoolean(row.remainingAmount)) {
          remainingAmountStr += row.remainingAmount * 1
        }
        if (this.$resultOfBoolean(row.overIssuedAmount)) {
          overIssuedAmountStr += row.overIssuedAmount * 1
        }
        if (this.$resultOfBoolean(row.currentPiAmount)) {
          currentAmountStr += row.currentPiAmount * 1
        }
        if (this.$resultOfBoolean(row.piCount)) {
          piCountStr += row.piCount * 1
        }
      })
      stageAmountStr = table.some((x) => this.$resultOfBoolean(x.stageAmount))
        ? this.currencySymbol + ' ' + this.$numberStr(stageAmountStr, 2)
        : undefined

      reservedAmountStr = table.some((x) => this.$resultOfBoolean(x.reservedAmount))
        ? this.currencySymbol + ' ' + this.$numberStr(reservedAmountStr, 2)
        : undefined
      issuedAmountStr = table.some((x) => this.$resultOfBoolean(x.issuedAmount))
        ? this.currencySymbol + ' ' + this.$numberStr(issuedAmountStr, 2)
        : undefined
      remainingAmountStr = table.some((x) => this.$resultOfBoolean(x.remainingAmount))
        ? this.currencySymbol + ' ' + this.$numberStr(remainingAmountStr, 2)
        : undefined
      overIssuedAmountStr = table.some((x) => this.$resultOfBoolean(x.overIssuedAmount))
        ? this.currencySymbol + ' ' + this.$numberStr(overIssuedAmountStr, 2)
        : undefined
      currentAmountStr = table.some((x) => this.$resultOfBoolean(x.currentPiAmount))
        ? this.currencySymbol + ' ' + this.$numberStr(currentAmountStr, 2)
        : undefined
      piCountStr = table.some((x) => this.$resultOfBoolean(x.piCount))
        ? this.$numberStr(piCountStr, 0)
        : undefined
      const prop = this.sortProp
      const order = this.sortOrder
      // 如果排序被清除，按稳定索引恢复自然顺序
      if (!prop || !order) {
        table = (table || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        this.resetStageNum(table)
        const list = [
          ...table,
          {
            isTotal: '1',
            percentage: 100,
            stageAmountStr,
            reservedAmountStr,
            issuedAmountStr,
            remainingAmountStr,
            overIssuedAmountStr,
            currentAmountStr,
            piCountStr
          }
        ]
        this.$$getColumnContentMaxWidth(this.columns, list)
        return list.length > 1 ? list : []
      }
      // 根据排序字段和顺序对数据进行排序
      table.sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
      this.resetStageNum(table)
      const list = [
        ...table,
        {
          isTotal: '1',
          percentage: 100,
          stageAmountStr,
          reservedAmountStr,
          issuedAmountStr,
          remainingAmountStr,
          overIssuedAmountStr,
          currentAmountStr,
          piCountStr
        }
      ]
      this.$$getColumnContentMaxWidth(this.columns, list)

      return list.length > 1 ? list : []
    }
  },
  methods: {
    init(formData = {}) {
      const { paymentSchedule, acrossStageCount, currencySymbol, salesOrderId } = formData
      this.acrossStageCount = acrossStageCount
      this.currencySymbol = currencySymbol
      this.salesOrderId = salesOrderId
      const list = paymentSchedule || []

      list.forEach((item) => {
        if (item && item._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(item, '_stableIndex', this._stableCounter)
        }
      })
      this.setNodeRowId(list, 0)
      this.resetStageNum(list)
      this.tableList = list

      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    queryTable() {
      this.sortProp = this.sortOrder = undefined
      this.$refs.tables.clearSort()
      this.getList()
    },
    getList() {
      this.loading = true
      queryBySalesOrderId({ salesOrderId: this.propRowId || this.salesOrderId })
        .then((res) => {
          this.form = res.data || {}
          const { paymentSchedule, acrossStageCount, currencySymbol, salesOrderId } = res.data
          this.acrossStageCount = acrossStageCount
          this.currencySymbol = currencySymbol
          this.salesOrderId = salesOrderId
          paymentSchedule.forEach((item) => {
            if (item && item._stableIndex === undefined) {
              this._stableCounter = (this._stableCounter || 0) + 1
              this.$set(item, '_stableIndex', this._stableCounter)
            }
          })
          this.setNodeRowId(paymentSchedule, 0)
          this.resetStageNum(paymentSchedule)
          this.tableList = paymentSchedule
          this.loading = false
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
          this.tableKey = Date.now()
        })
        .catch(() => {
          this.loading = false
        })
    },
    setNodeRowId(dataList, levelNum, plantNode) {
      for (const node of dataList) {
        node.stageAmountStr = this.currencySymbol + ' ' + this.$numberStr(node.stageAmount, 2)
        node.reservedAmountStr = this.currencySymbol + ' ' + this.$numberStr(node.reservedAmount, 2)
        node.issuedAmountStr = this.currencySymbol + ' ' + this.$numberStr(node.issuedAmount, 2)
        node.remainingAmountStr =
          this.currencySymbol + ' ' + this.$numberStr(node.remainingAmount, 2)
        node.overIssuedAmountStr =
          this.currencySymbol + ' ' + this.$numberStr(node.overIssuedAmount, 2)
        node.currentAmountStr = this.currencySymbol + ' ' + this.$numberStr(node.currentPiAmount, 2)
        node.piCountStr = this.$numberStr(node.piCount, 0)
        node.dueDate = this.parseTime(node.dueDate, this.fmtForYmd)
        // 如果找到匹配的ID，返回该节点
        node.rowTimeId = node.paymentPlanDetailId
        node.levelNum = levelNum + 1
        if (plantNode) {
          node.parentRowTimeId = plantNode.rowTimeId
          node.isCivilWorks = plantNode.trigger === '9' || plantNode.isCivilWorks
        }
        // 如果当前节点有子节点，递归查找
        if (node.children && node.children.length > 0) {
          this.setNodeRowId(node.children, node.levelNum, node)
        }
      }
    },
    // 表单重置
    reset() {
      this.tableList = []
    },
    handleComplete(row) {
      this.$modal
        .confirm(this.$t('SALES.completeStages'))
        .then(() => {
          this.loading = true
          return autoCompletePI({
            salesOrderId: this.salesOrderId,
            paymentPlanDetailId: row.paymentPlanDetailId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('SALES.writeSuccess1'))
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCreatePI(row) {
      buildProformaInvoiceForSalesOrder({
        salesOrderId: this.salesOrderId,
        paymentPlanDetailId: row.paymentPlanDetailId
      }).then((res) => {
        const data = res.data || {}

        if (data.isError === '1') {
          this.$modal.msgError(data.errorTips)
          return
        }

        this.$emit('back')
        this.$router.push({
          path: '/salesManagement/addProformaInvoice',
          query: {
            paymentPlanDetailId: row.paymentPlanDetailId,
            salesOrderId: this.salesOrderId,
            timeId: Date.now(),
            backType: '2'
          }
        })
        // this.$refs.addStageFormDlg.handleOpen(row)
      })
    },
    handleSortChange({ prop, order }) {
      this.sortProp = prop
      this.sortOrder = order
      // 如果排序被清除，按稳定索引恢复自然顺序
      if (!prop || !order) {
        this.tableList = (this.tableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        this.resetStageNum(this.tableList)
        return
      }
      // 根据排序字段和顺序对数据进行排序
      this.tableList.sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
      this.resetStageNum(this.tableList)
    },
    // 重置阶段名称前面的序号 stage 字段
    resetStageNum(list, plantStage) {
      list.forEach((item, index) => {
        if (index === 0) {
          item.isTopItem = true
        }
        item.stage = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.children && item.children.length > 0) {
          this.resetStageNum(item.children, item.stage)
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      // if (row.canCreatePi) {
      //   return 'table-SelectedRow-bgcolor'
      // }
      return ''
    }
  }
}
</script>
<style lang="scss" scoped>
.level-2::before {
  content: '';
  position: absolute;
  left: 20px;
  top: -20px;
  width: 1px;
  height: 40px;
  border-left: 1px dashed #c0c4cc;
}
.topItem.level-2::before {
  top: 0px;
  height: 20px;
}
/* 二级横向虚线 (横线连接圆圈) */
.level-2::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 18px;
  width: 16px;
  border-top: 1px dashed #c0c4cc;
}

.border-error ::v-deep .el-input__inner {
  border-color: #ff4949 !important;
}
.serial-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  min-width: 20px;
  padding: 0 3px;
  border-radius: 50%;
  border: 1px solid #409eff;
  font-size: 10px;
}
.status-tag {
  display: inline-block;
  color: #1890ff;
  font-size: 12px;
  height: 20px;
  line-height: 18px;
  padding: 0 7px;
  border-radius: 10px;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: #e8f4ff;
  border: 1px solid #d1e9ff;
}
// 待处理
.status-tag-1 {
  color: #597ef7;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
}
// 部分完成
.status-tag-2 {
  color: #fa8c16;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
}
// 已完成
.status-tag-3 {
  color: #52c41a;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
// 已取消
.status-tag-4 {
  color: #8c6e63;
  background-color: #f5f0ee;
  border: 1px solid #d7ccc8;
}
// 已占用
.status-tag-5 {
  color: #3a8fe2;
  background-color: #f3f6f9;
  border: 1px solid #6eacf7;
}
// 已逾期
.status-tag-6 {
  color: #cb2844;
  background-color: #fbeceb;
  border: 1px solid #f36d63;
}
.weight {
  font-weight: 700;
}
</style>
