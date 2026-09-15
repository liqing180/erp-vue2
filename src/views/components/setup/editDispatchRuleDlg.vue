<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :title="title"
    v-dialogDragWidth
    :visible.sync="open"
    width="1320px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="formRef1" class="mr40" :model="form" :rules="rules" label-width="380px">
      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="automaticDispatch"
            :rules="[
              {
                required: form.automaticDispatchIsOpen === '1',
                message: $t('ui.reqMsg').replace('$1', $t('Operation.automaticDispatch')),
                trigger: ['change']
              }
            ]"
          >
            <span slot="label">
              <el-tooltip :content="$t('Operation.automaticDispatchTip')" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.automaticDispatch') }}
            </span>
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.automaticDispatchIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="automaticDispatchSwitchChange('automaticDispatch')"
                ></el-switch>
              </div>
              <div class="con-right w100" v-show="form.automaticDispatchIsOpen === '1'">
                <el-select
                  style="width: 100%"
                  v-model="form.automaticDispatch"
                  placeholder=""
                  clearable
                  disabled
                >
                  <el-option
                    v-for="item in dict.type.dm_delivery_schedule_dispatch_rule"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="deliveryIntervalTime"
            :rules="[
              {
                required: form.deliveryIntervalIsOpen === '1',
                message: $t('ui.reqMsg').replace('$1', $t('Operation.deliveryIntervalTime')),
                trigger: ['blur']
              }
            ]"
          >
            <span slot="label">
              <el-tooltip :content="$t('Operation.deliveryIntervalTimeTip')" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.deliveryIntervalTime') }}
            </span>
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.deliveryIntervalIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange('deliveryIntervalTime')"
                ></el-switch>
              </div>
              <div class="con-right w100" v-show="form.deliveryIntervalIsOpen === '1'">
                <el-input-number
                  style="width: 100%"
                  v-model="form.deliveryIntervalTime"
                  controls-position="right"
                  :precision="0"
                  v-thousandSplit="{ precision: 0 }"
                  :min="1"
                  :max="999"
                  placeholder="1 - 999"
                  @change="inputNumberChange('deliveryIntervalTime')"
                />
                <div class="unit">s</div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="scheduledDispatchTime">
            <span slot="label">
              <el-tooltip :content="$t('Operation.scheduledDispatchTimeTip')" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.scheduledDispatchTime') }}
            </span>
            <div style="display: flex">
              <el-input-number
                style="width: 100%"
                v-model="form.scheduledDispatchTime"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="10"
                :max="999"
                placeholder="10 - 999"
                @change="inputNumberChange('scheduledDispatchTime')"
              />
              <div class="unit">s</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="loadOrderAmount">
            <span slot="label">
              <el-tooltip :content="$t('Operation.loadOrderAmountTip')" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.loadOrderAmount') }}
            </span>
            <el-input-number
              style="width: 100%"
              v-model="form.loadOrderAmount"
              controls-position="right"
              :precision="0"
              v-thousandSplit="{ precision: 0 }"
              :min="2"
              :max="9"
              placeholder="2 - 9"
              @change="inputNumberChange('loadOrderAmount')"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('Operation.dispatchMethod')" prop="dispatchMethod">
            <el-select
              style="width: 100%"
              v-model="form.dispatchMethod"
              placeholder=""
              multiple
              clearable
              collapse-tags
            >
              <el-option
                v-for="item in dict.type.dm_delivery_schedule_dispatch_method"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <span slot="label">
              <el-tooltip :content="$t('Operation.insertTruckTip')" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.insertTruck') }}
            </span>
            <el-switch
              v-model="form.insertTruck"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="changeLoadOrderBatchingPlant"
            :rules="[
              {
                required: form.changeLoadOrderBatchingPlantIsOpen === '1',
                message: $t('ui.commonReqMsg'),
                trigger: ['change']
              }
            ]"
          >
            <span slot="label">
              <el-tooltip
                :content="$t('Operation.changeLoadOrderBatchingPlantTip')"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.changeLoadOrderBatchingPlant') }}
            </span>
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.changeLoadOrderBatchingPlantIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange('changeLoadOrderBatchingPlant')"
                ></el-switch>
              </div>
              <div class="con-right w100" v-show="form.changeLoadOrderBatchingPlantIsOpen === '1'">
                <el-select
                  style="width: 100%"
                  v-model="form.changeLoadOrderBatchingPlant"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in dict.type.change_load_order_batching_plant"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="changeBatchingPlantDuringDispatchProcess"
            :rules="[
              {
                required: form.changeBatchingPlantDuringDispatchProcessIsOpen === '1',
                message: $t('ui.commonReqMsg'),
                trigger: ['change']
              }
            ]"
          >
            <span slot="label">
              <el-tooltip
                :content="$t('Operation.changeBatchingPlantDuringDispatchProcessTip')"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.changeBatchingPlantDuringDispatchProcess') }}
            </span>
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.changeBatchingPlantDuringDispatchProcessIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange('changeBatchingPlantDuringDispatchProcess')"
                ></el-switch>
              </div>
              <div
                class="con-right w100"
                v-show="form.changeBatchingPlantDuringDispatchProcessIsOpen === '1'"
              >
                <el-select
                  style="width: 100%"
                  v-model="form.changeBatchingPlantDuringDispatchProcess"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in dict.type.change_batching_plant_during_dispatch_process"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            prop="changeScheduledOrderBatchingPlant"
            :rules="[
              {
                required: form.changeScheduledOrderBatchingPlantIsOpen === '1',
                message: $t('ui.commonReqMsg'),
                trigger: ['change']
              }
            ]"
          >
            <span slot="label">
              <el-tooltip
                :content="$t('Operation.changeScheduledOrderBatchingPlantTip')"
                placement="top"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
              {{ $t('Operation.changeScheduledOrderBatchingPlant') }}
            </span>
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.changeScheduledOrderBatchingPlantIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange('changeScheduledOrderBatchingPlant')"
                ></el-switch>
              </div>
              <div
                class="con-right w100"
                v-show="form.changeScheduledOrderBatchingPlantIsOpen === '1'"
              >
                <el-select
                  style="width: 100%"
                  v-model="form.changeScheduledOrderBatchingPlant"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in dict.type.change_scheduled_order_batching_plant"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('Operation.confirmationMethod')" prop="confirmationMethod">
            <el-select
              style="width: 100%"
              v-model="form.confirmationMethod"
              placeholder=""
              clearable
            >
              <el-option
                v-for="item in confirmationMethodList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="$t('Operation.dODistanceCalculationMethod')"
            prop="dODistanceCalculationMethod"
          >
            <el-select
              style="width: 100%"
              v-model="form.dODistanceCalculationMethod"
              placeholder=""
              clearable
            >
              <el-option
                v-for="item in dODistanceCalculationMethodList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('ui.modifiedBy')">
            <el-input disabled v-model="form.modifiedBy" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.modifiedTime')}`">
            <el-date-picker
              :value="form.modifiedTime"
              :format="fmtForYmdhms"
              :style="{ width: '100%' }"
              disabled
              placeholder=""
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.isActive')}`">
            <el-switch
              v-model="form.isActive"
              :disabled="comDisFrom"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" v-if="!comDisFrom" @click="submitForm" :loading="btnLoading">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { querySetupFieldById, updateSetupField } from '@/api/operation/setup'
