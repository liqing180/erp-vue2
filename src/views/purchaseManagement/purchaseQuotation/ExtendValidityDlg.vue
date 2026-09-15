<template>
  <el-dialog
    v-dialogDrag
    :title="$t('PURCHASE.extendValidity')"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('PURCHASE.dateQuoted')}`">
            <el-date-picker
              v-model="form.dateQuoted"
              :format="fmtForYmd"
              value-format="timestamp"
              :style="{ width: '100%' }"
              placeholder=""
              clearable
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('PURCHASE.validityDays')}`" prop="validityForDay">
            <div class="flex">
              <el-input-number
                v-thousandSplit="{ precision: 0 }"
                v-model="form.validityForDay"
                :precision="0"
                type="number"
                :min="minDays"
                :max="999"
                :controls="false"
                style="width: 30%"
                @change="validityChange('validityForDay')"
              />
              <span class="mr5 ml5 fs-0">{{ $t('PURCHASE.day') }}</span>
              <el-date-picker
                @change="validityChange('validity')"
                v-model="form.validity"
                :disabled="!form.dateQuoted"
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
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="back">{{ $t('ui.back') }}</el-button>
      <el-button type="primary" :loading="fullscreenLoading" @click="submitForm()">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { extendValidityPurchaseQuotation } from '@/api/purchaseManagement/purchaseQuotation'
export default {
  components: {},
  props: {
    taskId: {
      type: String,
      default: ''
    },
    /* 后端使用 业务审批或正常审批:1, 管理员审批: 3 */
    fromType: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    ids: {
      type: Array,
      default: () => []
    },
    path: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    return {
      visible: false,
      fullscreenLoading: false,
      form: {},
      rules: {
        validityForDay: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      validityDaysPickerOptions: {
        disabledDate(time) {
          if (vm.comDateQuoted) {
            return time.getTime() <= vm.comDateQuoted || time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      minDays: undefined
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    comDateQuoted() {
      if (this.form.dateQuoted) {
        return this.appointTime(this.form.dateQuoted, '00:00:00')
      }
      return undefined
    }
  },
  beforeCreate() {},
  methods: {
    handleOpen(data) {
      this.reset()
      this.$set(this.form, 'purchaseQuotationId', data.purchaseQuotationId)
      this.$set(this.form, 'dateQuoted', data.dateQuoted)
      const dateQuoted = this.appointTime(this.form.dateQuoted, '00:00:00')
      const curTimer = this.appointTime(Date.now(), '00:00:00')
      const dayTimer = 24 * 60 * 60 * 1000
      this.minDays = Math.floor((curTimer - dateQuoted) / dayTimer)

      this.visible = true
    },
    validityChange(changeType) {
      const cur = this.appointTime(this.form.dateQuoted, '00:00:00')
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
    reset() {
      this.form = {
        purchaseQuotationId: undefined,
        dateQuoted: undefined,
        validityForDay: undefined,
        validity: undefined
      }
      this.resetForm('form')
    },
    back() {
      this.visible = false
    },
    submitForm() {
      if (this.fullscreenLoading) {
        return
      }
      // console.log('this.taskId', this.taskId)

      this.$refs.form.validate((valid) => {
        if (valid) {
          const vm = this
          const param = {
            ...this.form
          }
          vm.fullscreenLoading = true
          extendValidityPurchaseQuotation(param)
            .then((res) => {
              vm.fullscreenLoading = false
              vm.$emit('onSuccess')
              this.back()
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
