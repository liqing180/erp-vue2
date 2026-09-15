<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="submitBtnShow" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="isCanDealAuth" @click="submitResult"
        >{{ $t('uiBtn.submit') }}
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

      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
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
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.purchaseReturnOrder') }}
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
                  {{ $t('PURCHASE.supplierName') }} : {{ form.businessPartnerName }}
                </span>
                <span v-if="form.warehouseName" class="info-item mr20" :title="form.warehouseName">
                  {{ $t('PURCHASE.warehouseName') }} : {{ form.warehouseName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.purchase_return_status, form.purchaseReturnStatus) }}
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
                  <el-col :span="8" v-if="form.purchaseReturnType === '2'">
                    <el-form-item
                      :label="`${$t('PURCHASE.consignmentOrderNo')}`"
                      prop="consignmentOrderNo"
                    >
                      <el-input
                        v-model="form.consignmentOrderNo"
                        :title="form.consignmentOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-else>
                    <el-form-item :label="`${$t('PURCHASE.DocNo')}`" prop="purchaseOrderNo">
                      <el-input
                        v-model="form.purchaseOrderNo"
                        :title="form.purchaseOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.purchase_return_status,
                            form.purchaseReturnStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseReturnOrderNo')}`">
                      <el-input v-model="form.purchaseReturnNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div v-if="form.purchaseReturnType === '1'" key="purchaseReturnType11">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.logisticsCostNo')}`">
                        <el-input
                          v-model="form.logisticsDocumentNo"
                          :title="form.logisticsDocumentNo"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.supplierName')}`">
                        <el-input
                          v-model="form.businessPartnerName"
                          :title="form.businessPartnerName"
                          disabled
                        ></el-input>
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
                      <el-form-item
                        :label="`${$t('PURCHASE.warehouseName')}`"
                        :rules="{
                          required: form.purchaseReturnType !== '3',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }"
                        prop="warehouseName"
                      >
                        <el-input
                          v-model="form.warehouseName"
                          :title="form.warehouseName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaser')}`">
                        <el-input
                          v-model="form.purchasePersonBy"
                          :title="form.purchasePersonBy"
                          disabled
                        ></el-input>
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
                    <el-col :span="8" v-if="false">
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <ComparisonInput
                          v-if="isModified('picUserBy')"
                          :beforeValue="getBeforeValue('picUserBy')"
                          :afterValue="getAfterValue('picUserBy', form.picUserBy)"
                        />
                        <SelectInput
                          v-else
                          :value="form.picUserBy"
                          :title="form.picUserBy"
                          @clear="picUserByClear"
                          clearable
                          @click="openPicTable"
                          class="form-wd"
                          :disabled="comDisFrom"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.datePurchased')}`">
                        <el-date-picker
                          v-model="form.purchaseDate"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnType')}`">
                        <el-input
                          :value="
                            selectDictLabel(dict.type.purchase_return_type, form.purchaseReturnType)
                          "
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <ComparisonInput
                          v-if="isModified('returnDate')"
                          :beforeValue="getBeforeValue('returnDate')"
                          :afterValue="getAfterValue('returnDate', form.returnDate)"
                        />
                        <el-date-picker
                          v-else
                          v-model="form.returnDate"
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
                </div>

                <div v-if="form.purchaseReturnType === '2'" key="purchaseReturnType22">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.warehouseName')}`"
                        :rules="{
                          required: form.purchaseReturnType !== '3',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }"
                        prop="warehouseName"
                      >
                        <el-input
                          v-model="form.warehouseName"
                          :title="form.warehouseName"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.supplierName')}`">
                        <el-input
                          v-model="form.businessPartnerName"
                          :title="form.businessPartnerName"
                          disabled
                        ></el-input>
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
                    <el-col :span="8" v-if="false">
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <ComparisonInput
                          v-if="isModified('picUserBy')"
                          :beforeValue="getBeforeValue('picUserBy')"
                          :afterValue="getAfterValue('picUserBy', form.picUserBy)"
                        />
                        <SelectInput
                          v-else
                          :value="form.picUserBy"
                          :title="form.picUserBy"
                          @clear="picUserByClear"
                          clearable
                          @click="openPicTable"
                          class="form-wd"
                          :disabled="comDisFrom"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <ComparisonInput
                          v-if="isModified('returnDate')"
                          :beforeValue="getBeforeValue('returnDate')"
                          :afterValue="getAfterValue('returnDate', form.returnDate)"
                        />
                        <el-date-picker
                          v-else
                          v-model="form.returnDate"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaser')}`">
                        <el-input
                          v-model="form.purchasePersonBy"
                          :title="form.purchasePersonBy"
                          disabled
                        ></el-input>
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
                      <el-form-item :label="`${$t('PURCHASE.datePurchased')}`">
                        <el-date-picker
                          v-model="form.purchaseDate"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.returnType')}`">
                        <el-input
                          :value="
                            selectDictLabel(dict.type.purchase_return_type, form.purchaseReturnType)
                          "
                          disabled
                        ></el-input>
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
                </div>
                <div v-if="form.purchaseReturnType === '3'" key="purchaseReturnType33">
                  <el-row>
                    <el-col :span="8" v-if="false">
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <ComparisonInput
                          v-if="isModified('picUserBy')"
                          :beforeValue="getBeforeValue('picUserBy')"
                          :afterValue="getAfterValue('picUserBy', form.picUserBy)"
                        />
                        <SelectInput
                          v-else
                          :value="form.picUserBy"
                          :title="form.picUserBy"
                          @clear="picUserByClear"
                          clearable
                          @click="openPicTable"
                          class="form-wd"
                          :disabled="comDisFrom"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.datePurchased')}`">
                        <el-date-picker
                          v-model="form.purchaseDate"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                          disabled
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.supplierName')}`">
                        <el-input
                          v-model="form.businessPartnerName"
                          :title="form.businessPartnerName"
                          disabled
                        ></el-input>
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
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <ComparisonInput
                          v-if="isModified('returnDate')"
                          :beforeValue="getBeforeValue('returnDate')"
                          :afterValue="getAfterValue('returnDate', form.returnDate)"
                        />
                        <el-date-picker
                          v-else
                          v-model="form.returnDate"
                          :picker-options="validityDaysPickerOptions"
                          :format="fmtForYmd"
                          value-format="timestamp"
                          :style="{ width: '100%' }"
                          placeholder=""
                          clearable
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.purchaser')}`">
                        <el-input
                          v-model="form.purchasePersonBy"
                          :title="form.purchasePersonBy"
                          disabled
                        ></el-input>
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
                      <el-form-item :label="`${$t('PURCHASE.returnType')}`">
                        <el-input
                          :value="
                            selectDictLabel(dict.type.purchase_return_type, form.purchaseReturnType)
                          "
                          disabled
                        ></el-input>
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
                </div>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.returnInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span
                  v-if="form.receiveAddressName"
                  class="info-item"
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.incoterm')}`">
                      <ComparisonInput
                        v-if="isModified('incotermName')"
                        :beforeValue="getBeforeValue('incotermName')"
                        :afterValue="getAfterValue('incotermName', form.incotermName || 'N/A')"
                      />
                      <CommonSelect
                        v-else
                        :clearable="!!form.incotermId"
                        :id="form.incotermId"
                        :label="form.incotermName || 'N/A'"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        :loading="incotermOptionsLoading"
                        @change="incotermIdChange"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.port')}`"
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
                        v-if="!isModified('receivePortName') && form.incotermAddressType === '0'"
                        :value="$t('PURCHASE.selfCollect')"
                        disabled
                      ></el-input>
                      <ToolTipShowObj
                        v-if="!isModified('receivePortName') && form.incotermAddressType !== '0'"
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
                            comDisFrom ||
                            !form.incotermId ||
                            !['FAS', 'CIF', 'FOB', 'CFR', 'FCA'].includes(form.incotermAbbreviation)
                          "
                          :loading="portNameLoading"
                          @change="updatePort"
                          ref="portRef"
                          @handleOpen="openPortTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.zone')}`">
                      <ComparisonInput
                        v-if="isModified('district')"
                        :beforeValue="getBeforeValue('district')"
                        :afterValue="getAfterValue('district', form.receivePortName)"
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
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required:
                            ['CPT', 'CIP', 'DDP', 'DAP', 'DPU', 'FCA'].includes(
                              form.incotermAbbreviation
                            ) || !form.incotermId,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      key="deliveryAddress2"
                    >
                      <ComparisonInput
                        v-if="isModified('receiveAddress')"
                        :beforeValue="getBeforeValue('receiveAddress')"
                        :afterValue="getAfterValue('receiveAddress', form.receiveAddress)"
                      />
                      <CommonSelectAndList
                        v-else
                        :id="form.receiveAddressId"
                        :label="form.receiveAddress"
                        :title="form.receiveAddress"
                        idKey="businessAddressId"
                        labelKey="receiveAddress"
                        filterable
                        :options="receiveAddressOptions"
                        :loading="receiveAddressOptionsLoading"
                        :disabled="
                          !form.businessPartnerId ||
                          comDisFrom ||
                          form.incotermAbbreviation === 'EXW'
                        "
                        @change="updateAddress"
                        @handleOpen="openReceiveAddressTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.contactPerson')}`"
                      prop="bpContactPersonId"
                    >
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
                        @change="contactPersonChange"
                      />
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
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  :comDisFrom="comDisFrom"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateProps="basicUpdateProps"
                  :isCanDealAuth="isCanDealAuth"
                  @scrollPageToTable="scrollPageToTable"
                />
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

    <selectPicTable ref="selectPicTable" @update="updatePic" />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="updateAddress"
    />

    <ApprovedDialog
      :id="form.purchaseReturnId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.purchaseReturnId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.purchaseReturnId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg module-key="purchaseReturn" ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import {
  savePurchaseReturn,
  queryPurchaseReturnById,
  approvedPurchaseReturn,
  rejectedPurchaseReturn,
  cancelledPurchaseReturn,
  preview,
  withdrawApproved,
  dealPurchaseReturnResult
} from '@/api/purchaseManagement/purchaseReturnOrder'
import { getToken } from '@/utils/auth'

