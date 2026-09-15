<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
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
                    <el-form-item
                      :label="`${$t('PRODUCT.supplierName')}`"
                      prop="businessPartnerName"
                    >
                      <CommonSelectAndList
                        :id="form.businessPartnerId"
                        :label="form.businessPartnerName"
                        idKey="businessPartnerId"
                        labelKey="businessPartnerName"
                        filterable
                        :options="businessPartnerOptions"
                        :loading="businessPartnerOptionsLoading"
                        @change="updateSupplier"
                        @handleOpen="openSupplierTable"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PRODUCT.supplierCode')}`">
                      <el-input v-model="form.businessPartnerNo" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.aslNo')}`">
                      <el-input value="" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.purchaseQuotationNo')}`">
                      <CommonSelectAndList
                        :id="form.purchaseQuotationId"
                        :label="form.purchaseQuotationNo"
                        idKey="purchaseQuotationId"
                        labelKey="purchaseQuotationNo"
                        filterable
                        :filter-method="filterMethodForPQ"
                        @visible-change="visibleChangeForPQ"
                        :options="purchaseQuotationOptionsShow"
                        :optionsAll="purchaseQuotationOptions"
                        :loading="purchaseQuotationOptionsLoading"
                        @change="updatePurchaseQuotationNo"
                        @handleOpen="openPurchaseQuotationTable"
                      >
                        <template slot-scope="{ item }">{{ item.PQShowStr }}</template>
                      </CommonSelectAndList>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('PURCHASE.taxRate')}`" prop="taxRate">
                      <CommonSelect
                        :id="$numberStr(form.taxRate, 1)"
                        :label="$numberStr(form.taxRate, 1)"
                        idKey="taxRateStr"
                        labelKey="taxRateStr"
                        :options="taxRateOptions"
                        :loading="taxRateOptionsLoading"
                        :disabled="!form.businessPartnerId"
                        @change="taxRateChange"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="`${$t('ui.status')}`">
                      <el-input value="" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item :label="$t('PURCHASE.paymentTerm')" prop="paymentTermName">
                      <ToolTipPaymentTerm :paymentTermObj="form.paymentTerm || {}">
                        <div class="input-switch-box">
                          <div class="con-left">
                            <CommonSelectAndList
                              :id="form.paymentTermId"
                              :label="form.paymentTermName"
                              idKey="paymentTermId"
                              labelKey="paymentTermName"
                              filterable
                              :options="paymentTermOptions"
                              :loading="paymentTermOptionsLoading"
                              @change="paymentTermChange"
                              @handleOpen="openPaymentTermDlg"
                              :disabled="!form.businessPartnerId"
                            />
                          </div>
                          <div class="con-right" v-if="form.paymentTermName">
                            <i
                              class="el-icon-edit primary"
                              style="font-size: 20px"
                              @click="openEditPaymentTermDlg"
                            ></i>
                          </div>
                        </div>
                      </ToolTipPaymentTerm>
                    </el-form-item>
                  </el-col>
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
                </el-row>
                <el-row>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('PURCHASE.incoterm')}`"
                      prop="incotermId"
                      :rules="[
                        {
                          required: comIncotermReq,
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                    >
                      <CommonSelect
                        :id="form.incotermId"
                        :label="form.incotermName"
                        :title="form.incotermName"
                        idKey="incotermId"
                        labelKey="incotermName"
                        :options="comIncotermOptions"
                        :loading="incotermOptionsLoading"
                        @change="incotermIdChange"
                        :disabled="!form.businessPartnerId"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" v-if="form.country !== legalEntityInfo.country">
                    <el-form-item
                      :label="`${$t('PURCHASE.port')}`"
                      v-if="form.incotermAddressType === '0'"
                      key="receivePortName1"
                    >
                      <el-input
                        :value="$t('PURCHASE.selfCollect')"
                        :maxlength="50"
                        disabled
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      :label="`${$t('PURCHASE.port')}`"
                      prop="receivePortName"
                      :rules="[
                        {
                          required: form.incotermAddressType === '1',
                          message: $t('ui.reqMsg'),
                          trigger: ['change']
                        }
                      ]"
                      key="receivePortName2"
                      v-else
                    >
                      <CommonSelectAndList
                        :id="form.receivePortId"
                        :label="form.receivePortName"
                        idKey="portId"
                        labelKey="portName"
                        filterable
                        :options="portOptions"
                        :disabled="
                          form.country === legalEntityInfo.country
                            ? true
                            : form.incotermAddressType !== '1' || !form.businessPartnerId
                        "
                        @change="updatePort"
                        ref="portRef"
                        @handleOpen="openReceivePortTable"
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
                        :loading="currencyOptionsLoading"
                        @change="currencyChange"
                      />
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

          <div class="form-card mt10 collapse-item-content-pt0">
            <el-collapse-item name="3">
              <FormCollapseItemTitle
                slot="title"
                :title="$t('PURCHASE.productInfo')"
                :warning="collapseWarningForProductInfo"
              >
              </FormCollapseItemTitle>
              <div class="pb20">
                <ProductInfo
                  ref="ProductInfo"
                  :formData="form"
                  :comDisFrom="false"
                  :modifyHighlight="false"
                  :serviceSurchargeListOptions="serviceSurchargeList"
                  :allUomList="allUomList"
                />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </div>
    </template>
    <selectSupplierTable ref="selectSupplierTable" @update="updateSupplier" />
    <selectPurchaseQuotationTable
      ref="selectPurchaseQuotationTable"
      :businessPartnerId="form.businessPartnerId"
      @update="updatePurchaseQuotationNo"
    />
    <selectPaymentTermDlg
      ref="selectPaymentTermDlg"
      :paymentTermPurposeList="['1']"
      :businessPartnerId="form.businessPartnerId"
      @onSuccess="paymentTermChange"
      :menuPerms="menuKey.ASL"
    />
    <editPaymentTernDlg ref="editPaymentTernDlg" @onSuccess="paymentTermEditChange" />
    <selectPortTable ref="selectPortTable" @update="updatePort" />
    <selectWarehouseTable ref="selectWarehouseTable" @update="updateWarehouse" />
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/purchaseManagement/lang/index'
import ProductInfo from './productInfo/productInfo.vue'
import selectSupplierTable from './components/selectSupplierTable.vue'
import selectPurchaseQuotationTable from './components/selectPurchaseQuotationTable.vue'
import {
  saveApprovedSupplier,
  checkProductExistInASL,
  addPQDefaultMsgToASL,
  conversionCurrencyUnitPrice,
  queryCanSelectPurchaseQuotationList
} from '@/api/purchaseManagement/asl'
import { getSystemSetup } from '@/api/system/systemSetting'
import { queryAllUomList } from '@/api/system/uom'
import { queryBusinessCanSelectVendorList } from '@/api/purchaseManagement/purchaseOrder'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'

