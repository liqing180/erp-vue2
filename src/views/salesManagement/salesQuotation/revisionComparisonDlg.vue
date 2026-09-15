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
          :formatter="formatRevisionColumn"
          :label="$t('uiBtn.beforeModification')"
          header-align="center"
          align="left"
          min-width="200"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="afterValue"
          :formatter="formatRevisionColumn"
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
      v-show="showProjectList || showProductList || showCommonFileList || showMixDesignList"
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
            <strong
              v-if="
                salesQuotationType === 'Trading' ||
                salesQuotationType === 'Project' ||
                salesQuotationType === 'Service' ||
                salesQuotationType === 'Staff'
              "
              >{{ $t('SALES.productDetail') }} ({{ $t('uiBtn.beforeModification') }})</strong
            >
            <strong v-else
              >{{ $t('SALES.materialList') }} ({{ $t('uiBtn.beforeModification') }})</strong
            >
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'purchasePrice'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discountPer'">{{
                    $numberStr(scope.row.discountPer, 2)
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
                    <template v-if="scope.row.productType !== '2'">{{
                      $numberStr(scope.row[item.prop], 2)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'salesProfit'">
                    <template v-if="scope.row.productType !== '2'">{{
                      $numberStr(scope.row[item.prop], 2) === '-0.00'
                        ? '0.00'
                        : $numberStr(scope.row[item.prop], 2)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else-if="item.prop === 'description'">
                    <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="6" v-if="afterProductList.length > 0">
          <template slot="title">
            <strong
              v-if="
                salesQuotationType === 'Trading' ||
                salesQuotationType === 'Project' ||
                salesQuotationType === 'Service' ||
                salesQuotationType === 'Staff'
              "
              >{{ $t('SALES.productDetail') }} ({{ $t('uiBtn.afterModification') }})</strong
            >
            <strong v-else
              >{{ $t('SALES.materialList') }} ({{ $t('uiBtn.afterModification') }})</strong
            >
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
                <template slot-scope="scope">
                  <template v-if="item.prop === 'deliveryDate'">{{
                    parseTime(scope.row.deliveryDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'purchasePrice'">
                    <template>{{ $numberStr(scope.row[item.prop], 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discountPer'">{{
                    $numberStr(scope.row.discountPer, 2)
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
                    <template>{{
                      $numberStr(scope.row[item.prop], 2) === '-0.00'
                        ? '0.00'
                        : $numberStr(scope.row[item.prop], 2)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else-if="item.prop === 'description'">
                    <DescriptionToolTipShow :showStr="scope.row[item.prop]" />
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="9" v-if="beforeMixDesignList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.mixDesign') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeMixDesignList"
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
                v-for="item in mixDesignColumns"
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
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discountPer'">{{
                    $numberStr(scope.row.discountPer, 2)
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
                    <template>{{
                      $numberStr(scope.row[item.prop], 2) === '-0.00'
                        ? '0.00'
                        : $numberStr(scope.row[item.prop], 2)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
        <el-collapse-item name="10" v-if="afterMixDesignList.length > 0">
          <template slot="title">
            <strong>{{ $t('SALES.mixDesign') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterMixDesignList"
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
                v-for="item in mixDesignColumns"
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
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discountPer'">{{
                    $numberStr(scope.row.discountPer, 2)
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
                    <template>{{
                      $numberStr(scope.row[item.prop], 2) === '-0.00'
                        ? '0.00'
                        : $numberStr(scope.row[item.prop], 2)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'qty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'uom'">
                    <span :title="showUomLabel(scope.row[item.prop])">{{
                      scope.row[item.prop]
                    }}</span>
                  </template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
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
            showCommonFileList ||
            showMixDesignList
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
import { createRevisionDisplayMixin } from '@/components/RevisionComparison/legacyDisplay'
import { queryUpdateMsgSalesQuotation } from '@/api/salesManagement/salesQuotation'
export default {
  mixins: [createRevisionDisplayMixin({ switches: ['automatedEmail', 'dropShipping', 'isCod', 'isNonDigital'], dictionaries: {} })],
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
      salesQuotationType: undefined, // Trading Project Staff
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      basicUpdateMsgList: [],
      beforeProjectList: [],
      afterProjectList: [],
      beforeProductList: [],
      afterProductList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      beforeMixDesignList: [],
      afterMixDesignList: [],
      updatePropList: [
        {
          prop: 'customerQuestionnaireNo',
          label: vm.$t('SALES.customerQuestionnaire')
        },
        {
          prop: 'paymentTermName',
          label: vm.$t('ui.paymentTerm')
        },
        {
          prop: 'paymentMethod',
          label: vm.$t('ui.paymentMethod')
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency')
        },

        {
          prop: 'departmentName',
          label: vm.$t('SALES.department')
        },
        {
          prop: 'taxRate',
          label: vm.$t('SALES.taxRate')
        },
        {
          prop: 'validity',
          label: vm.$t('SALES.validityDays')
        },
        {
          prop: 'deliveryDateForDay',
          label: vm.$t('SALES.leadTimeDays2')
        },
        {
          prop: 'salesPersonBy',
          label: vm.$t('SALES.salesPerson')
        },
        {
          prop: 'ourRef',
          label: vm.$t('SALES.ourRef')
        },
        {
          prop: 'yourRef',
          label: vm.$t('SALES.yourRef')
        },
        {
          prop: 'priceTypeName',
          label: vm.$t('SALES.priceType')
        },
        {
          prop: 'basicRemarks',
          label: `${vm.$t('ui.remarks')}(${vm.$t('ui.basicInfo')})`
        },
        {
          prop: 'automatedEmail',
          label: vm.$t('SALES.automatedEmail')
        },
        {
          prop: 'dropShipping',
          label: vm.$t('SALES.dropShipping')
        },
        {
          prop: 'blanketOrder',
          label: vm.$t('SALES.blanketOrder')
        },
        {
          prop: 'isNonDigital',
          label: vm.$t('SALES.isNonDigital')
        },
        {
          prop: 'isCod',
          label: vm.$t('SALES.COD')
        },
        {
          prop: 'sealRequired',
          label: vm.$t('SALES.sealRequired')
        },
        {
          prop: 'priceTbd',
          label: vm.$t('SALES.priceTbd')
        },

        {
          prop: 'warehouseName',
          label: vm.$t('SALES.warehouseName')
        },
        {
          prop: 'incotermName',
          label: vm.$t('SALES.incoterm')
        },
        {
          prop: 'projectContactPersonNames',
          label: vm.$t('SALES.projectContactPersonName')
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('ui.address')
        },
        {
          prop: 'district',
          label: vm.$t('SALES.zone')
        },
        {
          prop: 'receiveAddress',
          label: vm.$t('SALES.deliveryAddress')
        },
        {
          prop: 'specialRequirementShowStr',
          label: vm.$t('SALES.specialRequirement')
        },
        {
          prop: 'cubeSpacingNumShowStr',
          label: vm.$t('SALES.cubeSpacingNum')
        },
        {
          prop: 'bpContactPersonName',
          label: vm.$t('SALES.contactPerson')
        },
        {
          prop: 'bpEmail',
          label: vm.$t('ui.email')
        },
        {
          prop: 'bpMobilePhone',
          label: vm.$t('ui.mobilePhone')
        },
        {
          prop: 'freight',
          label: vm.$t('SALES.freight')
        },
        {
          prop: 'freightTaxNo',
          label: vm.$t('SALES.taxNo')
        },
        {
          prop: 'freightTaxAmount',
          label: vm.$t('SALES.taxAmount')
        },
        {
          prop: 'totalRemarks',
          label: `${vm.$t('ui.remarks')}(${vm.$t('SALES.productInfo')})`
        },
        {
          prop: 'subTotal',
          label: vm.$t('SALES.subTotal')
        },
        {
          prop: 'totalFreight',
          label: vm.$t('SALES.totalFreight')
        },
        {
          prop: 'totalTaxAmount',
          label: vm.$t('SALES.taxAmount')
        },
        {
          prop: 'totalDiscount',
          label: vm.$t('SALES.totalDiscount')
        },
        {
          prop: 'totalAmount',
          label: vm.$t('SALES.totalAmount')
        }
      ],
      /* 表格部分 */
      currencyCode: undefined,
      projectColumns: [
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
          minWidth: 200,
          colMinWidth: 200,
          tooltip: false
        },
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
          tooltip: false
        },
        {
          prop: 'qty',
          label: vm.$t('SALES.salesQTY1'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: false
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
          tooltip: false,
          padding: 50,
          align: 'right'
        },
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
          required: true,
          tooltip: false
        },
        {
          prop: 'warranty',
          label: vm.$t('SALES.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: false
        },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      productColumns: [
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
        /* {
          prop: 'priceTypeShowStr',
          label: vm.$t('SALES.priceType'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }, */
        {
          prop: 'uom',
          label: vm.$t('PRODUCT.uom1'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        /* {
          prop: 'uomCoefficient',
          label: vm.$t('PRODUCT.ratio'),
          visible: true,
          minWidth: 180,
          tooltip: true
        }, */
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
          tooltip: true,
          padding: 50,
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
          prop: 'exchangeRateDesc',
          label: vm.$t('menu.exchangeRate'),
          visible: true,
          minWidth: 200,
          tooltip: true
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
          tooltip: true
        }
      ],
      mixDesignColumns: [
        {
          prop: 'mixDesignName',
          label: vm.$t('SALES.mixDesignName'),
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
          prop: 'productCode',
          label: vm.$t('SALES.productCode'),
          visible: true,
          minWidth: 200,
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
          prop: 'volume',
          label: vm.$t('SALES.volume'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PRODUCT.price'),
          visible: true,
          minWidth: 140,
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
          prop: 'productRemarks',
          label: vm.$t('SALES.productRemarks'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'natureOfCasting',
          label: vm.$t('SALES.natureOfCasting'),
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
    showMixDesignList() {
      return this.beforeMixDesignList.length > 0 || this.afterMixDesignList.length > 0
    },

    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },

    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    salesCostAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:salesCostProfit'])
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    },
    comProjectColumns() {
      let arr = [...this.projectColumns]
      if (!this.salesCostAuth) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'salesCost' && item.prop !== 'salesProfit'
          return is
        })
      }
      if (this.legalEntityInfo.currencyCode === this.currencyCode) {
        arr = arr.filter((item) => item.prop !== 'exchangeRateDesc')
      }
      return arr
    },
    comProductColumns() {
      let arr = [...this.productColumns]
      if (!this.salesCostAuth) {
        arr = arr.filter((item) => {
          const is = item.prop !== 'salesCost' && item.prop !== 'salesProfit'
          return is
        })
      }
      if (this.legalEntityInfo.currencyCode === this.currencyCode) {
        arr = arr.filter((item) => item.prop !== 'exchangeRateDesc')
      }
      return arr
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
      this.beforeMixDesignList = []
      this.afterMixDesignList = []

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
    async handleOpen(id) {
      if (!await this.loadRevisionDictionaries()) return
      this.activeNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      queryUpdateMsgSalesQuotation({ salesQuotationMainId: id }).then((res) => {
        const results = res.data || {}
        this.currencyCode = results.afterCurrencyCode
        this.visible = true
        this.salesQuotationType = results.salesQuotationType
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])

        this.beforeProjectList = results.beforeProjectList || []
        this.afterProjectList = results.afterProjectList || []

        this.beforeProductList = results.beforeProductOrServiceList || []
        this.afterProductList = results.afterProductOrServiceList || []

        this.beforeMixDesignList = results.beforeMixDesignList || []
        this.afterMixDesignList = results.afterMixDesignList || []

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
        if (['taxRate'].includes(item.name)) {
          item.beforeValue = this.$numberStr(item.beforeValue, 1)
          item.afterValue = this.$numberStr(item.afterValue, 1)
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
          // if (item.prop === 'priceTbd') {
          //   if (this.salesQuotationType === 'Trading') {
          //     row.label = this.$t('SALES.priceTbd2')
          //   } else {
          //     row.label = this.$t('SALES.priceTbd')
          //   }
          // }
          MsgShowList.push(row)
        }
      })
      return MsgShowList
    },
    handleList(list) {
      const vm = this
      return list.map((item) => {
        item.taxAmount = vm.$numberStr(item.taxAmount, 2)
        item.uomCoefficient =
          vm.$numberStr(item.uomCoefficient, item.includeDecimal === '1' ? 2 : 0) +
          ` ${item.basicUom || ''}`
        return item
      })
    }
  }
}
</script>
<style lang="scss"></style>
