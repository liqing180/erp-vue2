<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" :disabled="getVarContentLoading" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        :disabled="getVarContentLoading"
        size="mini"
        @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
                        :disabled="form.disSalesQuotationType === '1'"
                      >
                        <el-option
                          v-for="item in quotationTypeList"
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
                      <!-- <SelectInput
                        :disabled="!form.salesQuotationType"
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                      /> -->

                      <CommonSelectAndList
                        :id="form.businessPartnerMainId"
                        :label="form.businessPartnerName"
                        idKey="businessPartnerMainId"
                        labelKey="businessPartnerName"
                        filterable
                        :options="businessPartnerList"
                        :loading="businessLoading"
                        @change="updateSupplier"
                        @handleOpen="openSupplierTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerCode')}`">
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else-if="form.salesQuotationType !== 'Project'">
                    <el-form-item :label="`${$t('SALES.salesInquiryNo')}`">
                      <el-input v-model="form.salesInquiryNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.salesQuotationType === 'Project'"
                    :key="form.salesQuotationType + 'taxRate_' + timeStamp"
                  >
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId || true"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
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
                    <el-form-item :label="`${$t('ui.paymentTerm')}`" prop="paymentTermId">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <div class="input-switch-box">
                          <div class="con-left">
                            <!-- <SelectInput
                              :value="form.paymentTermName"
                              @clear="paymentTermChange({})"
                              clearable
                              @click="openPaymentTermDlg"
                              :disabled="!form.salesQuotationType || !form.businessPartnerId"
                              class="form-wd"
                            /> -->

                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermList"
                              :loading="paymentTermNameLoading"
                              :disabled="!form.salesQuotationType || !form.businessPartnerId"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                            />
                          </div>
                          <div
                            class="con-right"
                            v-if="
                              form.paymentTermName &&
                              checkPermi(['salesManagement:salesQuotation:editPaymentTerm'])
                            "
                          >
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
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else>
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8" v-if="false">
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
                  <el-col :span="8" v-if="form.salesQuotationType !== 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <!-- <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId"
                        :key="form.salesQuotationType + '_' + timeStamp"
                      /> -->

                      <CommonSelectAndList
                        :id="form.salesPersonId"
                        :label="form.salesPersonBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="salesPersonList"
                        :disabled="!form.departmentId"
                        :loading="salesPersonByLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId"
                        :key="form.salesQuotationType + '_' + timeStamp"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="form.salesQuotationType !== 'Project'"
                    :key="form.salesQuotationType + 'taxRate_' + timeStamp"
                  >
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId || true"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesQuotationType === 'Project'">
                    <el-form-item
                      :label="`${$t('SALES.projectCode')}`"
                      prop="costProjectCode"
                      :key="'costProjectId' + form.salesQuotationType"
                      :rules="[
                        {
                          required: form.salesQuotationType === 'Project',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <CommonSelectAndList
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        clearable
                        filterable
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        @change="costProjectNameChange"
                        @handleOpen="openCostProjectNameTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType !== 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <template v-if="form.salesQuotationType !== 'MixDesign'">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.validityDays')}`" prop="validityForDay">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          @change="validityChange('validityForDay')"
                        />
                        <div class="flex" v-if="false">
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
                        :label="`${$t('SALES.leadTimeDays2')}`"
                        prop="deliveryDateForDay"
                        :key="form.salesQuotationType"
                        class="custom-form-item"
                      >
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="true"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-else>
                      <el-form-item
                        :label="`${$t('SALES.leadTimeDays2')}`"
                        prop="deliveryDateForDay"
                        class="custom-form-item"
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
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.customerQuestionnaire')}`"
                        prop="customerQuestionnaireId"
                        :rules="[
                          {
                            required: false,
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
                    <el-col
                      :span="8"
                      v-if="
                        ['Trading', 'Service', 'Consignment', 'Staff'].includes(
                          form.salesQuotationType
                        ) && false
                      "
                      key="priceType11"
                    >
                      <el-form-item :label="`${$t('SALES.priceType')}`" prop="priceTypeId">
                        <CommonSelect
                          :id="form.priceTypeId"
                          :label="form.priceTypeName"
                          :title="form.priceTypeName"
                          idKey="priceTypeId"
                          labelKey="priceTypeName"
                          :options="priceTypeOptions"
                          @change="priceTypeChange"
                          :disabled="!form.businessPartnerId"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>

                <el-row v-if="form.salesQuotationType === 'MixDesign'">
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('SALES.limitingValuesofConcreteComposition')"
                      class="form-item__label-wrap"
                    >
                      <el-input
                        v-model="form.limitingValuesOfConcreteComposition"
                        maxlength="100"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      class="form-item__label-wrap"
                      :label="$t('SALES.typeStrengthClassofCement')"
                    >
                      <el-input v-model="form.typeStrengthClassOfCement" maxlength="100" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      class="form-item__label-wrap"
                      :label="$t('SALES.typeofAdmixtureAddition')"
                    >
                      <el-input v-model="form.typeOfAdmixtureAddition" maxlength="100" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('menu.exchangeRate')}`">
                      <el-input
                        :value="form.exchangeRateDesc"
                        :title="form.exchangeRateDesc"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row> -->

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
                  <el-col :span="8" v-if="form.salesQuotationType === 'Trading'">
                    <el-form-item :label="`${$t('SALES.blanketOrder')}`">
                      <el-switch
                        v-model="form.blanketOrder"
                        active-value="1"
                        inactive-value="0"
                        @change="blanketOrderChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    :key="'expirationDate-' + form.blanketOrder"
                    v-if="form.blanketOrder === '1'"
                  >
                    <el-form-item :label="`${$t('SALES.expirationDate')}`" prop="expirationDate">
                      <el-date-picker
                        v-model="form.expirationDate"
                        :picker-options="consignmentStartTimePickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="
                      ['Trading', 'Service'].includes(form.salesQuotationType) &&
                      form.blanketOrder !== '1'
                    "
                  >
                    <el-form-item :label="`${$t('SALES.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.isNonDigital')}`">
                      <el-switch
                        v-model="form.isNonDigital"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'MixDesign'">
                    <el-form-item :label="`${$t('SALES.COD')}`">
                      <el-switch
                        v-model="form.isCod"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="sysDockingSwitch">
                    <el-form-item :label="`${$t('SALES.sealRequired')}`" prop="sealRequired">
                      <el-switch
                        v-model="form.sealRequired"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Trading' && false">
                    <el-form-item :label="`${$t('SALES.priceTbd2')}`">
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        @change="priceTbdChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Service' && false">
                    <el-form-item :label="`${$t('SALES.priceTbd')}`">
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        @change="priceTbdChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="form.salesQuotationType !== 'MixDesign'">
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
                <el-row>
                  <!-- 修订记录-2.0.5 279行： 默认填充法人仓库，隐藏该字段 -->
                  <el-col :span="8" v-if="false">
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

                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item :label="`${$t('SALES.incoterm')}`" prop="incotermId">
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        @change="incotermIdChange"
                        :disabled="!form.businessPartnerId"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('SALES.port')}`"
                      prop="receivePortName"
                      :rules="[
                        {
                          required: ['FAS', 'CIF', 'FOB', 'CFR'].includes(
                            form.incotermAbbreviation
                          ),
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
                        v-else
                        :mData="form.receiveAddressForPort || {}"
                        :showStr="form.receivePortName"
                        :rows="shipToAddressRows"
                      >
                        <CommonSelectAndList
                          :id="form.receivePortId"
                          :label="form.receivePortName"
                          idKey="portId"
                          labelKey="portName"
                          filterable
                          :options="portOptions"
                          :disabled="
                            !form.incotermId ||
                            !['FAS', 'CIF', 'FOB', 'CFR', 'FCA'].includes(
                              form.incotermAbbreviation
                            ) ||
                            !form.businessPartnerId
                          "
                          :loading="portNameLoading"
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openPortTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('SALES.deliveryAddress')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required:
                            [
                              'CPT',
                              'CIP',
                              'DDP',
                              'DAP',
                              'DPU',
                              'FCA',
                              'CIF',
                              'FOB',
                              'CFR'
                            ].includes(form.incotermAbbreviation) || !form.incotermAbbreviation,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      key="deliveryAddress2"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <!-- <SelectInput
                            :value="form.receiveAddressName"
                            :title="form.receiveAddressName"
                            @clear="receiveAddressClear"
                            clearable
                            @click="openReceiveAddressTable"
                            :disabled="
                              !form.businessPartnerId || form.incotermAbbreviation === 'EXW'
                            "
                            class="form-wd"
                          /> -->

                          <CommonSelectAndList
                            :id="form.receiveAddressId"
                            :label="form.receiveAddress"
                            idKey="businessAddressId"
                            labelKey="receiveAddress"
                            filterable
                            :options="businessAddressList"
                            :disabled="
                              !form.businessPartnerId || form.incotermAbbreviation === 'EXW'
                            "
                            :loading="receiveAddressLoading"
                            @change="updateAddress"
                            @handleOpen="openReceiveAddressTable"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="form.businessPartnerId && form.incotermAbbreviation !== 'EXW'"
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
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
                            :options="
                              (form.bpBusinessContactPersonList || []).filter(
                                (i) => i.isActive === '1'
                              )
                            "
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
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.consignee')}`" prop="consignee">
                      <el-input
                        v-model="form.consignee"
                        :title="form.consignee"
                        maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-if="form.salesQuotationType === 'MixDesign'">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.projectInfo')"
                :warning="collapseWarningForProjectInfo"
              >
              </FormCollapseItemTitle>
              <projectInfo
                ref="projectInfo"
                :formData="form"
                @specialRequirementChange="specialRequirementChange"
              />
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="4">
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
                  @scrollPageToTable="scrollPageToTable"
                  @scrollPageToTotalAmount="scrollPageToTotalAmount"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="5">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.conditions')"
                :warning="collapseWarningForConditions"
              >
              </FormCollapseItemTitle>
              <div>
                <ConditionsTable
                  ref="ConditionsTable"
                  :formData="form"
                  :comSalesConditionsList="comSalesConditionsList"
                  :varContentData="varContentData"
                  :comDisFrom="false"
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
    <addBPContactPersonDlg
      ref="addBPContactPersonDlg"
      :businessPartnerType="form.businessPartnerType"
      @update="addBPContactPerson"
    />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="comPurPosList"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.salesQuotation"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />

    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />

    <lowStockAlertDlg ref="lowStockAlertDlg" @onSuccess="lowStockAlertSuccess" />

    <selectCostProjectTable
      ref="selectCostProjectTable"
      :businessPartnerId="form.businessPartnerId"
      @update="costProjectNameChange"
    />
  </FormPageLayout>
</template>

<script>
import { queryBusinessPartnerById } from '@/api/businessPartner/businessPartner'
import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAllTaxForSales } from '@/api/system/tax'
import { getToken } from '@/utils/auth'
import {
  saveSalesQuotation,
  saveDraftSalesQuotation,
  checkSalesQuotationProductMsg,
  preview,
  conversionCurrencyUnitPrice,
  dealAddProductMsgAndCalculate,
  getFormattedVarContent
} from '@/api/salesManagement/salesQuotation'

import {
  queryBPCustomerQuestionnaireListNoPage,
  queryCustomerPriceTypeList,
  queryCanSelectCustomerListHavePage
} from '@/api/salesManagement/salesInquiry'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import {
  queryPaymentTermListByPaymentTermPurpose,
  queryPaymentTermListByPaymentTermPurposeForPage
} from '@/api/system/paymentTerm'

import { getSystemSetup } from '@/api/system/systemSetting'
import { queryCanSelectCostProjectList } from '@/api/projectManagement/project'
import { queryUsers } from '@/api/organization/corporate'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

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
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'

import selectWarehouseTable from './components/selectWarehouseTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import ConditionsTable from './conditionsTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import lowStockAlertDlg from './components/lowStockAlertDlg.vue'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
import { formDirtyClass } from '@/mixins/formDirtyClass'
import { queryExchangeRateDesc } from '@/api/purchaseManagement/purchaseOrder'
import selectCostProjectTable from '@/views/projectManagement/projectProduction/components/selectCostProjectTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['sales_quotation_type', 'sales_quotation_status', 'project_purpose_type'],
  components: {
    selectCustomerTable,
    selectPurchasePersonTable,
    selectPortTable,
    payToAddressDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    selectWarehouseTable,
    ProductInfo,
    previewQuestionnaireTemplateDlg,
    projectInfo,
    lowStockAlertDlg,
    ConditionsTable,
    selectCostProjectTable
  },
  data() {
    const vm = this
    const htmlChartGtTenThousand = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === '') {
        callback(new Error(vm.$t('ui.reqMsg')))
      } else {
        const obj = document.createElement('div')
        obj.innerHTML = value
        // console.log('111', obj.innerText)
        const text = (obj.innerText || '').trim()
        if (text.length <= 0) {
          callback(new Error(vm.$t('ui.reqMsg')))
        }
        if (text.length > 10000) {
          callback(new Error(vm.$t('ETM.htmlChartGtTenThousand')))
        } else {
          callback()
        }
      }
    }
    return {
      businessLoading: false,
      paymentTermNameLoading: false,
      salesPersonByLoading: false,
      portNameLoading: false,
      receiveAddressLoading: false,
      businessAddressList: [],
      salesPersonList: [],
      paymentTermList: [],
      businessPartnerList: [],
      salesConditionsList: [],
      varContentData: {},
      getVarContentLoading: false,
      previewPDFLoading: false,
      activeNames: [],
      timeId: '',
      submitLoading: false,

      form: {
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        projectCostDetailList: [],
        conditionsTableList: [],
        productOrServiceList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForProjectInfo: false,
      collapseWarningForConditions: false,
      rules: {
        expirationDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
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

        projectPurposeType: [
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
        priceTypeId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        paymentTermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
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

        conditions: [
          // {
          //   required: true,
          //   message: this.$t('ui.reqMsg'),
          //   trigger: ['change', 'blur']
          // },
          {
            required: true,
            validator: htmlChartGtTenThousand,
            trigger: ['change', 'blur']
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
        consignee: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
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

      paymentTermOptions: [],
      incotermOptions: [],
      portOptions: [],
      taxRateOptions: [],
      priceTypeOptions: [],
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
      salesQuotationTypeList: [],
      timeStamp: +new Date(),
      projectNameOptions: [],
      costProjectNameLoading: false
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
    comSalesConditionsList() {
      if (!this.form.salesQuotationType || !this.form.country) {
        return []
      }
      let type = this.form.salesQuotationType
      if (this.form.salesQuotationType === 'Trading') {
        /* 国际交易 */
        if (!this.isLocalSales) {
          type = this.form.salesQuotationType + '-2'
        }
      }
      if (this.form.salesQuotationType === 'Project') {
        if (!this.isLocalSales) {
          type = this.form.salesQuotationType + '-2'
        } else {
          type = this.form.salesQuotationType + '-1'
        }
      }
      let list = JSON.parse(JSON.stringify(this.salesConditionsList || []))
      /* 项目的有一个不管是否国际交易都可选择的类型 */
      if (this.form.salesQuotationType === 'Project') {
        list = list.filter((item) => {
          return (item.purposeList || []).find((x) => x === 'Project' || x === type)
        })
      } else {
        list = list.filter((item) => {
          return (item.purposeList || []).find((x) => x === type)
        })
      }

      return this.groupAndAddHideLabel(list)
    },

    /* 是否是本地交易 */
    isLocalSales() {
      return this.form.country === this.legalEntityInfo.country
    },
    comPurPosList() {
      const purpose = {
        Trading: '3', // 贸易-本地
        Trading2: '3-2', // 贸易-国际
        Service: '4', // 服务
        Project: '10', // 项目
        Project1: '8', // 项目-本地
        Project2: '8-2', // 项目-国际
        MixDesign: '6', // 混凝土产品
        Consignment: '7' // 寄卖
      }

      let key
      key = this.form.salesQuotationType
      if (this.form.salesQuotationType === 'Trading') {
        /* 国际交易 */
        if (!this.isLocalSales) {
          key = this.form.salesQuotationType + '2'
        }
      }
      if (this.form.salesQuotationType === 'Project') {
        if (!this.isLocalSales) {
          key = this.form.salesQuotationType + '2'
        } else {
          key = this.form.salesQuotationType + '1'
        }
      }
      const list = [purpose[key]]
      /* 项目的有一个不管是否国际交易都可选择的类型 */
      if (this.form.salesQuotationType === 'Project') {
        list.push(purpose.Project)
      }
      return list
    },
    size() {
      return this.$store.getters.size
    },
    topPx() {
      const height = {
        default: 40,
        medium: 38,
        small: 34,
        mini: 30
      }
      return height[this.size] || height.default
    },
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
    },
    // 对接CDS
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch
    },
    quotationTypeList() {
      // 临时注释 2025-05-13 模拟测试后改回去
      if (this.isSystemDocking === '1') {
        // return this.salesQuotationTypeList.filter(
        //   (x) => ['Trading', 'Service', 'Project', 'MixDesign'].indexOf(x.dictValue) !== -1
        // )
        return this.salesQuotationTypeList.filter(
          (x) => ['Trading', 'Project', 'MixDesign'].indexOf(x.dictValue) !== -1
        )
      } else {
        // return this.salesQuotationTypeList.filter(
        //   (x) => ['Trading', 'Service', 'Project'].indexOf(x.dictValue) !== -1
        // )
        // 修订记录 2.0.9-4 需求，去掉"服务"选项
        return this.salesQuotationTypeList.filter(
          (x) => ['Trading', 'Project'].indexOf(x.dictValue) !== -1
        )
      }
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
    queryCanSelectCustomerListHavePage() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesQuotation,
        salesQuotationType: this.salesQuotationType
      }
      this.businessLoading = true
      queryCanSelectCustomerListHavePage(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessPartnerList = rows
          this.businessLoading = false
        })
        .catch((err) => {
          this.businessLoading = false
          window.console.error(err)
        })
    },

    queryPaymentTermListByPaymentTermPurposeForPage() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      param.paymentTermPurposeList = this.comPurPosList
      param.businessPartnerId = this.form.businessPartnerId
      param.menuPerms = this.menuKey.salesQuotation

      this.$trimOfObj(param)
      this.paymentTermNameLoading = true
      queryPaymentTermListByPaymentTermPurposeForPage(param)
        .then((response) => {
          const list = response.rows || []
          this.paymentTermList = list
          this.paymentTermNameLoading = false
        })
        .catch((err) => {
          this.paymentTermNameLoading = false
          window.console.error(err)
        })
    },

    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesQuotation,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      this.salesPersonByLoading = true
      queryUsers(param)
        .then((response) => {
          this.salesPersonList = response.rows || []
          this.salesPersonByLoading = false
        })
        .catch((err) => {
          this.salesPersonByLoading = false
          window.console.error(err)
        })
    },

    queryAddressByBusinessPartnerId() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.businessPartnerMainId = this.form.businessPartnerMainId
      this.receiveAddressLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessAddressList = rows
          this.receiveAddressLoading = false
        })
        .catch((err) => {
          this.receiveAddressLoading = false
          window.console.error(err)
        })
    },

    groupAndAddHideLabel(arr) {
      // 1. 按category分组, 相同分类下的内容放在一起
      const groups = {}
      arr.forEach((item) => {
        const category = item.category
        if (!groups[category]) {
          groups[category] = []
        }
        if (groups[category].length > 0) {
          item.hideLabel = '1'
        }
        groups[category].push(item)
      })
      const list = Object.values(groups).flat()

      return list
    },
    specialRequirementChange() {
      if (
        this.form.specialRequirement !== '3' &&
        this.$refs.ProductInfo.activeName === 'projectTaskMixDesign'
      ) {
        this.$refs.ProductInfo.activeName = 'mixDesign'
      }
    },
    getDict() {
      this.MyDictDataClass.getDictFn('sales_quotation_type').then((res) => {
        this.salesQuotationTypeList = res || []
        // if (this.isSystemDocking === '1') {
        //   this.salesQuotationTypeList = (res.data || []).filter(
        //     (x) => ['Trading', 'Project', 'MixDesign'].indexOf(x.dictValue) !== -1
        //   )
        // } else {
        //   this.salesQuotationTypeList = (res.data || []).filter(
        //     (x) => ['Trading', 'Project'].indexOf(x.dictValue) !== -1
        //   )
        // }
        /* setTimeout(() => {
          if (this.isSystemDocking === '1') {
            this.form.salesQuotationType = 'MixDesign'
          } else {
            this.form.salesQuotationType = 'Trading'
          }
        }, 1000) */
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
      /* this.$set(
        this.form,
        'totalRemarks',
        'Order below $300.00 will incur delivery charge of $60.00;'
      ) */
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.queryCanSelectPortList()
      this.getSystemSetup('init')
      this.queryCanSelectCustomerListHavePage()
      /* if (this.isSystemDocking === '1') {
        this.$set(this.form, 'salesQuotationType', 'MixDesign')
      } else {
      this.$set(this.form, 'salesQuotationType', 'Trading')
      } */
      this.$set(this.form, 'salesQuotationType', 'Trading')

      const paramsObj = this.$route.query
      if (paramsObj.customerQuestionnaireId && paramsObj.bpId) {
        if (paramsObj.costProjectId) {
          this.$set(this.form, 'disSalesQuotationType', '1')
          this.$set(this.form, 'salesQuotationType', 'Project')
        }
        queryBusinessPartnerById(paramsObj.bpId).then((res) => {
          this.updateSupplier(res.data)
          setTimeout(() => {
            this.$set(this.form, 'customerQuestionnaireId', paramsObj.customerQuestionnaireId)
            this.$set(this.form, 'customerQuestionnaireNo', paramsObj.customerQuestionnaireNo)
            this.$set(this.form, 'costProjectId', paramsObj.costProjectId)
            this.$set(this.form, 'costProjectCode', paramsObj.costProjectCode)
          }, 100)
        })
      }
      if (
        this.form.salesQuotationType === 'Trading' ||
        this.form.salesQuotationType === 'Project'
      ) {
        this.queryCanSelectCostProjectList()
      }

      setTimeout(() => {
        const initFormJson = this.getFormJson()
        formDirtyClass.routeStatusData[this.$route.name] = {
          $vm: this,
          saveShow: true,
          submitShow: true,
          initFormJson,
          getFormJson: this.getFormJson,
          isSaveSuccess: false,
          saveOrSubmitFn: this.handleSaveDraftNoConFirm
        }
      }, 300)
    },
    getFormJson() {
      const param = { ...this.form }
      param.commonFileList = this.$refs.ProductInfo && this.$refs.ProductInfo.getFileIds()
      return JSON.stringify(param)
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
        businessPartnerId: this.form.businessPartnerId,
        createdType: 'SQ',
        menuPerms: this.menuKey.salesQuotation
      }).then((res) => {
        this.customerQuestionnaireOptions = res.data || []
        // if (this.customerQuestionnaireOptions.length > 0) {
        //   const topRow = this.customerQuestionnaireOptions[0]
        //   this.$set(this.form, 'customerQuestionnaireId', topRow.customerQuestionnaireId)
        //   this.$set(this.form, 'customerQuestionnaireNo', topRow.customerQuestionnaireNo)
        // }
      })
    },
    handleView() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    getSystemSetup(type) {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        const { quotationValidityDays } = data
        let date = +new Date()
        const ValidityDays = quotationValidityDays * 1 || 30
        if (ValidityDays) {
          date = date + ValidityDays * 24 * 60 * 60 * 1000
        }
        this.$set(this.form, 'validityForDay', ValidityDays)
        this.$set(this.form, 'validity', date)

        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          validityForDay: ValidityDays,
          validity: date
        })

        this.getFormattedVarContentFn()
        const salesConditions = data.salesConditions || ''
        this.salesConditionsList = salesConditions ? JSON.parse(salesConditions) : []
        this.setDefaultConditions(type)
      })
    },
    setDefaultConditions(type) {
      if (
        !this.form.salesQuotationType ||
        !this.form.country ||
        (this.form.salesQuotationType === 'Project' && !this.form.projectPurposeType)
      ) {
        this.$set(this.form, 'conditionsTableList', [])
        if (type && type === 'init') {
          // 更新初始表单部分字段
          formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
            conditionsTableList: []
          })
        }
        return
      }
      const list = this.comSalesConditionsList || []
      const categoryMap = new Map()
      list.forEach((item) => {
        // 仅处理isDefault为1的项，且同一category只存第一个
        if (item.isDefault === '1' && !categoryMap.has(item.category)) {
          categoryMap.set(item.category, item)
        }
      })
      const DefaultList = Array.from(categoryMap.values())
      this.$set(this.form, 'conditionsTableList', JSON.parse(JSON.stringify(DefaultList)))
      if (type && type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          conditionsTableList: JSON.parse(JSON.stringify(DefaultList))
        })
      }
    },
    handleSetConditionsHtmlStr(delNullVar = false) {
      if (delNullVar) {
        const list = this.form.conditionsTableList
        const newList = list.filter((item) => {
          const nullVarList = []
          const str = (item.conditions || '').trim()
          str.replace(/\$\{([A-Za-z0-9 _-]+)\}/g, (match, varKey) => {
            // console.log('match', match)
            // console.log('varKey', varKey)
            const is = this.varContentData[varKey]
            if (!this.$resultOfBoolean(is)) {
              nullVarList.push(varKey)
            }
            const value = match // 保留原占位符
            return value
          })
          return nullVarList.length <= 0
        })
        this.$set(this.form, 'conditionsTableList', newList)
      }
      // emailEditorRef
      let htmlStr = '<table style="width: 100%;" cellspacing="0" cellpadding="0">'
      const selectList = this.form.conditionsTableList
      selectList.forEach((item, index) => {
        if (item.conditionsCody) {
          item.conditions = item.conditionsCody
          delete item.conditionsCody
        }
        const labelStyle =
          'font-weight: bold;vertical-align: top;white-space: nowrap; padding: 4px 0;padding-right: 40px;'
        const valueStyle = 'vertical-align: top;width: 100%;padding: 4px 0;white-space: pre-wrap;'
        htmlStr +=
          '<tr>' +
          `<td valign="left" style="${labelStyle};">${index + 1}. ${item.category}</td>` +
          `<td valign="left" style="${valueStyle};">${item.conditions}</td></tr>`
      })
      htmlStr += '</table>'

      this.form.conditions = selectList.length > 0 ? htmlStr : ''
      this.form.conditionsTableJson = JSON.stringify(this.form.conditionsTableList)
    },
    getFormattedVarContentFn() {
      if (this.getVTimer) {
        clearTimeout(this.getVTimer)
      }
      this.getVarContentLoading = true
      this.getVTimer = setTimeout(() => {
        const queryTimer = Date.now()
        this.queryTimer = queryTimer
        getFormattedVarContent({ ...this.form })
          .then((res) => {
            if (this.queryTimer !== queryTimer) return
            const data = res.data || {}
            this.varContentData = data
            this.getVarContentLoading = false
          })
          .catch(() => {
            if (this.queryTimer !== queryTimer) return
            this.getVarContentLoading = false
          })
      }, 500)
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
        priceTypeId: undefined,
        priceTypeName: undefined,
        conditions: '',
        basicRemarks: undefined,
        automatedEmail: '1',
        isNonDigital: '1',
        isCod: '0',
        productMsgTypeList: ['1', '2', '3'],
        dropShipping: '0',
        blanketOrder: '0',
        totalRemarks: undefined,
        priceTbd: '0', // 价格另议
        isUpdateAmount: '0', // 是否用户编辑过 subTotal

        bpEmail: undefined,
        mobilePhone: undefined,

        /* incotermId: '20',
        incotermName: 'EXW- Self Collection (Place)',
        incotermAddressType: '0',
        incotermAbbreviation: 'EXW', */
        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        incotermAbbreviation: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        productOrServiceList: [],
        projectCostDetailList: [],
        conditionsTableList: [],
        tableLoading: false,
        consignmentStartTime: undefined,
        consignmentEndTime: undefined,
        projectTemplateContentList: [],

        taxId: undefined,
        taxNo: undefined,
        taxRate: undefined,

        // 配合比
        projectId: undefined,
        projectCode: undefined,
        zoneName: undefined,
        zoneId: undefined,
        receiveAddress: undefined,
        bpBusinessAddressId: undefined,
        projectContactPersonNames: undefined,
        specialRequirement: undefined,
        cubeSpacingNum: undefined,
        projectContactPersonList: [],
        projectBusinessContactPersonIds: undefined,
        projectContactPersonIds: undefined,
        salesQuotationMixDesignList: [],
        sealRequired: '0',
        expirationDate: undefined
      }

      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForProjectInfo = false
      this.collapseWarningForConditions = false

      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5']
      this.salesConditionsList = []
      this.varContentData = {}

      this.$set(this.form, 'currency', this.legalEntityInfo.currency)
      this.$set(this.form, 'currencyId', this.legalEntityInfo.currencyId)
      this.$set(this.form, 'currencyCode', this.legalEntityInfo.currencyCode)
      this.$set(this.form, 'currencySymbol', this.legalEntityInfo.currencySymbol)
      this.queryExchangeRateDesc()
      this.resetForm('form1')
      this.resetForm('form2')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    backFN() {
      formDirtyClass.showNotify(this.$route.name).then((msg) => {
        if (msg === 'save') {
          this.handleSaveDraftNoConFirm()
          return
        } else if (msg === 'stop') {
          return
        }
        this.back()
      })
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1 && this.$refs.form1.validateField(code)
    },
    salesQuotationTypeChange() {
      this.tableTimer = Date.now()
      this.timeStamp = Date.now()
      this.$set(this.form, 'tableLoading', false)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationProjectList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
      this.$set(this.form, 'productOrServiceList', [])
      this.$set(this.form, 'otherCosts', undefined)
      this.$set(this.form, 'totalDiscount', undefined)
      this.$set(this.form, 'projectPurposeType', undefined)
      this.$nextTick(() => {
        this.$set(this.form, 'priceTbd', '0')
        this.$set(this.form, 'isUpdateAmount', '0')
        this.$set(this.form, 'blanketOrder', '0')
      })
      // this.supplierClear()
      this.$refs.projectInfo && this.$refs.projectInfo.projectClear()
      this.warehouseClear()
      this.incotermIdChange({})
      this.paymentTermClear()
      this.$nextTick(() => {
        this.$refs.form1 && this.$refs.form1.clearValidate('businessPartnerName')
        this.$refs.form1 && this.$refs.form1.clearValidate('customerQuestionnaireId')
        this.$refs.form1 && this.$refs.form1.clearValidate('paymentTermId')
        this.$refs.form1 && this.$refs.form1.clearValidate('priceTypeId')
        this.queryPaymentTermListByPaymentTermPurpose()
        this.queryPaymentTermListByPaymentTermPurposeForPage()
      })
      if (this.form.salesQuotationType === 'Project') {
        // this.$set(this.form, 'salesQuotationProjectList', [
        //   {
        //     id: +new Date()
        //   }
        // ])
      }
      this.setDefaultConditions()
      this.queryCanSelectCustomerListHavePage()
    },
    openSupplierTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'registeredAddressCountry', undefined)
      this.$set(this.form, 'registeredAddressCity', undefined)
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'consignee', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.tableTimer = Date.now()
      this.$set(this.form, 'tableLoading', false)
      if (this.form.salesQuotationType !== 'Project') {
        this.$set(this.form, 'salesQuotationProductList', [])
        this.$set(this.form, 'salesQuotationServiceList', [])
        this.$set(this.form, 'productOrServiceList', [])
      }
      this.customerQuestionnaireClear()
      if (this.form.currencyId !== this.legalEntityInfo.currencyId) {
        this.currencyClear()
      }
      this.paymentMethodChange([], [])
      /* if (this.form.incotermAddressType === '2' || this.form.salesQuotationType === 'Service') {
        this.receiveAddressClear()
      } */
      this.incotermIdChange({})
      if (this.form.salesQuotationType === 'Consignment') {
        this.warehouseClear()
      }
      this.$refs.projectInfo && this.$refs.projectInfo.projectClear()
      this.contactPersonClear()
      this.queryPaymentTermListByPaymentTermPurpose()
      this.queryCustomerPriceTypeList()
      this.costProjectNameChange()
      this.setDefaultConditions()
      if (
        this.form.salesQuotationType === 'Trading' ||
        this.form.salesQuotationType === 'Project'
      ) {
        this.queryCanSelectCostProjectList()
      }
      // this.deliveryAddressClear()
    },
    updateSupplier(row, isProjectNameTrigger = false) {
      if (!row.businessPartnerMainId) {
        return this.supplierClear()
      }
      if (row.bpBusinessAddressList && row.bpBusinessAddressList.length > 0) {
        const registeredAddress =
          row.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
        this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      }
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'consignee', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'businessPartnerType', row.businessPartnerType)
      const account = row.bpBusinessAccountCustomer || {}

      if (!this.form.currencyId) {
        this.$set(this.form, 'currency', this.legalEntityInfo.currency)
        this.$set(this.form, 'currencyId', this.legalEntityInfo.currencyId)
        this.$set(this.form, 'currencyCode', this.legalEntityInfo.currencyCode)
        this.$set(this.form, 'currencySymbol', this.legalEntityInfo.currencySymbol)
      }

      if (this.form.salesQuotationType !== 'Service') {
        this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
        this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      }
      this.customerQuestionnaireClear()
      this.queryCustomerQuestionnaire()
      this.queryPaymentTermListByPaymentTermPurpose()
      this.queryCustomerPriceTypeList()

      this.incotermIdChange({})
      /* if (this.form.incotermAddressType === '2') {
        this.receiveAddressClear()
      } */
      if (this.form.salesQuotationType === 'Consignment') {
        this.warehouseClear()
      }
      this.contactPersonClear()
      this.taxRateChange({})
      this.queryAllTaxForSales()

      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isSalesDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      this.tableTimer = Date.now()
      this.$set(this.form, 'tableLoading', false)
      if (this.form.salesQuotationType !== 'Project') {
        this.$set(this.form, 'salesQuotationProductList', [])
        this.$set(this.form, 'salesQuotationServiceList', [])
        this.$set(this.form, 'productOrServiceList', [])
      }
      this.$refs.projectInfo && this.$refs.projectInfo.projectClear()
      if (!isProjectNameTrigger) {
        this.costProjectNameChange()
      }
      if (
        this.form.salesQuotationType === 'Trading' ||
        this.form.salesQuotationType === 'Project'
      ) {
        this.queryCanSelectCostProjectList()
      }
      this.setDefaultConditions()
      console.log('===================2103')
      this.queryPaymentTermListByPaymentTermPurposeForPage()
      this.queryAddressByBusinessPartnerId()
    },
    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.salesQuotation }).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
            this.queryUsers()

            // 更新初始表单部分字段
            formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
              departmentId: item.departmentId,
              departmentName: item.departmentName,
              allSuperiorName: item.allSuperiorName
            })
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

    queryAllTaxForSales() {
      if (this.form.businessPartnerId) {
        queryAllTaxForSales({ countryId: this.form.countryId }).then((res) => {
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
      // this.$nextTick(() => {
      //   this.$refs.form1.validateField('taxRate')
      // })
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
      this.$set(this.form, 'currencySymbol', row.currencySymbol)
      if (
        this.form.salesQuotationProductList.length > 0 ||
        this.form.salesQuotationServiceList.length > 0 ||
        this.form.salesQuotationMixDesignList.length > 0 ||
        this.form.productOrServiceList.length > 0
      ) {
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        conversionCurrencyUnitPrice({
          ...this.form,
          oldCurrencyId: oldCurrencyId,
          currencyId: row.id,
          salesQuotationProductList: this.form.salesQuotationProductList,
          salesQuotationServiceList: this.form.salesQuotationServiceList,
          salesQuotationMixDesignList: this.form.salesQuotationMixDesignList,
          productOrServiceList: this.form.productOrServiceList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
            const data = res.data || {}
            this.$set(this.form, 'exchangeRateDesc', data.exchangeRateDesc)

            const salesQuotationProductList = (data.salesQuotationProductList || []).map((x) => {
              return {
                ...x,
                exchangeRateDesc: data.exchangeRateDesc
              }
            })
            const salesQuotationServiceList = (data.salesQuotationServiceList || []).map((x) => {
              return {
                ...x,
                exchangeRateDesc: data.exchangeRateDesc
              }
            })
            const productOrServiceList = (data.productOrServiceList || []).map((x) => {
              return {
                ...x,
                exchangeRateDesc: data.exchangeRateDesc
              }
            })
            const salesQuotationMixDesignList = (data.salesQuotationMixDesignList || []).map(
              (x) => {
                return {
                  ...x,
                  exchangeRateDesc: data.exchangeRateDesc
                }
              }
            )
            this.$set(this.form, 'salesQuotationProductList', salesQuotationProductList || [])
            this.$set(this.form, 'salesQuotationServiceList', salesQuotationServiceList || [])
            this.$set(this.form, 'productOrServiceList', productOrServiceList || [])
            this.$set(this.form, 'salesQuotationMixDesignList', salesQuotationMixDesignList || [])

            this.$set(this.form, 'otherCosts', data.otherCosts)
            this.$set(this.form, 'subTotal', data.subTotal)
            this.$set(this.form, 'totalTaxAmount', data.totalTaxAmount)
            this.$set(this.form, 'totalAmount', data.totalAmount)
          })
          .catch(() => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
          })
      } else {
        this.queryExchangeRateDesc()
      }
    },
    queryExchangeRateDesc() {
      if (!this.form.currencyCode) return
      queryExchangeRateDesc({ currencyCode: this.form.currencyCode }).then((res) => {
        const exchangeRateDesc = res.code === 200 ? res.msg : ''
        this.$set(this.form, 'exchangeRateDesc', exchangeRateDesc)
      })
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
      this.$set(this.form, 'productOrServiceList', [])
    },

    projectTypeChange() {
      this.paymentTermChange({})
      this.setDefaultConditions()
    },

    queryPaymentTermListByPaymentTermPurpose(type) {
      this.paymentTermChange({})
      this.paymentTermOptions = []
      if (!this.form.salesQuotationType) {
        return
      }
      if (!this.form.businessPartnerId) {
        return
      }

      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurposeList: this.comPurPosList,
        menuPerms: this.menuKey.salesQuotation,
        businessPartnerId: this.form.businessPartnerId
      }).then((res) => {
        console.log(res)
        this.paymentTermOptions = res.data || []
        const defaultPaymentTerm = this.paymentTermOptions.find((item) => item.isDefault === '1')
        if (defaultPaymentTerm) {
          this.paymentTermChange(defaultPaymentTerm, type)
        }
      })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(row, type) {
      this.$set(this.form, 'paymentTermId', row.paymentTermId)
      this.$set(this.form, 'paymentTermName', row.paymentTermName)
      this.$set(this.form, 'paymentTerm', row)

      if (type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          paymentTermId: row.paymentTermId,
          paymentTermName: row.paymentTermName,
          paymentTerm: row
        })
      }
      this.getFormattedVarContentFn()
    },
    paymentTermClear() {
      this.$set(this.form, 'paymentTermId', undefined)
      this.$set(this.form, 'paymentTermName', undefined)
      this.$set(this.form, 'paymentTerm', undefined)
      this.getFormattedVarContentFn()
    },
    openEditPaymentTermDlg() {
      this.$refs.editPaymentTernDlg.handleUpdate(this.form.paymentTerm)
    },
    paymentTermEditChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.getFormattedVarContentFn()
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
      this.getFormattedVarContentFn()
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
      this.getFormattedVarContentFn()
      this.form.salesQuotationProductList.forEach((item) => {
        this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
      })
      this.form.productOrServiceList.forEach((item) => {
        this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
      })
    },
    // 查询BP可以选择的价格类型:
    queryCustomerPriceTypeList() {
      this.$set(this.form, 'priceTypeId', undefined)
      this.$set(this.form, 'priceTypeName', undefined)
      if (!this.form.businessPartnerId) {
        this.priceTypeOptions = []
        return
      }
      if (!['Trading', 'Service', 'Consignment', 'Staff'].includes(this.form.salesQuotationType)) {
        return
      }
      queryCustomerPriceTypeList({
        businessPartnerId: this.form.businessPartnerId,
        customerGroup: this.form.customerGroup
      }).then((res) => {
        this.priceTypeOptions = res.data || []
        if (this.priceTypeOptions[0]) {
          this.$set(this.form, 'priceTypeId', this.priceTypeOptions[0].priceTypeId)
          this.$set(this.form, 'priceTypeName', this.priceTypeOptions[0].priceTypeName)
        }
      })
    },
    // 项目名称
    queryCanSelectCostProjectList() {
      this.costProjectNameLoading = true
      this.projectNameOptions = this.projectNameOptions.filter(
        (item) => item.businessPartnerId === this.form.businessPartnerId
      )
      queryCanSelectCostProjectList({ businessPartnerId: this.form.businessPartnerId })
        .then((response) => {
          this.projectNameOptions = response.data || []
          this.costProjectNameLoading = false
        })
        .catch((err) => {
          this.projectNameOptions = []
          window.console.error(err)
          this.costProjectNameLoading = false
        })
    },
    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen(this.form.costProjectId)
    },
    costProjectNameChange(item = {}) {
      if (!item.costProjectId) {
        this.$set(this.form, 'costProjectId', undefined)
        this.$set(this.form, 'costProjectName', undefined)
        this.$set(this.form, 'costProjectCode', undefined)
      } else {
        this.$set(this.form, 'costProjectId', item.costProjectId)
        this.$set(this.form, 'costProjectName', item.costProjectName)
        this.$set(this.form, 'costProjectCode', item.costProjectCode)
        if (!this.form.businessPartnerId) {
          queryBusinessPartnerById(item.businessPartnerId).then((res) => {
            this.updateSupplier(res.data, true)
          })
        }
      }
      this.$set(this.form, 'salesQuotationProductList', [])
    },
    priceTypeChange(item) {
      if (!item.priceTypeId) {
        this.$set(this.form, 'priceTypeId', undefined)
        this.$set(this.form, 'priceTypeName', undefined)
        return
      }
      if (this.form.salesQuotationProductList.length > 0) {
        const h = this.$createElement
        this.$msgbox({
          title: ' ',
          message: h('div', null, [
            h(
              'div',
              { style: 'font-size: 16px' },
              this.$t('SALES.priceTypeChangeMsg1').replace('$1', item.priceTypeName)
            ),
            h(
              'div',
              { class: 'mt10' },
              this.$t('SALES.priceTypeChangeMsg2').replace('$1', item.priceTypeName)
            ),
            h('ul', { class: 'my-sq-ul mt10' }, [
              h('li', null, this.$t('SALES.priceTypeChangeMsg3')),
              h('li', null, this.$t('SALES.priceTypeChangeMsg4'))
            ])
          ]),
          showCancelButton: true,
          confirmButtonText: this.$t('SALES.confirmSwitch'),
          cancelButtonText: this.$t('uiBtn.cancel')
        }).then(() => {
          this.$set(this.form, 'priceTypeId', item.priceTypeId)
          this.$set(this.form, 'priceTypeName', item.priceTypeName)
          this.resetPriceType()
        })
      } else {
        this.$set(this.form, 'priceTypeId', item.priceTypeId)
        this.$set(this.form, 'priceTypeName', item.priceTypeName)
      }
    },
    resetPriceType() {
      if (this.form.salesQuotationProductList.length > 0 && this.form.priceTypeId) {
        this.form.salesQuotationProductList.forEach((item) => {
          this.$set(item, 'unitPrice', undefined)
          this.$set(item, 'discount', undefined)
          this.$set(item, 'lineTotal', undefined)
          this.$set(item, 'salesCost', undefined)
          this.$set(item, 'salesProfit', undefined)
          this.$set(item, 'taxAmountProcess', undefined)
        })
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        dealAddProductMsgAndCalculate({
          ...this.form,
          salesQuotationProductList: this.form.salesQuotationProductList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
            const data = res.data || {}
            this.$set(this.form, 'subTotal', data.subTotal)
            this.$set(this.form, 'totalFreight', data.totalFreight)
            this.$set(this.form, 'totalTaxAmount', data.totalTaxAmount)
            this.$set(this.form, 'totalAmount', data.totalAmount)
            this.$set(this.form, 'totalDiscount', data.totalDiscount)
            this.$set(this.form, 'expenseAmount', data.expenseAmount)
            this.$set(this.form, 'salesQuotationProductList', data.salesQuotationProductList || [])
          })
          .catch(() => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
          })
      }
    },

    addressLocationTypeChange() {
      this.incotermIdChange({})
    },
    blanketOrderChange() {
      if (this.form.blanketOrder === '1') {
        this.$set(this.form, 'dropShipping', '0')
      }
    },
    priceTbdChange() {
      this.$nextTick(() => {
        this.$set(this.form, 'isUpdateAmount', '0')
        this.$refs.ProductInfo.handleCalculate()
      })
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
      this.receivePortClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate(['receivePortName', 'receiveAddressName'])
        this.queryCanSelectPortList()
      })
      this.getFormattedVarContentFn()
    },

    queryCanSelectPortList() {
      let firstCountryId
      let firstCountry
      let firstCity

      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.legalEntityInfo.countryId
        firstCountry = this.legalEntityInfo.country
        firstCity = this.legalEntityInfo.city
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.form.receiveAddressCountryId || this.form.countryId
        // firstCountry = this.form.receiveAddressCountry || this.form.country
        // firstCity = this.form.receiveAddressCity
        firstCountry =
          this.form.receiveAddressCountry || this.form.registeredAddressCountry || this.form.country
        firstCity = this.form.receiveAddressCity || this.form.registeredAddressCity
      }
      this.portNameLoading = true
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 9999,
        firstCountryId,
        firstCountry,
        firstCity
      })
        .then((res) => {
          this.portOptions = res.rows || []
          this.portNameLoading = false
        })
        .catch(() => {
          this.portNameLoading = false
        })
    },
    openPortTable() {
      let firstCountryId
      let firstCountry
      let firstCity

      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.legalEntityInfo.countryId
        firstCountry = this.legalEntityInfo.country
        firstCity = this.legalEntityInfo.city
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.form.receiveAddressCountryId || this.form.countryId
        // firstCountry = this.form.receiveAddressCountry || this.form.country
        // firstCity = this.form.receiveAddressCity
        firstCountry =
          this.form.receiveAddressCountry || this.form.registeredAddressCountry || this.form.country
        firstCity = this.form.receiveAddressCity || this.form.registeredAddressCity
      }
      this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
    },
    receiveAddressClear(isFromClear) {
      if (isFromClear && this.form.isAdhocEntryAddress === '1') {
        this.$set(this.form, 'bpBusinessAddressOldData', undefined)
      }
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
      this.$set(this.form, 'isAdhocEntryAddress', undefined)
      this.$set(this.form, 'receiveAddressCountryId', undefined)
      this.$set(this.form, 'receiveAddressCountry', undefined)
      this.$set(this.form, 'receiveAddressCity', undefined)
      this.getFormattedVarContentFn()
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
      // this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)

      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', '1')
      this.$set(this.form, 'receiveAddressCountryId', row.countryId)
      this.$set(this.form, 'receiveAddressCountry', row.country)
      this.$set(this.form, 'receiveAddressCity', row.city)
      this.queryCanSelectPortList()
    },
    updatePort(row) {
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      this.getFormattedVarContentFn()

      if (!portId) return
      if (['FOB', 'FAS'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.legalEntityInfo.countryId !== countryId &&
          this.legalEntityInfo.country !== country &&
          this.legalEntityInfo.country.indexOf(country) === -1
        ) {
          this.$alert(
            this.$t('SALES.portIncorrectForFOBOrFAS')
              .replace('$1', this.legalEntityInfo.country)
              .replace('$2', this.form.incotermAbbreviation),
            '',
            {
              confirmButtonText: this.$t('SALES.gotIt'),
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
          (this.form.receiveAddressCountry ||
            this.form.registeredAddressCountry ||
            this.form.country) &&
          (this.form.receiveAddressCountry ||
            this.form.registeredAddressCountry ||
            this.form.country) !== country
        ) {
          this.$alert(
            this.$t('SALES.portIncorrectForCIFOrCFR').replace('$1', this.form.incotermAbbreviation),
            '',
            {
              confirmButtonText: this.$t('SALES.gotIt'),
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
    updateAddress(row) {
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpBusinessAddress', row)
      // this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', undefined)
      this.$set(this.form, 'receiveAddressCountryId', row.countryId)
      this.$set(this.form, 'receiveAddressCountry', row.country)
      this.$set(this.form, 'receiveAddressCity', row.city)
      this.queryCanSelectPortList()
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

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
      if (myFileIds === false) {
        return
      }
      if (submitType === 'save') {
        this.collapseWarningForProjectInfo = false
        this.collapseWarningForShippingInfo = false
        let valid1 = true
        this.$refs.form1.clearValidate()
        this.$refs.projectInfo && this.$refs.projectInfo.clearValidate()
        this.$refs.form2 && this.$refs.form2.clearValidate()
        this.$refs.form1.validateField(['salesQuotationType', 'businessPartnerName'], (err) => {
          if (err) {
            valid1 = false
          }
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }
      } else {
        const valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }

        if (this.form.salesQuotationType === 'MixDesign') {
          const valid3 = await this.$refs.projectInfo.submitForm()
          if (!valid3) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.projectInfo'))
            )
            this.collapseWarningForProjectInfo = true
            return
          }
          this.collapseWarningForProjectInfo = false
        } else {
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
        }
      }

      let param = { ...this.form }

      if (submitType === 'save') {
        this.collapseWarningForProductInfo = false
        this.collapseWarningForConditions = false
      } else {
        if (param.priceTbd === '1' && param.subTotal === 0) {
          this.$modal.msgError(this.$t('SALES.enabledZero'))
          return
        }
        if (param.salesQuotationType === 'Trading') {
          // const validProduct = this.validProductList(param.salesQuotationProductList)
          // if (!validProduct) {
          //   this.$refs.ProductInfo.activeName = 'productDetail'
          //   this.collapseWarningForProductInfo = true
          //   return
          // }
          // this.$refs.ProductInfo.requiredError('', 'productDetail')

          // 贸易 类型使用的服务列表，改用服务类型的列表校验
          const validProduct = this.validProductOrServiceList(param.productOrServiceList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'ServiceTypeProduct'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'ServiceTypeProduct')
        } else if (param.salesQuotationType === 'Service') {
          const validProduct = this.validProductOrServiceList(param.productOrServiceList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'ServiceTypeProduct'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'ServiceTypeProduct')

          // const validProduct = this.validProductList(param.salesQuotationProductList, false)
          // if (!validProduct) {
          //   this.$refs.ProductInfo.activeName = 'productDetail'
          //   this.collapseWarningForProductInfo = true
          //   return
          // }
          // const validService = this.validServiceList(param.salesQuotationServiceList)
          // if (!validService) {
          //   this.$refs.ProductInfo.activeName = 'projectTask'
          //   this.collapseWarningForProductInfo = true
          //   return
          // }
        } else if (param.salesQuotationType === 'Project') {
          const validProduct = this.validProductList(param.salesQuotationProductList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'productDetail')

          /* const validProject = this.validProjectList(param.salesQuotationProjectList)
        if (!validProject) {
          this.$refs.ProductInfo.activeName = 'project1'
          this.collapseWarningForProductInfo = true
          return
        } */
        } else if (param.salesQuotationType === 'Consignment') {
          const validProject = this.validConsignmentList(param.salesQuotationProductList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'Consignment'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'Consignment')
        } else if (param.salesQuotationType === 'MixDesign') {
          // 配合比
          const validProject = this.validMixDesignList(param.salesQuotationMixDesignList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'mixDesign'
            this.collapseWarningForProductInfo = true
            return
          }
          this.$refs.ProductInfo.requiredError('', 'mixDesign')

          // 项目任务
          if (param.specialRequirement === '3') {
            const validService = this.validMixDesignServiceList(param.salesQuotationServiceList)
            if (!validService) {
              this.$refs.ProductInfo.activeName = 'projectTaskMixDesign'
              this.collapseWarningForProductInfo = true
              return
            }
          }
        }

        this.collapseWarningForProductInfo = false

        const conditionsCurList = this.form.conditionsTableList || []
        /* if (conditionsCurList.length <= 0) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.conditions')))
        this.collapseWarningForConditions = true
        return
      } */
        const conditionsReq = conditionsCurList.find((item) => {
          const text = (item.conditions || '').trim()
          return text.length <= 0
        })
        if (conditionsReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.conditions')))
          this.collapseWarningForConditions = true
          return
        }
        this.collapseWarningForConditions = false
      }

      param.commonFileList = myFileIds
      param.productMsgType = param.productMsgTypeList.join(',')

      this.handleSetConditionsHtmlStr(true)
      param.conditions = this.form.conditions
      param.conditionsTableJson = this.form.conditionsTableJson

      if (this.form.isTotalAmountNegativeTips === '1') {
        this.$refs.ProductInfo.scrollPageToTotalAmount()
        return
      }

      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      if (!['Trading', 'Service'].includes(param.salesQuotationType)) {
        param.dropShipping = '0'
      }
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
        if (isConfirm) {
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
        } else {
          this.submitLoading = true
          submitFn(param)
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }

              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))

              setTimeout(() => {
                this.submitLoading = false
              }, 1000)
              if (gotoRoute && gotoRoute.name !== this.$route.name) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push(gotoRoute).catch(() => {})
              } else {
                this.back()
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      } else {
        let validSQRes = {}
        let isGotoLowStockAlertDlg = false
        if (
          ['Trading', 'Service'].includes(param.salesQuotationType) &&
          param.dropShipping !== '1'
        ) {
          this.submitLoading = true
          validSQRes = await checkSalesQuotationProductMsg(param).catch((err) => {
            return err
          })
          this.submitLoading = false
          if (validSQRes.code === 200 && validSQRes.data && validSQRes.data.length > 0) {
            isGotoLowStockAlertDlg = true
          }
        }

        if (isGotoLowStockAlertDlg) {
          this.$refs.lowStockAlertDlg.handleOpen(validSQRes.data, param)
          /*  */
          return
        }

        confirmMsg = this.getSQSubmitConfirm()
        successMsg = this.$t('SALES.SQSubmitSuccess')
        submitFn = saveSalesQuotation
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
    lowStockAlertSuccess(actionType) {
      if (actionType === 'submitLoading') {
        this.submitLoading = true
      }
      if (actionType === 'closeLoading') {
        this.submitLoading = false
      }
      if (actionType === 'closePage') {
        this.submitLoading = false
        this.back()
      }
    },
    // 滚动页面到表格的可视区域
    scrollPageToTable() {
      try {
        if (!this.$refs.collapseScrollPage) return
        const offsetTop = this.$refs.collapseScrollPage.offsetTop
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop - 50, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
    },
    scrollPageToTotalAmount(offsetTop) {
      try {
        if (!this.$refs.FormPageLayoutRef) return
        const pageContent = this.$refs.FormPageLayoutRef.$refs.pageContent
        if (pageContent) {
          pageContent.scrollTo({
            top: offsetTop, // pageContent 没有使用定位
            behavior: 'smooth' // 平滑滚动
          })
        }
      } catch (err) {}
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
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const list = detailList.filter((x) => x.productType === '3')
      if (list.length > 1 || (list.length === 1 && detailList.length > 1)) {
        this.$modal.msgError(this.$t('SALES.limitedSingleProduct'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !(item.productName || '').trim()
      })
      if (productNameReq) {
        // if (this.form.salesQuotationType === 'Project') {
        //   this.$refs.ProductInfo.requiredError('productName', 'Project')
        // } else {
        // }
        this.$refs.ProductInfo.requiredError('productName', 'productDetail')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        // if (this.form.salesQuotationType === 'Project') {
        //   this.$refs.ProductInfo.requiredError('uom', 'Project')
        // } else {
        // }
        this.$refs.ProductInfo.requiredError('uom', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      // 隐藏转化系数
      // const uomCoefficientReq = detailList.find((item) => {
      //   return !item.uomCoefficient
      // })
      // if (uomCoefficientReq) {
      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
      //   return valid
      // }

      if (!(this.form.salesQuotationType === 'Trading' && this.form.blanketOrder === '1')) {
        const qtyReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq) {
          this.$refs.ProductInfo.requiredError('qty', 'productDetail')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
          return valid
        }
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      // 临时产品并且没有审批状态时单价 unitPrice 非必填
      const unitPriceReq = detailList
        .filter((x) => x.isAdhocEntry !== '1')
        .find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
      if (unitPriceReq) {
        this.$refs.ProductInfo.requiredError('unitPrice', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$refs.ProductInfo.requiredError('deliveryDateForDay', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }
      /* const warrantyStartDateReq = detailList.find((item) => {
        return this.$resultOfBoolean(item.warranty) && !item.warrantyStartDate
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      } */

      return true
    },
    validConsignmentList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const list = detailList.filter((x) => x.productType === '3')
      if (list.length > 1 || (list.length === 1 && detailList.length > 1)) {
        this.$modal.msgError(this.$t('SALES.limitedSingleProduct'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.requiredError('qty', 'Consignment')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList
        .filter((x) => x.isAdhocEntry !== '1')
        .find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
      if (unitPriceReq) {
        this.$refs.ProductInfo.requiredError('unitPrice', 'Consignment')

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
        this.$refs.ProductInfo.requiredError('deliveryDateForDay', 'Consignment')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
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

      const unitPriceReq = detailList
        .filter((x) => x.isAdhocEntry !== '1')
        .find((item) => {
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
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }

      return true
    },

    validProductOrServiceList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !(item.productName || '').trim()
      })
      if (productNameReq) {
        this.$refs.ProductInfo.requiredError('productName', 'ServiceTypeProduct')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.requiredError('uom', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      // 隐藏转化系数
      // const uomCoefficientReq = detailList.find((item) => {
      //   return !item.uomCoefficient && item.productType !== '2'
      // })
      // if (uomCoefficientReq) {
      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
      //   return valid
      // }
      if (!(this.form.salesQuotationType === 'Trading' && this.form.blanketOrder === '1')) {
        const qtyReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq) {
          this.$refs.ProductInfo.requiredError('qty', 'ServiceTypeProduct')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
          return valid
        }
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      const unitPriceReq = detailList
        .filter((x) => x.isAdhocEntry !== '1')
        .find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
      if (unitPriceReq) {
        this.$refs.ProductInfo.requiredError('unitPrice', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$refs.ProductInfo.requiredError('deliveryDateForDay', 'ServiceTypeProduct')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }
      /* const warrantyStartDateReq = detailList.find((item) => {
        return this.$resultOfBoolean(item.warranty) && !item.warrantyStartDate
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      } */

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
    validMixDesignList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.mixDesignTableEmpty'))
        return valid
      }
      const salesPartNoReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.salesPartNo)
      })
      if (salesPartNoReq) {
        this.$refs.ProductInfo.requiredError('salesPartNo', 'mixDesign')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.salesPartNo'))
        )
        return valid
      }

      const volumeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.volume)
      })
      if (volumeReq) {
        this.$refs.ProductInfo.requiredError('volume', 'mixDesign')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.volume')))
        return valid
      }

      const unitPriceReq = detailList
        .filter((x) => x.isAdhocEntry !== '1')
        .find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
      if (unitPriceReq) {
        this.$refs.ProductInfo.requiredError('unitPrice', 'mixDesign')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.price')))
        return valid
      }
      const variationShowStrReq = detailList.find((item) => {
        return item.trialMix === '1' && !item.variationShowStr
      })
      if (variationShowStrReq) {
        this.$refs.ProductInfo.requiredError('variationShowStr', 'mixDesign')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.trialMixVariation'))
        )
        return valid
      }
      const passingRequirementsReq = detailList.find((item) => {
        return item.trialMix === '1' && !item.passingRequirements
      })
      if (passingRequirementsReq) {
        this.$refs.ProductInfo.requiredError('passingRequirements', 'mixDesign')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.passingRequirements'))
        )
        return valid
      }

      return true
    },
    validMixDesignServiceList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        // ERP 1.1.0-26-4 版本 改为选填
        return true
        // this.$modal.msgError(this.$t('SALES.projectTaskTableEmpty'))
        // return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList
        .filter((x) => x.isAdhocEntry !== '1')
        .find((item) => {
          return !this.$resultOfBoolean(item.unitPrice)
        })
      if (unitPriceReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))

        return valid
      }
      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.submitForm('save', false, gotoRoute)
    },
    handlePreviewPDF() {
      const token = getToken()
      this.handleSetConditionsHtmlStr()
      if (this.$refs.ProductInfo) {
        this.$refs.ProductInfo.handleCalculate('previewPDF')
      }
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
<style lang="scss" scoped>
.custom-form-item {
  margin-bottom: 0 !important;
  .custom-tip {
    // position: absolute;
    // top: 30px;
    width: 100%;
    line-height: 1.1;
    font-size: 12px;
    padding: 5px 0;
  }
}
</style>
