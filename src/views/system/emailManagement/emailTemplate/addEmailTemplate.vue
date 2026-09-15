<template>
  <!-- formClass="form-page-btn--hide" -->
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

            <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="120px">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ETM.templateFor')}`" prop="templateFor">
                    <el-select
                      v-model="createForm.templateFor"
                      :title="createForm.templateForShow"
                      filterable
                      placeholder
                      value-key="key"
                      class="form-wd"
                      @change="handleTemplateFor"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in templateForList"
                        :key="item.dicName"
                        :label="item.dicDesc"
                        :value="item.dicName"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ETM.templateNo')}`" prop="templateNo">
                    <el-input
                      v-model="createForm.templateNo"
                      maxlength="400"
                      disabled
                      class="form-wd"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ETM.subject')}`" prop="templateSubject">
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
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ETM.isDefault')}`" prop="isDefault">
                    <el-switch
                      v-model="createForm.isDefault"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleIsDefault"
                    ></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`" prop="isActive">
                    <el-switch
                      v-model="createForm.isActive"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ETM.content')}`" prop="templateContent">
                    <emailEditor
                      v-model="createForm.templateContent"
                      class="form-wd"
                      :template-for="cpuTemplateFor"
                      :init-content="initContent"
                      :config="config"
                    ></emailEditor>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ETM.remarks')}`" prop="remarks">
                    <MyInput
                      type="textarea"
                      v-model="createForm.remarks"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>
<script>
import {
  queryUserCanCreateTemplateFor,
  saveSysEmailTemplate,
  checkTemplateForIsHaveDefault,
  getDefaultSysEmailTemplateVoByTemplateFor
} from '@/api/system/emailManagement'
import locale from '@/views/system/lang/index'
import emailEditor from '@/views/system/emailManagement/editor/editor'

export default {
  name: 'AddEmailTemplate',
  components: {
    emailEditor
  },
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
          callback(new Error(vm.$t('ETM.contentReq')))
        } else {
          callback(new Error(vm.$t('ETM.htmlChartGtTenThousand')))
        }
      } else {
        callback()
      }
    }

    return {
      fullscreenLoading: false,
      activeNames: ['1', '2'],
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
            isShow: true
          }
        ]
      },
      createVisible: false,
      createForm: {
        isDefault: 1,
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      },
      createRules: {
        templateFor: [
          {
            required: true,
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g), // 不能全部是空格
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
      collapseWarningForBasicInfo: false
    }
  },
  computed: {
    cpuTemplateFor() {
      return this.createForm.templateFor
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    const vm = this
    vm.queryUserCanCreateTemplateFor()
  },
  methods: {
    queryUserCanCreateTemplateFor() {
      const vm = this
      queryUserCanCreateTemplateFor().then((res) => {
        vm.templateForList = res.data || []
      })
    },
    getDefaultSysEmailTemplateVoByTemplateFor(templateFor) {
      const vm = this
      getDefaultSysEmailTemplateVoByTemplateFor(templateFor).then((res) => {
        const { templateSubject, templateContent } = res.data
        vm.$set(vm.createForm, 'templateSubject', templateSubject)
        vm.$set(vm.createForm, 'templateContent', templateContent)
        vm.initContent = templateContent
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
      vm.getDefaultSysEmailTemplateVoByTemplateFor(key)
    },
    handleIsDefault(value) {
      if (value === 1) {
        this.$set(this.createForm, 'active', 1)
      } else {
        this.$set(this.createForm, 'active', 0)
      }
    },
    async submitForm() {
      const vm = this
      let createValid = false
      vm.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        createValid = valid
      })
      if (!createValid) {
        this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        return
      }
      let confirmMsg = vm.$t('ETM.submitConfirm')
      if (vm.createForm.isDefault) {
        const { data } = await checkTemplateForIsHaveDefault(vm.createForm.templateFor)
        if (data && data.msg) {
          confirmMsg = vm.$t('ETM.replaceDefaultConfirm')
          confirmMsg = confirmMsg.replace('$1', data.msg)
          confirmMsg = confirmMsg.replace('$2', vm.createForm.templateForShow)
        }
      }
      this.$modal.confirm(confirmMsg).then(() => {
        vm.saveSysEmailTemplate(vm.createForm)
      })
    },
    saveSysEmailTemplate(param) {
      const vm = this
      vm.fullscreenLoading = true
      saveSysEmailTemplate(param)
        .then((res) => {
          const msg = res.msg
          vm.$message.success(`${vm.$t('ETM.submitSuccess').replace('$1', `${msg}`)}`)
          vm.cancel()
          vm.fullscreenLoading = false
        })
        .catch((err) => {
          vm.fullscreenLoading = false
          window.console.error(err)
        })
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/system/emailManagement/emailTemplate')
    }
  }
}
</script>
<style scoped></style>
