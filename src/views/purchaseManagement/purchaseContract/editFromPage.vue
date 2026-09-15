<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
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
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
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
      </el-dropdown>
      <slot name="bpmMoreBtn" :btnAuth="buttonAuthMsg"></slot>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.purchaseContract') }}
      </div>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <!-- 基本信息 -->
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
              <span class="info-item mr20" v-if="form.purchaseContractStatus">
                {{ $t('ui.status') }} :
                {{
                  selectDictLabel(dict.type.p_purchase_contract_status, form.purchaseContractStatus)
                }}
              </span>
              <span class="info-item" v-if="form.purchaseContractNo">
                {{ $t('PURCHASE.purchaseContractNo') }} :
                {{ form.purchaseContractNo }}
              </span>
            </FormCollapseItemTitle>
            <basicInfo
              ref="basicInfo"
              :formData="form"
              :comDisFrom="comDisFrom"
              :modifyHighlight="modifyHighlight"
              :basicUpdateProps="basicUpdateProps"
            />
          </el-collapse-item>
        </div>
        <!-- 合同详情 -->
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PURCHASE.contractDetail')"
              :warning="collapseWarningForContractDetail"
            >
              <span
                v-if="form.documentContractNo"
                class="info-item mr20"
                :title="form.documentContractNo"
              >
                {{ $t('PURCHASE.documentContractNo') }} : {{ form.documentContractNo }}
              </span>
              <span v-if="form.endDate" class="info-item">
                {{ $t('ui.endDate') }} : {{ parseTime(form.endDate, fmtForYmd) }}
              </span>
            </FormCollapseItemTitle>
            <contractDetail
              ref="contractDetail"
              :formData="form"
              :comDisFrom="comDisFrom"
              :modifyHighlight="modifyHighlight"
              :basicUpdateProps="basicUpdateProps"
            />
          </el-collapse-item>
        </div>
        <!-- 产品信息 -->
        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PURCHASE.productInfo')"
              :warning="collapseWarningForProductInfo"
            >
              <span v-if="productList.length" class="info-item mr20">
                {{ $t('PURCHASE.product') }} : {{ productList.length }}
              </span>
            </FormCollapseItemTitle>
            <productInfo
              ref="productInfo"
              :formData="form"
              :modifyHighlight="modifyHighlight"
              :comDisFrom="comDisFrom"
              @updateTable="updateTable"
            />
          </el-collapse-item>
        </div>
        <!-- 物流信息 -->
        <div class="form-card mt10">
          <el-collapse-item name="4">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PURCHASE.logistic')"
              :warning="collapseWarningForLogistic"
            >
            </FormCollapseItemTitle>
            <logistic
              ref="logistic"
              :formData="form"
              :comDisFrom="comDisFrom"
              :modifyHighlight="modifyHighlight"
              :basicUpdateProps="basicUpdateProps"
            />
          </el-collapse-item>
        </div>
        <!-- 财务信息 -->
        <div class="form-card mt10">
          <el-collapse-item name="5">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('PURCHASE.accounting')"
              :warning="collapseWarningForAccounting"
            >
            </FormCollapseItemTitle>
            <accounting
              ref="accounting"
              :formData="form"
              :comDisFrom="comDisFrom"
              :modifyHighlight="modifyHighlight"
              :basicUpdateProps="basicUpdateProps"
            />
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
              <SystemOperationLogTable :tableList="operationLogList" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <ApprovedDialog
      :id="form.purchaseContractMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.purchaseContractMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <RevisionComparisonDlg ref="RevisionComparisonDlg" />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.purchaseContractMainId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
  </FormPageLayout>
</template>

<script>
import {
  queryPurchaseContractById,
  savePurchaseContract,
  approvedPurchaseContract,
  rejectedPurchaseContract,
  cancelledPC,
  queryPurchaseContractHistoryVersion
} from '@/api/purchaseManagement/purchaseContract'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import RevisionComparisonDlg from '@/views/purchaseManagement/purchaseContract/revisionComparisonDlg.vue'
import basicInfo from '@/views/purchaseManagement/purchaseContract/components/basicInfo'
import contractDetail from '@/views/purchaseManagement/purchaseContract/components/contractDetail'
import productInfo from '@/views/purchaseManagement/purchaseContract/components/productInfo'
import logistic from '@/views/purchaseManagement/purchaseContract/components/logistic'
import accounting from '@/views/purchaseManagement/purchaseContract/components/accounting'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'

