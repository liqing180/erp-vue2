<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    :title="
      type === 'carrier' ? $t('login.carrierRegistration') : $t('login.consignorRegistration')
    "
    v-dialogDragWidth
    :visible.sync="open"
    width="600px"
    append-to-body
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('login.companyName')" prop="companyName">
        <el-input
          v-model="form.companyName"
          type="text"
          auto-complete="off"
          :placeholder="$t('login.placeholder').replace('$1', this.$t('login.companyName'))"
          clearable
          maxlength="200"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('ui.email')" prop="email">
        <el-input
          v-model.trim="form.email"
          :title="form.email"
          type="text"
          auto-complete="off"
          :placeholder="$t('login.placeholder').replace('$1', this.$t('ui.email'))"
          clearable
          maxlength="50"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('login.mobileNo')" prop="mobileNo" ref="mobileNoRef">
        <MobilePhoneInputCopy
          :dictList="phoneDictList"
          :mobileCode.sync="form.mobileCode"
          :mobileNum.sync="form.mobileNum"
          :mobileNo.sync="form.mobileNo"
          @clearValidate="$refs.mobileNoRef.clearValidate()"
        />
      </el-form-item>
      <el-form-item :label="$t('login.businessLicence')" required>
        <myUpload
          :isToken="false"
          :isDown="false"
          ref="uploadRef"
          :limit="1"
          :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
        />
      </el-form-item>
      <el-form-item :label="$t('login.roadPermit')" required v-if="type === 'carrier'">
        <myUpload
          :isToken="false"
          :isDown="false"
          ref="uploadRef1"
          :limit="1"
          :accept="['.jpg', '.jpeg', '.png', '.bmp', '.webp']"
        />
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input
          v-model="form.code"
          auto-complete="off"
          :placeholder="$t('login.placeholder').replace('$1', this.$t('login.captcha1'))"
          style="width: 63%"
          @keyup.enter.native="submitResetPassword"
          maxlength="20"
          clearable
        >
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="submit">{{
          $t('uiBtn.submit')
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  getCodeImg,
  queryDictDataListByType,
  registerCarrier,
  registerConsignor
} from '@/api/login'
import MobilePhoneInputCopy from '@/components/Common/MobilePhoneInput/MobilePhoneInputCopy.vue'
export default {
  name: 'TmsWebRegistration',
  components: {
    MobilePhoneInputCopy
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    const vm = this
    const validatorPhoneNo = (rule, value, callback) => {
      if (!vm.form.mobileCode || !vm.form.mobileNum) {
        callback(vm.$t('ui.reqMsg').replace('$1', vm.$t('login.mobileNo')))
      } else {
        callback()
      }
    }
    return {
      open: false,
      form: {
        uuid: '',
        mobileCode: '',
        mobileNum: '',
        companyName: '',
        email: '',
        mobileNo: '',
        code: ''
      },
      rules: {
        companyName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('login.companyName'))
          }
        ],
        mobileNo: [{ required: true, validator: validatorPhoneNo, trigger: 'change' }],
        email: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.email'))
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],
        code: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('login.captcha1'))
          }
        ],
        verificationCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('login.captcha'))
          }
        ],
        password: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.password'))
          },
          { min: 6, max: 20, message: vm.$t('login.validPassword'), trigger: 'blur' }
        ],
        newPassword: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.newPassword'))
          },
          { min: 6, max: 20, message: vm.$t('login.validPassword'), trigger: 'blur' }
        ]
      },
      codeUrl: '',
      // 电话区号
      phoneDictList: [],
      isLoading: false,
      captchaOnOff: false
    }
  },

  mounted() {},

  methods: {
    // 初始化
    init(e) {
      this.open = true
      this.getCode()
      this.getPhone()
    },
    // 电话区号
    async getPhone() {
      const res = await queryDictDataListByType({ dictType: 'mdm_mobile_code' })
      this.phoneDictList = res.data || []
    },
    // 验证码
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff = res.captchaOnOff
        if (res.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.form.uuid = res.uuid
        }
      })
    },
    close() {
      this.form = {
        uuid: '',
        mobileCode: '',
        mobileNum: '',
        companyName: '',
        email: '',
        mobileNo: '',
        code: ''
      }
      if (this.$refs.uploadRef) {
        this.$refs.uploadRef.initFileList([])
      }
      if (this.$refs.uploadRef1) {
        this.$refs.uploadRef1.initFileList([])
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    submit() {
      this.$refs.form
        .validate()
        .then((valid) => {
          if (valid) {
            const myFileIds = this.$refs.uploadRef.getFileIds({
              required: true,
              requiredMsg: this.$t('login.uploadReq').replace(
                '$1',
                this.$t('login.businessLicence')
              )
            })
            if (myFileIds === false) return
            this.form.fileIdsBusiness = myFileIds
            this.isLoading = true
            if (this.type === 'carrier') {
              const myFileIds1 = this.$refs.uploadRef1.getFileIds({
                required: true,
                requiredMsg: this.$t('login.uploadReq').replace('$1', this.$t('login.roadPermit'))
              })
              if (myFileIds1 === false) {
                this.isLoading = false
                return
              }
              this.form.fileIdsRoad = myFileIds1
              const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
              registerCarrier(param)
                .then(() => {
                  this.$modal.msgSuccess(this.$t('login.registrationSuccess'))
                  this.isLoading = false
                  this.open = false
                })
                .catch(() => {
                  this.isLoading = false
                  this.form.code = ''
                  this.getCode()
                })
            } else {
              registerConsignor(this.form)
                .then(() => {
                  this.$modal.msgSuccess(this.$t('login.registrationSuccess'))
                  this.isLoading = false
                  this.open = false
                })
                .catch(() => {
                  this.isLoading = false
                  this.form.code = ''
                  this.getCode()
                })
            }
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-code-img {
  height: 38px;
}
.validate-code {
  /deep/ .el-form-item__content {
    display: flex;
  }
}
</style>
