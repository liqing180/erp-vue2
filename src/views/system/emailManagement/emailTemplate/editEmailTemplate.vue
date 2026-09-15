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
            <el-form
              ref="createForm"
              :model="createForm"
              :rules="createRules"
              label-width="120px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ETM.templateFor')}`" prop="templateFor">
                    <el-select
                      v-model="createForm.templateFor"
                      :title="createForm.templateForShow"
                      :disabled="true"
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
                      :disabled="disIsDefault"
                      active-value="1"
                      inactive-value="0"
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
                      :disabled="comDisFrom"
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

        <div class="form-card mt10">
          <el-collapse-item name="2">
            <FormCollapseItemTitle slot="title" :title="$t('ui.systemOperationLog')">
              <template v-if="createForm.operationLogForLast">
                <span
                  v-if="createForm.operationLogForLast.operatorBy"
                  class="info-item mr20"
                  :title="createForm.operationLogForLast.operatorBy"
                >
                  {{ $t('ui.operName') }} : {{ createForm.operationLogForLast.operatorBy }}
                </span>
                <span v-if="createForm.operationLogForLast.operatorTime" class="info-item">
                  {{ $t('ui.operTime') }} :
                  {{ parseTime(createForm.operationLogForLast.operatorTime) }}
                </span>
              </template>
            </FormCollapseItemTitle>
            <div class="pb20">
              <SystemOperationLogTable :tableList="createForm.operationLogList || []" />
            </div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>
<script>
import {
  getSysEmailTemplateById,
  queryAllTemplateFor,
  updateSysEmailTemplate,
  checkTemplateForIsHaveDefault
} from '@/api/system/emailManagement'
import locale from '@/views/system/lang/index'
import emailEditor from '@/views/system/emailManagement/editor/editor'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'EditEmailTemplate',
  components: {
    emailEditor,
    SystemOperationLogTable
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
      createForm: {},
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
      disIsDefault: false,
      id: '',
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
    },
    editAuth() {
      return this.checkPermi(['system:emailTemplate:edit'])
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
    vm.createForm = { isDefault: 0 }
    this.id = this.$route.query.id
    this.timeId = this.$route.query.timeId
    vm.queryAllTemplateFor()
    this.getSysEmailTemplateById()
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    getSysEmailTemplateById() {
      const vm = this
      getSysEmailTemplateById(this.id).then((res) => {
        const results = res.data
        vm.createForm = results
        const { isDefault, templateContent } = results
        if (isDefault === 1) {
          vm.disIsDefault = true
        }
        vm.initContent = templateContent
      })
    },
    queryAllTemplateFor() {
      const vm = this
      queryAllTemplateFor()
        .then((res) => {
          const results = res.data
          vm.templateForList = results
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
      if (value === '1') {
        this.$set(this.createForm, 'isDefault', '1')
      } else {
        this.$set(this.createForm, 'isDefault', '0')
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
      let confirmMsg = vm.$t('ETM.saveConfirm')
      if (vm.createForm.isDefault && !vm.disIsDefault) {
        const { data } = await checkTemplateForIsHaveDefault(vm.createForm.templateFor)
        if (data && data.msg) {
          confirmMsg = vm.$t('ETM.replaceDefaultConfirm')
          confirmMsg = confirmMsg.replace('$1', data.msg)
          confirmMsg = confirmMsg.replace('$2', vm.createForm.templateForShow)
        }
      }
      this.$modal.confirm(confirmMsg).then(() => {
        vm.updateSysEmailTemplate(vm.createForm)
      })
    },
    updateSysEmailTemplate(param) {
      const vm = this
      vm.fullscreenLoading = true
      updateSysEmailTemplate(param)
        .then((res) => {
          vm.$message.success(
            `${vm.$t('ETM.saveSuccess').replace('$1', `${vm.createForm.templateNo}`)}`
          )
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
