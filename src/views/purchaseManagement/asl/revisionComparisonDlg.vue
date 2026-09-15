<template>
  <el-dialog
    v-dialogDrag
    :title="$t('uiBtn.revisionComparison')"
    :visible.sync="visible"
    width="1140px"
    :modal="true"
    :close-on-click-modal="false"
    @closed="closed"
  >
    <div v-show="showBasicUpdateMsg">
      <el-table
        :data="basicUpdateMsgList"
        :stripe="false"
        border
        class="w100"
        :max-height="390"
        tooltip-effect="light"
      >
        <el-table-column
          prop="label"
          :label="$t('uiBtn.fieldName')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="beforeValue"
          :label="$t('uiBtn.beforeModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="afterValue"
          :label="$t('uiBtn.afterModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
      </el-table>
    </div>
    <el-collapse
      v-model="activeNames"
      v-show="showProjectList || showProductList || showServiceList || showCommonFileList"
      class="mt20"
    >
      <div class="form-card">
        <el-collapse-item name="1" v-show="beforeCommonFileList.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('ui.attachment') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUpload ref="uploadRef1" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2" v-show="afterCommonFileList.length > 0">
          <template slot="title">
            <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
            <strong>{{ $t('ui.attachment') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <el-row class="mb20">
            <el-col :span="24">
              <myUpload ref="uploadRef2" :disabled="true" />
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="3" v-if="beforeProjectList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.project') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeProjectList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in projectColumns"
                :key="item.prop + item.colSortIndex"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :show-overflow-tooltip="item.tooltip"
                :fixed="item.fixed"
                :sortable="item.sortable"
                :align="item.align || 'left'"
                header-align="center"
              >
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="4" v-if="afterProjectList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.project') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterProjectList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in projectColumns"
                :key="item.prop + item.colSortIndex"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :show-overflow-tooltip="item.tooltip"
                :fixed="item.fixed"
                :sortable="item.sortable"
                :align="item.align || 'left'"
                header-align="center"
              >
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="5" v-if="beforeProductList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.productInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeProductList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in productColumns"
                :key="item.prop + item.colSortIndex"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :show-overflow-tooltip="item.tooltip"
                :fixed="item.fixed"
                :sortable="item.sortable"
                :align="item.align || 'left'"
                header-align="center"
              >
                <template slot="header" slot-scope="{ column }">
                  <span
                    v-if="
                      item.prop === 'competitorPriceForMax' || item.prop === 'competitorPriceForMin'
                    "
                  >
                    {{ column.label }}
                    <svg-icon
                      :icon-class="item.prop === 'competitorPriceForMin' ? 'down1' : 'up1'"
                    />
                  </span>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'competitorPriceForMax'">{{
                    $numberStr(scope.row.competitorPriceForMax, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'competitorPriceForMin'">{{
                    $numberStr(scope.row.competitorPriceForMin, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'recommendedRetailPrice'">{{
                    $numberStr(scope.row.recommendedRetailPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'salesRetailPrice'">{{
                    $numberStr(scope.row.salesRetailPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'pricingUom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="6" v-if="afterProductList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.productInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterProductList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in productColumns"
                :key="item.prop + item.colSortIndex"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :show-overflow-tooltip="item.tooltip"
                :fixed="item.fixed"
                :sortable="item.sortable"
                :align="item.align || 'left'"
                header-align="center"
              >
                <template slot="header" slot-scope="{ column }">
                  <span
                    v-if="
                      item.prop === 'competitorPriceForMax' || item.prop === 'competitorPriceForMin'
                    "
                  >
                    {{ column.label }}
                    <svg-icon
                      :icon-class="item.prop === 'competitorPriceForMin' ? 'down1' : 'up1'"
                    />
                  </span>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'competitorPriceForMax'">{{
                    $numberStr(scope.row.competitorPriceForMax, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'competitorPriceForMin'">{{
                    $numberStr(scope.row.competitorPriceForMin, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'recommendedRetailPrice'">{{
                    $numberStr(scope.row.recommendedRetailPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'salesRetailPrice'">{{
                    $numberStr(scope.row.salesRetailPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'minRate'">{{
                    $numberStr(scope.row.minRate, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'minPrice'">{{
                    $numberStr(scope.row.minPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'maxRate'">{{
                    $numberStr(scope.row.maxRate, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'maxPrice'">{{
                    $numberStr(scope.row.maxPrice, 2)
                  }}</template>

                  <template v-else-if="item.prop === 'pricingUom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="7" v-if="beforeServiceList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.projectTask') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeServiceList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in serviceColumns"
                :key="item.prop + item.colSortIndex"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :show-overflow-tooltip="item.tooltip"
                :fixed="item.fixed"
                :sortable="item.sortable"
                :align="item.align || 'left'"
                header-align="center"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'purchasePrice'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'duration'">
                    <template>{{ $numberStr(scope.row[item.prop], 1) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discount'">{{
                    $numberStr(scope.row.discount, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'lineTotal'">{{
                    $numberStr(scope.row.lineTotal, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'taxAmount'">{{
                    $numberStr(scope.row.taxAmount, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'salesCost'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'salesProfit'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'description'">
                    <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="8" v-if="afterServiceList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.projectTask') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterServiceList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
            >
              <el-table-column
                type="index"
                :label="$t('ui.sn')"
                align="center"
                :width="60"
                fixed="left"
              >
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>

              <el-table-column
                v-for="item in serviceColumns"
                :key="item.prop + item.colSortIndex"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :show-overflow-tooltip="item.tooltip"
                :fixed="item.fixed"
                :sortable="item.sortable"
                :align="item.align || 'left'"
                header-align="center"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'purchasePrice'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'duration'">
                    <template>{{ $numberStr(scope.row[item.prop], 1) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discount'">{{
                    $numberStr(scope.row.discount, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'lineTotal'">{{
                    $numberStr(scope.row.lineTotal, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'taxAmount'">{{
                    $numberStr(scope.row.taxAmount, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'salesCost'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'salesProfit'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'description'">
                    <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
    <div style="text-align: center; width: 100%">
      <el-empty
        v-if="
          !(
            showBasicUpdateMsg ||
            showProjectList ||
            showProductList ||
            showServiceList ||
            showCommonFileList
          )
        "
        :image-size="200"
        :description="$t('ui.noData')"
      ></el-empty>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="visible = false">{{ $t('ui.back') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryUpdateMsgSalesPrice } from '@/api/salesManagement/salesPrice'
export default {
  dicts: ['sales_inquiry_product_type'],
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      salesQuotationType: undefined, // Trading Project
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8'],
      basicUpdateMsgList: [],
      beforeProjectList: [],
      afterProjectList: [],
      beforeProductList: [],
      afterProductList: [],
      beforeServiceList: [],
      afterServiceList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      updatePropList: [
        {
          prop: 'departmentName',
          label: vm.$t('SALES.salesOrganization')
        },
        {
          prop: 'reason',
          label: vm.$t('ui.reason')
        }
      ],
      /* 表格部分 */
      projectColumns: [
        {
          prop: 'projectName',
          label: vm.$t('SALES.projectName'),
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
        }
      ],
      productColumns: [
        {
          prop: 'productName',
          label: vm.$t('PRODUCT.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PRODUCT.internalPartNo'),
          visible: true,
          minWidth: 160,
          tooltip: true
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'pricingUom',
          label: vm.$t('SALES.pricingUnit'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'competitorPriceForMax',
          label: vm.$t('SALES.competitorPricingHigh'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'competitorPriceForMin',
          label: vm.$t('SALES.competitorPricingLow'),
          minWidth: 200,
          visible: true,
          tooltip: true
        },
        {
          prop: 'recommendedRetailPrice',
          label: vm.$t('SALES.recommendedRetailPrice'),
          minWidth: 200,
          visible: true,
          tooltip: true,
          align: 'right'
        },
        {
          prop: 'salesRetailPrice',
          label: vm.$t('SALES.salesPrice'),
          visible: true,
          minWidth: 220,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'minRate',
          label: vm.$t('SALES.minRate'),
          fixedWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'minPrice',
          label: vm.$t('SALES.minimumPriceFloor'),
          fixedWidth: 180,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'maxRate',
          label: vm.$t('SALES.maxRate'),
          fixedWidth: 160,
          visible: true,
          tooltip: true
        },
        {
          prop: 'maxPrice',
          label: vm.$t('SALES.maximumPriceCeiling'),
          fixedWidth: 180,
          visible: true,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      serviceColumns: [
        {
          prop: 'salesInquiryServiceTypeShowStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
          fixed: false,
          tooltip: true
        },
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
          tooltip: true
        },
        {
          prop: 'serviceTypeShowStr',
          label: vm.$t('PRODUCT.productType'),
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
          prop: 'purchaseQuotationNo',
          label: vm.$t('SALES.purchaseQuotationNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchasePrice',
          label: vm.$t('SALES.purchasePrice'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right',
          padding: 50
        },
        {
          prop: 'priceType',
          label: vm.$t('SALES.priceType'),
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
          label: vm.$t('SALES.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'duration',
          label: vm.$t('SALES.duration'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('SALES.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
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
          prop: 'taxNo',
          label: vm.$t('SALES.taxNo'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'taxAmount',
          label: vm.$t('SALES.taxAmount'),
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
          prop: 'leadTime',
          label: vm.$t('SALES.leadTimeDays'),
          visible: true,
          minWidth: 140,
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
          prop: 'deliveryDate',
          label: vm.$t('SALES.expectedDeliveryDate'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ]
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    showProjectList() {
      return this.beforeProjectList.length > 0 || this.afterProjectList.length > 0
    },
    showProductList() {
      return this.beforeProductList.length > 0 || this.afterProductList.length > 0
    },
    showServiceList() {
      return this.beforeServiceList.length > 0 || this.afterServiceList.length > 0
    },

    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    }
  },

  methods: {
    closed() {
      this.salesQuotationType = undefined
      this.basicUpdateMsgList = []
      this.beforeProjectList = []
      this.afterProjectList = []
      this.beforeProductList = []
      this.afterProductList = []
      this.beforeServiceList = []
      this.afterServiceList = []

      this.beforeCommonFileList = []
      this.afterCommonFileList = []
    },
    rowClassName({ row }) {
      if (row.updateType === '2') {
        return 'new-add-row'
      } else if (row.updateType === '3') {
        return 'cancel-row'
      }
    },
    cellClassName({ row, column }) {
      let cellClass = ''
      if (row.updateType === '1') {
        if ((row.updateMsgList || []).find((item) => item.name === column.property)) {
          cellClass = 'edit-table-cell'
        }
      }
      return cellClass
    },
    handleOpen(id) {
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7', '8']
      queryUpdateMsgSalesPrice({ approvedSupplierId: id }).then((res) => {
        const results = res.data || {}
        this.visible = true
        this.salesQuotationType = results.salesQuotationType
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])

        this.beforeProjectList = results.beforeProjectList || []
        this.afterProjectList = results.afterProjectList || []

        this.beforeProductList = results.beforeSalesPriceProductList || []
        this.afterProductList = results.afterSalesPriceProductList || []

        this.beforeServiceList = results.beforeServiceList || []
        this.afterServiceList = results.afterServiceList || []

        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []

        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
        }, 100)
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        if (['validity', 'deliveryDate'].includes(item.name)) {
          item.beforeValue = this.parseTime(item.beforeValue, this.fmtForYmd)
          item.afterValue = this.parseTime(item.afterValue, this.fmtForYmd)
        }
        if (
          [
            'freight',
            'freightTaxAmount',
            'subTotal',
            'totalFreight',
            'totalTaxAmount',
            'totalDiscount',
            'totalAmount'
          ].includes(item.name)
        ) {
          item.beforeValue = this.$numberStr(item.beforeValue, 2)
          item.afterValue = this.$numberStr(item.afterValue, 2)
        }
        MsgObj[item.name] = item
      })
      this.updatePropList.forEach((item) => {
        const editItem = MsgObj[item.prop]
        if (editItem) {
          const row = {
            ...item,
            beforeValue: editItem.beforeValue,
            afterValue: editItem.afterValue
          }
          MsgShowList.push(row)
        }
      })
      return MsgShowList
    },
    handleList(list) {
      const vm = this
      return list.map((item) => {
        item.taxAmount = vm.$numberStr(item.taxAmount, 2)
        return item
      })
    }
  }
}
</script>
<style lang="scss"></style>
