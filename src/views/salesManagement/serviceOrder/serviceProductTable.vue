<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddBtn" type="primary" icon="el-icon-plus" size="mini">{{
          $t('uiBtn.add')
        }}</el-button>
        <!-- :disabled="!businessPartnerId" -->
      </el-col>
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddCustom" type="primary" icon="el-icon-plus" size="mini">{{
          $t('PRODUCT.addCustom')
        }}</el-button>
        <!-- :disabled="!businessPartnerId" -->
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          :disabled="selected.length <= 0"
          @click="handleDelete"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          >{{ $t('uiBtn.delete') }}</el-button
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
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      :key="timeStamp + modifyHighlight"
      v-table-tab
      :max-height="tableMaxHeight"
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
        <template slot="header" slot-scope="{ column }">
          <span v-if="['uom', 'qty', 'duration', 'warrantyStartDate'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'qty'">
            <template v-if="!comDisFrom">
              <!--
                删除 :precision="3" ==> 未输入小数时不填充小数
                保留 v-thousandSplit，控制小数位不要超出3位，
                keepDec: false 数字小数位不会补0
                change处理多输入的小数位 row.qty = this.$num(row.qty, row.decimalNum)
              -->
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999"
                @change="inputNumberChange(scope.row)"
                :key="'qty11' + scope.row.decimalNum"
                v-if="scope.row.productType === '2'"
              />
              <el-input-number
                v-else
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0 : 0"
                :max="scope.row.availableQty || 9999999999999"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'uom'">
            <!-- <el-select style="width: 98%" v-if="!comDisFrom" v-model="scope.row.uom" placeholder="">
              <el-option
                v-for="item in scope.row.uomList || []"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select> -->
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'amount'">{{
            $numberStr(scope.row[item.prop], 2)
          }}</template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'valuationAmount'">
            <template v-if="!comDisFrom && scope.row.serviceType === 'External'">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.valuationAmount"
                controls-position="right"
                :precision="2"
                :min="0.01"
                :max="999999.99"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'warranty'">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="!comDisFrom && scope.row.productType !== '2'"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              :min="0"
              :max="9999"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>

          <template v-else-if="item.prop === 'warrantyStartDate'">
            <el-date-picker
              v-if="!comDisFrom && scope.row.productType !== '2'"
              v-model="scope.row.warrantyStartDate"
              :picker-options="timeDatePickerOptions"
              :format="fmtForYmd"
              value-format="timestamp"
              style="width: 98%"
              placeholder=""
              clearable
              @change="changeDeliveryDate(scope.$index)"
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
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!comDisFrom"
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <i
              class="el-icon-edit pointer mr10"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.edit')"
              v-if="scope.row.isTemp === '1'"
              @click="handleEditRow(scope.row)"
            ></i>
            <i
              v-if="!scope.row.rfqNo && scope.row.isSicType !== '1'"
              class="el-icon el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <selectServiceProductTable
      ref="selectServiceProductTable"
      :businessPartnerId="businessPartnerId"
      @onSuccess="updateTable"
    />
    <addCustomDlg
      ref="addCustomDlg"
      :comDisFrom="comDisFrom"
      :countryId="countryId"
      @onSuccess="updateCustomTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectServiceProductTable from './components/selectServiceProductTable'
