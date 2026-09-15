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
      <el-col :span="1.5" v-if="addAdhocEntryAuth">
        <el-button
          @click="handleSddAdhocEntry"
          :disabled="!businessPartnerId || !formData.currencyId"
          :loading="formData.tableLoading"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('menu.addAdhocEntry') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="addCustomBtnShow">
        <el-button
          @click="handleAddCustom"
          :disabled="!businessPartnerId || !formData.currencyId"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          >{{ $t('PRODUCT.addCustom') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="reQuoteBtnShow">
        <el-button
          :disabled="selected.length <= 0"
          :loading="reQuoteLoading"
          @click="handleReQuote"
          type="primary"
          size="mini"
          >{{ $t('menu.reQuote') }}</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="returnBtnShow">
        <el-button @click="handleReturn" type="primary" size="mini">{{
          $t('menu.return')
        }}</el-button>
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
        <el-form
          label-width="180px"
          class="mr20"
          v-if="['Trading', 'Service'].indexOf(totalForm.salesInquiryType) !== -1"
        >
          <el-form-item :label="`${$t('SALES.priceTbd')}`" style="margin-bottom: 0">
            <el-switch
              v-model="totalForm.priceTbd"
              active-value="1"
              inactive-value="0"
              @change="priceTbdChange"
              :disabled="comDisFrom"
            ></el-switch>
            <el-tooltip placement="top">
              <div slot="content">
                <div v-html="$t('switchTip.priceTbdTip')"></div>
              </div>
              <i class="el-icon-info ml10"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>

        <div>{{ $t('SALES.productQTY') }} / {{ $t('SALES.quoted') }}</div>
        ：
        <div>
          {{ tableList.length }} / {{ tableList.filter((o) => o.purchaseQuotationNo).length }}
        </div>
      </div>
    </el-row>
    <el-table
      :key="tableTimerKey + modifyHighlight"
      border
      ref="tables"
      v-loading="formData.tableLoading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="comTableList"
      @select="handleSelectionChange"
      @select-all="handleSelectAll"
      row-key="rowTimeId"
      v-table-tab
    >
      <el-table-column
        v-if="reQuoteBtnShow"
        :selectable="selectable"
        type="selection"
        key="selection"
        align="center"
        width="55"
      ></el-table-column>
      <el-table-column
        type="index"
        :label="$t('ui.sn')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.isTotal">{{ scope.$index + 1 }}</span>
          <span v-else style="opacity: 0">10</span>
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
                disInQuotation ? 'purchaseQuotationNo' : '',
                'uom',
                'uomCoefficient',
                'qty',
                'unitPrice',
                formData.salesInquiryStatus && formData.salesInquiryStatus !== '1'
                  ? 'deliveryDateForDay'
                  : ''
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
              v-if="!comDisFrom && !disType && scope.row.productType !== '2'"
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
              v-if="scope.row.isAdhocEntry === '1' && !comDisFrom"
              style="width: 98%"
              :title="scope.row.salesPartNo"
              v-model="scope.row.salesPartNo"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'productName'">
            <template v-if="scope.row.isAdhocEntry === '1' && !comDisFrom">
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
            <el-input
              v-if="scope.row.isAdhocEntry === '1' && !comDisFrom"
              style="width: 98%"
              :title="scope.row.description"
              v-model="scope.row.description"
              :maxlength="7000"
            />
            <template v-else>
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
          </template>

          <template v-else-if="item.prop === 'partNo'">
            <el-input
              v-if="scope.row.isAdhocEntry === '1' && !comDisFrom && scope.row.productType !== '2'"
              style="width: 98%"
              :title="scope.row.partNo"
              v-model="scope.row.partNo"
              :maxlength="200"
            />
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'brand'">
            <el-input
              v-if="scope.row.isAdhocEntry === '1' && !comDisFrom"
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
              v-if="scope.row[item.prop] !== 'ASL'"
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
            <template v-if="scope.row.isAdhocEntry === '1' && !comDisFrom">
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
            <template v-else-if="!comDisFrom && scope.row.productType !== '2'">
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
            <div class="flex" style="width: 98%" v-if="scope.row.productType !== '2'">
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
            <template v-if="!comDisFrom && !disQty">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.qty"
                controls-position="right"
                v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="scope.row.isAdhocEntry === '1' ? 999999999 : 999"
                :disabled="comDisFrom"
                @change="serviceQtyChange(scope.row)"
                v-if="scope.row.isTemp === '1' || scope.row.isAdhocEntry === '1'"
                :key="'qty11' + scope.row.decimalNum"
              />
              <el-input-number
                v-else
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                style="width: 98%"
                v-model="scope.row.qty"
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
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                @change="qtyChange(scope.row)"
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
            <div class="flexSb">
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
            <TablePropError v-if="scope.row[item.prop + 'Error']" />
          </template>
          <template v-else-if="item.prop === 'discountPer' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 3 }"
              v-if="
                !comDisFrom &&
                scope.row.salesInquiryProductType === '1' &&
                scope.row.productType !== '2'
              "
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
          <template v-else-if="item.prop === 'discount' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-if="
                !comDisFrom &&
                scope.row.salesInquiryProductType === '1' &&
                scope.row.productType !== '2'
              "
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
            <template v-if="!comDisFrom">
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
              v-if="!comDisFrom"
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
        :fixed="false"
        v-if="addBtnShow"
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

    <selectProductAndServiceTable
      :formData="formData"
      ref="selectProductAndServiceTable"
      @onSuccess="updateTable"
    />
    <addCustomDlg ref="addCustomDlg" :comDisFrom="comDisFrom" @onSuccess="updateCustomTable" />
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
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import selectProductAndServiceTable from '../components/selectProductAndServiceTable'
import {
  calculateOneDetail,
  queryCanSelectPPLListNoPage,
  reQuote,
  calculate,
  submitButtonJudgmentDisplay
} from '@/api/salesManagement/salesInquiry'
import { queryAllUomList } from '@/api/system/uom'
import Sortable from 'sortablejs'
import addCustomDlg from '@/views/salesManagement/serviceOrder/components/addCustomDlg.vue'
import priceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlg'
import priceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlgNoSubmit'
import totalPriceControlNoticeDlgNoSubmit from '@/views/salesManagement/salesInquiry/productInfo/totalPriceControlNoticeDlgNoSubmit'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type'],
  components: {
    selectProductAndServiceTable,
    addCustomDlg,
    priceControlNoticeDlg,
    priceControlNoticeDlgNoSubmit,
    totalPriceControlNoticeDlgNoSubmit
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
    'formData.productOrServiceList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.productOrServiceList
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
        this.tableList.forEach((item) => {
          item.isOldSelect = '1'
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
      tableTimerKey: Date.now(),
      saveKey: '25',
      savePath: 'salesMTable',
      activeName: '1',
      columns: [
        // {
        //   prop: 'salesInquiryProductType',
        //   propBy: 'salesInquiryProductTypeShowStr',
        //   label: vm.$t('ui.type'),
        //   visible: true,
        //   minWidth: 200,
        //   fixed: false,
        //   tooltip: true
        // },
        {
          prop: 'salesPartNo',
          label: vm.$t('PRODUCT.salesPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 200,
          colMinWidth: 180,
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
          minWidth: 160,
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
          prop: 'purchaseQuotationNo',
          label: vm.$t('SALES.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'dateQuoted',
          label: vm.$t('SALES.dateQuoted'),
          visible: true,
          minWidth: 160,
          colMinWidth: 160,
          tooltip: true
        },
        {
          prop: 'pplUnitPrice',
          label: vm.$t('SALES.purchasePrice'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right',
          padding: 50
        },

        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        // {
        //   prop: 'uomCoefficient',
        //   label: vm.$t('PRODUCT.ratio'),
        //   visible: true,
        //   minWidth: 200,
        //   colMinWidth: 200,
        //   tooltip: true
        // },
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
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'discountPer',
          label: vm.$t('SALES.discountPer'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50
        },
        {
          prop: 'discount',
          label: vm.$t('SALES.discount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },

        {
          prop: 'salesCost',
          label: vm.$t('SALES.salesCost'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'salesProfit',
          label: vm.$t('SALES.salesProfit'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'warranty',
          label: vm.$t('SALES.warrantyDays'),
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
      // rowIdKey: 'salesPartId',
      reQuoteLoading: false,
      popoverData: {},
      queryTotalTime: Date.now(),
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      allUomList: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    rowIdKey() {
      if (this.formData.salesInquiryType === 'Project') {
        return 'salesInquiryProductId'
      } else {
        return 'rowTimeId'
      }
    },
    comTableList() {
      if (this.salesCostAuth) {
        if (this.tableList.length > 1) {
          return [...this.tableList, { isTotal: '1' }]
        } else {
          return this.tableList
        }
      }
      return this.tableList
    },
    comPurchasePriceAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:purchasePrice'])
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      if (!this.salesCostAuth) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'salesCost' && item.prop !== 'salesProfit'
          return is
        })
      }

      if (this.formData.salesInquiryType === 'Project') {
        arr = arr.filter((item) => {
          const is = item.prop !== 'warranty' && item.prop !== 'deliveryDateForDay'
          return is
        })
      }
      if (!this.comPurchasePriceAuth) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'pplUnitPrice'
          return is
        })
      }
      if (this.formData.salesInquiryStatus === '1' || !this.formData.salesInquiryStatus) {
        arr = arr.filter((item) => {
          const is = ![
            'unitPrice',
            'discountPer',
            'discount',
            'lineTotal',
            'salesCost',
            'salesProfit'
          ].includes(item.prop)
          return is
        })
      }
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
      if (this.formData.salesInquiryType === 'Project') {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return true
    },
    addCustomBtnShow() {
      if (this.comDisFrom) {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return true
    },
    addAdhocEntryAuth() {
      if (this.comDisFrom) {
        return false
      }
      if (this.disInQuotation) {
        return false
      }
      return this.checkPermi(['salesManagement:salesInquiry:addAdhocEntry'])
    },
    freeOfChargeProductAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:freeOfChargeProduct'])
    },
    reQuoteBtnShow() {
      const isView = this.$route.query.isView
      if (isView === '1') {
        return false
      }
      if (!this.checkPermi(['salesManagement:salesInquiry:reQuote'])) {
        return false
      }
      return this.disInQuotation
    },
    returnBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:return'])) {
        return false
      }
      const buttonAuthMsg = this.formData.buttonAuthMsg || {}
      return buttonAuthMsg.isCanReturnMaterialList === '1'
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
            item.colMinWidth = vm.comDisFrom || vm.disQty ? undefined : 140
            break
          case 'partNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'brand':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break
          case 'uom':
            item.colMinWidth = vm.comDisFrom ? undefined : 100
            break

          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'discountPer':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'discount':
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
      if (this.$resultOfBoolean(row.qty) && this.$resultOfBoolean(row.unitPrice)) {
        const timer = Date.now()
        row.queryTime = timer
        row.currencyId = this.formData.currencyId
        const params = {
          ...this.totalForm,
          discountType: row.discountType,
          expenseItemList: (this.totalForm.expenseItemList || []).filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          ),
          salesInquiryProductList: (this.totalForm.salesInquiryProductList || []).filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          ),
          salesInquiryServiceList: (this.totalForm.salesInquiryServiceList || []).filter(
            (x) => this.$resultOfBoolean(x.qty) && this.$resultOfBoolean(x.unitPrice)
          )
        }
        this.selected.forEach((row) => {
          this.tableList.forEach((item, index) => {
            if (row[this.rowIdKey] === item[this.rowIdKey]) {
              this.$refs.tables.toggleRowSelection(item, true)
            }
          })
        })
        calculate(params)
          .then((res) => {
            if (row.queryTime === timer) {
              const rowKey =
                this.totalForm.salesInquiryType === 'Project'
                  ? 'salesInquiryProductId'
                  : 'salesPartId'
              const { productOrServiceList } = res.data
              const data = productOrServiceList.find((x) => x[rowKey] === row[rowKey])

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

              const totalForm = JSON.parse(JSON.stringify(res.data))
              // (type === 'isCalculate' || !this.checkPermi(['salesManagement:salesInquiry:AllowSellingBelowCost']))
              if (isNeedTips && ['1', '2'].indexOf(isNeedTips) !== -1 && type === 'isCalculate') {
                this.$refs.priceControlNoticeDlg.open(data, row, totalForm)
              } else {
                this.$set(row, 'isNeedTips', data.isNeedTips)
                this.$set(row, 'maxPrice', data.maxPrice)
                this.$set(row, 'minPrice', data.minPrice)
                this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
                this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
              }

              this.changeTableList()
              this.$nextTick(() => {
                this.selected.forEach((row) => {
                  this.tableList.forEach((item, index) => {
                    if (row[this.rowIdKey] === item[this.rowIdKey]) {
                      this.$refs.tables.toggleRowSelection(item, true)
                    }
                  })
                })
              })
              // this.calculateOneDetailRow(row, type)
            }
          })
          .catch(() => {
            this.closePriceControlNotice(row)
          })
      } else {
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
        this.$set(row, 'salesCost', undefined)
        this.$set(row, 'salesProfit', undefined)
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
        warranty: topRow.warranty
      })
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },

    handleAddBtn() {
      const tableList = JSON.parse(JSON.stringify(this.tableList))
      this.$refs.selectProductAndServiceTable.handleAdd(tableList)
    },
    updateTable(list) {
      // if (list.length > 0) {
      const topRow = this.tableList[0] || {}
      const rows = JSON.parse(JSON.stringify(list))
      rows.forEach((item, index) => {
        if (item.isOldSelect !== '1') {
          item.salesInquiryProductType = '1'
          item.remarks = ''
          item.rowTimeId = Date.now() + index
          if (!this.$resultOfBoolean(item.deliveryDateForDay)) {
            item.deliveryDateForDay = this.totalForm.deliveryDateForDay
          }
          if (!this.$resultOfBoolean(item.warranty)) {
            item.warranty = topRow.warranty
          }
        }
        item.isOldSelect = '1'
      })
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
      this.submitButtonJudgmentDisplay()
    },
    // 新增自定义服务产品
    handleAddCustom() {
      this.$refs.addCustomDlg.handleAdd()
    },
    handleEditRow(row) {
      this.$refs.addCustomDlg.handleEdit(row)
    },
    updateCustomTable(row) {
      if (row) {
        const newRow = JSON.parse(JSON.stringify(row))
        newRow.rowTimeId = newRow.customId
        newRow.productType = '2'
        const findIndex = this.tableList.findIndex((item) => item.customId === row.customId)
        if (findIndex !== -1) {
          this.$set(this.tableList, findIndex, newRow)
          this.qtyChange(newRow)
        } else {
          const topRow = this.tableList[0] || {}
          this.$set(newRow, 'deliveryDateForDay', this.totalForm.deliveryDateForDay)
          this.$set(newRow, 'warranty', topRow.warranty)
          this.tableList.push(newRow)
        }
        this.changeTableList()
      }
    },

    changeTableList() {
      this.$nextTick(() => {
        this.$$getColumnContentMaxWidth(this.columns, this.comTableList)
      })
      setTimeout(() => {
        this.setDragTable()
      }, 200)
    },
    // 选中多个重新报价
    handleReQuote() {
      this.$modal
        .confirm(this.$t('SALES.reQuoteConfirm'))
        .then(() => {
          this.reQuoteLoading = true
          return reQuote({
            salesInquiryId: this.formData.salesInquiryId,
            batchIdList: this.selected.map((item) => item.salesInquiryProductId)
          })
        })
        .then((response) => {
          this.reQuoteLoading = false
          this.$modal.msgSuccess(this.$t('SALES.reQuoteSuccess'))
          this.selected = []
          this.$refs.tables.clearSelection()
        })
        .catch(() => {
          this.reQuoteLoading = false
        })
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        this.tableList.splice(index, 1)
        this.changeExpectedDeliveryDate()
        this.submitButtonJudgmentDisplay()
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
        } else if (row.updateType === '3') {
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
    selectable(row, rowIndex) {
      if (row.isTotal) {
        return false
      }
      return true // 不禁用
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
          setTimeout(() => {
            this.setDragTable()
          }, 200)
        }
      })
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },

    handleReturn() {
      this.$emit('handleReturn', 'materialList')
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
