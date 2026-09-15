<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" size="mini" @click="handleSaveDraft"
        >{{ $t('uiBtn.saveDraft') }}
      </el-button>
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
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.warehouse2')}`" prop="warehouseName">
                      <SelectInput
                        clearable
                        :disabled="!form.businessPartnerId"
                        :value="form.warehouseName"
                        :title="form.warehouseName"
                        @click="openWarehouseTable"
                        @clear="warehouseClear"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.consignmentPickupNo')}`">
                      <el-input v-model="form.consignmentPickupNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
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
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_consignment_pickup_status,
                            form.consignmentPickupStatus
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
                      :label="`${$t('PURCHASE.purchasePerson')}`"
                      prop="purchasePersonBy"
                    >
                      <SelectInput
                        :value="form.purchasePersonBy"
                        :title="form.purchasePersonBy"
                        @clear="purchasePersonClear"
                        clearable
                        @click="openPurchasePersonTable"
                        :disabled="!form.departmentId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.committedDate')}`" prop="committedDate">
                      <el-date-picker
                        v-model="form.committedDate"
                        :picker-options="validityDaysPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        :disabled="form.consignmentPickupDetailList.length <= 0"
                        placeholder=""
                        clearable
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
                      ></MyInput>
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
            <el-collapse-item name="2">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.returnInfo')"
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
                    <el-form-item :label="`${$t('PURCHASE.zone')}`">
                      <el-input :value="form.district" :title="form.district" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.incoterm')}`" prop="incotermId">
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="incotermOptions"
                        @change="incotermIdChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      :label="`${$t('ui.address')}`"
                      prop="receiveAddressName"
                      :rules="[
                        {
                          required: form.incotermAddressType !== '0',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <ToolTipShowObj
                        :mData="form.receiveAddressForPort || {}"
                        :showStr="form.district ? '' : form.receiveAddressName"
                        :rows="shipToAddressRows"
                        v-if="form.incotermAddressType === '1'"
                      >
                        <SelectInput
                          :value="form.receiveAddressName"
                          :title="form.district ? form.receiveAddressName : ''"
                          @clear="receiveAddressClear"
                          clearable
                          @click="openReceiveAddressTable"
                          :disabled="!form.incotermId"
                          class="form-wd"
                        />
                      </ToolTipShowObj>
                      <SelectInput
                        v-else
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        @clear="receiveAddressClear"
                        clearable
                        @click="openReceiveAddressTable"
                        :disabled="
                          !form.incotermId ||
                          !form.businessPartnerId ||
                          form.incotermAddressType === '0'
                        "
                        class="form-wd"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('PURCHASE.deliveryAddress')}`">
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
                      :label="`${$t('PURCHASE.contactPerson')}`"
                      prop="bpContactPersonId"
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
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :initCommonFileList="initCommonFileList"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectWarehouseTable
      ref="selectWarehouseTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updateWarehouse"
    />
    <selectPurchasePersonTable
      ref="selectPurchasePersonTable"
      :departmentId="form.departmentId"
      @update="updatePurchasePerson"
    />

    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <payToAddressDlg
      ref="payToAddressDlg"
      :supplierId="form.businessPartnerMainId"
      @update="updateAddress"
    />
  </FormPageLayout>
</template>

<script>
import { getToken } from '@/utils/auth'
import { queryUserDepartment } from '@/api/system/user'
import { queryIncotermList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import {
  saveConsignmentPickup,
  saveDraftConsignmentPickup,
  preview
} from '@/api/purchaseManagement/consignmentPickUp'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
import selectPurchasePersonTable from './components/selectPurchasePersonTable.vue'
import ProductInfo from './productInfo/productInfo.vue'
import selectPortTable from './components/selectPortTable.vue'
import payToAddressDlg from './components/payToAddressDlg.vue'
export default {
  mixins: [pageMixin],
  dicts: ['p_consignment_pickup_status'],
  components: {
    selectSupplierTable,
    selectWarehouseTable,
    selectPurchasePersonTable,
    ProductInfo,
    selectPortTable,
    payToAddressDlg
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        consignmentPickupDetailList: []
      },

      collapseWarningForBasicInfo: false,
      collapseWarningForShippingInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        businessPartnerName: [
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
        bpContactPersonId: [
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
      shipToAddressRows: [
        {
          label: this.$t('PURCHASE.port'),
          showLabel: 'portName'
        },
        {
          label: this.$t('PURCHASE.code'),
          showLabel: 'portCode'
        },
        {
          label: this.$t('PURCHASE.latLong'),
          showLabel: 'latLong'
        },
        {
          label: this.$t('PURCHASE.telephone'),
          showLabel: 'telephone'
        },
        {
          label: this.$t('PURCHASE.website'),
          showLabel: 'website'
        },
        {
          label: this.$t('PURCHASE.country'),
          showLabel: 'country'
        }
      ],
      initCommonFileList: []
    }
  },
  props: {
    propTimeId: {
      type: String,
      default: ''
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
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
  },
  created() {},
  methods: {
    handleAdd() {
      this.reset()
      this.queryUserDepartment()
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
    },
    reset() {
      this.form = {
        /* 基础信息 */
        purchaseOrderNo: undefined,
        warehouseName: undefined,
        warehouseLabel: undefined,
        warehouseUserName: undefined,
        warehouseAddressShowStr: undefined,
        warehouseUserMobileCode: undefined,
        warehouseUserMobileNum: undefined,
        warehouseUserMobilePhone: undefined,
        warehouseUserEmail: undefined,
        picUserBy: this.$store.state.user.nickName,
        picUserId: this.$store.state.user.userId,
        purchaseReturnNo: undefined,
        purchasePersonBy: undefined,
        purchasePersonId: undefined,
        businessPartnerName: undefined,
        purchaseDate: undefined,
        returnDate: undefined,
        dueDate: undefined,
        ourRef: undefined,
        yourRef: undefined,
        remarks: undefined,
        automatedEmail: '1',
        bpBusinessContactPersonList: [],

        addressForWarehouse: {},
        consignmentPickupDetailList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForShippingInfo = false
      this.collapseWarningForProductInfo = false
      this.initCommonFileList = []
      this.activeNames = ['1', '2', '3', '4']
      this.resetForm('form1')
      this.resetForm('form2')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },
    /* 表单部分Start */
    /* 第一部分表单 */
    inputNumberChange(code) {
      this.$refs.form2.validateField(code)
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
      this.$set(this.form, 'abbreviation', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.currencyClear()
      this.warehouseClear()
      this.contactPersonClear()
      if (this.form.incotermAddressType === '2') {
        this.receiveAddressClear()
      }
    },
    updateSupplier(row) {
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'abbreviation', row.abbreviation)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.warehouseClear()
      this.contactPersonClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
      if (this.form.incotermAddressType === '2') {
        this.receiveAddressClear()
      }
    },

    openWarehouseTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    updateWarehouse(row) {
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'warehouseName', row.warehouseName)
      this.$set(this.form, 'warehouseId', row.warehouseId)
      this.$set(this.form, 'warehouseLabel', rowData.label)
      this.$set(this.form, 'warehouseUserName', row.userName)
      this.$set(this.form, 'warehouseAddressShowStr', row.warehouseAddressShowStr)
      this.$set(this.form, 'warehouseUserMobileCode', row.mobileCode)
      this.$set(this.form, 'warehouseUserMobileNum', row.mobileNum)
      this.$set(this.form, 'warehouseUserMobilePhone', row.mobilePhone)
      this.$set(this.form, 'warehouseUserEmail', row.email)
      this.$set(this.form, 'consignmentPickupDetailList', [])
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseLabel', undefined)
      this.$set(this.form, 'warehouseUserName', undefined)
      this.$set(this.form, 'warehouseAddressShowStr', undefined)
      this.$set(this.form, 'warehouseUserMobileCode', undefined)
      this.$set(this.form, 'warehouseUserMobileNum', undefined)
      this.$set(this.form, 'warehouseUserMobilePhone', undefined)
      this.$set(this.form, 'warehouseUserEmail', undefined)
      this.$set(this.form, 'consignmentPickupDetailList', [])
    },
    queryUserDepartment() {
      queryUserDepartment({}).then((res) => {
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
      this.initPoDetailList = []
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      this.initPoDetailList = []
    },

    /* 第二部分表单 */
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.incotermOptions = res.data || []
      })
    },
    incotermIdChange(item) {
      // const oldType = this.form.incotermAddressType
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      this.receiveAddressClear()
      this.$nextTick(() => {
        this.$refs.form2.clearValidate('receiveAddressName')
      })
    },
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        this.$refs.selectPortTable.handleOpen()
      }
      if (this.form.incotermAddressType === '2') {
        this.$refs.payToAddressDlg.handleOpen()
      }
    },
    receiveAddressClear() {
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressForPort', undefined)
      this.$set(this.form, 'addressForBPAddress', undefined)
      this.$set(this.form, 'receiveAddress', undefined)
      this.$set(this.form, 'district', undefined)
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'receiveAddressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
    },
    updateAddress(row) {
      this.$set(this.form, 'addressForBPAddress', row)
      this.$set(this.form, 'receiveAddressName', row.label)
      this.$set(this.form, 'receiveAddressId', row.businessAddressId)
      this.$set(this.form, 'receiveAddress', row.receiveAddress)
      this.$set(this.form, 'district', row.district)
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
    /* 表单部分End */

    async submitForm(submitType) {
      const myFileIds = this.$refs.ProductInfo.getFileIds()
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
      const valid2 = await this.$refs.form2.validate().catch((err) => {
        return err
      })
      this.collapseWarningForShippingInfo = !valid2
      if (!valid2) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.returnInfo'))
        )
        return
      }

      if (valid1 && valid2) {
        let param = { ...this.form }
        const validProduct = this.validProductList(param.consignmentPickupDetailList)
        if (!validProduct) {
          this.$refs.ProductInfo.activeName = 'productDetail'
          this.collapseWarningForProductInfo = true
          return
        }

        this.collapseWarningForProductInfo = false
        param.commonFileList = myFileIds

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        // param.commonFileList = myFileIds
        let confirmMsg
        let successMsg
        let submitFn
        if (submitType === 'save') {
          confirmMsg = this.$t('PURCHASE.conPickUpSaveConfirm')
          successMsg = this.$t('PURCHASE.conPickUpSaveSuccess')
          submitFn = saveDraftConsignmentPickup
        } else {
          confirmMsg = this.$t('PURCHASE.conPickUpSubmitConfirm')
          successMsg = this.$t('PURCHASE.conPickUpSubmitSuccess')
          submitFn = saveConsignmentPickup
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
    validProductList(detailList, isReqOne = true) {
      const valid = false
      if (detailList.length <= 0 && isReqOne) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.pickupQty)
      })
      if (qtyReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.pickupQty'))
        )
        return valid
      }

      const expectedDeliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.expectedDeliveryDate)
      })
      if (expectedDeliveryDateReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expectedDeliveryDate'))
        )
        return valid
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
