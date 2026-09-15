<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :loading="submitLoading"
        v-if="submitBtnShow"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="submitLoading"
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
      <el-button type="primary" size="mini" v-if="returnBtnShow" @click="handleReturn">{{
        $t('menu.return')
      }}</el-button>
      <el-button type="primary" size="mini" v-if="activateBtnShow" @click="handleActivate">{{
        $t('menu.activate')
      }}</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :loading="submitLoading"
        v-if="generateSOBtnShow"
        @click="handleGenerateSO"
        >{{ $t('menu.generateSO') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
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
      <el-dropdown
        class="ml10 mr10"
        @command="(command) => settingHandleCommand(command)"
        trigger="click"
        v-if="bpHistoryVersionList.length > 0 && comeFrom === '1'"
        @visible-change="dropdownVisibleChange"
      >
        <el-button size="mini" type="primary">
          {{ $t('uiBtn.revisionRecord') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-scrollbar :noresize="false" ref="scrollbar">
            <div style="max-height: 200px">
              <el-dropdown-item
                :command="item.businessId"
                v-for="item in bpHistoryVersionList"
                :key="item.businessId"
                >{{ item.businessNo }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        class="ml10 mr10 exportHistoryPDF"
        @command="(command) => exportPDFCommand(command)"
        trigger="click"
        v-if="bpHistoryVersionList.length > 0 && exportQuotationShow"
        @visible-change="dropdownVisibleChange2"
      >
        <el-button size="mini" type="primary">
          {{ $t('menu.exportQuotation') }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-scrollbar :noresize="false" ref="scrollbar2">
            <div style="max-height: 200px">
              <el-dropdown-item
                :command="item.businessId"
                v-for="item in bpHistoryVersionList"
                :key="item.businessId"
                >{{ item.businessNo }}
              </el-dropdown-item>
            </div>
          </el-scrollbar>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.salesQuotation') }}</div>
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
                <span class="info-item mr20" :title="form.businessPartnerName">
                  {{ $t('SALES.customerName') }} : {{ form.businessPartnerName }}
                </span>
                <span v-if="form.salesPersonBy" class="info-item mr20" :title="form.salesPersonBy">
                  {{ $t('SALES.salesPerson') }} : {{ form.salesPersonBy }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.sales_quotation_status, form.salesQuotationStatus) }}
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
                      :label="`${$t('SALES.salesQuotationType')}`"
                      prop="salesQuotationType"
                    >
                      <el-select
                        v-model="form.salesQuotationType"
                        placeholder=""
                        disabled
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in dict.type.sales_quotation_type"
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
                      <el-input
                        v-model="form.salesQuotationNo"
                        :title="form.salesQuotationNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.customerName')}`"
                      prop="businessPartnerName"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
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
                    <el-form-item
                      :label="`${$t('ui.currency')}`"
                      prop="currencyId"
                      :class="[isModified('currency')]"
                    >
                      <CommonSelect
                        :disabled="!isSelfCreated"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :options="currencyOptions || []"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.paymentMethod')}`"
                      prop="paymentMethodIdList"
                      :class="[isModified('paymentMethod')]"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ToolTipShowList
                        :list="form.paymentMethodNameList || []"
                        :popoverTitle="$t('ui.paymentMethod')"
                      >
                        <CommonMultipleSelect
                          :disabled="isDisForm"
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
                    <el-form-item :label="`${$t('SALES.ourRef')}`" :class="[isModified('ourRef')]">
                      <el-input
                        :disabled="isDisForm"
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.department')}`"
                      prop="departmentId"
                      :class="[isModified('departmentName')]"
                    >
                      <CommonSelect
                        :disabled="isDisForm"
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
                    <el-form-item
                      :label="`${$t('SALES.taxRate')}`"
                      prop="taxRate"
                      :class="[isModified('taxRate')]"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
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
                    <el-form-item
                      :label="`${$t('SALES.yourRef')}`"
                      :class="[isModified('yourRef')]"
                    >
                      <el-input
                        :disabled="isDisForm"
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="30"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.salesPerson')}`"
                      prop="salesPersonBy"
                      :class="[isModified('salesPersonBy')]"
                    >
                      <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || isDisForm"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.validityDays')}`"
                      prop="validityForDay"
                      :class="[isModified('validity')]"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :disabled="isDisForm"
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
                          :disabled="isDisForm"
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
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.scheduledDeliveryDate')}`"
                      prop="deliveryDateForDay"
                      :class="[isModified('deliveryDateForDay')]"
                      :rules="[
                        {
                          required: !(isServiceOrderCreated || !staffNotRequired),
                          message: $t('ui.reqMsg').replace('$1', $t('SALES.scheduledDeliveryDate')),
                          trigger: ['blur', 'change']
                        }
                      ]"
                    >
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          :disabled="isDisForm || isServiceOrderCreated"
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
                          :disabled="isDisForm"
                          v-model="form.deliveryDate"
                          :picker-options="validityDaysPickerOptions"
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

                <el-row v-if="form.salesQuotationType === 'Project'">
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
                  <el-col :span="8">
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
                  <el-col :span="8" v-if="form.salesQuotationType === 'Consignment'">
                    <el-form-item
                      :label="`${$t('SALES.consignmentStart')}`"
                      prop="consignmentStartTime"
                      :class="[isModified('consignmentStartTime')]"
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
                  <el-col :span="8" v-if="form.salesQuotationType === 'Consignment'">
                    <el-form-item
                      :label="`${$t('SALES.consignmentEnd')}`"
                      prop="consignmentEndTime"
                      :class="[isModified('consignmentEndTime')]"
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
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.automatedEmail')}`"
                      :class="[isModified('automatedEmail')]"
                    >
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
          <div class="form-card mt10" v-show="generateSOBtnShow">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.customerPODetail')"
                :warning="collapseWarningForPODetail"
              >
                <span v-if="form.poType" class="info-item mr20">
                  {{ $t('SALES.poType') }} :
                  {{ selectDictLabel(dict.type.sales_po_type, form.poType) }}
                </span>
                <span
                  v-if="form.poContactPersonName"
                  class="info-item mr20"
                  :title="form.poContactPersonName"
                >
                  {{ $t('SALES.purchaseContactPerson') }} : {{ form.poContactPersonName }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form3"
                :model="form"
                @submit.native.prevent
                :rules="rules2"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.poType')}`" prop="poType">
                      <el-select
                        v-model="form.poType"
                        @change="poTypeChange"
                        placeholder=""
                        style="width: 100%"
                      >
                        <el-option
                          v-for="item in dict.type.sales_po_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.poNo')}`"
                      prop="poNo"
                      :rules="[
                        {
                          required: ['1', '3'].includes(form.poType),
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <el-input
                        :disabled="!form.poType || ['2', '4'].includes(form.poType)"
                        v-model="form.poNo"
                        maxlength="30"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.poDate')}`" prop="poDate">
                      <el-date-picker
                        v-model="form.poDate"
                        :picker-options="poDatePickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.purchaseContactPerson')}`"
                      prop="poContactPersonId"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.poContactPersonId"
                        :label="form.poContactPersonName"
                        :title="form.poContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="poContactPersonChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.poEmail" :title="form.poEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.poMobilePhone"
                        :title="form.poMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`" required>
                      <myUpload ref="uploadRefPO" :limit="9" />
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
                <el-row v-if="form.salesQuotationType !== 'Service'">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.warehouseName')}`"
                      prop="warehouseName"
                      :class="[isModified('warehouseName')]"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ToolTipShowObj
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.warehouseName"
                        :rows="warehouseRows"
                      >
                        <SelectInput
                          clearable
                          :value="form.warehouseName"
                          @click="openWarehouseTable"
                          @clear="warehouseClear"
                          :disabled="comDisFrom || isDisForm"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.incoterm')}`"
                      prop="incotermId"
                      :class="[isModified('incotermName')]"
                      :rules="[
                        {
                          required: staffNotRequired,
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
                        :options="incotermOptions"
                        @change="incotermIdChange"
                        :disabled="isServiceOrderCreated || !staffNotRequired"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.address')}`"
                      prop="receiveAddressName"
                      :class="[isModified('receiveAddressName')]"
                      :rules="[
                        {
                          required: form.incotermAddressType !== '0' && staffNotRequired,
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
                          :disabled="
                            !form.incotermId ||
                            !form.businessPartnerId ||
                            isServiceOrderCreated ||
                            comDisFrom
                          "
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
                              form.incotermAddressType === '0' ||
                              isServiceOrderCreated ||
                              comDisFrom
                            "
                            class="form-wd"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="
                            !(
                              !form.incotermId ||
                              !form.businessPartnerId ||
                              comDisFrom ||
                              form.incotermAddressType === '0' ||
                              isServiceOrderCreated
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
                      :class="[isModified('receiveAddressName')]"
                    >
                      <SelectInput
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        @clear="receiveAddressClear"
                        clearable
                        @click="openReceiveAddressTable"
                        :disabled="true"
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.zone')}`" :class="[isModified('district')]">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="form.salesQuotationType === 'Service' ? 8 : 16">
                    <el-form-item
                      :label="`${$t('SALES.deliveryAddress')}`"
                      :class="[isModified('receiveAddress')]"
                    >
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
                      :class="[isModified('bpContactPersonName')]"
                      :rules="[
                        {
                          required: staffNotRequired,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId || isDisForm"
                            :id="form.bpContactPersonId"
                            :label="form.bpContactPersonName"
                            :title="form.bpContactPersonName"
                            idKey="contactPersonId"
                            labelKey="contactPersonName"
                            :options="form.bpBusinessContactPersonList || []"
                            @change="contactPersonChange"
                          />
                        </div>
                        <div
                          class="con-right"
                          v-if="!(!form.businessPartnerId || isDisForm) && !comDisFrom"
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
                    <el-form-item :label="`${$t('ui.email')}`" :class="[isModified('bpEmail')]">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.mobilePhone')}`"
                      :class="[isModified('bpMobilePhone')]"
                    >
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
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
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
                  :salesQuotationType="form.salesQuotationType"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  @returnSubmitSuccess="back"
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
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <addBPAddressDlg ref="addBPAddressDlg" @update="addBPAddress" />
    <addBPContactPersonDlg ref="addBPContactPersonDlg" @update="addBPContactPerson" />

    <ApprovedDialog
      :id="form.salesQuotationMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.salesQuotationMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesQuotationMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- return -->
    <ReturnDialog
      :id="form.salesQuotationMainId"
      :rj-visible="returnVisible"
      :rj-api-url="returnUrl"
      @submitSuccess="returnSubmitSuccess"
      @rjVisibleChange="returnVisibleChange"
    />

    <FormActivateDialog
      :id="form.salesQuotationMainId"
      @submitSuccess="activateSubmitSuccess"
      ref="FormActivateDialog"
    />

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />

    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAllTaxCodeByBusinessPartnerId } from '@/api/system/tax'

import {
  saveSalesQuotation,
  saveDraftSalesQuotation,
  generateSO,
  querySalesQuotationById,
  approvedSalesQuotation,
  rejectedSalesQuotation,
  cancelledSalesQuotation,
  returnSalesQuotation,
  querySalesQuotationHistoryVersion,
  withdrawApproved,
  preview
} from '@/api/salesManagement/salesQuotation'
import { getToken } from '@/utils/auth'
import { queryBPCustomerQuestionnaireListNoPage } from '@/api/salesManagement/salesInquiry'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import selectCustomerTable from './components/selectCustomerTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'
import addBPAddressDlg from '@/views/salesManagement/salesInquiry/components/addBPAddressDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'

import selectWarehouseTable from './components/selectWarehouseTable.vue'
import ProductInfo from './productInfo/productInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import ReturnDialog from './returnDialog/returnDialog.vue'
import FormActivateDialog from './activateDlg/formActivateDialog.vue'

import RevisionComparisonDlg from '@/views/salesManagement/salesQuotation/revisionComparisonDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'

export default {
  mixins: [pageMixin],
  dicts: [
    'sales_quotation_type',
    'sales_po_type',
    'sales_quotation_status',
    'tax_type',
    'business_partner_payment_method'
  ],
  components: {
    selectCustomerTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    payToAddressDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    ProductInfo,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    ReturnDialog,
    FormActivateDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    previewQuestionnaireTemplateDlg
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        projectCostDetailList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForPODetail: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        salesQuotationType: [
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
            trigger: ['blur']
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
      rules2: {
        poType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        poDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        poContactPersonId: [
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
      poDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
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
      paymentMethodOptions: [],
      incotermOptions: [],
      taxRateOptions: [],
      /* 表格部分 */
      initCommonFileList: [],

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
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
      approvedUrl: approvedSalesQuotation,
      rejectedUrl: rejectedSalesQuotation,
      cancelledUrl: cancelledSalesQuotation,

      returnVisible: false,
      returnUrl: returnSalesQuotation,

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
    /* 类型不等于SIC 生成就必填 */
    staffNotRequired() {
      return this.form.salesQuotationType !== 'Staff'
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
    editAuth() {
      return this.checkPermi(['salesManagement:salesQuotation:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesQuotationMainId &&
        [this.buttonAuthMsg.isCanUpdate, this.buttonAuthMsg.isCanSaveDraft].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    isServiceOrderCreated() {
      return this.form.documentType === 'ServiceOrder'
    },
    isSelfCreated() {
      return this.form.documentType === 'SelfCreated'
    },
    isDisForm() {
      if (this.isSelfCreated) {
        return false
      }
      if (this.isServiceOrderCreated) {
        return false
      }
      return true
    },
    submitBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanSaveDraft === '1') {
        show = true
      }
      return show
    },
    generateSOBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:generateSO'])) {
        return false
      }
      let show = false
      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanGenerateSO === '1') {
        show = true
      }
      return show
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
      ) {
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
        this.form.salesQuotationMainId &&
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
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.salesQuotationMainId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    returnBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:return'])) {
        return false
      }
      let show = false
      if (
        this.dataType === '1' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanReturn === '1'
      ) {
        show = true
      }
      return show
    },
    activateBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:activate'])) {
        return false
      }
      let show = false
      if (
        this.dataType === '1' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanActivate === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportQuotationShow() {
      if (!this.checkPermi(['salesManagement:salesQuotation:exportQuotation'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesQuotationMainId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },

    modifyHighlight() {
      if (this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1') {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
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
            businessId: this.form.salesQuotationMainId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.querySalesQuotationHistoryVersion()
      querySalesQuotationById({ salesQuotationMainId: rowId }).then((res) => {
        const data = res.data || {}
        data.salesQuotationProductList = data.salesQuotationProductList || []
        data.salesQuotationProjectList = data.salesQuotationProjectList || []
        data.salesQuotationServiceList = data.salesQuotationServiceList || []
        data.projectCostDetailList = data.projectCostDetailList || []

        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }

        const bpBusinessAddress = data.bpBusinessAddress || {}
        if (bpBusinessAddress.isAdhocEntryAddress === '1') {
          this.$set(data, 'bpBusinessAddressOldData', bpBusinessAddress)
        }

        this.form = data
        this.queryCustomerQuestionnaire()
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 100)
        this.queryAllTaxCodeByBusinessPartnerId()
      })
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        salesQuotationType: undefined,
        salesQuotationNo: undefined,
        businessPartnerName: undefined,
        salesQuotationStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        salesPersonBy: undefined,
        salesPersonId: undefined,
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
        dropShipping: '0',

        poType: undefined,
        poNo: undefined,
        poDate: undefined,

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesQuotationProductList: [],
        salesQuotationProjectList: [],
        salesQuotationServiceList: [],
        projectCostDetailList: [],
        consignmentStartTime: undefined,
        consignmentEndTime: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPODetail = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5']
      setTimeout(() => {
        if (this.$refs.uploadRefPO) {
          this.$refs.uploadRefPO.initFileList([])
        }
      }, 300)
      this.basicUpdateProps = []
      this.bpHistoryVersionList = []
      this.resetForm('form1')
      this.resetForm('form2')
      this.resetForm('form3')
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
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.$set(this.form, 'salesQuotationProductList', [])
      this.customerQuestionnaireClear()
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.contactPersonClear()
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      const account = row.bpBusinessAccountCustomer || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.customerQuestionnaireClear()
      this.taxRateChange({})
      this.queryAllTaxCodeByBusinessPartnerId()
      this.contactPersonClear()
      this.queryCustomerQuestionnaire()

      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      this.$set(this.form, 'salesQuotationProductList', [])
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
    queryUserDepartment() {
      queryUserDepartment({}).then((res) => {
        this.deptOptions = res.data || []
        /* this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
          }
        }) */
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
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)

      this.$set(this.form, 'salesQuotationProductList', [])
      this.$set(this.form, 'salesQuotationServiceList', [])
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
    /* 客户采购信息 */
    poTypeChange(value) {
      if (value === '2') {
        this.$set(this.form, 'poNo', this.form.salesQuotationNo)
      } else {
        this.$set(this.form, 'poNo', undefined)
      }
      this.$nextTick(() => {
        this.$refs.form3.clearValidate('poNo')
      })
    },
    poContactPersonChange(row) {
      this.$set(this.form, 'poBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'poContactPersonId', row.contactPersonId)
      this.$set(this.form, 'poContactPersonName', row.contactPersonName)
      this.$set(this.form, 'poMobileNum', row.mobileNum)
      this.$set(this.form, 'poMobileCode', row.mobileCode)
      this.$set(this.form, 'poMobilePhone', row.mobilePhone)
      this.$set(this.form, 'poEmail', row.email)
    },

    /* 第二部分表单 */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(item) {
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      if (this.form.documentType === 'ServiceOrder') {
        return
      }
      this.receiveAddressClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate('receiveAddressName')
      })
    },

    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2') {
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

      let valid3 = true
      if (submitType === 'generateSO') {
        valid3 = await this.$refs.form3.validate().catch((err) => {
          return err
        })
        this.collapseWarningForPODetail = !valid3
        if (!valid3) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.customerPODetail'))
          )
          return
        }
        const myFileIdsForPO = this.$refs.uploadRefPO.getFileIds({
          required: true,
          requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
        })
        if (myFileIdsForPO === false) {
          this.collapseWarningForPODetail = true
          return
        }
        this.form.commonFileListForPO = myFileIdsForPO
        this.collapseWarningForPODetail = false
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
          /* 服务订单关联SIC时，服务产品可为空 */
          const SRIsReqOne = !this.form.serviceOrderId
          const validService = this.validServiceList(param.salesQuotationServiceList, SRIsReqOne)
          if (!validService) {
            this.$refs.ProductInfo.activeName = 'projectTask'
            this.collapseWarningForProductInfo = true
            return
          }
        } else if (param.salesQuotationType === 'Project') {
          const validProject = this.validProjectList(param.salesQuotationProjectList)
          if (!validProject) {
            this.$refs.ProductInfo.activeName = 'project'
            this.collapseWarningForProductInfo = true
            return
          }
          if (
            this.form.salesQuotationStatus === '4' &&
            (this.form.productMsgType || '').includes('1')
          ) {
            const validProduct = this.validProductList(param.salesQuotationProductList)
            if (!validProduct) {
              this.$refs.ProductInfo.activeName = 'productDetail'
              this.collapseWarningForProductInfo = true
              return
            }
          }
          if (
            this.form.salesQuotationStatus === '4' &&
            (this.form.productMsgType || '').includes('2')
          ) {
            const validService = this.validServiceList(param.salesQuotationServiceList)
            if (!validService) {
              this.$refs.ProductInfo.activeName = 'projectTask'
              this.collapseWarningForProductInfo = true
              return
            }
          }
        } else if (param.salesQuotationType === 'Staff') {
          const validProduct = this.validProductList(param.salesQuotationProductList)
          if (!validProduct) {
            this.$refs.ProductInfo.activeName = 'productDetail'
            this.collapseWarningForProductInfo = true
            return
          }
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'generateSO') {
          confirmMsg = this.$t('SALES.SQGenerateSOConfirm')
          successMsg = this.$t('SALES.SQGenerateSOSuccess')
          submitFn = generateSO
        } else if (submitType === 'save') {
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
      if (detailList.length <= 0) {
        if (isReqOne) {
          this.$modal.msgError(this.$t('SALES.productTableEmpty'))
          return valid
        } else {
          return true
        }
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

      const salesPartNoReq = detailList.find((item) => {
        return (
          !item.salesPartNo && item.isAdhocEntry !== '1' && this.form.salesQuotationType !== 'Staff'
        )
      })
      if (salesPartNoReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPartNo')))
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

      /* const purchaseQuotationNoReq = detailList.find((item) => {
        return !item.purchaseQuotationNo
      })
      if (purchaseQuotationNoReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.purchaseQuotationNo'))
        )
        return valid
      } */

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

      if (!this.isServiceOrderCreated) {
        const scheduledDeliveryDateReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.deliveryDateForDay)
        })
        if (scheduledDeliveryDateReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
          )
          return valid
        }
      }

      return true
    },
    validServiceList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0) {
        if (isReqOne) {
          this.$modal.msgError(this.$t('SALES.projectTaskTableEmpty'))
          return valid
        } else {
          return true
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
      if (unitPriceReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.unitPrice')))
        return valid
      }

      if (!this.isServiceOrderCreated) {
        const scheduledDeliveryDateReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.deliveryDateForDay)
        })
        if (scheduledDeliveryDateReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.leadTimeDays2'))
          )
          return valid
        }
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
    handleGenerateSO() {
      this.submitForm('generateSO')
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
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesQuotation/preview' +
        `/${this.form.salesQuotationMainId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesQuotation/download' +
        `/${this.form.salesQuotationMainId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/salesManagement/reviseSalesQuotation',
        query: {
          id: this.form.salesQuotationMainId,
          timeId: Date.now()
        }
      })
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.rowId)
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    querySalesQuotationHistoryVersion() {
      if (this.comeFrom !== '1') return
      querySalesQuotationHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/salesManagement/viewSalesQuotation',
        query: {
          id: businessId,
          timeId: Date.now()
        }
      })
    },
    dropdownVisibleChange() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.moveY = 0
      }
    },

    exportPDFCommand(salesQuotationMainId) {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesQuotation/preview' +
        `/${salesQuotationMainId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    dropdownVisibleChange2() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar2) {
        this.$refs.scrollbar2.moveY = 0
      }
    },
    /* 审批 */
    handleApproved() {
      this.aplVisible = true
    },
    aplVisibleChange(data) {
      this.aplVisible = data || false
    },
    aplSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.approvedSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
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
          `${this.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleReturn() {
      this.returnVisible = true
    },
    returnVisibleChange(data) {
      this.returnVisible = data || false
    },
    returnSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.returnedSuccess')}`.replace(
          '$1',
          `${vm.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
        )
      )
      vm.returnVisible = false
      vm.back('onApprovedSuccess')
    },

    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('SALES.salesQuotation')} [${vm.form.salesQuotationNo}]`
        )
      )
      vm.back('onCancelSuccess')
    },

    handleActivate() {
      this.$refs.FormActivateDialog.handleOpen(this.form)
    },
    activateSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('SALES.SQ_ActivateSuccess')}`.replace('$1', vm.form.salesQuotationNo)
      )
      vm.back('onActivateSuccess')
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
.exportHistoryPDF {
  position: absolute;
  right: 20px;
}
</style>
