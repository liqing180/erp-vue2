<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button
        type="primary"
        size="mini"
        :disabled="fullscreenLoading"
        v-if="!comDisFrom"
        @click="submitForm"
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
              ref="form"
              :model="form"
              :rules="rules"
              label-width="210px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.vehicleModelName')}`" prop="vehicleModelName">
                    <el-input
                      v-model="form.vehicleModelName"
                      maxlength="50"
                      :disabled="!!rowId"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.grossWeight')}`" prop="grossWeight">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.grossWeight"
                      controls-position="right"
                      :precision="3"
                      v-thousandSplit="{ precision: 3 }"
                      :min="0"
                      :max="999999999.999"
                      @change="inputNumberChange('grossWeight', 'form')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.vehicleModelCode')}`" prop="vehicleModelCode">
                    <el-input
                      v-model="form.vehicleModelCode"
                      disabled
                      maxlength="50"
                      class="form-wd"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.payloadVolume')}`" prop="payloadVolume">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.payloadVolume"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('payloadVolume', 'form')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.externalVolume')}`" prop="externalVolume">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.externalVolume"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('externalVolume', 'form')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('system.fuelConsumptionPer')}`"
                    prop="fuelConsumptionPer"
                  >
                    <el-input-number
                      style="width: 100%"
                      v-model="form.fuelConsumptionPer"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('fuelConsumptionPer', 'form')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.payloadHeight')}`" prop="payloadHeight">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.payloadHeight"
                      controls-position="right"
                      :precision="3"
                      v-thousandSplit="{ precision: 3 }"
                      :min="0"
                      :max="999999999.999"
                      @change="inputNumberChange('payloadHeight', 'form')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.payloadLength')}`" prop="payloadLength">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.payloadLength"
                      controls-position="right"
                      :precision="3"
                      v-thousandSplit="{ precision: 3 }"
                      :min="0"
                      :max="999999999.999"
                      @change="inputNumberChange('payloadLength', 'form')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.payloadWidth')}`" prop="payloadWidth">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.payloadWidth"
                      controls-position="right"
                      :precision="3"
                      v-thousandSplit="{ precision: 3 }"
                      :min="0"
                      :max="999999999.999"
                      @change="inputNumberChange('payloadWidth', 'form')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.powerType')}`" prop="powerType">
                    <el-select
                      v-model="form.powerType"
                      class="form-wd"
                      placeholder=""
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.type.sys_power_type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
                    <MyInput
                      type="textarea"
                      v-model="form.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="!!rowId">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="form.operationLogForLast">
                <span
                  v-if="form.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="form.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ form.operationLogForLast.operatorBy }}
                </span>
                <span v-if="form.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(form.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="form.operationLogList || []" />
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
import {
  queryVehicleModelById,
  saveVehicleModel,
  updateVehicleModel
} from '@/api/system/vehicleModelManagement'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  components: {
    SystemOperationLogTable
  },
  mixins: [pageMixin],
  name: 'VehicleModelFormPage',
  dicts: ['sys_power_type'],
  data() {
    const vm = this
    return {
      fullscreenLoading: false,
      activeNames: ['1', '2'],
      form: {},
      rules: {
        vehicleModelName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        grossWeight: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        payloadVolume: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        powerType: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      collapseWarningForBasicInfo: false,
      contentForm: {},
      options: [],
      isContentEdit: false,
      taxDetails: [],
      editIndex: undefined,
      timeId: undefined,
      rowId: undefined
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:vehicleModelManagement:edit'])
    },
    comDisFrom() {
      if (!this.editAuth && !!this.rowId) {
        return true
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    this.reset()
    if (this.rowId) {
      this.handleUpdate()
    }
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      this.reset()
      if (this.rowId) {
        this.handleUpdate()
      }
    }
  },
  methods: {
    handleUpdate() {
      this.reset()
      queryVehicleModelById({ vehicleModelId: this.rowId }).then((res) => {
        this.form = res.data || {}
      })
    },
    reset() {
      const vm = this
      vm.form = {
        vehicleModelName: undefined,
        powerType: undefined,
        grossWeight: undefined,
        vehicleModelCode: undefined,
        payloadVolume: undefined,
        externalVolume: undefined,
        fuelConsumptionPer: undefined,
        payloadHeight: undefined,
        payloadLength: undefined,
        payloadWidth: undefined,
        remarks: undefined
      }

      this.collapseWarningForBasicInfo = false
      this.resetForm('form')
    },
    inputNumberChange(code, form) {
      this.$refs[form].validateField(code)
    },
    submitForm() {
      const vm = this
      let createValid = false
      vm.$refs.form.validate((valid) => {
        createValid = valid
      })
      this.collapseWarningForBasicInfo = !createValid
      if (!createValid) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      let param = JSON.parse(JSON.stringify(vm.form))
      param = vm.$trimOfObj(param)
      this.$modal
        .confirm(this.$t('system.vehicleModelConfirm'))
        .then(() => {
          if (this.rowId) {
            return updateVehicleModel(param)
          } else {
            return saveVehicleModel(param)
          }
        })
        .then(() => {
          this.$modal.msgSuccess(
            this.$t('system.vehicleModelSuccess').replace('$1', param.vehicleModelName)
          )
          this.cancel()
        })
        .catch(() => {})
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/system/vehicleModelManagement')
    }
  }
}
</script>
