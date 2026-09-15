<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button
          @click="handleAddBtn"
          :disabled="!businessPartnerId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="false"
          >{{ $t('uiBtn.add') }}</el-button
        >
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
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
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
          <span v-if="['uom', 'qty', 'warrantyStartDate'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'uom'">
            <el-select
              style="width: 98%"
              v-if="!comDisFrom && scope.row.isSicType !== '1'"
              v-model="scope.row.uom"
              showUomLabel(scope.row[item.prop])
              placeholder=""
              filterable
            >
              <el-option
                v-for="item in scope.row.uomList || []"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span v-else :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
          </template>
          <template v-else-if="item.prop === 'qty'">
            <el-input-number
              v-thousandSplit="{ precision: scope.row.decimalNum }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.qty"
              controls-position="right"
              :precision="scope.row.decimalNum"
              :min="scope.row.includeDecimal === '1' ? 0 : 0"
              :max="scope.row.availableQty || 999999"
              @change="purchaseQtyChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'warranty'">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              :min="1"
              :max="9999"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'warrantyStartDate'">
            <el-date-picker
              v-if="!comDisFrom"
              v-model="scope.row.warrantyStartDate"
              :picker-options="timeDatePickerOptions"
              @change="changeDeliveryDate(scope.$index)"
              :format="fmtForYmd"
              value-format="timestamp"
              :disabled="!formData.startDateTime"
              style="width: 98%"
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
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
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
    <selectProductTable
      ref="selectProductTable"
      :businessPartnerId="businessPartnerId"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './components/selectProductTable'
import Sortable from 'sortablejs'
export default {
  mixins: [pageMixin],
  components: {
    selectProductTable
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    linkRFQ: {
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
        /* this.tableList.forEach((x) => {
          if (x.qty) {
            x.maxQty = x.qty
          }
        }) */
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
      saveKey: '53',
      savePath: 'salesMTable',
      columns: [
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
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 100,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          padding: 60,
          tooltip: true
        },
        {
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
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          fixedWidth: vm.comDisFrom ? undefined : 200,
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
      rowIdKey: 'productId'
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
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
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'warranty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'warrantyStartDate':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
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
    purchaseQtyChange(row) {
      this.queryRowTaxAmount(row)
    },
    purchaseUomChange(row) {
      this.queryRowTaxAmount(row)
    },
    unitPriceChange(row) {
      this.queryRowTaxAmount(row)
    },
    taxNoChange(row) {
      this.queryRowTaxAmount(row)
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
                  this.$set(row, 'warrantyStartDate', topRow.warrantyStartDate)
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
    queryRowTaxAmount(row) {},
    handleAddBtn() {
      const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      this.$refs.selectProductTable.handleAdd(alreadySelectIdList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        this.tableList = [...this.tableList, ...rows]
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
        // this.initDraggable()
      }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
        this.changeCommittedDate()
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
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
            this.tableList.splice(evt.newIndex, 0, targetRow)
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
