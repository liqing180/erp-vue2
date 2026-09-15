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
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.vehicleNo')}`" prop="licensePlateNo">
                    <el-input
                      v-model="form.licensePlateNo"
                      :title="form.licensePlateNo"
                      maxlength="50"
                      :disabled="!!rowId"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="false">
                  <el-form-item :label="`${$t('system.vehicleModel')}`" prop="vehicleModelId">
                    <el-select
                      v-model="form.vehicleModelId"
                      class="form-wd"
                      placeholder=""
                      style="width: 100%"
                      :disabled="!!rowId"
                    >
                      <el-option
                        v-for="item in vehicleModelList"
                        :key="item.vehicleModelId"
                        :label="item.vehicleModelName"
                        :value="item.vehicleModelId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.vehicleModelName')}`" prop="vehicleModelName">
                    <el-input
                      v-model="form.vehicleModelName"
                      :title="form.vehicleModelName"
                      maxlength="200"
                      class="form-wd"
                    />
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
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
                    <myUpload ref="uploadRef" :disabled="false" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`" prop="isActive">
                    <el-switch v-model="form.isActive" active-value="1" inactive-value="0" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('system.expandInfo')"
              :warning="collapseWarningForExpandInfo"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="form1"
              :model="form"
              :rules="rules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.vin')}`" prop="vin">
                    <el-input v-model="form.vin" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.engineSn')}`" prop="engineSn">
                    <el-input v-model="form.engineSn" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.makeModel')}`" prop="makeModel">
                    <el-input v-model="form.makeModel" maxlength="50" class="form-wd" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.emissionStandard')}`" prop="emissionStandard">
                    <el-input v-model="form.emissionStandard" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('system.licenceRegistration')}`"
                    prop="licenceRegistration"
                  >
                    <el-date-picker
                      v-model="form.licenceRegistration"
                      :picker-options="nowDaysBeforePickerOptions"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.licenceExpiry')}`" prop="licenceExpiry">
                    <el-date-picker
                      v-model="form.licenceExpiry"
                      :picker-options="nowDaysAfterPickerOptions"
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
                  <el-form-item :label="`${$t('system.operatingPermit')}`" prop="operatingPermit">
                    <el-input v-model="form.operatingPermit" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('system.operatingLicenceValidity')}`"
                    prop="operatingLicenceValidity"
                  >
                    <el-date-picker
                      v-model="form.operatingLicenceValidity"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="false">
                  <el-form-item :label="`${$t('system.mandatoryScrap')}`" prop="mandatoryScrap">
                    <el-date-picker
                      v-model="form.mandatoryScrap"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('system.admissionValidity')}`"
                    prop="admissionValidity"
                  >
                    <el-date-picker
                      v-model="form.admissionValidity"
                      type="daterange"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      unlink-panels
                      range-separator="-"
                      :start-placeholder="`${$t('ui.startDate')}`"
                      :end-placeholder="`${$t('ui.endDate')}`"
                      :default-time="['00:00:00', '23:59:59']"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('system.inspectionValidity')}`"
                    prop="inspectionValidity"
                  >
                    <el-date-picker
                      v-model="form.inspectionValidity"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.purchaseDate')}`" prop="purchaseDate">
                    <el-date-picker
                      v-model="form.purchaseDate"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.purchasePrice')}`" prop="purchasePrice">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.purchasePrice"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('purchasePrice', 'form1')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.fuelConsumption')}`" prop="fuelConsumption">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.fuelConsumption"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('fuelConsumption', 'form1')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.monthlyFare')}`" prop="monthlyFare">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.monthlyFare"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('monthlyFare', 'form1')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.color')}`" prop="color">
                    <el-input v-model="form.color" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.weight')}`" prop="weight">
                    <el-input-number
                      style="width: 100%"
                      v-model="form.weight"
                      controls-position="right"
                      :precision="2"
                      v-thousandSplit="{ precision: 2 }"
                      :min="0"
                      :max="999999999.99"
                      @change="inputNumberChange('weight', 'form1')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.airbag')}`" prop="airbag">
                    <el-switch v-model="form.airbag" active-value="1" inactive-value="0" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10">
          <el-collapse-item name="3">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('system.insuranceInfo')"
              :warning="collapseWarningForInsuranceInfo"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="form2"
              :model="form"
              :rules="rules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.insuranceCompany')}`" prop="insuranceCompany">
                    <el-input v-model="form.insuranceCompany" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.policyNo')}`" prop="policyNo">
                    <el-input v-model="form.policyNo" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.coverType')}`" prop="coverType">
                    <el-input v-model="form.coverType" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.primaryDrive')}`" prop="primaryDrive">
                    <el-input v-model="form.primaryDrive" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.policyStartDate')}`" prop="policyStartDate">
                    <el-date-picker
                      v-model="form.policyStartDate"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                      @change="policyStartDateChange"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.policyEndDate')}`" prop="policyEndDate">
                    <el-date-picker
                      v-model="form.policyEndDate"
                      :picker-options="policyEndDatePickerOptions"
                      :format="fmtForYmd"
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                      placeholder=""
                      clearable
                      :disabled="!form.policyStartDate"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.namedDriver1')}`" prop="namedDriverOne">
                    <el-input v-model="form.namedDriverOne" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.excessSection1')}`" prop="excessSectionOne">
                    <el-input v-model="form.excessSectionOne" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.excessSection2')}`" prop="excessSectionTwo">
                    <el-input v-model="form.excessSectionTwo" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.windscreenExcess')}`" prop="windscreenExcess">
                    <el-input v-model="form.windscreenExcess" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.additionalExcess')}`" prop="additionalExcess">
                    <el-input v-model="form.additionalExcess" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="`${$t('system.unnamedDriverExcess')}`"
                    prop="unnamedDriverExcess"
                  >
                    <el-input v-model="form.unnamedDriverExcess" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.NCDEntitlement')}`" prop="ncdEntitlement">
                    <el-input v-model="form.ncdEntitlement" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.NCDProtectionNCD')}`" prop="ncdProtectionNcd">
                    <el-input v-model="form.ncdProtectionNcd" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('system.loyaltyDiscount')}`" prop="loyaltyDiscount">
                    <el-input v-model="form.loyaltyDiscount" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>

        <div class="form-card mt10" v-if="!!rowId">
          <el-collapse-item name="4">
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
  queryVehicleById,
  saveVehicle,
  updateVehicle,
  queryCanSelectVehicleModelList
} from '@/api/system/vehicleManagement'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  components: {
    SystemOperationLogTable
  },
  mixins: [pageMixin],
  dicts: [],
  data() {
    const vm = this
    return {
      fullscreenLoading: false,
      activeNames: ['1', '2', '3', '4'],
      form: {},
      nowDaysBeforePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      nowDaysAfterPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      },
      policyEndDatePickerOptions: {},
      rules: {
        licensePlateNo: [
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
        vehicleModelId: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        vehicleModelName: [
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
      collapseWarningForExpandInfo: false,
      collapseWarningForInsuranceInfo: false,
      contentForm: {},
      options: [],
      isContentEdit: false,
      taxDetails: [],
      editIndex: undefined,
      timeId: undefined,
      rowId: undefined,
      vehicleModelList: []
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
      return this.checkPermi(['system:vehicleManagement:edit'])
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
    this.queryCanSelectVehicleModelList()
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
      this.queryCanSelectVehicleModelList()
      if (this.rowId) {
        this.handleUpdate()
      }
    }
  },
  methods: {
    policyStartDateChange() {
      const { policyStartDate, policyEndDate } = this.form
      this.policyEndDatePickerOptions = {
        disabledDate(time) {
          if (policyStartDate) {
            return time.getTime() < policyStartDate + 1 * 24 * 60 * 60 * 1000
          }
          return false
        }
      }
      if (policyEndDate && policyEndDate <= policyStartDate) {
        this.$set(this.form, 'policyEndDate', undefined)
      }
    },
    queryCanSelectVehicleModelList() {
      queryCanSelectVehicleModelList({}).then((res) => {
        this.vehicleModelList = res.data || []
      })
    },
    handleUpdate() {
      this.reset()
      queryVehicleById({ vehicleId: this.rowId }).then((res) => {
        this.form = res.data || {}
        const { admissionValidityEnd, admissionValidityStart, commonFileList } = res.data
        if (admissionValidityStart && admissionValidityEnd) {
          this.$set(this.form, 'admissionValidity', [admissionValidityStart, admissionValidityEnd])
        }
        this.$nextTick(() => {
          this.$refs.uploadRef.initFileList(commonFileList || [])
        })
      })
    },
    reset() {
      const vm = this
      vm.form = {
        vin: undefined,
        engineSn: undefined,
        makeModel: undefined,
        emissionStandard: undefined,
        licenceRegistration: undefined,
        licenceExpiry: undefined,
        operatingPermit: undefined,
        operatingLicenceValidity: undefined,
        mandatoryScrap: undefined,
        admissionValidity: [],
        inspectionValidity: undefined,
        purchasePrice: undefined,
        purchaseDate: undefined,
        fuelConsumption: undefined,
        monthlyFare: undefined,
        color: undefined,
        weight: undefined,
        airbag: '1',
        isActive: '1',
        insuredPerson: undefined,
        compulsoryInsurance: undefined,
        dateOfExpiryCompulsory: undefined,
        thirdPartLiability: undefined,
        dateOfExpiryThird: undefined,
        otherInsurance: undefined,
        remarks: undefined,
        vehicleModelName: undefined
      }
      this.vehicleModelList = []
      this.collapseWarningForBasicInfo = false
      this.collapseWarningForExpandInfo = false
      this.collapseWarningForInsuranceInfo = false
      this.$refs.uploadRef && this.$refs.uploadRef.initFileList([])
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
      // this.collapseWarningForExpandInfo = false
      // this.collapseWarningForInsuranceInfo = false
      const fileIds = this.$refs.uploadRef.getFileIds()
      if (fileIds === false) {
        return
      }
      let param = JSON.parse(JSON.stringify(vm.form))
      param = vm.$trimOfObj(param)
      param.commonFileList = fileIds
      if (param.admissionValidity && param.admissionValidity.length >= 2) {
        param.admissionValidityStart = param.admissionValidity[0]
        param.admissionValidityEnd = param.admissionValidity[1]
      }

      this.$modal
        .confirm(this.$t('system.vehicleConfirm'))
        .then(() => {
          if (this.rowId) {
            return updateVehicle(param)
          } else {
            return saveVehicle(param)
          }
        })
        .then(() => {
          this.$modal.msgSuccess(
            this.$t('system.vehicleSuccess').replace('$1', param.licensePlateNo)
          )
          this.cancel()
        })
        .catch(() => {})
    },
    cancel() {
      if (this.$route.query.backType === '2') {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/system/vehicleManagement')
    }
  }
}
</script>
