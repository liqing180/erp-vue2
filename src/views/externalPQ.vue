<template>
  <div class="pages-pq" v-loading="loading">
    <div class="header flexStart">
      <div class="title" style="width: 33.33%">
        {{ legalEntity.legalEntityName }} {{ $t('PURCHASE.quotation1') }}
      </div>
      <div style="width: 33.33%; text-align: center">
        <span class="mr20">{{ $t('PURCHASE.docNo1') }} {{ form.rfqNo }}</span>
        <span>{{ $t('PURCHASE.deadline') }} {{ parseTime(form.dueDate, fmtForYmd) }}</span>
      </div>
      <div class="flexEnd" style="width: 33.33%">
        <el-button
          size="mini"
          :type="language === 'zh' ? 'primary' : ''"
          @click="languageChange('zh')"
          >中</el-button
        >
        <el-button
          size="mini"
          :type="language === 'en' ? 'primary' : ''"
          @click="languageChange('en')"
          >EN</el-button
        >
      </div>
    </div>

    <div class="customerQuestionnaire">
      <div class="box-card">
        <el-form
          ref="form"
          :model="form"
          @submit.native.prevent
          :rules="rules"
          :disabled="comDisFrom"
          class="form white"
          style="padding: 20px"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="`${$t('PURCHASE.quotationNo')}`" prop="supplierQuoteNo">
                <el-input
                  v-model="form.supplierQuoteNo"
                  :title="form.supplierQuoteNo"
                  maxlength="50"
                  size="mini"
                  @input="formValueChange('supplierQuoteNo')"
                ></el-input>
              </el-form-item>
            </el-col>
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
                  size="mini"
                  @change="dateQuotedChange('validity')"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${$t('PURCHASE.validityDays')}`" prop="validityForDay">
                <div class="flex" style="align-items: center">
                  <el-input-number
                    v-thousandSplit="{ precision: 0 }"
                    v-model="form.validityForDay"
                    :precision="0"
                    type="number"
                    :min="1"
                    :max="999"
                    :controls="false"
                    style="width: 30%"
                    size="mini"
                    :disabled="!form.dateQuoted"
                    @change="validityChange('validityForDay')"
                  />
                  <span class="mr5 ml5">{{ $t('PURCHASE.day') }}</span>
                  <el-date-picker
                    @change="validityChange('validity')"
                    v-model="form.validity"
                    :disabled="!form.dateQuoted"
                    :title="parseTime(form.validity, fmtForYmd)"
                    :picker-options="validityDaysPickerOptions"
                    :format="fmtForYmd"
                    value-format="timestamp"
                    :style="{ width: '70%' }"
                    placeholder=""
                    clearable
                    size="mini"
                  ></el-date-picker>
                </div>
                <div style="color: #9ca3af; font-size: 12px; line-height: 20px">
                  {{ $t('PURCHASE.fromQuotationDate') }}
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="`${$t('PURCHASE.contactPerson')}`" prop="contactPersonName">
                <div class="input-switch-box">
                  <div class="con-left">
                    <CommonSelect
                      :disabled="!form.businessPartnerId"
                      :id="form.contactPersonId"
                      :label="form.contactPersonName"
                      :title="form.contactPersonName"
                      idKey="contactPersonId"
                      labelKey="contactPersonName"
                      :options="form.bpBusinessContactPersonList || []"
                      @change="contactPersonChange"
                      size="mini"
                    />
                  </div>

                  <div class="con-right" v-if="!comDisFrom">
                    <i
                      class="el-icon-edit primary"
                      style="font-size: 20px"
                      @click="openAddBPContactPersonDlg"
                    ></i>
                  </div>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="16">
              <el-form-item :label="`${$t('PURCHASE.paymentTerm')}`" prop="paymentTermName">
                <el-input
                  v-model="form.paymentTermName"
                  :title="form.paymentTermName"
                  size="mini"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  resize="none"
                  maxlength="200"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="`${$t('PURCHASE.currency')}`" prop="currencyCode">
                <CommonSelect
                  :disabled="comDisFrom"
                  :id="form.currencyCode"
                  :label="form.currency"
                  :title="form.currency"
                  idKey="currencyCode"
                  labelKey="currency"
                  filterable
                  :options="currencyOptions || []"
                  @change="currencyChange"
                  size="mini"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if="form.country !== legalEntity.country">
              <el-form-item :label="`${$t('PURCHASE.incoterm')}`" prop="incotermId">
                <CommonSelect
                  :id="form.incotermId"
                  :label="form.incotermName"
                  :title="form.incotermName"
                  idKey="incotermId"
                  labelKey="incotermName"
                  :options="incotermOptions"
                  :loading="incotermOptionsLoading"
                  @change="incotermIdChange"
                  :disabled="comDisFrom || form.isOnlyService === '1'"
                  size="mini"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.country !== legalEntity.country">
              <el-form-item
                :label="`${$t('PURCHASE.port')}`"
                v-if="form.incotermAddressType === '0'"
                key="receivePortName1"
              >
                <el-input
                  :value="$t('PURCHASE.selfCollect')"
                  :maxlength="50"
                  disabled
                  size="mini"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="`${$t('PURCHASE.port')}`"
                prop="receivePortName"
                key="receivePortName2"
                v-else
              >
                <CommonSelect
                  :id="form.receivePortId"
                  :label="form.receivePortName"
                  :title="form.receivePortName"
                  idKey="portId"
                  labelKey="portName"
                  :options="portOptions"
                  :loading="portOptionsLoading"
                  @change="updatePort"
                  :disabled="form.incotermAddressType !== '1'"
                  size="mini"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                <el-input
                  v-model="form.remarks"
                  :title="form.remarks"
                  size="mini"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  resize="none"
                  show-word-limit
                  :maxlength="3000"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item :label="`${$t('PURCHASE.purchaseQuotation')}`" required>
                <myUpload
                  ref="uploadRef1"
                  :accept="['.jpg', '.jpeg', '.png', '.pdf']"
                  :limit="1"
                  :singleFile="true"
                  :disabled="comDisFrom"
                  :updateFileList="updatePQFileList"
                  :filterOthersFileList="fileList"
                  :isToken="false"
                  :uploadPerson="comDisFrom ? '' : uploadPerson"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col
              :span="8"
              v-if="taxIncludedForSystemSetup === '1' || form.taxIncludedForPre === '1'"
            >
              <el-form-item :label="`${$t('system.taxIncluded')}`">
                <el-switch
                  v-model="form.taxIncluded"
                  active-value="1"
                  inactive-value="0"
                  @change="taxIncludedChange"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <ProductTable
          style="padding: 20px"
          class="mt10 white"
          :comDisFrom="comDisFrom"
          ref="ProductTable"
          :businessPartnerId="form.businessPartnerId"
          :countryId="form.countryId"
          :currencyId="form.currencyId"
          :form="form"
          @changeRowCommittedDate="changeRowCommittedDate"
          :allUomList="allUomList"
          :serviceSurchargeListOptions="serviceSurchargeList"
          @handleCalculate="handleCalculate"
          :language="language"
        />

        <div class="flexSb pages-footer">
          <div>
            <!-- <div class="flexStart">
              <div class="mr20">
                {{ $t('PURCHASE.subTotal') }}：{{ $numberStr(form.subTotal, 2) }}
              </div>
              <div class="mr20">
                <el-form
                  ref="form1"
                  :model="form"
                  @submit.native.prevent
                  :rules="rules"
                  label-width="80px"
                  :disabled="comDisFrom"
                  class="tax-form"
                >
                  <el-form-item :label="`${$t('PURCHASE.taxRate')}`" prop="taxRate">
                    <CommonSelect
                      :id="$numberStr(form.taxRate, 1)"
                      :label="$numberStr(form.taxRate, 1)"
                      idKey="taxRateStr"
                      labelKey="taxRateStr"
                      :options="taxList"
                      @change="taxRateChange"
                      size="mini"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <div class="mr20">
                {{ $t('PURCHASE.taxAmount') }}：{{ $numberStr(form.totalTaxAmount, 2) }}
              </div>
              <div>{{ $t('PURCHASE.totalAmount') }}：{{ $numberStr(form.totalAmount, 2) }}</div>
            </div> -->

            <div class="flexStart" style="line-height: 30px">
              <div class="flexSb mr20">
                <span>{{ $t('PURCHASE.subTotal') }}：</span>
                <span>
                  {{ $numberStr(form.subTotal, 2) }}
                </span>
              </div>
              <el-form
                ref="form1"
                :model="form"
                @submit.native.prevent
                :rules="rules"
                label-width="80px"
                :disabled="comDisFrom"
                class="tax-form mr20"
              >
                <el-form-item :label="`${$t('PURCHASE.taxRate')}`" prop="taxRate">
                  <CommonSelect
                    :id="$numberStr(form.taxRate, 1)"
                    :label="$numberStr(form.taxRate, 1)"
                    idKey="taxRateStr"
                    labelKey="taxRateStr"
                    :options="taxList"
                    @change="taxRateChange"
                    size="mini"
                  />
                </el-form-item>
              </el-form>
              <div class="flexSb mr20">
                <span>{{ $t('PURCHASE.taxAmount') }}：</span>
                <span>{{ $numberStr(form.totalTaxAmount, 2) }}</span>
              </div>
              <div class="flexSb">
                <span>{{ $t('PURCHASE.totalAmount') }}：</span>
                <span style="color: #1890ff; font-weight: 700">{{
                  $numberStr(form.totalAmount, 2)
                }}</span>
              </div>
            </div>
            <div class="flexEnd" style="color: #ff4949; font-size: 12px; line-height: 20px">
              {{ form.isTotalAmountNegativeTips === '1' ? form.totalAmountNegativeTipsMsg : '' }}
            </div>
          </div>

          <div style="text-align: right">
            <el-button type="primary" style="width: 160px" @click="submit" v-if="!comDisFrom">{{
              $t('PURCHASE.submitQuotation')
            }}</el-button>
          </div>
        </div>
      </div>

      <addBPContactPersonDlg
        ref="addBPContactPersonDlg"
        :businessPartnerType="form.businessPartner ? form.businessPartner.businessPartnerType : ''"
        :legalEntity="legalEntity"
        :language="language"
        @update="addBPContactPerson"
      />
    </div>
  </div>
</template>

<script>
import {
  queryPurchaseQuotationById,
  savePurchaseQuotation,
  revisePurchaseQuotation,
  queryIncotermList,
  queryCanSelectPortList,
  getSystemSetup,
  calculate,
  queryAllUomList
} from '@/api/login'

import locale from '@/views/purchaseManagement/lang/index'
import ProductTable from './productTable.vue'
import addBPContactPersonDlg from './addBPContactPersonDlg'
import Cookies from 'js-cookie'

export default {
  components: { ProductTable, addBPContactPersonDlg },
  data() {
    return {
      incotermOptions: [],
      incotermOptionsLoading: false,
      portOptions: [],
      portOptionsLoading: false,
      isFocus: false,
      query: {},
      previewForm: {},
      customerQuestionnaireStatus: '',
      language: 'zh',
      form: {
        detailsOfExpensesList: []
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
      PQFileList: [],
      fileList: [],
      buttonAuthMsg: {
        isCanSaveDraft: '0'
      },
      allUomList: [],
      currencyOptions: [],
      taxList: [],
      legalEntity: {},
      loading: false,
      uploadPerson: undefined,
      rules: {
        supplierQuoteNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        receivePortName: [
          {
            required: false,
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
        contactPersonName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
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
        currencyCode: [
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
        paymentTermName: [
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
        tax: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      taxIncludedForSystemSetup: undefined,
      serviceSurchargeList: []
    }
  },

  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comDisFrom() {
      let dis = false
      // isCanRevise || isCanUpdate
      if (this.buttonAuthMsg.isCanRevise !== '1' && this.buttonAuthMsg.isCanUpdate !== '1') {
        dis = true
      }
      return dis
    },
    // 共计
    subTotalCount() {
      const { purchaseQuotationDetailList } = this.form
      let total = 0
      if (purchaseQuotationDetailList && purchaseQuotationDetailList.length > 0) {
        const amount = purchaseQuotationDetailList.some((item) => {
          return this.$resultOfBoolean(item.amount)
        })
        if (!amount) {
          return ''
        }
        purchaseQuotationDetailList.forEach((x) => {
          if (this.$resultOfBoolean(x.amount)) {
            total += x.amount * 100
          }
        })
        return this.$numberStr(total / 100, 2)
      }
      return ''
    },
    // 税额
    taxAmountCount() {
      const { taxRate, purchaseQuotationDetailList, taxIncluded } = this.form

      if (this.$resultOfBoolean(taxRate)) {
        let total = 0
        if (purchaseQuotationDetailList && purchaseQuotationDetailList.length > 0) {
          const amount = purchaseQuotationDetailList.some((item) => {
            return this.$resultOfBoolean(item.amount)
          })
          if (!amount) {
            return ''
          }
          if (taxRate * 1 === 0 || taxIncluded === '1') {
            return 0
          }

          purchaseQuotationDetailList.forEach((x) => {
            if (this.$resultOfBoolean(x.amount)) {
              total += x.amount * 100
            }
          })
          total = total * taxRate
          return this.$numberStr(total / 10000, 2)
        }
      }
      return ''
    },
    // 总计
    totalAmountCount() {
      const { taxRate, purchaseQuotationDetailList, taxIncluded } = this.form

      if (this.$resultOfBoolean(taxRate)) {
        let total = 0
        if (purchaseQuotationDetailList && purchaseQuotationDetailList.length > 0) {
          const amount = purchaseQuotationDetailList.some((item) => {
            return this.$resultOfBoolean(item.amount)
          })
          if (!amount) {
            return ''
          }
          // if (taxRate * 1 === 0) {
          //   return 0
          // }
          purchaseQuotationDetailList.forEach((x) => {
            if (this.$resultOfBoolean(x.amount)) {
              total += x.amount * 100
            }
          })
          if (taxIncluded === '1') {
            total = total / 100
          } else {
            total = total / 100 + (total * taxRate) / 10000
          }
          return this.$numberStr(total, 2)
        }
      }
      return ''
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.query = this.$route.query
    this.getInfo()
    this.queryIncotermList()
    this.queryAllUomList()
  },
  mounted() {
    if (this.isBrowserChinese()) {
      this.languageChange('zh')
    } else {
      this.languageChange('en')
    }
  },
  methods: {
    isBrowserChinese() {
      const lang = navigator.language || navigator.userLanguage
      return lang.startsWith('zh')
    },
    queryAllUomList() {
      queryAllUomList().then((res) => {
        this.allUomList = res.data || []
      })
    },
    getInfo(type = '') {
      // if (!this.query.id) return
      this.reset()
      this.loading = true
      // await this.getSystemSetup()
      queryPurchaseQuotationById({
        purchaseQuotationId: this.query.id || '16077905681186816',
        uuid: this.query.uuid
      })
        .then((res) => {
          this.loading = false
          const { otherExternalMsg, commonFileListForPQ, buttonAuthMsg } = res.data || {}
          /* if (!type) {
            if (country === '中国' || country === 'China' || country === 'china') {
              this.languageChange('zh')
            } else {
              this.languageChange('en')
            }
          } */
          const data = res.data || {}
          if (['4', '5', '6', '9'].indexOf(data.purchaseQuotationStatus) !== -1) {
            this.$router.push({ path: '/externalPQSuccess?type=expired' }).catch(() => {})
            return
          }
          let timer = Date.now()

          if (data.purchaseQuotationDetailList && data.purchaseQuotationDetailList.length) {
            data.purchaseQuotationDetailList.forEach((item) => {
              item.rowTimeId = item.productId
              if (item.serviceSurchargeList) {
                item.serviceSurchargeList.forEach((child) => {
                  timer++
                  child.rowTimeId = timer
                })
              }
            })
            setTimeout(() => {
              this.handleCalculate()
            }, 50)
          }
          this.form = data || {}
          this.uploadPerson = this.form.contactPersonName
          this.form.taxIncludedForPre = this.form.taxIncluded

          this.buttonAuthMsg = buttonAuthMsg || {}
          if (this.form.purchaseQuotationStatus === '1' && !this.form.dateQuoted) {
            this.$set(this.form, 'dateQuoted', Date.now())
          }

          const { currencyList, taxList, legalEntity, fileOnlinePreview, timeFormat } =
            otherExternalMsg || {}
          this.legalEntity = legalEntity
          this.$store.commit('SET_ONLINE_PREVIEW_URL', fileOnlinePreview || '')
          this.$store.commit('SET_FMTFORTIME', timeFormat || '')

          this.getSystemSetup()

          this.queryCanSelectPortList()

          this.currencyOptions = currencyList.map((item) => {
            item.label = `${item.currencyCode} (${item.currencyDesc})`
            return item
          })
          this.taxList = taxList.map((item) => {
            item.taxRateStr = this.$numberStr(item.taxRate, 1)
            return item
          })
          if (this.form.incotermAddressType === '1') {
            this.rules.receivePortName[0].required = this.form.incotermAddressType === '1'
          }
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate()
            this.$refs.form1 && this.$refs.form1.clearValidate()
          })
          setTimeout(() => {
            this.$refs.uploadRef1 && this.$refs.uploadRef1.initFileList(commonFileListForPQ || [])
          }, 300)
        })
        .catch(() => {
          this.loading = false
        })
    },

    getSystemSetup() {
      return getSystemSetup(this.legalEntity.id).then((res) => {
        const data = res.data || {}
        this.taxIncludedForSystemSetup = data.taxIncluded
        if (!this.form.taxIncluded) {
          if (this.taxIncludedForSystemSetup === '1') {
            this.form.taxIncluded = '1'
          } else {
            this.form.taxIncluded = '0'
          }
        }
        this.serviceSurchargeList = data.serviceSurchargeList || []
      })
    },
    taxIncludedChange() {
      this.handleCalculate()
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
      this.$set(this.form, 'bpBusinessContactPersonId', undefined)
      this.$set(this.form, 'contactPersonId', undefined)
      this.$set(this.form, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNum', row.mobileNum)
      this.$set(this.form, 'mobileCode', row.mobileCode)
      this.$set(this.form, 'mobilePhone', row.mobilePhone)
      this.$set(this.form, 'email', row.email)
      this.$set(this.form, 'isAdhocEntryContactPerson', '1')

      console.log(row, '===============805')
    },
    reset() {
      this.form = {
        businessPartnerName: undefined,
        purchaseQuotationStatus: '1',
        purchaseQuotationNo: undefined,
        businessPartnerId: undefined,
        contactPersonName: undefined,
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
        ourRef: undefined,
        incotermId: undefined,
        incotermName: undefined,
        remarks: undefined,
        incotermAddressType: undefined,
        receiveAddressId: undefined,
        receiveAddressName: undefined,
        detailsOfExpensesList: []
      }
      this.resetForm('form')
      this.resetForm('form1')
    },

    formValueChange(type) {
      this.$refs.form.validateField(type)
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      //   this.$refs.form1.clearValidate()
      // })
    },
    queryIncotermList() {
      this.incotermOptionsLoading = true
      queryIncotermList({})
        .then((res) => {
          this.incotermOptions = res.data || []
          this.incotermOptionsLoading = false
        })
        .catch(() => {
          this.incotermOptionsLoading = false
        })
    },
    queryCanSelectPortList() {
      let firstCountryId
      let firstCountry
      let firstCity
      if (['FOB', 'FAS'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.form.countryId
        firstCountry = this.form.country
        // firstCity = this.legalEntity.legalEntityAddress?.city
      }
      if (['CIF', 'CFR'].includes(this.form.incotermAbbreviation)) {
        firstCountryId = this.form.receiveAddressCountryId
        firstCountry = this.form.receiveAddressCountry
        firstCity = this.form.receiveAddressCity
      }
      this.portOptionsLoading = true
      queryCanSelectPortList({
        pageNum: 1,
        pageSize: 9999,
        firstCountryId,
        firstCountry,
        legalEntityId: this.legalEntity.id,
        firstCity
      })
        .then((res) => {
          this.portOptions = res.rows || []
          this.portOptionsLoading = false
        })
        .catch(() => {
          this.portOptionsLoading = false
        })
    },
    updatePort(row) {
      const { portName, portId } = row
      this.$set(this.form, 'addressForPort', row)
      this.$set(this.form, 'receivePortName', portName)
      this.$set(this.form, 'receivePortId', portId)
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      //   this.$refs.form1.clearValidate()
      // })
    },
    receivePortClear() {
      this.$set(this.form, 'addressForPort', undefined)
      this.$set(this.form, 'receivePortName', undefined)
      this.$set(this.form, 'receivePortId', undefined)
    },
    incotermIdChange(item) {
      this.$set(this.form, 'incotermId', item.incotermId)
      this.$set(this.form, 'incotermName', item.incotermName)
      this.$set(this.form, 'incotermAbbreviation', item.incotermAbbreviation)
      this.$set(this.form, 'incotermAddressType', item.incotermAddressType)
      this.receivePortClear()
      this.queryCanSelectPortList()

      this.rules.receivePortName[0].required = this.form.incotermAddressType === '1'
      this.$nextTick(() => {
        this.$refs.form.validateField('receivePortName')
      })
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      //   this.$refs.form1.clearValidate()
      // })
    },
    contactPersonChange(row) {
      this.$set(this.form, 'businessContactPersonId', row.businessContactPersonId)
      this.$set(this.form, 'contactPersonId', row.contactPersonId)
      this.$set(this.form, 'contactPersonName', row.contactPersonName)
      this.$set(this.form, 'mobileNum', row.mobileNum)
      this.$set(this.form, 'mobileCode', row.mobileCode)
      this.$set(this.form, 'mobilePhone', row.mobilePhone)
      this.$set(this.form, 'email', row.email)

      this.$set(this.form, 'isAdhocEntryContactPerson', undefined)
      this.$set(this.form, 'bpBusinessContactPerson', undefined)
    },
    changeRowCommittedDate(value) {
      this.$set(this.form, 'committedDate', value)
    },
    languageChange(type) {
      if (this.language !== type) {
        // this.$nextTick(() => {
        //   this.$refs.form.clearValidate()
        //   this.$refs.form1.clearValidate()
        // })
        setTimeout(() => {
          this.$refs.form.clearValidate()
          this.$refs.form1.clearValidate()
          this.handleCalculate()
          // this.initRules()
        }, 50)
      }

      this.language = type
      this.$i18n.locale = type
      this.initRules()

      Cookies.set('language', type)
      // cache.local.set('language', type)
    },
    initRules() {
      this.rules = {
        supplierQuoteNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        receivePortName: [
          {
            required: false,
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
        contactPersonName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
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
        currencyCode: [
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
        paymentTermName: [
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
        tax: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      }
    },
    dateQuotedChange() {
      if (this.form.dateQuoted && this.$resultOfBoolean(this.form.validityForDay)) {
        this.validityChange('validityForDay')
      }
    },

    validityChange(changeType) {
      const cur = this.appointTime(this.form.dateQuoted, '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      if (changeType === 'validityForDay') {
        if (this.form.validityForDay) {
          this.$set(this.form, 'validity', dayTimer * this.form.validityForDay + cur)
        } else {
          this.$set(this.form, 'validity', undefined)
        }
      }
      if (changeType === 'validity') {
        if (this.form.validity) {
          const timer = Math.floor((this.form.validity - cur) / dayTimer)
          this.$set(this.form, 'validityForDay', timer)
        } else {
          this.$set(this.form, 'validityForDay', undefined)
          this.$nextTick(() => {
            this.$refs.form.validateField('validityForDay')
          })
        }
      }
    },

    currencyChange(row) {
      this.$set(this.form, 'currencyId', row.id)
      this.$set(this.form, 'currency', row.currency)
      this.$set(this.form, 'currencyCode', row.currencyCode)
      this.$set(this.form, 'currencySymbol', row.currencySymbol)
    },
    taxRateChange(row) {
      this.$set(this.form, 'taxId', row.taxId)
      this.$set(this.form, 'taxNo', row.taxNo)
      this.$set(this.form, 'taxRate', row.taxRate)
      this.handleCalculate()
    },
    updatePQFileList(list) {
      this.PQFileList = list
    },
    handleCalculate() {
      const tableList = this.$refs.ProductTable && this.$refs.ProductTable.getList()
      if (!(tableList && tableList.length > 0)) return
      const params = {
        ...this.form,
        purchaseQuotationDetailList: tableList
      }

      const timer = Date.now()
      this.queryTotalTime = timer
      this.loading = true
      calculate(params)
        .then((res) => {
          if (this.queryTotalTime === timer) {
            const data = res.data || {}

            let timer = Date.now()
            data.purchaseQuotationDetailList.forEach((item) => {
              item.rowTimeId = item.productId
              if (item.serviceSurchargeList) {
                item.serviceSurchargeList.forEach((child) => {
                  timer++
                  child.rowTimeId = timer
                })
              }
            })
            this.form = data
          }
          setTimeout(() => {
            this.loading = false
          }, 50)
        })
        .catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 50)
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
        this.$refs.ProductTable.errorMessage('productName')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
        )
        return valid
      }

      const detailsOfExpensesList = this.form.detailsOfExpensesList || []

      const record = new Set()
      for (const obj of detailsOfExpensesList) {
        const name = obj.expenseItem?.trim()
        // 为空跳过，如需禁止空值可自行加校验
        if (!name) continue

        if (record.has(name)) {
          // 发现重复，提示 + 返回false拦截
          this.$modal.msgError(this.$t('ui.alreadyExists').replace('$1', `[${name}]`))
          return false
        }
        record.add(name)
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

      const expenseItemReq = detailsOfExpensesList.find((item) => {
        return !(item.expenseItem || '').trim()
      })
      if (expenseItemReq) {
        this.$refs.ProductTable.errorMessage('productName')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.productName'))
        )
        return valid
      }

      const qtyReq = detailList.find((item) => {
        if (!this.$resultOfBoolean(item.purchaseQty)) {
          return true
        }
        const errItem = (item.serviceSurchargeList || []).find(
          (child) => !this.$resultOfBoolean(child.qty)
        )
        if (errItem) {
          return true
        }
        return false
      })
      if (qtyReq) {
        this.$refs.ProductTable.errorMessage('purchaseQty')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.offeredQTY'))
        )
        return valid
      }

      const qtyLessThanMoq = detailList.find((item) => {
        return item.moq && item.purchaseQty < item.moq
      })
      if (qtyLessThanMoq) {
        this.$modal.msgError(this.$t('PURCHASE.qtyLessThanMoq2'))
        return valid
      }

      // const uomReq = detailList.find((item) => {
      //   return !this.$resultOfBoolean(item.purchaseUom)
      // })

      const uomReq = detailList.find((item) => {
        if (!this.$resultOfBoolean(item.purchaseUom) && item.isProjectTempProduct !== '1') {
          return true
        }
        const errItem = (item.serviceSurchargeList || []).find(
          (child) => !this.$resultOfBoolean(child.unit)
        )
        if (errItem) {
          return true
        }
        return false
      })
      if (uomReq) {
        this.$refs.ProductTable.errorMessage('purchaseUom')

        this.$modal.msgError(this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.uom')))
        return valid
      }

      const unitPriceReq = detailList.find((item) => {
        if (!this.$resultOfBoolean(item.unitPrice) && item.pqResult === '1') {
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
        this.$refs.ProductTable.errorMessage('unitPrice')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
        )
        return valid
      }

      const amountReq = detailsOfExpensesList.find((item) => {
        return !this.$resultOfBoolean(item.amount)
      })
      if (amountReq) {
        this.$refs.ProductTable.errorMessage('unitPrice')

        this.$modal.msgError(
          this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.unitPrice'))
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
    async submit() {
      // this.$router.push({ path: '/externalPQSuccess' }).catch(() => {})

      const valid = await this.$refs.form.validate().catch((err) => {
        return err
      })
      if (!valid) {
        return
      }
      let myFileIds1 = this.$refs.uploadRef1.getFileIds({
        required: true,
        requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('PURCHASE.purchaseQuotation'))
      })
      if (myFileIds1 === false) {
        this.collapseWarningForBasicInfo = true
        return
      }
      const detailList = this.$refs.ProductTable.getList()
      const validProduct = this.validProductList(detailList)
      if (!validProduct) {
        return
      }
      const valid1 = await this.$refs.form1.validate().catch((err) => {
        return err
      })
      if (!valid1) {
        return
      }

      const params = JSON.parse(JSON.stringify(this.form))
      params.purchaseQuotationDetailList = detailList
      myFileIds1 = myFileIds1.map((x) => {
        const { creatorName, ...row } = x
        return {
          creatorName: params.contactPersonName,
          ...row
        }
      })
      params.commonFileListForPQ = myFileIds1
      params.uuid = this.query.uuid
      console.log(params, '====================================1199')
      this.$modal
        .confirm(this.$t('PURCHASE.pqSubmitConfirm'))
        .then(() => {
          this.loading = true
          if (this.buttonAuthMsg.isCanUpdate === '1') {
            return savePurchaseQuotation(params)
          }
          if (this.buttonAuthMsg.isCanRevise === '1') {
            return revisePurchaseQuotation(params)
          }
        })
        .then((response) => {
          this.loading = false
          // this.$modal.msgSuccess(this.$t('PURCHASE.submitSuccess'))
          this.getInfo('submit')
          this.$router.push({ path: '/externalPQSuccess' }).catch(() => {})
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.white {
  background-color: #fff;
}
.pages-pq {
  height: 100vh;
  overflow: hidden;
  background-color: #f3f4f6;
  .header {
    position: relative;
    word-break: break-word;
    height: 50px;
    padding: 0 30px;
    border-bottom: 1px solid #dcdfe6;
    background-color: #fff;

    .logo {
      width: 300px;
      height: 75px;
    }
    .title {
      font-size: 16px;
      font-weight: 700;
    }
  }

  .customerQuestionnaire {
    height: calc(100vh - 50px);
    padding: 10px 10px 0;
    overflow: hidden;
    overflow-y: auto;
    ::v-deep .el-divider--horizontal {
      margin: 18px 0;
    }
    .box-card {
      position: relative;
      font-size: 14px;
      color: #606266;
      min-width: 800px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .pages-footer {
      position: sticky;
      bottom: 0;
      height: 60px;
      padding: 0 20px;
      margin: 10px 0;
      background-color: #fff;
      z-index: 999;
      box-shadow: 0 22px 70px rgba(20, 32, 51, 0.18);
    }
  }

  .form ::v-deep .el-form-item__label,
  .form ::v-deep .el-form-item__content {
    line-height: 30px;
  }

  .tax-form ::v-deep .el-form-item {
    margin-bottom: 0;
  }
  .form ::v-deep .el-form-item__error,
  .tax-form ::v-deep .el-form-item__error {
    padding-top: 0;
  }

  .tax-form ::v-deep .el-form-item__label,
  .tax-form ::v-deep .el-form-item__content {
    line-height: 30px;
  }
}
</style>
