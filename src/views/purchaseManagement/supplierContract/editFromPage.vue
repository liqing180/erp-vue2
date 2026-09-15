submitValidate
<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="saveDraftBtnShow" @click="handleSaveDraft"
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
              :formData="form"
              @queryPurchaseOrderById="queryPurchaseOrderById"
              :comDisFrom="comDisFrom"
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
                :formData="form"
                :comDisFrom="!!form.purchaseOrderNo || comDisFrom"
              />
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="5">
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
  saveSupplierContract,
  saveDraftSupplierContract,
  querySupplierContractById
} from '@/api/purchaseManagement/supplierContract'
import { queryPurchaseOrderById } from '@/api/purchaseManagement/purchaseOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import basicInfo from '@/views/purchaseManagement/supplierContract/components/basicInfo'
import productInfo from '@/views/purchaseManagement/supplierContract/components/productInfo'
import emailCmdPoper from '@/directive/emailCmdPoper'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { formDirtyClass } from '@/mixins/formDirtyClass'

export default {
  directives: { emailCmdPoper },
  dicts: [],
  mixins: [pageMixin],
  // eslint-disable-next-line vue/no-unused-components
  components: {
    basicInfo,
    productInfo,
    SystemOperationLogTable
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5'],
      timeId: '',
      rowId: '',
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      form: { supplierContractPvList: [] },
      submitLoading: false,
      operationLogList: [],
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      }
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
    dataType: {
      type: [String, Number],
      default: '1' // todo:1, history:2, 管理员todo: 3
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
      return this.checkPermi(['purchaseManagement:supplierContract:edit'])
    },
    saveDraftBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (this.form.supplierContractId && this.buttonAuthMsg.isCanSaveDraft === '1') {
        show = true
      }
      return show
    },
    comDisFrom() {
      const dis = false
      if (!this.editAuth) {
        return true
      }
      return dis
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
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
  mounted() {},
  methods: {
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      querySupplierContractById({ supplierContractId: rowId }).then((res) => {
        console.log(res, '===')
        const data = res.data || {}
        data.supplierContractPvList = data.supplierContractPvList || []
        if (data.supplierContractPvList.length > 0) {
          data.supplierContractPvList.forEach((item) => {
            item.timeId = item.supplierContractPvId
            data[`pv${item.timeId}`] = item.pv
          })
        } else {
          data.supplierContractPvList = [{ timeId: Date.now(), pv: '' }]
        }

        this.form = data

        this.operationLogList = data.operationLogList || []
        this.form.paymentMethodIdList = this.form.paymentMethodId
          ? this.form.paymentMethodId.split(',')
          : undefined
        this.buttonAuthMsg = data.buttonAuthMsg
        const purchaseOrderDetailList = data.purchaseOrderDetailList || []

        setTimeout(() => {
          this.$refs.basicInfo && this.$refs.basicInfo.initFileList()
          this.$refs.productInfo &&
            this.$refs.productInfo.initPurchaseContractDetailList(purchaseOrderDetailList)
        }, 300)
        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
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
        }, 500)
      })
    },
    getFormJson() {
      let fileParams = {}
      if (this.$refs.basicInfo) {
        fileParams = this.$refs.basicInfo.getAllFileIds()
      }
      const param = { ...this.form, ...fileParams }

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
        countryId: undefined,
        supplierContractPvList: []
      }
      this.operationLogList = []
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

      if (!type) {
        // 产品信息
        const productInfo = await this.$refs.productInfo.productInfoSubmit()
        console.log(productInfo)
        this.collapseWarningForProductInfo = !productInfo
        if (!productInfo) return false
      }
      const param = JSON.parse(JSON.stringify(basicInfo))
      param.purchaseOrderDetailList = this.$refs.productInfo.getDetailList()

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
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.handleSaveDraft(false, gotoRoute)
    }
  }
}
</script>
<style lang="scss"></style>
