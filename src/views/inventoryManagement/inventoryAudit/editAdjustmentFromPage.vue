<template>
  <FormPageLayoutTabs v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="startAuditAuth" @click="handleStartAudit"
        >{{ $t('menu.startAudit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="endAuditAuth" @click="handleEndAudit"
        >{{ $t('menu.endAudit') }}
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

      <el-button
        type="primary"
        size="mini"
        v-if="buttonAuthMsg.isCanSeeUpdateMsg === '1'"
        @click="revisionComparison"
        >{{ $t('uiBtn.revisionComparison') }}</el-button
      >
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.inventoryAdjustment') }}
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
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="true"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.warehouseName')}`" required>
                      <el-input
                        v-model="form.warehouseName"
                        :title="form.warehouseName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('INVENTORY.inventoryAuditNo')}`">
                      <el-input v-model="form.inventoryAuditNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.inventory_audit_status,
                            form.inventoryAuditStatus
                          )
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
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('INVENTORY.auditDetails')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <AdjustmentProductTable
                  ref="AdjustmentProductTable"
                  :comDisFrom="comDisFrom"
                  :formData="form"
                  :modifyHighlight="modifyHighlight"
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

    <ApprovedDialog
      :id="form.inventoryAuditId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.inventoryAuditId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.inventoryAuditId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
  </FormPageLayoutTabs>
</template>

<script>
import {
  saveInventoryAudit,
  queryInventoryAuditByIdForERP,
  approvedInventoryAudit,
  rejectedInventoryAudit,
  cancelledInventoryAudit,
  startAudit,
  withdrawApproved,
  endAudit
} from '@/api/inventoryManagement/inventoryAudit'

import pageMixin from '@/mixins/tableMinx'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'
import AdjustmentProductTable from './productInfo/AdjustmentProductTable.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'

import RevisionComparisonDlg from './revisionComparisonDlg.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import locale from '@/views/inventoryManagement/lang/index'
export default {
  dicts: ['inventory_audit_status', 'inventory_audit_method'],
  mixins: [pageMixin],
  components: {
    FormPageLayoutTabs,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    RevisionComparisonDlg,
    SystemOperationLogTable,
    AdjustmentProductTable
  },
  data() {
    return {
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        productList: []
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0'
      },
      rules: {
        inventoryAuditMethod: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        startEndTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      validityDaysPickerOptions: {
        /* disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        } */
      },
      warehouseStructureOptions: [],
      productCategoryOptions: [],

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedInventoryAudit,
      rejectedUrl: rejectedInventoryAudit,
      cancelledUrl: cancelledInventoryAudit,

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
      return this.checkPermi(['inventoryManagement:inventoryAudit:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.inventoryAuditId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    startAuditAuth() {
      let show = false
      if (
        this.dataType === '1' &&
        this.form.inventoryAuditId &&
        this.buttonAuthMsg.isCanStartAudit === '1'
      ) {
        show = true
      }
      return show
    },
    endAuditAuth() {
      let show = false
      if (
        this.dataType === '1' &&
        this.form.inventoryAuditId &&
        this.buttonAuthMsg.isCanEndAudit === '1'
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
        this.form.inventoryAuditId &&
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
        this.form.inventoryAuditId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['inventoryManagement:inventoryAudit:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.form.inventoryAuditId && this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['inventoryManagement:inventoryAudit:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.inventoryAuditId &&
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
  methods: {
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.inventoryAuditId,
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
      this.getById()
    },
    getById() {
      queryInventoryAuditByIdForERP({
        inventoryAuditId: this.rowId
      }).then((res) => {
        const data = res.data || {}
        data.productList = data.productList || []
        data.startEndTime = [data.startTime, data.endTime]
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
        }, 100)

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    // 表单重置
    reset() {
      this.form = {
        /* 基础信息 */
        startEndTime: [],
        warehouseStructureIds: [],
        productCategoryIds: [],
        productList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
      this.basicUpdateProps = []
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分Start */
    /* 表单部分End */

    handleStartAudit() {
      this.submitLoading = true
      startAudit({ inventoryAuditId: this.form.inventoryAuditId })
        .then((response) => {
          this.submitLoading = false
          this.getById()
        })
        .catch(() => {
          this.submitLoading = false
          this.getById()
        })
    },
    handleEndAudit() {
      const validProduct = this.validProductList(this.form.productList)
      if (!validProduct) {
        this.collapseWarningForProductInfo = true
        return
      }
      this.collapseWarningForProductInfo = false
      let param = { ...this.form }
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      this.submitLoading = true
      endAudit(param)
        .then(() => {
          this.submitLoading = false
          this.back()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },

    async submitForm() {
      // getCheckedNodes(leafOnly) 是否只是叶子节点，默认值为 false
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

        const validProduct = this.validProductList(param.productList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        const confirmMsg = this.$t('INVENTORY.inventoryAuditSubmit')
        const successMsg = this.$t('INVENTORY.inventoryAuditSuccess')
        const submitFn = saveInventoryAudit

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
    validProductList(productList, isReqOne = true) {
      const valid = false
      if (productList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('INVENTORY.productTableEmpty'))
        return valid
      }
      const qtyReq = productList.find((item) => {
        return !this.$resultOfBoolean(item.auditQty)
      })
      if (qtyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('INVENTORY.auditQTY'))
        )
        return valid
      }
      const allNormal = productList.find((item) => {
        return item.auditQty !== item.qtyOnHand
      })
      if (!allNormal) {
        this.$modal.msgError(this.$t('INVENTORY.adjustmentAllNormal'))
        return valid
      }
      return true
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
          `${this.$t('INVENTORY.inventoryAudit')} [${vm.form.inventoryAuditNo}]`
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
          `${this.$t('INVENTORY.inventoryAudit')} [${vm.form.inventoryAuditNo}]`
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
          `${this.$t('INVENTORY.inventoryAudit')} [${vm.form.inventoryAuditNo}]`
        )
      )
      vm.back('onCancelSuccess')
    }
  }
}
</script>
<style lang="scss"></style>
