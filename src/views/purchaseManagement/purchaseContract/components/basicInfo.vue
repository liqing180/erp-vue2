<template>
  <div>
    <el-form
      ref="createForm"
      :model="createForm"
      @submit.native.prevent
      :rules="rules"
      label-width="180px"
      :disabled="comDisFrom"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.type')}`"
            prop="contractType"
            :class="[isModified('contractType')]"
          >
            <el-select
              v-model="createForm.contractType"
              placeholder
              @change="contractTypeChg"
              style="width: 100%"
              :disabled="isRevise"
            >
              <el-option
                v-for="item in dict.type.p_purchase_contract_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('ui.status')}`" prop="purchaseContractStatus">
            <el-input
              :value="
                selectDictLabel(
                  dict.type.p_purchase_contract_status,
                  createForm.purchaseContractStatus
                )
              "
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PURCHASE.purchaseContractNo')}`" prop="purchaseContractNo">
            <el-input
              v-model="createForm.purchaseContractNo"
              :title="createForm.purchaseContractNo"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.supplier')}`"
            prop="businessPartnerName"
            :class="[isModified('businessPartnerName')]"
          >
            <SelectInput
              clearable
              :value="createForm.businessPartnerName"
              :title="createForm.businessPartnerName"
              @click="openTable"
              @clear="supplierClear"
              :disabled="comDisFrom || isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.contactPerson')}`"
            prop="contactPersonId"
            :class="[isModified('contactPersonName')]"
          >
            <el-select
              v-model="createForm.contactPersonId"
              placeholder
              @change="rowContactPersonChange"
              style="width: 100%"
              :disabled="!createForm.businessPartnerId"
            >
              <el-option
                v-for="item in bpBusinessContactPersonList"
                :key="item.contactPersonId"
                :label="item.contactPersonName"
                :value="item.contactPersonId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.email')}`"
            prop="contactPersonEmail"
            :class="[isModified('contactPersonEmail')]"
          >
            <el-input
              v-model="createForm.contactPersonEmail"
              :title="createForm.contactPersonEmail"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
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
          <el-form-item
            :label="`${$t('PURCHASE.ourRef')}`"
            prop="ourRef"
            :class="[isModified('ourRef')]"
          >
            <el-input v-model="createForm.ourRef" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.yourRef')}`"
            prop="yourRef"
            :class="[isModified('yourRef')]"
          >
            <el-input v-model="createForm.yourRef" maxlength="200" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('menu.currency')}`"
            prop="currency"
            :class="[isModified('currency')]"
          >
            <CommonSelect
              :id="createForm.currencyId"
              :label="createForm.currency"
              idKey="id"
              labelKey="currency"
              filterable
              :options="currencyOptions"
              @change="purchaseCurrencyChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('menu.exchangeRate')}`" prop="exchangeRate">
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              style="width: 100%"
              v-model="createForm.exchangeRate"
              controls-position="right"
              :precision="2"
              :min="0"
              :max="100"
              placeholder="0.00 - 100.00"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.exchangeVolatility')}`"
            prop="exchangeVolatility"
            :class="[isModified('exchangeVolatility')]"
          >
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              style="width: 100%"
              v-model="createForm.exchangeVolatility"
              controls-position="right"
              :precision="2"
              :min="0"
              :max="100"
              placeholder="0.00 - 100.00"
              @change="inputNumberChange('exchangeVolatility')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.incoterm')}`"
            prop="incotermId"
            :class="[isModified('incotermName')]"
          >
            <el-select
              v-model="createForm.incotermId"
              placeholder
              style="width: 100%"
              @change="incotermChange"
            >
              <el-option
                v-for="item in theFormOfTradeList"
                :key="item.incotermId"
                :label="item.incotermName"
                :value="item.incotermId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.isConsignment')}`"
            prop="consignment"
            :class="[isModified('consignment')]"
          >
            <el-switch
              v-model="createForm.consignment"
              active-value="1"
              inactive-value="0"
              class="mr50"
              @change="consignmentChg"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="createForm.consignment * 1 === 1">
          <el-form-item
            :label="`${$t('PURCHASE.warehouseName')}`"
            prop="warehouseName"
            :class="[isModified('warehouseName')]"
          >
            <SelectInput
              clearable
              :value="createForm.warehouseName"
              :title="createForm.warehouseName"
              @click="openWarehouseTable"
              @clear="warehouseClear"
              :disabled="comDisFrom"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="Number(createForm.contractType) === 2">
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.cumulativePricing')}`"
            prop="cumulativePricing"
            :class="[isModified('cumulativePricing')]"
          >
            <el-switch
              v-model="createForm.cumulativePricing"
              active-value="1"
              inactive-value="0"
              class="mr50"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.tieredPricingType')}`"
            prop="tieredPricingType"
            :class="[isModified('tieredPricingType')]"
          >
            <el-select
              v-model="createForm.tieredPricingType"
              placeholder
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in dict.type.tiered_pricing_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item
            :label="`${$t('ui.isActive')}`"
            prop="isActive"
            :class="[isModified('isActive')]"
          >
            <el-switch
              v-model="createForm.isActive"
              active-value="1"
              inactive-value="0"
              class="mr50"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 供应商 -->
    <bpSelect ref="bpSelect" @updatePic="updateSupplier" />
    <!-- 仓库 -->
    <warehouseNameDlg ref="warehouseNameDlg" @updateWarehouse="updateWarehouse" />
  </div>
