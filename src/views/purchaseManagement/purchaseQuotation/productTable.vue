<template>
  <div class="pb20">
    <el-row>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane name="1">
          <span slot="label">
            <span>{{ $t('PURCHASE.productDetail') }}</span>
            <span v-show="comTableList.length" class="ml5">({{ comTableList.length }})</span>
          </span>
        </el-tab-pane>
        <!-- <el-tab-pane name="2">
          <span slot="label">
            <span>{{ $t('PURCHASE.detailsOfExpenses') }}</span>
            <span v-show="(form.detailsOfExpensesList || []).length" class="ml5"
              >({{ (form.detailsOfExpensesList || []).length }})</span
            >
          </span>
        </el-tab-pane> -->
      </el-tabs>
    </el-row>
    <div v-show="activeName === '1'">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="!comDisFrom">
          <el-button
            @click="handleAddBtn"
            :disabled="!businessPartnerId"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            >{{ $t('uiBtn.add') }}</el-button
          >
        </el-col>
        <el-col :span="1.5" v-if="!comDisFrom">
          <el-button @click="handleAddExpenseItem" type="primary" icon="el-icon-plus" size="mini">{{
            $t('PURCHASE.addExpenseItem')
          }}</el-button>
        </el-col>
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
        <el-col :span="1.5">
          <el-button
            @click="handleImport"
            v-if="importExportShow"
            type="primary"
            icon="el-icon-upload2"
            size="mini"
            >{{ $t('menu.importExport') }}</el-button
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

        <search-form
          ref="searchForm"
          v-model="queryParams"
          :searchData="searchData"
          :handleQuery="handleSearchForm"
          :resetQuery="resetSearchForm"
          :showCustom="false"
          :topShowCount="1"
          :isProductCustomSearch="true"
        />
      </el-row>
      <el-table
        border
        ref="tables"
        :row-key="rowIdKey"
        :tree-props="{ children: 'serviceSurchargeList', hasChildren: 'hasChildren' }"
        :indent="2"
        default-expand-all
        v-loading="loading"
        :row-class-name="tableRowClassName"
        :key="'table' + modifyHighlight"
        :cell-class-name="tableCellClassName"
        :data="comTableList"
        @select="handleSelectionChange"
        @select-all="handleSelectAll"
        @sort-change="handleSortChange"
        v-table-tab
      >
        <el-table-column
          v-if="false"
          type="selection"
          key="selection"
          align="center"
          width="55"
        ></el-table-column>
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
            <!-- <span>{{ scope.$index + 1 }}</span> -->
            <span>{{ scope.row.snNum }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-for="item in getVisibleColumn(comVisibleColumn)"
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
            <template v-if="['lastBasicUnitPrice'].includes(item.prop)">
              <span>{{ column.label }}</span>
              <span v-if="form.currencySymbol">({{ form.currencySymbol }})</span>
            </template>
            <span
              v-else-if="
                [
                  'productName',
                  'purchaseQty',
                  'purchaseUom',
                  'purchaseUomCoefficient',
                  'unitPrice',
                  'leadTime',
                  'publishedListPrice'
                ].includes(item.prop)
              "
            >
              <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
              <span v-if="item.prop === 'unitPrice' && form.currencySymbol"
                >({{ form.currencySymbol }})</span
              >
            </span>
            <span v-else>{{ column.label }}</span>
          </template>
          <template slot-scope="scope">
            <template v-if="item.prop === 'productName'">
              <template v-if="scope.row.isExpenseItem === '1'">
                <el-input
                  v-if="!comDisFrom"
                  style="width: 98%"
                  :title="scope.row.expenseItem"
                  v-model="scope.row.expenseItem"
                  :maxlength="50"
                  @change="expenseItemChange(scope.row)"
                />
                <span v-else>{{ scope.row.expenseItem }}</span>

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
                <selectExpenseItemName
                  :value="scope.row.expenseItemName"
                  :canSelectOptions="
                    getServiceSurchargeListOptions(serviceSurchargeListOptions, scope.row)
                  "
                  :allOptions="serviceSurchargeListOptions"
                  :style="`width:  calc(98% - ${item.isLeft === '1' ? 22 : 0}px)`"
                  @change="productNameChange($event, scope.row)"
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
                  "
                >
                  {{ $t('ui.alreadyExists').replace('$1', `[${scope.row.expenseItemName}]`) }}
                </div>
              </template>

              <template v-else>{{ scope.row.productName }}</template>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else-if="item.prop === 'externalPartNo' && scope.row.productId">
              <el-input
                v-if="!comDisFrom && scope.row.disExternalPartNo !== '1'"
                style="width: 98%"
                :title="scope.row.externalPartNo"
                v-model="scope.row.externalPartNo"
                :maxlength="200"
                :disabled="scope.row.isCanUpdate === '0'"
              />
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <template
              v-else-if="
                item.prop === 'internalPartNo' &&
                scope.row.isCustomProduct !== '1' &&
                scope.row.isTemp !== '1'
              "
            >
              <span class="primary-link" @click="nav(scope.row, 'internalPartNo')">{{
                scope.row.internalPartNo
              }}</span>
            </template>
            <div v-else-if="item.prop === 'purchaseQty' && scope.row.isExpenseItem !== '1'">
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
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>
                <template v-if="scope.row.productId">{{
                  $numberStr(
                    scope.row[item.prop],
                    scope.row.decimalNum,
                    scope.row.isAdhocEntry !== '1'
                  )
                }}</template>
                <template v-if="!scope.row.productId">{{
                  $numberStr(scope.row.qty, scope.row.decimalNum)
                }}</template>
              </template>
            </div>

            <template v-else-if="item.prop === 'inquiryQty'">
              <span>
                {{ $numberStr(scope.row[item.prop], scope.row.decimalNum) }}
              </span>
            </template>
            <template v-else-if="item.prop === 'purchaseUom' && scope.row.productId">
              <template v-if="!comDisFrom && scope.row.isAdhocEntry === '1'">
                <el-select
                  style="width: 98%"
                  v-model="scope.row.purchaseUom"
                  :title="showUomLabel(scope.row.purchaseUom)"
                  placeholder=""
                  filterable
                  @change="adhocEntryChangePurchaseUom(scope.row)"
                  :disabled="scope.row.isCanUpdate === '0'"
                >
                  <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <template
                v-else-if="
                  !comDisFrom &&
                  scope.row.isCustomProduct !== '1' &&
                  scope.row.isProjectTempProduct !== '1' &&
                  scope.row.isCanUpdateUom === '1'
                "
              >
                <el-select
                  style="width: 98%"
                  v-model="scope.row.purchaseUom"
                  :title="showUomLabel(scope.row[item.prop])"
                  @change="purchaseUomChange(scope.row)"
                  placeholder=""
                  filterable
                  :disabled="scope.row.isCanUpdate === '0'"
                >
                  <el-option
                    v-for="item in scope.row.uomDataList || []"
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
            <template v-else-if="item.prop === 'purchaseUom' && !scope.row.productId">
              <template v-if="scope.row.isCustom === '1' && !comDisFrom">
                <!-- {{ scope.row.unit }} -->
                <el-select
                  style="width: 98%"
                  v-model="scope.row.unit"
                  filterable
                  :title="showUomLabel(scope.row.unit)"
                  placeholder=""
                  @change="adhocEntryChangePurchaseUom(scope.row)"
                  :disabled="scope.row.isCanUpdate === '0'"
                >
                  <el-option v-for="item in allUomList" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>
              <span v-else :title="showUomLabel(scope.row.unit)">{{ scope.row.unit }}</span>
            </template>
            <template v-else-if="item.prop === 'purchaseUomCoefficient' && scope.row.productId">
              <div class="flex" :class="{ 'left-star': scope.row.pqResult === '1' }">
                <el-input-number
                  class="flex-1"
                  :disabled="
                    comDisFrom ||
                    scope.row.purchaseUom === scope.row.basicUom ||
                    scope.row.isCanUpdate === '0'
                  "
                  v-model="scope.row.purchaseUomCoefficient"
                  controls-position="right"
                  :precision="3"
                  v-thousandSplit="{ precision: 3 }"
                  :min="0.001"
                  :max="99999.999"
                  @change="purchaseUomCoefficientChange(scope.row)"
                />
                <span class="fs-0 ml10" :title="showUomLabel(scope.row.basicUom)">{{
                  scope.row.basicUom
                }}</span>
              </div>
              <TablePropError v-if="scope.row[item.prop + 'Error']" />
            </template>
            <template v-else-if="item.prop === 'lastBasicUnitPrice'">
              <span
                v-if="$resultOfBoolean(scope.row[item.prop]) && scope.row.purchaseUomCoefficient"
              >
                {{
                  $numberStr(scope.row[item.prop] * scope.row.purchaseUomCoefficient, 6, false, 2)
                }}
              </span>
            </template>

            <template v-else-if="item.prop === 'pqResultShowStr'">
              <template v-if="!comDisFrom || scope.row.isCanUpdate === '0'">
                <el-select
                  style="width: 98%"
                  v-model="scope.row.pqResult"
                  placeholder=""
                  @change="pqResultChange(scope.row)"
                >
                  <el-option
                    v-for="item in dict.type.p_pq_result || []"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
            <div
              v-else-if="item.prop === 'unitPrice'"
              :class="{ 'left-star': scope.row.pqResult === '1' }"
            >
              <template v-if="!comDisFrom">
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
                  v-if="scope.row.isExpenseItem === '1'"
                />
                <el-input-number
                  v-else
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
                  :disabled="scope.row.isCanUpdate === '0'"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>
                <span v-if="scope.row.isExpenseItem === '1'">{{
                  $numberStr(scope.row.amount, 6, false, 2)
                }}</span>
                <span v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</span>
              </template>
            </div>
            <div
              v-else-if="item.prop === 'publishedListPrice'"
              :class="{ 'left-star': scope.row.pqResult === '1' }"
            >
              <template
                v-if="
                  !comDisFrom &&
                  ['11', '12'].includes(scope.row.documentType) &&
                  (scope.row.isAdhocEntry === '1' ||
                    scope.row.isAdhocEntryHistory === '1' ||
                    scope.row.isProjectTempProduct === '1')
                "
              >
                <el-input-number
                  v-thousandSplit="{ precision: 6, minPrecision: 2, keepDec: false }"
                  style="width: 98%"
                  v-model="scope.row.publishedListPrice"
                  controls-position="right"
                  :precision="6"
                  :min-precision="2"
                  :min="scope.row.unitPrice"
                  :max="999999999999.99"
                  :disabled="!scope.row.unitPrice || scope.row.isCanUpdate === '0'"
                  @change="publishedListPriceChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{ $numberStr(scope.row[item.prop], 6, false, 2) }}</template>
            </div>

            <template v-else-if="item.prop === 'lineTotal'">
              <!-- {{ $numberStr(scope.row[item.prop], 6, false, 2) }} -->
              <div v-if="scope.row.isExpenseItem === '1'">
                {{ $numberStr(scope.row.amount, 6, false, 2) }}
              </div>
              <div v-if="scope.row.isExpenseItem !== '1'">
                {{ $numberStr(scope.row.lineTotal, 6, false, 2) }}
              </div>
            </template>

            <div
              v-else-if="item.prop === 'moq' && scope.row.productId"
              :class="{ 'left-star': scope.row.pqResult === '1' }"
            >
              <template v-if="!comDisFrom">
                <el-input-number
                  v-thousandSplit="{ precision: scope.row.decimalNum }"
                  style="width: 98%"
                  v-model="scope.row.moq"
                  controls-position="right"
                  :precision="scope.row.decimalNum"
                  :min="scope.row.includeDecimal === '1' ? 0.001 : 1"
                  :max="999999"
                  :disabled="scope.row.isCanUpdate === '0'"
                  @change="moqChange(scope.row)"
                />
                <TablePropError v-if="scope.row[item.prop + 'Error']" />
              </template>

              <template v-else>{{
                $numberStr(scope.row[item.prop], scope.row.decimalNum)
              }}</template>
            </div>

            <div
              v-else-if="item.prop === 'leadTime' && scope.row.productId"
              :class="{ 'left-star': scope.row.pqResult === '1' }"
            >
              <div class="flexSb">
                <div class="flow1">
                  <template v-if="!comDisFrom">
                    <el-input-number
                      v-thousandSplit="{ precision: 0 }"
                      style="width: 98%"
                      v-model="scope.row.leadTime"
                      controls-position="right"
                      :precision="0"
                      :min="1"
                      :max="999"
                      :disabled="scope.row.isCanUpdate === '0'"
                      @change="leadTimeChange(scope.row, scope.$index)"
                    />
                    <TablePropError v-if="scope.row[item.prop + 'Error']" />
                  </template>
                  <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
                </div>
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
            </div>
            <template v-else-if="item.prop === 'warranty' && scope.row.productId">
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                v-if="!comDisFrom"
                style="width: 98%"
                v-model="scope.row.warranty"
                controls-position="right"
                :precision="0"
                :min="0"
                :max="9999"
                :disabled="scope.row.isCanUpdate === '0'"
                @change="changeWarranty(scope.$index)"
              />
              <template v-else>{{ $numberStr(scope.row[item.prop], 0) }}</template>
            </template>
            <div
              v-else-if="item.prop === 'remarks'"
              :class="{ 'left-star': scope.row.pqResult === '2' }"
            >
              <template>
                <descriptionEditDlg
                  v-model="scope.row.remarks"
                  :maxlength="200"
                  :disabled="comDisFrom || scope.row.isCanUpdate === '0'"
                  @input="remarksChange(scope.row)"
                />
                <TablePropError v-if="!comDisFrom && scope.row[item.prop + 'Error']" />
              </template>
            </div>
            <template v-else-if="item.prop === 'productType'">
              <!-- <span v-if="scope.row.productType === '1'">{{ $t('PURCHASE.product') }}</span> -->
              <!-- <span v-if="scope.row.productType === '2'">{{ $t('menu.service') }}</span> -->
              <span>{{ selectDictLabel(dict.type.product_type, scope.row.productType) }}</span>
            </template>
            <template v-else-if="item.prop === 'description'">
              <descriptionEditDlg
                v-model="scope.row.description"
                :maxlength="7000"
                :disabled="comDisFrom"
              />
            </template>
            <template v-else>{{ scope.row[item.propBy || item.prop] }}</template>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('ui.action')"
          key="action"
          align="center"
          width="120"
          class-name="small-padding fixed-width"
          fixed="right"
          v-if="isShowAction || ((form.detailsOfExpensesList || []).length > 0 && !comDisFrom)"
        >
          <template slot-scope="scope">
            <div class="flexCen">
              <div style="width: 30px">
                <svg-icon
                  v-if="
                    currencyId &&
                    scope.row.purchaseUomCoefficient &&
                    purchaseQuotationRecordAuth &&
                    scope.row.isCustomProduct !== '1' &&
                    scope.row.isProjectTempProduct !== '1' &&
                    scope.row.productId
                  "
                  class="primary-pointer mr10"
                  icon-class="line"
                  style="font-size: 20px"
                  @click="handleViewHistoryChart(scope.row)"
                />
              </div>
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
              <div>
                <i
                  v-if="
                    scope.row.productId
                      ? (!scope.row.isCanDelete || scope.row.isCanDelete === '1') && !comDisFrom
                      : !comDisFrom
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

      <div class="mt20" v-if="false">
        <ExpenseItemTable
          :formData="form"
          :countryId="countryId"
          :businessPartnerId="businessPartnerId"
          :currencyId="currencyId"
          :modifyHighlight="modifyHighlight"
          :comDisFrom="comDisFrom"
          @changeDetailsOfExpenses="handleCalculate()"
        />
      </div>
    </div>

    <div>
      <el-form ref="totalForm" class="mt20" :model="totalForm" :rules="{}" label-width="140px">
        <div class="flex">
          <div class="flex-1">
            <!-- <el-form-item
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
            </el-form-item> -->
          </div>
          <div style="width: 40%; max-width: 600px; margin-right: 0px">
            <el-form-item
              :label="`${$t('PURCHASE.subTotal')}`"
              prop="subTotal"
              :class="[isModified('subTotal')]"
            >
              <el-input :value="$numberStr(totalForm.subTotal, 2, false, 2)" disabled></el-input>
            </el-form-item>
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

            <el-form-item
              :label="`${$t('PURCHASE.taxAmount')}`"
              prop="totalTaxAmount"
              :class="[isModified('totalTaxAmount')]"
            >
              <el-input
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
              <el-input :value="$numberStr(totalForm.totalAmount, 2, false, 2)" disabled></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <selectProductTable
      ref="selectProductTable"
      :purchaseQuotationId="form.purchaseQuotationId"
      :purchaseQuotationDataId="form.purchaseQuotationDataId"
      :rfqId="form.rfqId"
      :businessPartnerId="businessPartnerId"
      @onSuccess="updateTable"
    />
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

    <historyQuotationRecordsDlg ref="historyQuotationRecordsDlg" />
    <importProductExcelDlg
      ref="importProductExcelDlg"
      :purchaseQuotationId="form.purchaseQuotationId"
      @onSuccess="importSuccess"
    />
  </div>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'

import selectExpenseItemName from '@/views/purchaseManagement/purchaseQuotation/components/selectExpenseItemName'
import selectProductTable from './components/selectProductTable1'
import historyQuotationRecordsDlg from './components/historyQuotationRecordsDlg'
import importProductExcelDlg from './importProductExcelDlg'
import {
  queryHistoryPurchaseQuotationUnitPriceImage,
  calculate
} from '@/api/purchaseManagement/purchaseQuotation'
import ExpenseItemTable from '@/views/purchaseManagement/purchaseOrder/ExpenseItemTable.vue'

import Sortable from 'sortablejs'
import { Popover } from 'element-ui'
import Echart from '@/views/purchaseManagement/purchaseContract/components/Echart'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
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
  dicts: ['p_pq_result', 'product_type'],
  mixins: [pageMixin],
  components: {
    importProductExcelDlg,
    selectExpenseItemName,
    selectProductTable,
    historyQuotationRecordsDlg,
    popoverSvc,
    Echart,
    ExpenseItemTable
  },
  props: {
    serviceSurchargeListOptions: {
      type: Array,
      default() {
        return []
      }
    },
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
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
    modifyHighlight: {
      type: Boolean,
      default: false
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
    basicUpdateProps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    form: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.totalForm = newValue || { taxRate: undefined }
      }
    },
    pqProductList: {
      immediate: true,
      handler: function (selected) {
        this.createTableList = JSON.parse(JSON.stringify(this.pqProductList))
        this.changeTableList()
        if (this.createTableList.length > 0) {
          this.handleCalculate()
        } else {
          this.$set(this.totalForm, 'subTotal', undefined)
          this.$set(this.totalForm, 'totalFreight', undefined)
          this.$set(this.totalForm, 'totalTaxAmount', undefined)
          this.$set(this.totalForm, 'totalAmount', undefined)
        }
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
      saveKey: '191',
      savePath: 'purchaseMTable',
      loading: false,
      columns: [
        {
          prop: 'productName',
          label: vm.$t('PURCHASE.productName'),
          visible: true,
          minWidth: 160,
          tooltip: true,
          sortable: 'custom',
          required: true,
          fixed: true
        },
        {
          prop: 'rfqNo',
          label: vm.$t('PURCHASE.requestForQuotationNo'),
          visible: true,
          minWidth: 120,
          tooltip: true,
          fixed: false,
          sortable: 'custom'
        },
        /* {
          prop: 'productType',
          label: vm.$t('PURCHASE.productClass'),
          visible: true,
          minWidth: 120,
          tooltip: true,
          fixed: false,
          sortable: 'custom'
        }, */
        {
          prop: 'internalPartNo',
          label: vm.$t('PURCHASE.internalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'description',
          label: vm.$t('ui.description'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        },
        {
          prop: 'partNo',
          label: vm.$t('PURCHASE.partNo'),
          visible: false,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'externalPartNo',
          label: vm.$t('PURCHASE.externalPartNo'),
          visible: true,
          minWidth: 200,
          tooltip: true,
          sortable: 'custom'
        },
        {
          prop: 'inquiryQty',
          label: vm.$t('PURCHASE.qtyPur'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: false,
          sortable: 'custom',
          required: true
        },
        {
          prop: 'purchaseQty',
          label: vm.$t('PURCHASE.offeredQTY'),
          visible: true,
          minWidth: 140,
          padding: 60,
          tooltip: false,
          sortable: 'custom',
          required: true
        },
        {
          prop: 'purchaseUom',
          label: vm.$t('PURCHASE.uom'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom',
          required: true
        },
        {
          prop: 'purchaseUomCoefficient',
          label: vm.$t('PURCHASE.ratio'),
          visible: true,
          fixedWidth: 160,
          tooltip: true,
          sortable: 'custom',
          required: true
        },
        {
          prop: 'lastBasicUnitPrice',
          label: vm.$t('PURCHASE.lastQuotation'),
          visible: true,
          minWidth: 140,
          fixedWidth: 160,
          padding: 50,
          tooltip: true,
          align: 'right',
          sortable: 'custom'
        },
        {
          prop: 'unitPrice',
          label: vm.$t('PURCHASE.unitPrice'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom',
          required: true
        },
        {
          prop: 'publishedListPrice',
          label: vm.$t('PURCHASE.publishedListPrice'),
          visible: true,
          minWidth: 140,
          fixedWidth: vm.comDisFrom ? undefined : 230,
          tooltip: true,
          padding: 50,
          align: 'right',
          sortable: 'custom',
          required: true
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
          prop: 'moq',
          label: vm.$t('PURCHASE.MOQ'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom',
          required: true
        },
        {
          prop: 'leadTime',
          label: vm.$t('PURCHASE.leadTimeDays'),
          visible: true,
          minWidth: 140,
          tooltip: false,
          sortable: 'custom',
          required: true
        },
        {
          prop: 'warranty',
          label: vm.$t('PURCHASE.warrantyDays'),
          visible: true,
          minWidth: 140,
          tooltip: true,
          sortable: 'custom'
        },
        // {
        //   prop: 'pqResultShowStr',
        //   label: vm.$t('PURCHASE.result'),
        //   visible: true,
        //   minWidth: 140,
        //   fixedWidth: vm.comDisFrom ? undefined : 140,
        //   tooltip: true,
        //   sortable: 'custom'
        // },
        {
          prop: 'remarks',
          label: vm.$t('ui.remarks'),
          visible: true,
          minWidth: 200,
          tooltip: false,
          sortable: 'custom'
        }
      ],
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      selected: [],
      /* 排序缓存 */
      sortProp: '',
      sortOrder: '', // ascending, descending
      sortableDom: undefined,
      rowIdKey: 'rowTimeId',
      chartData: {
        loading: false
      },
      chartOptions: {},
      searchData: [
        {
          name: 'condition',
          placeholder: `${this.$t('ui.productSearch1')}`,
          type: 'InputEle'
        }
      ],
      // 查询参数
      queryParams: {
        condition: undefined
      },
      activeName: '1',
      createTableList: []
    }
  },
  computed: {
    importExportShow() {
      const buttonAuthMsg = this.form.buttonAuthMsg || {}
      return !this.comDisFrom && buttonAuthMsg.isCanImport === '1'
    },
    purchaseQuotationRecordAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:purchaseQuotationRecord'])
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    comIsShowPublishedListPrice() {
      return this.createTableList.find(
        (item) =>
          ['11', '12'].includes(item.documentType) &&
          (item.isAdhocEntry === '1' || item.isAdhocEntryHistory === '1')
      )
    },
    purchaseUomCoefficientIsHide() {
      return !this.createTableList.find((x) => x.purchaseUom !== x.basicUom)
    },
    comVisibleColumn() {
      let arr = [...this.visibleColumn]
      const filterProps1 = []
      if (!this.linkRFQ) {
        filterProps1.push('rfqNo')
      }

      if (!this.comIsShowPublishedListPrice) {
        filterProps1.push('publishedListPrice')
      }
      if (this.purchaseUomCoefficientIsHide) {
        filterProps1.push('purchaseUomCoefficient')
      }
      arr = arr.filter((x) => !filterProps1.includes(x.prop))

      return arr
    },
    isShowAction() {
      const currencyId = this.currencyId
      const purchaseQuotationRecordAuth = this.purchaseQuotationRecordAuth
      const comDisFrom = this.comDisFrom
      return this.createTableList.find((x) => {
        const showChart =
          currencyId &&
          x.purchaseUomCoefficient &&
          purchaseQuotationRecordAuth &&
          x.isCustomProduct !== '1' &&
          x.isAdhocEntry !== '1'
        // const showAddChild =
        //   x.isPhantom === '1' && !comDisFrom && (x.serviceSurchargeList || []).length < 8
        const showAddChild = !comDisFrom && (x.serviceSurchargeList || []).length < 8
        const showDel = x.productId
          ? (!x.isCanDelete || x.isCanDelete === '1') && !comDisFrom
          : !comDisFrom
        return showChart || showAddChild || showDel
      })
    },
    comTableList() {
      let table = this.createTableList
      if (this.queryParams.condition) {
        table = table.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.productName,
            item.internalPartNo,
            item.description
          ])
        })
      }
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
      let table2 = this.form.detailsOfExpensesList || []
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
      if (this.queryParams.condition) {
        table2 = table2.filter((item) => {
          return this.$isContain(this.queryParams.condition, [
            item.productName,
            item.internalPartNo,
            item.description
          ])
        })
      }
      return [...table, ...table2]
    }
  },
  created() {
    // reset stable counter when clearing lists
    this._stableCounter = 0
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    getVisibleColumn(VisibleColumn) {
      const fixedIndex = VisibleColumn.findIndex((item) => item.fixed)
      const firstIndex = fixedIndex >= 0 ? fixedIndex : 0
      return VisibleColumn.map((item, index) => {
        if (firstIndex === index) {
          return {
            ...item,
            width: 240,
            isLeft: '1'
          }
        }
        return item
      })
    },
    handleImport() {
      const formData = {
        ...this.form,
        purchaseQuotationDetailList: this.createTableList
      }
      this.$refs.importProductExcelDlg.show(formData)
    },
    importSuccess(importList) {
      this.createTableList.forEach((item, index) => {
        const findItem = importList.find(
          (i) =>
            i.productName === item.productName &&
            i.productName &&
            (item.internalPartNo || '') === (i.internalPartNo || '')
        )
        if (findItem) {
          if (item.serviceSurchargeList) {
            findItem.serviceSurchargeList = item.serviceSurchargeList
          }
          let timer = Date.now() + 10000
          if (!findItem.rowTimeId) {
            timer++
            this.$set(findItem, 'rowTimeId', timer)
          }
          this.createTableList.splice(index, 1, findItem)
        }
      })
      this.changeTableList()
      this.handleCalculate()
    },

    handleSortChange({ prop, order }) {
      this.sortProp = prop
      this.sortOrder = order
      this.handlerTableList()
      // 如果排序被清除，按稳定索引恢复自然顺序
      if (!prop || !order) {
        this.createTableList = (this.createTableList || []).slice().sort((a, b) => {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        })
        this.resetSnNum(this.createTableList)
        return
      }
      // 根据排序字段和顺序对数据进行排序
      this.createTableList.sort((a, b) => {
        const valueA = a[prop] !== undefined && a[prop] !== null ? a[prop] : ''
        const valueB = b[prop] !== undefined && b[prop] !== null ? b[prop] : ''

        if (valueA === valueB) {
          const ia = a && a._stableIndex !== undefined ? a._stableIndex : 0
          const ib = b && b._stableIndex !== undefined ? b._stableIndex : 0
          return ia - ib
        }

        if (order === 'ascending') {
          return valueA > valueB ? 1 : -1
        } else if (order === 'descending') {
          return valueA < valueB ? 1 : -1
        }
        return 0
      })
      this.resetSnNum(this.createTableList)
    },
    handlerTableList() {
      // 搜索展示由 comTableList 过滤，保留完整明细供计算和保存使用。
      // 确保每行有稳定索引，用于取消排序时恢复原始顺序
      this.createTableList.forEach((row) => {
        if (row && row._stableIndex === undefined) {
          this._stableCounter = (this._stableCounter || 0) + 1
          this.$set(row, '_stableIndex', this._stableCounter)
        }
      })
    },
    /** 搜索 */
    handleSearchForm() {
      this.queryParams.pageNum = 1
      this.handlerTableList()
    },
    /** 重置 */
    resetSearchForm() {
      this.$refs.tables && this.$refs.tables.clearSort()
    },
    nav(row) {
      if (row.isAdhocEntry === '1') {
        this.$router.push({
          path: '/productManagement/editProductInfo',
          query: {
            id: row.productMainId,
            timeId: Date.now(),
            back: '1'
          }
        })
      } else {
        this.$router.push({
          path: '/productManagement/viewExtendedProductInfo',
          query: {
            id: row.productMainId,
            timeId: Date.now()
          }
        })
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
              show: true,
              position: 'top',
              formatter(params) {
                return vm.$numberStr(params.value, 6, false, 2)
              }
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
          purchaseUomCoefficient: obj.purchaseUomCoefficient,
          purchaseQuotationDetailId: obj.purchaseQuotationDetailId,
          currencyId: this.currencyId
        }
        const queryTime = Date.now()
        this.$set(this.chartData, 'queryTime', queryTime)
        this.$set(this.chartData, 'loading', true)

        queryHistoryPurchaseQuotationUnitPriceImage(queryParams)
          .then((res) => {
            if (queryTime === this.chartData.queryTime) {
              this.$set(this.chartData, 'loading', false)
            }
            const data = res.data || []
            const imageXList = data.imageXList || []
            const imageColumnList = data.imageColumnList || []
            options.yAxis.name = data.currencyCode
            options.xAxis.data = imageXList.map((item) => item.subShow)
            options.series[0].data = imageColumnList.map((item) => item.unitPrice)
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
        this.chartOptions = obj.chartOptions
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
    handleViewHistoryChart(row) {
      console.log(this.businessPartnerId, '===============1493')
      const params = {
        productId: row.productId,
        currencyId: this.currencyId,
        purchaseUomCoefficient: row.purchaseUomCoefficient,
        businessPartnerIdList: [this.businessPartnerId],
        purchaseQuotationDetail: {
          ...row,
          businessPartnerId: this.businessPartnerId,
          abbreviation: this.form.abbreviation,
          businessPartnerName: this.form.businessPartnerName,
          businessPartnerNo: this.form.businessPartnerNo,
          ...this.form
        }
      }
      this.$refs.historyQuotationRecordsDlg.handleOpen(params)
    },

    mouseenterCur2() {
      if (this.chartData) {
        this.chartData.hide = false
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
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            item.tooltip = vm.comDisFrom
            break
          case 'description':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'purchaseUom':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            break
          case 'purchaseUomCoefficient':
            item.colMinWidth = vm.comDisFrom ? undefined : 160
            break
          case 'unitPrice':
            item.colMinWidth = vm.comDisFrom ? 160 : 160
            item.tooltip = vm.comDisFrom
            break
          case 'publishedListPrice':
            item.fixedWidth = vm.comDisFrom ? undefined : 230
            item.tooltip = vm.comDisFrom
            break
          case 'moq':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            item.tooltip = vm.comDisFrom
            break
          case 'leadTime':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            item.tooltip = vm.comDisFrom
            break
          case 'warranty':
            item.colMinWidth = vm.comDisFrom ? undefined : 120
            item.tooltip = vm.comDisFrom
            break
          case 'pqResultShowStr':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
          case 'remarks':
            item.fixedWidth = vm.comDisFrom ? undefined : 200
            break
        }
      })
    },
    initList(list) {
      this.createTableList = JSON.parse(JSON.stringify(list))
    },
    getList() {
      return this.createTableList
    },
    errorMessage(code) {
      this.$emit('scrollPageToTable')
      // this.createTableList.forEach((item) => {
      //   if (!this.$resultOfBoolean(item[code])) {
      //     this.$set(item, code + 'Error', true)
      //   }
      // })

      let rowIndex
      this.createTableList.forEach((item, index) => {
        let isErr = code && !this.$resultOfBoolean(item[code])
        if (code === 'publishedListPrice') {
          isErr =
            !this.$resultOfBoolean(item.publishedListPrice) &&
            item.pqResult === '1' &&
            ['11', '12'].includes(item.documentType) &&
            item.isAdhocEntry === '1'
        }
        if (isErr) {
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
        /* 服务费用项必填校验 */
        if (['productName', 'purchaseQty', 'purchaseUom', 'unitPrice'].includes(code)) {
          const childList = item.serviceSurchargeList || []
          childList.forEach((child) => {
            if (code === 'productName') {
              if (!this.$resultOfBoolean(child.expenseItemName)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'expenseItemNameError', true)
                this.$set(child, 'ROW-ERROR', true)
              }
            }
            if (code === 'purchaseQty') {
              if (!this.$resultOfBoolean(child.qty)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'qtyError', true)
                this.$set(child, 'ROW-ERROR', true)
              }
            }
            if (code === 'purchaseUom') {
              if (!this.$resultOfBoolean(child.unit)) {
                this.$set(child, code + 'Error', true)
                this.$set(child, 'unitError', true)
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
    },
    setLastBasicUnitPrice(PriceData) {
      this.createTableList.forEach((item) => {
        this.$set(item, 'lastBasicUnitPrice', PriceData[item.productId])
        this.$set(item, 'chartOptions', undefined)
      })
    },

    expenseItemChange(row) {
      this.$set(row, 'expenseItemError', false)
      this.$set(row, 'productNameError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    amountChange(row) {
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.handleCalculate()
    },

    getServiceSurchargeListOptions(options, row, index) {
      const findItem = this.createTableList.find((item) => {
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
      const findItem = this.createTableList.find((item) => {
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
      this.$set(row, 'expenseItemNameError', false)
      this.$set(row, 'productNameError', false)
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)
      if (row.qtyLimit && row.qty > row.qtyLimit) {
        this.$set(row, 'qty', undefined)
        this.$set(row, 'lineTotal', undefined)
      }
    },
    purchaseQtyChange(row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)

      this.queryRowTaxAmount(row)
      this.validCoefficientIsTrue(row)
    },
    changeAdhocEntryQty(index, row) {
      this.$set(row, 'purchaseQtyError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.$nextTick(() => {
        if (row.purchaseQty) {
          this.$set(row, 'purchaseQty', this.$num(row.purchaseQty, row.decimalNum))
        }
        this.queryRowTaxAmount(row)
        this.validCoefficientIsTrue(row)
      })
    },
    expenseItemQtyChange(row) {
      if (row.qty) {
        row.qty = this.$num(row.qty, row.decimalNum)
      }
      this.$set(row, 'qtyError', false)
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
      this.$set(row, 'unitError', false)
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (row.purchaseUom === row.basicUom) {
        this.$set(row, 'purchaseUomCoefficient', 1)
      }
    },
    purchaseUomChange(row) {
      this.$set(row, 'purchaseUomError', false)
      this.$set(row, 'ROW-ERROR', false)

      const selectItem = row.uomDataList.find((item) => item.uomName === row.purchaseUom)
      if (row.includeDecimal === '1') {
        const qty = Math.ceil((row.basicQty / selectItem.uomCoefficient) * 1000) / 1000
        this.$set(row, 'purchaseQty', qty)
      } else {
        const qty = Math.ceil(row.basicQty / selectItem.uomCoefficient)
        this.$set(row, 'purchaseQty', qty)
      }

      this.$set(row, 'purchaseUomCoefficient', selectItem.uomCoefficient)
      this.queryRowTaxAmount(row)
    },
    purchaseUomCoefficientChange(row) {
      this.$set(row, 'chartOptions', undefined)
      this.$set(row, 'purchaseUomCoefficientError', false)
      this.$set(row, 'ROW-ERROR', false)
      this.validCoefficientIsTrue(row)
    },
    validCoefficientIsTrue(row) {
      if (!row.purchaseUomCoefficient || !row.purchaseQty) return true
      const { decimalPlaces, formulaStr } = getMultiplyDecimalPlaces(
        row.purchaseQty,
        row.purchaseUomCoefficient
      )
      if (row.includeDecimal === '1') {
        if (decimalPlaces <= 3) {
          return true
        } else {
          this.$modal.msgError(
            this.$t('PURCHASE.validCoefficientErrForDecimal')
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
            this.$t('PURCHASE.validCoefficientErr')
              .replace('$1', row.productName)
              .replace('$2', formulaStr)
          )
          return false
        }
      }
    },
    pqResultChange(row) {
      this.$set(row, 'pqResultError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    publishedListPriceChange(row) {
      this.$set(row, 'publishedListPriceError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    moqChange(row) {
      this.$set(row, 'moqError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    leadTimeChange(row, index) {
      this.$set(row, 'leadTimeError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (index === 0) {
        const topRow = this.createTableList[0]
        if (topRow && this.$resultOfBoolean(topRow.leadTime)) {
          const oldLeadTime = this.createTableList.find(
            (item, index) =>
              index > 0 && this.$resultOfBoolean(item.leadTime) && item.leadTime !== topRow.leadTime
          )
          if (oldLeadTime) {
            const msg = this.$numberStr(topRow.leadTime, 0)
            this.$modal.confirm(this.$t('PURCHASE.leadTimeConfirm').replace('$1', msg)).then(() => {
              this.createTableList.forEach((row1) => {
                this.$set(row1, 'leadTime', topRow.leadTime)
                this.$set(row1, 'leadTimeError', false)
                this.$set(row1, 'ROW-ERROR', false)
              })
              this.handleCalculate()
            })
          } else {
            this.createTableList.forEach((row1) => {
              this.$set(row1, 'leadTime', topRow.leadTime)
              this.$set(row1, 'leadTimeError', false)
              this.$set(row1, 'ROW-ERROR', false)
            })
          }
        }
      }

      this.handleCalculate()
    },
    changeWarranty(index) {
      if (index === 0) {
        const topRow = this.createTableList[0]
        if (topRow && this.$resultOfBoolean(topRow.warranty)) {
          const oldDeliveryDate = this.createTableList.find(
            (item, index) =>
              index > 0 && this.$resultOfBoolean(item.warranty) && item.warranty !== topRow.warranty
          )
          if (oldDeliveryDate) {
            const msg = this.$numberStr(topRow.warranty, 0)
            this.$modal
              .confirm(this.$t('PURCHASE.warrantyDaysConfirm').replace('$1', msg))
              .then(() => {
                this.createTableList.forEach((row) => {
                  this.$set(row, 'warranty', topRow.warranty)
                })
              })
          } else {
            this.createTableList.forEach((row) => {
              this.$set(row, 'warranty', topRow.warranty)
            })
          }
        }
      }
    },
    remarksChange(row) {
      this.$set(row, 'remarksError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    unitPriceChange(row) {
      this.$set(row, 'unitPriceError', false)
      this.$set(row, 'ROW-ERROR', false)

      if (this.$resultOfBoolean(row.unitPrice)) {
        if (row.publishedListPrice && row.publishedListPrice < row.unitPrice) {
          this.$set(row, 'publishedListPrice', row.unitPrice)
        }
      } else {
        this.$set(row, 'publishedListPrice', undefined)
      }
      this.queryRowTaxAmount(row)
    },
    queryRowTaxAmount(row) {
      if (row.unitPrice && row.purchaseQty) {
        const lineTotal = row.unitPrice * row.purchaseQty
        this.$set(row, 'lineTotal', lineTotal)
      } else {
        this.$set(row, 'lineTotal', undefined)
      }
      this.handleCalculate()
    },
    handleCalculate() {
      const params = {
        ...this.totalForm,
        purchaseQuotationDetailList: this.createTableList
      }
      const timer = Date.now()
      this.queryTotalTime = timer
      this.loading = true
      calculate(params)
        .then((res) => {
          if (this.queryTotalTime === timer) {
            const data = res.data || {}
            if (data.isTotalAmountNegativeTips === '1') {
              this.scrollPageToTotalAmount()
              // this.$modal.msgError(data.totalAmountNegativeTipsMsg)
            }
            this.$set(this.totalForm, 'isTotalAmountNegativeTips', data.isTotalAmountNegativeTips)
            this.$set(this.totalForm, 'totalAmountNegativeTipsMsg', data.totalAmountNegativeTipsMsg)
            this.$set(this.totalForm, 'subTotal', data.subTotal)
            this.$set(this.totalForm, 'totalFreight', data.totalFreight)
            this.$set(this.totalForm, 'totalTaxAmount', data.totalTaxAmount)
            this.$set(this.totalForm, 'totalAmount', data.totalAmount)
            let timer = Date.now()
            data.purchaseQuotationDetailList.forEach((item) => {
              item.rowTimeId = item.productId
              if (item.serviceSurchargeList) {
                item.serviceSurchargeList.forEach((child) => {
                  timer++
                  child.rowTimeId = timer
                })
              }
              this.createTableList.forEach((x) => {
                if (item[this.rowIdKey] === x[this.rowIdKey]) {
                  if (x.purchaseQtyError) {
                    this.$set(item, 'purchaseQtyError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }
                  if (x.purchaseUomError) {
                    this.$set(item, 'purchaseUomError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }
                  if (x.publishedListPriceError) {
                    this.$set(item, 'publishedListPriceError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }
                  if (x.moqError) {
                    this.$set(item, 'moqError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }
                  if (x.leadTimeError) {
                    this.$set(item, 'leadTimeError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }
                  if (x.remarksError) {
                    this.$set(item, 'remarksError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }
                  if (x.unitPriceError) {
                    this.$set(item, 'unitPriceError', true)
                    this.$set(item, 'ROW-ERROR', true)
                  }

                  if (x.serviceSurchargeList && x.serviceSurchargeList.length > 0) {
                    const childList = item.serviceSurchargeList || []

                    childList.forEach((child, childIndex) => {
                      const row = x.serviceSurchargeList[childIndex]
                      console.log(row, '=========2002')
                      if (row.expenseItemNameError) {
                        this.$set(child, 'expenseItemNameError', true)
                        this.$set(child, 'productNameError', true)
                        this.$set(child, 'ROW-ERROR', true)
                      }
                      if (row.qtyError) {
                        this.$set(child, 'qtyError', true)
                        this.$set(child, 'purchaseQtyError', true)
                        this.$set(child, 'ROW-ERROR', true)
                      }
                      if (row.unitError) {
                        this.$set(child, 'unitError', true)
                        this.$set(child, 'purchaseUomError', true)
                        this.$set(child, 'ROW-ERROR', true)
                      }
                      if (row.unitPriceError) {
                        this.$set(child, 'unitPriceError', true)
                        this.$set(child, 'ROW-ERROR', true)
                      }
                    })
                  }
                }
              })
            })
            this.createTableList = data.purchaseQuotationDetailList
            this.resetSnNum(this.createTableList)
            this.handlerTableList()
            this.changeTableList()
          }
          setTimeout(() => {
            this.loading = false
          }, 50)
        })
        .catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 50)
        })
    },
    scrollPageToTotalAmount() {
      if (this.$refs.totalAmountRef) {
        const offsetTop = this.$refs.totalAmountRef.$el.offsetTop
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight
        this.$emit('scrollPageToTotalAmount', offsetTop - viewportHeight / 2)
      }
    },
    handleAddExpenseItem() {
      if (!this.form.detailsOfExpensesList) {
        this.$set(this.form, 'detailsOfExpensesList', [])
      }
      const list = this.form.detailsOfExpensesList
      list.push({
        isExpenseItem: '1',
        whetherToTax: '1',
        [this.rowIdKey]: Date.now()
      })
      this.resetSnNum(this.createTableList)
    },
    handleAddBtn() {
      const tableList = JSON.parse(JSON.stringify(this.createTableList))
      this.$refs.selectProductTable.handleAdd(tableList)
    },
    updateTable(list) {
      if (list.length > 0) {
        const rows = JSON.parse(JSON.stringify(list))
        let timer = Date.now()
        rows.forEach((item) => {
          item.pqResult = '1'
          item[this.rowIdKey] = item.productId
          if (item.isPhantom === '1' && !item.serviceSurchargeList) {
            const defaultList = this.serviceSurchargeListOptions.filter((i) => i.isDefault === '1')
            item.serviceSurchargeList = defaultList.map((p, index) => {
              timer++
              return {
                rowTimeId: timer,
                expenseItemName: p.expenseItemName, // 费用项名称
                unit: p.unit,
                unitPrice: undefined,
                includeDecimal: p.includeDecimal,
                decimalNum: p.includeDecimal === '1' ? 3 : 0,
                qtyLimit: p.qtyLimit,
                qty: 1
              }
            })
          }
          if (this.createTableList && this.createTableList.length > 0) {
            const topRow = this.createTableList[0]
            if (topRow && topRow.warranty) {
              rows.forEach((row) => {
                if (!row.warranty) {
                  this.$set(row, 'warranty', topRow.warranty)
                }
              })
            }
          }
        })

        // preserve or assign stable indices for incoming rows
        rows.forEach((r) => {
          if (r && r._stableIndex === undefined) {
            this._stableCounter = (this._stableCounter || 0) + 1
            r._stableIndex = this._stableCounter
          }
        })
        this.createTableList.length = 0
        this.createTableList.push(...rows)
        this.changeTableList()
        this.$nextTick(() => {
          this.selected.forEach((row) => {
            this.createTableList.forEach((item) => {
              if (row[this.rowIdKey] === item[this.rowIdKey]) {
                this.$refs.tables.toggleRowSelection(item, true)
              }
            })
          })
        })
        // this.initDraggable()
      } else {
        this.createTableList = []
      }
      this.handleCalculate()
    },
    changeTableList() {
      this.resetSnNum(this.createTableList)
      this.$emit('updateTable', this.createTableList)
      const allList = []
      this.createTableList.forEach((item) => {
        allList.push(item)
        if (item.serviceSurchargeList) {
          item.serviceSurchargeList.forEach((child) => {
            allList.push({
              ...child,
              productName: child.expenseItemName,
              purchaseQty: child.qty
            })
          })
          allList.push(...item.serviceSurchargeList)
        }
      })
      this.$$getColumnContentMaxWidth(this.columns, allList)
    },
    // 选中多个删除
    handleDelete() {
      this.$modal
        .confirm(this.$t('ui.delConfirm'))
        .then(() => {
          this.createTableList = this.createTableList.filter((row) => {
            if (this.selected.find((item) => item[this.rowIdKey] === row[this.rowIdKey])) {
              return false
            }
            return true
          })
          this.changeTableList()
          this.selected = []
          this.handleCalculate()
        })
        .catch(() => {})
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
          const findindex1 = this.createTableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findindex1 !== -1) {
            this.createTableList.splice(findindex1, 1)
          }
          const findindex2 = this.createTableList.findIndex(
            (item) => item[this.rowIdKey] === row[this.rowIdKey]
          )
          if (findindex2 !== -1) {
            this.createTableList.splice(findindex2, 1)
          }
        } else {
          this.createTableList.find((item) => {
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
        this.resetSnNum(this.createTableList)
        this.handleCalculate()
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
        const delArr = this.createTableList.map((item) => item[this.rowIdKey])
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
          }
        }
      }
      if (!row[column.property] && row[column.property + 'Error']) {
        cellClass = 'is-required-table-cell'
      }
      /* if (
        this.createTableList.find(
          (item) => !item[column.property] && item[column.property + 'Error']
        )
      ) {
        cellClass = 'is-required-table-cell'
      } */
      return cellClass
    },
    initDraggable() {
      this.destroyDraggable()
      setTimeout(() => {
        const el = this.$refs.tables.$el.querySelectorAll(
          '.el-table__fixed-body-wrapper > table > tbody'
        )[0]
        this.sortableDom = Sortable.create(el, {
          handle: '.allowDrag',
          animation: 100,
          ghostClass: 'blue-background-class',
          onEnd: (evt) => {
            if (evt.oldIndex === evt.newIndex) return
            const targetRow = this.createTableList.splice(evt.oldIndex, 1)[0]
            this.createTableList.splice(evt.newIndex, 0, targetRow)
          }
        })
      }, 300)
    },
    destroyDraggable() {
      if (this.sortableDom) {
        this.sortableDom.destroy()
        this.sortableDom = undefined
      }
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
  width: 1000px;
  height: 300px;
}
</style>
