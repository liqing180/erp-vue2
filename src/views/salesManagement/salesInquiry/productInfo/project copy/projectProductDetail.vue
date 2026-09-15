<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <!-- v-if="addAdhocEntryAuth" -->
      <!-- :disabled="!formData.businessPartnerId || !formData.currencyId" -->
      <el-col :span="1.5">
        <el-button
          @click="handleSddAdhocEntry"
          :loading="formData.tableLoading"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="addBtnShow"
          >{{ $t('menu.addAdhocEntry') }}</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          @click="handleAddProduct"
          :loading="formData.tableLoading"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="addBtnShow"
          >{{ $t('menu.addProduct') }}</el-button
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
      :key="tableTimerKey + modifyHighlight"
      border
      ref="tables"
      v-loading="formData.tableLoading || isLoading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      v-table-tab
      @row-click="handleRowClick"
      :max-height="tableMaxHeight"
    >
      <el-table-column
        type="index"
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
          <span
            v-if="
              [
                'salesInquiryProductType',
                'productName',
                'uom',
                'uomCoefficient',
                'qty',
                // 'unitPrice',
                'deliveryDateForDay'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'salesInquiryProductType' && !scope.row.isTotal">
            <el-select
              v-if="!comDisFrom && !disType && scope.row.productType !== '2' && scope.row.isEdit"
              style="width: 98%"
              v-model="scope.row.salesInquiryProductType"
              placeholder=""
              @change="salesInquiryProductTypeChange(scope.row)"
            >
              <el-option
                v-for="dict in dict.type.sales_inquiry_product_type"
                v-show="dict.value === '2' ? freeOfChargeProductAuth : true"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <template v-else>{{ scope.row[item.propBy] }}</template>
          </template>

          <template v-else-if="item.prop === 'salesPartNo' && !scope.row.isTotal">
            <el-input
              v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && scope.row.isEdit"
              style="width: 98%"
              :title="scope.row.salesPartNo"
              v-model="scope.row.salesPartNo"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'productName'">
            <template v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && scope.row.isEdit">
              <el-input
                style="width: 98%"
                :title="scope.row.productName"
                v-model="scope.row.productName"
                :maxlength="200"
                @input="
                  scope.row.productNameError = false
                  scope.row['ROW-ERROR'] = false
                "
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'description'">
            <descriptionEditDlg
              v-if="!comDisFrom && scope.row.isEdit"
              v-model="scope.row.description"
              :maxlength="7000"
            />
            <template v-else>
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
          </template>

          <template v-else-if="item.prop === 'partNo'">
            <el-input
              v-if="
                scope.row.isAdhocEntry === '1' &&
                !comDisFrom &&
                scope.row.productType !== '2' &&
                scope.row.isEdit
              "
              style="width: 98%"
              :title="scope.row.partNo"
              v-model="scope.row.partNo"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'brand'">
            <el-input
              v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && scope.row.isEdit"
              style="width: 98%"
              :title="scope.row.brand"
              v-model="scope.row.brand"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'purchaseQuotationNo' && !scope.row.isTotal">
            <DocumentNoLink
              :showStr="scope.row[item.prop]"
              moduleKey="purchaseQuotation"
              @click="nav(scope.row, item.prop)"
              v-if="scope.row[item.prop] !== 'ASL' && scope.row.isEdit"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
          <template v-else-if="item.prop === 'dateQuoted'">
            <span v-if="scope.row.purchaseQuotationNo !== 'ASL'">{{
              parseTime(scope.row.dateQuoted, fmtForYmdhms)
            }}</span>
            <span v-else>{{ parseTime(scope.row.dateQuoted, fmtForYmd) }}</span>
          </template>
          <template v-else-if="item.prop === 'uom' && !scope.row.isTotal">
            <template v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && scope.row.isEdit">
              <el-select
                style="width: 98%"
                v-model="scope.row.uom"
                :title="showUomLabel(scope.row.uom)"
                placeholder=""
                @change="
                  scope.row.uomError = false
                  scope.row['ROW-ERROR'] = false
                "
                filterable
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else-if="!comDisFrom && scope.row.productType !== '2' && scope.row.isEdit">
              <el-select
                style="width: 98%"
                v-model="scope.row.uom"
                :title="showUomLabel(scope.row.uom)"
                placeholder=""
                @change="rowUomChange(scope.row)"
                filterable
              >
                <el-option
                  v-for="item in scope.row.uomDataList"
                  :key="item.uomName"
                  :label="item.uomName"
                  :value="item.uomName"
                >
                </el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <span v-else :title="showUomLabel(scope.row[item.prop])">{{
              scope.row[item.prop]
            }}</span>
          </template>

          <template v-else-if="item.prop === 'uomCoefficient' && !scope.row.isTotal">
            <div
              class="flex"
              style="width: 98%"
              v-if="scope.row.productType !== '2' && scope.row.isEdit"
            >
              <el-input-number
                class="flex-1"
                v-model="scope.row.uomCoefficient"
                :disabled="
                  comDisFrom ||
                  scope.row.uom === scope.row.basicUom ||
                  scope.row.isAdhocEntry === '1'
                "
                controls-position="right"
                :precision="scope.row.includeDecimal === '1' ? 2 : 0"
                v-thousandSplit="{ precision: scope.row.includeDecimal === '1' ? 2 : 0 }"
                :min="1"
                :max="99999"
                @change="uomCoefficientChange(scope.row)"
              />
              <span class="fs-0 ml10" :title="showUomLabel(scope.row.basicUom)">{{
                scope.row.basicUom
              }}</span>
            </div>
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>

          <template v-else-if="item.prop === 'qty' && !scope.row.isTotal">
            <template v-if="!comDisFrom && scope.row.isEdit">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.qty"
                controls-position="right"
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999.999"
                @change="serviceQtyChange(scope.row)"
                :key="'qty11' + scope.row.decimalNum"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else>
              <div
                :title="
                  scope.row.qty && scope.row.uomCoefficient && scope.row.uomCoefficient > 1
                    ? $numberStr(scope.row.qty, scope.row.decimalNum) +
                      '' +
                      scope.row.uom +
                      ' = ' +
                      $numberStr(scope.row.qty * scope.row.uomCoefficient, scope.row.decimalNum) +
                      '' +
                      scope.row.basicUom
                    : ''
                "
              >
                {{
                  $numberStr(
                    scope.row[item.prop],
                    scope.row.decimalNum,
                    scope.row.isAdhocEntry !== '1'
                  )
                }}
              </div>
            </template>
          </template>
          <template v-else-if="item.prop === 'unitPrice' && !scope.row.isTotal">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>

            <!-- <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.unitPrice"
                  controls-position="right"
                  :precision="2"
                  :min="0"
                  :max="999999999999.99"
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
            <TablePropError v-if="scope.row[item.prop + 'Error']" /> -->
          </template>
          <template v-else-if="item.prop === 'unitCost' && !scope.row.isTotal">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'discountPer' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 3 }"
              v-if="!comDisFrom && scope.row.isEdit"
              style="width: 98%"
              v-model="scope.row.discountPer"
              controls-position="right"
              :precision="3"
              :min="0"
              :max="100"
              @change="discountPerChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 3) }}</template>
          </template>
          <template v-else-if="item.prop === 'targetMargin'">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-if="!comDisFrom && scope.row.isEdit"
              style="width: 98%"
              v-model="scope.row.targetMargin"
              controls-position="right"
              :precision="2"
              :min="0"
              :max="100"
              @change="targetMarginChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'discount' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-if="!comDisFrom && scope.row.isEdit"
              style="width: 98%"
              v-model="scope.row.discount"
              controls-position="right"
              :precision="2"
              :min="0"
              :max="(scope.row.qty || 0) * (scope.row.unitPrice || 0) || 999999999999.99"
              @change="discountChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'lineTotal'">
            <template v-if="!scope.row.isTotal">{{ $numberStr(scope.row[item.prop], 2) }}</template>
            <template v-else
              ><span v-if="formData.priceTbd === '1'">{{
                $numberStr(comLineTotal, 2)
              }}</span></template
            >
          </template>

          <template v-else-if="item.prop === 'pplUnitPrice'">
            <template v-if="checkPermi(['salesManagement:salesInquiry:purchasePrice'])">{{
              $numberStr(scope.row[item.prop], 2)
            }}</template>
          </template>
          <template v-else-if="item.prop === 'salesCost'">
            <template v-if="!scope.row.isTotal">
              <span v-if="scope.row.productType !== '2'">{{
                $numberStr(scope.row[item.prop], 2)
              }}</span>
            </template>
            <template v-else>{{ $numberStr(comSalesCost, 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'salesProfit'">
            <template v-if="!scope.row.isTotal">
              <span v-if="scope.row.productType !== '2'">{{
                $numberStr(scope.row[item.prop], 2)
              }}</span>
            </template>
            <template v-else>{{ $numberStr(comSalesProfit, 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'deliveryDateForDay' && !scope.row.isTotal">
            <template v-if="!comDisFrom && scope.row.isEdit">
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                style="width: 98%"
                v-model="scope.row.deliveryDateForDay"
                controls-position="right"
                :precision="0"
                :min="1"
                :max="999"
                @change="changeExpectedDeliveryDate(scope.$index, scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>

            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>

          <template v-else-if="item.prop === 'warranty' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 0 }"
              v-if="!comDisFrom && scope.row.isEdit"
              style="width: 98%"
              v-model="scope.row.warranty"
              controls-position="right"
              :precision="0"
              :min="0"
              :max="9999"
              @change="changeWarranty(scope.$index)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
          </template>
          <template v-else-if="item.prop === 'remarks' && !scope.row.isTotal">
            <descriptionEditDlg
              v-model="scope.row.remarks"
              :maxlength="200"
              :disabled="comDisFrom"
            />
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
              v-if="!scope.row.isTotal"
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.$index, scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <priceControlNoticeDlg
      ref="priceControlNoticeDlg"
      :formData="formData"
      pageType="salesInquiry"
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

    <!-- 新增产品 -->
    <selectProductTable
      ref="selectProductTable"
      :formData="formData"
      :isFather="true"
      @onSuccess="updateTable"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import {
  calculateOneDetail,
  queryCanSelectPPLListNoPage,
  calculate,
  submitButtonJudgmentDisplay
} from '@/api/salesManagement/salesInquiry'
import { queryAllUomList } from '@/api/system/uom'
import Sortable from 'sortablejs'
import priceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlg'
import priceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlgNoSubmit'
import totalPriceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlgNoSubmit'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
import selectProductTable from './selectProductTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type'],
  components: {
    priceControlNoticeDlg,
    priceControlNoticeDlgNoSubmit,
    totalPriceControlNoticeDlgNoSubmit,
    selectProductTable
  },
  props: {
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
    'formData.salesInquiryProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesInquiryProductList
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
        this.changeTableList()
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        // this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      tableTimerKey: Date.now(),
      saveKey: '1225',
      savePath: 'projectProductDetail',
      activeName: '1',
      columns: [
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          colMinWidth: 180,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          colMinWidth: 150,
          tooltip: false
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.salesQTY1'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'unitCost',
          label: vm.$t('SALES.unitCost1'),
          visible: true,
          colMinWidth: 150,
          tooltip: true,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'targetMargin',
          label: vm.$t('SALES.targetMargin1'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          colMinWidth: 150,
          tooltip: true,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'discountPer',
          label: vm.$t('SALES.discountPer'),
          visible: true,
          colMinWidth: 150,
          tooltip: true,
          padding: 50
        },
        {
          prop: 'discount',
          label: vm.$t('SALES.discount'),
          visible: true,
          colMinWidth: 150,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          colMinWidth: 150,
          tooltip: true,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'warranty',
          label: vm.$t('SALES.warrantyDays'),
          visible: true,
          colMinWidth: 150,
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
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      allUomList: [],
      rowIdKey: 'rowTimeId',
      curEditRow: null,
      isLoading: false
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },

    // comTableList() {
    //   if (this.salesCostAuth) {
    //     if (this.tableList.length > 1) {
    //       return [...this.tableList, { isTotal: '1' }]
    //     } else {
    //       return this.tableList
    //     }
    //   }
    //   return this.tableList
    // },
    comPurchasePriceAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:purchasePrice'])
    },
    comVisibleColumn() {
      const arr = [...this.visibleColumn]

      return arr
    },
    salesCostAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:salesCostProfit'])
    },
    comLineTotal() {
      const lineTotalList = this.tableList.map((item) => item.lineTotal)
      let total = 0
      lineTotalList.forEach((cost) => {
        if (cost) {
          total += cost
        }
      })
      return total
    },
    comSalesCost() {
      const list = this.tableList.filter((item) => item.productType !== '2')
      const salesCostList = list.map((item) => item.salesCost)
      let total = 0
      salesCostList.forEach((cost) => {
        if (cost) {
          total += cost
        }
      })
      return total
    },
    comSalesProfit() {
      let total = 0
      this.tableList.forEach((item) => {
        if (item.salesProfit && item.productType !== '2') {
          total += item.salesProfit
        }
      })
      return total
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    addBtnShow() {
      /* 项目类型的销售需求, 没有新增按钮 */
      if (this.comDisFrom) {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return true
    },

    // addAdhocEntryAuth() {
    //   if (this.comDisFrom) {
    //     return false
    //   }
    //   if (this.disInQuotation) {
    //     return false
    //   }
    //   return this.checkPermi(['salesManagement:salesInquiry:addAdhocEntry'])
    // },
    freeOfChargeProductAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:freeOfChargeProduct'])
    },
    disInQuotation() {
      return this.formData.salesInquiryStatus === '4'
    },
    disType() {
      let dis = false
      if (this.formData.salesInquiryStatus === '4') {
        dis = true
      }
      return dis
    },
    disPriceType() {
      let dis = false
      if (
        this.formData.salesInquiryStatus === '4' &&
        this.formData.salesInquiryType !== 'Project'
      ) {
        dis = true
      }
      return dis
    },
    disQty() {
      let dis = false
      if (
        this.formData.salesInquiryStatus === '4' &&
        this.formData.salesInquiryType !== 'Trading'
      ) {
        dis = true
      }
      return dis
    }
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.createdInitTimer = Date.now()
    this.queryAllUomList()
  },
  activated() {
    if (Date.now() - this.createdInitTimer < 1000) return
    this.queryAllUomList()
  },
  methods: {
    submitButtonJudgmentDisplay() {
      if (this.formData.salesInquiryType !== 'Trading') {
        this.$set(this.formData, 'showSubmitType', '1')
        return
      }
      if (!this.tableList.length === 0) {
        this.$set(this.formData, 'showSubmitType', '1')
        return
      }
      submitButtonJudgmentDisplay(this.formData).then((res) => {
        const data = res.data || {}
        this.$set(this.formData, 'showSubmitType', data.showSubmitType)
      })
    },
    priceTbdChange() {
      this.$nextTick(() => {
        this.$set(this.totalForm, 'isUpdateAmount', '0')
        this.$emit('handleCalculate')
      })
    },
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'salesInquiryProductType':
            item.colMinWidth = vm.comDisFrom || vm.disType ? undefined : 200
            break
          case 'purchaseQuotationNo':
            item.colMinWidth = !vm.comDisFrom && vm.disInQuotation ? 200 : undefined
            break
          case 'salesPartNo':
            item.colMinWidth = !vm.comDisFrom ? 140 : undefined
            break
          case 'description':
            item.colMinWidth = !vm.comDisFrom ? 160 : undefined
            break
          case 'priceType':
            item.colMinWidth = vm.comDisFrom || vm.disPriceType ? undefined : 200
            break
          case 'qty':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'partNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'brand':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'uom':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'unitCost':
            item.colMinWidth = vm.comDisFrom ? 100 : 140
            break
          case 'discountPer':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'discount':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'targetMargin':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break

          case 'warranty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'deliveryDateForDay':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'remarks':
            item.colMinWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    handleRowClick(row, column) {
      if (!column || !column.property) return
      if (this.curEditRow) {
        this.$set(this.curEditRow, 'isEdit', false)
      }
      this.$set(row, 'isEdit', true)
      this.curEditRow = row
    },
    errorMessage(code) {
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
    getList() {
      return this.tableList
    },
    salesInquiryProductTypeChange(row) {
      if (row.salesInquiryProductType === '2') {
        this.$set(row, 'taxAmountProcess', undefined)
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
    PQNoVisible(value, row) {
      const vm = this
      if (value) {
        const params = {
          currencyId: vm.formData.currencyId,
          productId: row.productId
        }
        if (!params.currencyId) {
          return
        }
        this.$set(row, 'PQNoLoading', true)
        queryCanSelectPPLListNoPage(params)
          .then((res) => {
            const list = res.data || []
            this.$set(row, 'pplList', list)
            this.$set(row, 'PQNoLoading', false)
          })
          .catch((err) => {
            this.$set(row, 'pplList', [])
            this.$set(row, 'PQNoLoading', false)
            window.console.error(err)
          })
      }
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
      this.$set(row, 'dateQuoted', selectRow.dateQuoted)
    },

    priceTypeChange(selectRow, row) {
      this.$set(row, 'priceType', selectRow.priceType)
      this.$set(row, 'priceTypeShowStr', selectRow.priceTypeShowStr)
      /* costOfGoods 与库存成本取max */
      this.$set(row, 'unitPriceForBase', selectRow.canUseUnitPrice)
      this.setRowUnitPrice(row)
      this.getLineTotal(row)
    },
    rowUomChange(row) {
      this.$set(row, 'uomError', false)
      this.$set(row, 'ROW-ERROR', false)

      const selectItem = row.uomDataList.find((item) => item.uomName === row.uom)
      this.$set(row, 'uomCoefficient', selectItem.uomCoefficient)
      this.setRowUnitPrice(row)
      this.queryRowTaxAmount(row)
    },
    uomCoefficientChange(row) {
      this.$set(row, 'uomCoefficientError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.setRowUnitPrice(row)
      this.queryRowTaxAmount(row)
    },
    setRowUnitPrice(row) {
      if (row.unitPriceForBase) {
        const unitPrice = row.unitPriceForBase * (row.uomCoefficient || 1)
        this.$set(row, 'unitPrice', unitPrice)
      }
      // originalUnitPriceForBase ("原始单价(系统带出的默认价格)(基础单位)")
      // minPriceForBase ("最低限价(基础单位)")
      // maxPriceForBase ("最高限价(基础单位)")
      if (row.originalUnitPriceForBase) {
        const originalUnitPrice = row.originalUnitPriceForBase * (row.uomCoefficient || 1)
        this.$set(row, 'originalUnitPrice', originalUnitPrice)
      }
      if (row.minPriceForBase) {
        const minPrice = row.minPriceForBase * (row.uomCoefficient || 1)
        this.$set(row, 'minPrice', minPrice)
      }
      if (row.maxPriceForBase) {
        const maxPrice = row.maxPriceForBase * (row.uomCoefficient || 1)
        this.$set(row, 'maxPrice', maxPrice)
      }
    },

    serviceQtyChange(row) {
      this.$set(row, 'qty-CELL-ERROR', false)
      this.$set(row, 'qtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$nextTick(() => {
        if (row.qty) {
          this.$set(row, 'qty', this.$num(row.qty, row.decimalNum))
          this.$set(row, 'pricingQty', this.$num(row.qty, row.decimalNum))
          this.$set(row, 'netQty', this.$num(row.qty, row.decimalNum))
        }
        this.getLineTotal(row)
      })
    },

    validCoefficientIsTrue(row) {
      if (!row.uomCoefficient || !row.qty) return true
      const { decimalPlaces, formulaStr } = getMultiplyDecimalPlaces(row.qty, row.uomCoefficient)
      if (row.includeDecimal === '1') {
        if (decimalPlaces <= 3) {
          return true
        } else {
          this.$modal.msgError(
            this.$t('SALES.validCoefficientErrForDecimal')
              .replace('$1', row.productName)
              .replace('$2', formulaStr)
          )
          return false
        }
      } else {
        if (decimalPlaces <= 0) {
          return true
        } else {
          this.$modal.msgError(
            this.$t('SALES.validCoefficientErr')
              .replace('$1', row.productName)
              .replace('$2', formulaStr)
          )
          return false
        }
      }
    },

    qtyChange(row, type) {
      if (type === 'unitPrice') {
        this.$set(row, 'unitPriceError', false)
      } else {
        this.$set(row, 'qtyError', false)
        this.validCoefficientIsTrue(row)
      }
      this.$set(row, 'ROW-ERROR', false)

      if (type === 'unitPrice' && !this.$resultOfBoolean(row.unitPrice)) {
        this.$set(row, 'isNeedTips', undefined)
      }
      this.$set(row, 'discountType', '2')
      this.getLineTotal(row, type)
    },
    discountPerChange(row) {
      if (this.$resultOfBoolean(row.discountPer)) {
        this.$set(row, 'discountType', '2')
      } else {
        this.$set(row, 'discountType', undefined)
        this.$set(row, 'discount', undefined)
      }
      this.getLineTotal(row, 'isCalculate')
    },
    targetMarginChange(row) {
      console.log(row.targetMargin, '===========1148')
      this.getLineTotal(row, 'isCalculate')
    },
    discountChange(row) {
      if (this.$resultOfBoolean(row.discount)) {
        this.$set(row, 'discountType', '1')
      } else {
        this.$set(row, 'discountType', undefined)
        this.$set(row, 'discountPer', undefined)
      }
      this.getLineTotal(row, 'isCalculate')
    },
    getLineTotal(row, type) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.qty
          if (row.salesInquiryProductType === '2') {
            row.discount = lineTotal
          } else if (row.discount > lineTotal) {
            row.discount = lineTotal
          }
          this.$set(row, 'lineTotal', lineTotal - (row.discount || 0))
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
        this.queryRowTaxAmount(row, type)
      })
    },
    queryRowTaxAmount(row, type) {
      // if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
      const timer = Date.now()
      row.queryTime = timer
      row.currencyId = this.formData.currencyId
      const params = {
        ...this.totalForm,
        discountType: row.discountType
      }
      this.isLoading = true

      calculate(params)
        .then((res) => {
          if (row.queryTime === timer) {
            const rowKey =
              this.totalForm.salesInquiryType === 'Project'
                ? 'salesInquiryProductId'
                : 'salesPartId'
            const { salesInquiryProductList } = res.data
            // 赋值
            const handlerProductList = (list = []) => {
              const resultMap = new Map()

              const buildMap = (data = []) => {
                data.forEach((item) => {
                  if (item.rowTimeId !== undefined && item.rowTimeId !== null) {
                    resultMap.set(String(item.rowTimeId), item)
                  }

                  if (item.childProductList && item.childProductList.length > 0) {
                    buildMap(item.childProductList)
                  }
                })
              }

              const updateList = (data = []) => {
                data.forEach((item) => {
                  const result = resultMap.get(String(item.rowTimeId))

                  if (result) {
                    this.$set(item, 'unitCost', result.unitCost)
                    this.$set(item, 'lineTotal', result.lineTotal)
                    this.$set(item, 'scrapRate', result.scrapRate)
                  }

                  if (item.childProductList && item.childProductList.length > 0) {
                    updateList(item.childProductList)
                  }
                })
              }

              buildMap(salesInquiryProductList || [])
              updateList(list)
            }
            handlerProductList(this.tableList)
            const data = salesInquiryProductList.find((x) => x[rowKey] === row[rowKey])

            // isNeedTips 1:最大  2:最小
            // const { isNeedTips } = data
            this.$set(row, 'unitPrice', data.unitPrice)
            this.$set(row, 'lineTotal', data.lineTotal)
            this.$set(row, 'taxAmountProcess', data.taxAmountProcess)
            this.$set(row, 'salesCost', data.salesCost)
            this.$set(row, 'salesProfit', data.salesProfit)
            this.$set(row, 'pplUnitPrice', data.pplUnitPrice)
            this.$set(row, 'discount', data.discount)
            this.$set(row, 'discountPer', data.discountPer)

            const totalForm = JSON.parse(JSON.stringify(res.data))
            this.$emit('updatePriceControlNotice', totalForm, 'totalForm')

            // (type === 'isCalculate' || !this.checkPermi(['salesManagement:salesInquiry:AllowSellingBelowCost']))
            // if (isNeedTips && ['1', '2'].indexOf(isNeedTips) !== -1 && type === 'isCalculate') {
            //   this.$refs.priceControlNoticeDlg.open(data, row, totalForm)
            // } else {
            //   this.$set(row, 'isNeedTips', data.isNeedTips)
            //   this.$set(row, 'maxPrice', data.maxPrice)
            //   this.$set(row, 'minPrice', data.minPrice)
            //   this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
            //   this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
            // }

            this.changeTableList()
            // this.calculateOneDetailRow(row, type)
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false

          this.closePriceControlNotice(row)
        })
      // } else {
      //   this.$set(row, 'lineTotal', undefined)
      //   this.$set(row, 'taxAmountProcess', undefined)
      //   this.$set(row, 'salesCost', undefined)
      //   this.$set(row, 'salesProfit', undefined)
      // }
    },
    calculateOneDetailRow(row, type) {
      const timer = Date.now()
      row.queryTime = timer

      calculateOneDetail(row).then((res) => {
        if (row.queryTime === timer) {
          const data = res.data || {}
          // isNeedTips 1:最大  2:最小
          const { isNeedTips } = data
          this.$set(row, 'unitPrice', data.unitPrice)
          this.$set(row, 'lineTotal', data.lineTotal)
          this.$set(row, 'taxAmountProcess', data.taxAmountProcess)
          this.$set(row, 'salesCost', data.salesCost)
          this.$set(row, 'salesProfit', data.salesProfit)
          this.$set(row, 'pplUnitPrice', data.pplUnitPrice)
          this.$set(row, 'discount', data.discount)
          this.$set(row, 'discountPer', data.discountPer)

          if (
            isNeedTips &&
            ['1', '2'].indexOf(isNeedTips) !== -1 &&
            (type === 'isCalculate' ||
              !this.checkPermi(['salesManagement:salesInquiry:AllowSellingBelowCost']))
          ) {
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
        if (!oldRow.discount) {
          this.$set(oldRow, 'discount', undefined)
        }
        if (!oldRow.discountPer) {
          this.$set(oldRow, 'discountPer', undefined)
        }
        Object.keys(oldRow).forEach((key) => {
          this.$set(row, key, oldRow[key])
        })
      }
    },
    changeExpectedDeliveryDate(index, row) {
      if (row) {
        this.$set(row, 'deliveryDateForDayError', false)
        this.$set(row, 'ROW-ERROR', false)
      }
      if (index === 0) {
        const topRow = this.tableList[0]
        if (topRow && topRow.deliveryDateForDay) {
          const oldExpectedDeliveryDate = this.tableList.find(
            (item, index) => index > 0 && item.deliveryDateForDay
          )
          if (oldExpectedDeliveryDate) {
            const msg = topRow.deliveryDateForDay
            this.$modal
              .confirm(this.$t('SALES.expectedDateForDayConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
                  this.$set(row, 'deliveryDateForDayError', false)
                  this.$set(row, 'ROW-ERROR', false)
                })
                this.setMaxExpectedDeliveryDate()
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
              this.$set(row, 'deliveryDateForDayError', false)
              this.$set(row, 'ROW-ERROR', false)
            })
          }
        }
      }
      this.setMaxExpectedDeliveryDate()
    },
    setMaxExpectedDeliveryDate() {
      const expectedDeliveryDateList1 = this.tableList.map((item) => item.deliveryDateForDay || 0)
      const max = Math.max(0, ...expectedDeliveryDateList1)
      if (max > 0) {
        this.$set(this.totalForm, 'deliveryDateForDay', max)
        this.$emit('deliveryDateForDayChange')
      } else {
        if (this.tableList.length > 0) {
          this.$set(this.totalForm, 'deliveryDateForDay', undefined)
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

    handleSddAdhocEntry() {
      const topRow = this.tableList[0] || {}

      this.tableList.push({
        isAdhocEntry: '1',
        salesInquiryProductType: '1',
        includeDecimal: '1',
        uomCoefficient: 1,
        decimalNum: 3,
        productType: '1',
        rowTimeId: Date.now(),
        deliveryDateForDay: this.totalForm.deliveryDateForDay,
        warranty: topRow.warranty,
        customIndex: 0,
        itemIndex: 10,
        childProductList: [],
        isEdit: false
      })
      // setTimeout(() => {
      //   this.setDragTable()
      // }, 200)
    },
    handleAddProduct() {
      const ids = this.tableList.filter((x) => x.productId).map((k) => k.productId)
      this.$refs.selectProductTable.handleAdd(ids)
    },

    updateTable(list) {
      // if (list.length > 0) {
      const topRow = this.tableList[0] || {}
      const rows = JSON.parse(JSON.stringify(list))
      rows.forEach((item, index) => {
        item.isEdit = false
        item.salesInquiryProductType = '1'
        item.rowTimeId = Date.now() + index
        item.customIndex = 0
        item.itemIndex = 10
        item.childProductList = []
        if (!this.$resultOfBoolean(item.deliveryDateForDay)) {
          item.deliveryDateForDay = this.totalForm.deliveryDateForDay
        }
        if (!this.$resultOfBoolean(item.warranty)) {
          item.warranty = topRow.warranty
        }
      })
      // this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      this.submitButtonJudgmentDisplay()
    },
    changeTableList() {
      const allList = JSON.parse(JSON.stringify(this.tableList || []))
      allList.forEach((item) => {
        this.$set(item, 'unitCost', this.$numberStr(item.unitCost, 2))
        this.$set(item, 'unitPrice', this.$numberStr(item.unitPrice, 2))
        this.$set(item, 'lineTotal', this.$numberStr(item.lineTotal, 2))
        this.$set(item, 'scrapRate', this.$numberStr(item.scrapRate, 2))
        this.$set(item, 'pricingQty', this.$numberStr(item.pricingQty, 3))
        this.$set(item, 'qty', this.$numberStr(item.qty, 3))
        this.$set(item, 'netQty', this.$numberStr(item.netQty, 3))
        this.$set(item, 'lineTotalPricingCost', this.$numberStr(item.lineTotalPricingCost, 2))
      })
      // this.$$getColumnContentMaxWidth(this.columns, allList)
      // setTimeout(() => {
      //   this.setDragTable()
      // }, 200)
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.changeExpectedDeliveryDate()
        this.submitButtonJudgmentDisplay()
      })
    },
    tableRowClassName({ row, rowIndex }) {
      let color = ''
      if (this.modifyHighlight) {
        if (row.updateType === '2') {
          color = 'new-add-row'
        } else if (row.updateType === '3') {
          color = 'cancel-row'
        }
      }
      const cur = this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (cur) {
        color = 'table-SelectedRow-bgcolor'
      }
      if (row['ROW-ERROR'] && row.customIndex === 0) {
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
    setDragTable() {
      this.destroyDraggable()
      if (this.comDisFrom) return
      const el = this.$refs.tables.$el.querySelectorAll(
        '.el-table__fixed-body-wrapper > table > tbody'
      )[0]

      if (!el) return
      // 获取合计行的索引（始终是最后一行）
      const totalRowIndex = this.comTableList.length - 1

      this.sortableDom = Sortable.create(el, {
        handle: '.allowDrag',
        animation: 100,
        ghostClass: 'blue-background-class',
        // 1. 过滤掉合计行，禁止选中合计行进行拖拽
        filter: (item) => {
          // 找到当前行对应的数据源（通过DOM行索引匹配）
          const rowIndex = Array.from(el.children).indexOf(item)
          const rowData = this.comTableList[rowIndex]
          return rowData?.isTotal === '1'
        },
        // 2. 拖拽移动时，阻止拖到合计行/拖合计行
        onMove: (e) => {
          if (this.salesCostAuth) {
            const { dragged, related } = e
            const draggedIndex = Array.from(el.children).indexOf(dragged)
            const relatedIndex = Array.from(el.children).indexOf(related)
            // 禁止拖拽合计行，或拖到合计行位置
            if (draggedIndex === totalRowIndex || relatedIndex === totalRowIndex) {
              return false
            }
          }
        },

        onEnd: (evt) => {
          // 若操作的是合计行，直接返回
          if (
            (evt.oldIndex === totalRowIndex || evt.newIndex === totalRowIndex) &&
            this.salesCostAuth
          ) {
            return
          }

          if (evt.oldIndex === evt.newIndex) return
          const list = this.tableList || []
          const targetRow = list.splice(evt.oldIndex, 1)[0]
          list.splice(evt.newIndex, 0, targetRow)
          this.tableTimerKey++
          // setTimeout(() => {
          //   this.setDragTable()
          // }, 200)
        }
      })
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
