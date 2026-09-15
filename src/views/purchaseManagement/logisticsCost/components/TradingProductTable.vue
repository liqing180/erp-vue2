<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <!-- formData.logisticsDocumentExpenses.length <= 0 ||  -->
        <el-button
          @click="handleRowAssign"
          :disabled="!formData.documentType"
          type="primary"
          size="mini"
          >{{ $t('PURCHASE.selectFromDocuments') }}</el-button
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
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="comAssignedDetails"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      v-table-tab
    >
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
        <!-- <template slot="header" slot-scope="{ column }">
          <span v-if="['qty'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template> -->
        <template slot-scope="scope">
          <template v-if="item.prop === 'qty'">
            <!-- <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.purchaseQty"
                @change="qtyChange(scope.row)"
              />
            </template> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'purchaseQty'">
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'freightAllocation'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'basicUom'">
            <template>{{ scope.row.basicUom || scope.row.uom }}</template>
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
        fixed="right"
        v-if="!comDisFrom"
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  // calculateDocumentExpense
  calculate
} from '@/api/purchaseManagement/logisticsCost'
export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type'],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    comAssignedDetails: {
      type: Array,
      default() {
        return []
      }
    },
    countryId: {
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
    tableListLength: {
      handler() {
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
      saveKey: '9',
      savePath: 'LCostTable',
      activeName: '1',
      columns: [
        // {
        //   prop: 'logisticsDocumentExpenseItem',
        //   label: vm.$t('PURCHASE.expenseItem'),
        //   visible: true,
        //   colMinWidth: 200,
        //   tooltip: true
        // },

        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.documentNo'),
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
        /* {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.purchaseQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }, */
        {
          prop: 'qty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'basicUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'freightAllocation',
          label: vm.$t('PURCHASE.freightAllocation'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        }
      ],
      totalForm: {},
      selected: [],
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: []
    }
  },
  computed: {
    rowIdKey() {
      return 'salesPartId'
    },
    comVisibleColumn() {
      const arr = [...this.visibleColumn]
      return arr
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    tableListLength() {
      return this.comAssignedDetails.length
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleRowAssign() {
      this.$emit('handleRowAssign')
    },
    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.comAssignedDetails)
      })
    },
    handleTabClick() {},
    initColumnWidth() {
      /* const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'qty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
        }
      }) */
    },
    qtyChange(row) {
      const list = this.formData.logisticsDocumentExpenses || []
      const parentRow = list[row.topIndex] || {}
      this.calculateOneDetail([parentRow])
    },
    calculateOneDetail(list) {
      const timer = Date.now()
      // list.forEach((item) => {
      //   item.queryTime = timer
      //   item.currencyId = this.formData.currencyId
      //   if (!item.amount) {
      //     item.logisticsDocumentProducts.forEach((child) => {
      //       this.$set(child, 'freightAllocation', undefined)
      //     })
      //   }
      // })
      // if (list.length === 1 && !list[0].amount) {
      //   return
      // }

      // calculateDocumentExpense(list).then((res) => {
      //   const tableList = this.formData.logisticsDocumentExpenses || []
      //   const newList = res.data || []
      //   tableList.forEach((item) => {
      //     if (timer === item.queryTime) {
      //       const newItem = newList.find((p) => p.timeRowId + '' === item.timeRowId + '')
      //       if (newItem) {
      //         const logisticsDocumentProducts = newItem.logisticsDocumentProducts
      //         this.$set(item, 'refAmount', newItem.refAmount)
      //         this.$set(item, 'logisticsDocumentProducts', logisticsDocumentProducts)
      //       }
      //     }
      //   })
      // })

      calculate(this.totalForm).then((res) => {
        const { logisticsDocumentExpenses, logisticsDocumentProductList } = res
        const newList = logisticsDocumentExpenses || []
        this.$set(this.totalForm, 'logisticsDocumentProductList', logisticsDocumentProductList)
        this.tableList.forEach((item) => {
          if (timer === item.queryTime) {
            const newItem = newList.find((p) => p.timeRowId + '' === item.timeRowId + '')
            if (newItem) {
              this.$set(item, 'refAmount', newItem.refAmount)
              // const logisticsDocumentProducts = newItem.logisticsDocumentProducts
              // this.$set(item, 'logisticsDocumentProducts', logisticsDocumentProducts)
              // this.$set(item, 'logisticsDocumentProducts', logisticsDocumentProductList)
            }
          }
        })
      })
    },

    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        // const list = this.formData.logisticsDocumentExpenses || []

        // this.totalForm.selectedProductList.forEach((item, i) => {
        //   if (item.documentDetailId === row.documentDetailId) {
        //     this.totalForm.selectedProductList.splice(i, 1)
        //   }
        // })
        console.log(row, '==============387')
        this.totalForm.selectedProductList = this.totalForm.selectedProductList.filter(
          (item) => item.documentDetailId + '' !== row.documentDetailId + ''
        )
        console.log(this.totalForm.selectedProductList, '==========390')
        this.totalForm.logisticsDocumentProductList.splice(index, 1)

        // list.forEach((item) => {
        //   const childList = item.logisticsDocumentProducts || []
        //   childList.forEach((item, childIndex) => {
        //     if (item.documentDetailId === row.documentDetailId) {
        //       childList.splice(childIndex, 1)
        //     }
        //   })
        // })
        this.calculateOneDetail()
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
