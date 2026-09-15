<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          v-if="!comDisFrom"
          @click="handleImport"
          >{{ $t('uiBtn.import') }}</el-button
        >
      </el-col>
      <right-toolbar
        :showSearchBtn="false"
        :showRefreshBtn="false"
        :saveKey="saveKey"
        :savePath="savePath"
        :columns="configColumn.filter((item) => item.prop !== 'productName')"
        :columnsInit="columns.filter((item) => item.prop !== 'productName')"
      ></right-toolbar>
    </el-row>
    <el-table
      :key="tableTimerKey + modifyHighlight"
      border
      ref="tables"
      class="tables"
      v-loading="formData.tableLoading || isLoading"
      :row-class-name="tableRowClassName"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      :row-key="rowIdKey"
      :tree-props="{ children: 'childProductList', hasChildren: 'hasChildren' }"
      :default-expand-all="true"
      lazy
      v-table-tab
      :max-height="tableMaxHeight"
    >
      <el-table-column
        type="index"
        :label="$t('SALES.level')"
        width="60"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.customIndex + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        :label="$t('SALES.item')"
        width="80"
        fixed="left"
        align="center"
        class-name="allowDrag"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.itemIndex }}</span>
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
        :fixed="item.prop === 'productName' ? 'left' : item.fixed"
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
                'unitCost',
                'deliveryDateForDay',
                'netQty'
              ].includes(item.prop)
            "
          >
            <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
          </span>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="scope">
          <template v-if="item.prop === 'productName'">
            <div
              class="level"
              v-if="
                scope.row.customIndex > 0 &&
                (!scope.row.childProductList || scope.row.childProductList.length <= 0)
              "
            >
              <svg-icon icon-class="level" style="color: #dfdfdf; font-size: 20px" />
            </div>
            <div
              class="flexCCol"
              style="flex: 1"
              v-if="
                (scope.row.isAdhocEntry === '1' || scope.row.isProjectTempProduct === '1') &&
                !comDisFrom
              "
            >
              <div class="flexStart" style="flex: 1">
                <el-input
                  style="flex: 1"
                  :title="scope.row.productName"
                  v-model="scope.row.productName"
                  :maxlength="200"
                  @input="
                    scope.row.productNameErrorChildren = false
                    scope.row['ROW-ERROR-CHILDREN'] = false
                  "
                />
                <i
                  class="el-icon-search pointer"
                  style="font-size: 20px; color: #409eff; margin-left: 5px"
                  @click="handleProductTable(scope.row)"
                  v-if="scope.row.customIndex > 0 && !scope.row.productId"
                ></i>
              </div>

              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
            </div>

            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>

          <template v-else-if="item.prop === 'description'">
            <descriptionEditDlg
              v-if="!comDisFrom"
              v-model="scope.row.description"
              :maxlength="7000"
              style="flex: 1"
            />
            <template v-else>
              <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
            </template>
          </template>

          <template v-else-if="item.prop === 'partNo'">
            <el-input
              v-if="
                (scope.row.isAdhocEntry === '1' || scope.row.isProjectTempProduct === '1') &&
                !comDisFrom &&
                scope.row.productType !== '2'
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
              v-if="
                (scope.row.isAdhocEntry === '1' || scope.row.isProjectTempProduct === '1') &&
                !comDisFrom
              "
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
            <template
              v-if="
                (scope.row.isAdhocEntry === '1' || scope.row.isProjectTempProduct === '1') &&
                !comDisFrom
              "
            >
              <el-select
                style="width: 98%"
                v-model="scope.row.uom"
                :title="showUomLabel(scope.row.uom)"
                placeholder=""
                @change="
                  scope.row.uomErrorChildren = false
                  scope.row['ROW-ERROR-CHILDREN'] = false
                "
                filterable
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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
            <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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

          <template v-else-if="item.prop === 'netQty'">
            <template v-if="!comDisFrom">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.netQty"
                controls-position="right"
                v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                :min="0.001"
                :max="999999.999"
                @change="netQtyChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
            </template>
            <template v-else>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template>
          </template>

          <template v-else-if="item.prop === 'scrapRate'">
            <template v-if="!comDisFrom && scope.row.customIndex > 0">
              <el-input-number
                style="width: 100%"
                v-model="scope.row.scrapRate"
                controls-position="right"
                v-thousandSplit="{ precision: 2 }"
                :min="0.01"
                :max="100"
                @change="scrapRateChange(scope.row)"
              />
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
            </template>
            <template v-else>{{
              $numberStr(scope.row[item.prop], scope.row.decimalNum, scope.row.isAdhocEntry !== '1')
            }}</template>
          </template>

          <template v-else-if="item.prop === 'unitCost' && !scope.row.isTotal">
            <div class="flexSb">
              <div class="flow1">
                <el-input-number
                  v-thousandSplit="{ precision: 2 }"
                  style="width: 98%"
                  v-model="scope.row.unitCost"
                  controls-position="right"
                  :precision="2"
                  :min="0"
                  :max="999999999999.99"
                  @change="qtyChange(scope.row, 'unitCost')"
                  v-if="
                    !comDisFrom &&
                    (!scope.row.childProductList || scope.row.childProductList.length <= 0)
                  "
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
            <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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
              :max="(scope.row.qty || 0) * (scope.row.unitCost || 0) || 999999999999.99"
              @change="discountChange(scope.row)"
            />
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>
          <template v-else-if="item.prop === 'lineTotalPricingCost'">
            <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'pricingQty'">
            {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
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
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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
        fixed="right"
        v-if="addBtnShow"
      >
        <template slot-scope="scope">
          <div class="flexCen" style="flex: 1">
            <i
              class="el-icon-plus pointer mr10"
              style="font-size: 20px; color: #409eff"
              :title="$t('uiBtn.add')"
              @click="handleAddChild(scope.row)"
              v-if="scope.row.customIndex < 6"
            ></i>

            <i
              class="el-icon-delete pointer"
              style="font-size: 20px; color: #f56c6c"
              :title="$t('uiBtn.delete')"
              @click="handleDelRow(scope.row)"
              v-if="scope.row.customIndex !== 0"
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

    <ImportDlg ref="importDlg" :importOptions="importOptions" @onSuccess="updateTableList" />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import { calculateOneDetail, calculate } from '@/api/salesManagement/salesQuotation'
import { queryAllUomList } from '@/api/system/uom'
import priceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlg'

import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type'],
  components: {
    priceControlNoticeDlg
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
    'formData.salesOrderProductList': {
      immediate: true,
      handler: function (selected) {
        this.tableList = this.formData.salesOrderProductList
        if (this.tableListCopy.length <= 0) {
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
        }
        // this.tableList.forEach((item) => {
        //   item.isOldSelect = '1'
        // })
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
      saveKey: '1226',
      savePath: 'projectCostDetails',
      activeName: '1',
      columns: [
        // {
        //   prop: 'level',
        //   label: vm.$t('SALES.level'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'item',
        //   label: vm.$t('SALES.item'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 300,
          // colMinWidth: 300,
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
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 160,
          tooltip: false
        },
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'netQty',
          label: vm.$t('SALES.netQty'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'scrapRate',
          label: vm.$t('SALES.scrapRate'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'pricingQty',
          label: vm.$t('SALES.pricingQty'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'unitCost',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'lineTotalPricingCost',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
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
      // 导入
      importOptions: {
        // 下载模板
        downFileUrl: '/sales/projectCost/downTemplate',
        // 上传校验
        uploadUrl: process.env.VUE_APP_BASE_API + '/sales/projectCost/checkImportData',
        // 提交导入
        importUrl: '/sales/projectCost/importData',
        // 下载文件名
        fileName: 'Project Cost'
      },
      rowIdKey: 'rowTimeId',
      rowTimeId: '',
      row: {},
      isLoading: false
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
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
    // 产品新增子集
    handleAddChild(row) {
      const { customIndex } = row
      const topRow = this.tableList[0] || {}
      const index = customIndex * 1 + 1
      row.unitCost = undefined
      row.lineTotal = undefined
      this.$set(row, 'ROW-ERROR-CHILDREN', false)
      this.$set(row, 'unitCostErrorChildren', false)
      if (row.childProductList && typeof row.childProductList === 'object') {
        row.childProductList.push({
          isProjectTempProduct: '1',
          salesInquiryProductType: '1',
          includeDecimal: '1',
          uomCoefficient: 1,
          decimalNum: 3,
          productType: '1',
          rowTimeId: Date.now(),
          deliveryDateForDay: this.totalForm.deliveryDateForDay,
          warranty: topRow.warranty,
          customIndex: index,
          childProductList: []
        })
      } else {
        row.childProductList = [
          {
            isProjectTempProduct: '1',
            salesInquiryProductType: '1',
            includeDecimal: '1',
            uomCoefficient: 1,
            decimalNum: 3,
            productType: '1',
            rowTimeId: Date.now(),
            deliveryDateForDay: this.totalForm.deliveryDateForDay,
            warranty: topRow.warranty,
            customIndex: index,
            childProductList: []
          }
        ]
      }
      console.log(this.tableList, '============857')
      this.changeTableList()
    },
    // 当前行选择已有产品，可选单个和多个
    handleProductTable(row) {
      this.row = row || {}
      // 获取同级别的productId
      // const targetRowTimeId = String(row.rowTimeId)
      // let sameLevelList = []

      // const findSameLevelList = (list = []) => {
      //   if (list.some((item) => String(item.rowTimeId) === targetRowTimeId)) {
      //     sameLevelList = list
      //     return true
      //   }

      //   return list.some((item) => {
      //     const children = item.childProductList || []
      //     return children.length > 0 && findSameLevelList(children)
      //   })
      // }

      // findSameLevelList(this.tableList)
      // console.log(sameLevelList, '==============1015')
      // const ids = sameLevelList.filter((item) => item.productId).map((item) => item.productId)

      const ids = this.getRelatedProductIds(this.tableList, row.rowTimeId)
      // console.log('合并去重后的 IDs:', ids)
      const isChildren = row.childProductList && row.childProductList.length
      // isChildren true 表示有子级， 产品需要单选
      this.$refs.selectProductTable.handleAdd(ids, isChildren)
    },
    /**
     * 根据 rowTimeId 在树形结构中提取相关 ID，并合并去重
     * @param {Array} tree - 完整的 tableList
     * @param {String|Number} targetRowTimeId - 点击行的 rowTimeId
     * @returns {Array} 合并去重后的 productId 数组
     */
    getRelatedProductIds(tree, targetRowTimeId) {
      const result = {
        parents: [],
        siblings: [],
        children: []
      }

      const findNodeAndPath = (nodes, path) => {
        for (const node of nodes) {
          const currentPath = [...path, node]

          if (node.rowTimeId === targetRowTimeId) {
            // 1. 提取父级 IDs
            result.parents = currentPath.map((n) => n.productId).filter(Boolean)

            // 2. 提取同级别 IDs
            const parentChildren = path.length > 0 ? path[path.length - 1].childProductList : tree
            result.siblings = (parentChildren || []).map((n) => n.productId).filter(Boolean)

            // 3. 提取所有子级 IDs
            const collectChildren = (children) => {
              if (!children || children.length === 0) return
              children.forEach((child) => {
                if (child.productId) result.children.push(child.productId)
                collectChildren(child.childProductList)
              })
            }
            collectChildren(node.childProductList)

            return true
          }

          if (node.childProductList && findNodeAndPath(node.childProductList, currentPath)) {
            return true
          }
        }
        return false
      }

      findNodeAndPath(tree, [])

      // 🌟 核心修改：将三个数组合并，并使用 Set 去除重复的 ID
      const mergedIds = [...result.parents, ...result.siblings, ...result.children]

      // 返回去重后的数组
      return [...new Set(mergedIds)]
    },
    // 更新产品
    updateChildTable(list = []) {
      console.log(list, '==============850')
      console.log(this.row.rowTimeId, '==============850')

      if (list.length > 0) {
        const isChildren = this.row.childProductList && this.row.childProductList.length
        const rows = JSON.parse(JSON.stringify(list))
        rows.forEach((item, index) => {
          item.salesInquiryProductType = '1'
          item.rowTimeId = Date.now() + index
          item.customIndex = this.row.customIndex
          // 如果当前行有子级，需要将当前行的子级，赋值到新选择的产品行中
          if (isChildren) {
            item.childProductList = JSON.parse(JSON.stringify(this.row.childProductList))
          } else {
            item.childProductList = []
          }
        })
        console.log(rows, '============896')
        this.updateChildList(this.tableList, rows)
        this.delAndAddCalculate()
      }
      console.log(this.tableList, '==========899')
    },
    updateChildList(data, rows) {
      data.forEach((x, i) => {
        if (x.rowTimeId === this.row.rowTimeId) {
          data.splice(i, 1, ...rows)
          return
        }
        if (x.childProductList) {
          this.updateChildList(x.childProductList, rows)
        }
      })
    },

    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importDlg.show()
    },
    updateTableList(e) {
      const { data } = e
      const rows = JSON.parse(JSON.stringify(data))
      const handlerSalesInquiryProductList = (list) => {
        let rowTimeId = Date.now()
        const handleList = (currentList, customIndex = 0) => {
          currentList.forEach((item) => {
            // 每条记录都生成唯一的 rowTimeId
            item.rowTimeId = rowTimeId++
            item.customIndex = customIndex
            if (item.childProductList && item.childProductList.length > 0) {
              handleList(item.childProductList, customIndex + 1)
            } else {
              item.childProductList = []
            }
          })
        }
        // handleList(list)
        // 每个第一层对象都从 0 级开始
        list.forEach((item) => {
          handleList([item], 0)
        })
      }
      handlerSalesInquiryProductList(rows || [])
      this.tableList.length = 0
      this.tableList.push(...rows)
      this.changeTableList()
    },
    changeTableList() {
      this.resetStageNum(this.tableList)
      const allList = []
      this.tableList.forEach((item) => {
        allList.push(item)
        if (item.childProductList) {
          item.childProductList.forEach((child) => {
            allList.push({
              ...child
            })
          })
          allList.push(...item.childProductList)
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, allList)

      // this.$nextTick(() => {
      //   this.$$getColumnContentMaxWidth(this.columns, this.tableList)
      // })
    },
    // 重置阶段名称前面的序号
    resetStageNum(list) {
      let itemIndex = 10
      list.forEach((item, index) => {
        item.itemIndex = itemIndex
        itemIndex += 10
        // 如果当前节点有子节点，递归查找
        if (item.childProductList && item.childProductList.length > 0) {
          this.resetStageNum(item.childProductList)
        }
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
            item.colMinWidth = !vm.comDisFrom && !vm.disPriceType ? 140 : undefined
            break
          case 'productName':
            item.colMinWidth = vm.comDisFrom ? undefined : 300
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
          case 'netQty':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'scrapRate':
            item.colMinWidth = vm.comDisFrom || vm.disQty ? undefined : 140
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

          case 'unitCost':
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
    rowUomChange(row) {
      this.$set(row, 'uomErrorChildren', false)
      this.$set(row, 'ROW-ERROR-CHILDREN', false)

      const selectItem = row.uomDataList.find((item) => item.uomName === row.uom)
      this.$set(row, 'uomCoefficient', selectItem.uomCoefficient)
      this.setRowUnitPrice(row)
      this.queryRowTaxAmount(row)
    },
    uomCoefficientChange(row) {
      this.$set(row, 'uomCoefficientErrorChildren', false)
      this.$set(row, 'ROW-ERROR-CHILDREN', false)

      this.setRowUnitPrice(row)
      this.queryRowTaxAmount(row)
    },
    setRowUnitPrice(row) {
      if (row.unitPriceForBase) {
        const unitPrice = row.unitPriceForBase * (row.uomCoefficient || 1)
        this.$set(row, 'unitCost', unitPrice)
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
      this.$set(row, 'qtyErrorChildren', false)
      this.$set(row, 'ROW-ERROR-CHILDREN', false)
      this.$nextTick(() => {
        if (row.qty) {
          this.$set(row, 'qty', this.$num(row.qty, row.decimalNum))
        }
        this.getLineTotal(row)
      })
    },

    scrapRateChange(row) {
      this.$set(row, 'scrapRate-CELL-ERROR', false)
      this.$set(row, 'scrapRateErrorChildren', false)
      this.$set(row, 'ROW-ERROR-CHILDREN', false)
      this.$nextTick(() => {
        if (row.scrapRate) {
          this.$set(row, 'scrapRate', this.$num(row.scrapRate, 2))
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
      if (type === 'unitCost') {
        this.$set(row, 'unitCostErrorChildren', false)
      } else {
        this.$set(row, 'qtyErrorChildren', false)
        this.validCoefficientIsTrue(row)
      }
      this.$set(row, 'ROW-ERROR-CHILDREN', false)

      if (type === 'unitCost' && !this.$resultOfBoolean(row.unitCost)) {
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
    netQtyChange(row) {
      this.$set(row, 'netQty-CELL-ERROR', false)
      this.$set(row, 'netQtyErrorChildren', false)
      this.$set(row, 'ROW-ERROR-CHILDREN', false)
      this.$nextTick(() => {
        if (row.netQty) {
          this.$set(row, 'netQty', this.$num(row.netQty, row.decimalNum))
          this.$set(row, 'pricingQty', this.$num(row.netQty, row.decimalNum))
          this.$set(row, 'qty', this.$num(row.netQty, row.decimalNum))
        }
        this.getLineTotal(row)
      })
    },
    getLineTotal(row, type) {
      this.$nextTick(() => {
        // if (this.$resultOfBoolean(row.netQty) && this.$resultOfBoolean(row.unitCost)) {
        // const lineTotal = row.unitCost * row.netQty
        // if (row.salesInquiryProductType === '2') {
        //   row.discount = lineTotal
        // } else if (row.discount > lineTotal) {
        //   row.discount = lineTotal
        // }
        // this.$set(row, 'lineTotal', lineTotal - (row.discount || 0))
        // } else {
        //   this.$set(row, 'lineTotal', undefined)
        // }
        this.queryRowTaxAmount(row, type)
      })
    },
    queryRowTaxAmount(row, type) {
      if (this.$resultOfBoolean(row.netQty) && this.$resultOfBoolean(row.unitCost)) {
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
            this.isLoading = false
            if (row.queryTime === timer) {
              const { salesOrderProductList } = res.data
              const handlerSalesInquiryProductList = (list) => {
                const handleList = (currentList, customIndex = 0) => {
                  currentList.forEach((item) => {
                    item.isSalesInquiryProject = '1'
                    item.customIndex = customIndex
                    if (item.childProductList && item.childProductList.length > 0) {
                      handleList(item.childProductList, customIndex + 1)
                    } else {
                      item.childProductList = []
                    }
                  })
                }
                // handleList(list)
                // 每个第一层对象都从 0 级开始
                list.forEach((item) => {
                  handleList([item], 0)
                })
              }
              handlerSalesInquiryProductList(salesOrderProductList || [])

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

                buildMap(salesOrderProductList || [])
                updateList(list)
              }
              handlerProductList(this.tableList)
              console.log(this.tableList, '================1409')

              const totalForm = JSON.parse(JSON.stringify(res.data))

              this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
              this.$emit('updatePriceControlNotice', totalForm, 'totalForm')

              this.changeTableList()
            }
          })
          .catch(() => {
            this.isLoading = false
            this.closePriceControlNotice(row)
          })
      } else {
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'taxAmountProcess', undefined)
        this.$set(row, 'salesCost', undefined)
        this.$set(row, 'salesProfit', undefined)
        this.changeTableList()
      }
    },
    delAndAddCalculate() {
      const params = {
        ...this.totalForm
      }
      this.isLoading = true
      calculate(params)
        .then((res) => {
          this.isLoading = false
          const { salesOrderProductList } = res.data
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

            buildMap(salesOrderProductList || [])
            updateList(list)
          }
          handlerProductList(this.tableList)
          const totalForm = JSON.parse(JSON.stringify(res.data))
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
          this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
          this.changeTableList()
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    calculateOneDetailRow(row, type) {
      const timer = Date.now()
      row.queryTime = timer

      calculateOneDetail(row).then((res) => {
        if (row.queryTime === timer) {
          const data = res.data || {}
          // isNeedTips 1:最大  2:最小
          const { isNeedTips } = data
          this.$set(row, 'unitCost', data.unitCost)
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
        this.$set(row, 'deliveryDateForDayErrorChildren', false)
        this.$set(row, 'ROW-ERROR-CHILDREN', false)
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
                  this.$set(row, 'deliveryDateForDayErrorChildren', false)
                  this.$set(row, 'ROW-ERROR-CHILDREN', false)
                })
                this.setMaxExpectedDeliveryDate()
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'deliveryDateForDay', topRow.deliveryDateForDay)
              this.$set(row, 'deliveryDateForDayErrorChildren', false)
              this.$set(row, 'ROW-ERROR-CHILDREN', false)
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

    updateTable(list) {
      // if (list.length > 0) {
      const topRow = this.tableList[0] || {}
      const rows = JSON.parse(JSON.stringify(list))
      rows.forEach((item, index) => {
        if (item.isOldSelect !== '1') {
          item.salesInquiryProductType = '1'
          item.remarks = ''
          item[this.rowIdKey] = Date.now() + index
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
    },
    // 行删除
    handleDelRow(row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        const delTableList = (data, row) => {
          data.forEach((x, i) => {
            if (x.rowTimeId === row.rowTimeId) {
              data.splice(i, 1)
              return
            }
            if (x.childProductList) {
              delTableList(x.childProductList, row)
            }
          })
        }
        delTableList(this.tableList, row)
        this.changeExpectedDeliveryDate()
        this.delAndAddCalculate()
      })
    },
    errorMessage(code) {
      const errorMessageValid = (data) => {
        data.forEach((item, index) => {
          if (code && !this.$resultOfBoolean(item[code])) {
            if (code === 'unitCost') {
              if (!(item.childProductList && item.childProductList.length > 0)) {
                this.$set(item, 'ROW-ERROR-CHILDREN', true)
                this.$set(item, code + 'ErrorChildren', true)
              }
            } else {
              this.$set(item, 'ROW-ERROR-CHILDREN', true)
              this.$set(item, code + 'ErrorChildren', true)
            }
          } else {
            this.$set(item, 'ROW-ERROR-CHILDREN', false)
            if (code) {
              this.$set(item, code + 'ErrorChildren', false)
            } else {
              Object.keys(item).forEach((key) => {
                if (key.endsWith('ErrorChildren')) {
                  this.$set(item, key, false)
                }
              })
            }
          }
          if (item.childProductList && item.childProductList.length > 0) {
            errorMessageValid(item.childProductList)
          }
        })
      }
      errorMessageValid(this.tableList)
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
      if (row['ROW-ERROR-CHILDREN']) {
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
      if (column.property === 'productName') {
        cellClass = 'custom-table-cell'
      }
      if (
        this.tableList.find(
          (item) => !item[column.property] && item[column.property + 'ErrorChildren']
        )
      ) {
        cellClass = 'is-required-table-cell'
        if (column.property === 'productName') {
          cellClass = 'is-required-table-cell custom-table-cell'
        }
      }
      return cellClass
    }
  }
}
</script>

<style lang="scss" scoped></style>
