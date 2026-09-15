<template>
  <div>
    <div class="title">{{ topTitle() }}</div>
    <el-form
      ref="resetForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-show="stepIdex === 0"
    >
      <el-form-item :label="$t('login.usernameInfo')" prop="userName">
        <el-input
          v-model="form.userName"
          type="text"
          auto-complete="off"
          :placeholder="$t('login.placeholder').replace('$1', this.$t('login.usernameInfo'))"
          clearable
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
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('login.captcha1')" prop="code" v-if="captchaOnOff">
        <el-input
          v-model="form.code"
          auto-complete="off"
          :placeholder="$t('login.placeholder').replace('$1', this.$t('login.captcha1'))"
          style="width: 63%"
          @keyup.enter.native="submitResetPassword"
          clearable
        >
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
    </el-form>
    <el-form
      ref="validateForm"
      :model="form"
      :rules="rules"
      @submit.native.prevent
      v-show="stepIdex === 1"
    >
      <el-form-item :label="$t('login.captcha')" prop="verificationCode" class="validate-code">
        <el-input
          v-model="form.verificationCode"
          auto-complete="off"
          :placeholder="$t('login.placeholder').replace('$1', this.$t('login.captcha'))"
          clearable
          @keyup.enter.native="submitValidate"
          class="mr20"
        >
        </el-input>
        <el-button type="primary" :disabled="isDisabled" @click="resetGetCode">{{
          countDownText
        }}</el-button>
      </el-form-item>
    </el-form>

    <el-form
      ref="passwordForm"
      label-width="160px"
      :model="form"
      :rules="rules"
      v-show="stepIdex === 2"
    >
      <el-form-item :label="$t('ui.newPassword')" prop="password">
        <el-input
          v-model="form.password"
          :type="form.passwordType ? 'text' : 'password'"
          @input="form.password = form.password.replace(/\s/g, '')"
          auto-complete="off"
          clearable
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          <i
            class="el-input__icon el-icon-view"
            slot="suffix"
            @click="changeInputType('passwordType')"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item style="padding-top: 20px" :label="$t('ui.confirmPassword')" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          @input="form.newPassword = form.newPassword.replace(/\s/g, '')"
          :type="form.newPasswordType ? 'text' : 'password'"
          auto-complete="off"
          clearable
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          <i
            class="el-input__icon el-icon-view"
            slot="suffix"
            @click="changeInputType('newPasswordType')"
          ></i>
        </el-input>
      </el-form-item>
    </el-form>

    <div style="width: 100%; margin: 40px 0 25px">
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%"
        @click.native.prevent="submitResetPassword"
        v-if="stepIdex === 0"
      >
        <span>{{ $t('uiBtn.submit') }}</span>
      </el-button>
      <div style="display: flex; justify-content: flex-end" v-else-if="stepIdex === 1">
        <el-button @click.native.prevent="back(0)">
          <span>{{ $t('uiBtn.back') }}</span>
        </el-button>
        <el-button type="primary" @click.native.prevent="submitValidate">
          <span>{{ $t('uiBtn.submit') }}</span>
        </el-button>
      </div>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%"
        @click.native.prevent="submitPassword"
        v-if="stepIdex === 2"
      >
        <span>{{ $t('uiBtn.submit') }}</span>
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%"
        @click.native.prevent="submitLogin"
        v-if="stepIdex === 3"
      >
        <span>{{ $t('login.logIn') }}</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  getCodeImg,
  resetPasswordForSubmitForPC,
  resetPasswordForSubmitVC,
  resetPasswordForSendVC,
  resetPasswordForSubmitPW
} from '@/api/login'
export default {
  name: 'TmsWebForgotpassword',
  data() {
    const vm = this
    return {
      form: {
        uuid: '',
        passwordType: false,
        newPasswordType: false
      },
      rules: {
        tenantCode: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('login.companyCode'))
          }
        ],
        userName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('login.usernameInfo'))
          }
        ],
        email: [
          {
            required: true,
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
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.newPassword'))
          },
          { min: 6, max: 20, message: vm.$t('login.validPassword'), trigger: 'blur' }
        ],
        newPassword: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            trigger: ['blur', 'change'],
            message: vm.$t('ui.reqMsg').replace('$1', vm.$t('ui.confirmPassword'))
          },
          { min: 6, max: 20, message: vm.$t('login.validPassword'), trigger: 'blur' }
        ]
      },
      codeUrl: '',
      loading: false,
      stepIdex: 0,
      // 重置密码
      userUuid: '',
      // 验证码
      resetPasswordUuid: '',
      // 倒计时
      timer: null,
      countDownText: '',
      isDisabled: true,
      captchaOnOff: false
    }
  },
  methods: {
    init() {
      this.stepIdex = 0
      this.getCode()
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaOnOff) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.form.uuid = res.uuid
        }
      })
    },
    topTitle() {
      if (this.stepIdex === 0) {
        return this.$t('menu.resetPwd')
      } else if (this.stepIdex === 1) {
        return this.$t('login.accountVerification')
      } else if (this.stepIdex === 2) {
        return this.$t('login.settingNewPassword')
      } else if (this.stepIdex === 3) {
        return this.$t('login.resetPasswordSuccess')
      }
    },
    back(index) {
      this.stepIdex = index
      clearInterval(this.timer)
      this.timer = null
      this.form.code = ''
      this.getCode()
    },
    // 重置密码
    submitResetPassword() {
      this.$refs.resetForm.validate((valid) => {
        this.form.tenantType = 1
        const query = this.$trimOfObj(this.form)
        if (valid) {
          resetPasswordForSubmitForPC(query)
            .then((res) => {
              this.isDisabled = true
              this.userUuid = res.msg
              this.stepIdex = 1
              this.countDown()
            })
            .catch((err) => {
              this.form.code = ''
              this.getCode()
              console.log(err)
            })
        }
      })
    },
    // 倒计时
    countDown() {
      const that = this
      let time = 60
      that.countDownText = that.$t('login.resend') + ' ' + time + 's'
      this.timer = setInterval(() => {
        time--
        if (time <= 0) {
          that.countDownText = that.$t('login.resend')
          clearInterval(this.timer)
          this.timer = null
          this.isDisabled = false
          return
        }
        that.countDownText = that.$t('login.resend') + ' ' + time + 's'
      }, 1000)
    },
    // 重新获取验证按
    resetGetCode() {
      this.$set(this.form, 'verificationCode', undefined)
      resetPasswordForSendVC({ userUuid: this.userUuid })
        .then((res) => {
          this.isDisabled = true
          this.userUuid = res.msg
          this.countDown()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 提交验证码
    submitValidate() {
      this.$refs.validateForm.validate((valid) => {
        if (valid) {
          this.form.verificationCode = this.form.verificationCode.trim()
          resetPasswordForSubmitVC({
            userUuid: this.userUuid,
            verificationCode: this.form.verificationCode
          })
            .then((res) => {
              this.resetPasswordUuid = res.msg
              this.stepIdex = 2
              clearInterval(this.timer)
              this.timer = null
            })
            .catch(() => {})
        }
      })
    },
    // 新密码，旧密码
    submitPassword() {
      if (this.form.password && this.form.newPassword) {
        this.form.password = this.form.password.trim()
        this.form.newPassword = this.form.newPassword.trim()
      }
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          if (this.form.password !== this.form.newPassword) {
            this.$modal.msgError(this.$t('login.passwordInconsistent'))
            return
          }
          resetPasswordForSubmitPW({
            password: this.form.password,
            resetPasswordUuid: this.resetPasswordUuid,
            userUuid: this.userUuid
          })
            .then((res) => {
              this.submitLogin()
              this.$modal.msgSuccess(this.$t('login.resetSuccess'))
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    // 登录页
    submitLogin() {
      sessionStorage.setItem('type', '')
      this.$router.push({ path: '/login', query: { redirect: '/index' } })
    },
    changeInputType(type) {
      this.form[type] = !this.form[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0px auto 30px auto;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: #1890ff;
}
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
