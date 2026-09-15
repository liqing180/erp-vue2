<template>
  <FormPageLayoutTabs ref="FormPageLayoutRef">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm" v-if="submitBtnShow"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft" v-if="saveDraftBtnShow"
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
      <el-button type="primary" size="mini" v-if="createPOBtnShow" @click="handleCreatePO"
        >{{ $t('menu.createPO') }}
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
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.requestForQuotation1') }}
      </div>
    </template>
    <template v-slot:tabs> </template>
    <template v-slot:content>
      <div v-show="activeName === 'inquiryDetails'">
        <el-collapse v-model="activeNames">
          <div class="form-card">
            <el-collapse-item name="1">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('ui.basicInfo')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <template v-if="form.isMergePrAddress !== '1'">
                <el-form
                  ref="form1"
                  :model="form"
                  @submit.native.prevent
                  :rules="rules"
                  label-width="190px"
                  :disabled="comDisFrom"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.deliveryAddress')}`"
                        prop="receiveAddressName"
                        v-if="form.dropShipping === '1'"
                      >
                        <el-input
                          v-model="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          maxlength="200"
                          :disabled="form.rfqType === '2'"
                        ></el-input>
                      </el-form-item>

                      <el-form-item
                        :label="`${$t('PURCHASE.deliveryAddress')}`"
                        prop="receiveAddressName"
                        v-else
                      >
                        <SelectInput
                          :disabled="form.rfqType === '2'"
                          :value="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          @clear="receiveAddressClear"
                          clearable
                          @click="openReceiveAddressTable"
                          class="form-wd"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('ui.status')}`">
                        <el-input
                          :value="selectDictLabel(dict.type.p_rfq_status, form.rfqStatus)"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestForQuotationNo')}`">
                        <el-input v-model="form.rfqNo" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.dueDate')}`" prop="dueDate">
                        <el-date-picker
                          v-model="form.dueDate"
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
                      <el-form-item :label="`${$t('PURCHASE.automatedEmail')}`">
                        <el-switch
                          v-model="form.automatedEmail"
                          active-value="1"
                          inactive-value="0"
                          :disabled="comDisFrom"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                        <el-switch
                          v-model="form.dropShipping"
                          active-value="1"
                          inactive-value="0"
                          @change="dropShippingChange"
                          :disabled="form.rfqType === '2'"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.purchasePerson')}`"
                        prop="purchaseContactPersonName"
                      >
                        <SelectInput
                          :value="form.purchaseContactPersonName"
                          :title="form.purchaseContactPersonName"
                          @clear="requiredByClear"
                          clearable
                          @click="openRequiredByTable"
                          :disabled="comDisFrom"
                        />
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
                          :disabled="comDisFrom"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="`${$t('ui.attachment')}`">
                        <myUpload ref="uploadRef" :disabled="comDisFrom" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>

              <!-- 合并询价单 -->
              <template v-if="form.isMergePrAddress === '1'">
                <el-form
                  ref="form1"
                  :model="form"
                  @submit.native.prevent
                  :rules="rules"
                  label-width="190px"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.dueDate')}`" prop="dueDate">
                        <el-date-picker
                          v-model="form.dueDate"
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
                      <el-form-item :label="`${$t('ui.status')}`">
                        <el-input
                          :value="selectDictLabel(dict.type.p_rfq_status, form.rfqStatus)"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.requestForQuotationNo')}`">
                        <el-input v-model="form.rfqNo" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.purchasePerson')}`"
                        prop="purchaseContactPersonName"
                      >
                        <SelectInput
                          :value="form.purchaseContactPersonName"
                          :title="form.purchaseContactPersonName"
                          @clear="requiredByClear"
                          clearable
                          @click="openRequiredByTable"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                        <el-switch
                          v-model="form.dropShipping"
                          active-value="1"
                          inactive-value="0"
                          @change="dropShippingChange"
                          :disabled="comDisFrom"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="`${$t('PURCHASE.automatedEmail')}`">
                        <el-switch
                          v-model="form.automatedEmail"
                          active-value="1"
                          inactive-value="0"
                        ></el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('PURCHASE.deliveryAddress')}`"
                        prop="receiveAddressName"
                        v-if="form.dropShipping === '1'"
                      >
                        <!-- <el-input
                          v-model="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          maxlength="200"
                        ></el-input> -->
                        <el-autocomplete
                          v-model="form.receiveAddressName"
                          :fetch-suggestions="querySearch"
                          placeholder=""
                          @select="receiveAddressNameChange"
                          :maxlength="200"
                          style="width: 100%"
                          clearable
                        ></el-autocomplete>
                      </el-form-item>

                      <el-form-item
                        :label="`${$t('PURCHASE.deliveryAddress')}`"
                        prop="receiveAddressName"
                        v-else
                      >
                        <SelectInput
                          :value="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          @clear="receiveAddressClear"
                          clearable
                          @click="openReceiveAddressTable"
                          class="form-wd"
                          :disabled="comDisFrom"
                        />
                      </el-form-item>
                    </el-col>

                    <template v-if="form.dropShipping === '1'">
                      <el-col :span="8">
                        <el-form-item :label="`${$t('PURCHASE.consignee')}`" prop="requestedBy">
                          <div class="input-switch-box">
                            <div class="con-left">
                              <CommonSelect
                                :id="form.requestedId"
                                :label="form.requestedBy"
                                :title="form.requestedBy"
                                idKey="requestedId"
                                labelKey="requestedBy"
                                :options="requestedList"
                                @change="contactPersonChange"
                              />
                            </div>
                            <div class="con-right">
                              <svg-icon
                                icon-class="add"
                                style="height: 25px; width: 25px"
                                @click="openAddContactPersonDlg"
                              ></svg-icon>
                            </div>
                          </div>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                          :label="`${$t('PURCHASE.requestedEmail')}`"
                          prop="requestedEmail"
                        >
                          <el-input
                            v-model="form.requestedEmail"
                            :title="form.requestedEmail"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                          :label="`${$t('PURCHASE.requestedMobilePhone')}`"
                          prop="requestedMobilePhone"
                          ref="mobileNoRef"
                        >
                          <el-input
                            v-model="form.requestedMobilePhone"
                            :title="form.requestedMobilePhone"
                            disabled
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" v-if="form.isSalesDropShipping !== '1'">
                        <el-form-item
                          :label="`${$t('PURCHASE.projectCode')}`"
                          prop="costProjectCode"
                          :rules="[
                            {
                              required: false,
                              message: $t('ui.reqMsg'),
                              trigger: ['change']
                            }
                          ]"
                        >
                          <SelectInput
                            :value="form.costProjectCode"
                            :title="form.costProjectCode"
                            @clear="costProjectNameClear"
                            clearable
                            @click="openCostProjectNameTable"
                            class="form-wd"
                          />
                        </el-form-item>
                      </el-col>
                    </template>
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

                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="`${$t('ui.attachment')}`">
                        <myUpload
                          ref="uploadRef"
                          :allFileSize="30"
                          :limit="999999"
                          :disabled="false"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.supplier')"
                :warning="collapseWarningForVendor"
              >
              </FormCollapseItemTitle>
              <div>
                <SupplierTable
                  ref="SupplierTable"
                  :rfqVendorList="initRfqVendorList"
                  :productIdList="productIdList"
                  :reqInquirySupplierQuantity="form.inquirySupplierQuantity"
                  @updateTable="updateSupplierTable"
                  @handlePdfRow="handlePdfRow"
                  :comDisFrom="comDisFrom"
                />
                <!-- <SupplierTableCopy
                  ref="SupplierTableCopy"
                  :rfqVendorList="initRfqVendorList"
                  :productIdList="productIdList"
                  @updateTable="updateSupplierTable"
                  @changeSupplierTable="changeSupplierTable"
                  @handlePdfRow="handlePdfRow"
                  @resendBPSuccess="resendBPSuccess"
                  :comDisFrom="comDisFrom"
                  :submitBtnShow="submitBtnShow"
                  :form="form"
                  :curClickProductRow="curClickProductRow"
                  :formData="form"
                /> -->

                <!-- <el-form
                  ref="form2"
                  :model="form"
                  @submit.native.prevent
                  :rules="rules"
                  label-width="190px"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('ui.remarks')" prop="reason">
                        <MyInput
                          type="textarea"
                          v-model="form.reason"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          :maxlength="200"
                          :disabled="comDisFrom"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form> -->
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" ref="collapseScrollPage">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :rfqProductList="initRfqDetailList"
                  @updateTable="updateProductTable"
                  @clearSuppliersList="clearSuppliersList"
                  :linkPR="form.rfqType === '2' || form.rfqType === '3' || form.rfqType === '4'"
                  :comDisFrom="comDisFrom"
                  @rowClick="productTableRowClick"
                  :curClickProductRow="curClickProductRow"
                  :rfqVendorList="rfqVendorList"
                  :allUomList="allUomList"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-show="(form.operationLogList || []).length > 0">
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
      <div v-if="activeName === 'summaryDetails'">
        <SummaryDetails
          :form="form"
          :rfqDetailList="rfqDetailList"
          :rfqVendorList="rfqVendorList"
        />
      </div>
    </template>
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.rfqId || form.rfqDetailId"
      :taskId="form.taskId"
      fromType="1"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <ApprovedDialog
      :id="form.rfqId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.rfqId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />

    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />
    <selectCostProjectTable
      ref="selectCostProjectTable"
      :departmentId="form.departmentId"
      @update="updateCostProjectName"
    />
    <addContactPersonDlg ref="addContactPersonDlg" @update="contactPersonChange" />

    <createPODlg ref="createPODlg" />
    <createdPOConfirm ref="createdPOConfirm" @onSuccess="createdPOConfirmSuccess" />
  </FormPageLayoutTabs>
</template>

<script>
import { queryIncotermList } from '@/api/common/common'
import {
  queryRFQById,
  cancelledRFQ,
  approvedRFQ,
  rejectedRFQ,
  withdrawRFQ,
  preview,
  saveRFQ,
  saveDraftRFQ,
  checkProductIsAlreadyRFQ,
  withdrawApproved,
  queryUnapprovedAdhocProductNameList
} from '@/api/purchaseManagement/requestForQuotation'
import { queryAllUomList } from '@/api/system/uom'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'

import ProductTable from '@/views/purchaseManagement/requestForQuotation/productTable.vue'
import SupplierTable from '@/views/purchaseManagement/requestForQuotation/supplierTable.vue'
// import SupplierTableCopy from '@/views/purchaseManagement/requestForQuotation/supplierTableCopy.vue'

import SummaryDetails from './summaryDetails.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import selectRequiredByTable from '@/views/purchaseManagement/requestForQuotation/components/selectRequiredByTable.vue'
import addContactPersonDlg from './components/addContactPersonDlg.vue'
import selectCostProjectTable from '@/views/purchaseManagement/purchaseRequisition/components/selectCostProjectTable.vue'
import createPODlg from './enterQuote.vue'
import createdPOConfirm from '@/views/purchaseManagement/requestForQuotation/createdPOConfirm.vue'

import { getToken } from '@/utils/auth'

export default {
  dicts: ['p_rfq_status'],
  mixins: [pageMixin],
  components: {
    selectPortTable,
    selectWarehouseTable,
    FormPageLayoutTabs,
    ProductTable,
    SupplierTable,
    SummaryDetails,
    FormCancelDialog,
    SystemOperationLogTable,
    ApprovedDialog,
    RejectDialog,
    selectRequiredByTable,
    addContactPersonDlg,
    selectCostProjectTable,
    createPODlg,
    createdPOConfirm
    // SupplierTableCopy
  },
  data() {
    const vm = this
    return {
      saveKey: '38',
      savePath: 'purchaseMTable',
      activeName: 'inquiryDetails',
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {
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
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        reason: [
          {
            required: false,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        dueDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseContactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.requiredBy')),
            trigger: ['change']
          }
        ],
        requestedBy: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        requestedEmail: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        requestedMobilePhone: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      incotermOptions: [],
      /* 表格部分 */
      initRfqDetailList: [],
      rfqDetailList: [],
      curClickProductRow: {
        productId: undefined
      },
      collapseWarningForProductInfo: false,
      // 供应商数据, 编辑页面ByID成功后赋值一次即可,赋值后列表将被重置成赋值的列表
      initRfqVendorList: [],
      rfqVendorList: [],
      collapseWarningForVendor: false,

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanCancelled: '0',
        isCanUpdate: '0',
        isCanWithdraw: '0'
      },
      cancelledUrl: cancelledRFQ,
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedRFQ,
      rejectedUrl: rejectedRFQ,
      selectIdList: [],
      allUomList: [],
      requestedList: []
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
    rfqDetailId: {
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
        this.$set(this.curClickProductRow, 'productId', undefined)
        this.handleUpdate()
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
    productIdList() {
      return this.rfqDetailList.map((row) => row.productId)
    },
    otherSuppliersAuth() {
      return this.checkPermi(['requestForQuotation:pendInquiry:otherSuppliers'])
    },
    pendInquiryCancelAuth() {
      return this.checkPermi(['requestForQuotation:pendInquiry:cancel'])
    },
    pendQuoteCancelAuth() {
      return this.checkPermi(['requestForQuotation:pendQuote:cancel'])
    },
    cancelBtnShow() {
      let show = false
      if (this.buttonAuthMsg.isCanCancelled === '1') {
        if (this.form.rfqId && this.pendQuoteCancelAuth) {
          show = true
        } else if (this.form.rfqDetailId && this.pendInquiryCancelAuth) {
          show = true
        }
      }
      return show
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:withdraw'])) {
        return false
      }
      let show = false
      if (this.form.rfqId && this.buttonAuthMsg.isCanWithdraw === '1') {
        show = true
      }
      return show
    },
    createPOBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:createPO'])) {
        return false
      }
      let show = false
      if (this.form.rfqId && this.form.isCanCreatePO === '1') {
        show = true
      }
      return show
    },

    submitBtnShow() {
      if (!this.checkPermi(['requestForQuotation:open:edit'])) {
        return false
      }
      return this.buttonAuthMsg.isCanSubmit === '1'
    },
    saveDraftBtnShow() {
      if (!this.checkPermi(['requestForQuotation:open:edit'])) {
        return false
      }
      return this.buttonAuthMsg.isCanSaveDraft === '1'
    },

    approvedBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:approval'])) {
        return false
      }
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (this.dataType === '1' && this.buttonAuthMsg.isCanApproved === '1') {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:reject'])) {
        return false
      }
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (this.dataType === '1' && this.buttonAuthMsg.isCanRejected === '1') {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    editAuth() {
      return this.checkPermi(['requestForQuotation:open:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (this.buttonAuthMsg.isCanUpdate === '1' || this.buttonAuthMsg.isCanSaveDraft === '1') {
        dis = false
      }
      return dis
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
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    contactPersonChange(row) {
      // this.$set(this.form, 'requestedId', row.requestedId)
      this.$set(this.form, 'requestedBy', row.requestedBy)
      this.$set(this.form, 'requestedMobileCode', row.requestedMobileCode)
      this.$set(this.form, 'requestedMobileNum', row.requestedMobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.requestedMobilePhone)
      this.$set(this.form, 'requestedEmail', row.requestedEmail)
    },
    openAddContactPersonDlg() {
      this.$refs.addContactPersonDlg.handleEdit()
    },
    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen()
    },
    costProjectNameClear() {
      this.$set(this.form, 'costProjectName', undefined)
      this.$set(this.form, 'costProjectId', undefined)
      this.$set(this.form, 'costProjectCode', undefined)
    },
    updateCostProjectName(row) {
      const { costProjectName, costProjectId, costProjectCode } = row
      this.$set(this.form, 'costProjectName', costProjectName)
      this.$set(this.form, 'costProjectId', costProjectId)
      this.$set(this.form, 'costProjectCode', costProjectCode)
    },
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    // 清空pic
    requiredByClear() {
      this.$set(this.form, 'purchaseContactPersonName', undefined)
      this.$set(this.form, 'purchaseContactPersonId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'purchaseContactPersonName', nickName)
      this.$set(this.form, 'purchaseContactPersonId', userId)
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(vm.$t('PURCHASE.rfqCancelledSuccess'))
      vm.back('onCancelSuccess')
    },
    querySearch(queryString, cb) {
      const vm = this
      const brandList = (vm.form.dropReceiveAddressList || []).map((x) => {
        return {
          value: x
        }
      })

      let results
      if (queryString) {
        results = brandList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = brandList
      }
      cb(results)
    },
    receiveAddressNameChange(val) {
      this.form.receiveAddressName = val.value
    },
    handleUpdate() {
      this.reset()
      this.queryAllUomList()

      queryRFQById({
        rfqId: this.rowId,
        rfqDetailId: this.rfqDetailId
      }).then((res) => {
        const data = res.data || {}
        this.form = { ...data }
        const initRfqDetailList = data.rfqDetailList || []
        initRfqDetailList.forEach((item, index) => {
          if (item.externalPartNoListJson) {
            this.$set(item, 'externalPartNoListJson', JSON.parse(item.externalPartNoListJson))
          } else {
            if (item.externalPartNoList && item.externalPartNoList.length > 0) {
              this.$set(item, 'externalPartNoListJson', item.externalPartNoList)
            } else {
              this.$set(item, 'externalPartNoListJson', [])
            }
          }
        })
        this.initRfqDetailList = initRfqDetailList

        this.requestedList = data.requestedList || []
        const list = data.rfqVendorList || []

        let timer = Date.now()
        list.forEach((item) => {
          timer++
          item.rowTimeId = timer
          if (item.serviceSurchargeList) {
            item.serviceSurchargeList.forEach((child) => {
              timer++
              child.rowTimeId = timer
            })
          }
        })
        this.initRfqVendorList = list

        this.buttonAuthMsg = data.buttonAuthMsg || {}

        setTimeout(() => {
          if (this.$refs.uploadRef) {
            this.$refs.uploadRef.initFileList(data.commonFileList)
          }
        }, 300)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
        if (!this.form.rfqStatus || this.form.rfqStatus === '7') {
          this.queryUnapprovedAdhocProductNameList()
        }
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

      const productIdList = this.initRfqDetailList
        .filter((x) => x.productId)
        .map((k) => k.productId)
      // 筛选 没有productId 并且 isAdhocEntry === 1 的临时产品
      const isAdhocEntryProductList = this.initRfqDetailList.filter(
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
    /* 表格部分Start */
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    reset() {
      this.form = {
        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        remarks: '',
        priceIncludingTax: '0',
        automatedEmail: '0'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForVendor = false
      this.initRfqDetailList = []
      this.rfqDetailList = []
      this.initRfqVendorList = []
      this.rfqVendorList = []
      this.activeName = 'inquiryDetails'
      this.activeNames = ['1', '2', '3', '4']
      this.selectIdList = []
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
    },
    // 取消按钮
    back(type) {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    },
    dropShippingChange() {
      this.receiveAddressClear()
    },
    handleClick() {},
    /* 表单部分Start */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(value) {
      // const oldType = this.form.incotermAddressType
      const item = this.incotermOptions.find((item) => item.incotermId === value) || {}
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      // if (oldType !== item.incotermAddressType) {
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'addressForWarehouse', undefined)
      // }
    },
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2' || this.form.incotermAddressType === '3') {
        this.$refs.selectWarehouseTable.handleOpen()
      }
    },
    // 清空pic
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'addressForWarehouse', undefined)
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      this.$set(this.form, 'addressForWarehouse', row)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
    },
    /* 表单部分End */
    handlePdfRow(row) {
      let param = { ...this.form }
      const rfqDetailList = this.$refs.ProductTable.getList()
      param.rfqDetailList = rfqDetailList
      // param.rfqDetailList = this.rfqDetailList
      param.rfqVendorList = [row]
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      // 外部编号数组转JSON
      param.rfqDetailList.forEach((x) => {
        if (x.externalPartNoListJson) {
          this.$set(x, 'externalPartNo', x.externalPartNoListJson.join(','))
          x.externalPartNoListJson = JSON.stringify(x.externalPartNoListJson)
        } else {
          this.$set(x, 'externalPartNo', undefined)
        }
      })
      const token = getToken()

      if (row.rfqId && this.form.rfqStatus !== '7') {
        const myUrl =
          process.env.VUE_APP_BASE_API +
          '/purchase/requestForQuotation/preview' +
          `/${row.rfqId}/${row.rfqVendorId}` +
          '?token=' +
          `${token}`
        window.open(myUrl, 'print')
      } else {
        this.$set(row, 'pdfLoading', true)

        preview(param)
          .then((res) => {
            this.$set(row, 'pdfLoading', false)
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
            this.$set(row, 'pdfLoading', false)
          })
      }
    },
    resendBPSuccess() {
      this.back()
    },
    /* 表格部分Start */
    productTableRowClick(row) {
      if (row.productId === this.curClickProductRow.productId) {
        this.$set(this.curClickProductRow, 'productId', undefined)
      } else {
        // this.$set(this.curClickProductRow, 'productId', row.productId)
      }
    },
    updateProductTable(list, type) {
      if (this.form.rfqStatus !== '7') {
        this.rfqDetailList = list || []
        this.$nextTick(() => {
          this.$refs.ProductTable && this.$refs.ProductTable.initList(list || [])
        })
        return
      }
      this.checkProductIsAlreadyRFQ(list, type)
    },
    checkProductIsAlreadyRFQ(list, type) {
      const that = this
      if (list.length <= 0) {
        return
      }
      const arr = JSON.parse(JSON.stringify(list))
      arr.forEach((x) => {
        if (x.externalPartNoListJson) {
          this.$set(x, 'externalPartNo', x.externalPartNoListJson.join(','))
          x.externalPartNoListJson = JSON.stringify(x.externalPartNoListJson)
        } else {
          this.$set(x, 'externalPartNo', undefined)
        }
      })
      checkProductIsAlreadyRFQ({ rfqDetailList: arr }).then((res) => {
        const { checkResult, rfqDetailList, tipsMsg } = res.data
        this.rfqDetailList = rfqDetailList || []
        this.rfqDetailList.forEach((item, index) => {
          if (item.externalPartNoListJson) {
            this.$set(item, 'externalPartNoListJson', JSON.parse(item.externalPartNoListJson))
          } else {
            if (item.externalPartNoList) {
              this.$set(item, 'externalPartNoListJson', item.externalPartNoList)
            }
          }
        })
        this.$refs.ProductTable.initList(this.rfqDetailList || [])
        // 去掉重复询价提示语 checkResult === '0'
        if (checkResult === '99999999999999' && type === 'update') {
          const h = that.$createElement
          const contents = []
          contents.push(
            h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.duplicateRFQNotification'))
          )
          contents.push(h('div', { style: 'font-size: 14px' }, tipsMsg))
          contents.push(
            h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.continuedOperations'))
          )
          const content = h('p', null, contents)
          const confirmButtonText = this.$t('uiBtn.confirm')
          this.$confirm(content, '', {
            confirmButtonText,
            showCancelButton: false,
            type: 'warning',
            customClass: 'custom-class'
          })
            .then(() => {})
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },

    updateSupplierTable(list, inquirySupplierQuantity) {
      this.rfqVendorList = list || []
      this.$set(
        this.form,
        'inquirySupplierQuantity',
        inquirySupplierQuantity || this.form.inquirySupplierQuantity
      )
    },
    changeSupplierTable(list = []) {
      this.selectIdList = list.map((x) => x.rfqVendorId) || []
    },
    clearSuppliersList() {
      if (!this.otherSuppliersAuth) {
        this.initRfqVendorList = []
        this.rfqVendorList = []
      }
    },
    handleCreatePO() {
      console.log('转po')
      // this.$refs.createPODlg.open()
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:add'])) {
        this.$modal.msgError(this.$t('ui.notAuth'))
        return
      }
      const fromSrcPath = encodeURIComponent('/purchaseManagement/editRequestForQuotation')
      const purchaseQuotationList = this.form.purchaseQuotationList || []
      if (purchaseQuotationList.length === 1) {
        this.$router.push({
          path: '/purchaseManagement/addPurchaseOrder',
          query: {
            purchaseQuotationId: purchaseQuotationList[0].purchaseQuotationId,
            timeId: Date.now(),
            fromSrcPath
          }
        })
      } else if (purchaseQuotationList.length > 1) {
        this.$refs.createdPOConfirm.handleOpen(purchaseQuotationList)
      }
    },
    createdPOConfirmSuccess(purchaseQuotationId) {
      const fromSrcPath = encodeURIComponent('/purchaseManagement/editRequestForQuotation')
      this.$router.push({
        path: '/purchaseManagement/addPurchaseOrder',
        query: {
          purchaseQuotationId: purchaseQuotationId,
          timeId: Date.now(),
          fromSrcPath
        }
      })
      this.handleUpdate()
    },
    /* 表格部分End */
    handleWithdraw() {
      const vm = this
      const confirm = vm.$t('PURCHASE.rfqWithdrawConfirm').replace('$1', this.form.rfqNo)
      this.$modal.confirm(confirm).then(() => {
        withdrawRFQ({
          rfqId: vm.form.rfqId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(vm.$t('PURCHASE.rfqWithdrawSuccess').replace('$1', this.form.rfqNo))
            this.back()
          }
        })
      })
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.rfqId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
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
      vm.$message.success(`${vm.$t('PURCHASE.rfqApprovedSuccess')}`.replace('$1', vm.form.rfqNo))
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
      vm.$message.success(`${vm.$t('PURCHASE.rfqRejectedSuccess')}`.replace('$1', vm.form.rfqNo))
      this.rjVisible = false
      vm.back('onRejectedSuccess')
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
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
      }
      if (valid1) {
        let param = { ...this.form }
        const rfqVendorList = this.$refs.SupplierTable.getList()
        if (rfqVendorList.length <= 0) {
          this.$modal.msgError(this.$t('PURCHASE.rfqVendorTableEmpty'))
          this.collapseWarningForVendor = true
          return
        }
        if (rfqVendorList.length < param.inquirySupplierQuantity) {
          this.$modal.msgError(
            this.$t('PURCHASE.leastSuppliers').replace('$1', param.inquirySupplierQuantity)
          )
          this.collapseWarningForVendor = true
          return
        }
        const contactPersonNameReq = rfqVendorList.find((item) => {
          return !this.$resultOfBoolean(item.contactPersonName)
        })
        if (contactPersonNameReq) {
          this.$refs.SupplierTable.errorMessage('contactPersonName')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.contactPerson'))
          )
          this.collapseWarningForVendor = true
          return
        }
        this.collapseWarningForVendor = false

        const detailList = this.$refs.ProductTable.getList()
        if (detailList.length <= 0) {
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          this.collapseWarningForProductInfo = true
          return
        }

        const productNameReq = detailList.find((item) => {
          return !(item.productName || '').trim()
        })
        if (productNameReq) {
          this.$refs.ProductTable.errorMessage('productName')
          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        const qtyReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.purchaseQty)
        })
        if (qtyReq) {
          this.$refs.ProductTable.errorMessage('purchaseQty')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        const purchaseUomReq = detailList.find((item) => {
          return !item.purchaseUom
        })
        if (purchaseUomReq) {
          this.$refs.ProductTable.errorMessage('purchaseUom')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseUOM'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        const deliveryDateReq = detailList.find((item) => {
          return !this.$resultOfBoolean(item.deliveryDate)
        })
        if (deliveryDateReq) {
          this.$refs.ProductTable.errorMessage('deliveryDate')

          this.$modal.msgError(
            this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.requestedReceiptDate'))
          )
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param.rfqDetailList = detailList

        param.rfqVendorList = rfqVendorList
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // 外部编号数组转JSON
        param.rfqDetailList.forEach((x) => {
          if (x.externalPartNoListJson) {
            this.$set(x, 'externalPartNo', x.externalPartNoListJson.join(','))
            x.externalPartNoListJson = JSON.stringify(x.externalPartNoListJson)
          } else {
            this.$set(x, 'externalPartNo', undefined)
          }
        })
        param.commonFileList = myFileIds
        // const confirmMsg = this.$t('PURCHASE.rfqSubmitConfirm')
        // const successMsg = this.$t('PURCHASE.rfqSubmitSuccess')
        // const submitFn = saveRFQ
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.rfqSaveConfirm')
          successMsg = this.$t('PURCHASE.rfqSaveSuccess')
          submitFn = saveDraftRFQ
        } else {
          confirmMsg = this.$t('PURCHASE.rfqSubmitConfirm')
          successMsg = this.$t('PURCHASE.rfqSubmitSuccess')
          submitFn = saveRFQ
        }
        /* if (param.rfqDetailList.some((x) => x.checkResult === '0')) {
          confirmMsg = this.$t('PURCHASE.whetherToContinue')
        } */
        this.$modal
          .confirm(confirmMsg)
          .then(() => {
            this.submitLoading = true
            return submitFn(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
            this.back()
            this.submitLoading = false
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    handleSaveDraft() {
      this.submitForm('save')
    }
  }
}
</script>
<style lang="scss"></style>
