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
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
      <div class="footer-content">
        <div>{{ $t('SALES.totalAmount') }} : {{ $numberStr(comTotalAmount, 2) }}</div>
        <div class="ml20">{{ $t('SALES.totalQTY') }} : {{ $numberStr(comTotalQty, 3) }}</div>
      </div>
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
          <span>{{ scope.$index + 1 }}</span>
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
        <template slot-scope="scope">
          <template v-if="item.prop === 'preLineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'deliveryDate'">
            <template>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>
          <template v-else-if="item.prop === 'preQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'ackQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'replenishQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'rejectedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'uom'">
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
        v-if="tableList.find((r) => r.rejectedQty > 0)"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.rejectedQty > 0"
            type="text"
            @click="handleViewRejectMsg(scope.row)"
            >{{ $t('uiBtn.view') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <viewRejectMsgDlg ref="viewRejectMsgDlg" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import viewRejectMsgDlg from '@/views/salesManagement/deliveryOrder/components/viewRejectMsgDlg.vue'
export default {
  mixins: [pageMixin],
  components: { viewRejectMsgDlg },
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
    'formData.deliveryOrderProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.deliveryOrderProductList
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '4',
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
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        /* {
          prop: 'orderQty',
          label: vm.$t('SALES.orderQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'progressiveQty',
          label: vm.$t('SALES.progressiveQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },

        {
          prop: 'pendShippingQty',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'documentReservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }, */
        {
          prop: 'preQty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'ackQty',
          label: vm.$t('SALES.receivedQty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'replenishQty',
          label: vm.$t('SALES.replenishedQTY'),
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
          prop: 'preLineTotal', // preUnitPrice
          label: vm.$t('SALES.amount'),
          visible: true,
          minWidth: 140,
          // tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'deliveryDate',
          label: vm.$t('SALES.scheduledDeliveryDate'),
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
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      if (this.formData.salesQuotationType === 'Project') {
        return false
      }
      return true
    },
    comTotalAmount() {
      let value = 0
      this.tableList.forEach((item) => {
        if (item.preLineTotal) {
          value += item.preLineTotal
        }
      })
      return value
    },
    comTotalQty() {
      let value = 0
      this.tableList.forEach((item) => {
        if (item.preQty) {
          value += item.preQty
        }
      })
      return value
    },
    aliasIsHide() {
      return !this.tableList.find((x) => x.alias)
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const filterProps1 = []
      if (this.aliasIsHide) {
        filterProps1.push('alias')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
      return arr
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    nav(row) {
      this.$refs.pendingShipmentDetailsDlg.handleOpen(row)
      console.log('a')
    },
    handleTabClick() {},
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
    handleViewRejectMsg(row) {
      this.$refs.viewRejectMsgDlg.handleOpen(row)
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
