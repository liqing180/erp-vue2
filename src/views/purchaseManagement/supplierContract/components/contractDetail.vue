<template>
  <div>
    <el-form
      ref="contractDetailForm"
      :model="contractDetailForm"
      :rules="contractDetailRules"
      label-width="195px"
      @submit.native.prevent
      :disabled="comDisFrom"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.documentContractNo')}`"
            prop="documentContractNo"
            :class="[isModified('documentContractNo')]"
          >
            <el-input
              v-model="contractDetailForm.documentContractNo"
              type="text"
              :maxlength="50"
              class="form-wd"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.signedBy')}`"
            prop="signedBy"
            :class="[isModified('signedBy')]"
          >
            <el-input
              v-model="contractDetailForm.signedBy"
              type="text"
              :maxlength="50"
              class="form-wd"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.rebate')}`"
            prop="rebate"
            :class="[isModified('rebate')]"
          >
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="contractDetailForm.rebate"
              :precision="2"
              type="number"
              class="form-wd"
              :min="0"
              :max="100"
              placeholder="0.00-100.00"
              @change="inputNumberChange('rebate')"
              style="width: 100%"
              controls-position="right"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.startDate')}`"
            prop="startDate"
            :class="[isModified('startDate')]"
          >
            <el-date-picker
              v-model="contractDetailForm.startDate"
              :editable="false"
              type="date"
              :format="fmtForYmd"
              :picker-options="startDatePickerOptions"
              class="form-wd"
              value-format="timestamp"
              placeholder
              @change="handleStartDateChange"
              style="width: 100%"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('ui.endDate')}`"
            prop="endDate"
            :class="[isModified('endDate')]"
          >
            <el-date-picker
              v-model="contractDetailForm.endDate"
              :editable="false"
              type="date"
              :format="fmtForYmd"
              :picker-options="endDatePickerOptions"
              class="form-wd"
              value-format="timestamp"
              placeholder
              @change="handleEndDateChange"
              style="width: 100%"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.contractDate')}`"
            prop="contractDate"
            :class="[isModified('contractDate')]"
          >
            <el-date-picker
              v-model="contractDetailForm.contractDate"
              :editable="false"
              type="date"
              :format="fmtForYmd"
              :picker-options="contractDateOption"
              class="form-wd"
              value-format="timestamp"
              placeholder
              style="width: 100%"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.minContractValue')}`"
            prop="minContractValue"
            :class="[isModified('minContractValue')]"
          >
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="contractDetailForm.minContractValue"
              class="form-wd"
              :precision="2"
              type="number"
              :min="0"
              :max="contractDetailForm.maxContractValue || 999999999999.99"
              clearable
              @change="inputNumberChange('minContractValue')"
              style="width: 100%"
              controls-position="right"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.maxContractValue')}`"
            prop="maxContractValue"
            :class="[isModified('maxContractValue')]"
          >
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="contractDetailForm.maxContractValue"
              :precision="2"
              class="form-wd"
              type="number"
              :min="contractDetailForm.minContractValue || 0"
              :max="999999999999.99"
              clearable
              @change="inputNumberChange('maxContractValue')"
              style="width: 100%"
              controls-position="right"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.period')}`"
            prop="period"
            :class="[isModified('period')]"
          >
            <el-select
              v-model="contractDetailForm.period"
              class="form-wd"
              placeholder
              clearable
              style="width: 100%"
              :disabled="isRevise"
            >
              <el-option
                v-for="item in dict.type.sales_period"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item
            :label="`${$t('PURCHASE.amount')}`"
            prop="amount"
            :class="[isModified('amount')]"
          >
            <el-input-number
              v-thousandSplit="{ precision: 2 }"
              v-model="contractDetailForm.amount"
              :precision="2"
              type="number"
              class="form-wd textleft"
              :min="0.01"
              :max="999999999999.99"
              @change="inputNumberChange('amount')"
              style="width: 100%"
              controls-position="right"
              :disabled="isRevise"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            :label="`${$t('PURCHASE.termsAndConditions')}`"
            prop="termsAndConditions"
            :class="[isModified('termsAndConditions')]"
          >
            <MyInput
              type="textarea"
              v-model="contractDetailForm.termsAndConditions"
              :autosize="{ minRows: 2, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="3000"
            ></MyInput>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            :label="`${$t('ui.attachment')}`"
            prop="fileIds"
            :class="[isModified('attachment')]"
          >
            <myUpload ref="uploadRef" :disabled="comDisFrom" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  dicts: ['sales_period'],
  components: {},
  data() {
    const vm = this
    return {
      // 合同详情
      contractDetailForm: {},
      // 合同详情验证
      contractDetailRules: {
        documentContractNo: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        signedBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        startDate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        endDate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        contractDate: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        amount: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      startDatePickerOptions: {
        disabledDate(time) {
          const { endDate } = vm.contractDetailForm
          if (!endDate) {
            return false
          }
          return time.getTime() >= endDate
        }
      },

      endDatePickerOptions: {
        disabledDate(time) {
          const { startDate } = vm.contractDetailForm
          if (!startDate) {
            return false
          } else {
            return time.getTime() <= startDate
          }
        }
      },

      contractDateOption: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      }
    }
  },
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
        this.contractDetailForm = newValue || {}
      }
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
    initFileList(commonFileList) {
      this.$refs.uploadRef.initFileList(commonFileList || [])
    },
    reset() {
      this.$refs.contractDetailForm && this.$refs.contractDetailForm.clearValidate()
    },
    inputNumberChange(code) {
      this.$refs.contractDetailForm.validateField(code)
    },
    handleStartDateChange() {
      const vm = this
      vm.endDatePickerOptions = {
        disabledDate(time) {
          const { startDate } = vm.contractDetailForm
          if (!startDate) {
            return false
          } else {
            return time.getTime() <= startDate
          }
        }
      }
    },
    handleEndDateChange() {
      const vm = this
      vm.startDatePickerOptions = {
        disabledDate(time) {
          const { endDate } = vm.contractDetailForm
          if (!endDate) {
            return false
          }
          return time.getTime() >= endDate
        }
      }
    },
    async contractDetailSubmit() {
      try {
        const myFileIds = this.$refs.uploadRef.getFileIds()
        console.log(myFileIds, '==')
        if (myFileIds === false) {
          return false
        }
        await this.$refs.contractDetailForm.validate()
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.contractDetailForm)))
        param.commonFileList = myFileIds
        return param
      } catch (err) {
        this.$modal.msgError(
          this.$t('ui.fromIncomplete').replace('$1', this.$t('PURCHASE.contractDetail'))
        )
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
