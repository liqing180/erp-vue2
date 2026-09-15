<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
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
                    <el-form-item :label="`${$t('ui.rejectedBy')}`" prop="acknowledgedBy">
                      <el-input
                        v-model="form.acknowledgedBy"
                        type="text"
                        class="form-wd"
                        maxlength="50"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.rejectedTime')}`" prop="acknowledgedTime">
                      <el-date-picker
                        v-model="form.acknowledgedTime"
                        :picker-options="PickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :default-time="getCurrentTime()"
                        :style="{ width: '100%' }"
                        placeholder
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.remarks')}`" prop="acknowledgedRemarks">
                      <MyInput
                        type="textarea"
                        v-model="form.acknowledgedRemarks"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="200"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`" required>
                      <myUpload ref="uploadRef" :limit="9" :disabled="false" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <RejectProductTable ref="RejectProductTable" :formData="form" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import {
  queryDeliveryOrderById,
  acknowledgeDeliveryOrder
} from '@/api/salesManagement/deliveryOrder'

import RejectProductTable from './productInfo/RejectProductTable.vue'
export default {
  mixins: [pageMixin],
  dicts: ['sales_quotation_type', 'delivery_order_status', 'logistics_type'],
  components: {
    RejectProductTable
  },
  data() {
    return {
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {
        deliveryOrderProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForPODetail: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        acknowledgedBy: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        acknowledgedTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      PickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date() - 90 * 24 * 60 * 60 * 1000
          )
        }
      },
      poDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      deptOptions: [],
      customerQuestionnaireOptions: [],
      currencyOptions: [],
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      shipToAddressRows: [
        {
          label: this.$t('SALES.port'),
          showLabel: 'portName'
        },
        {
          label: this.$t('SALES.code'),
          showLabel: 'portCode'
        },
        {
          label: this.$t('SALES.latLong'),
          showLabel: 'latLong'
        },
        {
          label: this.$t('SALES.telephone'),
          showLabel: 'telephone'
        },
        {
          label: this.$t('SALES.website'),
          showLabel: 'website'
        },
        {
          label: this.$t('SALES.country'),
          showLabel: 'country'
        }
      ],

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
    fmtForYmdhm() {
      return this.$store.getters.fmtForYmdhm
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    sendEDOBtnShow() {
      if (this.isView) {
        return false
      }
      if (!this.checkPermi(['salesManagement:deliveryOrder:sendEDO'])) {
        return false
      }
      let show = false
      if (this.form.deliveryOrderId && this.buttonAuthMsg.isCanSendEDo === '1') {
        show = true
      }
      return show
    },
    comDisFrom() {
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    getCurrentTime() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      queryDeliveryOrderById({ deliveryOrderId: rowId }).then((res) => {
        const data = res.data || {}
        data.deliveryOrderProductList = data.deliveryOrderProductList || []
        // data.deliveryOrderProductList = data.deliveryOrderProductList.filter((item) => {
        //   return item.productType !== '2'
        // })
        data.deliveryOrderProductList.forEach((item) => {
          item.remarks = ''
        })
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
      })
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    reset() {
      this.form = {
        /* 基础信息 */
        salesQuotationType: undefined,
        salesOrderNo: undefined,
        businessPartnerName: undefined,
        deliveryOrderStatus: undefined,
        businessPartnerId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        salesPersonBy: undefined,
        salesPersonId: undefined,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        validity: undefined,
        deliveryDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        isUrgent: '0',
        logisticsType: '1',
        sendEDo: '0',

        poType: undefined,
        poNo: undefined,
        poDate: undefined,

        bpEmail: undefined,
        mobilePhone: undefined,
        freight: undefined,
        freightTaxNo: undefined,

        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        receiveAddressForPort: {},
        addressForWarehouse: {},
        deliveryOrderProductList: [],
        salesOrderProjectList: [],
        salesOrderServiceList: [],
        projectCostDetailList: [],
        deliveryOrderAcknowledge: {}
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForPODetail = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4', '5']

      this.basicUpdateProps = []
      this.bpHistoryVersionList = []

      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      }, 300)
      this.resetForm('form1')
    },

    /* 表单部分Start */
    /* 第一部分表单 */
    // 清空供应商
    salesOrderNoClear() {},

    customerQuestionnaireChange(item) {
      this.$set(this.form, 'customerQuestionnaireId', item.customerQuestionnaireId)
      this.$set(this.form, 'customerQuestionnaireNo', item.customerQuestionnaireNo)
    },
    customerQuestionnaireClear() {
      this.$set(this.form, 'customerQuestionnaireId', undefined)
      this.$set(this.form, 'customerQuestionnaireNo', undefined)
      this.$nextTick(() => {
        this.$refs.form1.clearValidate('customerQuestionnaireId')
      })
    },

    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'salesPersonBy', undefined)
      this.$set(this.form, 'salesPersonId', undefined)
    },

    /* 客户采购信息 */
    poContactPersonChange(row) {
      this.$set(this.form, 'poBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'poContactPersonId', row.contactPersonId)
      this.$set(this.form, 'poContactPersonName', row.contactPersonName)
      this.$set(this.form, 'poMobileNum', row.mobileNum)
      this.$set(this.form, 'poMobileCode', row.mobileCode)
      this.$set(this.form, 'poMobilePhone', row.mobilePhone)
      this.$set(this.form, 'poEmail', row.email)
    },

    /* 第二部分表单 */
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2') {
        this.$refs.payToAddressDlg.handleOpen()
      }
    },
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
      this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseId', warehouseId)
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
    },

    contactPersonChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    contactPersonClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
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
      const fileIds = this.$refs.uploadRef.getFileIds({
        required: true,
        requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
      })
      if (fileIds === false) {
        return
      }

      if (valid1) {
        let param = { ...this.form }
        const validProduct = this.validProductList(param.deliveryOrderProductList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }

        this.collapseWarningForProductInfo = false

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileListForRejected = fileIds
        // param.commonFileList = myFileIds
        const internalPartNoList = param.deliveryOrderProductList
          .filter((item) => item.rejectedQty > 0)
          .map((item) => {
            if (item.internalPartNo) {
              return item.internalPartNo
            }
            if (item.productName.length <= 30) {
              return item.productName
            } else {
              return item.productName.slice(0, 30) + '...'
            }
          })

        const confirmMsg = this.$t('SALES.DOrejectConfirm').replace(
          '$1',
          internalPartNoList.join(', ')
        )
        const successMsg = this.$t('SALES.DOrejectSuccess').replace(
          '$1',
          internalPartNoList.join(', ')
        )
        const submitFn = acknowledgeDeliveryOrder

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
      const internalPartNoList = detailList.filter((item) => item.rejectedQty > 0)
      if (internalPartNoList.length <= 0) {
        this.$modal.msgError(this.$t('SALES.rejectedQtyEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.rejectedQty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.rejectedQty')))
        return valid
      }

      const returnedReasonReq = detailList.find((item) => {
        return item.rejectedQty > 0 && !this.$resultOfBoolean(item.returnedReason)
      })
      if (returnedReasonReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.returnReason'))
        )
        return valid
      }

      return true
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
