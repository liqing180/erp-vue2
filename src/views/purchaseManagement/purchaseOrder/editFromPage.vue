<template>
  <FormPageLayoutTabs v-loading="submitLoading" ref="FormPageLayoutRef">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="getVarContentLoading"
        v-if="!comDisFrom && !approvedBtnShow"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
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
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="closeBtnShow" @click="handleClose"
        >{{ $t('uiBtn.close') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
      </el-button>
      <!-- 作废 -->
      <el-button type="primary" size="mini" v-if="invalidateShow" @click="handleInvalidate"
        >{{ $t('menu.invalidate') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>

      <!-- <el-button
        type="primary"
        size="mini"
        v-if="previewPDFShow"
        :loading="previewPDFLoading"
        @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button> -->
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
      <el-button
        type="primary"
        size="mini"
        @click="
          initCommonFileList = initCommonFileListCur
          form.conditionsTableList = form.conditionsTableListCur
          isComparison = false
        "
        v-if="isShowEditBtn"
        >{{ $t('uiBtn.edit') }}
      </el-button>
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
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">{{ $t('menu.purchaseOrder') }}</div>
    </template>
    <template v-slot:tabs v-if="previewPDFShow">
      <el-tabs v-model="tabsActiveName" size="mini" type="card" @tab-click="handleTabsClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane :label="$t('menu.previewPDF')" name="pdfInfo"></el-tab-pane>
      </el-tabs>
    </template>

    <template v-slot:content>
      <div
        style="height: calc(100% - 6px)"
        v-show="tabsActiveName === 'pdfInfo'"
        v-loading="pdfInfoLoading"
      >
        <i-frame style="height: 100%" :src="pdfInfoUrl + '#navpanes=0'" v-if="pdfInfoUrl" />
        <!-- <div v-else style="height: 50vh"></div> -->
      </div>
      <div v-show="tabsActiveName === 'basicInfo'">
        <el-collapse v-model="activeNames">
          <div class="form-card mb10" v-if="isComparison">
            <!-- 顶部图例栏 -->
            <div class="legend-bar">
              <span class="legend-text">{{ $t('ui.legend') }}</span>
              <span class="legend-divider"></span>
              <span class="legend-item">
                <span class="color-block add"></span>{{ $t('ui.added') }}</span
              >
              <span class="legend-divider"></span>
              <span class="legend-item">
                <span class="color-block edit"></span>{{ $t('ui.modified') }}</span
              >
              <span class="legend-divider"></span>
              <span class="legend-item">
                <span class="color-block del"></span>{{ $t('ui.deleted') }}</span
              >
            </div>
          </div>

          <div
            class="form-card reject-card collapse-item-content-pt0 mb10"
            v-if="isComparison && (form.operationLogForLastReject || {}).operatorBy"
          >
            <el-collapse-item name="11">
              <FormCollapseItemTitle slot="title" :title="$t('ui.rejectionOpinion')">
              </FormCollapseItemTitle>
              <div class="mb10">
                <div class="reject-remarks">
                  <span>{{ (form.operationLogForLastReject || {}).operationDescription }}</span>
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
          </div>

          <!-- <div
            class="form-card editNotes-card collapse-item-content-pt0 mb10"
            v-if="isComparison && form.rejectSubmitRemarks"
          >
            <el-collapse-item name="12">
              <FormCollapseItemTitle slot="title" :title="$t('ui.editNotes')">
              </FormCollapseItemTitle>
              <div class="mb10">
                <div class="reject-remarks">{{ form.rejectSubmitRemarks }}</div>
                <div class="reject-by">
                  {{ $t('ui.preparedBy') }}：{{ form.modifiedBy }} |
                  {{ parseTime(form.modifiedTime, fmtForYmdhms) }}
                </div>
              </div>
            </el-collapse-item>
          </div> -->

          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
                <span class="info-item mr20" :title="form.businessPartnerName">
                  {{ $t('ui.supplier') }} : {{ form.businessPartnerName }}
                </span>
                <span
                  v-if="form.purchasePersonBy"
                  class="info-item mr20"
                  :title="form.purchasePersonBy"
                >
                  {{ $t('PURCHASE.purchaser') }} : {{ form.purchasePersonBy }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.p_purchase_order_status, form.purchaseOrderStatus) }}
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
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_purchase_order_status,
                            form.purchaseOrderStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseOrderNo')}`">
                      <el-input
                        v-model="form.purchaseOrderNo"
                        :title="form.purchaseOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8" v-if="form.createType === '2'" key="PR11">
                    <el-form-item :label="`${$t('PURCHASE.purchaseRequisitionNo')}`">
                      <ToolTipShowList
                        :list="(form.purchaseRequisiteList || []).map((i) => i.purchaseRequisiteNo)"
                        popoverTitle=""
                      >
                        <SelectInput :disabled="true" :value="comPRNoShowStr" :clearable="true" />
                      </ToolTipShowList>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else>
                    <el-form-item
                      :label="`${$t('PURCHASE.purchaseQuotationNo')}`"
                      prop="purchaseQuotationNo"
                    >
                      <!-- :disabled="comDisFrom || !form.businessPartnerId || isRevise" -->
                      <SelectInput
                        disabled
                        :value="form.purchaseQuotationNo"
                        :title="form.purchaseQuotationNo"
                        @click="openPurchaseQuotationTable"
                        :clearable="true"
                        @clear="purchaseQuotationNoClear"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.leadTimeDays')}`">
                      <ComparisonInput
                        v-if="isModified('leadTimeForDay')"
                        :beforeValue="getBeforeValue('leadTimeForDay')"
                        :afterValue="form.leadTimeForDay"
                      />
                      <el-input-number
                        v-else
                        class="w100"
                        v-thousandSplit="{ precision: 0 }"
                        :precision="0"
                        v-model="form.leadTimeForDay"
                        :min="1"
                        :max="999"
                        controls-position="right"
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.ourRef')}`">
                      <ComparisonInput
                        v-if="isModified('ourRef')"
                        :beforeValue="getBeforeValue('ourRef')"
                        :afterValue="form.ourRef"
                      />
                      <el-input
                        v-else
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                        :disabled="poEdit !== '1' || isRevise"
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
                        :afterValue="form.currency"
                      />
                      <CommonSelect
                        v-else
                        :disabled="
                          (!form.purchaseQuotationNo && !comPRNoShowStr) ||
                          comDisFrom ||
                          form.warehouseType === '2' ||
                          poEdit !== '1' ||
                          isRevise ||
                          cyQueryLoading
                        "
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :clearable="false"
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaser')}`" prop="purchasePersonBy">
                      <ComparisonInput
                        v-if="isModified('purchasePersonBy')"
                        :beforeValue="getBeforeValue('purchasePersonBy')"
                        :afterValue="form.purchasePersonBy"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.purchasePersonId"
                        :label="form.purchasePersonBy"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="purchasePersonByOptions"
                        :loading="purchasePersonByOptionsLoading"
                        @change="updatePurchasePerson"
                        @handleOpen="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom || isRevise"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.yourRef')}`">
                      <ComparisonInput
                        v-if="isModified('yourRef')"
                        :beforeValue="getBeforeValue('yourRef')"
                        :afterValue="form.yourRef"
                      />
                      <el-input
                        v-else
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                        :disabled="poEdit !== '1' || isRevise"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
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
                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermList"
                              :loading="paymentTermOptionsLoading"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                              :disabled="
                                comDisFrom ||
                                (!form.purchaseQuotationNo && !comPRNoShowStr) ||
                                (form.isEmergencyGoodsReceipt === '1' ? false : poEdit !== '1')
                              "
                            />
                          </div>
                          <div
                            class="con-right"
                            v-if="
                              !(
                                comDisFrom ||
                                (!form.purchaseQuotationNo && !comPRNoShowStr) ||
                                (form.isEmergencyGoodsReceipt === '1' ? false : poEdit !== '1')
                              ) &&
                              form.paymentTermName &&
                              checkPermi(['purchaseManagement:purchaseOrder:editPaymentTerm']) &&
                              form.createType !== '2'
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.validityDays')}`" prop="validityForDay">
                      <ComparisonInput
                        v-if="isModified('validityForDay')"
                        :beforeValue="getBeforeValue('validityForDay')"
                        :afterValue="form.validityForDay"
                      />
                      <div class="flex" v-else>
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
                        <span class="mr5 ml5">{{ $t('PURCHASE.day') }}</span>
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
                  <!-- <el-col :span="8">
                    <el-form-item :label="`${$t('menu.exchangeRate')}`">
                      <el-input
                        :value="form.exchangeRateDesc"
                        :title="form.exchangeRateDesc"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('basicRemarks')]">
                      <MyInput
                        type="textarea"
                        v-model="form.basicRemarks"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                        :disabled="isRevise"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.automatedEmail')}`"
                      :class="[isModified('automatedEmail')]"
                    >
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                        :disabled="isRevise"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.dropShipping')}`"
                      :class="[isModified('dropShipping')]"
                    >
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        :disabled="(form.createType === '2' && isDropShipping) || isRevise || true"
                        inactive-value="0"
                        @change="dropShippingChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="8"
                    v-if="taxIncludedForSystemSetup === '1' || form.taxIncludedForPre === '1'"
                  >
                    <el-form-item
                      :label="`${$t('system.taxIncluded')}`"
                      :class="[isModified('taxIncluded')]"
                    >
                      <el-switch
                        v-model="form.taxIncluded"
                        active-value="1"
                        inactive-value="0"
                        @change="taxIncludedChange"
                        :disabled="comDisFrom || form.createType !== '2'"
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
                :title="$t('PURCHASE.RecipientInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span
                  v-if="form.incotermAbbreviation && form.country !== legalEntityInfo.country"
                  class="info-item mr20"
                  :title="form.incotermAbbreviation"
                >
                  {{ $t('PURCHASE.incoterm') }} : {{ form.incotermAbbreviation }}
                </span>
                <span
                  v-if="form.receiveAddressName"
                  class="info-item"
                  :title="form.receiveAddressName"
                >
                  {{ $t('PURCHASE.deliveryAddress') }} : {{ form.receiveAddressName }}
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
                <div v-if="form.dropShipping === '1'" key="SOFormKey2">
                  <el-row>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item :label="`${$t('PURCHASE.incoterm')}`">
                        <el-input
                          :value="form.incotermName"
                          :title="form.incotermName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item :label="`${$t('PURCHASE.port')}`">
                        <el-input
                          v-if="form.incotermAddressType === '0'"
                          :value="$t('PURCHASE.selfCollect')"
                          disabled
                        ></el-input>
                        <el-input
                          v-else
                          :value="form.receivePortName"
                          :title="form.receivePortName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="`${$t('PURCHASE.deliveryAddress')}`">
                        <el-input
                          :value="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.consignee')}`">
                        <el-input
                          v-model="form.requestedBy"
                          :title="form.requestedBy"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`">
                        <el-input
                          v-model="form.requestedEmail"
                          :title="form.requestedEmail"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedMobilePhone')}`">
                        <el-input
                          v-model="form.requestedMobilePhone"
                          :title="form.requestedMobilePhone"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div v-else key="noSOFormKey">
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
                        <ComparisonInput
                          v-if="isModified('incotermName')"
                          :beforeValue="getBeforeValue('incotermName')"
                          :afterValue="form.incotermName"
                        />
                        <CommonSelect
                          v-else
                          :disabled="
                            comDisFrom ||
                            (!form.purchaseQuotationNo && !comPRNoShowStr) ||
                            (form.isEmergencyGoodsReceipt === '1' ? false : poEdit !== '1') ||
                            isRevise
                          "
                          :id="form.incotermId"
                          :label="form.incotermName"
                          :title="form.incotermName"
                          idKey="incotermId"
                          labelKey="incotermName"
                          :options="comIncotermOptions"
                          :loading="incotermOptionsLoading"
                          @change="incotermIdChange"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                      <el-form-item
                        :label="`${$t('PURCHASE.port')}`"
                        prop="receivePortName"
                        :rules="[
                          {
                            required: form.incotermAddressType === '1' && comIncotermReq,
                            message: $t('ui.reqMsg'),
                            trigger: ['change']
                          }
                        ]"
                      >
                        <template v-if="form.incotermAddressType === '0'">
                          <ComparisonInput
                            v-if="isModified('receivePortName')"
                            :beforeValue="getBeforeValue('receivePortName')"
                            :afterValue="form.receivePortName"
                          />
                          <el-input v-else :value="$t('PURCHASE.selfCollect')" disabled></el-input>
                        </template>
                        <ToolTipShowObj
                          v-else
                          :mData="form.addressForPort || {}"
                          :showStr="form.receivePortName"
                          :rows="shipToAddressRows"
                        >
                          <ComparisonInput
                            v-if="isModified('receivePortName')"
                            :beforeValue="getBeforeValue('receivePortName')"
                            :afterValue="form.receivePortName"
                          />
                          <CommonSelectAndList
                            v-else
                            :id="form.receivePortId"
                            :label="form.receivePortName"
                            idKey="portId"
                            labelKey="portName"
                            filterable
                            :options="portOptions"
                            :disabled="
                              !form.incotermId ||
                              form.incotermAddressType !== '1' ||
                              comDisFrom ||
                              (form.isEmergencyGoodsReceipt === '1' ? false : poEdit !== '1') ||
                              isRevise
                            "
                            @change="updatePort"
                            ref="portRef"
                            @handleOpen="openReceivePortTable"
                          />
                        </ToolTipShowObj>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        :label="`${$t('PURCHASE.deliveryAddress')}`"
                        prop="receiveAddressName"
                        key="warehouse11"
                      >
                        <ToolTipShowObj
                          :mData="form.addressForWarehouse || {}"
                          :showStr="form.receiveAddressName"
                          :rows="warehouseRows"
                        >
                          <ComparisonInput
                            v-if="isModified('receiveAddressName')"
                            :beforeValue="getBeforeValue('receiveAddressName')"
                            :afterValue="form.receiveAddressName"
                          />
                          <SelectInput
                            v-else
                            clearable
                            :value="form.receiveAddressName"
                            @click="openWarehouseTable"
                            @clear="warehouseClear"
                            :disabled="comDisFrom || disWarehouse || isRevise"
                          />
                        </ToolTipShowObj>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.consignee')}`" prop="requestedBy">
                        <ComparisonInput
                          v-if="isModified('requestedBy')"
                          :beforeValue="getBeforeValue('requestedBy')"
                          :afterValue="form.requestedBy"
                        />
                        <CommonSelect
                          v-else
                          :disabled="
                            comDisFrom ||
                            (form.dropShipping === '1' ? false : !form.receiveAddressName) ||
                            disWarehouse ||
                            isRevise
                          "
                          :id="form.requestedId"
                          :label="form.requestedBy"
                          :title="form.requestedBy"
                          idKey="userId"
                          labelKey="nickName"
                          :options="form.userList || []"
                          @change="requestedByChange1"
                        />
                        <!-- <div class="input-switch-box">
                        <div class="con-left">
                          <el-input
                            v-model="form.requestedBy"
                            :title="form.requestedBy"
                            disabled
                          ></el-input>
                        </div>
                        <div class="con-right" v-if="!!form.receiveAddressName">
                          <svg-icon
                            @click="addRequestedBy"
                            icon-class="add"
                            style="height: 36px; width: 36px; cursor: pointer"
                          />
                        </div>
                      </div> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`">
                        <ComparisonInput
                          v-if="isModified('requestedEmail')"
                          :beforeValue="getBeforeValue('requestedEmail')"
                          :afterValue="form.requestedEmail"
                        />
                        <el-input
                          v-else
                          v-model="form.requestedEmail"
                          :title="form.requestedEmail"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.requestedMobilePhone')}`"
                        :class="[isModified('requestedMobilePhone')]"
                      >
                        <ComparisonInput
                          v-if="isModified('requestedMobilePhone')"
                          :beforeValue="getBeforeValue('requestedMobilePhone')"
                          :afterValue="form.requestedMobilePhone"
                        />
                        <el-input
                          v-else
                          v-model="form.requestedMobilePhone"
                          :title="form.requestedMobilePhone"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('shipRemarks')]">
                      <MyInput
                        type="textarea"
                        v-model="form.shipRemarks"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
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
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <span v-if="$resultOfBoolean(form.totalAmount)" class="info-item mr20">
                  {{ $t('PURCHASE.totalAmount') }} :
                  {{ $numberStr(form.totalAmount, 6, false, 2) }}
                </span>
                <span v-if="$resultOfBoolean(form.totalFreight)" class="info-item mr20">
                  {{ $t('PURCHASE.totalFreight') }} :
                  {{ $numberStr(form.totalFreight, 6, false, 2) }}
                </span>
                <span v-if="$resultOfBoolean(form.totalTaxAmount)" class="info-item">
                  {{ $t('PURCHASE.taxAmount') }} :
                  {{ $numberStr(form.totalTaxAmount, 6, false, 2) }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :formData="form"
                  :productList="initPoDetailList"
                  :initCommonFileList="initCommonFileList"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  @getPoById="getPoById"
                  :comDisFrom="comDisFrom || isRevise"
                  :isRevise="isRevise && !comDisFrom && form.purchaseOrderStatus === '1'"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  :updateMsg="updateMsg"
                  :getBeforeValue="getBeforeValue"
                  @updateLeadTime="updateLeadTime"
                  :poEdit="poEdit"
                  :poPurchaseQty="poPurchaseQty"
                  @scrollPageToTable="scrollPageToTable"
                  @scrollPageToTotalAmount="scrollPageToTotalAmount"
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
                  :varContentData="varContentData"
                  :modifyHighlight="modifyHighlight"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="5">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.contactInfo')"
                :warning="collapseWarningForDeliveryInfo"
              >
                <span
                  v-if="form.bpContactPersonName"
                  class="info-item mr20"
                  :title="form.bpContactPersonName"
                >
                  {{ $t('PURCHASE.deliveryBy') }} : {{ form.bpContactPersonName }}
                </span>
                <span v-if="form.bpAddress" class="info-item" :title="form.bpAddress">
                  {{ $t('PURCHASE.deliveryAddress1') }} : {{ form.bpAddress }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form4"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.deliveryBy')}`" prop="bpContactPersonId">
                      <ComparisonInput
                        v-if="isModified('bpContactPersonName')"
                        :beforeValue="getBeforeValue('bpContactPersonName')"
                        :afterValue="form.bpContactPersonName"
                      />
                      <CommonSelect
                        v-else
                        :disabled="!form.businessPartnerId || comDisFrom"
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="deliveryByChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.deliveryEmail')}`">
                      <ComparisonInput
                        v-if="isModified('bpEmail')"
                        :beforeValue="getBeforeValue('bpEmail')"
                        :afterValue="form.bpEmail"
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
                    <el-form-item :label="`${$t('PURCHASE.deliveryMobilePhone')}`">
                      <ComparisonInput
                        v-if="isModified('bpMobilePhone')"
                        :beforeValue="getBeforeValue('bpMobilePhone')"
                        :afterValue="form.bpMobilePhone"
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
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress1')}`"
                      prop="bpBusinessAddressId"
                    >
                      <ComparisonInput
                        v-if="isModified('bpAddress')"
                        :beforeValue="getBeforeValue('bpAddress')"
                        :afterValue="form.bpAddress"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.bpBusinessAddressId"
                        :label="form.bpAddress"
                        :title="form.bpAddress"
                        idKey="businessAddressId"
                        labelKey="receiveAddress"
                        filterable
                        :options="deliveryAddressOptions"
                        :loading="deliveryAddressOptionsLoading"
                        :disabled="!form.businessPartnerId || comDisFrom"
                        @change="deliveryAddressChange"
                        @handleOpen="openDeliveryAddressTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="6">
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
    <selectPurchaseQuotationTable
      ref="selectPurchaseQuotationTable"
      :businessPartnerId="form.businessPartnerId"
      :purchaseOrderId="form.purchaseOrderId"
      @update="updatePurchaseQuotationNo"
    />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <editRequestedByDlg ref="editRequestedByDlg" @update="requestedByChange" />
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="salesOrderChange" />

    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['1']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.PO"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />
    <selectBPAddressDlg
      ref="selectBPAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="deliveryAddressChange"
    />
    <ApprovedDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="purchaseOrder"
    />
    <RejectDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- 关闭 -->
    <FormCloseDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :close-api-url="closedUrl"
      @submitSuccess="closeSubmitSuccess"
      ref="FormCloseDialog"
    />
    <!-- 作废 -->
    <InvalidateDialog
      :purchaseOrderId="form.purchaseOrderId"
      @submitSuccess="invalidateSubmitSuccess"
      ref="InvalidateDialog"
    />

    <!-- <RejectSubmitRemarksDialog
      @submitSuccess="rejectSubmitRemarksSubmitSuccess"
      ref="RejectSubmitRemarksDialog"
    /> -->

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
    <RevisionComparisonDlgV2 ref="RevisionComparisonDlgV2" />
  </FormPageLayoutTabs>
</template>

<script>
import { formDirtyClass } from '@/mixins/formDirtyClass'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryUsers } from '@/api/organization/corporate'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import {
  savePurchaseOrder,
  saveDraftPurchaseOrder,
  queryPurchaseOrderById,
  approvedPurchaseOrder,
  rejectedPurchaseOrder,
  cancelledPO,
  closedPO,
  withdrawApproved,
  preview,
  addPQDefaultMsgToPO,
  queryPurchaseOrderHistoryVersion,
  conversionCurrencyUnitPrice,
  getFormattedVarContent,
  checkIsCanReviseForButton,
  checkIsCanReviseForSubmit
} from '@/api/purchaseManagement/purchaseOrder'
import { queryUnapprovedAdhocProductNameList } from '@/api/purchaseManagement/requestForQuotation'

import { queryWarehouseById } from '@/api/inventoryManagement/warehouse'
import { getToken } from '@/utils/auth'
import { getSystemSetup } from '@/api/system/systemSetting'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPurchaseQuotationTable from './components/selectPurchaseQuotationTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import editRequestedByDlg from './components/editRequestedByDlg.vue'
import ProductTable from '@/views/purchaseManagement/purchaseOrder/productTable.vue'
import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'
import selectBPAddressDlg from './components/selectBPAddressDlg.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import FormCloseDialog from '@/views/bpm/history/closeDialog/formCloseDialog'
import InvalidateDialog from '@/views/purchaseManagement/purchaseOrder/invalidateDialog/invalidateDialog'
// import RejectSubmitRemarksDialog from '@/views/purchaseManagement/purchaseOrder/rejectSubmitRemarksDialog/rejectSubmitRemarksDialog'

import RevisionComparisonDlg from '@/views/purchaseManagement/purchaseOrder/revisionComparisonDlg.vue'
import RevisionComparisonDlgV2 from '@/views/purchaseManagement/purchaseOrder/revisionComparisonDlgV2.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ConditionsTable from '@/views/salesManagement/salesQuotation/conditionsTable.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import iFrame from '@/components/iFrame/index'
import { getMultiplyDecimalPlaces } from '@/utils/bigUtils/bigUtils.js'

export default {
  dicts: ['p_purchase_order_status', 'business_partner_payment_method'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    iFrame,
    selectSupplierTable,
    selectPurchaseQuotationTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    editRequestedByDlg,
    selectSalesOrderTable,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    selectBPAddressDlg,
    ProductTable,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    FormCloseDialog,
    InvalidateDialog,
    // RejectSubmitRemarksDialog,
    RevisionComparisonDlg,
    RevisionComparisonDlgV2,
    SystemOperationLogTable,
    ConditionsTable
  },
  data() {
    return {
      tabsActiveName: 'basicInfo',
      pdfInfoLoading: false,
      pdfInfoUrl: '',
      salesConditionsList: [],
      varContentData: {},
      getVarContentLoading: false,
      cyQueryLoading: false,

      previewPDFLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,

      form: {},
      /* 直运选择订单后保存的数据 */
      SOForm: {},

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForDeliveryInfo: false,
      collapseWarningForConditions: false,
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
        departmentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchasePersonBy: [
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
            trigger: ['blur']
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
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],

        committedDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        /* salesOrderNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ], */
        incotermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        receiveAddressName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requestedBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonId: [
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
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      committedDateDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      deptOptions: [],
      currencyOptions: [],
      currencyOptionsLoading: false,
      purchasePersonByOptions: [],
      purchasePersonByOptionsLoading: false,
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      freightTaxNoOptions: [],
      // 系统设置，是否含税开关 1 开 0 关
      taxIncludedForSystemSetup: '0',
      /* 表格部分 */
      initPoDetailList: [],
      initCommonFileList: [],
      initCommonFileListCur: [],
      purchaseOrderDetailList: [],
      collapseWarningForProductInfo: false,

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
          label: this.$t('PURCHASE.port'),
          showLabel: 'portName'
        },
        {
          label: this.$t('PURCHASE.code'),
          showLabel: 'portCode'
        },
        {
          label: this.$t('PURCHASE.latLong'),
          showLabel: 'latLong'
        },
        {
          label: this.$t('PURCHASE.telephone'),
          showLabel: 'telephone'
        },
        {
          label: this.$t('PURCHASE.website'),
          showLabel: 'website'
        },
        {
          label: this.$t('PURCHASE.country'),
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
      approvedUrl: approvedPurchaseOrder,
      rejectedUrl: rejectedPurchaseOrder,
      cancelledUrl: cancelledPO,
      closedUrl: closedPO,
      approvedFormData: undefined,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      /* 是否显示对比高亮 */
      isComparison: false,
      poEdit: undefined,
      poPurchaseQty: undefined,
      paymentTermList: [],
      paymentTermOptionsLoading: false,
      bpHistoryVersionList: [],
      deliveryAddressOptions: [],
      deliveryAddressOptionsLoading: false
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
    },
    comIncotermReq: {
      handler: function (selected) {
        this.$nextTick(() => {
          if (this.$refs.form2) {
            this.$refs.form2.clearValidate(['incotermId', 'receivePortName'])
          }
        })
      }
    }
  },
  computed: {
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    isDropShipping() {
      return this.purchaseOrderDetailList.some(
        (item) => item.dropShipping === '1' || item.isSystemDocking === '1'
      )
      // return this.purchaseOrderDetailList.some((item) => item.dropShipping === '1')
    },
    comIncotermReq() {
      if (this.form.country === this.legalEntityInfo.country) {
        return false
      }
      const isProduct = this.purchaseOrderDetailList.find((item) => item.productType === '1')
      return !!isProduct
    },
    comIncotermOptions() {
      if (this.form.country === this.legalEntityInfo.country) {
        return this.incotermOptions.filter((item) => item.incotermAbbreviation === 'EXW')
      }
      return this.incotermOptions
    },
    disWarehouse() {
      /* 如果PQ没有选择仓库,则PO的仓库可以编辑，绕过系统设置的开关 */
      if (this.form.initialWarehouseId) {
        // return !this.form.purchaseQuotationNo || this.poEdit !== '1'
        return true
      } else {
        return !this.form.purchaseQuotationNo && !this.comPRNoShowStr
      }
    },
    comPRNoShowStr() {
      return (this.form.purchaseRequisiteList || []).map((i) => i.purchaseRequisiteNo).join(',')
    },
    comSalesConditionsList() {
      const list = JSON.parse(JSON.stringify(this.salesConditionsList || []))
      return this.groupAndAddHideLabel(list)
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:edit'])
    },
    isShowEditBtn() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      ) {
        show = true
      }
      return show
    },
    comDisFrom() {
      let dis = true
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
      ) {
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
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
      ) {
        show = true
      }
      return show
    },
    isRevise() {
      return this.form.isRevise === '1'
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.purchaseOrderId &&
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
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.purchaseOrderId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    closeBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:close'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanClosed === '1'
      ) {
        show = true
      }
      return show
    },
    invalidateShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:invalidate'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanInvalidate === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (
        !this.checkPermi(['purchaseManagement:purchaseOrder:previewPDF']) &&
        !this.approvedBtnShow
      ) {
        return false
      }
      let show = false
      if (this.form.purchaseOrderId && this.buttonAuthMsg.isCanPreviewPDF === '1') {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (
        !this.checkPermi(['purchaseManagement:purchaseOrder:printPDF']) &&
        !this.approvedBtnShow
      ) {
        return false
      }
      let show = false
      if (this.form.purchaseOrderId && this.buttonAuthMsg.isCanPrintPDF === '1') {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (
        !this.checkPermi(['purchaseManagement:purchaseOrder:exportPDF']) &&
        !this.approvedBtnShow
      ) {
        return false
      }
      let show = false
      if (this.form.purchaseOrderId && this.buttonAuthMsg.isCanDownloadPDF === '1') {
        show = true
      }
      return show
    },

    modifyHighlight() {
      if (
        this.approvedBtnShow &&
        this.buttonAuthMsg.isCanSeeUpdateMsg === '1' &&
        this.isComparison
      ) {
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
    // 付款条款
    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '1',
        menuPerms: this.menuKey.PO,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermList = res.data || []
          const list = this.paymentTermList.filter((x) => x.isDefault === '1') || []
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
      this.getFormattedVarContentFn()
    },
    openEditPaymentTermDlg() {
      this.$refs.editPaymentTernDlg.handleUpdate(this.form.paymentTerm)
    },
    paymentTermEditChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.getFormattedVarContentFn()
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.purchaseOrderId,
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
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      // this.queryCanSelectPortList()
      this.getPoById()
      this.getSystemSetup()
      this.queryPurchaseOrderHistoryVersion()
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        this.taxIncludedForSystemSetup = data.taxIncluded

        this.poEdit = data.poEdit
        this.poPurchaseQty = data.poPurchaseQty
        const salesConditions = data.conditions || ''
        try {
          this.salesConditionsList = salesConditions ? JSON.parse(salesConditions) : []
        } catch (error) {
          this.salesConditionsList = []
        }
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
    getPoById() {
      const rowId = this.rowId
      queryPurchaseOrderById({ purchaseOrderId: rowId }).then((res) => {
        const data = res.data || {}
        data.detailsOfExpensesList = data.detailsOfExpensesList || []
        data.detailsOfExpensesList.forEach((item) => {
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
        const list = data.purchaseOrderDetailList || []
        let timer = Date.now()
        list.forEach((item) => {
          timer++
          item.rowTimeId = timer
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              timer++
              child.rowTimeId = timer
              child.exchangeRateDesc = data.exchangeRateDesc
              child.sourceDocIdList = child.sourceDocId && child.sourceDocId.split(',')
              child.purchaseRequisiteListShowStr = child.sourceDocNo
              child.emergencyGoodsReceiptList = item.emergencyGoodsReceiptList || []
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
          item.exchangeRateDesc = data.exchangeRateDesc
        })
        this.initPoDetailList = list
        this.purchaseOrderDetailList = JSON.parse(JSON.stringify(this.initPoDetailList))
        const addressForWarehouse = data.addressForWarehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
        if (data.warehouseId) {
          data.initialWarehouseId = data.warehouseId
        }

        if (data.conditionsTableJson) {
          data.conditionsTableList = JSON.parse(data.conditionsTableJson)
        }
        data.taxIncludedForPre = data.taxIncluded

        this.form = data
        // const registeredAddress =
        //   data.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
        // this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        // this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
        this.queryCanSelectPortList()
        this.queryWarehouseById()
        this.queryPaymentTermListByPaymentTermPurpose()
        this.queryPurchasePersonByOptions()
        this.queryDeliveryAddressOptions()
        if (data.dropShipping === '1') {
          this.$set(this.SOForm, 'incotermId', data.incotermId)
          this.$set(this.SOForm, 'incotermName', data.incotermName)
          this.$set(this.SOForm, 'incotermAbbreviation', data.incotermAbbreviation)
          this.$set(this.SOForm, 'incotermAddressType', data.incotermAddressType)
          this.$set(this.SOForm, 'receiveAddressId', data.receivePortId)
          this.$set(this.SOForm, 'receivePortName', data.receivePortName)
          this.$set(this.SOForm, 'requestedId', data.requestedId)
          this.$set(this.SOForm, 'requestedBy', data.requestedBy)
          this.$set(this.SOForm, 'requestedEmail', data.requestedEmail)
          this.$set(this.SOForm, 'requestedMobileCode', data.requestedMobileCode)
          this.$set(this.SOForm, 'requestedMobileNum', data.requestedMobileNum)
          this.$set(this.SOForm, 'requestedMobilePhone', data.requestedMobilePhone)
        }
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        this.updateMsg = updateMsg
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []
        this.basicUpdateMsgList = basicUpdateMsgList

        this.$nextTick(() => {
          this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
          if (this.isComparison) {
            const list1 = data.commonFileList || []
            const delList = beforeCommonFileList.filter((x) => x.updateType === '3')
            this.initCommonFileList = [...list1, ...delList]
            this.initCommonFileListCur = data.commonFileList || []
            /* 赋值显示对比信息条件表 */
            this.form.conditionsTableListCur = this.form.conditionsTableList
            this.form.conditionsTableList = updateMsg.changeConditionsTableList || []
          } else {
            this.initCommonFileList = data.commonFileList || []
          }
          setTimeout(() => {
            if (this.isComparison) {
              this.revisionComparison()
            }
          }, 300)
        })
        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 300)

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
        this.getFormattedVarContentFn()

        if (!this.form.purchaseOrderStatus || this.form.purchaseOrderStatus === '1') {
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
        }, 500)
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

      const productIdList = this.initPoDetailList.filter((x) => x.productId).map((k) => k.productId)
      // 筛选 没有productId 并且 isAdhocEntry === 1 的临时产品
      const isAdhocEntryProductList = this.initPoDetailList.filter(
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
    queryWarehouseById() {
      if (!this.form.warehouseId) return
      queryWarehouseById({ warehouseId: this.form.warehouseId }).then((res) => {
        const { userList } = res.data || {}
        this.$set(this.form, 'userList', userList || [])
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
        /* 基础信息 */
        purchaseOrderNo: undefined,
        businessPartnerName: undefined,
        purchaseOrderStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        purchasePersonBy: undefined,
        purchasePersonId: undefined,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validityForDay: undefined,
        validity: undefined,
        committedDate: undefined,
        leadTimeForDay: undefined,
        ourRef: undefined,
        yourRef: undefined,
        conditions: undefined,
        basicRemarks: undefined,
        automatedEmail: '1',
        dropShipping: '0',
        taxRate: undefined,
        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receivePortId: undefined,
        receivePortName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        userList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForConditions = false
      this.initPoDetailList = []
      this.initCommonFileList = []
      this.purchaseOrderDetailList = []
      this.activeNames = ['1', '2', '3', '4', '5', '6', '11', '12']
      /* setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300) */
      this.tabsActiveName = 'basicInfo'

      this.resetForm('form1')
      this.resetForm('form2')
      this.resetForm('form4')
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },
    openSupplierTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.purchaseQuotationNoClear()

      this.deliveryByClear()
      this.deliveryAddressClear()
      this.initPoDetailList = []
    },
    updateSupplier(row) {
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
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      this.purchaseQuotationNoClear()

      this.deliveryByClear()
      this.deliveryAddressClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.deliveryByChange(defaultContact)
        }
      }
      this.initPoDetailList = []
    },

    openPurchaseQuotationTable() {
      this.$refs.selectPurchaseQuotationTable.handleOpen()
    },
    updatePurchaseQuotationNo(row) {
      this.$set(this.form, 'purchaseQuotationNo', row.purchaseQuotationNo)
      this.$set(this.form, 'purchaseQuotationId', row.purchaseQuotationId)
      this.warehouseClear()
      this.receivePortClear()
      addPQDefaultMsgToPO({
        purchaseQuotationId: row.purchaseQuotationId,
        purchaseOrderId: this.form.purchaseOrderId,
        dropShipping: this.form.dropShipping
      }).then((res) => {
        const dataInfo = res.data || {}
        this.$set(this.form, 'currencyId', dataInfo.currencyId)
        this.$set(this.form, 'currencyCode', dataInfo.currencyCode)
        this.$set(this.form, 'currency', dataInfo.currency)
        this.$set(this.form, 'paymentMethodIdList', dataInfo.paymentMethodIdList || [])
        this.$set(this.form, 'paymentMethodNameList', dataInfo.paymentMethodNameList || [])
        this.$set(this.form, 'receiveAddressCountryId', dataInfo.receiveAddressCountryId)

        // this.$set(this.form, 'paymentTermName', dataInfo.paymentTermName)
        this.incotermIdChange(dataInfo)

        if (dataInfo.incotermAddressType === '1') {
          this.$set(this.form, 'addressForPort', dataInfo.addressForPort)
          this.$set(this.form, 'receivePortId', dataInfo.receivePortId)
          this.$set(this.form, 'receivePortName', dataInfo.receivePortName)
        }

        if (
          // this.form.dropShipping !== '1' &&
          dataInfo.receiveAddressId &&
          dataInfo.addressForWarehouse &&
          dataInfo.addressForWarehouse.warehouseId
        ) {
          this.$set(this.form, 'addressForWarehouse', dataInfo.addressForWarehouse)
          this.$set(this.form, 'receiveAddressName', dataInfo.receiveAddressName)
          this.$set(this.form, 'receiveAddressId', dataInfo.receiveAddressId)
          this.$set(this.form, 'warehouseId', dataInfo.receiveAddressId)
          this.$set(this.form, 'warehouseName', dataInfo.receiveAddressName)
          this.$set(this.form, 'warehouseType', dataInfo.receiveAddressType)

          const warehouseMsg = dataInfo.addressForWarehouse || {}

          this.$set(this.form, 'initialWarehouseId', this.form.warehouseId)

          this.$set(this.form, 'requestedBy', warehouseMsg.picUserName)
          this.$set(this.form, 'requestedEmail', warehouseMsg.email)
          this.$set(this.form, 'requestedMobileCode', warehouseMsg.mobileCode)
          this.$set(this.form, 'requestedMobileNum', warehouseMsg.mobileNum)
          this.$set(this.form, 'requestedMobilePhone', warehouseMsg.mobilePhone)
          this.$set(this.form, 'userList', warehouseMsg.userList || [])
          if (this.form.userList.length > 0 && !!warehouseMsg.userId) {
            const crow = this.form.userList.find((x) => x.userId === warehouseMsg.userId) || {}
            this.requestedByChange1(crow)
          }
        } else {
          this.$set(this.form, 'warehouseId', undefined)
          this.$set(this.form, 'warehouseName', undefined)
          this.$set(this.form, 'warehouseType', undefined)
          this.$set(this.form, 'initialWarehouseId', undefined)
          this.$set(this.form, 'userList', [])
          /*  */
          this.$set(this.form, 'receiveAddressName', dataInfo.receiveAddressName)
          this.$set(this.form, 'requestedId', dataInfo.requestedId)
          this.$set(this.form, 'requestedBy', dataInfo.requestedBy)
          this.$set(this.form, 'requestedEmail', dataInfo.requestedEmail)
          this.$set(this.form, 'requestedMobileCode', dataInfo.requestedMobileCode)
          this.$set(this.form, 'requestedMobileNum', dataInfo.requestedMobileNum)
          this.$set(this.form, 'requestedMobilePhone', dataInfo.requestedMobilePhone)
        }

        this.$set(this.form, 'taxRate', dataInfo.taxRate)

        this.initPoDetailList = dataInfo.purchaseOrderDetailList || []
        this.updateProductTable(dataInfo.purchaseOrderDetailList || [])
        this.initCommonFileList = dataInfo.commonFileList || []
      })
    },
    purchaseQuotationNoClear() {
      this.$set(this.form, 'purchaseQuotationNo', undefined)
      this.$set(this.form, 'purchaseQuotationId', undefined)
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.$set(this.form, 'paymentTermName', undefined)
      this.incotermIdChange({})
      this.warehouseClear()
      this.receivePortClear()
      this.initPoDetailList = []
      this.purchaseOrderDetailList = []
    },

    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.PO }).then((res) => {
        this.deptOptions = res.data || []
      })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.purchasePersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
    },

    queryPurchasePersonByOptions() {
      this.purchasePersonByOptionsLoading = true
      queryUsers({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.PO,
        departmentId: this.form.departmentId
      })
        .then((res) => {
          this.purchasePersonByOptionsLoading = false
          this.purchasePersonByOptions = res.rows || []
        })
        .catch(() => {
          this.purchasePersonByOptionsLoading = false
        })
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'purchasePersonBy', undefined)
      this.$set(this.form, 'purchasePersonId', undefined)
      this.$set(this.form, 'purchasePersonEmail', undefined)
      this.$set(this.form, 'purchasePersonMobileCode', undefined)
      this.$set(this.form, 'purchasePersonMobileNum', undefined)
      this.$set(this.form, 'purchasePersonMobilePhone', undefined)
    },
    updatePurchasePerson(row) {
      this.$set(this.form, 'purchasePersonBy', row.nickName)
      this.$set(this.form, 'purchasePersonId', row.userId)
      this.$set(this.form, 'purchasePersonEmail', row.email)
      this.$set(this.form, 'purchasePersonMobileCode', row.mobileCode)
      this.$set(this.form, 'purchasePersonMobileNum', row.mobileNum)
      this.$set(this.form, 'purchasePersonMobilePhone', row.mobilePhone)
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
      const oldCurrencyId = this.form.currencyId
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)
      const detailList = this.$refs.ProductTable.getList()
      this.cyQueryLoading = true
      conversionCurrencyUnitPrice({
        purchaseOrderId: this.form.purchaseOrderId,
        purchaseQuotationId: this.form.purchaseQuotationId,
        emergencyGoodsReceiptId: this.form.emergencyGoodsReceiptId,
        businessPartnerId: this.form.businessPartnerId,
        createType: this.form.createType,
        currencyId: row.id,
        currencyCode: row.currencyCode,
        currencySymbol: row.currencySymbol,
        oldCurrencyId,
        purchaseOrderDetailList: detailList,
        detailsOfExpensesList: this.form.detailsOfExpensesList || []
      })
        .then((res) => {
          this.cyQueryLoading = false
          const data = res.data || {}
          this.$set(this.form, 'exchangeRateDesc', data.exchangeRateDesc)
          const purchaseOrderDetailList = (data.purchaseOrderDetailList || []).map((x) => {
            return {
              ...x,
              exchangeRateDesc: data.exchangeRateDesc
            }
          })
          this.initPoDetailList = purchaseOrderDetailList || []
          this.$set(this.form, 'detailsOfExpensesList', data.detailsOfExpensesList || [])
        })
        .catch(() => {
          this.cyQueryLoading = false
        })
    },
    currencyClear() {
      this.$set(this.form, 'currencyCode', undefined)
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
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

    dropShippingChange() {
      this.salesOrderNoClear()
      if (!this.form.warehouseId) {
        this.requestedByClear()
      }
      const row = this.form.addressForWarehouseForPQ || {}
      if (this.form.dropShipping === '0' && row.warehouseId && !this.form.receiveAddressName) {
        const { warehouseName, warehouseId, warehouseType, userList } = row
        const warehouseAddress = row.warehouseAddress || {}
        const rowData = { ...row, ...warehouseAddress }
        this.$set(this.form, 'initialWarehouseId', warehouseId)
        this.$set(this.form, 'addressForWarehouse', rowData)
        this.$set(this.form, 'receiveAddressName', warehouseName)
        this.$set(this.form, 'receiveAddressId', warehouseId)
        this.$set(this.form, 'warehouseId', warehouseId)
        this.$set(this.form, 'warehouseName', warehouseName)
        this.$set(this.form, 'warehouseType', warehouseType)
        this.$set(this.form, 'userList', userList || [])
        if (userList && userList.length > 0) {
          this.$set(this.form, 'requestedId', row.userId)
          this.$set(this.form, 'requestedBy', row.picUserNameShowStr)
          this.$set(this.form, 'requestedEmail', row.email)
          this.$set(this.form, 'requestedMobileCode', row.mobileCode)
          this.$set(this.form, 'requestedMobileNum', row.mobileNum)
          this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
        }
      }
    },
    taxIncludedChange() {
      this.$refs.ProductTable && this.$refs.ProductTable.handleCalculate()
    },
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    salesOrderChange(row) {
      this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      this.$set(this.form, 'salesOrderId', row.salesOrderId)
      this.$set(this.SOForm, 'incotermId', row.incotermId)
      this.$set(this.SOForm, 'incotermName', row.incotermName)
      this.$set(this.SOForm, 'incotermAbbreviation', row.incotermAbbreviation)
      this.$set(this.SOForm, 'incotermAddressType', row.incotermAddressType)
      if (row.incotermAddressType === '1') {
        this.$set(this.SOForm, 'receivePortName', row.receiveAddressName)
      } else {
        this.$set(this.SOForm, 'receivePortName', row.receiveAddress)
      }
      this.$set(this.SOForm, 'receiveAddressId', row.receiveAddressId)
      this.$set(this.SOForm, 'requestedId', row.bpContactPersonId)
      this.$set(this.SOForm, 'requestedBy', row.bpContactPersonName)
      this.$set(this.SOForm, 'requestedEmail', row.bpEmail)
      this.$set(this.SOForm, 'requestedMobileCode', row.bpMobileCode)
      this.$set(this.SOForm, 'requestedMobileNum', row.bpMobileNum)
      this.$set(this.SOForm, 'requestedMobilePhone', row.bpMobilePhone)
    },

    salesOrderNoClear() {
      this.$set(this.form, 'salesOrderNo', undefined)
      this.$set(this.form, 'salesOrderId', undefined)
      this.$set(this.SOForm, 'incotermId', undefined)
      this.$set(this.SOForm, 'incotermName', undefined)
      this.$set(this.SOForm, 'incotermAbbreviation', undefined)
      this.$set(this.SOForm, 'incotermAddressType', undefined)
      this.$set(this.SOForm, 'receiveAddressId', undefined)
      this.$set(this.SOForm, 'receivePortName', undefined)
      this.$set(this.SOForm, 'requestedBy', undefined)
      this.$set(this.SOForm, 'requestedEmail', undefined)
      this.$set(this.SOForm, 'requestedMobileCode', undefined)
      this.$set(this.SOForm, 'requestedMobileNum', undefined)
      this.$set(this.SOForm, 'requestedMobilePhone', undefined)
    },

    /* 第二部分表单 */

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
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$refs.form2.clearValidate('receivePortName')
      // }
      this.getFormattedVarContentFn()
      this.queryCanSelectPortList()
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
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.getFormattedVarContentFn()
    },
    updatePort(row) {
      const { portName, portId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      this.getFormattedVarContentFn()

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
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId, warehouseType, userList } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseType', warehouseType)

      this.$set(this.form, 'userList', userList || [])
      if (userList && userList.length > 0) {
        this.$set(this.form, 'requestedId', row.userId)
        this.$set(this.form, 'requestedBy', row.picUserNameShowStr)
        this.$set(this.form, 'requestedEmail', row.email)
        this.$set(this.form, 'requestedMobileCode', row.mobileCode)
        this.$set(this.form, 'requestedMobileNum', row.mobileNum)
        this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
      }
      const detailList = this.$refs.ProductTable.getList()
      const noCanSelectProductIdList = row.noCanSelectProductIdList || []
      const newDetailList = detailList.filter((item) => {
        return !noCanSelectProductIdList.includes(item.productId)
      })
      this.initPoDetailList = JSON.parse(JSON.stringify(newDetailList))
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseType', undefined)
      this.$set(this.form, 'userList', [])
      this.requestedByClear()
    },
    addRequestedBy() {
      const params = {
        requestedBy: this.form.requestedBy,
        requestedEmail: this.form.requestedEmail,
        requestedMobileCode: this.form.requestedMobileCode,
        requestedMobileNum: this.form.requestedMobileNum,
        requestedMobilePhone: this.form.requestedMobilePhone
      }
      this.$refs.editRequestedByDlg.handleOpen(params)
    },
    requestedByChange(row) {
      this.$set(this.form, 'requestedBy', row.requestedBy)
      this.$set(this.form, 'requestedEmail', row.requestedEmail)
      this.$set(this.form, 'requestedMobileCode', row.requestedMobileCode)
      this.$set(this.form, 'requestedMobileNum', row.requestedMobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.requestedMobilePhone)
    },
    requestedByChange1(row) {
      this.$set(this.form, 'requestedId', row.userId)
      this.$set(this.form, 'requestedBy', row.nickName)
      this.$set(this.form, 'requestedEmail', row.email)
      this.$set(this.form, 'requestedMobileCode', row.mobileCode)
      this.$set(this.form, 'requestedMobileNum', row.mobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
    },
    requestedByClear() {
      this.$set(this.form, 'requestedId', undefined)
      this.$set(this.form, 'requestedBy', undefined)
      this.$set(this.form, 'requestedEmail', undefined)
      this.$set(this.form, 'requestedMobileCode', undefined)
      this.$set(this.form, 'requestedMobileNum', undefined)
      this.$set(this.form, 'requestedMobilePhone', undefined)
    },
    updateLeadTime(list) {
      let maxLeadTime
      list.forEach((item) => {
        if (this.$resultOfBoolean(item.leadTime)) {
          if (!maxLeadTime) {
            maxLeadTime = item.leadTime
          } else if (item.leadTime > maxLeadTime) {
            maxLeadTime = item.leadTime
          }
        }
      })
      this.$set(this.form, 'leadTimeForDay', maxLeadTime)
      this.getFormattedVarContentFn()
    },
    /* 第三部分 表格部分Start */
    updateProductTable(list) {
      this.purchaseOrderDetailList = list || []
      let maxLeadTime
      this.purchaseOrderDetailList.forEach((item) => {
        if (this.$resultOfBoolean(item.leadTime)) {
          if (!maxLeadTime) {
            maxLeadTime = item.leadTime
          } else if (item.leadTime > maxLeadTime) {
            maxLeadTime = item.leadTime
          }
        }
      })
      this.$set(this.form, 'leadTimeForDay', maxLeadTime)
      if (this.createType !== '1') {
        const flag = this.purchaseOrderDetailList.some((item) => item.dropShipping === '1')
        if (flag) {
          if (this.form.dropShipping !== '1') {
            this.$set(this.form, 'dropShipping', '1')
            this.dropShippingChange()
          }
        }
        const flag1 = this.purchaseOrderDetailList.some((item) => item.isSystemDocking === '1')
        if (flag1) {
          if (this.form.dropShipping === '1') {
            this.$set(this.form, 'dropShipping', '0')
            this.dropShippingChange()
          }
        }
      }
    },
    /* 表格部分End */

    /* 第四部分表单 */
    deliveryByChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    deliveryByClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
    },

    queryDeliveryAddressOptions() {
      this.deliveryAddressOptionsLoading = true
      this.deliveryAddressOptions = []
      if (!this.form.businessPartnerMainId) {
        this.deliveryAddressOptionsLoading = false
        return
      }
      const param = {
        pageNum: 1,
        pageSize: 9999,
        businessPartnerMainId: this.form.businessPartnerMainId
      }
      const timer = Date.now()
      this.queryADTimer = timer
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          if (this.queryADTimer !== timer) return
          this.deliveryAddressOptionsLoading = false
          const rows = response.rows || []
          this.deliveryAddressOptions = rows
        })
        .catch(() => {
          if (this.queryADTimer !== timer) return
          this.deliveryAddressOptionsLoading = false
        })
    },
    openDeliveryAddressTable() {
      this.$refs.selectBPAddressDlg.handleOpen()
    },
    deliveryAddressChange(row) {
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpAddress', row.receiveAddress)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
    },
    /* 表单部分End */

    async submitForm(submitType) {
      const myFileIds = this.$refs.ProductTable.getFileIds()
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
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.RecipientInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        param = this.$trimOfObj(param)
        const detailList = this.$refs.ProductTable.getList()
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          this.$refs.ProductTable.activeName = '1'
          this.collapseWarningForProductInfo = true
          return
        }

        /* const validDetailsOfExpenses = this.validDetailsOfExpensesList(
          param.detailsOfExpensesList || []
        )
        if (!validDetailsOfExpenses) {
          this.$refs.ProductTable.activeName = '1'
          this.collapseWarningForProductInfo = true
          return
        } */
        this.collapseWarningForProductInfo = false
        param.purchaseOrderDetailList = detailList

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

        param.commonFileList = myFileIds

        const valid4 = await this.$refs.form4.validate().catch((err) => {
          return err
        })
        this.collapseWarningForDeliveryInfo = !valid4

        if (!valid4) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.contactInfo'))
          )
          return
        }

        /* if (param.dropShipping === '1' && param.salesOrderId) {
          param.incotermId = this.SOForm.incotermId
          param.incotermName = this.SOForm.incotermName
          param.incotermAbbreviation = this.SOForm.incotermAbbreviation
          param.incotermAddressType = this.SOForm.incotermAddressType
          param.receiveAddressId = this.SOForm.receiveAddressId
          param.receivePortId = this.SOForm.receiveAddressId
          param.receivePortName = this.SOForm.receivePortName
          param.requestedId = this.SOForm.requestedId
          param.requestedBy = this.SOForm.requestedBy
          param.requestedEmail = this.SOForm.requestedEmail
          param.requestedMobileCode = this.SOForm.requestedMobileCode
          param.requestedMobileNum = this.SOForm.requestedMobileNum
          param.requestedMobilePhone = this.SOForm.requestedMobilePhone
        } else if (param.dropShipping === '1' && !param.salesOrderId) {
          param.requestedId = param.purchasePersonId
          param.requestedBy = param.purchasePersonBy
          param.requestedEmail = param.purchasePersonEmail
          param.requestedMobileCode = param.purchasePersonMobileCode
          param.requestedMobileNum = param.purchasePersonMobileNum
          param.requestedMobilePhone = param.purchasePersonMobilePhone
        } */

        if (this.form.isTotalAmountNegativeTips === '1') {
          this.$refs.ProductTable.scrollPageToTotalAmount()
          return
        }

        this.handleSetConditionsHtmlStr(true)
        param.conditions = this.form.conditions
        param.conditionsTableJson = this.form.conditionsTableJson

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        if (param.isRevise === '1' && submitType !== 'approvedAndSubmit') {
          const isCanRevise = await this.checkIsCanReviseForSubmit(param)
          if (!isCanRevise) {
            return
          }
        }

        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'approvedAndSubmit') {
          // 审批流带提交功能
          this.approvedFormData = param
          this.aplVisible = true
        } else if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.poSaveConfirm')
          successMsg = this.$t('PURCHASE.poSaveSuccess')
          submitFn = saveDraftPurchaseOrder
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
          confirmMsg = this.$t('PURCHASE.poSubmitConfirm')
          successMsg = this.$t('PURCHASE.poSubmitSuccess')
          submitFn = savePurchaseOrder
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
    },
    rejectSubmitRemarksSubmitSuccess() {
      this.back()
    },
    async checkIsCanReviseForSubmit(param) {
      if (this.submitLoading) return
      this.submitLoading = true
      const that = this
      const { data } = await checkIsCanReviseForSubmit(param)
      this.submitLoading = false
      const { isNeedTips, tipList } = data || {}
      if (isNeedTips === '1') {
        const h = that.$createElement
        const contents = []
        contents.push(
          h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unableAmendPurchaseOrder1'))
        )
        // contents.push(h('div', { style: 'font-size: 14px' }, tipsMsg))
        if (tipList && tipList.length > 0) {
          tipList.forEach((x) => {
            const span1 = h(
              'span',
              {
                style: 'display: inline-block;margin-right: 5px;vertical-align: top;'
              },
              '⚠️'
            )
            const span2 = h('span', { style: 'font-size: 14px;' }, x)
            contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))

            // contents.push(h('div', { style: 'font-size: 14px' }, x))
          })
        }
        const content = h('p', null, contents)
        this.$alert(content, '', {
          cancelButtonText: this.$t('uiBtn.back'),
          showCancelButton: true,
          showConfirmButton: false,
          type: 'warning',
          customClass: 'custom-class'
        })
          .then(() => {})
          .catch(() => {})

        return false
      } else {
        return true
      }
    },
    showASLPriceRange(row) {
      const { minUnitPrice, maxUnitPrice, unitPrice } = row
      if (minUnitPrice && maxUnitPrice && unitPrice) {
        return unitPrice < minUnitPrice || unitPrice > maxUnitPrice
      }
      return false
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
      if (this.form.isEmergencyGoodsReceipt === '1') {
        this.$trimOfObj(this.form.detailsOfExpensesList)
        const detailsOfExpensesList = this.form.detailsOfExpensesList || []
        const valid = false
        if (detailList.length <= 0) {
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          return valid
        }

        const productNameReq = detailList.find((item) => {
          const errItem = (item.serviceSurchargeList || []).find(
            (child) => !this.$resultOfBoolean(child.expenseItemName)
          )
          if (errItem) {
            return true
          }
          return false
        })
        if (productNameReq) {
          this.$refs.ProductTable.errorMessage('productName')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
          )
          return valid
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
        /* const moqReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.moq)
      })
      if (moqReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.moq')))
        return valid
      } */
        // const qtyReq = detailList.find((item) => {
        //   return !this.$resultOfBoolean(item.purchaseQty)
        // })
        const uomReq = detailList.find((item) => {
          if (!item.purchaseUom) {
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
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseUOM'))
          )
          return valid
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

          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
          return valid
        }

        if (!this.$refs.ProductTable.validateAssignPurchaseQty(detailList)) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
          )
          return false
        }

        const qtyLessThanMoq = detailList.find((item) => {
          return item.moq && item.purchaseQty < item.moq
        })
        if (qtyLessThanMoq) {
          this.$modal.msgError(this.$t('PURCHASE.qtyLessThanMoq'))
          return valid
        }

        /* 校验系数*数量后小数位是否符合要求 */
        const validCoefficient = detailList.find((item) => {
          return !this.validCoefficientIsTrue(item)
        })
        if (validCoefficient) {
          return valid
        }

        // const uomReq = detailList.find((item) => {
        //   return !this.$resultOfBoolean(item.purchaseUom)
        // })

        // const unitPriceReq = detailList.find((item) => {
        //   return !this.$resultOfBoolean(item.unitPrice)
        // })
        const unitPriceReq = detailList.find((item) => {
          if (!this.$resultOfBoolean(item.unitPrice)) {
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
        if (this.form.isEmergencyGoodsReceipt === '1') {
          const sourceDocIdListReq = detailList.find((item) => {
            const errItem = (item.serviceSurchargeList || []).find((child) => !child.sourceDocId)
            if (errItem) {
              return true
            }
            return false
          })
          if (sourceDocIdListReq) {
            this.$refs.ProductTable.errorMessage('purchaseRequisiteListShowStr')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.DocNo'))
            )
            return valid
          }
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

        /* const ASLPriceRangeReq = detailList.filter((item) => {
        return this.showASLPriceRange(item)
      })
      if (ASLPriceRangeReq.length > 0) {
        let str = ''
        ASLPriceRangeReq.forEach((item) => {
          str +=
            this.$t('PURCHASE.ASLRange')
              .replace('[$1]', item.productName + ' ' + item.internalPartNo)
              .replace(
                '[$2]',
                this.form.currencySymbol + '' + this.$numberStr(item.unitPrice, 6, false, 2)
              )
              .replace(
                '[$3]',
                this.form.currencySymbol + '' + this.$numberStr(item.minUnitPrice, 6, false, 2)
              )
              .replace(
                '[$4]',
                this.form.currencySymbol + '' + this.$numberStr(item.maxUnitPrice, 6, false, 2)
              ) + '<br/>'
        })
        this.$modal.msgError({
          message: this.$t('PURCHASE.outsideRange').replace('$1', str),
          dangerouslyUseHTMLString: true // 关键：允许渲染HTML
        })
        return valid
      } */

        const leadTimeReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.leadTime)
        })
        if (leadTimeReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
          )
          return valid
        }
        if (this.form.isEmergencyGoodsReceipt !== '1') {
          this.$refs.ProductTable.$refs.totalForm.validateField('taxRate')
          if (!this.$resultOfBoolean(this.form.taxRate)) {
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.taxRate'))
            )
            return valid
          }
        }

        return true
      } else {
        this.$trimOfObj(this.form.detailsOfExpensesList)
        const detailsOfExpensesList = this.form.detailsOfExpensesList || []
        const valid = false
        if (detailList.length <= 0) {
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          return valid
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
        /* const moqReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.moq)
      })
      if (moqReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.moq')))
        return valid
      } */
        const qtyReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.purchaseQty)
        })
        if (qtyReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
          )
          return valid
        }

        const qtyLessThanMoq = detailList.find((item) => {
          return item.moq && item.purchaseQty < item.moq
        })
        if (qtyLessThanMoq && this.form.isEmergencyGoodsReceipt !== '1') {
          this.$modal.msgError(this.$t('PURCHASE.qtyLessThanMoq'))
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

        /* const ASLPriceRangeReq = detailList.filter((item) => {
        return this.showASLPriceRange(item)
      })
      console.log(ASLPriceRangeReq, '===============2549')
      if (ASLPriceRangeReq.length > 0) {
        let str = ''
        ASLPriceRangeReq.forEach((item) => {
          str +=
            this.$t('PURCHASE.ASLRange')
              .replace('[$1]', item.productName + ' ' + item.internalPartNo)
              .replace(
                '[$2]',
                this.form.currencySymbol + '' + this.$numberStr(item.unitPrice, 6, false, 2)
              )
              .replace(
                '[$3]',
                this.form.currencySymbol + '' + this.$numberStr(item.minUnitPrice, 6, false, 2)
              )
              .replace(
                '[$4]',
                this.form.currencySymbol + '' + this.$numberStr(item.maxUnitPrice, 6, false, 2)
              ) + '<br/>'

          console.log(str, '==============2563')
        })
        this.$modal.msgError({
          message: this.$t('PURCHASE.outsideRange').replace('$1', str),
          dangerouslyUseHTMLString: true // 关键：允许渲染HTML
        })
        return valid
      } */

        const uomReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.purchaseUom)
        })
        if (uomReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseUOM'))
          )
          return valid
        }

        const leadTimeReq = detailList.find((item) => {
          return (
            !this.$resultOfBoolean(item.leadTime) &&
            ((this.form.isEmergencyGoodsReceipt === '1' &&
              (item.isCustomProduct === '1' || !this.$resultOfBoolean(item.aslUnitPrice)) &&
              !item.expenseItemName) ||
              (this.isRevise && !item.expenseItemName))
          )
        })
        if (leadTimeReq) {
          this.$refs.ProductTable.errorMessage('leadTime')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
          )
          return valid
        }

        /* this.$refs.ProductTable.$refs.totalForm.validateField('taxRate')
      if (!this.$resultOfBoolean(this.form.taxRate)) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.taxRate')))
        return valid
      } */

        return true
      }
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

    getFormJson() {
      this.handleSetConditionsHtmlStr()
      const param = { ...this.form }
      delete param.userList
      const detailList = this.$refs.ProductTable.getList()
      param.purchaseOrderDetailList = detailList
      const myFileIds = this.$refs.ProductTable.getFileIds()
      param.commonFileList = myFileIds

      return JSON.stringify(param)
    },
    async handleSaveDraft(isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.ProductTable.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false

      const valid1 = true
      this.$refs.form1.clearValidate()
      this.collapseWarningForBasicInfo = !valid1

      if (valid1) {
        this.handleSetConditionsHtmlStr()
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        param.purchaseOrderDetailList = detailList
        param.commonFileList = myFileIds

        /* if (param.dropShipping === '1' && param.salesOrderId) {
          param.incotermId = this.SOForm.incotermId
          param.incotermName = this.SOForm.incotermName
          param.incotermAbbreviation = this.SOForm.incotermAbbreviation
          param.incotermAddressType = this.SOForm.incotermAddressType
          param.receiveAddressId = this.SOForm.receiveAddressId
          param.receivePortId = this.SOForm.receiveAddressId
          param.receivePortName = this.SOForm.receivePortName
          param.requestedId = this.SOForm.requestedId
          param.requestedBy = this.SOForm.requestedBy
          param.requestedEmail = this.SOForm.requestedEmail
          param.requestedMobileCode = this.SOForm.requestedMobileCode
          param.requestedMobileNum = this.SOForm.requestedMobileNum
          param.requestedMobilePhone = this.SOForm.requestedMobilePhone
        } else if (param.dropShipping === '1' && !param.salesOrderId) {
          param.requestedId = param.purchasePersonId
          param.requestedBy = param.purchasePersonBy
          param.requestedEmail = param.purchasePersonEmail
          param.requestedMobileCode = param.purchasePersonMobileCode
          param.requestedMobileNum = param.purchasePersonMobileNum
          param.requestedMobilePhone = param.purchasePersonMobilePhone
        } */

        if (this.form.isTotalAmountNegativeTips === '1') {
          this.$refs.ProductTable.scrollPageToTotalAmount()
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        if (param.isRevise === '1') {
          const isCanRevise = await this.checkIsCanReviseForSubmit(param)
          if (!isCanRevise) {
            return
          }
        }

        // param.commonFileList = myFileIds
        const confirmMsg = this.$t('PURCHASE.poSaveConfirm')
        const successMsg = this.$t('PURCHASE.poSaveSuccess')
        const submitFn = saveDraftPurchaseOrder

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

    handlePreviewPDF() {
      const token = getToken()
      if (this.$refs.ProductTable) {
        this.$refs.ProductTable.handleCalculate()
      }
      this.handleSetConditionsHtmlStr()
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      const detailList = this.$refs.ProductTable.getList()
      param.purchaseOrderDetailList = detailList
      /* if (param.dropShipping === '1' && param.salesOrderId) {
        param.incotermId = this.SOForm.incotermId
        param.incotermName = this.SOForm.incotermName
        param.incotermAbbreviation = this.SOForm.incotermAbbreviation
        param.incotermAddressType = this.SOForm.incotermAddressType
        param.receiveAddressId = this.SOForm.receiveAddressId
        param.receivePortId = this.SOForm.receiveAddressId
        param.receivePortName = this.SOForm.receivePortName
        param.requestedId = this.SOForm.requestedId
        param.requestedBy = this.SOForm.requestedBy
        param.requestedEmail = this.SOForm.requestedEmail
        param.requestedMobileCode = this.SOForm.requestedMobileCode
        param.requestedMobileNum = this.SOForm.requestedMobileNum
        param.requestedMobilePhone = this.SOForm.requestedMobilePhone
      } else if (param.dropShipping === '1' && !param.salesOrderId) {
        param.requestedId = param.purchasePersonId
        param.requestedBy = param.purchasePersonBy
        param.requestedEmail = param.purchasePersonEmail
        param.requestedMobileCode = param.purchasePersonMobileCode
        param.requestedMobileNum = param.purchasePersonMobileNum
        param.requestedMobilePhone = param.purchasePersonMobilePhone
      } */

      this.previewPDFLoading = true
      preview(param)
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
    handleTabsClick() {
      if (this.tabsActiveName !== 'pdfInfo') return

      this.pdfInfoUrl = ''
      const token = getToken()
      if (this.$refs.ProductTable) {
        this.$refs.ProductTable.handleCalculate()
      }
      this.handleSetConditionsHtmlStr()
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      const detailList = this.$refs.ProductTable.getList()
      param.purchaseOrderDetailList = detailList

      this.pdfInfoLoading = true
      const timer = Date.now()
      this.queryTime = timer
      preview(param)
        .then((res) => {
          if (timer !== this.queryTime) return
          this.pdfInfoLoading = false
          const fileID = res.data || ''
          if (fileID) {
            const myUrl =
              process.env.VUE_APP_BASE_API +
              '/system/oss/filePreview/' +
              `${fileID}` +
              '?token=' +
              `${token}`
            this.pdfInfoUrl = myUrl
          }
        })
        .catch(() => {
          this.pdfInfoLoading = false
        })
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/preview' +
        `/${this.form.purchaseOrderId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/download' +
        `/${this.form.purchaseOrderId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    handleRevise() {
      // 校验是否可以修正
      this.checkIsCanRevise()
    },
    checkIsCanRevise() {
      const that = this
      checkIsCanReviseForButton(this.form)
        .then((res) => {
          const { isNeedTips, tipList } = res.data || {}
          if (isNeedTips === '0') {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({
              path: '/purchaseManagement/revisePurchaseOrder',
              query: {
                id: this.form.purchaseOrderId,
                timeId: Date.now()
              }
            })
            return
          }
          if (isNeedTips === '1') {
            const h = that.$createElement
            const contents = []
            contents.push(
              h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unableAmendPurchaseOrder'))
            )
            // contents.push(h('div', { style: 'font-size: 14px' }, tipsMsg))
            if (tipList && tipList.length > 0) {
              tipList.forEach((x) => {
                const span1 = h(
                  'span',
                  {
                    style: 'display: inline-block;margin-right: 5px;vertical-align: top;'
                  },
                  '⚠️'
                )
                const span2 = h('span', { style: 'font-size: 14px' }, x)
                contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))

                // contents.push(h('div', { style: 'font-size: 14px' }, x))
              })
            }
            const content = h('p', null, contents)
            this.$alert(content, '', {
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: true,
              showConfirmButton: false,
              type: 'warning',
              customClass: 'custom-class'
            })
              .then(() => {})
              .catch(() => {})
          }
        })
        .catch(() => {})
    },
    /* 版本比对 */
    revisionComparison() {
      if (this.$refs.RevisionComparisonDlgV2) {
        this.$refs.RevisionComparisonDlgV2.handleOpen(this.rowId)
      }
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((x) => x.name === prop) || {}
      return item.beforeValue
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    queryPurchaseOrderHistoryVersion() {
      if (this.comeFrom !== '1') return
      queryPurchaseOrderHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/purchaseManagement/viewPurchaseOrder',
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

    /* 审批 */
    handleApproved() {
      if (this.comDisFrom) {
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
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
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
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
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
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
        )
      )
      vm.back('onCancelSuccess')
    },

    handleClose() {
      this.$refs.FormCloseDialog.handleOpen()
    },
    closeSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.closedSuccess')}`.replace(
          '$1',
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
        )
      )
      vm.back('onCloseSuccess')
    },
    handleInvalidate() {
      this.$refs.InvalidateDialog.handleOpen(this.form)
    },
    invalidateSubmitSuccess() {
      this.back('invalidateSuccess')
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
  // border: 1px solid #e4e7ed;
  // border-radius: 6px;

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
    border-radius: 3px;
    border: 1px solid #c0c4cc;
    &.add {
      background-color: #1a73e8;
      border-color: #1557b0;
    }
    &.edit {
      background-color: #d2e3fc;
      border-color: #1a73e8;
    }
    &.del {
      background-color: #f5f5f4;
      border-color: #78716c;
    }
  }
}

.reject-remarks {
  font-size: 13px;
  color: #444;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
}
.reject-by {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.reject-card {
  border: 1px solid #e2e8f0;
}
.reject-card ::v-deep .el-collapse-item__header {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.reject-card ::v-deep .el-collapse-item__wrap {
  background-color: #f8fafc;
}
.editNotes-card {
  border: 1px solid #c2d7fb;
}

.editNotes-card ::v-deep .collapse-title {
  color: #1557b0;
}
.editNotes-card ::v-deep .el-collapse-item__header {
  background: #f0f7ff;
  border-bottom: 1px solid #c2d7fb;
}
.editNotes-card ::v-deep .el-collapse-item__wrap {
  background: #f0f7ff;
}
</style>
