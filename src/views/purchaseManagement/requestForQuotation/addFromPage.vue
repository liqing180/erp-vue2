<template>
  <FormPageLayoutTabs ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
      <el-button type="primary" size="mini" v-if="cancelBtnShow" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
      </el-button>

      <el-button type="primary" @click="backFN" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
                    <el-form-item :label="`${$t('PURCHASE.dueDate')}`" prop="dueDate">
                      <el-date-picker
                        v-model="form.dueDate"
                        :picker-options="validityDaysPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input v-model="form.rfqStatusShowStr" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.requestForQuotationNo')}`">
                      <el-input v-model="form.requestForQuotationNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.dropShipping')}`">
                      <el-switch
                        v-model="form.dropShipping"
                        active-value="1"
                        inactive-value="0"
                        @change="dropShippingChange"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      v-if="form.dropShipping === '1'"
                    >
                      <!-- <el-input
                          v-model="form.receiveAddressName"
                          :title="form.receiveAddressName"
                          maxlength="200"
                        ></el-input> -->
                      <el-autocomplete
                        v-model="form.receiveAddressName"
                        :fetch-suggestions="querySearch"
                        placeholder=""
                        @select="receiveAddressNameChange"
                        :maxlength="200"
                        style="width: 100%"
                        :suffixIcon="
                          (initForm.dropReceiveAddressList || []).length > 0
                            ? 'el-icon-arrow-up'
                            : ''
                        "
                        :clearable="true"
                      ></el-autocomplete>
                    </el-form-item>

                    <el-form-item
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                      v-else
                    >
                      <CommonSelectAndList
                        :id="form.receiveAddressId"
                        :label="form.receiveAddressName"
                        idKey="warehouseId"
                        labelKey="warehouseName"
                        filterable
                        :options="warehouseOptions"
                        :loading="warehouseOptionsLoading"
                        @change="updateWarehouse"
                        @handleOpen="openReceiveAddressTable"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row v-if="form.dropShipping === '1'">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.consignee')}`" prop="requestedBy">
                      <div class="input-switch-box">
                        <div class="con-left">
                          <CommonSelect
                            :id="form.requestedId"
                            :label="form.requestedBy"
                            :title="form.requestedBy"
                            idKey="requestedId"
                            labelKey="requestedBy"
                            :options="requestedList"
                            @change="contactPersonChange"
                            v-if="isRequestedFromSalesOrder === '1'"
                          />
                          <!-- <el-input
                            v-else
                            v-model="form.requestedBy"
                            :title="form.requestedBy"
                            maxlength="200"
                          ></el-input> -->

                          <el-autocomplete
                            v-else
                            v-model="form.requestedBy"
                            :fetch-suggestions="requestedByQuerySearch"
                            placeholder=""
                            @select="requestedByChange"
                            :maxlength="200"
                            style="width: 100%"
                            :suffixIcon="
                              (initForm.requestedList || []).length > 0 ? 'el-icon-arrow-up' : ''
                            "
                            :clearable="true"
                          ></el-autocomplete>
                        </div>
                        <div class="con-right" v-if="false">
                          <svg-icon
                            icon-class="add"
                            style="height: 25px; width: 25px"
                            @click="openAddContactPersonDlg"
                          ></svg-icon>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`" prop="requestedEmail">
                      <el-input
                        v-model="form.requestedEmail"
                        :title="form.requestedEmail"
                        :disabled="emailOrPhoneDisabled('email')"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.requestedMobilePhone')}`"
                      prop="requestedMobilePhone"
                      ref="mobileNoRef"
                    >
                      <el-input
                        v-model="form.requestedMobilePhone"
                        :title="form.requestedMobilePhone"
                        :disabled="emailOrPhoneDisabled('phone')"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('PURCHASE.purchaser')}`"
                      prop="purchaseContactPersonName"
                    >
                      <CommonSelectAndList
                        :id="form.purchaseContactPersonId"
                        :label="form.purchaseContactPersonName"
                        idKey="userId"
                        labelKey="nickName"
                        filterable
                        :options="requiredByOptions"
                        :loading="requiredByOptionsLoading"
                        @change="updateRequiredBy"
                        @handleOpen="openRequiredByTable"
                      />
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

                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload
                        ref="uploadRef"
                        :allFileSize="30"
                        :limit="999999"
                        :disabled="false"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.automatedEmail')}`">
                      <el-switch
                        v-model="form.automatedEmail"
                        active-value="1"
                        inactive-value="0"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
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
                  :reqInquirySupplierQuantity="form.inquirySupplierQuantity"
                  @updateTable="updateSupplierTable"
                  @handlePdfRow="handlePdfRow"
                  :quoteLinkEnabled="quoteLinkEnabled"
                />
              </div>
            </el-collapse-item>
          </div>

          <div class="form-card mt10" ref="collapseScrollPage">
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
                  :allUomList="allUomList"
                  :rfqVendorList="rfqVendorList"
                  :linkPR="form.rfqType === '2' || form.rfqType === '3' || form.rfqType === '4'"
                  :dropShipping="form.dropShipping"
                  @updateForm="updateForm"
                  :formData="form"
                  @updateInitFrom="updateInitFrom"
                />
                <!-- 2有采购申请 或 3来自销售需求 或 4来自销售报价 -->
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
      :id="propRfqDetailIds"
      fromType="1"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <selectRequiredByTable ref="selectRequiredByTable" @update="updateRequiredBy" />

    <selectCostProjectTable
      ref="selectCostProjectTable"
      :departmentId="form.departmentId"
      @update="updateCostProjectName"
    />
    <!-- :departmentId="form.departmentId" -->

    <addContactPersonDlg ref="addContactPersonDlg" @update="contactPersonChange" />
  </FormPageLayoutTabs>
