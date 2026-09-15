<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="addBtnDisabled"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>

      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="comSaveKey"
        :savePath="savePath"
        :columns="configCurColumn"
        :columnsInit="columns"
      ></right-toolbar>
      <div class="footer-content">
        <div>{{ $t('PURCHASE.qtyToReturn') }} : {{ $numberStr(comTotalQty, 3) }}</div>
        <div class="ml20">
          {{ $t('PURCHASE.returnedAmount') }} : {{ $numberStr(comTotalAmount, 2) }}
        </div>
      </div>
    </el-row>
    <el-table
      :key="'tableKey' + modifyHighlight"
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      v-table-tab
    >
      <el-table-column
        v-if="false"
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
        v-for="item in visibleCurColumns"
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
                'qtyToReturn',
                'returnedReason',
                'returnedType',
                isCanDealAuth ? 'returnedResult' : '',
                'returnedAmount',
                scheduledReceivedDateRequire ? 'scheduledReceivedDate' : ''
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'qtyToReturn'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qtyToReturn"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.maxQty"
                :disabled="scope.row.maxQty <= 0"
                @change="qtyChange(scope.row)"
                v-if="formData.purchaseReturnType !== '3'"
              />
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qtyToReturn"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.returnedType === '4' ? scope.row.maxQty : scope.row.maxQtyForRefund"
                :disabled="
                  (scope.row.returnedType === '4' ? scope.row.maxQty : scope.row.maxQtyForRefund) <=
                  0
                "
                @change="qtyChange(scope.row)"
                v-else
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <!-- 采购退货单-非库存产品-需要显示数量- https://www.tapd.cn/tapd_fe/53232180/bug/list?confId=1153232180001002068&dialog_preview_id=bug_1153232180001038364 -->
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'orderStockInQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'balanceQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'dropShippingReceivedQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'dropShippingReturnedQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template
            v-else-if="
              ['rejectedQty', 'rejectedQtyForWarehouse', 'rejectedQtyForVendor'].includes(item.prop)
            "
          >
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedAmount'">
            <template v-if="!comDisFrom && editAuth">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.returnedAmount"
                controls-position="right"
                :precision="2"
                :min="0"
                :max="999999999999.99"
                @change="returnedAmountChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'returnedReason'">
            <template v-if="!comDisFrom">
              <el-select
                style="width: 98%"
                v-model="scope.row.returnedReason"
                placeholder=""
                @change="returnedReasonChange(scope.row)"
              >
                <el-option
                  v-for="dict in dict.type.purchase_returned_reason"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <template v-else-if="item.prop === 'returnedType'">
            <template v-if="!comDisFrom">
              <el-select
                style="width: 98%"
                v-model="scope.row.returnedType"
                placeholder=""
                @change="returnedTypeChange(scope.row)"
              >
                <!-- :disabled="formData.purchaseReturnType === '3'" -->
                <el-option
                  v-for="dict in returnedTypeFilterList.filter((x) => {
                    if (scope.row.isPhantom === '1') return x.dictValue === '2'
                    return true
                  })"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <template v-else-if="item.prop === 'returnedResult'">
            <template v-if="isCanDealAuth">
              <el-select
                style="width: 98%"
                v-model="scope.row.returnedResult"
                placeholder=""
                @change="returnedResultChange(scope.row)"
              >
                <el-option
                  v-for="dict in (dict.type.purchase_returned_type || []).filter(
                    (item) => item.value !== '4'
                  )"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <div
            v-else-if="item.prop === 'scheduledReceivedDate'"
            :class="{ 'left-star': isCanDealAuth && scope.row.returnedResult === '3' }"
          >
            <template
              v-if="
                (isCanDealAuth && scope.row.returnedResult === '3') ||
                (scope.row.returnedType === '3' && !comDisFrom)
              "
            >
              <el-date-picker
                v-model="scope.row.scheduledReceivedDate"
                :picker-options="timeDatePickerOptions"
                @change="changeExpectedDeliveryDate(scope.$index, scope.row)"
                :format="fmtForYmd"
                value-format="timestamp"
                style="width: 98%"
                placeholder=""
                clearable
              ></el-date-picker>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </div>

          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'purchaseUom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="addBtnShow"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <selectProductTable :formData="formData" ref="selectProductTable" @onSuccess="updateTable" />
    <selectConsignmentProductTable
      :formData="formData"
      ref="selectConsignmentProductTable"
      @onSuccess="updateTable"
    />
    <selectDropShippingPOProductTable
      :formData="formData"
      ref="selectDropShippingPOProductTable"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from '../components/selectProductTable'
import selectConsignmentProductTable from '../components/selectConsignmentProductTable'
import selectDropShippingPOProductTable from '../components/selectDropShippingPOProductTable'

