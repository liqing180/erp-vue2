<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <template slot="title">
              <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
              <strong>{{ $t('ui.basicInfo') }}</strong>
            </template>
            <el-form ref="createForm" :model="createForm" label-width="195px">
              <el-col :span="24">
                <el-form-item :label="`${$t('system.to')}`" prop="toUser">
                  <el-input v-model="createForm.toUser" disabled resize="none"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`${$t('system.cc')}`" prop="ccUser">
                  <el-input v-model="createForm.ccUser" disabled class="form-wd"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`${$t('system.bcc')}`" prop="bccUser">
                  <el-input v-model="createForm.bccUser" disabled class="form-wd"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="`${$t('system.subject')}`" prop="templateSubject">
                  <MyInput
                    type="textarea"
                    v-model="createForm.templateSubject"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    resize="none"
                    show-word-limit
                    :maxlength="100"
                    disabled
                  ></MyInput>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="`${$t('system.content')}`" prop="content">
                  <emailEditor
                    v-model="createForm.content"
                    class="form-wd"
                    :init-content="initContent"
                    :config="config"
                    readOnly
                  ></emailEditor>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`${$t('system.sendMode')}`" prop="sentMode">
                  <el-input
                    :value="selectDictLabel(dict.type.email_send_mode, createForm.sentMode)"
                    :maxlength="200"
                    class="form-wd"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`${$t('system.sendStatus')}`" prop="sentStatus">
                  <el-input
                    :value="selectDictLabel(dict.type.email_send_status, createForm.sentStatus)"
                    :maxlength="200"
                    class="form-wd"
                    disabled
                  />
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
                    v-model="createForm.sendTime"
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
            </el-form>
          </el-collapse-item>
        </div>
        <div
          class="form-card mt10"
          v-if="createForm && createForm.commonFileList && createForm.commonFileList.length > 0"
        >
          <el-collapse-item name="2">
            <template slot="title">
              <i class="el-icon-caret-right mr5" style="font-size: 20px"></i>
              <strong>{{ $t('ui.attachment') }}</strong>
            </template>
            <el-row>
              <el-col :span="24">
                <div class="mb20">
                  <myUpload ref="uploadRef" :disabled="true" />
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
import locale from '@/views/system/lang/index'
import { saveRole } from '@/api/organization/role'
import { getSentEmailHistoryById } from '@/api/system/emailManagement'
import emailEditor from '@/views/system/emailManagement/editor/editor'

function isWebsite(param) {
  const strRegex =
    // eslint-disable-next-line no-useless-escape
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
  const re = new RegExp(strRegex)
  return re.test(param)
}
export default {
  name: 'AddUser',
  dicts: ['email_send_status', 'email_send_mode'],
  components: { emailEditor },
  data() {
    const vm = this
    const validWebsite = (rule, value, callback) => {
      if (value && !isWebsite(value)) {
        callback(new Error(vm.$t('organization.validWebsite')))
      } else {
        callback()
      }
    }
    return {
      timeId: '',
      id: '',
      activeNames: ['1', '2'],
      createForm: {},
      createRules: {
        legalEntityName: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        phoneNo1: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],

        companyRegNo: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],

        website: [
          {
            validator: validWebsite,
            trigger: ['blur', 'change']
          }
        ],

        email: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          },
          {
            type: 'email',
            validator: this.isEmail,
            trigger: ['blur', 'change']
          }
        ],

        currency: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ]
      },
      initContent: '',
      config: {
        width: '100%', // px
        height: 440, // px
        contentReadOnly: true,
        isShowToolBar: false,
        disabled: true,
        buttonsOption: [
          {
            componentName: 'BtnServTpl',
            isShow: true
          }
        ]
      }
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.id = this.$route.query.id
    this.getSentEmailHistoryById()
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.getSentEmailHistoryById()
    }
  },
  computed: {
    ...mapState({
      nickName: (state) => state.user.nickName
    }),
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  methods: {
    getSentEmailHistoryById() {
      const vm = this
      getSentEmailHistoryById(this.id).then((res) => {
        const results = res.data
        const { templateContent } = results
        vm.initContent = templateContent
        vm.createForm = results
        vm.$set(vm.createForm, 'content', results.templateContent)
        setTimeout(() => {
          vm.$refs.uploadRef && vm.$refs.uploadRef.initFileList(results.commonFileList)
        }, 100)
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/emailManagement/sentEmail' })
    },
    async submitForm() {
      const res = await this.$refs.basicForm.submit()
      if (res) {
        for (const key in res) {
          this.$set(this.form, key, res[key])
        }
        const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
        this.$modal
          .confirm(this.$t('ui.addUserConfirm'))
          .then(() => {
            return saveRole(param)
          })
          .then((response) => {
            this.$modal.msgSuccess(
              `${this.$t('organization.savedSuccess').replace('$1', `[${param.roleName}]`)}`
            )
            this.cancel()
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss"></style>
