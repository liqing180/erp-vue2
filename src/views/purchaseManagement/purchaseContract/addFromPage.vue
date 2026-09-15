<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
            </FormCollapseItemTitle>
            <basicInfo ref="basicInfo" :formData="basicInfoForm" />
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
            </FormCollapseItemTitle>
            <contractDetail ref="contractDetail" :formData="basicInfoForm" />
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
            </FormCollapseItemTitle>
            <productInfo ref="productInfo" :formData="basicInfoForm" />
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
            <logistic ref="logistic" :formData="basicInfoForm" />
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
            <accounting ref="accounting" :formData="basicInfoForm" />
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  savePurchaseContract,
  saveDraftPurchaseContract
} from '@/api/purchaseManagement/purchaseContract'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import basicInfo from '@/views/purchaseManagement/purchaseContract/components/basicInfo'
import contractDetail from '@/views/purchaseManagement/purchaseContract/components/contractDetail'
import productInfo from '@/views/purchaseManagement/purchaseContract/components/productInfo'
import logistic from '@/views/purchaseManagement/purchaseContract/components/logistic'
import accounting from '@/views/purchaseManagement/purchaseContract/components/accounting'
import emailCmdPoper from '@/directive/emailCmdPoper'

export default {
  directives: { emailCmdPoper },
  dicts: [],
  mixins: [pageMixin],
  // eslint-disable-next-line vue/no-unused-components
  components: {
    basicInfo,
    contractDetail,
    productInfo,
    logistic,
    accounting
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      timeId: '',
      collapseWarningForBasicInfo: false,
      collapseWarningForContractDetail: false,
      collapseWarningForProductInfo: false,
      collapseWarningForLogistic: false,
      collapseWarningForAccounting: false,
      basicInfoForm: {},
      submitLoading: false
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  mounted() {
    this.handleAdd()
  },
  methods: {
    handleAdd() {
      this.reset()
    },
    reset() {
      this.basicInfoForm = {
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
      this.$refs.basicInfo && this.$refs.basicInfo.init()
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForContractDetail = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForLogistic = false
      this.collapseWarningForAccounting = false
      this.activeNames = ['1', '2', '3', '4', '5']
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseContract' })
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
      const param = JSON.parse(JSON.stringify(this.basicInfoForm))
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
    // 提交
    async submitForm() {
      const params = await this.submitValidate()
      console.log(params, '==')
      if (!params) return
      this.$modal
        .confirm(this.$t('PURCHASE.purchaseContractSubmit'))
        .then(() => {
          this.submitLoading = true
          return savePurchaseContract(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('PURCHASE.purchaseContractSuccess').replace('$1', response.msg)
          )
          this.cancel()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    // 草稿
    async handleSaveDraft() {
      const params = await this.submitValidate()
      if (!params) return
      this.submitLoading = true
      saveDraftPurchaseContract(params)
        .then((res) => {
          this.cancel()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
      // this.$modal
      //   .confirm(this.$t('PURCHASE.purchaseContractSubmit'))
      //   .then(() => {
      //     return saveDraftPurchaseContract(params)
      //   })
      //   .then((response) => {
      //     this.$modal.msgSuccess(
      //       this.$t('PURCHASE.purchaseContractSuccess').replace('$1', response.msg)
      //     )
      //     this.cancel()
      //   })
      //   .catch(() => {})
    }
  }
}
</script>
<style lang="scss"></style>
