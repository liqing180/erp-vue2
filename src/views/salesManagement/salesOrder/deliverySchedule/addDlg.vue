<template>
  <el-dialog
    v-dialogDrag
    v-dialogDragWidth
    :title="dlgTitle"
    :visible.sync="visible"
    width="1140px"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <el-table
      border
      ref="tables"
      :data="tableList"
      row-key="rowTimeId"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      v-loading="loading"
      v-table-tab
    >
      <!-- <el-table-column
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
      </el-table-column> -->

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
        <template slot="header" slot-scope="{ column }">
          <span
            v-if="
              [
                'productName',
                'arrivalDate',
                'plannedQtyForBasic',
                'sourceType',
                'shipFrom'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <span v-if="!!scope.row.deliveryScheduleDetailId">{{ scope.row.productName }}</span>
            <CommonSelect
              v-else
              style="width: 98%"
              :id="scope.row.productId"
              :label="scope.row.productName"
              idKey="productId"
              labelKey="productName"
              filterable
              :options="canSelectProductList"
              @change="productNameChange($event, scope.row)"
            />
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'balanceQtyForBasic'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'arrivalDate'">
            <my-date-picker
              v-model="scope.row.arrivalDate"
              :picker-options="timeDatePickerOptions"
              @change="changeArrivalDate(scope.row, scope.$index)"
              :format="fmtForYmdhm"
              type="datetime"
              value-format="timestamp"
              :default-time="getCurrentTime()"
              style="width: 98%"
              placeholder=""
              clearable
            ></my-date-picker>
            <div
              style="
                color: #ff4949;
                font-size: 12px;
                line-height: 13px;
                padding: 3px 0;
                text-align: left;
                white-space: normal;
                word-break: normal;
              "
              v-if="scope.row.arrivalDate && scope.row.arrivalDate < curTimer"
            >
              {{ $t('SALES.arrivalDateErr') }}
            </div>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'plannedQtyForBasic'">
            <el-input-number
              :key="scope.row.rowTimeId + scope.row.productId"
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              style="width: 98%"
              v-model="scope.row.plannedQtyForBasic"
              controls-position="right"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
              :max="scope.row.maxQty || 0"
              :disabled="scope.row.maxQty <= 0 || !scope.row.productId"
              @change="plannedQtyChange(scope.row)"
            />
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'sourceType'">
            <el-select
              style="width: 98%"
              v-model="scope.row.sourceType"
              placeholder=""
              @change="sourceTypeChange(scope.row)"
            >
              <el-option
                v-for="dict in dict.type.delivery_schedule_source_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'shipFrom'">
            <template v-if="scope.row.sourceType === 'Supplier'">{{
              $t('SALES.dropShip')
            }}</template>
            <template
              v-else-if="!(scope.row.isPhantom === '1' && scope.row.nonInventoryItem === '1')"
            >
              <CommonSelect
                style="width: 98%"
                :id="scope.row.warehouseId"
                :label="scope.row.warehouseName"
                idKey="warehouseId"
                labelKey="warehouseName"
                filterable
                :options="scope.row.warehouseList || []"
                @change="warehouseNameChange($event, scope.row)"
                :disabled="!scope.row.sourceType || !scope.row.productId"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
          </template>
          <template v-else-if="item.prop === 'transitTimeForDay'">
            <template v-if="scope.row.sourceType === 'Supplier'">{{
              $numberStr(scope.row.transitTimeForDayForDropShip, 0)
            }}</template>
            <template v-if="scope.row.sourceType === 'Warehouse'">{{
              $numberStr(scope.row.transitTimeForDayForWarehouse, 0)
            }}</template>
          </template>
          <template v-else-if="item.prop === 'shippedDate'">
            {{ parseTime(scope.row.shippedDate, fmtForYmdhm) }}
          </template>

          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isEdit"
        :label="$t('ui.action')"
        width="140"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <div class="icon-box">
            <i
              class="el-icon-document-copy primary-pointer"
              style="font-size: 24px; border: none; margin-right: 5px"
              :title="$t('SALES.copy')"
              @click="copyRow(scope.row, scope.$index)"
            ></i>
            <i
              class="el-icon-circle-plus primary-pointer"
              style="font-size: 24px; border: none; margin-right: 5px"
              :title="$t('uiBtn.add')"
              @click.stop="addRow(scope.$index)"
            ></i>
            <i
              v-if="tableList.length > 1"
              class="el-icon-remove"
              :title="$t('uiBtn.delete')"
              style="font-size: 24px; border: none; color: #f56c6c"
              @click.stop="delRow(scope.$index)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>

      <el-button
        type="primary"
        v-if="showSubmitBtn"
        :loading="fullscreenLoading"
        :disabled="isOverflowQty"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import {
  submitDeliverySchedule,
  queryCanSelectProductList,
  queryProductOtherMsg,
  queryDeliveryScheduleDetailMsg,
  updateDeliveryScheduleDetail,
  calculateShippedDate
} from '@/api/salesManagement/salesOrder'
import pageMixin from '@/mixins/tableMinx'
export default {
  mixins: [pageMixin],
  dicts: ['delivery_schedule_source_type'],
  components: {},
  props: {},
  data() {
    const vm = this

    return {
      dlgTitle: undefined,
      saveKey: '3',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'balanceQtyForBasic',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 120,
          tooltip: true
        },
        {
          prop: 'arrivalDate',
          label: vm.$t('SALES.arrivalDate'),
          visible: true,
          width: 190,
          tooltip: true
        },
        {
          prop: 'shippedDate',
          label: vm.$t('SALES.PlannedShippingDate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'plannedQtyForBasic',
          label: vm.$t('SALES.plannedQTY'),
          visible: true,
          minWidth: 130,
          tooltip: true
        },
        {
          prop: 'sourceType',
          label: vm.$t('SALES.sourceType'),
          visible: true,
          minWidth: 150,
          tooltip: true
        },
        {
          prop: 'shipFrom',
          label: vm.$t('SALES.shipFrom'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'transitTimeForDay',
          label: vm.$t('SALES.transitTime'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      loading: false,
      visible: false,
      isEdit: false,
      isCanUpdate: false,
      tableList: [],
      canSelectProductList: [],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },

      fullscreenLoading: false,
      form: {},
      PickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date() - 90 * 24 * 60 * 60 * 1000
          )
        }
      },
      salesOrderId: undefined,
      curTimer: Date.now()
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmdhm() {
      return this.$store.getters.fmtForYmdhm
    },

    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    showSubmitBtn() {
      if (this.isEdit) {
        return this.isCanUpdate === '1'
      }
      return true
    },
    isOverflowQty() {
      return this.tableList.some((item) => item.isOverflowQty === 1)
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getCurrentTime() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    handleAdd(salesOrderId, expirationDate) {
      this.isEdit = false
      this.dlgTitle = this.$t('SALES.addSchedule')
      this.salesOrderId = salesOrderId
      if (expirationDate) {
        this.expirationDate = this.appointTime(expirationDate, '23:59:59')
      } else {
        this.expirationDate = undefined
      }

      this.reset()
      this.tableList = [{ rowTimeId: Date.now(), sourceType: 'Supplier' }]
      this.visible = true
      this.queryCanSelectProductList()
      this.curTimer = Date.now()
    },
    handleEdit(row) {
      this.dlgTitle = this.$t('SALES.editSchedule')
      this.isEdit = true
      this.isCanUpdate = false
      this.visible = true
      this.tableList = []
      queryDeliveryScheduleDetailMsg({
        deliveryScheduleDetailId: row.deliveryScheduleDetailId
      }).then((res) => {
        const data = res.data || {}
        this.isCanUpdate = data.isCanUpdate

        if (data.sourceType === 'Warehouse') {
          data.transitTimeForSecondForWarehouse = data.transitTimeForSecond
          data.transitTimeForDayForWarehouse = data.transitTimeForDay
        } else {
          data.transitTimeForSecondForWarehouse = data.transitTimeForSecondForDropShip
          data.transitTimeForDayForWarehouse = data.transitTimeForDayForDropShip
        }
        if (data.deliveryScheduleDetailId) {
          this.tableList = [{ ...data }]
        }
      })
    },
    queryCanSelectProductList() {
      queryCanSelectProductList({ salesOrderId: this.salesOrderId }).then((res) => {
        const list = res.data || []
        this.canSelectProductList = list
      })
    },
    copyRow(row, index) {
      const vm = this
      const tObj = JSON.parse(JSON.stringify(row))
      delete tObj.id
      tObj.rowTimeId = Date.now()
      vm.tableList.splice(index + 1, 0, tObj)
    },
    addRow(index) {
      const vm = this
      const addRow = { rowTimeId: Date.now(), sourceType: 'Supplier' }
      vm.tableList.splice(index + 1, 0, addRow)
    },

    delRow(index) {
      this.tableList.splice(index, 1)
      this.overflowQtyTableList()
    },
    reset() {
      this.tableList = []
    },
    back() {
      this.visible = false
      this.closed()
    },
    closed() {
      this.fullscreenLoading = false
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (row['ROW-ERROR']) {
        color = 'required-row'
      }
      return color
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      if (column.property === 'plannedQtyForBasic' && row.isOverflowQty === 1) {
        cellClass += ' is-overflow-row'
      }
      return cellClass
    },
    productNameChange(data, row) {
      this.$set(row, 'productNameError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.$set(row, 'salesOrderServiceId', data.salesOrderServiceId)
      this.$set(row, 'productId', data.productId)
      this.$set(row, 'productMainId', data.productMainId)
      this.$set(row, 'productName', data.productName)
      this.$set(row, 'internalPartNo', data.internalPartNo)
      this.$set(row, 'balanceQtyForBasic', data.balanceQtyForBasic)
      this.$set(row, 'decimalNum', data.decimalNum)
      this.$set(row, 'includeDecimal', data.includeDecimal)
      this.$set(row, 'plannedQtyForBasic', data.plannedQtyForBasic)

      this.$set(row, 'productType', data.productType)
      this.$set(row, 'maxQty', data.maxQty)
      this.$set(row, 'orderQtyForBasic', data.orderQtyForBasic)
      this.$set(row, 'partNo', data.partNo)
      this.$set(row, 'salesOrderId', data.salesOrderId)
      this.$set(row, 'salesOrderNo', data.salesOrderNo)
      this.$set(row, 'salesOrderProductId', data.salesOrderProductId)
      this.$set(row, 'salesPartId', data.salesPartId)
      this.$set(row, 'salesPartNo', data.salesPartNo)
      this.$set(row, 'uom', data.uom)
      this.$set(row, 'uomCoefficient', data.uomCoefficient)
      this.$set(row, 'isPhantom', data.isPhantom)
      this.$set(row, 'nonInventoryItem', data.nonInventoryItem)

      this.$set(row, 'transitTimeForSecondForDropShip', undefined)
      this.$set(row, 'transitTimeForDayForDropShip', undefined)
      this.$set(row, 'transitTimeForSecondForWarehouse', undefined)
      this.$set(row, 'transitTimeForDayForWarehouse', undefined)
      this.$set(row, 'transitTimeForSecond', undefined)
      this.$set(row, 'transitTimeForDay', undefined)
      this.$set(row, 'warehouseList', undefined)
      this.$set(row, 'warehouseId', undefined)
      this.$set(row, 'warehouseName', undefined)
      this.$set(row, 'isOverflowQty', 0)
      this.$nextTick(() => {
        this.tableList.forEach((item) => {
          this.overflowQtyTableList(item, false)
        })
      })

      this.queryProductOtherMsg(row)
    },
    queryProductOtherMsg(row) {
      const timer = Date.now()
      row.queryTimer = timer
      if (!row.productId) {
        return
      }
      queryProductOtherMsg({ salesOrderId: this.salesOrderId, productId: row.productId }).then(
        (res) => {
          if (row.queryTimer !== timer) return
          const data = res.data || {}
          this.$set(row, 'transitTimeForSecondForDropShip', data.transitTimeForSecondForDropShip)
          this.$set(row, 'transitTimeForDayForDropShip', data.transitTimeForDayForDropShip)
          this.$set(row, 'warehouseList', data.warehouseList || [])
          const defaultRow = row.warehouseList.find((i) => i.isDefault === '1')
          if (defaultRow && !(row.isPhantom === '1' && row.nonInventoryItem === '1')) {
            this.warehouseNameChange(defaultRow, row)
          }
        }
      )
    },
    changeArrivalDate(row, index) {
      this.$set(row, 'arrivalDateError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.arrivalDate && this.expirationDate && row.arrivalDate > this.expirationDate) {
        const dateStr = this.parseTime(this.expirationDate, this.fmtForYmd)
        this.$modal.msgWarning(this.$t('SALES.expirationDateTip').replace('$1', dateStr))
      }
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.arrivalDate) {
          this.tableList.forEach((row) => {
            this.$set(row, 'arrivalDateError', false)
            this.$set(row, 'ROW-ERROR', false)
            this.$set(row, 'arrivalDate', topRow.arrivalDate)
          })
        }
      }
      if (row.arrivalDate) {
        this.$set(row, 'shippedDate', undefined)
        this.calculateShippedDate()
      } else {
        this.$set(row, 'shippedDate', undefined)
      }
    },
    // 计算计划发货时间
    calculateShippedDate() {
      let params = {
        salesOrderId: this.salesOrderId,
        deliveryScheduleDetailList: this.tableList
      }
      params = this.$trimOfObj(JSON.parse(JSON.stringify(params)))
      params.deliveryScheduleDetailList.forEach((item) => {
        if (item.sourceType === 'Warehouse') {
          item.transitTimeForSecond = item.transitTimeForSecondForWarehouse
          item.transitTimeForDay = item.transitTimeForDayForWarehouse
        } else {
          item.transitTimeForSecond = item.transitTimeForSecondForDropShip
          item.transitTimeForDay = item.transitTimeForDayForDropShip
          delete item.warehouseId
          delete item.warehouseName
        }
      })
      calculateShippedDate(params)
        .then((res) => {
          const { deliveryScheduleDetailList } = res.data
          this.tableList = deliveryScheduleDetailList || []
          this.tableList.forEach((row) => {
            this.overflowQtyTableList(row, false)
          })
        })
        .catch(() => {})
    },
    plannedQtyChange(row) {
      this.$set(row, 'plannedQtyForBasicError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.overflowQtyTableList(row)
    },
    overflowQtyTableList(data = {}, isShowMsg = true) {
      const val = this.tableList || []
      const groupMap = {}

      val.forEach((row) => {
        const productKey = row.productId
        if (!productKey) return

        if (!groupMap[productKey]) {
          groupMap[productKey] = {
            rows: [],
            maxQty: Number(row.maxQty) || 0,
            totalQty: 0
          }
        }

        const item = groupMap[productKey]
        item.rows.push(row)
        item.totalQty += Number(row.plannedQtyForBasic) || 0
      })
      let flag = false
      Object.values(groupMap).forEach((item) => {
        const isOverflow = item.totalQty > item.maxQty
        if (isOverflow && data.productId && data.productId === item.rows[0].productId) {
          flag = true
        }
        item.rows.forEach((row) => {
          this.$set(row, 'isOverflowQty', isOverflow ? 1 : 0)
        })
      })
      if (flag && isShowMsg) {
        this.$modal.msgError(this.$t('SALES.overflowQtyTip'))
      }
    },
    sourceTypeChange(row) {
      this.$set(row, 'sourceTypeError', false)
      this.$set(row, 'shipFromError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (this.tableList.some((x) => x.arrivalDate)) {
        this.calculateShippedDate()
      }
    },
    warehouseNameChange(data, row) {
      this.$set(row, 'shipFromError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$set(row, 'warehouseId', data.warehouseId)
      this.$set(row, 'warehouseName', data.warehouseName)
      this.$set(row, 'transitTimeForSecondForWarehouse', data.transitTimeForSecond)
      this.$set(row, 'transitTimeForDayForWarehouse', data.transitTimeForDay)
      if (this.tableList.some((x) => x.arrivalDate)) {
        this.calculateShippedDate()
      }
    },
    async submitForm() {
      const vm = this
      const list = this.tableList
      const productNameReq = list.find((item) => {
        return !this.$resultOfBoolean(item.productName)
      })
      if (productNameReq) {
        this.errorMessage('productName')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.productName')))
        return
      }
      const arrivalDateReq = list.find((item) => {
        return !this.$resultOfBoolean(item.arrivalDate)
      })
      if (arrivalDateReq) {
        this.errorMessage('arrivalDate')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.arrivalDate')))
        return
      }
      const arrivalDateLess = list.find((item) => {
        return item.arrivalDate < this.curTimer
      })
      if (arrivalDateLess) {
        this.$modal.msgError(this.$t('SALES.arrivalDateErr'))
        return
      }
      const plannedQtyReq = list.find((item) => {
        return !this.$resultOfBoolean(item.plannedQtyForBasic)
      })
      if (plannedQtyReq) {
        this.errorMessage('plannedQtyForBasic')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.plannedQTY')))
        return
      }
      const sourceTypeReq = list.find((item) => {
        return !this.$resultOfBoolean(item.sourceType)
      })
      if (sourceTypeReq) {
        this.errorMessage('sourceType')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.sourceType')))
        return
      }
      const warehouseNameReq = list.find((item) => {
        return (
          !this.$resultOfBoolean(item.warehouseName) &&
          item.sourceType === 'Warehouse' &&
          !(item.isPhantom === '1' && item.nonInventoryItem === '1')
        )
      })
      if (warehouseNameReq) {
        this.errorMessage('shipFrom')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.shipFrom')))
        return
      }
      if (this.isEdit) {
        let params = this.tableList[0]
        params = this.$trimOfObj(JSON.parse(JSON.stringify(params)))
        if (params.sourceType === 'Warehouse') {
          params.transitTimeForSecond = params.transitTimeForSecondForWarehouse
          params.transitTimeForDay = params.transitTimeForDayForWarehouse
        } else {
          params.transitTimeForSecond = params.transitTimeForSecondForDropShip
          params.transitTimeForDay = params.transitTimeForDayForDropShip
          delete params.warehouseId
          delete params.warehouseName
        }
        this.$modal
          .confirm(this.$t('ui.submitPageConfirm'))
          .then(() => {
            vm.fullscreenLoading = true
            return updateDeliveryScheduleDetail(params)
          })
          .then(() => {
            vm.$emit('submitSuccess')
            this.back()
            this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
            vm.fullscreenLoading = false
          })
          .catch(() => {
            vm.fullscreenLoading = false
          })
      } else {
        let params = {
          salesOrderId: this.salesOrderId,
          deliveryScheduleDetailList: this.tableList
        }
        params = this.$trimOfObj(JSON.parse(JSON.stringify(params)))
        params.deliveryScheduleDetailList.forEach((item) => {
          if (item.sourceType === 'Warehouse') {
            item.transitTimeForSecond = item.transitTimeForSecondForWarehouse
            item.transitTimeForDay = item.transitTimeForDayForWarehouse
          } else {
            item.transitTimeForSecond = item.transitTimeForSecondForDropShip
            item.transitTimeForDay = item.transitTimeForDayForDropShip
            delete item.warehouseId
            delete item.warehouseName
          }
        })
        let confirmMsg = this.$t('ui.submitPageConfirm')
        let isErr = false
        if (vm.fullscreenLoading) return
        vm.fullscreenLoading = true
        await submitDeliverySchedule({ ...params, isOnlyValidate: '1' })
          .then((res) => {
            const data = res.data || {}
            const checkTipsVO = data.checkTipsVO || {}
            /* noEnoughInventoryPRStatus
             * 1.PR 尚未发起询价
             * 2.PR 已发起询价，或者询价单已报价尚未关联采购订单
             * 3.PR 已关联采购订单(状态 = 待提交、审批中、待收货、部分收货、已完成、已关闭、已作废)
             */
            if (checkTipsVO.noEnoughInventoryPRStatus === '2') {
              confirmMsg = this.$t('SALES.deliveryScheduleConfirm').replace(
                '$1',
                checkTipsVO.productNames
              )
              params.haveRFQNeedContinue = '1'
            } else if (checkTipsVO.noEnoughInventoryPRStatus === '3') {
              this.$modal.msgError(
                this.$t('SALES.deliveryScheduleErrTip').replace('$1', checkTipsVO.productNames)
              )
              isErr = true
              vm.fullscreenLoading = false
            }
          })
          .catch(() => {
            isErr = true
            vm.fullscreenLoading = false
          })
        if (isErr) return
        function submitFN() {
          vm.fullscreenLoading = true
          submitDeliverySchedule(params)
            .then((res) => {
              vm.fullscreenLoading = false
              const data = res.data || {}
              const checkTipsVO = data.checkTipsVO || {}
              if (checkTipsVO.noEnoughInventoryPRStatus === '2') {
                confirmMsg = vm
                  .$t('SALES.deliveryScheduleConfirm')
                  .replace('$1', checkTipsVO.productNames)
                params.haveRFQNeedContinue = '1'
                vm.$modal
                  .confirm(confirmMsg)
                  .then(() => {
                    submitFN()
                  })
                  .catch(() => {
                    vm.fullscreenLoading = false
                  })
              } else if (checkTipsVO.noEnoughInventoryPRStatus === '3') {
                vm.$modal.msgError(
                  vm.$t('SALES.deliveryScheduleErrTip').replace('$1', checkTipsVO.productNames)
                )
              } else {
                vm.$emit('submitSuccess')
                vm.back()
                vm.$modal.msgSuccess(vm.$t('ui.submitPageSuccess'))
              }
            })
            .catch(() => {
              vm.fullscreenLoading = false
            })
        }
        vm.$modal
          .confirm(confirmMsg)
          .then(() => {
            submitFN()
          })
          .catch(() => {
            vm.fullscreenLoading = false
          })
      }
    },
    errorMessage(code) {
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          if (code === 'shipFrom') {
            if (
              !this.$resultOfBoolean(item.warehouseName) &&
              item.sourceType === 'Warehouse' &&
              !(item.isPhantom === '1' && item.nonInventoryItem === '1')
            ) {
              this.$set(item, 'ROW-ERROR', true)
              this.$set(item, code + 'Error', true)
            }
          } else {
            this.$set(item, 'ROW-ERROR', true)
            this.$set(item, code + 'Error', true)
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
      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  margin-bottom: 20px;
}
</style>
