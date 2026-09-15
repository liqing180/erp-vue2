<template>
  <div class="mask" v-if="visible">
    <div class="box">
      <div class="title">{{ $t('login.settingNewPassword') }}</div>
      <el-form ref="passwordForm" label-width="160px" :model="form" :rules="rules" class="form">
        <el-form-item :label="$t('ui.newPassword')" prop="password">
          <el-input
            v-model="form.password"
            @input="form.password = form.password.replace(/\s/g, '')"
            :type="form.passwordType ? 'text' : 'password'"
            auto-complete="off"
            clearable
            class="input"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            <svg-icon
              slot="suffix"
              icon-class="psd-show"
              class="el-input__icon input-icon"
              style="font-size: 20px"
              v-if="!form.passwordType"
              @click="form.passwordType = !form.passwordType"
            />
            <svg-icon
              slot="suffix"
              icon-class="psd-hide"
              class="el-input__icon input-icon"
              style="font-size: 20px"
              v-else
              @click="form.passwordType = !form.passwordType"
            />

            <!-- <i
              class="el-input__icon el-icon-view"
              slot="suffix"
              @click="changeInputType('passwordType')"
            ></i> -->
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('ui.confirmPassword')" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            @input="form.newPassword = form.newPassword.replace(/\s/g, '')"
            :type="form.newPasswordType ? 'text' : 'password'"
            auto-complete="off"
            clearable
            class="input"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            <svg-icon
              slot="suffix"
              icon-class="psd-show"
              class="el-input__icon input-icon"
              style="font-size: 20px"
              v-if="!form.newPasswordType"
              @click="form.newPasswordType = !form.newPasswordType"
            />
            <svg-icon
              slot="suffix"
              icon-class="psd-hide"
              class="el-input__icon input-icon"
              style="font-size: 20px"
              v-else
              @click="form.newPasswordType = !form.newPasswordType"
            />
            <!-- <i
              class="el-input__icon el-icon-view"
              slot="suffix"
              @click="changeInputType('newPasswordType')"
            ></i> -->
          </el-input>
        </el-form-item>

        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; height: 40px"
            class="mt20"
            @click.native.prevent="submitPassword"
          >
            <span>{{ $t('uiBtn.confirm') }}</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { initPassword } from '@/api/login'
export default {
  data() {
    const vm = this
    return {
      form: {
        passwordType: false,
        newPasswordType: false
      },
      rules: {
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
      loading: false,
      visible: false
    }
  },
  methods: {
    open() {
      this.reset()
      this.visible = true
    },
    changeInputType(type) {
      this.form[type] = !this.form[type]
    },
    reset() {
      this.form = {
        password: undefined,
        newPassword: undefined,
        passwordType: false,
        newPasswordType: false
      }
      this.resetForm('passwordForm')
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
          this.loading = true
          initPassword({
            password: this.form.password
          })
            .then((res) => {
              this.$store.commit('SET_IS_ALREADY_SET_PASSWORD', '1')
              this.$modal.msgSuccess(this.$t('login.resetSuccess'))
              this.visible = false
              this.loading = false
            })
            .catch((err) => {
              this.loading = false
              console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}
.box {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 550px;
  transform: translate(-50%, -50%);
  padding: 0 30px 30px;
  background-color: #fff;
  border-radius: 10px;
}
.title {
  font-size: 18px;
  color: #303133;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
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

.form {
  margin-top: 30px;
  /deep/ .el-form-item {
    // margin-bottom: 0px;
  }
  /deep/ .el-form-item__label {
    font-size: 15px !important;
    font-weight: 700 !important;
    line-height: 40px;
  }
}
.input ::v-deep .el-input {
  font-size: 15px !important;
}

.input ::v-deep .el-input__inner,
.input ::v-deep .el-input > .el-input__inner {
  font-size: 15px !important;
  height: 35px !important;
  line-height: 35px !important;
}
.input ::v-deep .el-input__suffix,
.input ::v-deep .el-input__suffix-inner {
  display: flex;
  align-items: center;
}
.input {
  /deep/ .el-input__prefix,
  /deep/ .el-input__prefix-inner,
  /deep/ .el-input__suffix,
  /deep/ .el-input__suffix-inner {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
