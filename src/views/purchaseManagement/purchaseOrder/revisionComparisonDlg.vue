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
      v-show="showDetailList || showDetailsOfExpensesList || showCommonFileList"
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
        <el-collapse-item name="3" v-if="beforeDetailList.length > 0">
          <template slot="title">
            <strong>{{ $t('PURCHASE.productInfo') }} ({{ $t('uiBtn.beforeModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="beforeDetailList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              tooltip-effect="light"
              :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
              row-key="rowTimeId"
              default-expand-all
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
                v-for="item in visibleCurColumns"
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
                  <div v-if="['legalEntityLineTotal'].includes(item.prop)">
                    <span>{{ column.label }}</span>
                    <span v-if="legalEntityInfo.currencySymbol"
                      >({{ legalEntityInfo.currencySymbol }})</span
                    >
                  </div>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'committedDate'">{{
                    parseTime(scope.row.committedDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'productType'">
                    <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
                    <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                    <span>{{
                      selectDictLabel(dict.type.product_type, scope.row.productType)
                    }}</span>
                  </template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discount'">{{
                    $numberStr(scope.row.discount, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'lineTotal'">{{
                    $numberStr(scope.row.lineTotal, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'legalEntityLineTotal'">
                    <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'taxAmount'">{{
                    $numberStr(scope.row.taxAmount, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'purchaseQty'">
                    <template v-if="scope.row.productId">{{
                      $numberStr(
                        scope.row[item.prop],
                        scope.row.decimalNum,
                        scope.row.isAdhocEntry !== '1'
                      )
                    }}</template>
                    <template v-else>{{ scope.row.qty }}</template>
                  </template>
                  <template v-else-if="item.prop === 'purchaseUom'">
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
        <el-collapse-item name="4" v-if="afterDetailList.length > 0">
          <template slot="title">
            <strong>{{ $t('PURCHASE.productInfo') }} ({{ $t('uiBtn.afterModification') }})</strong>
          </template>
          <div class="mb20">
            <el-table
              :data="afterDetailList"
              border
              :max-height="390"
              :row-class-name="rowClassName"
              :cell-class-name="cellClassName"
              tooltip-effect="light"
              :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
              row-key="rowTimeId"
              default-expand-all
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
                v-for="item in visibleCurColumns"
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
                  <div v-if="['legalEntityLineTotal'].includes(item.prop)">
                    <span>{{ column.label }}</span>
                    <span v-if="legalEntityInfo.currencySymbol"
                      >({{ legalEntityInfo.currencySymbol }})</span
                    >
                  </div>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'committedDate'">{{
                    parseTime(scope.row.committedDate, fmtForYmd)
                  }}</template>
                  <template v-else-if="item.prop === 'productType'">
                    <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
                    <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
                    <span>{{
                      selectDictLabel(dict.type.product_type, scope.row.productType)
                    }}</span>
                  </template>
                  <template v-else-if="item.prop === 'unitPrice'">{{
                    $numberStr(scope.row.unitPrice, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'discount'">{{
                    $numberStr(scope.row.discount, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'lineTotal'">{{
                    $numberStr(scope.row.lineTotal, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'legalEntityLineTotal'">
                    <template>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
                  </template>
                  <template v-else-if="item.prop === 'taxAmount'">{{
                    $numberStr(scope.row.taxAmount, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'purchaseQty'">
                    <template>{{
                      $numberStr(scope.row[item.prop], scope.row.decimalNum)
                    }}</template>
                  </template>
                  <template v-else-if="item.prop === 'purchaseUom'">
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
        <el-collapse-item name="5" v-if="beforeDetailsOfExpensesList.length > 0">
          <template slot="title">
            <strong
              >{{ $t('PURCHASE.detailsOfExpenses') }} ({{ $t('uiBtn.beforeModification') }})</strong
            >
          </template>
          <div class="mb20">
            <el-table
              :data="beforeDetailsOfExpensesList"
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
                v-for="item in expenseItemColumns"
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
                  <div v-if="['referenceAmount'].includes(item.prop)">
                    <span>{{ column.label }}</span>
                    <span v-if="legalEntityInfo.currencySymbol"
                      >({{ legalEntityInfo.currencySymbol }})</span
                    >
                  </div>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'amount'">{{
                    $numberStr(scope.row.amount, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'referenceAmount'">{{
                    $numberStr(scope.row.referenceAmount, 6, false, 2)
                  }}</template>
                  <template v-else>{{ formatRevisionValue(scope.row[item.prop], item.prop) }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>

        <el-collapse-item name="6" v-if="afterDetailsOfExpensesList.length > 0">
          <template slot="title">
            <strong
              >{{ $t('PURCHASE.detailsOfExpenses') }} ({{ $t('uiBtn.afterModification') }})</strong
            >
          </template>
          <div class="mb20">
            <el-table
              :data="afterDetailsOfExpensesList"
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
                v-for="item in expenseItemColumns"
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
                  <div v-if="['referenceAmount'].includes(item.prop)">
                    <span>{{ column.label }}</span>
                    <span v-if="legalEntityInfo.currencySymbol"
                      >({{ legalEntityInfo.currencySymbol }})</span
                    >
                  </div>
                  <span v-else>{{ column.label }}</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'amount'">{{
                    $numberStr(scope.row.amount, 6, false, 2)
                  }}</template>
                  <template v-else-if="item.prop === 'referenceAmount'">{{
                    $numberStr(scope.row.referenceAmount, 6, false, 2)
                  }}</template>
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
          !(showBasicUpdateMsg || showDetailList || showDetailsOfExpensesList || showCommonFileList)
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
import { queryUpdateMsgPO } from '@/api/purchaseManagement/purchaseOrder'

export default {
  mixins: [createRevisionDisplayMixin({ switches: ['automatedEmail', 'dropShipping'], dictionaries: { productType: 'product_type' } })],
  dicts: ['p_purchase_order_detail_type', 'product_type'],
  props: {
    businessPartnerId: {
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      activeNames: ['1', '2', '3', '4', '5', '6'],
      basicUpdateMsgList: [],
      beforeCurrencyCode: undefined,
      afterCurrencyCode: undefined,
      beforeDetailList: [],
      afterDetailList: [],
      beforeCommonFileList: [],
      afterCommonFileList: [],
      beforeDetailsOfExpensesList: [],
      afterDetailsOfExpensesList: [],
      updatePropList: [
        {
          prop: 'businessPartnerName',
          label: vm.$t('ui.supplier')
        },
        {
          prop: 'departmentName',
          label: vm.$t('ui.dept')
        },
        {
          prop: 'currency',
          label: vm.$t('ui.currency')
        },
        {
          prop: 'purchasePersonBy',
          label: vm.$t('PURCHASE.purchasePerson')
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
          prop: 'ourRef',
          label: vm.$t('PURCHASE.ourRef')
        },
        {
          prop: 'yourRef',
          label: vm.$t('PURCHASE.yourRef')
        },
        {
          prop: 'validity',
          label: vm.$t('PURCHASE.validityDays')
        },
        {
          prop: 'validityForDay',
          label: vm.$t('PURCHASE.validityDays1')
        },
        /* {
          prop: 'committedDate',
          label: vm.$t('PURCHASE.committedDate')
        }, */
        {
          prop: 'leadTimeForDay',
          label: vm.$t('PURCHASE.leadTimeDays')
        },
        // {
        //   prop: 'conditions',
        //   label: vm.$t('ui.conditions')
        // },
        {
          prop: 'basicRemarks',
          label: `${vm.$t('ui.remarks')}(${vm.$t('ui.basicInfo')})`
        },
        {
          prop: 'automatedEmail',
          label: vm.$t('PURCHASE.automatedEmail')
        },
        {
          prop: 'dropShipping',
          label: vm.$t('PURCHASE.dropShipping')
        },
        {
          prop: 'taxIncluded',
          label: vm.$t('system.taxIncluded')
        },
        {
          prop: 'salesOrderNo',
          label: vm.$t('PURCHASE.salesOrderNo')
        },
        {
          prop: 'incotermName',
          label: vm.$t('PURCHASE.incoterm')
        },
        {
          prop: 'shipToAddressName',
          label: vm.$t('PURCHASE.shipToAddress')
        },
        {
          prop: 'receiveAddressName',
          label: vm.$t('PURCHASE.warehouse')
        },
        {
          prop: 'requestedBy',
          label: vm.$t('PURCHASE.consignee')
        },
        {
          prop: 'requestedEmail',
          label: vm.$t('PURCHASE.requestedEmail')
        },
        {
          prop: 'requestedMobilePhone',
          label: vm.$t('PURCHASE.requestedMobilePhone')
        },
        {
          prop: 'freight',
          label: vm.$t('PURCHASE.freight')
        },
        {
          prop: 'freightTaxNo',
          label: vm.$t('PURCHASE.taxNo')
        },
        {
          prop: 'freightTaxAmount',
          label: vm.$t('PURCHASE.taxAmount')
        },
        {
          prop: 'shipRemarks',
          label: `${vm.$t('ui.remarks')}(${vm.$t('PURCHASE.shippingInfo')})`
        },

        {
          prop: 'totalRemarks',
          label: `${vm.$t('ui.remarks')}(${vm.$t('PURCHASE.productInfo')})`
        },
        {
          prop: 'subTotal',
          label: vm.$t('PURCHASE.subTotal')
        },
        {
          prop: 'totalFreight',
          label: vm.$t('PURCHASE.totalFreight')
        },
        {
          prop: 'totalTaxAmount',
          label: vm.$t('PURCHASE.totalTaxAmount')
        },
        {
          prop: 'totalDiscount',
          label: vm.$t('PURCHASE.totalDiscount')
        },
        {
          prop: 'totalAmount',
          label: vm.$t('PURCHASE.totalAmount')
        },

        {
          prop: 'bpContactPersonName',
          label: vm.$t('PURCHASE.deliveryBy')
        },
        {
          prop: 'bpEmail',
          label: vm.$t('PURCHASE.deliveryEmail')
        },
        {
          prop: 'bpMobilePhone',
          label: vm.$t('PURCHASE.deliveryMobilePhone')
        },
        {
          prop: 'bpAddress',
          label: vm.$t('PURCHASE.deliveryAddress1')
        }
      ],
      /* 表格部分 */
      addressColumns: [
        /* {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          width: 150,
          tooltip: true
        }, */
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          fixed: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
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
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'documentNo',
          label: vm.$t('PURCHASE.PQorPCNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'moq',
          label: vm.$t('PURCHASE.MOQ'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
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
          prop: 'legalEntityLineTotal',
          label: vm.$t('PURCHASE.referenceAmount'),
          visible: true,
          minWidth: 170,
          tooltip: true,
          padding: 50,
          align: 'right'
        },
        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.leadTimeDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'warranty',
          label: vm.$t('PURCHASE.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true
        },
        {
          prop: 'committedDate',
          label: vm.$t('PURCHASE.expectedDeliveryDate'),
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
        },
        {
          prop: 'purchaseRequisiteListShowStr',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          tooltip: true
        }
      ],
      expenseItemColumns: [
        {
          prop: 'expenseItem',
          label: vm.$t('PURCHASE.expenseItem'),
          visible: true,
          minWidth: 200,
          tooltip: true
        },
        {
          prop: 'amount',
          label: vm.$t('PURCHASE.amount'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          align: 'right',
          padding: 50
        },
        {
          prop: 'referenceAmount',
          label: vm.$t('PURCHASE.referenceAmount1'),
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
      ],
      timer: Date.now(),
      changeLogData: {
        changeFieldsNum: 6, // 变更摘要 共 6 处变更
        changeFieldsLabel: 'PO PO-2026-0042 · 版本 v1 → v2 · 修改人：张工 · 2026-03-20 14:32',
        basicUpdateMsgList: [
          /* 基础字段三个类型 */
          {
            changeType: 'add', // add edit delete
            fieldProp: 'yourRef',
            oldValue: { isEmpty: true, value: '—', data: {} },
            newValue: { isEmpty: false, value: 'Net 45', data: {} }
          },
          {
            changeType: 'edit',
            fieldProp: 'yourRef',
            oldValue: { isEmpty: false, value: 'Net 45', data: {} },
            newValue: { isEmpty: false, value: 'Net 99', data: {} }
          },
          {
            changeType: 'delete',
            fieldProp: 'ourRef',
            oldValue: { isEmpty: false, value: 'Net 45', data: {} },
            newValue: { isEmpty: true, value: '—', data: {} }
          },
          /* 付款条款详情字段 */
          {
            changeType: 'edit',
            fieldProp: 'paymentTerm-stageName',
            oldValue: { isEmpty: false, value: '付款条款-阶段名称1', data: {} },
            newValue: { isEmpty: false, value: '付款条款-阶段名称2', data: {} }
          },
          {
            changeType: 'edit',
            fieldProp: 'paymentTerm-percentage', // 付款百分比
            oldValue: { isEmpty: false, value: 30, data: {} },
            newValue: { isEmpty: false, value: 40, data: {} }
          },
          {
            changeType: 'edit',
            fieldProp: 'paymentTerm-stageDescription',
            oldValue: { isEmpty: false, value: '付款条款-阶段描述1', data: {} },
            newValue: { isEmpty: false, value: '付款条款-阶段描述2', data: {} }
          },
          {
            changeType: 'edit',
            fieldProp: 'paymentTerm-remarks',
            oldValue: { isEmpty: false, value: '付款条款-备注1', data: {} },
            newValue: { isEmpty: false, value: '付款条款-备注2', data: {} }
          },
          {
            changeType: 'add', // add edit delete
            fieldProp: 'attachment', // 附件新增
            oldValue: { isEmpty: true, value: '—', data: {} },
            newValue: {
              isEmpty: false,
              value: undefined,
              data: {
                // 附件对象
                id: '16215192480382976',
                size: '5441',
                fileName: '文件名.jpeg'
                // ....
              }
            }
          },
          {
            changeType: 'edit',
            fieldProp: 'commonFile',
            oldValue: {
              isEmpty: false,
              value: undefined,
              data: {
                // 附件对象
                id: '16215192480382976',
                size: '5441',
                fileName: '文件名.jpeg'
                // ....
              }
            },
            newValue: {
              isEmpty: false,
              value: undefined,
              data: {
                // 附件对象
                id: '16215192480382976',
                size: '5441',
                fileName: '文件名.jpeg'
                // ....
              }
            }
          },
          {
            changeType: 'delete',
            fieldProp: 'commonFile',
            oldValue: {
              isEmpty: false,
              value: undefined,
              data: {
                // 附件对象
                id: '16215192480382976',
                size: '5441',
                fileName: '文件名.jpeg'
                // ....
              }
            },
            newValue: { isEmpty: true, value: '—', data: {} }
          }
        ],
        productUpdateMsgList: [
          {
            changeType: 'add', // add edit delete
            productName: '产品名称1', // 产品 ，虚拟产品服务附加费，费用项
            fieldProp: 'description',
            oldValue: { isEmpty: true, value: '—', data: {} },
            newValue: { isEmpty: false, value: 'Net 45', data: {} }
          },
          {
            changeType: 'edit',
            productName: '产品名称1',
            fieldProp: 'description',
            oldValue: { isEmpty: false, value: 'Net 45', data: {} },
            newValue: { isEmpty: false, value: 'Net 99', data: {} }
          },
          {
            changeType: 'delete',
            productName: '产品名称3',
            fieldProp: 'description',
            oldValue: { isEmpty: false, value: 'Net 45', data: {} },
            newValue: { isEmpty: true, value: '—', data: {} }
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    showDetailList() {
      return this.beforeDetailList.length > 0 || this.afterDetailList.length > 0
    },
    showDetailsOfExpensesList() {
      return (
        this.beforeDetailsOfExpensesList.length > 0 || this.afterDetailsOfExpensesList.length > 0
      )
    },

    showBasicUpdateMsg() {
      return this.basicUpdateMsgList.length > 0
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },

    showCommonFileList() {
      return this.beforeCommonFileList.length > 0 || this.afterCommonFileList.length > 0
    },
    documentNoIsHide() {
      const list = [...this.beforeDetailList, ...this.afterDetailList]
      return !list.find((x) => {
        return this.$resultOfBoolean(x.aslUnitPrice) || x.documentNo
      })
    },
    costProjectCodeIsHide() {
      const list = [...this.beforeDetailList, ...this.afterDetailList]
      return !list.find((x) => x.costProjectCode)
    },
    legalEntityLineTotalIsHide() {
      return (
        this.legalEntityInfo.currencyCode === this.beforeCurrencyCode &&
        this.legalEntityInfo.currencyCode === this.afterCurrencyCode
      )
    },
    visibleCurColumns() {
      let arr = this.addressColumns
      const filterProps1 = []
      if (this.documentNoIsHide) {
        filterProps1.push('documentNo')
      }
      if (this.costProjectCodeIsHide) {
        filterProps1.push('costProjectCode')
      }
      if (this.legalEntityLineTotalIsHide) {
        filterProps1.push('exchangeRateDesc')
        filterProps1.push('legalEntityLineTotal')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))
      return arr
    }
  },

  methods: {
    closed() {
      this.basicUpdateMsgList = []
      this.beforeDetailList = []
      this.afterDetailList = []
      this.beforeCommonFileList = []
      this.afterCommonFileList = []
      this.beforeDetailsOfExpensesList = []
      this.afterDetailsOfExpensesList = []
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
      this.activeNames = ['1', '2', '3', '4', '5', '6']
      queryUpdateMsgPO({ purchaseOrderId: id }).then((res) => {
        const results = res.data || {}
        this.beforeCurrencyCode = results.beforeCurrencyCode
        this.afterCurrencyCode = results.afterCurrencyCode

        this.beforeExchangeRateDesc = results.beforeExchangeRateDesc
        this.afterExchangeRateDesc = results.afterExchangeRateDesc

        this.visible = true
        this.basicUpdateMsgList = this.getBasicUpdateMsgList(results.basicUpdateMsgList || [])
        this.beforeDetailList = this.getDetailList(
          results.beforeDetailList || [],
          results.beforeDetailsOfExpensesList || [],
          results.basicUpdateMsgList || [],
          'before'
        )
        this.afterDetailList = this.getDetailList(
          results.afterDetailList || [],
          results.afterDetailsOfExpensesList || [],
          results.basicUpdateMsgList || []
        )
        this.beforeCommonFileList = results.beforeCommonFileList || []
        this.afterCommonFileList = results.afterCommonFileList || []
        // this.beforeDetailsOfExpensesList = results.beforeDetailsOfExpensesList || []
        // this.afterDetailsOfExpensesList = results.afterDetailsOfExpensesList || []

        setTimeout(() => {
          this.$refs.uploadRef1.initFileList(results.beforeCommonFileList)
          this.$refs.uploadRef2.initFileList(results.afterCommonFileList)
        }, 100)
      })
    },
    getDetailList(detailList, detailsOfExpensesList, basicUpdateMsgList, type) {
      const table = detailList
      table.forEach((item) => {
        if (item.serviceSurchargeList) {
          item.serviceSurchargeList.forEach((child) => {
            child.productName = child.expenseItemName
            child.purchaseUom = child.unit
            child.purchaseQty = child.qty
            const updateMsgList = child.updateMsgList || []
            updateMsgList.forEach((x) => {
              if (x.name === 'expenseItemName') {
                x.name = 'productName'
              } else if (x.name === 'qty') {
                x.name = 'purchaseQty'
              }
            })
          })
        }
        if (item.aslUnitPrice) {
          item.documentNo = 'ASL'
        }
      })
      const table2 = detailsOfExpensesList || []
      table2.forEach((item) => {
        item.productName = item.expenseItem
        item.unitPrice = item.amount
        item.lineTotal = item.amount
        item.legalEntityLineTotal = item.referenceAmount
        const updateMsgList = item.updateMsgList || []
        updateMsgList.forEach((x) => {
          if (x.name === 'expenseItem') {
            x.name = 'productName'
          } else if (x.name === 'amount') {
            x.name = 'unitPrice'
          } else if (x.name === 'referenceAmount') {
            x.name = 'legalEntityLineTotal'
          }
        })
      })
      const list = [...table, ...table2]

      list.forEach((item) => {
        const isChangeExchangeRateDesc = basicUpdateMsgList.find(
          (x) => x.name === 'exchangeRateDesc'
        )
        if (isChangeExchangeRateDesc) {
          if (item.updateMsgList) {
            item.updateMsgList.push({ name: 'exchangeRateDesc' })
          }
        }

        if (type && type === 'before') {
          item.exchangeRateDesc = this.beforeExchangeRateDesc
        } else {
          item.exchangeRateDesc = this.afterExchangeRateDesc
        }
        if (item.serviceSurchargeList) {
          item.serviceSurchargeList.forEach((child) => {
            if (isChangeExchangeRateDesc) {
              if (child.updateMsgList) {
                child.updateMsgList.push({ name: 'exchangeRateDesc' })
              }
            }
            if (type && type === 'before') {
              child.exchangeRateDesc = this.beforeExchangeRateDesc
            } else {
              child.exchangeRateDesc = this.afterExchangeRateDesc
            }
          })
        }
      })

      this.resetSnNum(list)
      return list
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        this.timer++
        item.rowTimeId = this.timer
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
    },
    getBasicUpdateMsgList(MsgList) {
      const MsgObj = {}
      const MsgShowList = []
      MsgList.forEach((item) => {
        if (['validity', 'committedDate'].includes(item.name)) {
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
          item.beforeValue = this.$numberStr(item.beforeValue, 6, false, 2)
          item.afterValue = this.$numberStr(item.afterValue, 6, false, 2)
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
        item.taxAmount = vm.$numberStr(item.taxAmount, 6, false, 2)
        return item
      })
    }
  }
}
</script>
<style lang="scss"></style>
