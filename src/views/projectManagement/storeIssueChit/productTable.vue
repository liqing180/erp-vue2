<template>
  <div class="pb20">
    <!-- <el-row v-show="warehouseList.length > 0">
      <el-tabs v-model="activeWarehouseId" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="item in warehouseList"
          :name="item.warehouseId"
          :key="'Tabs' + item.warehouseId"
        >
          <span slot="label">
            <span>{{ item.warehouseName }}</span>
            <span class="ml5">
              <span v-if="tableList.filter((p) => p.warehouseId === item.warehouseId).length"
                >({{ tableList.filter((p) => p.warehouseId === item.warehouseId).length }})</span
              >
            </span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row> -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom || isCanUpdateSICProduct">
        <el-button
          @click="handleAddBtn"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="warehouseList.length <= 0"
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
    </el-row>
    <el-table
      :key="tableKey + '-' + modifyHighlight"
      border
      ref="tables"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      v-loading="loading"
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
          <span v-if="['qty', 'warranty', 'warrantyStartDate', 'deliveryDate'].includes(item.prop)">
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'qty'">
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.maxQty"
                @change="purchaseQtyChange(scope.row)"
                @keyup.enter.native="purchaseQtyChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else-if="isCanUpdateSICProduct">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.storeIssueChitProductId ? scope.row.allowMaxQty : scope.row.maxQty"
                @change="purchaseQtyChange(scope.row)"
                @keyup.enter.native="purchaseQtyChange(scope.row)"
              />
            </template>

            <template v-else>
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
          </template>
          <template v-else-if="item.prop === 'warranty'">
            <el-input-number
              v-if="!comDisFrom"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="1"
              :max="9999"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'availableQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'returnedQty'">
            <!-- <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" /> -->
            <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'srUsedQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
          </template>
          <template v-else-if="item.prop === 'qtyOnHand'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />

            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'allReservedQty'">
            <TableNonInventoryItem v-if="scope.row.nonInventoryItem === '1'" />
            <template v-else>
              <span
                v-if="storeIssueChitId && scope.row.storeIssueChitProductId"
                class="primary-link"
                @click="openReservedDetail(scope.row)"
                >{{ $numberStr(scope.row.allReservedQty, scope.row.decimalNum) }}</span
              >
              <span v-else class="primary-link" @click="openReservedDetail(scope.row)">{{
                $numberStr(scope.row.reservedQty, scope.row.decimalNum)
              }}</span>
            </template>
          </template>
          <template v-else-if="item.prop === 'warrantyStartDate'">
            <el-date-picker
              v-if="!comDisFrom"
              v-model="scope.row.warrantyStartDate"
              :picker-options="timeDatePickerOptions"
              :format="fmtForYmd"
              value-format="timestamp"
              style="width: 98%"
              placeholder=""
              clearable
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>
          <template v-else-if="item.prop === 'deliveryDate'">
            <el-date-picker
              v-model="scope.row.deliveryDate"
              :picker-options="timeDatePickerOptions"
              @change="changeDeliveryDate(scope.$index)"
              :format="fmtForYmd"
              value-format="timestamp"
              style="width: 98%"
              placeholder=""
              clearable
              v-if="!comDisFrom"
            ></el-date-picker>
            <template v-else>{{ parseTime(scope.row[item.prop], fmtForYmd) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="!(!comDisFrom || (isCanUpdateSICProduct && !scope.row.storeIssueChitProductId))"
            />
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!comDisFrom || isCanUpdateSICProduct"
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
              v-if="isCanUpdateSICProduct ? !scope.row.storeIssueChitProductId : !scope.row.rfqNo"
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
      :costProjectId="costProjectId"
      :storeIssueChitId="storeIssueChitId"
      @onSuccess="updateTable"
      :warehouseList="warehouseList"
    />

    <!-- 占用详情 -->
    <reservedDetailsDlg ref="reservedDetailsDlg" :storeIssueChitId="storeIssueChitId" />
    <reservedDetailsDlg1 ref="reservedDetailsDlg1" :storeIssueChitId="storeIssueChitId" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './components/selectProductTable'
import Sortable from 'sortablejs'
import reservedDetailsDlg from './components/reservedDetailsDlg'
import reservedDetailsDlg1 from './components/reservedDetailsDlg1'
import { checkStoreIssueChitPreemptRisk } from '@/api/projectManagement/storeIssueChit'
export default {
  mixins: [pageMixin],
  components: {
    reservedDetailsDlg,
    selectProductTable,
    reservedDetailsDlg1
  },
  props: {
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
    warehouseList: {
      type: Array,
      default() {
        return []
      }
    },
    warehouseIdList: {
      type: Array,
      default() {
        return []
      }
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    storeIssueChitId: {
      type: String,
      default: ''
    },
    costProjectId: {
      type: String,
      default: ''
    },
    // 待归还-只更新产品修改方式，旧产品不可删除，可增加数量
    isCanUpdateSICProduct: {
      type: Boolean,
      default: false
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
    },
    isCanUpdateSICProduct: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    },

    warehouseIdList: {
      immediate: true,
      handler: function (newVal) {
        if (!newVal || newVal.length <= 0) {
          this.tableList = []
        } else {
          this.tableList = this.tableList.filter((item) => newVal.includes(item.warehouseId))
        }
      }
    },
    costProjectId: {
      immediate: true,
      handler: function (newVal) {
        if (!newVal) {
          this.tableList = []
        }
      }
    }
  },
  data() {
    const vm = this
    return {
      tableKey: Date.now(),
      saveKey: '13',
      savePath: 'projectMDlg',
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
        /* {
          prop: 'warehouseName',
          label: vm.$t('INVENTORY.warehouseName'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */

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
          label: vm.$t('ui.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'qtyOnHand',
          label: vm.$t('PRODUCT.qTYOnHand'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'availableQty',
          label: vm.$t('PRODUCT.availableQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'allReservedQty',
          label: vm.$t('PRODUCT.reservedQTY'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          fixedWidth: vm.comDisFrom ? undefined : 140,
          tooltip: true
        },
        {
          prop: 'srUsedQty',
          label: vm.$t('SALES.usedQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'returnedQty',
          label: vm.$t('SALES.returnedQty1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        // {
        //   prop: 'deliveryDate',
        //   label: vm.$t('SALES.scheduledDeliveryDate'),
        //   visible: true,
        //   minWidth: 200,
        //   colMinWidth: vm.comDisFrom ? undefined : 160,
        //   tooltip: true
        // },
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
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'productId',
      loading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.storeIssueChitId) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'returnedQty' && item.prop !== 'srUsedQty'
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
    handleTabClick() {},
    openReservedDetail(row) {
      this.$refs.reservedDetailsDlg.handleOpen(row)
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'deliveryDate':
            item.colMinWidth = !vm.comDisFrom || vm.isCanUpdateSICProduct ? 160 : undefined
            break
          case 'qty':
            item.colMinWidth = !vm.comDisFrom || vm.isCanUpdateSICProduct ? 120 : undefined
            break
          case 'remarks':
            item.colMinWidth = !vm.comDisFrom || vm.isCanUpdateSICProduct ? 200 : undefined
            break
        }
      })
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')

      // this.tableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })

      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          this.$set(item, 'ROW-ERROR', true)
          this.$set(item, code + 'Error', true)
          if (!this.$resultOfBoolean(rowIndex)) {
            rowIndex = index
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
    initList(list) {
      this.tableList = JSON.parse(JSON.stringify(list))
      this.tableKey++
    },
    getList() {
      return this.tableList
    },
    purchaseQtyChange(row) {
      console.log('===============559')
      this.$set(row, 'qtyError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (this.isCanUpdateSICProduct && row.storeIssueChitProductId && row.qty < row.allowMinQty) {
        this.$nextTick(() => {
          this.$set(row, 'qty', row.allowMinQty)
          if (row.qty > row.availableQty) {
            this.checkStoreIssueChitPreemptRisk(row)
          }
        })
        this.$modal.msgError(this.$t('SALES.QtyOnlyIncreased'))
      }
      this.queryRowTaxAmount(row)

      if (row.qty > row.availableQty) {
        this.checkStoreIssueChitPreemptRisk(row)
      }
    },
    checkStoreIssueChitPreemptRisk(row) {
      if (this.loading) return
      this.$emit('isRequestLoading', true)
      this.loading = true
      checkStoreIssueChitPreemptRisk({
        warehouseId: row.warehouseId,
        productId: row.productId,
        qty: row.qty
      })
        .then((res) => {
          console.log(res)
          try {
            const { needPreemptConfirm, preemptDocumentNoList } = res.data
            if (
              needPreemptConfirm === '1' &&
              preemptDocumentNoList &&
              preemptDocumentNoList.length
            ) {
              this.$alert(
                this.$t('PRODUCT.mayFaceStockout')
                  .replace('$1', this.$numberStr(row.availableQty, row.decimalNum))
                  .replace('$2', preemptDocumentNoList.join(', ')),
                '',
                {
                  confirmButtonText: this.$t('PRODUCT.ConfirmContinue'),
                  cancelButtonText: this.$t('uiBtn.cancel'),
                  showCancelButton: true,
                  showClose: false,
                  type: 'warning',
                  customClass: 'custom-class'
                }
              )
                .then(() => {
                  this.loading = false
                  this.$emit('isRequestLoading', false)
                  this.$set(row, 'preemptRiskConfirmed', '1')
                })
                .catch(() => {
                  this.$nextTick(() => {
                    this.$set(row, 'qty', undefined)
                  })
                  this.$set(row, 'preemptRiskConfirmed', '0')
                  this.loading = false
                  this.$emit('isRequestLoading', false)
                })
            } else {
              this.loading = false
              this.$emit('isRequestLoading', false)
            }
          } catch (e) {
            this.loading = false
            this.$emit('isRequestLoading', false)
          }
        })
        .catch(() => {
          this.loading = false
          this.$emit('isRequestLoading', false)
          this.$set(row, 'qty', undefined)
          this.$set(row, 'preemptRiskConfirmed', '0')
        })
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
    queryRowTaxAmount(row) {},
    handleAddBtn() {
      /* const tableList = JSON.parse(
        JSON.stringify(this.tableList.filter((item) => item.warehouseId === this.activeWarehouseId))
      )
      let alreadySelectIdList = this.tableList
        .filter((item) => item.warehouseId !== this.activeWarehouseId)
        .map((item) => item[this.rowIdKey])
      alreadySelectIdList = [...new Set(alreadySelectIdList)]
       */
      if (this.isCanUpdateSICProduct) {
        const tableList = JSON.parse(
          JSON.stringify(this.tableList.filter((i) => !i.storeIssueChitProductId))
        )
        const alreadyIdList = this.tableList
          .filter((i) => i.storeIssueChitProductId)
          .map((i) => i[this.rowIdKey])
        this.$refs.selectProductTable.handleAdd(tableList, alreadyIdList)
      } else {
        const tableList = JSON.parse(JSON.stringify(this.tableList))
        this.$refs.selectProductTable.handleAdd(tableList)
      }
    },
    updateTable(list) {
      const rows = JSON.parse(JSON.stringify(list))
      if (this.isCanUpdateSICProduct) {
        this.tableList = this.tableList.filter((i) => i.storeIssueChitProductId)
      } else {
        this.tableList.length = 0
      }
      this.tableList.push(...rows)
      this.changeTableList()
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
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        const findIndex1 = this.tableList.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex1 !== -1) {
          this.tableList.splice(findIndex1, 1)
        }

        const findIndex = this.selected.findIndex(
          (item) => item[this.rowIdKey] === row[this.rowIdKey]
        )
        if (findIndex !== -1) {
          this.selected.splice(findIndex, 1)
        }
      })
    },
    /* 表格部分Start */
    changeDeliveryDate(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDate) {
          const oldDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDate
          )
          if (oldDeliveryDate) {
            const msg = this.parseTime(topRow.deliveryDate, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('PURCHASE.committedDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDate', topRow.deliveryDate)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDate', topRow.deliveryDate)
            })
          }
        }
      }
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
    }
  }
}
</script>

<style></style>
