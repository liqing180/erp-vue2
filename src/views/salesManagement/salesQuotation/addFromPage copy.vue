<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" :loading="submitLoading" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
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
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.salesQuotationType')}`"
                      prop="salesQuotationType"
                    >
                      <el-select
                        v-model="form.salesQuotationType"
                        placeholder=""
                        @change="salesQuotationTypeChange"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in salesQuotationTypeList"
                          :key="item.dictValue"
                          :label="item.dictLabel"
                          :value="item.dictValue"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.sales_quotation_status,
                            form.salesQuotationStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesQuotationNo')}`">
                      <el-input v-model="form.salesQuotationNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                      <SelectInput
                        :disabled="!form.salesQuotationType"
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerCode')}`">
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType !== 'Project'">
                    <el-form-item :label="`${$t('SALES.salesInquiryNo')}`">
                      <el-input v-model="form.salesInquiryNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else>
                    <el-form-item
                      :label="`${$t('SALES.customerQuestionnaire')}`"
                      prop="customerQuestionnaireId"
                      :rules="[
                        {
                          required: form.salesQuotationType === 'Project',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId"
                            :id="form.customerQuestionnaireId"
                            :label="form.customerQuestionnaireNo"
                            :title="form.customerQuestionnaireNo"
                            idKey="customerQuestionnaireId"
                            labelKey="customerQuestionnaireNo"
                            :options="customerQuestionnaireOptions"
                            @change="customerQuestionnaireChange"
                          />
                        </div>
                        <div class="con-right" v-if="form.customerQuestionnaireId">
                          <svg-icon
                            @click="handleView"
                            icon-class="board-05"
                            class="primary-pointer"
                            style="height: 28px; width: 28px"
                          />
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <template>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                        <CommonSelect
                          :id="form.currencyCode"
                          :label="form.currency"
                          :title="form.currency"
                          idKey="currencyCode"
                          labelKey="currency"
                          :filterable="true"
                          :clearable="false"
                          :options="currencyOptions || []"
                          @change="currencyChange"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIdList">
                        <ToolTipShowList
                          :list="form.paymentMethodNameList || []"
                          :popoverTitle="$t('ui.paymentMethod')"
                        >
                          <CommonMultipleSelect
                            :ids="form.paymentMethodIdList"
                            :labels="form.paymentMethodNameList"
                            :showTitle="false"
                            idKey="value"
                            labelKey="label"
                            :options="dict.type.business_partner_payment_method"
                            @change="paymentMethodChange"
                          />
                        </ToolTipShowList>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.ourRef')}`">
                        <el-input
                          v-model="form.ourRef"
                          :title="form.ourRef"
                          :maxlength="200"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.department')}`" prop="departmentId">
                      <CommonSelect
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        @change="departmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.taxRate')}`" prop="taxRate">
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.validityDays')}`" prop="validityForDay">
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          :controls="false"
                          style="width: 30%"
                          @change="validityChange('validityForDay')"
                        />
                        <span class="mr5 ml5">{{ $t('SALES.day') }}</span>
                        <el-date-picker
                          @change="validityChange('validity')"
                          v-model="form.validity"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '70%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Project'">
                    <el-form-item
                      :label="`${$t('SALES.scheduledDeliveryDate')}`"
                      prop="deliveryDateForDay"
                      :key="form.salesQuotationType"
                    >
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="form.salesQuotationType !== 'Project'"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                        <span class="mr5 ml5">{{ $t('SALES.day') }}</span>
                        <el-date-picker
                          v-model="form.deliveryDate"
                          :picker-options="deliveryDatePickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          style="width: 60%"
                          class="fs-0"
                          placeholder=""
                          @change="deliveryDateChange('deliveryDate')"
                          clearable
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else>
                    <el-form-item
                      :label="`${$t('SALES.scheduledDeliveryDate')}`"
                      prop="deliveryDateForDay"
                    >
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="form.salesQuotationType !== 'Project'"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                        <span v-if="form.salesQuotationType === 'Project'" class="mr5 ml5">{{
                          $t('SALES.day')
                        }}</span>
                        <el-date-picker
                          v-if="form.salesQuotationType === 'Project'"
                          v-model="form.deliveryDate"
                          :picker-options="deliveryDatePickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          style="width: 60%"
                          class="fs-0"
                          placeholder=""
                          @change="deliveryDateChange('deliveryDate')"
                          clearable
                        ></el-date-picker>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="form.salesQuotationType === 'Project' && false">
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.productInfo')}`" prop="productMsgTypeList">
                      <el-checkbox-group v-model="form.productMsgTypeList" style="height: 36px">
                        <el-checkbox label="1">{{ $t('SALES.materialList') }}</el-checkbox>
                        <el-checkbox label="2">{{ $t('SALES.projectTask') }}</el-checkbox>
                        <el-checkbox label="3">{{ $t('SALES.projectCost') }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.salesQuotationType !== 'Project'">
                    <el-form-item
                      :label="`${$t('SALES.customerQuestionnaire')}`"
                      prop="customerQuestionnaireId"
                      :rules="[
                        {
                          required: form.salesQuotationType === 'Project',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId"
                            :id="form.customerQuestionnaireId"
                            :label="form.customerQuestionnaireNo"
                            :title="form.customerQuestionnaireNo"
                            idKey="customerQuestionnaireId"
                            labelKey="customerQuestionnaireNo"
                            :options="customerQuestionnaireOptions"
                            @change="customerQuestionnaireChange"
                          />
                        </div>
                        <div class="con-right" v-if="form.customerQuestionnaireId">
                          <svg-icon
                            @click="handleView"
                            icon-class="board-05"
                            class="primary-pointer"
                            style="height: 28px; width: 28px"
                          />
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.salesQuotationType === 'Consignment'" :span="8">
                    <el-form-item
                      :label="`${$t('SALES.consignmentStart')}`"
                      prop="consignmentStartTime"
                    >
                      <el-date-picker
                        v-model="form.consignmentStartTime"
                        :picker-options="consignmentStartTimePickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        @change="consignmentStartTimeChange"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.salesQuotationType === 'Consignment'" :span="8">
                    <el-form-item
                      :label="`${$t('SALES.consignmentEnd')}`"
                      prop="consignmentEndTime"
                    >
                      <el-date-picker
                        v-model="form.consignmentEndTime"
                        :picker-options="consignmentEndTimePickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        :disabled="!form.consignmentStartTime"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('SALES.paymentTerm')" prop="paymentTermName">
                      <MyInput
                        type="textarea"
                        :disabled="!form.businessPartnerId"
                        v-model="form.paymentTermName"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="1000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.basicRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.automatedEmail')}`">
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="isSystemDocking !== '1'">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row v-if="form.salesQuotationType !== 'Service'">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.warehouseName')}`" prop="warehouseName">
                      <ToolTipShowObj
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.warehouseName"
                        :rows="warehouseRows"
                      >
                        <SelectInput
                          clearable
                          :disabled="!form.salesQuotationType || !form.businessPartnerId"
                          :value="form.warehouseName"
                          @click="openWarehouseTable"
                          @clear="warehouseClear"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.incoterm')}`" prop="incotermId">
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        @change="incotermIdChange"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.address')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required: form.incotermAddressType !== '0',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-input
                        v-if="form.incotermAddressType === '0'"
                        :value="$t('SALES.selfCollect')"
                        disabled
                      ></el-input>
                      <ToolTipShowObj
                        :mData="form.receiveAddressForPort || {}"
                        :showStr="form.district ? '' : form.receiveAddressName"
                        :rows="shipToAddressRows"
                        v-else-if="form.incotermAddressType === '1'"
                      >
                        <SelectInput
                          :value="form.receiveAddressName"
                          :title="form.district ? form.receiveAddressName : ''"
                          @clear="receiveAddressClear"
                          clearable
                          @click="openReceiveAddressTable"
                          :disabled="!form.incotermId"
                          class="form-wd"
                        />
                      </ToolTipShowObj>
                      <div class="input-switch-box" v-else>
                        <div class="con-left">
                          <SelectInput
                            :value="form.receiveAddressName"
                            :title="form.receiveAddressName"
                            @clear="receiveAddressClear(true)"
                            clearable
                            @click="openReceiveAddressTable"
                            :disabled="
                              !form.incotermId ||
                              !form.businessPartnerId ||
                              form.incotermAddressType === '0'
                            "
                            class="form-wd"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="form.businessPartnerId && form.incotermAddressType === '2'"
                        >
                          <i
                            class="el-icon-edit primary"
                            style="font-size: 20px"
                            @click="openAddBPAddressDlg"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Service'">
                    <el-form-item
                      :label="`${$t('ui.address')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required: true,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <SelectInput
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        @clear="receiveAddressClear"
                        clearable
                        @click="openReceiveAddressTable"
                        :disabled="!form.businessPartnerId"
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.salesQuotationType === 'Service' ? 8 : 16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.contactPerson')}`"
                      prop="bpContactPersonName"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId"
                            :id="form.bpContactPersonId"
                            :label="form.bpContactPersonName"
                            :title="form.bpContactPersonName"
                            idKey="contactPersonId"
                            labelKey="contactPersonName"
                            :options="form.bpBusinessContactPersonList || []"
                            @change="contactPersonChange"
                          />
                        </div>
                        <div class="con-right" v-if="form.businessPartnerId">
                          <i
                            class="el-icon-edit primary"
                            style="font-size: 20px"
                            @click="openAddBPContactPersonDlg"
                          ></i>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-if="isSystemDocking === '1'">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.projectInfo')"
                :warning="collapseWarningForProjectInfo"
              >
              </FormCollapseItemTitle>
              <projectInfo ref="projectInfo" :formData="form" />
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  :salesQuotationType="form.salesQuotationType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  @deliveryDateForDayChange="deliveryDateChange('deliveryDateForDay')"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectCustomerTable
      ref="selectCustomerTable"
      :salesQuotationType="form.salesQuotationType"
      @update="updateSupplier"
    />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="updateAddress"
    />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :salesQuotationType="form.salesQuotationType"
      :businessPartnerId="form.businessPartnerId"
      @update="updateWarehouse"
    />
    <addBPAddressDlg ref="addBPAddressDlg" @update="addBPAddress" />
    <addBPContactPersonDlg ref="addBPContactPersonDlg" @update="addBPContactPerson" />

    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />
  </FormPageLayout>
</template>

<script>
import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAllTaxCodeByBusinessPartnerId } from '@/api/system/tax'
import { getToken } from '@/utils/auth'
import {
  saveSalesQuotation,
  saveDraftSalesQuotation,
  preview,
  getBPLastPaymentTermName,
  conversionCurrencyUnitPrice
} from '@/api/salesManagement/salesQuotation'
import { queryBPCustomerQuestionnaireListNoPage } from '@/api/salesManagement/salesInquiry'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'

import { getSystemSetup } from '@/api/system/systemSetting'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/businessPartner/lang/index'

import selectCustomerTable from './components/selectCustomerTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'
import projectInfo from './components/projectInfo.vue'
import addBPAddressDlg from '@/views/salesManagement/salesInquiry/components/addBPAddressDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'

import selectWarehouseTable from './components/selectWarehouseTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
export default {
  mixins: [pageMixin],
  dicts: ['sales_quotation_type', 'sales_quotation_status', 'business_partner_payment_method'],
  components: {
    selectCustomerTable,
    selectPurchasePersonTable,
    selectPortTable,
    payToAddressDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    selectWarehouseTable,
    ProductInfo,
    previewQuestionnaireTemplateDlg,
    projectInfo
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        projectCostDetailList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForProjectInfo: false,
      rules: {
        salesQuotationType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        departmentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        salesPersonBy: [
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
        taxRate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        paymentMethodIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        deliveryDateForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        paymentTermName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],

        productMsgTypeList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.uom')),
            trigger: ['blur', 'change']
          }
        ],

        incotermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpBusinessAddressId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        consignmentStartTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        consignmentEndTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      deliveryDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
          // return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      consignmentStartTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      consignmentEndTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      deptOptions: [],
      customerQuestionnaireOptions: [],
      currencyOptions: [],
      incotermOptions: [],
      taxRateOptions: [],
      /* 表格部分 */
      initCommonFileList: [],
      shipToAddressRows: [
        {
          label: this.$t('SALES.port'),
          showLabel: 'portName'
        },
        {
          label: this.$t('SALES.code'),
          showLabel: 'portCode'
        },
        {
          label: this.$t('SALES.latLong'),
          showLabel: 'latLong'
        },
        {
          label: this.$t('SALES.telephone'),
          showLabel: 'telephone'
        },
        {
          label: this.$t('SALES.website'),
          showLabel: 'website'
        },
        {
          label: this.$t('SALES.country'),
          showLabel: 'country'
        }
      ],
      warehouseRows: [
        {
          label: this.$t('INVENTORY.warehouseCode'),
          showLabel: 'warehouseCode'
        },
        {
          label: this.$t('INVENTORY.warehouseName'),
          showLabel: 'warehouseName'
        },
        {
          label: this.$t('INVENTORY.warehouseType'),
          showLabel: 'warehouseTypeShowStr'
        },
        {
          label: this.$t('INVENTORY.label'),
          showLabel: 'label'
        },
        {
          label: this.$t('organization.address1'),
          showLabel: 'address1'
        },
        {
          label: this.$t('organization.address2'),
          showLabel: 'address2'
        },
        {
          label: this.$t('organization.city'),
          showLabel: 'city'
        },
        {
          label: this.$t('organization.province'),
          showLabel: 'province'
        },
        {
          label: this.$t('organization.postalCode'),
          showLabel: 'postalCode'
        },
        {
          label: this.$t('organization.country'),
          showLabel: 'country'
        }
      ],
      bpAddressRows: [
        {
          label: this.$t('INVENTORY.label'),
          showLabel: 'label'
        },
        {
          label: this.$t('organization.address1'),
          showLabel: 'address1'
        },
        {
          label: this.$t('organization.address2'),
          showLabel: 'address2'
        },
        {
          label: this.$t('organization.city'),
          showLabel: 'city'
        },
        {
          label: this.$t('organization.province'),
          showLabel: 'province'
        },
        {
          label: this.$t('organization.postalCode'),
          showLabel: 'postalCode'
        },
        {
          label: this.$t('organization.country'),
          showLabel: 'country'
        }
      ],
      salesQuotationTypeList: []
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.getDict()
        this.handleAdd()
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
    // 法人对接
    isSystemDocking() {
      return this.$store.state.user.legalEntityInfo.isSystemDocking
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {},
  methods: {
    getDict() {
      this.MyDictDataClass.getDictFn('sales_quotation_type').then((res) => {
        this.salesQuotationTypeList = (res || []).filter(
          (x) => ['Trading', 'Project', 'MixDesign'].indexOf(x.dictValue) !== -1
        )
        this.form.salesQuotationType = 'Trading'
      })
    },
    consignmentStartTimeChange() {
      const { consignmentStartTime, consignmentEndTime } = this.form
      this.consignmentEndTimePickerOptions = {
        disabledDate(time) {
          const currentTime = Date.now()
          let maxTime = currentTime
          if (consignmentStartTime) {
            maxTime =
              currentTime > consignmentStartTime + 1 * 24 * 60 * 60 * 1000
                ? currentTime
                : consignmentStartTime + 1 * 24 * 60 * 60 * 1000
          }
          return time.getTime() < maxTime
        }
      }
      if (consignmentEndTime && consignmentEndTime <= consignmentStartTime) {
        this.$set(this.form, 'consignmentEndTime', undefined)
      }
    },
    handleAdd() {
      this.reset()
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.getSystemSetup()
    },
    customerQuestionnaireChange(item) {
      this.$set(this.form, 'customerQuestionnaireId', item.customerQuestionnaireId)
      this.$set(this.form, 'customerQuestionnaireNo', item.customerQuestionnaireNo)
    },
    customerQuestionnaireClear() {
      this.$set(this.form, 'customerQuestionnaireId', undefined)
      this.$set(this.form, 'customerQuestionnaireNo', undefined)
      this.$nextTick(() => {
        this.$refs.form1.clearValidate('customerQuestionnaireId')
      })
    },
    queryCustomerQuestionnaire() {
      queryBPCustomerQuestionnaireListNoPage({
        businessPartnerId: this.form.businessPartnerId
      }).then((res) => {
        this.customerQuestionnaireOptions = res.data || []
        if (this.customerQuestionnaireOptions.length > 0) {
          const topRow = this.customerQuestionnaireOptions[0]
          this.$set(this.form, 'customerQuestionnaireId', topRow.customerQuestionnaireId)
          this.$set(this.form, 'customerQuestionnaireNo', topRow.customerQuestionnaireNo)
        }
      })
    },
    handleView() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const { quotationValidityDays } = res.data
        let date = +new Date()
        const ValidityDays = quotationValidityDays || 30
        if (ValidityDays) {
          date = date + ValidityDays * 24 * 60 * 60 * 1000
        }
        this.$set(this.form, 'validityForDay', ValidityDays)
        this.$set(this.form, 'validity', date)
      })
    },
    reset() {
      this.form = {
        /* 基础信息 */
        salesQuotationType: '',
        // salesQuotationType: 'Trading',
        documentType: 'SelfCreated',
        salesQuotationNo: undefined,
        businessPartnerName: undefined,
        salesQuotationStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        salesPersonBy: this.$store.state.user.nickName,
        salesPersonId: this.$store.state.user.userId,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validityForDay: undefined,
        validity: undefined,
        deliveryDateForDay: undefined,
        deliveryDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        basicRemarks: undefined,
        automatedEmail: '1',
        productMsgTypeList: ['1', '2', '3'],
        dropShipping: '0',

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: '20',
        incotermName: 'EXW- Self Collection (Place)',
        incotermAddressType: '0',
        incotermAbbreviation: 'EXW',
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        projectCostDetailList: [],
        tableLoading: false,
        consignmentStartTime: undefined,
        consignmentEndTime: undefined,
        projectTemplateContentList: [],

        projectId: undefined,
        projectCode: undefined,
        zoneName: undefined,
        zoneId: undefined,
        receiveAddress: undefined,
        projectContactPersonNames: undefined,
        specialRequirement: undefined,
        cubeSpacingNum: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForProjectInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']

      this.$set(this.form, 'currency', this.legalEntityInfo.currency)
      this.$set(this.form, 'currencyId', this.legalEntityInfo.currencyId)
      this.$set(this.form, 'currencyCode', this.legalEntityInfo.currencyCode)

      this.resetForm('form1')
      this.resetForm('form2')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1 && this.$refs.form1.validateField(code)
    },
    salesQuotationTypeChange() {
      this.tableTimer = Date.now()
      this.$set(this.form, 'tableLoading', false)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationProjectList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
      this.warehouseClear()
      this.incotermIdChange({})
      this.$nextTick(() => {
        this.$refs.form1 && this.$refs.form1.clearValidate('customerQuestionnaireId')
      })
      if (this.form.salesQuotationType === 'Consignment') {
        this.$set(this.form, 'totalDiscount', 0)
      } else if (this.form.salesQuotationType === 'Project') {
        this.$set(this.form, 'salesQuotationProjectList', [
          {
            id: +new Date()
          }
        ])
      }
    },
    openSupplierTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.tableTimer = Date.now()
      this.$set(this.form, 'tableLoading', false)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
      this.customerQuestionnaireClear()
      this.currencyClear()
      this.paymentMethodChange([], [])
      if (this.form.incotermAddressType === '2' || this.form.salesQuotationType === 'Service') {
        this.receiveAddressClear()
      }
      if (this.form.salesQuotationType === 'Consignment') {
        this.warehouseClear()
      }
      this.contactPersonClear()
      // this.deliveryAddressClear()
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      const account = row.bpBusinessAccountCustomer || {}

      if (!this.form.currencyId) {
        this.$set(this.form, 'currency', this.legalEntityInfo.currency)
        this.$set(this.form, 'currencyId', this.legalEntityInfo.currencyId)
        this.$set(this.form, 'currencyCode', this.legalEntityInfo.currencyCode)
      }

      if (this.form.salesQuotationType !== 'Service') {
        this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
        this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      }
      this.customerQuestionnaireClear()
      this.queryCustomerQuestionnaire()
      if (this.form.incotermAddressType === '2') {
        this.receiveAddressClear()
      }
      if (this.form.salesQuotationType === 'Consignment') {
        this.warehouseClear()
      }
      this.contactPersonClear()
      this.taxRateChange({})
      this.queryAllTaxCodeByBusinessPartnerId()

      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      this.tableTimer = Date.now()
      this.$set(this.form, 'tableLoading', false)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
      this.getBPLastPaymentTermName()
    },
    queryUserDepartment() {
      queryUserDepartment({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
          }
        })
      })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.salesPersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
    },

    queryAllTaxCodeByBusinessPartnerId() {
      if (this.form.businessPartnerId) {
        queryAllTaxCodeByBusinessPartnerId(this.form.businessPartnerId).then((res) => {
          const data = res.data || []
          data.forEach((item) => {
            item.taxRateStr = this.$numberStr(item.taxRate, 1)
          })
          this.taxRateOptions = data
          const defaultRow = data.find((item) => item.isDefault === '1')
          if (defaultRow) {
            this.taxRateChange(defaultRow)
          }
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

    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'salesPersonBy', undefined)
      this.$set(this.form, 'salesPersonId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'salesPersonBy', nickName)
      this.$set(this.form, 'salesPersonId', userId)
    },
    queryCurrencyListBySelect() {
      queryCurrencyListBySelect().then((res) => {
        const list = res.data || []
        this.currencyOptions = list.map((item) => {
          item.label = `${item.currencyCode} (${item.currencyDesc})`
          return item
        })
      })
    },
    currencyChange(row) {
      const oldCurrencyId = this.form.currencyId
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      if (
        this.form.salesQuotationProductList.length > 0 ||
        this.form.salesQuotationServiceList.length > 0
      ) {
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        conversionCurrencyUnitPrice({
          ...this.form,
          oldCurrencyId: oldCurrencyId,
          currencyId: row.id,
          salesQuotationProductList: this.form.salesQuotationProductList,
          salesQuotationServiceList: this.form.salesQuotationServiceList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
            const data = res.data || {}
            this.$set(this.form, 'salesQuotationProductList', data.salesQuotationProductList || [])
            this.$set(this.form, 'salesQuotationServiceList', data.salesQuotationServiceList || [])
          })
          .catch(() => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
          })
      }
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
    },

    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },

    validityChange(changeType) {
      const cur = this.appointTime(Date.now(), '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      if (changeType === 'validityForDay') {
        if (this.form.validityForDay) {
          this.$set(this.form, 'validity', dayTimer * this.form.validityForDay + cur)
        } else {
          this.$set(this.form, 'validity', undefined)
        }
      }
      if (changeType === 'validity') {
        if (this.form.validity) {
          const timer = Math.floor((this.form.validity - cur) / dayTimer)
          this.$set(this.form, 'validityForDay', timer)
        } else {
          this.$set(this.form, 'validityForDay', undefined)
          this.$nextTick(() => {
            this.$refs.form1.validateField('validityForDay')
          })
        }
      }
    },
    deliveryDateChange(changeType) {
      const cur = this.appointTime(Date.now(), '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      if (changeType === 'deliveryDateForDay') {
        if (this.form.deliveryDateForDay) {
          this.$set(this.form, 'deliveryDate', dayTimer * this.form.deliveryDateForDay + cur)
        } else {
          this.$set(this.form, 'deliveryDate', undefined)
        }
        this.$nextTick(() => {
          this.$refs.form1.validateField('deliveryDateForDay')
        })
      }
      if (changeType === 'deliveryDate') {
        if (this.form.deliveryDate) {
          const timer = Math.floor((this.form.deliveryDate - cur) / dayTimer)
          this.$set(this.form, 'deliveryDateForDay', timer)
        } else {
          this.$set(this.form, 'deliveryDateForDay', undefined)
          this.$nextTick(() => {
            this.$refs.form1.validateField('deliveryDateForDay')
          })
        }
      }
    },

    getBPLastPaymentTermName() {
      if (this.form.businessPartnerId) {
        getBPLastPaymentTermName({ businessPartnerId: this.form.businessPartnerId }).then((res) => {
          const data = res.data || {}
          if (data.paymentTermName) {
            this.$set(this.form, 'paymentTermName', data.paymentTermName)
          }
        })
      } else {
        this.$set(this.form, 'paymentTermName', undefined)
      }
    },

    addressLocationTypeChange() {
      this.incotermIdChange({})
    },

    /* 第二部分表单 */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(item) {
      // const oldType = this.form.incotermAddressType
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      this.receiveAddressClear()
      this.$nextTick(() => {
        this.$refs.form2 && this.$refs.form2.clearValidate('incotermId')
        this.$refs.form2 && this.$refs.form2.clearValidate('receiveAddressName')
      })
    },

    openReceiveAddressTable() {
      if (this.form.salesQuotationType === 'Service') {
        this.$refs.payToAddressDlg.handleOpen()
      } else if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      } else if (this.form.incotermAddressType === '2') {
        this.$refs.payToAddressDlg.handleOpen()
      }
    },
    receiveAddressClear(isFromClear) {
      if (isFromClear && this.form.isAdhocEntryAddress === '1') {
        this.$set(this.form, 'bpBusinessAddressOldData', undefined)
      }
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
      this.$set(this.form, 'isAdhocEntryAddress', undefined)
    },
    /* 手动填入BP地址 */
    openAddBPAddressDlg() {
      if (this.form.isAdhocEntryAddress === '1') {
        this.$refs.addBPAddressDlg.handleEdit(this.form.bpBusinessAddress)
      } else if (this.form.bpBusinessAddressOldData) {
        this.$refs.addBPAddressDlg.handleEdit(this.form.bpBusinessAddressOldData)
      } else {
        this.$refs.addBPAddressDlg.handleEdit()
      }
    },
    addBPAddress(row) {
      row.isAdhocEntryAddress = '1'
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressOldData', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', '1')
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateAddress(row) {
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', undefined)
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseId', warehouseId)
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
    },
    contactPersonChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
      this.$set(this.form, 'bpBusinessContactPerson', undefined)
    },
    contactPersonClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
      this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
      this.$set(this.form, 'bpBusinessContactPerson', undefined)
    },
    openAddBPContactPersonDlg() {
      if (this.form.isAdhocEntryContactPerson === '1') {
        this.$refs.addBPContactPersonDlg.handleEdit(this.form.bpBusinessContactPerson)
      } else {
        this.$refs.addBPContactPersonDlg.handleEdit()
      }
    },
    addBPContactPerson(row) {
      row.isAdhocEntryContactPerson = '1'
      this.$set(this.form, 'bpBusinessContactPerson', row)
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')
    },
    /* 表单部分End */
    getSQSubmitConfirm() {
      const bpBusinessAddress = this.form.bpBusinessAddress || {}
      if (
        this.form.incotermAddressType === '2' &&
        bpBusinessAddress.country &&
        this.legalEntityInfo.country !== bpBusinessAddress.country
      ) {
        return this.$t('SALES.SQinternationalTransactionsSubmitConfirm')
      } else {
        return this.$t('SALES.SQSubmitConfirm')
      }
    },

    async submitForm(submitType) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
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
      this.collapseWarningForShippingInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.shippingInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        if (param.salesQuotationType === 'Trading') {
          const validProduct = this.validProductList(param.salesQuotationProductList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesQuotationType === 'Service') {
          const validProduct = this.validProductList(param.salesQuotationProductList, false)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
          const validService = this.validServiceList(param.salesQuotationServiceList)
          if (!validService) {
            this.$refs.ProductInfo.activeName = 'projectTask'
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesQuotationType === 'Project') {
          const validProject = this.validProjectList(param.salesQuotationProjectList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'project1'
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesQuotationType === 'Consignment') {
          const validProject = this.validConsignmentList(param.salesQuotationProductList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'Consignment'
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds
        param.productMsgType = param.productMsgTypeList.join(',')
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // if (param.salesQuotationProjectList && param.salesQuotationProjectList.length > 0) {
        //   const { projectTemplateContentList } = param.salesQuotationProjectList[0]
        //   param.salesQuotationProjectContentList = projectTemplateContentList || []
        // }
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('SALES.SQSaveConfirm')
          successMsg = this.$t('SALES.SQSaveSuccess')
          submitFn = saveDraftSalesQuotation
        } else {
          confirmMsg = this.getSQSubmitConfirm()
          successMsg = this.$t('SALES.SQSubmitSuccess')
          submitFn = saveSalesQuotation
        }

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
    },
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }

      const productNameReq = detailList.find((item) => {
        return !(item.productName || '').trim()
      })
      if (productNameReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      const uomCoefficientReq = detailList.find((item) => {
        return !item.uomCoefficient
      })
      if (uomCoefficientReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      if (unitPriceReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.expectedDeliveryDate'))
        )
        return valid
      }

      return true
    },
    validConsignmentList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      if (unitPriceReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.consignmentCost'))
        )
        return valid
      }

      /*  const consignmentAmountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignmentAmount)
      })
      if (consignmentAmountReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.consignmentPrice'))
        )
        return valid
      } */

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.expectedDeliveryDate'))
        )
        return valid
      }

      return true
    },
    validServiceList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.projectTaskTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        if (item.serviceType === 'External') {
          return item.purchaseQuotationNo && !this.$resultOfBoolean(item.unitPrice)
        } else {
          return !this.$resultOfBoolean(item.unitPrice)
        }
      })
      if (unitPriceReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.expectedDeliveryDate'))
        )
        return valid
      }

      return true
    },
    validProjectList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.projectTableEmpty'))
        return valid
      }
      const projectNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.projectName)
      })
      if (projectNameReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.projectName')))
        return valid
      }

      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handlePreviewPDF() {
      const token = getToken()
      const params = { ...this.form }
      this.previewPDFLoading = true
      preview(params)
        .then((res) => {
          this.previewPDFLoading = false
          const fileID = res.data || ''
          if (fileID) {
            const myUrl =
              process.env.VUE_APP_BASE_API +
              '/system/oss/filePreview/' +
              `${fileID}` +
              '?token=' +
              `${token}`
            window.open(myUrl, 'print')
          }
        })
        .catch(() => {
          this.previewPDFLoading = false
        })
    }
  }
}
</script>
<style lang="scss">
.collapse-item-content-pt0 {
  .el-collapse-item__content {
    padding-top: 10px;
  }
}
</style>
