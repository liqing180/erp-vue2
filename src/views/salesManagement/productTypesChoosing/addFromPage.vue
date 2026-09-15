<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
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
                :title="$t('SALES.requirements')"
                :warning="collapseWarningForBasicInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                      <el-input v-model="form.productName" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input v-model="form.status" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.lectotypeCode')}`">
                      <el-input v-model="form.lectotypeCode" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.description')">
                      <MyInput
                        type="textarea"
                        v-model="form.description"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="7000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.content')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.productInformation')"
                :warning="collapseWarningForProductInformation"
              >
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
                    <el-form-item :label="`${$t('PRODUCT.productName')}`" prop="productName">
                      <el-input v-model="form.productName" maxlength="200"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.internalPartNo')}`">
                      <el-input v-model="form.internalPartNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.description')">
                      <MyInput
                        type="textarea"
                        v-model="form.description"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="7000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectSalesOrderTable ref="selectSalesOrderTable" @update="updateSalesOrderNo" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <selectPicTable ref="selectPicTable" @update="updatePic" />
  </FormPageLayout>
</template>

<script>
import {
  saveSalesGoodsReturn,
  saveDraftSalesGoodsReturn
} from '@/api/salesManagement/salesGoodsReturn'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'

import selectSalesOrderTable from './components/selectSalesOrderTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectPicTable from './components/selectPicTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
export default {
  mixins: [pageMixin],
  dicts: ['sales_goods_return_status'],
  components: {
    selectSalesOrderTable,
    selectPicTable,
    selectWarehouseTable,
    ProductInfo
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        salesGoodsReturnProductList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      collapseWarningForProductInformation: false,
      rules: {
        productName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      initCommonFileList: []
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.handleAdd()
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {},
  methods: {
    handleAdd() {
      this.reset()
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

        addressForWarehouse: {},
        salesGoodsReturnProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForProductInformation = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
      this.resetForm('form2')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
    },

    /* 第二部分表单 */
    openSalesOrderTable() {
      this.$refs.selectSalesOrderTable.handleOpen()
    },
    updateSalesOrderNo(row) {
      this.$set(this.form, 'salesOrderId', row.salesOrderId)
      this.$set(this.form, 'salesOrderNo', row.salesOrderNo)
      this.$set(this.form, 'soldDate', row.createdTime)
      this.$set(this.form, 'salesPersonBy', row.salesPersonBy)
      this.$set(this.form, 'salesPersonId', row.salesPersonId)
      this.$set(this.form, 'salesPersonId', row.salesPersonId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'salesGoodsReturnProductList', [])
      // this.queryFormInfoForSalesOrderId(row.salesOrderId)
    },

    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', row.warehouseName)
      this.$set(this.form, 'warehouseId', row.warehouseId)
      this.$set(this.form, 'warehouseLabel', rowData.label)
      this.$set(this.form, 'warehouseUserId', row.userId)
      this.$set(this.form, 'warehouseUserName', row.userName)
      this.$set(this.form, 'warehouseAddressShowStr', row.warehouseAddressShowStr)
      this.$set(this.form, 'warehouseUserMobileCode', row.mobileCode)
      this.$set(this.form, 'warehouseUserMobileNum', row.mobileNum)
      this.$set(this.form, 'warehouseUserMobilePhone', row.mobilePhone)
      this.$set(this.form, 'warehouseUserEmail', row.email)
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseLabel', undefined)
      this.$set(this.form, 'warehouseUserId', undefined)
      this.$set(this.form, 'warehouseUserName', undefined)
      this.$set(this.form, 'warehouseAddressShowStr', undefined)
      this.$set(this.form, 'warehouseUserMobileCode', undefined)
      this.$set(this.form, 'warehouseUserMobileNum', undefined)
      this.$set(this.form, 'warehouseUserMobilePhone', undefined)
      this.$set(this.form, 'warehouseUserEmail', undefined)
    },

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
        const content = await this.$refs.ProductInfo.submit()

        if (content === false) {
          this.collapseWarningForProductInfo = true
          return
        }
        console.log('3')
        const validProduct = this.validProductList(param.salesGoodsReturnProductList)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        }

        const valid2 = await this.$refs.form2.validate().catch((err) => {
          return err
        })
        this.collapseWarningForProductInformation = !valid2
        if (!valid2) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.productInformation'))
          )
          return
        }

        this.collapseWarningForProductInfo = false

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('SALES.SGRSaveConfirm')
          successMsg = this.$t('SALES.SGRSaveSuccess')
          submitFn = saveDraftSalesGoodsReturn
        } else {
          confirmMsg = this.$t('SALES.SGRSubmitConfirm')
          successMsg = this.$t('SALES.SGRSubmitSuccess')
          submitFn = saveSalesGoodsReturn
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
    handleSaveDraft() {
      this.submitForm('save')
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
