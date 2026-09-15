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
          <span v-if="['preQty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'preQty'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                v-if="!comDisFrom"
                style="width: 98%"
                v-model="scope.row.preQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="0"
                :max="scope.row.maxQty || 0"
                @change="qtyChange(scope.row)"
                :disabled="
                  scope.row.maxQty <= 0 ||
                  formData.replenishType === '2' ||
                  scope.row.isDisabled === '1'
                "
              />
              <!-- scope.row.isDisabled === '1' || -->
              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'preLineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
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
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'shippedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unfulfilledQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'pendShippingQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'documentReservedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseQtyForPreForBasic'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'preUsePurchaseQtyForBasic'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
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
      saveKey: '13',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true,
          fixedWidth: 200
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
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
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
          prop: 'shippedQty',
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

        {
          prop: 'pendShippingQty',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 200,
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
        {
          prop: 'purchaseQtyForPreForBasic',
          label: vm.$t('SALES.qtyPur'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'preUsePurchaseQtyForBasic',
          label: vm.$t('SALES.purchaseDirectShipping'),
          visible: true,
          minWidth: 140,
          padding: 60,
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
    comVisibleColumn() {
      const arr = [...this.visibleColumn]
      if (!this.amountAuth) {
        return arr.filter((item) => {
          const is = item.prop !== 'preLineTotal'
          return is
        })
      }
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
            item.fixedWidth = vm.comDisFrom ? undefined : 160
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
      if (this.formData.salesQuotationType === 'Project') {
        this.handlerTable()
      }
      this.getLineTotal(row)
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
      // 查找有发货数量或采购直运数量或输入数量的产品
      function isPreUsePurchaseQtyForBasic(tree, callback) {
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i]
          const shippedQty = node.shippedQty && node.shippedQty > 0
          const preUsePurchaseQtyForBasic =
            node.preUsePurchaseQtyForBasic && node.preUsePurchaseQtyForBasic > 0
          if (shippedQty || preUsePurchaseQtyForBasic) {
            callback(node)
          } else {
            const preQty = node.preQty && node.preQty > 0
            if (preQty) {
              callback(node, 'qty')
            }
          }
          if (
            node.childProjectTemplateContentList &&
            node.childProjectTemplateContentList.length > 0
          ) {
            isPreUsePurchaseQtyForBasic(node.childProjectTemplateContentList, callback)
          }
        }
      }
      const parentIds = []
      const preQtyFullIds = []
      const salesOrderProductIds = []
      isPreUsePurchaseQtyForBasic(that.tableList, (node, type) => {
        if (node && type && type === 'qty') {
          const parentId = node.fullId.split('-')[0]
          preQtyFullIds.push(parentId)
          salesOrderProductIds.push(node.salesOrderProductId)
        } else if (node) {
          const parentId = node.fullId.split('-')[0]
          parentIds.push(parentId)
          salesOrderProductIds.push(node.salesOrderProductId)
        }
      })
      console.log(salesOrderProductIds, parentIds, preQtyFullIds, '===556')
      const isDisabled = (data) => {
        data.forEach((item) => {
          const fullId = item.fullId.split('-')[0]
          if (parentIds.indexOf(fullId) !== -1) {
            // 有发货数量或采购直运数量的产品
            const shippedQty = item.shippedQty && item.shippedQty > 0
            const preUsePurchaseQtyForBasic =
              item.preUsePurchaseQtyForBasic && item.preUsePurchaseQtyForBasic > 0
            const flag = data.some(
              (x) => salesOrderProductIds.indexOf(x.salesOrderProductId) !== -1
            )

            if (shippedQty || preUsePurchaseQtyForBasic || flag) {
              // 有发货数量或采购直运数量的产品行
              that.$set(item, 'isDisabled', undefined)
            } else {
              // that.$set(item, 'isDisabled', '1')
            }
          } else {
            // 无发货数量和采购直运数量的产品
            // console.log(data, '====574')
            if (preQtyFullIds.length > 0) {
              const isFullId = data.some((x) => preQtyFullIds.indexOf(fullId) === -1)
              // 当前产品级联数据都不存在数量
              if (isFullId) {
                that.$set(item, 'isDisabled', undefined)
              } else {
                const flag = data
                  .filter((x) => x.fullId.split('-').indexOf(fullId) !== -1)
                  .some((x) => salesOrderProductIds.indexOf(x.salesOrderProductId) !== -1)
                if (flag) {
                  that.$set(item, 'isDisabled', undefined)
                } else {
                  that.$set(item, 'isDisabled', '1')
                }
              }
            } else {
              that.$set(item, 'isDisabled', undefined)
            }
          }
          if (
            item.childProjectTemplateContentList &&
            item.childProjectTemplateContentList.length > 0
          ) {
            isDisabled(item.childProjectTemplateContentList || [])
          }
        })
      }
      isDisabled(that.tableList)
      console.log(this.tableList)
      this.$forceUpdate()
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
