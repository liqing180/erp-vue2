<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
      <div class="footer-content">
        <div class="ml20">{{ $t('SALES.totalQTY') }} : {{ $numberStr(comTotalQty, 3) }}</div>
      </div>
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :data="tableList"
      :row-key="rowIdKey"
      lazy
      :default-expand-all="true"
      :tree-props="{
        children: 'childProjectTemplateContentList',
        hasChildren: 'hasChildren'
      }"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      v-table-tab
    >
      <el-table-column
        v-if="false"
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
                'preQty',
                comIsDropShippingSO ? '' : 'warehouseName',
                'preUsePurchaseQtyForBasic'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'preQty'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 96%"
                v-model="scope.row.preQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="0"
                :max="scope.row.maxQty || 0"
                @change="qtyChange(scope.row)"
                :disabled="
                  scope.row.maxQty <= 0 ||
                  scope.row.preUsePurchaseQtyForBasic > 0 ||
                  formData.replenishType === '2' ||
                  scope.row.isDisabled === '1' ||
                  formData.preDeliveryNoticeType === 'Project'
                "
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />

              <!-- :disabled="
                  scope.row.maxQty <= 0 ||
                  formData.replenishType === '2' ||
                  scope.row.isDisabled === '1'"
                 -->

              <div
                style="color: #ff4949; font-size: 12px; line-height: 1"
                v-if="
                  (scope.row.maxQty <= 0 ||
                    formData.replenishType === '2' ||
                    scope.row.isDisabled === '1') &&
                  !scope.row.preUsePurchaseQtyForBasic &&
                  scope.row.warehouseId
                "
              >
                {{ $t('SALES.OutOfStock') }}
              </div>
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'preUsePurchaseQtyForBasic'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 96%"
                v-model="scope.row.preUsePurchaseQtyForBasic"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="0"
                :max="scope.row.maxQtyDrop || 0"
                @change="preUsePurchaseQtyForBasicChange(scope.row)"
                :disabled="scope.row.maxQtyDrop <= 0 || scope.row.isCanUpdateDropQty !== '1'"
              />
              <!-- || totalForm.isDeliverySchedule === '1' -->
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'warehouseName'">
            <template
              v-if="
                !(scope.row.isPhantom === '1' && scope.row.nonInventoryItem === '1') &&
                !comIsDropShippingSO
              "
            >
              <template v-if="!comDisFrom">
                <!-- isTemp === '1' 自定义服务产品, 无需选择仓库 -->
                <el-select
                  style="width: 98%"
                  v-model="scope.row.warehouseId"
                  placeholder=""
                  @change="warehouseNameChange(scope.row)"
                  :disabled="
                    scope.row.preUsePurchaseQtyForBasic > 0 ||
                    scope.row.isTemp === '1' ||
                    totalForm.blanketOrder === '1' ||
                    totalForm.isDeliverySchedule === '1'
                  "
                >
                  <el-option
                    v-for="item in scope.row.canSelectWarehouseList || []"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  >
                  </el-option>
                </el-select>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </template>

          <template v-else-if="item.prop === 'preLineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'maxQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'deliveryDate'">
            <template>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>

          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'orderQty'">
            <template v-if="scope.row[item.prop]">{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</template>
            <span v-else>-</span>
          </template>
          <template v-else-if="item.prop === 'shippedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'orderShippedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unfulfilledQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'pendShippingQty'">
            <template v-if="scope.row[item.prop]">{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum)
            }}</template>
            <span v-else>-</span>
          </template>
          <template v-else-if="item.prop === 'documentReservedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseQtyForPreForBasic'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <!-- <template v-else-if="item.prop === 'preUsePurchaseQtyForBasic'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template> -->
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>

    <selectProductTable :formData="formData" ref="selectProductTable" @onSuccess="updateTable" />
    <pendingShipmentDetailsDlg ref="pendingShipmentDetailsDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from '../components/selectProductTable'
