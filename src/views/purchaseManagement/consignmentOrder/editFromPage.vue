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
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="closeBtnShow" @click="handleClose"
        >{{ $t('uiBtn.close') }}
      </el-button>

      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
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
      <el-button type="primary" size="mini" v-if="isShowEditBtn" @click="exitComparison">
        {{ $t('uiBtn.edit') }}
      </el-button>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.consignmentOrder') }}
      </div>
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
                  {{ form.operationLogForLastReject.operationDescription }}
                </div>
                <div class="reject-by">
                  {{ $t('ui.rejectedBy1') }}：{{ form.operationLogForLastReject.operatorBy }} |
                  {{ parseTime(form.operationLogForLastReject.operatorTime, fmtForYmdhms) }}
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
                  {{
                    selectDictLabel(
                      dict.type.p_consignment_order_status,
                      form.consignmentOrderStatus
                    )
                  }}
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
                      <ComparisonInput
                        v-if="isModified('businessPartnerName')"
                        :beforeValue="getBeforeValue('businessPartnerName')"
                        :afterValue="getAfterValue('businessPartnerName', form.businessPartnerName)"
                      />
                      <SelectInput
                        v-else
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
                            dict.type.p_consignment_order_status,
                            form.consignmentOrderStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.consignmentOrderNo')}`">
                      <el-input
                        v-model="form.consignmentOrderNo"
                        :title="form.consignmentOrderNo"
                        disabled
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
                        :disabled="!form.businessPartnerId || comDisFrom"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchaseDepartment')}`"
                      prop="departmentId"
                    >
                      <ComparisonInput
                        v-if="isModified('departmentName')"
                        :beforeValue="getBeforeValue('departmentName')"
                        :afterValue="getAfterValue('departmentName', form.departmentName)"
                      />
                      <CommonSelect
                        v-else
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        :loading="deptOptionsLoading"
                        @change="departmentChange"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.ourRef')}`">
                      <ComparisonInput
                        v-if="isModified('ourRef')"
                        :beforeValue="getBeforeValue('ourRef')"
                        :afterValue="getAfterValue('ourRef', form.ourRef)"
                      />
                      <el-input
                        v-else
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.taxRate')}`" prop="taxRate">
                      <ComparisonInput
                        v-if="isModified('taxRate')"
                        :beforeValue="getBeforeValue('taxRate')"
                        :afterValue="getAfterValue('taxRate', form.taxRate)"
                      />
                      <el-input-number
                        v-else
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
                    <el-form-item :label="`${$t('PURCHASE.purchaser')}`" prop="purchasePersonBy">
                      <ComparisonInput
                        v-if="isModified('purchasePersonBy')"
                        :beforeValue="getBeforeValue('purchasePersonBy')"
                        :afterValue="getAfterValue('purchasePersonBy', form.purchasePersonBy)"
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
                        :disabled="!form.departmentId || comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.yourRef')}`">
                      <ComparisonInput
                        v-if="isModified('yourRef')"
                        :beforeValue="getBeforeValue('yourRef')"
                        :afterValue="getAfterValue('yourRef', form.yourRef)"
                      />
                      <el-input
                        v-else
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <ComparisonInput
                          v-if="isModified('paymentTermName')"
                          :beforeValue="getBeforeValue('paymentTermName')"
                          :afterValue="getAfterValue('paymentTermName', form.paymentTermName)"
                        />
                        <CommonSelectAndList
                          v-else
                          :id="form.paymentTermId"
                          :label="form.paymentTermName"
                          idKey="paymentTermId"
                          labelKey="paymentTermName"
                          filterable
                          :options="paymentTermList"
                          :loading="paymentTermOptionsLoading"
                          @change="paymentTermChange"
                          @handleOpen="openPaymentTermDlg"
                          :disabled="comDisFrom || !form.businessPartnerId"
                        />
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.consignmentStart')}`"
                      prop="consignmentStartTime"
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
                      :label="`${$t('PURCHASE.consignmentEnd')}`"
                      prop="consignmentEndTime"
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
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.committedDate')}`" prop="committedDate">
                      <ComparisonInput
                        v-if="isModified('committedDate')"
                        :beforeValue="getBeforeValue('committedDate')"
                        :afterValue="getAfterValue('committedDate', form.committedDate)"
                      />
                      <el-date-picker
                        v-else
                        v-model="form.committedDate"
                        :picker-options="validityDaysPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="false">
                  <el-col :span="24">
                    <el-form-item
                      :label="$t('PURCHASE.paymentTerm')"
                      prop="paymentTermName"
                      :class="[isModified('paymentTermName')]"
                    >
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
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span v-if="form.incotermName" class="info-item mr20" :title="form.incotermName">
                  {{ $t('PURCHASE.incoterm') }} : {{ form.incotermName }}
                </span>
                <span
                  v-if="form.receiveAddressName"
                  class="info-item"
                  :title="form.receiveAddressName"
                >
                  {{ $t('PURCHASE.warehouse') }} : {{ form.receiveAddressName }}
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.incoterm')}`" prop="incotermId">
                      <ComparisonInput
                        v-if="isModified('incotermName')"
                        :beforeValue="getBeforeValue('incotermName')"
                        :afterValue="getAfterValue('incotermName', form.incotermName)"
                      />
                      <CommonSelect
                        v-else
                        :disabled="comDisFrom"
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        :loading="incotermOptionsLoading"
                        @change="incotermIdChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.shipToAddress1')}`"
                      prop="shipToAddressName"
                      :rules="[
                        {
                          required: form.incotermAddressType === '1',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ComparisonInput
                        v-if="isModified('shipToAddressName')"
                        :beforeValue="getBeforeValue('shipToAddressName')"
                        :afterValue="getAfterValue('shipToAddressName', form.shipToAddressName)"
                      />
                      <el-input
                        v-if="!isModified('shipToAddressName') && form.incotermAddressType === '0'"
                        :value="$t('PURCHASE.selfCollect')"
                        disabled
                      ></el-input>
                      <ToolTipShowObj
                        v-if="!isModified('shipToAddressName') && form.incotermAddressType !== '0'"
                        :mData="form.addressForPort || {}"
                        :showStr="form.shipToAddressName"
                        :rows="shipToAddressRows"
                      >
                        <CommonSelectAndList
                          :id="form.shipToAddressId"
                          :label="form.shipToAddressName"
                          idKey="portId"
                          labelKey="portName"
                          filterable
                          :options="portOptions"
                          :disabled="
                            !form.incotermId ||
                            form.incotermAddressType !== '1' ||
                            !form.businessPartnerId ||
                            comDisFrom
                          "
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openReceiveAddressTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.warehouseName')}`"
                      prop="receiveAddressName"
                    >
                      <ComparisonInput
                        v-if="isModified('receiveAddressName')"
                        :beforeValue="getBeforeValue('receiveAddressName')"
                        :afterValue="getAfterValue('receiveAddressName', form.receiveAddressName)"
                      />
                      <ToolTipShowObj
                        v-else
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.receiveAddressName"
                        :rows="warehouseRows"
                      >
                        <CommonSelectAndList
                          :id="form.receiveAddressId"
                          :label="form.receiveAddressName"
                          idKey="warehouseId"
                          labelKey="warehouseName"
                          filterable
                          :options="warehouseOptions"
                          :loading="warehouseOptionsLoading"
                          :disabled="comDisFrom || !form.businessPartnerId"
                          @change="updateWarehouse"
                          @handleOpen="openWarehouseTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.requestedBy')}`" prop="requestedBy">
                      <ComparisonInput
                        v-if="isModified('requestedBy')"
                        :beforeValue="getBeforeValue('requestedBy')"
                        :afterValue="getAfterValue('requestedBy', form.requestedBy)"
                      />
                      <SelectInput
                        v-else
                        :clearable="true"
                        :value="form.requestedBy"
                        :title="form.requestedBy"
                        @click="addRequestedBy"
                        :disabled="!form.receiveAddressName || comDisFrom"
                        @clear="requestedByClear"
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
                        :afterValue="getAfterValue('requestedEmail', form.requestedEmail)"
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
                    <el-form-item :label="`${$t('PURCHASE.requestedMobilePhone')}`">
                      <ComparisonInput
                        v-if="isModified('requestedMobilePhone')"
                        :beforeValue="getBeforeValue('requestedMobilePhone')"
                        :afterValue="
                          getAfterValue('requestedMobilePhone', form.requestedMobilePhone)
                        "
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

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" :class="[isModified('shipRemarks')]">
                      <MyInput
                        type="textarea"
                        v-model="form.shipRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
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
                  {{ $t('PURCHASE.totalAmount') }} : {{ $numberStr(form.totalAmount, 2) }}
                </span>
                <span v-if="$resultOfBoolean(form.totalFreight)" class="info-item mr20">
                  {{ $t('PURCHASE.totalFreight') }} : {{ $numberStr(form.totalFreight, 2) }}
                </span>
                <span v-if="$resultOfBoolean(form.totalTaxAmount)" class="info-item">
                  {{ $t('PURCHASE.totalTaxAmount') }} : {{ $numberStr(form.totalTaxAmount, 2) }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :formData="form"
                  :productList="initPoDetailList"
                  :initCommonFileList="initCommonFileList"
                  :countryId="form.countryId"
                  :warehouseId="form.warehouseId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  @getPoById="getPoById"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.deliveryInfo')"
                :warning="collapseWarningForDeliveryInfo"
              >
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
                        :afterValue="getAfterValue('bpContactPersonName', form.bpContactPersonName)"
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
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryEmail')}`"
                      :class="[isModified('bpEmail')]"
                    >
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryMobilePhone')}`"
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
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress1')}`"
                      prop="bpBusinessAddressId"
                    >
                      <ComparisonInput
                        v-if="isModified('bpAddress')"
                        :beforeValue="getBeforeValue('bpAddress')"
                        :afterValue="getAfterValue('bpAddress', form.bpAddress)"
                      />
                      <ToolTipShowObj
                        v-else
                        :mData="form.bpBusinessAddress || {}"
                        :showStr="form.bpAddress"
                        :rows="bpAddressRows"
                      >
                        <CommonSelect
                          :disabled="!form.businessPartnerId || comDisFrom"
                          :id="form.bpBusinessAddressId"
                          :label="form.bpAddress"
                          idKey="businessAddressId"
                          labelKey="label"
                          :options="form.bpBusinessAddressList || []"
                          @change="deliveryAddressChange"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
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

    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updateWarehouse"
    />
    <editRequestedByDlg ref="editRequestedByDlg" @update="requestedByChange" />
    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['2']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.consignmentOrder"
    />

    <ApprovedDialog
      :id="form.consignmentOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.consignmentOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.consignmentOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- 关闭 -->
    <FormCloseDialog
      :id="form.consignmentOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :close-api-url="closedUrl"
      @submitSuccess="closeSubmitSuccess"
      ref="FormCloseDialog"
    />

    <RevisionComparisonDlg module-key="consignmentOrder" ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryUsers } from '@/api/organization/corporate'
import {
  saveConsignmentOrder,
  saveDraftConsignmentOrder,
  queryConsignmentOrderById,
  approvedConsignmentOrder,
  rejectedConsignmentOrder,
  cancelledConsignmentOrder,
  closedConsignmentOrder,
  withdrawApproved,
  preview,
  queryCanSelectConsignmentWarehouseList
} from '@/api/purchaseManagement/consignmentOrder'
import { getToken } from '@/utils/auth'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import editRequestedByDlg from './components/editRequestedByDlg.vue'
import ProductTable from '@/views/purchaseManagement/consignmentOrder/productTable.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import FormCloseDialog from '@/views/bpm/history/closeDialog/formCloseDialog'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'

import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  dicts: ['p_consignment_order_status', 'business_partner_payment_method'],
  mixins: [pageMixin],
  components: {
    selectSupplierTable,
    selectPurchasePersonTable,
    selectPortTable,
    selectWarehouseTable,
    selectPaymentTermDlg,
    editRequestedByDlg,
    ProductTable,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    FormCloseDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {},

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForDeliveryInfo: false,
      rules: {
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
            trigger: ['blur']
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
        committedDate: [
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
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      consignmentEndTimePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      deptOptions: [],
      deptOptionsLoading: false,
      purchasePersonByOptions: [],
      purchasePersonByOptionsLoading: false,
      currencyOptions: [],
      currencyOptionsLoading: false,
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      warehouseOptions: [],
      warehouseOptionsLoading: false,
      /* 表格部分 */
      initPoDetailList: [],
      initCommonFileList: [],
      consignmentOrderDetailList: [],
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
      approvedUrl: approvedConsignmentOrder,
      rejectedUrl: rejectedConsignmentOrder,
      cancelledUrl: cancelledConsignmentOrder,
      closedUrl: closedConsignmentOrder,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      detailListCur: [],
      commonFileListCur: [],
      paymentTermList: [],
      paymentTermOptionsLoading: false
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
    editAuth() {
      return this.checkPermi(['purchaseManagement:consignmentOrder:edit'])
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
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    isShowEditBtn() {
      return (
        this.editAuth &&
        ['1', '3'].includes(this.dataType) &&
        this.form.consignmentOrderId &&
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
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanSaveDraft === '1'
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
        this.form.consignmentOrderId &&
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
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['purchaseManagement:consignmentOrder:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },
    closeBtnShow() {
      if (!this.checkPermi(['purchaseManagement:consignmentOrder:close'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanClosed === '1'
      ) {
        show = true
      }
      return show
    },

    withdrawApproveBtnShow() {
      if (!this.checkPermi(['purchaseManagement:consignmentOrder:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.consignmentOrderId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['purchaseManagement:consignmentOrder:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['purchaseManagement:consignmentOrder:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.consignmentOrderId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['purchaseManagement:consignmentOrder:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.consignmentOrderId &&
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
    // 付款条款
    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '2',
        menuPerms: this.menuKey.consignmentOrder,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermList = res.data || []
          const list = this.paymentTermList.filter((x) => x.isDefault === '1') || []
          if (!this.form.paymentTermId && list.length > 0) {
            this.paymentTermChange(list[0], 'init')
          }
        })
        .catch(() => {
          this.paymentTermOptionsLoading = false
        })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(item, type) {
      this.$set(this.form, 'paymentTerm', item)
      this.$set(this.form, 'paymentTermId', item.paymentTermId)
      this.$set(this.form, 'paymentTermName', item.paymentTermName)

      if (type && type === 'init') {
        // 更新初始表单部分字段
        formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
          paymentTerm: item,
          paymentTermId: item.paymentTermId,
          paymentTermName: item.paymentTermName
        })
      }
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
            businessId: this.form.consignmentOrderId,
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
      this.getPoById()
    },
    getPoById() {
      const rowId = this.rowId
      queryConsignmentOrderById({ consignmentOrderId: rowId }).then((res) => {
        const data = res.data || {}
        this.initPoDetailList = data.consignmentOrderDetailList || []
        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.addressForWarehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
        this.form = data
        // const registeredAddress =
        //   data.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
        // this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        // this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
        this.queryCanSelectPortList()
        this.queryPaymentTermListByPaymentTermPurpose()
        this.queryPurchasePersonByOptions()
        this.queryWarehouseOptions()
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.initVersionComparison(data, data.consignmentOrderDetailList)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)

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
      })
    },
    initVersionComparison(data, currentDetailList) {
      const updateMsg = data.updateMsg || {}
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const onlyDeleted = (list) => cloneList(list).filter((item) => item.updateType === '3')

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      if (
        (updateMsg.beforeCommonFileList || []).length ||
        (updateMsg.afterCommonFileList || []).length
      ) {
        this.basicUpdateProps.push('attachment')
      }
      this.detailListCur = cloneList(currentDetailList)
      this.commonFileListCur = cloneList(data.commonFileList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      this.initPoDetailList = this.isComparison
        ? [...cloneList(currentDetailList), ...onlyDeleted(updateMsg.beforeDetailList)]
        : cloneList(currentDetailList)
      this.initCommonFileList = this.isComparison
        ? [...cloneList(data.commonFileList), ...onlyDeleted(updateMsg.beforeCommonFileList)]
        : this.commonFileListCur
    },
    getFormJson() {
      const param = { ...this.form }
      param.commonFileList = this.$refs.ProductTable && this.$refs.ProductTable.getFileIds()
      delete param.subTotal
      delete param.totalTaxAmount
      delete param.totalAmount
      return JSON.stringify(param)
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
        consignmentOrderNo: undefined,
        businessPartnerName: undefined,
        consignmentOrderStatus: undefined,
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
        validity: undefined,
        committedDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        basicRemarks: undefined,
        automatedEmail: '1',

        bpEmail: undefined,
        mobilePhone: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        shipToAddressId: undefined,
        shipToAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        consignmentStartTime: undefined,
        consignmentEndTime: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.initPoDetailList = []
      this.initCommonFileList = []
      this.consignmentOrderDetailList = []
      this.activeNames = ['1', '2', '3', '4', '5', '11']
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.detailListCur = []
      this.commonFileListCur = []
      /* setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300) */
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
      this.$set(this.form, 'abbreviation', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'taxRate', undefined)
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.warehouseClear()
      this.deliveryByClear()
      this.deliveryAddressClear()
      this.initPoDetailList = []
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      const registeredAddress =
        row.bpBusinessAddressList.find((x) => (x.label || '').includes('Registered')) || {}
      this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
      this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'taxRate', row.taxRate)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.warehouseClear()
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
    queryUserDepartment() {
      this.deptOptionsLoading = true
      queryUserDepartment({ menuPerms: this.menuKey.consignmentOrder })
        .then((res) => {
          this.deptOptionsLoading = false
          this.deptOptions = res.data || []
        })
        .catch(() => {
          this.deptOptionsLoading = false
        })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.purchasePersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
      this.queryPurchasePersonByOptions()
    },

    queryPurchasePersonByOptions() {
      this.purchasePersonByOptions = []
      this.purchasePersonByOptionsLoading = true
      const timer = Date.now()
      this.queryUserTimer = timer
      if (!this.form.departmentId) {
        this.purchasePersonByOptionsLoading = false
        return
      }
      queryUsers({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.PO,
        departmentId: this.form.departmentId
      })
        .then((res) => {
          if (this.queryUserTimer !== timer) return
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
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'purchasePersonBy', nickName)
      this.$set(this.form, 'purchasePersonId', userId)
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
      this.initPoDetailList = []
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.initPoDetailList = []
    },
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
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
      this.$set(this.form, 'shipToAddressId', undefined)
      this.$set(this.form, 'shipToAddressName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$refs.form2.clearValidate('shipToAddressName')
      // }
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
    openReceiveAddressTable() {
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
    receiveAddressClear() {
      this.$set(this.form, 'shipToAddressName', undefined)
      this.$set(this.form, 'shipToAddressId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
    },
    updatePort(row) {
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'shipToAddressName', portName)
      this.$set(this.form, 'shipToAddressId', portId)

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
          this.form.receiveAddressCountryId &&
          this.form.receiveAddressCountryId !== countryId &&
          this.form.country !== country
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

    queryWarehouseOptions() {
      this.warehouseOptions = []
      this.warehouseOptionsLoading = true
      const timer = Date.now()
      this.queryWHTimer = timer
      if (!this.form.businessPartnerId) {
        this.warehouseOptionsLoading = false
        return
      }
      queryCanSelectConsignmentWarehouseList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.consignmentOrder,
        consignorId: this.form.businessPartnerId
      })
        .then((res) => {
          if (this.queryWHTimer !== timer) return
          this.warehouseOptionsLoading = false
          this.warehouseOptions = res.rows || []
        })
        .catch(() => {
          if (this.queryWHTimer !== timer) return
          this.warehouseOptionsLoading = false
        })
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseName', warehouseName)

      this.$set(this.form, 'requestedBy', row.userName)
      this.$set(this.form, 'requestedEmail', row.email)
      this.$set(this.form, 'requestedMobileCode', row.mobileCode)
      this.$set(this.form, 'requestedMobileNum', row.mobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.mobilePhone)
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseName', undefined)
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
    requestedByClear() {
      this.$set(this.form, 'requestedBy', undefined)
      this.$set(this.form, 'requestedEmail', undefined)
      this.$set(this.form, 'requestedMobileCode', undefined)
      this.$set(this.form, 'requestedMobileNum', undefined)
      this.$set(this.form, 'requestedMobilePhone', undefined)
    },

    /* 第三部分 表格部分Start */
    updateProductTable(list) {
      this.consignmentOrderDetailList = list || []
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
    deliveryAddressChange(row) {
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpAddress', row.label)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
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
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.shippingInfo'))
        )
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param.consignmentOrderDetailList = detailList
        param.commonFileList = myFileIds
        const valid4 = await this.$refs.form4.validate().catch((err) => {
          return err
        })
        this.collapseWarningForDeliveryInfo = !valid4

        if (!valid4) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.deliveryInfo'))
          )
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.conOrderSaveConfirm')
          successMsg = this.$t('PURCHASE.conOrderSaveSuccess')
          submitFn = saveDraftConsignmentOrder
        } else {
          confirmMsg = this.$t('PURCHASE.conOrderSubmitConfirm')
          successMsg = this.$t('PURCHASE.conOrderSubmitSuccess')
          submitFn = saveConsignmentOrder
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
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }

      const uomReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.uom)
      })
      if (uomReq) {
        this.$refs.ProductTable.errorMessage('uom')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.uom')))
        return valid
      }

      const uomCoefficientReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.uomCoefficient)
      })
      if (uomCoefficientReq) {
        this.$refs.ProductTable.errorMessage('uomCoefficient')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.ratio')))
        return valid
      }

      const consignedQtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignedQty)
      })
      if (consignedQtyReq) {
        this.$refs.ProductTable.errorMessage('consignedQty')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.consignedQty'))
        )
        return valid
      }

      const consignedCostReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignedCost)
      })
      if (consignedCostReq) {
        this.$refs.ProductTable.errorMessage('consignedCost')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.consignedCost'))
        )
        return valid
      }

      const consignedAmountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.consignedAmount)
      })
      if (consignedAmountReq) {
        this.$refs.ProductTable.errorMessage('consignedAmount')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.consignedAmount'))
        )
        return valid
      }

      /*  const leadTimeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.leadTime)
      })
      if (leadTimeReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
        )
        return valid
      }

      const committedDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.committedDate)
      })
      if (committedDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.committedDate'))
        )
        return valid
      } */

      return true
    },
    handleSaveDraft(isConfirm = true, gotoRoute) {
      this.$refs.form1.clearValidate()
      this.$refs.form2.clearValidate()
      this.$refs.form4.clearValidate()
      const myFileIds = this.$refs.ProductTable.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.$refs.form1.validateField(['businessPartnerName'])
      if (!this.form.businessPartnerName) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.supplier')))
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false

      let param = { ...this.form }
      const detailList = this.$refs.ProductTable.getList()
      param.consignmentOrderDetailList = detailList
      param.commonFileList = myFileIds
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

      const confirmMsg = this.$t('PURCHASE.conOrderSaveConfirm')
      const successMsg = this.$t('PURCHASE.conOrderSaveSuccess')
      if (isConfirm) {
        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return saveDraftConsignmentOrder(param)
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
        saveDraftConsignmentOrder(param)
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
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    },
    handlePreviewPDF() {
      const token = getToken()
      const params = { ...this.form }
      const detailList = this.$refs.ProductTable.getList()
      params.consignmentOrderDetailList = detailList
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
        '/purchase/consignmentOrder/preview' +
        `/${this.form.consignmentOrderId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/consignmentOrder/download' +
        `/${this.form.consignmentOrderId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.consignmentOrderId)
    },
    exitComparison() {
      this.isComparison = false
      this.initPoDetailList = JSON.parse(JSON.stringify(this.detailListCur))
      this.initCommonFileList = JSON.parse(JSON.stringify(this.commonFileListCur))
      this.$nextTick(() => {
        this.$refs.ProductTable && this.$refs.ProductTable.initList(this.initPoDetailList)
        this.$refs.ProductTable && this.$refs.ProductTable.initFileList(this.initCommonFileList)
      })
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      if (
        prop === 'consignmentStartTime' ||
        prop === 'consignmentEndTime' ||
        prop === 'committedDate'
      ) {
        return this.parseTime(item.beforeValue, this.fmtForYmd)
      }
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      const afterValue = item && item.afterValue !== undefined ? item.afterValue : fallback
      if (
        prop === 'consignmentStartTime' ||
        prop === 'consignmentEndTime' ||
        prop === 'committedDate'
      ) {
        return this.parseTime(afterValue, this.fmtForYmd)
      }
      return afterValue
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
      return ''
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
          `${this.$t('PURCHASE.consignmentOrder')} [${vm.form.consignmentOrderNo}]`
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
          `${this.$t('PURCHASE.consignmentOrder')} [${vm.form.consignmentOrderNo}]`
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
          `${this.$t('PURCHASE.consignmentOrder')} [${vm.form.consignmentOrderNo}]`
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
          `${this.$t('PURCHASE.consignmentOrder')} [${vm.form.consignmentOrderNo}]`
        )
      )
      vm.back('onCloseSuccess')
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
    border: 1px solid;
    border-radius: 4px;
  }
  .color-block.add {
    background-color: #d2e3fc;
    border-color: #1a73e8;
  }
  .color-block.edit {
    background-color: #f0f7ff;
    border-color: #c2d7fb;
  }
  .color-block.del {
    background-color: #f5f5f4;
    border-color: #78716c;
  }
}
.reject-card {
  .reject-remarks {
    padding: 0 14px 8px;
  }
  .reject-by {
    padding: 0 14px;
    color: #909399;
  }
}
</style>
