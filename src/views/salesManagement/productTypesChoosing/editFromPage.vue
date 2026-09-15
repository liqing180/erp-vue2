<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="submitBtnShow" @click="submitForm"
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
                  {{ $t('SALES.customerName') }} : {{ form.businessPartnerName }}
                </span>
                <span v-if="form.warehouseName" class="info-item mr20" :title="form.warehouseName">
                  {{ $t('SALES.warehouseName') }} : {{ form.warehouseName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.status') }} :
                  {{
                    selectDictLabel(
                      dict.type.sales_goods_return_status,
                      form.salesGoodsReturnStatus
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
                    <el-form-item :label="`${$t('SALES.salesOrderNo')}`" prop="salesOrderNo">
                      <el-input
                        v-model="form.salesOrderNo"
                        :title="form.salesOrderNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.warehouseName')}`" prop="warehouseName">
                      <el-input
                        v-model="form.warehouseName"
                        :title="form.warehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesGoodsReturnNo')}`">
                      <el-input v-model="form.salesGoodsReturnNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.salesPerson')}`">
                      <el-input
                        v-model="form.salesPersonBy"
                        :title="form.salesPersonBy"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`">
                      <el-input
                        v-model="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.sales_goods_return_status,
                            form.salesGoodsReturnStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.dateSold')}`"
                      :class="[isModified('soldDate')]"
                    >
                      <el-date-picker
                        v-model="form.soldDate"
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
                    <el-form-item
                      :label="`${$t('SALES.dateRequired')}`"
                      prop="requiredDate"
                      :class="[isModified('requiredDate')]"
                    >
                      <el-date-picker
                        v-model="form.requiredDate"
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
                    <el-form-item
                      :label="`${$t('SALES.yourRef')}`"
                      :class="[isModified('yourRef')]"
                    >
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
                    <el-form-item
                      :label="`${$t('ui.pic')}`"
                      prop="picUserBy"
                      :class="[isModified('picUserBy')]"
                    >
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
                    <el-form-item
                      :label="`${$t('SALES.dueDate')}`"
                      prop="dueDate"
                      :class="[isModified('dueDate')]"
                    >
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
                    <el-form-item :label="`${$t('SALES.ourRef')}`" :class="[isModified('ourRef')]">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
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
          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.returnInfo')"
                :warning="collapseWarningForShippingInfo"
              >
                <span
                  v-if="form.warehouseLabel"
                  class="info-item mr20"
                  :title="form.warehouseLabel"
                >
                  {{ $t('ui.address') }} : {{ form.warehouseLabel }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.address')}`">
                      <el-input
                        :value="form.warehouseLabel"
                        :title="form.warehouseLabel"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.warehouseAddressShowStr"
                        :title="form.warehouseAddressShowStr"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.contactPerson')}`">
                      <el-input
                        v-model="form.warehouseUserName"
                        :title="form.warehouseUserName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input
                        v-model="form.warehouseUserEmail"
                        :title="form.warehouseUserEmail"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.warehouseUserMobilePhone"
                        :title="form.warehouseUserMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
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

    <ApprovedDialog
      :id="form.salesGoodsReturnId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.salesGoodsReturnId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesGoodsReturnId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import {
  saveSalesGoodsReturn,
  querySalesGoodsReturnById,
  approvedSalesGoodsReturn,
  rejectedSalesGoodsReturn,
  cancelledSalesGoodsReturn,
  preview
} from '@/api/salesManagement/salesGoodsReturn'
import { getToken } from '@/utils/auth'

import selectPicTable from './components/selectPicTable.vue'
import ProductInfo from './productInfo/productInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import RevisionComparisonDlg from '@/views/salesManagement/productTypesChoosing/revisionComparisonDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  mixins: [pageMixin],
  dicts: ['sales_goods_return_status'],
  components: {
    selectPicTable,
    ProductInfo,
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
        salesGoodsReturnProductList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        salesOrderNo: [
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
        /* requiredDate: [
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
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
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
      approvedUrl: approvedSalesGoodsReturn,
      rejectedUrl: rejectedSalesGoodsReturn,
      cancelledUrl: cancelledSalesGoodsReturn,

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
      return this.checkPermi(['salesManagement:salesGoodsReturn:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesGoodsReturnId &&
        [this.buttonAuthMsg.isCanUpdate].includes('1')
      ) {
        dis = false
      }
      return dis
    },
    submitBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesGoodsReturnId && this.buttonAuthMsg.isCanUpdate === '1') {
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
        this.form.salesGoodsReturnId &&
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
        this.form.salesGoodsReturnId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesGoodsReturn:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesGoodsReturnId &&
        this.buttonAuthMsg.isCanCancelled === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['salesManagement:salesGoodsReturn:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesGoodsReturnId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['salesManagement:salesGoodsReturn:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesGoodsReturnId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['salesManagement:salesGoodsReturn:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesGoodsReturnId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
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
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      querySalesGoodsReturnById({ salesGoodsReturnId: rowId }).then((res) => {
        const data = res.data || {}
        data.salesGoodsReturnProductList = data.salesGoodsReturnProductList || []
        this.initCommonFileList = data.commonFileList || []

        this.form = data

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
      })
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        salesOrderNo: undefined,
        warehouseName: undefined,
        warehouseLabel: undefined,
        warehouseUserName: undefined,
        warehouseAddressShowStr: undefined,
        warehouseUserMobileCode: undefined,
        warehouseUserMobileNum: undefined,
        warehouseUserMobilePhone: undefined,
        warehouseUserEmail: undefined,
        picUserBy: this.$store.state.user.nickName,
        picUserId: this.$store.state.user.userId,
        salesGoodsReturnNo: undefined,
        salesPersonBy: undefined,
        salesPersonId: undefined,
        businessPartnerName: undefined,
        soldDate: undefined,
        requiredDate: undefined,
        dueDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        automatedEmail: '1',

        salesGoodsReturnProductList: []
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

      if (valid1) {
        let param = { ...this.form }
        const validProduct = this.validProductList(param.salesGoodsReturnProductList)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        const confirmMsg = this.$t('SALES.SGRSubmitConfirm')
        const successMsg = this.$t('SALES.SGRSubmitSuccess')
        const submitFn = saveSalesGoodsReturn

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
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qtyToReturn)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qtyToReturn')))
        return valid
      }

      const returnedReasonReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.returnedReason)
      })
      if (returnedReasonReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.returnReason'))
        )
        return valid
      }

      const rmaTypeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.rmaType)
      })
      if (rmaTypeReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.RMAType')))
        return valid
      }

      const scheduledReceivedDateReq = detailList.find((item) => {
        return (
          ['1', '3', '4'].includes(item.rmaType) &&
          !this.$resultOfBoolean(item.scheduledReceivedDate)
        )
      })
      if (scheduledReceivedDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.estimatedReceiptDate'))
        )
        return valid
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
        '/sales/salesGoodsReturn/preview' +
        `/${this.form.salesGoodsReturnId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/sales/salesGoodsReturn/download' +
        `/${this.form.salesGoodsReturnId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
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
          `${this.$t('SALES.salesReturnOrder')} [${vm.form.salesGoodsReturnNo}]`
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
          `${this.$t('SALES.salesReturnOrder')} [${vm.form.salesGoodsReturnNo}]`
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
          `${this.$t('SALES.salesReturnOrder')} [${vm.form.salesGoodsReturnNo}]`
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
