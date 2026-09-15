<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!businessPartnerId || !formData.currencyId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="mini"
          :disabled="selected.length <= 0"
          v-if="cancelBtnShow"
          @click="handleCancel"
          >{{ $t('menu.cancel') }}
        </el-button>
        <el-tooltip placement="top" v-if="cancelBtnShow">
          <div slot="content">
            <div v-html="$t('SALES.soCancelProductTip')"></div>
          </div>
          <i class="el-icon-info ml10"></i>
        </el-tooltip>
      </el-col>
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="comTableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      tooltip-effect="light"
    >
      <el-table-column
        type="selection"
        key="selection"
        align="center"
        v-if="cancelBtnShow"
        :selectable="selectable"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        key="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.isTotal">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-for="item in comVisibleColumn"
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
        <template slot="header" slot-scope="{ column }">
          <span
            v-if="
              [
                !disableNonInitial ? 'salesQuotationProductType' : '',
                !disableNonInitial ? 'salesPartNo' : '',
                'qty',
                'unitPrice',
                'deliveryDateForDay'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'salesQuotationProductType'">
            <el-select
              v-if="!comDisFrom && !disableNonInitial"
              style="width: 98%"
              v-model="scope.row.salesQuotationProductType"
              placeholder=""
              @change="salesInquiryProductTypeChange(scope.row)"
            >
              <el-option
                v-for="dict in dict.type.sales_inquiry_product_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <template v-else-if="item.prop === 'salesPartNo'">
            <CommonSelect
              v-if="!comDisFrom && !disableNonInitial"
              style="width: 98%"
              :id="scope.row.salesPartNo"
              :label="scope.row.salesPartNo"
              :title="scope.row.salesPartNo"
              :clearable="false"
              idKey="salesPartNo"
              labelKey="salesPartNo"
              :options="scope.row.salesPartNoList || []"
              @change="salesPartNoChange($event, scope.row)"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'priceType'">
            <CommonSelect
              v-if="!comDisFrom && !disableNonInitial && scope.row.salesPartNo"
              style="width: 98%"
              :id="scope.row.priceType"
              :label="scope.row.priceTypeShowStr"
              :title="scope.row.priceTypeShowStr"
              :clearable="false"
              idKey="priceType"
              labelKey="priceTypeShowStr"
              :options="scope.row.salesPriceStrategyDetails || []"
              @change="priceTypeChange($event, scope.row)"
            />
            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <!-- <template v-else-if="item.prop === 'qty'">
            <template v-if="!comDisFrom && !disQty">
              <el-input-number
              v-thousandSplit="{ precision: 0 }"
                style="width: 100%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="0"
                :min="1"
                :max="999999999"
                @change="qtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template> -->
          <template v-else-if="item.prop === 'qty'">
            <div
              :title="
                scope.row.qty && scope.row.uomCoefficient && scope.row.uomCoefficient > 1
                  ? $numberStr(scope.row.qty, scope.row.decimalNum) +
                    '' +
                    scope.row.uom +
                    ' = ' +
                    $numberStr(scope.row.qty * scope.row.uomCoefficient, scope.row.decimalNum) +
                    '' +
                    scope.row.basicUom
                  : ''
              "
            >
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </div>
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{
              $qtyNumberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{
              $qtyNumberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</template>
          </template>
          <template v-else-if="item.prop === 'documentReservedQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'stockOutQty'">
            <template>{{ $qtyNumberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'shippedQty'">
            <template>{{ $qtyNumberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            <template>{{ $qtyNumberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'rejectedQty'">
            <template>{{ $qtyNumberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unfulfilledQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.unitPrice"
                controls-position="right"
                :precision="2"
                :min="0.01"
                :max="999999999999.99"
                @change="qtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'discount'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-if="!comDisFrom && scope.row.salesQuotationProductType === '1'"
              style="width: 98%"
              v-model="scope.row.discount"
              controls-position="right"
              :precision="2"
              :min="0"
              :max="(scope.row.qty || 0) * (scope.row.unitPrice || 0) || 999999999999.99"
              @change="discountChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'salesCost'">
            <template v-if="!scope.row.isTotal">{{ $numberStr(scope.row[item.prop], 2) }}</template>
            <template v-else>{{ $numberStr(comSalesCost, 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'salesProfit'">
            <template v-if="!scope.row.isTotal">{{ $numberStr(scope.row[item.prop], 2) }}</template>
            <template v-else>{{ $numberStr(comSalesProfit, 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'warranty'">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              :min="0"
              :max="9999"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>

          <template
            v-else-if="
              ['balanceQtyForBasicForDeliverySchedule'].includes(item.prop) && !scope.row.isTotal
            "
          >
            <TableNonInventoryItem
              v-if="scope.row.nonInventoryItem === '1' || !scope.row[item.prop]"
            />

            <template v-else>{{
              $qtyNumberStr(
                scope.row[item.prop] < 0 ? 0 : scope.row[item.prop],
                scope.row.decimalNum
              )
            }}</template>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <selectProductTable :formData="formData" ref="selectProductTable" @onSuccess="updateTable" />
    <pendingShipmentDetailsDlg ref="pendingShipmentDetailsDlg" />
    <!-- 取消 -->
    <FormCancelDialog
      :ids="(selected || []).map((x) => x.salesOrderProductId)"
      :taskId="taskId || formData.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
      path="salesOrder"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from '../components/selectProductTable'
import pendingShipmentDetailsDlg from './pendingShipmentDetailsDlg.vue'
import {
  calculateOneDetail,
  queryCanSelectPPLListNoPage
} from '@/api/salesManagement/salesQuotation'

import { cancelledSalesOrderDetail } from '@/api/salesManagement/salesOrder'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type', 'tax_type'],
  components: {
    selectProductTable,
    pendingShipmentDetailsDlg,
    FormCancelDialog
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    comDisFrom: {
      type: Boolean,
      default: false
    },
    productList: {
      type: Array,
      default() {
        return []
      }
    },
    countryId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    taskId: {
      type: String,
      default: ''
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
      }
    },
    'formData.salesOrderProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesOrderProductList
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '38',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        // {
        //   prop: 'salesQuotationProductType',
        //   propBy: 'salesQuotationProductTypeShowStr',
        //   label: vm.$t('ui.type'),
        //   visible: true,
        //   minWidth: 200,
        //   fixed: false,
        //   tooltip: true
        // },
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        /* {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },

        /* {
          prop: 'priceType',
          propBy: 'priceTypeShowStr',
          label: vm.$t('SALES.priceType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.salesQTY1'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('SALES.shippedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        // {
        //   prop: 'stockOutQty',
        //   label: vm.$t('PRODUCT.outboundQTY'),
        //   visible: true,
        //   minWidth: 140,
        //   padding: 60,
        //   tooltip: true
        // },
        {
          prop: 'returnedQty',
          label: vm.$t('SALES.returnedQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('SALES.rejectedQty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQtyForBasicForDeliverySchedule',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        /* {
          prop: 'unfulfilledQty',
          label: vm.$t('SALES.cancelledOrderQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }, */
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        /* {
          prop: 'documentReservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        }, */
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'discount',
          label: vm.$t('SALES.discount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'salesCost',
          label: vm.$t('SALES.salesCost'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'salesProfit',
          label: vm.$t('SALES.salesProfit'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        /* {
          prop: 'warranty',
          label: vm.$t('SALES.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'salesOrderProductStatusShowStr',
          label: vm.$t('SALES.deliveryStatus'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'salesOrderProductId',
      reQuoteLoading: false,
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      cancelledUrl: cancelledSalesOrderDetail
    }
  },
  computed: {
    comTableList() {
      if (this.salesCostAuth) {
        if (this.tableList.length > 1) {
          return [...this.tableList, { isTotal: '1' }]
        } else {
          return this.tableList
        }
      }
      return this.tableList
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.salesCostAuth) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'salesCost' && item.prop !== 'salesProfit'
          return is
        })
      }
      /* if (this.formData.salesQuotationType === 'Project') {
        arr = arr.filter((item) => {
          const is = item.prop !== 'warranty' && item.prop !== 'deliveryDateForDay'
          return is
        })
      } */
      return arr
    },
    salesCostAuth() {
      return this.checkPermi(['salesManagement:salesOrder:salesCostProfit'])
    },
    comSalesCost() {
      const salesCostList = this.tableList.map((item) => item.salesCost)
      let total = 0
      salesCostList.forEach((cost) => {
        if (cost) {
          total += cost
        }
      })
      return total
    },
    comSalesProfit() {
      const salesProfitList = this.tableList.map((item) => item.salesProfit)
      let total = 0
      salesProfitList.forEach((cost) => {
        if (cost) {
          total += cost
        }
      })
      return total
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      if (this.formData.salesQuotationType === 'Project') {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return true
    },
    disInQuotation() {
      return this.formData.salesOrderStatus === '4'
    },
    disType() {
      let dis = false
      if (
        this.formData.salesOrderStatus === '4' &&
        this.formData.salesQuotationType !== 'Project'
      ) {
        dis = true
      }
      return dis
    },
    disableNonInitial() {
      if (this.formData.documentType === 'ServiceOrder' && !this.formData.approvedStatus) {
        return false
      }
      return true
    },
    disQty() {
      let dis = false
      if (
        this.formData.salesOrderStatus === '4' &&
        this.formData.salesQuotationType !== 'Trading'
      ) {
        dis = true
      }
      return dis
    },
    cancelBtnShow() {
      const { buttonAuthMsg } = this.formData
      return (
        this.checkPermi(['salesManagement:salesOrder:cancel']) &&
        buttonAuthMsg &&
        buttonAuthMsg.isCanCancelledDetail === '1'
      )
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace('$1', `${this.$t('PRODUCT.product')}`)
      )
      this.selected = []
      this.$emit('handleUpdate')
    },
    nav(row) {
      this.$refs.pendingShipmentDetailsDlg.handleOpen(row)
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesQuotationProductType':
            item.fixedWidth = vm.comDisFrom || vm.disableNonInitial ? undefined : 180
            break
          case 'salesPartNo':
            item.fixedWidth = vm.comDisFrom || vm.disableNonInitial ? undefined : 180
            break
          case 'priceType':
            item.fixedWidth = vm.comDisFrom || vm.disableNonInitial ? undefined : 180
            break
          /* case 'qty':
            item.fixedWidth = vm.comDisFrom || vm.disQty ? undefined : 140
            break */
          case 'unitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'discount':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'warranty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    getList() {
      return this.tableList
    },
    salesInquiryProductTypeChange(row) {
      if (row.salesQuotationProductType === '2') {
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
        this.$set(row, 'discount', undefined)
      } else {
        this.$set(row, 'discount', undefined)
      }
      this.getLineTotal(row)
    },
    salesPartNoChange(selectRow, row) {
      this.$set(row, 'salesPriceStrategyDetails', selectRow.salesPriceStrategyDetailList || [])
      this.$set(row, 'salesPartNo', selectRow.salesPartNo)
      this.$set(row, 'salesPartId', selectRow.salesPartId)
      const defaultRow = row.salesPriceStrategyDetails.find((item) => item.isDefault) || {}
      this.$set(row, 'priceType', defaultRow.priceType)
      this.$set(row, 'priceTypeShowStr', defaultRow.priceTypeShowStr)
      this.$set(row, 'unitPrice', defaultRow.canUseUnitPrice)
    },
    PQNoVisible(value, row) {
      const vm = this
      if (value) {
        const params = {
          currencyId: vm.formData.currencyId,
          productId: row.productId
        }
        if (!params.currencyId) {
          return
        }
        this.$set(row, 'PQNoLoading', true)
        queryCanSelectPPLListNoPage(params)
          .then((res) => {
            const list = res.data || []
            this.$set(row, 'pplList', list)
            this.$set(row, 'PQNoLoading', false)
          })
          .catch((err) => {
            this.$set(row, 'pplList', [])
            this.$set(row, 'PQNoLoading', false)
            window.console.error(err)
          })
      }
    },

    priceTypeChange(selectRow, row) {
      this.$set(row, 'priceType', selectRow.priceType)
      this.$set(row, 'priceTypeShowStr', selectRow.priceTypeShowStr)
      /* costOfGoods 与库存成本取max */
      this.$set(row, 'unitPrice', selectRow.canUseUnitPrice)
      this.getLineTotal(row)
    },

    qtyChange(row) {
      this.getLineTotal(row)
    },
    discountChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.qty
          if (row.salesQuotationProductType === '2') {
            row.discount = lineTotal
          } else if (row.discount > lineTotal) {
            row.discount = lineTotal
          }
          this.$set(row, 'lineTotal', lineTotal - (row.discount || 0))
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
        this.queryRowTaxAmount(row)
      })
    },
    queryRowTaxAmount(row) {
      if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
        const timer = Date.now()
        row.queryTime = timer
        calculateOneDetail(row).then((res) => {
          if (row.queryTime === timer) {
            const data = res.data || {}
            this.$set(row, 'unitPrice', data.unitPrice)
            this.$set(row, 'lineTotal', data.lineTotal)
            this.$set(row, 'taxAmount', data.taxAmount)
            this.$set(row, 'taxAmountProcess', data.taxAmountProcess)
            this.$set(row, 'salesCost', data.salesCost)
            this.$set(row, 'salesProfit', data.salesProfit)
            this.changeTableList()
          }
        })
      } else {
        this.$set(row, 'discount', undefined)
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
        this.$set(row, 'salesCost', undefined)
        this.$set(row, 'salesProfit', undefined)
      }
    },
    handleAddBtn() {
      const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.salesQuotationProductType = '1'
          item.remarks = ''
        })
        this.tableList.push(...rows)
        this.changeTableList()
      }
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.comTableList)
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.changeExpectedDeliveryDate()
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d[this.rowIdKey])
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item[this.rowIdKey])) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        const delArr = this.tableList.map((item) => item[this.rowIdKey])
        vm.selected = vm.selected.filter((item) => !delArr.includes(item[this.rowIdKey]))
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i][this.rowIdKey] === row[this.rowIdKey]) {
          return vm.selected.splice(i, 1)
        }
      }
      vm.selected.push(row)
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
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (this.modifyHighlight) {
        if (row.updateType === '1') {
          if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
            cellClass = 'edit-table-cell'
          }
        }
      }

      return cellClass
    },
    selectable(row, rowIndex) {
      if (row.isTotal === '1') {
        return false
      }
      if (row.salesOrderProductStatus !== '1') {
        return false
      }
      return true // 不禁用
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
