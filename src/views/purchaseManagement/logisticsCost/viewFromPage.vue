<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" v-if="!comDisFrom" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="reviseBtnShow" @click="handleRevise"
        >{{ $t('uiBtn.revise') }}
      </el-button>
      <el-dropdown
        class="ml10 mr10"
        @command="(command) => settingHandleCommand(command)"
        trigger="click"
        v-if="bpHistoryVersionList.length > 0"
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
                <!-- <span class="info-item mr20">
                  {{ $t('PURCHASE.shippingAgent') }} : {{ form.shippingAgentName }}
                </span>
                <span class="info-item mr20"> {{ $t('ui.currency') }} : {{ form.currency }} </span> -->
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
                        :disabled="true"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="true"
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
                        style="width: 100%"
                        disabled
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
                      <el-input :value="form.picUserName" :title="form.picUserName" disabled />
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
                <!-- <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.automatedEmail')}`">
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.logistics')}`">
                      <el-switch
                        v-model="form.isLogistics"
                        active-value="1"
                        inactive-value="0"
                        disabled
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row> -->
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10 collapse-item-content-pt0">
            <ProductTable
              ref="ProductTable"
              :formData="form"
              :countryId="form.countryId"
              :shippingAgentId="form.shippingAgentId"
              :currencyId="form.currencyId"
              :currencyOptions="currencyOptions"
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
                  :comDisFrom="comDisFrom"
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
                :disabled="comDisFrom"
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
                <SystemOperationLogTable :tableList="form.operationLogList || []" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
  </FormPageLayout>
</template>

<script>
import { queryCurrencyListBySelect } from '@/api/basic/basic'

import {
  savePurchaseOrder,
  saveDraftPurchaseOrder,
  approvedPurchaseOrder,
  rejectedPurchaseOrder,
  cancelledPO,
  preview
} from '@/api/purchaseManagement/purchaseOrder'
import {
  getLogisticsCostById,
  queryLogisticsDocumentHistoryVersion
} from '@/api/purchaseManagement/logisticsCost'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import ProductTable from '@/views/purchaseManagement/logisticsCost/components/productInfo.vue'

import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

import { getToken } from '@/utils/auth'

