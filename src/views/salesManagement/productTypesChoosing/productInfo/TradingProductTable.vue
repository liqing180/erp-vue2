<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!formData.salesOrderId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>

      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn"
        :columnsInit="columns"
      ></right-toolbar>
      <div class="footer-content">
        <template v-if="comIsRejectedCreated">
          <div>{{ $t('SALES.qtyToRejected') }} : {{ comTotalQty }}</div>
          <div class="ml20">
            {{ $t('SALES.rejectedAmount') }} : {{ $numberStr(comTotalAmount, 2) }}
          </div>
        </template>
        <template v-else>
          <div>{{ $t('SALES.qtyToReturn') }} : {{ comTotalQty }}</div>
          <div class="ml20">
            {{ $t('SALES.returnedAmount') }} : {{ $numberStr(comTotalAmount, 2) }}
          </div>
        </template>
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
          <span v-if="['qtyToReturn', 'returnedReason', 'rmaType'].includes(item.prop)">
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
                @change="qtyChange(scope.row)"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedAmount'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'rejectedAmount'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'returnedReason'">
            <el-select
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.returnedReason"
              placeholder=""
            >
              <el-option
                v-for="dict in dict.type.sales_returned_reason"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <template v-else-if="item.prop === 'rmaType'">
            <el-select
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.rmaType"
              placeholder=""
            >
              <el-option
                v-for="dict in dict.type.sales_rma_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <template v-else-if="item.prop === 'scheduledReceivedDate'">
            <el-date-picker
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.scheduledReceivedDate"
              :picker-options="timeDatePickerOptions"
              @change="changeExpectedDeliveryDate(scope.$index)"
              :format="fmtForYmd"
              value-format="timestamp"
              placeholder=""
              clearable
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
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
          <template v-else-if="item.prop === 'ackQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'rejectedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'balanceQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'qtyToRejected'">
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from '../components/selectProductTable'

export default {
  mixins: [pageMixin],
  dicts: ['sales_returned_reason', 'sales_rma_type'],
  components: {
    selectProductTable
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
    'formData.salesGoodsReturnProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesGoodsReturnProductList
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
      saveKey: '25',
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
        {
          prop: 'orderQty',
          label: vm.$t('SALES.orderQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'ackQty',
          label: vm.$t('SALES.qtyAck'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('SALES.rejectedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('SALES.returnedQTY1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'balanceQty',
          label: vm.$t('SALES.balanceQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qtyToReturn',
          label: vm.$t('SALES.qtyToReturn'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedAmount',
          label: vm.$t('SALES.returnedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'qtyToRejected',
          label: vm.$t('SALES.qtyToRejected'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'rejectedAmount',
          label: vm.$t('SALES.rejectedAmount'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'returnedReason',
          propBy: 'returnedReasonShowStr',
          label: vm.$t('SALES.returnReason'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'rmaType',
          propBy: 'rmaTypeShowStr',
          label: vm.$t('SALES.RMAType'),
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
          prop: 'scheduledReceivedDate',
          label: vm.$t('SALES.estimatedReceiptDate'),
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
      rowIdKey: 'productId',
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
      return true
    },
    comTotalAmount() {
      let value = 0
      this.tableList.forEach((item) => {
        if (this.comIsRejectedCreated) {
          if (item.rejectedAmount) {
            value += item.rejectedAmount
          }
        } else {
          if (item.returnedAmount) {
            value += item.returnedAmount
          }
        }
      })
      return value
    },
    comTotalQty() {
      let value = 0
      this.tableList.forEach((item) => {
        if (this.comIsRejectedCreated) {
          if (item.qtyToRejected) {
            value += item.qtyToRejected
          }
        } else {
          if (item.qtyToReturn) {
            value += item.qtyToReturn
          }
        }
      })
      return value
    },
    /* 是否是拒收生成 */
    comIsRejectedCreated() {
      // 销售退货单创建类型.1退货2拒收"
      return this.formData.salesGoodsReturnCreateType === '2'
    },
    comVisibleColumn() {
      const arr = [...this.visibleColumn]
      if (this.comIsRejectedCreated) {
        return arr.filter((item) => {
          const filterProps = ['qtyToReturn', 'returnedAmount']
          const is = !filterProps.includes(item.prop)
          return is
        })
      } else {
        return arr.filter((item) => {
          const filterProps = ['qtyToRejected', 'rejectedAmount']
          const is = !filterProps.includes(item.prop)
          return is
        })
      }
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
          case 'qtyToReturn':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'returnedReason':
            item.fixedWidth = vm.comDisFrom ? undefined : 180
            break
          case 'rmaType':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'scheduledReceivedDate':
            item.fixedWidth = vm.comDisFrom ? undefined : 220
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

    qtyChange(row) {
      this.getLineTotal(row)
    },

    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qtyToReturn) && this.$resultOfBoolean(row.averageUnitPrice)) {
          const returnedAmount = row.averageUnitPrice * row.qtyToReturn
          this.$set(row, 'returnedAmount', returnedAmount)
        } else {
          this.$set(row, 'returnedAmount', undefined)
        }
      })
    },
    changeExpectedDeliveryDate(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.scheduledReceivedDate) {
          const oldExpectedDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.scheduledReceivedDate
          )
          if (oldExpectedDeliveryDate) {
            const msg = this.parseTime(topRow.scheduledReceivedDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('SALES.expectedDeliveryDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'scheduledReceivedDate', topRow.scheduledReceivedDate)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'scheduledReceivedDate', topRow.scheduledReceivedDate)
            })
          }
        }
      }
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      this.$refs.selectProductTable.handleAdd([])
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
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
