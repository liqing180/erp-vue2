<template>
  <div class="pb20" v-if="tableList.length > 0">
    <el-row :gutter="10" class="mb8">
      <el-col :span="18" class="flexStart">
        <div style="line-height: 30px" class="mr20">
          <span class="mr10" style="font-size: 16px">
            {{ $t('SALES.PIBreakdown') }}
          </span>
          <span v-if="acrossStageCount > 0"
            >({{ $t('SALES.acrossStage').replace('$1', $numberStr(acrossStageCount, 0)) }})</span
          >
        </div>

        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          >{{ $t('uiBtn.export') }}</el-button
        >
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
      :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
      :data="tableList"
      default-expand-all
      :key="tableKey"
      style="cursor: pointer"
      @sort-change="handleSortChange"
      max-height="600"
    >
      <el-table-column type="index" :label="$t('ui.sn')" width="60" fixed="left" align="center">
        <template slot-scope="scope">
          <span
            :class="[
              scope.row.stageNum && scope.row.stageNum.indexOf('.') === -1 ? 'serial-number' : ''
            ]"
            >{{ scope.row.stageNum }}</span
          >
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
          <template v-if="item.prop === 'stageName'">
            <!-- <i v-if="scope.$index === 0" class="el-icon-lock"></i> -->
            <span
              v-if="
                (scope.row.childList || []).length <= 0 && scope.row.levelNum === 1 && existLevel2
              "
              style="display: inline-block; width: 23px"
            ></span>
            <span
              v-if="(scope.row.childList || []).length <= 0 && scope.row.levelNum === 2"
              style="display: inline-block; width: 4px"
            ></span>
            <span
              style="
                display: inline-block;
                margin-right: 4px;
                font-size: 14px;
                font-weight: bold;
                color: #409eff;
              "
              >{{ scope.row.stage + '. ' }}</span
            >
            {{ `${scope.row[item.prop]}` }}
          </template>
          <el-tag
            v-else-if="item.prop === 'downPayment' || item.prop === 'goodsIssue'"
            :type="scope.row[item.prop] === '1' ? '' : 'info'"
            >{{ scope.row[item.prop] === '1' ? $t('uiBtn.yes') : $t('uiBtn.no') }}</el-tag
          >
          <template v-else-if="item.prop === 'days'">{{
            $numberStr(scope.row[item.prop], 0)
          }}</template>
          <template v-else-if="item.prop === 'triggerDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'stageDescription'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else-if="item.prop === 'percentage'">
            {{ $numberStr(scope.row[item.prop], 0) }}
          </template>
          <template v-else-if="item.prop === 'piNo'">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="proformaInvoice"
              @click="nav(scope.row, item.prop)"
              v-if="isPath !== 'pi'"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <!-- <template v-else-if="item.prop === 'piStatus'">
            {{ selectDictLabel(dict.type.proforma_invoice_status, scope.row[item.prop]) }}
          </template> -->
          <template v-else-if="item.prop === 'piStatus'">
            <div
              class="status-tag"
              :class="'status-tag-' + scope.row.piStatus"
              v-if="scope.row.piStatus"
            >
              {{ selectDictLabel(dict.type.proforma_invoice_status, scope.row[item.prop]) }}
            </div>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <ExportDlg ref="ExportDlgRef" :loading="exportLoading" @export="handleExport" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { queryBySalesOrderId } from '@/api/salesManagement/salesOrder'

