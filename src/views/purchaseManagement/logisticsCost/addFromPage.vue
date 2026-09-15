<template>
  <FormPageLayout ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" v-if="!comDisFrom" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <!-- <el-button type="primary"  size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button> -->
      <!-- <el-button type="primary" size="mini" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button> -->
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
                <span class="info-item mr20">
                  {{ $t('PURCHASE.shippingAgent') }} : {{ form.shippingAgentName }}
                </span>
                <span class="info-item mr20"> {{ $t('ui.currency') }} : {{ form.currency }} </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row v-if="false">
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.shippingAgent')}`"
                      prop="shippingAgentName"
                    >
                      <SelectInput
                        clearable
                        :value="form.shippingAgentName"
                        :title="form.shippingAgentName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="!form.shippingAgentId"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :options="currencyOptions || []"
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.documentType')}`" prop="documentType">
                      <el-select
                        v-model="form.documentType"
                        placeholder=""
                        @change="documentTypeChange"
                        style="width: 100%"
                        :disabled="isRevise"
                      >
                        <el-option
                          v-for="item in dict.type.logistics_document_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.pic')}`" prop="picUserName">
                      <CommonSelectAndList
                        :id="form.picUserName"
                        :label="form.picUserId"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :disabled="comDisFrom"
                        :options="picUserOptions"
                        :loading="picUserLoading"
                        @change="updatePic"
                        @handleOpen="openPicTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.logisticsCostNo')}`">
                      <el-input v-model="form.logisticsDocumentNo" disabled></el-input>
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

          <div class="form-card mt10 collapse-item-content-pt0" ref="collapseScrollPage">
            <ProductTable
              ref="ProductTable"
              :formData="form"
              :countryId="form.countryId"
              :shippingAgentId="form.shippingAgentId"
              :currencyId="form.currencyId"
              :currencyOptions="currencyOptions"
              @updateTable="updateProductTable"
              @scrollPageToTable="scrollPageToTable"
              :comDisFrom="comDisFrom"
            />
          </div>

          <div class="form-card mt10 collapse-item-content-pt0" v-if="false">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
                <span class="info-item mr20">
                  {{ $t('PURCHASE.totalAmount') }} : {{ $numberStr(comAmount, 2) }}
                </span>
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :formData="form"
                  :countryId="form.countryId"
                  :shippingAgentId="form.shippingAgentId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  :linkPR="false"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-if="false">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.shippingAgentInfo')"
                :warning="collapseWarningForDeliveryInfo"
              >
                <span
                  v-if="form.bpContactPersonName"
                  class="info-item mr20"
                  :title="form.bpContactPersonName"
                >
                  {{ $t('PURCHASE.contactPersonName') }} : {{ form.bpContactPersonName }}
                </span>
                <span v-if="form.bpMobilePhone" class="info-item" :title="form.bpMobilePhone">
                  {{ $t('PURCHASE.mobilePhone') }} : {{ form.bpMobilePhone }}
                </span>
              </FormCollapseItemTitle>
              <el-form
                ref="form4"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.contactPersonName')}`"
                      prop="bpContactPersonId"
                    >
                      <CommonSelect
                        :disabled="!form.shippingAgentId"
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="deliveryByChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.contactPersonEmail1')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectSupplierTable ref="selectSupplierTable" shippingAgent="1" @update="updateSupplier" />
    <selectPicTable ref="selectPicTable" @update="updatePic" />
  </FormPageLayout>
</template>

<script>
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryUsersNeedSameLegalEntity } from '@/api/organization/corporate'

import {
  addLogisticsCost,
  getLogisticsCostById,
  reviseLogisticsCost
} from '@/api/purchaseManagement/logisticsCost'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPicTable from './components/selectPicTable.vue'

import ProductTable from '@/views/purchaseManagement/logisticsCost/components/productInfo.vue'