export default {
  mixins: [pageMixin],
  dicts: ['logistics_document_type'],
  components: {
    ProductTable,
    SystemOperationLogTable
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        logisticsDocumentExpenses: []
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
        purchasePersonBy: [
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
      currencyOptions: [],
      currencyOptionsLoading: false,
      incotermOptions: [],
      freightTaxNoOptions: [],
      /* 表格部分 */
      initCommonFileList: [],
      collapseWarningForProductInfo: false,
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
      approvedUrl: approvedPurchaseOrder,
      rejectedUrl: rejectedPurchaseOrder,
      cancelledUrl: cancelledPO,
      /* 版本比对高亮 */
      basicUpdateProps: [],
      bpHistoryVersionList: []
    }
  },
  props: {
    isView: {
      type: Boolean,
      default: false
    },
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
      if (this.isView) {
        return true
      }
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    },

    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },

    previewPDFShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:previewPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanPreviewPDF === '1'
      ) {
        show = true
      }
      return show
    },
    printPDFShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:printPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanPrintPDF === '1'
      ) {
        show = true
      }
      return show
    },
    exportPDFShow() {
      if (!this.checkPermi(['purchaseManagement:purchaseOrder:exportPDF'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.purchaseOrderId &&
        this.buttonAuthMsg.isCanDownloadPDF === '1'
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
    },
    reviseBtnShow() {
      let show = false
      if (!this.editAuth) {
        return false
      }
      if (
        this.form.logisticsDocumentId &&
        this.buttonAuthMsg.isCanRevise === '1' &&
        this.comeFrom === '1'
      ) {
        show = true
      }
      return show
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
      this.getPoById()
      this.queryLogisticsDocumentHistoryVersion()
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
    reset() {
      this.form = {
        /* 基础信息 */
        purchaseOrderNo: undefined,
        shippingAgentName: undefined,
        purchaseOrderStatus: undefined,
        shippingAgentId: undefined,
        bpContactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        departmentId: undefined,
        departmentName: undefined,
        allSuperiorName: undefined,
        purchasePersonBy: this.$store.state.user.nickName,
        purchasePersonId: this.$store.state.user.userId,
        currencyId: undefined,
        currency: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        isLogistics: '1',

        logisticsDocumentExpenses: [],

        bpEmail: undefined,
        mobilePhone: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4', '5']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
      this.resetForm('form4')
    },
    // 取消按钮
    back(type) {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseOrder' })
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form1.validateField(code)
    },
    openSupplierTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'shippingAgentId', undefined)
      this.$set(this.form, 'shippingAgentName', undefined)
      this.$set(this.form, 'shippingAgentNo', undefined)
      this.$set(this.form, 'shippingAgentAbbreviation', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.deliveryByClear()
      this.$set(this.form, 'logisticsDocumentExpenses', [])
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'shippingAgentId', row.businessPartnerId)
      this.$set(this.form, 'shippingAgentName', row.businessPartnerName)
      this.$set(this.form, 'shippingAgentNo', row.businessPartnerNo)
      this.$set(this.form, 'shippingAgentAbbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
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

      this.$set(this.form, 'logisticsDocumentExpenses', [])
    },

    purchasePersonClear() {
      this.$set(this.form, 'purchasePersonBy', undefined)
      this.$set(this.form, 'purchasePersonId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'purchasePersonBy', nickName)
      this.$set(this.form, 'purchasePersonId', userId)
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

      this.$set(this.form, 'logisticsDocumentExpenses', [])
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'logisticsDocumentExpenses', [])
    },
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
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
    /* 表单部分End */
    handleRevise() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({
        path: '/purchaseManagement/reviseLogisticsCost',
        query: {
          id: this.form.logisticsDocumentId,
          timeId: Date.now()
        }
      })
    },

    async submitForm(submitType) {
      const myFileIds = this.$refs.ProductTable.getFileIds()
      if (myFileIds === false) {
        return
      }
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

        const validExpenseItem = this.validExpenseItemList(param.logisticsDocumentExpenses)
        if (!validExpenseItem) {
          this.collapseWarningForProductInfo = true
          this.$refs.ProductTable.activeName = 'expenseItem'
          return
        }
        const validProduct = this.validExpenseItemDetailList(param.logisticsDocumentExpenses)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          this.$refs.ProductTable.activeName = 'assignedDetails'
          return
        }
        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds
        const valid4 = await this.$refs.form4.validate().catch((err) => {
          return err
        })
        this.collapseWarningForDeliveryInfo = !valid4

        if (!valid4) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.shippingAgentInfo'))
          )
          return
        }

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.poSaveConfirm')
          successMsg = this.$t('PURCHASE.poSaveSuccess')
          submitFn = saveDraftPurchaseOrder
        } else {
          confirmMsg = this.$t('PURCHASE.poSubmitConfirm')
          successMsg = this.$t('PURCHASE.poSubmitSuccess')
          submitFn = savePurchaseOrder
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
    validExpenseItemList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const expenseItemNameReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.logisticsDocumentExpenseItem)
      })
      if (expenseItemNameReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expenseItem'))
        )
        return valid
      }

      const documentNoReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.documentNo)
      })
      if (documentNoReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.documentNo2'))
        )
        return valid
      }

      const amountReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.amount')))
        return valid
      }

      return true
    },
    validExpenseItemDetailList(list) {
      const detailList = []
      list.forEach((item, index) => {
        const logisticsDocumentProducts = item.logisticsDocumentProducts || []
        logisticsDocumentProducts.forEach((child, index2) => {
          detailList.push(child)
        })
      })
      const valid = false
      if (detailList.length > 0) {
        const qtyReq = detailList.find((item) => {
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
    },
    handlePreviewPDF() {
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
    },
    handlePrintPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/preview' +
        `/${this.form.purchaseOrderId}` +
        '?token=' +
        `${token}`
      window.open(myUrl, 'print')
    },
    handleExportPDF() {
      const token = getToken()
      const myUrl =
        process.env.VUE_APP_BASE_API +
        '/purchase/purchaseOrder/download' +
        `/${this.form.purchaseOrderId}` +
        '?token=' +
        `${token}`
      window.location = myUrl
    },
    queryLogisticsDocumentHistoryVersion() {
      queryLogisticsDocumentHistoryVersion({ businessId: this.rowId }).then((res) => {
        this.bpHistoryVersionList = res.data || []
      })
    },
    dropdownVisibleChange() {
      /* 下拉菜单关闭后滚动条 手动还原 */
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.moveY = 0
      }
    },
    settingHandleCommand(businessId) {
      this.$router
        .replace({
          path: '/redirect' + '/purchaseManagement/viewLogisticsCost',
          query: {
            id: businessId,
            timeId: Date.now()
          }
        })
        .catch()
    },
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
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
