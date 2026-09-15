<template>
  <div class="pb20">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-if="addBtnShow"
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
    <!-- :key="tableTimerKey" -->
    <!-- default-expand-all -->

    <el-table
      border
      ref="tables"
      class="tables"
      v-loading="formData.tableLoading || isLoading"
      :row-class-name="tableRowClassName"
      :key="'table' + modifyHighlight"
      :cell-class-name="tableCellClassName"
      :data="tableList"
      :row-key="rowIdKey"
      :tree-props="{ children: 'childProductList', hasChildren: 'hasChildren' }"
      v-table-tab
      :max-height="tableMaxHeight"
      @row-click="handleRowClick"
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
                disRequiredUnitPrice ? '' : 'unitCost',
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
                !comDisFrom &&
                !scope.row.productId &&
                scope.row.isEdit
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
                <!-- <i
                  class="el-icon-search pointer"
                  style="font-size: 20px; color: #409eff; margin-left: 5px"
                  @click="handleProductTable(scope.row)"
                  v-if="scope.row.customIndex > 0 && !scope.row.productId"
                ></i> -->
              </div>

              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
            </div>

            <template v-else>
              <span class="flow1">{{ scope.row[item.prop] }}</span>
            </template>
          </template>

          <template v-else-if="item.prop === 'description'">
            <descriptionEditDlg
              v-if="!comDisFrom && !scope.row.productId && scope.row.isEdit"
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
              v-if="
                (scope.row.isAdhocEntry === '1' || scope.row.isProjectTempProduct === '1') &&
                !comDisFrom &&
                scope.row.isEdit
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
                !comDisFrom &&
                !scope.row.productId &&
                scope.row.isEdit
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
                :disabled="allUomList.length <= 0"
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
            </template>
            <!-- <template v-else-if="!comDisFrom && scope.row.productType !== '2'">
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
            </template> -->

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
            <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
          </template>

          <template v-else-if="item.prop === 'qty' && !scope.row.isTotal">
            <template v-if="!comDisFrom && !disQty && scope.row.isEdit">
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
            <template v-if="!comDisFrom && scope.row.isEdit">
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
            <template v-if="!comDisFrom && scope.row.customIndex > 0 && scope.row.isEdit">
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
            <template v-else>{{ $numberStr(scope.row[item.prop], 2) }}</template>
          </template>

          <template v-else-if="item.prop === 'unitCost' && !scope.row.isTotal">
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
                (!scope.row.childProductList || scope.row.childProductList.length <= 0) &&
                scope.row.isEdit
              "
            />
            <div class="flow1" :title="$numberStr(scope.row[item.prop], 2)" v-else>
              {{ $numberStr(scope.row[item.prop], 2) }}
            </div>

            <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
          </template>
          <template v-else-if="item.prop === 'discountPer' && !scope.row.isTotal">
            <el-input-number
              v-thousandSplit="{ precision: 3 }"
              v-if="
                !comDisFrom &&
                scope.row.salesInquiryProductType === '1' &&
                scope.row.productType !== '2' &&
                scope.row.isEdit
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
                scope.row.productType !== '2' &&
                scope.row.isEdit
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
              <TablePropError v-if="scope.row[item.prop + 'ErrorChildren']" />
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
          <div class="flexCen" style="flex: 1">
            <div class="flexCCen" style="width: 40px">
              <el-dropdown
                trigger="click"
                placement="bottom"
                class="custom-dropdown"
                size="medium"
                @command="handleAddChild($event, scope.row)"
              >
                <span class="el-dropdown-link">
                  <i
                    class="el-icon-plus pointer"
                    style="font-size: 20px; color: #409eff"
                    v-if="scope.row.customIndex < 6"
                  ></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="addAdhocEntry">
                    <span>{{ $t('menu.addAdhocEntry') }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="addProduct" class="mt10">
                    <span>{{ $t('menu.addProduct') }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="flexCCen" style="width: 40px">
              <i
                class="el-icon-delete pointer"
                style="font-size: 20px; color: #f56c6c"
                :title="$t('uiBtn.delete')"
                @click="handleDelRow(scope.row)"
                v-if="scope.row.customIndex !== 0"
              ></i>
            </div>
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

    <ImportDlg
      ref="importDlg"
      :importOptions="importOptions"
      @onSuccess="updateTableList"
      :isSuccessMsg="false"
    />

    <errDialog ref="errDialog" />

    <!-- 新增产品 -->
    <selectProductTable
      ref="selectProductTable"
      :formData="formData"
      @onSuccess="updateChildTable"
    />
  </div>
</template>

<script>
// import VirtualScroll from 'el-table-virtual-scroll'
import pageMixin from '@/mixins/tableMinx'
import {
  queryCanSelectPPLListNoPage,
  calculate,
  submitButtonJudgmentDisplay
} from '@/api/salesManagement/salesInquiry'
import { queryAllUomList } from '@/api/system/uom'
import priceControlNoticeDlg from '@/views/salesManagement/salesInquiry/productInfo/priceControlNoticeDlg'

import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
import selectProductTable from './selectProductTable.vue'
import errDialog from '@/views/salesManagement/salesInquiry/productInfo/project/errDialog.vue'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_product_type'],
  components: {
    priceControlNoticeDlg,
    selectProductTable,
    errDialog
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

        // 仅首次加载有数据时全部展开
        if (this.isInitialExpandDone || !this.tableList.length) {
          return
        }
        // 表格初始化完成后全部展开
        this.$nextTick(() => {
          if (!this.isInitialExpandDone) {
            // this.expandAllRows()
            this.isInitialExpandDone = true
            this.changeTableList()
          }
        })
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
      saveKey: '12226',
      savePath: 'projectCostDetails',
      activeName: '1',
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          colMinWidth: 300,
          tooltip: true,
          fixed: true
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
          prop: 'netQty',
          label: vm.$t('SALES.netQty'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'scrapRate',
          label: vm.$t('SALES.scrapRate'),
          visible: true,
          colMinWidth: 150,
          tooltip: true
        },
        {
          prop: 'pricingQty',
          label: vm.$t('SALES.pricingQty'),
          visible: true,
          colMinWidth: 150,
          padding: 70,
          tooltip: true
        },
        {
          prop: 'unitCost',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          colMinWidth: 150,
          tooltip: false,
          padding: 70,
          align: 'right'
        },
        {
          prop: 'lineTotalPricingCost',
          label: vm.$t('SALES.lineTotal'),
          visible: true,
          colMinWidth: 150,
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
        downFileUrl: '/sales/salesInquiry/exportImportTemplateForSRProject',
        // 上传校验
        uploadUrl:
          process.env.VUE_APP_BASE_API + '/sales/salesInquiry/checkImportTemplateForSRProject',
        // 提交导入
        importUrl: '/sales/salesInquiry/importImportTemplateForSRProject',
        // 下载文件名
        fileName: 'Cost Details'
      },
      rowIdKey: 'rowTimeId',
      rowTimeId: '',
      row: {},
      isLoading: false,
      isInitialExpandDone: false,
      isAddChild: false,
      virtualList: [],
      curEditRow: null
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
    disRequiredUnitPrice() {
      return !this.formData.salesInquiryStatus || this.formData.salesInquiryStatus === '1'
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
    // ...existing code...
    expandAllRows() {
      const table = this.$refs.tables
      if (!table) return

      const expand = (list = []) => {
        list.forEach((item) => {
          const children = item.childProductList || []

          if (children.length > 0) {
            const treeData = table.store?.states?.treeData || {}
            const key = String(item[this.rowIdKey])
            const treeNode = treeData[key] || treeData[item[this.rowIdKey]]

            if (!treeNode || !treeNode.expanded) {
              table.toggleRowExpansion(item, true)
            }

            expand(children)
          }
        })
      }

      expand(this.tableList)
    },
    getExpandedRowTimeIds() {
      const treeData = this.$refs.tables?.store?.states?.treeData || {}
      const expandedIds = []

      const collect = (list = []) => {
        list.forEach((item) => {
          const key = String(item[this.rowIdKey])
          const treeNode = treeData[key] || treeData[item[this.rowIdKey]]

          if (treeNode && treeNode.expanded) {
            expandedIds.push(key)
          }

          if (item.childProductList && item.childProductList.length > 0) {
            collect(item.childProductList)
          }
        })
      }

      collect(this.tableList)
      return expandedIds
    },
    restoreExpandedRows(expandedIds = []) {
      const expandedSet = new Set(expandedIds.map(String))

      this.$nextTick(() => {
        const toggleRows = (list = []) => {
          list.forEach((item) => {
            const key = String(item[this.rowIdKey])
            const treeData = this.$refs.tables?.store?.states?.treeData || {}
            const treeNode = treeData[key] || treeData[item[this.rowIdKey]]

            if (treeNode && Boolean(treeNode.expanded) !== expandedSet.has(key)) {
              this.$refs.tables.toggleRowExpansion(item, expandedSet.has(key))
            }

            if (item.childProductList && item.childProductList.length > 0) {
              toggleRows(item.childProductList)
            }
          })
        }

        toggleRows(this.tableList)
      })
    },
    // ...existing code...
    // 产品新增子集
    handleAddChild(e, row) {
      if (this.isAddChild) return
      this.isAddChild = true
      setTimeout(() => {
        this.isAddChild = false
      }, 200)
      // const expandedIds = this.getExpandedRowTimeIds()
      // 新增临时产品
      if (e === 'addAdhocEntry') {
        const { customIndex } = row
        const topRow = this.tableList[0] || {}
        const index = customIndex * 1 + 1
        row.unitCost = undefined
        row.lineTotal = undefined
        row.lineTotalPricingCost = undefined
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
            childProductList: [],
            isEdit: false
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
              childProductList: [],
              isEdit: false
            }
          ]
        }
      } else {
        // 弹窗选择已有产品
        this.handleProductTable(row)
      }

      // if (!expandedIds.includes(String(row.rowTimeId))) {
      //   expandedIds.push(String(row.rowTimeId))
      // }
      // this.restoreExpandedRows(expandedIds)
      this.$nextTick(() => {
        this.$refs.tables && this.$refs.tables.toggleRowExpansion(row, true)
      })
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
      // const ids = sameLevelList.filter((item) => item.productId).map((item) => item.productId)

      const ids = this.getRelatedProductIds(this.tableList, row.rowTimeId)
      // console.log('合并去重后的 IDs:', ids)
      // const isChildren = row.childProductList && row.childProductList.length
      // isChildren true 表示有子级， 产品需要单选
      // this.$refs.selectProductTable.handleAdd(ids, isChildren)
      this.$refs.selectProductTable.handleAdd(ids)
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
      // const mergedIds = [...result.parents, ...result.siblings, ...result.children]
      const mergedIds = [...result.parents, ...result.children]

      // 返回去重后的数组
      return [...new Set(mergedIds)]
    },
    // 更新产品
    updateChildTable(list = []) {
      // const expandedIds = this.getExpandedRowTimeIds()

      if (list.length > 0) {
        // const isChildren = this.row.childProductList && this.row.childProductList.length
        const rows = JSON.parse(JSON.stringify(list))
        const { customIndex } = this.row
        const topRow = this.tableList[0] || {}
        const addIndex = customIndex * 1 + 1
        rows.forEach((item, index) => {
          item.isEdit = false
          item.salesInquiryProductType = '1'
          item.rowTimeId = Date.now() + index
          // item.customIndex = this.row.customIndex
          item.deliveryDateForDay = this.totalForm.deliveryDateForDay
          item.warranty = topRow.warranty
          item.customIndex = addIndex
          item.childProductList = []

          // 如果当前行有子级，需要将当前行的子级，赋值到新选择的产品行中
          // if (isChildren) {
          //   item.childProductList = JSON.parse(JSON.stringify(this.row.childProductList))
          // } else {
          //   item.childProductList = []
          // }
        })
        this.updateChildList(this.tableList, rows)
        this.delAndAddCalculate()
        // if (!expandedIds.includes(String(this.row.rowTimeId))) {
        //   expandedIds.push(String(this.row.rowTimeId))
        // }
        // this.restoreExpandedRows(expandedIds)

        this.$nextTick(() => {
          this.$refs.tables && this.$refs.tables.toggleRowExpansion(this.row, true)
        })
      }
    },
    updateChildList(data, rows) {
      data.forEach((x, i) => {
        if (x.rowTimeId === this.row.rowTimeId) {
          // data.splice(i, 1, ...rows)
          if (x.childProductList) {
            x.childProductList.push(...rows)
          } else {
            x.childProductList = [...rows]
          }
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
      console.log(e, '=============1163')
      const {
        errorType,
        // errorCount,
        // errorMsgList,
        // checkList,
        salesInquiryProductList
      } = e.data
      if (errorType === '1') {
        return this.$refs.errDialog.open(e.data)
        // return this.openConfirm(errorMsgList, errorType, errorCount)
      }
      this.$modal.msgSuccess(this.$t('ui.ImportSuccessful'))

      const rows = JSON.parse(JSON.stringify(salesInquiryProductList))
      const handlerSalesInquiryProductList = (list) => {
        let rowTimeId = Date.now()
        const handleList = (currentList, customIndex = 0) => {
          currentList.forEach((item) => {
            this.$set(item, 'isEdit', false)
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
        // 每个第一层对象都从 0 级开始
        list.forEach((item) => {
          this.$set(item, 'isEdit', false)
          handleList([item], 0)
        })
      }
      handlerSalesInquiryProductList(rows || [])
      this.tableList.length = 0
      this.tableList.push(...rows)

      this.$nextTick(() => {
        // this.expandAllRows()
        this.delAndAddCalculate()
      })
    },
    openConfirm(tempProductNameList = [], type, errorCount) {
      const that = this

      const h = that.$createElement
      const contents = []
      let title = ''
      if (type === '1') {
        title = that.$t('SALES.importIncomplete')
      } else if (type === '2') {
        title = that.$t('SALES.failedValidation').replace('$1', errorCount)
      } else {
        title = that.$t('SALES.importIncomplete1')
      }
      contents.push(h('div', { style: 'font-size: 14px' }, title))
      tempProductNameList.forEach((x) => {
        const span1 = h(
          'span',
          {
            style:
              'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
          },
          ''
        )
        const span2 = h('span', { style: 'font-size: 14px' }, x)
        contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
      })
      const content = h('p', null, contents)
      this.$alert(content, '', {
        confirmButtonText: this.$t('uiBtn.confirm'),
        cancelButtonText: this.$t('uiBtn.back'),
        showCancelButton: false,
        showClose: false,
        type: 'warning',
        customClass: 'custom-class'
      })
        .then(() => {})
        .catch(() => {})
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

      const updateList = (data = []) => {
        data.forEach((item) => {
          this.$set(item, 'unitCost', this.$numberStr(item.unitCost, 2))
          this.$set(item, 'unitPrice', this.$numberStr(item.unitPrice, 2))
          this.$set(item, 'lineTotal', this.$numberStr(item.lineTotal, 2))
          this.$set(item, 'scrapRate', this.$numberStr(item.scrapRate, 2))
          this.$set(item, 'pricingQty', this.$numberStr(item.pricingQty, 3))
          this.$set(item, 'qty', this.$numberStr(item.qty, 3))
          this.$set(item, 'netQty', this.$numberStr(item.netQty, 3))
          this.$set(item, 'lineTotalPricingCost', this.$numberStr(item.lineTotalPricingCost, 2))
          if (item.childProductList && item.childProductList.length > 0) {
            updateList(item.childProductList)
          }
        })
      }
      updateList(JSON.parse(JSON.stringify(allList)))
      // this.$$getColumnContentMaxWidth(this.columns, allList)
      // this.$$getColumnContentMaxWidth(this.columns, this.tableList)
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
            item.colMinWidth = !vm.comDisFrom && !vm.disPriceType ? 140 : undefined
            break
          case 'productName':
            item.colMinWidth = vm.comDisFrom ? 180 : 300
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

          case 'unitCost':
            item.colMinWidth = vm.comDisFrom ? undefined : 140
            break
          case 'lineTotalPricingCost':
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
        this.queryRowTaxAmount(row, type)
      })
    },
    queryRowTaxAmount(row, type) {
      // if (this.$resultOfBoolean(row.netQty) && this.$resultOfBoolean(row.unitCost)) {
      if (this.$resultOfBoolean(row.netQty)) {
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
                      this.$set(item, 'unitPrice', result.unitPrice)
                      this.$set(item, 'lineTotal', result.lineTotal)
                      this.$set(item, 'scrapRate', result.scrapRate)
                      this.$set(item, 'pricingQty', result.pricingQty)
                      this.$set(item, 'qty', result.qty)
                      this.$set(item, 'netQty', result.netQty)
                      this.$set(item, 'lineTotalPricingCost', result.lineTotalPricingCost)
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

              const totalForm = JSON.parse(JSON.stringify(res.data))

              this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
              this.$emit('updatePriceControlNotice', totalForm, 'totalForm')

              this.changeTableList()
            }
            this.isLoading = false
          })
          .catch(() => {
            this.isLoading = false
            this.closePriceControlNotice(row)
          })
      } else {
        this.$set(row, 'lineTotal', undefined)
        this.$set(row, 'lineTotalPricingCost', undefined)
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
                  this.$set(item, 'unitPrice', result.unitPrice)
                  this.$set(item, 'lineTotal', result.lineTotal)
                  this.$set(item, 'scrapRate', result.scrapRate)
                  this.$set(item, 'pricingQty', result.pricingQty)
                  this.$set(item, 'qty', result.qty)
                  this.$set(item, 'netQty', result.netQty)
                  this.$set(item, 'lineTotalPricingCost', result.lineTotalPricingCost)
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
          const totalForm = JSON.parse(JSON.stringify(res.data))
          this.tableListCopy = JSON.parse(JSON.stringify(this.tableList))
          this.$emit('updatePriceControlNotice', totalForm, 'totalForm')
          this.changeTableList()
        })
        .catch(() => {
          this.isLoading = false
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
    // 行删除
    handleDelRow(row) {
      // const expandedIds = this.getExpandedRowTimeIds()
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
        // this.restoreExpandedRows(expandedIds)
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
        } else if (row.updateType === '3') {
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
      // if (
      //   this.tableList.find(
      //     (item) => !item[column.property] && item[column.property + 'ErrorChildren']
      //   )
      // ) {
      //   cellClass = 'is-required-table-cell'
      //   if (column.property === 'productName') {
      //     cellClass = 'is-required-table-cell custom-table-cell'
      //   }
      // }
      if (!row[column.property] && row[column.property + 'ErrorChildren']) {
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

<style lang="scss" scoped>
.tables {
  /deep/ .el-table__placeholder {
    display: none;
  }
}
</style>
