<template>
  <div>
    <div class="bill-contact-container">
      <!-- Bill To 卡片 -->
      <div class="info-card">
        <div class="card-header">
          <span class="card-title">{{ $t('SALES.billTo') }}</span>
          <i
            v-if="!comDisFrom"
            :class="billToEdit ? 'el-icon-check' : 'el-icon-edit'"
            class="card-edit"
            @click="billToEdit ? handleSave('billTo') : handleEdit('billTo')"
          />
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.customerName') }}</span>
            <span class="info-value">{{ piBankFrom.businessPartnerName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.customerCode') }}</span>
            <span class="info-value">{{ piBankFrom.businessPartnerNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label"
              ><span class="required">*</span>{{ $t('SALES.billingAddress') }}</span
            >
            <div class="info-value">
              <el-form
                ref="form1"
                :model="piBankFrom"
                class="pi-inline-item"
                @submit.native.prevent
                :inline-message="true"
              >
                <el-form-item
                  prop="billingAddressId"
                  :rules="[
                    {
                      required: true,
                      message: $t('ui.reqMsg'),
                      trigger: ['change']
                    }
                  ]"
                >
                  <ComparisonInput
                    v-if="isModified('billingAddress')"
                    :beforeValue="getBeforeValue('billingAddress')"
                    :afterValue="getAfterValue('billingAddress', piBankFrom.billingAddress)"
                  />
                  <CommonSelect
                    v-else-if="billToEdit && !comDisFrom"
                    :id="piBankFrom.billingAddressId"
                    :label="piBankFrom.billingAddress"
                    idKey="receiveAddressId"
                    labelKey="receiveAddress"
                    filterable
                    :disabled="comDisFrom"
                    :options="piBankFrom.billingAddressList"
                    @change="billingAddressChange"
                  />
                  <span v-else class="info-value">{{ piBankFrom.billingAddress }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.country') }}</span>
            <span class="info-value">{{ piBankFrom.country }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.companyRegistrationNo') }}</span>
            <span class="info-value">{{ piBankFrom.companyRegNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.taxRegistrationNo') }}</span>
            <span class="info-value">{{ piBankFrom.taxpayerIdentificationNo }}</span>
          </div>
        </div>
      </div>

      <!-- Contact Information 卡片 -->
      <div class="info-card">
        <div class="card-header">
          <span class="card-title">{{ $t('SALES.contactInformation') }}</span>
          <i
            v-if="!comDisFrom"
            :class="contactEdit ? 'el-icon-check' : 'el-icon-edit'"
            class="card-edit"
            @click="contactEdit ? handleSave('contact') : handleEdit('contact')"
          />
        </div>
        <div class="card-body">
          <div class="info-row">
            <span class="info-label"
              ><span class="required">*</span>{{ $t('SALES.contactPerson') }}</span
            >
            <div class="info-value">
              <el-form
                ref="form2"
                :model="piBankFrom"
                class="pi-inline-item"
                @submit.native.prevent
                :inline-message="true"
              >
                <el-form-item
                  prop="bpContactPersonId"
                  :rules="[
                    {
                      required: true,
                      message: $t('ui.reqMsg'),
                      trigger: ['change']
                    }
                  ]"
                >
                  <ComparisonInput
                    v-if="isModified('bpContactPersonName')"
                    :beforeValue="getBeforeValue('bpContactPersonName')"
                    :afterValue="
                      getAfterValue('bpContactPersonName', piBankFrom.bpContactPersonName)
                    "
                  />
                  <CommonSelect
                    v-else-if="contactEdit && !comDisFrom"
                    :id="piBankFrom.bpContactPersonId"
                    :label="piBankFrom.bpContactPersonName"
                    idKey="contactPersonId"
                    labelKey="contactPersonName"
                    filterable
                    :disabled="comDisFrom"
                    :options="piBankFrom.contactPersonList || []"
                    @change="contactChange"
                  />
                  <span v-else class="info-value">{{ piBankFrom.bpContactPersonName }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.email') }}</span>
            <span class="info-value">{{ piBankFrom.bpEmail }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.phone') }}</span>
            <span class="info-value">{{ piBankFrom.bpMobilePhone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.attentionTo') }}</span>
            <div class="info-value">
              <ComparisonInput
                v-if="isModified('attentionTo')"
                :beforeValue="getBeforeValue('attentionTo')"
                :afterValue="getAfterValue('attentionTo', piBankFrom.attentionTo)"
              />
              <el-input
                v-else-if="contactEdit && !comDisFrom"
                v-model="piBankFrom.attentionTo"
                :title="piBankFrom.attentionTo"
                :maxlength="100"
              />
              <span v-else>{{ piBankFrom.attentionTo }}</span>
            </div>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('SALES.customerPoNo') }}</span>
            <span class="info-value">{{ piBankFrom.customerPoNo }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bill-contact-container" style="padding-bottom: 20px">
      <!-- Bill To 卡片 -->
      <div class="info-card">
        <div class="card-header">
          <span class="card-title">{{ $t('SALES.bankInfo') }}</span>
        </div>
        <div class="card-body">
          <el-form ref="form3" :model="piBankFrom" label-position="top" @submit.native.prevent>
            <el-row :gutter="120">
              <el-col :span="8">
                <el-form-item
                  :label="`${$t('SALES.accountName')}`"
                  prop="accountName"
                  :rules="[
                    {
                      required: true,
                      message: $t('ui.reqMsg'),
                      trigger: ['change']
                    }
                  ]"
                >
                  <ComparisonInput
                    v-if="isModified('accountName')"
                    :beforeValue="getBeforeValue('accountName')"
                    :afterValue="getAfterValue('accountName', piBankFrom.accountName)"
                  />
                  <CommonSelect
                    v-else
                    :id="piBankFrom.accountId"
                    :label="piBankFrom.accountName"
                    idKey="id"
                    labelKey="accountName"
                    filterable
                    :disabled="comDisFrom"
                    :options="piBankFrom.bankInfoList || []"
                    @change="accountNameChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.beneficiaryName')}`">
                  <el-input
                    :value="piBankFromData.beneficiaryName"
                    :title="piBankFromData.beneficiaryName"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.bankName')}`">
                  <el-input
                    :value="piBankFromData.bankName"
                    :title="piBankFromData.bankName"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="120">
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.bankAccountNumber')}`">
                  <el-input
                    :value="piBankFromData.bankAccountNumber"
                    :title="piBankFromData.bankAccountNumber"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.bankCode')}`">
                  <el-input
                    :value="piBankFromData.bankCode"
                    :title="piBankFromData.bankCode"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.branchCode')}`">
                  <el-input
                    :value="piBankFromData.branchCode"
                    :title="piBankFromData.branchCode"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="120">
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.businessRegNo')}`">
                  <el-input
                    :value="piBankFromData.companyRegNo"
                    :title="piBankFromData.companyRegNo"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.bankCountry')}`">
                  <el-input
                    :value="piBankFromData.bankCountry"
                    :title="piBankFromData.bankCountry"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.bankCurrency')}`">
                  <el-input
                    :value="piBankFromData.accountCurrency"
                    :title="piBankFromData.accountCurrency"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="120">
              <el-col :span="8">
                <el-form-item :label="`${$t('SALES.swiftCode')}`">
                  <el-input
                    :value="piBankFromData.swiftCode"
                    :title="piBankFromData.swiftCode"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :label="`${$t('SALES.bankAddress')}`">
                  <el-input
                    :value="piBankFromData.bankAddress"
                    :title="piBankFromData.bankAddress"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comDisFrom: Boolean,
    modifyHighlight: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    piBankFromData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    piEmailFromData: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    }
  },
  watch: {
    piBankFromData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.piBankFrom = newValue || {}
      }
    },
    piEmailFromData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.piEmailFrom = newValue || {}
      }
    }
  },
  data() {
    return {
      piEmailFrom: {},
      // 只读展示数据
      piBankFrom: {},
      contact: {
        contactPerson: 'Mr David Tan',
        email: 'David.tan@abc.com.sg',
        phone: '+65 88587088',
        attentionTo: 'Accounts Depar Iment',
        customerPoNo: 'PO2026080001'
      },
      // 编辑态开关
      billToEdit: false,
      contactEdit: false,
      // 客户地址主数据（mock）
      addressList: [
        { billingAddressId: 1, billingAddress: '25 Pioneer Road North04-12 Singapore 628556' },
        { billingAddressId: 2, billingAddress: '10 Jurong Port Road Singapore 619081' },
        { billingAddressId: 3, billingAddress: '88 Marina Boulevard #20-01 Singapore 018986' },
        { billingAddressId: 4, billingAddress: '5 Changi Business Park Central 1 Singapore 486038' }
      ],
      // 客户联系人主数据（mock）
      contactList: [
        {
          contactId: 1,
          contactPerson: 'Mr David Tan',
          email: 'David.tan@abc.com.sg',
          phone: '+65 88587088'
        },
        {
          contactId: 2,
          contactPerson: 'Ms Sarah Lee',
          email: 'Sarah.lee@abc.com.sg',
          phone: '+65 91234567'
        },
        {
          contactId: 3,
          contactPerson: 'Mr John Wong',
          email: 'John.wong@abc.com.sg',
          phone: '+65 87654321'
        },
        {
          contactId: 4,
          contactPerson: 'Ms Emily Chen',
          email: 'Emily.chen@abc.com.sg',
          phone: '+65 99887766'
        }
      ]
    }
  },
  computed: {
    basicUpdateMsgList() {
      return this.piBankFrom.updateMsgList || []
    }
  },
  methods: {
    isModified(prop) {
      return this.modifyHighlight && this.basicUpdateMsgList.some((item) => item.name === prop)
    },
    getBeforeValue(prop) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop) || {}
      return item.beforeValue
    },
    getAfterValue(prop, fallback) {
      const item = this.basicUpdateMsgList.find((row) => row.name === prop)
      return item && item.afterValue !== undefined ? item.afterValue : fallback
    },
    handleEdit(type) {
      if (type === 'billTo') {
        this.billToEdit = true
      } else {
        this.contactEdit = true
      }
    },
    handleSave(type) {
      if (type === 'billTo') {
        this.billToEdit = false
      } else {
        this.contactEdit = false
      }
    },
    billingAddressChange(row) {
      this.$set(this.piBankFrom, 'billingAddressId', row.receiveAddressId)
      this.$set(this.piBankFrom, 'billingAddress', row.receiveAddress)
    },
    contactChange(row) {
      this.$set(this.piBankFrom, 'bpBusinessContactPersonId', row.businessContactPersonId)
      this.$set(this.piBankFrom, 'bpContactPersonId', row.contactPersonId)
      this.$set(this.piBankFrom, 'bpContactPersonName', row.contactPersonName)
      this.$set(this.piBankFrom, 'bpMobileNum', row.mobileNum)
      this.$set(this.piBankFrom, 'bpMobileCode', row.mobileCode)
      this.$set(this.piBankFrom, 'bpMobilePhone', row.mobilePhone)
      this.$set(this.piBankFrom, 'bpEmail', row.email)

      const emailOptions = this.piEmailFrom.emailOptions || {}
      const recipientSourceList = emailOptions.recipientSourceList || []
      const findItem = recipientSourceList.find((x) => x.dictValue === 'BILLING_CONTACT') || {}
      const list = findItem.toRecipientList || []

      const emailItem = {
        displayName: row.contactPersonName,
        email: row.email,
        sourceId: row.contactPersonId,
        sourceType: 'BILLING_CONTACT'
      }
      list.length = 0
      list.push(emailItem)
      if (this.piEmailFrom.recipientSource === 'BILLING_CONTACT') {
        this.$set(this.piEmailFrom, 'toRecipientList', [emailItem])
      }
    },
    accountNameChange(row) {
      this.$set(this.piBankFrom, 'accountId', row.id)
      this.$set(this.piBankFrom, 'accountName', row.accountName)
      this.$set(this.piBankFrom, 'beneficiaryName', row.beneficiaryName)
      this.$set(this.piBankFrom, 'bankName', row.bankName)
      this.$set(this.piBankFrom, 'bankAccountNumber', row.bankAccountNumber)
      this.$set(this.piBankFrom, 'bankCode', row.bankCode)
      this.$set(this.piBankFrom, 'branchCode', row.branchCode)
      this.$set(this.piBankFrom, 'bankCountryCode', row.bankCountryCode)
      this.$set(this.piBankFrom, 'bankCountry', row.bankCountry)
      this.$set(this.piBankFrom, 'accountCurrencyCode', row.accountCurrencyCode)
      this.$set(this.piBankFrom, 'accountCurrency', row.accountCurrency)
      this.$set(this.piBankFrom, 'swiftCode', row.swiftCode)
      this.$set(this.piBankFrom, 'bankAddress', row.bankAddress)
    },
    validForm() {
      if (!this.piBankFrom.billingAddressId) {
        this.billToEdit = true
      }
      if (!this.piBankFrom.bpContactPersonId) {
        this.contactEdit = true
      }
      this.$refs.form1.validate()
      this.$refs.form2.validate()
      this.$refs.form3.validate()
    }
  }
}
</script>

