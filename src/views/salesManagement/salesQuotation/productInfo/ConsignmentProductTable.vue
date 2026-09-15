<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          @click="handleAddBtn"
          v-if="addBtnShow"
          :disabled="!businessPartnerId || !formData.currencyId || !formData.priceTypeId"
          :loading="formData.tableLoading"
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
      <!-- <div class="footer-content">
        <div>{{ $t('SALES.productQTY') }} / {{ $t('SALES.quoted') }}</div>
        ：
        <div>
          {{ tableList.length }} / {{ tableList.filter((o) => o.purchaseQuotationNo).length }}
        </div>
      </div> -->
    </el-row>
    <el-table
      border
      ref="tables"
      v-loading="formData.tableLoading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      v-table-tab
      :key="'table' + modifyHighlight"
    >
      <!-- <el-table-column
        :selectable="selectable"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column> -->
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
              ['qty', 'unitPrice', 'consignmentAmount', 'taxNo', 'deliveryDateForDay'].includes(
                item.prop
              )
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'qty'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                @change="qtyChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>
          <template v-else-if="item.prop === 'unitPrice'">
            <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.unitPrice"
                  controls-position="right"
                  :precision="2"
                  :min="0"
                  :max="scope.row.consignmentAmount || 999999999999.99"
                  @change="qtyChange(scope.row, 'unitPrice')"
                  v-if="!comDisFrom"
                />
                <div :title="$numberStr(scope.row[item.prop], 2)" v-else>
                  {{ $numberStr(scope.row[item.prop], 2) }}
                </div>
              </div>
              <div
                class="fs-0"
                v-if="scope.row.isNeedTips && ['1', '2'].indexOf(scope.row.isNeedTips) !== -1"
              >
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <div v-if="scope.row.isNeedTips === '1'">
                      {{
                        $t('SALES.unitPriceHigh').replace('$1', $numberStr(scope.row.maxPrice, 2))
                      }}
                    </div>
                    <div v-if="scope.row.isNeedTips === '2'">
                      {{
                        $t('SALES.unitPriceLow').replace('$1', $numberStr(scope.row.minPrice, 2))
                      }}
                    </div>
                    <div class="mt10">{{ $t('SALES.priceExceeds') }}</div>
                    <div class="mt10">{{ $t('SALES.compulsoryApproval') }}</div>
                  </div>
                  <svg-icon icon-class="warning" class="ml10" style="height: 20px; width: 20px" />
                </el-tooltip>
              </div>
            </div>
            <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
          </template>
          <!-- <template v-else-if="item.prop === 'consignmentAmount'">
            <template v-if="!comDisFrom">
              <el-input-number
                v-thousandSplit="{ precision: 2 }"
                style="width: 98%"
                v-model="scope.row.consignmentAmount"
                controls-position="right"
                :precision="2"
                :min="scope.row.unitPrice || 0.01"
                :max="999999999999.99"
              />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template> -->

          <template v-else-if="item.prop === 'lineTotal'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'taxNo'">
            <template v-if="!comDisFrom">
              <el-select
                style="width: 98%"
                v-model="scope.row.taxNo"
                :loading="scope.row.taxLoading"
                :disabled="!countryId"
                @visible-change="
                  (value) => {
                    taxNoVisible(value, scope.row)
                  }
                "
                @change="taxNoChange(scope.row)"
                placeholder=""
              >
                <el-option
                  v-for="item in scope.row.taxNoOptions || []"
                  :key="item.taxNo"
                  :label="item.taxNo"
                  :value="item.taxNo"
                >
                  <span
                    ><span class="mr20">{{ item.taxNo }}</span>
                    {{
                      `${item.country} (${selectDictLabel(dict.type.tax_type, item.taxType)})`
                    }}</span
                  >
                </el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'taxAmount'">
            <el-tooltip
              :disabled="!scope.row.taxAmountProcess"
              :content="scope.row.taxAmountProcess"
              placement="top"
              effect="light"
            >
              <span class="ellipsis-text">{{ $numberStr(scope.row[item.prop], 2) }}</span>
            </el-tooltip>
          </template>

          <template v-else-if="item.prop === 'deliveryDateForDay'">
            <template v-if="!comDisFrom">
              <!-- <el-date-picker
                v-model="scope.row.deliveryDate"
                :picker-options="timeDatePickerOptions"
                @change="changeExpectedDeliveryDate(scope.$index, row)"
                :format="fmtForYmd"
                value-format="timestamp"
                style="width: 98%"
                placeholder=""
                clearable
              ></el-date-picker> -->

              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                style="width: 98%"
                v-model="scope.row.deliveryDateForDay"
                controls-position="right"
                :precision="0"
                :min="0"
                :max="999"
                @change="changeExpectedDeliveryDate(scope.$index, scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + '-CELL-ERROR']" />
            </template>

            <template v-else>{{ $numberStr(scope.row.deliveryDateForDay, 0) }}</template>
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
              @change="changeWarranty(scope.$index)"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks'">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
          </template>
          <template v-else-if="item.prop === 'uom'">
            <span :title="showUomLabel(scope.row[item.prop])">{{ scope.row[item.prop] }}</span>
          </template>
          <template v-else-if="item.prop === 'description'">
            <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
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
        :fixed="false"
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

    <selectConsignmentProductTable
      :formData="formData"
      ref="selectProductTable"
      @onSuccess="updateTable"
    />

    <priceControlNoticeDlg
      ref="priceControlNoticeDlg"
      :formData="formData"
      pageType="salesQuotation"
      @updatePriceControlNotice="updatePriceControlNotice"
      @closePriceControlNotice="closePriceControlNotice"
    />
    <priceControlNoticeDlgNoSubmit
      ref="priceControlNoticeDlgNoSubmit"
      :formData="formData"
      @closePriceControlNotice="closePriceControlNotice"
    />

    <totalPriceControlNoticeDlgNoSubmit
      ref="totalPriceControlNoticeDlgNoSubmit"
      :formData="formData"
      @closePriceControlNotice="closePriceControlNotice"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectConsignmentProductTable from '../components/selectConsignmentProductTable'
