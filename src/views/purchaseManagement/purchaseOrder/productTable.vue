<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane name="1">
          <span slot="label">
            <span>{{ $t('PURCHASE.productDetail') }}</span>
            <span v-show="comTableList.length" class="ml5">({{ comTableList.length }})</span>
          </span>
        </el-tab-pane>
        <el-tab-pane name="3" v-if="!comDisFrom || curFileList.length > 0">
          <span slot="label">
            <span>{{ $t('PURCHASE.attachmentInfo') }}</span>
            <span v-show="comCurFileListLength" class="ml5">({{ comCurFileListLength }})</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <div v-show="activeName === '1'">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="(!comDisFrom && totalForm.warehouseType !== '2') || isRevise">
          <!-- v-if="
            (!comDisFrom &&
              totalForm.warehouseType !== '2' &&
              formData.isEmergencyGoodsReceipt !== '1') ||
            isRevise
          " -->
          <el-button
            @click="handleAddBtn"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :disabled="comDisAddBtn"
            >{{ $t('PURCHASE.addProduct') }}</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="isExpenseItemCanEdit">
          <el-button @click="handleAddExpenseItem" type="primary" icon="el-icon-plus" size="mini">{{
            $t('PURCHASE.addExpenseItem')
          }}</el-button>
        </el-col>
        <!-- <el-col :span="1.5" v-if="(formData.buttonAuthMsg || {}).isCanReplaced === '1'">
          <el-button @click="handleRegisterReplacement" type="primary" size="mini">{{
            $t('menu.registerReplacement')
          }}</el-button>
        </el-col> -->
        <el-col :span="1.5" v-if="false">
          <el-button
            :disabled="selected.length <= 0"
            @click="handleDelete"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            >{{ $t('uiBtn.delete') }}</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="(formData.buttonAuthMsg || {}).isCanConfirmDelivery === '1'">
          <el-button @click="handleConfirmDelivery" type="primary" size="mini">{{
            $t('PURCHASE.confirmDelivery')
          }}</el-button>
        </el-col>
        <right-toolbar
          :showSearchBtn="false"
          :showRefreshBtn="false"
          :saveKey="saveKey"
          :savePath="savePath"
          :columns="configCurColumn"
          :columnsInit="adjustableColumns"
        >
        </right-toolbar>
      </el-row>
      <el-table
        border
        ref="tables"
        class="tables"
        v-loading="loading"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellClassName"
        :data="comTableList"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        :row-key="rowIdKey"
        :key="tableKey + modifyHighlight"
        :tree-props="{ children: 'tableChildList', hasChildren: 'hasChildren' }"
        default-expand-all
        v-table-tab
        @row-dblclick="handleUpdate"
        @sort-change="handleSortChange"
      >
        <el-table-column
          v-if="false"
          type="selection"
          key="selection"
          align="center"
          width="55"
        ></el-table-column>
        <el-table-column
          v-for="item in getVisibleColumn(comVisibleColumn)"
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
                  'productName',
                  'purchaseQty',
                  formData.createType === '2' || isRevise ? 'unitPrice' : '',
                  // isRevise ? 'externalPartNo' : '',
                  formData.isEmergencyGoodsReceipt === '1' || isRevise ? 'leadTime' : '',
                  formData.isEmergencyGoodsReceipt === '1' ? 'purchaseRequisiteListShowStr' : '',
                  formData.isEmergencyGoodsReceipt === '1' ? 'purchaseUom' : ''
                ].includes(item.prop)
              "
            >
              <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
              <span v-if="item.prop === 'unitPrice' && formData.currencySymbol"
                >({{ formData.currencySymbol }})</span
              >
            </span>
            <span v-else-if="['legalEntityLineTotal'].includes(item.prop)">
              <span>{{ column.label }}</span>
              <span v-if="legalEntityInfo.currencySymbol"
                >({{ legalEntityInfo.currencySymbol }})</span
              >
            </span>
            <span v-else-if="['unitPrice'].includes(item.prop)">
              <span>{{ column.label }}</span>
              <span v-if="formData.currencySymbol">({{ formData.currencySymbol }})</span>
            </span>
            <span v-else>{{ column.label }}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row._isPoAssignChild">
              <template v-if="item.prop === 'productName'">
                <span
                  style="display: inline-block; margin-right: 4px; font-size: 12px; flex-shrink: 0"
                  :class="[`level-${scope.row.levelNum}`, scope.row.isTopItem ? 'topItem' : '']"
                  >{{ scope.row.snNum + '. ' }}</span
                >
                <span class="ellipsis-text">{{ getAssignDisplayValue(scope.row, item.prop) }}</span>
              </template>
              <template v-else-if="item.prop === 'purchaseRequisiteListShowStr'">
                <span v-if="scope.row._isPoStockRow">{{ $t('PURCHASE.excessStock') }}</span>
                <span v-else class="ellipsis-text source-document-text">
                  {{ scope.row.purchaseRequisiteNo }}
                </span>
              </template>
              <template v-else-if="item.prop === 'purchaseQty'">
                <el-input-number
                  v-thousandSplit="{ precision: scope.row.decimalNum }"
                  v-if="canQuickEditPurchaseQty(scope.row)"
                  style="width: 98%"
                  size="mini"
                  v-model="scope.row.purchaseQty"
                  controls-position="right"
                  :precision="scope.row.decimalNum"
                  :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                  :max="999999999"
                  @change="purchaseQtyChange(scope.row)"
                />
                <template v-else>{{
                  $numberStr(scope.row.purchaseQty, scope.row.decimalNum)
                }}</template>
                <TablePropError v-if="scope.row.purchaseQtyError" />
                <!-- <div
                  class="flow1"
                  style="color: #ff4949; font-size: 12px; text-align: left; word-break: normal"
                  v-if="scope.row.salesDropShippingPrFlag === '1'"
                >
                  {{
                    $t('PURCHASE.overDelivery').replace(
                      '$1',
                      $numberStr(scope.row.overDeliveryQty, scope.row.decimalNum)
                    )
                  }}
                </div> -->
              </template>
              <template
                v-else-if="['unitPrice', 'lineTotal', 'legalEntityLineTotal'].includes(item.prop)"
              >
                {{ $numberStr(getAssignDisplayValue(scope.row, item.prop), 6, false, 2) }}
              </template>
              <template
                v-else-if="
                  ['internalPartNo', 'purchaseUom', 'exchangeRateDesc'].includes(item.prop)
                "
              >
                {{ getAssignDisplayValue(scope.row, item.prop) }}
              </template>
              <template
                v-else-if="
                  ['moq', 'stockInQty', 'receiptQty', 'qcFailedQty', 'rejectedQty'].includes(
                    item.prop
                  )
                "
              >
                {{ $numberStr(getAssignDisplayValue(scope.row, item.prop), scope.row.decimalNum) }}
              </template>
              <!-- <template v-else>{{ getAssignDisplayValue(scope.row, item.prop) }}</template> -->
            </template>
            <!-- <template v-if="item.prop === 'purchaseOrderDetailType'">
              <el-select
                v-if="!comDisFrom && totalForm.warehouseType !== '2'"
                style="width: 98%"
                v-model="scope.row.purchaseOrderDetailType"
                placeholder=""
                @change="purchaseOrderDetailTypeChange(scope.row)"
              >
                <el-option
                  v-for="dict in dict.type.p_purchase_order_detail_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <template v-else>{{ scope.row[item.propBy] }}</template>
            </template> -->
            <template v-else-if="item.prop === 'productType'">
              <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
              <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
              <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
            </template>
            <template v-else-if="item.prop === 'productName'">
              <span
                v-if="
                  getTableChildList(scope.row).length <= 0 &&
                  scope.row.levelNum === 1 &&
                  existLevel2
                "
                style="display: inline-block; width: 23px; flex-shrink: 0"
              ></span>
              <span
                style="display: inline-block; margin-right: 4px; font-size: 12px; flex-shrink: 0"
                :class="[`level-${scope.row.levelNum}`, scope.row.isTopItem ? 'topItem' : '']"
                >{{ scope.row.snNum + '. ' }}</span
              >
              <div v-if="scope.row.isExpenseItem === '1'" class="po-product-name-content">
                <el-input
                  v-if="isExpenseItemCanEdit"
                  style="width: 98%"
                  :title="scope.row.expenseItem"
                  v-model="scope.row.expenseItem"
                  :maxlength="50"
                  @change="expenseItemChange(scope.row)"
                />
                <span class="flow1" v-else>{{ scope.row.expenseItem }}</span>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </div>
              <div
                v-else-if="!scope.row.productId"
                class="po-product-name-content flow1"
                style="box-sizing: border-box"
              >
                <selectExpenseItemName
                  style="width: 98%"
                  :value="scope.row.expenseItemName"
                  :canSelectOptions="
                    getServiceSurchargeListOptions(serviceSurchargeListOptions, scope.row)
                  "
                  :allOptions="serviceSurchargeListOptions"
                  @change="productNameChange($event, scope.row)"
                  v-if="!comDisFrom && scope.row.isNewData === '1'"
                />
                <span class="flow1" v-else>{{ scope.row.expenseItemName }}</span>
                <div>
                  <TablePropError v-if="scope.row.productNameError" />
                </div>
              </div>
              <span v-else class="po-product-name-content">{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop === 'documentNo'">
              <!-- <el-select
                style="width: 98%"
                v-model="scope.row.documentNo"
                placeholder=""
                v-if="!comDisFrom && totalForm.warehouseType !== '2'"
                size="mini"
                @change="documentNoChange(scope.row)"
              >
                <el-option
                  v-for="item in scope.row.pplList || []"
                  :key="item.documentNo"
                  :label="item.documentNo"
                  :value="item.documentNo"
                >
                </el-option>
              </el-select> -->
              <!-- <template v-if="formData.createType === '2'">{{ 'ASL' }}</template> -->
              <template v-if="$resultOfBoolean(scope.row.aslUnitPrice)">{{ 'ASL' }}</template>
              <template v-else>{{ scope.row.documentNo }}</template>
            </template>
            <template v-else-if="item.prop === 'externalPartNo'">
              <el-input
                v-if="isRevise && scope.row.productId"
                style="width: 98%"
                :title="scope.row.externalPartNo"
                v-model="scope.row.externalPartNo"
                :maxlength="200"
              />
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template v-else-if="item.prop === 'purchaseQty' && scope.row.isExpenseItem !== '1'">
              <!-- <template v-if="!comDisFrom && totalForm.warehouseType !== '2'">
                <el-input-number
                  v-thousandSplit="{ precision: scope.row.decimalNum }"
                  v-if="!scope.row.purchaseRequisiteListShowStr"
                  style="width: 98%"
                  v-model="scope.row.purchaseQty"
                  controls-position="right"
                  :precision="scope.row.decimalNum"
                  :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                  :max="999999999"
                  disabled
                  @change="purchaseQtyChange(scope.row)"
                />
                <SelectInput
                  v-else
                  :clearable="false"
                  style="width: 98%"
                  :value="$numberStr(scope.row[item.prop], scope.row.decimalNum)"
                  @click="handleEditRow(scope.row)"
                />
              </template> -->
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                v-if="canQuickEditPurchaseQty(scope.row)"
                style="width: 98%"
                size="mini"
                v-model="scope.row.purchaseQty"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999999"
                @change="purchaseQtyChange(scope.row)"
              />
              <div
                @mouseenter="showPop1($event, scope.row.qtyShowMsgListForQty)"
                @mouseleave="hidePop1($event, scope.row)"
                v-else-if="scope.row.productId"
              >
                <div class="ellipsis-text">
                  {{
                    $numberStr(
                      scope.row[item.prop],
                      scope.row.decimalNum,
                      scope.row.isAdhocEntry !== '1'
                    )
                  }}
                </div>
              </div>
              <template v-else>
                <el-input-number
                  v-thousandSplit="{ precision: scope.row.decimalNum, keepDec: false }"
                  v-if="
                    !comDisFrom &&
                    (formData.purchaseQuotationId ||
                      scope.row.documentId ||
                      scope.row.isNewData === '1')
                  "
                  style="width: 98%"
                  v-model="scope.row.qty"
                  controls-position="right"
                  :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                  :max="scope.row.qtyLimit"
                  @change="expenseItemQtyChange(scope.row)"
                />
                <span v-else>{{ scope.row.qty }}</span>
              </template>
              <TablePropError v-if="scope.row.purchaseQtyError" />
              <div
                style="color: #ff4949; font-size: 12px; text-align: left; word-break: normal"
                class="flow1"
                :title="
                  $t('PURCHASE.overDelivery').replace(
                    '$1',
                    $numberStr(scope.row.overDeliveryQty, scope.row.decimalNum)
                  )
                "
                v-if="scope.row.salesDropShippingPrFlag === '1'"
              >
                {{
                  $t('PURCHASE.overDelivery').replace(
                    '$1',
                    $numberStr(scope.row.overDeliveryQty, scope.row.decimalNum)
                  )
                }}
              </div>
            </template>
            <template v-else-if="item.prop === 'unitPrice'">
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
                  @change="amountChange(scope.row)"
                  v-if="isExpenseItemCanEdit"
                />
                <span v-else>{{ $numberStr(scope.row.amount, 6, false, 2) }}</span>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <div
                v-else-if="
                  scope.row.productId || scope.row.expenseItemName || scope.row.isNewData === '1'
                "
              >
                <div class="ellipsis-text flexStart">
                  <!-- <span class="primary-pointer" @click="unitPriceClick(scope.row)">{{
                    $numberStr(scope.row[item.prop], 6, false, 2)
                  }}</span> -->
                  <template v-if="(!comDisFrom && formData.createType === '2') || isRevise">
                    <div class="flexStart">
                      <el-input-number
                        v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                        style="width: 180px"
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
                        :disabled="
                          scope.row.isCanUpdateUnitPrice !== '1' &&
                          !isRevise &&
                          scope.row.isNewData !== '1'
                        "
                        @change="changeUnitPrice(scope.row)"
                      />
                      <svg-icon
                        @mouseenter="showPop2($event, scope.row)"
                        @mouseleave="hidePop2($event, scope.row)"
                        :icon-class="
                          getUnitPriceChartIcon(scope.row.unitPrice, scope.row.lastUnitPrice)
                        "
                        style="font-size: 20px; color: #333"
                        class="ml10"
                        v-if="scope.row.productId"
                      />
                    </div>
                    <!-- :min="scope.row.minUnitPrice"
                      :max="scope.row.maxUnitPrice" -->
                  </template>

                  <div
                    class="primary-pointer flexEnd"
                    style="width: 0; flex: 1; text-align: right"
                    @click="unitPriceClick(scope.row)"
                    v-else-if="scope.row.productId"
                  >
                    <span class="flow1">{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</span>
                    <svg-icon
                      @mouseenter="showPop2($event, scope.row)"
                      @mouseleave="hidePop2($event, scope.row)"
                      :icon-class="
                        getUnitPriceChartIcon(scope.row.unitPrice, scope.row.lastUnitPrice)
                      "
                      style="font-size: 20px; color: #333"
                      class="ml10 fs-0"
                      v-if="scope.row.productId"
                    />
                  </div>
                  <div class="flexEnd" style="width: 0; flex: 1; text-align: right" v-else>
                    <span class="flow1">{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</span>
                    <svg-icon
                      @mouseenter="showPop2($event, scope.row)"
                      @mouseleave="hidePop2($event, scope.row)"
                      :icon-class="
                        getUnitPriceChartIcon(scope.row.unitPrice, scope.row.lastUnitPrice)
                      "
                      style="font-size: 20px; color: #333"
                      class="ml10 fs-0"
                      v-if="scope.row.productId"
                    />
                  </div>
                </div>
                <div
                  v-if="
                    formData.createType === '2' &&
                    (['1', '2'].indexOf(formData.purchaseOrderStatus) !== -1 || !comDisFrom) &&
                    !$resultOfBoolean(scope.row.minUnitPrice) &&
                    formData.isEmergencyGoodsReceipt === '1' &&
                    $resultOfBoolean(scope.row.unitPrice) &&
                    $resultOfBoolean(scope.row.emergencyUnitPrice) &&
                    scope.row.unitPrice !== scope.row.emergencyUnitPrice
                  "
                  style="
                    color: #ff4949;
                    font-size: 12px;
                    line-height: 13px;
                    padding: 3px 0;
                    text-align: left;
                    white-space: normal;
                    word-break: normal;
                  "
                >
                  {{ $t('PURCHASE.unitPriceDiffersEGR') }}
                </div>
                <div
                  v-if="
                    showASLPriceRange(scope.row) &&
                    formData.createType === '2' &&
                    (['1', '2'].indexOf(formData.purchaseOrderStatus) !== -1 || !comDisFrom)
                  "
                  style="
                    color: #ff4949;
                    font-size: 12px;
                    line-height: 13px;
                    padding: 3px 0;
                    text-align: left;
                    white-space: normal;
                    word-break: normal;
                  "
                >
                  {{
                    scope.row.unitPrice < scope.row.minUnitPrice
                      ? $t('PURCHASE.belowASLPrice').replace(
                          '$1',
                          formData.currencySymbol +
                            '' +
                            $numberStr(scope.row.minUnitPrice - scope.row.unitPrice, 6, false, 2)
                        )
                      : $t('PURCHASE.aboveASLPrice').replace(
                          '$1',
                          `${
                            formData.currencySymbol +
                            '' +
                            $numberStr(scope.row.unitPrice - scope.row.maxUnitPrice, 6, false, 2)
                          }`
                        )
                  }}
                </div>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </div>
              <span v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</span>
            </template>
            <!-- <template v-else-if="item.prop === 'discount'">
              <el-input-number
                v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                v-if="!comDisFrom && scope.row.purchaseOrderDetailType === '1'"
                style="width: 98%"
                v-model="scope.row.discount"
                controls-position="right"
                :precision="6"
                :min-precision="2"
                :min="0"
                :max="(scope.row.purchaseQty || 0) * (scope.row.unitPrice || 0) || 999999999999.99"
                @change="discountChange(scope.row)"
              />
              <template v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template> -->
            <template v-else-if="item.prop === 'lineTotal'">
              <template v-if="scope.row.isExpenseItem === '1'">{{
                $numberStr(scope.row.amount, 6, false, 2)
              }}</template>
              <template v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'legalEntityLineTotal'">
              <template v-if="scope.row.isExpenseItem === '1'">{{
                $numberStr(scope.row.referenceAmount, 6, false, 2)
              }}</template>

              <template v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </template>
            <template v-else-if="item.prop === 'moq'">
              <el-input-number
                v-thousandSplit="{ precision: scope.row.decimalNum }"
                v-if="
                  !comDisFrom &&
                  formData.isEmergencyGoodsReceipt === '1' &&
                  !$resultOfBoolean(scope.row.aslUnitPrice) &&
                  scope.row.productId
                "
                style="width: 98%"
                v-model="scope.row.moq"
                controls-position="right"
                :precision="scope.row.decimalNum"
                :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                :max="999999"
              />
              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </template>

            <template v-else-if="item.prop === 'committedDate'">
              {{ parseTime(scope.row[item.prop], fmtForYmd) }}
            </template>

            <template
              v-else-if="
                item.prop === 'leadTime' &&
                scope.row.isExpenseItem !== '1' &&
                scope.row.isNewData !== '1'
              "
            >
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                v-if="
                  (!comDisFrom &&
                    formData.isEmergencyGoodsReceipt === '1' &&
                    (scope.row.isCustomProduct === '1' ||
                      !$resultOfBoolean(scope.row.aslUnitPrice)) &&
                    !scope.row.expenseItemName) ||
                  (isRevise && !scope.row.expenseItemName)
                "
                style="width: 98%"
                v-model="scope.row.leadTime"
                controls-position="right"
                :precision="0"
                :min="1"
                :max="999"
                @change="leadTimeChange(scope.row, scope.$index)"
              />
              <div class="flexSb" v-else>
                <template>{{ $numberStr(scope.row[item.prop], 0) }}</template>
                <div class="fs-0" v-if="scope.row.leadTimeIsTimeOut === '1'">
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      <div v-if="scope.row.leadTimeIsTimeOut === '1'">
                        {{ scope.row.leadTimeIsTimeOutTips }}
                      </div>
                    </div>
                    <div class="flexCen">
                      <svg-icon
                        icon-class="warning"
                        class="ml10"
                        style="height: 20px; width: 20px"
                      />
                    </div>
                  </el-tooltip>
                </div>
              </div>
              <TablePropError v-if="scope.row.leadTimeError" />
            </template>
            <template
              v-else-if="
                item.prop === 'warranty' &&
                scope.row.isExpenseItem !== '1' &&
                !scope.row.sourceDocId &&
                scope.row.isNewData !== '1'
              "
            >
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                v-if="
                  !comDisFrom &&
                  formData.isEmergencyGoodsReceipt === '1' &&
                  !$resultOfBoolean(scope.row.aslUnitPrice)
                "
                style="width: 98%"
                v-model="scope.row.warranty"
                controls-position="right"
                :precision="0"
                :min="1"
                :max="9999"
                @change="changeWarranty(scope.$index)"
              />
              <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
            </template>
            <template v-else-if="item.prop === 'remarks'">
              <descriptionEditDlg
                v-model="scope.row.remarks"
                :maxlength="200"
                :disabled="!(!comDisFrom || isRevise)"
              />
            </template>
            <template v-else-if="item.prop === 'purchaseRequisiteListShowStr'">
              <div class="po-source-document-content">
                <template v-if="formData.isEmergencyGoodsReceipt === '1'">
                  <el-select
                    v-if="!comDisFrom && (scope.row.documentId || scope.row.isNewData === '1')"
                    class="log-msg-ellipsis source-document-select"
                    v-model="scope.row.sourceDocIdList"
                    placeholder=""
                    multiple
                    collapse-tags
                    @change="sourceDocIdListChange(scope.row)"
                  >
                    <el-option
                      v-for="sourceItem in scope.row.emergencyGoodsReceiptList"
                      :key="sourceItem.emergencyGoodsReceiptId"
                      :label="sourceItem.emergencyGoodsReceiptNo"
                      :value="sourceItem.emergencyGoodsReceiptId"
                    />
                  </el-select>
                  <span
                    v-else-if="
                      scope.row.documentId &&
                      !scope.row.purchaseOrderDetailId &&
                      !scope.row.productId
                    "
                    :title="scope.row.sourceDocNo"
                    >{{ scope.row.sourceDocNo }}</span
                  >
                </template>
                <span
                  v-else-if="scope.row.purchaseRequisiteListShowStr"
                  class="primary ellipsis-text source-document-text"
                  @mouseenter="showPop($event, scope.row)"
                  @mouseleave="hidePop($event, scope.row)"
                >
                  {{ scope.row.purchaseRequisiteListShowStr }}
                </span>
                <TablePropError v-if="scope.row.purchaseRequisiteListShowStrError" />
              </div>
            </template>
            <template v-else-if="item.prop === 'stockInQty'">
              <div
                @mouseenter="showPop1($event, scope.row.qtyShowMsgListForStockInQty)"
                @mouseleave="hidePop1($event, scope.row)"
              >
                <div class="ellipsis-text">
                  {{
                    $numberStr(scope.row[item.prop], scope.row.decimalNum, !!scope.row.productId)
                  }}
                </div>
              </div>
              <!-- <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template> -->
            </template>
            <template v-else-if="item.prop === 'qcFailedQty'">
              <div
                @mouseenter="showPop1($event, scope.row.qtyShowMsgListForQcFailedQty)"
                @mouseleave="hidePop1($event, scope.row)"
              >
                <div class="ellipsis-text">
                  {{
                    $numberStr(scope.row[item.prop], scope.row.decimalNum, !!scope.row.productId)
                  }}
                </div>
              </div>
              <!-- <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template> -->
            </template>
            <template v-else-if="item.prop === 'rejectedQty'">
              <!-- <div
                @mouseenter="showPop1($event, scope.row.rejectedQty)"
                @mouseleave="hidePop1($event, scope.row)"
              >
                <div class="ellipsis-text"> -->
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum, !!scope.row.productId) }}
              <!-- </div> -->
              <!-- </div> -->
              <!-- <template>{{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}</template> -->
            </template>
            <template v-else-if="item.prop === 'replacedQty'">
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
            </template>
            <template v-else-if="item.prop === 'receiptQty'">
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum, !!scope.row.productId) }}
            </template>
            <template v-else-if="item.prop === 'pendReplacementQty'">
              {{ $numberStr(scope.row[item.prop], scope.row.decimalNum, !!scope.row.productId) }}
            </template>
            <template v-else-if="item.prop === 'purchaseUom'">
              <el-select
                style="width: 98%"
                v-model="scope.row.unit"
                filterable
                :title="showUomLabel(scope.row.unit)"
                placeholder=""
                @change="adhocEntryUomChange(scope.row)"
                v-if="scope.row.isNewData === '1' && scope.row.isCustom === '1' && !comDisFrom"
              >
                <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>

              <template v-else>
                <span v-if="scope.row.productId" :title="showUomLabel(scope.row[item.prop])">{{
                  scope.row[item.prop]
                }}</span>
                <span v-if="!scope.row.productId" :title="showUomLabel(scope.row.unit)">{{
                  scope.row.unit
                }}</span>
              </template>
              <TablePropError v-if="scope.row.purchaseUomError" />
            </template>
            <template v-else-if="item.prop === 'description'">
              <descriptionEditDlg
                v-if="(!comDisFrom && formData.createType === '2' && poEdit === '1') || isRevise"
                v-model="scope.row.description"
                :maxlength="7000"
              />
              <DescriptionToolTipShow v-else :showStr="scope.row[item.prop]" />
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          :key="'action' + showTableAction"
          align="center"
          width="120"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="
            showTableAction ||
            ((formData.detailsOfExpensesList || []).length > 0 && isExpenseItemCanEdit)
          "
        >
          <!-- v-if="
            formData.isEmergencyGoodsReceipt !== '1' &&
            (showTableAction ||
              ((formData.detailsOfExpensesList || []).length > 0 && isExpenseItemCanEdit))
          " -->
          <template slot-scope="scope">
            <div class="product-row-actions">
              <span v-if="tableActionSlots.edit" class="product-row-action-slot">
                <i
                  v-if="getRowActions(scope.row).edit"
                  class="el-icon-edit pointer"
                  style="font-size: 20px; color: #409eff"
                  @click="handleEditRow(scope.row)"
                ></i>
              </span>
              <span v-if="tableActionSlots.add" class="product-row-action-slot">
                <i
                  v-if="getRowActions(scope.row).add"
                  class="el-icon-plus pointer"
                  style="font-size: 20px; color: #409eff"
                  :title="$t('uiBtn.add')"
                  @click="handleAddChild(scope.row)"
                ></i>
              </span>
              <span v-if="tableActionSlots.delete" class="product-row-action-slot">
                <i
                  v-if="getRowActions(scope.row).delete"
                  class="el-icon-delete pointer"
                  style="font-size: 20px; color: #f56c6c"
                  :title="$t('uiBtn.delete')"
                  @click="handleDelRow(scope.$index, scope.row)"
                ></i>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt20" v-if="false">
        <ExpenseItemTable
          :formData="formData"
          :countryId="countryId"
          :businessPartnerId="businessPartnerId"
          :currencyId="currencyId"
          :modifyHighlight="modifyHighlight"
          :comDisFrom="isRevise ? false : comDisFrom || formData.createType === '1'"
          @changeDetailsOfExpenses="handleCalculate"
        />
      </div>
    </div>

    <div v-show="activeName === '3'">
      <myUpload
        ref="uploadRef"
        :disabled="comDisFrom && !isRevise"
        :updateFileList="updateFileList"
        :fomType="'Purchase Order'"
        :limit="9"
        :modifyHighlight="modifyHighlight"
      />
    </div>
    <div v-show="activeName === '1' || activeName === '2'">
      <el-form
        ref="totalForm"
        class="mt20"
        :model="totalForm"
        :rules="totalRules"
        label-width="140px"
      >
        <div class="flex">
          <div class="flex-1">
            <el-form-item
              :label="`${$t('ui.remarks')}`"
              prop="totalRemarks"
              :class="[isModified('totalRemarks')]"
            >
              <MyInput
                v-model="totalForm.totalRemarks"
                :maxlength="3000"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 10 }"
                :disabled="comDisFrom"
                show-word-limit
                resize="none"
              >
              </MyInput>
            </el-form-item>
          </div>
          <div style="width: 40%; max-width: 600px; margin-right: 0px">
            <el-form-item :label="`${$t('PURCHASE.subTotal')}`" prop="subTotal">
              <ComparisonInput
                v-if="isModified('subTotal')"
                :beforeValue="$numberStr(getBeforeValue('subTotal'), 2, false, 2)"
                :afterValue="$numberStr(totalForm.subTotal, 2, false, 2)"
              />
              <el-input
                v-else
                :value="$numberStr(totalForm.subTotal, 2, false, 2)"
                disabled
              ></el-input>
            </el-form-item>

            <!-- <el-form-item
              :label="`${$t('PURCHASE.totalFreight')}`"
              prop="totalFreight"
              :class="[isModified('totalFreight')]"
            >
              <el-input-number
                v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                v-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.totalFreight"
                controls-position="right"
                :precision="6"
                :min-precision="2"
                :min="0"
                :max="999999999999.99"
                @input="totalDiscountChange"
              />
              <el-input
                v-else
                :value="$numberStr(totalForm.totalFreight, 6, false, 2)"
                disabled
              ></el-input>
            </el-form-item> -->

            <!--  <el-form-item
              :label="`${$t('PURCHASE.totalDiscount')}`"
              prop="totalDiscount"
              :class="[isModified('totalDiscount')]"
            >
              <el-input-number
                v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                v-if="!comDisFrom"
                style="width: 100%"
                v-model="totalForm.totalDiscount"
                controls-position="right"
                :precision="6"
                :min-precision="2"
                :min="0"
                :max="999999999999.99"
                @input="totalDiscountChange"
              />
              <el-input
                v-else
                :value="$numberStr(totalForm.totalDiscount, 6, false, 2)"
                disabled
              ></el-input>
            </el-form-item> -->

            <el-form-item :label="`${$t('PURCHASE.taxRate')}`">
              <el-input-number
                v-thousandSplit="{ precision: 1 }"
                v-model="totalForm.taxRate"
                :disabled="true"
                :precision="1"
                type="number"
                class="form-wd"
                :min="0"
                :max="100"
                placeholder=""
                style="width: 100%"
                controls-position="right"
                @change="inputNumberChange('taxRate')"
              />
            </el-form-item>

            <el-form-item :label="`${$t('PURCHASE.taxAmount')}`" prop="totalTaxAmount">
              <ComparisonInput
                v-if="isModified('totalTaxAmount')"
                :beforeValue="$numberStr(getBeforeValue('totalTaxAmount'), 2, false, 2)"
                :afterValue="$numberStr(totalForm.totalTaxAmount, 2, false, 2)"
              />
              <el-input
                v-else
                :value="$numberStr(totalForm.totalTaxAmount, 2, false, 2)"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="`${$t('PURCHASE.totalAmount')}`"
              prop="totalAmount"
              :class="[isModified('totalAmount')]"
              :error="
                totalForm.isTotalAmountNegativeTips === '1'
                  ? totalForm.totalAmountNegativeTipsMsg
                  : ''
              "
              ref="totalAmountRef"
            >
              <div class="input-switch-box">
                <div class="con-left">
                  <ComparisonInput
                    v-if="isModified('totalAmount')"
                    :beforeValue="$numberStr(getBeforeValue('totalAmount'), 2, false, 2)"
                    :afterValue="$numberStr(totalForm.totalAmount, 2, false, 2)"
                  />
                  <el-input
                    v-else
                    :value="$numberStr(totalForm.totalAmount, 2, false, 2)"
                    disabled
                  ></el-input>
                </div>
                <!-- <div class="con-right" v-if="!comDisFrom">
                  <svg-icon
                    @click="handleCalculate"
                    icon-class="jisuanqi"
                    style="height: 36px; width: 36px; cursor: pointer"
                  />
                </div> -->
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <selectProductTable
      :businessPartnerId="businessPartnerId"
      :currencyId="currencyId"
      :purchaseOrderId="formData.purchaseOrderId"
      :purchaseQuotationId="formData.purchaseQuotationId"
      :warehouseId="formData.warehouseId"
      :dropShipping="formData.dropShipping"
      :formData="formData"
      ref="selectProductTable"
      @onSuccess="updateTable"
    />
    <editProductDetailTable
      ref="editProductDetailTable"
      :comDisFrom="comDisFrom"
      :currencyId="currencyId"
      :formData="formData"
      @onSuccess="updateRow"
      @deleteRow="deleteRow"
    />

    <AcknowledgeDlg @submitSuccess="acknowledgeSuccess" ref="AcknowledgeDlg" />

    <popover-svc
      ref="pop1"
      trigger="hover"
      placement="top"
      :close-delay="0"
      :visible-arrow="true"
      popper-class="pop-warp"
      :offset="-30"
    >
      <div @mouseenter="mouseenterCur($event)" class="pop-box">
        <el-table :data="popoverData.purchaseRequisiteList || []" border>
          <el-table-column
            :label="$t('PURCHASE.PRNo')"
            width="160"
            align="center"
            prop="PRNo"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <DocumentNoLink
                :showStr="scope.row.purchaseRequisiteNo"
                moduleKey="purchaseRequisition"
                @click="navToPR(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('PURCHASE.department')"
            width="160"
            align="center"
            prop="departmentName"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('ui.status')"
            width="160"
            align="center"
            prop="purchaseRequisiteStatusShowStr"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
    </popover-svc>

    <popover-svc
      ref="pop2"
      trigger="hover"
      placement="top"
      :close-delay="0"
      :visible-arrow="true"
      popper-class="pop-warp"
      :offset="-30"
    >
      <div
        @mouseenter="mouseenterCur2($event)"
        class="price-chart-box"
        v-loading="chartData.loading"
      >
        <Echart ref="chartLine" :chart-data="chartOptions" div-resize />
      </div>
    </popover-svc>

    <ToolTipShowListForFN ref="ToolTipShowList" />

    <registerReplacementDlg ref="registerReplacementDlg" @onSuccess="registerRSuccess" />
    <priceListDlg
      ref="priceListDlg"
      :currencyCode="formData.currencyCode"
      :currencyId="formData.currencyId"
    />
    <deliveryConfirmationDlg
      ref="deliveryConfirmationDlg"
      :formData="formData"
      @onSuccess="registerRSuccess"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import editProductDetailTable from './components/editProductDetailTable'
