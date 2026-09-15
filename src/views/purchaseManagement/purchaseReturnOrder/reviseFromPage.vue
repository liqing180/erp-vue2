<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="submitBtnShow" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
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
                      <el-form-item :label="`${$t('PURCHASE.warehouseName')}`" prop="warehouseName">
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
                      <el-form-item :label="`${$t('ui.pic')}`" prop="picUserBy">
                        <SelectInput
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
                        <el-date-picker
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
                      <el-form-item :label="$t('ui.remarks')">
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
                <div v-if="form.purchaseReturnType === '2'" key="purchaseReturnType11">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.warehouseName')}`" prop="warehouseName">
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
                        <el-input
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
                        <SelectInput
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
                        <el-date-picker
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
                        <el-input
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
                      <el-form-item :label="$t('ui.remarks')">
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
                        <SelectInput
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
                      <el-form-item :label="`${$t('PURCHASE.returnDate')}`" prop="returnDate">
                        <el-date-picker
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
                        <el-input
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
                      <el-form-item :label="$t('ui.remarks')">
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
                      <CommonSelect
                        :clearable="!!form.incotermId"
                        :id="form.incotermId"
                        :label="form.incotermName || 'N/A'"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
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
                      <el-input
                        v-if="form.incotermAddressType === '0'"
                        :value="$t('PURCHASE.selfCollect')"
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
                          @clear="receivePortClear"
                          clearable
                          @click="openPortTable"
                          :disabled="
                            comDisFrom ||
                            !form.incotermId ||
                            !['FAS', 'CIF', 'FOB', 'CFR', 'FCA'].includes(form.incotermAbbreviation)
                          "
                          class="form-wd"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('PURCHASE.deliveryAddress')}`">
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
                      :label="`${$t('PURCHASE.contactPerson')}`"
                      prop="bpContactPersonId"
                    >
                      <CommonSelect
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
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
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
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import { queryIncotermList } from '@/api/common/common'
import {
  savePurchaseReturn,
  queryPurchaseReturnById,
  approvedPurchaseReturn,
  rejectedPurchaseReturn,
  cancelledPurchaseReturn,
  preview
} from '@/api/purchaseManagement/purchaseReturnOrder'
import { getToken } from '@/utils/auth'

import selectPicTable from './components/selectPicTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
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
    SystemOperationLogTable
  },
  data() {
    return {
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
        purchaseOrderNo: [
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
      basicUpdateProps: []
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
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseReturnOrder:edit'])
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
    isCanDealAuth() {
      return false
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
      if (this.approvedBtnShow) {
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
    handleUpdate() {
      this.reset()
      this.queryIncotermList()
      const rowId = this.rowId
      queryPurchaseReturnById({ purchaseReturnId: rowId }).then((res) => {
        const data = res.data || {}
        data.purchaseReturnProductList = data.purchaseReturnProductList || []
        this.initCommonFileList = data.commonFileList || []
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
      })
    },
    // 取消按钮
    back() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseReturnOrder' })
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
        automatedEmail: '0',
        bpBusinessContactPersonList: [],

        addressForWarehouse: {},
        purchaseReturnProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']
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
        this.$refs.form2.clearValidate('receiveAddressName')
      })
    },
    openPortTable() {
      this.$refs.selectPortTable.handleOpen()
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
            .then(() => {})
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
            .then(() => {})
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
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qtyToReturn'))
        )
        return valid
      }

      const returnedAmount = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedAmount)
      })
      if (returnedAmount) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.returnedAmount'))
        )
        return valid
      }

      const returnedReasonReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedReason)
      })
      if (returnedReasonReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.returnReason'))
        )
        return valid
      }
      const returnedResultReq = detailList.find((item) => {
        return this.isCanDealAuth && !this.$resultOfBoolean(item.returnedResult)
      })
      if (returnedResultReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.result')))
        return valid
      }

      if (this.form.purchaseReturnType !== '2') {
        const returnedTypeReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.returnedType)
        })
        if (returnedTypeReq) {
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.RMAType'))
          )
          return valid
        }

        // const scheduledReceivedDate = detailList.find((item) => {
        //   return item.returnedType === '3' && !item.scheduledReceivedDate
        // })
        // if (scheduledReceivedDate) {
        //   this.$modal.msgError(
        //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.estimatedReceiptDate'))
        //   )
        //   return valid
        // }
      }

      return true
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
</style>