export default {
  dicts: ['proforma_invoice_status'],
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
      saveKey: '112',
      savePath: 'PIBreakdownTable',
      exportLoading: false,
      rowId: '',
      // 是否自动生成 EmployeeNo
      submitLoading: false,
      form: {},
      /* 表格表单部分 */
      /* 表格部分 */
      columns: [
        {
          prop: 'stage',
          label: vm.$t('SALES.stage'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom',
          fixed: true
        },
        {
          prop: 'piNo',
          label: vm.$t('SALES.PINo1'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        // {
        //   prop: 'calculationBasis',
        //   propBy: 'calculationBasisShowStr',
        //   label: vm.$t('SALES.calculationBasis'),
        //   visible: false,
        //   minWidth: 200,
        //   sortable: 'custom',
        //   tooltip: true
        // },
        {
          prop: 'scopeSummary',
          label: vm.$t('SALES.scopeSummary'),
          visible: false,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'piAmount',
          propBy: 'piAmountStr',
          label: vm.$t('SALES.PIAmount1'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'remainingPiAmount',
          propBy: 'remainingPiAmountStr',
          label: vm.$t('SALES.remainingAmount1'),
          visible: false,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'piStatus',
          propBy: 'piStatusShowStr',
          label: vm.$t('SALES.PIStatus'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'emailStatus',
          label: vm.$t('SALES.emailStatus'),
          visible: true,
          sortable: 'custom',
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'createdBy',
          label: vm.$t('ui.createdBy'),
          minWidth: 160,
          visible: true,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'issueDate',
          label: vm.$t('SALES.issueDate'),
          visible: true,
          sortable: 'custom',
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'dueDate',
          label: vm.$t('SALES.dueDate2'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: true
        }
      ],
      tableList: [],
      tableKey: Date.now(),
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      acrossStageCount: undefined,
      currencySymbol: undefined,
      salesOrderId: undefined
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
      const item = this.tableList.find((item) => (item.childList || []).length > 0)
      return !!item
    }
  },
  methods: {
    init(formData = {}) {
      const { piBreakdown, acrossStageCount, currencySymbol, salesOrderId } = formData
      this.acrossStageCount = acrossStageCount
      this.currencySymbol = currencySymbol
      this.salesOrderId = salesOrderId

      const list = piBreakdown || []
      list.forEach((item) => {
        if (item && item._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(item, '_stableIndex', this._stableCounter)
        }
        item.piStatusShowStr = this.selectDictLabel(
          this.dict.type.proforma_invoice_status,
          item.piStatus
        )
      })

      this.setNodeRowId(list, 0)
      this.resetStageNum(list)
      this.tableList = list
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },

    queryTable() {
      this.$refs.tables.clearSort()
      this.getList()
    },
    getList() {
      this.loading = true
      queryBySalesOrderId({ salesOrderId: this.propRowId || this.salesOrderId }).then((res) => {
        const { piBreakdown, acrossStageCount, currencySymbol, salesOrderId } = res.data
        this.acrossStageCount = acrossStageCount
        this.currencySymbol = currencySymbol
        this.salesOrderId = salesOrderId
        const list = piBreakdown || []
        list.forEach((item) => {
          if (item && item._stableIndex === undefined) {
            this._stableCounter = (this._stableCounter || 0) + 1
            this.$set(item, '_stableIndex', this._stableCounter)
          }
          item.piStatusShowStr = this.selectDictLabel(
            this.dict.type.proforma_invoice_status,
            item.piStatus
          )
        })
        this.setNodeRowId(list, 0)
        this.resetStageNum(list)
        this.tableList = list || []
        this.loading = false
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    onDictReady() {
      this.tableList.forEach((item) => {
        item.piStatusShowStr = this.selectDictLabel(
          this.dict.type.proforma_invoice_status,
          item.piStatus
        )
      })
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    nav(row, type) {
      this.$emit('back')
      this.$router.push({
        path: '/salesManagement/viewProformaInvoice',
        query: {
          id: row.proformaInvoiceId,
          timeId: Date.now(),
          backType: '2'
        }
      })
    },

    setNodeRowId(dataList, levelNum, plantNode) {
      for (const node of dataList) {
        node.piAmountStr = this.currencySymbol + ' ' + this.$numberStr(node.piAmount, 2)
        node.remainingPiAmountStr =
          this.currencySymbol + ' ' + this.$numberStr(node.remainingPiAmount, 2)
        node.issueDate = this.parseTime(node.issueDate, this.fmtForYmd)
        node.dueDate = this.parseTime(node.dueDate, this.fmtForYmd)

        // 如果找到匹配的ID，返回该节点
        node.rowTimeId = node.paymentTermDetailId
        node.levelNum = levelNum + 1
        if (plantNode) {
          node.parentRowTimeId = plantNode.rowTimeId
          node.isCivilWorks = plantNode.trigger === '9' || plantNode.isCivilWorks
        }
        // 如果当前节点有子节点，递归查找
        if (node.childList && node.childList.length > 0) {
          this.setNodeRowId(node.childList, node.levelNum, node)
        }
      }
    },
    handleSortChange({ prop, order }) {
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
    // 表单重置
    reset() {
      this.tableList = []
    },
    // 重置阶段名称前面的序号 stage 字段
    resetStageNum(list, plantStage) {
      list.forEach((item, index) => {
        item.stageNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.childList && item.childList.length > 0) {
          this.resetStageNum(item.childList, item.stageNum)
        }
        item.piStatusShowStr = this.selectDictLabel(
          this.dict.type.proforma_invoice_status,
          item.piStatus
        )
        item.calculationBasisShowStr =
          item.calculationBasis === '1'
            ? this.$t('SALES.entireSO')
            : item.calculationBasis === '2'
            ? this.$t('SALES.selectedSOLinesQTY')
            : ''
      })
    },
    tableRowClassName({ row, rowIndex }) {
      // if (rowIndex === 0) {
      //   return 'table-SelectedRow-bgcolor'
      // }
      return ''
    },
    /** 导出按钮操作 */
    /** 导出按钮操作 */
    openExport() {
      this.$refs.ExportDlgRef.open()
    },
    handleExport(data) {
      const vm = this
      const params = {
        exportType: 4,
        salesOrderId: this.salesOrderId
      }
      params.exportFields = this.getTablePropListForSort(this.visibleColumn)

      vm.exportLoading = true
      this.$importOrExportDownFile(
        '/sales/paymentPlan/exportPiBreakdown',
        params,
        `${this.getFileNameDate('PI Breakdown')}.xlsx`
      )
        .then((res) => {
          vm.exportLoading = false
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
.status-tag-1 {
  color: #597ef7;
  background-color: #f0f5ff;
  border: 1px solid #adc6ff;
}
.status-tag-2 {
  color: #fa8c16;
  background-color: #fff7e6;
  border: 1px solid #ffd591;
}
.status-tag-3 {
  color: #13c2c2;
  background-color: #f6fffd;
  border: 1px solid #87e8de;
}
.status-tag-4 {
  color: #52c41a;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
}
.status-tag-5 {
  color: #8c6e63;
  background-color: #f5f0ee;
  border: 1px solid #d7ccc8;
}
.status-tag-6 {
  color: #8c8c8c;
  background-color: #fafafa;
  border: 1px solid #d9d9d9;
}
</style>
