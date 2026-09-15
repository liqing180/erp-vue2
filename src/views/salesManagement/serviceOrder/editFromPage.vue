<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" v-if="!comDisFrom" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
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
                label-width="130px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('SALES.storeIssueChit')" prop="storeIssueChitNo">
                      <el-input
                        :value="form.storeIssueChitNo || 'N/A'"
                        :title="form.storeIssueChitNo"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('ui.status')">
                      <el-input
                        :value="
                          selectDictLabel(dict.type.service_order_status, form.serviceOrderStatus)
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.serviceOrderNo')}`">
                      <el-input v-model="form.serviceOrderNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.type')}`" prop="serviceTypeList">
                      <!-- <CommonMultipleSelect
                        :ids="form.serviceTypeList"
                        :labels="form.serviceTypeNameList"
                        idKey="dictValue"
                        labelKey="dictLabel"
                        :options="serviceOrderTypeList"
                        @change="serviceOrderTypeChange"
                        disabled
                      /> -->
                      <el-select
                        style="width: 100%"
                        v-model="form.serviceTypeList"
                        :title="
                          form.serviceTypeNameList && form.serviceTypeNameList.length > 0
                            ? form.serviceTypeNameList.join(', ')
                            : ''
                        "
                        placeholder=""
                        multiple
                        collapse-tags
                        clearable
                        @change="serviceOrderTypeChange"
                        class="select"
                        disabled
                      >
                        <el-option
                          v-for="(child, index) in serviceOrderTypeList"
                          :key="index"
                          :label="child.dictLabel"
                          :value="child.dictValue"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                      <SelectInput
                        clearable
                        :value="form.businessPartnerName"
                        :title="form.businessPartnerName"
                        @click="openCustomerTable"
                        @clear="customerClear"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.customerCode')}`">
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('SALES.contactPerson')}`"
                      prop="bpContactPersonName"
                    >
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
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
                    <el-form-item :label="`${$t('ui.mobilePhone')}`">
                      <el-input
                        v-model="form.bpMobilePhone"
                        :title="form.bpMobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.bpEmail" :title="form.bpEmail" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.address')}`" prop="receiveAddressId">
                      <ToolTipShowObj
                        :mData="form.addressForBPAddress || {}"
                        :showStr="form.receiveAddressName"
                        :rows="bpAddressRows"
                      >
                        <CommonSelectAndList
                          :id="form.receiveAddressId"
                          :label="form.receiveAddress"
                          idKey="businessAddressId"
                          labelKey="receiveAddress"
                          filterable
                          :options="businessAddressList"
                          :disabled="!form.businessPartnerId || comDisFrom"
                          :loading="receiveAddressLoading"
                          @change="deliveryAddressChange"
                          @handleOpen="openReceiveAddressTable"
                        />
                      </ToolTipShowObj>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="16">
                    <el-form-item :label="`${$t('SALES.addressDetails')}`">
                      <el-input
                        v-model="form.receiveAddress"
                        :title="form.receiveAddress"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.projectCode')}`" prop="costProjectCode">
                      <CommonSelect
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        :title="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        filterable
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        @change="costProjectNameChange"
                        disabled
                      />
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
                :title="$t('SALES.serviceInfo')"
                :warning="collapseWarningForServiceInfo"
              >
              </FormCollapseItemTitle>
              <el-form
                ref="form2"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="130px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('SALES.jobSheetNo')" prop="jobSheetNo">
                      <el-input v-model="form.jobSheetNo" :maxlength="30"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.requiredBy')}`" prop="requiredBy">
                      <el-input
                        v-model="form.requiredBy"
                        :title="form.requiredBy"
                        :maxlength="50"
                      ></el-input>
                      <!-- <SelectInput
                        :value="form.requiredBy"
                        :title="form.requiredBy"
                        @clear="requiredByClear"
                        clearable
                        @click="openRequiredByTable"
                        class="form-wd"
                        :disabled="comDisFrom"
                      /> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('SALES.worker')">
                      <el-input
                        v-model="form.worker"
                        :title="form.worker"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item :label="`${$t('ui.currency')}`" prop="currencyId">
                      <CommonSelect
                        disabled
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
                  </el-col> -->
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.startDateTime')}`" prop="startDateTime">
                      <!-- :rules="[
                        {
                          required: (form.serviceTypeList || []).join(',') !== '8',
                          message: $t('ui.reqMsg'),
                          trigger: ['blur', 'change']
                        }
                      ]" -->
                      <my-date-picker
                        v-model="form.startDateTime"
                        :picker-options="startTimeDateOptions"
                        :format="fmtForYmdhm"
                        type="datetime"
                        value-format="timestamp"
                        :default-time="getCurrentTime()"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        @change="handleStartDateChange"
                      ></my-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.endDateTime')}`" prop="endDateTime">
                      <!-- :rules="[
                        {
                          required: (form.serviceTypeList || []).join(',') !== '8',
                          message: $t('ui.reqMsg'),
                          trigger: ['blur', 'change']
                        }
                      ]" -->
                      <my-date-picker
                        v-model="form.endDateTime"
                        :picker-options="endTimeDateOptions"
                        :format="fmtForYmdhm"
                        type="datetime"
                        value-format="timestamp"
                        :default-time="getCurrentTime()"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                        @change="handleEndDateChange"
                      ></my-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.description')" prop="description">
                      <MyInput
                        type="textarea"
                        v-model="form.description"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`" required prop="fileIdList">
                      <myUpload
                        ref="uploadRef"
                        :limit="9"
                        :disabled="comDisFrom"
                        :allFileSize="20"
                        @uploadChange="uploadChange"
                      />
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
                :title="$t('menu.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <!-- <el-row>
                <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                  <el-tab-pane name="1">
                    <span slot="label">
                      <span>{{ $t('SALES.serviceInfo') }}</span>
                    </span>
                  </el-tab-pane>
                  <el-tab-pane name="2">
                    <span slot="label">
                      <span>{{ $t('menu.productInfo') }}</span>
                    </span>
                  </el-tab-pane>
                </el-tabs>
              </el-row> -->
              <!-- <div v-show="activeName === '1'"> -->
              <ServiceProductTable
                ref="ServiceProductTable"
                :pqProductList="initServiceProductList"
                :businessPartnerId="form.businessPartnerId"
                :countryId="form.countryId"
                @updateTable="updateServiceProductTable"
                :comDisFrom="comDisFrom"
                :formData="form"
              />
              <!-- </div> -->
              <!-- <div v-show="activeName === '2'">
                <ProductTable
                  ref="ProductTable"
                  :pqProductList="initProductList"
                  :businessPartnerId="form.businessPartnerId"
                  :countryId="form.countryId"
                  @updateTable="updateProductTable"
                  :comDisFrom="comDisFrom"
                />
              </div> -->
              <el-form
                :model="form"
                @submit.native.prevent
                label-width="130px"
                :disabled="comDisFrom"
              >
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="$t('ui.remarks')" prop="remarks">
                      <MyInput
                        type="textarea"
                        v-model="form.remarks"
                        :autosize="{ minRows: 2, maxRows: 4 }"
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
    <selectCustomerTable ref="selectCustomerTable" @update="updateCustomer" />
    <selectRequiredByTable
      ref="selectRequiredByTable"
      :departmentId="form.departmentId"
      @update="updateRequiredBy"
    />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="deliveryAddressChange"
    />
  </FormPageLayout>
</template>

<script>
import { updateServiceOrder, queryServiceOrderById } from '@/api/salesManagement/serviceOrder'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryCanSelectCostProjectList } from '@/api/projectManagement/project'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import selectCustomerTable from './components/selectCustomerTable.vue'
import selectRequiredByTable from './components/selectRequiredByTable.vue'
// import ProductTable from './productTable.vue'
import ServiceProductTable from './serviceProductTable.vue'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import payToAddressDlg from '@/views/salesManagement/salesInquiry/components/payToAddressDlg.vue'

export default {
  mixins: [pageMixin],
  dicts: ['service_order_status', 'service_order_type'],
  components: {
    selectCustomerTable,
    selectRequiredByTable,
    // ProductTable,
    ServiceProductTable,
    SystemOperationLogTable,
    payToAddressDlg
  },
  data() {
    const vm = this
    const validStartDate = (rule, value, callback) => {
      let startTime = value
      if (!startTime) {
        callback()
      }
      if (typeof startTime === 'number') {
        startTime = new Date(startTime)
      }
      if (startTime > new Date().getTime()) {
        callback(new Error(this.$t('SALES.gtCurrentTime')))
      } else {
        callback()
      }
    }
    const validEndDate = (rule, value, callback) => {
      let endTime = value
      let startTime = vm.form.startDateTime
      if (!startTime) {
        callback()
      }
      if (typeof startTime === 'number') {
        startTime = new Date(startTime)
      }
      if (typeof endTime === 'number') {
        endTime = new Date(endTime)
      }

      if (endTime && startTime && endTime - startTime < 0) {
        callback(new Error(this.$t('SALES.moreThan')))
      } else {
        callback()
      }
    }
    return {
      businessAddressList: [],
      submitLoading: false,
      saveKey: '52',
      activeNames: [],
      activeName: '1',
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      collapseWarningForServiceInfo: false,
      rules: {
        fileIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        bpContactPersonName: [
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
        ],
        jobSheetNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change', 'blur']
          }
        ],
        startDateTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          },
          {
            validator: validStartDate,
            trigger: ['blur', 'change']
          }
        ],
        endDateTime: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          },
          {
            validator: validEndDate,
            trigger: ['blur', 'change']
          }
        ],
        requiredBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change']
          }
        ],
        serviceTypeList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change']
          }
        ],
        currencyId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change']
          }
        ],
        receiveAddressId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change']
          }
        ],
        description: [
          {
            required: false,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('SALES.requiredBy')),
            trigger: ['change', 'blur']
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
      serviceOrderTypeList: [],
      buttonAuthMsg: {
        isCanApproved: '0',
        isCanRejected: '0',
        isCanRevise: '0',
        isCanUpdate: '0',
        isCanCancelled: '0',
        isCanClosed: '0'
      },
      projectNameOptions: [],
      costProjectNameLoading: false,
      receiveAddressLoading: true
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
    fmtForYmdhm() {
      return this.$store.getters.fmtForYmdhm
    },
    editAuth() {
      return this.checkPermi(['salesManagement:serviceOrder:edit'])
    },
    comDisFrom() {
      let dis = true
      if (!this.editAuth) {
        return true
      }
      if (this.buttonAuthMsg.isCanUpdate === '1') {
        dis = false
      }
      return dis
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
    getCurrentTime() {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    // 项目名称
    queryCanSelectCostProjectList() {
      this.costProjectNameLoading = true
      queryCanSelectCostProjectList({ businessPartnerId: this.form.businessPartnerId })
        .then((response) => {
          this.projectNameOptions = response.data || []
          this.costProjectNameLoading = false
        })
        .catch(() => {
          this.costProjectNameLoading = false
        })
    },
    costProjectNameChange(item = {}) {
      if (!item.costProjectId) {
        this.$set(this.form, 'costProjectId', undefined)
        this.$set(this.form, 'costProjectName', undefined)
        this.$set(this.form, 'costProjectCode', undefined)
      } else {
        this.$set(this.form, 'costProjectId', item.costProjectId)
        this.$set(this.form, 'costProjectName', item.costProjectName)
        this.$set(this.form, 'costProjectCode', item.costProjectCode)
        // const { businessAddress, businessPartner } = item
        // if (businessAddress && businessAddress.businessAddressId) {
        //   this.deliveryAddressChange(businessAddress)
        // } else if (this.form.receiveAddressId) {
        //   this.deliveryAddressClear()
        // }
        // if (businessPartner && businessPartner.businessPartnerId) {
        //   this.updateCustomer(businessPartner, 'formProject')
        // }
      }
    },
    handleUpdate() {
      this.reset()
      this.queryCurrencyListBySelect()
      queryServiceOrderById({ serviceOrderId: this.rowId }).then((res) => {
        const { serviceOrderProductList, buttonAuthMsg, commonFileList, ...params } = res.data
        this.form = params
        console.log(this.form.serviceTypeList, '=============767')

        if ((this.form.serviceTypeList || []).join(',') === '8') {
          this.$set(this.rules.startDateTime[0], 'required', false)
          this.$set(this.rules.endDateTime[0], 'required', false)
        } else {
          this.$set(this.rules.startDateTime[0], 'required', true)
          this.$set(this.rules.endDateTime[0], 'required', true)
        }

        this.getDict()
        this.queryCanSelectCostProjectList()
        this.queryAddressByBusinessPartnerId()
        this.buttonAuthMsg = buttonAuthMsg
        serviceOrderProductList.forEach((x) => {
          if (x.isTemp === '1') {
            x.customId = x.serviceOrderProductId
          }
        })
        this.initServiceProductList = serviceOrderProductList
        // this.initServiceProductList = serviceOrderProductList.filter((x) => {
        //   if (x.isTemp === '1') {
        //     x.customId = x.serviceOrderProductId
        //   }
        //   return x.productType === '2'
        // })
        // this.initProductList = serviceOrderProductList.filter((x) => x.productType === '1')
        const { bpBusinessAddressList } = this.form
        const arr = bpBusinessAddressList.filter(
          (x) => x.businessAddressId === this.form.receiveAddressId
        )
        this.$set(this.form, 'addressForBPAddress', arr[0])
        if (commonFileList && commonFileList.length > 0) {
          const ids = commonFileList.map((item) => item.id || item.fileId)
          this.$set(this.form, 'fileIdList', ids)
        }
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(commonFileList || [])
        }, 100)

        setTimeout(() => {
          this.setRouteTitleView(this.comDisFrom)
        }, 0)
      })
    },
    handleTabClick() {},

    getDict() {
      this.MyDictDataClass.getDictFn('service_order_type').then((res) => {
        this.serviceOrderTypeList = res || []
        this.serviceOrderTypeChange()
      })
    },
    serviceOrderTypeChange() {
      const labels = this.serviceOrderTypeList
        .filter((x) => this.form.serviceTypeList.indexOf(x.dictValue) !== -1)
        .map((k) => k.dictLabel)
      this.$set(this.form, 'serviceTypeNameList', labels)
    },
    reset() {
      this.form = {
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
        fileIdList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForServiceInfo = false
      this.collapseWarningForProductInfo = false
      this.initServiceProductList = []
      this.serviceProductDetailList = []
      this.initProductList = []
      this.productDetailList = []
      this.activeNames = ['1', '2', '3', '4']
      this.activeName = '1'
      if (this.$refs.uploadRef) {
        this.$refs.uploadRef.initFileList([])
      }
      this.resetForm('form1')
      this.resetForm('form2')
    },
    uploadChange(ids = []) {
      this.$set(this.form, 'fileIdList', ids)
      this.$refs.form2 && this.$refs.form2.validateField('fileIdList')
    },
    // 取消按钮
    cancel(type) {
      this.$emit('back', type)
    },
    /* 表单部分Start */
    openCustomerTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    // 清空供应商
    customerClear() {
      this.changeBPClearProductTable({
        oldBPId: this.form.businessPartnerId,
        newBPId: undefined
      })
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
    updateCustomer(row) {
      this.changeBPClearProductTable({
        oldBPId: this.form.businessPartnerId,
        newBPId: row.businessPartnerId
      })
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      this.$set(
        this.form,
        'bpBusinessAddressList',
        (row.bpBusinessAddressList || []).filter((p) => p.isActive === '1')
      )
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'customerGroup', row.customerGroup)
      this.$set(this.form, 'customerType', row.customerType)

      const account = row.bpBusinessAccountSupplier || {}
      // if (account.currencyId) {
      //   this.$set(this.form, 'currencyId', account.currencyId)
      //   this.$set(this.form, 'currencyCode', account.currencyCode)
      //   this.$set(this.form, 'currency', account.currency)
      // }
      this.$set(this.form, 'paymentTermId', account.paymentTermId)
      this.$set(this.form, 'paymentTermName', account.paymentTermName)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])

      this.contactPersonClear()
      this.deliveryAddressClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }

      if (this.form.bpBusinessAddressList.length === 1) {
        this.deliveryAddressChange(this.form.bpBusinessAddressList[0])
      }
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

      this.$set(this.form, 'salesInquiryProductList', [])
      this.$set(this.form, 'salesInquiryServiceList', [])
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

    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    queryAddressByBusinessPartnerId() {
      if (!this.form.businessPartnerMainId) {
        return
      }
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.businessPartnerMainId = this.form.businessPartnerMainId
      this.receiveAddressLoading = true
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessAddressList = rows
          this.receiveAddressLoading = false
        })
        .catch((err) => {
          this.receiveAddressLoading = false
          window.console.error(err)
        })
    },
    deliveryAddressChange(row) {
      if (!row.receiveAddress) {
        this.deliveryAddressClear()
      }
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    deliveryAddressClear() {
      this.$set(this.form, 'bpBusinessAddress', undefined)
      this.$set(this.form, 'bpBusinessAddressId', undefined)
      this.$set(this.form, 'bpAddressDataId', undefined)
      this.$set(this.form, 'bpAddress', undefined)
    },

    openRequiredByTable() {
      this.$refs.selectRequiredByTable.handleOpen()
    },
    // 清空pic
    requiredByClear() {
      this.$set(this.form, 'requiredBy', undefined)
      this.$set(this.form, 'requiredId', undefined)
    },
    updateRequiredBy(row) {
      const { nickName, userId } = row
      this.$set(this.form, 'requiredBy', nickName)
      this.$set(this.form, 'requiredId', userId)
    },

    handleStartDateChange() {
      const vm = this
      const { startDateTime } = this.form
      if (this.form.endDateTime) {
        vm.$refs.form2 && vm.$refs.form2.validateField('endDateTime')
      }
      if (startDateTime && this.$refs.ServiceProductTable) {
        const detailList2 = this.$refs.ServiceProductTable.getList()
        detailList2.forEach((item) => {
          if (
            item.warrantyStartDate &&
            item.warrantyStartDate < startDateTime &&
            item.productType !== '2'
          ) {
            item.warrantyStartDate = startDateTime
          }
        })
        this.$refs.ServiceProductTable.initList(detailList2)
      }
    },
    handleEndDateChange() {
      const vm = this
      if (this.form.startDateTime) {
        vm.$refs.form2 && vm.$refs.form2.validateField('startDateTime')
      }
      const { endDateTime } = this.form
      if (endDateTime && this.$refs.ServiceProductTable) {
        const detailList2 = this.$refs.ServiceProductTable.getList()
        detailList2.forEach((item) => {
          if (item.productType !== '2') {
            item.warrantyStartDate = endDateTime
          }
        })
        this.$refs.ServiceProductTable.initList(detailList2)
      }
    },

    /* 表单部分End */

    /* 表格部分Start */
    updateServiceProductTable(list) {
      this.serviceProductDetailList = list || []
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
      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForServiceInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('SALES.serviceInfo'))
        )
        return
      }
      const myFileIds = this.$refs.uploadRef.getFileIds({
        required: true,
        requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
      })
      if (myFileIds === false) {
        this.collapseWarningForServiceInfo = true
        return
      }
      if (valid1 && valid2) {
        let param = { ...this.form }
        // const detailList1 = this.$refs.ServiceProductTable.getList()
        // const detailList2 = this.$refs.ProductTable.getList()
        const detailList = this.$refs.ServiceProductTable.getList()
        /* const detailList1 = detailList.filter((x) => x.productType === '2')
        const detailList2 = detailList.filter((x) => x.productType === '1')
        const validServiceProduct = this.validServiceProductList(detailList1)
        if (!validServiceProduct) {
          // this.activeName = '1'
          this.collapseWarningForProductInfo = true
          return
        } */
        if (detailList.length <= 0) {
          this.$modal.msgError(this.$t('SALES.productIsEmpty'))
          this.collapseWarningForProductInfo = true
          return
        }
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          // this.activeName = '2'
          this.collapseWarningForProductInfo = true
          return
        }

        this.collapseWarningForProductInfo = false
        // param.serviceProductDetailList = detailList1
        // param.productDetailList = detailList2

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds

        // param.serviceOrderProductList = detailList1.concat(detailList2)
        param.serviceOrderProductList = detailList
        delete param.fileIdList

        this.$modal
          .confirm(this.$t('SALES.serviceOrderSubmit'))
          .then(() => {
            this.submitLoading = true
            return updateServiceOrder(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(this.$t('SALES.serviceOrderSuccess').replace('$1', response.msg))
            this.cancel()
            this.submitLoading = false
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    validServiceProductList(detailList) {
      const valid = false
      if (detailList.length <= 0 && !this.form.storeIssueChitId) {
        // this.$modal.msgError(this.$t('SALES.prProductTableEmpty'))
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('menu.productInfo'))
        )
        return valid
      }
      if (detailList.length > 0) {
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
      }

      // const durationReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.duration) && item.valuationUnit !== 'order'
      // })
      // if (durationReq) {
      //   this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.duration')))
      //   return valid
      // }

      // const warrantyReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.warranty)
      // })
      // if (warrantyReq) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
      //   )
      //   return valid
      // }

      // const warrantyStartDateReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.warrantyStartDate)
      // })
      // if (warrantyStartDateReq) {
      //   this.$modal.msgError(
      //     this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
      //   )
      //   return valid
      // }

      return true
    },
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        return true
        // this.$modal.msgError(this.$t('SALES.prProductTableEmpty'))
        // this.$modal.msgError(
        //   this.$t('ui.fromIncomplete').replace('$1', this.$t('menu.productInfo'))
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

      /* const warrantyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warranty)
      })
      if (warrantyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyDays'))
        )
        return valid
      } */

      /* const warrantyStartDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.warrantyStartDate)
      })
      if (warrantyStartDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('SALES.warrantyStartDate'))
        )
        return valid
      }
      const startDateTime = this.appointTime(this.form.startDateTime, '00:00:00')
      const warrantyStartDateErr = detailList.find((item) => {
        return item.warrantyStartDate < startDateTime
      })
      if (warrantyStartDateErr) {
        this.$modal.msgError(this.$t('SALES.warrantyStartDateErrMsg'))
        return valid
      } */

      return true
    }
  }
}
</script>
<style lang="scss"></style>
