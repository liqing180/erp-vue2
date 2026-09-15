<template>
  <div class="login_container">
    <!-- 头部 -->
    <div style="background: #fff; position: relative; z-index: 2">
      <div class="header">
        <div style="display: flex">
          <div class="logo_card">
            <img src="../assets/images/logo_01.png" alt="" class="logo" />
          </div>
          <ul class="tab">
            <li class="tab_item" :class="{ active: !type }" @click="goToERP">
              {{ $t('login.ERPEntry') }}
            </li>
            <li class="tab_item" @click="goToWMS" v-if="wmsUrl">{{ $t('login.WMSEntry') }}</li>
          </ul>
        </div>
        <div>
          <lang-select class="right-menu-item hover-effect" :loginFlag="true" />
        </div>
      </div>
    </div>

    <img src="../assets/images/login-pic-07.jpeg" alt="" class="left_img" />
    <div class="img-mask"></div>

    <div style="display: flex; flex-direction: column; flex: 1">
      <!-- 内容 -->
      <div class="content">
        <div class="content_container">
          <!-- <div class="left">
            <img src="../assets/images/login-pic-06.jpg" alt="" class="left_img" />
          </div> -->
          <div class="right">
            <div class="login-form">
              <template v-if="!type">
                <h3 class="title">{{ $t('login.ERPEntry') }}</h3>
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                  <el-form-item prop="username">
                    <el-input
                      v-model="loginForm.username"
                      type="text"
                      auto-complete="off"
                      :placeholder="
                        $t('login.placeholder').replace('$1', this.$t('login.usernameInfo'))
                      "
                      @input="loginForm.username = loginForm.username.replace(/\s+/g, '')"
                    >
                      <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="loginForm.password"
                      :type="passwordType ? 'text' : 'password'"
                      :placeholder="
                        $t('login.placeholder').replace('$1', this.$t('login.password'))
                      "
                      auto-complete="off"
                      @input="loginForm.password = loginForm.password.replace(/\s/g, '')"
                      @keyup.enter.native="handleLogin"
                      class="input"
                    >
                      <svg-icon
                        slot="prefix"
                        icon-class="password"
                        class="el-input__icon input-icon"
                      />
                      <svg-icon
                        slot="suffix"
                        icon-class="psd-show"
                        style="font-size: 20px"
                        v-if="!passwordType"
                        @click="passwordType = !passwordType"
                      />
                      <svg-icon
                        slot="suffix"
                        icon-class="psd-hide"
                        style="font-size: 20px"
                        v-else
                        @click="passwordType = !passwordType"
                      />
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="code" v-if="captchaEnabled">
                    <div style="font-size: 12px; line-height: 20px; color: #707070">
                      {{ $t('login.pleaseEnter') }}
                    </div>
                    <el-input
                      v-model="loginForm.code"
                      auto-complete="off"
                      :placeholder="
                        $t('login.placeholder').replace('$1', this.$t('login.captcha1'))
                      "
                      style="width: 63%"
                      @keyup.enter.native="handleLogin"
                    >
                      <svg-icon
                        slot="prefix"
                        icon-class="validCode"
                        class="el-input__icon input-icon"
                      />
                    </el-input>
                    <div class="login-code">
                      <img :src="codeUrl" @click="getCode" class="login-code-img" />
                    </div>
                  </el-form-item>
                  <div style="display: flex; justify-content: space-between">
                    <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">{{
                      $t('login.rememberPassword')
                    }}</el-checkbox>
                    <div
                      style="color: #1890ff; font-size: 14px; cursor: pointer"
                      @click="navForgotPassword"
                    >
                      {{ $t('login.forgotPassword') }}
                    </div>
                  </div>
                  <el-form-item style="width: 100%">
                    <el-button
                      :loading="loading"
                      type="primary"
                      style="width: 100%"
                      @click.native.prevent="handleLogin"
                    >
                      <span v-if="!loading">{{ $t('login.logIn') }}</span>
                      <span v-else>{{ $t('login.LoggingIn') }}...</span>
                    </el-button>
                    <div style="float: right" v-if="register">
                      <router-link class="link-type" :to="'/register'">立即注册</router-link>
                    </div>
                  </el-form-item>
                </el-form>
              </template>

              <!-- 重置密码 -->
              <ResetPassword ref="resetPassword" v-else></ResetPassword>
            </div>
          </div>
        </div>
      </div>
      <!--  底部  -->
      <div class="el-login-footer">
        <p>Address: 52 Senoko Road, Singapore 758116, Singapore&ensp;&ensp;Tel: +65 62657119</p>
        <p>Copyright&copy;{{ copyInfoAboutYear() }}&ensp;Batch Technologies Pte Ltd</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg, queryDomainName, exchange } from '@/api/login'
import Cookies from 'js-cookie'
import { encrypt, decrypt, encryptPassword } from '@/utils/jsencrypt'
import LangSelect from '@/components/LangSelect'
import ResetPassword from '@/views/homeOrderSearch/resetPassword'
import { setToken } from '@/utils/auth'

