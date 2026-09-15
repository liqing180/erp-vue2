<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="title"
    :visible.sync="open"
    width="900px"
    append-to-body
    @closed="closed"
  >
    <div class="infoFrom" style="padding-top: 20px">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        class="mr20"
        :disabled="comDisFrom"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`${$t('PURCHASE.requestedBy')}`" prop="requestedBy">
              <el-input v-model="form.requestedBy" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="`${$t('PURCHASE.requestedMobilePhone')}`"
              prop="requestedMobilePhone"
              ref="mobileNoRef"
            >
              <MobilePhoneInput
                :mobileCode.sync="form.requestedMobileCode"
                :mobileNum.sync="form.requestedMobileNum"
                :mobileNo.sync="form.requestedMobilePhone"
                @clearValidate="$refs.mobileNoRef.clearValidate()"
                :disabled="comDisFrom"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="`${$t('PURCHASE.requestedEmail')}`" prop="requestedEmail">
              <el-input
                v-model.trim="form.requestedEmail"
                :title="form.requestedEmail"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :loading="btnLoading" v-if="!comDisFrom"
        >{{ $t('uiBtn.save') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddTripDlg',
  props: {
    zoneForm: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    const validatorPhoneNo = (rule, value, callback) => {
      if (!this.form.requestedMobileCode || !this.form.requestedMobileNum) {
        callback(this.$t('ui.reqMsg'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      activeName: '1',
      open: false,
      title: '',
      form: {},
      // 表单校验
      rules: {
        requestedBy: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ],
        requestedEmail: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: this.$t('ui.reqMsg')
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        requestedMobilePhone: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }]
      },
      isDisabled: false,
      truckList: [],
      zoneList: [],
      assignDriverOptions: []
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    editAuth() {
      return this.checkPermi(['operation:trip:edit'])
    },
    comDisFrom() {
      if (this.form.tripId) {
        return !this.editAuth
      }
      return false
    },
    comSpacingTime() {
      let msg = ''
      if (this.form.spacingTimeHour) {
        msg += `${this.form.spacingTimeHour}${this.$t('Operation.hrs')}`
      }
      if (this.form.spacingTimeMinute) {
        msg += ` ${this.form.spacingTimeMinute}${this.$t('Operation.mins')}`
      }
      return msg
    }
  },
  methods: {
    reset() {
      this.form = {
        requestedBy: undefined,
        requestedEmail: undefined,
        requestedMobileCode: undefined,
        requestedMobileNum: undefined,
        requestedMobilePhone: undefined
      }
      this.activeName = '1'
      this.truckList = []
      this.assignDriverOptions = []
      if (this.$refs.productPageRef) {
        this.$refs.productPageRef.initProductList([])
      }
      this.resetForm('form')
    },
    handleOpen(form) {
      this.reset()
      this.form = { ...form }
      this.isDisabled = false
      this.open = true
      if (form.requestedBy) {
        this.title = this.$t('PURCHASE.editRequestedBy')
      } else {
        this.title = this.$t('PURCHASE.addRequestedBy')
      }
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          this.$emit('update', param)
          this.open = false
          /* this.$modal.confirm(this.$t('Operation.submitPageConfirm')).then(() => {

          }) */
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.infoFrom {
  margin: 0 auto;
  max-width: 1150px;
}
.input-switch-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .con-left {
    flex: 1;
  }
  .con-right {
    margin-left: 10px;
    line-height: 0;
  }
}
</style>