import { queryAllTaxForSales } from '@/api/system/tax'
// import { calculateOneDetail } from '@/api/salesManagement/salesInquiry'
import { calculate, calculateOneDetail } from '@/api/salesManagement/salesQuotation'

import priceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlg'
import priceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlgNoSubmit'
import totalPriceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlgNoSubmit'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type', 'tax_type'],
  components: {
    selectConsignmentProductTable,
    priceControlNoticeDlg,
    priceControlNoticeDlgNoSubmit,
    totalPriceControlNoticeDlgNoSubmit
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
    'formData.salesQuotationProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesQuotationProductList
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
        this.tableList.forEach((item) => {
          this.$set(item, 'exchangeRateDesc', this.formData.exchangeRateDesc)
        })
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
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          fixed: true,
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
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false
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
          prop: 'qty',
          label: vm.$t('SALES.salesQTY1'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.consignmentCost'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          padding: 70,
          align: 'right'
        },
        /* {
          prop: 'consignmentAmount',
          label: vm.$t('SALES.consignmentPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        }, */

        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'exchangeRateDesc',
          label: vm.$t('menu.exchangeRate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        // {
        //   prop: 'taxAmount',
        //   label: vm.$t('SALES.taxAmount'),
        //   visible: true,
        //   minWidth: 140,
        //   // tooltip: true,
        //   padding: 50,
        //   align: 'right'
        // },
        {
          prop: 'warranty',
          label: vm.$t('SALES.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalForm: {},
      tableList: [],
      tableListCopy: [],
      selected: [],
      sortableDom: undefined,
      rowIdKey: 'productId',
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
      return false
    },
    disInQuotation() {
      return this.formData.salesQuotationStatus === '4'
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
          case 'qty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'consignmentAmount':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'taxNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'leadTime':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'warranty':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'deliveryDateForDay':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'remarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
        }
      })
    },
    errorMessage(code) {
      this.tableList.forEach((item) => {
        if (!this.$resultOfBoolean(item[code])) {
          this.$set(item, code + 'Error', true)
        }
      })
    },
    getList() {
      return this.tableList
    },

    qtyChange(row, type) {
      if (type === 'unitPrice') {
        this.$set(row, 'unitPrice-CELL-ERROR', false)
        this.$set(row, 'ROW-ERROR', false)
      } else {
        this.$set(row, 'qty-CELL-ERROR', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      this.$set(row, 'consignmentCost', row.unitPrice)
      if (type === 'unitPrice' && !this.$resultOfBoolean(row.unitPrice)) {
        this.$set(row, 'isNeedTips', undefined)
      }
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.qty
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
        this.queryRowTaxAmount(row)
      })
    },
    taxNoVisible(value, row) {
      const vm = this
      if (value) {
        const params = {
          countryId: vm.countryId,
          productId: row.productId
        }
        if (!params.countryId) {
          return
        }
        this.$set(row, 'taxLoading', true)
        queryAllTaxForSales(params)
          .then((res) => {
            const list = res.data || []
            this.$set(row, 'taxNoOptions', list)
            this.$set(row, 'taxLoading', false)
          })
          .catch((err) => {
            this.$set(row, 'taxNoOptions', [])
            this.$set(row, 'taxLoading', false)
            window.console.error(err)
          })
      }
    },
    taxNoChange(row) {
      this.$set(row, 'taxNo-CELL-ERROR', false)
      this.$set(row, 'ROW-ERROR', false)
      this.queryRowTaxAmount(row)
    },
    queryRowTaxAmount(row) {
      if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
        const timer = Date.now()
        row.queryTime = timer
        row.currencyId = this.formData.currencyId

        const params = {
          ...this.totalForm,
          salesQuotationProductList: this.totalForm.salesQuotationProductList.filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          ),
          salesQuotationServiceList: this.totalForm.salesQuotationServiceList.filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          )
        }

        calculate(params)
          .then((res) => {
            if (row.queryTime === timer) {
              const { salesQuotationProductList } = res.data
              const data = salesQuotationProductList.find((x) => x.productId === row.productId)
              // isNeedTips 1:最大  2:最小
              const { isNeedTips } = data
              this.$set(row, 'lineTotal', data.lineTotal)
              this.$set(row, 'taxAmount', data.taxAmount)
              this.$set(row, 'taxAmountProcess', data.taxAmountProcess)

              const totalForm = JSON.parse(JSON.stringify(res.data))

              if (isNeedTips && ['1', '2'].indexOf(isNeedTips) !== -1) {
                this.$refs.priceControlNoticeDlg.open(data, row, totalForm)
              } else {
                this.$set(row, 'isNeedTips', data.isNeedTips)
                this.$set(row, 'maxPrice', data.maxPrice)
                this.$set(row, 'minPrice', data.minPrice)
                this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
                this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
              }
              this.changeTableList()
            }
            // this.calculateOneDetailRow(row)
          })
          .catch(() => {
            this.closePriceControlNotice(row)
          })
      } else {
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'taxAmount', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
      }
    },
    calculateOneDetailRow(row, type) {
      const timer = Date.now()
      row.queryTime = timer

      calculateOneDetail(row).then((res) => {
        if (row.queryTime === timer) {
          const data = res.data || {}
          // isNeedTips 1:最大  2:最小
          const { isNeedTips } = data
          this.$set(row, 'lineTotal', data.lineTotal)
          this.$set(row, 'taxAmount', data.taxAmount)
          this.$set(row, 'taxAmountProcess', data.taxAmountProcess)

          if (isNeedTips && ['1', '2'].indexOf(isNeedTips) !== -1) {
            this.$refs.priceControlNoticeDlg.open(data, row)
          } else {
            this.$set(row, 'isNeedTips', data.isNeedTips)
            this.$set(row, 'maxPrice', data.maxPrice)
            this.$set(row, 'minPrice', data.minPrice)
            this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
          }
          this.changeTableList()
        }
      })
    },
    updatePriceControlNotice(data, row, totalForm) {
      this.$set(row, 'isNeedTips', data.isNeedTips)
      this.$set(row, 'maxPrice', data.maxPrice)
      this.$set(row, 'minPrice', data.minPrice)
      this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
      // 更新外层总金额
      this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
    },
    closePriceControlNotice(row) {
      const list = this.tableListCopy.filter((x) => x.productId === row.productId)
      if (list.length > 0) {
        const oldRow = list[0]
        Object.keys(oldRow).forEach((key) => {
          this.$set(row, key, oldRow[key])
        })
      }
    },
    changeExpectedDeliveryDate(index, row) {
      if (row) {
        this.$set(row, 'deliveryDateForDay-CELL-ERROR', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDateForDay) {
          const oldExpectedDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDateForDay
          )
          if (oldExpectedDeliveryDate) {
            const msg = this.parseTime(topRow.deliveryDateForDay, this.fmtForYmd)
            this.$modal
              .confirm(this.$t('SALES.expectedDeliveryDateConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
                })
                this.setMaxExpectedDeliveryDate()
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
            })
          }
        }
      }
      this.setMaxExpectedDeliveryDate()
    },
    setMaxExpectedDeliveryDate() {
      const expectedDeliveryDateList1 = this.tableList.map((item) => item.deliveryDateForDay || 0)
      const expectedDeliveryDateList2 = this.formData.salesQuotationServiceList.map(
        (item) => item.deliveryDateForDay || 0
      )
      const max = Math.max(0, ...expectedDeliveryDateList1, ...expectedDeliveryDateList2)
      if (max > 0) {
        this.$set(this.totalForm, 'deliveryDateForDay', max)
      } else {
        if (this.tableList.length > 0) {
          this.$set(this.totalForm, 'deliveryDateForDay', Date.now())
        } else {
          this.$set(this.totalForm, 'deliveryDateForDay', undefined)
        }
      }
    },
    changeWarranty(index) {
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && this.$resultOfBoolean(topRow.warranty)) {
          const oldDeliveryDate = this.tableList.find(
            (item, index) =>
              index > 0 && this.$resultOfBoolean(item.warranty) && item.warranty !== topRow.warranty
          )
          if (oldDeliveryDate) {
            const msg = this.$numberStr(topRow.warranty, 0)
            this.$modal
              .confirm(this.$t('SALES.warrantyDaysConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'warranty', topRow.warranty)
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'warranty', topRow.warranty)
            })
          }
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
          item.unitPrice = undefined
          item.consignmentAmount = undefined
          item.remarks = ''
        })
        if (this.tableList && this.tableList.length > 0) {
          const topRow = this.tableList[0]
          if (topRow && topRow.warranty) {
            rows.forEach((row) => {
              if (!row.warranty) {
                this.$set(row, 'warranty', topRow.warranty)
              }
            })
          }
        }
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
    requiredError(code) {
      let rowIndex
      this.tableList.forEach((item, index) => {
        if (code && !this.$resultOfBoolean(item[code])) {
          if (code === 'unitPrice') {
            if (item.isAdhocEntry !== '1') {
              this.$set(item, 'ROW-ERROR', true)
              this.$set(item, code + '-CELL-ERROR', true)
              if (!this.$resultOfBoolean(rowIndex)) {
                rowIndex = index
              }
            }
          } else {
            this.$set(item, 'ROW-ERROR', true)
            this.$set(item, code + '-CELL-ERROR', true)
            if (!this.$resultOfBoolean(rowIndex)) {
              rowIndex = index
            }
          }
        } else {
          this.$set(item, 'ROW-ERROR', false)
          if (code) {
            this.$set(item, code + '-CELL-ERROR', false)
          } else {
            Object.keys(item).forEach((key) => {
              if (key.endsWith('-CELL-ERROR')) {
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
        this.tableList.find(
          (item) => !item[column.property] && item[column.property + '-CELL-ERROR']
        )
      ) {
        cellClass = 'is-required-table-cell'
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
