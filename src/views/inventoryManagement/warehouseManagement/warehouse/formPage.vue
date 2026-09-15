<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" v-if="!comDisFrom" size="mini" @click="submitForm"
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
              <template v-if="!!propRowId">
                <span class="info-item mr20" :title="createForm.warehouseName">
                  {{ $t('INVENTORY.warehouseName') }} : {{ createForm.warehouseName }}
                </span>
                <span class="info-item">
                  {{ $t('ui.isActive') }} :
                  {{ createForm.isActive === '1' ? $t('uiBtn.active') : $t('uiBtn.inactive') }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.warehouseName')}`" prop="warehouseName">
                    <el-input
                      v-model="createForm.warehouseName"
                      :title="createForm.warehouseName"
                      maxlength="200"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.warehouseType')}`" prop="warehouseType">
                    <el-select
                      v-model="createForm.warehouseType"
                      placeholder=""
                      style="width: 100%"
                      clearable
                      @change="warehouseTypeChange"
                      :disabled="!!propRowId"
                    >
                      <el-option
                        v-for="dict in dict.type.warehouse_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.warehouseCode')}`" prop="warehouseCode">
                    <el-input
                      v-model="createForm.warehouseCode"
                      :title="createForm.warehouseCode"
                      disabled
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="createForm.description"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8" v-if="createForm.warehouseType === '2'">
                  <el-form-item
                    :label="`${$t('INVENTORY.consignor1')}`"
                    prop="consignorName"
                    :rules="{
                      required: createForm.warehouseType === '2',
                      message: $t('ui.reqMsg'),
                      trigger: ['blur', 'change']
                    }"
                  >
                    <SelectInput
                      :value="createForm.consignorName"
                      :title="createForm.consignorName"
                      @clear="consignorNameClear"
                      clearable
                      @click="openConsignorTable"
                      class="form-wd"
                      :disabled="!!propRowId"
                      v-if="createForm.warehouseType === '2'"
                    />

                    <!-- <SelectInput
                      clearable
                      :value="createForm.consignorName"
                      :title="createForm.consignorName"
                      @click="openCustomerTable"
                      @clear="customerClear"
                      :disabled="!!propRowId"
                      v-else-if="createForm.warehouseType === '3'"
                    /> -->
                    <el-input
                      v-model="createForm.consignorName"
                      :title="createForm.consignorName"
                      disabled
                      class="form-wd"
                      v-else
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="8"
                  v-if="
                    createForm.warehouseType === '1' && sysDockingSwitch && isSystemDocking === '1'
                  "
                >
                  <el-form-item
                    :label="`${$t('notification.plant')}`"
                    prop="plantName"
                    :rules="{
                      required: true,
                      message: $t('ui.reqMsg'),
                      trigger: ['blur', 'change']
                    }"
                  >
                    <CommonSelect
                      :id="createForm.plantId"
                      :label="createForm.plantName"
                      idKey="plantId"
                      labelKey="plantName"
                      filterable
                      :options="plantOptions"
                      @change="plantChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="createForm.warehouseType === '3'">
                  <el-form-item
                    :label="`${$t('INVENTORY.customerName')}`"
                    prop="businessPartnerName"
                    :rules="{
                      required: true,
                      message: $t('ui.reqMsg'),
                      trigger: ['blur', 'change']
                    }"
                  >
                    <SelectInput
                      clearable
                      :value="createForm.businessPartnerName"
                      :title="createForm.businessPartnerName"
                      @click="openCustomerTable"
                      @clear="customerClear"
                      :disabled="!!propRowId"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('INVENTORY.receivedBy')}`" prop="userIdList">
                    <el-select
                      v-model="createForm.userIdList"
                      clearable
                      multiple
                      collapse-tags
                      placeholder=""
                      style="width: 100%"
                      class="log-msg-ellipsis"
                      filterable
                      :title="createForm.picUserNameShowStr"
                      v-if="createForm.warehouseType === '3'"
                      :disabled="!createForm.businessPartnerId"
                      @change="receivedByChange"
                    >
                      <el-option
                        v-for="dict in createForm.bpBusinessContactPersonList || []"
                        :key="dict.contactPersonId"
                        :label="dict.contactPersonName"
                        :value="dict.contactPersonId"
                      ></el-option>
                    </el-select>
                    <SelectInput
                      v-else
                      :value="createForm.picUserNameShowStr"
                      :title="createForm.picUserNameShowStr"
                      @clear="picUserNameClear"
                      clearable
                      @click="openPicTable"
                      class="form-wd"
                      :disabled="comDisFrom"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('organization.email')}`" prop="emailShowStr">
                    <el-input
                      v-model="createForm.emailShowStr"
                      :title="createForm.emailShowStr"
                      class="form-wd"
                      disabled
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('organization.mobilePhone')}`"
                    prop="mobilePhoneShowStr"
                  >
                    <el-input
                      v-model="createForm.mobilePhoneShowStr"
                      :title="createForm.mobilePhoneShowStr"
                      disabled
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-row :span="24">
                  <el-form-item :label="$t('ui.attachment')">
                    <myUpload ref="uploadRef" :disabled="comDisFrom" />
                  </el-form-item>
                </el-row>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isDefault')}`" prop="isDefault">
                    <el-switch
                      v-model="createForm.isDefault"
                      active-value="1"
                      inactive-value="0"
                      :disabled="isDisabled || isDisabledDefault"
                      @change="isDefaultChange"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`">
                    <el-switch
                      v-model="createForm.isActive"
                      :disabled="isDsActive"
                      active-value="1"
                      inactive-value="0"
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
              :title="$t('organization.titleAddress')"
              :warning="collapseWarningForTitleAddress"
            >
            </FormCollapseItemTitle>
            <div>
              <el-form
                ref="addressForm"
                :model="addressForm"
                :rules="addressRules"
                label-width="195px"
                :disabled="comDisFrom"
              >
                <el-row class="mt22">
                  <el-col :span="24">
                    <el-form-item :label="`${$t('INVENTORY.label')}`" prop="label">
                      <el-input v-model="addressForm.label" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('organization.address1')}`" prop="address1">
                      <el-input v-model="addressForm.address1" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('organization.address2')}`" prop="address2">
                      <el-input v-model="addressForm.address2" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.location')}`" prop="location">
                      <el-input v-model="addressForm.location" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.city')}`" prop="city">
                      <el-input v-model="addressForm.city" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.province')}`" prop="province">
                      <el-input v-model="addressForm.province" :maxlength="200" class="form-wd" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.postalCode')}`" prop="postalCode">
                      <el-input
                        v-model="addressForm.postalCode"
                        :maxlength="20"
                        placeholder=""
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('organization.country')}`" prop="country">
                      <country-select
                        v-model="addressForm.country"
                        class="form-wd"
                        @select="handleCountrySelect2"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                      <MyInput
                        type="textarea"
                        v-model="addressForm.remarks"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        show-word-limit
                        :maxlength="3000"
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="!!propRowId">
          <el-collapse-item name="3">
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="createForm.operationLogForLast">
                <span
                  v-if="createForm.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="createForm.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ createForm.operationLogForLast.operatorBy }}
                </span>
                <span v-if="createForm.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(createForm.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="operationLogList" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
    <selectPicTable ref="selectPicTable" @updatePic="updatePic" />
    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectCustomerTable ref="selectCustomerTable" @update="updateCustomer" />
  </FormPageLayout>
</template>

<script>
import locale from '@/views/inventoryManagement/lang/index'
import locale1 from '@/views/organization/lang/index'
import locale2 from '@/views/salesManagement/lang/index'
import locale3 from '@/views/purchaseManagement/lang/index'

import countrySelect from '@/components/select/countrySelect'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

import {
  queryDefaultWarehouse,
  saveWarehouse,
  queryWarehouseById,
  updateWarehouse,
  getAllPlantList
} from '@/api/inventoryManagement/warehouse'
import { queryContactPersonByBusinessPartnerIdNoPage } from '@/api/purchaseManagement/purchaseReturnOrder'
import selectPicTable from './selectPicTable.vue'
import selectSupplierTable from '@/views/purchaseManagement/purchaseOrder/components/selectSupplierTable.vue'
import selectCustomerTable from '@/views/projectManagement/storeIssueChit/components/selectCustomerTable.vue'

export default {
  name: 'Warehouse',
  dicts: ['warehouse_type'],
  components: {
    countrySelect,
    selectPicTable,
    SystemOperationLogTable,
    selectSupplierTable,
    selectCustomerTable
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
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      submitLoading: false,
      // 一定要放在当前文件
      curPath: this.$options.__file,

      propVal: 'currencyCode',

      createForm: {
        createdBy: this.$store.state.user.nickName
      },
      createRules: {
        warehouseName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        warehouseType: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        picUserName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        userIdList: [
          {
            type: 'array',
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },

      addressForm: {},
      addressRules: {
        label: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        address1: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        province: [
          {
            required: false,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        postalCode: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        city: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        country: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      activeNames: ['1', '2'],
      isInit: true,
      timeId: '',
      collapseWarningForBasicInfo: false,
      collapseWarningForTitleAddress: false,
      deptOptions: [],
      isDisabledDefault: false,
      operationLogList: [],
      plantOptions: []
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
        } else {
          this.handleAdd()
        }
      }
    }
  },
  computed: {
    isDsActive() {
      return Number(this.createForm.isDefault) === 1
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    isDisabled() {
      if (this.createForm.warehouseType !== '1') return true
      return false
    },
    sysDockingSwitch() {
      return this.$store.getters.sysDockingSwitch || this.$store.getters.sysDockingSwitchQC
    },
    // 法人对接
    isSystemDocking() {
      return this.$store.state.user.legalEntityInfo.isSystemDocking
    },
    editAuth() {
      return this.checkPermi(['inventoryManagement:warehouse:edit'])
    },
    comDisFrom() {
      if (this.isView) {
        return true
      }
      if (!this.editAuth) {
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
    this.$i18n.mergeLocaleMessage('zh', locale2.zh)
    this.$i18n.mergeLocaleMessage('en', locale2.en)
    this.$i18n.mergeLocaleMessage('zh', locale3.zh)
    this.$i18n.mergeLocaleMessage('en', locale3.en)
  },
  created() {
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {},
  methods: {
    // 查询表数据
    getAllPlantList() {
      getAllPlantList().then((res) => {
        this.plantOptions = res.data || []
      })
    },
    handleAdd() {
      const vm = this
      this.reset()
      vm.$set(vm.createForm, 'creatorName', this.$store.state.user.nickName)
      setTimeout(() => {
        const info = this.$store.state.user.legalEntityInfo
        vm.$set(vm.addressForm, 'country', info.country)
        vm.$set(vm.addressForm, 'countryId', info.countryId)
      }, 1000)

      this.queryDefaultWarehouse()
      this.getAllPlantList()
    },
    handleUpdate() {
      this.reset()
      this.getAllPlantList()
      queryWarehouseById({ warehouseId: this.rowId }).then((res) => {
        this.queryDefaultWarehouse()
        const {
          commonFileList,
          operationLogList,
          warehouseAddress,
          userId,
          picUserName,
          mobilePhone,
          mobileCode,
          mobileNum,
          email,
          ...params
        } = res.data
        this.createForm = Object.assign(this.createForm, JSON.parse(JSON.stringify(params)))
        const userIdList = this.createForm.userIds.split(',')
        this.$set(this.createForm, 'userIdList', userIdList)
        this.$set(this.createForm, 'picUserName', picUserName)
        this.$set(this.createForm, 'userId', userId)
        this.$set(this.createForm, 'mobilePhone', mobilePhone)
        this.$set(this.createForm, 'mobileCode', mobileCode)
        this.$set(this.createForm, 'mobileNum', mobileNum)
        this.$set(this.createForm, 'email', email)
        this.addressForm = Object.assign(
          this.addressForm,
          JSON.parse(JSON.stringify(warehouseAddress))
        )
        this.operationLogList = operationLogList || []
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(commonFileList || [])
          // if (this.createForm.warehouseType === '1') {
          //   this.createForm.consignorName = this.$store.state.user.legalEntityInfo.legalEntityName
          //   this.createForm.consignorId = this.$store.state.user.legalEntityInfo.legalEntityId
          // }
        }, 300)
        this.$nextTick(() => {
          this.$refs.createForm.clearValidate()
          this.$refs.addressForm.clearValidate()
        })

        if (this.createForm.warehouseType === '3') {
          this.queryContactPersonByBusinessPartnerIdNoPage()
        }
      })
    },
    // 查询默认仓库
    queryDefaultWarehouse() {
      queryDefaultWarehouse({}).then((res) => {
        const { warehouseId } = res.data || {}
        if (warehouseId && warehouseId !== this.rowId) {
          this.isDisabledDefault = true
          this.$set(this.createForm, 'isDefault', '0')
        } else if (this.createForm.warehouseType === '1' && !this.rowId) {
          this.$set(this.createForm, 'isDefault', '1')
        }
      })
    },
    warehouseTypeChange() {
      if (this.createForm.warehouseType === '1' && !this.isDisabledDefault) {
        this.$set(this.createForm, 'isDefault', '1')
      } else {
        this.$set(this.createForm, 'isDefault', '0')
      }
      if (this.createForm.warehouseType === '1' || this.createForm.warehouseType === '3') {
        this.createForm.consignorName = this.$store.state.user.legalEntityInfo.legalEntityName
        this.createForm.consignorId = this.$store.state.user.legalEntityInfo.legalEntityId
      } else {
        this.customerClear()
        this.consignorNameClear()
      }
      if (this.createForm.warehouseType === '1' || this.createForm.warehouseType === '3') {
        this.customerClear()
      }
      this.plantChange({})
      this.picUserNameClear()

      this.$refs.createForm.clearValidate('businessPartnerName')
      setTimeout(() => {
        this.$refs.createForm.clearValidate('userIdList')
      }, 50)
    },
    isDefaultChange(val) {
      const vm = this
      if (Number(val) === 1) {
        vm.$set(vm.createForm, 'isActive', '1')
      }
    },
    changeInputNum(num) {
      // const reg = /^[0-9]*$/g
      num = num.replace(/[^\d]/g, '').replace(/\s/g, '')
      return num
    },
    // 清空pic
    picUserNameClear() {
      // this.$set(this.createForm, 'picUserName', undefined)
      // this.$set(this.createForm, 'userId', undefined)
      // this.$set(this.createForm, 'mobilePhone', undefined)
      // this.$set(this.createForm, 'mobileCode', undefined)
      // this.$set(this.createForm, 'mobileNum', undefined)
      // this.$set(this.createForm, 'email', undefined)

      this.$set(this.createForm, 'userIdList', [])
      this.$set(this.createForm, 'picUserNameShowStr', undefined)
      this.$set(this.createForm, 'emailShowStr', undefined)
      this.$set(this.createForm, 'mobilePhoneShowStr', undefined)
    },
    // 打开pic弹窗
    openPicTable() {
      const { userList } = this.createForm
      this.$refs.selectPicTable.handleOpen(userList || [])
    },
    updatePic(data = []) {
      // const { nickName, userId, mobilePhone, mobileCode, mobileNum, email } = row
      // this.$set(this.createForm, 'picUserName', nickName)
      // this.$set(this.createForm, 'userId', userId)
      // this.$set(this.createForm, 'mobilePhone', mobilePhone)
      // this.$set(this.createForm, 'mobileCode', mobileCode)
      // this.$set(this.createForm, 'mobileNum', mobileNum)
      // this.$set(this.createForm, 'email', email)
      const userIdList = data.map((x) => x.userId)
      const picUserNameShowStr = data.map((x) => x.nickName).join(',')
      const emailShowStr = data.map((x) => x.email).join(',')
      const mobilePhoneShowStr = data.map((x) => x.mobilePhone).join(',')

      this.$set(this.createForm, 'userList', data)
      this.$set(this.createForm, 'userIdList', userIdList)
      this.$set(this.createForm, 'picUserNameShowStr', picUserNameShowStr)
      this.$set(this.createForm, 'emailShowStr', emailShowStr)
      this.$set(this.createForm, 'mobilePhoneShowStr', mobilePhoneShowStr)
    },
    consignorNameClear() {
      this.$set(this.createForm, 'consignorId', undefined)
      this.$set(this.createForm, 'consignorName', undefined)
    },
    openConsignorTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    updateSupplier(row) {
      // this.$set(this.createForm, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.createForm, 'consignorId', row.businessPartnerId)
      this.$set(this.createForm, 'consignorName', row.businessPartnerName)
    },
    /* 表单部分Start */
    openCustomerTable() {
      this.$refs.selectCustomerTable.handleOpen()
    },
    updateCustomer(row) {
      this.$set(this.createForm, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.createForm, 'businessPartnerName', row.businessPartnerName)
      this.receivedByClear()
      this.$nextTick(() => {
        this.$refs.createForm && this.$refs.createForm.clearValidate('userIdList')
      })
      this.queryContactPersonByBusinessPartnerIdNoPage()
    },
    plantChange(row) {
      this.$set(this.createForm, 'plantId', row.plantId)
      this.$set(this.createForm, 'plantName', row.plantName)
    },
    // 清空供应商
    customerClear() {
      this.$set(this.createForm, 'businessPartnerId', undefined)
      this.$set(this.createForm, 'businessPartnerName', undefined)
      this.receivedByClear()
    },
    queryContactPersonByBusinessPartnerIdNoPage() {
      queryContactPersonByBusinessPartnerIdNoPage({
        businessPartnerMainId: this.createForm.businessPartnerId
      }).then((res) => {
        const data = res.data || []
        // const defaultContact = data.find((item) => item.isDefault === '1')
        // if (defaultContact && !this.rowId) {
        //   this.receivedByChange(defaultContact)
        // }
        this.$set(this.createForm, 'bpBusinessContactPersonList', data)
      })
    },
    receivedByChange(e) {
      // this.$set(this.createForm, 'picUserName', row.contactPersonName)
      // this.$set(this.createForm, 'userId', row.contactPersonId)
      // this.$set(this.createForm, 'mobilePhone', row.mobilePhone)
      // this.$set(this.createForm, 'mobileCode', row.mobileCode)
      // this.$set(this.createForm, 'mobileNum', row.mobileNum)
      // this.$set(this.createForm, 'email', row.email)
      console.log(e, '===810')
      const { bpBusinessContactPersonList } = this.createForm
      const list = bpBusinessContactPersonList.filter((x) => e.indexOf(x.contactPersonId) !== -1)
      const picUserNameShowStr = list.map((x) => x.contactPersonName).join(',')
      const emailShowStr = list.map((x) => x.email).join(',')
      const mobilePhoneShowStr = list.map((x) => x.mobilePhone).join(',')
      this.$set(this.createForm, 'userIdList', e)
      this.$set(this.createForm, 'picUserNameShowStr', picUserNameShowStr)
      this.$set(this.createForm, 'emailShowStr', emailShowStr)
      this.$set(this.createForm, 'mobilePhoneShowStr', mobilePhoneShowStr)
    },
    receivedByClear() {
      this.$set(this.createForm, 'picUserName', undefined)
      this.$set(this.createForm, 'userId', undefined)
      this.$set(this.createForm, 'mobilePhone', undefined)
      this.$set(this.createForm, 'mobileCode', undefined)
      this.$set(this.createForm, 'mobileNum', undefined)
      this.$set(this.createForm, 'email', undefined)

      this.$set(this.createForm, 'userIdList', undefined)
      this.$set(this.createForm, 'picUserNameShowStr', undefined)
      this.$set(this.createForm, 'emailShowStr', undefined)
      this.$set(this.createForm, 'mobilePhoneShowStr', undefined)
    },

    reset() {
      this.createForm = {
        warehouseName: '',
        warehouseType: '1',
        picUserName: '',
        description: undefined,
        userId: '',
        mobilePhone: '',
        mobileCode: '',
        mobileNum: '',
        email: '',
        website: '',
        fax: '',
        isDefault: '0',
        isActive: '1',
        createdBy: this.$store.state.user.nickName,
        consignorName: '',
        consignorId: '',
        businessPartnerId: '',
        businessPartnerName: '',
        plantId: '',
        plantName: '',
        userIdList: [],
        picUserNameShowStr: ''
      }
      this.addressForm = {
        label: '',
        address1: '',
        address2: '',
        province: '',
        location: '',
        postalCode: '',
        city: '',
        country: undefined,
        countryId: undefined,
        remarks: ''
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForTitleAddress = false
      this.isDisabledDefault = false
      this.operationLogList = []
      this.activeNames = ['1', '2', '3']
      this.resetForm('createForm')
      this.resetForm('addressForm')
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      setTimeout(() => {
        if (this.createForm.warehouseType === '1' && !this.rowId) {
          this.createForm.consignorName = this.$store.state.user.legalEntityInfo.legalEntityName
          this.createForm.consignorId = this.$store.state.user.legalEntityInfo.legalEntityId
        }
      }, 1000)
    },

    handleCountrySelect2(row) {
      if (row) {
        const { id, name } = row
        this.$set(this.addressForm, 'country', name)
        this.$set(this.addressForm, 'countryId', id)
      }
    },

    handleCurrencyChange(row) {
      this.$nextTick(() => {
        this.$set(this.createForm, 'currencyId', row.id || '')
        this.$set(this.createForm, 'currency', row.currency)
        this.$set(this.createForm, 'currencyCode', row.currencyCode)
      })
    },
    saveWarehouse(param) {
      const vm = this
      vm.submitLoading = true
      saveWarehouse(param)
        .then((res) => {
          vm.$message.success(
            `${vm.$t('INVENTORY.warehouseSuccess').replace('$1', param.warehouseName)}`
          )
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    updateWarehouse(param) {
      const vm = this
      vm.submitLoading = true
      updateWarehouse(param)
        .then((res) => {
          vm.$message.success(
            `${vm.$t('INVENTORY.warehouseSuccess').replace('$1', param.warehouseName)}`
          )
          this.cancel()
          vm.submitLoading = false
        })
        .catch(() => {
          vm.submitLoading = false
        })
    },
    // 取消按钮
    cancel() {
      if (this.isView) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/inventoryManagement/warehouseManagement/warehouse' })
    },
    submitForm() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const vm = this
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          let createValid = false
          vm.$refs.addressForm.validate((addressFormValid) => {
            this.collapseWarningForTitleAddress = !addressFormValid
            createValid = addressFormValid
          })
          if (!createValid) {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('organization.titleAddress'))
            )
            return
          }
          this.$modal.confirm(vm.$t('INVENTORY.warehouseSubmit')).then(() => {
            let param = JSON.parse(JSON.stringify(vm.createForm))
            param.commonFileList = myFileIds
            param.warehouseAddress = JSON.parse(JSON.stringify(vm.addressForm))
            param.userIds = param.userIdList.join(',')
            param = this.$trimOfObj(param)
            if (this.rowId) {
              vm.updateWarehouse(param)
            } else {
              vm.saveWarehouse(param)
            }
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    }
  }
}
</script>
