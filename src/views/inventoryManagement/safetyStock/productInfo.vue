<template>
  <div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="!warehouseId"
          >{{ $t('uiBtn.add') }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      border
      ref="tables"
      max-height="600px"
      :data="tableList"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
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
          <span
            v-if="
              [
                'safetyStockMethod',
                'leadTimeDays',
                'replenishmentCycleDays',
                'safetyStock'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'safetyStockMethod'">
            <CommonSelect
              :id="scope.row.safetyStockMethod"
              :label="scope.row.safetyStockMethodLabel"
              idKey="dictValue"
              labelKey="dictLabel"
              filterable
              :disabled="comDisFrom"
              :options="scope.row.safetyStockMethodOptions || []"
              :clearable="false"
              @change="safetyStockMethodChange($event, scope.row)"
            />
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'leadTimeDays'">
            <el-input-number
              style="width: 98%"
              v-model="scope.row.leadTimeDays"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="1"
              :max="9999"
              @change="leadTimeDaysChange(scope.row)"
              :disabled="scope.row.leadTimeDaysCanEdit !== '1'"
            />
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'replenishmentCycleDays'">
            <el-input-number
              style="width: 98%"
              v-model="scope.row.replenishmentCycleDays"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="1"
              :max="9999"
              @change="replenishmentCycleDaysChange(scope.row)"
              :disabled="scope.row.replenishmentCycleDaysCanEdit !== '1'"
            />
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <div
            v-else-if="item.prop === 'serviceLevel'"
            :class="{
              'left-star': scope.row.safetyStockMethod === '2'
            }"
          >
            <el-select
              v-model="scope.row.serviceLevel"
              @change="serviceLevelChange(scope.row)"
              placeholder=""
              style="width: 98%"
              v-if="scope.row.safetyStockMethod === '2'"
            >
              <el-option
                v-for="item in dict.type.i_service_level"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </div>
          <div
            v-else-if="item.prop === 'periodIndicator'"
            :class="{
              'left-star': scope.row.safetyStockMethod === '2'
            }"
          >
            <el-select
              v-model="scope.row.periodIndicator"
              @change="periodIndicatorChange(scope.row)"
              placeholder=""
              style="width: 98%"
              v-if="scope.row.safetyStockMethod === '2'"
            >
              <el-option
                v-for="item in scope.row.periodIndicatorOptions || []"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </div>
          <div
            v-else-if="item.prop === 'historicalPeriodCount'"
            :class="{
              'left-star': scope.row.safetyStockMethod === '2'
            }"
          >
            <el-input-number
              style="width: 98%"
              v-model="scope.row.historicalPeriodCount"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="12"
              :max="24"
              @change="historicalPeriodCountChange(scope.row)"
              v-if="scope.row.safetyStockMethod === '2' && scope.row.periodIndicator === '1'"
            />
            <el-input-number
              style="width: 98%"
              v-model="scope.row.historicalPeriodCount"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="6"
              :max="12"
              @change="historicalPeriodCountChange(scope.row)"
              v-if="scope.row.safetyStockMethod === '2' && scope.row.periodIndicator === '2'"
            />
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </div>
          <template v-else-if="item.prop === 'safetyStock'">
            <template v-if="scope.row.safetyStockMethod === '1'">
              <el-input-number
                style="width: 98%"
                v-model="scope.row.safetyStock"
                controls-position="right"
                :precision="scope.row.decimalNum"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0 : 0"
                :max="scope.row.includeDecimal === '1' ? 999999.999 : 999999"
                @change="
                  scope.row.safetyStockError = false
                  scope.row['ROW-ERROR'] = false
                "
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'safetyTimeDays'">
            <el-input-number
              style="width: 98%"
              v-model="scope.row.safetyTimeDays"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="0"
              :max="30"
            />
          </template>

          <template v-else-if="item.prop === 'isActive'">
            <el-switch
              v-model="scope.row.isActive"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
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
    <selectProductTable
      :formData="formData"
      :warehouseId="warehouseId"
      ref="selectProductTable"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductTable from './selectProductTable'
import locale from '@/views/purchaseManagement/lang/index'
import { calculateProductBatch, calculateSingle } from '@/api/inventoryManagement/safetyStock'

