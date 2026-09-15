<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
            <basicInfo
              ref="basicInfo"
              :formData="basicInfoForm"
              @queryPurchaseOrderById="queryPurchaseOrderById"
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
            </FormCollapseItemTitle>
            <div class="pb20">
              <productInfo
                ref="productInfo"
                :formData="basicInfoForm"
                :comDisFrom="!!basicInfoForm.purchaseOrderNo"
              />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  saveSupplierContract,
  saveDraftSupplierContract
} from '@/api/purchaseManagement/supplierContract'
import { queryPurchaseOrderById } from '@/api/purchaseManagement/purchaseOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import basicInfo from '@/views/purchaseManagement/supplierContract/components/basicInfo'
import productInfo from '@/views/purchaseManagement/supplierContract/components/productInfo'
import emailCmdPoper from '@/directive/emailCmdPoper'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  directives: { emailCmdPoper },
  dicts: [],
  mixins: [pageMixin],
  // eslint-disable-next-line vue/no-unused-components
  components: {
    basicInfo,
    productInfo
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      timeId: '',
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      basicInfoForm: { supplierContractPvList: [] },
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
    },
    getFormJson() {
      let fileParams = {}
      if (this.$refs.basicInfo) {
        fileParams = this.$refs.basicInfo.getAllFileIds()
      }
      const param = { ...this.basicInfoForm, ...fileParams }

      return JSON.stringify(param)
    },
    queryPurchaseOrderById(purchaseOrderId) {
      if (purchaseOrderId) {
        queryPurchaseOrderById({ purchaseOrderId }).then((res) => {
          const data = res.data || {}
          this.$refs.productInfo.initPurchaseContractDetailList(data.purchaseOrderDetailList || [])
        })
      } else {
        this.$refs.productInfo.initPurchaseContractDetailList([])
      }
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
        countryId: undefined,
        supplierContractPvList: [{ timeId: Date.now(), pv: '' }]
      }
      this.$refs.basicInfo && this.$refs.basicInfo.init()
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4', '5']
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/supplierContract' })
    },
    backFN() {
      formDirtyClass.showNotify(this.$route.name).then((msg) => {
        if (msg === 'save') {
          this.handleSaveDraftNoConFirm()
          return
        } else if (msg === 'stop') {
          return
        }
        this.cancel()
      })
    },
    async submitValidate(type) {
      // 基本信息验证
      const basicInfo = await this.$refs.basicInfo.basicInfoSubmit(type)
      this.collapseWarningForBasicInfo = !basicInfo
      if (!basicInfo) return false

      const param = JSON.parse(JSON.stringify(basicInfo))

      if (!type) {
        // 产品信息
        const productInfo = await this.$refs.productInfo.productInfoSubmit()
        this.collapseWarningForProductInfo = !productInfo
        if (!productInfo) return false
      }
      param.purchaseOrderDetailList = this.$refs.productInfo.getDetailList()
      // const param = JSON.parse(JSON.stringify(this.basicInfoForm))
      return param
    },
    // 提交
    async submitForm() {
      const params = await this.submitValidate()
      if (!params) return
      this.$modal
        .confirm(this.$t('PURCHASE.supplierContractSubmit'))
        .then(() => {
          this.submitLoading = true
          return saveSupplierContract(params)
        })
        .then((response) => {
          this.$modal.msgSuccess(
            this.$t('PURCHASE.supplierContractSuccess').replace('$1', response.msg)
          )
          this.submitLoading = false
          this.cancel()
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    // 草稿
    async handleSaveDraft(isConfirm = true, gotoRoute) {
      const params = await this.submitValidate('saveDraft')
      if (!params) return
      this.submitLoading = true
      saveDraftSupplierContract(params)
        .then((res) => {
          if (isConfirm) {
            this.submitLoading = false
            this.cancel()
          } else {
            const pageItem = formDirtyClass.routeStatusData[this.$route.name]
            if (pageItem) {
              pageItem.isSaveSuccess = true
            }

            setTimeout(() => {
              this.submitLoading = false
            }, 1000)

            if (gotoRoute && gotoRoute.name !== this.$route.name) {
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push(gotoRoute).catch(() => {})
            } else {
              this.cancel()
            }
          }
        })
        .catch(() => {
          this.submitLoading = false
        })
      // this.$modal
      //   .confirm(this.$t('PURCHASE.purchaseContractSubmit'))
      //   .then(() => {
      //     return saveDraftSupplierContract(params)
      //   })
      //   .then((response) => {
      //     this.$modal.msgSuccess(
      //       this.$t('PURCHASE.purchaseContractSuccess').replace('$1', response.msg)
      //     )
      //     this.cancel()
      //   })
      //   .catch(() => {})
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    }
  }
}
</script>
<style lang="scss"></style>
