<template>
  <FormPageLayoutTabs>
    <template v-slot:btn>
      <el-button type="primary" @click="back" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:tabs>
      <el-tabs v-model="activeName" size="mini" type="card" @tab-click="handleClick">
        <el-tab-pane
          :label="$t('SALES.storeIssueChitDetails')"
          name="storeIssueChitDetails"
        ></el-tab-pane>
        <el-tab-pane :label="$t('SALES.stockOutInDetails')" name="stockOutInDetails"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:content>
      <div v-show="activeName === 'storeIssueChitDetails'">
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
                label-width="130px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.type')}`"
                      prop="storeIssueChitType"
                      :class="[isModified('storeIssueChitTypeShowStr')]"
                    >
                      <el-select
                        v-model="form.storeIssueChitType"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="typeChange"
                        disabled
                      >
                        <el-option
                          v-for="item in dict.type.store_issue_chit_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('SALES.storeIssueChitNo')">
                      <el-input
                        :value="form.storeIssueChitNo"
                        :title="form.storeIssueChitNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('ui.status')">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.store_issue_chit_status,
                            form.storeIssueChitStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.warehouse')}`"
                      prop="warehouseName"
                      :class="[isModified('warehouseName')]"
                    >
                      <!-- <ToolTipShowObj
                        :mData="form.addressForWarehouse || {}"
                        :showStr="form.warehouseName"
                        :rows="warehouseRows"
                      > -->
                      <SelectInput
                        clearable
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @click="openWarehouseTable"
                        @clear="warehouseClear"
                        :disabled="comDisFrom"
                      />
                      <!-- </ToolTipShowObj> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.dept')}`"
                      prop="departmentId"
                      :class="[isModified('departmentName')]"
                    >
                      <el-select
                        v-model="form.departmentId"
                        :title="form.allSuperiorName"
                        placeholder=""
                        style="width: 100%"
                        clearable
                        @change="departmentChange"
                      >
                        <el-option
                          v-for="item in deptOptions"
                          :key="item.departmentId"
                          :label="item.customLabel"
                          :value="item.departmentId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.requiredBy')}`"
                      prop="requiredBy"
                      :class="[isModified('requiredBy')]"
                    >
                      <SelectInput
                        :value="form.requiredBy"
                        :title="form.requiredBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId || comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      :label="`${$t('ui.reason')}`"
                      prop="reason"
                      :class="[isModified('reason')]"
                    >
                      <MyInput
                        type="textarea"
                        v-model="form.reason"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="checkPermi(['projectManagement:storeIssueChit:isLoan'])">
                    <el-form-item :label="`${$t('SALES.isLoan')}`" :class="[isModified('isLoan')]">
                      <el-switch
                        v-model="form.isLoan"
                        active-value="1"
                        inactive-value="0"
                        :disabled="form.storeIssueChitType === '3'"
                      ></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.isLoan === '1'">
                    <el-form-item
                      :label="`${$t('SALES.returnBy')}`"
                      prop="returnBy"
                      :class="[isModified('returnBy')]"
                    >
                      <el-date-picker
                        v-model="form.returnBy"
                        type="date"
                        :format="fmtForYmd"
                        :style="{ width: '100%' }"
                        placeholder
                        :picker-options="timeDatePickerOptions"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <template v-if="form.logisticsType === '1'">
                    <el-col :span="8" :key="'driver' + form.logisticsType">
                      <el-form-item :label="`${$t('SALES.driver')}`" required>
                        <SelectInput
                          clearable
                          :value="form.driverName"
                          :title="form.driverName"
                          :disabled="true"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8" :key="'driver' + form.logisticsType">
                      <el-form-item :label="`${$t('SALES.vehicle')}`" required>
                        <SelectInput
                          clearable
                          :value="form.licensePlateNo"
                          :title="form.licensePlateNo"
                          :disabled="true"
                        />
                      </el-form-item>
                    </el-col>
                  </template>
                  <template v-if="form.storeIssueChitType === '1'">
                    <el-col :span="8">
                      <el-form-item
                        :label="`${$t('SALES.projectCode')}`"
                        prop="costProjectCode"
                        :class="[isModified('costProjectCode')]"
                      >
                        <el-input
                          :value="form.costProjectCode"
                          :title="form.costProjectCode"
                          disabled
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </el-collapse-item>
          </div>

          <div
            class="form-card mt10"
            v-if="form.storeIssueChitType === '2' || form.storeIssueChitType === '3'"
          >
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('SALES.shippingInfo')"
                :warning="collapseWarningForShippingInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="180px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.customerName')}`"
                      prop="businessPartnerName"
                      :class="[isModified('businessPartnerName')]"
                    >
                      <SelectInput
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openCustomerTable"
                        @clear="customerClear"
                        :disabled="comDisFrom"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.deliveryAddress')}`">
                      <el-input
                        :value="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.contactPerson')}`"
                      prop="bpContactPersonId"
                      :class="[isModified('bpContactPersonName')]"
                    >
                      <CommonSelect
                        :id="form.bpContactPersonId"
                        :label="form.bpContactPersonName"
                        :title="form.bpContactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="contactPersonChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.projectCode')}`"
                      prop="costProjectCode"
                      :class="[isModified('costProjectCode')]"
                    >
                      <el-input
                        :value="form.costProjectCode"
                        :title="form.costProjectCode"
                        disabled
                      ></el-input>
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
                :title="$t('menu.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>

              <ProductTable
                ref="ProductTable"
                :pqProductList="initProductList"
                :businessPartnerId="form.businessPartnerId"
                :countryId="form.countryId"
                @updateTable="updateProductTable"
                :comDisFrom="comDisFrom"
                :modifyHighlight="modifyHighlight"
                :basicUpdateProps="basicUpdateProps"
                :costProjectId="form.costProjectId"
                :warehouseList="form.warehouseList || []"
                :warehouseIdList="form.warehouseIdList || []"
                :storeIssueChitId="form.storeIssueChitId"
              />
            </el-collapse-item>
          </div>

          <div class="form-card mt10">
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
                    {{ $t('ui.operTime') }} :
                    {{ parseTime(form.operationLogForLast.operatorTime) }}
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

      <div v-show="activeName === 'stockOutInDetails'">
        <stockOutInDetails ref="stockOutInDetails" :formData="form" />
      </div>
    </template>

    <ApprovedDialog
      :id="form.storeIssueChitId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :apl-visible="aplVisible"
      :apl-api-url="approvedUrl"
      @submitSuccess="aplSubmitSuccess"
      @aplVisibleChange="aplVisibleChange"
    />
    <RejectDialog
      :id="form.storeIssueChitId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :rj-visible="rjVisible"
      :rj-api-url="rejectedUrl"
      @submitSuccess="rjSubmitSuccess"
      @rjVisibleChange="rjVisibleChange"
    />
    <!-- 取消 -->
    <FormCancelDialog
      :id="form.storeIssueChitId"
      :taskId="taskId || form.taskId"
      :fromType="dataType"
      :cancel-api-url="cancelledUrl"
      @submitSuccess="cancelSubmitSuccess"
      ref="FormCancelDialog"
    />

    <RevisionComparisonDlg module-key="storeIssueChit" ref="RevisionComparisonDlg" />

    <selectCustomerTable ref="selectCustomerTable" @update="updateCustomer" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
  </FormPageLayoutTabs>
