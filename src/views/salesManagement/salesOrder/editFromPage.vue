<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="assignBtnShow" @click="handleAssign"
        >{{ $t('SALES.deliveryNotification') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="transferBtnShow" @click="handleTransfer"
        >{{ $t('SALES.transfer') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="purchaseBtnShow" @click="handlePurchase"
        >{{ $t('SALES.purchase') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="requestTrialBtnShow" @click="handleRequestTrial"
        >{{ $t('menu.requestTrial') }}
      </el-button>

      <el-button type="primary" size="mini" v-if="closeBtnShow" @click="handleClose"
        >{{ $t('uiBtn.close') }}
      </el-button>

      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('menu.cancel') }}
      </el-button>

      <!-- <el-button type="primary" size="mini" v-if="previewPDFShow" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
      </el-button> -->
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.salesOrder') }}</div>
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
                  {{ form.salesOrderStatusShowStr }}
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
                      :label="`${$t('SALES.salesOrderType')}`"
                      prop="salesQuotationType"
                    >
                      <SelectInput
                        v-model="form.salesQuotationTypeShowStr"
                        :title="form.salesQuotationTypeShowStr"
                        disabled
                      ></SelectInput>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input :value="form.salesOrderStatusShowStr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`">
                      <el-input
                        v-model="form.salesOrderNo"
                        :title="form.salesOrderNo"
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
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesQuotation')}`">
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
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="true"
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
                    <!-- <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIdList">
                      <ToolTipShowList
                        :list="form.paymentMethodNameList || []"
                        :popoverTitle="$t('ui.paymentMethod')"
                      >
                        <CommonMultipleSelect
                          :disabled="disableNonInitial"
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
                    <el-form-item :label="`${$t('ui.paymentTerm')}`">
                      <div class="input-switch-box">
                        <div class="con-left">
                          <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                            <SelectInput disabled v-model="form.paymentTermName" />
                          </ToolTipPaymentTerm>
                        </div>
                        <div
                          class="con-right"
                          v-if="
                            ['Trading', 'Project'].indexOf(form.salesQuotationType) !== -1 &&
                            form.approvedStatus === '3'
                          "
                        >
                          <svg-icon
                            icon-class="pay-1"
                            class="primary-pointer"
                            style="font-size: 26px"
                            @click="navPaymentSchedule"
                          />
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input
                        :disabled="disableNonInitial"
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
                        :disabled="disableNonInitial"
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
                      <SelectInput
                        :value="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || disableNonInitial"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.taxRate')}`">
                      <el-input-number
                        v-thousandSplit="{ precision: 1 }"
                        v-model="form.taxRate"
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
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input
                        :disabled="disableNonInitial"
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <template v-if="form.salesQuotationType !== 'MixDesign'">
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.leadTimeDays2')}`" required>
                        <div class="flex">
                          <el-input-number
                            v-thousandSplit="{ precision: 0 }"
                            v-model="form.deliveryDateForDay"
                            :precision="0"
                            type="number"
                            :min="0"
                            :max="999"
                            controls-position="right"
                            style="width: 100%"
                            :controls="form.salesQuotationType !== 'Project'"
                          />
                          <span v-if="form.salesQuotationType === 'Project'" class="mr5 ml5">{{
                            $t('SALES.day')
                          }}</span>
                          <el-date-picker
                            v-if="form.salesQuotationType === 'Project'"
                            v-model="form.deliveryDate"
                            :picker-options="validityDaysPickerOptions"
                            :format="fmtForYmd"
                            value-format="timestamp"
                            style="width: 60%"
                            class="fs-0"
                            placeholder=""
                            clearable
                          ></el-date-picker>
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('SALES.customerQuestionnaire')}`">
                        <div class="input-switch-box">
                          <div class="con-left">
                            <el-input
                              :disabled="true"
                              v-model="form.customerQuestionnaireNo"
                              :title="form.customerQuestionnaireNo"
                              :maxlength="50"
                            ></el-input>
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
                  </template>

                  <template v-if="form.salesQuotationType === 'Consignment'">
                    <el-col :span="8">
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
                    <el-col :span="8">
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
                  </template>
                </el-row>
                <el-row>
                  <el-col
                    :span="8"
                    v-if="
                      ['Trading', 'Service', 'Consignment', 'Staff'].includes(
                        form.salesQuotationType
                      ) && false
                    "
                    key="priceType11"
                  >
                    <el-form-item :label="`${$t('SALES.priceType')}`">
                      <SelectInput
                        clearable
                        :disabled="true"
                        :value="form.priceTypeName"
                        :title="form.priceTypeName"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="form.salesQuotationType === 'MixDesign'">
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('SALES.limitingValuesofConcreteComposition')"
                      class="form-item__label-wrap"
                    >
                      <el-input
                        v-model="form.limitingValuesOfConcreteComposition"
                        maxlength="100"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      class="form-item__label-wrap"
                      :label="$t('SALES.typeStrengthClassofCement')"
                    >
                      <el-input v-model="form.typeStrengthClassOfCement" maxlength="100" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      class="form-item__label-wrap"
                      :label="$t('SALES.typeofAdmixtureAddition')"
                    >
                      <el-input v-model="form.typeOfAdmixtureAddition" maxlength="100" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.conditions')">
                      <emailEditor
                        v-model="form.conditions"
                        class="form-wd"
                        :template-for="'SQ-Conditions'"
                        :init-content="initContent"
                        :config="config"
                        :disabled="true"
                        :key="'emailEditor' + comDisFrom"
                      ></emailEditor>
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
                  <el-col :span="8" v-if="['Trading', 'Service'].includes(form.salesQuotationType)">
                    <el-form-item :label="`${$t('SALES.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
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
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.salesQuotationType === 'Service' && false">
                    <el-form-item :label="`${$t('SALES.priceTbd')}`">
                      <el-switch
                        v-model="form.priceTbd"
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
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.poType')}`" prop="poType">
                      <el-select v-model="form.poType" placeholder="" style="width: 100%">
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
                    <el-form-item :label="`${$t('SALES.poNo')}`">
                      <el-input v-model="form.poNo" maxlength="30"></el-input>
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
                    <el-form-item
                      :label="`${$t('ui.attachment')}`"
                      :required="['1', '2', '3'].includes(form.poType)"
                    >
                      <myUpload ref="uploadRefPO" :limit="9" :disabled="comDisFrom" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10" v-if="form.salesQuotationType !== 'MixDesign'">
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
                <el-row>
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
                        :disabled="disableNonInitial"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item :label="`${$t('SALES.port')}`">
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
                        <SelectInput
                          :value="form.receivePortName"
                          :disabled="true"
                          class="form-wd"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <!-- 修订记录-2.0.5 279行： 默认填充法人仓库，隐藏该字段 -->
                  <el-col :span="8" v-if="form.salesQuotationType === 'Consignment'">
                    <el-form-item :label="`${$t('SALES.warehouseName')}`" prop="warehouseName">
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
                          :disabled="comDisFrom || disableNonInitial"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
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
                      <CommonSelect
                        :disabled="!form.businessPartnerId || disableNonInitial"
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="contactPersonChange"
                      />
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
            <el-collapse-item name="6">
              <FormCollapseItemTitle slot="title" :title="$t('SALES.projectInfo')">
              </FormCollapseItemTitle>
              <projectInfo ref="projectInfo" :formData="form" :comDisFrom="true" />
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="form.collapseWarningForProductInfo"
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
                  @back="back"
                  @handleUpdate="handleUpdate"
                  :buttonAuthMsg="buttonAuthMsg"
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
    <!-- @onSuccess="updateTable" -->
    <assignShipTasksDlg :formData="form" ref="assignShipTasksDlg" />
    <previewQuestionnaireTemplateDlg
      ref="previewQuestionnaireTemplateDlg"
      :isCancel="true"
      :isDisabled="true"
    />

    <ApprovedDialog
      :id="form.salesOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.salesOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />

    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <!-- 关闭 -->
    <FormCloseDialog
      :id="form.salesOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :close-api-url="closedUrl"
      @submitSuccess="closeSubmitSuccess"
      ref="FormCloseDialog"
    />

    <paymentSchedule ref="paymentSchedule" :salesOrderId="form.salesOrderId" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryCustomerQuestionnaireById } from '@/api/salesManagement/customerQuestionnaire'
import {
  querySalesOrderById,
  preview,
  selectTransportationStrategy,
  cancelledSalesOrder,
  closeSalesOrder,
  approvedSalesOrder,
  rejectedSalesOrder,
  withdrawApproved
} from '@/api/salesManagement/salesOrder'
import { getToken } from '@/utils/auth'

import ProductInfo from './productInfo/productInfo.vue'
import assignShipTasksDlg from './assignShipTasksDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import previewQuestionnaireTemplateDlg from '@/views/salesManagement/questionnaireTemplate/components/previewQuestionnaireTemplateDlg.vue'
import FormCancelDialog from './components/formCancelDialog'
import FormCloseDialog from '@/views/bpm/history/closeDialog/formCloseDialog'
import projectInfo from '@/views/salesManagement/salesQuotation/components/projectInfo.vue'
import emailEditor from '@/views/system/emailManagement/editor/editor'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import paymentSchedule from './paymentSchedule/paymentSchedule'

export default {
  mixins: [pageMixin],
  dicts: [
    'sales_quotation_type',
    'sales_po_type',
    // 'sales_order_status',
    'tax_type',
    'business_partner_payment_method'
  ],
  components: {
    ProductInfo,
    SystemOperationLogTable,
    assignShipTasksDlg,
    previewQuestionnaireTemplateDlg,
    FormCancelDialog,
    FormCloseDialog,
    projectInfo,
    emailEditor,
    ApprovedDialog,
    RejectDialog,
    paymentSchedule
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      initContent: '',
      config: {
        width: 800, // px
        height: 240, // px
        contentReadOnly: false,
        isShowToolBar: true,
        disabled: false,
        buttonsOption: [
          {
            componentName: 'BtnFontNameList',
            isShow: false
          },
          {
            componentName: 'BtnBackColor',
            isShow: false
          },
          {
            componentName: 'BtnUnderLine',
            isShow: false
          },
          {
            componentName: 'BtnCreateLink',
            isShow: false
          },
          {
            componentName: 'BtnUnlink',
            isShow: false
          },
          {
            componentName: 'BtnHeader',
            isShow: false
          },
          {
            componentName: 'BtnServTpl',
            isShow: true
          }
        ]
      },
      form: {
        salesOrderProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: [],
        collapseWarningForProductInfo: false
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForPODetail: false,
      collapseWarningForShippingInfo: false,
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
        customerQuestionnaireId: [
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

        paymentMethodIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validity: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        deliveryDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
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
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */
      initCommonFileList: [],

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSelectTransportationStrategy: '0',
        isCanCancelledDetail: '0'
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
      returnVisible: false,
      approvedUrl: approvedSalesOrder,
      rejectedUrl: rejectedSalesOrder,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      bpHistoryVersionList: [],
      cancelledUrl: cancelledSalesOrder,
      closedUrl: closeSalesOrder
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
      type: Boolean,
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
    editAuth() {
      return this.checkPermi(['salesManagement:salesOrder:edit'])
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesOrderId &&
        [this.buttonAuthMsg.isCanUpdate].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    disableNonInitial() {
      return true
    },
    assignBtnShow() {
      if (!this.checkPermi(['salesManagement:preDeliveryNotice:add'])) {
        return false
      }
      let show = false
      if (this.form.salesOrderId && this.buttonAuthMsg.isCanCreatePreDeliveryNotice === '1') {
        show = true
      }
      return show
    },
    transferBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:transfer']) &&
        this.buttonAuthMsg.isCanSelectTransportationStrategy === '1'
      )
    },
    purchaseBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:purchase']) &&
        this.buttonAuthMsg.isCanSelectTransportationStrategy === '1'
      )
    },

    requestTrialBtnShow() {
      return (
        this.form.salesOrderId &&
        this.checkPermi(['salesManagement:salesOrder:requestTrial']) &&
        this.buttonAuthMsg.isCanRequestTrial === '1'
      )
    },
    closeBtnShow() {
      return (
        this.checkPermi(['salesManagement:salesOrder:close']) &&
        this.buttonAuthMsg.isCanClosed === '1'
      )
    },
    previewPDFShow() {
      if (!this.checkPermi(['salesManagement:salesOrder:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesOrderId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:salesOrder:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesOrderId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:salesOrder:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesOrderId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
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
        this.form.salesOrderId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    modifyHighlight() {
      return this.approvedBtnShow && this.buttonAuthMsg.isCanSeeUpdateMsg === '1'
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.salesOrderId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['salesManagement:salesOrder:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.salesOrderId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesOrder:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesOrderId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    // 对接CDS
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    navPaymentSchedule() {
      this.$refs.paymentSchedule.open()
      // this.$router.push({
      //   path: '/salesManagement/paymentSchedule',
      //   query: {
      //     id: this.form.salesOrderId,
      //     timeId: Date.now(),
      //     backType: 2
      //   }
      // })
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
    handleView() {
      queryCustomerQuestionnaireById({ customerQuestionnaireId: this.form.customerQuestionnaireId })
        .then((res) => {
          this.$refs.previewQuestionnaireTemplateDlg.handleOpen(res.data)
        })
        .catch(() => {})
    },
    handleAssign() {
      this.$router.push({
        path: '/salesManagement/addPreDeliveryNotice',
        query: {
          timeId: Date.now(),
          soId: this.rowId,
          backType: '2'
        }
      })
    },
    handleTransfer() {
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return selectTransportationStrategy({
            salesOrderId: this.rowId,
            transportationStrategy: '1'
          })
        })
        .then((response) => {
          this.back()
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
        })
        .catch(() => {})
    },
    handlePurchase() {
      this.$modal
        .confirm(this.$t('ui.submitPageConfirm'))
        .then(() => {
          return selectTransportationStrategy({
            salesOrderId: this.rowId,
            transportationStrategy: '2'
          })
        })
        .then((response) => {
          this.back()
          this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
        })
        .catch(() => {})
    },
    handleRequestTrial() {
      if (this.form.requestTrialId) {
        this.$router.push({
          path: '/salesManagement/editRequestTrial',
          query: {
            id: this.form.requestTrialId,
            soId: this.rowId,
            timeId: Date.now()
          }
        })
        return
      }
      this.$router.push({
        path: '/salesManagement/addRequestTrial',
        query: {
          timeId: Date.now(),
          soId: this.rowId
        }
      })
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    handleClose() {
      this.$refs.FormCloseDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace('$1', `${this.$t('SALES.salesOrder')}`)
      )
      vm.back()
    },
    closeSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.closedSuccess')}`.replace('$1', `${this.$t('SALES.salesOrder')}`)
      )
      vm.back()
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      querySalesOrderById({ salesOrderId: rowId }).then((res) => {
        const data = res.data || {}
        data.salesOrderProductList = data.salesOrderProductList || []
        if (data.salesQuotationType === 'Project') {
          const handlerSalesInquiryProductList = (list) => {
            let rowTimeId = Date.now()
            const handleList = (currentList, customIndex = 0) => {
              currentList.forEach((item) => {
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
              handleList([item], 0)
            })
          }
          handlerSalesInquiryProductList(data.salesOrderProductList || [])
        }
        data.salesOrderProjectList = data.salesOrderProjectList || []
        data.salesOrderServiceList = data.salesOrderServiceList || []
        data.projectCostDetailList = data.projectCostDetailList || []
        data.salesOrderMixDesignList = data.salesOrderMixDesignList || []

        data.salesOrderMixDesignList.forEach((item) => {
          if (item.passingRequirements) {
            item.passingRequirementsList = item.passingRequirements.split(',')
          }
          if (item.variationShowStr && item.trialMix === '1' && item.trialMixNo) {
            item.variationShowStr = item.variationShowStr + ' - ' + item.trialMixNo
          }
        })

        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.warehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
        setTimeout(() => {
          if (this.$refs.uploadRefPO) {
            this.$refs.uploadRefPO.initFileList(data.commonFileListForPO)
          }
        }, 300)

        this.form = data

        setTimeout(() => {
          this.initContent = data.conditions || ''
        }, 300)

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

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
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
        salesOrderNo: undefined,
        businessPartnerName: undefined,
        salesOrderStatus: undefined,
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
        dropShipping: '0',

        poType: undefined,
        poNo: undefined,
        poDate: undefined,

        bpEmail: undefined,
        mobilePhone: undefined,
        freight: undefined,
        freightTaxNo: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        salesOrderProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: [],
        consignmentStartTime: undefined,
        consignmentEndTime: undefined,
        collapseWarningForProductInfo: false,

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
        projectBusinessContactPersonIds: [],
        projectContactPersonIds: [],
        salesOrderMixDesignList: [],
        sealRequired: '0'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPODetail = false
      this.collapseWarningForShippingInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5', '6']
      setTimeout(() => {
        if (this.$refs.uploadRefPO) {
          this.$refs.uploadRefPO.initFileList([])
        }
      }, 300)
      this.basicUpdateProps = []
      this.bpHistoryVersionList = []
      this.initContent = ''
      this.$nextTick(() => {
        this.$refs.form1 && this.$refs.form1.clearValidate()
        this.$refs.form2 && this.$refs.form2.clearValidate()
        this.$refs.form3 && this.$refs.form3.clearValidate()
      })
      // this.resetForm('form1')
      // this.resetForm('form2')
      // this.resetForm('form3')
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
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
      this.$set(this.form, 'salesOrderProductList', [])
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
      this.contactPersonClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      this.$set(this.form, 'salesOrderProductList', [])
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

      this.$set(this.form, 'salesOrderProductList', [])
      this.$set(this.form, 'salesOrderServiceList', [])
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'salesOrderProductList', [])
      this.$set(this.form, 'salesOrderServiceList', [])
    },

    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },
    /* 客户采购信息 */
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
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
      this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
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
    },
    contactPersonClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
    },
    /* 表单部分End */
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
        '/sales/salesOrder/preview' +
        `/${this.form.salesOrderId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesOrder/download' +
        `/${this.form.salesOrderId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
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
          `${this.$t('SALES.salesOrder')} [${vm.form.salesOrderNo}]`
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
          `${this.$t('SALES.salesOrder')} [${vm.form.salesOrderNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.salesOrderId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
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
