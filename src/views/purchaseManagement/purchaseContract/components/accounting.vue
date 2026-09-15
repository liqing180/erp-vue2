<template>
  <el-form
    ref="accountingForm"
    :model="accountingForm"
    @submit.native.prevent
    :rules="rules"
    label-width="180px"
    :disabled="comDisFrom"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item
          :label="`${$t('ui.paymentTerm')}`"
          prop="paymentTermName"
          :class="[isModified('paymentTermName')]"
        >
          <!-- <CommonSelect
            :id="accountingForm.paymentTermId"
            :label="accountingForm.paymentTermName"
            idKey="id"
            labelKey="paymentTermName"
            :disabled="comDisFrom"
            :options="purchasePaymentTermOptions"
            @change="paymentTermChange"
          /> -->
          <el-input
            :disabled="comDisFrom"
            v-model="accountingForm.paymentTermName"
            :maxlength="1000"
          ></el-input>
          <!-- <el-select
            v-model="accountingForm.paymentTermId"
            placeholder=""
            style="width: 100%"
            clearable
            @change="paymentTermChange"
          >
            <el-option
              v-for="dict in purchasePaymentTermOptions"
              :key="dict.id"
              :label="dict.paymentTermName"
              :value="dict.id"
            ></el-option>
          </el-select> -->
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          :label="`${$t('ui.paymentMethod')}`"
          prop="paymentMethodIdList"
          :class="[isModified('paymentMethod')]"
        >
          <CommonMultipleSelect
            :disabled="!accountingForm.paymentTermId"
            :ids="accountingForm.paymentMethodIdList"
            :labels="accountingForm.paymentMethodNameList"
            idKey="dictValue"
            labelKey="dictLabel"
            :options="purchasePaymentMethodOptions"
            @change="purchasePaymentMethodChange"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
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
    }
  },
  watch: {
    formData: {
      deep: false,
      immediate: true,
      handler(newValue) {
        this.accountingForm = newValue || {}
      }
    }
  },
  data() {
    return {
      accountingForm: {},
      rules: {
        paymentTermName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        paymentMethodIdList: [
          {
            required: true,
            type: 'array',
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      // 付款条款
      purchasePaymentTermOptions: [],
      // 付款方式
      purchasePaymentMethodOptions: []
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
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
    paymentTermChange(item) {
      // const item =
      //   this.purchasePaymentTermOptions.find(
      //     (item) => item.id === this.accountingForm.paymentTermId
      //   ) || {}
      this.$set(this.accountingForm, 'paymentTermId', item.id)
      this.$set(this.accountingForm, 'paymentTermName', item.paymentTermName)
      const ids = item.paymentMethodIds ? item.paymentMethodIds.split(',') : []
      this.$set(this.accountingForm, 'paymentMethodIdList', ids)
      this.$set(this.accountingForm, 'paymentMethodNameList', item.paymentMethodNameList || [])
    },
    purchasePaymentMethodChange(ids, labels) {
      this.$set(this.accountingForm, 'paymentMethodIdList', ids)
      this.$set(this.accountingForm, 'paymentMethodNameList', labels)
    },
    async accountingSubmit() {
      try {
        await this.$refs.accountingForm.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.accountingForm)))
        return param
      } catch (err) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.accounting'))
        )
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
