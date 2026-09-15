<template>
  <el-dialog
    v-dialogDrag
    :title="$t('ui.reason')"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('SALES.validityDays')}`" prop="validityForDay">
            <div class="flex">
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                v-model="form.validityForDay"
                :precision="0"
                type="number"
                :min="form.oldValidityForDay"
                :max="999"
                :controls="false"
                style="width: 30%"
                @change="validityChange('validityForDay')"
              />
              <span class="mr5 ml5">{{ $t('SALES.day') }}</span>
              <el-date-picker
                @change="validityChange('validity')"
                v-model="form.validity"
                :picker-options="validityDaysPickerOptions"
                :format="fmtForYmd"
                value-format="timestamp"
                :style="{ width: '70%' }"
                placeholder=""
                clearable
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.reason')}`" prop="reason">
            <MyInput
              type="textarea"
              v-model="form.reason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { activateSalesQuotation } from '@/api/salesManagement/salesQuotation'
export default {
  components: {},
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      validityDaysPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      form: {
        validityForDay: undefined,
        validity: undefined,
        reason: ''
      },

      rules: {
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        reason: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    }
  },
  beforeCreate() {},
  methods: {
    handleOpen(form) {
      this.reset()
      this.$set(this.form, 'salesQuotationMainId', form.salesQuotationMainId)
      this.$set(this.form, 'oldValidity', form.oldValidity)
      this.$set(this.form, 'oldValidityForDay', form.oldValidityForDay)
      this.$set(this.form, 'validity', form.oldValidity)
      this.$set(this.form, 'validityForDay', form.oldValidityForDay)
      this.$set(this.form, 'validityStart', form.validityStart)
      this.visible = true
    },
    reset() {
      this.form = {
        validityForDay: undefined,
        validity: undefined,
        reason: ''
      }
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },

    validityChange(changeType) {
      const cur = this.appointTime(this.form.validityStart, '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      if (changeType === 'validityForDay') {
        if (this.form.validityForDay) {
          this.$set(this.form, 'validity', dayTimer * this.form.validityForDay + cur)
        } else {
          this.$set(this.form, 'validity', undefined)
        }
      }
      if (changeType === 'validity') {
        if (this.form.validity) {
          const timer = Math.floor((this.form.validity - cur) / dayTimer)
          this.$set(this.form, 'validityForDay', timer)
        } else {
          this.$set(this.form, 'validityForDay', undefined)
          this.$nextTick(() => {
            this.$refs.form.validateField('validityForDay')
          })
        }
      }
    },

    submitForm() {
      if (this.fullscreenLoading) {
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.validity < Date.now()) {
            this.$modal.msgError(this.$t('SALES.validityErrMsg'))
            return
          }
          const vm = this
          const param = {
            ...vm.form
          }
          vm.fullscreenLoading = true
          activateSalesQuotation(param)
            .then((res) => {
              if (res.code === 200) {
                vm.$emit('submitSuccess')
                this.back()
              }
              vm.fullscreenLoading = false
            })
            .catch(() => {
              vm.fullscreenLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.el-select-group__title .option-title-box {
  display: flex;
  flex-direction: row;
  // background-color: #aaaaaa;
  font-weight: bold;
  // color: #000000;
  color: #606266;
  font-size: 14px;
  margin-left: -20px;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .option-title-a {
    width: 85px;
  }
  .option-title-b {
    padding-left: 3px;
    padding-right: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
  }
  .option-title-c {
    width: 85px;
  }
}
</style>
<style scoped lang="scss">
.dialog-footer {
  margin-bottom: 20px;
}

.return-gp-box .el-select-dropdown__item {
  height: auto;
  white-space: wrap;
  overflow: auto;
  text-overflow: none;
}

.op-list {
  display: flex;
  flex-direction: row;
  text-align: left;
  margin-left: -20px;
  padding-left: 3px;
  padding-right: 3px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .op-list-a {
    width: 85px;
  }
  .op-list-b {
    padding-left: 3px;
    padding-right: 3px;
    word-break: break-all;
    white-space: normal;
  }
  .op-list-c {
    width: 85px;
  }
}
</style>