import addCustomDlg from './components/addCustomDlg'
import Sortable from 'sortablejs'
import { calculateTaxAmount } from '@/api/purchaseManagement/purchaseQuotation'
export default {
  mixins: [pageMixin],
  components: {
    selectServiceProductTable,
    addCustomDlg
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
    pqProductList: {
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
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    pqProductList: {
      immediate: true,
      handler: function (selected) {
        this.tableList = JSON.parse(JSON.stringify(this.pqProductList))

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
      saveKey: '55',
      savePath: 'salesMTable',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 180,
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
        //   prop: 'partNo',
        //   label: vm.$t('PRODUCT.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 160,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          colMinWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 140,
          colMinWidth: vm.comDisFrom ? undefined : 140,
          padding: 60,
          tooltip: true
        },
        /* {
          prop: 'warranty',
          label: vm.$t('PRODUCT.warrantyDays'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        },
        {
          prop: 'warrantyStartDate',
          label: vm.$t('SALES.warrantyStartDate'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          colMinWidth: vm.comDisFrom ? undefined : 200,
          tooltip: false
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          const startDateTime = vm.formData.startDateTime
          if (startDateTime) {
            return time.getTime() <= startDateTime - 8.64e7
          }
        }
      },
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'productId',
      timeStamp: +new Date()
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.formData.storeIssueChitId) {
        arr = arr.filter((item) => {
          const is = !['availableQty', 'warranty', 'warrantyStartDate'].includes(item.prop)
          return is
        })
      }
      return arr
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'uom':
            item.fixedWidth = vm.comDisFrom ? undefined : 100
            break
          case 'qty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'duration':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'warranty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'warrantyStartDate':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'remarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    initList(list) {
      this.tableList = JSON.parse(JSON.stringify(list))
    },
    getList() {
      return this.tableList
    },
    inputNumberChange(row) {
      this.$nextTick(() => {
        if (row.qty) {
          this.$set(row, 'qty', this.$num(row.qty, row.decimalNum))
        }
        const { qty, duration, valuationAmount, valuationUnit } = row
        if (valuationUnit === 'order') {
          if (qty && valuationAmount) {
            let count = 1000 * qty * valuationAmount
            count = (count / 1000).toFixed(2)
            this.$set(row, 'amount', count)
          } else {
            this.$set(row, 'amount', undefined)
          }
        } else {
          if (qty && duration && valuationAmount) {
            let count = 1000 * qty * valuationAmount * duration
            count = (count / 1000).toFixed(2)
            this.$set(row, 'amount', count)
          } else {
            this.$set(row, 'amount', undefined)
          }
        }
        this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      })
    },
    /* 表格部分Start */
    changeDeliveryDate(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.warrantyStartDate) {
          const oldDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.warrantyStartDate
          )
          if (oldDeliveryDate) {
            const msg = this.parseTime(topRow.warrantyStartDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('SALES.expectedDeliveryDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  if (row.productType !== '2') {
                    this.$set(row, 'warrantyStartDate', topRow.warrantyStartDate)
                  }
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'warrantyStartDate', topRow.warrantyStartDate)
            })
          }
        }
      }
    },
    purchaseQtyChange(row) {
      this.queryRowTaxAmount(row)
    },
    queryRowTaxAmount(row) {
      if (row.purchaseQty && row.purchaseUom && row.valuationAmount && row.taxNo) {
        const timer = Date.now()
        row.queryTime = timer
        calculateTaxAmount({
          productId: row.productId,
          unitPrice: row.valuationAmount,
          qty: row.purchaseQty,
          taxNo: row.taxNo
        }).then((res) => {
          if (row.queryTime === timer) {
            const data = res.data || {}
            this.$set(row, 'taxAmount', data.taxAmount)
            this.$set(row, 'taxAmountStr', this.$numberStr(data.taxAmount, 2))
            this.changeTableList()
          }
        })
      } else {
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountStr', undefined)
      }
    },
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectServiceProductTable.handleAdd(tableList)
    },
    handleAddCustom() {
      this.$refs.addCustomDlg.handleAdd()
    },
    handleEditRow(row) {
      this.$refs.addCustomDlg.handleEdit(row)
    },
    updateCustomTable(row) {
      if (row) {
        const newRow = JSON.parse(JSON.stringify(row))
        const findIndex = this.tableList.findIndex((item) => item.customId === row.customId)
        if (findIndex !== -1) {
          this.$set(this.tableList, findIndex, newRow)
        } else {
          this.tableList.push(newRow)
        }
        this.changeTableList()
      }
    },
    updateTable(list) {
      // if (list.length > 0) {
      const rows = JSON.parse(JSON.stringify(list))
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      this.$nextTick(() => {
        this.selected.forEach((row) => {
          this.tableList.forEach((item) => {
            if (row[this.rowIdKey] === item[this.rowIdKey]) {
              this.$refs.tables.toggleRowSelection(item, true)
            }
          })
        })
      })
      // }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      this.initDraggable()
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
          this.clearSuppliersList()
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
        this.clearSuppliersList()
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
    initDraggable() {
      if (this.comDisFrom) return
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: '',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
            this.tableList.splice(evt.newIndex, 0, targetRow)
            this.timeStamp = +new Date()
            this.initDraggable()
          }
        })
      }, 300)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    clearSuppliersList() {
      this.$emit('clearSuppliersList')
    }
  }
}
</script>

<style></style>
