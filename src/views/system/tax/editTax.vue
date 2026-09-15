<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" :disabled="fullscreenLoading" @click="submitForm"
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
                  <el-form-item
                    :label="`${$t('taxCode.countriesAndRegionsName')}`"
                    prop="country"
                    style="white-space: nowrap"
                  >
                    <countrySelect
                      disabled
                      v-model="createForm.country"
                      :title="createForm.country"
                      class="form-wd"
                      @select="handleCountrySelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('taxCode.taxRate')}`" prop="taxRate">
                    <el-input-number
                      style="width: 100%"
                      v-model="createForm.taxRate"
                      controls-position="right"
                      :precision="1"
                      v-thousandSplit="{ precision: 1 }"
                      :min="0"
                      :max="100"
                      @change="inputNumberChange('taxRate', 'createForm')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('taxCode.taxNo')}`" prop="taxNo">
                    <el-input
                      v-model="createForm.taxNo"
                      :title="createForm.taxNo"
                      disabled
                      maxlength="50"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('taxCode.description')}`" prop="description">
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
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.type')}`" prop="taxType">
                    <el-select
                      v-model="createForm.taxType"
                      :disabled="comDisFrom"
                      placeholder=""
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="dict in dict.type.tax_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isDefault')}`">
                    <el-switch
                      v-model="createForm.isDefault"
                      active-value="1"
                      inactive-value="0"
                      @change="handleIsDefault"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`" prop="isActive">
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
              <SystemOperationLogTable :tableList="createForm.operationLogList || []" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import pageMixin from '@/mixins/tableMinx'
import locale from '@/views/system/lang/index'
import countrySelect from '@/components/select/countrySelect'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'
import { queryTaxCodeById, updateTaxCode, queryDefaultTaxCodeByCountryId } from '@/api/system/tax'

export default {
  name: 'EditTax',
  components: {
    countrySelect,
    SystemOperationLogTable
  },
  mixins: [pageMixin],
  dicts: ['system_active', 'tax_type', 'tax_code_rounding_rules'],
  data() {
    const vm = this
    return {
      fullscreenLoading: false,
      activeNames: ['1', '2'],
      timeId: '',
      id: '',
      createForm: {},
      createRules: {
        country: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        taxRate: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        description: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        taxType: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ]
      },
      countryIdIsDefaultTax: {},
      collapseWarningForBasicInfo: false
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
    editAuth() {
      return this.checkPermi(['system:tax:edit'])
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.reset()
    this.timeId = this.$route.query.timeId
    this.id = this.$route.query.id
    this.queryTaxCodeById()
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.id = this.$route.query.id
      this.reset()
      this.queryTaxCodeById()
    }
  },
  methods: {
    reset() {
      const vm = this
      vm.createForm = {
        country: undefined,
        isActive: '1',
        taxRate: undefined
      }
      vm.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2']
      this.resetForm('createForm')
    },
    inputNumberChange(code, form) {
      this.$refs[form].validateField(code)
    },
    handleCountrySelect(row) {
      if (!row) return
      const { id, name, currencyCode } = row
      this.createForm.country = name
      this.createForm.countryId = id
      this.createForm.countryCode = currencyCode
    },

    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex
    },
    handleIsDefault(value) {
      if (value === '1') {
        this.$set(this.createForm, 'isActive', '1')
      }
    },

    queryTaxCodeById() {
      queryTaxCodeById(this.id).then((res) => {
        this.createForm = res.data || {}
        // this.queryDefaultTaxCodeByCountryId()
      })
    },

    queryDefaultTaxCodeByCountryId() {
      const countryId = this.createForm.countryId
      queryDefaultTaxCodeByCountryId(countryId).then((res) => {
        const data = res.data || {}
        if (data.taxId && data.taxId !== this.createForm.taxId) {
          this.$set(this.countryIdIsDefaultTax, countryId, true)
          this.$set(this.createForm, 'isDefault', '0')
        } else {
          this.$set(this.countryIdIsDefaultTax, countryId, false)
        }
      })
    },

    updateTaxCode(param) {
      const vm = this
      vm.fullscreenLoading = true
      updateTaxCode(param)
        .then((res) => {
          vm.$message.success(`${vm.$t('taxCode.saveSuccess')}`)
          this.cancel()
          vm.fullscreenLoading = false
        })
        .catch((err) => {
          vm.fullscreenLoading = false
          window.console.error(err)
        })
    },

    submitForm() {
      const vm = this
      let createValid = false
      vm.$refs.createForm.validate((valid) => {
        createValid = valid
      })
      this.collapseWarningForBasicInfo = !createValid
      if (!createValid) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }

      const content = vm.$t('taxCode.saveConfirm')
      this.$modal.confirm(content).then(() => {
        let param = JSON.parse(JSON.stringify(vm.createForm))
        param = vm.$trimOfObj(param)
        vm.updateTaxCode(param)
      })
    },
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/system/tax')
    }
  }
}
</script>