</template>

<script>
import { formDirtyClass } from '@/mixins/formDirtyClass'

import { queryIncotermList, queryDateAfterWorkingDays } from '@/api/common/common'
import { queryUsers } from '@/api/organization/corporate'
import {
  saveRFQ,
  initRFQFromPR,
  cancelledRFQ,
  preview,
  saveDraftRFQ,
  initRFQFromPRSelectAddress,
  queryUnapprovedAdhocProductNameList,
  queryRFQCanSelectWarehouseList
} from '@/api/purchaseManagement/requestForQuotation'
import { queryAllUomList } from '@/api/system/uom'
import selectRequiredByTable from '@/views/purchaseManagement/requestForQuotation/components/selectRequiredByTable.vue'
import addContactPersonDlg from './components/addContactPersonDlg.vue'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import FormPageLayoutTabs from '@/components/formPageLayoutTabs/index.vue'

import ProductTable from '@/views/purchaseManagement/requestForQuotation/productTable.vue'
import SupplierTable from '@/views/purchaseManagement/requestForQuotation/supplierTable.vue'
import selectCostProjectTable from '@/views/purchaseManagement/purchaseRequisition/components/selectCostProjectTable.vue'
import { getSystemSetup } from '@/api/system/systemSetting'

import SummaryDetails from './summaryDetails.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import { getToken } from '@/utils/auth'
export default {
  dicts: [
    'pr_reason_type',
    'p_required_type',
    'valuation_unit',
    'product_type',
    'business_contact_person_title'
  ],
  mixins: [pageMixin],
  components: {
    selectPortTable,
    selectWarehouseTable,
    FormPageLayoutTabs,
    ProductTable,
    SupplierTable,
    SummaryDetails,
    FormCancelDialog,
    selectRequiredByTable,
    selectCostProjectTable,
    addContactPersonDlg
  },
  data() {
    const vm = this
    const receiveAddressNameValidator = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === '') {
        if (vm.form.dropShipping !== '1' && vm.warehouseOptions.length > 0) {
          callback(new Error(vm.$t('PURCHASE.selectAddress')))
        } else if (
          vm.form.dropShipping === '1' &&
          vm.initForm.dropReceiveAddressList &&
          vm.initForm.dropReceiveAddressList.length > 0
        ) {
          callback(new Error(vm.$t('PURCHASE.selectAddress')))
        } else {
          callback(new Error(vm.$t('ui.reqMsg')))
        }
      } else {
        callback()
      }
    }
    return {
      saveKey: '34',
      savePath: 'purchaseMTable',
      activeName: 'inquiryDetails',
      activeNames: [],
      rowId: '',
      timeId: '',
      submitLoading: false,
      form: {},
      initForm: {},
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
          // {
          //   required: true,
          //   // eslint-disable-next-line
          //   pattern: new RegExp(/^(?!(\s+$))/g),
          //   message: this.$t('ui.reqMsg'),
          //   trigger: ['change']
          // },
          {
            required: true,
            validator: receiveAddressNameValidator,
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
        ],
        purchaseContactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('PURCHASE.requiredBy')),
            trigger: ['change']
          }
        ],
        requestedBy: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        requestedEmail: [
          // {
          //   required: true,
          //   // eslint-disable-next-line prefer-regex-literals
          //   pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
          //   message: vm.$t('ui.reqMsg'),
          //   trigger: ['change', 'blur']
          // }
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        requestedMobilePhone: [
          {
            required: false,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      incotermOptions: [],
      warehouseOptions: [],
      warehouseOptionsLoading: false,
      requiredByOptions: [],
      requiredByOptionsLoading: false,
      /* 表格部分 */
      initRfqDetailList: [],
      rfqDetailList: [],
      allUomList: [],
      collapseWarningForProductInfo: false,
      // 供应商数据, 编辑页面ByID成功后赋值一次即可,赋值后列表将被重置成赋值的列表
      initRfqVendorList: [],
      rfqVendorList: [],
      collapseWarningForVendor: false,
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      cancelledUrl: cancelledRFQ,
      requestedList: [],
      isRequestedFromSalesOrder: undefined,
      // 发送报价外部链接，1 开 0 关
      quoteLinkEnabled: '0'
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
    propRfqDetailIds: {
      type: String,
      default: ''
    },
    mergeForm: {
      type: Object,
      default: function () {
        return {
          isMergePrAddress: undefined,
          receiveAddressId: undefined,
          receiveAddressName: undefined,
          dropShipping: undefined
        }
      }
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
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
    cancelBtnShow() {
      let show = false
      if (!this.form.rfqStatus || this.form.rfqStatus === '1') return false
      if (
        this.propRfqDetailIds &&
        this.propRfqDetailIds.split(',').length === 1 &&
        this.pendInquiryCancelAuth
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
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    emailOrPhoneDisabled() {
      if (!this.propRfqDetailIds) return false
      if (this.isRequestedFromSalesOrder !== '1') {
        return false
      }
      return this.requestedList.some((x) => x.isEmailPhoneConflict !== '1')
    },
    contactPersonChange(row) {
      // this.$set(this.form, 'requestedId', row.requestedId)
      this.$set(this.form, 'requestedBy', row.requestedBy)
      this.$set(this.form, 'requestedMobileCode', row.requestedMobileCode)
      this.$set(this.form, 'requestedMobileNum', row.requestedMobileNum)
      this.$set(this.form, 'requestedMobilePhone', row.requestedMobilePhone)
      this.$set(this.form, 'requestedEmail', row.requestedEmail)
    },
    openAddContactPersonDlg() {
      this.$refs.addContactPersonDlg.handleEdit()
    },
    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen()
    },
    costProjectNameClear() {
      this.$set(this.form, 'costProjectName', undefined)
      this.$set(this.form, 'costProjectId', undefined)
      this.$set(this.form, 'costProjectCode', undefined)
    },
    updateCostProjectName(row) {
      const { costProjectName, costProjectId, costProjectCode } = row
      this.$set(this.form, 'costProjectName', costProjectName)
      this.$set(this.form, 'costProjectId', costProjectId)
      this.$set(this.form, 'costProjectCode', costProjectCode)
    },

    queryRequiredByOptions() {
      this.requiredByOptionsLoading = true
      queryUsers({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.RFQ
      })
        .then((res) => {
          this.requiredByOptionsLoading = false
          this.requiredByOptions = res.rows || []
        })
        .catch(() => {
          this.requiredByOptionsLoading = false
        })
    },
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
    handleCancel() {
      this.$refs.FormCancelDialog.handleOpen()
    },
    cancelSubmitSuccess() {
      const vm = this
      vm.$message.success(vm.$t('PURCHASE.rfqCancelledSuccess'))
      vm.cancel()
    },
    querySearch(queryString, cb) {
      const vm = this
      const brandList = (vm.initForm.dropReceiveAddressList || []).map((x) => {
        return {
          value: x
        }
      })

      let results
      if (queryString) {
        results = brandList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = brandList
      }
      cb(results)
    },

    receiveAddressNameChange(val) {
      this.form.receiveAddressName = val.value
    },
    requestedByQuerySearch(queryString, cb) {
      const vm = this
      const brandList = (vm.initForm.requestedList || []).map((x) => {
        return {
          value: x.requestedBy
        }
      })

      let results
      if (queryString) {
        results = brandList.filter(
          (umo) => umo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      } else {
        results = brandList
      }
      cb(results)
    },
    requestedByChange(val) {
      console.log(val, '================719')
      this.form.requestedBy = val.value
      if (val.value && this.initForm.requestedList && this.initForm.requestedList.length > 0) {
        const row = this.initForm.requestedList.find(
          (x) => x.requestedBy.toLowerCase().indexOf(val.value.toLowerCase()) !== -1
        )

        this.$set(this.form, 'requestedMobileCode', row.requestedMobileCode)
        this.$set(this.form, 'requestedMobileNum', row.requestedMobileNum)
        this.$set(this.form, 'requestedMobilePhone', row.requestedMobilePhone)
        this.$set(this.form, 'requestedEmail', row.requestedEmail)
      }
    },
    rowContactPersonChange(value, row) {
      const data = value || {}
      this.$set(row, 'businessContactPersonId', data.businessContactPersonId)
      this.$set(row, 'contactPersonId', data.contactPersonId)
      this.$set(row, 'contactPersonName', data.contactPersonName)
      this.$set(row, 'email', data.email)
      this.$set(row, 'mobileCode', data.mobileCode)
      this.$set(row, 'mobileNum', data.mobileNum)
      this.$set(row, 'mobilePhone', data.mobilePhone)
      this.$set(row, 'contactPersonNameError', false)
    },
    handleAdd() {
      this.initForm = {}
      this.reset()
      this.queryIncotermList()
      this.queryAllUomList()
      this.queryRFQCanSelectWarehouseList()
      this.queryRequiredByOptions()
      this.queryDateAfterWorkingDays()
      this.getSystemSetup()
      if (!this.propRfqDetailIds) {
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
      }
      if (this.propRfqDetailIds) {
        let params = {
          rfqDetailIdList: this.propRfqDetailIds.split(',')
        }
        let api = initRFQFromPR
        if (this.mergeForm.isMergePrAddress === '1') {
          params = {
            ...params,
            ...this.mergeForm
          }
          api = initRFQFromPRSelectAddress
          this.$set(this.form, 'dropShipping', this.mergeForm.dropShipping)
        }
        api(params).then((res) => {
          const data = res.data || {}
          this.isRequestedFromSalesOrder = data.isRequestedFromSalesOrder
          const initRfqDetailList = data.rfqDetailList || []

          this.initRfqDetailList = initRfqDetailList
          console.log(this.initRfqDetailList, '============795')
          this.requestedList = (data.requestedList || []).map((x, i) => {
            return {
              ...x,
              requestedId: +new Date() + i + ''
            }
          })
          if (this.isRequestedFromSalesOrder === '1' && this.requestedList.length === 1) {
            this.contactPersonChange(this.requestedList[0])
          }
          /* const list = data.rfqVendorList || []
          list.forEach((item) => {
            const contactPersonList = item.bpBusinessContactPersonList || []
            contactPersonList.forEach((contactRow) => {
              if (contactRow.isPurchaseDefault === '1') {
                this.rowContactPersonChange(contactRow, item)
              }
            })
          })
          this.initRfqVendorList = list */
          // this.$set(this.form, 'remarks', data.remarks)
          setTimeout(() => {
            if (this.$refs.uploadRef) {
              this.$refs.uploadRef.initFileList(data.commonFileList)
            }
          }, 300)
          this.$set(this.form, 'rfqType', data.rfqType)
          this.$set(this.form, 'dropShipping', data.dropShipping)
          this.$set(this.form, 'rfqStatusShowStr', data.rfqStatusShowStr)
          this.$set(this.form, 'incotermAddressType', data.incotermAddressType)
          this.$set(this.form, 'receiveAddressId', data.receiveAddressId)
          this.$set(this.form, 'receiveAddressName', data.receiveAddressName)
          this.$set(this.form, 'addressForWarehouse', data.addressForWarehouse || {})
          this.$set(this.form, 'rfqStatus', data.rfqStatus)
          this.$set(this.form, 'requestedBy', data.requestedBy)
          this.$set(this.form, 'requestedMobileCode', data.requestedMobileCode)
          this.$set(this.form, 'requestedMobileNum', data.requestedMobileNum)
          this.$set(this.form, 'requestedMobilePhone', data.requestedMobilePhone)
          this.$set(this.form, 'requestedEmail', data.requestedEmail)
          this.$set(this.form, 'costProjectName', data.costProjectName)
          this.$set(this.form, 'costProjectId', data.costProjectId)
          this.$set(this.form, 'costProjectCode', data.costProjectCode)
          this.$set(this.form, 'ourRef', data.ourRef)

          this.$nextTick(() => {
            // this.$refs.form1.clearValidate('receiveAddressName')
            this.$refs.form1 && this.$refs.form1.validateField('receiveAddressName')
          })
          this.initForm = data
          const isNoCanOpenDropFromSalesNoEnoughInventoryList = this.initRfqDetailList.filter(
            (x) => x.isNoCanOpenDropFromSalesNoEnoughInventory === '1'
          )
          if (
            this.form.dropShipping === '1' &&
            isNoCanOpenDropFromSalesNoEnoughInventoryList.length > 0
          ) {
            const productNameList = isNoCanOpenDropFromSalesNoEnoughInventoryList.map(
              (x) => x.productName
            )
            let str = ''
            if (productNameList.length > 5) {
              str = productNameList.slice(0, 5).join(', ') + '...'
            } else {
              str = productNameList.join(', ')
            }

            this.$modal.msgError(this.$t('PURCHASE.cannotMerged').replace('$1', str))
            setTimeout(() => {
              this.$set(this.form, 'dropShipping', '0')
            }, 200)
          }

          if (!this.form.rfqStatus || this.form.rfqStatus === '1' || this.form.rfqStatus === '7') {
            this.queryUnapprovedAdhocProductNameList()
          }
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
          }, 500)
        })
      }
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        this.quoteLinkEnabled = data.quoteLinkEnabled || '0'
      })
    },
    updateInitFrom(data) {
      this.initForm = { ...data }
      this.$nextTick(() => {
        this.$refs.form1 && this.$refs.form1.validateField('receiveAddressName')
      })
    },
    queryDateAfterWorkingDays() {
      queryDateAfterWorkingDays({ workingDays: 3 }).then((res) => {
        const timer = res.data
        if (timer) {
          if (!this.form.dueDate) {
            this.$set(this.form, 'dueDate', Number(timer))
            formDirtyClass.updatedInitFormJsonProp(this.$route.name, {
              dueDate: Number(timer)
            })
          }
        }
      })
    },
    queryUnapprovedAdhocProductNameList() {
      const that = this
      const openConfirm = (tempProductNameList) => {
        const h = that.$createElement
        const contents = []
        contents.push(h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unApproval1')))
        tempProductNameList.forEach((x) => {
          const span1 = h(
            'span',
            {
              style:
                'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
            },
            ''
          )
          const span2 = h('span', { style: 'font-size: 14px' }, x)
          contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
        })
        const content = h('p', null, contents)
        this.$alert(content, '', {
          confirmButtonText: this.$t('uiBtn.confirm'),
          cancelButtonText: this.$t('uiBtn.back'),
          showCancelButton: false,
          showClose: false,
          type: 'warning',
          customClass: 'custom-class'
        })
          .then(() => {})
          .catch(() => {})
      }

      const productIdList = this.initRfqDetailList
        .filter((x) => x.productId)
        .map((k) => k.productId)
      // 筛选 没有productId 并且 isAdhocEntry === 1 的临时产品
      const isAdhocEntryProductList = this.initRfqDetailList.filter(
        (x) => !x.productId && x.isAdhocEntry === '1'
      )
      if (productIdList.length > 0) {
        queryUnapprovedAdhocProductNameList({ productIdList }).then((res) => {
          let tempProductNameList = res.data || []
          if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
            tempProductNameList = [
              ...tempProductNameList,
              ...isAdhocEntryProductList.map((x) => x.productName)
            ]
          }
          if (tempProductNameList && tempProductNameList.length > 0) {
            const h = that.$createElement
            const contents = []
            contents.push(h('div', { style: 'font-size: 14px' }, that.$t('PURCHASE.unApproval1')))
            tempProductNameList.forEach((x) => {
              const span1 = h(
                'span',
                {
                  style:
                    'display: inline-block;width: 8px; height: 8px;margin-right: 5px;border-radius: 8px; background: #ffba00'
                },
                ''
              )
              const span2 = h('span', { style: 'font-size: 14px' }, x)
              contents.push(h('div', { style: 'font-size: 14px' }, [span1, span2]))
            })
            const content = h('p', null, contents)
            this.$alert(content, '', {
              confirmButtonText: this.$t('uiBtn.confirm'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            })
              .then(() => {})
              .catch(() => {})
          } else if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
            const tempProductNameList = isAdhocEntryProductList.map((x) => x.productName)
            openConfirm(tempProductNameList)
          }
        })
      } else if (isAdhocEntryProductList && isAdhocEntryProductList.length > 0) {
        const tempProductNameList = isAdhocEntryProductList.map((x) => x.productName)
        openConfirm(tempProductNameList)
      }
    },
    reset() {
      this.form = {
        incotermId: undefined,
        incotermName: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        remarks: '',
        priceIncludingTax: '1',
        automatedEmail: '1',
        incotermAddressType: '2',
        dropShipping: '0',
        purchaseContactPersonName: this.$store.state.user.nickName,
        purchaseContactPersonId: this.$store.state.user.userId
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.collapseWarningForVendor = false
      this.initRfqDetailList = []
      this.rfqDetailList = []
      this.initRfqVendorList = []
      this.rfqVendorList = []
      this.activeName = 'inquiryDetails'
      this.activeNames = ['1', '2', '3']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
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
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/requestForQuotation' })
    },
    dropShippingChange() {
      try {
        this.receiveAddressClear()
        if (
          this.initForm &&
          (this.initForm.rfqType === '2' ||
            this.initForm.rfqType === '3' ||
            this.initForm.rfqType === '4') &&
          this.form.dropShipping === '1' &&
          this.form.dropShipping === this.initForm.dropShipping
        ) {
          this.$set(this.form, 'incotermAddressType', this.initForm.incotermAddressType)
          this.$set(this.form, 'receiveAddressId', this.initForm.receiveAddressId)
          this.$set(this.form, 'receiveAddressName', this.initForm.receiveAddressName)
          this.$set(this.form, 'addressForWarehouse', this.initForm.addressForWarehouse || {})
        }

        if (
          this.form.dropShipping !== '1' &&
          !this.form.receiveAddressId &&
          this.form.dropShipping === this.initForm.dropShipping
        ) {
          this.$set(this.form, 'receiveAddressId', this.initForm.receiveAddressId)
          this.$set(this.form, 'receiveAddressName', this.initForm.receiveAddressName)
        }
        const rfqDetailList = this.$refs.ProductTable.getList()
        const isNoCanOpenDropFromSalesNoEnoughInventoryList = rfqDetailList.filter(
          (x) => x.isNoCanOpenDropFromSalesNoEnoughInventory === '1'
        )
        console.log(isNoCanOpenDropFromSalesNoEnoughInventoryList, '=============1077')
        if (
          this.form.dropShipping === '1' &&
          isNoCanOpenDropFromSalesNoEnoughInventoryList.length > 0
        ) {
          const productNameList = isNoCanOpenDropFromSalesNoEnoughInventoryList.map(
            (x) => x.productName
          )
          let str = ''
          if (productNameList.length > 5) {
            str = productNameList.slice(0, 5).join(', ') + '...'
          } else {
            str = productNameList.join(', ')
          }

          this.$modal.msgError(this.$t('PURCHASE.cannotMerged').replace('$1', str))
          setTimeout(() => {
            this.$set(this.form, 'dropShipping', '0')
          }, 200)
        }

        setTimeout(() => {
          this.$refs.form1 && this.$refs.form1.validateField('receiveAddressName')
        }, 300)
      } catch (err) {
        console.log(err, '========1052')
      }
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

    queryRFQCanSelectWarehouseList() {
      this.warehouseOptionsLoading = true
      queryRFQCanSelectWarehouseList({
        pageNum: 1,
        pageSize: 9999,
        warehouseType: '1',
        menuPerms: this.menuKey.RFQ
      })
        .then((res) => {
          this.warehouseOptionsLoading = false
          this.warehouseOptions = res.rows || []
          this.$nextTick(() => {
            this.$refs.form1 && this.$refs.form1.validateField('receiveAddressName')
          })
        })
        .catch(() => {
          this.warehouseOptionsLoading = false
        })
    },
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2' || this.form.incotermAddressType === '3') {
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
      const rfqDetailList = this.$refs.ProductTable.getList()
      param.rfqDetailList = rfqDetailList
      // param.rfqDetailList = this.rfqDetailList
      param.rfqVendorList = [row]
      param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

      const token = getToken()

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
    },

    /* 表格部分Start */
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    updateProductTable(list) {
      this.rfqDetailList = list
      // this.checkProductIsAlreadyRFQ(list)
    },
    updateForm(form) {
      // console.log(form, '========================1042')
      this.form = { ...this.form, ...form }
    },
    updateSupplierTable(list, inquirySupplierQuantity) {
      this.rfqVendorList = list || []
      this.$set(this.form, 'inquirySupplierQuantity', inquirySupplierQuantity)
    },
    clearSuppliersList() {
      if (!this.otherSuppliersAuth) {
        this.initRfqVendorList = []
        this.rfqVendorList = []
      }
    },
    /* 表格部分End */
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

    getFormJson() {
      const param = { ...this.form }
      const rfqDetailList = this.$refs.ProductTable.getList()
      param.rfqDetailList = rfqDetailList
      const rfqVendorList = this.$refs.SupplierTable.getList()
      param.rfqVendorList = rfqVendorList
      const myFileIds = this.$refs.uploadRef.getFileIds()
      param.commonFileList = myFileIds
      return JSON.stringify(param)
    },

    async submitForm(submitType, isConfirm = true, gotoRoute) {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      let valid1 = false
      if (submitType === 'save') {
        valid1 = true
        this.collapseWarningForBasicInfo = false
        this.$refs.form1.clearValidate()
      } else {
        valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      }

      if (valid1) {
        let param = { ...this.form }

        const rfqVendorList = this.$refs.SupplierTable.getList()
        console.log(rfqVendorList, '===========1337')
        if (submitType !== 'save') {
          if (rfqVendorList.length <= 0) {
            this.$modal.msgError(this.$t('PURCHASE.rfqVendorTableEmpty'))
            this.collapseWarningForVendor = true
            return
          }
          if (rfqVendorList.length < param.inquirySupplierQuantity) {
            this.$modal.msgError(
              this.$t('PURCHASE.leastSuppliers').replace('$1', param.inquirySupplierQuantity)
            )
            this.collapseWarningForVendor = true
            return
          }
          const contactPersonNameReq = rfqVendorList.find((item) => {
            return !this.$resultOfBoolean(item.contactPersonName)
          })
          if (contactPersonNameReq) {
            this.$refs.SupplierTable.errorMessage('contactPersonName')
            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.contactPerson'))
            )
            this.collapseWarningForVendor = true
            return
          }
        }
        this.collapseWarningForVendor = false

        const detailList = this.$refs.ProductTable.getList()
        if (submitType !== 'save') {
          if (detailList.length <= 0) {
            this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
            this.collapseWarningForProductInfo = true
            return
          }

          const productNameReq = detailList.find((item) => {
            return !(item.productName || '').trim()
          })
          if (productNameReq) {
            this.$refs.ProductTable.errorMessage('productName')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
          const qtyReq = detailList.find((item) => {
            return (
              !this.$resultOfBoolean(item.purchaseQty) ||
              (item.assignList || []).some((child) => !this.$resultOfBoolean(child.purchaseQty))
            )
          })
          if (qtyReq) {
            this.$refs.ProductTable.errorMessage('purchaseQty')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
          const purchaseUomReq = detailList.find((item) => {
            return !item.purchaseUom
          })
          if (purchaseUomReq) {
            this.$refs.ProductTable.errorMessage('purchaseUom')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseUOM'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
          const deliveryDateReq = detailList.find((item) => {
            return !this.$resultOfBoolean(item.deliveryDate)
          })
          if (deliveryDateReq) {
            this.$refs.ProductTable.errorMessage('deliveryDate')

            this.$modal.msgError(
              this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.requestedReceiptDate'))
            )
            this.collapseWarningForProductInfo = true
            return
          }
        }
        this.collapseWarningForProductInfo = false
        param.rfqDetailList = detailList

        param.rfqVendorList = rfqVendorList
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))

        param.commonFileList = myFileIds
        param.isMergePrAddress = this.mergeForm.isMergePrAddress
        // const confirmMsg = this.$t('PURCHASE.rfqSubmitConfirm')
        // const successMsg = this.$t('PURCHASE.rfqSubmitSuccess')
        // const submitFn = saveRFQ
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.rfqSaveConfirm')
          successMsg = this.$t('PURCHASE.rfqSaveSuccess')
          submitFn = saveDraftRFQ
        } else {
          confirmMsg = this.$t('PURCHASE.rfqSubmitConfirm')
          successMsg = this.$t('PURCHASE.rfqSubmitSuccess')
          submitFn = saveRFQ
        }
        /* if (param.rfqDetailList.some((x) => x.checkResult === '0')) {
          confirmMsg = this.$t('PURCHASE.whetherToContinue')
        } */

        if (isConfirm) {
          this.$modal
            .confirm(confirmMsg)
            .then(() => {
              this.submitLoading = true
              return submitFn(param)
            })
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.cancel()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        } else {
          this.submitLoading = true
          submitFn(param)
            .then((response) => {
              const pageItem = formDirtyClass.routeStatusData[this.$route.name]
              if (pageItem) {
                pageItem.isSaveSuccess = true
              }
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.submitLoading = false

              if (gotoRoute && gotoRoute.name !== this.$route.name) {
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push(gotoRoute).catch(() => {})
              } else {
                this.cancel()
              }
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }
    },
    handleSaveDraft() {
      this.submitForm('save')
    },
    handleSaveDraftNoConFirm(gotoRoute) {
      this.submitForm('save', false, gotoRoute)
    }
  }
}
</script>
<style lang="scss" scoped></style>
