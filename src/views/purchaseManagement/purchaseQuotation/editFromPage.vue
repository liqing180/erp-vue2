<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="saveDraftBtnShow" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
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
      <!-- <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button> -->

      <el-button type="primary" size="mini" v-if="createPOBtnShow" @click="handleCreatePO"
        >{{ $t('PURCHASE.createPO') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="extendValidityBtnShow"
        @click="handleExtendValidity"
        >{{ $t('PURCHASE.extendValidity') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
      </el-button>
      <!--
      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <el-dropdown
        class="ml10 mr10 fr"
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
      </el-dropdown> -->
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.purchaseQuotation') }}
      </div>
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
                <span
                  v-if="form.businessPartnerName"
                  class="info-item mr20"
                  :title="form.businessPartnerName"
                >
                  {{ $t('ui.supplier') }} : {{ form.businessPartnerName }}
                </span>
                <span class="info-item mr20" v-if="form.purchaseQuotationStatus">
                  {{ $t('ui.status') }} :
                  {{
                    selectDictLabel(
                      dict.type.p_purchase_quotation_status,
                      form.purchaseQuotationStatus
                    )
                  }}
                </span>
                <span
                  v-if="form.purchaseQuotationStatus !== '1' && form.purchaseQuotationNo"
                  class="info-item"
                >
                  {{ $t('PURCHASE.purchaseQuotationNo') }} : {{ form.purchaseQuotationNo }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="150px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.supplier')}`" prop="businessPartnerName">
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
                    <el-form-item
                      :label="`${$t('PURCHASE.contactPerson')}`"
                      prop="contactPersonName"
                      :class="[isModified('contactPersonName')]"
                    >
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :disabled="!form.businessPartnerId || comDisFrom"
                            :id="form.contactPersonId"
                            :label="form.contactPersonName"
                            :title="form.contactPersonName"
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
                        <div class="con-right" v-if="!(!form.businessPartnerId || comDisFrom)">
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
                    <el-form-item :label="`${$t('PURCHASE.purchaseQuotationNo')}`">
                      <!-- form.purchaseQuotationStatus !== '1' -->
                      <el-input :value="form.purchaseQuotationNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.contactNo')}`"
                      :class="[isModified('mobilePhone')]"
                    >
                      <el-input
                        v-model="form.mobilePhone"
                        :title="form.mobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`" :class="[isModified('email')]">
                      <el-input v-model="form.email" :title="form.email" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_purchase_quotation_status,
                            form.purchaseQuotationStatus
                          )
                        "
                        disabled
                      ></el-input>
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
                      :class="[isModified('incotermName')]"
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
                        :disabled="comDisFrom || form.isOnlyService === '1'"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('PURCHASE.port')}`"
                      :class="[isModified('receivePortName')]"
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
                      :class="[isModified('receivePortName')]"
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
                        :loading="portOptionsLoading"
                        :disabled="
                          (form.country === legalEntityInfo.country
                            ? true
                            : form.incotermAddressType !== '1') || comDisFrom
                        "
                        @change="updatePort"
                        ref="portRef"
                        @handleOpen="openReceivePortTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required: true,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      :class="[isModified('receiveAddressName')]"
                      key="deliveryAddress2"
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
                    <el-form-item
                      :label="`${$t('PURCHASE.ourRef')}`"
                      :class="[isModified('ourRef')]"
                    >
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.yourRef')}`"
                      :class="[isModified('yourRef')]"
                    >
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.taxRate')}`"
                      prop="taxRate"
                      :class="[isModified('taxRate')]"
                    >
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :loading="taxRateOptionsLoading"
                        :disabled="!form.businessPartnerId"
                        @change="taxRateChange"
                      >
                        <template v-slot="{ item }">
                          <span class="select-left-text">{{ item.taxRateStr }}</span>
                          <span class="select-right-text">{{ item.description }}</span>
                        </template>
                      </CommonSelect>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.taxAmount')}`"
                      :class="[isModified('totalTaxAmount')]"
                    >
                      <el-input-number
                        v-thousandSplit="{ precision: 2, minPrecision: 2, keepDec: false }"
                        v-model="form.totalTaxAmount"
                        :precision="2"
                        :min-precision="2"
                        type="number"
                        :controls="false"
                        disabled
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.dateQuoted')}`"
                      prop="dateQuoted"
                      :class="[isModified('dateQuoted')]"
                    >
                      <el-date-picker
                        v-model="form.dateQuoted"
                        :picker-options="dateQuotedPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        @change="dateQuotedChange('validity')"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="$t('PURCHASE.supplierQuoteNo')"
                      prop="supplierQuoteNo"
                      :class="[isModified('supplierQuoteNo')]"
                    >
                      <el-input
                        v-model="form.supplierQuoteNo"
                        :title="form.supplierQuoteNo"
                        :maxlength="50"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.currency')}`"
                      prop="currencyId"
                      :class="[isModified('currency')]"
                    >
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
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

                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.validityDays')}`"
                      prop="validityForDay"
                      :class="[isModified('validity')]"
                    >
                      <div class="flex">
                        <el-input-number
                          v-thousandSplit="{ precision: 0 }"
                          v-model="form.validityForDay"
                          :disabled="!form.dateQuoted"
                          :precision="0"
                          type="number"
                          :min="1"
                          :max="999"
                          :controls="false"
                          style="width: 30%"
                          @change="validityChange('validityForDay')"
                        />
                        <span class="mr5 ml5">{{ $t('PURCHASE.day') }}</span>
                        <el-date-picker
                          @change="validityChange('validity')"
                          v-model="form.validity"
                          :disabled="!form.dateQuoted"
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
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('PURCHASE.paymentTerm')"
                      :class="[isModified('paymentTermName')]"
                      prop="paymentTermName"
                    >
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
                              :disabled="comDisFrom || !form.businessPartnerId"
                            />
                          </div>
                          <div
                            class="con-right"
                            v-if="
                              !comDisFrom &&
                              form.paymentTermName &&
                              checkPermi(['purchaseManagement:purchaseQuotation:editPaymentTerm'])
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
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchaseQuotation')}`"
                      required
                      prop="fileIdList"
                    >
                      <myUpload
                        :accept="['.jpg', '.jpeg', '.png', '.pdf']"
                        ref="uploadRef1"
                        :limit="1"
                        :singleFile="true"
                        :disabled="comDisFrom"
                        :updateFileList="updatePQFileList"
                        :filterOthersFileList="fileList"
                        @uploadChange="uploadChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('remarks')]">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('ui.attachment')}`"
                      :class="[isModified('attachment')]"
                    >
                      <myUpload
                        ref="uploadRef"
                        :filterOthersFileList="PQFileList"
                        :updateFileList="updateFileList"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                        disabled
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="taxIncludedForSystemSetup === '1' || form.taxIncludedForPre === '1'"
                  >
                    <el-form-item :label="`${$t('system.taxIncluded')}`">
                      <el-switch
                        v-model="form.taxIncluded"
                        active-value="1"
                        inactive-value="0"
                        @change="taxIncludedChange"
                        :disabled="comDisFrom"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" ref="collapseScrollPage">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <span v-if="purchaseQuotationDetailList.length" class="info-item mr20">
                  {{ $t('PURCHASE.product') }} : {{ purchaseQuotationDetailList.length }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  :comDisFrom="comDisFrom"
                  ref="ProductTable"
                  :businessPartnerId="form.businessPartnerId"
                  :pqProductList="initPqDetailList"
                  :countryId="form.countryId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  :linkRFQ="!!form.rfqNo"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  :form="form"
                  @changeRowCommittedDate="changeRowCommittedDate"
                  :allUomList="allUomList"
                  @scrollPageToTable="scrollPageToTable"
                  @scrollPageToTotalAmount="scrollPageToTotalAmount"
                  :serviceSurchargeListOptions="serviceSurchargeList"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="3">
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

    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <addBPContactPersonDlg
      ref="addBPContactPersonDlg"
      :businessPartnerType="form.businessPartnerType"
      @update="addBPContactPerson"
    />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['1']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.PQ"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />

    <ApprovedDialog
      :id="form.purchaseQuotationId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.purchaseQuotationId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.purchaseQuotationId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <RevisionComparisonDlg ref="RevisionComparisonDlg" />

    <ExtendValidityDlg ref="ExtendValidityDlg" @onSuccess="handleUpdate" />
  </FormPageLayout>
</template>

<script>
import { formDirtyClass } from '@/mixins/formDirtyClass'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import {
  savePurchaseQuotation,
  saveDraftPurchaseQuotation,
  queryPurchaseQuotationById,
  approvedPurchaseQuotation,
  rejectedPurchaseQuotation,
  cancelledPurchaseQuotation,
  withdrawApproved,
  addLastPurchaseQuotationMsg,
  queryHistoryPaymentTermName,
  queryAllTaxForPurchase
} from '@/api/purchaseManagement/purchaseQuotation'
import { queryUnapprovedAdhocProductNameList } from '@/api/purchaseManagement/requestForQuotation'
import { queryAllUomList } from '@/api/system/uom'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'

import ProductTable from '@/views/purchaseManagement/purchaseQuotation/productTable.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import RevisionComparisonDlg from '@/views/purchaseManagement/purchaseQuotation/revisionComparisonDlg.vue'
import { getSystemSetup } from '@/api/system/systemSetting'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'
import ExtendValidityDlg from './ExtendValidityDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'
export default {
  dicts: ['p_purchase_quotation_status', 'business_partner_payment_method'],
  mixins: [pageMixin],
  components: {
    selectSupplierTable,
    selectPortTable,
    selectWarehouseTable,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    ProductTable,
    SystemOperationLogTable,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    RevisionComparisonDlg,
    ExtendValidityDlg,
    addBPContactPersonDlg
  },
  data() {
    const vm = this
    return {
      isFocus: false,
      saveKey: '18',
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        detailsOfExpensesList: []
      },
      initialForm: {},
      paymentTermOptions: [],
      paymentTermOptionsLoading: false,

      collapseWarningForBasicInfo: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        contactPersonName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        supplierQuoteNo: [
          {
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
        dateQuoted: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        committedDate: [
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
        paymentTermName: [
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
        fileIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          if (vm.comDateQuoted) {
            return time.getTime() <= vm.comDateQuoted
          }
          // return time.getTime() < Date.now()
        }
      },
      dateQuotedPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      committedDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      currencyOptions: [],
      currencyOptionsLoading: false,
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      portOptionsLoading: false,
      taxRateOptions: [],
      taxRateOptionsLoading: false,
      /* 表格部分 */
      initPqDetailList: [],
      purchaseQuotationDetailList: [],
      serviceSurchargeList: [],
      // 系统设置，是否含税开关 1 开 0 关
      taxIncludedForSystemSetup: '0',
      allUomList: [],
      collapseWarningForProductInfo: false,
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSaveDraft: '0'
      },
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedPurchaseQuotation,
      rejectedUrl: rejectedPurchaseQuotation,
      cancelledUrl: cancelledPurchaseQuotation,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      bpHistoryVersionList: [],

      /* 功能：报价单附件与 附件相互过滤 */
      PQFileList: [],
      fileList: []
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
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    comIncotermReq() {
      if (this.form.country === this.legalEntityInfo.country) {
        return false
      }
      // if (this.form.dropShipping === '1') {
      //   return false
      // }
      const isProduct = this.purchaseQuotationDetailList.find((item) => item.productType === '1')
      return !!isProduct
    },
    comIncotermOptions() {
      if (this.form.country === this.legalEntityInfo.country) {
        return this.incotermOptions.filter((item) => item.incotermAbbreviation === 'EXW')
      }
      return this.incotermOptions
    },

    comDateQuoted() {
      if (this.form.dateQuoted) {
        return this.appointTime(this.form.dateQuoted, '00:00:00')
      }
      return undefined
    },

    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseQuotation:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseQuotationId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    createPOBtnShow() {
      return (
        this.form.isCanGoToPO === '1' && this.checkPermi(['purchaseManagement:purchaseOrder:add'])
      )
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.purchaseQuotationId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
      ) {
        show = true
      }
      return show
    },
    saveDraftBtnShow() {
      if (!this.editAuth) {
        return false
      }
      return ['1', '3'].includes(this.dataType) && this.buttonAuthMsg.isCanSaveDraft === '1'
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.purchaseQuotationId &&
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
        this.form.purchaseQuotationId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseQuotation:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseQuotationId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseQuotation:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.purchaseQuotationId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    extendValidityBtnShow() {
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseQuotationId &&
        this.buttonAuthMsg.isCanExtendValidity === '1'
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
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    // 付款条款
    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '1',
        menuPerms: this.menuKey.PQ,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermOptions = res.data || []
          const list = this.paymentTermOptions.filter((x) => x.isDefault === '1') || []
          if (!this.form.paymentTermId && list.length > 0) {
            this.paymentTermChange(list[0])
          }
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
    /* 功能：报价单附件与 附件相互过滤 */
    updatePQFileList(list) {
      this.PQFileList = list
    },
    updateFileList(list) {
      this.fileList = list
    },

    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.purchaseQuotationId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    async handleUpdate() {
      this.reset()
      this.queryAllUomList()
      const rowId = this.rowId
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      await this.getSystemSetup()
      queryPurchaseQuotationById({ purchaseQuotationId: rowId }).then((res) => {
        const data = res.data || {}
        if (data && data.isNeedTips === '1') {
          this.$modal.msgError(data.tipsMsg)
        }
        const list = data.purchaseQuotationDetailList || []
        let timer = Date.now()
        list.forEach((item) => {
          item.rowTimeId = item.productId
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              timer++
              child.rowTimeId = timer
            })
          }
          if (item.isPhantom === '1' && !data.modifiedId) {
            const defaultList = this.serviceSurchargeList.filter((i) => i.isDefault === '1')
            item.serviceSurchargeList = defaultList.map((item, index) => {
              timer++
              return {
                rowTimeId: timer,
                expenseItemName: item.expenseItemName, // 费用项名称
                unit: item.unit,
                unitPrice: undefined,
                includeDecimal: item.includeDecimal,
                decimalNum: item.includeDecimal === '1' ? 3 : 0,
                qtyLimit: item.qtyLimit,
                qty: 1
              }
            })
          }
          if (!item.serviceSurchargeList) {
            item.serviceSurchargeList = []
          }
        })

        this.initPqDetailList = list
        /* 初始化 AddressInfo */
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(data.commonFileList || [])
          this.$refs.uploadRef1.initFileList(data.commonFileListForPQ || [])
        }, 300)
        data.taxIncludedForPre = data.taxIncluded
        if (!data.taxIncluded) {
          if (this.taxIncludedForSystemSetup === '1') {
            data.taxIncluded = '1'
          } else {
            data.taxIncluded = '0'
          }
        }

        this.form = data
        // const registeredAddress =
        //   data.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
        // this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        // this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
        if (data.commonFileListForPQ && data.commonFileListForPQ.length > 0) {
          const ids = data.commonFileListForPQ.map((item) => item.id || item.fileId)
          this.$set(this.form, 'fileIdList', ids)
        }
        const rfqMsg = data.rfqMsg || '[]'
        this.initialForm = JSON.parse(rfqMsg)[0] || []
        this.initialForm.receiveAddressName = this.form.receiveAddressName
        this.initialForm.receiveAddressId = this.form.receiveAddressId
        this.initialForm.incotermAddressType = this.form.incotermAddressType

        if (this.form.purchaseQuotationStatus === '1' && !this.form.dateQuoted) {
          this.$set(this.form, 'dateQuoted', Date.now())
        }

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
        this.queryPaymentTermListByPaymentTermPurpose()
        this.queryCanSelectPortList()
        // this.queryHistoryPaymentTermName()
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)

        if (!this.form.purchaseQuotationStatus || this.form.purchaseQuotationStatus === '1') {
          this.queryUnapprovedAdhocProductNameList()
        }

        setTimeout(() => {
          const initFormJson = this.getFormJson()
          formDirtyClass.routeStatusData[this.$route.name] = {
            $vm: this,
            saveShow: this.saveDraftBtnShow,
            initFormJson,
            getFormJson: this.getFormJson,
            isSaveSuccess: false,
            saveOrSubmitFn: this.handleSaveDraftNoConFirm
          }
        }, 300)
      })
    },
    queryUnapprovedAdhocProductNameList() {
      const that = this
      const openConfirm = (tempProductNameList) => {
        const h = that.$createElement
        const contents = []
        contents.push(h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unApproval1')))
        tempProductNameList.forEach((x) => {
          const span1 = h(
            'span',
            {
              style:
                'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
            },
            ''
          )
          const span2 = h('span', { style: 'font-size: 14px' }, x)
          contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
        })
        const content = h('p', null, contents)
        this.$alert(content, '', {
          confirmButtonText: this.$t('uiBtn.confirm'),
          cancelButtonText: this.$t('uiBtn.back'),
          showCancelButton: false,
          showClose: false,
          type: 'warning',
          customClass: 'custom-class'
        })
          .then(() => {})
          .catch(() => {})
      }

      const productIdList = this.initPqDetailList.filter((x) => x.productId).map((k) => k.productId)
      // 筛选 没有productId 并且 isAdhocEntry === 1 的临时产品
      const isAdhocEntryProductList = this.initPqDetailList.filter(
        (x) => !x.productId && x.isAdhocEntry === '1'
      )
      if (productIdList.length > 0) {
        queryUnapprovedAdhocProductNameList({ productIdList }).then((res) => {
          let tempProductNameList = res.data || []
          if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
            tempProductNameList = [
              ...tempProductNameList,
              ...isAdhocEntryProductList.map((x) => x.productName)
            ]
          }
          if (tempProductNameList && tempProductNameList.length > 0) {
            const h = that.$createElement
            const contents = []
            contents.push(h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unApproval1')))
            tempProductNameList.forEach((x) => {
              const span1 = h(
                'span',
                {
                  style:
                    'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
                },
                ''
              )
              const span2 = h('span', { style: 'font-size: 14px' }, x)
              contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
            })
            const content = h('p', null, contents)
            this.$alert(content, '', {
              confirmButtonText: this.$t('uiBtn.confirm'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            })
              .then(() => {})
              .catch(() => {})
          } else if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
            const tempProductNameList = isAdhocEntryProductList.map((x) => x.productName)
            openConfirm(tempProductNameList)
          }
        })
      } else if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
        const tempProductNameList = isAdhocEntryProductList.map((x) => x.productName)
        openConfirm(tempProductNameList)
      }
    },
    getSystemSetup() {
      return getSystemSetup().then((res) => {
        const data = res.data || {}
        this.taxIncludedForSystemSetup = data.taxIncluded
        this.serviceSurchargeList = data.serviceSurchargeList || []
      })
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
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        businessPartnerName: undefined,
        purchaseQuotationStatus: undefined,
        purchaseQuotationNo: undefined,
        businessPartnerId: undefined,
        contactPersonName: undefined,
        bpBusinessContactPersonList: [],
        email: undefined,
        mobilePhone: undefined,
        supplierQuoteNo: undefined,
        validityForDay: undefined,
        validity: undefined,
        dateQuoted: undefined,
        committedDate: undefined,
        currencyId: undefined,
        currency: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        ourRef: undefined,
        incotermId: undefined,
        incotermName: undefined,
        remarks: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        purchaseQuotationCreateType: '1',
        fileIdList: [],
        detailsOfExpensesList: []
      }
      this.initialForm = {}
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.initPqDetailList = []
      this.purchaseQuotationDetailList = []
      this.activeNames = ['1', '2', '3']
      this.buttonAuthMsg = {}
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
    },

    /* 表单部分Start */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },
    openSupplierTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.changeCountryIdClearTableTaxNo({
        oldCountry: this.form.country,
        newCountry: undefined,
        oldBPId: this.form.businessPartnerId,
        newBPId: undefined
      })

      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.contactPersonClear()
      this.currencyClear()
    },
    updateSupplier(row) {
      this.changeCountryIdClearTableTaxNo({
        oldCountry: this.form.country,
        newCountry: row.country,
        oldBPId: this.form.businessPartnerId,
        newBPId: row.businessPartnerId
      })

      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      const registeredAddress =
        (row.bpBusinessAddressList || []).find((x) => (x.label || '').includes('Registered')) || {}
      this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
      this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.contactPersonClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
    },
    contactPersonChange(row) {
      this.$set(this.form, 'businessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'contactPersonId', row.contactPersonId)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNum', row.mobileNum)
      this.$set(this.form, 'mobileCode', row.mobileCode)
      this.$set(this.form, 'mobilePhone', row.mobilePhone)
      this.$set(this.form, 'email', row.email)
      if (row.isAdhocEntryContactPerson === '1') {
        this.$set(this.form, 'bpBusinessContactPerson', row)
        this.$set(this.form, 'isAdhocEntryContactPerson', '1')
      } else {
        this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
        this.$set(this.form, 'bpBusinessContactPerson', undefined)
      }
    },
    contactPersonClear() {
      this.$set(this.form, 'businessContactPersonId', undefined)
      this.$set(this.form, 'contactPersonId', undefined)
      this.$set(this.form, 'contactPersonName', undefined)
      this.$set(this.form, 'mobileNum', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'email', undefined)
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
      this.$set(this.form, 'businessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'contactPersonId', row.contactPersonId || undefined)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNum', row.mobileNum)
      this.$set(this.form, 'mobileCode', row.mobileCode)
      this.$set(this.form, 'mobilePhone', row.mobilePhone)
      this.$set(this.form, 'email', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')
      if (row.contactPersonId) {
        const showList = this.form.bpBusinessContactPersonList || []
        const index = showList.findIndex((x) => x.contactPersonId === row.contactPersonId)
        if (index >= 0) {
          showList.splice(index, 1, row)
        }
      }
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
      this.addLastPurchaseQuotationMsg()
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'currencyCode', undefined)
      this.$set(this.form, 'currencySymbol', undefined)
      this.addLastPurchaseQuotationMsg()
    },
    addLastPurchaseQuotationMsg() {
      const param = { ...this.form }
      const detailList = this.$refs.ProductTable.getList()
      param.purchaseQuotationDetailList = detailList
      const timer = Date.now()
      this.queryTime = timer
      if (this.form.currencyId) {
        addLastPurchaseQuotationMsg(param).then((res) => {
          if (this.queryTime !== timer) return
          const data = res.data || []
          const list = data.purchaseQuotationDetailList || []
          const PriceData = {}
          list.forEach((item) => {
            PriceData[item.productId] = item.lastBasicUnitPrice
          })
          this.$refs.ProductTable.setLastBasicUnitPrice(PriceData)
        })
      } else {
        this.$refs.ProductTable.setLastBasicUnitPrice({})
      }
    },

    /* 付款方式 */
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },

    queryAllTaxCodeByBusinessPartnerId() {
      this.taxRateOptionsLoading = true
      if (this.form.countryId) {
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
        this.taxRateOptionsLoading = false
      }
    },
    taxRateChange(row) {
      this.$set(this.form, 'taxId', row.taxId)
      this.$set(this.form, 'taxNo', row.taxNo)
      this.$set(this.form, 'taxRate', row.taxRate)
      this.$refs.ProductTable && this.$refs.ProductTable.handleCalculate()
    },

    queryIncotermList() {
      this.incotermOptionsLoading = true
      queryIncotermList({})
        .then((res) => {
          this.incotermOptionsLoading = false
          this.incotermOptions = res.data || []
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
      // this.receiveAddressClear()
      // if (oldType !== item.incotermAddressType) {
      this.receivePortClear()
      // }
      this.queryCanSelectPortList()
    },

    openReceiveAddressTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    // 清空pic
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'addressForWarehouse', undefined)
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
      this.portOptionsLoading = true
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 9999,
        firstCountryId,
        firstCountry,
        firstCity
      })
        .then((res) => {
          this.portOptions = res.rows || []
          this.portOptionsLoading = false
        })
        .catch(() => {
          this.portOptionsLoading = false
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
        if (this.form.receiveAddressCountry && this.form.receiveAddressCountry !== country) {
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
    receivePortClear() {
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      this.$set(this.form, 'addressForWarehouse', row)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
    },

    dateQuotedChange() {
      if (this.form.dateQuoted && this.$resultOfBoolean(this.form.validityForDay)) {
        this.validityChange('validityForDay')
      }
    },

    validityChange(changeType) {
      const cur = this.appointTime(this.form.dateQuoted, '00:00:00')
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
    queryHistoryPaymentTermName() {
      queryHistoryPaymentTermName({ businessPartnerId: this.form.businessPartnerId }).then(
        (res) => {
          console.log(res)
          this.historyPaymentTermNameList = (res.data || []).map((item) => {
            return {
              value: item
            }
          })
        }
      )
    },
    querySearch(queryString, cb) {
      cb(this.historyPaymentTermNameList)
      /* const vm = this
      const detailList = vm.historyPaymentTermNameList
      const str = (queryString || '').trim()

      let results
      if (str) {
        results = detailList.filter(
          (item) => item.value.toLowerCase().indexOf(str.toLowerCase()) >= 0
        )
      } else {
        results = detailList
      }
      cb(results) */
    },
    handleSelect() {},
    taxIncludedChange() {
      this.$refs.ProductTable && this.$refs.ProductTable.handleCalculate()
    },
    /* 表单部分End */

    /* 表格部分Start */
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    updateProductTable(list) {
      this.purchaseQuotationDetailList = list || []
    },
    changeRowCommittedDate(value) {
      this.$set(this.form, 'committedDate', value)
    },
    changeCountryIdClearTableTaxNo({ oldCountry, newCountry, oldBPId, newBPId }) {
      if (oldCountry !== newCountry) {
        this.$refs.ProductTable && this.$refs.ProductTable.clearTableTaxNo()
      }
      if (oldBPId !== newBPId) {
        this.initPqDetailList = []
      }
    },
    /* 表格部分End */

    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/purchaseManagement/revisePurchaseQuotation',
        query: {
          id: this.form.purchaseQuotationId,
          timeId: Date.now()
        }
      })
    },
    handleCreatePO() {
      const fromSrcPath = encodeURIComponent('/purchaseManagement/editPurchaseQuotation')
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          purchaseQuotationId: this.form.purchaseQuotationId,
          timeId: Date.now(),
          fromSrcPath
        }
      })
    },
    handleExtendValidity() {
      this.$refs.ExtendValidityDlg.handleOpen(this.form)
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
    queryProductHistoryVersion() {
      /* if (this.comeFrom !== '1') return
      queryPRHistoryVersion({ purchaseQuotationId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      }) */
    },
    settingHandleCommand(purchaseQuotationId) {
      this.$router.push({
        path: '/productManagement/viewExtendedProductInfo',
        query: {
          id: purchaseQuotationId,
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
    uploadChange(ids = []) {
      this.$set(this.form, 'fileIdList', ids)
      this.$refs.form1.validateField('fileIdList')
    },

    getFormJson() {
      const param = { ...this.form }
      delete param.subTotal
      delete param.totalTaxAmount
      delete param.totalAmount
      let detailList = this.$refs.ProductTable.getList() || []
      detailList = JSON.parse(JSON.stringify(detailList))
      detailList.forEach((x) => {
        delete x.taxRate
        delete x.taxAmount
        delete x.lineTotal
        delete x._stableIndex
      })
      param.purchaseQuotationDetailList = detailList
      const myFileIds = this.$refs.uploadRef.getFileIds()
      param.commonFileList = myFileIds
      const myFileIds1 = this.$refs.uploadRef1.getFileIds()
      param.commonFileListForPQ = myFileIds1
      return JSON.stringify(param)
    },
    async handleSaveDraft(isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }

      /* const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      }) */
      const valid1 = true
      this.$refs.form1.clearValidate()
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      const myFileIds1 = this.$refs.uploadRef1.getFileIds({
        required: false,
        requiredMsg: this.$t('ui.commonReqMsg').replace(
          '$1',
          this.$t('PURCHASE.purchaseQuotation') + this.$t('ui.attachment')
        )
      })
      if (myFileIds1 === false) {
        this.collapseWarningForBasicInfo = true
        return
      }

      this.collapseWarningForBasicInfo = false

      if (valid1) {
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        this.collapseWarningForProductInfo = false
        param.purchaseQuotationDetailList = detailList

        if (this.form.isTotalAmountNegativeTips === '1') {
          this.$refs.ProductTable.scrollPageToTotalAmount()
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds
        param.commonFileListForPQ = myFileIds1
        delete param.fileIdList
        if (this.submitLoading) return

        if (isConfirm) {
          this.$modal
            .confirm(this.$t('PURCHASE.pqSaveConfirm'))
            .then(() => {
              this.submitLoading = true
              return saveDraftPurchaseQuotation(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('PURCHASE.pqSaveSuccess').replace('$1', response.msg))
              this.back()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          this.submitLoading = true
          saveDraftPurchaseQuotation(param)
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.$modal.msgSuccess(this.$t('PURCHASE.pqSaveSuccess').replace('$1', response.msg))
              this.submitLoading = false
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
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    },
    async submitForm(submitType) {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }

      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        return this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo'))
        )
      }

      const myFileIds1 = this.$refs.uploadRef1.getFileIds({
        required: true,
        requiredMsg: this.$t('ui.commonReqMsg').replace(
          '$1',
          this.$t('PURCHASE.purchaseQuotation') + this.$t('ui.attachment')
        )
      })
      if (myFileIds1 === false) {
        this.collapseWarningForBasicInfo = true
        return
      }

      this.collapseWarningForBasicInfo = false
      if (valid1) {
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }

        if (param.detailsOfExpensesList && param.detailsOfExpensesList.length > 0) {
          const validDetailsOfExpenses = this.validDetailsOfExpensesList(
            param.detailsOfExpensesList || []
          )
          if (!validDetailsOfExpenses) {
            this.collapseWarningForProductInfo = true
            return
          }
        }
        this.collapseWarningForProductInfo = false
        param.purchaseQuotationDetailList = detailList

        if (this.form.isTotalAmountNegativeTips === '1') {
          this.$refs.ProductTable.scrollPageToTotalAmount()
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds
        param.commonFileListForPQ = myFileIds1
        delete param.fileIdList
        if (this.submitLoading) return

        this.$modal
          .confirm(this.$t('PURCHASE.pqSubmitConfirm'))
          .then(() => {
            this.submitLoading = true
            return savePurchaseQuotation(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(this.$t('PURCHASE.pqSubmitSuccess').replace('$1', response.msg))
            this.back()
            this.submitLoading = false
          })
          .catch(() => {
            this.submitLoading = false
          })
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
    validProductList(detailList) {
      this.$trimOfObj(this.form.detailsOfExpensesList)
      const detailsOfExpensesList = this.form.detailsOfExpensesList || []

      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        const childList = item.serviceSurchargeList || []
        if (!childList.length) return false
        const errItem = childList.find((child) => !child.expenseItemName)
        return !!errItem
      })
      if (productNameReq) {
        this.$refs.ProductTable.errorMessage('productName')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
        )
        return valid
      }
      let expenseItemNameExistsItem = false
      const productNameExists = detailList.find((item) => {
        const childList = item.serviceSurchargeList || []
        if (!childList.length) return false
        const nameCount = {}
        const errItem = childList.find((child) => {
          if (!nameCount[child.expenseItemName]) {
            nameCount[child.expenseItemName] = '1'
            return false
          } else {
            expenseItemNameExistsItem = child.expenseItemName
            return true
          }
        })
        return !!errItem
      })
      if (expenseItemNameExistsItem && productNameExists) {
        this.$modal.msgError(
          this.$t('ui.alreadyExists').replace('$1', `[${expenseItemNameExistsItem}]`)
        )
        return
      }

      const expenseItemReq = detailsOfExpensesList.find((item) => {
        return !(item.expenseItem || '').trim()
      })
      if (expenseItemReq) {
        this.$set(expenseItemReq, 'productNameError', true)
        this.$set(expenseItemReq, 'ROW-ERROR', true)
        this.$refs.ProductTable.errorMessage('productName')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
        )
        return valid
      }

      const record = new Set()
      for (const obj of detailsOfExpensesList) {
        const name = obj.expenseItem?.trim()
        // 为空跳过，如需禁止空值可自行加校验
        if (!name) continue

        if (record.has(name)) {
          // 发现重复，提示 + 返回false拦截
          this.$modal.msgError(this.$t('ui.alreadyExists').replace('$1', `[${name}]`))
          return false
        }
        record.add(name)
      }

      const qtyReq = detailList.find((item) => {
        if (!this.$resultOfBoolean(item.purchaseQty)) {
          return true
        }
        const errItem = (item.serviceSurchargeList || []).find(
          (child) => !this.$resultOfBoolean(child.qty)
        )
        if (errItem) {
          return true
        }
        return false
      })
      if (qtyReq) {
        this.$refs.ProductTable.errorMessage('purchaseQty')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.offeredQTY'))
        )
        return valid
      }

      const qtyLessThanMoq = detailList.find((item) => {
        return item.moq && item.purchaseQty < item.moq && item.pqResult === '1'
      })
      if (qtyLessThanMoq) {
        this.$modal.msgError(this.$t('PURCHASE.qtyLessThanMoq2'))
        return valid
      }

      const uomReq = detailList.find((item) => {
        if (!this.$resultOfBoolean(item.purchaseUom) && item.isProjectTempProduct !== '1') {
          return true
        }
        const errItem = (item.serviceSurchargeList || []).find(
          (child) => !this.$resultOfBoolean(child.unit)
        )
        if (errItem) {
          return true
        }
        return false
      })
      if (uomReq) {
        this.$refs.ProductTable.errorMessage('purchaseUom')
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.uom')))
        return valid
      }

      const ratioReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.purchaseUomCoefficient)
      })
      if (ratioReq) {
        this.$refs.ProductTable.errorMessage('purchaseUomCoefficient')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.ratio')))
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
        if (!this.$resultOfBoolean(item.unitPrice) && item.pqResult === '1') {
          return true
        }
        const errItem = (item.serviceSurchargeList || []).find(
          (child) => !this.$resultOfBoolean(child.unitPrice)
        )
        if (errItem) {
          return true
        }
        return false
      })
      if (unitPriceReq) {
        this.$refs.ProductTable.errorMessage('unitPrice')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
        )
        return valid
      }

      const amountReq = detailsOfExpensesList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$set(amountReq, 'unitPriceError', true)
        this.$set(amountReq, 'ROW-ERROR', true)
        this.$refs.ProductTable.errorMessage('unitPrice')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
        )
        return valid
      }

      const publishedListPriceReq = detailList.find((item) => {
        return (
          !this.$resultOfBoolean(item.publishedListPrice) &&
          item.pqResult === '1' &&
          ['11', '12'].includes(item.documentType) &&
          (item.isAdhocEntry === '1' ||
            item.isAdhocEntryHistory === '1' ||
            item.isProjectTempProduct === '1')
        )
      })
      if (publishedListPriceReq) {
        this.$refs.ProductTable.errorMessage('publishedListPrice')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.publishedListPrice'))
        )
        return valid
      }

      /* const moqReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.moq) && item.pqResult === '1'
      })
      if (moqReq) {
        this.$refs.ProductTable.errorMessage('moq')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.moq')))
        return valid
      } */

      const leadTimeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.leadTime) && item.pqResult === '1'
      })
      if (leadTimeReq) {
        this.$refs.ProductTable.errorMessage('leadTime')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
        )
        return valid
      }
      const remarksReq = detailList.find((item) => {
        return !(item.remarks || '').trim() && item.pqResult === '2'
      })
      if (remarksReq) {
        this.$refs.ProductTable.errorMessage('remarks')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.remarks')))
        return valid
      }

      return true
    },
    validDetailsOfExpensesList(detailList) {
      const valid = false
      const expenseItemReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.expenseItem)
      })
      if (expenseItemReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expenseItem'))
        )
        return valid
      }
      const amountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.amount')))
        return valid
      }
      return true
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
        `${vm.$t('ui.approvedSuccess')}`.replace('$1', `[${vm.form.purchaseQuotationNo}]`)
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
        `${vm.$t('ui.rejectedSuccess')}`.replace('$1', `[${vm.form.purchaseQuotationNo}]`)
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
        `${vm.$t('ui.cancelledSuccess')}`.replace('$1', `[${vm.form.purchaseQuotationNo}]`)
      )
      vm.back('onCancelSuccess')
    }
  }
}
</script>
<style lang="scss"></style>