import selectPicTable from './components/selectPicTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  mixins: [pageMixin],
  dicts: ['purchase_return_status', 'purchase_return_type'],
  components: {
    selectPicTable,
    ProductInfo,
    selectPortTable,
    payToAddressDlg,

    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
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
      form: {
        purchaseReturnProductList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        consignmentOrderNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseOrderNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        /* returnDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ], */
        picUserBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        dueDate: [
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
        bpContactPersonId: [
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
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      portNameLoading: false,
      receiveAddressOptions: [],
      receiveAddressOptionsLoading: false,
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
      initCommonFileList: [],

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedPurchaseReturn,
      rejectedUrl: rejectedPurchaseReturn,
      cancelledUrl: cancelledPurchaseReturn,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      productListCur: [],
      commonFileListCur: []
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
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:edit'])
    },
    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) {
        return true
      }
      let dis = true
      if (!this.editAuth) {
        return true
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseReturnId &&
        [this.buttonAuthMsg.isCanUpdate].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    isShowEditBtn() {
      return (
        this.editAuth &&
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseReturnId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
    },
    isCanDealAuth() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseReturnId &&
        [this.buttonAuthMsg.isCanDeal].includes('1')
      ) {
        show = true
      }
      return show
    },
    submitBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.purchaseReturnId && this.buttonAuthMsg.isCanUpdate === '1') {
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
        this.form.purchaseReturnId &&
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
        this.form.purchaseReturnId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseReturnOrder:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.purchaseReturnId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseReturnOrder:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseReturnId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseReturnOrder:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseReturnId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseReturnOrder:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseReturnId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseReturnOrder:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseReturnId &&
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
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.purchaseReturnId,
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
      this.queryIncotermList()
      const rowId = this.rowId
      queryPurchaseReturnById({ purchaseReturnId: rowId }).then((res) => {
        const data = res.data || {}
        data.purchaseReturnProductList = data.purchaseReturnProductList || []
        this.initCommonFileList = data.commonFileList || []

        this.form = data
        this.queryReceiveAddressOptions()

        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.initVersionComparison(data, data.purchaseReturnProductList)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
        this.queryCanSelectPortList()
      })
    },
    initVersionComparison(data, currentProductList) {
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
      this.productListCur = cloneList(currentProductList)
      this.commonFileListCur = cloneList(data.commonFileList)
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      this.$set(
        this.form,
        'purchaseReturnProductList',
        this.isComparison
          ? [...cloneList(currentProductList), ...onlyDeleted(updateMsg.beforeProductList)]
          : cloneList(currentProductList)
      )
      this.initCommonFileList = this.isComparison
        ? [...cloneList(data.commonFileList), ...onlyDeleted(updateMsg.beforeCommonFileList)]
        : this.commonFileListCur
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        purchaseOrderNo: undefined,
        warehouseName: undefined,
        warehouseLabel: undefined,
        warehouseUserName: undefined,
        warehouseAddressShowStr: undefined,
        warehouseUserMobileCode: undefined,
        warehouseUserMobileNum: undefined,
        warehouseUserMobilePhone: undefined,
        warehouseUserEmail: undefined,
        picUserBy: undefined,
        picUserId: undefined,
        purchaseReturnNo: undefined,
        purchasePersonBy: undefined,
        purchasePersonId: undefined,
        businessPartnerName: undefined,
        purchaseDate: undefined,
        returnDate: undefined,
        dueDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        bpBusinessContactPersonList: [],

        addressForWarehouse: {},
        purchaseReturnProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '11']
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.productListCur = []
      this.commonFileListCur = []
      this.resetForm('form1')
      this.resetForm('form2')
    },

    /* 表单部分Start */
    // 打开pic弹窗
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    updatePic(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'picUserBy', nickName)
      this.$set(this.form, 'picUserId', userId)
    },
    // 清空pic
    picUserByClear() {
      this.$set(this.form, 'picUserBy', undefined)
      this.$set(this.form, 'picUserId', undefined)
    },
    /* 第二部分表单 */
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
      this.receiveAddressClear()
      this.receivePortClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate(['receivePortName', 'receiveAddressName'])
      })
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
        const hasReceiveAddress = !!this.form.receiveAddressId
        firstCountryId = hasReceiveAddress
          ? this.form.receiveAddressCountryId
          : this.form.registeredAddressCountryId
        firstCountry = hasReceiveAddress
          ? this.form.receiveAddressCountry
          : this.form.registeredAddressCountry
        firstCity = hasReceiveAddress
          ? this.form.receiveAddressCity
          : this.form.registeredAddressCity
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
        const hasReceiveAddress = !!this.form.receiveAddressId
        firstCountryId = hasReceiveAddress
          ? this.form.receiveAddressCountryId
          : this.form.registeredAddressCountryId
        firstCountry = hasReceiveAddress
          ? this.form.receiveAddressCountry
          : this.form.registeredAddressCountry
        firstCity = hasReceiveAddress
          ? this.form.receiveAddressCity
          : this.form.registeredAddressCity
      }
      this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
    },

    queryReceiveAddressOptions() {
      this.loading = true
      this.$set(this.form, 'registeredAddressCountryId', undefined)
      this.$set(this.form, 'registeredAddressCountry', undefined)
      this.$set(this.form, 'registeredAddressCity', undefined)
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.businessPartnerMainId = this.form.businessPartnerMainId
      param.includeLatestData = '1'
      this.receiveAddressOptionsLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          this.receiveAddressOptionsLoading = false
          const rows = response.rows || []
          const registeredAddress = rows.find((x) => (x.label || '').includes('Registered')) || {}
          this.$set(this.form, 'registeredAddressCountryId', registeredAddress.countryId)
          this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
          this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
          this.receiveAddressOptions = rows
          this.queryCanSelectPortList()
        })
        .catch((err) => {
          this.receiveAddressOptionsLoading = false
          window.console.error(err)
        })
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
    },
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
      this.$set(this.form, 'receiveAddressCountryId', undefined)
      this.$set(this.form, 'receiveAddressCountry', undefined)
      this.$set(this.form, 'receiveAddressCity', undefined)
      this.$nextTick(() => {
        this.queryCanSelectPortList()
      })
    },
    updatePort(row) {
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)

      if (!portId) return
      if (['FOB', 'FAS'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.legalEntityInfo.countryId !== countryId &&
          this.legalEntityInfo.country !== country &&
          this.legalEntityInfo.country.indexOf(country) === -1
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForFOBOrFAS')
              .replace('$1', this.legalEntityInfo.country)
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
        const portCountry = this.form.receiveAddressId
          ? this.form.receiveAddressCountry
          : this.form.registeredAddressCountry
        if (portCountry && portCountry !== country) {
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
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'receiveAddressCountryId', row.countryId)
      this.$set(this.form, 'receiveAddressCountry', row.country)
      this.$set(this.form, 'receiveAddressCity', row.city)
      this.$nextTick(() => {
        this.queryCanSelectPortList()
      })
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
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.returnInfo'))
        )
        return
      }

      if (valid1 && valid2) {
        let param = { ...this.form }
        const validProduct = this.validProductList(param.purchaseReturnProductList)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        const confirmMsg = this.$t('PURCHASE.PROSubmitConfirm')
        const successMsg = this.$t('PURCHASE.PROSubmitSuccess')
        const submitFn = savePurchaseReturn

        let docName = ''
        if (param.purchaseReturnType === '1') {
          docName = this.$t('menu.purchaseReturnOrder')
        }
        if (param.purchaseReturnType === '2') {
          docName = this.$t('menu.consignmentReturnOrder')
        }
        if (param.purchaseReturnType === '3') {
          docName = this.$t('menu.purchaseDirectShippingReturn')
        }

        this.$modal
          .confirm(confirmMsg.replace('$1', docName))
          .then(() => {
            this.submitLoading = true
            return submitFn(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(successMsg.replace('$1', docName).replace('$2', response.msg))
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
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qtyToReturn)
      })
      if (qtyReq) {
        this.$refs.ProductInfo.errorMessage('qtyToReturn')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qtyToReturn'))
        )
        return valid
      }

      const returnedAmount = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedAmount)
      })
      if (returnedAmount) {
        this.$refs.ProductInfo.errorMessage('returnedAmount')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.returnedAmount'))
        )
        return valid
      }

      const returnedReasonReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedReason)
      })
      if (returnedReasonReq) {
        this.$refs.ProductInfo.errorMessage('returnedReason')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.returnReason'))
        )
        return valid
      }

      if (this.form.purchaseReturnType !== '2') {
        const returnedTypeReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.returnedType)
        })
        if (returnedTypeReq) {
          this.$refs.ProductInfo.errorMessage('returnedType')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.RMAType'))
          )
          return valid
        }
      }
      // const scheduledReceivedDate = detailList.find((item) => {
      //   return item.returnedType === '3' && !item.scheduledReceivedDate
      // })
      // if (scheduledReceivedDate) {
      //   this.$refs.ProductInfo.errorMessage('scheduledReceivedDate')

      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.estimatedReceiptDate'))
      //   )
      //   return valid
      // }

      return true
    },
    submitResult() {
      const detailList = this.form.purchaseReturnProductList
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qtyToReturn)
      })
      if (qtyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qtyToReturn'))
        )
        this.collapseWarningForProductInfo = true
        return
      }
      const returnedResultReq = detailList.find((item) => {
        return this.isCanDealAuth && !this.$resultOfBoolean(item.returnedResult)
      })
      if (returnedResultReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.result')))
        this.collapseWarningForProductInfo = true
        return
      }
      // const scheduledReceivedDateReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.scheduledReceivedDate) && item.returnedResult === '3'
      // })
      // if (scheduledReceivedDateReq) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.estimatedReceiptDate'))
      //   )
      //   this.collapseWarningForProductInfo = true
      //   return
      // }
      this.collapseWarningForProductInfo = false
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      // param.commonFileList = myFileIds
      const confirmMsg = this.$t('PURCHASE.PROSubmitConfirm')
      const successMsg = this.$t('PURCHASE.PROSubmitSuccess')
      const submitFn = dealPurchaseReturnResult

      let docName = ''
      if (param.purchaseReturnType === '1') {
        docName = this.$t('menu.purchaseReturnOrder')
      }
      if (param.purchaseReturnType === '2') {
        docName = this.$t('menu.consignmentReturnOrder')
      }
      if (param.purchaseReturnType === '3') {
        docName = this.$t('menu.purchaseDirectShippingReturn')
      }

      this.$modal
        .confirm(confirmMsg.replace('$1', docName))
        .then(() => {
          this.submitLoading = true
          return submitFn(param)
        })
        .then((response) => {
          this.$modal.msgSuccess(successMsg.replace('$1', docName).replace('$2', response.msg))
          this.submitLoading = false
          this.back()
        })
        .catch(() => {
          this.submitLoading = false
        })
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
        '/purchase/purchaseReturn/preview' +
        `/${this.form.purchaseReturnId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseReturn/download' +
        `/${this.form.purchaseReturnId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.purchaseReturnId)
    },
    exitComparison() {
      this.isComparison = false
      this.$set(
        this.form,
        'purchaseReturnProductList',
        JSON.parse(JSON.stringify(this.productListCur))
      )
      this.initCommonFileList = JSON.parse(JSON.stringify(this.commonFileListCur))
      this.$nextTick(() => {
        this.$refs.ProductInfo && this.$refs.ProductInfo.initFileList(this.initCommonFileList)
      })
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      if (prop === 'returnDate') {
        return this.parseTime(item.beforeValue, this.fmtForYmd)
      }
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      const afterValue = item && item.afterValue !== undefined ? item.afterValue : fallback
      if (prop === 'returnDate') {
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
          `${this.$t('menu.purchaseReturnOrder')} [${vm.form.purchaseReturnNo}]`
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
          `${this.$t('menu.purchaseReturnOrder')} [${vm.form.purchaseReturnNo}]`
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
          `${this.$t('menu.purchaseReturnOrder')} [${vm.form.purchaseReturnNo}]`
        )
      )
      vm.back('onCancelSuccess')
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
