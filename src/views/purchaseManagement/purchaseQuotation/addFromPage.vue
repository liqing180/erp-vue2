<template>
  <FormPageLayout ref="FormPageLayoutRef">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
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
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input
                        :value="
                          selectDictLabel(
                            dict.type.p_purchase_quotation_status,
                            form.purchaseQuotationStatus
                          )
                        "
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseQuotationNo')}`">
                      <el-input v-model="form.purchaseQuotationNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.contactPerson')}`" prop="contactPersonId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.contactPersonId"
                        :label="form.contactPersonName"
                        :title="form.contactPersonName"
                        idKey="contactPersonId"
                        labelKey="contactPersonName"
                        :options="form.bpBusinessContactPersonList || []"
                        @change="contactPersonChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.email')}`">
                      <el-input v-model="form.email" :title="form.email" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.contactNo')}`">
                      <el-input
                        v-model="form.mobilePhone"
                        :title="form.mobilePhone"
                        disabled
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('PURCHASE.supplierQuoteNo')" prop="supplierQuoteNo">
                      <el-input
                        v-model="form.supplierQuoteNo"
                        :title="form.supplierQuoteNo"
                        :maxlength="50"
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
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.ourRef')}`">
                      <el-input
                        v-model="form.ourRef"
                        :title="form.ourRef"
                        :maxlength="200"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('ui.paymentTerm')" prop="paymentTermId">
                      <CommonSelect
                        :disabled="!form.businessPartnerId"
                        :id="form.paymentTermId"
                        :label="form.paymentTermName"
                        :title="form.paymentTermName"
                        idKey="id"
                        labelKey="paymentTermName"
                        :options="paymentTermOptions"
                        @change="paymentTermChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.paymentMethod')}`" prop="paymentMethodIdList">
                      <CommonMultipleSelect
                        :disabled="!form.paymentTermId"
                        :ids="form.paymentMethodIdList"
                        :labels="form.paymentMethodNameList"
                        idKey="dictValue"
                        labelKey="dictLabel"
                        :options="paymentMethodOptions"
                        @change="paymentMethodChange"
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
                        filterable
                        :options="currencyOptions || []"
                        @change="currencyChange"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.dateQuoted')}`" prop="dateQuoted">
                      <el-date-picker
                        v-model="form.dateQuoted"
                        :picker-options="dateQuotedPickerOptions"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.validityDays')}`" prop="validity">
                      <el-date-picker
                        v-model="form.validity"
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
                    <el-form-item :label="`${$t('PURCHASE.committedDate')}`" prop="committedDate">
                      <el-date-picker
                        v-model="form.committedDate"
                        :picker-options="committedDatePickerOptions"
                        :disabled="purchaseQuotationDetailList.length <= 0"
                        :format="fmtForYmd"
                        value-format="timestamp"
                        :style="{ width: '100%' }"
                        placeholder=""
                        clearable
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
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
                      :label="`${$t('PURCHASE.deliveryAddress')}`"
                      prop="receiveAddressName"
                    >
                      <SelectInput
                        :value="form.receiveAddressName"
                        :title="form.receiveAddressName"
                        @clear="receiveAddressClear"
                        clearable
                        @click="openReceiveAddressTable"
                        :disabled="!form.incotermId"
                        class="form-wd"
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
                      ></MyInput>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item :label="`${$t('ui.attachment')}`">
                      <myUpload
                        ref="uploadRef"
                        :accept="['.jpg', '.jpeg', '.png', '.pdf']"
                        :disabled="false"
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
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div>
                <ProductTable
                  ref="ProductTable"
                  :pqProductList="initPqDetailList"
                  :businessPartnerId="form.businessPartnerId"
                  :countryId="form.countryId"
                  :currencyId="form.currencyId"
                  @updateTable="updateProductTable"
                  :linkPR="form.purchaseQuotationCreateType === '2'"
                  @changeRowCommittedDate="changeRowCommittedDate"
                  @scrollPageToTable="scrollPageToTable"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
  </FormPageLayout>