export default {
  mixins: [pageMixin],
  dicts: ['purchase_returned_reason', 'purchase_returned_type'],
  components: {
    selectProductTable,
    selectConsignmentProductTable,
    selectDropShippingPOProductTable
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
    isCanDealAuth: {
      type: Boolean,
      default: false
    },
    productList: {
      type: Array,
      default() {
        return []
      }
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
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || {}
        if (this.totalForm.purchaseReturnType === '2') {
          this.columns = this.columns2
        } else if (this.totalForm.purchaseReturnType === '3') {
          this.columns = this.columns3
        }
      }
    },
    'formData.purchaseReturnProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.purchaseReturnProductList
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    },
    isCanDealAuth: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '16',
      savePath: 'PROTable',
      activeName: '1',
      columns: [
        {
          prop: 'purchaseReturnProductTypeShowStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
          fixed: true,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'orderStockInQty',
          label: vm.$t('PURCHASE.receivedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PURCHASE.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PURCHASE.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('PURCHASE.balanceQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('PURCHASE.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'returnedType',
          propBy: 'returnedTypeShowStr',
          label: vm.$t('PURCHASE.RMAType'),
          visible: true,
          minWidth: 140,
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
          prop: 'returnedResult',
          propBy: 'returnedResultShowStr',
          label: vm.$t('PURCHASE.result'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        // {
        //   prop: 'scheduledReceivedDate',
        //   label: vm.$t('PURCHASE.estimatedReceiptDate'),
        //   visible: true,
        //   fixedWidth: 180,
        //   tooltip: true
        // },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],

      columns2: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
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
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'orderStockInQty',
          label: vm.$t('PURCHASE.receivedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PURCHASE.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PURCHASE.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('PURCHASE.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('PURCHASE.balanceQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('PURCHASE.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          visible: true,
          minWidth: 140,
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
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],

      columns3: [
        {
          prop: 'deliveryOrderNo',
          label: vm.$t('PURCHASE.deliveryOrderNo1'),
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
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'alias',
          label: vm.$t('PRODUCT.alias'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'dropShippingReceivedQty',
          label: vm.$t('PURCHASE.qtyAck1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'dropShippingReturnedQty',
          label: vm.$t('PURCHASE.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQtyForWarehouse',
          label: vm.$t('PURCHASE.returnedQtyWarehouse'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQtyForVendor',
          label: vm.$t('PURCHASE.returnedQtySupplier'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedType',
          propBy: 'returnedTypeShowStr',
          label: vm.$t('PURCHASE.RMAType'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('PURCHASE.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('PURCHASE.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('PURCHASE.returnReason'),
          visible: true,
          minWidth: 140,
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
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
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
      rowIdKey: 'rowProductId', // productId 拼接 productCheckStatus
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      // RMA类型
      returnedTypeList: []
    }
  },
  computed: {
    returnedTypeFilterList() {
      // 采购直运退货时不显示 退换
      if (this.formData.purchaseReturnType === '3') {
        return this.returnedTypeList.filter((x) => x.dictValue !== '3') || []
      }
      // 采购退货时不显示 拒收
      return this.returnedTypeList.filter((x) => x.dictValue !== '4') || []
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      return true
    },
    addBtnDisabled() {
      if (this.formData.purchaseReturnType === '3') {
        return !this.formData.purchaseOrderId
      }
      if (this.formData.purchaseReturnType === '2') {
        return !this.formData.consignmentOrderId || !this.formData.warehouseId
      }
      return !this.formData.purchaseOrderId || !this.formData.warehouseId
    },
    comSaveKey() {
      const type = this.formData.purchaseReturnType || '1'
      return `16${type}`
    },
    comTotalAmount() {
      let value = 0
      this.tableList.forEach((item) => {
        if (item.returnedAmount) {
          value += item.returnedAmount
        }
      })
      return value
    },
    comTotalQty() {
      let value = 0
      this.tableList.forEach((item) => {
        if (item.qtyToReturn) {
          value += item.qtyToReturn
        }
      })
      return value
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:editReturnedAmount'])
    },
    scheduledReceivedDateRequire() {
      if (this.tableList.length <= 0) return false
      return this.tableList.find((x) => {
        return (
          (this.isCanDealAuth && x.returnedResult === '3') ||
          (x.returnedType === '3' && !this.comDisFrom)
        )
      })
    },
    configCurColumn() {
      let arr = [...this.columns]
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    visibleCurColumns() {
      let arr = this.columns.filter((column) => column.visible === true)
      if (this.tableList.length <= 0) {
        arr = arr.filter((x) => x.prop !== 'costProjectCode')
      } else {
        const flag = this.tableList.some((x) => x.costProjectCode)
        if (!flag) {
          arr = arr.filter((x) => x.prop !== 'costProjectCode')
        }
      }
      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    }
  },
  created() {
    this.$$initColumnVisible('161', this.columns)
    this.$$initColumnVisible('162', this.columns2)
    this.$$initColumnVisible('163', this.columns3)
    this.MyDictDataClass.getDictFn('purchase_returned_type').then((res) => {
      this.returnedTypeList = res || []
    })
  },
  methods: {
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'qtyToReturn':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'returnedAmount':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'returnedReason':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'returnedType':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'returnedResult':
            item.fixedWidth = vm.isCanDealAuth ? 160 : undefined
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
    errorMessage(code) {
      // this.tableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })

      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          if (code === 'scheduledReceivedDate') {
            if (item.returnedType === '3') {
              this.$set(item, 'ROW-ERROR', true)
              this.$set(item, code + 'Error', true)
              if (!this.$resultOfBoolean(rowIndex)) {
                rowIndex = index
              }
            }
          } else {
            this.$set(item, 'ROW-ERROR', true)
            this.$set(item, code + 'Error', true)
            if (!this.$resultOfBoolean(rowIndex)) {
              rowIndex = index
            }
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
    },

    qtyChange(row) {
      this.$set(row, 'qtyToReturnError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.getLineTotal(row)
    },
    returnedAmountChange(row) {
      this.$set(row, 'returnedAmountError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    returnedReasonChange(row) {
      this.$set(row, 'returnedReasonError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qtyToReturn) && this.$resultOfBoolean(row.averageUnitPrice)) {
          const returnedAmount = row.averageUnitPrice * row.qtyToReturn
          this.$set(row, 'returnedAmount', returnedAmount)
          this.$set(row, 'returnedAmountError', false)
          this.$set(row, 'ROW-ERROR', false)
        } else {
          this.$set(row, 'returnedAmount', undefined)
        }
      })
    },
    changeExpectedDeliveryDate(index, row) {
      if (row) {
        this.$set(row, 'scheduledReceivedDateError', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      // if (index === 0) {
      //   const topRow = this.tableList[0]
      //   if (topRow && topRow.scheduledReceivedDate) {
      //     const oldExpectedDeliveryDate = this.tableList.find(
      //       (item, index) => index > 0 && item.scheduledReceivedDate
      //     )
      //     if (oldExpectedDeliveryDate) {
      //       const msg = this.parseTime(topRow.scheduledReceivedDate, this.fmtForYmd)
      //       this.$modal
      //         .confirm(this.$t('PURCHASE.committedDateConfirm').replace('$1', msg))
      //         .then(() => {
      //           this.tableList.forEach((row) => {
      //             this.$set(row, 'scheduledReceivedDate', topRow.scheduledReceivedDate)
      //           })
      //         })
      //     } else {
      //       this.tableList.forEach((row) => {
      //         this.$set(row, 'scheduledReceivedDate', topRow.scheduledReceivedDate)
      //       })
      //     }
      //   }
      // }
    },
    returnedTypeChange(row) {
      this.$set(row, 'returnedTypeError', false)
      this.$set(row, 'ROW-ERROR', false)

      const { returnedResult } = row
      if (!returnedResult || returnedResult !== '3') {
        this.$set(row, 'scheduledReceivedDate', undefined)
        this.$set(row, 'scheduledReceivedDateError', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      if (this.formData.purchaseReturnType === '3') {
        this.$set(row, 'qtyToReturn', undefined)
        this.qtyChange(row)
      }
    },
    returnedResultChange(row) {
      this.$set(row, 'returnedResultError', false)
      this.$set(row, 'ROW-ERROR', false)

      const { returnedResult } = row
      if (!returnedResult || returnedResult !== '3') {
        this.$set(row, 'scheduledReceivedDate', undefined)
        this.$set(row, 'scheduledReceivedDateError', false)
        this.$set(row, 'ROW-ERROR', false)
      }
    },
    handleAddBtn() {
      if (this.formData.purchaseReturnType === '3') {
        this.$refs.selectDropShippingPOProductTable.handleAdd(this.tableList)
      } else if (this.formData.purchaseReturnType === '2') {
        this.$refs.selectConsignmentProductTable.handleAdd(this.tableList)
      } else {
        this.$refs.selectProductTable.handleAdd(this.tableList)
      }
    },

    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          if (this.formData.purchaseReturnType === '3') {
            // item.returnedType = '2'
            item.returnedType = '4'
            item.returnedReason = ''
          }
          item.remarks = ''
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
      if (row['ROW-ERROR']) {
        color = 'required-row'
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
      if (
        this.tableList.find((item) => !item[column.property] && item[column.property + 'Error'])
      ) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    selectable(row, rowIndex) {
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
