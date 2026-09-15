<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="submitBtnShow" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
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
                <span class="info-item mr20" :title="form.departmentName">
                  {{ $t('SALES.salesOrganization') }} : {{ form.departmentName }}
                </span>
                <span class="info-item mr20">
                  {{ $t('ui.status') }} :
                  {{ selectDictLabel(dict.type.sales_price_status, form.salesPriceStatus) }}
                </span>
                <span v-if="form.salesPriceNo" class="info-item mr20" :title="form.salesPriceNo">
                  {{ $t('SALES.rrpCode') }} : {{ form.salesPriceNo }}
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
                    <el-form-item :label="`${$t('SALES.salesOrganization')}`" prop="departmentId">
                      <CommonSelect
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
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.sales_price_status, form.salesPriceStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.rrpCode')}`">
                      <el-input v-model="form.salesPriceNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdBy')}`">
                      <el-input v-model="form.createdBy" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.createdTime')}`">
                      <el-date-picker
                        :value="form.createdTime"
                        disabled
                        type="date"
                        :format="fmtForYmdhms"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.reason')">
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="300"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :comDisFrom="comDisFrom"
                  @scrollPageToTable="scrollPageToTable"
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

    <ApprovedDialog
      :id="form.salesPriceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.salesPriceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.salesPriceId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
    <!-- return -->
    <ReturnDialog
      :id="form.salesPriceId"
      :rj-visible="returnVisible"
      :rj-api-url="returnUrl"
      @submitSuccess="returnSubmitSuccess"
      @rjVisibleChange="returnVisibleChange"
    />

    <RevisionComparisonDlg module-key="salesPrice" ref="RevisionComparisonDlg" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import { queryUserDepartment } from '@/api/system/user'

import {
  saveSalesPrice,
  saveDraftSalesPrice,
  querySalesPriceById,
  approvedSalesPrice,
  rejectedSalesPrice,
  returnSalesQuotation,
  cancelledSalesPrice
} from '@/api/salesManagement/salesPrice'

import ProductInfo from './productInfo/productInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import ReturnDialog from './returnDialog/returnDialog.vue'

import RevisionComparisonDlg from '@/components/RevisionComparison'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
export default {
  mixins: [pageMixin],
  dicts: ['sales_price_status'],
  components: {
    ProductInfo,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    ReturnDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable
  },
  data() {
    return {
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        departmentId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      deptOptions: [],
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
      approvedUrl: approvedSalesPrice,
      rejectedUrl: rejectedSalesPrice,
      cancelledUrl: cancelledSalesPrice,

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
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['salesManagement:salesPrice:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.salesPriceId &&
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
      if (this.form.salesPriceId && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.salesPriceId && this.buttonAuthMsg.isCanSaveDraft === '1') {
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
        this.form.salesPriceId &&
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
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['salesManagement:salesPrice:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.salesPriceId &&
        this.buttonAuthMsg.isCanCancelled === '1'
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
      this.queryUserDepartment()
      querySalesPriceById({ salesPriceId: rowId }).then((res) => {
        const data = res.data || {}
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
      })
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        salesOrganizationId: undefined,
        salesOrganizationName: undefined,
        allSuperiorName: undefined,
        rrpCode: undefined,
        createdBy: this.$store.state.user.nickName,
        salesPriceProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')

      this.basicUpdateProps = []
      this.bpHistoryVersionList = []
      this.resetForm('form1')
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
      this.$set(this.form, 'salesOrganizationId', item.departmentId)
      this.$set(this.form, 'salesOrganizationName', item.departmentName)
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
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
        const tableList = this.$refs.ProductInfo.tableList || []
        const validProject = this.validConsignmentList(tableList)
        if (!validProject) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.salesPriceProductList = tableList
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('SALES.RRPSaveConfirm')
          successMsg = this.$t('SALES.RRPSaveSuccess')
          submitFn = saveDraftSalesPrice
        } else {
          confirmMsg = this.$t('SALES.RRPSubmitConfirm')
          successMsg = this.$t('SALES.RRPSubmitSuccess')
          submitFn = saveSalesPrice
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
    validConsignmentList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.productTableEmpty'))
        return valid
      }
      const pricingUom = detailList.find((item) => {
        return !this.$resultOfBoolean(item.pricingUom)
      })
      if (pricingUom) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.pricingUnit')))
        return valid
      }
      const salesPrice = detailList.find((item) => {
        return !this.$resultOfBoolean(item.salesRetailPrice)
      })
      if (salesPrice) {
        this.$refs.ProductInfo.errorMessage('salesRetailPrice')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.salesPrice')))
        return valid
      }

      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.salesPriceId)
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    dropdownVisibleChange() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.moveY = 0
      }
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
          `${this.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
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
          `${this.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
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
          `${vm.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
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
          `${this.$t('SALES.rrpCode')} [${vm.form.salesPriceNo}]`
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
<style lang="scss" scoped>
.exportHistoryPDF {
  position: absolute;
  right: 20px;
}
</style>