export default {
  dicts: ['ivt_product_status', 'p_purchase_contract_status'],
  mixins: [pageMixin],
  components: {
    ApprovedDialog,
    RejectDialog,
    RevisionComparisonDlg,
    basicInfo,
    contractDetail,
    productInfo,
    logistic,
    accounting,
    SystemOperationLogTable,
    FormCancelDialog
  },
  data() {
    return {
      submitLoading: false,
      activeName: 'basicInfo',
      activeNames: [],
      rowId: '',
      timeId: '',
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0'
      },
      // 是否自动生成 EmployeeNo
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForContractDetail: false,
      collapseWarningForProductInfo: false,
      collapseWarningForLogistic: false,
      collapseWarningForAccounting: false,
      operationLogList: [],

      productList: [],

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedPurchaseContract,
      rejectedUrl: rejectedPurchaseContract,
      cancelledUrl: cancelledPC,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      ivtSpecificationsUpdateProps: [],
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
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseContract:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.purchaseContractMainId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    comIsRevise() {
      return this.form.isRevise === '1'
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.purchaseContractMainId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseContract:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseContractMainId &&
        this.buttonAuthMsg.isCanCancelled === '1'
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
        this.form.purchaseContractMainId &&
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
        this.form.purchaseContractMainId &&
        this.buttonAuthMsg.isCanRejected === '1'
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
    handleClick() {},

    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      this.queryPurchaseContractHistoryVersion()
      queryPurchaseContractById({ purchaseContractMainId: rowId }).then((res) => {
        const data = res.data || {}
        this.form = data
        this.operationLogList = data.operationLogList || []
        this.form.paymentMethodIdList = this.form.paymentMethodId
          ? this.form.paymentMethodId.split(',')
          : undefined
        const contactList = [
          {
            contactPersonId: this.form.contactPersonId,
            contactPersonName: this.form.contactPersonName
          }
        ]
        const purchaseContractDetailList = data.purchaseContractDetailList || []

        /* 初始化 AddressInfo */
        setTimeout(() => {
          this.$refs.basicInfo && this.$refs.basicInfo.initBpBusinessContactPersonList(contactList)
          this.$refs.contractDetail && this.$refs.contractDetail.initFileList(data.commonFileList)
          this.$refs.productInfo &&
            this.$refs.productInfo.initPurchaseContractDetailList(purchaseContractDetailList)
          this.$refs.logistic && this.$refs.logistic.init(data.purchaseContractAddresses)
          this.$refs.accounting && this.$refs.accounting.queryPurchasePaymentMethodByTerm()
        }, 100)

        this.productList = purchaseContractDetailList

        this.buttonAuthMsg = data.buttonAuthMsg || {}
        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const ivtSpecificationsUpdateMsgList = updateMsg.ivtSpecificationsUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          this.ivtSpecificationsUpdateProps = ivtSpecificationsUpdateMsgList.map(
            (item) => item.name
          )
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 100)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分 */
    updateTable(list) {
      this.productList = list
    },
    // 表单重置
    reset() {
      this.form = {
        isActive: '1',
        purchaseContractStatus: '',
        businessPartnerId: undefined,
        incotermId: undefined,
        incotermAddressType: undefined,
        documentContractNo: undefined,
        signedBy: undefined,
        startDate: undefined,
        endDate: undefined,
        contractDate: undefined,
        amount: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: undefined,
        payToAddressObj: {},
        receiveAddressName: undefined,
        receiveAddressId: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        purchaseContractDetailList: [],
        exchangeRate: 1,
        countryId: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForContractDetail = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForLogistic = false
      this.collapseWarningForAccounting = false
      this.activeNames = ['1', '2', '3', '4', '5', '6']
      this.operationLogList = []
      this.$nextTick(() => {
        this.$refs.basicInfo && this.$refs.basicInfo.init()
      })
    },

    async submitValidate() {
      // 基本信息验证
      const basicInfo = await this.$refs.basicInfo.basicInfoSubmit()
      this.collapseWarningForBasicInfo = !basicInfo
      if (!basicInfo) return false

      // 合同详情验证
      const contractDetail = await this.$refs.contractDetail.contractDetailSubmit()
      this.collapseWarningForContractDetail = !contractDetail
      if (!contractDetail) return false

      // 产品信息
      const productInfo = await this.$refs.productInfo.productInfoSubmit()
      this.collapseWarningForProductInfo = !productInfo
      if (!productInfo) return false

      // 物流信息
      const logistic = await this.$refs.logistic.logisticSubmit()
      this.collapseWarningForLogistic = !logistic
      if (!logistic) return false

      // 财务信息
      const accounting = await this.$refs.accounting.accountingSubmit()
      this.collapseWarningForAccounting = !accounting
      if (!accounting) return false

      const param = JSON.parse(JSON.stringify(this.form))
      param.commonFileList = contractDetail.commonFileList
      param.purchaseContractDetailList = productInfo

      const { payToAddressObj, addressForPort, addressForWarehouse } = logistic
      param.purchaseContractAddresses = []
      param.purchaseContractAddresses = [payToAddressObj]

      if (addressForPort && JSON.stringify(addressForPort) !== '{}') {
        param.purchaseContractAddresses.push(addressForPort)
      }
      if (addressForWarehouse && JSON.stringify(addressForWarehouse) !== '{}') {
        param.purchaseContractAddresses.push(addressForWarehouse)
      }
      return param
    },
    async submitForm() {
      const params = await this.submitValidate()
      if (!params) return

      this.$modal
        .confirm(this.$t('PURCHASE.purchaseContractSubmit'))
        .then(() => {
          this.submitLoading = true
          return savePurchaseContract(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('PURCHASE.purchaseContractSuccess').replace(
              '$1',
              response.msg || params.businessPartnerNo
            )
          )
          this.back()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/purchaseManagement/revisePurchaseContract',
        query: {
          id: this.form.purchaseContractMainId,
          timeId: Date.now()
        }
      })
    },
    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.rowId)
    },
    isModified(prop, type = 1) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (type === 1) {
        if (this.basicUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      } else if (type === 2) {
        if (this.ivtSpecificationsUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      }
    },
    queryPurchaseContractHistoryVersion() {
      if (this.comeFrom !== '1') return
      queryPurchaseContractHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    settingHandleCommand(businessId) {
      this.$router.push({
        path: '/purchaseManagement/viewPurchaseContract',
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
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('PURCHASE.purchaseContractCancel')}`.replace('$1', `${vm.form.purchaseContractNo}`)
      )
      vm.back('onCancelSuccess')
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
          `${this.$t('menu.purchaseContract')} [${vm.form.purchaseContractNo}]`
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
          `${this.$t('menu.purchaseContract')} [${vm.form.purchaseContractNo}]`
        )
      )
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    }
  }
}
</script>
<style lang="scss"></style>
