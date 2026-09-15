<template>
  <FormPageLayoutTabs ref="FormPageLayoutRef" v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" :loading="isLoading" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
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
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.type')}`" prop="storeIssueChitType">
                    <el-select
                      v-model="form.storeIssueChitType"
                      placeholder=""
                      style="width: 100%"
                      clearable
                      @change="typeChange"
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
                  <el-form-item :label="`${$t('SALES.warehouse')}`" prop="warehouseName">
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-select
                          v-model="form.warehouseIdList"
                          placeholder=""
                          style="width: 100%"
                          clearable
                          filterable
                          @change="warehouseIdListChange"
                          default-first-option
                          multiple
                          collapse-tags
                          class="log-msg-ellipsis"
                          :disabled="warehouseIdListLoading"
                          :loading="warehouseIdListLoading"
                        >
                          <el-option
                            v-for="item in warehouseList"
                            :key="item.warehouseId"
                            :label="item.warehouseName"
                            :value="item.warehouseId"
                          >
                          </el-option>
                        </el-select>
                      </div>

                      <div class="con-right">
                        <svg-icon
                          icon-class="list2"
                          class="primary-pointer"
                          style="font-size: 26px"
                          @click="openWarehouseTable"
                        />
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.dept')}`" prop="departmentId">
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
                  <el-form-item :label="`${$t('SALES.requiredBy')}`" prop="requiredBy">
                    <CommonSelectAndList
                      :id="form.requiredId"
                      :label="form.requiredBy"
                      idKey="userId"
                      labelKey="nickName"
                      clearable
                      filterable
                      :options="requiredList"
                      :disabled="!form.departmentId || requiredByLoading"
                      :loading="requiredByLoading"
                      @change="updatePurchasePerson"
                      @handleOpen="openPurchasePersonTable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.reason')}`" prop="reason">
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
                  <el-form-item :label="`${$t('SALES.isLoan')}`">
                    <el-switch
                      v-model="form.isLoan"
                      active-value="1"
                      inactive-value="0"
                      :disabled="form.storeIssueChitType === '3'"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="form.isLoan === '1'">
                  <el-form-item :label="`${$t('SALES.returnBy')}`" prop="returnBy">
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
                    <el-form-item :label="`${$t('SALES.driver')}`" prop="driverName">
                      <SelectInput
                        clearable
                        :value="form.driverName"
                        :title="form.driverName"
                        @click="openDriverTable"
                        @clear="driverNameClear"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" :key="'driver' + form.logisticsType">
                    <el-form-item :label="`${$t('SALES.vehicle')}`" prop="licensePlateNo">
                      <SelectInput
                        clearable
                        :value="form.licensePlateNo"
                        :title="form.licensePlateNo"
                        @click="openVehicleTable"
                        @clear="vehicleClear"
                      />
                    </el-form-item>
                  </el-col>
                </template>

                <template v-if="form.storeIssueChitType === '1'">
                  <el-col :span="8">
                    <el-form-item :label="`${$t('SALES.projectCode')}`" prop="costProjectCode">
                      <CommonSelectAndList
                        :id="form.costProjectId"
                        :label="form.costProjectCode"
                        idKey="costProjectId"
                        labelKey="costProjectCode"
                        clearable
                        filterable
                        :options="projectNameOptions"
                        :loading="costProjectNameLoading"
                        @change="costProjectNameChange"
                        @handleOpen="openCostProjectNameTable"
                      />
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
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.customerName')}`" prop="businessPartnerName">
                    <CommonSelectAndList
                      :id="form.businessPartnerMainId"
                      :label="form.businessPartnerName"
                      idKey="businessPartnerMainId"
                      labelKey="businessPartnerName"
                      filterable
                      :options="businessPartnerOptions"
                      @change="updateCustomer"
                      @handleOpen="openCustomerTable"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <!-- <el-form-item :label="`${$t('SALES.deliveryAddress')}`" prop="receiveAddress">
                    <el-input v-model="form.receiveAddress" :title="form.receiveAddress"></el-input>
                  </el-form-item> -->

                  <el-form-item :label="`${$t('SALES.deliveryAddress')}`" prop="receiveAddress">
                    <!-- <ToolTipShowObj
                      :mData="form.addressForBPAddress || {}"
                      :showStr="form.receiveAddressName"
                      :rows="bpAddressRows"
                    > -->
                    <div class="input-switch-box">
                      <div class="con-left">
                        <CommonSelectAndList
                          :id="form.receiveAddressId"
                          :label="form.receiveAddress"
                          idKey="businessAddressId"
                          labelKey="receiveAddress"
                          filterable
                          :options="businessAddressOptions"
                          :disabled="!form.businessPartnerId"
                          @change="deliveryAddressChange"
                          @handleOpen="openReceiveAddressTable"
                        />
                      </div>
                      <div class="con-right" v-if="form.businessPartnerId">
                        <i
                          class="el-icon-edit primary"
                          style="font-size: 20px"
                          @click="openAddBPAddressDlg"
                        ></i>
                      </div>
                    </div>

                    <!-- </ToolTipShowObj> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.contactPerson')}`" prop="bpContactPersonName">
                    <div class="input-switch-box">
                      <div class="con-left">
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
                      </div>
                      <div class="con-right" v-if="form.businessPartnerId">
                        <i
                          class="el-icon-edit primary"
                          style="font-size: 20px"
                          @click="openAddBPContactPersonDlg"
                        ></i>
                      </div>
                    </div>
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
              <!-- v-if="form.storeIssueChitType === '2'" -->
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('SALES.projectCode')}`" prop="costProjectCode">
                    <CommonSelectAndList
                      :id="form.costProjectId"
                      :label="form.costProjectCode"
                      idKey="costProjectId"
                      labelKey="costProjectCode"
                      clearable
                      filterable
                      :options="projectNameOptions"
                      :loading="costProjectNameLoading"
                      @change="costProjectNameChange"
                      @handleOpen="openCostProjectNameTable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" ref="collapseScrollPage">
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
              :warehouseList="form.warehouseList || []"
              :warehouseIdList="form.warehouseIdList || []"
              :costProjectId="form.costProjectId"
              @updateTable="updateProductTable"
              @scrollPageToTable="scrollPageToTable"
              @isRequestLoading="isRequestLoading"
            />
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>

    <selectCustomerTable ref="selectCustomerTable" @update="updateCustomer" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />

    <selectDriverDlg ref="selectDriverDlg" @onSuccess="updateDriver" />
    <selectVehicleDlg ref="selectVehicleDlg" @onSuccess="updateVehicle" />

    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="deliveryAddressChange"
    />

    <addBPAddressDlg ref="addBPAddressDlg" :isStoreIssueChit="true" @update="addBPAddress" />

    <addBPContactPersonDlg
      ref="addBPContactPersonDlg"
      :businessPartnerType="form.businessPartnerType"
      :isStoreIssueChit="true"
      @update="addBPContactPerson"
    />

    <!-- {{ form.businessPartnerId }} -->
    <selectCostProjectTable
      ref="selectCostProjectTable"
      :businessPartnerId="form.businessPartnerId"
      @update="costProjectNameChange"
    />
  </FormPageLayoutTabs>
</template>

<script>
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryAddressByBusinessPartnerId } from '@/api/purchaseManagement/purchaseContract'
import {
  saveStoreIssueChit,
  getSystemSetup,
  queryLegalEntityDepartmentList
} from '@/api/projectManagement/storeIssueChit'
import { queryCanSelectCostProjectList } from '@/api/projectManagement/project'
import {
  queryCanSelectCustomerListHavePage,
  queryCanSelectWarehouseListHaveDataPermissions
} from '@/api/salesManagement/salesInquiry'
import { queryUsers } from '@/api/organization/corporate'

import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/salesManagement/lang/index'
import locale1 from '@/views/purchaseManagement/lang/index'
import ProductTable from './productTable.vue'
import selectCustomerTable from './components/selectCustomerTable.vue'
import selectWarehouseTable from './components/multipSelectWarehouseTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import payToAddressDlg from '@/views/salesManagement/salesInquiry/components/payToAddressDlg.vue'
import selectDriverDlg from './components/selectDriverDlg.vue'
import selectVehicleDlg from './components/selectVehicleDlg.vue'
import addBPAddressDlg from '@/views/salesManagement/salesInquiry/components/addBPAddressDlg.vue'
import addBPContactPersonDlg from '@/views/salesManagement/salesInquiry/components/addBPContactPersonDlg.vue'
import selectCostProjectTable from '@/views/projectManagement/projectProduction/components/selectCostProjectTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['store_issue_chit_status', 'store_issue_chit_type', 'logistics_type'],
  components: {
    ProductTable,
    selectCustomerTable,
    selectWarehouseTable,
    selectPurchasePersonTable,
    payToAddressDlg,
    selectDriverDlg,
    selectVehicleDlg,
    addBPAddressDlg,
    addBPContactPersonDlg,
    selectCostProjectTable
  },
  data() {
    const vm = this
    return {
      saveKey: '11',
      activeNames: [],
      submitLoading: false,
      activeName: 'storeIssueChitDetails',
      rowId: '',
      timeId: '',
      form: {},
      projectNameOptions: [],
      costProjectNameLoading: false,
      businessPartnerOptions: [],
      businessAddressOptions: [],
      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      timeDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
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
      rules: {
        storeIssueChitType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        warehouseIdList: [
          {
            required: true,
            type: 'array',
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
        requiredBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
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
        driverName: [
          {
            required: false,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        licensePlateNo: [
          {
            required: false,
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
        receiveAddressName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        bpContactPersonName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        receiveAddress: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
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
      basicUpdateProps: [],
      accountSupplierUpdateProps: [],
      accountCustomerUpdateProps: [],
      deptOptions: [],
      warehouseList: [],
      requiredList: [],
      loading: false,
      warehouseIdListLoading: false,
      requiredByLoading: false,
      isLoading: false
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
    this.$i18n.mergeLocaleMessage('zh', locale1.zh)
    this.$i18n.mergeLocaleMessage('en', locale1.en)
  },
  created() {
    this.$$initColumnVisible(this.saveKey, this.columns)
  },
  methods: {
    isRequestLoading(loading) {
      this.isLoading = loading
    },
    queryCanSelectWarehouseListHaveDataPermissions() {
      this.warehouseIdListLoading = true
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.warehouseTypeList = ['1', '2']
      param.menuPerms = this.menuKey.storeIssueChit

      queryCanSelectWarehouseListHaveDataPermissions(param)
        .then((response) => {
          const rows = response.rows || []
          this.warehouseList = rows
          this.warehouseIdListLoading = false
        })
        .catch(() => {
          this.warehouseIdListLoading = false
        })
    },
    queryUsers() {
      const param = {
        pageNum: 1,
        pageSize: 9999,
        departmentId: this.form.departmentId
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.storeIssueChit
      this.requiredByLoading = true
      queryUsers(param)
        .then((response) => {
          this.total = response.total
          this.requiredList = response.rows || []
          this.requiredByLoading = false
        })
        .catch((err) => {
          this.requiredByLoading = false
          window.console.error(err)
        })
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
      queryAddressByBusinessPartnerId(param)
        .then((response) => {
          const rows = response.rows || []
          this.businessAddressOptions = rows
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    openReceiveAddressTable() {
      this.$refs.payToAddressDlg.handleOpen()
    },
    deliveryAddressChange(row) {
      // this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
    },
    deliveryAddressClear() {
      // this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
    },
    openAddBPAddressDlg() {
      if (this.form.isAdhocEntryAddress === '1') {
        this.$refs.addBPAddressDlg.handleEdit(this.form.bpBusinessAddress)
      } else if (this.form.bpBusinessAddressOldData) {
        this.$refs.addBPAddressDlg.handleEdit(this.form.bpBusinessAddressOldData)
      } else {
        this.$refs.addBPAddressDlg.handleEdit()
      }
    },
    addBPAddress(row) {
      row.isAdhocEntryAddress = '1'
      this.$set(this.form, 'bpBusinessAddress', row)
      this.$set(this.form, 'bpBusinessAddressOldData', row)
      this.$set(this.form, 'receiveAddressName', row.receiveAddressName || row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
      this.$set(this.form, 'isAdhocEntryAddress', '1')
    },
    openAddBPContactPersonDlg() {
      if (this.form.isAdhocEntryContactPerson === '1') {
        this.$refs.addBPContactPersonDlg.handleEdit(this.form.bpBusinessContactPerson)
      } else {
        this.$refs.addBPContactPersonDlg.handleEdit()
      }
    },
    addBPContactPerson(row) {
      row.isAdhocEntryContactPerson = '1'
      this.$set(this.form, 'bpBusinessContactPerson', row)
      this.$set(this.form, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'bpContactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'bpMobileNum', row.mobileNum)
      this.$set(this.form, 'bpMobileCode', row.mobileCode)
      this.$set(this.form, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.form, 'bpEmail', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')
    },
    handleAdd() {
      this.reset()
      this.$set(this.form, 'requiredId', this.$store.state.user.userId)
      this.$set(this.form, 'requiredBy', this.$store.state.user.nickName)
      this.queryLegalEntityDepartmentList()
      this.queryCurrencyListBySelect()
      this.getSystemSetup()
      this.queryCanSelectCostProjectList()
      this.queryCanSelectWarehouseListHaveDataPermissions()
      this.queryBusinessPartnerOptions()
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const { returnDays } = res.data
        let date = +new Date()
        if (returnDays) {
          date = date + returnDays * 24 * 60 * 60 * 1000
        }
        this.$set(this.form, 'returnBy', date)
      })
    },
    queryLegalEntityDepartmentList() {
      queryLegalEntityDepartmentList({}).then((res) => {
        this.deptOptions = res.data || []
        this.deptOptions.forEach((item) => {
          item.customLabel =
            (item.branchCompanyName ? item.branchCompanyName + ' - ' : '') + item.departmentName
          if (item.isDefault === '1') {
            this.$set(this.form, 'departmentId', item.departmentId)
            this.$set(this.form, 'departmentName', item.departmentName)
            this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
            this.queryUsers()
          }
        })
      })
    },
    departmentChange(value) {
      const item = this.deptOptions.find((item) => item.departmentId === value) || {}
      this.$set(this.form, 'departmentId', item.departmentId)
      this.$set(this.form, 'departmentName', item.departmentName)
      this.$set(this.form, 'allSuperiorName', item.allSuperiorName)
      /* if (this.form.requiredId !== this.$store.state.user.userId) {
      } */
      this.purchasePersonClear()
      this.queryUsers()
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
    /* updateWarehouse(row) {
      const { warehouseName, warehouseId } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.initProductList = []
    }, */
    warehouseIdListChange() {
      if (this.form.warehouseIdList.length) {
        const list = this.warehouseList.filter(
          (x) => this.form.warehouseIdList.indexOf(x.warehouseId) !== -1
        )
        this.updateWarehouse(list)
      } else {
        this.warehouseClear()
      }
    },
    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen(this.form.warehouseList || [])
    },

    updateWarehouse(list) {
      const rows = list || []
      this.$set(this.form, 'warehouseList', rows)
      this.$set(
        this.form,
        'warehouseIdList',
        rows.map((item) => item.warehouseId)
      )
      this.$set(this.form, 'warehouseName', rows.map((item) => item.warehouseName).join(', '))
    },
    warehouseClear() {
      this.$set(this.form, 'warehouseList', [])
      this.$set(this.form, 'warehouseIdList', [])
      this.$set(this.form, 'warehouseName', undefined)
      /* this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined) */
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
        logisticsType: '3',
        isLoan: '1',
        departmentId: undefined,
        receiveAddress: undefined,
        costProjectId: undefined,
        warehouseIdList: []
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
      this.customerClear()
      /* if (this.form.storeIssueChitType !== '2' && this.form.storeIssueChitType !== '3') {
        this.customerClear()
      } */
      if (this.projectNameOptions.length <= 0) {
        this.queryCanSelectCostProjectList()
      }
    },
    logisticsTypeChange() {
      this.driverNameClear()
      this.vehicleClear()
    },
    openDriverTable() {
      this.$refs.selectDriverDlg.handleOpen()
    },
    updateDriver(row) {
      const { driverId, driverName } = row
      this.$set(this.form, 'driverId', driverId)
      this.$set(this.form, 'driverName', driverName)
    },
    driverNameClear() {
      this.$set(this.form, 'driverId', undefined)
      this.$set(this.form, 'driverName', undefined)
    },
    openVehicleTable() {
      this.$refs.selectVehicleDlg.handleOpen()
    },
    updateVehicle(row) {
      const { vehicleId, licensePlateNo } = row
      this.$set(this.form, 'vehicleId', vehicleId)
      this.$set(this.form, 'licensePlateNo', licensePlateNo)
    },
    vehicleClear() {
      this.$set(this.form, 'vehicleId', undefined)
      this.$set(this.form, 'licensePlateNo', undefined)
    },
    // 项目名称
    queryCanSelectCostProjectList() {
      this.costProjectNameLoading = true
      queryCanSelectCostProjectList({ businessPartnerId: this.form.businessPartnerId })
        .then((response) => {
          this.projectNameOptions = response.data || []
          this.costProjectNameLoading = false
        })
        .catch((err) => {
          window.console.error(err)
          this.costProjectNameLoading = false
        })
    },
    openCostProjectNameTable() {
      this.$refs.selectCostProjectTable.handleOpen(this.form.costProjectId)
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

        if (this.form.storeIssueChitType === '2' && this.form.storeIssueChitType === '3') {
          const { businessAddress, businessPartner } = item
          if (
            businessPartner &&
            businessPartner.businessPartnerId &&
            !this.form.businessPartnerId
          ) {
            this.updateCustomer(businessPartner, 'formProject')
            if (businessAddress && businessAddress.businessAddressId) {
              this.deliveryAddressChange(businessAddress)
            } else if (this.form.receiveAddressId) {
              this.deliveryAddressClear()
            }
            this.queryCanSelectCostProjectList()
          }
        }
      }
      // this.initProductList = []
    },

    // 取消按钮
    cancel(type) {
      this.$emit('back', type)
    },

    /* 表单部分Start */
    queryBusinessPartnerOptions() {
      const param = {
        pageNum: 1,
        pageSize: 9999
      }
      this.$trimOfObj(param)
      param.menuPerms = this.menuKey.storeIssueChit
      queryCanSelectCustomerListHavePage(param).then((response) => {
        const rows = response.rows || []
        this.businessPartnerOptions = rows
      })
    },
    openCustomerTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    updateCustomer(row, type) {
      if (!row.businessPartnerMainId) {
        this.customerClear()
        return
      }
      const businessPartnerId = this.form.businessPartnerId
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
      if (type !== 'formProject') {
        this.deliveryAddressClear()
      }
      if (
        row.bpBusinessAddressList &&
        row.bpBusinessAddressList.length === 1 &&
        (type !== 'formProject' || !this.form.receiveAddressId)
      ) {
        this.deliveryAddressChange(row.bpBusinessAddressList[0])
      }
      const arr = row.bpBusinessContactPersonList.filter((x) => x.isDefault === '1')
      if (arr && arr.length > 0) {
        this.contactPersonChange(arr[0])
      }
      if (this.form.costProjectId && type !== 'formProject') {
        if (businessPartnerId !== this.form.businessPartnerId) {
          this.costProjectNameChange()
        }
      }
      if (type !== 'formProject') {
        this.queryCanSelectCostProjectList()
      }
      this.queryAddressByBusinessPartnerId()
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
      this.costProjectNameChange()
      this.queryCanSelectCostProjectList()
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
    /* 表格部分End */
    async submitForm(submitType) {
      setTimeout(async () => {
        const valid1 = await this.$refs.form1.validate().catch((err) => {
          return err
        })
        this.collapseWarningForBasicInfo = !valid1
        if (!valid1) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
          return
        }

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

        const tableList = this.$refs.ProductTable.tableList
        if (tableList.length <= 0) {
          this.collapseWarningForProductInfo = true
          this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
          return true
        }
        const qtyReq = tableList.find((item) => {
          return !this.$resultOfBoolean(item.qty)
        })
        if (qtyReq) {
          this.$refs.ProductTable.errorMessage('qty')

          this.collapseWarningForProductInfo = true
          this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.qty')))
          return
        }
        this.collapseWarningForProductInfo = false

        if (valid1 && valid2) {
          let param = { ...this.form }
          param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
          param.storeIssueChitProductList = tableList
          const preemptRiskConfirmed = tableList.some((x) => x.preemptRiskConfirmed === '1')
          if (preemptRiskConfirmed) {
            param.preemptRiskConfirmed = '1'
          }

          this.$modal
            .confirm(this.$t('SALES.storeIssueChitConfirm'))
            .then(() => {
              this.submitLoading = true
              return saveStoreIssueChit(param)
            })
            .then((response) => {
              this.submitLoading = false
              this.$modal.msgSuccess(
                this.$t('SALES.storeIssueChitSuccess').replace('$1', response.msg)
              )
              this.cancel()
            })
            .catch(() => {
              this.submitLoading = false
            })
        }
      }, 200)
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
    }
  }
}
</script>
<style lang="scss"></style>
