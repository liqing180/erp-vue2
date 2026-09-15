<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="getVarContentLoading"
        v-if="submitBtnShow && !approvedBtnShow"
        @click="submitForm"
        >{{ form.showSubmitType === '2' ? $t('SALES.requestQuote') : $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="getVarContentLoading"
        v-if="saveDraftBtnShow"
        @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="withdrawBtnShow" @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>

      <el-button type="primary" size="mini" v-if="generateQuoteBtnShow" @click="handleGenerateQuote"
        >{{ $t('menu.generateQuote') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="previewPDFShow"
        :loading="previewPDFLoading"
        @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison"
        >{{ $t('uiBtn.edit') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.salesInquiry') }}</div>
    </template>

    <template v-slot:content>
      <div>
        <div class="form-card mb10" v-if="isComparison">
          <div class="legend-bar">
            <span class="legend-text">{{ $t('ui.legend') }}</span>
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block add"></span>{{ $t('ui.added') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block edit"></span>{{ $t('ui.modified') }}</span
            >
            <span class="legend-divider"></span>
            <span class="legend-item"
              ><span class="color-block del"></span>{{ $t('ui.deleted') }}</span
            >
          </div>
        </div>

        <div
          class="form-card reject-card collapse-item-content-pt0 mb10"
          v-if="isComparison && (form.operationLogForLastReject || {}).operatorBy"
        >
          <el-collapse v-model="activeNames">
            <el-collapse-item name="11">
              <FormCollapseItemTitle slot="title" :title="$t('ui.rejectionOpinion')" />
              <div class="mb10">
                <div class="reject-remarks">
                  {{ (form.operationLogForLastReject || {}).operationDescription }}
                </div>
                <div class="reject-by">
                  {{ $t('ui.rejectedBy1') }}：{{
                    (form.operationLogForLastReject || {}).operatorBy
                  }}
                  |
                  {{ parseTime((form.operationLogForLastReject || {}).operatorTime, fmtForYmdhms) }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span class="info-item mr20" :title="form.businessPartnerName">
                  {{ $t('SALES.customerName') }} : {{ form.businessPartnerName }}
                </span>
                <span v-if="form.salesPersonBy" class="info-item mr20" :title="form.salesPersonBy">
                  {{ $t('SALES.salesPerson') }} : {{ form.salesPersonBy }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.sales_inquiry_status, form.salesInquiryStatus) }}
                </span>
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
                    <el-form-item
                      :label="`${$t('SALES.salesInquiryType')}`"
                      prop="salesInquiryType"
                    >
                      <el-select
                        v-model="form.salesInquiryType"
                        placeholder=""
                        disabled
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in dict.type.sales_inquiry_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.sales_inquiry_status, form.salesInquiryStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesInquiryNo')}`">
                      <el-input
                        v-model="form.salesInquiryNo"
                        :title="form.salesInquiryNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                      <SelectInput
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerCode')}`">
                      <el-input
                        v-model="form.businessPartnerNo"
                        :title="form.businessPartnerNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.taxRate')}`"
                      :class="[isModified('taxRate')]"
                    >
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId || disInQuotation || true"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <ComparisonInput
                        v-if="isModified('ourRef')"
                        :beforeValue="getBeforeValue('ourRef')"
                        :afterValue="getAfterValue('ourRef', form.ourRef)"
                      />
                      <el-input
                        v-else
                        :disabled="disInQuotation"
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <ComparisonInput
                        v-if="isModified('currency')"
                        :beforeValue="getBeforeValue('currency')"
                        :afterValue="getAfterValue('currency', form.currency)"
                      />
                      <CommonSelect
                        v-else
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
                    <!-- <el-form-item
                      :label="`${$t('ui.paymentMethod')}`"
                      prop="paymentMethodIdList"
                      :class="[isModified('paymentMethod')]"
                    >
                      <ToolTipShowList
                        :list="form.paymentMethodNameList || []"
                        :popoverTitle="$t('ui.paymentMethod')"
                      >
                        <CommonMultipleSelect
                          :disabled="disInQuotation"
                          :ids="form.paymentMethodIdList"
                          :labels="form.paymentMethodNameList"
                          :showTitle="false"
                          idKey="value"
                          labelKey="label"
                          :options="dict.type.business_partner_payment_method"
                          @change="paymentMethodChange"
                        />
                      </ToolTipShowList>
                    </el-form-item> -->
                    <el-form-item :label="`${$t('ui.paymentTerm')}`" prop="paymentTermId">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <ComparisonInput
                          v-if="isModified('paymentTermName') || isModified('paymentTermMsg')"
                          :beforeValue="getBeforeValue('paymentTermName')"
                          :afterValue="form.paymentTermName"
                          :showEditType="
                            isModified('paymentTermMsg') && !isModified('paymentTermName')
                          "
                        />
                        <div v-else class="input-switch-box">
                          <div class="con-left">
                            <!-- <SelectInput
                              :value="form.paymentTermName"
                              @clear="paymentTermChange({})"
                              clearable
                              @click="openPaymentTermDlg"
                              :disabled="!form.salesInquiryType || disInQuotation || comDisFrom"
                              class="form-wd"
                            /> -->

                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermList"
                              :disabled="!form.salesInquiryType || disInQuotation || comDisFrom"
                              :loading="paymentTermLoading"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                            />
                          </div>
                          <div
                            class="con-right"
                            v-if="
                              !comDisFrom &&
                              form.paymentTermName &&
                              checkPermi(['salesManagement:salesInquiry:editPaymentTerm']) &&
                              !disInQuotation
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
                  <!-- <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`" :class="[isModified('ourRef')]">
                      <el-input
                        :disabled="disInQuotation"
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="30"
                      ></el-input>
                    </el-form-item>
                  </el-col> -->

                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <ComparisonInput
                        v-if="isModified('yourRef')"
                        :beforeValue="getBeforeValue('yourRef')"
                        :afterValue="getAfterValue('yourRef', form.yourRef)"
                      />
                      <el-input
                        v-else
                        :disabled="disInQuotation"
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item
                      :label="`${$t('SALES.department')}`"
                      prop="departmentId"
                      :class="[isModified('departmentId')]"
                    >
                      <CommonSelect
                        :disabled="disInQuotation"
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
                    <el-form-item :label="`${$t('SALES.salesPerson')}`" prop="salesPersonBy">
                      <ComparisonInput
                        v-if="isModified('salesPersonBy')"
                        :beforeValue="getBeforeValue('salesPersonBy')"
                        :afterValue="getAfterValue('salesPersonBy', form.salesPersonBy)"
                      />
                      <!-- <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || disInQuotation"
                      /> -->

                      <CommonSelectAndList
                        v-else
                        :id="form.salesPersonId"
                        :label="form.salesPersonBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="salesPersonList"
                        :disabled="!form.departmentId || comDisFrom || disInQuotation"
                        :loading="salesPersonLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col
                    :span="8"
                    v-if="['Consignment', 'Service'].includes(form.salesInquiryType) && false"
                    key="priceType222"
                  >
                    <el-form-item
                      :label="`${$t('SALES.priceType')}`"
                      prop="priceTypeId"
                      :class="[isModified('priceTypeId')]"
                    >
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

                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <ComparisonInput
                        v-if="isModified('taxRate')"
                        :beforeValue="$numberStr(getBeforeValue('taxRate'), 1)"
                        :afterValue="$numberStr(form.taxRate, 1)"
                      />
                      <CommonSelect
                        v-else
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :disabled="!form.businessPartnerId || disInQuotation || true"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesInquiryType !== 'Trading'">
                    <el-form-item
                      :label="`${$t('SALES.leadTimeDays2')}`"
                      prop="deliveryDateForDay"
                      :rules="[
                        {
                          required: ['Consignment'].includes(form.salesInquiryType),
                          message: $t('ui.reqMsg'),
                          trigger: ['blur']
                        }
                      ]"
                      :key="'deliveryDateForDay' + form.salesInquiryType"
                    >
                      <ComparisonInput
                        v-if="isModified('deliveryDate')"
                        :beforeValue="getBeforeValue('deliveryDate')"
                        :afterValue="getAfterValue('deliveryDate', form.deliveryDate)"
                      />
                      <div v-else class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="form.salesInquiryType !== 'Project'"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                        <span
                          v-if="form.salesInquiryType === 'Project'"
                          class="mr5 ml5"
                          style="font-size: 12px; color: #606266"
                          >{{ $t('SALES.day') }}</span
                        >
                        <el-date-picker
                          v-if="form.salesInquiryType === 'Project'"
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
                  <el-col :span="8" v-if="form.salesInquiryType === 'Trading'">
                    <el-form-item
                      :label="`${$t('SALES.leadTimeDays2')}`"
                      prop="deliveryDateForDay"
                      :rules="[
                        {
                          required: !['1'].includes(form.salesInquiryStatus),
                          message: $t('ui.reqMsg'),
                          trigger: ['blur']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('deliveryDate')"
                        :beforeValue="getBeforeValue('deliveryDate')"
                        :afterValue="getAfterValue('deliveryDate', form.deliveryDate)"
                      />
                      <div v-else class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.deliveryDateForDay"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          controls-position="right"
                          style="width: 100%"
                          :controls="form.salesInquiryType !== 'Project'"
                          @change="deliveryDateChange('deliveryDateForDay')"
                        />
                        <span
                          v-if="form.salesInquiryType === 'Project'"
                          class="mr5 ml5"
                          style="font-size: 12px; color: #606266"
                          >{{ $t('SALES.day') }}</span
                        >
                        <el-date-picker
                          v-if="form.salesInquiryType === 'Project'"
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

                <el-row>
                  <template v-if="form.salesInquiryType === 'Consignment'">
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.consignmentStart')}`"
                        prop="consignmentStartTime"
                        :key="'StartTime' + form.salesInquiryType"
                      >
                        <ComparisonInput
                          v-if="isModified('consignmentStartTime')"
                          :beforeValue="getBeforeValue('consignmentStartTime')"
                          :afterValue="
                            getAfterValue('consignmentStartTime', form.consignmentStartTime)
                          "
                        />
                        <el-date-picker
                          v-else
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
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.consignmentEnd')}`"
                        prop="consignmentEndTime"
                        :key="'EndTime' + form.salesInquiryType"
                      >
                        <ComparisonInput
                          v-if="isModified('consignmentEndTime')"
                          :beforeValue="getBeforeValue('consignmentEndTime')"
                          :afterValue="getAfterValue('consignmentEndTime', form.consignmentEndTime)"
                        />
                        <el-date-picker
                          v-else
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
                  </template>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.validityDays')}`" prop="validityForDay">
                      <ComparisonInput
                        v-if="isModified('validityForDay')"
                        :beforeValue="getBeforeValue('validityForDay')"
                        :afterValue="getAfterValue('validityForDay', form.validityForDay)"
                      />
                      <el-input-number
                        v-else
                        v-thousandSplit="{ precision: 0 }"
                        v-model="form.validityForDay"
                        :disabled="disInQuotation"
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
                          :disabled="disInQuotation"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          :controls="false"
                          style="width: 30%"
                          @change="validityChange('validityForDay')"
                        />
                        <span class="mr5 ml5" style="font-size: 12px; color: #606266">{{
                          $t('SALES.day')
                        }}</span>
                        <el-date-picker
                          :disabled="disInQuotation"
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
                  <el-col
                    :span="8"
                    v-if="form.salesInquiryType === 'Project'"
                    key="costProjectCode11"
                  >
                    <el-form-item
                      :label="`${$t('SALES.projectCode')}`"
                      prop="costProjectId"
                      :rules="[
                        {
                          required: true,
                          message: $t('ui.reqMsg'),
                          trigger: ['blur']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('costProjectCode')"
                        :beforeValue="getBeforeValue('costProjectCode')"
                        :afterValue="getAfterValue('costProjectCode', form.costProjectCode)"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        clearable
                        filterable
                        :disabled="!form.businessPartnerId || disInQuotation || comDisFrom"
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        @change="costProjectNameChange"
                        @handleOpen="openCostProjectNameTable"
                      />
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
                      <ComparisonInput
                        v-if="isModified('customerQuestionnaireNo')"
                        :beforeValue="getBeforeValue('customerQuestionnaireNo')"
                        :afterValue="
                          getAfterValue('customerQuestionnaireNo', form.customerQuestionnaireNo)
                        "
                      />
                      <div v-else class="input-switch-box">
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

                <el-row v-if="form.salesInquiryType === 'Project' && false">
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('SALES.productInfo')}`"
                      prop="productMsgTypeList"
                      :class="[isModified('productMsgType')]"
                    >
                      <el-checkbox-group
                        :disabled="disInQuotation"
                        v-model="form.productMsgTypeList"
                        style="height: 36px"
                      >
                        <el-checkbox label="1">{{ $t('SALES.materialList') }}</el-checkbox>
                        <el-checkbox label="2">{{ $t('SALES.projectTask') }}</el-checkbox>
                        <el-checkbox label="3">{{ $t('SALES.projectCost') }}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row
                  v-if="['Trading', 'Service'].includes(form.salesInquiryType)"
                  key="priceType11"
                >
                  <el-col
                    :span="8"
                    v-if="['Trading'].includes(form.salesInquiryType) && false"
                    key="priceType111"
                  >
                    <el-form-item
                      :label="`${$t('SALES.priceType')}`"
                      prop="priceTypeId"
                      :class="[isModified('priceTypeId')]"
                    >
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

                  <el-col :span="8" v-if="form.salesInquiryType === 'Trading' && false">
                    <el-form-item
                      :label="`${$t('SALES.priceTbd2')}`"
                      :class="[isModified('priceTbd')]"
                    >
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        @change="priceTbdChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8" v-if="form.salesInquiryType === 'Service' && false">
                    <el-form-item
                      :label="`${$t('SALES.priceTbd')}`"
                      :class="[isModified('priceTbd')]"
                    >
                      <el-switch
                        v-model="form.priceTbd"
                        active-value="1"
                        inactive-value="0"
                        @change="priceTbdChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('basicRemarks')]">
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
                <el-row v-if="['Trading', 'Service'].includes(form.salesInquiryType)">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.dropShipping')}`"
                      :class="[isModified('dropShipping')]"
                    >
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
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
                :title="$t('SALES.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span v-if="form.incotermName" class="info-item mr20" :title="form.incotermName">
                  {{ $t('SALES.incoterm') }} : {{ form.incotermName }}
                </span>
                <span
                  v-if="form.receiveAddressName"
                  class="info-item mr20"
                  :title="form.receiveAddressName"
                >
                  {{ $t('ui.address') }} : {{ form.receiveAddressName }}
                </span>
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
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item :label="`${$t('SALES.incoterm')}`" prop="incotermId">
                      <ComparisonInput
                        v-if="isModified('incotermName')"
                        :beforeValue="getBeforeValue('incotermName')"
                        :afterValue="getAfterValue('incotermName', form.incotermName)"
                      />
                      <CommonSelect
                        v-else
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        @change="incotermIdChange"
                        :disabled="!form.businessPartnerId || comDisFrom || disInQuotation"
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
                      <ComparisonInput
                        v-if="isModified('receivePortName')"
                        :beforeValue="getBeforeValue('receivePortName')"
                        :afterValue="getAfterValue('receivePortName', form.receivePortName)"
                      />
                      <el-input
                        v-else-if="form.incotermAddressType === '0'"
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
                            !form.businessPartnerId ||
                            comDisFrom ||
                            disInQuotation
                          "
                          :loading="portLoading"
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openPortTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>

                  <!-- 隐藏仓库名称字段, 后端该字段自动填充当前法人的默认仓库， 2.0.9-14: 91行 -->
                  <el-col :span="8" v-if="form.salesInquiryType === 'Consignment'">
                    <el-form-item :label="`${$t('SALES.warehouseName')}`" prop="warehouseName">
                      <ComparisonInput
                        v-if="isModified('warehouseName')"
                        :beforeValue="getBeforeValue('warehouseName')"
                        :afterValue="getAfterValue('warehouseName', form.warehouseName)"
                      />
                      <ToolTipShowObj
                        v-else
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.warehouseName"
                        :rows="warehouseRows"
                      >
                        <!-- <SelectInput
                          clearable
                          :value="form.warehouseName"
                          @click="openWarehouseTable"
                          @clear="warehouseClear"
                          :disabled="comDisFrom || disInQuotation"
                        /> -->

                        <CommonSelectAndList
                          :id="form.warehouseId"
                          :label="form.warehouseName"
                          idKey="warehouseId"
                          labelKey="warehouseName"
                          filterable
                          :options="warehouseList"
                          :disabled="comDisFrom || disInQuotation"
                          :loading="warehouseLoading"
                          @change="updateWarehouse"
                          @handleOpen="openWarehouseTable"
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
                    >
                      <ComparisonInput
                        v-if="isModified('receiveAddress')"
                        :beforeValue="getBeforeValue('receiveAddress')"
                        :afterValue="
                          getAfterValue(
                            'receiveAddress',
                            form.receiveAddress || form.receiveAddressName
                          )
                        "
                      />
                      <div v-else class="input-switch-box">
                        <div class="con-left">
                          <!-- <SelectInput
                            :value="form.receiveAddressName"
                            :title="form.receiveAddressName"
                            @clear="receiveAddressClear(true)"
                            clearable
                            @click="openReceiveAddressTable"
                            :disabled="
                              !form.businessPartnerId ||
                              form.incotermAbbreviation === 'EXW' ||
                              comDisFrom ||
                              disInQuotation
                            "
                            class="form-wd"
                          /> -->

                          <CommonSelectAndList
                            :id="form.receiveAddressId"
                            :label="form.receiveAddress || form.receiveAddressName"
                            idKey="businessAddressId"
                            labelKey="receiveAddress"
                            filterable
                            :options="businessAddressList"
                            :disabled="
                              !form.businessPartnerId ||
                              form.incotermAbbreviation === 'EXW' ||
                              comDisFrom ||
                              disInQuotation
                            "
                            :loading="receiveAddressLoading"
                            @change="updateAddress"
                            @handleOpen="openReceiveAddressTable"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="
                            !(
                              !form.businessPartnerId ||
                              form.incotermAbbreviation === 'EXW' ||
                              comDisFrom ||
                              disInQuotation
                            )
                          "
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
                      <ComparisonInput
                        v-if="isModified('district')"
                        :beforeValue="getBeforeValue('district')"
                        :afterValue="getAfterValue('district', form.district)"
                      />
                      <el-input
                        v-else
                        :value="form.district"
                        :title="form.district"
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
                      <ComparisonInput
                        v-if="isModified('bpContactPersonName')"
                        :beforeValue="getBeforeValue('bpContactPersonName')"
                        :afterValue="getAfterValue('bpContactPersonName', form.bpContactPersonName)"
                      />
                      <div v-else class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId || disInQuotation"
                            :id="form.bpContactPersonId"
                            :label="form.bpContactPersonName"
                            :title="form.bpContactPersonName"
                            idKey="contactPersonId"
                            labelKey="contactPersonName"
                            :options="
                              (form.bpBusinessContactPersonList || []).filter(
                                (p) => p.isActive === '1'
                              )
                            "
                            @change="contactPersonChange"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="!(!form.businessPartnerId || disInQuotation || comDisFrom)"
                        >
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
                      <ComparisonInput
                        v-if="isModified('bpEmail')"
                        :beforeValue="getBeforeValue('bpEmail')"
                        :afterValue="getAfterValue('bpEmail', form.bpEmail)"
                      />
                      <el-input
                        v-else
                        v-model="form.bpEmail"
                        :title="form.bpEmail"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <ComparisonInput
                        v-if="isModified('bpMobilePhone')"
                        :beforeValue="getBeforeValue('bpMobilePhone')"
                        :afterValue="getAfterValue('bpMobilePhone', form.bpMobilePhone)"
                      />
                      <el-input
                        v-else
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
                      <ComparisonInput
                        v-if="isModified('consignee')"
                        :beforeValue="getBeforeValue('consignee')"
                        :afterValue="getAfterValue('consignee', form.consignee)"
                      />
                      <el-input
                        v-else
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
          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <span v-if="$resultOfBoolean(form.totalAmount)" class="info-item mr20">
                  {{ $t('SALES.totalAmount') }} : {{ $numberStr(form.totalAmount, 2) }}
                </span>
                <span v-if="$resultOfBoolean(form.totalTaxAmount)" class="info-item">
                  {{ $t('SALES.taxAmount') }} : {{ $numberStr(form.totalTaxAmount, 2) }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  :salesInquiryType="form.salesInquiryType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  :basicUpdateMsgList="basicUpdateMsgList"
                  @returnSubmitSuccess="back"
                  @deliveryDateForDayChange="deliveryDateChange('deliveryDateForDay', true)"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
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
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :varContentData="varContentData"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="5">
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
    <selectCustomerTable ref="selectCustomerTable" @update="updateSupplier" />
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
      :salesInquiryType="form.salesInquiryType"
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
      :menuPerms="menuKey.salesInquiry"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />

    <ApprovedDialog
      :id="form.salesInquiryId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="salesInquiry"
    />
    <RejectDialog
      :id="form.salesInquiryId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesInquiryId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg module-key="salesInquiry" ref="RevisionComparisonDlg" />

    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />

    <selectCostProjectTable
      ref="selectCostProjectTable"
      :businessPartnerId="form.businessPartnerId"
      @update="costProjectNameChange"
    />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAllTaxForSales } from '@/api/system/tax'
import { preview } from '@/api/purchaseManagement/purchaseOrder'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'

import {
  saveSalesInquiry,
  saveDraftSalesInquiry,
  querySalesInquiryById,
  approvedSalesInquiry,
  rejectedSalesInquiry,
  cancelledSalesInquiry,
  withdrawSalesInquiry,
  withdrawApproved,
  generateSalesQuotation,
  queryBPCustomerQuestionnaireListNoPage,
  queryCustomerPriceTypeList,
  dealAddProductMsgAndCalculate,
  conversionCurrencyUnitPrice,
  submitButtonJudgmentDisplay,
  queryCanSelectWarehouseListHaveDataPermissions
} from '@/api/salesManagement/salesInquiry'
import { getFormattedVarContent } from '@/api/salesManagement/salesQuotation'
import { getToken } from '@/utils/auth'
import {
  queryPaymentTermListByPaymentTermPurpose,
  queryPaymentTermListByPaymentTermPurposeForPage
} from '@/api/system/paymentTerm'
import { queryCanSelectCostProjectList } from '@/api/projectManagement/project'
import { getSystemSetup } from '@/api/system/systemSetting'

import { queryUsers } from '@/api/organization/corporate'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'
import selectCustomerTable from './components/selectCustomerTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'
import addBPAddressDlg from '@/views/salesManagement/salesInquiry/components/addBPAddressDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'

import selectWarehouseTable from './components/selectWarehouseTable.vue'
import ProductInfo from './productInfo/productInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import ConditionsTable from '@/views/salesManagement/salesQuotation/conditionsTable.vue'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
import { formDirtyClass } from '@/mixins/formDirtyClass'
import selectCostProjectTable from '@/views/projectManagement/projectProduction/components/selectCostProjectTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['sales_inquiry_type', 'sales_inquiry_status', 'business_partner_payment_method'],
  components: {
    selectCustomerTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    payToAddressDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    ProductInfo,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    previewQuestionnaireTemplateDlg,
    ConditionsTable,
    selectCostProjectTable
  },
  data() {
    return {
      paymentTermLoading: false,
      salesPersonLoading: false,
      portLoading: false,
      warehouseLoading: false,
      receiveAddressLoading: false,
      businessAddressList: [],
      warehouseList: [],
      salesPersonList: [],
      paymentTermList: [],
      salesConditionsList: [],
      varContentData: {},
      getVarContentLoading: false,
      previewPDFLoading: false,
      activeNames: ['1', '2', '3', '4', '5', '11'],
      rowId: '',
      timeId: '',
      submitLoading: false,

      form: {
        salesInquiryProductList: [],
        salesInquiryProjectList: [],
        salesInquiryServiceList: [],
        projectCostDetailList: [],
        productMsgTypeList: [],
        conditionsTableList: [],
        productOrServiceList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForConditions: false,
      rules: {
        salesInquiryType: [
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
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
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
      purpose: {
        Trading: '3', // 贸易
        Service: '4', // 服务
        Project: '5', // 项目
        MixDesign: '6', // 混凝土产品
        Consignment: '7' // 寄卖
      },
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      portOptions: [],
      taxRateOptions: [],
      priceTypeOptions: [],
      /* 表格部分 */
      initCommonFileList: [],

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanSeeUpdateMsg: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
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

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedSalesInquiry,
      rejectedUrl: rejectedSalesInquiry,
      cancelledUrl: cancelledSalesInquiry,
      approvedFormData: undefined,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      commonFileListCur: [],
      salesInquiryProductListCur: [],
      salesInquiryProjectListCur: [],
      salesInquiryServiceListCur: [],
      productOrServiceListCur: [],
      projectCostDetailListCur: [],
      projectNameOptions: [],
      costProjectNameLoading: false
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
    /* 是否是本地交易 */
    isLocalSales() {
      return this.form.country === this.legalEntityInfo.country
    },
    comPurPosList() {
      const purpose = {
        Trading: '3', // 贸易
        Trading2: '3-2', // 贸易-国际
        Service: '4', // 服务
        Project: '10', // 项目
        Project1: '8', // 项目-本地
        Project2: '8-2', // 项目-国际
        MixDesign: '6', // 混凝土产品
        Consignment: '7' // 寄卖
      }
      let key = this.form.salesInquiryType
      if (this.form.salesInquiryType === 'Trading') {
        /* 国际交易 */
        if (!this.isLocalSales) {
          key = this.form.salesInquiryType + '2'
        }
      }
      if (this.form.salesInquiryType === 'Project') {
        if (!this.isLocalSales) {
          key = this.form.salesInquiryType + '2'
        } else {
          key = this.form.salesInquiryType + '1'
        }
      }
      const list = [purpose[key]]
      /* 项目的有一个不管是否国际交易都可选择的类型 */
      if (this.form.salesInquiryType === 'Project') {
        list.push(purpose.Project)
      }
      return list
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesInquiry:edit'])
    },
    comSalesConditionsList() {
      if (!this.form.salesInquiryType || !this.form.country) {
        return []
      }
      let type = this.form.salesInquiryType
      if (this.form.salesInquiryType === 'Trading') {
        /* 国际交易 */
        if (!this.isLocalSales) {
          type = this.form.salesInquiryType + '-2'
        }
      }
      let list = JSON.parse(JSON.stringify(this.salesConditionsList || []))
      list = list.filter((item) => {
        return (item.purposeList || []).includes(type)
      })
      return this.groupAndAddHideLabel(list)
    },

    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesInquiryId &&
        [this.buttonAuthMsg.isCanUpdate, this.buttonAuthMsg.isCanSaveDraft].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    disInQuotation() {
      return this.form.salesInquiryStatus === '4'
    },
    submitBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesInquiryId && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    isShowEditBtn() {
      if (!this.editAuth) {
        return false
      }
      return (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
      ) {
        show = true
      }
      return show
    },
    generateQuoteBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:generateQuote'])) {
        return false
      }
      let show = false
      if (this.form.salesInquiryId && this.buttonAuthMsg.isCanGenerateQuote === '1') {
        show = true
      }
      return show
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:withdraw'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanWithdraw === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.salesInquiryId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:salesInquiry:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesInquiryId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
      ) {
        show = true
      }
      return show
    },

    modifyHighlight() {
      return (
        this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.isComparison
      )
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    queryPaymentTermListByPaymentTermPurposeForPage() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      param.paymentTermPurposeList = this.comPurPosList
      param.businessPartnerId = this.form.businessPartnerId
      param.menuPerms = this.menuKey.salesInquiry

      this.$trimOfObj(param)
      this.paymentTermLoading = true
      queryPaymentTermListByPaymentTermPurposeForPage(param)
        .then((response) => {
          this.loading = false
          const list = response.rows || []
          this.paymentTermList = list
          this.paymentTermLoading = false
        })
        .catch((err) => {
          this.paymentTermLoading = false
          window.console.error(err)
        })
    },

    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesInquiry,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      this.salesPersonLoading = true
      queryUsers(param)
        .then((response) => {
          this.salesPersonList = response.rows || []
          this.salesPersonLoading = false
        })
        .catch((err) => {
          this.salesPersonLoading = false
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

    queryCanSelectWarehouseListHaveDataPermissions() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.salesInquiry
      }
      this.$trimOfObj(param)
      if (this.form.salesInquiryType === 'Consignment') {
        param.businessPartnerId = this.form.businessPartnerId
        param.warehouseType = '3'
      } else {
        param.warehouseType = '1'
      }
      this.warehouseLoading = true
      queryCanSelectWarehouseListHaveDataPermissions(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseLoading = false
        })
        .catch((err) => {
          this.warehouseLoading = false
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
      console.log(list)

      return list
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
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.salesInquiryId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleView() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.getSystemSetup()
      querySalesInquiryById({
        salesInquiryId: rowId,
        taskId: this.taskId || this.form.taskId
      }).then((res) => {
        const data = res.data || {}
        data.salesInquiryProductList = data.salesInquiryProductList || []
        if (data.salesInquiryType !== 'Project') {
          data.salesInquiryProductList.forEach((item) => {
            if (!item.salesPartId) {
              item.salesPartId = item.salesInquiryProductId
            }
          })
        } else {
          const handlerSalesInquiryProductList = (list) => {
            let rowTimeId = Date.now()
            const handleList = (currentList, customIndex = 0) => {
              currentList.forEach((item) => {
                this.$set(item, 'isEdit', true)
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
              this.$set(item, 'isEdit', true)
              handleList([item], 0)
            })
          }
          handlerSalesInquiryProductList(data.salesInquiryProductList || [])
        }
        data.salesInquiryProjectList = data.salesInquiryProjectList || []
        data.salesInquiryServiceList = (data.salesInquiryServiceList || []).map((item) => {
          if (item.isTemp === '1') {
            item.customId = item.salesInquiryServiceId
          }
          return item
        })

        data.productOrServiceList = (data.productOrServiceList || []).map((item) => {
          item.rowTimeId = item.salesInquiryProductId || item.salesInquiryServiceId
          if (item.isTemp === '1') {
            item.customId = item.salesInquiryServiceId
          }
          return item
        })

        data.projectCostDetailList = data.projectCostDetailList || []

        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }

        const bpBusinessAddress = data.bpBusinessAddress || {}
        if (bpBusinessAddress.isAdhocEntryAddress === '1') {
          this.$set(data, 'bpBusinessAddressOldData', bpBusinessAddress)
        }

        data.productMsgTypeList = data.productMsgType ? data.productMsgType.split(',') : []

        if (data.conditionsTableJson) {
          data.conditionsTableList = JSON.parse(data.conditionsTableJson)
        }

        this.form = data
        this.getFormattedVarContentFn()

        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        this.initVersionComparison(data)

        setTimeout(() => {
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveDraftBtnShow,
            submitShow: true,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 300)
        this.queryCustomerQuestionnaire()
        this.queryPaymentTermListByPaymentTermPurpose('init')
        this.queryAllTaxForSales()
        this.queryCustomerPriceTypeList()
        if (this.form.salesInquiryType === 'Project') {
          this.queryCanSelectCostProjectList()
        }

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
        this.submitButtonJudgmentDisplay()

        this.queryCanSelectWarehouseListHaveDataPermissions()
        this.queryUsers()
        this.queryAddressByBusinessPartnerId()
        this.queryPaymentTermListByPaymentTermPurposeForPage()
        this.queryCanSelectPortList()
      })
    },
    initVersionComparison(data) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const onlyDeleted = (list) => cloneList(list).filter((item) => item.updateType === '3')
      const markDeletedTree = (list, customIndex = 0) => {
        list.forEach((item) => {
          item.updateType = '3'
          item.customIndex = customIndex
          if (item.childProductList && item.childProductList.length > 0) {
            markDeletedTree(item.childProductList, customIndex + 1)
          }
        })
        return list
      }
      let rowTimeId = Date.now()
      const setRowTimeId = (list) => {
        list.forEach((item) => {
          rowTimeId++
          item.rowTimeId =
            item.rowTimeId ||
            item.salesInquiryProductId ||
            item.salesInquiryServiceId ||
            item.salesInquiryProjectId ||
            `comparison-${rowTimeId}`
          if (item.childProductList && item.childProductList.length > 0) {
            setRowTimeId(item.childProductList)
          }
        })
        return list
      }

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      if (
        (updateMsg.beforeCommonFileList || []).length > 0 ||
        (updateMsg.afterCommonFileList || []).length > 0
      ) {
        this.basicUpdateProps.push('attachment')
      }

      this.commonFileListCur = cloneList(data.commonFileList)
      this.salesInquiryProductListCur = cloneList(data.salesInquiryProductList)
      this.salesInquiryProjectListCur = cloneList(data.salesInquiryProjectList)
      this.salesInquiryServiceListCur = cloneList(data.salesInquiryServiceList)
      this.productOrServiceListCur = cloneList(data.productOrServiceList)
      this.projectCostDetailListCur = cloneList(data.projectCostDetailList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      const deletedProjectList = setRowTimeId(onlyDeleted(updateMsg.beforeProjectList))
      const deletedProductOrServiceList = setRowTimeId(
        markDeletedTree(onlyDeleted(updateMsg.beforeProductOrServiceList))
      )
      const comparisonProductList = cloneList(this.salesInquiryProductListCur)
      const comparisonProjectList = [
        ...cloneList(this.salesInquiryProjectListCur),
        ...deletedProjectList
      ]
      const comparisonProductOrServiceList = cloneList(this.productOrServiceListCur)

      if (!['Trading', 'Service'].includes(data.salesInquiryType)) {
        comparisonProductList.push(...deletedProductOrServiceList)
      } else {
        comparisonProductOrServiceList.push(...deletedProductOrServiceList)
      }

      this.$set(
        this.form,
        'salesInquiryProductList',
        this.isComparison ? comparisonProductList : cloneList(this.salesInquiryProductListCur)
      )
      this.$set(
        this.form,
        'salesInquiryProjectList',
        this.isComparison ? comparisonProjectList : cloneList(this.salesInquiryProjectListCur)
      )
      this.$set(
        this.form,
        'productOrServiceList',
        this.isComparison ? comparisonProductOrServiceList : cloneList(this.productOrServiceListCur)
      )
      this.initCommonFileList = this.isComparison
        ? [...cloneList(this.commonFileListCur), ...onlyDeleted(updateMsg.beforeCommonFileList)]
        : cloneList(this.commonFileListCur)
    },
    getFormJson() {
      const param = { ...this.form }
      param.commonFileList = this.$refs.ProductInfo && this.$refs.ProductInfo.getFileIds()
      return JSON.stringify(param)
    },
    submitButtonJudgmentDisplay() {
      if (this.form.salesInquiryType !== 'Trading') {
        this.$set(this.form, 'showSubmitType', '1')
        return
      }
      if (this.form.salesInquiryStatus === '4') {
        this.$set(this.form, 'showSubmitType', '1')
        return
      }
      if (!this.form.productOrServiceList.length === 0) {
        this.$set(this.form, 'showSubmitType', '1')
        return
      }
      submitButtonJudgmentDisplay(this.form).then((res) => {
        const data = res.data || {}
        this.$set(this.form, 'showSubmitType', data.showSubmitType)
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          showSubmitType: data.showSubmitType
        })
      })
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        const salesConditions = data.salesConditions || ''
        this.salesConditionsList = salesConditions ? JSON.parse(salesConditions) : []
      })
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
    // 取消按钮
    back(type) {
      this.$emit('back', type)
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
    reset() {
      this.form = {
        /* 基础信息 */
        salesInquiryType: undefined,
        salesInquiryNo: undefined,
        businessPartnerName: undefined,
        salesInquiryStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
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
        validityForDay: 30,
        validity: Date.now() + 30 * 24 * 3600 * 1000,
        deliveryDateForDay: undefined,
        deliveryDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        priceTypeId: undefined,
        priceTypeName: undefined,
        basicRemarks: undefined,
        productMsgTypeList: [],
        dropShipping: '0',
        priceTbd: '0', // 价格另议
        isUpdateAmount: '0', // 是否用户编辑过 subTotal

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesInquiryProductList: [],
        salesInquiryProjectList: [],
        salesInquiryServiceList: [],
        productOrServiceList: [],
        projectCostDetailList: [],
        conditionsTableList: [],
        consignmentStartTime: undefined,
        consignmentEndTime: undefined,
        showSubmitType: '1'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForConditions = false
      this.initCommonFileList = []
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.commonFileListCur = []
      this.salesInquiryProductListCur = []
      this.salesInquiryProjectListCur = []
      this.salesInquiryServiceListCur = []
      this.productOrServiceListCur = []
      this.projectCostDetailListCur = []
      this.salesConditionsList = []
      this.varContentData = {}
      this.activeNames = ['1', '2', '3', '4', '5', '11']
      this.$nextTick(() => {
        this.resetForm('form1')
        this.resetForm('form2')
      })
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
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
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.$set(this.form, 'salesInquiryProductList', [])
      if (this.form.salesInquiryType === 'Consignment') {
        this.warehouseClear()
      }
      this.customerQuestionnaireClear()
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.contactPersonClear()
      this.costProjectNameChange()
    },
    updateSupplier(row) {
      if (row.bpBusinessAddressList && row.bpBusinessAddressList.length > 0) {
        const registeredAddress =
          row.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
        this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      }
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      this.$set(this.form, 'businessPartnerType', row.businessPartnerType)
      const account = row.bpBusinessAccountCustomer || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'currencySymbol', account.currencySymbol)

      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      if (this.form.salesInquiryType === 'Consignment') {
        this.warehouseClear()
      }
      this.customerQuestionnaireClear()
      // this.queryCustomerQuestionnaire()
      this.taxRateChange({})
      this.queryAllTaxForSales()
      this.contactPersonClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find(
          (item) => item.isSalesDefault === '1' && item.isActive === '1'
        )
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      this.$set(this.form, 'salesInquiryProductList', [])
      if (this.form.salesInquiryType === 'Project') {
        this.queryCanSelectCostProjectList()
      } else {
        this.costProjectNameChange()
      }
    },
    queryCustomerQuestionnaire() {
      queryBPCustomerQuestionnaireListNoPage({
        businessPartnerId: this.form.businessPartnerId,
        createdType: 'SI',
        salesInquiryId: this.form.salesInquiryId,
        menuPerms: this.menuKey.salesInquiry
      }).then((res) => {
        this.customerQuestionnaireOptions = res.data || []
      })
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
    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.salesInquiry }).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)

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
      this.$set(this.form, 'currencySymbol', row.currencySymbol)

      if (
        this.form.salesInquiryProductList.length > 0 ||
        this.form.salesInquiryServiceList.length > 0 ||
        this.form.productOrServiceList.length > 0
      ) {
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        conversionCurrencyUnitPrice({
          ...this.form,
          oldCurrencyId: oldCurrencyId,
          currencyId: row.id,
          salesInquiryProductList: this.form.salesInquiryProductList,
          salesInquiryServiceList: this.form.salesInquiryServiceList,
          productOrServiceList: this.form.productOrServiceList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
            const data = res.data || {}
            const { salesInquiryProductList } = data
            const handlerSalesInquiryProductList = (list) => {
              const handleList = (currentList, customIndex = 0) => {
                currentList.forEach((item) => {
                  // 每条记录都生成唯一的 rowTimeId
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
                handleList([item], 0)
              })
            }
            handlerSalesInquiryProductList(salesInquiryProductList || [])
            this.$set(this.form, 'salesInquiryProductList', salesInquiryProductList || [])
            this.$set(this.form, 'salesInquiryServiceList', data.salesInquiryServiceList || [])
            this.$set(this.form, 'productOrServiceList', data.productOrServiceList || [])

            this.$refs.ProductInfo.handleCalculate()
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
      this.$set(this.form, 'salesInquiryProductList', [])
      this.$set(this.form, 'salesInquiryServiceList', [])
      this.$set(this.form, 'productOrServiceList', [])
    },
    queryPaymentTermListByPaymentTermPurpose(type) {
      this.paymentTermOptions = []
      if (!this.form.salesInquiryType) {
        return
      }

      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurposeList: this.comPurPosList,
        menuPerms: this.menuKey.salesInquiry,
        businessPartnerId: this.form.businessPartnerId
      }).then((res) => {
        console.log(res)
        this.paymentTermOptions = res.data || []
        const defaultPaymentTerm = this.paymentTermOptions.find((item) => item.isDefault === '1')
        if (defaultPaymentTerm && !this.form.paymentTermId) {
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
      this.getFormattedVarContentFn()
      if (type && type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          paymentTermId: row.paymentTermId,
          paymentTermName: row.paymentTermName,
          paymentTerm: row
        })
      }
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
    deliveryDateChange(changeType, isRowChangeEmit = false) {
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
      if (!isRowChangeEmit) {
        this.form.salesInquiryProductList.forEach((item) => {
          this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
        })
        this.form.productOrServiceList.forEach((item) => {
          this.$set(item, 'deliveryDateForDay', this.form.deliveryDateForDay)
        })
      }

      this.getFormattedVarContentFn()
    },
    // 查询BP可以选择的价格类型:
    queryCustomerPriceTypeList() {
      if (!this.form.businessPartnerId) {
        this.priceTypeOptions = []
        return
      }
      queryCustomerPriceTypeList({
        businessPartnerId: this.form.businessPartnerId,
        customerGroup: this.form.customerGroup
      }).then((res) => {
        this.priceTypeOptions = res.data || []
      })
    },
    // 项目名称
    queryCanSelectCostProjectList() {
      this.costProjectNameLoading = true
      queryCanSelectCostProjectList({ businessPartnerId: this.form.businessPartnerId })
        .then((response) => {
          this.projectNameOptions = response.data || []
          this.costProjectNameLoading = false
        })
        .catch((err) => {
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
      }
      if (this.form.salesInquiryType !== 'Project') {
        this.$set(this.form, 'salesInquiryProductList', [])
      }
    },
    priceTypeChange(item) {
      if (!item.priceTypeId) {
        this.$set(this.form, 'priceTypeId', undefined)
        this.$set(this.form, 'priceTypeName', undefined)
        return
      }
      if (this.form.salesInquiryProductList.length > 0) {
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
      if (this.form.salesInquiryProductList.length > 0 && this.form.priceTypeId) {
        this.form.salesInquiryProductList.forEach((item) => {
          this.$set(item, 'unitPrice', undefined)
          this.$set(item, 'discount', undefined)
          this.$set(item, 'lineTotal', undefined)
          this.$set(item, 'salesCost', undefined)
          this.$set(item, 'salesProfit', undefined)
        })
        const tableTimer = Date.now()
        this.tableTimer = tableTimer
        this.$set(this.form, 'tableLoading', true)
        dealAddProductMsgAndCalculate({
          ...this.form,
          salesInquiryProductList: this.form.salesInquiryProductList
        })
          .then((res) => {
            if (this.tableTimer !== tableTimer) return
            this.$set(this.form, 'tableLoading', false)
            const data = res.data || {}
            this.$set(this.form, 'subTotal', data.subTotal)
            this.$set(this.form, 'subTotalOnlyProduct', data.subTotalOnlyProduct)
            this.$set(this.form, 'expenseAmount', data.expenseAmount)
            this.$set(this.form, 'expenseItemList', data.expenseItemList)
            this.$set(this.form, 'totalFreight', data.totalFreight)
            this.$set(this.form, 'totalTaxAmount', data.totalTaxAmount)
            this.$set(this.form, 'totalAmount', data.totalAmount)
            this.$set(this.form, 'salesInquiryProductList', data.salesInquiryProductList || [])
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
      this.portLoading = true
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 9999,
        firstCountryId,
        firstCountry,
        firstCity
      })
        .then((res) => {
          this.portOptions = res.rows || []
          this.portLoading = false
        })
        .catch(() => {
          this.portLoading = false
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
      if (row.isAdhocEntryContactPerson === '1') {
        this.$set(this.form, 'bpBusinessContactPerson', row)
        this.$set(this.form, 'isAdhocEntryContactPerson', '1')
      } else {
        this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
        this.$set(this.form, 'bpBusinessContactPerson', undefined)
      }
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
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId || undefined)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')
      if (row.contactPersonId) {
        const showList = this.form.bpBusinessContactPersonList || []
        const index = showList.findIndex((x) => x.contactPersonId === row.contactPersonId)
        if (index >= 0) {
          showList.splice(index, 1, row)
        }
      }
    },
    /* 表单部分End */
    getSISubmitConfirm() {
      const bpBusinessAddress = this.form.bpBusinessAddress || {}
      if (
        this.form.incotermAddressType === '2' &&
        bpBusinessAddress.country &&
        this.legalEntityInfo.country !== bpBusinessAddress.country
      ) {
        return this.$t('SALES.SIinternationalTransactionsSubmitConfirm')
      } else {
        return this.$t('SALES.SISubmitConfirm')
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
    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
      if (myFileIds === false) {
        return
      }
      let valid1 = false
      let valid2 = false
      if (submitType === 'save') {
        valid1 = true
        valid2 = true
        this.$refs.form1.clearValidate()
        this.$refs.form2.clearValidate()
        this.$refs.form1.validateField(['salesInquiryType', 'businessPartnerName'], (err) => {
          if (err) {
            valid1 = false
          }
        })
        this.collapseWarningForBasicInfo = !valid1
        this.collapseWarningForShippingInfo = !valid2
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }
      } else {
        valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }

        valid2 = await this.$refs.form2.validate().catch((err) => {
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
      if (valid1 && valid2) {
        let param = { ...this.form }

        if (submitType === 'save') {
          this.collapseWarningForProductInfo = false
          this.collapseWarningForConditions = false
        } else {
          if (param.priceTbd === '1' && param.subTotal === 0) {
            this.$modal.msgError(this.$t('SALES.enabledZero'))
            return
          }
          if (param.salesInquiryType === 'Trading') {
            // const validProduct = this.validProductList(param.salesInquiryProductList)
            // if (!validProduct) {
            //   this.$refs.ProductInfo.activeName = 'productDetail'
            //   this.collapseWarningForProductInfo = true
            //   return
            // }

            const validProduct = this.validProductOrServiceList(param.productOrServiceList)
            if (!validProduct) {
              this.$refs.ProductInfo.activeName = 'ServiceTypeProduct'
              this.collapseWarningForProductInfo = true
              return
            }
          } else if (param.salesInquiryType === 'Service') {
            const validProduct = this.validProductOrServiceList(param.productOrServiceList)
            if (!validProduct) {
              this.$refs.ProductInfo.activeName = 'ServiceTypeProduct'
              this.collapseWarningForProductInfo = true
              return
            }
            // const validProduct = this.validProductList(param.salesInquiryProductList, false)
            // if (!validProduct) {
            //   this.$refs.ProductInfo.activeName = 'productDetail'
            //   this.collapseWarningForProductInfo = true
            //   return
            // }
            // const validService = this.validServiceList(param.salesInquiryServiceList)
            // if (!validService) {
            //   this.$refs.ProductInfo.activeName = 'projectTask'
            //   this.collapseWarningForProductInfo = true
            //   return
            // }
          } else if (param.salesInquiryType === 'Project') {
            console.log(param.salesInquiryProductList, '================2630')
            // 产品明细页签判断
            const validProject = this.validProjectList(param.salesInquiryProductList)
            if (!validProject) {
              this.$refs.ProductInfo.activeName = 'projectProductDetail'
              this.collapseWarningForProductInfo = true
              return
            }

            // 成本明细页签  --- 判断外层的必填项
            const validProject1 = this.validProjectChildrenList(param.salesInquiryProductList)
            if (!validProject1) {
              this.$refs.ProductInfo.activeName = 'projectCostDetails'
              this.collapseWarningForProductInfo = true
              return
            }
            // 成本明细页签  --- 判断内层的必填项
            const detailListValid = (detailList) => {
              for (const item of detailList || []) {
                const childProductList = item.childProductList || []

                if (childProductList.length > 0) {
                  const validProjectChildren = this.validProjectChildrenList(childProductList)

                  if (!validProjectChildren) {
                    return false
                  }

                  // 继续校验更深层级的子级数据
                  if (!detailListValid(childProductList)) {
                    return false
                  }
                }
              }

              return true
            }

            if (!detailListValid(param.salesInquiryProductList)) {
              this.$refs.ProductInfo.activeName = 'projectCostDetails'
              this.collapseWarningForProductInfo = true
              return
            }
          } else if (param.salesInquiryType === 'Consignment') {
            const validProject = this.validConsignmentList(param.salesInquiryProductList)
            if (!validProject) {
              this.$refs.ProductInfo.activeName = 'Consignment'
              this.collapseWarningForProductInfo = true
              return
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

        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn

        if (submitType === 'approvedAndSubmit') {
          // 审批流带提交功能
          this.approvedFormData = param
          this.aplVisible = true
          return
        } else if (submitType === 'generateQuote') {
          confirmMsg = this.$t('SALES.SIGenerateQuoteConfirm')
          successMsg = this.$t('SALES.SIGenerateQuoteSuccess')
          submitFn = generateSalesQuotation
        } else if (submitType === 'save') {
          confirmMsg = this.$t('SALES.SISaveConfirm')
          successMsg = this.$t('SALES.SISaveSuccess')
          submitFn = saveDraftSalesInquiry
        } else {
          confirmMsg = this.getSISubmitConfirm()
          successMsg = this.$t('SALES.SISubmitSuccess')
          submitFn = saveSalesInquiry
        }
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
      }
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
        this.$refs.ProductInfo.errorMessage('productName', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const salesPartNoReq = detailList.find((item) => {
        return (
          !item.salesPartNo && item.isAdhocEntry !== '1' && this.form.salesInquiryType === 'Project'
        )
      })
      if (salesPartNoReq && this.form.salesInquiryStatus === '4') {
        this.$refs.ProductInfo.errorMessage('salesPartNo', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPartNo')))
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      const uomCoefficientReq = detailList.find((item) => {
        return !item.uomCoefficient
      })
      if (uomCoefficientReq) {
        this.$refs.ProductInfo.errorMessage('uomCoefficient', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
        return valid
      }

      const purchaseQuotationNoReq = detailList.find((item) => {
        return !item.purchaseQuotationNo
      })
      if (purchaseQuotationNoReq && this.form.salesInquiryStatus === '4') {
        this.$refs.ProductInfo.errorMessage('purchaseQuotationNo', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
        )
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qty', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      /* 待提交的编辑页面,单价字段隐藏，不校验必填 */
      if (unitPriceReq && this.form.salesInquiryStatus !== '1') {
        this.$refs.ProductInfo.errorMessage('unitPrice', 'productDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      /* const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq && this.form.salesInquiryType !== 'Project') {
        this.$refs.ProductInfo.errorMessage('deliveryDateForDay', 'productDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
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
        this.$refs.ProductInfo.errorMessage('qty', 'Consignment')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      if (unitPriceReq) {
        this.$refs.ProductInfo.errorMessage('unitPrice', 'Consignment')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      // const consignmentAmountReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.consignmentAmount)
      // })
      // if (consignmentAmountReq) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.consignmentPrice'))
      //   )
      //   return valid
      // }
      // 寄卖 - 货期必填 2.0.9-16
      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$refs.ProductInfo.errorMessage('deliveryDateForDay', 'Consignment')

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

      // const purchaseQuotationNoReq = detailList.find((item) => {
      //   return !item.purchaseQuotationNo
      // })
      // if (
      //   purchaseQuotationNoReq &&
      //   this.form.salesInquiryStatus === '4' &&
      //   purchaseQuotationNoReq.serviceType === 'External'
      // ) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
      //   )
      //   return valid
      // }

      if (this.form.salesInquiryStatus === '4') {
        const purchaseQuotationNoReq = detailList.find((item) => {
          return !item.purchaseQuotationNo && item.serviceType === 'External'
        })
        if (purchaseQuotationNoReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
          )
          return valid
        }
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
      /* 待提交的编辑页面,单价字段隐藏，不校验必填 */
      if (unitPriceReq && this.form.salesInquiryStatus !== '1') {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      /* const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq && this.form.salesInquiryType !== 'Project') {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      } */

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
        this.$refs.ProductInfo.errorMessage('productName', 'ServiceTypeProduct')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      const uomCoefficientReq = detailList.find((item) => {
        return !item.uomCoefficient && item.productType !== '2'
      })
      if (uomCoefficientReq) {
        this.$refs.ProductInfo.errorMessage('uomCoefficient', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
        return valid
      }

      const purchaseQuotationNoReq = detailList.find((item) => {
        return !item.purchaseQuotationNo && item.productType !== '2'
      })
      if (purchaseQuotationNoReq && this.form.salesInquiryStatus === '4') {
        this.$refs.ProductInfo.errorMessage('purchaseQuotationNo', 'ServiceTypeProduct')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
        )
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qty', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      /* 校验系数*数量后小数位是否符合要求 */
      const validCoefficient = detailList.find((item) => {
        return !this.validCoefficientIsTrue(item)
      })
      if (validCoefficient) {
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice)
      })
      /* 待提交的编辑页面,单价字段隐藏，不校验必填 */
      if (unitPriceReq && this.form.salesInquiryStatus !== '1') {
        this.$refs.ProductInfo.errorMessage('unitPrice', 'ServiceTypeProduct')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      console.log('111', scheduledDeliveryDateReq, detailList)

      /* 待提交状态非必填 */
      if (
        scheduledDeliveryDateReq &&
        this.form.salesInquiryStatus &&
        this.form.salesInquiryStatus !== '1'
      ) {
        this.$refs.ProductInfo.errorMessage('deliveryDateForDay', 'ServiceTypeProduct')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }

      return true
    },
    validProjectList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.productName)
      })
      if (productNameReq) {
        this.$refs.ProductInfo.errorMessage('productName', 'projectProductDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'projectProductDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      // const uomCoefficientReq = detailList.find((item) => {
      //   return !item.uomCoefficient
      // })
      // if (uomCoefficientReq) {
      //   this.$refs.ProductInfo.errorMessage('uomCoefficient', 'projectProductDetail')

      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.ratio')))
      //   return valid
      // }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qty', 'projectProductDetail')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesQTY1')))
        return valid
      }

      /* 校验系数*数量后小数位是否符合要求 */
      // const validCoefficient = detailList.find((item) => {
      //   return !this.validCoefficientIsTrue(item)
      // })
      // if (validCoefficient) {
      //   return valid
      // }
      // const unitPriceReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.unitPrice)
      // })
      // if (unitPriceReq) {
      //   this.$refs.ProductInfo.errorMessage('unitPrice', 'projectProductDetail')

      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
      //   return valid
      // }

      const scheduledDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.deliveryDateForDay)
      })
      if (scheduledDeliveryDateReq) {
        this.$refs.ProductInfo.errorMessage('deliveryDateForDay', 'projectProductDetail')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
        )
        return valid
      }

      return true
    },
    validProjectChildrenList(detailList) {
      const valid = false

      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.productName)
      })
      if (productNameReq) {
        this.$refs.ProductInfo.errorMessage('productName', 'projectCostDetails')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.productName'))
        )
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !item.uom
      })
      if (uomReq) {
        this.$refs.ProductInfo.errorMessage('uom', 'projectCostDetails')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PRODUCT.uom1')))
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.netQty)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('netQty', 'projectCostDetails')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.netQty')))
        return valid
      }

      if (this.form.salesInquiryStatus && this.form.salesInquiryStatus !== '1') {
        const unitPriceReq = detailList.find((item) => {
          return (
            !this.$resultOfBoolean(item.unitCost) &&
            (!item.childProductList || item.childProductList.length === 0)
          )
        })
        if (unitPriceReq) {
          this.$refs.ProductInfo.errorMessage('unitCost', 'projectCostDetails')

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
          return valid
        }
      }
      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.submitForm('save', false, gotoRoute)
    },
    handleGenerateQuote() {
      this.submitForm('generateQuote')
    },
    handlePreviewPDF() {
      const token = getToken()
      this.handleSetConditionsHtmlStr()
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
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/preview' +
        `/${this.form.salesInquiryId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/download' +
        `/${this.form.salesInquiryId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.salesInquiryId)
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return this.formatComparisonValue(prop, item.beforeValue)
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      const value = item && item.afterValue !== undefined ? item.afterValue : fallback
      return this.formatComparisonValue(prop, value)
    },
    formatComparisonValue(prop, value) {
      if (
        ['validity', 'deliveryDate', 'consignmentStartTime', 'consignmentEndTime'].includes(prop) &&
        value
      ) {
        return this.parseTime(value, this.fmtForYmd)
      }
      return value
    },
    exitComparison() {
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      this.isComparison = false
      this.$set(this.form, 'salesInquiryProductList', cloneList(this.salesInquiryProductListCur))
      this.$set(this.form, 'salesInquiryProjectList', cloneList(this.salesInquiryProjectListCur))
      this.$set(this.form, 'salesInquiryServiceList', cloneList(this.salesInquiryServiceListCur))
      this.$set(this.form, 'productOrServiceList', cloneList(this.productOrServiceListCur))
      this.$set(this.form, 'projectCostDetailList', cloneList(this.projectCostDetailListCur))
      this.initCommonFileList = cloneList(this.commonFileListCur)
      this.$nextTick(() => {
        const routeStatus = formDirtyClass.routeStatusData[this.$route.name]
        if (routeStatus) {
          routeStatus.initFormJson = this.getFormJson()
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
    },
    /* 审批 */
    handleApproved() {
      if (this.isComparison || !this.submitBtnShow) {
        this.approvedFormData = undefined
        this.aplVisible = true
      } else {
        this.submitForm('approvedAndSubmit')
      }
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesInquiry')} [${vm.form.salesInquiryNo}]`
        )
      )
      this.aplVisible = false
      vm.back('onApprovedSuccess')
    },
    handleRejected() {
      this.rjVisible = true
    },
    rjVisibleChange(data) {
      this.rjVisible = data || false
    },
    rjSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.rejectedSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesInquiry')} [${vm.form.salesInquiryNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesInquiry')} [${vm.form.salesInquiryNo}]`
        )
      )
      vm.back('onCancelSuccess')
    },
    handleWithdraw() {
      const vm = this
      const confirm = vm
        .$t('SALES.salesInquiryWithdrawConfirm')
        .replace('$1', vm.form.salesInquiryNo)
      this.$modal.confirm(confirm).then(() => {
        withdrawSalesInquiry({
          salesInquiryId: vm.form.salesInquiryId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(
              `${vm.$t('SALES.salesInquiryWithdrawSuccess').replace('$1', vm.form.salesInquiryNo)}`
            )
            vm.back()
          }
        })
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
.legend-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;

  .legend-text {
    color: #606266;
  }
  .legend-divider {
    width: 1px;
    height: 14px;
    background: #e0e0e0;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .color-block {
    width: 16px;
    height: 16px;
    border: 1px solid #c0c4cc;
    border-radius: 3px;

    &.add {
      background-color: #d2e3fc;
      border-color: #1a73e8;
    }
    &.edit {
      background-color: #f0f7ff;
      border-color: #c2d7fb;
    }
    &.del {
      background-color: #f5f5f4;
      border-color: #78716c;
    }
  }
}
.reject-remarks {
  color: #444;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}
.reject-by {
  margin-top: 4px;
  color: #999;
  font-size: 11px;
}
.reject-card {
  border-left: 3px solid #f56c6c;
}
.reject-card ::v-deep .el-collapse-item__header,
.reject-card ::v-deep .el-collapse-item__wrap {
  background-color: #fff7f7;
}
</style>