import { queryAllTaxForPurchase } from '@/api/system/tax'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import selectPaymentTermDlg from '@/views/system/paymentTerm/selectPaymentTermDlg.vue'
import editPaymentTernDlg from '@/views/system/paymentTerm/editPaymentTernDlg/editPaymentTernDlg.vue'
import { queryIncotermList, queryCanSelectPortList } from '@/api/common/common'
import selectPortTable from './components/selectPortTable.vue'
import selectWarehouseTable from './components/selectWarehouseTable.vue'
export default {
  mixins: [pageMixin],
  components: {
    ProductInfo,
    selectSupplierTable,
    selectPurchaseQuotationTable,
    selectPaymentTermDlg,
    editPaymentTernDlg,
    selectPortTable,
    selectWarehouseTable
  },
  data() {
    return {
      activeNames: [],
      timeId: '',
      submitLoading: false,
      form: {
        salesPriceProductList: []
      },
      collapseWarningForBasicInfo: false,
      collapseWarningForProductInfo: false,
      rules: {
        businessPartnerName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        purchaseQuotationNo: [
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
        taxRate: [
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
        paymentTermName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      businessPartnerOptions: [],
      businessPartnerOptionsLoading: false,
      purchaseQuotationOptions: [],
      purchaseQuotationOptionsShow: [],
      purchaseQuotationOptionsLoading: false,
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      currencyOptions: [],
      currencyOptionsLoading: false,
      taxRateOptions: [],
      taxRateOptionsLoading: false,
      allUomList: [],
      serviceSurchargeList: [],
      paymentTermOptions: [],
      paymentTermOptionsLoading: false,
      statusDicts: []
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
    },
    legalEntityInfo() {
      return this.$store.state.user.legalEntityInfo
    },
    comIncotermReq() {
      if (this.form.dropShipping === '1') {
        return false
      }
      if (this.form.country === this.legalEntityInfo.country) {
        return false
      }
      return true
    },
    comIncotermOptions() {
      if (this.form.country === this.legalEntityInfo.country) {
        return this.incotermOptions.filter((item) => item.incotermAbbreviation === 'EXW')
      }
      return this.incotermOptions
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
      this.queryCurrencyListBySelect()
      this.queryIncotermList()
      this.queryCanSelectPortList()
      this.getSystemSetup()
      this.queryAllUomList()
      this.queryBusinessPartnerOptions()
      this.queryPurchaseQuotationOptions()
      this.MyDictDataClass.getDictFn('p_approved_supplier_status').then((res) => {
        this.statusDicts = (res || []).map((item) => {
          return {
            label: item.dictLabel,
            value: item.dictValue
          }
        })
      })
    },
    getSystemSetup() {
      getSystemSetup().then((res) => {
        const data = res.data || {}
        this.serviceSurchargeList = data.serviceSurchargeList || []
      })
    },
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    reset() {
      this.form = {
        businessPartnerId: undefined,
        businessPartnerName: undefined,
        businessPartnerNo: undefined,
        currencyId: undefined,
        currencyCode: undefined,
        currency: undefined,
        taxId: undefined,
        taxRate: undefined,
        incotermId: undefined,
        incotermName: undefined,
        incotermAddressType: undefined,
        contactPersonId: undefined,
        contactPersonName: undefined,
        paymentTermId: undefined,
        paymentTermName: undefined,
        createdBy: this.$store.state.user.nickName,
        salesPriceProductList: []
      }
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForProductInfo = false
      this.activeNames = ['1', '2', '3', '4']
      setTimeout(() => {
        if (this.$refs.uploadRef) {
          this.$refs.uploadRef.initFileList([])
        }
      }, 300)
      this.resetForm('form1')
    },
    // 取消按钮
    back() {
      this.$emit('back')
    },

    queryBusinessPartnerOptions() {
      this.businessPartnerOptionsLoading = true
      queryBusinessCanSelectVendorList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.ASL
      })
        .then((res) => {
          this.businessPartnerOptionsLoading = false
          this.businessPartnerOptions = res.rows || []
        })
        .catch(() => {
          this.businessPartnerOptionsLoading = false
        })
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
      this.purchaseQuotationNoClear()
    },
    updateSupplier(row) {
      if (!row.businessPartnerMainId) {
        this.supplierClear()
        return
      }
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
      this.$set(this.form, 'bpBusinessAddressList', row.bpBusinessAddressList)

      this.purchaseQuotationNoClear()
      this.queryAllTaxForPurchase()
      this.queryPurchaseQuotationOptions()
      this.queryPaymentTermListByPaymentTermPurpose()

      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.form, 'currencyId', account.currencyId)
      this.$set(this.form, 'currencyCode', account.currencyCode)
      this.$set(this.form, 'currency', account.currency)
      this.$set(this.form, 'currencySymbol', account.currencySymbol)
    },

    queryPurchaseQuotationOptions() {
      this.purchaseQuotationOptions = []
      this.purchaseQuotationOptionsShow = []
      const timer = Date.now()
      this.queryTimer = timer
      this.purchaseQuotationOptionsLoading = true
      queryCanSelectPurchaseQuotationList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.ASL,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          if (this.queryTimer !== timer) return
          this.purchaseQuotationOptionsLoading = false
          const rows = res.rows || []
          rows.forEach((x) => {
            x.PQShowStr = `${x.purchaseQuotationNo}, ${x.businessPartnerName}`
          })
          this.purchaseQuotationOptions = rows
          this.purchaseQuotationOptionsShow = rows
        })
        .catch(() => {
          this.purchaseQuotationOptionsLoading = false
        })
    },
    visibleChangeForPQ(show) {
      if (show === false) {
        setTimeout(() => {
          this.purchaseQuotationOptionsShow = this.purchaseQuotationOptions
        }, 100)
      }
    },
    filterMethodForPQ(str) {
      const res = []
      if ((str + '').trim() !== '') {
        this.purchaseQuotationOptions.forEach((item) => {
          if (
            item.purchaseQuotationNo.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >=
            0
          ) {
            res.push(item)
          } else if (
            item.businessPartnerName.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >=
            0
          ) {
            res.push(item)
          }
        })
        this.purchaseQuotationOptionsShow = res
      } else {
        this.purchaseQuotationOptionsShow = this.purchaseQuotationOptions
      }
    },
    openPurchaseQuotationTable() {
      this.$refs.selectPurchaseQuotationTable.handleOpen()
    },
    updatePurchaseQuotationNo(row) {
      if (!row.purchaseQuotationId) {
        this.purchaseQuotationNoClear()
        return
      }
      this.$set(this.form, 'purchaseQuotationId', undefined)
      this.$set(this.form, 'purchaseQuotationNo', row.purchaseQuotationNo)
      this.$set(this.form, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.form, 'businessPartnerId', row.businessPartnerId)
      this.$set(this.form, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.form, 'businessPartnerNo', row.businessPartnerNo)
      this.warehouseClear()
      this.receivePortClear()
      this.currencyClear()
      this.incotermIdChange({})
      this.contactPersonClear()
      this.paymentTermChange({})
      this.$set(this.form, 'taxId', undefined)
      this.$set(this.form, 'taxNo', undefined)
      this.$set(this.form, 'taxRate', undefined)
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList(row.commonFileList || [])

      addPQDefaultMsgToASL({
        purchaseQuotationId: row.purchaseQuotationId
      }).then((res) => {
        const dataInfo = res.data || {}
        const bp = dataInfo.businessPartner || {}
        this.$set(this.form, 'businessPartnerMainId', bp.businessPartnerMainId)
        this.$set(this.form, 'businessPartnerId', bp.businessPartnerId)
        this.$set(this.form, 'businessPartnerName', bp.businessPartnerName)
        this.$set(this.form, 'businessPartnerNo', bp.businessPartnerNo)
        this.$set(this.form, 'countryId', bp.countryId)
        this.$set(this.form, 'country', bp.country)
        this.$set(this.form, 'bpBusinessContactPersonList', bp.bpBusinessContactPersonList)
        this.$set(this.form, 'bpBusinessAddressList', bp.bpBusinessAddressList)
        const registeredAddress =
          (bp.bpBusinessAddressList || []).find(
            (x) => (x.label || '').includes('Registered') || {}
          ) || {}
        this.$set(this.form, 'registeredAddressCountry', registeredAddress.country)
        this.$set(this.form, 'registeredAddressCity', registeredAddress.city)

        this.$set(this.form, 'purchaseQuotationNo', dataInfo.purchaseQuotationNo)
        this.$set(this.form, 'purchaseQuotationId', dataInfo.purchaseQuotationId)
        this.$set(this.form, 'currencyId', dataInfo.currencyId)
        this.$set(this.form, 'currencyCode', dataInfo.currencyCode)
        this.$set(this.form, 'currency', dataInfo.currency)

        this.$set(this.form, 'receiveAddressCountryId', dataInfo.receiveAddressCountryId)
        this.$set(this.form, 'receiveAddressCountry', dataInfo.receiveAddressCountry)
        this.$set(this.form, 'receiveAddressCity', dataInfo.receiveAddressCity)

        /* const ContactPersonList = this.form.bpBusinessContactPersonList || []
        if (ContactPersonList.length > 0) {
          const defaultContact = ContactPersonList.find(
            (item) => item.contactPersonId === dataInfo.requestedId
          )
          if (defaultContact) {
            this.contactPersonChange(defaultContact)
          }
        } */
        this.contactPersonChange(dataInfo)

        if (dataInfo.paymentTermId && dataInfo.paymentTerm) {
          this.paymentTermChange(dataInfo.paymentTerm)
        }
        this.incotermIdChange(dataInfo)

        if (dataInfo.incotermAddressType === '1') {
          this.$set(this.form, 'addressForPort', dataInfo.addressForPort)
          this.$set(this.form, 'receivePortName', dataInfo.receivePortName)
          this.$set(this.form, 'receivePortId', dataInfo.receivePortId)
        }

        this.$set(this.form, 'taxId', dataInfo.taxId)
        this.$set(this.form, 'taxNo', dataInfo.taxNo)
        this.$set(this.form, 'taxRate', dataInfo.taxRate)
        /*  */
        const newList = dataInfo.detailList || []
        let timeId = Date.now()
        const newIds = newList.map((i) => {
          i.rowTimeId = i.productId
          if (i.serviceSurchargeList) {
            i.serviceSurchargeList.forEach((child) => {
              timeId++
              child.rowTimeId = timeId
            })
          }
          return i.productId
        })
        const oldList = this.form.salesPriceProductList.filter(
          (i) => !i.purchaseQuotationDetailId && !newIds.includes(i.productId)
        )
        const curList = [...oldList, ...newList]
        this.resetSnNum(curList)
        this.$set(this.form, 'salesPriceProductList', curList)
        this.initDate()
      })
    },
    initDate() {
      const topRow = this.form.salesPriceProductList[0]
      if (topRow && topRow.effectiveDate) {
        this.form.salesPriceProductList.forEach((i) => {
          if (!i.effectiveDate) {
            if (i.expiryDate) {
              if (i.expiryDate >= topRow.effectiveDate) {
                this.$set(i, 'effectiveDate', topRow.effectiveDate)
                this.$set(i, 'effectiveDateError', false)
              }
            } else {
              this.$set(i, 'effectiveDate', topRow.effectiveDate)
              this.$set(i, 'effectiveDateError', false)
            }
          }
        })
      }
      if (topRow && topRow.expiryDate) {
        this.form.salesPriceProductList.forEach((p) => {
          if (!p.expiryDate) {
            if (p.effectiveDate) {
              if (topRow.expiryDate >= p.effectiveDate) {
                this.$set(p, 'expiryDate', topRow.expiryDate)
                this.$set(p, 'expiryDateError', false)
              }
            } else {
              this.$set(p, 'expiryDate', topRow.expiryDate)
              this.$set(p, 'expiryDateError', false)
            }
          }
        })
      }
    },
    purchaseQuotationNoClear() {
      this.$set(this.form, 'purchaseQuotationNo', undefined)
      this.$set(this.form, 'purchaseQuotationId', undefined)
      this.currencyClear()
      this.incotermIdChange({})
      this.contactPersonClear()
      this.paymentTermChange({})
      this.receivePortClear()
      this.warehouseClear()
      this.$set(this.form, 'taxId', undefined)
      this.$set(this.form, 'taxNo', undefined)
      this.$set(this.form, 'taxRate', undefined)
      const list = this.form.salesPriceProductList
      const newList = list.filter((i) => !i.purchaseQuotationDetailId)
      this.resetSnNum(newList)
      this.$set(this.form, 'salesPriceProductList', newList)
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
    },
    resetSnNum(list, plantStage) {
      list.forEach((item, index) => {
        item.snNum = plantStage ? `${plantStage}.${index + 1}` : `${index + 1}`
        // 如果当前节点有子节点，递归查找
        if (item.serviceSurchargeList && item.serviceSurchargeList.length > 0) {
          this.resetSnNum(item.serviceSurchargeList, item.snNum)
        }
      })
    },

    queryIncotermList() {
      this.incotermOptionsLoading = true
      queryIncotermList({})
        .then((res) => {
          this.incotermOptionsLoading = false
          this.incotermOptions = res.data || []
        })
        .catch(() => {
          this.incotermOptionsLoading = false
        })
    },
    incotermIdChange(item) {
      // const oldType = this.form.incotermAddressType
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      // if (oldType !== item.incotermAddressType) {
      this.receivePortClear()
      // }
      this.$nextTick(() => {
        this.$refs.form1.clearValidate('receivePortName')
      })
      this.queryCanSelectPortList()
    },

    dropShippingChange() {
      this.warehouseClear()
    },

    queryCanSelectPortList() {
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
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 300,
        firstCountryId,
        firstCountry,
        firstCity
      }).then((res) => {
        this.portOptions = res.rows || []
      })
    },
    openReceivePortTable() {
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
    },

    openReceiveAddressTable() {
      this.$refs.selectWarehouseTable.handleOpen()
    },
    receivePortClear() {
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
      this.$set(this.form, 'addressForPort', undefined)
    },
    updatePort(row) {
      const { portName, portId, country } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
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
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
      if (['CIF', 'CFR'].indexOf(this.form.incotermAbbreviation) !== -1) {
        if (
          (this.form.receiveAddressCountry || this.form.country) &&
          (this.form.receiveAddressCountry || this.form.country) !== country
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
            .then(() => {
              this.$refs.portRef.handleBlur()
            })
            .catch(() => {})
        }
      }
    },
    updateWarehouse(row) {
      const { warehouseName, warehouseId, warehouseType } = row
      const warehouseAddress = row.warehouseAddress || {}
      const rowData = { ...row, ...warehouseAddress }
      this.$set(this.form, 'addressForWarehouse', rowData)
      this.$set(this.form, 'receiveAddressName', warehouseName)
      this.$set(this.form, 'receiveAddressId', warehouseId)
      this.$set(this.form, 'warehouseId', warehouseId)
      this.$set(this.form, 'warehouseName', warehouseName)
      this.$set(this.form, 'warehouseType', warehouseType)
      /* const detailList = this.$refs.ProductTable.getList()
      const noCanSelectProductIdList = row.noCanSelectProductIdList || []
      const newDetailList = detailList.filter((item) => {
        return !noCanSelectProductIdList.includes(item.productId)
      })
      this.initPoDetailList = JSON.parse(JSON.stringify(newDetailList)) */
    },
    warehouseClear() {
      this.$set(this.form, 'addressForWarehouse', undefined)
      this.$set(this.form, 'receiveAddressName', undefined)
      this.$set(this.form, 'receiveAddressId', undefined)
      this.$set(this.form, 'warehouseId', undefined)
      this.$set(this.form, 'warehouseName', undefined)
      this.$set(this.form, 'warehouseType', undefined)
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

    queryAllTaxForPurchase() {
      if (this.form.businessPartnerId) {
        this.taxRateOptionsLoading = true
        queryAllTaxForPurchase({ countryId: this.form.countryId })
          .then((res) => {
            this.taxRateOptionsLoading = false
            const data = res.data || []
            data.forEach((item) => {
              item.taxRateStr = this.$numberStr(item.taxRate, 1)
            })
            this.taxRateOptions = data
          })
          .catch(() => {
            this.taxRateOptionsLoading = false
          })
      } else {
        this.taxRateOptions = []
      }
    },
    taxRateChange(row) {
      this.$set(this.form, 'taxId', row.taxId)
      this.$set(this.form, 'taxNo', row.taxNo)
      this.$set(this.form, 'taxRate', row.taxRate)
    },
    queryCurrencyListBySelect() {
      this.currencyOptionsLoading = true
      queryCurrencyListBySelect()
        .then((res) => {
          this.currencyOptionsLoading = false
          const list = res.data || []
          this.currencyOptions = list.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
        })
        .catch(() => {
          this.currencyOptionsLoading = false
        })
    },
    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)
      conversionCurrencyUnitPrice({
        businessPartnerId: this.form.businessPartnerId,
        purchaseQuotationId: this.form.purchaseQuotationId,
        currencyId: row.id,
        currencyCode: row.currencyCode,
        detailList: this.form.salesPriceProductList
      }).then((res) => {
        const data = res.data || {}
        const list = data.detailList || []
        this.form.salesPriceProductList.forEach((item) => {
          const findItem = list.find((i) => i.productId === item.productId)
          if (findItem) {
            this.$set(item, 'unitPrice', findItem.unitPrice)
            this.$set(item, 'lastUnitPrice', findItem.lastUnitPrice)
          }
        })
      })
    },
    currencyClear() {
      this.$set(this.form, 'currencyCode', undefined)
      this.$set(this.form, 'currencyId', undefined)
      this.$set(this.form, 'currency', undefined)
      // this.addLastPurchaseQuotationMsg()
    },

    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptionsLoading = true
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '1',
        menuPerms: this.menuKey.ASL,
        businessPartnerId: this.form.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermOptions = res.data || []
        })
        .catch(() => {
          this.paymentTermOptionsLoading = false
        })
    },
    openPaymentTermDlg() {
      this.$refs.selectPaymentTermDlg.handleAdd()
    },
    paymentTermChange(item) {
      this.$set(this.form, 'paymentTerm', item)
      this.$set(this.form, 'paymentTermId', item.paymentTermId)
      this.$set(this.form, 'paymentTermName', item.paymentTermName)
    },
    openEditPaymentTermDlg() {
      this.$refs.editPaymentTernDlg.handleUpdate(this.form.paymentTerm)
    },
    paymentTermEditChange(item) {
      this.$set(this.form, 'paymentTerm', item)
    },

    async submitForm() {
      const myFileIds = this.$refs.uploadRef.getFileIds()
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
        param.commonFileList = myFileIds
        const tableList = param.salesPriceProductList
        const validProject = this.validProductList(tableList)
        if (!validProject) {
          this.collapseWarningForProductInfo = true
          return
        }
        this.collapseWarningForProductInfo = false
        param = this.$trimOfObj(JSON.parse(JSON.stringify(param)))
        param.detailList = param.salesPriceProductList
        delete param.salesPriceProductList
        const confirmMsg = this.$t('ui.submitPageConfirm')
        const successMsg = this.$t('ui.submitPageSuccess')
        const submitFn = saveApprovedSupplier
        this.submitLoading = true
        const res = await checkProductExistInASL({
          businessPartnerId: param.businessPartnerId,
          productIdList: param.detailList.map((i) => i.productId)
        }).catch(() => {
          this.submitLoading = false
        })
        const tipList = res.data || []
        if (tipList.length > 0) {
          this.autoRemoveAndSubmit({
            tipList,
            param,
            successMsg,
            submitFn
          })
          return
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
    autoRemoveAndSubmit({ tipList, param, successMsg, submitFn }) {
      let htmlStr = '<div>'
      htmlStr += `<div>${this.$t('PURCHASE.aslProductSubmitTip')}</div>`
      htmlStr += '<ul>'
      const icon =
        '<i style="display: inline-block;height: 6px;width: 6px;border-radius: 50%;background-color: #666;margin-right: 4px"></i>'

      tipList.forEach((item) => {
        const approvedSupplierStatusStr = this.selectDictLabel(
          this.statusDicts,
          item.approvedSupplierStatus
        )
        htmlStr += `<li>${icon} ${approvedSupplierStatusStr} - ${item.productName} - ${
          item.currencySymbol || ''
        } ${this.$numberStr(item.unitPrice, 2)}</li>`
      })
      htmlStr += '</ul>'
      htmlStr += '</div>'

      this.$confirm(htmlStr, '', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('uiBtn.submit'),
        cancelButtonText: this.$t('uiBtn.back')
      })
        .then(() => {
          this.submitLoading = true
          submitFn(param)
            .then((response) => {
              this.$modal.msgSuccess(successMsg.replace('$1', response.msg))
              this.back()
              this.submitLoading = false
            })
            .catch(() => {
              this.submitLoading = false
            })
        })
        .catch(() => {
          this.submitLoading = false
        })
    },
    validProductList(detailList) {
      const valid = false
      if (detailList.length <= 0) {
        this.$modal.msgError(this.$t('PURCHASE.prProductTableEmpty'))
        return valid
      }
      const productNameReq = detailList.find((item) => {
        const childList = item.serviceSurchargeList || []
        if (!childList.length) return false
        const errItem = childList.find((child) => !child.expenseItemName)
        return !!errItem
      })
      if (productNameReq) {
        this.$refs.ProductInfo.errorMessage('productName')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
        )
        return valid
      }
      let expenseItemNameExistsItem = false
      const productNameExists = detailList.find((item) => {
        const childList = item.serviceSurchargeList || []
        if (!childList.length) return false
        const nameCount = {}
        const errItem = childList.find((child) => {
          if (!nameCount[child.expenseItemName]) {
            nameCount[child.expenseItemName] = '1'
            return false
          } else {
            expenseItemNameExistsItem = child.expenseItemName
            return true
          }
        })
        return !!errItem
      })
      if (expenseItemNameExistsItem && productNameExists) {
        this.$modal.msgError(
          this.$t('ui.alreadyExists').replace('$1', `[${expenseItemNameExistsItem}]`)
        )
        return
      }

      const purchaseUomReq = detailList.find((item) => {
        const childList = item.serviceSurchargeList || []
        if (!childList.length) return false
        const errItem = childList.find((child) => !child.unit)
        return !!errItem
      })
      if (purchaseUomReq) {
        this.$refs.ProductInfo.errorMessage('purchaseUom')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseUOM'))
        )
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        if (!this.$resultOfBoolean(item.unitPrice)) {
          return true
        }
        const errItem = (item.serviceSurchargeList || []).find(
          (child) => !this.$resultOfBoolean(child.unitPrice)
        )
        if (errItem) {
          return true
        }
        return false
      })
      if (unitPriceReq) {
        this.$refs.ProductInfo.errorMessage('unitPrice')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.contractedPrice'))
        )
        return valid
      }
      /* const moqReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.moq)
      })
      if (moqReq) {
        this.$refs.ProductInfo.errorMessage('moq')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.moq')))
        return valid
      } */
      const leadTimeReq = detailList.find((item) => {
        return !this.$resultOfBoolean(item.leadTime)
      })
      if (leadTimeReq) {
        this.$refs.ProductInfo.errorMessage('leadTime')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.leadTimeDays'))
        )
        return valid
      }

      const effectiveDateReq = detailList.find((item) => {
        return !item.effectiveDate
      })
      if (effectiveDateReq) {
        this.$refs.ProductInfo.errorMessage('effectiveDate')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.effectiveDate'))
        )
        return valid
      }
      /* const expiryDateReq = detailList.find((item) => {
        return !item.expiryDate
      })
      if (expiryDateReq) {
        this.$refs.ProductInfo.errorMessage('expiryDate')
        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.expiryDate'))
        )
        return valid
      } */

      return true
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
