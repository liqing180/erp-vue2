<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" v-if="!comDisFrom" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <!-- <el-button type="primary" size="mini" :loading="previewPDFLoading" @click="handlePreviewPDF"
        >{{ $t('menu.previewPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="printPDFShow" @click="handlePrintPDF"
        >{{ $t('menu.printPDF') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="exportPDFShow" @click="handleExportPDF"
        >{{ $t('menu.exportPDF') }}
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
                    <el-form-item :label="`${$t('ui.supplier')}`" prop="businessPartnerName">
                      <SelectInput
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openSupplierTable"
                        @clear="supplierClear"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
                      <CommonSelect
                        :id="form.departmentId"
                        :label="form.departmentName"
                        :title="form.allSuperiorName"
                        idKey="departmentId"
                        labelKey="departmentName"
                        :options="deptOptions"
                        @change="departmentChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseOrderNo')}`">
                      <el-input v-model="form.purchaseOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.currencyCode"
                        :label="form.currency"
                        :title="form.currency"
                        idKey="currencyCode"
                        labelKey="currency"
                        :filterable="true"
                        :options="currencyOptions || []"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchasePerson')}`"
                      prop="purchasePersonBy"
                    >
                      <SelectInput
                        :value="form.purchasePersonBy"
                        :title="form.purchasePersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_purchase_order_status,
                            form.purchaseOrderStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIdList">
                      <ToolTipShowList
                        :list="form.paymentMethodNameList || []"
                        :popoverTitle="$t('ui.paymentMethod')"
                      >
                        <CommonMultipleSelect
                          :disabled="!form.businessPartnerId"
                          :ids="form.paymentMethodIdList"
                          :labels="form.paymentMethodNameList"
                          :showTitle="false"
                          idKey="value"
                          labelKey="label"
                          :options="dict.type.business_partner_payment_method"
                          @change="paymentMethodChange"
                        />
                      </ToolTipShowList>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.yourRef')}`">
                      <el-input
                        v-model="form.yourRef"
                        :title="form.yourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row> -->
                <!-- <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <MyInput
                        type="textarea"
                        v-model="form.paymentTermName"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="1000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row> -->
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')">
                      <MyInput
                        type="textarea"
                        v-model="form.basicRemarks"
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
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                  :countryId="form.countryId"
                  :businessPartnerId="form.businessPartnerId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  :comDisFrom="comDisFrom"
                />
              </div>
            </el-collapse-item>
          </div>
          <div class="form-card mt10">
            <el-collapse-item name="4">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.deliveryInfo')"
                :warning="collapseWarningForDeliveryInfo"
              >
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
                    <el-form-item :label="`${$t('PURCHASE.deliveryBy')}`" prop="bpContactPersonId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
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
                    <el-form-item :label="`${$t('PURCHASE.deliveryEmail')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.deliveryMobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress1')}`"
                      prop="bpBusinessAddressId"
                    >
                      <ToolTipShowObj
                        :mData="form.bpBusinessAddress || {}"
                        :showStr="form.bpAddress"
                        :rows="bpAddressRows"
                      >
                        <CommonSelect
                          :disabled="!form.businessPartnerId"
                          :id="form.bpBusinessAddressId"
                          :label="form.bpAddress"
                          idKey="businessAddressId"
                          labelKey="label"
                          :options="form.bpBusinessAddressList || []"
                          @change="deliveryAddressChange"
                        />
                      </ToolTipShowObj>
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
    <selectSupplierTable ref="selectSupplierTable" shippingAgent="1" @update="updateSupplier" />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />

    <ApprovedDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.purchaseOrderId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />
  </FormPageLayout>
</template>

<script>
import { queryUserDepartment } from '@/api/system/user'
import { queryCurrencyListBySelect } from '@/api/basic/basic'

import {
  savePurchaseOrder,
  saveDraftPurchaseOrder,
  queryPurchaseOrderById,
  approvedPurchaseOrder,
  rejectedPurchaseOrder,
  cancelledPO,
  preview
} from '@/api/purchaseManagement/purchaseOrder'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from '../components/selectSupplierTable.vue'
import selectPurchasePersonTable from '../components/selectPurchasePersonTable.vue'
import ProductTable from '@/views/purchaseManagement/purchaseOrder/logistics/components/productInfo.vue'

import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'

import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

import { getToken } from '@/utils/auth'

export default {
  mixins: [pageMixin],
  dicts: ['p_purchase_order_status', 'business_partner_payment_method'],
  components: {
    selectSupplierTable,
    selectPurchasePersonTable,
    ProductTable,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    SystemOperationLogTable
  },
  data() {
    return {
      previewPDFLoading: false,
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        logisticsExpenseList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForDeliveryInfo: false,
      rules: {
        businessPartnerName: [
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
        taxRate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        paymentTermName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        paymentMethodIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        committedDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        incotermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        receiveAddressName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requestedBy: [
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
      deptOptions: [],
      currencyOptions: [],
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
      bpAddressRows: [
        {
          label: this.$t('INVENTORY.label'),
          showLabel: 'label'
        },
        {
          label: this.$t('organization.address1'),
          showLabel: 'address1'
        },
        {
          label: this.$t('organization.address2'),
          showLabel: 'address2'
        },
        {
          label: this.$t('organization.city'),
          showLabel: 'city'
        },
        {
          label: this.$t('organization.province'),
          showLabel: 'province'
        },
        {
          label: this.$t('organization.postalCode'),
          showLabel: 'postalCode'
        },
        {
          label: this.$t('organization.country'),
          showLabel: 'country'
        }
      ],

      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedPurchaseOrder,
      rejectedUrl: rejectedPurchaseOrder,
      cancelledUrl: cancelledPO,
      /* 版本比对高亮 */
      basicUpdateProps: []
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
    editAuth() {
      return this.checkPermi(['purchaseManagement:purchaseOrder:edit'])
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
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.getPoById()
    },
    getPoById() {
      const rowId = this.rowId
      queryPurchaseOrderById({ purchaseOrderId: rowId }).then((res) => {
        const data = res.data || {}
        data.logisticsExpenseList = data.logisticsExpenseList || []
        this.initCommonFileList = data.commonFileList || []
        const addressForWarehouse = data.addressForWarehouse || {}
        const warehouseAddress = addressForWarehouse.warehouseAddress || {}
        data.addressForWarehouse = { ...addressForWarehouse, ...warehouseAddress }
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        /* 版本比对 */
        const updateMsg = data.updateMsg || {}
        const basicUpdateMsgList = updateMsg.basicUpdateMsgList || []
        const beforeCommonFileList = updateMsg.beforeCommonFileList || []
        const afterCommonFileList = updateMsg.afterCommonFileList || []

        setTimeout(() => {
          this.basicUpdateProps = basicUpdateMsgList.map((item) => item.name)
          if (beforeCommonFileList.length > 0 || afterCommonFileList.length > 0) {
            this.basicUpdateProps.push('attachment')
          }
        }, 100)
      })
    },
    reset() {
      this.form = {
        /* 基础信息 */
        purchaseOrderNo: undefined,
        businessPartnerName: undefined,
        purchaseOrderStatus: undefined,
        businessPartnerId: undefined,
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
        basicRemarks: undefined,
        isLogistics: '1',

        logisticsExpenseList: [],

        bpEmail: undefined,
        mobilePhone: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForDeliveryInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
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
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.currencyClear()
      this.paymentMethodChange([], [])
      this.deliveryByClear()
      this.deliveryAddressClear()
      this.$set(this.form, 'logisticsExpenseList', [])
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
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
      this.deliveryAddressClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.deliveryByChange(defaultContact)
        }
      }
      if (row.bpBusinessAddressList && row.bpBusinessAddressList.length === 1) {
        this.deliveryAddressChange(row.bpBusinessAddressList[0])
      }
      this.$set(this.form, 'logisticsExpenseList', [])
    },
    queryUserDepartment() {
      queryUserDepartment({ menuPerms: this.menuKey.PO }).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
          }
        })
      })
    },
    departmentChange(item) {
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      if (this.form.purchasePersonId !== this.$store.state.user.userId) {
        this.purchasePersonClear()
      }
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
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
      queryCurrencyListBySelect().then((res) => {
        const list = res.data || []
        this.currencyOptions = list.map((item) => {
          item.label = `${item.currencyCode} (${item.currencyDesc})`
          return item
        })
      })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)

      this.$set(this.form, 'logisticsExpenseList', [])
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.$set(this.form, 'logisticsExpenseList', [])
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
    deliveryAddressChange(row) {
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressId', row.businessAddressId)
      this.$set(this.form, 'bpAddressDataId', row.bpAddressDataId)
      this.$set(this.form, 'bpAddress', row.label)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
    },
    /* 表单部分End */

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

        const validExpenseItem = this.validExpenseItemList(param.logisticsExpenseList)
        if (!validExpenseItem) {
          this.collapseWarningForProductInfo = true
          this.$refs.ProductTable.activeName = 'expenseItem'
          return
        }
        const validProduct = this.validExpenseItemDetailList(param.logisticsExpenseList)
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
            this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.deliveryInfo'))
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
        return !this.$resultOfBoolean(item.expenseItemName)
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
        const logisticsExpenseDetailList = item.logisticsExpenseDetailList || []
        logisticsExpenseDetailList.forEach((child, index2) => {
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
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
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
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
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
          `${this.$t('PURCHASE.purchaseOrder')} [${vm.form.purchaseOrderNo}]`
        )
      )
      vm.back('onCancelSuccess')
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
