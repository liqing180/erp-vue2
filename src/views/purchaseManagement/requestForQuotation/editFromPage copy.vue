<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <!-- {{ checkPermi(['purchaseManagement:requestForQuotation:approval']) }}
      {{ dataType }}
      {{ form.approvedStatus }}
      {{ approvedBtnShow }} -->
      <el-button type="primary" size="mini" v-if="approvedBtnShow" @click="handleApproved"
        >{{ $t('uiBtn.approve') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="rejectedBtnShow" @click="handleRejected"
        >{{ $t('uiBtn.reject1') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="withdrawBtnShow" @click="handleWithdraw"
        >{{ $t('menu.withdraw') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="withdrawApproveBtnShow"
        @click="handleWithdrawApprove"
        >{{ $t('uiBtn.withdrawApprove') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
      <div v-if="comeFrom === '2'" class="bpm-page-menu-title">
        {{ $t('menu.requestForQuotation1') }}
      </div>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick" v-if="false">
        <el-tab-pane :label="$t('PURCHASE.RFQDetails')" name="inquiryDetails"></el-tab-pane>
        <el-tab-pane
          :label="$t('PURCHASE.summary')"
          :disabled="rfqDetailList.length <= 0 || rfqVendorList.length <= 0"
          name="summaryDetails"
        ></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === 'inquiryDetails'">
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
                label-width="190px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                    >
                      <el-input
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="selectDictLabel(dict.type.p_rfq_status, form.rfqStatus)"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.requestForQuotationNo')}`">
                      <el-input v-model="form.rfqNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.dueDate')}`" prop="dueDate">
                      <el-date-picker
                        v-model="form.dueDate"
                        :picker-options="validityDaysPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        disabled
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.automatedEmail')}`">
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                        :disabled="true"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                        disabled
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchasePerson')}`"
                      prop="purchaseContactPersonName"
                    >
                      <SelectInput
                        :value="form.purchaseContactPersonName"
                        :title="form.purchaseContactPersonName"
                        @clear="requiredByClear"
                        clearable
                        @click="openRequiredByTable"
                      />
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
                        :disabled="true"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload ref="uploadRef" :allFileSize="30" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('PURCHASE.priceIncludingTax')}`">
                      <el-switch
                        v-model="form.priceIncludingTax"
                        active-value="1"
                        inactive-value="0"
                        :disabled="true"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :rfqProductList="initRfqDetailList"
                  @updateTable="updateProductTable"
                  @clearSuppliersList="clearSuppliersList"
                  :linkPR="form.rfqType === '2'"
                  :comDisFrom="true"
                  @rowClick="productTableRowClick"
                  :curClickProductRow="curClickProductRow"
                  :rfqVendorList="rfqVendorList"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.supplier')"
                :warning="collapseWarningForVendor"
              >
              </FormCollapseItemTitle>
              <div>
                <!-- <SupplierTable
                  ref="SupplierTable"
                  :rfqVendorList="initRfqVendorList"
                  :productIdList="productIdList"
                  @updateTable="updateSupplierTable"
                  :comDisFrom="true"
                /> -->
                <SupplierTableCopy
                  ref="SupplierTableCopy"
                  :rfqVendorList="initRfqVendorList"
                  :productIdList="productIdList"
                  @updateTable="updateSupplierTable"
                  @changeSupplierTable="changeSupplierTable"
                  @handlePdfRow="handlePdfRow"
                  @resendBPSuccess="resendBPSuccess"
                  :comDisFrom="comDisFrom"
                  :submitBtnShow="!comDisFrom"
                  :curClickProductRow="curClickProductRow"
                  :formData="form"
                />

                <el-form
                  ref="form2"
                  :model="form"
                  @submit.native.prevent
                  :rules="rules"
                  label-width="190px"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-form-item :label="$t('ui.remarks')" prop="reason">
                        <MyInput
                          type="textarea"
                          v-model="form.reason"
                          :autosize="{ minRows: 1, maxRows: 4 }"
                          resize="none"
                          show-word-limit
                          :maxlength="200"
                          :disabled="comDisFrom"
                        ></MyInput>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" v-show="(form.operationLogList || []).length > 0">
            <el-collapse-item name="4">
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
      <div v-if="activeName === 'summaryDetails'">
        <SummaryDetails
          :form="form"
          :rfqDetailList="rfqDetailList"
          :rfqVendorList="rfqVendorList"
        />
      </div>
    </template>
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.rfqId || form.rfqDetailId"
      :taskId="form.taskId"
      fromType="1"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <ApprovedDialog
      :id="form.rfqId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.rfqId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
  </FormPageLayoutTabs>
</template>

<script>
import { queryIncotermList } from '@/api/common/common'
import {
  queryRFQById,
  cancelledRFQ,
  approvedRFQ,
  rejectedRFQ,
  submitRFQ,
  withdrawRFQ,
  withdrawApproved,
  preview
} from '@/api/purchaseManagement/requestForQuotation'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'

import ProductTable from '@/views/purchaseManagement/requestForQuotation/productTable.vue'
// import SupplierTable from '@/views/purchaseManagement/requestForQuotation/supplierTable.vue'
import SupplierTableCopy from '@/views/purchaseManagement/requestForQuotation/supplierTableCopy.vue'

import SummaryDetails from './summaryDetails.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import { getToken } from '@/utils/auth'

export default {
  dicts: ['p_rfq_status'],
  mixins: [pageMixin],
  components: {
    selectPortTable,
    selectWarehouseTable,
    FormPageLayoutTabs,
    ProductTable,
    // SupplierTable,
    SummaryDetails,
    FormCancelDialog,
    SystemOperationLogTable,
    ApprovedDialog,
    RejectDialog,
    SupplierTableCopy
  },
  data() {
    return {
      saveKey: '38',
      savePath: 'purchaseMTable',
      activeName: 'inquiryDetails',
      activeNames: [],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {
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
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],

        dueDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseContactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.requiredBy')),
            trigger: ['change']
          }
        ]
      },
      incotermOptions: [],
      /* 表格部分 */
      initRfqDetailList: [],
      rfqDetailList: [],
      curClickProductRow: {
        productId: undefined
      },
      collapseWarningForProductInfo: false,
      // 供应商数据, 编辑页面ByID成功后赋值一次即可,赋值后列表将被重置成赋值的列表
      initRfqVendorList: [],
      rfqVendorList: [],
      collapseWarningForVendor: false,

      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanCancelled: '0',
        isCanUpdate: '0',
        isCanWithdraw: '0'
      },
      cancelledUrl: cancelledRFQ,
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      /* 审批 */
      rjVisible: false,
      aplVisible: false,
      approvedUrl: approvedRFQ,
      rejectedUrl: rejectedRFQ,
      selectIdList: []
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
    rfqDetailId: {
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
        this.handleUpdate()
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
    productIdList() {
      return this.rfqDetailList.map((row) => row.productId)
    },
    otherSuppliersAuth() {
      return this.checkPermi(['requestForQuotation:pendInquiry:otherSuppliers'])
    },
    pendInquiryCancelAuth() {
      return this.checkPermi(['requestForQuotation:pendInquiry:cancel'])
    },
    pendQuoteCancelAuth() {
      return this.checkPermi(['requestForQuotation:pendQuote:cancel'])
    },
    cancelBtnShow() {
      let show = false
      if (this.buttonAuthMsg.isCanCancelled === '1') {
        if (this.form.rfqId && this.pendQuoteCancelAuth) {
          show = true
        } else if (this.form.rfqDetailId && this.pendInquiryCancelAuth) {
          show = true
        }
      }
      return show
    },
    withdrawBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:withdraw'])) {
        return false
      }
      let show = false
      if (this.form.rfqId && this.buttonAuthMsg.isCanWithdraw === '1') {
        show = true
      }
      return show
    },
    submitBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:submit'])) {
        return false
      }
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (this.dataType === '1' && this.buttonAuthMsg.isCanUpdate === '1') {
        show = true
      }
      return show
    },
    approvedBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:approval'])) {
        return false
      }
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (this.dataType === '1' && this.buttonAuthMsg.isCanApproved === '1') {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:reject'])) {
        return false
      }
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (this.dataType === '1' && this.buttonAuthMsg.isCanRejected === '1') {
        show = true
      }
      return show
    },
    withdrawApproveBtnShow() {
      if (!this.checkPermi(['purchaseManagement:requestForQuotation:withdrawApprove'])) {
        return false
      }
      let show = false

      if (this.buttonAuthMsg.isCanWithdrawApproved === '1') {
        show = true
      }
      return show
    },
    editAuth() {
      return this.checkPermi(['requestForQuotation:pendQuote:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      /*  */
      if (
        ['1', '3'].includes(this.dataType) &&
        this.form.rfqId &&
        this.buttonAuthMsg.isCanUpdate === '1'
      ) {
        dis = false
      }
      return dis
    },
    modifyHighlight() {
      if (this.approvedBtnShow) {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    // 清空pic
    requiredByClear() {
      this.$set(this.form, 'purchaseContactPersonName', undefined)
      this.$set(this.form, 'purchaseContactPersonId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'purchaseContactPersonName', nickName)
      this.$set(this.form, 'purchaseContactPersonId', userId)
    },
    handleWithdrawApprove() {
      this.$modal
        .confirm(this.$t('ui.withdrawApproveConfirm'))
        .then(() => {
          return withdrawApproved({
            businessId: this.form.rfqId,
            taskId: this.taskId || this.form.taskId
          })
        })
        .then((response) => {
          this.$modal.msgSuccess(this.$t('ui.withdrawApproveSuccess'))
          this.handleUpdate()
        })
        .catch(() => {})
    },
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(vm.$t('PURCHASE.rfqCancelledSuccess'))
      vm.back('onCancelSuccess')
    },
    handleUpdate() {
      this.reset()
      queryRFQById({
        rfqId: this.rowId,
        rfqDetailId: this.rfqDetailId
      }).then((res) => {
        const data = res.data || {}
        this.form = { ...data }
        this.initRfqDetailList = data.rfqDetailList || []
        this.initRfqVendorList = data.rfqVendorList || []
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.selectIdList = this.initRfqVendorList
          .filter((item) => item.isSelect === '1')
          .map((x) => x.businessPartnerId)
        setTimeout(() => {
          if (this.$refs.uploadRef) {
            this.$refs.uploadRef.initFileList(data.commonFileList)
          }
        }, 300)
      })
    },
    reset() {
      this.form = {
        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        remarks: '',
        priceIncludingTax: '0',
        automatedEmail: '0'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForVendor = false
      this.initRfqDetailList = []
      this.rfqDetailList = []
      this.initRfqVendorList = []
      this.rfqVendorList = []
      this.activeName = 'inquiryDetails'
      this.activeNames = ['1', '2', '3', '4']
      this.selectIdList = []
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
    },
    // 取消按钮
    back(type) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    },
    handleClick() {},
    /* 表单部分Start */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(value) {
      // const oldType = this.form.incotermAddressType
      const item = this.incotermOptions.find((item) => item.incotermId === value) || {}
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      // if (oldType !== item.incotermAddressType) {
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'addressForWarehouse', undefined)
      // }
    },
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2') {
        this.$refs.selectWarehouseTable.handleOpen()
      }
    },
    // 清空pic
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'addressForWarehouse', undefined)
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      this.$set(this.form, 'addressForWarehouse', row)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
    },
    /* 表单部分End */
    handlePdfRow(row) {
      let param = { ...this.form }
      param.rfqDetailList = this.rfqDetailList
      param.rfqVendorList = [row]
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
      const token = getToken()

      if (row.rfqId) {
        const myUrl =
          process.env.VUE_APP_BASE_API +
          '/purchase/requestForQuotation/preview' +
          `/${row.rfqId}/${row.rfqVendorId}` +
          '?token=' +
          `${token}`
        window.open(myUrl, 'print')
      } else {
        this.$set(row, 'pdfLoading', true)

        preview(param)
          .then((res) => {
            this.$set(row, 'pdfLoading', false)
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
            this.$set(row, 'pdfLoading', false)
          })
      }
    },
    resendBPSuccess() {
      this.back()
    },
    /* 表格部分Start */
    productTableRowClick(row) {
      if (row.productId === this.curClickProductRow.productId) {
        this.$set(this.curClickProductRow, 'productId', undefined)
      } else {
        this.$set(this.curClickProductRow, 'productId', row.productId)
      }
    },
    updateProductTable(list) {
      this.rfqDetailList = list || []
    },
    updateSupplierTable(list) {
      this.rfqVendorList = list || []
    },
    changeSupplierTable(list = []) {
      this.selectIdList = list.map((x) => x.businessPartnerId) || []
    },
    clearSuppliersList() {
      if (!this.otherSuppliersAuth) {
        this.initRfqVendorList = []
        this.rfqVendorList = []
      }
    },
    /* 表格部分End */
    handleWithdraw() {
      const vm = this
      const confirm = vm.$t('PURCHASE.rfqWithdrawConfirm').replace('$1', this.form.rfqNo)
      this.$modal.confirm(confirm).then(() => {
        withdrawRFQ({
          rfqId: vm.form.rfqId
        }).then((res) => {
          if (res.code === 200) {
            vm.$message.success(vm.$t('PURCHASE.rfqWithdrawSuccess').replace('$1', this.form.rfqNo))
            this.back()
          }
        })
      })
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
      vm.$message.success(`${vm.$t('PURCHASE.rfqApprovedSuccess')}`.replace('$1', vm.form.rfqNo))
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
      vm.$message.success(`${vm.$t('PURCHASE.rfqRejectedSuccess')}`.replace('$1', vm.form.rfqNo))
      this.rjVisible = false
      vm.back('onRejectedSuccess')
    },
    async submitForm() {
      if (this.selectIdList.length <= 0) {
        this.$modal.msgError(this.$t(this.$t('PURCHASE.supplierIsEmpty')))
        return
      }
      const valid = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForVendor = !valid
      if (!valid) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.supplier'))
        )
        return
      }
      this.initRfqVendorList.forEach((x) => {
        if (this.selectIdList.indexOf(x.businessPartnerId) !== -1) {
          x.isSelect = '1'
        } else {
          x.isSelect = '0'
        }
      })
      const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
      param.initRfqVendorList = this.initRfqVendorList
      const confirmMsg = this.$t('PURCHASE.rfqSubmitConfirm')
      const successMsg = this.$t('PURCHASE.rfqSubmitSuccess')
      this.$modal
        .confirm(confirmMsg)
        .then(() => {
          return submitRFQ(param)
        })
        .then((response) => {
          this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
          this.back()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss"></style>
