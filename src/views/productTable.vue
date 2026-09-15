<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="!comDisFrom">
        <el-button @click="handleAddExpenseItem" type="primary" icon="el-icon-plus" size="mini">{{
          $t('PURCHASE.addExpenseItem')
        }}</el-button>
      </el-col>
    </el-row>
    <el-table
      border
      ref="tables"
      class="tables"
      v-loading="loading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="comTableList"
      :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
      default-expand-all
      :row-key="rowIdKey"
      max-height="600"
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
          <span>{{ scope.row.snNum }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="productName"
        :label="$t('PURCHASE.productName')"
        header-align="center"
        align="left"
        min-width="200"
        :show-overflow-tooltip="true"
      >
        <template slot="header">
          <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('PURCHASE.productName') }}
        </template>
        <template slot-scope="scope">
          <template v-if="scope.row.isExpenseItem === '1'">
            <el-input
              v-if="!comDisFrom"
              style="width: 98%"
              :title="scope.row.expenseItem"
              v-model="scope.row.expenseItem"
              :maxlength="50"
              size="mini"
            />
            <span v-else>{{ scope.row.expenseItem }}</span>

            <!-- {{ scope.row.expenseItem }} -->

            <div
              v-if="getFieldExistsExpenseItem(scope.row)"
              class="flow1"
              style="
                color: #ff4949;
                font-size: 12px;
                line-height: 13px;
                padding: 3px 0;
                text-align: left;
                width: 100%;
              "
            >
              {{ $t('ui.alreadyExists').replace('$1', `[${scope.row.expenseItem}]`) }}
            </div>
          </template>
          <template v-else-if="!scope.row.productId">
            <div class="flexCCen ml20">
              <selectExpenseItemName
                :value="scope.row.expenseItemName"
                :canSelectOptions="
                  getServiceSurchargeListOptions(serviceSurchargeListOptions, scope.row)
                "
                :allOptions="serviceSurchargeListOptions"
                @change="productNameChange($event, scope.row)"
                size="mini"
                v-if="!comDisFrom"
              />
              <span v-else>{{ scope.row.expenseItemName }}</span>
              <div
                v-if="getFieldExists(scope.row)"
                class="flow1"
                style="
                  color: #ff4949;
                  font-size: 12px;
                  line-height: 13px;
                  padding: 3px 0;
                  text-align: left;
                  width: 100%;
                "
              >
                {{ $t('ui.alreadyExists').replace('$1', `[${scope.row.expenseItemName}]`) }}
              </div>
            </div>
          </template>
          <template v-else>{{ scope.row.productName }}</template>

          <!-- <div style="white-space: pre-wrap">{{ scope.row.description }}</div> -->
          <TablePropError v-if="scope.row['productNameError']" />
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        :label="$t('PURCHASE.productDescription')"
        header-align="center"
        align="left"
        min-width="200"
        :show-overflow-tooltip="false"
      >
        <template slot-scope="scope">
          <div>
            <descriptionEditDlg v-model="scope.row.description" :disabled="true" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="purchaseQty"
        :label="$t('PURCHASE.offeredQTY')"
        header-align="center"
        align="left"
        width="180"
      >
        <template slot="header">
          <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('PURCHASE.offeredQTY') }}
        </template>
        <template slot-scope="scope">
          <div :class="{ 'left-star': scope.row.pqResult === '1' }">
            <template v-if="!comDisFrom && scope.row.isExpenseItem !== '1'">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                v-if="scope.row.productId"
                style="width: 98%"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999"
                @change="purchaseQtyChange(scope.row)"
                size="mini"
              />
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.qtyLimit"
                @change="expenseItemQtyChange(scope.row)"
                :disabled="scope.row.isCanUpdate === '0'"
                size="mini"
                v-else
              />
            </template>

            <template v-else>
              <!-- <template>{{ $numberStr(scope.row.purchaseQty, scope.row.decimalNum) }}</template> -->
              <template v-if="scope.row.productId">{{
                $numberStr(
                  scope.row.purchaseQty,
                  scope.row.decimalNum,
                  scope.row.isAdhocEntry !== '1'
                )
              }}</template>
              <template v-if="!scope.row.productId">{{
                $numberStr(scope.row.qty, scope.row.decimalNum)
              }}</template>
            </template>

            <TablePropError v-if="scope.row['purchaseQtyError']" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="purchaseUom"
        :label="$t('PURCHASE.uom')"
        header-align="center"
        align="left"
        width="180"
      >
        <template slot="header">
          <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('PURCHASE.uom') }}
        </template>
        <template slot-scope="scope">
          <el-select
            v-if="
              scope.row.isAdhocEntry === '1' &&
              !comDisFrom &&
              scope.row.isExpenseItem !== '1' &&
              scope.row.productId
            "
            style="width: 98%"
            v-model="scope.row.purchaseUom"
            :title="showUomLabel(scope.row.purchaseUom)"
            placeholder=""
            @change="adhocEntryChangePurchaseUom(scope.row)"
            size="mini"
          >
            <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select
            v-else-if="
              !comDisFrom &&
              scope.row.isExpenseItem !== '1' &&
              scope.row.isProjectTempProduct !== '1' &&
              scope.row.productId
            "
            style="width: 98%"
            v-model="scope.row.purchaseUom"
            :title="showUomLabel(scope.row.purchaseUom)"
            @change="purchaseUomChange(scope.row)"
            placeholder=""
            size="mini"
          >
            <el-option
              v-for="item in scope.row.uomDataList || []"
              :key="item.uomName"
              :label="item.uomName"
              :value="item.uomName"
            >
            </el-option>
          </el-select>

          <template
            v-else-if="
              scope.row.isExpenseItem !== '1' &&
              scope.row.isProjectTempProduct !== '1' &&
              !scope.row.productId
            "
          >
            <template v-if="!comDisFrom">
              <!-- {{ scope.row.unit }} -->
              <el-select
                style="width: 98%"
                v-model="scope.row.unit"
                filterable
                :title="showUomLabel(scope.row.unit)"
                placeholder=""
                @change="adhocEntryChangePurchaseUom(scope.row)"
                :disabled="scope.row.isCanUpdate === '0'"
                size="mini"
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
            <span v-else-if="scope.row.unit" :title="showUomLabel(scope.row.unit)">{{
              scope.row.unit
            }}</span>
          </template>

          <span v-else :title="showUomLabel(scope.row.purchaseUom)">{{
            scope.row.purchaseUom
          }}</span>

          <TablePropError v-if="scope.row['purchaseUomError']" />
        </template>
      </el-table-column>

      <el-table-column
        prop="MOQ"
        label="MOQ"
        header-align="center"
        align="left"
        min-width="180"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-input-number
            v-thousandSplit="{ precision: scope.row.decimalNum }"
            v-if="!comDisFrom && scope.row.isExpenseItem !== '1' && scope.row.productId"
            style="width: 98%"
            v-model="scope.row.moq"
            controls-position="right"
            :precision="scope.row.decimalNum"
            :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
            :max="999999"
            size="mini"
          />
          <template v-else>{{ $numberStr(scope.row.moq, 2) }}</template>

          <TablePropError v-if="scope.row['moqError']" />
        </template>
      </el-table-column>

      <el-table-column
        prop="unitPrice"
        :label="$t('PURCHASE.unitPrice')"
        header-align="center"
        align="right"
        width="180"
        :key="currencySymbol + '_' + language"
      >
        <template slot="header">
          <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('PURCHASE.unitPrice') }}
          <span v-show="currencySymbol">({{ currencySymbol }})</span>
        </template>
        <template slot-scope="scope">
          <div :class="{ 'left-star': scope.row.pqResult === '1' }" :key="scope.row.rowTimeId">
            <template>
              <template v-if="scope.row.isExpenseItem === '1'">
                <el-input-number
                  v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                  style="width: 98%"
                  v-model="scope.row.amount"
                  controls-position="right"
                  :precision="6"
                  :min-precision="2"
                  :min="-999999999.99"
                  :max="999999999.99"
                  size="mini"
                  @change="amountChange(scope.row)"
                  v-if="!comDisFrom"
                />
                <template v-else>{{ $numberStr(scope.row.amount, 6, false, 2) }}</template>
              </template>

              <template v-else>
                <el-input-number
                  v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                  style="width: 98%"
                  v-model="scope.row.unitPrice"
                  controls-position="right"
                  :precision="6"
                  :min-precision="2"
                  :min="
                    scope.row.isCustomProduct === '1' || (scope.row.snNum || '').includes('.')
                      ? -999999999999.99
                      : 0.0
                  "
                  :max="999999999999.99"
                  @change="unitPriceChange(scope.row)"
                  size="mini"
                  v-if="!comDisFrom"
                />
                <template v-else>{{ $numberStr(scope.row.unitPrice, 6, false, 2) }}</template>
              </template>

              <TablePropError v-if="scope.row['unitPriceError']" />
            </template>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('PURCHASE.lineTotal')"
        header-align="center"
        align="right"
        width="180"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.isExpenseItem === '1'">
            {{ $numberStr(scope.row.amount, 6, false, 2) }}
          </div>
          <div v-if="scope.row.isExpenseItem !== '1'">
            {{ $numberStr(scope.row.lineTotal, 6, false, 2) }}
          </div>
          <!-- queryRowAmount(scope.row)  -->
        </template>
      </el-table-column>

      <el-table-column
        prop="leadTime"
        :label="$t('PURCHASE.leadTimeDays')"
        header-align="center"
        align="left"
        width="180"
        :show-overflow-tooltip="true"
      >
        <template slot="header">
          <span style="color: #ff4949; margin-right: 4px">*</span>{{ $t('PURCHASE.leadTimeDays') }}
        </template>
        <template slot-scope="scope">
          <div :class="{ 'left-star': scope.row.pqResult === '1' }">
            <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 0 }"
                  v-if="!comDisFrom && scope.row.isExpenseItem !== '1' && scope.row.productId"
                  style="width: 98%"
                  v-model="scope.row.leadTime"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="999"
                  size="mini"
                  @change="leadTimeChange(scope.row, scope.$index)"
                />
                <template v-else>{{ $numberStr(scope.row.leadTime, 0) }}</template>

                <TablePropError v-if="scope.row['leadTimeError']" />
              </div>
              <div class="fs-0" v-if="scope.row.leadTimeIsTimeOut === '1'">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <div v-if="scope.row.leadTimeIsTimeOut === '1'">
                      {{ scope.row.leadTimeIsTimeOutTips }}
                    </div>
                  </div>
                  <div class="flexCen">
                    <svg-icon icon-class="warning" class="ml10" style="height: 20px; width: 20px" />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="remarks"
        :label="$t('ui.remarks')"
        header-align="center"
        align="left"
        min-width="200"
        :show-overflow-tooltip="false"
      >
        <template slot-scope="scope">
          <div :class="{ 'left-star': scope.row.pqResult === '2' }">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ui.action')"
        key="action"
        align="center"
        width="120"
        class-name="small-padding fixed-width"
        fixed="right"
        v-if="isShowAction || (form.detailsOfExpensesList.length > 0 && !comDisFrom)"
      >
        <template slot-scope="scope">
          <div class="flexCen">
            <div style="width: 30px">
              <i
                class="el-icon-plus pointer mr10"
                style="font-size: 20px; color: #409eff"
                :title="$t('uiBtn.add')"
                v-if="
                  scope.row.productId &&
                  scope.row.isExpenseItem !== '1' &&
                  !comDisFrom &&
                  (scope.row.serviceSurchargeList || []).length < 8
                "
                @click="handleAddChild(scope.row)"
              ></i>
            </div>
            <div style="width: 20px">
              <i
                v-if="
                  scope.row.productId ? scope.row.isExpenseItem === '1' && !comDisFrom : !comDisFrom
                "
                class="el-icon el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                @click="handleDelRow(scope.$index, scope.row)"
              ></i>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectExpenseItemName from '@/views/purchaseManagement/purchaseQuotation/components/selectExpenseItemName'