export default {
  dicts: ['i_safety_stock_method', 'i_service_level', 'i_period_indicator'],
  components: { selectProductTable },
  mixins: [pageMixin],
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    warehouseId: {
      type: String,
      default: ''
    }
  },
  watch: {
    'formData.ivtProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.ivtProductList || []
        this.changeTableList()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '2',
      savePath: 'safetyStock',
      // 总条数
      total: 0,
      /* 表格部分 */
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'uom',
          label: vm.$t('INVENTORY.uomInv'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'safetyStockMethod',
          label: vm.$t('INVENTORY.safetyStockMethod'),
          visible: true,
          fixedWidth: 170,
          tooltip: true
        },
        {
          prop: 'leadTimeDays',
          label: vm.$t('INVENTORY.leadTimeDays'),
          visible: true,
          colMinWidth: 100,
          tooltip: true
        },
        {
          prop: 'replenishmentCycleDays',
          label: vm.$t('INVENTORY.replenishmentCycleDays'),
          visible: true,
          colMinWidth: 100,
          tooltip: true
        },
        {
          prop: 'serviceLevel',
          label: vm.$t('INVENTORY.serviceLevel'),
          visible: true,
          colMinWidth: 100,
          tooltip: false
        },
        {
          prop: 'periodIndicator',
          label: vm.$t('INVENTORY.periodIndicator'),
          visible: true,
          colMinWidth: 100,
          tooltip: false
        },
        {
          prop: 'historicalPeriodCount',
          label: vm.$t('INVENTORY.historicalPeriodCount'),
          visible: true,
          colMinWidth: 100,
          tooltip: false
        },
        {
          prop: 'safetyStock',
          label: vm.$t('INVENTORY.safetyStock'),
          visible: true,
          colMinWidth: 120,
          tooltip: true
        },
        {
          prop: 'safetyTimeDays',
          label: vm.$t('INVENTORY.safetyTimeDays'),
          visible: true,
          colMinWidth: 100,
          tooltip: true
        },
        {
          prop: 'isActive',
          label: vm.$t('ui.isActive'),
          visible: true,
          minWidth: 160,
          tooltip: true
        }
      ],
      tableList: [],
      rowIdKey: 'productId',
      purchaseAmount: '',
      costOfGoods: '',
      depositAmount: ''
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    addBtnShow() {
      if (this.comDisFrom) {
        return false
      }
      return true
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleAddBtn() {
      // const alreadySelectIdList = this.tableList.map((item) => item[this.rowIdKey])
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductTable.handleAdd(tableList)
      // this.$refs.selectProductTable.handleAdd()
    },
    updateTable(list) {
      // if (list.length > 0) {
      const rows = list
      const newRows = rows.filter((i) => !i.safetyStockMethod)
      this.queryNewRowMsg(newRows)
      rows.forEach((x) => {
        if (!x.safetyStockMethod) {
          x.isActive = '1'
        }
      })

      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      // }
    },
    queryNewRowMsg(rows) {
      if (rows.length <= 0) return
      calculateProductBatch({
        productIdList: rows.map((i) => i.productId),
        warehouseId: this.warehouseId
      })
        .then((res) => {
          const data = res.data || {}
          const ivtProductList = data.rows || []
          ivtProductList.forEach((item) => {
            const findItem = this.tableList.find((r) => r.productId === item.productId)
            if (findItem) {
              this.$set(findItem, 'safetyStockMethod', item.safetyStockMethod)
              this.$set(findItem, 'safetyStockMethodOptions', item.safetyStockMethodOptions || [])
              this.$set(findItem, 'leadTimeDays', item.leadTimeDays)
              this.$set(findItem, 'leadTimeDaysCanEdit', item.leadTimeDays ? '0' : '1')
              this.$set(findItem, 'replenishmentCycleDays', item.replenishmentCycleDays)
              this.$set(
                findItem,
                'replenishmentCycleDaysCanEdit',
                item.replenishmentCycleDays ? '0' : '1'
              )
              this.$set(findItem, 'serviceLevel', '1.64')
              this.$set(findItem, 'periodIndicator', item.periodIndicator)
              this.$set(findItem, 'periodIndicatorOptions', item.periodIndicatorOptions || [])
              this.$set(findItem, 'historicalPeriodCount', item.historicalPeriodCount)
              this.$set(findItem, 'safetyStock', item.safetyStock)
            }
          })
        })
        .catch(() => {})
    },
    handleDelRow(index, row) {
      // this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
      this.tableList.splice(index, 1)
      // })
    },
    safetyStockMethodChange(data, row) {
      this.$set(row, 'safetyStockMethod', data.dictValue)
      this.$set(row, 'safetyStockMethodLabel', data.dictLabel)
      this.$set(row, 'safetyStockMethodError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    leadTimeDaysChange(row) {
      this.$set(row, 'leadTimeDaysError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$nextTick(() => {
        if (row.leadTimeDays > 90) {
          this.$set(row, 'leadTimeDays', 90)
        }
        this.getRowSafetyStock(row)
      })
    },
    replenishmentCycleDaysChange(row) {
      this.$set(row, 'replenishmentCycleDaysError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$nextTick(() => {
        if (row.replenishmentCycleDays > 90) {
          this.$set(row, 'replenishmentCycleDays', 90)
        }
        this.getRowSafetyStock(row)
      })
    },
    serviceLevelChange(row) {
      this.$set(row, 'serviceLevelError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.getRowSafetyStock(row)
    },
    periodIndicatorChange(row) {
      this.$set(row, 'periodIndicatorError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.periodIndicator === '1') {
        this.$set(row, 'historicalPeriodCount', 12)
      }
      if (row.periodIndicator === '2') {
        this.$set(row, 'historicalPeriodCount', 6)
      }
      this.getRowSafetyStock(row)
    },
    historicalPeriodCountChange(row) {
      this.$set(row, 'historicalPeriodCountError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.getRowSafetyStock(row)
    },
    getRowSafetyStock(row) {
      const timer = Date.now()
      row.queryTimer = timer
      calculateSingle({
        ...row,
        warehouseId: this.warehouseId
      })
        .then((res) => {
          if (row.queryTimer !== timer) return
          const data = res.data || {}
          const findItem = this.tableList.find((r) => r.productId === data.productId)
          if (findItem) {
            if (!findItem.historicalPeriodCount) {
              this.$set(findItem, 'historicalPeriodCount', data.historicalPeriodCount)
            }
            this.$set(findItem, 'safetyStock', data.safetyStock)
          }
        })
        .catch(() => {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    importSuccess(res) {
      const data = res.data || []
      this.tableList.push(...data)
      this.changeTableList()
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
    },
    errorMessage(code) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.left-star::after {
  // content: '*';
  // font-size: 14px;
  // color: #ff4949;
  // position: absolute;
  // left: 2px;
  // top: 0px;
}
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
