<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
        <el-button
          type="primary"
          size="mini"
          :disabled="selected.length <= 0"
          v-if="transferBtnShow"
          @click="handleTransfer"
          >{{ $t('SALES.transfer') }}
        </el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="selected.length <= 0"
          v-if="purchaseBtnShow"
          @click="handlePurchase"
          >{{ $t('SALES.purchase') }}
        </el-button>
      </el-col>

      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
      <!-- <div class="footer-content">
        <div>{{ $t('SALES.productQTY') }} / {{ $t('SALES.quoted') }}</div>
        ：
        <div>
          {{ tableList.length }} / {{ tableList.filter((o) => o.purchaseQuotationNo).length }}
        </div>
      </div> -->
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      v-table-tab
      class="hide-check-all"
    >
      <el-table-column
        :selectable="selectable"
        type="selection"
        key="selection"
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
        class-name="allowDrag"
      >
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
        <template slot="header" slot-scope="{ column }">
          <span
            v-if="
              [
                'qty',
                'unitPrice',
                'leadTime',
                'warranty',
                'deliveryDateForDay',
                'consignmentStartTime',
                'consignmentEndTime'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'qty'">
            <template v-if="addBtnShow && scope.row.rowTimeId">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.maxQty"
                :disabled="scope.row.maxQty <= 0"
                @change="qtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <!-- <template v-if="addBtnShow && scope.row.rowTimeId">
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
            </template> -->
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'taxAmount'">
            <el-tooltip
              :disabled="!scope.row.taxAmountProcess"
              :content="scope.row.taxAmountProcess"
              placement="top"
              effect="light"
            >
              <span class="ellipsis-text">{{ $numberStr(scope.row[item.prop], 2) }}</span>
            </el-tooltip>
          </template>

          <template v-else-if="item.prop === 'deliveryDateForDay'">
            <el-input-number
              v-if="addBtnShow && scope.row.rowTimeId"
              v-thousandSplit="{ precision: 0 }"
              style="width: 98%"
              v-model="scope.row.deliveryDateForDay"
              controls-position="right"
              :precision="0"
              :min="1"
              :max="999"
              @change="changeExpectedDeliveryDate(scope.$index)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>

          <template v-else-if="item.prop === 'consignmentStartTime'">
            <el-date-picker
              v-if="addBtnShow && scope.row.rowTimeId"
              v-model="scope.row.consignmentStartTime"
              :picker-options="consignmentStartTimePickerOptions"
              :format="fmtForYmd"
              value-format="timestamp"
              :style="{ width: '100%' }"
              placeholder=""
              clearable
              @change="consignmentStartTimeChange(scope.row)"
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>

          <template v-else-if="item.prop === 'consignmentEndTime'">
            <el-date-picker
              v-if="addBtnShow && scope.row.rowTimeId"
              :disabled="!scope.row.consignmentStartTime"
              v-model="scope.row.consignmentEndTime"
              :picker-options="{
                disabledDate(time) {
                  const currentTime = Date.now()
                  const consignmentStartTime = scope.row.consignmentStartTime
                  let maxTime = currentTime
                  if (consignmentStartTime) {
                    maxTime =
                      currentTime > consignmentStartTime + 1 * 24 * 60 * 60 * 1000
                        ? currentTime
                        : consignmentStartTime + 1 * 24 * 60 * 60 * 1000
                  }
                  return time.getTime() < maxTime
                }
              }"
              :format="fmtForYmd"
              value-format="timestamp"
              :style="{ width: '100%' }"
              placeholder=""
              clearable
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>

          <template v-else-if="item.prop === 'warranty'">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="addBtnShow && scope.row.rowTimeId"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              :min="1"
              :max="9999"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="!(addBtnShow && scope.row.rowTimeId)"
            />
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'documentReservedQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'stockOutQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'ackQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'consignmentStockOutQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'settledQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        :fixed="false"
        v-if="addBtnShow"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              v-if="!scope.row.salesOrderProductId"
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <selectConsignmentProductTable
      :formData="formData"
      ref="selectProductTable"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectConsignmentProductTable from '../components/selectConsignmentProductTable'
