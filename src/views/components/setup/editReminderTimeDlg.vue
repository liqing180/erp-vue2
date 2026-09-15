<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :title="title"
    v-dialogDragWidth
    :visible.sync="open"
    width="1000px"
    append-to-body
    @closed="closed"
  >
    <el-form ref="formRef1" class="mr40" :model="form" :rules="rules" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('Operation.reminderTime')" prop="reminderTime">
            <div style="display: flex">
              <el-input-number
                style="width: 100%"
                v-model="form.reminderTime"
                controls-position="right"
                :precision="0"
                v-thousandSplit="{ precision: 0 }"
                :min="1"
                :max="999"
                placeholder="1 - 999"
                @change="inputNumberChange('reminderTime')"
              />
              <div class="unit">s</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="exitQueueNum"
            :rules="[
              {
                required: form.exitQueueIsOpen !== '1',
                message: $t('ui.reqMsg').replace('$1', $t('Operation.exitQueue')),
                trigger: ['blur']
              }
            ]"
          >
            <span slot="label">
              {{ $t('Operation.exitQueue') }}
            </span>
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.exitQueueIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange('exitQueueNum')"
                ></el-switch>
              </div>
              <div class="con-right w100" v-show="form.exitQueueIsOpen !== '1'">
                <el-input-number
                  style="width: 100%"
                  v-model="form.exitQueueNum"
                  controls-position="right"
                  :precision="0"
                  v-thousandSplit="{ precision: 0 }"
                  :min="2"
                  :max="99"
                  placeholder="2 - 99"
                  @change="inputNumberChange('exitQueueNum')"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.exitQueueIsOpen !== '1'">
        <el-col :span="12">
          <el-form-item
            prop="rejectionPenalty"
            :rules="[
              {
                required: form.rejectionPenaltyIsOpen === '1',
                message: $t('ui.reqMsg').replace('$1', $t('Operation.rejectionPenalty')),
                trigger: ['change']
              }
            ]"
            :label="$t('Operation.rejectionPenalty')"
          >
            <div class="input-switch-box">
              <div class="con-left">
                <el-switch
                  v-model="form.rejectionPenaltyIsOpen"
                  :disabled="comDisFrom"
                  active-value="1"
                  inactive-value="0"
                  @change="switchChange('rejectionPenalty')"
                ></el-switch>
              </div>
              <div class="con-right w100" v-show="form.rejectionPenaltyIsOpen === '1'">
                <el-select
                  style="width: 100%"
                  v-model="form.rejectionPenalty"
                  placeholder=""
                  clearable
                >
                  <el-option
                    v-for="item in rejectionPenaltyTypeList"
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
        <el-col :span="12" v-if="form.rejectionPenaltyIsOpen === '1'">
          <el-form-item :label="$t('Operation.penaltyConditions')" prop="penaltyConditions">
            <el-cascader
              class="tag-width"
              popper-class="hide-cascader-scrollbar"
              style="width: 100%"
              placeholder=""
              :options="penaltyConditionsList"
              :props="{ multiple: false, emitPath: false }"
              clearable
              :collapse-tags="true"
              filterable
              v-model="form.penaltyConditions"
              :show-all-levels="false"
            ></el-cascader>
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
  dicts: ['reminder_time_unit'],
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
        reminderTime: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.reminderTime')),
            trigger: ['blur']
          }
        ],
        driverTimeoutCount: [
          {
            required: true,
            // eslint-disable-next-line
            // pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.driverTimeoutCount')),
            trigger: ['blur']
          }
        ],
        penaltyConditions: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('Operation.penaltyConditions')),
            trigger: ['change', 'blur']
          }
        ]
      },
      rejectionPenaltyTypeList: [
        {
          value: '1',
          label: vm.$t('Operation.approvalNotRequired')
        },
        {
          value: '2',
          label: vm.$t('Operation.approvalRequired')
        }
      ],
      penaltyConditionsList: []
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
  created() {
    const vm = this
    const fixedDurationChildren = [
      {
        value: 1,
        label: '1min'
      }
    ]
    for (let i = 5; i <= 60; i += 5) {
      fixedDurationChildren.push({
        value: i,
        label: i + 'min'
      })
    }
    this.penaltyConditionsList = [
      {
        value: 'fixedDuration',
        label: vm.$t('Operation.fixedDuration'),
        children: fixedDurationChildren
      },
      {
        value: 'progressiveDuration',
        label: vm.$t('Operation.progressiveDuration'),
        children: [
          {
            value: -1,
            label: vm.$t('Operation.progressiveMultiplication')
          }
        ]
      }
    ]
  },
  methods: {
    inputNumberChange(code) {
      this.$refs.formRef1.validateField(code)
    },
    switchChange(code) {
      this.$nextTick(() => {
        this.$refs.formRef1.clearValidate(code)
      })
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
        application: [],
        penaltyConditions: undefined
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
          this.$set(this.form, 'reminderTime', config.REMINDER_TIME)
          this.$set(this.form, 'exitQueueIsOpen', config.EXIT_QUEUE_IS_OPEN)
          this.$set(this.form, 'exitQueueNum', config.EXIT_QUEUE_NUM)
          this.$set(this.form, 'rejectionPenaltyIsOpen', config.REJECTION_PENALTY_IS_OPEN)
          this.$set(this.form, 'rejectionPenalty', config.REJECTION_PENALTY)
          this.$set(this.form, 'penaltyConditions', config.PENALTY_CONDITIONS)
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
          this.form.customConfigFields.REMINDER_TIME = this.form.reminderTime
          this.form.customConfigFields.EXIT_QUEUE_IS_OPEN = this.form.exitQueueIsOpen
          this.form.customConfigFields.EXIT_QUEUE_NUM = this.form.exitQueueNum
          this.form.customConfigFields.REJECTION_PENALTY_IS_OPEN = this.form.rejectionPenaltyIsOpen
          this.form.customConfigFields.REJECTION_PENALTY = this.form.rejectionPenalty
          this.form.customConfigFields.PENALTY_CONDITIONS = this.form.penaltyConditions
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
