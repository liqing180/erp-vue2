<template>
  <FormPageLayoutTabs ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        v-if="submitBtnShow && !approvedBtnShow"
        @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="saveDraftBtnShow" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveAsDraft') }}
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
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
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
      <!-- <el-button
        type="primary"
        size="mini"
        v-if="previewPDFShow && !rowId"
        :loading="previewPDFLoading"
        @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button> -->
      <el-button
        type="primary"
        size="mini"
        :loading="resendBtnLoading"
        v-if="resendBtnShow"
        @click="handleResend"
        >{{ $t('menu.resend2') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
      </el-button>

      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <el-popover ref="popoverRef" placement="bottom" v-if="moreBtnShow">
        <!-- 1:"Pending",2:"Closed",3:"Cancelled" -->
        <dl class="pop-list-inrow">
          <dd @click.stop.prevent="actionHandle('copyPI')" v-if="copyPIBtnShow">
            {{ $t('SALES.copyPI') }}
          </dd>
          <dd
            @click.stop.prevent="actionHandle('viewSO')"
            v-hasPermi="['salesManagement:salesOrder:list']"
          >
            {{ $t('SALES.viewSO') }}
          </dd>
          <dd @click.stop.prevent="actionHandle('viewPaymentStage')">
            {{ $t('SALES.viewPaymentStage') }}
          </dd>
          <dd
            @click.stop.prevent="actionHandle('viewApproval')"
            v-if="approvedBtnShow && comeFrom === '1'"
          >
            {{ $t('SALES.viewApproval') }}
          </dd>
        </dl>
        <el-button
          style="margin-left: 10px !important"
          type="text"
          :loading="moreBtnLoading"
          slot="reference"
          >{{ $t('uiBtn.more') }}</el-button
        >
      </el-popover>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.proformaInvoice') }}
      </div>
    </template>
    <template v-slot:tabs v-if="previewPDFShow">
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleTabsClick">
        <el-tab-pane :label="$t('ui.basicInfo')" name="basicInfo"></el-tab-pane>
        <el-tab-pane :label="$t('menu.previewPDF')" name="pdfInfo"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div
        style="height: calc(100% - 6px)"
        v-show="activeName === 'pdfInfo'"
        v-loading="previewPDFLoading"
      >
        <i-frame style="height: 100%" :src="pdfInfoUrl + '#navpanes=0'" v-if="pdfInfoUrl" />
        <!-- <div v-else style="height: 50vh"></div> -->
      </div>
      <div v-show="activeName === 'basicInfo'" v-loading="buildLoading">
        <el-collapse v-model="activeNames">
          <div class="form-card mb10" v-if="isComparison">
            <div class="legend-bar">
              <span class="legend-text">{{ $t('ui.legend') }}</span>
              <span class="legend-divider"></span>
              <span class="legend-item">
                <span class="color-block add"></span>{{ $t('ui.added') }}
              </span>
              <span class="legend-divider"></span>
              <span class="legend-item">
                <span class="color-block edit"></span>{{ $t('ui.modified') }}
              </span>
              <span class="legend-divider"></span>
              <span class="legend-item">
                <span class="color-block del"></span>{{ $t('ui.deleted') }}
              </span>
            </div>
          </div>

          <div
            class="form-card reject-card collapse-item-content-pt0 mb10"
            v-if="isComparison && (form.operationLogForLastReject || {}).operatorBy"
          >
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
          </div>

          <!-- 基本信息 -->
          <div class="form-card collapse-item-content-pt0">
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
                :rules="rules"
                label-position="top"
                @submit.native.prevent
                label-width="160px"
                class="pb20"
              >
                <el-row :gutter="120">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.sourceType1')}`">
                      <el-input :value="$t('SALES.SOPaymentStage')" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`" prop="status">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.proforma_invoice_status,
                            form.proformaInvoiceStatus
                          )
                        "
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.piNo')}`">
                      <el-input
                        v-model="form.proformaInvoiceNo"
                        :title="form.proformaInvoiceNo"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="120">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.sourceDocNo')}`" prop="documentId">
                      <CommonSelectAndList
                        :id="form.documentId"
                        :label="form.documentNo"
                        idKey="documentId"
                        labelKey="documentNo"
                        filterable
                        :options="documentNoOptions"
                        :loading="documentNoOptionsLoading"
                        @change="updateDocumentNo"
                        @handleOpen="openDocumentNoTable"
                        :disabled="comDisFrom || !!rowId || !!salesOrderId"
                        :clearable="false"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.businessPartner')}`">
                      <el-input
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.ourRef')}`">
                      <el-input :value="form.ourRef" :title="form.ourRef" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="120">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.incoterm')}`">
                      <el-input :value="form.incotermName" :title="form.incotermName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.port')}`">
                      <el-input :value="form.receivePortName" :title="form.portName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.yourRef')}`">
                      <el-input :value="form.yourRef" :title="form.yourRef" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="120">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.piDate')}`">
                      <el-date-picker
                        :value="form.proformaInvoiceDate"
                        :editable="false"
                        disabled
                        type="date"
                        :format="fmtForYmd"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.issueDate')}`">
                      <el-date-picker
                        :value="form.issueDate"
                        :editable="false"
                        disabled
                        type="date"
                        :format="fmtForYmd"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.project')}`">
                      <el-input
                        :value="form.costProjectName"
                        :title="form.costProjectName"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <!-- 产品信息 -->
          <div class="form-card mt10 set-tabs-style" ref="collapseScrollPage">
            <el-tabs v-model="subActiveName" size="mini" @tab-click="handleSubTabsClick">
              <el-tab-pane
                :label="$t('SALES.soLineSelectionReference')"
                name="soLineSelectionReference"
              >
                <div slot="label" style="padding: 0 20px">
                  {{ $t('SALES.soLineSelectionReference') }}
                </div>
                <SoLineSelectionReferenceInfo
                  :formData="form"
                  :pisFormData="pisForm"
                  :comDisFrom="comDisFrom || !form.documentId"
                  :modifyHighlight="modifyHighlight"
                  ref="SoLineSelectionReferenceInfo"
                  :pipFormData="piPaymentTermFrom"
                  @paymentStageChange="paymentStageChange"
                  :isRevise="isRevisePage || form.isRevise === '1'"
                />
              </el-tab-pane>
              <el-tab-pane :label="$t('SALES.paymentTermStageInfo')" name="paymentTermStageInfo">
                <div slot="label" style="padding: 0 20px">
                  {{ $t('SALES.paymentTermStageInfo') }}
                </div>
                <PaymentTermStageInfo
                  :formData="form"
                  :pipFormData="piPaymentTermFrom"
                  @paymentStageChange="paymentStageChange"
                  :comDisFrom="comDisFrom || !form.documentId"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateMsgList="basicUpdateMsgList"
                  ref="PaymentTermStageInfo"
                />
              </el-tab-pane>
              <el-tab-pane
                :label="$t('SALES.customerBillingBankInfo')"
                name="customerBillingBankInfo"
              >
                <div slot="label" style="padding: 0 20px">
                  {{ $t('SALES.customerBillingBankInfo') }}
                </div>
                <CustomerBillingBankInfo
                  :formData="form"
                  :piBankFromData="piBankFrom"
                  :piEmailFromData="piEmailFrom"
                  :comDisFrom="comDisFrom || !form.documentId"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateMsgList="basicUpdateMsgList"
                  ref="CustomerBillingBankInfo"
                />
              </el-tab-pane>
              <el-tab-pane :label="$t('SALES.emailSettings')" name="emailSettings">
                <div slot="label" style="padding: 0 20px">
                  {{ $t('SALES.emailSettings') }}
                </div>
                <EmailSettingsInfo
                  ref="EmailSettingsInfo"
                  :formData="form"
                  :piEmailFromData="piEmailFrom"
                  :initEmailFileList="initEmailFileList"
                  :comDisFrom="comDisFrom || !form.documentId"
                  :modifyHighlight="modifyHighlight"
                  :basicUpdateMsgList="basicUpdateMsgList"
                />
              </el-tab-pane>
            </el-tabs>
          </div>

          <div
            class="form-card mt10"
            v-show="subActiveName === 'soLineSelectionReference' && !!rowId"
          >
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
                    {{ $t('ui.operTime') }} :
                    {{ parseTime(form.operationLogForLast.operatorTime) }}
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

    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateDocumentNo" />

    <ApprovedDialog
      :id="form.proformaInvoiceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
      :formData="approvedFormData"
      formDataKey="proformaInvoice"
    />

    <RejectDialog
      :id="form.proformaInvoiceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.proformaInvoiceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <paymentSchedule ref="paymentScheduleRef" :isPath="'pi'" :salesOrderId="form.documentId" />
    <RevisionComparisonDlg module-key="proformaInvoice" ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import RevisionComparisonDlg from '@/components/RevisionComparison'
import {
  queryProformaInvoiceById,
  saveDraftProformaInvoice,
  submitProformaInvoice,
  findPreviousCanCreatePiStageList,
  reviseProformaInvoice,
  approvedProformaInvoice,
  rejectedProformaInvoice,
  cancelledProformaInvoice,
  withdrawApproved,
  sendEmail,
  queryCanSelectSalesOrderList,
  buildProformaInvoiceForSalesOrder,
  preview,
  copyProformaInvoiceForSalesOrder
} from '@/api/salesManagement/proformaInvoice'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import SoLineSelectionReferenceInfo from './components/SoLineSelectionReferenceInfo.vue'
import PaymentTermStageInfo from './components/PaymentTermStageInfo.vue'
import CustomerBillingBankInfo from './components/CustomerBillingBankInfo.vue'
import EmailSettingsInfo from './components/EmailSettingsInfo.vue'

import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import { formDirtyClass } from '@/mixins/formDirtyClass'
import { getToken } from '@/utils/auth'
import iFrame from '@/components/iFrame/index'
import paymentSchedule from '@/views/salesManagement/salesOrder/paymentSchedule/paymentSchedule'
export default {
  dicts: ['proforma_invoice_source_type', 'proforma_invoice_status'],
  mixins: [pageMixin],
  components: {
    RevisionComparisonDlg,
    iFrame,
    selectSalesOrderTable,
    SoLineSelectionReferenceInfo,
    PaymentTermStageInfo,
    CustomerBillingBankInfo,
    EmailSettingsInfo,
    SystemOperationLogTable,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    paymentSchedule
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
    dataType: {
      type: [String, Number],
      default: '1'
    },
    comeFrom: {
      type: [String],
      // 1:update进入，2:审批流进入
      default: '1'
    },
    taskId: {
      type: String,
      default: ''
    },
    isRevisePage: {
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
        } else {
          this.handleAdd()
        }
      }
    }
  },
  data() {
    return {
      salesOrderId: '',
      previewPDFLoading: false,
      resendBtnLoading: false,
      moreBtnLoading: false,
      pdfInfoUrl: '',
      submitLoading: false,
      buildLoading: false,
      activeName: 'basicInfo', // basicInfo pdfInfo
      subActiveName: 'soLineSelectionReference',
      activeNames: ['1', '2', '3', '4'],
      rowId: '',
      timeId: '',
      form: {},
      rules: {
        documentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      pisForm: {},
      piPaymentTermFrom: {},
      piBankFrom: {},
      piEmailFrom: {},
      initEmailFileList: [],
      basicUpdateProps: [],
      basicUpdateMsgList: [],
      updateMsg: {},
      isComparison: false,
      detailListCur: [],
      commonFileListCur: [],
      collapseWarningForBasicInfo: false,

      aplVisible: false,
      approvedUrl: approvedProformaInvoice,
      rjVisible: false,
      rejectedUrl: rejectedProformaInvoice,
      cancelledUrl: cancelledProformaInvoice,
      approvedFormData: undefined,
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSeeUpdateMsg: '0'
      },
      documentNoOptions: [],
      documentNoOptionsLoading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    addAuth() {
      return this.checkPermi(['salesManagement:proformaInvoice:add'])
    },
    editAuth() {
      return this.checkPermi(['salesManagement:proformaInvoice:edit'])
    },
    comDisFrom() {
      if (this.approvedBtnShow && this.isComparison) return true
      if (this.isRevisePage) {
        let dis = true
        if (!this.editAuth) {
          return true
        }
        if (this.form.proformaInvoiceId && this.buttonAuthMsg.isCanRevise === '1') {
          dis = false
        }
        return dis
      } else if (this.rowId) {
        let dis = true
        if (!this.editAuth) {
          return true
        }
        /*  */
        if (['1', '3'].includes(this.dataType) && this.buttonAuthMsg.isCanUpdate === '1') {
          dis = false
        }
        return dis
      } else {
        return !this.addAuth
      }
    },
    submitBtnShow() {
      let show = false
      if (this.isRevisePage) {
        if (!this.editAuth) {
          return false
        }
        if (this.form.proformaInvoiceId && this.buttonAuthMsg.isCanRevise === '1') {
          show = true
        }
        return show
      } else if (this.rowId) {
        if (!this.editAuth) {
          return false
        }
        /*  */
        if (['1', '3'].includes(this.dataType) && this.buttonAuthMsg.isCanUpdate === '1') {
          show = true
        }
        return show
      } else {
        return this.addAuth
      }
    },
    saveDraftBtnShow() {
      if (this.isRevisePage) return false
      if (this.modifyHighlight) return false
      if (this.rowId) {
        let show = false
        if (!this.editAuth) {
          return false
        }
        if (
          ['1', '3'].includes(this.dataType) &&
          this.form.proformaInvoiceId &&
          this.buttonAuthMsg.isCanSaveDraft === '1'
        ) {
          show = true
        }
        return show
      } else {
        return this.addAuth
      }
    },

    reviseBtnShow() {
      let show = false
      if (this.isRevisePage) {
        return false
      }
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.proformaInvoiceId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
      ) {
        show = true
      }
      return show
    },
    approvedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      }
      if (this.buttonAuthMsg.isCanApproved === '1') {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      }
      if (this.buttonAuthMsg.isCanRejected === '1') {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['salesManagement:proformaInvoice:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.proformaInvoiceId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    resendBtnShow() {
      if (!this.checkPermi(['salesManagement:proformaInvoice:resend'])) {
        return false
      }
      let show = false

      if (this.form.proformaInvoiceId && this.buttonAuthMsg.isCanReSend === '1') {
        show = true
      }
      return show
    },

    cancelBtnShow() {
      if (this.isRevisePage) {
        return false
      }
      if (!this.checkPermi(['salesManagement:proformaInvoice:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.proformaInvoiceId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['salesManagement:proformaInvoice:previewPDF'])) {
        return false
      }
      if (!this.rowId) {
        return true
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.proformaInvoiceId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (this.isRevisePage) {
        return false
      }
      if (!this.checkPermi(['salesManagement:proformaInvoice:printPDF']) && !this.approvedBtnShow) {
        return false
      }
      let show = false
      if (this.form.proformaInvoiceId && this.buttonAuthMsg.isCanPrintPDF === '1') {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (this.isRevisePage) {
        return false
      }
      if (!this.checkPermi(['salesManagement:proformaInvoice:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.proformaInvoiceId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
      ) {
        show = true
      }
      return show
    },
    moreBtnShow() {
      return ['2', '3', '4', '6'].includes(this.form.proformaInvoiceStatus)
    },
    copyPIBtnShow() {
      if (!this.addAuth) {
        return false
      }
      let show = false
      if (this.form.proformaInvoiceId && this.buttonAuthMsg.isCanCopy === '1') {
        show = true
      }
      return show
    },

    isShowEditBtn() {
      if (!this.editAuth) return false
      return (
        ['1', '3'].includes(this.dataType) &&
        this.form.proformaInvoiceId &&
        this.buttonAuthMsg.isCanUpdate === '1' &&
        this.approvedBtnShow &&
        this.isComparison
      )
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
  methods: {
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.proformaInvoiceId)
    },
    handleAdd() {
      this.reset()
      this.queryDocumentNoOptions()
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
      this.paymentPlanDetailId = this.$route.query.paymentPlanDetailId
      this.salesOrderId = this.$route.query.salesOrderId
      this.copyFromProformaInvoiceId = this.$route.query.copyFromProformaInvoiceId
      if (this.salesOrderId) {
        this.buildProformaInvoiceForSalesOrder({
          salesOrderId: this.salesOrderId,
          paymentPlanDetailId: this.paymentPlanDetailId
        })
      }
    },
    handleUpdate() {
      this.reset()
      this.queryDocumentNoOptions()
      queryProformaInvoiceById({ proformaInvoiceId: this.rowId }).then((res) => {
        const data = res.data || {}
        const paymentSchedule = data.paymentSchedule || []
        const delNullChildren = (data) =>
          data.forEach((x) => {
            x.disabled = !x.canCreatePi
            if (x.children && x.children.length > 0) {
              delNullChildren(x.children)
            } else {
              delete x.children
            }
          })
        delNullChildren(paymentSchedule)
        const pisForm = data.proformaInvoiceSelection || {}
        pisForm.proformaInvoiceSelectionDetailList =
          pisForm.proformaInvoiceSelectionDetailList || []
        const proformaInvoicePayment = data.proformaInvoicePayment || {}
        const proformaInvoiceCustomer = data.proformaInvoiceCustomer || {}
        const proformaInvoiceEmailSetting = data.proformaInvoiceEmailSetting || {}
        pisForm.proformaInvoiceSelectionDetailList.forEach((item) => {
          this.$set(item, 'proformaInvoiceQtyError', false)
          this.$set(item, 'ROW-ERROR', false)
        })
        this.pisForm = pisForm
        this.piPaymentTermFrom = proformaInvoicePayment
        this.piBankFrom = proformaInvoiceCustomer
        this.piEmailFrom = proformaInvoiceEmailSetting
        if (this.piEmailFrom.recipientSource === 'MANUAL') {
          if (this.piEmailFrom.toRecipientList && this.piEmailFrom.toRecipientList.length > 0) {
            const top = this.piEmailFrom.toRecipientList[0]
            this.$set(this.piEmailFrom, 'manualEmail', top.email)
          }
        }

        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.initVersionComparison(data)

        setTimeout(() => {
          this.$refs.SoLineSelectionReferenceInfo?.initTableSelect()
        }, 300)

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

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },

    handleSubTabsClick() {},

    initVersionComparison(data) {
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      const updateMsg = data.updateMsg || {}
      const currentDetailList = cloneList(
        (data.proformaInvoiceSelection || {}).proformaInvoiceSelectionDetailList
      )
      const currentFileList = cloneList((data.proformaInvoiceEmailSetting || {}).attachmentList)

      this.updateMsg = updateMsg
      this.basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
      this.basicUpdateProps = this.basicUpdateMsgList.map((item) => item.name)
      this.detailListCur = currentDetailList
      this.commonFileListCur = currentFileList
      this.isComparison = this.buttonAuthMsg.isCanSeeUpdateMsg === '1' && this.approvedBtnShow
      if (this.isComparison === true) {
        setTimeout(() => {
          if (this.isComparison) {
            this.revisionComparison()
          }
        }, 300)
      }

      if (this.isComparison && (data.operationLogForLastReject || {}).operatorBy) {
        this.activeNames = Array.from(new Set([...this.activeNames, '11']))
      }
      const deletedFileList = cloneList(updateMsg.beforeAttachmentList).filter(
        (item) => item.updateType === '3'
      )
      this.initEmailFileList = this.isComparison
        ? [...cloneList(this.commonFileListCur), ...deletedFileList]
        : cloneList(this.commonFileListCur)
    },

    exitComparison() {
      const cloneList = (list) => JSON.parse(JSON.stringify(list || []))
      this.isComparison = false
      this.$set(this.piEmailFrom, 'attachmentList', cloneList(this.commonFileListCur))
      this.initEmailFileList = cloneList(this.commonFileListCur)
      setTimeout(() => {
        this.$refs.SoLineSelectionReferenceInfo?.initTableSelect()
      }, 300)
    },

    queryDocumentNoOptions() {
      queryCanSelectSalesOrderList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.proformaInvoice
      }).then((res) => {
        const rows = res.rows || []
        rows.forEach((item) => {
          item.documentType = '13'
          item.documentId = item.salesOrderId
          item.documentNo = item.salesOrderNo
        })

        this.documentNoOptions = rows
      })
    },
    openDocumentNoTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateDocumentNo(row) {
      // this.$set(this.form, 'documentNo', row.documentNo)
      // this.$set(this.form, 'documentId', row.documentId)
      // this.$set(this.form, 'documentType', row.documentType)
      if (row.documentId) {
        this.buildProformaInvoiceForSalesOrder({ salesOrderId: row.documentId })
      }
    },
    buildProformaInvoiceForSalesOrder(params) {
      this.buildLoading = true
      const timer = Date.now()
      this.queryTimer = timer
      params.proformaInvoiceId = this.form.proformaInvoiceId
      buildProformaInvoiceForSalesOrder(params)
        .then((res) => {
          if (this.queryTimer !== timer) return
          this.buildLoading = false
          const data = res.data || {}
          if (data.isError === '1') {
            this.$modal.msgError(data.errorTips)
            return
          }
          const paymentSchedule = data.paymentSchedule || []
          const delNullChildren = (data) =>
            data.forEach((x) => {
              x.disabled = !x.canCreatePi
              if (x.children && x.children.length > 0) {
                delNullChildren(x.children)
              } else {
                delete x.children
              }
            })
          delNullChildren(paymentSchedule)
          const pisForm = data.proformaInvoiceSelection || {}
          pisForm.proformaInvoiceSelectionDetailList =
            pisForm.proformaInvoiceSelectionDetailList || []
          const proformaInvoicePayment = data.proformaInvoicePayment || {}
          let proformaInvoiceCustomer = data.proformaInvoiceCustomer || {}

          let proformaInvoiceEmailSetting = data.proformaInvoiceEmailSetting || {}
          if (params.paymentStageChange === '1') {
            proformaInvoiceCustomer = this.form.proformaInvoiceCustomer
            data.proformaInvoiceCustomer = this.form.proformaInvoiceCustomer
            proformaInvoiceEmailSetting = this.form.proformaInvoiceEmailSetting
            data.proformaInvoiceEmailSetting = this.form.proformaInvoiceEmailSetting
          }

          pisForm.proformaInvoiceSelectionDetailList.forEach((item) => {
            this.$set(item, 'proformaInvoiceQtyError', false)
            this.$set(item, 'ROW-ERROR', false)
          })
          if (this.form.proformaInvoiceId) {
            this.pisForm = pisForm
            this.form.proformaInvoiceSelection = pisForm
            this.piPaymentTermFrom = proformaInvoicePayment
            this.form.proformaInvoicePayment = proformaInvoicePayment
          } else {
            this.pisForm = pisForm
            this.piPaymentTermFrom = proformaInvoicePayment
            this.piBankFrom = proformaInvoiceCustomer
            this.piEmailFrom = proformaInvoiceEmailSetting
            this.form = data
          }

          setTimeout(() => {
            this.$refs.SoLineSelectionReferenceInfo?.initTableSelect()
          }, 300)
        })
        .catch(() => {
          this.buildLoading = false
        })
    },
    paymentStageChange() {
      if (this.form.documentId && this.piPaymentTermFrom.paymentPlanDetailId) {
        this.buildProformaInvoiceForSalesOrder({
          salesOrderId: this.form.documentId,
          paymentPlanDetailId: this.piPaymentTermFrom.paymentPlanDetailId,
          paymentStageChange: '1'
        })
      }
    },

    /* 版本比对 */
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
    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        proformaInvoiceNo: '',
        proformaInvoiceStatus: '',
        salesInquiryNo: '',
        customerName: '',
        country: '',
        salesPersonBy: '',
        proformaInvoiceDate: Date.now()
      }
      this.pisForm = {
        /* calculationBasis: '2',
        salesOrderNo: '502026080001',
        businessPartnerName: 'ABC Engineering Pte. Ltd.',
        incotermName: 'CIF - Cost, Insurance and Freight',
        currency: 'Singapore Dollar',
        currencySymbol: 'S$',
        proformaInvoiceSelectionDetailList: [
          {
            productName: 'Concrete Batching Plant EDMP-100',
            internalPartNo: '010102003',
            description: '',
            uom: 'ASM',
            balanceQty: 10,
            proformaInvoiceQty: 10,
            netUnitPrice: 100,
            lineTotal: 1000,
            decimalNum: 3,
            includeDecimal: '1',
            includedInScope: '1',
            proformaInvoiceQtyError: false,
            'ROW-ERROR': false
          },
          {
            productName: 'Concrete Batching Plant EDMP-30',
            internalPartNo: '010102008',
            description: '',
            uom: 'ASM',
            balanceQty: 10,
            proformaInvoiceQty: 10,
            netUnitPrice: 100,
            lineTotal: 1000,
            decimalNum: 0,
            includeDecimal: '0',
            includedInScope: '1',
            proformaInvoiceQtyError: false,
            'ROW-ERROR': false
          },
          {
            productName: 'Concrete Batching Plant EDMP-120',
            internalPartNo: '010102002',
            description: '',
            uom: 'ASM',
            balanceQty: 10,
            proformaInvoiceQty: 10,
            netUnitPrice: 100,
            lineTotal: 1000,
            decimalNum: 0,
            includeDecimal: '0',
            includedInScope: '0',
            proformaInvoiceQtyError: false,
            'ROW-ERROR': false
          },
          {
            productName: 'Concrete Batching Plant EDMP-70',
            internalPartNo: '010102007',
            description: '',
            uom: 'ASM',
            balanceQty: 10,
            proformaInvoiceQty: 10,
            netUnitPrice: 100,
            lineTotal: 1000,
            decimalNum: 0,
            includeDecimal: '0',
            includedInScope: '0',
            proformaInvoiceQtyError: false,
            'ROW-ERROR': false
          },
          {
            productName: 'Concrete Batching Plant EDMP-110',
            internalPartNo: '010102001',
            description: '',
            uom: 'SET',
            balanceQty: 10,
            proformaInvoiceQty: 10,
            netUnitPrice: 100,
            lineTotal: 1000,
            decimalNum: 0,
            includeDecimal: '0',
            includedInScope: '0',
            proformaInvoiceQtyError: false,
            'ROW-ERROR': false
          }
        ] */
      }
      this.piPaymentTermFrom = {}
      this.piBankFrom = {}
      this.piEmailFrom = {}
      this.activeName = 'basicInfo'
      this.activeNames = ['1', '2', '3', '4']
      this.subActiveName = 'soLineSelectionReference'
      this.collapseWarningForBasicInfo = false
      this.initEmailFileList = []
      this.basicUpdateProps = []
      this.basicUpdateMsgList = []
      this.updateMsg = {}
      this.isComparison = false
      this.detailListCur = []
      this.commonFileListCur = []
      this.buttonAuthMsg = {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0',
        isCanSeeUpdateMsg: '0'
      }
      this.$refs.form1?.clearValidate()
    },

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
    scrollPageToPisForm() {
      this.subActiveName = 'soLineSelectionReference'
      setTimeout(() => {
        this.scrollPageToTable()
      }, 100)
    },
    scrollPageToPiBlankForm() {
      this.subActiveName = 'customerBillingBankInfo'
      setTimeout(() => {
        this.scrollPageToTable()
      }, 100)
    },
    scrollPageToPiEmailForm() {
      this.subActiveName = 'emailSettings'
      setTimeout(() => {
        this.scrollPageToTable()
      }, 100)
    },
    errorMessage(code) {
      this.scrollPageToPisForm()
      this.$refs.SoLineSelectionReferenceInfo.errorMessage(code)
    },
    async submitForm(submitType) {
      let valid1 = false
      valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      const detailList = this.pisForm.proformaInvoiceSelectionDetailList || []
      if (this.pisForm.calculationBasis === '1') {
        if (detailList.length <= 0) {
          this.$modal.msgError(this.$t('SALES.selectOneSO'))
          this.scrollPageToPisForm()
          return
        }
        const qtyIsZero = detailList.find((item) => {
          return item.proformaInvoiceQty > 0
        })
        if (!qtyIsZero) {
          this.$modal.msgError(this.$t('SALES.qtyIsZeroErr'))
          this.scrollPageToPisForm()
          return
        }
      }
      if (this.pisForm.calculationBasis === '2') {
        const includedList = detailList.filter((x) => x.includedInScope === '1')
        if (detailList.length <= 0 || includedList.length <= 0) {
          this.$modal.msgError(this.$t('SALES.selectOneSO'))
          this.scrollPageToPisForm()
          return
        }
        const qtyReq = includedList.find((item) => {
          return !this.$resultOfBoolean(item.proformaInvoiceQty)
        })
        if (qtyReq) {
          this.errorMessage('proformaInvoiceQty')
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qty')))
          return
        }
      }

      if (
        !this.piBankFrom.billingAddressId ||
        !this.piBankFrom.bpContactPersonId ||
        !this.piBankFrom.accountId
      ) {
        this.$refs.CustomerBillingBankInfo.validForm()
        this.scrollPageToPiBlankForm()
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.customerBillingBankInfo'))
        )
        return
      }
      const validEmail = await this.$refs.EmailSettingsInfo.validEmailFrom().catch(() => false)
      if (!validEmail) {
        this.scrollPageToPiEmailForm()
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.emailSettings'))
        )
        return
      }
      const myFileIds = this.$refs.EmailSettingsInfo.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.piEmailFrom.attachmentList = myFileIds
      let param = { ...this.form }
      if (this.copyFromProformaInvoiceId) {
        param.copyFromProformaInvoiceId = this.copyFromProformaInvoiceId
      }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      if (submitType === 'approvedAndSubmit') {
        // 审批流带提交功能
        this.approvedFormData = param
        this.aplVisible = true
        return
      }
      let SuccessMsg = this.$t('SALES.piSubmitSuccess')
      let submitFn = submitProformaInvoice
      if (this.isRevisePage) {
        submitFn = reviseProformaInvoice
        SuccessMsg = this.$t('SALES.piReviseSuccess')
      }
      this.submitLoading = true
      findPreviousCanCreatePiStageList(param)
        .then((response) => {
          this.submitLoading = false
          const skipStageList = response.data || []
          if (skipStageList.length > 0) {
            return this.confirmSkipStages(skipStageList)
          }
          return this.$modal.confirm(this.$t('SALES.piSubmitConfirm'))
        })
        .then(() => {
          this.submitLoading = true
          return submitFn(param)
        })
        .then((response) => {
          this.submitLoading = false
          this.$modal.msgSuccess(SuccessMsg.replace('$1', response.msg))
          this.back()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    confirmSkipStages(skipStageList) {
      const h = this.$createElement
      const message = h('div', { class: 'pi-skip-stages-content' }, [
        h('div', { class: 'pi-skip-stages-title' }, [
          h('svg-icon', {
            props: { 'icon-class': 'filter-1' },
            style: { height: '30px', width: '30px' }
          }),
          h('span', this.$t('SALES.piIncompletePaymentStages'))
        ]),
        h('p', { class: 'pi-skip-stages-description' }, this.$t('SALES.piSkipStagesConfirm')),
        h('div', { class: 'pi-skip-stages-warning', attrs: { role: 'note' } }, [
          h('i', { class: 'el-icon-warning', attrs: { 'aria-hidden': 'true' } }),
          h('strong', this.$t('SALES.piSkipStagesWarning'))
        ]),
        h('div', { class: 'pi-skip-stages-table-wrapper' }, [
          h('table', { class: 'pi-skip-stages-table' }, [
            h('caption', this.$t('SALES.piIncompleteStages')),
            h('thead', [
              h('tr', [
                h('th', { attrs: { scope: 'col' } }, this.$t('SALES.stage')),
                h('th', { attrs: { scope: 'col' } }, this.$t('SALES.paymentStage')),
                h('th', { attrs: { scope: 'col' } }, this.$t('SALES.percentage1'))
              ])
            ]),
            h(
              'tbody',
              skipStageList.map((stage, index) =>
                h('tr', { key: index }, [
                  h('td', this.$t('SALES.stage') + ' ' + stage.stageNo),
                  h('td', stage.stageName),
                  h('td', stage.percentage + '%')
                ])
              )
            )
          ])
        ])
      ])
      return this.$confirm(message, this.$t('SALES.piIncompletePaymentStages'), {
        customClass: 'pi-skip-stages-confirm',
        confirmButtonClass: 'pi-skip-stages-continue',
        cancelButtonClass: 'pi-skip-stages-back',
        confirmButtonText: this.$t('SALES.piSkipStagesYes'),
        cancelButtonText: this.$t('SALES.piSkipStagesNo'),
        closeOnClickModal: false
      })
    },
    getFormJson() {
      const param = { ...this.form }
      // param.commonFileList = this.$refs.ProductTable && this.$refs.ProductTable.getFileIds()
      /* delete param.subTotal
      delete param.totalTaxAmount
      delete param.totalAmount */
      return JSON.stringify(param)
    },
    handleSaveDraft(isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.EmailSettingsInfo.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.piEmailFrom.attachmentList = myFileIds
      this.$refs.form1.validateField(['documentId'])
      if (!this.form.documentId) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.sourceDocNo')))
        this.collapseWarningForBasicInfo = true
        return
      }
      this.collapseWarningForBasicInfo = false

      let param = { ...this.form }
      if (this.copyFromProformaInvoiceId) {
        param.copyFromProformaInvoiceId = this.copyFromProformaInvoiceId
      }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

      const confirmMsg = this.$t('SALES.piSaveConfirm')
      const successMsg = this.$t('SALES.piSaveSuccess')
      if (isConfirm) {
        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return saveDraftProformaInvoice(param)
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
        saveDraftProformaInvoice(param)
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

    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('SALES.piWithdrawConfirm'))
        .then(() => {
          this.submitLoading = true
          return withdrawApproved({
            businessId: this.form.proformaInvoiceId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.submitLoading = false
          this.$modal.msgSuccess(
            this.$t('SALES.piWithdrawSuccess').replace('$1', this.form.proformaInvoiceNo)
          )
          this.handleUpdate()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleResend() {
      this.$modal
        .confirm(this.$t('SALES.piResendConfirm'))
        .then(() => {
          this.resendBtnLoading = true
          return sendEmail({
            proformaInvoiceId: this.form.proformaInvoiceId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('SALES.piResendSuccess').replace('$1', this.form.proformaInvoiceNo)
          )
          this.handleUpdate()
          this.resendBtnLoading = false
        })
        .catch(() => {
          this.resendBtnLoading = false
        })
    },
    /* 审批 */
    handleApproved() {
      if (!this.submitBtnShow) {
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
        `${vm.$t('SALES.piApprovedSuccess')}`.replace('$1', vm.form.proformaInvoiceNo)
      )
      this.aplVisible = false
      vm.back()
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
        `${vm.$t('SALES.piRejectedSuccess')}`.replace('$1', vm.form.proformaInvoiceNo)
      )
      this.rjVisible = false
      vm.back()
    },

    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.cancelledSuccess')}`.replace(
          '$1',
          `${this.$t('menu.proformaInvoice')} [${vm.form.proformaInvoiceNo}]`
        )
      )
      vm.back('onCancelSuccess')
    },

    handleTabsClick() {
      if (this.activeName !== 'pdfInfo') return

      this.pdfInfoUrl = ''
      const token = getToken()
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      this.previewPDFLoading = true
      const timer = Date.now()
      this.queryTime = timer
      preview(param)
        .then((res) => {
          if (timer !== this.queryTime) return
          this.previewPDFLoading = false
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
          this.previewPDFLoading = false
        })
    },
    handlePreviewPDF() {
      const token = getToken()
      let params = { ...this.form }
      params = this.$trimOfObj(JSON.parse(JSON.stringify(params)))
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
        '/sales/proformaInvoice/preview' +
        `/${this.form.proformaInvoiceId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/proformaInvoice/download' +
        `/${this.form.proformaInvoiceId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },
    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/salesManagement/reviseProformaInvoice',
        query: {
          id: this.form.proformaInvoiceId,
          timeId: Date.now()
        }
      })
    },
    actionHandle(type) {
      this.$refs.popoverRef.doClose()
      if (type === 'copyPI') {
        this.moreBtnLoading = true
        copyProformaInvoiceForSalesOrder({
          proformaInvoiceId: this.form.proformaInvoiceId
        })
          .then((res) => {
            this.moreBtnLoading = false
            const data = res.data || {}
            if (data.isError === '1') {
              this.$modal.msgError(data.errorTips)
              return
            }
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push({
              path: '/salesManagement/addProformaInvoice',
              query: {
                salesOrderId: this.form.documentId,
                copyFromProformaInvoiceId: this.form.proformaInvoiceId,
                timeId: Date.now()
              }
            })
          })
          .catch(() => {
            this.moreBtnLoading = false
          })
      }
      if (type === 'viewSO') {
        this.$router.push({
          path: '/salesManagement/editSalesOrder',
          query: {
            id: this.form.documentId,
            timeId: Date.now(),
            backType: '2'
          }
        })
      }
      if (type === 'viewPaymentStage') {
        this.$refs.paymentScheduleRef.open()
      }
      if (type === 'viewApproval') {
        this.$store.dispatch('tagsView/delView', this.$route)
        const fromSrcPath = encodeURIComponent('/salesManagement/proformaInvoice')
        const moduleKey = 'piKey'
        this.$router.push({
          path: '/bpm/history',
          query: {
            id: this.form.proformaInvoiceId,
            taskId: this.buttonAuthMsg.taskId,
            taskName: this.buttonAuthMsg.taskName,
            instanceId: this.buttonAuthMsg.processInstance,
            moduleKey: moduleKey,
            // toDo: 1, history: 2, 管理员todo: 3
            dataType: '1',
            fromSrcPath,
            timeId: Date.now()
          }
        })
      }
    }
  }
}
</script>
<style lang="scss">
.el-message-box.pi-skip-stages-confirm {
  width: 860px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  display: inline-flex;
  flex-direction: column;
  padding: 0;
  border-radius: 8px;
  color: #1b2d47;

  .el-message-box__header {
    padding: 0;
  }
  .el-message-box__title {
    display: none;
  }
  .pi-skip-stages-title {
    display: flex;
    align-items: center;
    gap: 13px;
    margin: -26px -36px 18px;
    padding: 18px 64px 18px 36px;
    border-bottom: 1px solid #d9dee5;
    color: inherit;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;

    .svg-icon {
      flex-shrink: 0;
    }
  }
  .el-message-box__headerbtn {
    z-index: 1;
    top: 20px;
    right: 24px;
    font-size: 18px;
  }
  .el-message-box__content {
    min-height: 0;
    padding: 26px 36px 24px;
    overflow-y: auto;
    color: inherit;
    font-size: 14px;
  }
  .el-message-box__message p {
    margin: 0;
    line-height: 1.5;
  }
  .pi-skip-stages-warning {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin: 20px 0 18px;
    padding: 16px 20px;
    border: 1px solid #f7dfac;
    border-radius: 7px;
    background: #fff7e6;
    line-height: 1.5;

    i {
      flex-shrink: 0;
      margin-top: 2px;
      color: #c87d00;
      font-size: 22px;
    }
  }
  .pi-skip-stages-table-wrapper {
    overflow: hidden;
    border: 1px solid #dfe3e9;
    border-radius: 7px;
  }
  .pi-skip-stages-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    text-align: left;
    line-height: 1.4;

    caption {
      caption-side: top;
      padding: 12px 16px;
      background: #e8edf3;
      text-align: left;
      color: #1b2d47;
    }
    th,
    td {
      padding: 11px 22px;
      border-top: 1px solid #dfe3e9;
      overflow-wrap: anywhere;
    }
    th {
      background: #f0f2f6;
      font-weight: normal;
    }
    th:first-child {
      width: 25%;
    }
    th:last-child {
      width: 28%;
    }
  }
  .el-message-box__btns {
    padding: 18px 24px;
    border-top: 1px solid #d9dee5;

    .el-button {
      padding: 14px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
    }
    .pi-skip-stages-back {
      color: #005bd8;
      background: transparent;
      border-color: transparent;
      &:hover,
      &:focus {
        background: #eef5ff;
      }
    }
    .pi-skip-stages-continue {
      color: #fff;
      background: #005bea;
      border-color: #005bea;
      &:hover,
      &:focus {
        background: #004fc9;
        border-color: #004fc9;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.set-tabs-style {
  &::v-deep .el-tabs__header {
    margin-bottom: 0px;
  }
  &::v-deep .el-tabs__item {
    padding: 0;
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
    border: 1px solid #c0c4cc;
    border-radius: 3px;

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
  border: 1px solid #e2e8f0;

  &::v-deep .el-collapse-item__header,
  &::v-deep .el-collapse-item__wrap {
    background-color: #f8fafc;
  }
  &::v-deep .el-collapse-item__header {
    border-bottom: 1px solid #e2e8f0;
  }
}
.pop-list-inrow {
  margin: 0;
  padding: 0;
  line-height: 32px;
  border: 1px solid #efefef;
  border-radius: 4px;

  dd {
    cursor: pointer;
    border-top: 1px solid #efefef;
    padding: 0 12px;
    margin: 0;
    text-align: center;
  }
  dd:first-of-type {
    border-top: 0;
  }
}
</style>