import selectProductTable from './components/selectProductTable'
import deliveryConfirmationDlg from './components/deliveryConfirmationDlg'
import {
  calculate,
  queryProductHistoryPriceImage,
  calculateOneDetail,
  calculateDetailsOfExpenses
} from '@/api/purchaseManagement/purchaseOrder'
import AcknowledgeDlg from './acknowledgeDlg/acknowledgeDlg'
import { Popover } from 'element-ui'
import Echart from '@/views/purchaseManagement/purchaseContract/components/Echart'
import ToolTipShowListForFN from '@/components/Common/ToolTipShowList/tableUse.vue'
import ExpenseItemTable from './ExpenseItemTable'
import registerReplacementDlg from '@/views/purchaseManagement/purchaseOrder/registerReplacementDlg'
import priceListDlg from './priceListDlg'
import Sortable from 'sortablejs'
import selectExpenseItemName from '@/views/purchaseManagement/purchaseQuotation/components/selectExpenseItemName'
import { queryAllUomList } from '@/api/system/uom'

const popoverSvc = {
  extends: Popover,
  methods: {
    popBy(el) {
      // 先隐藏并销毁之前显示的
      this.close()
      this.doDestroy(true)
      this.$nextTick(() => {
        // 显示新的
        this.referenceElm = this.$refs.reference = el
        this.showPopper = true
        this.$emit('input', true)
      })
    },
    close() {
      this.showPopper = false
      this.$emit('input', false)
    }
  }
}
export default {
  mixins: [pageMixin],
  dicts: ['p_purchase_order_detail_type', 'tax_type', 'product_type'],
  components: {
    priceListDlg,
    ExpenseItemTable,
    selectProductTable,
    editProductDetailTable,
    AcknowledgeDlg,
    popoverSvc,
    Echart,
    ToolTipShowListForFN,
    registerReplacementDlg,
    deliveryConfirmationDlg,
    selectExpenseItemName
  },
  props: {
    serviceSurchargeListOptions: {
      type: Array,
      default() {
        return []
      }
    },
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
    initCommonFileList: {
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
    currencyId: {
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
    updateMsg: {
      type: Object,
      default() {
        return {}
      }
    },
    getBeforeValue: {
      type: Function,
      default() {
        return () => {}
      }
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    isView: {
      type: Boolean,
      default: false
    },
    isRevise: {
      type: Boolean,
      default: false
    },
    poPurchaseQty: {
      type: String,
      default: ''
    },
    poEdit: {
      type: String,
      default: ''
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || { taxRate: undefined }
      }
    },
    productList: {
      immediate: true,
      handler: function (selected) {
        const tableList = JSON.parse(JSON.stringify(this.productList))
        let timer = Date.now()
        tableList.forEach((item) => {
          item[this.rowIdKey] = item.productId
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              child.isCanUpdateUnitPrice = item.isCanUpdateUnitPrice
              if (!child[this.rowIdKey]) {
                timer++
                child[this.rowIdKey] = timer
              }
            })
          }
        })
        this.tableList = this.prepareProductTableTree(tableList)
        if (this.tableList.length > 0) {
          this.handleCalculate()
        } else {
          this.$set(this.totalForm, 'subTotal', undefined)
          this.$set(this.totalForm, 'totalFreight', undefined)
          this.$set(this.totalForm, 'totalTaxAmount', undefined)
          this.$set(this.totalForm, 'totalAmount', undefined)
        }
        // this.changeTableList()
        this.resetSnNum(this.tableList)
        const allList = []

        this.tableList.forEach((item) => {
          allList.push(item)
          this.getTableChildList(item).forEach((child) => {
            if (child._isPoAssignChild) {
              allList.push(child)
            } else {
              allList.push({
                ...child,
                productName: child.expenseItemName,
                purchaseUom: child.unit,
                purchaseQty: child.qty
              })
            }
          })
        })
        this.$$getColumnContentMaxWidth(this.columns, allList)
        this.removeUnrelatedAttachments([])
        this.initDraggable()
      }
    },
    initCommonFileList: {
      immediate: true,
      handler: function () {
        this.initFileList(this.initCommonFileList)
      }
    },
    comDisFrom: {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    },
    'formData.purchaseOrderStatus': {
      immediate: true,
      handler: function (params) {
        this.initColumnWidth()
      }
    }
  },
  data() {
    const vm = this
    return {
      saveKey: '981',
      savePath: 'purchaseMTable',
      activeName: '1',
      columns: [
        /* {
          prop: 'purchaseOrderDetailType',
          propBy: 'purchaseOrderDetailTypeShowStr',
          label: vm.$t('ui.type'),
          visible: true,
          minWidth: 200,
          fixed: false,
          tooltip: true
        }, */
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
          width: 300,
          sortable: 'custom',
          required: true,
          tooltip: true
        },
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 120,
          sortable: 'custom',
          tooltip: false
        },
        // {
        //   prop: 'partNo',
        //   label: vm.$t('PURCHASE.partNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        // {
        //   prop: 'documentNo',
        //   label: vm.$t('PURCHASE.PQorPCNo'),
        //   visible: true,
        //   minWidth: 200,
        //   tooltip: true
        // },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.purchaseUOM'),
          visible: true,
          minWidth: 140,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'moq',
          label: vm.$t('PURCHASE.MOQ'),
          visible: true,
          minWidth: 140,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.qty'),
          visible: true,
          minWidth: 160,
          padding: 60,
          sortable: 'custom',
          required: true,
          tooltip: false
        },
        {
          prop: 'stockInQty',
          label: vm.$t('PURCHASE.stockInQty'),
          visible: false,
          minWidth: 140,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'receiptQty',
          label: vm.$t('PURCHASE.receivedQty'),
          visible: true,
          minWidth: 140,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'qcFailedQty',
          label: vm.$t('PURCHASE.qcFailedQty'),
          visible: true,
          minWidth: 140,
          sortable: 'custom',
          tooltip: true
        },
        {
          prop: 'rejectedQty',
          label: vm.$t('PURCHASE.rejectedQty1'),
          visible: true,
          minWidth: 200,
          padding: 60,
          sortable: 'custom',
          tooltip: true
        },
        /* {
          prop: 'replacedQty',
          label: vm.$t('PURCHASE.replacedQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        },
        {
          prop: 'pendReplacementQty',
          label: vm.$t('PURCHASE.pendReplacementQty'),
          visible: true,
          minWidth: 200,
          padding: 60,
          tooltip: true
        }, */
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          colMinWidth: 160,
          tooltip: true,
          padding: 80,
          sortable: 'custom',
          required: true,
          align: 'right'
        },
        /* {
          prop: 'discount',
          label: vm.$t('PURCHASE.discount'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          padding: 50,
          align: 'right'
        }, */
        {
          prop: 'lineTotal',
          label: vm.$t('PURCHASE.lineTotal'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
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
          minWidth: 140,
          fixedWidth: 190,
          tooltip: true,
          padding: 50,
          sortable: 'custom',
          align: 'right'
        },

        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.leadTimeDays'),
          visible: true,
          minWidth: 140,
          padding: 60,
          sortable: 'custom',
          required: true,
          tooltip: false
        },
        {
          prop: 'warranty',
          label: vm.$t('PURCHASE.warrantyDays'),
          visible: true,
          minWidth: 140,
          sortable: 'custom',
          tooltip: true
        },
        /* {
          prop: 'committedDate',
          label: vm.$t('PURCHASE.expectedDeliveryDate'),
          visible: true,
          minWidth: 140,
          tooltip: true
        }, */
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: false
        },
        {
          prop: 'purchaseRequisiteListShowStr',
          label: vm.$t('PURCHASE.DocNo'),
          visible: true,
          minWidth: 200,
          tooltip: false
        },
        {
          prop: 'costProjectCode',
          label: vm.$t('PURCHASE.projectCode'),
          visible: true,
          minWidth: 200,
          sortable: 'custom',
          tooltip: true
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      totalForm: { taxRate: undefined },
      totalRules: {
        taxRate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      tableList: [],
      tableKey: Date.now(),
      selected: [],
      sortableDom: undefined,
      draggedRowId: undefined,
      /* 排序缓存 */
      sortProp: '',
      sortOrder: '', // ascending, descending
      rowIdKey: 'rowTimeId',
      popoverData: {},
      queryTotalTime: Date.now(),
      detailCalculateSeq: {},
      /* 附件组件实时更新传到外部, 只是为了显示附件数量, 无其他用处 */
      curFileList: [],
      chartData: {
        loading: false
      },
      chartOptions: {},
      allUomList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    stockInAuth() {
      if (this.formData.dropShipping === '1') {
        return false
      }
      return this.checkPermi(['purchaseManagement:purchaseOrder:stockIn']) && !this.isView
    },
    isEditPage() {
      return !!this.formData.purchaseOrderId
    },
    isShowReplacedQty() {
      return ['9', '10', '6', '7', '11'].includes(this.formData.purchaseOrderStatus)
    },
    configCurColumn() {
      const arr = [...this.adjustableColumns]

      function compare(value1, value2) {
        if (value1.colSortIndex < value2.colSortIndex) {
          return -1
        } else if (value1.colSortIndex > value2.colSortIndex) {
          return 1
        } else {
          return 0
        }
      }
      arr.sort(compare)
      return arr
    },
    adjustableColumns() {
      return this.columns.filter((item) => item.prop !== 'productName')
    },
    documentNoIsHide() {
      return !this.tableList.find((x) => {
        return this.$resultOfBoolean(x.aslUnitPrice) || x.documentNo
      })
    },
    qcFailedQtyIsHide() {
      return !this.tableList.find((x) => x.qcFailedQty)
    },
    rejectedQtyIsHide() {
      return !this.tableList.find((x) => x.rejectedQty)
    },
    costProjectCodeIsHide() {
      return !this.tableList.find((x) => x.costProjectCode)
    },
    legalEntityLineTotalIsHide() {
      return this.legalEntityInfo.currencyCode === this.formData.currencyCode
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const productNameColumn = this.columns.find((item) => item.prop === 'productName')
      arr = arr.filter((item) => item.prop !== 'productName')
      if (productNameColumn) {
        arr.unshift({ ...productNameColumn, fixed: 'left', visible: true })
      }
      const filterProps1 = []
      if (this.documentNoIsHide) {
        filterProps1.push('documentNo')
      }
      if (this.qcFailedQtyIsHide) {
        filterProps1.push('qcFailedQty')
      }
      if (this.rejectedQtyIsHide) {
        filterProps1.push('rejectedQty')
      }
      if (this.costProjectCodeIsHide) {
        filterProps1.push('costProjectCode')
      }
      if (this.legalEntityLineTotalIsHide) {
        filterProps1.push('legalEntityLineTotal')
      }

      if (this.legalEntityLineTotalIsHide || !this.tableList.length) {
        // 货币与当前法人货币相同时，汇率字段不显示
        filterProps1.push('exchangeRateDesc')
      }

      arr = arr.filter((x) => !filterProps1.includes(x.prop))

      if (this.isShowReplacedQty) {
        return arr
      } else {
        return arr.filter((item) => {
          const filterProps = [
            'stockInQty',
            'receiptQty',
            'qcFailedQty',
            'rejectedQty',
            'replacedQty',
            'pendReplacementQty',
            'committedDate'
          ]
          const is = !filterProps.includes(item.prop)
          return is
        })
      }
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    comDisAddBtn() {
      if (this.formData.dropShipping === '1') {
        return !this.businessPartnerId || !this.currencyId
      }
      return !this.businessPartnerId || !this.currencyId || !this.formData.warehouseId
    },
    isExpenseItemCanEdit() {
      return (!this.comDisFrom && this.formData.createType === '2') || this.isRevise
    },
    comCurFileListLength() {
      const list = (this.curFileList || []).filter((x) => x.updateType !== '3')
      return list.length
    },
    existLevel2() {
      return this.tableList.some((row) => this.getTableChildList(row).length > 0)
    },

    comTableList() {
      let timer = Date.now() + 10000

      const table = this.tableList

      // 确保每行有稳定索引，用于取消排序时恢复原始顺序
      table.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
      })

      if (this.sortProp && this.sortOrder) {
        // 根据排序字段和顺序对数据进行排序
        table.sort((a, b) => {
          const valueA =
            a[this.sortProp] !== undefined && a[this.sortProp] !== null ? a[this.sortProp] : ''
          const valueB =
            b[this.sortProp] !== undefined && b[this.sortProp] !== null ? b[this.sortProp] : ''

          if (valueA === valueB) {
            const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
            const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
            return ia - ib
          }

          if (this.sortOrder === 'ascending') {
            return valueA > valueB ? 1 : -1
          } else if (this.sortOrder === 'descending') {
            return valueA < valueB ? 1 : -1
          }
          return 0
        })
      } else {
        table.sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
      }

      const le1 = table.length
      const table2 = this.formData.detailsOfExpensesList || []
      table2.forEach((x, index) => {
        timer++
        if (!x.rowTimeId) {
          this.$set(x, 'rowTimeId', timer)
        }
        if (!x.isExpenseItem) {
          this.$set(x, 'isExpenseItem', '1')
        }
        x.snNum = le1 + index + 1
      })
      let list = [...table, ...table2]
      if (this.modifyHighlight) {
        const delDetailList = (this.updateMsg.beforeDetailList || []).filter(
          (x) => x.updateType === '3'
        )
        delDetailList.forEach((item) => {
          timer++
          item.rowTimeId = timer
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              timer++
              child.rowTimeId = timer
              child.updateType = '3'
            })
          }
        })
        const delDetailsOfExpensesList = (this.updateMsg.beforeDetailsOfExpensesList || []).filter(
          (x) => x.updateType === '3'
        )
        delDetailsOfExpensesList.forEach((x) => {
          timer++
          if (!x.rowTimeId) {
            this.$set(x, 'rowTimeId', timer)
          }
          if (!x.isExpenseItem) {
            this.$set(x, 'isExpenseItem', '1')
          }
        })
        list = [...table, ...delDetailList, ...table2, ...delDetailsOfExpensesList]
      }

      list.forEach((item, index) => {
        item.snNum = `${index + 1}`
        item.exchangeRateDesc = this.formData.exchangeRateDesc
        this.$set(item, 'levelNum', 1)
        this.$set(item, 'isTopItem', false)
        this.getTableChildList(item).forEach((child, childIndex) => {
          child.snNum = `${item.snNum}.${childIndex + 1}`
          this.$set(child, 'levelNum', 2)
          this.$set(child, 'isTopItem', childIndex === 0)
          this.$set(child, 'exchangeRateDesc', this.formData.exchangeRateDesc)
        })
      })

      return list
      // return [...table, ...table2]
    },
    tableActionSlots() {
      const slots = { edit: false, add: false, delete: false }
      const collect = (rows) => {
        rows.forEach((row) => {
          const actions = this.getRowActions(row)
          Object.keys(slots).forEach((key) => {
            slots[key] = slots[key] || actions[key]
          })
          collect(row.tableChildList || [])
        })
      }
      collect(this.comTableList)
      return slots
    },
    showTableAction() {
      const isShow = this.comTableList.find((row) => {
        const showEdit =
          row.isCustomProduct !== '1' &&
          row.productId &&
          this.poPurchaseQty === '1' &&
          !this.comDisFrom
        const showDel =
          (!this.comDisFrom && this.totalForm.warehouseType !== '2' && row.productId) ||
          this.isRevise
        const showDel2 = this.isExpenseItemCanEdit && row.isExpenseItem === '1'
        const ack =
          this.stockInAuth && this.comDisFrom && this.formData.isEmergencyGoodsReceipt !== '1'
        const showHandleAcknowledge = row.serviceStockInStatus === '1' && !this.isRevise
        const showHandleAcknowledgeDetail = row.serviceStockInStatus === '2' && !this.isRevise
        return (
          showEdit ||
          showDel ||
          showDel2 ||
          (showHandleAcknowledge && ack) ||
          (showHandleAcknowledgeDetail && ack)
        )
      })

      return !!isShow
    }
  },
  created() {
    this._stableCounter = 0
    this.$$initColumnVisible(this.saveKey, this.columns)
    this.queryAllUomList()
  },
  methods: {
    getRowActions(row) {
      if (row._isPoAssignChild) {
        return {
          edit: false,
          add: false,
          delete: (!this.comDisFrom && this.totalForm.warehouseType !== '2') || this.isRevise
        }
      }
      return {
        edit:
          row.isCustomProduct !== '1' &&
          !!row.productId &&
          this.poPurchaseQty === '1' &&
          !this.comDisFrom,
        add:
          !!row.productId &&
          row.isExpenseItem !== '1' &&
          !this.comDisFrom &&
          (row.serviceSurchargeList || []).length < 8 &&
          this.formData.isEmergencyGoodsReceipt === '1',
        delete:
          (((!this.comDisFrom && this.totalForm.warehouseType !== '2' && !!row.productId) ||
            this.isRevise) &&
            row.isExpenseItem !== '1') ||
          (this.isExpenseItemCanEdit && (row.isExpenseItem === '1' || row.isNewData === '1'))
      }
    },
    // 判断字段值是否有效，保留数值 0 等合法值。
    hasValue(value) {
      return value !== undefined && value !== null && value !== ''
    },
    // 根据 PR 单号判断当前分配行是否为 PR 来源子级行。
    isPrAssignRow(row = {}) {
      return this.hasValue(row.purchaseRequisiteNo)
    },
    // 判断父级采购行是否包含 PR 来源子级行。
    hasPrAssignRows(row = {}) {
      return (row.assignList || []).some((child) => this.isPrAssignRow(child))
    },
    // 判断父级采购行是否需要展开显示分配子级行。
    shouldShowAssignRows(row = {}) {
      const assignList = Array.isArray(row.assignList) ? row.assignList : []
      return this.hasPrAssignRows(row) && assignList.length > 1
    },
    // 设置分配子级行采购数量的必填错误状态。
    setAssignPurchaseQtyError(row) {
      const isError = !this.$resultOfBoolean(row.purchaseQty)
      this.$set(row, 'purchaseQtyError', isError)
      this.$set(row, 'ROW-ERROR', isError)
      return isError
    },
    // 校验所有分配子级行的采购数量，并展开定位错误行。
    validateAssignPurchaseQty(list = this.tableList) {
      let hasError = false
      ;(list || []).forEach((parent) => {
        if (!this.hasPrAssignRows(parent)) return
        ;(parent.assignList || []).forEach((child) => {
          if (this.setAssignPurchaseQtyError(child)) {
            this.$refs.tables.toggleRowExpansion(parent, true)
            hasError = true
          }
        })
      })
      if (hasError) {
        this.$emit('scrollPageToTable')
        this.$nextTick(() => this.scrollToErrorColumn())
      }
      return !hasError
    },
    // 获取分配子级行的稳定业务标识，备货行使用索引兜底。
    getAssignRowIdentity(row = {}, index = 0) {
      if (this.hasValue(row.purchaseRequisiteDetailId)) return row.purchaseRequisiteDetailId
      if (this.hasValue(row.purchaseRequisiteId)) return row.purchaseRequisiteId
      if (this.hasValue(row.purchaseRequisiteNo)) return row.purchaseRequisiteNo
      return `beihuo-${index}`
    },
    // 刷新分配数据时保留 PR 子级行原始可分配数量。
    preservePrAssignQuantity(oldList = [], newList = []) {
      newList.forEach((child, index) => {
        if (!child.purchaseQty) {
          child.purchaseQty = undefined
        }
        if (!this.isPrAssignRow(child)) return
        const identity = this.getAssignRowIdentity(child, index)
        const oldChild = oldList.find(
          (item, oldIndex) =>
            this.isPrAssignRow(item) &&
            String(this.getAssignRowIdentity(item, oldIndex)) === String(identity)
        )
        if (oldChild && this.hasValue(oldChild._poPrPurchaseQty)) {
          child._poPrPurchaseQty = oldChild._poPrPurchaseQty
        }
      })
      return newList
    },
    // 初始化单个父级采购行及其分配、附加费子级行的树表属性。
    prepareProductRowTree(parent, parentIndex = 0) {
      const assignList = Array.isArray(parent.assignList) ? parent.assignList : []
      const hasPrAssignRows = this.hasPrAssignRows(parent)
      if (!this.hasValue(parent[this.rowIdKey])) {
        this.$set(parent, this.rowIdKey, parent.productId || `product-${parentIndex}`)
      }
      const parentRowId = parent[this.rowIdKey]
      this.$set(parent, 'levelNum', 1)
      this.$set(parent, 'isTopItem', false)

      assignList.forEach((child, childIndex) => {
        this.$set(child, '_isPoAssignChild', hasPrAssignRows)
        this.$set(child, '_isPoStockRow', hasPrAssignRows && !this.isPrAssignRow(child))
        if (hasPrAssignRows) {
          this.$set(child, 'levelNum', 2)
          this.$set(child, 'isTopItem', childIndex === 0)
          this.$set(
            child,
            this.rowIdKey,
            `po-assign-${parentRowId}-${this.getAssignRowIdentity(child, childIndex)}-${childIndex}`
          )
          if (this.isPrAssignRow(child) && !this.hasValue(child._poPrPurchaseQty)) {
            const prQuantity = this.hasValue(child.prBalancePurchaseQty)
              ? child.prBalancePurchaseQty
              : child.purchaseQty
            this.$set(child, '_poPrPurchaseQty', prQuantity)
          }
        }
      })
      const assignLength = hasPrAssignRows ? assignList.length : 0
      ;(parent.serviceSurchargeList || []).forEach((child, childIndex) => {
        this.$set(child, '_isPoAssignChild', false)
        this.$set(child, 'levelNum', 2)
        this.$set(child, 'isTopItem', assignLength + childIndex === 0)
      })

      // 组合列表仅用于 Element UI 树表展示，设为不可枚举以避免提交给后端。
      Object.defineProperty(parent, 'tableChildList', {
        configurable: true,
        enumerable: false,
        get: () => {
          const serviceList = parent.serviceSurchargeList || []
          return this.shouldShowAssignRows(parent)
            ? [...(parent.assignList || []), ...serviceList]
            : serviceList
        }
      })
      return parent
    },
    // 批量初始化采购明细的树表结构。
    prepareProductTableTree(list = []) {
      list.forEach((parent, parentIndex) => this.prepareProductRowTree(parent, parentIndex))
      return list
    },
    // 获取父级采购行在树表中实际展示的子级行。
    getTableChildList(row = {}) {
      if (row._isPoAssignChild) return []
      return row.tableChildList || row.serviceSurchargeList || []
    },
    // 根据分配子级行查找其所属的父级采购行。
    findAssignParent(childRow) {
      return this.tableList.find((parent) =>
        (parent.assignList || []).some(
          (child) => child === childRow || child[this.rowIdKey] === childRow[this.rowIdKey]
        )
      )
    },
    // 根据现有 PR 子级行同步父级的采购申请来源信息。
    syncParentPurchaseRequisiteInfo(parent) {
      const oldList = parent.purchaseRequisiteList || []
      const sourceMap = new Map()
      ;(parent.assignList || [])
        .filter((child) => this.isPrAssignRow(child))
        .forEach((child) => {
          const sourceKey = this.hasValue(child.purchaseRequisiteId)
            ? child.purchaseRequisiteId
            : child.purchaseRequisiteNo
          const key = String(sourceKey)
          if (sourceMap.has(key)) return
          const oldSource = oldList.find((item) => {
            const oldSourceKey = this.hasValue(item.purchaseRequisiteId)
              ? item.purchaseRequisiteId
              : item.purchaseRequisiteNo
            return String(oldSourceKey) === key
          })
          sourceMap.set(key, oldSource || child)
        })
      const purchaseRequisiteList = Array.from(sourceMap.values())
      this.$set(parent, 'purchaseRequisiteList', purchaseRequisiteList)
      this.$set(
        parent,
        'purchaseRequisiteListShowStr',
        purchaseRequisiteList
          .map((item) => item.purchaseRequisiteNo)
          .filter(Boolean)
          .join(',')
      )
    },
    // 获取分配子级行的显示值，缺失时回退到父级对应字段。
    getAssignDisplayValue(row, prop) {
      if (this.hasValue(row[prop])) return row[prop]
      const parentFallbackProps = [
        'productName',
        'internalPartNo',
        'description',
        'externalPartNo',
        'purchaseUom',
        'moq',
        'unitPrice',
        'exchangeRateDesc',
        'leadTime',
        'warranty',
        'remarks'
      ]
      if (!parentFallbackProps.includes(prop)) return row[prop]
      const parent = this.findAssignParent(row)
      return parent ? parent[prop] : row[prop]
    },
    // 判断当前父级或分配子级行是否允许快捷编辑采购数量。
    canQuickEditPurchaseQty(row) {
      const parent = row._isPoAssignChild ? this.findAssignParent(row) : row
      return !!(
        parent &&
        parent.productId &&
        parent.isCustomProduct !== '1' &&
        this.hasPrAssignRows(parent) &&
        !this.comDisFrom &&
        this.formData.isEmergencyGoodsReceipt !== '1' &&
        this.poPurchaseQty === '1'
      )
    },
    // 按行精度将输入值转换为可参与计算的采购数量。
    toPurchaseQuantity(value, row = {}) {
      const quantity = Number(value)
      if (!Number.isFinite(quantity)) return 0
      return this.$num(quantity, row.decimalNum)
    },
    // 获取 PR 子级行的原始可分配采购数量。
    getPrAssignQuantity(row = {}) {
      if (this.hasValue(row._poPrPurchaseQty)) {
        return this.toPurchaseQuantity(row._poPrPurchaseQty, row)
      }
      if (this.hasValue(row.prBalancePurchaseQty)) {
        return this.toPurchaseQuantity(row.prBalancePurchaseQty, row)
      }
      return this.toPurchaseQuantity(row.purchaseQty, row)
    },
    // 根据 PR 来源子级行创建不含 PR 来源信息的备货行。
    createStockAssignRow(parent, quantity) {
      const sourceRow = (parent.assignList || []).find((child) => this.isPrAssignRow(child)) || {}
      const stockRow = { ...sourceRow }
      ;[
        'assignId',
        'costProjectId',
        'costProjectCode',
        'costProjectName',
        'prQty',
        'lineTotal',
        'remarks',
        'purchaseRequisiteDetailId',
        'purchaseRequisiteId',
        'purchaseRequisiteNo',
        'prUom',
        'prBalanceQty',
        'prBalancePurchaseQty',
        'prBalanceBasicQty',
        '_poPrPurchaseQty',
        'stockInQty',
        'receiptQty',
        'qcFailedQty',
        'rejectedQty'
      ].forEach((key) => delete stockRow[key])
      delete stockRow.serviceSurchargeList
      stockRow.purchaseQty = quantity
      stockRow[this.rowIdKey] = `po-assign-${parent[this.rowIdKey] || parent.productId}-beihuo`
      stockRow._isPoAssignChild = true
      stockRow._isPoStockRow = true
      return stockRow
    },
    // 更新备货行数量，并在数量变化时按需创建或删除备货行。
    setStockAssignQuantity(parent, quantity) {
      const assignList = parent.assignList || []
      const stockIndex = assignList.findIndex((child) => !this.isPrAssignRow(child))
      const stockQuantity = this.toPurchaseQuantity(quantity, parent)
      if (stockQuantity <= 0) {
        if (stockIndex > -1) assignList.splice(stockIndex, 1)
        return
      }
      if (stockIndex > -1) {
        this.$set(assignList[stockIndex], 'purchaseQty', stockQuantity)
        this.getLineTotal(assignList[stockIndex])
      } else {
        const stockRow = this.createStockAssignRow(parent, stockQuantity)
        assignList.push(stockRow)
        this.getLineTotal(stockRow)
      }
    },
    // 汇总所有分配子级行数量并更新父级采购数量和金额。
    recalculateParentPurchaseQty(parent) {
      const quantity = (parent.assignList || []).reduce(
        (total, child) => total + this.toPurchaseQuantity(child.purchaseQty, child),
        0
      )
      this.$set(parent, 'purchaseQty', this.toPurchaseQuantity(quantity, parent) || undefined)
      this.getLineTotal(parent)
    },
    // 父级数量按 PR 行顺序分配；Drop Shipping 余量保留在最后一个 PR 子行，其他场景进入备货行。
    distributeParentPurchaseQty(parent) {
      let remainQuantity = this.toPurchaseQuantity(parent.purchaseQty, parent)
      const prAssignRows = (parent.assignList || []).filter((child) => this.isPrAssignRow(child))
      prAssignRows.forEach((child) => {
        const childQuantity = Math.min(remainQuantity, this.getPrAssignQuantity(child))
        this.$set(child, 'purchaseQty', childQuantity || undefined)
        this.getLineTotal(child)
        remainQuantity = Math.max(remainQuantity - childQuantity, 0)
      })
      if (this.formData.dropShipping === '1') {
        this.setStockAssignQuantity(parent, 0)
        const lastPrAssignRow = prAssignRows[prAssignRows.length - 1]
        if (lastPrAssignRow && remainQuantity > 0) {
          const lastQuantity = this.toPurchaseQuantity(lastPrAssignRow.purchaseQty, lastPrAssignRow)
          this.$set(
            lastPrAssignRow,
            'purchaseQty',
            this.toPurchaseQuantity(lastQuantity + remainQuantity, lastPrAssignRow)
          )
          this.getLineTotal(lastPrAssignRow)
        }
      } else {
        this.setStockAssignQuantity(parent, remainQuantity)
      }
      this.recalculateParentPurchaseQty(parent)
      this.prepareProductRowTree(parent)
      this.resetSnNum(this.tableList)
    },
    // PR 子行超出可分配数量的部分转入备货行，再同步汇总父级数量。
    updateAssignPurchaseQty(parent, row) {
      if (row._isPoStockRow) {
        this.recalculateParentPurchaseQty(parent)
        return
      }
      // Drop Shipping 允许 PR 子行保留超出数量，仅汇总父级，不拆分生成备货行。
      if (this.formData.dropShipping === '1') {
        this.getLineTotal(row)
        this.recalculateParentPurchaseQty(parent)
        this.prepareProductRowTree(parent)
        this.resetSnNum(this.tableList)
        return
      }
      const inputQuantity = this.toPurchaseQuantity(row.purchaseQty, row)
      const prQuantity = this.getPrAssignQuantity(row)
      const overflowQuantity = Math.max(inputQuantity - prQuantity, 0)
      const stockRow = (parent.assignList || []).find((child) => !this.isPrAssignRow(child))
      const oldStockQuantity = this.toPurchaseQuantity((stockRow || {}).purchaseQty, stockRow)
      this.$nextTick(() => {
        const assignedQuantity = Math.min(inputQuantity, prQuantity)
        this.$set(row, 'purchaseQty', assignedQuantity || undefined)
      })

      this.getLineTotal(row)
      this.setStockAssignQuantity(parent, oldStockQuantity + overflowQuantity)
      this.recalculateParentPurchaseQty(parent)
      this.prepareProductRowTree(parent)
      this.resetSnNum(this.tableList)
    },
    sourceDocIdListChange(row) {
      const { sourceDocIdList, emergencyGoodsReceiptList } = row
      console.log(sourceDocIdList, emergencyGoodsReceiptList, '===============1831')
      if (sourceDocIdList && sourceDocIdList.length > 0) {
        const rows = emergencyGoodsReceiptList.filter(
          (x) => sourceDocIdList.indexOf(x.emergencyGoodsReceiptId) !== -1
        )
        const sourceDocId = rows.map((x) => x.emergencyGoodsReceiptId).join(',')
        const sourceDocNo = rows.map((x) => x.emergencyGoodsReceiptNo).join(',')
        this.$set(row, 'sourceDocId', sourceDocId)
        this.$set(row, 'sourceDocNo', sourceDocNo)
      } else {
        this.$set(row, 'sourceDocId', undefined)
        this.$set(row, 'sourceDocNo', undefined)
      }
      this.$set(row, 'purchaseRequisiteListShowStrError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    adhocEntryUomChange(row) {
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$set(row, 'basicUom', row.uom)
    },
    queryAllUomList() {
      queryAllUomList({ menuPerms: this.menuKey.PO }).then((res) => {
        this.allUomList = res.data || []
      })
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
          qtyLimit: undefined,
          isNewData: '1',
          levelNum: 2,
          isTopItem: this.getTableChildList(row).length === 0,
          emergencyGoodsReceiptList: row.emergencyGoodsReceiptList || []
        }
        if (row.emergencyGoodsReceiptList && row.emergencyGoodsReceiptList.length === 1) {
          const { emergencyGoodsReceiptId, emergencyGoodsReceiptNo } =
            row.emergencyGoodsReceiptList[0]
          params.sourceDocIdList = [emergencyGoodsReceiptId]
          this.$set(params, 'sourceDocId', emergencyGoodsReceiptId)
          this.$set(params, 'sourceDocNo', emergencyGoodsReceiptNo)
        }
        const parentStage = row.snNum
        const assignLength = this.hasPrAssignRows(row) ? (row.assignList || []).length : 0
        const curStage = assignLength + (row.serviceSurchargeList || []).length + 1
        params.snNum = `${parentStage}.${curStage}`
        row.serviceSurchargeList.push(params)
      }
    },
    getServiceSurchargeListOptions(options, row, index) {
      const findItem = this.comTableList.find((item) => {
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
      const findItem = this.comTableList.find((item) => {
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
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            colWidth: item.colWidth + 40
          }
        }
        return item
      })
    },
    handleSortChange({ prop, order }) {
      this.sortProp = prop
      this.sortOrder = order
    },
    initDraggable() {
      this.destroyDraggable()
      if (this.comDisFrom && !this.isRevise) {
        return
      }
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]

        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onMove: (e) => {
            const { related } = e
            if (!related || !related.querySelector('.allowDrag')) {
              return false
            }
          },
          onStart: (e) => {
            // 开始拖拽前把树形结构数据扁平化
            const activeRows = this.treeToTile(this.tableList) // 把树形的结构转为列表再进行拖拽
            const draggedRow = activeRows[e.oldIndex]
            this.draggedRowId = draggedRow && draggedRow[this.rowIdKey]
            this.tableList.forEach((item) => {
              this.$refs.tables.toggleRowExpansion(item, false)
            })
          },
          /* onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.tableList.splice(evt.oldIndex, 1)[0]
            this.tableList.splice(evt.newIndex, 0, targetRow)
          }, */
          onEnd: (e) => {
            const oldI = this.hasValue(this.draggedRowId)
              ? this.tableList.findIndex(
                  (row) => String(row[this.rowIdKey]) === String(this.draggedRowId)
                )
              : -1
            const newI = e.newIndex
            this.draggedRowId = undefined

            // 折叠子行后 newIndex 对应第一层 DOM 索引，费用项位于产品列表之后。
            if (oldI === -1 || newI < 0 || newI >= this.tableList.length) {
              this.tableKey = Date.now()
              this.$nextTick(() => {
                this.initDraggable()
              })
              return
            }

            if (oldI !== newI) {
              const targetRow = this.tableList.splice(oldI, 1)[0]
              this.tableList.splice(newI, 0, targetRow)
              // comTableList 会按 _stableIndex 恢复顺序，拖拽后需同步新的稳定顺序。
              this.tableList.forEach((row, index) => {
                this.$set(row, '_stableIndex', index + 1)
              })
              this._stableCounter = Math.max(this._stableCounter || 0, this.tableList.length)
            }
            this.resetSnNum(this.tableList)
            this.tableKey = Date.now()
            this.$nextTick(() => {
              this.initDraggable()
            })
          }
        })
      }, 300)
    },
    treeToTile(treeData, childKey = 'tableChildList') {
      const arr = []
      const expanded = (data) => {
        if (data && data.length > 0) {
          data.forEach((e) => {
            arr.push({
              ...e,
              nodeList: data
            })
            expanded(e[childKey] || [])
          })
        }
      }
      expanded(treeData)
      return arr
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
    },
    showASLPriceRange(row) {
      const { minUnitPrice, maxUnitPrice, unitPrice } = row
      if (!this.$resultOfBoolean(unitPrice)) {
        return false
      }
      if (
        this.$resultOfBoolean(minUnitPrice) &&
        unitPrice < minUnitPrice &&
        minUnitPrice - unitPrice > 0.01
      ) {
        return true
      }
      if (
        this.$resultOfBoolean(maxUnitPrice) &&
        unitPrice > maxUnitPrice &&
        unitPrice - maxUnitPrice > 0.01
      ) {
        return true
      }
      return false
    },
    unitPriceClick(row) {
      this.$refs.priceListDlg.handleOpen(row)
    },
    handleRegisterReplacement() {
      this.$refs.registerReplacementDlg.handleOpen(this.formData.purchaseOrderId)
    },
    registerRSuccess() {
      this.$emit('getPoById')
    },
    showPop1(e, data) {
      const list = (data || []).map((x) => {
        return {
          label: x
        }
      })
      const params = {
        popoverTitle: '',
        labelKey: 'label',
        list
      }
      if (list.length > 0 && this.$refs.ToolTipShowList) {
        this.$refs.ToolTipShowList.showPop(e, params)
      }
    },
    hidePop1(e) {
      this.$refs.ToolTipShowList && this.$refs.ToolTipShowList.hidePop(e)
    },
    inputNumberChange(code) {
      this.$refs.totalForm.validateField(code)
      this.handleCalculate()
    },

    initFileList(FileList) {
      const maxAttempts = 10 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.uploadRef) {
              this.$refs.uploadRef.initFileList(FileList)
            } else {
              retry()
            }
          }, interval)
        } else {
          console.log('无法获取组件')
        }
      }
      retry()
    },
    getFileIds() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return false
      }
      return myFileIds
    },
    updateFileList(list) {
      console.log(list)
      this.curFileList = list
    },
    /* 删除无关联文件, 新增新的合并文件 */
    removeUnrelatedAttachments(mergeFileList) {
      if (!this.$refs.uploadRef) return
      const list = this.$refs.uploadRef.getFileList()
      /* 所有关联单据的ID */
      const allLineIds = []
      this.tableList.forEach((item) => {
        if (item.documentId) {
          allLineIds.push(item.documentId)
        }
        const purchaseRequisiteList = item.purchaseRequisiteList || []
        purchaseRequisiteList.forEach((prItem) => {
          allLineIds.push(prItem.purchaseRequisiteId)
        })
      })
      // 获取有关联PR PQ PC的附件
      const fromList = list.filter((item) => item.fromId)
      // 获取失去关联的文件
      const delFiles = fromList.filter((item) => !allLineIds.includes(item.fromId))
      delFiles.forEach((item) => {
        this.$refs.uploadRef.delFile(item)
      })
      /* 新增新的文件 */
      const allFromIds = fromList.map((item) => item.fromId)
      mergeFileList.forEach((item) => {
        if (!allFromIds.includes(item.fromId)) {
          this.$refs.uploadRef.addFileForUnshift(item)
        }
      })
      /* const item = {
        createTime: 1685771623000,
        fromId: '1685771623000',
        fromType: 'PR',
        creator: '1',
        creatorName: 'admin',
        fileExtension: '.xlsx',
        fileName: 'RFQ_1684833480637 (1).xlsx',
        id: '9663179842912256',
        size: '4975',
        url: 'http://bts-erp.oss-cn-shenzhen.aliyuncs.com/bqt/20230603/ed8e90842fde488bb9d90658b25feb19.xlsx'
      } */
      // this.$refs.uploadRef.addFileForUnshift(item)
    },
    handleTabClick() {},
    initColumnWidth() {
      const vm = this
      const flag = this.tableList.some((x) => x.salesDropShippingPrFlag === '1')
      this.columns.forEach((item) => {
        const prop = item.prop
        switch (prop) {
          case 'productName':
            item.fixedWidth = vm.isExpenseItemCanEdit ? 180 : undefined
            break
          case 'purchaseOrderDetailType':
            item.colMinWidth = vm.comDisFrom ? undefined : 180
            break
          case 'documentNo':
            item.colMinWidth = vm.comDisFrom ? undefined : 180
            break
          case 'description':
            item.colMinWidth =
              (!vm.comDisFrom && vm.formData.createType === '2') || vm.isRevise ? 160 : undefined
            break
          case 'externalPartNo':
            item.colMinWidth = vm.comDisFrom && !vm.isRevise ? undefined : 180
            break
          case 'purchaseQty':
            item.colMinWidth = vm.comDisFrom && !flag ? undefined : flag ? 200 : 120
            break
          case 'discount':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'moq':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'leadTime':
            item.colMinWidth = vm.comDisFrom && !vm.isRevise ? undefined : 120
            break
          case 'warranty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'purchaseUom':
            item.colMinWidth = vm.comDisFrom ? 120 : 120
            break
          case 'purchaseRequisiteListShowStr':
            item.colMinWidth = vm.comDisFrom ? undefined : 220
            break

          case 'unitPrice':
            item.colMinWidth =
              (vm.formData.createType === '2' &&
                (['1', '2'].indexOf(this.formData.purchaseOrderStatus) !== -1 ||
                  !this.comDisFrom)) ||
              this.isRevise
                ? 240
                : 160
            break
          case 'remarks':
            item.colMinWidth = !vm.comDisFrom || vm.isRevise ? 200 : undefined
            break
        }
      })
    },
    initList(list) {
      this.tableList = this.prepareProductTableTree(JSON.parse(JSON.stringify(list)))
    },
    getList() {
      return this.tableList
    },
    purchaseOrderDetailTypeChange(row) {
      if (row.purchaseOrderDetailType === '2') {
        this.$set(row, 'discount', undefined)
      } else {
        this.$set(row, 'discount', undefined)
      }
      this.getLineTotal(row)
    },
    documentNoChange(row) {
      const selectRow = (row.pplList || []).find((item) => item.documentNo === row.documentNo)
      this.$set(row, 'documentNo', selectRow.documentNo)
      this.$set(row, 'documentId', selectRow.documentId)
      this.$set(row, 'moq', selectRow.moq)
      this.$set(row, 'purchasePriceId', selectRow.purchasePriceId)
      this.$set(row, 'priceType', selectRow.priceType)
      this.$set(row, 'unitPrice', selectRow.unitPrice)
      this.getLineTotal(row)
      this.removeUnrelatedAttachments(selectRow.commonFileList || [])
      this.documentNoChangeUpdateAllSelect(row)
    },
    documentNoChangeUpdateAllSelect(selectRow) {
      const assignList = selectRow.assignList || []
      assignList.forEach((item) => {
        this.$set(item, 'documentNo', selectRow.documentNo)
        this.$set(item, 'documentId', selectRow.documentId)
        this.$set(item, 'moq', selectRow.moq)
        this.$set(item, 'purchasePriceId', selectRow.purchasePriceId)
        this.$set(item, 'priceType', selectRow.priceType)
        this.$set(item, 'unitPrice', selectRow.unitPrice)
        if (this.$resultOfBoolean(item.unitPrice) && item.purchaseQty) {
          const lineTotal = item.unitPrice * item.purchaseQty
          this.$set(item, 'lineTotal', lineTotal)
        } else {
          this.$set(item, 'lineTotal', undefined)
        }
      })
    },
    // 在接口计算结果中定位本次变更对应的 PR 子级行或备货行。
    getCalculatedAssignRow(parent, changedRow) {
      const assignList = parent.assignList || []
      if (!this.isPrAssignRow(changedRow)) {
        return assignList.find((child) => !this.isPrAssignRow(child))
      }
      const identity = this.getAssignRowIdentity(changedRow)
      return assignList.find(
        (child, index) =>
          this.isPrAssignRow(child) &&
          String(this.getAssignRowIdentity(child, index)) === String(identity)
      )
    },
    // 将接口返回的超交信息同步到本次变更对应的采购行。
    applyOverDeliveryResult(parent, changedRow, data) {
      const targetRow = changedRow._isPoAssignChild
        ? this.getCalculatedAssignRow(parent, changedRow)
        : parent
      if (!targetRow) return

      if (data.salesDropShippingPrFlag === '1') {
        this.$set(targetRow, 'salesDropShippingPrFlag', '1')
        this.$set(targetRow, 'salesOrderAvailableDeliveryQty', data.salesOrderAvailableDeliveryQty)
        this.$set(targetRow, 'overDeliveryQty', data.overDeliveryQty)
        this.$modal.msgError(
          this.$t('PURCHASE.purchaseQuantityExceeds').replace(
            '$1',
            this.$numberStr(data.overDeliveryQty, data.decimalNum)
          )
        )
      } else {
        this.$set(targetRow, 'salesDropShippingPrFlag', undefined)
      }
    },
    // 快速编辑仍复用详细分配弹窗的单行计算接口，并用序号拦截旧请求回写。
    calculateQuickEditDetail(parent, changedRow) {
      const rowKey = String(parent[this.rowIdKey] || parent.productId)
      const requestSeq = (this.detailCalculateSeq[rowKey] || 0) + 1
      this.$set(this.detailCalculateSeq, rowKey, requestSeq)
      calculateOneDetail({
        ...parent,
        currencyId: this.formData.currencyId,
        currencyCode: this.formData.currencyCode,
        dropShipping: this.formData.dropShipping
      }).then((res) => {
        if (this.detailCalculateSeq[rowKey] !== requestSeq) return
        const data = res.data
        if (!data) return

        const calculatedRow = { ...parent, ...data }
        calculatedRow[this.rowIdKey] = parent[this.rowIdKey]
        calculatedRow._stableIndex = parent._stableIndex
        calculatedRow.assignList = data.assignList || parent.assignList || []
        this.preservePrAssignQuantity(parent.assignList, calculatedRow.assignList)
        calculatedRow.serviceSurchargeList =
          data.serviceSurchargeList || parent.serviceSurchargeList || []
        this.applyOverDeliveryResult(calculatedRow, changedRow, data)
        this.updateRow(calculatedRow)
      })
    },
    // 处理采购数量变更，并同步分配子级行、备货行及接口计算结果。
    purchaseQtyChange(row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      const parent = row._isPoAssignChild ? this.findAssignParent(row) : row
      if (parent && this.hasPrAssignRows(parent)) {
        if (row._isPoAssignChild) {
          this.updateAssignPurchaseQty(parent, row)
        } else {
          this.distributeParentPurchaseQty(parent)
        }
        this.calculateQuickEditDetail(parent, row)
        return
      }

      if (!row.purchaseRequisiteListShowStr) {
        const assignRow = (row.assignList || [])[0] || {}
        assignRow.purchaseQty = row.purchaseQty
      }
      this.getLineTotal(row)
      this.$nextTick(() => {
        this.changeTableList()
      })
    },
    changeUnitPrice(row) {
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.productId) {
        this.getLineTotal(row)
      } else {
        if (this.$resultOfBoolean(row.unitPrice) && row.qty) {
          const lineTotal = row.unitPrice * row.qty
          this.$set(row, 'lineTotal', lineTotal)
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
      }
      this.$nextTick(() => {
        this.changeTableList()
      })
    },
    // 费用项
    expenseItemChange(row) {
      this.$set(row, 'productNameError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    amountChange(row) {
      const timer = Date.now()
      this.queryTime = timer
      const list = this.formData.detailsOfExpensesList || []
      list.forEach((item) => {
        // item.currencyId = this.formData.currencyId
        // item.currencyCode = this.formData.currencyCode
        if (!item.timerId) {
          item.timerId = item.rowTimeId
        }
      })
      calculateDetailsOfExpenses({
        currencyId: this.formData.currencyId,
        currencyCode: this.formData.currencyCode,
        detailsOfExpensesList: [...list]
      }).then((res) => {
        if (timer !== this.queryTime) return
        const data = res.data || {}
        const list = data.detailsOfExpensesList || []
        list.forEach((item) => {
          const findItem = this.formData.detailsOfExpensesList.find(
            (i) => String(i.timerId) === String(item.timerId)
          )
          if (findItem) {
            this.$set(findItem, 'referenceAmount', item.referenceAmount)
            this.$set(findItem, 'referenceCurrencyCode', item.referenceCurrencyCode)
            this.$set(findItem, 'exchangeRate', item.exchangeRate)
          }
        })
      })
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.handleCalculate()
    },
    // 服务费用项
    expenseItemQtyChange(row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.qty) {
        row.qty = this.$num(row.qty, row.decimalNum)
      }
      if (this.$resultOfBoolean(row.unitPrice) && row.qty) {
        const lineTotal = row.unitPrice * row.qty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }

      if (!row.productId) {
        if (
          this.$resultOfBoolean(row.lineTotal) &&
          this.$resultOfBoolean(this.formData.exchangeRateForLegalEntity)
        ) {
          this.$set(
            row,
            'legalEntityLineTotal',
            row.lineTotal * this.formData.exchangeRateForLegalEntity
          )
        }
        this.$nextTick(() => {
          this.changeTableList()
        })
        return
      }

      row.dropShipping = this.formData.dropShipping
      calculateOneDetail({
        ...row,
        currencyId: this.formData.currencyId,
        currencyCode: this.formData.currencyCode
      }).then((res) => {
        const data = res.data || {}

        if (data.salesDropShippingPrFlag === '1') {
          this.$set(row, 'salesDropShippingPrFlag', '1')
          this.$set(row, 'salesOrderAvailableDeliveryQty', data.salesOrderAvailableDeliveryQty)
          this.$set(row, 'overDeliveryQty', data.overDeliveryQty)
          this.$modal.msgError(
            this.$t('PURCHASE.purchaseQuantityExceeds').replace(
              '$1',
              this.$numberStr(data.overDeliveryQty, data.decimalNum)
            )
          )

          // if (data.qty > data.salesOrderAvailableDeliveryQty) {
          // const num = this.$num(data.qty - data.salesOrderAvailableDeliveryQty, data.decimalNum)
          // this.$set(row, 'exceedsError', true)
          // } else {
          //   this.$set(row, 'exceedsError', false)
          // }
        } else {
          this.$set(row, 'salesDropShippingPrFlag', undefined)
          // this.$set(row, 'exceedsError', false)
        }

        this.$nextTick(() => {
          this.changeTableList()
        })
      })
    },
    discountChange(row) {
      this.getLineTotal(row)
    },
    getLineTotal(row) {
      this.$nextTick(() => {
        if (this.$resultOfBoolean(row.purchaseQty) && this.$resultOfBoolean(row.unitPrice)) {
          const lineTotal = row.unitPrice * row.purchaseQty
          if (row.purchaseOrderDetailType === '2') {
            row.discount = lineTotal
          } else if (row.discount > lineTotal) {
            row.discount = lineTotal
          }
          this.$set(row, 'lineTotal', lineTotal - (row.discount || 0))
        } else {
          this.$set(row, 'lineTotal', undefined)
        }
      })
    },

    handleAddExpenseItem() {
      if (!this.formData.detailsOfExpensesList) {
        this.$set(this.formData, 'detailsOfExpensesList', [])
      }
      const list = this.formData.detailsOfExpensesList
      list.push({
        whetherToTax: '1',
        [this.rowIdKey]: Date.now()
      })
      this.resetSnNum(this.tableList)
    },
    handleAddBtn() {
      const select1 = []
      const select2 = []
      this.tableList.forEach((item) => {
        ;(item.assignList || []).forEach((childRow) => {
          if (item.serviceSurchargeList) {
            childRow.serviceSurchargeList = item.serviceSurchargeList
          }
          if (childRow.purchaseRequisiteNo) {
            childRow.moq = item.moq
            select1.push(childRow)
          } else {
            select2.push(childRow)
          }
        })
      })

      this.$refs.selectProductTable.handleAdd(select1, select2)
    },
    leadTimeChange(row, index) {
      this.$set(row, 'leadTimeError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$emit('updateLeadTime', this.tableList)

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
              .confirm(this.$t('PURCHASE.warrantyDaysConfirm').replace('$1', msg))
              .then(() => {
                this.tableList.forEach((row) => {
                  this.$set(row, 'warranty', topRow.warranty)
                  if (row.serviceSurchargeList && row.serviceSurchargeList.length) {
                    row.serviceSurchargeList.forEach((child) => {
                      this.$set(child, 'warranty', topRow.warranty)
                    })
                  }
                })
              })
          } else {
            this.tableList.forEach((row) => {
              this.$set(row, 'warranty', topRow.warranty)
              if (row.serviceSurchargeList && row.serviceSurchargeList.length) {
                row.serviceSurchargeList.forEach((child) => {
                  this.$set(child, 'warranty', topRow.warranty)
                })
              }
            })
          }
        }
      }
    },
    updateTable(params) {
      const list = params.productList
      const oldList = this.tableList
      const rows = JSON.parse(JSON.stringify(list))
      let timer = Date.now()
      rows.forEach((item) => {
        item[this.rowIdKey] = item.productId
        if (item.serviceSurchargeList) {
          item.serviceSurchargeList.forEach((child) => {
            child.isCanUpdateUnitPrice = item.isCanUpdateUnitPrice

            if (!child[this.rowIdKey]) {
              child.lineTotal = undefined
              child.qty = undefined
              timer++
              child[this.rowIdKey] = timer
            }
          })
        }
        item.purchaseOrderDetailTypeShowStr = this.selectDictLabel(
          this.dict.type.p_purchase_order_detail_type,
          item.purchaseOrderDetailType
        )
        if (item.externalPartNo) {
          item.disExternalPartNo = '1'
        }
        const oldRow = oldList.find((oldItem) => oldItem.productId === item.productId)
        if (oldRow) {
          item.purchaseOrderDetailType = oldRow.purchaseOrderDetailType
          item.purchaseOrderDetailTypeShowStr = oldRow.purchaseOrderDetailTypeShowStr
          item.externalPartNo = item.externalPartNo || oldRow.externalPartNo
          item.discount = oldRow.discount
          item.leadTime = oldRow.leadTime
          item.warranty = oldRow.warranty
          item.committedDate = oldRow.committedDate
          item.remarks = oldRow.remarks
          const oldChildList = oldRow.serviceSurchargeList || []
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              const oldChild = oldChildList.find(
                (oldC) => oldC.expenseItemName === child.expenseItemName
              )
              if (oldChild) {
                child.qty = oldChild.qty
              }
            })
          }
        }
      })
      this.tableList = this.prepareProductTableTree(rows)
      this.changeTableList()
      this.removeUnrelatedAttachments(params.commonFileList)
    },
    updateRow(row) {
      let timer = Date.now()
      if (row.serviceSurchargeList) {
        row.serviceSurchargeList.forEach((child) => {
          child.isCanUpdateUnitPrice = row.isCanUpdateUnitPrice

          if (!child[this.rowIdKey]) {
            timer++
            child[this.rowIdKey] = timer
          }
        })
      }
      const index = this.tableList.findIndex((item) => item.productId === row.productId)
      if (index !== -1) {
        if (!row[this.rowIdKey]) {
          row[this.rowIdKey] = this.tableList[index][this.rowIdKey]
        }
        this.prepareProductRowTree(row, index)
        this.tableList.splice(index, 1, row)
        const selectRow =
          (row.pplList || []).find((item) => item.documentNo === row.documentNo) || {}
        this.removeUnrelatedAttachments(selectRow.commonFileList || [])
        this.changeTableList()
      }
    },
    changeTableList() {
      this.$emit('updateTable', this.tableList)
      const allList = []
      this.tableList.forEach((item) => {
        allList.push(item)
        this.getTableChildList(item).forEach((child) => {
          if (child._isPoAssignChild) {
            allList.push(child)
          } else {
            allList.push({
              ...child,
              productName: child.expenseItemName,
              purchaseQty: child.qty
            })
          }
        })
      })
      this.resetSnNum(this.tableList)
      this.$$getColumnContentMaxWidth(this.columns, allList)

      this.$nextTick(() => {
        this.handleCalculate()
      })
      this.initDraggable()
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        this.$set(item, 'levelNum', plantStage ? 2 : 1)
        this.$set(item, 'isTopItem', !!plantStage && index === 0)
        // 如果当前节点有子节点，递归查找
        const childList = this.getTableChildList(item)
        if (childList.length > 0) {
          this.resetSnNum(childList, item.snNum)
        }
      })
    },
    handleConfirmDelivery() {
      this.$refs.deliveryConfirmationDlg.handleOpen()
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.tableList = this.tableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
        })
        .catch(() => {})
    },
    // 行删除
    handleDelRow(index, row) {
      this.$modal.confirm(this.$t('ui.delConfirm')).then(() => {
        if (row._isPoAssignChild) {
          const parent = this.findAssignParent(row)
          if (!parent) return
          const assignList = parent.assignList || []
          const childIndex = assignList.findIndex(
            (child) => child === row || child[this.rowIdKey] === row[this.rowIdKey]
          )
          if (childIndex === -1) return

          assignList.splice(childIndex, 1)
          this.syncParentPurchaseRequisiteInfo(parent)

          // 最后一个 PR 来源行删除后，父级和备货行需一并删除，避免留下不可见孤立数据。
          if (!this.hasPrAssignRows(parent)) {
            const parentIndex = this.tableList.indexOf(parent)
            if (parentIndex !== -1) {
              const rowKey = String(parent[this.rowIdKey] || parent.productId)
              this.$set(this.detailCalculateSeq, rowKey, (this.detailCalculateSeq[rowKey] || 0) + 1)
              this.tableList.splice(parentIndex, 1)
            }
          } else {
            this.recalculateParentPurchaseQty(parent)
            this.prepareProductRowTree(parent, this.tableList.indexOf(parent))
            this.resetSnNum(this.tableList)
            // 删除后仍走单行计算，确保税额、金额及后端计算字段同步更新。
            this.calculateQuickEditDetail(parent, parent)
            return
          }
        } else if (row.isExpenseItem === '1') {
          const list = this.formData.detailsOfExpensesList || []
          const findindex1 = list.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
          if (findindex1 !== -1) {
            list.splice(findindex1, 1)
          }
        } else {
          const rootIndex = this.tableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (rootIndex !== -1) {
            this.tableList.splice(rootIndex, 1)
          } else {
            const removeFromChildren = (list) => {
              for (let i = 0; i < list.length; i++) {
                const parent = list[i]
                if (Array.isArray(parent.serviceSurchargeList)) {
                  const childIndex = parent.serviceSurchargeList.findIndex(
                    (c) => c[this.rowIdKey] === row[this.rowIdKey]
                  )
                  if (childIndex !== -1) {
                    parent.serviceSurchargeList.splice(childIndex, 1)
                    return true
                  }
                  if (removeFromChildren(parent.serviceSurchargeList)) {
                    return true
                  }
                }
              }
              return false
            }
            removeFromChildren(this.tableList)
          }
        }

        this.removeUnrelatedAttachments([])
        this.changeTableList()
        this.$set(this.totalForm, 'subTotal', undefined)
        this.$set(this.totalForm, 'totalTaxAmount', undefined)
        this.$set(this.totalForm, 'totalAmount', undefined)
      })
    },
    deleteRow(row) {
      const index = this.tableList.findIndex((item) => item[this.rowIdKey] === row[this.rowIdKey])
      if (index !== -1) {
        this.tableList.splice(index, 1)
        this.removeUnrelatedAttachments([])
        this.changeTableList()
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, column) {
      if (row._isPoAssignChild || (column && column.type === 'selection')) {
        return
      }
      if (row.isCustomProduct !== '1' && row.productId && this.poPurchaseQty === '1') {
        this.$refs.editProductDetailTable.handleOpen(row)
      }
    },
    // 产品行编辑删除
    handleEditRow(row) {
      row.currencyId = this.formData.currencyId
      row.currencyCode = this.formData.currencyCode
      this.$refs.editProductDetailTable.handleOpen(row)
    },
    /* 服务类型的产品 签收入库 */
    handleAcknowledge(row) {
      console.log('1===')
      this.$refs.AcknowledgeDlg.handleOpen(row)
    },
    handleAcknowledgeDetail(row) {
      console.log('2===')
      this.$refs.AcknowledgeDlg.handleOpen(row)
    },
    acknowledgeSuccess() {
      this.$emit('getPoById')
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
          } else if (
            !!row.expenseItemName &&
            (row.updateMsgList || []).find((item) => item.name === 'qty') &&
            column.property === 'purchaseQty'
          ) {
            cellClass = 'edit-table-cell'
          } else if (
            column.property === 'exchangeRateDesc' &&
            this.basicUpdateProps.includes('exchangeRateDesc')
          ) {
            cellClass = 'edit-table-cell'
          }
        }
      }
      if (!row[column.property] && row[column.property + 'Error']) {
        cellClass = 'is-required-table-cell'
      }
      if (column.property === 'purchaseRequisiteListShowStr') {
        cellClass = `${cellClass} po-source-document-cell`.trim()
      }
      if (column.property === 'productName') {
        cellClass = `${cellClass} po-product-name-flex-cell`.trim()
      }
      if (
        column.property === 'productName' &&
        row.levelNum === 1 &&
        row.productId &&
        row.isExpenseItem !== '1' &&
        !this.sortOrder
      ) {
        cellClass = `${cellClass} allowDrag`.trim()
      }

      return cellClass
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')

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

        /* 服务附加费行字段与表格列字段不同，在此统一映射错误标记。 */
        if (
          [
            'productName',
            'purchaseQty',
            'purchaseUom',
            'unitPrice',
            'purchaseRequisiteListShowStr'
          ].includes(code)
        ) {
          const childPropMap = {
            productName: 'expenseItemName',
            purchaseQty: 'qty',
            purchaseUom: 'unit',
            unitPrice: 'unitPrice',
            purchaseRequisiteListShowStr: 'sourceDocId'
          }
          const childList = item.serviceSurchargeList || []
          childList.forEach((child) => {
            const isError = !this.$resultOfBoolean(child[childPropMap[code]])
            this.$set(child, code + 'Error', isError)
            this.$set(child, 'ROW-ERROR', isError)
          })
        }
      })

      this.$nextTick(() => {
        this.scrollToErrorColumn()
      })
    },

    totalDiscountChange() {},
    handleCalculate() {
      const params = {
        ...this.totalForm,
        purchaseOrderDetailList: this.tableList
      }
      const timer = Date.now()
      this.queryTotalTime = timer
      calculate(params).then((res) => {
        console.log(res, '======================2296')
        if (this.queryTotalTime === timer) {
          const data = res.data || {}
          if (data.isTotalAmountNegativeTips === '1') {
            this.scrollPageToTotalAmount()
          }
          this.$set(this.totalForm, 'isTotalAmountNegativeTips', data.isTotalAmountNegativeTips)
          this.$set(this.totalForm, 'totalAmountNegativeTipsMsg', data.totalAmountNegativeTipsMsg)
          this.$set(this.totalForm, 'subTotal', data.subTotal)
          this.$set(this.totalForm, 'totalFreight', data.totalFreight)
          this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
          this.$set(this.totalForm, 'totalAmount', data.totalAmount)
          this.$set(this.totalForm, 'exchangeRateDesc', data.exchangeRateDesc)
          this.$set(this.totalForm, 'exchangeRateForLegalEntity', data.exchangeRateForLegalEntity)
          const newList = data.purchaseOrderDetailList || []
          newList.forEach((item) => {
            const findItem = this.tableList.find(
              (p) => p.productId && p.productId === item.productId
            )

            if (findItem) {
              this.$set(findItem, 'legalEntityLineTotal', item.legalEntityLineTotal)
              const assignList = this.preservePrAssignQuantity(
                findItem.assignList,
                item.assignList || []
              )
              this.$set(findItem, 'assignList', assignList)
              this.prepareProductRowTree(findItem, this.tableList.indexOf(findItem))
            }
          })
          this.tableList.forEach((x) => {
            this.$set(x, 'exchangeRateDesc', data.exchangeRateDesc)
          })
          this.$$getColumnContentMaxWidth(this.columns, this.tableList)
        }
      })
    },
    scrollPageToTotalAmount() {
      if (this.$refs.totalAmountRef) {
        const offsetTop = this.$refs.totalAmountRef.$el.offsetTop
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        this.$emit('scrollPageToTotalAmount', offsetTop - viewportHeight / 2)
      }
    },

    showPop(e, obj) {
      const purchaseRequisiteList =
        obj.purchaseRequisiteList || (obj.purchaseRequisiteNo ? [obj] : [])
      this.$set(this.popoverData, 'purchaseRequisiteList', purchaseRequisiteList)

      this.$set(this.popoverData, 'hide', false)
      if (purchaseRequisiteList.length > 0) this.$refs.pop1.popBy(e.target)
    },
    hidePop(e, obj) {
      if (this.popoverData) {
        this.popoverData.hide = true
      }
      setTimeout(() => {
        this.popoverData.hide && this.$refs.pop1.close()
      }, 300)
    },
    mouseenterCur() {
      if (this.popoverData) {
        this.popoverData.hide = false
      }
    },

    getUnitPriceChartIcon(unitPrice, lastUnitPrice) {
      if (!this.$resultOfBoolean(unitPrice) || !this.$resultOfBoolean(lastUnitPrice)) {
        return 'line-middle'
      } else if (unitPrice < lastUnitPrice) {
        return 'line-bottom'
      } else if (unitPrice > lastUnitPrice) {
        return 'line-top'
      } else {
        return 'line-middle'
      }
    },
    showPop2(e, obj) {
      const vm = this
      const options = {
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) => vm.$numberStr(value, 6, false, 2)
        },
        legend: {},
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          },
          data: [
            // '10-10-2013',
            // '11-10-2013',
            // '12-10-2013',
            // '13-10-2013',
            // '13-10-2013',
            // '13-10-2013',
            // '14-10-2013',
            // '15-10-2013',
            // '16-10-2013',
            // '18-10-2013'
          ]
        },
        yAxis: {
          name: '',
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: [],
            // data: [16, 20, 3, 4, 5, 4, 7, 8, 9, 10],
            itemStyle: {
              color: '#188df0'
            },
            barMaxWidth: 30,
            label: {
              show: false,
              position: 'top',
              formatter(params) {
                return vm.$numberStr(params.value, 6, false, 2)
              }
            }
          },
          {
            type: 'line',
            data: [],
            // data: [16, 20, 3, 4, 5, 4, 7, 8, 9, 10],
            itemStyle: {
              color: '#2466ff'
            },
            tooltip: {
              show: false // 确保这里为 true，或直接删除该行（默认就是开启）
            }
          }
        ],
        title: {
          show: false,
          text: this.$t('ui.noData'),
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#999',
            fontSize: 20
          }
        }
      }
      this.chartOptions = {}
      if (!obj.chartOptions) {
        const queryParams = {
          businessPartnerId: this.formData.businessPartnerId,
          productId: obj.productId,
          currencyId: this.formData.currencyId,
          purchaseOrderId: this.formData.purchaseOrderId,
          purchaseOrderDetailId: obj.purchaseOrderDetailId,
          purchaseOrderDetail: { ...obj }
        }
        const queryTime = Date.now()
        this.$set(this.chartData, 'queryTime', queryTime)
        this.$set(this.chartData, 'loading', true)

        queryProductHistoryPriceImage(queryParams)
          .then((res) => {
            if (queryTime === this.chartData.queryTime) {
              this.$set(this.chartData, 'loading', false)
            }
            const data = res.data || []
            const imageXList = data.imageXList || []
            const purchaseOrderDetailList = data.purchaseOrderDetailList || []
            options.yAxis.name = data.currencyCode
            options.xAxis.data = imageXList.map((item) => item.subShow)
            options.series[0].data = purchaseOrderDetailList.map((item) => item.unitPrice)
            options.series[1].data = purchaseOrderDetailList.map((item) => item.unitPrice)
            options.title.show = imageXList.length === 0
            options.xAxis.show = imageXList.length > 0
            this.$set(obj, 'chartOptions', options)
            this.chartOptions = options
          })
          .catch(() => {
            if (queryTime === this.chartData.queryTime) {
              this.$set(this.chartData, 'loading', false)
            }
          })
      } else {
        const oldData = obj.chartOptions.series[0].data
        const oldData1 = obj.chartOptions.series[1].data
        oldData.splice(oldData.length - 1, 1, obj.unitPrice)
        oldData1.splice(oldData.length - 1, 1, obj.unitPrice)
        this.chartOptions = { ...obj.chartOptions }
      }

      this.$set(this.chartData, 'hide', false)
      this.$refs.pop2.popBy(e.target)
    },
    hidePop2(e, obj) {
      if (this.chartData) {
        this.chartData.hide = true
      }
      setTimeout(() => {
        this.$set(this.chartData, 'loading', false)
        this.chartData.hide && this.$refs.pop2.close()
      }, 300)
    },

    mouseenterCur2() {
      if (this.chartData) {
        this.chartData.hide = false
      }
    },
    navToPR(row) {
      this.hidePop()
      this.$router.push({
        path: '/purchaseManagement/viewPurchaseRequisition',
        query: {
          id: row.purchaseRequisiteId,
          timeId: Date.now()
        }
      })
    },

    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    }
  }
}
</script>

<style>
.po-product-name-flex-cell .cell {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
</style>
<style lang="scss" scoped>
.product-row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.product-row-action-slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 20px;
  height: 20px;
}

.pop-box {
  max-width: 600px;
  max-height: 60vh;
  overflow-y: auto;
  // padding: 12px;
  box-sizing: border-box;
  background-color: #333;
  div {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.price-chart-box {
  width: 1000px;
  height: 300px;
}
.required-star {
  color: #ff4949;
  margin-right: 4px;
}
.source-document-text,
.source-document-select {
  display: inline-block;
  width: 98%;
  vertical-align: middle;
}
.po-source-document-content {
  width: 100%;
  min-width: 0;
}
.po-product-name-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 与 RFQ 一致的二级行树形连接线。 */
.level-2::before {
  content: '';
  position: absolute;
  left: 20px;
  top: -20px;
  width: 1px;
  height: 40px;
  border-left: 1px dashed #c0c4cc;
}
.topItem.level-2::before {
  top: 0;
  height: 20px;
}
.level-2::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 18px;
  width: 16px;
  border-top: 1px dashed #c0c4cc;
}

.tables {
  /deep/ .po-source-document-cell .cell {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
}
</style>
