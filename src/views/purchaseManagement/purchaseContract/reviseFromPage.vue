<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
            <basicInfo ref="basicInfo" :formData="form" :comDisFrom="comDisFrom" isRevise />
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
              isRevise
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
            <logistic ref="logistic" :formData="form" :comDisFrom="comDisFrom" />
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
            <accounting ref="accounting" :formData="form" :comDisFrom="comDisFrom" />
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
  </FormPageLayout>
</template>

<script>
import {
  queryPurchaseContractById,
  revisePurchaseContract,
  approvedPurchaseContract,
  rejectedPurchaseContract,
  cancelledPC
} from '@/api/purchaseManagement/purchaseContract'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import basicInfo from '@/views/purchaseManagement/purchaseContract/components/basicInfo'
import contractDetail from '@/views/purchaseManagement/purchaseContract/components/contractDetail'
import productInfo from '@/views/purchaseManagement/purchaseContract/components/productInfo'
import logistic from '@/views/purchaseManagement/purchaseContract/components/logistic'
import accounting from '@/views/purchaseManagement/purchaseContract/components/accounting'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  dicts: ['ivt_product_status', 'p_purchase_contract_status'],
  mixins: [pageMixin],
  components: {
    basicInfo,
    contractDetail,
    productInfo,
    logistic,
    accounting,
    SystemOperationLogTable
  },
  data() {
    return {
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
      bpHistoryVersionList: [],
      submitLoading: false
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
      if (this.isView) {
        return true
      }
      if (this.rowId) {
        return !this.editAuth
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
        /* 初始化 AddressInfo */
        const purchaseContractDetailList = data.purchaseContractDetailList || []

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
      })
    },
    // 取消按钮
    back(type) {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseContract' })
    },
    /* 表单部分 */
    updateTable(list) {
      this.productList = list
    },
    // 表单重置
    reset() {
      this.form = {
        isActive: '1',
        purchaseContractStatus: '1',
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

      // const param = Object.assign({}, basicInfo, contractDetail, accounting)
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
          return revisePurchaseContract(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('PURCHASE.purchaseContractSuccess').replace('$1', response.msg)
          )
          this.submitLoading = false
          this.back()
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>
<style lang="scss"></style>