export default {
  name: 'Login',
  components: {
    LangSelect,
    ResetPassword
  },
  data() {
    return {
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('ui.commonReqMsg').replace('$1', this.$t('login.usernameInfo'))
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('ui.commonReqMsg').replace('$1', this.$t('login.password'))
          }
        ],
        code: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('ui.commonReqMsg').replace('$1', this.$t('login.captcha1'))
          }
        ]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: false,
      // 注册开关
      register: false,
      redirect: undefined,
      type: undefined,
      wmsUrl: '',
      passwordType: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
        const { type } = this.$route.query
        this.type = type || ''
        sessionStorage.setItem('type', type)
        if (type === 'resetPassword') {
          this.$nextTick(() => {
            this.$refs.resetPassword.init()
          })
        }
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    this.getCookie()
    this.queryDomainName()
    const query = this.$route.query
    if (query.wmsToken) {
      exchange({ token: query.wmsToken, tenantType: 1 }).then((res) => {
        console.log('res', res)
        const data = res.data || {}
        if (data.access_token) {
          setToken(data.access_token)
          this.$store.commit('SET_TOKEN', data.access_token)
          setTimeout(() => {
            this.$router.push({ path: '/' }).catch(() => {})
          }, 100)
        }
      })
    }
  },
  methods: {
    queryDomainName() {
      queryDomainName().then((res) => {
        this.wmsUrl = res.data.wmsDomain
      })
    },
    goToWMS() {
      window.location.href = this.wmsUrl
    },
    goToERP() {
      if (!this.type) return
      this.type = ''
      sessionStorage.setItem('type', '')
      this.$router.push({ path: '/login', query: { redirect: '/index' } })
    },
    copyInfoAboutYear() {
      const y = new Date().getFullYear()

      if (Number(y) <= 2019) {
        return '2019'
      } else {
        return `2019 - ${y}`
      }
    },
    navForgotPassword() {
      this.type = 'resetPassword'
      sessionStorage.setItem('type', 'resetPassword')
      this.$router.push({ path: '/login', query: { redirect: '/index', type: 'resetPassword' } })
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.loginForm.tenantType = 1
          const param = { ...this.loginForm }
          param.password = encryptPassword(param.password)
          this.$store
            .dispatch('Login', param)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
              if (this.captchaEnabled) {
                this.getCode()
              }
            })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.input {
  /deep/ .el-input__suffix,
  /deep/ .el-input__suffix-inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  // background-image: url('../assets/images/login-background.jpg');
  // background-size: cover;
}
.title {
  margin: 0px auto 10px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  position: relative;
  border-radius: 6px;
  background: #ffffff;
  // width: 500px;
  padding: 25px 25px 5px 25px;
  .registration {
    position: absolute;
    top: 25px;
    right: 30px;
    font-size: 14px;
    color: #4084ff;
    font-weight: 700;
    cursor: pointer;
  }
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
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
.el-login-footer {
  height: 60px;
  line-height: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.1);
}
.login-code-img {
  height: 38px;
}

.login_container {
  display: flex;
  flex-direction: column;
  min-width: 1200px;
  height: 100vh;
  min-height: 600px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    height: 75px;
    width: 1200px;
    // padding: 0 50px 0 100px;
    margin: 0 auto;
    background-color: #fff;
    .logo_card {
      width: 250px;
      height: 60px;
    }
    .logo {
      width: 100%;
      height: 100%;
      // margin-top: 9px;
    }
    .tab {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
      margin-left: 100px;
      .tab_item {
        user-select: none;
        font-size: 20px;
        font-weight: 600;
        margin-right: 50px;
        cursor: pointer;
      }
      .active {
        color: #4084ff;
      }
    }
    .right-menu-item {
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    // background: linear-gradient(90deg, #40c2ff, #4084ff);
    // background-color: #0481fa;
    .content_container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1200px;
      margin: 0 auto;
    }
    .left {
      flex: 1;
      color: #fff;
      // padding-left: 150px;
      // background-color: pink;
      h2,
      p {
        margin: 0;
        padding: 0;
      }
      p {
        margin-top: 5px;
      }
    }
    .right {
      // flex-shrink: 0;
      position: absolute;
      top: 38vh;
      right: 250px;
      width: 500px;
    }
  }
  .footer {
    height: 70px;
    line-height: 70px;
    text-align: center;
    flex-shrink: 0;
  }
}
.left_img {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.img-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.order_container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 75px);
  font-size: 14px;
  overflow: hidden;
  background: linear-gradient(90deg, #40c2ff, #4084ff);
}
.order_card {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  // background-color: pink;
  .order_no {
    color: #fff;
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 16px;
  }
  .order_card_content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 175px);
    padding: 0 30px;
    background-color: #fff;
    /deep/ .tabs {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    /deep/ .el-tabs__content {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
    /deep/ .el-tabs__content::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background-color: initial;
    }

    /deep/ .el-tabs__content::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(127, 135, 146, 0.5);
    }

    /deep/ .el-tabs__content::-webkit-scrollbar-track {
      width: 10px;
      box-shadow: none;
      border-radius: 0;
      background-color: initial;
    }
  }
  .back {
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
}
</style>