import pendingShipmentDetailsDlg from './pendingShipmentDetailsDlg.vue'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type', 'tax_type'],
  components: {
    selectProductTable,
    pendingShipmentDetailsDlg
  },
  props: {
    /* 是否是直运的SO */
    comIsDropShippingSO: {
      type: Boolean,
      default: false
    },
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
    'formData.preDeliveryNoticeProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.preDeliveryNoticeProductList
        // this.tableList.forEach((x) => {
        //   if (
        //     !(
        //       x.maxQty <= 0 ||
        //       x.preUsePurchaseQtyForBasic > 0 ||
        //       this.formData.replenishType === '2' ||
        //       x.isDisabled === '1'
        //     )
        //   ) {
        //     if (!this.$resultOfBoolean(x.preQty)) {
        //       this.$set(x, 'preQty', x.maxQty)
        //     }
        //   } else {
        //     this.$set(x, 'preQty', undefined)
        //   }
        // })
        this.changeTableList()
        if (this.formData.salesQuotationType === 'Project') {
          this.handlerTable()
        }
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
      saveKey: '14',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'warehouseName',
          label: vm.$t('SALES.warehouse'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true,
          fixedWidth: 200
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'salesQuotationProductType',
        //   propBy: 'salesQuotationProductTypeShowStr',
        //   label: vm.$t('ui.type'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
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
          prop: 'orderQty',
          label: vm.$t('SALES.orderQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'pendShippingQty',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'maxQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 200,
          padding: 50,
          tooltip: true
        },
        {
          prop: 'preQty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'documentReservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        // {
        //   prop: 'shippedQty',
        //   label: vm.$t('SALES.shippedQTY'),
        //   visible: true,
        //   minWidth: 140,
        //   padding: 60,
        //   tooltip: true
        // },
        {
          prop: 'orderShippedQty',
          label: vm.$t('SALES.shippedQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'unfulfilledQty',
          label: vm.$t('SALES.cancelledOrderQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        // {
        //   prop: 'purchaseQtyForPreForBasic',
        //   label: vm.$t('SALES.qtyPur'),
        //   visible: true,
        //   minWidth: 140,
        //   padding: 60,
        //   tooltip: true
        // },
        {
          prop: 'preUsePurchaseQtyForBasic',
          label: vm.$t('SALES.DropShipQty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },

        // {
        //   prop: 'preLineTotal', // preUnitPrice
        //   label: vm.$t('SALES.amount'),
        //   visible: true,
        //   minWidth: 140,
        //   // tooltip: true,
        //   padding: 50,
        //   align: 'right'
        // },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'deliveryDate',
          label: vm.$t('SALES.scheduledDeliveryDate'),
          visible: true,
          minWidth: 200,
          padding: 50,
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
      rowIdKey: 'fullId',
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
      if (this.comDisFrom) {
        return false
      }
      return true
    },
    aliasIsHide() {
      return !this.tableList.find((x) => x.alias)
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.amountAuth) {
        return arr.filter((item) => {
          const is = item.prop !== 'preLineTotal'
          return is
        })
      }
      const filterProps1 = []
      if (this.aliasIsHide) {
        filterProps1.push('alias')
      }
      if (!this.comIsDropShippingSO) {
        filterProps1.push('preUsePurchaseQtyForBasic')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
      return arr
    },
    amountAuth() {
      return this.checkPermi(['salesManagement:preDeliveryNotice:amount'])
    },
    // comTotalAmount() {
    //   let value = 0
    //   this.tableList.forEach((item) => {
    //     if (item.preLineTotal) {
    //       value += item.preLineTotal
    //     }
    //   })
    //   return value
    // },
    comTotalQty() {
      let value = 0
      this.tableList.forEach((item) => {
        if (item.preQty) {
          value += item.preQty
        }
        if (item.preUsePurchaseQtyForBasic) {
          value += item.preUsePurchaseQtyForBasic
        }
      })
      return value
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'preQty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'preUsePurchaseQtyForBasic':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'remarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
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
        this.$set(row, 'taxNo', undefined)
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
    purchaseQuotationNoChange(row) {
      const selectRow =
        (row.pplList || []).find((item) => item.purchaseQuotationNo === row.purchaseQuotationNo) ||
        {}
      this.$set(row, 'purchaseQuotationNo', selectRow.purchaseQuotationNo)
      this.$set(row, 'purchaseQuotationId', selectRow.purchaseQuotationId)
      this.$set(row, 'purchaseQuotationUnitPrice', selectRow.purchaseQuotationUnitPrice)
      this.$set(row, 'pplUnitPrice', selectRow.pplUnitPrice)
      this.$set(row, 'purchasePriceId', selectRow.purchasePriceId)
    },

    priceTypeChange(selectRow, row) {
      this.$set(row, 'priceType', selectRow.priceType)
      this.$set(row, 'priceTypeShowStr', selectRow.priceTypeShowStr)
      /* costOfGoods 与库存成本取max */
      this.$set(row, 'unitPrice', selectRow.canUseUnitPrice)
      this.getLineTotal(row)
    },

    qtyChange(row) {
      this.$set(row, 'preQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (this.formData.salesQuotationType === 'Project') {
        this.handlerTable()
      }
      this.getLineTotal(row)
    },
    preUsePurchaseQtyForBasicChange(row) {
      this.$set(row, 'preUsePurchaseQtyForBasicError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    errorMessage(code) {
      // this.tableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     if (
      //       code === 'preQty' &&
      //       !(
      //         item.maxQty <= 0 ||
      //         item.preUsePurchaseQtyForBasic > 0 ||
      //         this.formData.replenishType === '2' ||
      //         item.isDisabled === '1'
      //       )
      //     ) {
      //       this.$set(item, code + 'Error', true)
      //     }

      //     if (
      //       code === 'warehouseName' &&
      //       !this.$resultOfBoolean(item.warehouseName) &&
      //       !item.preUsePurchaseQtyForBasic &&
      //       !this.comIsDropShippingSO
      //     ) {
      //       this.$set(item, code + 'Error', true)
      //     }
      //   }
      // })

      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          if (code === 'preQty') {
            if (
              !(
                item.maxQty <= 0 ||
                item.preUsePurchaseQtyForBasic > 0 ||
                this.formData.replenishType === '2' ||
                item.isDisabled === '1'
              )
            ) {
              this.$set(item, code + 'Error', true)
              this.$set(item, 'ROW-ERROR', true)
              if (!this.$resultOfBoolean(rowIndex)) {
                rowIndex = index
              }
            }
          } else if (code === 'warehouseName') {
            if (
              !this.comIsDropShippingSO &&
              item.productType !== '2' &&
              !item.preUsePurchaseQtyForBasic
            ) {
              this.$set(item, code + 'Error', true)
              this.$set(item, 'ROW-ERROR', true)
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
    warehouseNameChange(row) {
      console.log(row, '==============539')
      this.$set(row, 'warehouseNameError', false)
      this.$set(row, 'ROW-ERROR', false)

      const { canSelectWarehouseList } = row
      const warehouse =
        (canSelectWarehouseList || []).find((item) => item.warehouseId === row.warehouseId) || {}
      this.$set(row, 'warehouseName', warehouse.warehouseName)
      this.$emit('updateProductList', row.salesOrderProductId)
    },
    discountChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.preQty) && this.$resultOfBoolean(row.preUnitPrice)) {
          const lineTotal = row.preUnitPrice * row.preQty
          this.$set(row, 'preLineTotal', lineTotal)
        } else {
          this.$set(row, 'preLineTotal', undefined)
        }
      })
    },
    handlerTable() {
      const that = this
      const preQtyFullIds = []
      function isPreUsePurchaseQtyForBasic(tree) {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          that.$set(node, 'isDisabled', undefined)
          const preQty = node.preQty && node.preQty > 0
          const preUsePurchaseQtyForBasic =
            node.preUsePurchaseQtyForBasic && node.preUsePurchaseQtyForBasic > 0
          // const shippedQty = node.shippedQty && node.shippedQty > 0
          const shippedQty = node.orderShippedQty && node.orderShippedQty > 0
          if (preQty || preUsePurchaseQtyForBasic || shippedQty) {
            const parentId = node.fullId
            preQtyFullIds.push(parentId)
          }
          if (
            node.childProjectTemplateContentList &&
            node.childProjectTemplateContentList.length > 0
          ) {
            isPreUsePurchaseQtyForBasic(node.childProjectTemplateContentList)
          }
        }
      }
      isPreUsePurchaseQtyForBasic(that.tableList)
      this.disableNodesByIds(that.tableList, preQtyFullIds)
      this.$forceUpdate()
    },
    disableNodesByIds(tree, ids, disabledKey = 'isDisabled') {
      // 存储已处理的节点ID，避免重复处理
      const processedIds = new Set()

      ids.forEach((id) => {
        if (processedIds.has(id)) return
        // 查找节点及其父级路径
        const { node, path } = this.findNodePath(tree, id)
        // console.log(node, '====587')
        // console.log(path, '===588')
        if (node) {
          // 禁用路径上的所有节点（包括自身）
          // path.forEach((item) => {
          //   item[disabledKey] = '1'
          //   processedIds.add(item.fullId)
          // })

          // // 禁用路径上的所有节点（排除目标节点本身）
          path.slice(0, -1).forEach((item) => {
            if (!processedIds.has(item.id)) {
              item[disabledKey] = '1'
              processedIds.add(item.fullId)
            }
          })

          // 禁用所有子级节点
          this.disableChildren(node, disabledKey, processedIds)
          node[disabledKey] = undefined
        }
      })
    },

    /**
     * 查找节点及其路径
     * @returns {Object} { node: 目标节点, path: 从根到目标的路径数组 }
     */
    findNodePath(tree, targetId, path = []) {
      for (const item of tree) {
        const currentPath = [...path, item]
        // console.log(currentPath, '====618')
        if (item.fullId === targetId) {
          return { node: item, path: currentPath }
        }

        if (item.childProjectTemplateContentList && item.childProjectTemplateContentList.length) {
          const result = this.findNodePath(
            item.childProjectTemplateContentList,
            targetId,
            currentPath
          )
          if (result.node) return result
        }
      }
      return { node: null, path: [] }
    },

    /**
     * 递归禁用所有子级节点
     */
    disableChildren(node, disabledKey, processedIds) {
      if (!node.childProjectTemplateContentList || !node.childProjectTemplateContentList.length) {
        return
      }

      node.childProjectTemplateContentList.forEach((child) => {
        if (!processedIds.has(child.fullId)) {
          child[disabledKey] = '1'
          processedIds.add(child.fullId)
          this.disableChildren(child, disabledKey, processedIds)
        }
      })
    },

    setMaxExpectedDeliveryDate() {
      const expectedDeliveryDateList1 = this.tableList.map((item) => item.deliveryDate || 0)
      const expectedDeliveryDateList2 = this.formData.salesOrderServiceList.map(
        (item) => item.deliveryDate || 0
      )
      const max = Math.max(0, ...expectedDeliveryDateList1, ...expectedDeliveryDateList2)
      if (max > 0) {
        this.$set(this.totalForm, 'deliveryDate', max)
      } else {
        if (this.tableList.length > 0) {
          this.$set(this.totalForm, 'deliveryDate', Date.now())
        } else {
          this.$set(this.totalForm, 'deliveryDate', undefined)
        }
      }
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
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
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
      return cellClass
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
