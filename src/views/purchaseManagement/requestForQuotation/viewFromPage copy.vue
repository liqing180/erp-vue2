<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
                  <el-col :span="8" v-if="false">
                    <el-form-item :label="`${$t('PURCHASE.incoterm')}`" prop="incotermId">
                      <el-input
                        :value="form.incotermName"
                        :title="form.incotermName"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
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
                      <el-input v-model="form.status" disabled></el-input>
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
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload ref="uploadRef" :disabled="true" />
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
                <SupplierTable
                  ref="SupplierTable"
                  :rfqVendorList="initRfqVendorList"
                  :productIdList="productIdList"
                  @updateTable="updateSupplierTable"
                  :comDisFrom="true"
                />
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
  </FormPageLayoutTabs>
</template>

<script>
import { queryIncotermList } from '@/api/common/common'
import { queryRFQById, cancelledRFQ } from '@/api/purchaseManagement/requestForQuotation'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'

import ProductTable from '@/views/purchaseManagement/requestForQuotation/productTable.vue'
import SupplierTable from '@/views/purchaseManagement/requestForQuotation/supplierTable.vue'

import SummaryDetails from './summaryDetails.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  mixins: [pageMixin],
  components: {
    selectPortTable,
    selectWarehouseTable,
    FormPageLayoutTabs,
    ProductTable,
    SupplierTable,
    SummaryDetails,
    FormCancelDialog,
    SystemOperationLogTable
  },
  data() {
    const vm = this
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

        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        dueDate: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      incotermOptions: [],
      /* 表格部分 */
      initRfqDetailList: [],
      rfqDetailList: [],
      collapseWarningForProductInfo: false,
      // 供应商数据, 编辑页面ByID成功后赋值一次即可,赋值后列表将被重置成赋值的列表
      initRfqVendorList: [],
      rfqVendorList: [],
      collapseWarningForVendor: false,

      buttonAuthMsg: {
        isCanCancelled: '0'
      },
      cancelledUrl: cancelledRFQ,
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
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
    rfqDetailId: {
      type: String,
      default: ''
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

    /* 表格部分Start */
    updateProductTable(list) {
      this.rfqDetailList = list || []
    },
    updateSupplierTable(list) {
      this.rfqVendorList = list || []
    },
    clearSuppliersList() {
      if (!this.otherSuppliersAuth) {
        this.initRfqVendorList = []
        this.rfqVendorList = []
      }
    }
    /* 表格部分End */
  }
}
</script>
<style lang="scss"></style>