</template>

<script>
import bpSelect from '@/views/purchaseManagement/purchaseContract/bpSelect'
import warehouseNameDlg from '@/views/purchaseManagement/purchaseContract/warehouseNameDlg.vue'
import { queryIncotermList } from '@/api/purchaseManagement/purchaseContract'
import { queryCurrencyListBySelect } from '@/api/basic/basic'

export default {
  dicts: ['p_purchase_contract_type', 'tiered_pricing_type', 'p_purchase_contract_status'],
  components: { bpSelect, warehouseNameDlg },
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
      createForm: {},
      rules: {
        contractType: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
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
        contactPersonId: [
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
        incotermId: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        tieredPricingType: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        barcodeControl: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      // 联系人
      bpBusinessContactPersonList: [],
      // 贸易形式
      theFormOfTradeList: [],
      // 货币
      currencyOptions: []
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
    init() {
      this.queryIncotermList()
      this.queryCurrencyListBySelect()
      this.reset()
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
    initBpBusinessContactPersonList(data = []) {
      this.bpBusinessContactPersonList = data
    },
    inputNumberChange(code) {
      this.$refs.createForm.validateField(code)
    },
    reset() {
      this.$refs.createForm && this.$refs.createForm.clearValidate()
      // this.resetForm('createForm')
    },
    // 贸易形式
    queryIncotermList() {
      queryIncotermList({}).then((res) => {
        this.theFormOfTradeList = res.data || []
      })
    },
    // 货币
    queryCurrencyListBySelect() {
      queryCurrencyListBySelect().then((res) => {
        const list = res.data || []
        this.currencyOptions = list.map((item) => {
          item.label = `${item.currencyCode} (${item.currencyDesc})`
          return item
        })
      })
    },
    purchaseCurrencyChange(row) {
      this.$set(this.createForm, 'currencyId', row.id)
      this.$set(this.createForm, 'currency', row.currency)
      this.$set(this.createForm, 'currencyCode', row.currencyCode)
      this.$set(this.createForm, 'exchangeRate', 1)
    },
    updateSupplier(row) {
      const {
        businessPartnerId,
        businessPartnerMainId,
        businessPartnerName,
        businessPartnerNo,
        bpBusinessContactPersonList,
        country,
        countryId
      } = row

      this.$set(this.createForm, 'businessPartnerId', businessPartnerId)
      this.$set(this.createForm, 'businessPartnerMainId', businessPartnerMainId)
      this.$set(this.createForm, 'businessPartnerName', businessPartnerName)
      this.$set(this.createForm, 'businessPartnerNo', businessPartnerNo)
      this.$set(this.createForm, 'country', country)
      this.$set(this.createForm, 'countryId', countryId)
      this.bpBusinessContactPersonList = bpBusinessContactPersonList || []
      this.rowContactPersonChange(this.bpBusinessContactPersonList[0].contactPersonId)
      this.$nextTick(() => {
        this.$refs.createForm && this.$refs.createForm.clearValidate('contactPersonNames')
      })
      const account = row.bpBusinessAccountSupplier || {}
      this.$set(this.createForm, 'currencyId', account.currencyId)
      this.$set(this.createForm, 'currency', account.currency)
      this.$set(this.createForm, 'paymentTermId', account.paymentTermId)
      this.$set(this.createForm, 'paymentTermName', account.paymentTermName)
      this.$set(this.createForm, 'paymentMethodIdList', account.paymentMethodIdList || [])
      this.$set(this.createForm, 'paymentMethodNameList', account.paymentMethodNameList || [])
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
      this.$set(this.createForm, 'businessContactPersonId', undefined)
      this.$set(this.createForm, 'contactPersonId', undefined)
      this.$set(this.createForm, 'contactPersonName', undefined)
      this.$set(this.createForm, 'contactPersonEmail', undefined)
      this.$set(this.createForm, 'mobileCode', undefined)
      this.$set(this.createForm, 'mobileNum', undefined)
      this.$set(this.createForm, 'mobilePhone', undefined)
      this.bpBusinessContactPersonList = []

      this.$set(this.createForm, 'currencyId', undefined)
      this.$set(this.createForm, 'currency', undefined)
      this.$set(this.createForm, 'paymentTermId', undefined)
      this.$set(this.createForm, 'paymentTermName', undefined)
      this.$set(this.createForm, 'paymentMethodIdList', [])
      this.$set(this.createForm, 'paymentMethodNameList', [])
    },
    incotermChange(value) {
      // const oldType = this.createForm.incotermAddressType
      const item = this.theFormOfTradeList.find((item) => item.incotermId === value) || {}
      this.$set(this.createForm, 'incotermId', item.incotermId)
      this.$set(this.createForm, 'incotermName', item.incotermName)
      this.$set(this.createForm, 'incotermAddressType', item.incotermAddressType)
      this.$set(this.createForm, 'incotermAbbreviation', item.incotermAbbreviation)
    },
    rowContactPersonChange(value) {
      const row = this.bpBusinessContactPersonList.filter((x) => x.contactPersonId === value)[0]
      const {
        businessContactPersonId,
        contactPersonId,
        contactPersonName,
        email,
        mobileCode,
        mobileNum,
        mobilePhone
      } = row
      this.$set(this.createForm, 'businessContactPersonId', businessContactPersonId)
      this.$set(this.createForm, 'contactPersonId', contactPersonId)
      this.$set(this.createForm, 'contactPersonName', contactPersonName)
      this.$set(this.createForm, 'contactPersonEmail', email)
      this.$set(this.createForm, 'mobileCode', mobileCode)
      this.$set(this.createForm, 'mobileNum', mobileNum)
      this.$set(this.createForm, 'mobilePhone', mobilePhone)
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
    consignmentChg() {
      const vm = this
      const refObj = vm.$refs.createForm
      if (refObj) {
        vm.$nextTick(() => {
          refObj.clearValidate('warehouseName')
        })
      }
    },
    contractTypeChg() {
      this.purchaseContractDetails = []
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
    async basicInfoSubmit() {
      try {
        await this.$refs.createForm.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.createForm)))
        return param
      } catch (err) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
