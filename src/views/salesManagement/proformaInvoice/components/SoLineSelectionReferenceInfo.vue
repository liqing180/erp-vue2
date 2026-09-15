<template>
  <div class="proforma-invoice-container">
    <!-- 顶部提示条 -->
    <div
      style="
        padding: 4px 10px;
        background-color: #f4faff;
        border: 1px solid #9aceff;
        border-radius: 4px;
        font-size: 12px;
        margin-bottom: 16px;
      "
      v-if="pisForm.calculationBasis !== '2' && false"
    >
      {{ $t('SALES.entireSOTip') }}
    </div>

    <div class="info-card">
      <div class="card-header">
        <span class="card-title">{{ $t('SALES.SOSummary') }}</span>
      </div>
      <div class="card-body">
        <el-form label-position="top" @submit.native.prevent>
          <el-row :gutter="120">
            <el-col :span="8" v-if="false">
              <el-form-item :label="`${$t('SALES.calculationBasis')}`">
                <el-radio-group
                  v-model="pisForm.calculationBasis"
                  @change="calculationBasisChange"
                  :disabled="comDisFrom"
                >
                  <el-radio label="1"
                    ><span>{{ $t('SALES.entireSO') }}</span></el-radio
                  >
                  <el-radio label="2"
                    ><span>{{ $t('SALES.selectedSOLinesQTY') }}</span></el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.paymentStage')}`" required>
                <ComparisonInput
                  v-if="isModified('stageName')"
                  :beforeValue="getBeforeValue('stageName')"
                  :afterValue="getAfterValue('stageName', pipForm.stageName)"
                />
                <SelectInput
                  v-else
                  :value="pipForm.stageName"
                  :title="pipForm.stageName"
                  :clearable="false"
                  @click="openSelectStageNameDlg"
                  :disabled="comDisFrom || isRevise"
                  class="form-wd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.selectedSOLine')}`">
                <el-input
                  :value="pisForm.selectedSoLine"
                  :title="pisForm.selectedSoLine"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.selectedQTY')}`">
                <el-input :value="pisForm.selectedQty" :title="pisForm.selectedQty" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="120">
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.soTotalAmount')}`">
                <el-input
                  :value="formatAmount(pisForm.soTotalAmount)"
                  :title="formatAmount(pisForm.soTotalAmount)"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.SONo1')}`">
                <el-input :value="pisForm.salesOrderNo" :title="pisForm.salesOrderNo" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.customer')}`">
                <el-input
                  :value="pisForm.businessPartnerName"
                  :title="pisForm.businessPartnerName"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="120">
            <el-col :span="8">
              <el-form-item :label="`${$t('SALES.incoterm')}`">
                <el-input :value="pisForm.incotermName" :title="pisForm.incotermName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('ui.currency')}`">
                <el-input :value="pisForm.currency" :title="pisForm.currency" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- SO 信息栏 -->
    <div class="so-info-bar mt20">
      <!-- <div class="so-info-left">
        <span class="so-info-item">{{ $t('SALES.SONo1') }}：{{ pisForm.salesOrderNo }}</span>
        <span class="so-info-item"
          >{{ $t('SALES.customer') }}：{{ pisForm.businessPartnerName }}</span
        >
        <span class="so-info-item">{{ $t('SALES.incoterm') }}：{{ pisForm.incotermName }}</span>
        <span class="so-info-item">{{ $t('ui.currency') }}：{{ pisForm.currency }}</span>
      </div> -->
      <div>
        <el-button
          v-if="formData.documentId && checkPermi(['salesManagement:salesOrder:list'])"
          type="primary"
          plain
          size="mini"
          @click="handleViewSo"
          >{{ $t('SALES.viewSO') }}</el-button
        >
      </div>
      <div class="so-info-right">
        <right-toolbar
          :showSearchBtn="false"
          :showRefreshBtn="false"
          :saveKey="saveKey"
          :savePath="savePath"
          :columnsInit="columns"
          :columns="configColumn"
        ></right-toolbar>
      </div>
    </div>

    <!-- 明细表格 -->
    <el-table
      :data="comTableList"
      class="so-table"
      ref="tables"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :class="{ 'hide-check-all': comDisFrom }"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
    >
      <el-table-column
        v-if="pisForm.calculationBasis === '2'"
        type="selection"
        key="selection"
        :selectable="selectable"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isTotal !== '1'" class="serial-number">{{ scope.$index + 1 }}</span>
          <span v-else style="font-weight: bold">{{ $t('SALES.total') }}</span>
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
        :align="item.align || 'center'"
        header-align="center"
      >
        <template slot="header" slot-scope="{ column }">
          <span v-if="['proformaInvoiceQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'proformaInvoiceQty'">
            <template
              v-if="
                !comDisFrom &&
                pisForm.calculationBasis === '2' &&
                scope.row.isTotal !== '1' &&
                scope.row.includedInScope === '1'
              "
            >
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.proformaInvoiceQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.balanceQty"
                @change="qtyChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>
              <span v-if="scope.row.isTotal !== '1'">{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</span>
              <span v-else style="font-weight: bold">{{ $numberStr(comTotalQty, 3, false) }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'soQty'">
            <span v-if="scope.row.isTotal !== '1'">{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</span>
            <span v-else style="font-weight: bold">{{ $numberStr(comTotalSoQty, 3, false) }}</span>
          </template>
          <template v-else-if="item.prop === 'reservedQty'">
            <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>
          <template v-else-if="item.prop === 'balanceQty'">
            <span>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</span>
          </template>

          <template v-else-if="item.prop === 'netUnitPrice'">
            <span v-if="scope.row.isTotal !== '1'">{{
              (pisForm.currencySymbol || '') + ' ' + $numberStr(scope.row[item.prop], 2)
            }}</span>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <span v-if="scope.row.isTotal !== '1' && $resultOfBoolean(scope.row[item.prop])">{{
              (pisForm.currencySymbol || '') + ' ' + $numberStr(scope.row[item.prop], 2)
            }}</span>
            <span v-if="scope.row.isTotal === '1'" style="font-weight: bold">{{
              (pisForm.currencySymbol || '') + ' ' + $numberStr(comSumLineTotal, 2)
            }}</span>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span v-if="scope.row.isTotal !== '1'" :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
            <span v-else style="font-weight: bold">{{ uomSummary }}</span>
          </template>

          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>

          <template v-else-if="item.prop === 'includedInScope' && scope.row.isTotal !== '1'">
            <div class="scope-cell">
              <i
                class="el-icon-lock scope-lock"
                :style="`color: ${scope.row.includedInScope === '1' ? '#409eff' : '#409eff00'} `"
              />
              <span class="scope-text">
                {{
                  scope.row.includedInScope === '1' ? $t('SALES.included') : $t('SALES.excluded')
                }}</span
              >
            </div>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <!-- Remarks + 付款金额 -->
    <div class="remarks-payment-section">
      <div class="remarks-block">
        <div class="info-card">
          <div class="card-header">
            <span class="card-title">{{ $t('ui.remarks') }}</span>
          </div>
          <div class="card-body hideInputBorder" style="padding: 0">
            <MyInput
              v-model="pisForm.remarks"
              :maxlength="7000"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              :disabled="comDisFrom"
              show-word-limit
              resize="none"
            >
            </MyInput>
          </div>
        </div>
        <!-- <div class="section-title">{{ $t('ui.remarks') }}</div> -->
      </div>
      <div class="payment-block">
        <div class="info-card">
          <div class="card-header">
            <span class="card-title">{{ $t('SALES.amountSummary') }}</span>
          </div>
          <div class="card-body" style="padding-bottom: 6px">
            <table class="payment-table">
              <tr>
                <td class="payment-label">{{ $t('SALES.amount') }}</td>
                <td class="payment-currency">{{ pisForm.currencySymbol }}</td>
                <td class="payment-value">{{ $numberStr(pisForm.amount, 2) }}</td>
              </tr>
              <tr>
                <td class="payment-label">{{ $t('SALES.paymentPercentage') }}</td>
                <td class="payment-currency"></td>
                <td class="payment-value">{{ pisForm.paymentPercentage }}%</td>
              </tr>
              <tr class="underline">
                <td class="payment-label">{{ $t('SALES.paymentAmount') }}</td>
                <td class="payment-currency">{{ pisForm.currencySymbol }}</td>
                <td class="payment-value">{{ $numberStr(pisForm.paymentAmount, 2) }}</td>
              </tr>
              <tr>
                <td class="payment-label">{{ $t('SALES.totalAmountDue') }}</td>
                <td class="payment-currency">{{ pisForm.currencySymbol }}</td>
                <td class="payment-value">{{ $numberStr(pisForm.totalAmountDue, 2) }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择付款阶段弹窗 -->
    <SelectStageNameDlg
      ref="SelectStageNameDlg"
      :pipFormData="pipFormData"
      :salesOrderId="formData.salesOrderId"
      @change="paymentStageChange"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { calculate } from '@/api/salesManagement/proformaInvoice'
import SelectStageNameDlg from './SelectStageNameDlg.vue'
export default {
  dicts: ['calculation_basis'],
  components: {
    SelectStageNameDlg
  },
  mixins: [pageMixin],
  props: {
    comDisFrom: Boolean,
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    isRevise: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    pisFormData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    pipFormData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    comTableList() {
      this.initTableSelect()
    },
    pisFormData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.pisForm = newValue || {}
      }
    },
    'pisFormData.proformaInvoiceSelectionDetailList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.pisFormData.proformaInvoiceSelectionDetailList || []

        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      }
    },
    pipFormData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.pipForm = newValue || {}
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '3',
      savePath: 'piTable',
      pisForm: {
        calculationBasis: '1'
      },
      pipForm: {},

      columns: [
        {
          prop: 'productName',
          label: vm.$t('SALES.productName'),
          visible: true,
          colMinWidth: 180,
          required: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          colMinWidth: 160,
          tooltip: false
        },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          colMinWidth: 120,
          tooltip: true
        },

        {
          prop: 'soQty',
          label: vm.$t('SALES.orderQTY'),
          visible: false,
          colMinWidth: 120,
          tooltip: true
        },
        {
          prop: 'reservedQty',
          label: vm.$t('SALES.reservedQTY'),
          visible: false,
          colMinWidth: 120,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('SALES.balanceQTY'),
          visible: false,
          colMinWidth: 120,
          tooltip: true
        },

        {
          prop: 'proformaInvoiceQty',
          label: vm.$t('SALES.qty'),
          visible: true,
          colMinWidth: 120,
          tooltip: true
        },
        {
          prop: 'netUnitPrice',
          label: vm.$t('SALES.netUnitPrice1'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 80
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 80
        },
        {
          prop: 'includedInScope',
          label: vm.$t('SALES.includedInScope'),
          visible: true,
          minWidth: 200,
          fixedWidth: 200,
          tooltip: true
        }
      ],
      tableList: []
    }
  },
  computed: {
    updateMsgList() {
      return this.pipForm.updateMsgList || []
    },
    comSelectLine() {
      return this.tableList.filter((item) => item.includedInScope === '1').length
    },
    comTotalQty() {
      return this.tableList.reduce((sum, item) => {
        if (item.includedInScope === '1') {
          return sum + (item.proformaInvoiceQty || 0)
        } else {
          return sum
        }
      }, 0)
    },
    comTotalSoQty() {
      return this.tableList.reduce((sum, item) => {
        if (item.includedInScope === '1') {
          return sum + (item.soQty || 0)
        } else {
          return sum
        }
      }, 0)
    },
    comSumLineTotal() {
      return this.tableList.reduce((sum, item) => {
        if (item.includedInScope === '1') {
          return sum + (item.lineTotal || 0)
        } else {
          return sum
        }
      }, 0)
    },
    uomSummary() {
      const map = {}
      this.tableList.forEach((item) => {
        if (item.includedInScope === '1' && item.proformaInvoiceQty) {
          map[item.uom] = (map[item.uom] || 0) + (item.proformaInvoiceQty || 0)
        }
      })
      return Object.keys(map)
        .map((key) => `${key}: ${map[key]}`)
        .join(', ')
    },
    comTableList() {
      if (this.tableList.length > 1) {
        return [...this.tableList, { isTotal: '1', rowTimeId: '999' }]
      } else {
        return this.tableList
      }
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    isModified(prop) {
      if (this.modifyHighlight && this.updateMsgList.some((item) => item.name === prop)) {
        return 'edit-outline'
      }
      return ''
    },
    getBeforeValue(prop) {
      const item = this.updateMsgList.find((row) => row.name === prop) || {}
      return this.formatComparisonValue(prop, item.beforeValue)
    },
    getAfterValue(prop, fallback) {
      const item = this.updateMsgList.find((row) => row.name === prop)
      const value = item && item.afterValue !== undefined ? item.afterValue : fallback
      return this.formatComparisonValue(prop, value)
    },
    formatComparisonValue(prop, value) {
      if (prop !== 'calculationBasis') return value
      if (String(value) === '1') return this.$t('SALES.entireSO')
      if (String(value) === '2') return this.$t('SALES.selectedSOLinesQTY')
      return value
    },
    openSelectStageNameDlg() {
      this.$refs.SelectStageNameDlg.handleOpen()
    },
    paymentStageChange(data) {
      if (data.paymentPlanDetailId === this.pipForm.paymentPlanDetailId) return
      this.$set(this.pipForm, 'paymentPlanDetailId', data.paymentPlanDetailId)
      this.$set(this.pipForm, 'stageName', data.stageName)
      this.$emit('paymentStageChange')
    },
    initTableSelect() {
      // 等待表格更新数据后同步，避免新数组导致 Element UI 清空勾选。
      this.$nextTick(() => {
        const table = this.$refs.tables
        if (!table) return
        this.tableList.forEach((item) => {
          table.toggleRowSelection(item, item.includedInScope === '1')
        })
      })
    },
    selectable(row) {
      if (this.comDisFrom || row.isTotal === '1') {
        return false // 禁用
      } else if (row.balanceQty <= 0) {
        return false // 禁用
      } else {
        return true // 不禁用
      }
    },
    handleSelectAll(selection) {
      if (selection.length) {
        this.tableList.forEach((row) => {
          if (row.balanceQty > 0) {
            this.$set(row, 'includedInScope', '1')
            this.$set(row, 'proformaInvoiceQtyError', false)
            this.$set(row, 'ROW-ERROR', false)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        this.tableList.forEach((row) => {
          this.$set(row, 'includedInScope', '0')
          this.$set(row, 'proformaInvoiceQtyError', false)
          this.$set(row, 'ROW-ERROR', false)
        })
      }
      this.calculate()
    },
    // 以表格实际选中状态为准，避免业务字段与勾选状态不一致时反向更新。
    handleSelectionChange(selection, row) {
      this.$set(row, 'includedInScope', selection.includes(row) ? '1' : '0')
      this.$set(row, 'proformaInvoiceQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.calculate()
    },
    calculationBasisChange(type) {
      if (type === '1') {
        this.tableList.forEach((item) => {
          this.$set(item, 'includedInScope', '1')
          this.$set(item, 'proformaInvoiceQty', item.balanceQty)
          this.$set(item, 'proformaInvoiceQtyError', false)
          this.$set(item, 'ROW-ERROR', false)
          this.getLineTotal(item)
        })
      }
      if (type === '2') {
        this.tableList.forEach((item) => {
          this.$set(item, 'includedInScope', '0')
          this.$set(item, 'proformaInvoiceQty', item.balanceQty)
          this.$set(item, 'proformaInvoiceQtyError', false)
          this.$set(item, 'ROW-ERROR', false)
          this.getLineTotal(item)
        })
      }
      this.$refs.tables.clearSelection()
      this.calculate()
    },

    formatAmount(val) {
      if (val === null || val === undefined || val === '') return ''
      return (this.pisForm.currencySymbol || '') + ' ' + this.$numberStr(val, 2)
    },
    handleViewSo() {
      this.$router.push({
        path: '/salesManagement/editSalesOrder',
        query: {
          id: this.formData.documentId,
          timeId: Date.now(),
          backType: '2'
        }
      })
    },
    qtyChange(row) {
      this.$set(row, 'proformaInvoiceQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.getLineTotal(row)
      this.calculate()
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (
          this.$resultOfBoolean(row.proformaInvoiceQty) &&
          this.$resultOfBoolean(row.netUnitPrice)
        ) {
          const lineTotal = row.netUnitPrice * row.proformaInvoiceQty
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
      })
    },
    calculate() {
      const timer = Date.now()
      this.queryTimer = timer
      calculate(this.formData).then((res) => {
        if (this.queryTimer !== timer) return
        const data = res.data || {}
        const pisData = data.proformaInvoiceSelection || {}

        this.$set(this.pisForm, 'selectedSoLine', pisData.selectedSoLine)
        this.$set(this.pisForm, 'selectedQty', pisData.selectedQty)
        this.$set(this.pisForm, 'selectedQty', pisData.selectedQty)
        this.$set(this.pisForm, 'selectedQty', pisData.selectedQty)
        this.$set(this.pisForm, 'amount', pisData.amount)
        this.$set(this.pisForm, 'paymentPercentage', pisData.paymentPercentage)
        this.$set(this.pisForm, 'paymentAmount', pisData.paymentAmount)
        this.$set(this.pisForm, 'totalAmountDue', pisData.totalAmountDue)
        /* 更新当前阶段金额 */
        const pipData = data.proformaInvoicePayment || {}
        const pipForm = this.formData.proformaInvoicePayment || {}
        this.$set(pipForm, 'currentProformaInvoiceAmount', pipData.currentProformaInvoiceAmount)
      })
    },
    errorMessage(code) {
      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          this.$set(item, 'ROW-ERROR', true)
          this.$set(item, code + 'Error', true)
          if (!this.$resultOfBoolean(rowIndex)) {
            rowIndex = index
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + 'Error', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('Error')) {
                this.$set(item, key, false)
              }
            })
          }
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        }
        if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      if (row.isTotal === '1') {
        color = 'hide-row-check'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      const property = column.type === 'selection' ? 'includedInScope' : column.property
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    }
  }
}
</script>

<style scoped>
.proforma-invoice-container {
  padding: 20px;
  background: #fff;
  font-size: 12px;
}

/* 计算基础 */
.calc-basis {
  margin-bottom: 16px;
}
.calc-basis-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 20px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  margin-right: 80px;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}
.stat-value {
  min-height: 21px;
  font-size: 14px;
  color: #303133;
}