export default {
  mixins: [pageMixin],
  components: {
    selectExpenseItemName
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
    currencyId: {
      type: String,
      default: ''
    },
    businessPartnerId: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    allUomList: {
      type: Array,
      default() {
        return []
      }
    },
    serviceSurchargeListOptions: {
      type: Array,
      default() {
        return []
      }
    },
    language: {
      type: String
    }
  },
  watch: {
    'form.purchaseQuotationDetailList': {
      immediate: true,
      handler: function () {
        this.tableList = JSON.parse(JSON.stringify(this.form.purchaseQuotationDetailList || []))
        this.tableList.forEach((item) => {
          item[this.rowIdKey] = item.productId
        })
        this.changeTableList()
        this.resetSnNum(this.tableList)
      }
    },
    'form.currencySymbol': {
      immediate: true,
      deep: true,
      handler: function () {
        this.currencySymbol = this.form.currencySymbol
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
    return {
      saveKey: '19',
      savePath: 'purchaseMTable',
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      tableList: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      chartData: {
        loading: false
      },
      chartOptions: {},
      detailsOfExpensesList: [],
      currencySymbol: '',
      timestamp: undefined
    }
  },
  computed: {
    comTableList() {
      const table = this.tableList || []
      const table2 = this.form.detailsOfExpensesList || []
      console.log(this.tableList, '=====================572')

      let timer = Date.now() + 10000
      table2.forEach((x) => {
        timer++
        if (!x.rowTimeId) {
          this.$set(x, 'rowTimeId', timer)
        }
        if (!x.isExpenseItem) {
          this.$set(x, 'isExpenseItem', '1')
        }
      })

      return [...table, ...table2]
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    isShowAction() {
      const comDisFrom = this.comDisFrom
      if (this.tableList.length <= 0) return false
      return this.tableList.find((x) => {
        // const showAddChild =
        //   x.isPhantom === '1' && !comDisFrom && (x.serviceSurchargeList || []).length < 8
        const showAddChild = !comDisFrom && (x.serviceSurchargeList || []).length < 8
        const showDel = !x.productId && x.isExpenseItem === '1' && !comDisFrom
        return showAddChild || showDel
      })
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getServiceSurchargeListOptions(options, row, index) {
      const findItem = this.tableList.find((item) => {
        return (item.serviceSurchargeList || []).find(
          (child) => child[this.rowIdKey] === row[this.rowIdKey]
        )
      })
      const filterList = []
      const list = (findItem || {}).serviceSurchargeList || []
      list.forEach((item, i) => {
        if (item[this.rowIdKey] !== row[this.rowIdKey] && item.expenseItemName) {
          filterList.push(item.expenseItemName)
        }
      })
      return options.filter((item) => !filterList.includes(item.expenseItemName))
    },
    getFieldExists(row) {
      const rowExpenseItemName = (row.expenseItemName || '').trim()
      if (!rowExpenseItemName) return false
      const findItem = this.tableList.find((item) => {
        return (item.serviceSurchargeList || []).find(
          (child) => child[this.rowIdKey] === row[this.rowIdKey]
        )
      })
      const list = (findItem || {}).serviceSurchargeList || []

      const exists = list.find(
        (item) =>
          item[this.rowIdKey] !== row[this.rowIdKey] &&
          (item.expenseItemName || '').trim() === rowExpenseItemName
      )
      return !!exists
    },
    getFieldExistsExpenseItem(row) {
      const expenseItem = (row.expenseItem || '').trim()
      if (!expenseItem) return false
      const list = (this.form.detailsOfExpensesList || []).filter(
        (x) => x.isExpenseItem === '1' && row.expenseItem && x[this.rowIdKey] !== row[this.rowIdKey]
      )
      const exists = list.find((item) => (item.expenseItem || '').trim() === expenseItem)
      return !!exists
    },
    productNameChange(data, row) {
      if (data.expenseItemName === row.expenseItemName) return
      this.$set(row, 'expenseItemName', data.expenseItemName)
      this.$set(row, 'includeDecimal', data.includeDecimal || '1')
      this.$set(row, 'decimalNum', data.includeDecimal === '0' ? 0 : 3)
      if (!(row.isCustom === '1' && data.isCustom === '1')) {
        this.$set(row, 'unit', data.unit)
      }
      this.$set(row, 'qtyLimit', data.qtyLimit)
      this.$set(row, 'isCustom', data.isCustom)
      this.$set(row, 'productNameError', false)
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.qtyLimit && row.qty > row.qtyLimit) {
        this.$set(row, 'qty', undefined)
        this.$set(row, 'lineTotal', undefined)
      }
    },
    handleCalculate() {
      this.$emit('handleCalculate')
    },
    handleAddExpenseItem() {
      const list = this.form.detailsOfExpensesList
      list.push({
        isExpenseItem: '1',
        whetherToTax: '1',
        rowTimeId: Date.now()
      })
      this.resetSnNum(this.tableList)
    },
    handleAddChild(row) {
      if (!row.serviceSurchargeList) {
        this.$set(row, 'serviceSurchargeList', [])
      }
      if (row.serviceSurchargeList) {
        const params = {
          rowTimeId: 'ss' + Date.now(),
          expenseItemName: '', // 费用项名称
          unit: undefined,
          unitPrice: undefined,
          includeDecimal: undefined,
          decimalNum: undefined,
          qtyLimit: undefined
        }
        const parentStage = row.snNum
        const curStage = (row.serviceSurchargeList || []).length + 1
        params.snNum = `${parentStage}.${curStage}`
        row.serviceSurchargeList.push(params)
      }
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        if (row.isExpenseItem === '1') {
          const list = this.form.detailsOfExpensesList || []
          const findindex1 = list.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
          if (findindex1 !== -1) {
            list.splice(findindex1, 1)
          }
        } else if (row.productId) {
          const findindex1 = this.tableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findindex1 !== -1) {
            this.tableList.splice(findindex1, 1)
          }
          const findindex2 = this.tableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findindex2 !== -1) {
            this.tableList.splice(findindex2, 1)
          }
        } else {
          this.tableList.find((item) => {
            const findChildIndex = (item.serviceSurchargeList || []).findIndex(
              (child) => child[this.rowIdKey] === row[this.rowIdKey]
            )
            if (findChildIndex !== -1) {
              item.serviceSurchargeList.splice(findChildIndex, 1)
              return true
            }
            return false
          })
        }
        this.resetSnNum(this.tableList)
      })
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
      if (this.form.detailsOfExpensesList) {
        let index = list.length
        this.form.detailsOfExpensesList.forEach((x) => {
          index++
          this.$set(x, 'snNum', index)
        })
      }
    },
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'externalPartNo':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            item.tooltip = vm.comDisFrom
            break
          case 'purchaseQty':
            item.fixedWidth = vm.comDisFrom ? undefined : 160
            item.tooltip = vm.comDisFrom
            break
          case 'purchaseUom':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'unitPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            item.tooltip = vm.comDisFrom
            break
          case 'MOQ':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            item.tooltip = vm.comDisFrom
            break
          case 'moq':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'leadTime':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
            break
          case 'warranty':
            item.fixedWidth = vm.comDisFrom ? undefined : 140
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
    setLastBasicUnitPrice(PriceData) {
      this.tableList.forEach((item) => {
        this.$set(item, 'lastBasicUnitPrice', PriceData[item.productId])
        this.$set(item, 'chartOptions', undefined)
      })
    },

    purchaseQtyChange(row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.handleCalculate()
    },
    expenseItemQtyChange(row) {
      if (row.qty) {
        row.qty = this.$num(row.qty, row.decimalNum)
      }
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (this.$resultOfBoolean(row.unitPrice) && row.qty) {
        const lineTotal = row.unitPrice * row.qty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
      this.handleCalculate()
    },
    adhocEntryChangePurchaseUom(row) {
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.purchaseUom === row.basicUom) {
        this.$set(row, 'purchaseUomCoefficient', '1')
      }
    },
    purchaseUomChange(row) {
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
      const selectItem = row.uomDataList.find((item) => item.uomName === row.purchaseUom)
      this.$set(row, 'purchaseUomCoefficient', selectItem.uomCoefficient)
    },
    unitPriceChange(row) {
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.handleCalculate()
    },
    amountChange(row) {
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.handleCalculate()
    },
    leadTimeChange(row, index) {
      this.$set(row, 'leadTimeError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && this.$resultOfBoolean(topRow.leadTime)) {
          const oldLeadTime = this.tableList.find(
            (item, index) =>
              index > 0 && this.$resultOfBoolean(item.leadTime) && item.leadTime !== topRow.leadTime
          )
          if (oldLeadTime) {
            const msg = this.$numberStr(topRow.leadTime, 0)
            this.$modal.confirm(this.$t('PURCHASE.leadTimeConfirm').replace('$1', msg)).then(() => {
              this.tableList.forEach((row1) => {
                this.$set(row1, 'leadTime', topRow.leadTime)
                this.$set(row1, 'leadTimeError', false)
                this.$set(row1, 'ROW-ERROR', false)
              })
              this.handleCalculate()
            })
          } else {
            this.tableList.forEach((row1) => {
              this.$set(row1, 'leadTime', topRow.leadTime)
              this.$set(row1, 'leadTimeError', false)
              this.$set(row1, 'ROW-ERROR', false)
            })
          }
        }
      }
      this.handleCalculate()
    },
    queryRowAmount(row) {
      if (row.isExpenseItem === '1') {
        return ''
      }

      if (this.$resultOfBoolean(row.purchaseQty) && this.$resultOfBoolean(row.unitPrice)) {
        const amount = ((row.purchaseQty * row.unitPrice * 100) / 100).toFixed(2)
        this.$set(row, 'amount', amount)
        return this.$numberStr(amount, 2)
      }

      return ''
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item) => {
          item.pqResult = '1'
        })
        this.tableList = [...this.tableList, ...rows]
        this.changeTableList()
      }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, this.tableList)
    },
    tableRowClassName({ row, rowIndex }) {
      return ''
    },
    tableCellClassName({ row, column }) {
      let cellClass = ''
      if (!row[column.property] && row[column.property + 'Error']) {
        cellClass = 'is-required-table-cell'
      }
      return cellClass
    },
    errorMessage(code) {
      // this.$emit('scrollPageToTable')

      let rowIndex
      this.comTableList.forEach((item, index) => {
        const isErr = code && !this.$resultOfBoolean(item[code])

        if (isErr) {
          if (code === 'productName' && item.isExpenseItem === '1') {
            if (!item.expenseItem) {
              this.$set(item, 'ROW-ERROR', true)
              this.$set(item, code + 'Error', true)
            }
          } else if (code === 'unitPrice' && item.isExpenseItem === '1') {
            if (!this.$resultOfBoolean(item.amount)) {
              this.$set(item, 'ROW-ERROR', true)
              this.$set(item, code + 'Error', true)
            }
          } else if (
            ['purchaseUom', 'purchaseQty'].indexOf(code) !== -1 &&
            item.isExpenseItem === '1'
          ) {
            this.$set(item, 'ROW-ERROR', false)
            this.$set(item, code + 'Error', false)
          } else {
            this.$set(item, 'ROW-ERROR', true)
            this.$set(item, code + 'Error', true)
          }

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
        /* 服务费用项必填校验 */
        if (['productName', 'purchaseQty', 'purchaseUom', 'unitPrice'].includes(code)) {
          const childList = item.serviceSurchargeList || []
          childList.forEach((child) => {
            if (code === 'productName') {
              if (!this.$resultOfBoolean(child.expenseItemName)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'ROW-ERROR', true)
              }
            }
            if (code === 'purchaseQty') {
              if (!this.$resultOfBoolean(child.qty)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'ROW-ERROR', true)
              }
            }
            if (code === 'purchaseUom') {
              if (!this.$resultOfBoolean(child.unit)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'ROW-ERROR', true)
              }
            }
            if (code === 'unitPrice') {
              if (!this.$resultOfBoolean(child.unitPrice)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'ROW-ERROR', true)
              }
            }
          })
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
.price-chart-box {
  width: 800px;
  height: 300px;
}

.tables {
  /deep/ .cell {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
  }
  /deep/ .el-table__indent {
    display: none;
  }
  /deep/ .el-table__placeholder {
    display: none;
  }
}
</style>