</template>

<script>
import {
  queryStoreIssueChitById,
  saveStoreIssueChit,
  approvedStoreIssueChit,
  rejectedStoreIssueChit,
  cancelledStoreIssueChit,
  queryLegalEntityDepartmentList
} from '@/api/projectManagement/storeIssueChit'
import { queryCurrencyListBySelect } from '@/api/basic/basic'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import ProductTable from './productTable.vue'
import selectCustomerTable from './components/selectCustomerTable.vue'
import stockOutInDetails from './components/stockOutInDetails.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import RevisionComparisonDlg from '@/components/RevisionComparison'
import ApprovedDialog from '@/views/bpm/history/approvedDialog/approvedDialog.vue'
import RejectDialog from '@/views/bpm/history/rejectDialog/rejectDialog.vue'
import FormCancelDialog from '@/views/bpm/history/cancelDialog/formCancelDialog'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['store_issue_chit_status', 'store_issue_chit_type', 'logistics_type'],
  components: {
    ProductTable,
    selectCustomerTable,
    SystemOperationLogTable,
    RevisionComparisonDlg,
    ApprovedDialog,
    RejectDialog,
    FormCancelDialog,
    stockOutInDetails,
    selectPurchasePersonTable,
    selectWarehouseTable
  },
  data() {
    const vm = this
    return {
      saveKey: '14',
      activeNames: [],
      activeName: 'storeIssueChitDetails',
      rowId: '',
      timeId: '',
      submitLoading: false,

      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        type: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        departmentIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        requiredBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        returnBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        businessPartnerName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      startTimeDateOptions: {
        disabledDate(time) {
          const { endDateTime } = vm.form
          if (!endDateTime) {
            return time.getTime() > new Date().getTime()
          }
          return time.getTime() > endDateTime || time.getTime() > new Date().getTime()
        }
      },
      endTimeDateOptions: {
        disabledDate(time) {
          const { startDateTime } = vm.form
          // if (!startDateTime) {
          //   return time.getTime() > new Date().getTime()
          // }
          // return time.getTime() <= startDateTime - 8.64e7 || time.getTime() > new Date().getTime()
          if (startDateTime) {
            return time.getTime() <= startDateTime - 8.64e7
          }
        }
      },
      warehouseRows: [
        {
          label: this.$t('INVENTORY.warehouseCode'),
          showLabel: 'warehouseCode'
        },
        {
          label: this.$t('INVENTORY.warehouseName'),
          showLabel: 'warehouseName'
        },
        {
          label: this.$t('INVENTORY.warehouseType'),
          showLabel: 'warehouseTypeShowStr'
        },
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
      approvedUrl: approvedStoreIssueChit,
      rejectedUrl: rejectedStoreIssueChit,
      cancelledUrl: cancelledStoreIssueChit,

      /* 版本比对高亮 */
      basicUpdateProps: [],
      bpHistoryVersionList: [],
      /* 表格部分 */
      initServiceProductList: [],
      serviceProductDetailList: [],
      initProductList: [],
      productDetailList: [],
      collapseWarningForProductInfo: false,
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
      currencyOptions: [],
      warehouseOptions: [],
      props: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'child',
        emitPath: false,
        checkStrictly: true
      },
      departmentList: [],
      requiredByOptions: [],
      accountSupplierUpdateProps: [],
      accountCustomerUpdateProps: [],
      deptOptions: []
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
    editAuth() {
      return this.checkPermi(['projectManagement:storeIssueChit:edit'])
    },
    comDisFrom() {
      return true
      // let dis = true
      // if (!this.editAuth) {
      //   return true
      // }
      // if (
      //   ['1', '3'].includes(this.dataType) &&
      //   this.form.storeIssueChitId &&
      //   this.buttonAuthMsg.isCanUpdate === '1'
      // ) {
      //   dis = false
      // }
      // return dis
    },
    approvedBtnShow() {
      let show = false
      /* BPM管理员操作todo进入 不需要判断 this.buttonAuthMsg */
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.storeIssueChitId &&
        this.buttonAuthMsg.isCanApproved === '1'
      ) {
        show = true
      }
      return show
    },
    rejectedBtnShow() {
      let show = false
      if (this.dataType === '3' && this.form.approvedStatus === '1') {
        show = true
      } else if (
        this.dataType === '1' &&
        this.form.storeIssueChitId &&
        this.buttonAuthMsg.isCanRejected === '1'
      ) {
        show = true
      }
      return show
    },
    cancelBtnShow() {
      if (!this.checkPermi(['inventoryManagement:transferOrder:cancel'])) {
        return false
      }
      let show = false
      if (
        this.dataType !== '2' &&
        this.form.storeIssueChitId &&
        this.buttonAuthMsg.isCanCancelled === '1'
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
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    handleUpdate() {
      this.reset()
      this.queryLegalEntityDepartmentList()
      this.queryCurrencyListBySelect()
      const rowId = this.rowId
      queryStoreIssueChitById({ storeIssueChitId: rowId }).then((res) => {
        const data = res.data || {}
        this.tableList = data.purchaseRequisiteDetailList || []
        this.operationLogList = data.operationLogList || []
        this.form = data
        this.buttonAuthMsg = data.buttonAuthMsg || {}

        this.initProductList = data.storeIssueChitProductList || []
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
    isModified(prop) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (this.basicUpdateProps.includes(prop)) {
        return 'edit-outline'
      }
    },
    handleClick() {},
    queryLegalEntityDepartmentList() {
      queryLegalEntityDepartmentList({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          item.customLabel =
            (item.branchCompanyName ? item.branchCompanyName + ' - ' : '') + item.departmentName
        })
      })
    },
    departmentChange(value) {
      const item = this.deptOptions.find((item) => item.departmentId === value) || {}
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      this.purchasePersonClear()
    },
    openPurchasePersonTable() {
      this.$refs.selectPurchasePersonTable.handleOpen()
    },
    purchasePersonClear() {
      this.$set(this.form, 'requiredBy', undefined)
      this.$set(this.form, 'requiredId', undefined)
    },
    updatePurchasePerson(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'requiredBy', nickName)
      this.$set(this.form, 'requiredId', userId)
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
    reset() {
      this.form = {
        storeIssueChitType: undefined,
        businessPartnerName: undefined,
        purchaseQuotationStatus: '1',
        serviceOrderNo: undefined,
        businessPartnerId: undefined,
        contactPersonName: undefined,
        bpBusinessContactPersonList: [],
        bpBusinessAddressList: [],
        serviceTypeList: [],
        email: undefined,
        mobilePhone: undefined,
        startDateTime: undefined,
        endDateTime: undefined,
        logisticsType: undefined,
        isLoan: '1',
        departmentId: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initServiceProductList = []
      this.serviceProductDetailList = []
      this.initProductList = []
      this.productDetailList = []
      this.activeNames = ['1', '2', '3', '4']
      this.activeName = 'storeIssueChitDetails'
      this.resetForm('form1')
      this.resetForm('form2')
    },
    typeChange() {
      if (this.form.storeIssueChitType === '3') {
        this.$set(this.form, 'isLoan', '1')
      }
      if (this.form.storeIssueChitType !== '2' && this.form.storeIssueChitType !== '3') {
        this.customerClear()
      }
    },
    // 取消按钮
    back(type) {
      this.$emit('back', type)
    },
    /* 表单部分Start */
    openCustomerTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    updateCustomer(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'customerType', row.customerType)

      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'paymentTermId', account.paymentTermId)
      this.$set(this.form, 'paymentTermName', account.paymentTermName)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.contactPersonClear()
      this.deliveryAddressClear()
      if (row.bpBusinessAddressList && row.bpBusinessAddressList.length === 1) {
        this.deliveryAddressChange(row.bpBusinessAddressList[0])
      }
    },
    deliveryAddressChange(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
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
    // 清空供应商
    customerClear() {
      this.changeBPClearProductTable({
        oldBPId: this.form.businessPartnerId,
        newBPId: undefined
      })
      this.$set(this.form, 'bpBusinessContactPersonList', [])
      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.$set(this.form, 'abbreviation', undefined)
      this.$set(this.form, 'customerGroup', undefined)
      this.$set(this.form, 'customerType', undefined)

      this.deliveryAddressClear()
      this.contactPersonClear()
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
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
    contactPersonChange(row) {
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
    },
    updateProductTable(list) {
      this.productDetailList = list || []
    },
    changeBPClearProductTable({ oldBPId, newBPId }) {
      if (oldBPId !== newBPId) {
        this.initProductList = []
        this.initServiceProductList = []
      }
    },
    /* 表格部分End */
    async submitForm(submitType) {
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      const tableList = this.$refs.ProductTable.tableList
      if (tableList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        this.collapseWarningForProductInfo = true
        return
      }
      const qtyReq = tableList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
        this.collapseWarningForProductInfo = true
        return
      }
      // const deliveryDateReq = tableList.find((item) => {
      //   return !this.$resultOfBoolean(item.deliveryDate)
      // })
      // if (deliveryDateReq) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.scheduledDeliveryDate'))
      //   )
      //   this.collapseWarningForProductInfo = true
      //   return
      // }

      this.collapseWarningForProductInfo = false
      let valid2 = true
      if (this.form.storeIssueChitType === '2' || this.form.storeIssueChitType === '3') {
        valid2 = await this.$refs.form2.validate().catch((err) => {
          return err
        })
        this.collapseWarningForShippingInfo = !valid2

        if (!valid2) {
          this.$modal.msgError(
            this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.shippingInfo'))
          )
          return
        }
      } else {
        this.collapseWarningForShippingInfo = false
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.storeIssueChitProductList = tableList
        this.$modal
          .confirm(this.$t('SALES.storeIssueChitConfirm'))
          .then(() => {
            return saveStoreIssueChit(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(
              this.$t('SALES.storeIssueChitSuccess').replace('$1', response.msg)
            )
            this.back()
          })
          .catch(() => {})
      }
    },
    validServiceProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        // this.$modal.msgError(this.$t('SALES.prProductTableEmpty'))
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.serviceInfo'))
        )
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qty')))
        return valid
      }

      const durationReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.duration) && item.valuationUnit !== 'order'
      })
      if (durationReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.duration')))
        return valid
      }

      const warrantyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warranty)
      })
      if (warrantyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
        )
        return valid
      }

      const warrantyStartDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warrantyStartDate)
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      }

      return true
    },
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        return true
        // this.$modal.msgError(
        //   this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.productInfo'))
        // )
        // return valid
      }
      const uomReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.uom)
      })
      if (uomReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.uom')))
        return valid
      }

      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.qty)
      })
      if (qtyReq) {
        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.qty')))
        return valid
      }

      const warrantyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warranty)
      })
      if (warrantyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
        )
        return valid
      }

      const warrantyStartDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warrantyStartDate)
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      }

      return true
    },

    /* 版本比对 */
    revisionComparison() {
      this.$refs.RevisionComparisonDlg.handleOpen(this.form.storeIssueChitId)
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
        `${vm.$t('ui.approvedSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
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
        `${vm.$t('ui.rejectedSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
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
        `${vm.$t('ui.cancelledSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
      )
      vm.back('onCancelSuccess')
    },

    handleClose() {
      this.$refs.FormCloseDialog.handleOpen()
    },
    closeSubmitSuccess() {
      const vm = this
      vm.$message.success(
        `${vm.$t('ui.closedSuccess')}`.replace('$1', `[${vm.form.storeIssueChitNo}]`)
      )
      vm.back('onCloseSuccess')
    }
  }
}
</script>
<style lang="scss"></style>
