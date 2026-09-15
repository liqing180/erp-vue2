<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.supplierName')}`">
                      <SelectInput
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.supplierCode')}`">
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.aslNo')}`">
                      <el-input :value="form.approvedSupplierNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseQuotationNo')}`">
                      <CommonSelectAndList
                        :id="form.purchaseQuotationId"
                        :label="form.purchaseQuotationNo"
                        idKey="purchaseQuotationId"
                        labelKey="purchaseQuotationNo"
                        filterable
                        :options="purchaseQuotationOptions"
                        :loading="purchaseQuotationOptionsLoading"
                        @change="updatePurchaseQuotationNo"
                        @handleOpen="openPurchaseQuotationTable"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.taxRate')}`" prop="taxRate">
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :loading="taxRateOptionsLoading"
                        :disabled="!form.businessPartnerId || comDisFrom"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_approved_supplier_status,
                            form.approvedSupplierStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <div class="input-switch-box">
                          <div class="con-left">
                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermOptions"
                              :loading="paymentTermOptionsLoading"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                              :disabled="!form.businessPartnerId || comDisFrom"
                            />
                          </div>
                          <div class="con-right" v-if="form.paymentTermName && !comDisFrom">
                            <i
                              class="el-icon-edit primary"
                              style="font-size: 20px"
                              @click="openEditPaymentTermDlg"
                            ></i>
                          </div>
                        </div>
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.contactPerson')}`" prop="contactPersonId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId || comDisFrom"
                        :id="form.contactPersonId"
                        :label="form.contactPersonName"
                        :title="form.contactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="contactPersonChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('PURCHASE.incoterm')}`"
                      prop="incotermId"
                      :rules="[
                        {
                          required: comIncotermReq,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="comIncotermOptions"
                        :loading="incotermOptionsLoading"
                        @change="incotermIdChange"
                        :disabled="!form.businessPartnerId || comDisFrom"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('PURCHASE.port')}`"
                      v-if="form.incotermAddressType === '0'"
                      key="receivePortName1"
                    >
                      <el-input
                        :value="$t('PURCHASE.selfCollect')"
                        :maxlength="50"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      :label="`${$t('PURCHASE.port')}`"
                      prop="receivePortName"
                      :rules="[
                        {
                          required: form.incotermAddressType === '1',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      key="receivePortName2"
                      v-else
                    >
                      <CommonSelectAndList
                        :id="form.receivePortId"
                        :label="form.receivePortName"
                        idKey="portId"
                        labelKey="portName"
                        filterable
                        :options="portOptions"
                        :disabled="
                          form.country === legalEntityInfo.country
                            ? true
                            : form.incotermAddressType !== '1' ||
                              !form.businessPartnerId ||
                              comDisFrom
                        "
                        @change="updatePort"
                        ref="portRef"
                        @handleOpen="openReceivePortTable"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId || comDisFrom"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        filterable
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload
                        ref="uploadRef"
                        :accept="['.jpg', '.jpeg', '.png', '.pdf']"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productName')}`">
                      <el-input
                        :value="form.productName"
                        :title="form.productName"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                      <el-input
                        :value="form.internalPartNo"
                        :title="form.internalPartNo"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.externalPartNo')}`">
                      <el-input
                        :value="form.externalPartNo"
                        :title="form.externalPartNo"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseUOM')}`" prop="purchaseUom">
                      <el-select
                        style="width: 100%"
                        v-model="form.purchaseUom"
                        :title="showUomLabel(form.purchaseUom)"
                        @change="purchaseUomChange()"
                        placeholder=""
                        size="mini"
                      >
                        <el-option
                          v-for="item in form.uomDataList || []"
                          :key="item.uomName"
                          :label="item.uomName"
                          :value="item.uomName"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PURCHASE.ratio')"
                      prop="purchaseUomCoefficient"
                      v-if="form.purchaseUom !== form.basicUom"
                      key="purchaseUomCoefficient11"
                    >
                      <div style="display: flex">
                        <el-input-number
                          style="width: 100%"
                          v-model="form.purchaseUomCoefficient"
                          :disabled="comDisFrom || form.purchaseUom === form.basicUom"
                          controls-position="right"
                          :precision="3"
                          v-thousandSplit="{ precision: 3 }"
                          :min="0.001"
                          :max="99999.999"
                          @change="inputNumberChange('purchaseUomCoefficient')"
                        />
                        <div class="unit" :title="showUomLabel(form.basicUom)">
                          {{ form.basicUom || '' }}
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item
                      :label="`${$t('PURCHASE.warrantyDays')}`"
                      key="warrantyDays11"
                      v-else
                    >
                      <el-input-number
                        v-thousandSplit="{ precision: 0 }"
                        style="width: 100%"
                        v-model="form.warranty"
                        controls-position="right"
                        :precision="0"
                        :min="0"
                        :max="9999"
                        @change="inputNumberChange('warranty')"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.contractedPrice')}`" prop="unitPrice">
                      <el-input-number
                        v-thousandSplit="{ precision: 2 }"
                        style="width: 100%"
                        v-model="form.unitPrice"
                        controls-position="right"
                        :precision="2"
                        :min="0.0"
                        :max="999999999999.99"
                        @change="inputNumberChange('unitPrice')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.MOQ')}`">
                      <el-input-number
                        v-thousandSplit="{ precision: form.decimalNum }"
                        style="width: 100%"
                        v-model="form.moq"
                        controls-position="right"
                        :precision="form.decimalNum"
                        :min="form.includeDecimal === '1' ? 0.001 : 1"
                        :max="999999"
                        @change="inputNumberChange('moq')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.leadTimeDays')}`" prop="leadTime">
                      <el-input-number
                        v-thousandSplit="{ precision: 0 }"
                        style="width: 100%"
                        v-model="form.leadTime"
                        controls-position="right"
                        :precision="0"
                        :min="1"
                        :max="999"
                        @change="inputNumberChange('leadTime')"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.authorizedPrice')}`">
                      <el-input-number
                        v-thousandSplit="{ precision: 2 }"
                        style="width: 100%"
                        v-model="form.authorizedPrice"
                        controls-position="right"
                        :precision="2"
                        :min="0.01"
                        :max="99999999.99"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.effectiveDate')}`" prop="effectiveDate">
                      <el-date-picker
                        v-model="form.effectiveDate"
                        :picker-options="getEffectiveDateOptions(form.expiryDate)"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        style="width: 100%"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.expiryDate')}`" prop="expiryDate">
                      <el-date-picker
                        v-model="form.expiryDate"
                        :picker-options="getExpiryDateOptions(form.effectiveDate)"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        style="width: 100%"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.purchaseUom !== form.basicUom">
                    <el-form-item :label="`${$t('PURCHASE.warrantyDays')}`" key="warrantyDays22">
                      <el-input-number
                        v-thousandSplit="{ precision: 0 }"
                        style="width: 100%"
                        v-model="form.warranty"
                        controls-position="right"
                        :precision="0"
                        :min="0"
                        :max="9999"
                        @change="inputNumberChange('warranty')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.surchargeDetails')"
                :warning="collapseWarningForSurchargeDetails"
              >
              </FormCollapseItemTitle>
              <div>
                <el-button
                  class="mb10"
                  size="mini"
                  v-if="!comDisFrom"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addServiceSurcharge"
                  >{{ $t('uiBtn.add') }}</el-button
                >
                <el-table
                  ref="serviceSurcharge"
                  border=""
                  class="mb20"
                  :data="form.serviceSurchargeList || []"
                  v-table-tab
                >
                  <el-table-column type="index" :label="$t('ui.sn')" width="60" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="expenseItemName"
                    :label="$t('system.expenseItem')"
                    header-align="center"
                    align="left"
                    min-width="240"
                    :show-overflow-tooltip="true"
                  >
                    <template slot="header" slot-scope="{ column }">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </template>
                    <template slot-scope="scope">
                      <selectExpenseItemName
                        :value="scope.row.expenseItemName"
                        :canSelectOptions="
                          getServiceSurchargeListOptions(serviceSurchargeListOptions, scope.$index)
                        "
                        :allOptions="serviceSurchargeListOptions"
                        style="width: 98%"
                        @change="productNameChange($event, scope.row)"
                        v-if="!comDisFrom"
                      />
                      <span v-else>{{ scope.row.expenseItemName }}</span>
                      <TablePropError v-if="scope.row['expenseItemNameError']" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unit"
                    :label="$t('ui.unit')"
                    header-align="center"
                    align="left"
                    min-width="160"
                    :show-overflow-tooltip="true"
                  >
                    <template slot-scope="scope">
                      <el-select
                        style="width: 98%"
                        v-model="scope.row.unit"
                        filterable
                        :title="showUomLabel(scope.row.unit)"
                        placeholder=""
                        @change="adhocEntryChangePurchaseUom(scope.row)"
                        v-if="scope.row.isCustom === '1' && !comDisFrom"
                      >
                        <el-option
                          v-for="item in allUomList"
                          :key="item"
                          :label="item"
                          :value="item"
                        >
                        </el-option>
                      </el-select>
                      <span v-else :title="showUomLabel(scope.row.unit)">{{ scope.row.unit }}</span>
                      <TablePropError v-if="scope.row['unitError']" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="unitPrice"
                    :label="$t('PURCHASE.unitPrice')"
                    header-align="center"
                    align="right"
                    min-width="200"
                    :show-overflow-tooltip="true"
                  >
                    <template slot="header" slot-scope="{ column }">
                      <span style="color: #ff4949; margin-right: 4px">*</span>{{ column.label }}
                    </template>
                    <template slot-scope="scope">
                      <el-input-number
                        v-if="!comDisFrom"
                        v-thousandSplit="{ precision: 2 }"
                        style="width: 98%"
                        v-model="scope.row.unitPrice"
                        controls-position="right"
                        :precision="2"
                        :min="-999999999999.99"
                        :max="999999999999.99"
                        @change="unitPriceChange(scope.row)"
                      />
                      <span v-else>{{ $numberStr(scope.row.unitPrice, 2) }}</span>
                      <TablePropError v-if="scope.row['unitPriceError']" />
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="$t('ui.action')"
                    key="action"
                    align="center"
                    width="120"
                    class-name="small-padding fixed-width"
                    fixed="right"
                    v-if="!comDisFrom"
                  >
                    <template slot-scope="scope">
                      <div class="flexCen">
                        <i
                          class="el-icon-delete pointer"
                          style="font-size: 20px; color: #f56c6c"
                          :title="$t('uiBtn.delete')"
                          @click="handleDelServiceSurcharge(scope.$index)"
                        ></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
                <template v-if="form.operationLogForLast">
                  <span
                    v-if="form.operationLogForLast.operatorBy"
                    class="info-item mr20"
                    :title="form.operationLogForLast.operatorBy"
                  >
                    {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
                  </span>
                  <span v-if="form.operationLogForLast.operatorTime" class="info-item">
                    {{ $t('ui.operTime') }} : {{ parseTime(form.operationLogForLast.operatorTime) }}
                  </span>
                </template>
              </FormCollapseItemTitle>
              <div class="pb20">
                <SystemOperationLogTable :tableList="form.operationLogList || []" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectPurchaseQuotationTable
      ref="selectPurchaseQuotationTable"
      :businessPartnerId="form.businessPartnerId"
      :productId="form.productId"
      @update="updatePurchaseQuotationNo"
    />
    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['1']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.ASL"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <RevisionComparisonDlg module-key="approvedSupplier" ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'
import {
  reviseApprovedSupplier,
  queryApprovedSupplierById,
  addPQDefaultMsgToASL,
  conversionCurrencyUnitPrice,
  queryCanSelectPurchaseQuotationList
} from '@/api/purchaseManagement/asl'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import selectPurchaseQuotationTable from './components/selectPurchaseQuotationTable.vue'

import { queryAllTaxForPurchase } from '@/api/system/tax'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { getSystemSetup } from '@/api/system/systemSetting'
import { queryAllUomList } from '@/api/system/uom'
import selectExpenseItemName from '@/views/purchaseManagement/purchaseQuotation/components/selectExpenseItemName'
export default {
  mixins: [pageMixin],
  dicts: ['p_approved_supplier_status'],
  components: {
    selectPurchaseQuotationTable,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    selectPortTable,
    selectWarehouseTable,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    selectExpenseItemName
  },
  data() {
    const vm = this
    const validEndDate = (rule, value, callback) => {
      let endTime = value
      if (typeof endTime === 'number') {
        endTime = new Date(endTime)
      }
      const cur = this.appointTime(Date.now(), '00:00:00')
      if (endTime && endTime - cur < 0) {
        callback(new Error(vm.$t('PURCHASE.moreThan')))
      } else {
        callback()
      }
    }
    return {
      activeNames: ['1', '2', '3', '4'],
      timeId: '',
      submitLoading: false,
      form: {
        salesPriceProductList: []
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForSurchargeDetails: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseQuotationNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        receiveAddressName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        contactPersonId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        taxRate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        currencyId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        paymentTermName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseUom: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseUomCoefficient: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        unitPrice: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        moq: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        leadTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        effectiveDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        expiryDate: [
          {
            required: false,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          },
          {
            validator: validEndDate,
            trigger: ['blur']
          }
        ]
      },
      purchaseQuotationOptions: [],
      purchaseQuotationOptionsLoading: false,
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      currencyOptions: [],
      currencyOptionsLoading: false,
      taxRateOptions: [],
      taxRateOptionsLoading: false,
      allUomList: [],
      serviceSurchargeListOptions: [],
      paymentTermOptions: [],
      paymentTermOptionsLoading: false,

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      /* 版本比对高亮 */
      basicUpdateProps: [],
      bpHistoryVersionList: []
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
    },
    isView: {
      type: [Boolean],
      default: false
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        if (this.rowId) {
          this.handleUpdate()
        }
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    comIncotermReq() {
      if (this.form.dropShipping === '1') {
        return false
      }
      if (this.form.country === this.legalEntityInfo.country) {
        return false
      }
      return true
    },
    comIncotermOptions() {
      if (this.form.country === this.legalEntityInfo.country) {
        return this.incotermOptions.filter((item) => item.incotermAbbreviation === 'EXW')
      }
      return this.incotermOptions
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:asl:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    },
    modifyHighlight() {
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleUpdate() {
      this.reset()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.getSystemSetup()
      this.queryAllUomList()
      const rowId = this.rowId
      queryApprovedSupplierById({ approvedSupplierMainId: rowId }).then((res) => {
        const data = res.data || {}
        this.form = data
        // const registeredAddress =
        //   data.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
        // this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        // this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
        this.queryAllTaxForPurchase()
        this.queryPurchaseQuotationOptions()
        this.queryCanSelectPortList()
        this.queryPaymentTermListByPaymentTermPurpose()
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
        }, 300)
      })
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        this.serviceSurchargeListOptions = data.serviceSurchargeList || []
      })
    },
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    reset() {
      this.form = {
        businessPartnerId: undefined,
        businessPartnerName: undefined,
        businessPartnerNo: undefined,
        currencyId: undefined,
        currencyCode: undefined,
        currency: undefined,
        receiveAddressName: undefined,
        receiveAddressId: undefined,
        taxId: undefined,
        taxRate: undefined,
        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        contactPersonId: undefined,
        contactPersonName: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        purchaseUom: undefined,
        purchaseUomCoefficient: undefined,
        unitPrice: undefined,
        moq: undefined,
        leadTime: undefined,
        warranty: undefined,
        effectiveDate: undefined,
        expiryDate: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForSurchargeDetails = false
      this.activeNames = ['1', '2', '3', '4']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
      this.resetForm('form2')
    },
    // 取消按钮
    back(type) {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/asl' })
      // this.$emit('back', type)
    },
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
    },

    queryPurchaseQuotationOptions() {
      this.purchaseQuotationOptions = []
      const timer = Date.now()
      this.queryTimer = timer
      this.purchaseQuotationOptionsLoading = true
      queryCanSelectPurchaseQuotationList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.ASL,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          if (this.queryTimer !== timer) return
          this.purchaseQuotationOptionsLoading = false
          const rows = res.rows || []
          rows.forEach((x) => {
            x.PQShowStr = `${x.purchaseQuotationNo}, ${x.businessPartnerName}`
          })
          this.purchaseQuotationOptions = rows
        })
        .catch(() => {
          this.purchaseQuotationOptionsLoading = false
        })
    },
    openPurchaseQuotationTable() {
      this.$refs.selectPurchaseQuotationTable.handleOpen()
    },
    updatePurchaseQuotationNo(row) {
      if (!row.purchaseQuotationId) {
        this.purchaseQuotationNoClear()
        return
      }
      this.$set(this.form, 'purchaseQuotationId', undefined)
      this.$set(this.form, 'purchaseQuotationNo', row.purchaseQuotationNo)
      this.warehouseClear()
      this.receivePortClear()
      this.currencyClear()
      this.incotermIdChange({})
      this.contactPersonClear()
      this.paymentTermChange({})
      this.$set(this.form, 'taxId', undefined)
      this.$set(this.form, 'taxNo', undefined)
      this.$set(this.form, 'taxRate', undefined)
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList(row.commonFileList || [])

      addPQDefaultMsgToASL({
        purchaseQuotationId: row.purchaseQuotationId
      }).then((res) => {
        const dataInfo = res.data || {}
        this.$set(this.form, 'purchaseQuotationNo', dataInfo.purchaseQuotationNo)
        this.$set(this.form, 'purchaseQuotationId', dataInfo.purchaseQuotationId)
        this.$set(this.form, 'currencyId', dataInfo.currencyId)
        this.$set(this.form, 'currencyCode', dataInfo.currencyCode)
        this.$set(this.form, 'currency', dataInfo.currency)
        this.$set(this.form, 'dropShipping', dataInfo.dropShipping)

        /* const ContactPersonList = this.form.bpBusinessContactPersonList || []
        if (ContactPersonList.length > 0) {
          const defaultContact = ContactPersonList.find(
            (item) => item.contactPersonId === dataInfo.requestedId
          )
          if (defaultContact) {
            this.contactPersonChange(defaultContact)
          }
        } */
        this.contactPersonChange(dataInfo)

        if (dataInfo.paymentTermId && dataInfo.paymentTerm) {
          this.paymentTermChange(dataInfo.paymentTerm)
        }
        this.incotermIdChange(dataInfo)

        if (dataInfo.incotermAddressType === '1') {
          this.$set(this.form, 'addressForPort', dataInfo.addressForPort)
          this.$set(this.form, 'receivePortName', dataInfo.receivePortName)
          this.$set(this.form, 'receivePortId', dataInfo.receivePortId)
        }

        this.$set(this.form, 'taxId', dataInfo.taxId)
        this.$set(this.form, 'taxNo', dataInfo.taxNo)
        this.$set(this.form, 'taxRate', dataInfo.taxRate)

        const list = dataInfo.detailList || []
        const findItem = list.find((i) => i.productId === this.form.productId)
        if (findItem) {
          this.$set(this.form, 'purchaseQuotationDetailId', findItem.purchaseQuotationDetailId)
          this.$set(this.form, 'externalPartNo', findItem.externalPartNo)
          this.$set(this.form, 'purchaseUom', findItem.purchaseUom)
          this.$set(this.form, 'uomDataList', findItem.uomDataList)
          this.$set(this.form, 'purchaseUomCoefficient', findItem.purchaseUomCoefficient)
          this.$set(this.form, 'basicUom', findItem.basicUom)
          this.$set(this.form, 'unitPrice', findItem.unitPrice)
          this.$set(this.form, 'moq', findItem.moq)
          this.$set(this.form, 'leadTime', findItem.leadTime)
          this.$set(this.form, 'warranty', findItem.warranty)
        }
      })
    },
    purchaseQuotationNoClear() {
      this.$set(this.form, 'purchaseQuotationNo', undefined)
      this.$set(this.form, 'purchaseQuotationId', undefined)
      this.currencyClear()
      this.incotermIdChange({})
      this.receivePortClear()
      this.contactPersonClear()
      this.paymentTermChange({})
      this.warehouseClear()
      this.$set(this.form, 'taxId', undefined)
      this.$set(this.form, 'taxNo', undefined)
      this.$set(this.form, 'taxRate', undefined)
      this.$set(this.form, 'salesPriceProductList', [])
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
    },

    queryIncotermList() {
      this.incotermOptionsLoading = true
      queryIncotermList({})
        .then((res) => {
          this.incotermOptions = res.data || []
          this.incotermOptionsLoading = false
        })
        .catch(() => {
          this.incotermOptionsLoading = false
        })
    },
    incotermIdChange(item) {
      // const oldType = this.form.incotermAddressType
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      // if (oldType !== item.incotermAddressType) {
      this.receivePortClear()
      // }
      this.$nextTick(() => {
        this.$refs.form1.clearValidate('receivePortName')
      })
      this.queryCanSelectPortList()
    },

    dropShippingChange() {
      this.warehouseClear()
    },
    queryCanSelectPortList() {
      let firstCountryId
      let firstCountry
      let firstCity
      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountry = this.form.registeredAddressCountry
        firstCity = this.form.registeredAddressCity
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.form.receiveAddressCountryId
        firstCountry = this.form.receiveAddressCountry
        firstCity = this.form.receiveAddressCity
      }
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 300,
        firstCountryId,
        firstCountry,
        firstCity
      }).then((res) => {
        this.portOptions = res.rows || []
      })
    },
    openReceivePortTable() {
      if (this.form.incotermAddressType === '1') {
        let firstCountryId
        let firstCountry
        let firstCity
        if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
          firstCountry = this.form.registeredAddressCountry
          firstCity = this.form.registeredAddressCity
        }
        if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
          firstCountryId = this.form.receiveAddressCountryId
          firstCountry = this.form.receiveAddressCountry
          firstCity = this.form.receiveAddressCity
        }
        this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
      }
    },
    openReceiveAddressTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
    },
    updatePort(row) {
      const { portName, portId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      if (!portId) return
      if (['FOB', 'FAS'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.form.registeredAddressCountry !== country &&
          this.form.registeredAddressCountry.indexOf(country) === -1
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForFOBOrFAS2')
              .replace('$1', this.form.country)
              .replace('$2', this.form.incotermAbbreviation),
            '',
            {
              confirmButtonText: this.$t('PURCHASE.gotIt'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            }
          )
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
      if (['CIF', 'CFR'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          (this.form.receiveAddressCountry || this.form.country) &&
          (this.form.receiveAddressCountry || this.form.country) !== country
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForCIFOrCFR').replace(
              '$1',
              this.form.incotermAbbreviation
            ),
            '',
            {
              confirmButtonText: this.$t('PURCHASE.gotIt'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            }
          )
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId, warehouseType } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseType', warehouseType)
      /* const detailList = this.$refs.ProductTable.getList()
      const noCanSelectProductIdList = row.noCanSelectProductIdList || []
      const newDetailList = detailList.filter((item) => {
        return !noCanSelectProductIdList.includes(item.productId)
      })
      this.initPoDetailList = JSON.parse(JSON.stringify(newDetailList)) */
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseType', undefined)
    },

    contactPersonChange(row) {
      this.$set(this.form, 'businessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'contactPersonId', row.contactPersonId)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNum', row.mobileNum)
      this.$set(this.form, 'mobileCode', row.mobileCode)
      this.$set(this.form, 'mobilePhone', row.mobilePhone)
      this.$set(this.form, 'email', row.email)
    },
    contactPersonClear() {
      this.$set(this.form, 'businessContactPersonId', undefined)
      this.$set(this.form, 'contactPersonId', undefined)
      this.$set(this.form, 'contactPersonName', undefined)
      this.$set(this.form, 'mobileNum', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'email', undefined)
    },

    queryAllTaxForPurchase() {
      if (this.form.businessPartnerId) {
        this.taxRateOptionsLoading = true
        queryAllTaxForPurchase({ countryId: this.form.countryId })
          .then((res) => {
            this.taxRateOptionsLoading = false
            const data = res.data || []
            data.forEach((item) => {
              item.taxRateStr = this.$numberStr(item.taxRate, 1)
            })
            this.taxRateOptions = data
          })
          .catch(() => {
            this.taxRateOptionsLoading = false
          })
      } else {
        this.taxRateOptions = []
      }
    },
    taxRateChange(row) {
      this.$set(this.form, 'taxId', row.taxId)
      this.$set(this.form, 'taxNo', row.taxNo)
      this.$set(this.form, 'taxRate', row.taxRate)
    },
    queryCurrencyListBySelect() {
      this.currencyOptionsLoading = true
      queryCurrencyListBySelect()
        .then((res) => {
          this.currencyOptionsLoading = false
          const list = res.data || []
          this.currencyOptions = list.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
        })
        .catch(() => {
          this.currencyOptionsLoading = false
        })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)
      conversionCurrencyUnitPrice({
        purchaseQuotationId: this.form.purchaseQuotationId,
        currencyId: row.id,
        currencyCode: row.currencyCode,
        purchaseQuotationDetailList: [{ productId: this.form.productId }]
      }).then((res) => {
        const data = res.data || {}
        const list = data.purchaseQuotationDetailList || []
        const row = list[0] || {}
        this.$set(this.form, 'unitPrice', row.unitPrice)
      })
    },
    currencyClear() {
      this.$set(this.form, 'currencyCode', undefined)
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      // this.addLastPurchaseQuotationMsg()
    },

    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '1',
        menuPerms: this.menuKey.ASL,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermOptions = res.data || []
        })
        .catch(() => {
          this.paymentTermOptionsLoading = false
        })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.$set(this.form, 'paymentTermId', item.paymentTermId)
      this.$set(this.form, 'paymentTermName', item.paymentTermName)
    },
    openEditPaymentTermDlg() {
      this.$refs.editPaymentTernDlg.handleUpdate(this.form.paymentTerm)
    },
    paymentTermEditChange(item) {
      this.$set(this.form, 'paymentTerm', item)
    },

    purchaseUomChange() {
      const selectItem = this.form.uomDataList.find(
        (item) => item.uomName === this.form.purchaseUom
      )
      this.$set(this.form, 'purchaseUomCoefficient', selectItem.uomCoefficient)
    },

    getEffectiveDateOptions(expiryDate) {
      const options = {
        disabledDate(time) {
          if (expiryDate) {
            return time.getTime() > expiryDate
          }
        }
      }
      return options
    },
    getExpiryDateOptions(effectiveDate) {
      const options = {
        disabledDate(time) {
          if (time.getTime() < Date.now() - 8.64e7) {
            return true
          }
          if (effectiveDate) {
            return time.getTime() < effectiveDate
          }
        }
      }
      return options
    },
    getServiceSurchargeListOptions(options, index) {
      const filterList = []
      const list = this.form.serviceSurchargeList || []
      list.forEach((item, i) => {
        if (index !== i && item.expenseItemName) {
          filterList.push(item.expenseItemName)
        }
      })
      return options.filter((item) => !filterList.includes(item.expenseItemName))
    },
    addServiceSurcharge() {
      const list = this.form.serviceSurchargeList || []
      list.push({
        // id: Date.now(),
        expenseItemName: undefined,
        unit: undefined,
        qtyLimit: undefined,
        includeDecimal: '0'
      })
      this.$set(this.form, 'serviceSurchargeList', list)
    },
    handleDelServiceSurcharge(index) {
      const list = this.form.serviceSurchargeList || []
      list.splice(index, 1)
    },
    productNameChange(data, row) {
      if (data.expenseItemName === row.expenseItemName) return
      this.$set(row, 'expenseItemName', data.expenseItemName)
      this.$set(row, 'includeDecimal', data.includeDecimal || '1')
      this.$set(row, 'decimalNum', data.includeDecimal === '1' ? 3 : 0)
      if (!(row.isCustom === '1' && data.isCustom === '1')) {
        this.$set(row, 'unit', data.unit)
      }
      this.$set(row, 'qtyLimit', data.qtyLimit)
      this.$set(row, 'isCustom', data.isCustom)
      this.$set(row, 'expenseItemNameError', false)
      this.$set(row, 'unitError', false)
    },
    adhocEntryChangePurchaseUom(row) {
      this.$set(row, 'unitError', false)
      this.$set(row, 'ROW-ERROR', false)
    },
    unitPriceChange(row) {
      this.$set(row, 'unitPriceError', false)
    },

    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    errorMessage(code) {
      const detailList = this.form.serviceSurchargeList || []
      detailList.forEach((item) => {
        if (!this.$resultOfBoolean(item[code])) {
          this.$set(item, code + 'Error', true)
        }
      })
    },

    async submitForm() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForProductInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.productInfo'))
        )
        return
      }

      if (valid1 && valid2) {
        const detailList = this.form.serviceSurchargeList || []
        const expenseItemNameReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.expenseItemName)
        })
        if (expenseItemNameReq) {
          this.errorMessage('expenseItemName')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('system.expenseItem'))
          )
          return
        }

        let expenseItemNameExistsItem = false
        const nameCount = {}
        detailList.find((child) => {
          if (!nameCount[child.expenseItemName]) {
            nameCount[child.expenseItemName] = '1'
            return false
          } else {
            expenseItemNameExistsItem = child.expenseItemName
            return true
          }
        })
        if (expenseItemNameExistsItem) {
          this.$modal.msgError(
            this.$t('ui.alreadyExists').replace('$1', `[${expenseItemNameExistsItem}]`)
          )
          return
        }

        const unitReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.unit)
        })
        if (unitReq) {
          this.errorMessage('unit')
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.unit')))
          return
        }

        const unitPriceReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
        if (unitPriceReq) {
          this.errorMessage('unitPrice')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
          )
          return
        }

        let param = { ...this.form }
        param.commonFileList = myFileIds
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        const confirmMsg = this.$t('ui.submitPageConfirm')
        const successMsg = this.$t('ui.submitPageSuccess')
        const submitFn = reviseApprovedSupplier

        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return submitFn(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
            this.submitLoading = false
            this.back()
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.unit {
  flex-shrink: 0;
  min-width: 30px;
  padding: 0 8px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
</style>