/* SO 信息栏 */
.so-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  /* margin-bottom: 12px; */
}
.so-info-left {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.so-info-item {
  font-size: 12px;
  color: #606266;
}
.so-info-item strong {
  color: #303133;
  font-weight: 600;
}
.so-info-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 表格 */
.so-table {
  width: 100%;
}
.serial-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* width: 22px; */
  height: 20px;
  min-width: 20px;
  padding: 0 3px;
  border-radius: 50%;
  border: 1px solid #409eff;
  /* background: #409eff; */
  /* color: #333; */
  font-size: 10px;
}
.scope-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.scope-lock {
  color: #909399;
  font-size: 14px;
}
.scope-text {
  font-size: 12px;
}

/* 合计行 */
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-top: none;
  border-radius: 0 0 4px 4px;
  font-weight: 600;
}
.total-label {
  font-size: 14px;
  color: #303133;
}
.total-right {
  display: flex;
  align-items: center;
}
.total-uom {
  width: 200px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  font-weight: normal;
}
.total-qty {
  width: 80px;
  text-align: center;
}
.total-amount {
  width: 150px;
  text-align: right;
  color: #303133;
  font-size: 12px;
}

/* Remarks + 付款金额 */
.remarks-payment-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 16px;
}
.remarks-block {
  flex: 1;
}
.section-title {
  color: #909399;
  margin-bottom: 8px;
}
.remarks-content {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px 16px;
  min-height: 120px;
}
.remarks-content p {
  margin: 0 0 8px 0;
  color: #606266;
  line-height: 1.6;
}
.remarks-content p:last-child {
  margin-bottom: 0;
}
.payment-block {
  flex-shrink: 0;
}
.payment-table {
  width: auto;
  border-collapse: collapse;
  table-layout: auto;
}
.payment-table td {
  white-space: nowrap;
  font-weight: 600;
  color: #606266;
}
.payment-table tr.underline td {
  border-bottom: 2px solid #dcdfe6;
}
.payment-table tr.bold td {
  font-weight: 600;
}
.payment-label {
  text-align: left;
  padding: 2px 0;
  padding-right: 60px;
  padding-bottom: 6px;
  min-width: 120px;
}

.payment-currency {
  font-size: 12px;
  text-align: left;
  padding-right: 20px;
  min-width: 60px;
}
.payment-value {
  font-weight: 500;
  text-align: right;
  min-width: 120px;
}

.info-card {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding-left: 16px;
  border-bottom: 1px solid #ebeef5;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #555;
}
.card-edit {
  font-size: 18px;
  color: #409eff;
  cursor: pointer;
  transition: color 0.2s;
}
.card-edit:hover {
  color: #66b1ff;
}
.card-body {
  padding: 8px 16px 12px;
}
.hideInputBorder ::v-deep .el-textarea__inner {
  border: 0 !important;
}
</style>