import { queryAllTaxForSales } from '@/api/system/tax'
import { calculateOneDetail } from '@/api/salesManagement/salesInquiry'
import {
  consignmentAddProductToTO,
  consignmentAddProductToPO
} from '@/api/salesManagement/salesOrder'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type', 'tax_type'],
  components: {
    selectConsignmentProductTable
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
    buttonAuthMsg: {
      type: Object,
      default() {
        return {}
      }
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
    addBtnShow: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '25',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          fixed: true,
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
          minWidth: 200,
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'brand',
          label: vm.$t('PRODUCT.brand'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
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
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'documentReservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'stockOutQty',
          label: vm.$t('PRODUCT.outboundQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'ackQty',
          label: vm.$t('PRODUCT.qtyAck'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'consignmentStockOutQty',
          label: vm.$t('menu.consignmentPickUp'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'settledQty',
          label: vm.$t('SALES.settledQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
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
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },

        {
          prop: 'taxAmount',
          label: vm.$t('SALES.taxAmount'),
          visible: true,
          minWidth: 140,
          // tooltip: true,
          padding: 50,
          align: 'right'
        },
        /* {
          prop: 'warranty',
          label: vm.$t('SALES.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }, */
        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'consignmentStartTime',
          label: vm.$t('SALES.consignmentStart'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'consignmentEndTime',
          label: vm.$t('SALES.consignmentEnd'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'salesOrderProductStatusShowStr',
          label: vm.$t('ui.status'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'transportationStrategyShowStr',
          label: vm.$t('SALES.transportationStrategy'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      consignmentStartTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },

      totalForm: {},
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'salesPartId',
      reQuoteLoading: false,
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      return this.transferBtnShow || this.purchaseBtnShow
    },
    disInQuotation() {
      return this.formData.salesInquiryStatus === '4'
    },
    transferBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:transfer']) &&
        this.buttonAuthMsg.isCanConsignmentTOProduct === '1'
      )
    },
    purchaseBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:purchase']) &&
        this.buttonAuthMsg.isCanConsignmentPOProduct === '1'
      )
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    back() {
      this.$emit('back')
    },
    handleTransfer() {
      const valid = this.validSelectList(this.selected)
      if (!valid) {
        this.$set(this.formData, 'collapseWarningForProductInfo', true)
        return
      }
      this.$set(this.formData, 'collapseWarningForProductInfo', false)

      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return consignmentAddProductToTO({
            salesOrderId: this.formData.salesOrderId,
            salesOrderProductList: this.selected
          })
        })
        .then((response) => {
          this.back()
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
        })
        .catch(() => {})
    },
    handlePurchase() {
      const valid = this.validSelectList(this.selected)
      if (!valid) {
        this.$set(this.formData, 'collapseWarningForProductInfo', true)
        return
      }
      this.$set(this.formData, 'collapseWarningForProductInfo', false)
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return consignmentAddProductToPO({
            salesOrderId: this.formData.salesOrderId,
            salesOrderProductList: this.selected
          })
        })
        .then((response) => {
          this.back()
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
        })
        .catch(() => {})
    },
    validSelectList(list) {
      const valid = false
      const qtyReq = list.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const warrantyReq = list.find((item) => {
        return !this.$resultOfBoolean(item.warranty)
      })
      if (warrantyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
        )
        return valid
      }

      const deliveryDateForDayReq = list.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (deliveryDateForDayReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }

      const consignmentStartTimeReq = list.find((item) => {
        return !this.$resultOfBoolean(item.consignmentStartTime)
      })
      if (consignmentStartTimeReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.consignmentStart'))
        )
        return valid
      }

      const consignmentEndTimeReq = list.find((item) => {
        return !this.$resultOfBoolean(item.consignmentEndTime)
      })
      if (consignmentEndTimeReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.consignmentEnd'))
        )
        return valid
      }

      return true
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'qty':
            item.colMinWidth = !vm.addBtnShow ? undefined : 120
            break
          case 'warranty':
            item.colMinWidth = !vm.addBtnShow ? undefined : 120
            break
          case 'deliveryDateForDay':
            item.colMinWidth = !vm.addBtnShow ? undefined : 160
            break
          case 'consignmentStartTime':
            item.colMinWidth = !vm.addBtnShow ? undefined : 160
            break
          case 'consignmentEndTime':
            item.colMinWidth = !vm.addBtnShow ? undefined : 160
            break
          case 'remarks':
            item.fixedWidth = !vm.addBtnShow ? undefined : 200
            break
        }
      })
    },
    getList() {
      return this.tableList
    },

    qtyChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.qty
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
        this.queryRowTaxAmount(row)
      })
    },
    taxNoVisible(value, row) {
      const vm = this
      if (value) {
        const params = {
          countryId: vm.countryId,
          productId: row.productId
        }
        if (!params.countryId) {
          return
        }
        this.$set(row, 'taxLoading', true)
        queryAllTaxForSales(params)
          .then((res) => {
            const list = res.data || []
            this.$set(row, 'taxNoOptions', list)
            this.$set(row, 'taxLoading', false)
          })
          .catch((err) => {
            this.$set(row, 'taxNoOptions', [])
            this.$set(row, 'taxLoading', false)
            window.console.error(err)
          })
      }
    },
    taxNoChange(row) {
      this.queryRowTaxAmount(row)
    },
    queryRowTaxAmount(row) {
      if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
        const timer = Date.now()
        row.queryTime = timer
        row.taxRate = this.formData.taxRate
        calculateOneDetail(row).then((res) => {
          if (row.queryTime === timer) {
            const data = res.data || {}
            this.$set(row, 'lineTotal', data.lineTotal)
            this.$set(row, 'taxAmount', data.taxAmount)
            this.$set(row, 'taxAmountProcess', data.taxAmountProcess)
            this.changeTableList()
          }
        })
      } else {
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
      }
    },
    changeExpectedDeliveryDate(index) {},
    consignmentStartTimeChange(row) {
      const { consignmentStartTime, consignmentEndTime } = row
      if (consignmentEndTime && consignmentEndTime <= consignmentStartTime) {
        this.$set(row, 'consignmentEndTime', undefined)
      }
    },
    handleAddBtn() {
      const alreadyList = this.tableList.filter((item) => item.rowTimeId)
      const alreadySelectIdList = alreadyList.map((item) => item.productId)
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        const timer = Date.now()
        rows.forEach((item, index) => {
          item.remarks = ''
          item.rowTimeId = timer + index
          if (item.maxQty > 0) {
            item.qty = item.maxQty
          }
          this.getLineTotal(item)
        })

        this.tableList.push(...rows)
        this.changeTableList()
      }
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].rowTimeId === row.rowTimeId) {
            return this.selected.splice(i, 1)
          }
        }
      })
    },
    // 表格全选
    handleSelectAll(selection) {
      const vm = this
      if (selection.length) {
        // 去重添加
        const curSelectedIds = this.selected.map((d) => d.rowTimeId)
        selection.forEach((item) => {
          if (!curSelectedIds.includes(item.rowTimeId)) {
            vm.selected.push(item)
          }
        })
      } else {
        // 删除table中在selection 中缓存的内容
        vm.selected = []
      }
    },
    // 行单个选择
    handleSelectionChange(selection, row) {
      const vm = this
      for (let i = 0; i < vm.selected.length; i++) {
        if (vm.selected[i].rowTimeId === row.rowTimeId) {
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
      const cur = this.selected.find((item) => item.rowTimeId === row.rowTimeId)
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
      if (row.salesOrderProductId) {
        return false
      }
      return true // 不禁用
    },

    nav(row, type) {
      if (this.navTime && Date.now() - this.navTime < 1000) return
      this.navTime = Date.now()
      if (type === 'purchaseQuotationNo') {
        this.$router.push({
          path: '/purchaseManagement/viewPurchaseQuotation',
          query: {
            id: row.purchaseQuotationId,
            timeId: Date.now()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-content {
  float: right;
  display: flex;
  justify-content: center;
  margin-right: 20px;
  // height: 40px;
  line-height: 28px;
  font-weight: 600;
  color: #606266;
  font-size: 12px;
}
</style>