<style lang="scss" scoped>
.pi-inline-item {
  width: 100%;
  min-width: 0;

  &::v-deep .el-form-item {
    width: 100%;
    min-width: 0;
    margin-bottom: 0px !important;
  }
  &::v-deep .el-form-item__content {
    width: 100%;
    min-width: 0;
  }
  &::v-deep .comparison-box {
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  &::v-deep .comparison-box .old-value,
  &::v-deep .comparison-box .new-value {
    min-width: 0;
  }
}
.bill-contact-container {
  display: flex;
  gap: 24px;
  padding: 20px 20px 0;
  background: #fff;
}
.info-card {
  flex: 1;
  min-width: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  padding-left: 16px;
  border-bottom: 1px solid #ebeef5;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #555;
}
.card-edit {
  font-size: 18px;
  color: #409eff;
  cursor: pointer;
  transition: color 0.2s;
  margin-right: 10px;
}
.card-edit:hover {
  color: #66b1ff;
}
.card-body {
  padding: 8px 16px 16px;
}
.info-row {
  display: flex;
  min-width: 0;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}
/* .info-row:last-child {
  border-bottom: none;
} */
.info-label {
  width: 210px;
  flex-shrink: 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
  padding-top: 3px;
}
.info-value {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: #303133;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}
.required {
  color: #f56c6c;
  margin-right: 4px;
  font-weight: 600;
}
</style>
