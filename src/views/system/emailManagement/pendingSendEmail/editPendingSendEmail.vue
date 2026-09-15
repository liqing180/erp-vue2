<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" :disabled="fullscreenLoading" @click="submitForm"
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
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="195px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('system.emailFor')}`" prop="templateForShow">
                    <el-select
                      v-model="createForm.templateForShow"
                      filterable
                      placeholder
                      disabled
                      value-key="key"
                      class="form-wd"
                      @change="handleSendMode"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in []"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('system.templateNo')}`" prop="templateNo">
                    <el-select
                      v-model="createForm.templateNo"
                      filterable
                      placeholder
                      value-key="key"
                      class="form-wd"
                      @change="handleTemplateNo"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in templateNoOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('system.sendMode')}`" prop="sentModeShow">
                    <el-input
                      :value="selectDictLabel(dict.type.email_send_mode, createForm.sentMode)"
                      maxlength="60"
                      disabled
                      class="form-wd"
                    ></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item :label="`${$t('system.to')}`" prop="toUser">
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-select
                          v-model="createForm.toUser"
                          multiple
                          placeholder
                          class="email-names2"
                          style="width: 100%"
                        >
                          <el-option-group
                            v-for="group in toOptions"
                            :key="group.label"
                            :label="group.label"
                          >
                            <el-option
                              v-for="item in group.options"
                              :key="item"
                              :label="item"
                              :value="item"
                            >
                              <div
                                style="overflow: hidden; text-overflow: ellipsis; max-width: 740px"
                              >
                                <span v-setLabelTitle>{{ item }}</span>
                              </div>
                            </el-option>
                          </el-option-group>
                        </el-select>
                      </div>
                      <div class="con-right" v-if="!comDisFrom">
                        <addUserEmail
                          @setToUserList="
                            (arr) => {
                              setToUserList(arr, 'to')
                            }
                          "
                        ></addUserEmail>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('system.cc')}`" prop="ccUser">
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-select
                          v-model="createForm.ccUser"
                          class="email-names form-wd"
                          multiple
                          placeholder=""
                          collapse-tags
                        >
                          <el-option-group
                            v-for="group in ccOptions"
                            :key="group.label"
                            :label="group.label"
                          >
                            <el-option
                              v-for="item in group.options"
                              :key="item"
                              :label="item"
                              :value="item"
                            >
                              <div
                                style="overflow: hidden; text-overflow: ellipsis; max-width: 740px"
                              >
                                <span v-setLabelTitle>{{ item }}</span>
                              </div>
                            </el-option>
                          </el-option-group>
                        </el-select>
                      </div>
                      <div class="con-right" v-if="!comDisFrom">
                        <addUserEmail
                          @setToUserList="
                            (arr) => {
                              setToUserList(arr, 'cc')
                            }
                          "
                        ></addUserEmail>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('system.bcc')}`" prop="bccUser">
                    <div class="input-switch-box">
                      <div class="con-left">
                        <el-select
                          v-model="createForm.bccUser"
                          class="email-names form-wd"
                          multiple
                          placeholder=""
                          collapse-tags
                        >
                          <el-option-group
                            v-for="group in bccOptions"
                            :key="group.label"
                            :label="group.label"
                          >
                            <el-option
                              v-for="item in group.options"
                              :key="item"
                              :label="item"
                              :value="item"
                            >
                              <div
                                style="overflow: hidden; text-overflow: ellipsis; max-width: 740px"
                              >
                                <span v-setLabelTitle>{{ item }}</span>
                              </div>
                            </el-option>
                          </el-option-group>
                        </el-select>
                      </div>
                      <div class="con-right" v-if="!comDisFrom">
                        <addUserEmail
                          @setToUserList="
                            (arr) => {
                              setToUserList(arr, 'bcc')
                            }
                          "
                        ></addUserEmail>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="`${$t('system.subject')}`" prop="templateSubject">
                    <MyInput
                      v-model="createForm.templateSubject"
                      type="textarea"
                      maxlength="100"
                      resize="none"
                      :autosize="{ minRows: 1, maxRows: 4 }"
                      style="width: 100%"
                    ></MyInput>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="`${$t('system.content')}`" prop="templateContent">
                    <emailEditor
                      v-model="createForm.templateContent"
                      class="form-wd"
                      :template-for="cpuTemplateFor"
                      :init-content="initContent"
                      :config="config"
                      :disabled="comDisFrom"
                    ></emailEditor>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('system.sendBy')}`" prop="sendUserName">
                    <el-input
                      :value="createForm.sendUserName || nickName"
                      disabled
                      class="form-wd"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('system.dateSend')}`" prop="sendTime">
                    <el-date-picker
                      v-model="createForm.createdTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      class="form-wd"
                      placeholder
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
        <div class="form-card mt10">
          <el-collapse-item name="2">
            <template slot="title">
              <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
              <strong>{{ $t('ui.attachment') }}</strong>
            </template>
            <el-row>
              <el-col :span="24">
                <div class="mb20">
                  <myUpload ref="uploadRef" :disabled="comDisFrom" />
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>
<script>
import { mapState } from 'vuex'
import emailEditor from '@/views/system/emailManagement/editor/editor'
import {
  getPendingSendEmailById,
  queryAllTemplateFor,
  sendEmail,
  switchEmailForToTemplateNo,
  getTemplateNoByTemplateFor
} from '@/api/system/emailManagement'
import locale from '@/views/system/lang/index'
import { multiUpload } from '@/api/basic/basic'
import addUserEmail from '../components/addUserEmail.vue'

const getTextWidth = (text) => {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  context.font = '14px Microsoft Yahei'
  const metrics = context.measureText(text)
  return metrics.width
}
const comLabelTitle = (el) => {
  const width = getTextWidth(el.innerText)
  if (width > 600) {
    el.title = el.innerText
  }
}

export default {
  directives: {
    setLabelTitle: {
      /**
       * 设置cascaber 级联的label, dom 宽度超过 300px, 设置title
       * @param {*} el
       */
      inserted(el) {
        comLabelTitle(el)
      }
    }
  },
  components: {
    addUserEmail,
    emailEditor
  },
  dicts: ['email_send_mode', 'business_contact_person_title'],
  data() {
    const vm = this
    const htmlChartGtTenThousand = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === '') {
        callback()
      } else if (value.length > 10000) {
        const obj = document.createElement('div')
        obj.innerHTML = value
        const curVal = obj.childNodes
        let strLen = 0
        Array.from([])
          .slice.apply(curVal, [0])
          // eslint-disable-next-line array-callback-return
          .map((item) => {
            if (item.nodeType === 3) {
              strLen += item.toString().trim().length
            } else {
              strLen += item.innerText.trim().length
            }
          })
        if (strLen <= 0) {
          // required.
          callback(new Error(vm.$t('system.contentReq ')))
        } else {
          callback(new Error(vm.$t('system.htmlChartGtTenThousand')))
        }
      } else {
        callback()
      }
    }
    return {
      timeId: '',
      id: '',
      activeNames: ['1', '2', '3'],
      initContent: '',
      config: {
        width: 800, // px
        height: 440, // px
        contentReadOnly: false,
        isShowToolBar: true,
        disabled: false,
        buttonsOption: [
          {
            componentName: 'BtnServTpl',
            isShow: false
          }
        ]
      },
      createVisible: false,
      createForm: {
        toUser: []
      },
      createRules: {
        templateNo: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        toUser: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        templateSubject: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        templateContent: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          },
          {
            validator: htmlChartGtTenThousand,
            trigger: ['change', 'blur']
          }
        ]
      },
      templateForList: [],
      uploadUrl: multiUpload,
      fileListCache: [],
      disIsDefault: false,
      toOptions: [
        {
          label: vm.$t('system.defaultEmail'),
          options: []
        },
        {
          label: vm.$t('system.addNewEmail'),
          options: []
        }
      ],
      ccOptions: [
        {
          label: vm.$t('system.defaultEmail'),
          options: []
        },
        {
          label: vm.$t('system.addNewEmail'),
          options: []
        }
      ],
      bccOptions: [
        {
          label: vm.$t('system.defaultEmail'),
          options: []
        },
        {
          label: vm.$t('system.addNewEmail'),
          options: []
        }
      ],
      templateNoOptions: [],
      fullscreenLoading: false,
      collapseWarningForBasicInfo: false
    }
  },
  computed: {
    ...mapState({
      nickName: (state) => state.user.nickName
    }),
    cpuTemplateFor() {
      return this.createForm.templateFor
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['system:pendingSendEmail:edit'])
    },
    comDisFrom() {
      return !this.editAuth
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    const vm = this
    vm.createForm = { toUser: [] }
    const id = this.$route.query.id
    vm.queryAllTemplateFor()
    vm.getPendingSendEmailById(id)
  },
  methods: {
    eamilStrToArr(eamilStr) {
      if (!eamilStr) {
        return []
      }
      return eamilStr.split(',')
    },
    getPendingSendEmailById(id) {
      const vm = this
      getPendingSendEmailById(id).then((res) => {
        const results = res.data
        const { isDefault, toUser, ccUser, bccUser, systemUserArray } = results
        const toEmailList = vm.eamilStrToArr(toUser)
        const ccEmailList = vm.eamilStrToArr(ccUser)
        const bccEmailList = vm.eamilStrToArr(bccUser)
        results.toUser = toEmailList
        vm.toOptions[0].options = systemUserArray
        results.ccUser = ccEmailList
        vm.ccOptions[0].options = systemUserArray
        results.bccUser = bccEmailList
        vm.bccOptions[0].options = systemUserArray
        vm.createForm = results
        vm.$set(vm.createForm, 'createTime', null)
        vm.getTemplateNoByTemplateFor(vm.createForm.templateFor)
        if (results.commonFileList) {
          // results.commonFileList.forEach(item => {
          //   item.disCancel = true
          // })
          setTimeout(() => {
            vm.$refs.uploadRef.initFileList(results.commonFileList)
          }, 100)
        }

        vm.initContent = results.templateContent

        if (isDefault === 1) {
          vm.disIsDefault = true
        }
      })
    },
    queryAllTemplateFor() {
      const vm = this
      queryAllTemplateFor()
        .then((res) => {
          vm.templateForList = res.data || []
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    getTemplateNoByTemplateFor(id) {
      const vm = this
      getTemplateNoByTemplateFor(id)
        .then((res) => {
          vm.templateNoOptions = res.data || []
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    handleTemplateFor(key) {
      const vm = this
      const curItem = vm.templateForList.find((item) => {
        return item.dicName === key
      })
      if (curItem) {
        vm.createForm.templateForShow = curItem.dicDesc
      }
    },
    handleIsDefault(value) {
      if (value === 1) {
        this.$set(this.createForm, 'isDefault', 1)
      } else {
        this.$set(this.createForm, 'isDefault', 0)
      }
    },
    async submitForm() {
      const vm = this
      let createValid = false
      vm.$refs.createForm.validate((valid) => {
        createValid = valid
      })
      if (!createValid) {
        return
      }
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          const myFileIds = vm.$refs.uploadRef.getFileIds()
          if (myFileIds === false) {
            return
          }
          vm.createForm.commonFileList = myFileIds
          this.$modal.confirm(vm.$t('system.aendConfirm')).then(() => {
            vm.sendEmail(vm.createForm)
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    },
    sendEmail(param) {
      const vm = this
      vm.fullscreenLoading = true
      param.toUser = param.toUser.join(',')
      param.ccUser = param.ccUser.join(',')
      param.bccUser = param.bccUser.join(',')
      sendEmail(param)
        .then((res) => {
          vm.$message.success(
            `${vm.$t('system.sendSuccess').replace('$1', `${vm.createForm.templateNo}`)}`
          )
          this.cancel()
          vm.fullscreenLoading = false
        })
        .catch((err) => {
          vm.fullscreenLoading = false
          window.console.error(err)
        })
    },
    handleSendMode() {},
    handleTemplateNo(templateNo) {
      const vm = this
      const params = {
        id: vm.createForm.id,
        templateFor: vm.createForm.templateFor,
        templateNo
      }
      switchEmailForToTemplateNo(params)
        .then((res) => {
          const results = res.data
          const { templateContent, templateSubject } = results
          vm.$set(vm.createForm, 'templateContent', templateContent)
          vm.initContent = templateContent
          vm.$set(vm.createForm, 'templateSubject', templateSubject)
        })
        .catch((err) => {
          window.console.error(err)
        })
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/system/emailManagement/pendingSendEmail')
    },
    setToUserList(arr, send) {
      const vm = this
      let arrCopy = JSON.parse(JSON.stringify(arr))
      arrCopy = arrCopy.map((item) => {
        let { title, contactPersonName, email } = item
        if (title || title === 0) {
          const str = this.selectDictLabel(this.dict.type.business_contact_person_title, title)
          title = str
          // title = `${vm.BUSINESS_CONTACT_PERSON_TITLE[title]} `
        } else {
          title = ''
        }
        const value = `${title}${contactPersonName}:${email}`
        return value
      })
      if (send === 'to') {
        const defalutEmail = vm.toOptions[0].options
        // 过滤旧的自定义添加的邮箱
        vm.createForm.toUser = vm.createForm.toUser.filter((item) => {
          return defalutEmail.includes(item)
        })
        // 将最新的自定义邮箱添加到 选中列表
        vm.createForm.toUser = [...vm.createForm.toUser, ...arrCopy]
        vm.$set(vm.toOptions, 1, { label: vm.$t('system.addNewEmail'), options: arrCopy })
      }
      if (send === 'cc') {
        const defalutEmail = vm.ccOptions[0].options
        // 过滤旧的自定义添加的邮箱
        vm.createForm.ccUser = vm.createForm.ccUser.filter((item) => {
          return defalutEmail.includes(item)
        })
        // 将最新的自定义邮箱添加到 选中列表
        vm.createForm.ccUser = [...vm.createForm.ccUser, ...arrCopy]
        vm.$set(vm.ccOptions, 1, { label: vm.$t('system.addNewEmail'), options: arrCopy })
      }
      if (send === 'bcc') {
        const defalutEmail = vm.bccOptions[0].options
        // 过滤旧的自定义添加的邮箱
        vm.createForm.bccUser = vm.createForm.bccUser.filter((item) => {
          return defalutEmail.includes(item)
        })
        // 将最新的自定义邮箱添加到 选中列表
        vm.createForm.bccUser = [...vm.createForm.bccUser, ...arrCopy]
        vm.$set(vm.bccOptions, 1, { label: vm.$t('system.addNewEmail'), options: arrCopy })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.toAddBtn {
  position: absolute;
  right: -50px;
  top: -1px;
}
.downWrapper {
  user-select: none;
  -webkit-user-select: none;
  > li {
    width: 800px;
    height: 40px;
    border: 1px solid #e4e7ed;
    color: blue;
    font-size: 12px;
    line-height: 40px;
    text-indent: 1em;
    margin-bottom: 10px;
    cursor: pointer;
    > i {
      font-size: 24px;
      margin-right: 10px;
      color: #303133;
      position: relative;
      top: 4px;
    }
  }
  .el-icon-close {
    float: right;
    line-height: 30px;
    cursor: pointer;
    opacity: 0.75;
    color: #606266;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
.email-names {
  width: 100%;
  .el-select__tags {
    .el-tag:nth-of-type(1) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-select__tags-text {
        display: inline-block;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-tag {
      margin: 2px 0 2px 4px !important;
    }
  }
  .el-select__tags-text {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.email-names2 {
  .el-select__tags {
    .el-tag {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-select__tags-text {
        display: inline-block;
        max-width: 720px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .el-select__tags-text {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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
    margin-left: 10px;
    line-height: 0;
  }
  .select {
    /deep/ .el-select .el-tag {
      max-width: 180px;
    }
  }
}
</style>