export default {
  dicts: [
    'dm_delivery_schedule_dispatch_rule',
    'dm_delivery_schedule_dispatch_method',
    'change_load_order_batching_plant',
    'change_batching_plant_during_dispatch_process',
    'change_scheduled_order_batching_plant'
  ],
  props: {
    editAuth: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      btnLoading: false,
      open: false,
      title: '',
      form: {},
      // 表单校验
      rules: {
        scheduledDispatchTime: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.scheduledDispatchTime')),
            trigger: ['blur']
          }
        ],
        loadOrderAmount: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.loadOrderAmount')),
            trigger: ['blur']
          }
        ],
        dispatchMethod: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.dispatchMethod')),
            trigger: ['change', 'blur']
          }
        ],
        confirmationMethod: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.confirmationMethod')),
            trigger: ['change', 'blur']
          }
        ],
        dODistanceCalculationMethod: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace(
              '$1',
              this.$t('Operation.dODistanceCalculationMethod')
            ),
            trigger: ['change', 'blur']
          }
        ]
      },
      confirmationMethodList: [
        {
          value: '1',
          label: vm.$t('Operation.confirmAll')
        },
        {
          value: '2',
          label: vm.$t('Operation.noConfirmationRequired')
        },
        {
          value: '3',
          label: vm.$t('Operation.dailyConfirmation')
        }
      ],
      dODistanceCalculationMethodList: [
        {
          value: '1',
          label: vm.$t('Operation.actualDistance')
        },
        {
          value: '2',
          label: vm.$t('Operation.navigationDistance')
        }
      ]
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  created() {},
  methods: {
    inputNumberChange(code) {
      this.$refs.formRef1.validateField(code)
    },
    switchChange(code) {
      this.$nextTick(() => {
        this.$refs.formRef1.clearValidate(code)
      })
    },
    automaticDispatchSwitchChange() {
      this.$set(this.form, 'automaticDispatch', '2')
      this.switchChange('automaticDispatch')
    },

    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        dispatchMethod: []
      }
      this.resetForm('formRef1')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = this.$t('uiBtn.edit')
      if (this.comDisFrom) {
        this.title = this.$t('uiBtn.view')
      }
      this.reset()
      const id = row.setupId
      querySetupFieldById(id).then((response) => {
        if (response.code === 200) {
          const data = response.data || {}
          const config = data.customConfigFields || {}
          this.form = data

          this.$set(this.form, 'automaticDispatchIsOpen', config.AUTOMATIC_DISPATCH_IS_OPEN)
          this.$set(this.form, 'automaticDispatch', config.AUTOMATIC_DISPATCH)
          this.$set(this.form, 'deliveryIntervalIsOpen', config.DELIVERY_INTERVAL_IS_OPEN)
          this.$set(this.form, 'deliveryIntervalTime', config.DELIVERY_INTERVAL_TIME)
          this.$set(this.form, 'scheduledDispatchTime', config.SCHEDULED_DISPATCH_TIME)
          this.$set(this.form, 'loadOrderAmount', config.LOAD_ORDER_AMOUNT)
          this.$set(this.form, 'insertTruck', config.INSERT_TRUCK)
          this.$set(this.form, 'dispatchMethod', config.DISPATCH_METHOD || ['1', '2'])

          this.$set(
            this.form,
            'changeLoadOrderBatchingPlantIsOpen',
            config.LOAD_ORDER_REPLACE_PRODUCTION_LINE_IS_OPEN
          )
          this.$set(
            this.form,
            'changeLoadOrderBatchingPlant',
            config.LOAD_ORDER_REPLACE_PRODUCTION_LINE
          )

          this.$set(
            this.form,
            'changeBatchingPlantDuringDispatchProcessIsOpen',
            config.PRODUCTION_PLAN_REPLACE_PRODUCTION_LINE_IS_OPEN
          )
          this.$set(
            this.form,
            'changeBatchingPlantDuringDispatchProcess',
            config.PRODUCTION_PLAN_REPLACE_PRODUCTION_LINE
          )

          this.$set(
            this.form,
            'changeScheduledOrderBatchingPlantIsOpen',
            config.SCHEDULING_REPLACE_PRODUCTION_LINE_IS_OPEN
          )
          this.$set(
            this.form,
            'changeScheduledOrderBatchingPlant',
            config.SCHEDULING_REPLACE_PRODUCTION_LINE
          )

          this.$set(this.form, 'confirmationMethod', config.CONFIRMATION_METHOD || '2')
          this.$set(
            this.form,
            'dODistanceCalculationMethod',
            config.DO_DISTANCE_CALCULATION_METHOD || '2'
          )

          this.open = true
        }
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      // 分类被删除时, getCheckedNodes() = [null], 将无效分类ID 清除
      this.$refs.formRef1.validate((valid) => {
        if (!valid) {
          return
        }
        if (valid) {
          this.form.customConfigFields = this.form.customConfigFields || {}
          this.form.customConfigFields.AUTOMATIC_DISPATCH_IS_OPEN =
            this.form.automaticDispatchIsOpen
          this.form.customConfigFields.AUTOMATIC_DISPATCH = this.form.automaticDispatch
          this.form.customConfigFields.DELIVERY_INTERVAL_IS_OPEN = this.form.deliveryIntervalIsOpen
          this.form.customConfigFields.DELIVERY_INTERVAL_TIME = this.form.deliveryIntervalTime
          this.form.customConfigFields.SCHEDULED_DISPATCH_TIME = this.form.scheduledDispatchTime
          this.form.customConfigFields.LOAD_ORDER_AMOUNT = this.form.loadOrderAmount
          this.form.customConfigFields.INSERT_TRUCK = this.form.insertTruck
          this.form.customConfigFields.DISPATCH_METHOD = this.form.dispatchMethod

          this.form.customConfigFields.LOAD_ORDER_REPLACE_PRODUCTION_LINE =
            this.form.changeLoadOrderBatchingPlant
          this.form.customConfigFields.LOAD_ORDER_REPLACE_PRODUCTION_LINE_IS_OPEN =
            this.form.changeLoadOrderBatchingPlantIsOpen

          this.form.customConfigFields.PRODUCTION_PLAN_REPLACE_PRODUCTION_LINE =
            this.form.changeBatchingPlantDuringDispatchProcess
          this.form.customConfigFields.PRODUCTION_PLAN_REPLACE_PRODUCTION_LINE_IS_OPEN =
            this.form.changeBatchingPlantDuringDispatchProcessIsOpen

          this.form.customConfigFields.SCHEDULING_REPLACE_PRODUCTION_LINE =
            this.form.changeScheduledOrderBatchingPlant
          this.form.customConfigFields.SCHEDULING_REPLACE_PRODUCTION_LINE_IS_OPEN =
            this.form.changeScheduledOrderBatchingPlantIsOpen

          this.form.customConfigFields.CONFIRMATION_METHOD = this.form.confirmationMethod
          this.form.customConfigFields.DO_DISTANCE_CALCULATION_METHOD =
            this.form.dODistanceCalculationMethod

          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          this.$modal
            .confirm(this.$t('Operation.setupSubmitConfirm'))
            .then(() => {
              this.btnLoading = true
              return updateSetupField(param)
            })
            .then((response) => {
              this.btnLoading = false
              this.$modal.msgSuccess(this.$t('Operation.setupSubmitSuccess'))

              this.open = false
              this.$emit('onSuccess')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.unit {
  flex-shrink: 0;
  width: 40px;
  text-align: center;
  background-color: #f5f7fa;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    display: flex;
    margin-left: 10px;
    // line-height: 0;
  }
}
</style>