export default {
  mixins: [pageMixin],
  dicts: ['logistics_document_type'],
  components: {
    selectSupplierTable,
    selectPicTable,
    ProductTable
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        logisticsDocumentExpenses: [],
        selectedProductList: [],
        logisticsDocumentProductList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForDeliveryInfo: false,
      rules: {
        shippingAgentName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        departmentId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        currencyId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        documentType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        picUserName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpBusinessAddressId: [
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
      picUserOptions: [],
      picUserLoading: [],
      currencyOptions: [],
      currencyOptionsLoading: false,
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */
      collapseWarningForProductInfo: false
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
    isRevise: {
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
        if (this.rowId && this.isRevise) {
          this.handleUpdate()
        } else {
          this.handleAdd()
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
    comAmount() {
      const amountList = this.form.logisticsDocumentExpenses.map((item) => item.refAmount)
      let total = 0
      amountList.forEach((cost) => {
        if (cost) {
          total += cost || 0
        }
      })
      return total
    },
    editAuth() {
      return this.checkPermi(['purchaseManagement:logisticsCost:edit'])
    },

    comDisFrom() {
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
  created() {},
  methods: {
    handleUpdate() {
      this.reset()
      this.queryCurrencyListBySelect()
      this.queryPicUserOptions()
      this.getPoById()
    },
    getPoById() {
      const rowId = this.rowId
      getLogisticsCostById(rowId).then((res) => {
        const data = res || {}
        data.logisticsDocumentExpenses = data.logisticsDocumentExpenses || []
        data.logisticsDocumentExpenses.forEach((item) => {
          item.timeRowId = item.logisticsDocumentExpenseId
        })
        const addressForWarehouse = data.addressForWarehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}
        this.initTableFileList()
      })
    },
    initTableFileList() {
      const maxAttempts = 20 // 最大尝试次数
      const interval = 200 // 每次尝试的间隔时间（毫秒）
      let attempts = 0
      const retry = () => {
        if (attempts < maxAttempts) {
          attempts++
          setTimeout(() => {
            if (this.$refs.ProductTable) {
              this.$refs.ProductTable.initTableFileList()
            } else {
              retry()
            }
          }, interval)
        } else {
          console.log('无法获取组件')
        }
      }
      retry()
    },
    handleAdd() {
      this.reset()
      if ((this.dict.type.logistics_document_type || []).length > 0) {
        this.$set(this.form, 'documentType', '1')
      }
      this.queryPicUserOptions()
      this.queryCurrencyListBySelect()
    },
    reset() {
      this.form = {
        /* 基础信息 */
        logisticsCostNo: undefined,
        shippingAgentName: undefined,
        shippingAgentId: undefined,
        purchaseOrderStatus: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        documentType: undefined,
        picUserName: this.$store.state.user.nickName,
        picUserId: this.$store.state.user.userId,
        currencyId: undefined,
        currency: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        logisticsDocumentExpenses: [],

        bpEmail: undefined,
        mobilePhone: undefined,
        countryId: undefined,
        country: undefined,
        selectedProductList: [],
        logisticsDocumentProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.$set(this.form, 'logisticsDocumentExpenses', [
        { timeRowId: Date.now(), logisticsDocumentProducts: [] }
      ])
      this.activeNames = ['1', '2', '3', '4']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
      this.resetForm('form4')
    },
    onDictReady() {
      this.$set(this.form, 'documentType', '1')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },
    openSupplierTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    clearExpenseItemProducts() {
      this.form.logisticsDocumentExpenses.forEach((item) => {
        this.$set(item, 'logisticsDocumentProducts', [])
      })
    },
    calculateExpenseItem() {
      this.$refs.ProductTable.calculateTableList()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'shippingAgentId', undefined)
      this.$set(this.form, 'shippingAgentName', undefined)
      this.$set(this.form, 'shippingAgentNo', undefined)
      this.$set(this.form, 'shippingAgentAbbreviation', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.deliveryByClear()
      this.calculateExpenseItem()
    },
    updateSupplier(row) {
      this.$set(this.form, 'shippingAgentId', row.businessPartnerId)
      this.$set(this.form, 'shippingAgentName', row.businessPartnerName)
      this.$set(this.form, 'shippingAgentNo', row.businessPartnerNo)
      this.$set(this.form, 'shippingAgentAbbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.deliveryByClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.deliveryByChange(defaultContact)
        }
      }
      this.calculateExpenseItem()
    },

    queryPicUserOptions() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      param.menuPerms = this.menuKey.logisticsCost
      this.picUserLoading = true
      queryUsersNeedSameLegalEntity(param)
        .then((response) => {
          const rows = response.rows || []
          this.picUserOptions = rows
          this.picUserLoading = false
        })
        .catch((err) => {
          this.picUserLoading = false
          window.console.error(err)
        })
    },
    openPicTable() {
      this.$refs.selectPicTable.handleOpen()
    },
    picUserByClear() {
      this.$set(this.form, 'picUserName', undefined)
      this.$set(this.form, 'picUserId', undefined)
    },
    updatePic(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'picUserName', nickName)
      this.$set(this.form, 'picUserId', userId)
    },
    queryCurrencyListBySelect() {
      this.currencyOptionsLoading = true
      queryCurrencyListBySelect()
        .then((res) => {
          this.currencyOptionsLoading = false
          const list = res.data || []
          this.currencyOptions = list.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
        })
        .catch(() => {
          this.currencyOptionsLoading = false
        })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.calculateExpenseItem()
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'currencyCode', undefined)
    },
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },
    documentTypeChange() {
      this.$set(this.form, 'selectedProductList', [])
      this.$set(this.form, 'logisticsDocumentProductList', [])
      // this.clearExpenseItemProducts()
    },

    /* 第二部分表单 */

    /* 第三部分 表格部分Start */
    updateProductTable(list) {},
    /* 表格部分End */

    /* 第四部分表单 */
    deliveryByChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    deliveryByClear() {
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', undefined)
      this.$set(this.form, 'bpMobileNum', undefined)
      this.$set(this.form, 'bpMobileCode', undefined)
      this.$set(this.form, 'bpMobilePhone', undefined)
      this.$set(this.form, 'bpEmail', undefined)
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

        const validProduct = this.validExpenseItemDetailList(param.logisticsDocumentProductList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          // this.$refs.ProductTable.activeName = 'assignedDetails'
          this.$refs.ProductTable.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        this.$refs.ProductTable.collapseWarningForProductInfo = false

        const validExpenseItem = this.validExpenseItemList(param.logisticsDocumentExpenses)
        if (!validExpenseItem) {
          this.collapseWarningForProductInfo = true
          // this.$refs.ProductTable.activeName = 'expenseItem'
          this.$refs.ProductTable.collapseWarningForShippingAgentFeeDetails = true

          return
        }
        this.$refs.ProductTable.collapseWarningForShippingAgentFeeDetails = false

        // const valid4 = await this.$refs.form4.validate().catch((err) => {
        //   return err
        // })
        // this.collapseWarningForDeliveryInfo = !valid4

        // if (!valid4) {
        //   this.$modal.msgError(
        //     this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.shippingAgentInfo'))
        //   )
        //   return
        // }
        let submitFn = addLogisticsCost
        if (this.isRevise) {
          submitFn = reviseLogisticsCost
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds

        this.$modal
          .confirm(this.$t('PURCHASE.logisticsCostSubmitConfirm'))
          .then(() => {
            this.submitLoading = true
            return submitFn(param)
          })
          .then((response) => {
            if (this.isRevise) {
              this.$modal.msgSuccess(
                this.$t('PURCHASE.logisticsCostSubmitSuccess').replace('$1', response.msg)
              )
            } else {
              this.$modal.msgSuccess(
                this.$t('PURCHASE.logisticsCostSubmitSuccess').replace('$1', response)
              )
            }

            this.submitLoading = false
            this.back()
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    validExpenseItemList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.ShippingAgentFeeDetails'))
        )
        return valid
      }
      const shippingAgentNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.shippingAgentName)
      })
      if (shippingAgentNameReq) {
        this.$refs.ProductTable.errorMessage('shippingAgentName')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.shippingAgent'))
        )
        return valid
      }
      console.log(detailList, '===================734')
      const currencyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.currency)
        // return !this.$resultOfBoolean(item.currencyCode)
      })
      if (currencyReq) {
        this.$refs.ProductTable.errorMessage('currency')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.currency')))
        return valid
      }

      const expenseItemNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.logisticsDocumentExpenseItem)
      })
      if (expenseItemNameReq) {
        this.$refs.ProductTable.errorMessage('logisticsDocumentExpenseItem')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expenseItem'))
        )
        return valid
      }

      const documentNoReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.logisticsDocumentExpenseNo)
      })
      if (documentNoReq) {
        this.$refs.ProductTable.errorMessage('logisticsDocumentExpenseNo')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.documentNo2'))
        )
        return valid
      }

      const amountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$refs.ProductTable.errorMessage('amount')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.amount')))
        return valid
      }

      const fileUploading = detailList.find((item) => {
        return (item.commonFileList || []).find((p) => p.uploading)
      })
      if (fileUploading) {
        this.$modal.msgError(this.$t('ui.uploading'))
        return valid
      }

      detailList.forEach((item) => {
        return (item.commonFileList || []).forEach((p) => {
          p.id = p.fileId
          p.fileName = p.name
        })
      })

      return true
    },
    validExpenseItemDetailList(list) {
      const valid = false

      if (list.length <= 0) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productInfo'))
        )
        return valid
      }

      // const detailList = []
      // list.forEach((item, index) => {
      //   const logisticsDocumentProducts = item.logisticsDocumentProducts || []
      //   logisticsDocumentProducts.forEach((child, index2) => {
      //     detailList.push(child)
      //   })
      // })
      // if (detailList.length <= 0) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productInfo'))
      //   )
      //   return valid
      // }

      if (list.length > 0) {
        const qtyReq = list.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq) {
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
          return valid
        }
      }
      return true
    },
    handleSaveDraft() {
      this.submitForm('save')
    }
    /* handlePreviewPDF() {
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
    } */
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
