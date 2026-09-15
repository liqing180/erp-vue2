<template>
  <div>
    <el-form
      ref="createForm"
      :model="createForm"
      @submit.native.prevent
      :rules="rules"
      label-width="140px"
      :disabled="comDisFrom"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.supplier')}`"
            prop="businessPartnerName"
            :class="[isModified('businessPartnerName')]"
          >
            <CommonSelectAndList
              :id="createForm.businessPartnerId"
              :label="createForm.businessPartnerName"
              idKey="businessPartnerId"
              labelKey="businessPartnerName"
              filterable
              :options="businessPartnerOptions"
              :loading="businessPartnerOptionsLoading"
              @change="updateSupplier"
              @handleOpen="openTable"
              :disabled="comDisFrom || isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.country')}`"
            prop="country"
            :class="[isModified('country')]"
          >
            <el-input v-model="createForm.country" :title="createForm.country" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('ui.status')}`" prop="purchaseContractStatus">
            <el-input
              :value="
                selectDictLabel(
                  dict.type.supplier_contract_status,
                  createForm.supplierContractStatus
                )
              "
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.purchaseOrder')}`" prop="purchaseOrderNo">
            <CommonSelectAndList
              :id="createForm.purchaseOrderId"
              :label="createForm.purchaseOrderNo"
              idKey="purchaseOrderId"
              labelKey="purchaseOrderNo"
              filterable
              :filter-method="filterMethodForPO"
              @visible-change="visibleChangeForPO"
              :options="purchaseOrderOptionsShow"
              :optionsAll="purchaseOrderOptions"
              :loading="purchaseOrderOptionsLoading"
              @change="updatePurchaseOrderNo"
              @handleOpen="openPurchaseOrderTable"
              :disabled="comDisFrom"
            >
              <template slot-scope="{ item }">{{ item.POShowStr }}</template>
            </CommonSelectAndList>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('menu.currency')}`"
            prop="currency"
            :class="[isModified('currency')]"
          >
            <CommonSelect
              :id="createForm.currencyCode"
              :label="createForm.currency"
              idKey="currencyCode"
              labelKey="currency"
              filterable
              :disabled="!!createForm.purchaseOrderNo"
              :options="currencyOptions"
              :loading="currencyOptionsLoading"
              @change="purchaseCurrencyChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.contractDate')}`" prop="contractDate">
            <el-date-picker
              v-model="createForm.contractDate"
              @change="contractDateChange"
              :editable="false"
              type="date"
              :format="fmtForYmd"
              :picker-options="pickerOptions"
              class="form-wd"
              value-format="timestamp"
              placeholder
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.amount')}`" prop="purchaseAmount">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              style="width: 100%"
              v-model="createForm.purchaseAmount"
              controls-position="right"
              :precision="2"
              placeholder=""
              :min="0.01"
              :max="999999999.99"
              :disabled="!!createForm.purchaseOrderNo"
              @change="inputNumberChange('purchaseAmount')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.deliveryAddress2')}`" prop="deliveryAddress">
            <el-input v-model="createForm.deliveryAddress" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.deliveryDate')}`" prop="deliveryDay">
            <div class="flex">
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                style="width: 40%"
                v-model="createForm.deliveryDay"
                controls-position="right"
                :precision="0"
                :min="1"
                :max="999"
                placeholder=""
                @change="inputNumberChange('deliveryDay')"
              />
              <span style="margin: 0 10px">{{ $t('PURCHASE.day') }}</span>
              <el-date-picker
                v-model="createForm.deliveryDate"
                :disabled="!createForm.contractDate"
                :editable="false"
                type="date"
                :format="fmtForYmd"
                :picker-options="pickerOptions1"
                class="form-wd"
                value-format="timestamp"
                placeholder
                style="width: 60%"
                @change="deliveryDateChange"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            :label="$t('PURCHASE.paymentTerm')"
            :class="[isModified('paymentTermName')]"
            prop="paymentTermName"
          >
            <ToolTipPaymentTerm :paymentTermObj="createForm.paymentTerm || {}">
              <CommonSelect
                :id="createForm.paymentTermId"
                :label="createForm.paymentTermName"
                idKey="paymentTermId"
                labelKey="paymentTermName"
                :options="paymentTermList"
                :loading="paymentTermOptionsLoading"
                @change="paymentTermChange"
                :disabled="!createForm.businessPartnerName || !!createForm.purchaseOrderNo"
                filterable
              />
            </ToolTipPaymentTerm>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
            <MyInput
              type="textarea"
              v-model="createForm.remarks"
              :autosize="{ minRows: 2, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="3000"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.supplierContractNo')}`" prop="supplierContractNo">
            <el-input v-model="createForm.supplierContractNo" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef" :limit="1" :singleFile="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.po')}`" prop="po">
            <el-input v-model="createForm.po" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef1" :limit="1" :singleFile="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.so')}`" prop="so">
            <el-input v-model="createForm.so" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <myUpload ref="uploadRef2" :limit="1" :singleFile="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-for="(item, index) in createForm.supplierContractPvList" :key="item.timeId">
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.pv')}`"
            :prop="'pv' + item.timeId"
            :rules="[
              {
                required: true,
                // eslint-disable-next-line
                pattern: new RegExp(/^(?!(\s+$))/g),
                message: $t('ui.reqMsg'),
                trigger: ['change']
              }
            ]"
          >
            <el-input v-model="createForm['pv' + item.timeId]" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item :label="`${$t('ui.attachment')}`" required>
            <div class="flexSb">
              <div class="flex-1">
                <myUpload :limit="1" :ref="`uploadRef${item.timeId}`" :singleFile="true" />
              </div>
              <div class="ml10" v-if="!comDisFrom">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addPVRow(index)"
                  v-if="createForm.supplierContractPvList.length < 9"
                ></el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delPVRow(index)"
                  v-if="createForm.supplierContractPvList.length > 1"
                ></el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 供应商 -->
    <bpSelect ref="bpSelect" @updatePic="updateSupplier" />
    <!-- 仓库 -->
    <warehouseNameDlg ref="warehouseNameDlg" @updateWarehouse="updateWarehouse" />
    <selectPurchaseOrderTable
      ref="selectPurchaseOrderTable"
      :businessPartnerId="createForm.businessPartnerId"
      @update="updatePurchaseOrderNo"
    />
  </div>