</template>

<script>
import { queryIncotermList } from '@/api/common/common'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import { queryPaymentTermByTypeAll, queryPaymentMethodByTerm } from '@/api/system/paymentTerm'

import { savePurchaseQuotation } from '@/api/purchaseManagement/purchaseQuotation'
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'

import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'

import ProductTable from '@/views/purchaseManagement/purchaseQuotation/productTable.vue'

export default {
  mixins: [pageMixin],
  dicts: ['p_purchase_quotation_status'],
  components: {
    selectSupplierTable,
    selectPortTable,
    selectWarehouseTable,
    ProductTable
  },
  data() {
    const vm = this
    return {
      saveKey: '17',
      activeNames: [],
      rowId: '',
      timeId: '',
      form: {},
      collapseWarningForBasicInfo: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        contactPersonId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        supplierQuoteNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validity: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        dateQuoted: [
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
        currencyId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        paymentTermId: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
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
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      dateQuotedPickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      committedDatePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      currencyOptions: [],
      paymentTermOptions: [],
      paymentMethodOptions: [],
      incotermOptions: [],
      /* 表格部分 */
      initPqDetailList: [],
      purchaseQuotationDetailList: [],
      collapseWarningForProductInfo: false
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
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
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
    handleAdd() {
      this.activeNames = ['1', '2', '3']
      // this.reset()
      this.queryCurrencyListBySelect()
      this.queryPurchasePaymentTerm()
      this.queryIncotermList()
    },
    reset() {
      this.form = {
        businessPartnerName: undefined,
        purchaseQuotationStatus: '1',
        purchaseQuotationNo: undefined,
        businessPartnerId: undefined,
        contactPersonName: undefined,
        bpBusinessContactPersonList: [],
        email: undefined,
        mobilePhone: undefined,
        supplierQuoteNo: undefined,
        validity: undefined,
        dateQuoted: undefined,
        committedDate: undefined,
        currencyId: undefined,
        currency: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        paymentMethodIdList: [],
        paymentMethodNameList: [],
        ourRef: undefined,
        incotermId: undefined,
        incotermName: undefined,
        remarks: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        addressForPort: {},
        addressForWarehouse: {},
        purchaseQuotationCreateType: '1'
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.initPqDetailList = []
      this.purchaseQuotationDetailList = []
      this.activeNames = ['1', '2', '3']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/purchaseManagement/purchaseQuotation' })
    },
    /* 表单部分Start */
    openSupplierTable() {
      this.$refs.selectSupplierTable.handleOpen()
    },
    // 清空供应商
    supplierClear() {
      this.changeCountryIdClearTableTaxNo({
        oldCountry: this.form.country,
        newCountry: undefined,
        oldBPId: this.form.businessPartnerId,
        newBPId: undefined
      })

      this.$set(this.form, 'businessPartnerMainId', undefined)
      this.$set(this.form, 'businessPartnerId', undefined)
      this.$set(this.form, 'businessPartnerName', undefined)
      this.$set(this.form, 'businessPartnerNo', undefined)
      this.$set(this.form, 'countryId', undefined)
      this.$set(this.form, 'country', undefined)
      this.contactPersonClear()
      this.currencyClear()
      this.paymentTermChange({})
      this.paymentMethodChange([], [])
    },
    updateSupplier(row) {
      this.changeCountryIdClearTableTaxNo({
        oldCountry: this.form.country,
        newCountry: row.country,
        oldBPId: this.form.businessPartnerId,
        newBPId: row.businessPartnerId
      })

      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.$set(this.form, 'countryId', row.countryId)
      this.$set(this.form, 'country', row.country)
      const registeredAddress =
        (row.bpBusinessAddressList || []).find((x) => (x.label || '').includes('Registered')) || {}
      this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
      this.$set(this.form, 'registeredAddressCity', registeredAddress.city)
      this.$set(this.form, 'bpBusinessContactPersonList', row.bpBusinessContactPersonList)
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'paymentTermId', account.paymentTermId)
      this.$set(this.form, 'paymentTermName', account.paymentTermName)
      this.$set(this.form, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.form, 'paymentMethodNameList', account.paymentMethodNameList || [])
      this.queryPaymentMethodByTerm()
      this.contactPersonClear()
      const ContactPersonList = this.form.bpBusinessContactPersonList || []
      if (ContactPersonList.length > 0) {
        const defaultContact = ContactPersonList.find((item) => item.isDefault === '1')
        if (defaultContact) {
          this.contactPersonChange(defaultContact)
        }
      }
    },
    contactPersonChange(row) {
      this.$set(this.form, 'businessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'contactPersonId', row.contactPersonId)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNum', row.mobileNum)
      this.$set(this.form, 'mobileCode', row.mobileCode)
      this.$set(this.form, 'mobilePhone', row.mobilePhone)
      this.$set(this.form, 'email', row.email)
    },
    contactPersonClear() {
      this.$set(this.form, 'businessContactPersonId', undefined)
      this.$set(this.form, 'contactPersonId', undefined)
      this.$set(this.form, 'contactPersonName', undefined)
      this.$set(this.form, 'mobileNum', undefined)
      this.$set(this.form, 'mobileCode', undefined)
      this.$set(this.form, 'mobilePhone', undefined)
      this.$set(this.form, 'email', undefined)
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
      this.$set(this.form, 'currencySymbol', row.currencySymbol)
    },
    currencyClear() {
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
    },

    /* 付款条款 */
    queryPurchasePaymentTerm() {
      queryPaymentTermByTypeAll('1').then((res) => {
        this.paymentTermOptions = res.data || []
      })
    },
    paymentTermChange(item) {
      this.$set(this.form, 'paymentTermId', item.id)
      this.$set(this.form, 'paymentTermName', item.paymentTermName)
      const ids = item.paymentMethodIds ? item.paymentMethodIds.split(',') : []
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', item.paymentMethodNameList || [])

      this.queryPaymentMethodByTerm()
    },
    queryPaymentMethodByTerm() {
      if (this.form.paymentTermId) {
        queryPaymentMethodByTerm(this.form.paymentTermId).then((res) => {
          this.paymentMethodOptions = res.data || []
        })
      } else {
        this.paymentMethodOptions = []
      }
    },
    paymentMethodChange(ids, labels) {
      this.$set(this.form, 'paymentMethodIdList', ids)
      this.$set(this.form, 'paymentMethodNameList', labels)
    },

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
      // if (oldType !== item.incotermAddressType) {
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'addressForWarehouse', undefined)
      // }
    },
    openReceiveAddressTable() {
      if (this.form.incotermAddressType === '1') {
        let firstCountryId
        let firstCountry
        let firstCity
        if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
          firstCountry = this.form.registeredAddressCountry
          firstCity = this.form.registeredAddressCity
        }
        if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
          firstCountryId = this.form.receiveAddressCountryId
          firstCountry = this.form.receiveAddressCountry
          firstCity = this.form.receiveAddressCity
        }
        this.$refs.selectPortTable.handleOpen(firstCountryId, firstCountry, firstCity)
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
      const { portName, portId, countryId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receiveAddressName', portName)
      this.$set(this.form, 'receiveAddressId', portId)
      if (!portId) return
      if (['FOB', 'FAS'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.form.registeredAddressCountry !== country &&
          this.form.registeredAddressCountry.indexOf(country) === -1
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForFOBOrFAS2')
              .replace('$1', this.form.country)
              .replace('$2', this.form.incotermAbbreviation),
            '',
            {
              confirmButtonText: this.$t('PURCHASE.gotIt'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            }
          )
            .then(() => {})
            .catch(() => {})
        }
      }
      if (['CIF', 'CFR'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          this.form.receiveAddressCountryId &&
          this.form.receiveAddressCountryId !== countryId &&
          this.form.country !== country
        ) {
          this.$alert(
            this.$t('PURCHASE.portIncorrectForCIFOrCFR').replace(
              '$1',
              this.form.incotermAbbreviation
            ),
            '',
            {
              confirmButtonText: this.$t('PURCHASE.gotIt'),
              cancelButtonText: this.$t('uiBtn.back'),
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              customClass: 'custom-class'
            }
          )
            .then(() => {})
            .catch(() => {})
        }
      }
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
      this.purchaseQuotationDetailList = list || []
    },
    changeRowCommittedDate(value) {
      this.$set(this.form, 'committedDate', value)
    },
    changeCountryIdClearTableTaxNo({ oldCountry, newCountry, oldBPId, newBPId }) {
      if (oldCountry !== newCountry) {
        this.$refs.ProductTable && this.$refs.ProductTable.clearTableTaxNo()
      }
      if (oldBPId !== newBPId) {
        this.initPqDetailList = []
      }
    },
    /* 表格部分End */

    async submitForm(submitType) {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      this.collapseWarningForBasicInfo = !valid1
      if (!valid1) {
        return this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo'))
        )
      }
      if (valid1) {
        let param = { ...this.form }
        const detailList = this.$refs.ProductTable.getList()
        const validProduct = this.validProductList(detailList)
        if (!validProduct) {
          this.collapseWarningForProductInfo = true
          return
        }
        if (param.detailsOfExpensesList && param.detailsOfExpensesList.length > 0) {
          const validDetailsOfExpenses = this.validDetailsOfExpensesList(
            param.detailsOfExpensesList || []
          )
          if (!validDetailsOfExpenses) {
            this.collapseWarningForProductInfo = true
            return
          }
        }
        this.collapseWarningForProductInfo = false
        param.purchaseQuotationDetailList = detailList

        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.commonFileList = myFileIds

        this.$modal
          .confirm(this.$t('PURCHASE.pqSubmitConfirm'))
          .then(() => {
            return savePurchaseQuotation(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(this.$t('PURCHASE.pqSubmitSuccess').replace('$1', response.msg))
            this.cancel()
          })
          .catch(() => {})
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
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const qtyReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.purchaseQty)
      })
      if (qtyReq) {
        this.$refs.ProductTable.errorMessage('purchaseQty')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQTY'))
        )
        return valid
      }
      const uomReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.purchaseUom)
      })
      if (uomReq) {
        this.$refs.ProductTable.errorMessage('purchaseUom')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.uom')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.unitPrice) && item.pqResult === '1'
      })
      if (unitPriceReq) {
        this.$refs.ProductTable.errorMessage('unitPrice')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
        )
        return valid
      }
      const moqReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.moq) && item.pqResult === '1'
      })
      if (moqReq) {
        this.$refs.ProductTable.errorMessage('moq')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.moq')))
        return valid
      }

      const taxNoReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.taxNo)
      })
      if (taxNoReq) {
        this.$refs.ProductTable.errorMessage('taxNo')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.taxNo')))
        return valid
      }

      const deliveryDateReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.committedDate)
      })
      if (deliveryDateReq) {
        this.$refs.ProductTable.errorMessage('committedDate')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.committedDate'))
        )
        return valid
      }

      const leadTimeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.leadTime) && item.pqResult === '1'
      })
      if (leadTimeReq) {
        this.$refs.ProductTable.errorMessage('leadTime')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
        )
        return valid
      }
      const remarksReq = detailList.find((item) => {
        return !(item.remarks || '').trim() && item.pqResult === '2'
      })
      if (remarksReq) {
        this.$refs.ProductTable.errorMessage('remarks')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.remarks')))
        return valid
      }

      return true
    },
    validDetailsOfExpensesList(detailList) {
      const valid = false
      const expenseItemReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.expenseItem)
      })
      if (expenseItemReq) {
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expenseItem'))
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
    }
  }
}
</script>
<style lang="scss"></style>