</template>

<script>
import bpSelect from '@/views/purchaseManagement/purchaseContract/bpSelect'
import warehouseNameDlg from '@/views/purchaseManagement/purchaseContract/warehouseNameDlg.vue'
import { queryCurrencyListBySelect } from '@/api/basic/basic'
import selectPurchaseOrderTable from './selectPurchaseOrderTable.vue'
import { queryPaymentTermListByPaymentTermPurpose } from '@/api/system/paymentTerm'
import { queryPCCanSelectVendorListForNoSheet } from '@/api/purchaseManagement/purchaseContract'
import { queryCanSelectPurchaseOrderList } from '@/api/purchaseManagement/supplierContract'
export default {
  dicts: ['supplier_contract_status'],
  components: { bpSelect, warehouseNameDlg, selectPurchaseOrderTable },
  props: {
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    comDisFrom: {
      type: Boolean,
      default: false
    },
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    basicUpdateProps: {
      type: Array,
      default: () => []
    },
    isRevise: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.createForm = newValue || {}
      }
    }
  },

  data() {
    return {
      // 基础信息
      createForm: {
        supplierContractPvList: []
      },
      businessPartnerOptions: [],
      businessPartnerOptionsLoading: false,
      purchaseOrderOptions: [],
      purchaseOrderOptionsShow: [],
      purchaseOrderOptionsLoading: false,
      paymentTermList: [],
      paymentTermOptionsLoading: false,
      rules: {
        purchaseOrderNo: [
          {
            required: false,
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
            trigger: ['change', 'blur']
          }
        ],
        currency: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        purchaseAmount: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        country: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        deliveryAddress: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        contractDate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        paymentTermName: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        supplierContractNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        po: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        so: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        deliveryDay: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      // 货币
      currencyOptions: [],
      currencyOptionsLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        }
      },
      historyPaymentTermNameList: []
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comContactPersonEmails() {
      return this.contactPersonNames.filter((item) => item.contactPersonEmail)
    },
    decimalPoint() {
      return this.queryDecimalPoint
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 付款条款
    queryPaymentTermListByPaymentTermPurpose() {
      this.paymentTermOptionsLoading = true
      this.paymentTermList = []
      if (!this.createForm.businessPartnerId) {
        this.paymentTermOptionsLoading = false
        return
      }
      queryPaymentTermListByPaymentTermPurpose({
        paymentTermPurpose: '1',
        menuPerms: this.menuKey.supplierContract,
        businessPartnerId: this.createForm.businessPartnerId
      })
        .then((res) => {
          this.paymentTermOptionsLoading = false
          this.paymentTermList = res.data || []
        })
        .catch(() => {
          this.paymentTermOptionsLoading = false
        })
    },
    paymentTermChange(item) {
      this.$set(this.createForm, 'paymentTerm', item)
      this.$set(this.createForm, 'paymentTermId', item.paymentTermId)
      this.$set(this.createForm, 'paymentTermName', item.paymentTermName)
    },
    addPVRow(index) {
      this.createForm.supplierContractPvList.splice(index + 1, 0, { timeId: Date.now(), pv: '' })
    },
    delPVRow(index) {
      this.createForm.supplierContractPvList.splice(index, 1)
    },

    handleSelect() {},
    init() {
      this.queryCurrencyListBySelect()
      this.reset()
      this.queryPaymentTermListByPaymentTermPurpose()
      this.queryBusinessPartnerOptions()
      this.queryPurchaseOrderOptions()
    },
    initFileList() {
      const { commonFileList, commonPOFileList, commonSOFileList } = this.createForm
      setTimeout(() => {
        this.$refs.uploadRef && this.$refs.uploadRef.initFileList(commonFileList || [])
        this.$refs.uploadRef1 && this.$refs.uploadRef1.initFileList(commonPOFileList || [])
        this.$refs.uploadRef2 && this.$refs.uploadRef2.initFileList(commonSOFileList || [])
        const supplierContractPvList = this.createForm.supplierContractPvList || []
        supplierContractPvList.forEach((item) => {
          if (item.commonFileList && item.commonFileList.length > 0) {
            this.$refs[`uploadRef${item.timeId}`][0].initFileList(item.commonFileList)
          }
        })
      }, 100)
      this.queryPaymentTermListByPaymentTermPurpose()
    },
    isModified(prop, type = 1) {
      if (!this.modifyHighlight) {
        return ''
      }
      if (type === 1) {
        if (this.basicUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      } else if (type === 2) {
        if (this.ivtSpecificationsUpdateProps.includes(prop)) {
          return 'edit-outline'
        }
      }
    },
    inputNumberChange(code) {
      this.$refs.createForm.validateField(code)
      if (code === 'deliveryDay') {
        const { deliveryDay } = this.createForm
        if (deliveryDay) {
          if (!this.createForm.contractDate) return
          const nowDate =
            this.appointTime(this.createForm.contractDate, '23:59:59') +
            deliveryDay * 24 * 60 * 60 * 1000
          this.$set(this.createForm, 'deliveryDate', nowDate)
        } else {
          this.$set(this.createForm, 'deliveryDate', undefined)
        }
      }
    },
    contractDateChange() {
      const vm = this
      this.pickerOptions1 = {
        disabledDate(time) {
          return time.getTime() < vm.createForm.contractDate + 86399000
        }
      }

      const { deliveryDay } = this.createForm
      if (deliveryDay) {
        if (!this.createForm.contractDate) {
          this.$set(this.createForm, 'deliveryDate', undefined)
          return
        }
        const nowDate =
          this.appointTime(this.createForm.contractDate, '23:59:59') +
          deliveryDay * 24 * 60 * 60 * 1000
        this.$set(this.createForm, 'deliveryDate', nowDate)
      } else {
        this.$set(this.createForm, 'deliveryDate', undefined)
      }
    },
    deliveryDateChange() {
      const { deliveryDate, contractDate } = this.createForm
      if (!contractDate) return
      const nowDate = this.appointTime(contractDate, '23:59:59')
      if (deliveryDate) {
        const end = deliveryDate + 86399000
        const computerDays = Math.ceil(Math.abs(end - nowDate) / 86400000)
        this.$set(this.createForm, 'deliveryDay', computerDays)
      } else {
        this.$set(this.createForm, 'deliveryDay', undefined)
      }
    },
    reset() {
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
      this.$refs.uploadRef1 && this.$refs.uploadRef1.initFileList([])
      this.$refs.uploadRef2 && this.$refs.uploadRef2.initFileList([])
      this.$refs.createForm && this.$refs.createForm.clearValidate()
      // this.resetForm('createForm')
    },
    // 货币
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
    purchaseCurrencyChange(row) {
      this.$set(this.createForm, 'currencyId', row.id)
      this.$set(this.createForm, 'currency', row.currency)
      this.$set(this.createForm, 'currencyCode', row.currencyCode)
      this.$set(this.createForm, 'exchangeRate', 1)
    },

    queryBusinessPartnerOptions() {
      this.businessPartnerOptionsLoading = true
      queryPCCanSelectVendorListForNoSheet({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.supplierContract
      })
        .then((res) => {
          this.businessPartnerOptionsLoading = false
          this.businessPartnerOptions = res.rows || []
        })
        .catch(() => {
          this.businessPartnerOptionsLoading = false
        })
    },
    updateSupplier(row) {
      if (!row.businessPartnerMainId) {
        this.supplierClear()
        return
      }
      const {
        businessPartnerId,
        businessPartnerMainId,
        businessPartnerName,
        businessPartnerNo,
        country,
        countryId
      } = row

      this.$set(this.createForm, 'businessPartnerId', businessPartnerId)
      this.$set(this.createForm, 'businessPartnerMainId', businessPartnerMainId)
      this.$set(this.createForm, 'businessPartnerName', businessPartnerName)
      this.$set(this.createForm, 'businessPartnerNo', businessPartnerNo)
      this.$set(this.createForm, 'country', country)
      this.$set(this.createForm, 'countryId', countryId)
      this.purchaseOrderNoClear()
      this.paymentTermChange({})

      this.queryPaymentTermListByPaymentTermPurpose()
      this.queryPurchaseOrderOptions()
    },
    openTable() {
      this.$refs.bpSelect.handleOpen()
    },
    supplierClear() {
      this.$set(this.createForm, 'businessPartnerId', undefined)
      this.$set(this.createForm, 'businessPartnerMainId', undefined)
      this.$set(this.createForm, 'businessPartnerName', undefined)
      this.$set(this.createForm, 'businessPartnerNo', undefined)
      this.$set(this.createForm, 'country', undefined)
      this.$set(this.createForm, 'countryId', undefined)
      this.purchaseOrderNoClear()
      this.historyPaymentTermNameList = []
      this.paymentTermChange({})

      this.queryPaymentTermListByPaymentTermPurpose()
    },

    queryPurchaseOrderOptions() {
      // this.purchaseOrderOptions = []
      // this.purchaseOrderOptionsShow = []
      const timer = Date.now()
      this.queryTimer = timer
      this.purchaseOrderOptionsLoading = true
      queryCanSelectPurchaseOrderList({
        pageNum: 1,
        pageSize: 9999,
        menuPerms: this.menuKey.supplierContract,
        businessPartnerId: this.createForm.businessPartnerId
      })
        .then((res) => {
          if (this.queryTimer !== timer) return
          this.purchaseOrderOptionsLoading = false
          const rows = res.rows || []
          rows.forEach((x) => {
            x.POShowStr = `${x.purchaseOrderNo}, ${x.businessPartnerName}`
          })
          this.purchaseOrderOptions = rows
          this.purchaseOrderOptionsShow = rows
        })
        .catch(() => {
          this.purchaseOrderOptionsLoading = false
        })
    },

    visibleChangeForPO(show) {
      if (show === false) {
        setTimeout(() => {
          this.purchaseOrderOptionsShow = this.purchaseOrderOptions
        }, 100)
      }
    },
    filterMethodForPO(str) {
      const res = []
      if ((str + '').trim() !== '') {
        this.purchaseOrderOptions.forEach((item) => {
          if (
            item.purchaseOrderNo.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >= 0
          ) {
            res.push(item)
          } else if (
            item.businessPartnerName.toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >=
            0
          ) {
            res.push(item)
          }
        })
        this.purchaseOrderOptionsShow = res
      } else {
        this.purchaseOrderOptionsShow = this.purchaseOrderOptions
      }
    },
    openPurchaseOrderTable() {
      this.$refs.selectPurchaseOrderTable.handleOpen()
    },
    updatePurchaseOrderNo(row) {
      if (!row.purchaseOrderId) {
        this.purchaseOrderNoClear()
        return
      }
      this.$set(this.createForm, 'purchaseOrderId', row.purchaseOrderId)
      this.$set(this.createForm, 'purchaseOrderNo', row.purchaseOrderNo)
      this.$set(this.createForm, 'purchaseDate', row.createdTime)
      this.$set(this.createForm, 'purchasePersonBy', row.purchasePersonBy)
      this.$set(this.createForm, 'purchasePersonId', row.purchasePersonId)
      this.$set(this.createForm, 'businessPartnerId', row.businessPartnerId)

      this.$set(this.createForm, 'businessPartnerMainId', row.businessPartnerMainId)
      this.$set(this.createForm, 'businessPartnerName', row.businessPartnerName)
      this.$set(this.createForm, 'businessPartnerNo', row.businessPartnerNo)
      this.queryPurchaseOrderOptions()
      this.$set(this.createForm, 'country', row.country)
      this.$set(this.createForm, 'countryId', row.countryId)

      this.$set(this.createForm, 'abbreviation', row.abbreviation)
      this.$set(this.createForm, 'paymentTerm', row.paymentTerm || {})
      this.$set(this.createForm, 'paymentTermId', row.paymentTermId)
      this.$set(this.createForm, 'paymentTermName', row.paymentTermName)

      this.$set(this.createForm, 'currencyId', row.currencyId || '')
      this.$set(this.createForm, 'currency', row.currency)
      this.$set(this.createForm, 'currencyCode', row.currencyCode)
      this.$set(this.createForm, 'purchaseAmount', row.totalAmount)
      this.$emit('queryPurchaseOrderById', row.purchaseOrderId)
      this.$nextTick(() => {
        this.$refs.createForm && this.$refs.createForm.clearValidate('purchaseAmount')
      })
    },
    purchaseOrderNoClear() {
      this.$set(this.createForm, 'purchaseOrderId', undefined)
      this.$set(this.createForm, 'purchaseOrderNo', undefined)
      this.$set(this.createForm, 'currencyId', undefined)
      this.$set(this.createForm, 'currency', undefined)
      this.$set(this.createForm, 'currencyCode', undefined)
      this.$set(this.createForm, 'purchaseAmount', undefined)
      this.$set(this.createForm, 'paymentTerm', undefined)
      this.$set(this.createForm, 'paymentTermId', undefined)
      this.$set(this.createForm, 'paymentTermName', undefined)
      this.$emit('queryPurchaseOrderById')
      this.$nextTick(() => {
        this.$refs.createForm && this.$refs.createForm.clearValidate('purchaseAmount')
      })
    },
    openWarehouseTable() {
      this.$refs.warehouseNameDlg.handleOpen()
    },
    updateWarehouse(row) {
      const vm = this
      const { warehouseCode, id, warehouseName } = row
      vm.$set(vm.createForm, 'warehouseId', id)
      vm.$set(vm.createForm, 'warehouseCode', warehouseCode)
      vm.$set(vm.createForm, 'warehouseName', warehouseName)
    },
    warehouseClear() {
      const vm = this
      vm.$set(vm.createForm, 'warehouseId', null)
      vm.$set(vm.createForm, 'warehouseCode', null)
      vm.$set(vm.createForm, 'warehouseName', null)
    },

    incotermChg(keyValue) {
      const vm = this
      let firstNumber = null
      if (keyValue.toString().length > 1) {
        firstNumber = keyValue.toString().substring(0, 1)
      } else {
        firstNumber = keyValue.toString()
      }
      if (firstNumber === '1') {
        vm.addressShow = true
        vm.seaPortShow = false
        vm.shipAgentShow = false
        vm.$set(vm.logisticForm, 'label', '')
        vm.$set(vm, 'addressObj', {})
        vm.addressFormStr = ''
      } else if (firstNumber === '2') {
        vm.addressShow = false
        vm.seaPortShow = false
        vm.shipAgentShow = true
        vm.$set(vm.logisticForm, 'label', '')
        vm.$set(vm, 'shipAgentObj', {})
      } else {
        vm.addressShow = false
        vm.seaPortShow = true
        vm.shipAgentShow = false
        vm.$set(vm.logisticForm, 'label', '')
        vm.$set(vm, 'seaPortObj', {})
      }
    },
    getAllFileIds() {
      return {
        commonFileList: this.$refs.uploadRef && this.$refs.uploadRef.getFileIds(),
        commonPOFileList: this.$refs.uploadRef1 && this.$refs.uploadRef1.getFileIds(),
        commonSOFileList: this.$refs.uploadRef2 && this.$refs.uploadRef2.getFileIds()
      }
    },
    async basicInfoSubmit(type) {
      try {
        if (!type) {
          await this.$refs.createForm.validate()
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.createForm)))
          const myFileIds = this.$refs.uploadRef.getFileIds({
            required: true,
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (myFileIds === false) {
            return false
          }
          param.commonFileList = myFileIds
          const myFileIds1 = this.$refs.uploadRef1.getFileIds({
            required: true,
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (myFileIds1 === false) {
            return false
          }
          param.commonPOFileList = myFileIds1
          const myFileIds2 = this.$refs.uploadRef2.getFileIds({
            required: true,
            requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
          })
          if (myFileIds2 === false) {
            return false
          }
          param.commonSOFileList = myFileIds2

          const errItem = param.supplierContractPvList.find((item) => {
            item.pv = param['pv' + item.timeId]
            const myFileIds3 = this.$refs[`uploadRef${item.timeId}`][0].getFileIds({
              required: true,
              requiredMsg: this.$t('ui.commonReqMsg').replace('$1', this.$t('ui.attachment'))
            })
            item.commonFileList = myFileIds3
            return !myFileIds3
          })
          if (errItem) {
            return false
          }

          return param
        } else {
          this.$refs.createForm && this.$refs.createForm.clearValidate()
          const { businessPartnerName, supplierContractNo } = this.createForm
          if (businessPartnerName && supplierContractNo && supplierContractNo.trim !== '') {
            const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.createForm)))
            const myFileIds = this.$refs.uploadRef.getFileIds()
            if (myFileIds === false) {
              return false
            }
            param.commonFileList = myFileIds
            const myFileIds1 = this.$refs.uploadRef1.getFileIds()
            if (myFileIds1 === false) {
              return false
            }
            param.commonPOFileList = myFileIds1
            const myFileIds2 = this.$refs.uploadRef2.getFileIds()
            if (myFileIds2 === false) {
              return false
            }
            param.commonSOFileList = myFileIds2

            const errItem = param.supplierContractPvList.find((item) => {
              item.pv = param['pv' + item.timeId]
              const myFileIds3 = this.$refs[`uploadRef${item.timeId}`][0].getFileIds()
              item.commonFileList = myFileIds3
              return !myFileIds3
            })
            if (errItem) {
              return false
            }

            return param
          } else {
            this.$modal.msgError(
              this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo'))
            )

            this.$refs.createForm.validateField(['businessPartnerName', 'supplierContractNo'])
            return false
          }
        }
      } catch (err) {
        // console.log(err)
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
