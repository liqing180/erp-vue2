<template>
  <FormPageLayout>
    <template v-slot:btn>
      <el-button
        type="primary"
        v-if="!comDisFrom"
        size="mini"
        :disabled="fullscreenLoading"
        @click="submitForm"
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
            <el-form ref="createForm" :model="createForm" :rules="createRules" label-width="160px">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.ruleCode')}`" prop="ruleType">
                    <el-select
                      v-model="createForm.ruleType"
                      placeholder=""
                      style="width: 100%"
                      clearable
                      filterable
                      v-if="!rowId"
                    >
                      <el-option
                        v-for="dict in ruleTypeList"
                        :key="dict.ruleType"
                        :label="dict.ruleTypeShowStr"
                        :value="dict.ruleType"
                      ></el-option>
                    </el-select>
                    <el-input :value="createForm.ruleTypeShowStr" disabled v-else></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item
                    :label="`${$t('ui.codeRule1')}`"
                    prop="ruleTypeShowStr"
                    :show-message="false"
                    require
                  >
                    <el-row type="flex" justify="space-between">
                      <el-col>
                        <el-form-item prop="prefix">
                          <el-input
                            v-model="createForm.prefix"
                            :placeholder="'*' + $t('ui.prefix')"
                            maxlength="20"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1.5" style="margin: 0 10px">-</el-col>
                      <el-col>
                        <el-form-item>
                          <el-select
                            v-model="createForm.dateType"
                            placeholder=""
                            style="width: 100%"
                            clearable
                          >
                            <el-option
                              v-for="dict in dateTypeList"
                              :key="dict"
                              :label="dict"
                              :value="dict"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1.5" style="margin: 0 10px">-</el-col>
                      <el-col>
                        <el-form-item>
                          <el-input v-model="createForm.infix" maxlength="20"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1.5" style="margin: 0 10px">-</el-col>
                      <el-col>
                        <el-form-item prop="length">
                          <el-input-number
                            v-model="createForm.length"
                            :precision="0"
                            v-thousandSplit="{ precision: 0 }"
                            type="number"
                            class="form-wd textleft"
                            :min="1"
                            :max="10"
                            :placeholder="'*' + $t('ui.serialLength')"
                            @change="inputNumberChange('length')"
                            style="width: 100%"
                            controls-position="right"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('ui.template')}`" prop="template">
                    <el-input :value="templateStr()" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="createForm.description"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                      :disabled="!editAuth"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <div class="form-card mt10" v-if="!!rowId">
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
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import {
  saveCodeRule,
  queryCodeRuleById,
  updateCodeRule,
  queryOtherMsg
} from '@/api/system/createCodeRule'
import SystemOperationLogTable from '@/views/components/systemOperationLog/systemOperationLogTable.vue'

export default {
  name: 'FormPage',
  dicts: ['sys_rule_type'],
  components: { SystemOperationLogTable },
  props: {
    propTimeId: {
      type: String,
      default: ''
    },
    propRowId: {
      type: String,
      default: ''
    },
    propRuleType: {
      type: String,
      default: ''
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vm = this
    return {
      fullscreenLoading: false,
      createForm: {},
      createRules: {
        ruleType: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change']
          }
        ],
        prefix: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        length: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['blur']
          }
        ]
      },
      activeNames: ['1', '2'],
      timeId: '',
      rowId: '',
      collapseWarningForBasicInfo: false,
      dateTypeList: [],
      ruleTypeList: []
    }
  },
  watch: {
    propTimeId: {
      immediate: true,
      handler: function (selected) {
        this.timeId = this.propTimeId
        this.rowId = this.propRowId
        this.queryOtherMsg()
        if (this.rowId) {
          this.handleUpdate()
        } else {
          this.handleAdd()
        }
      }
    }
  },
  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['inventoryManagement:safetyStock:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  created() {
    setTimeout(() => {
      this.setRouteTitleView(this.comDisFrom)
    }, 0)
  },
  methods: {
    templateStr() {
      const { prefix, dateType, length, infix } = this.createForm
      let str = ''
      if (prefix) {
        str += prefix
      }
      if (dateType) {
        str += this.getCurrentDate(dateType)
      }
      if (infix) {
        str += infix
      }
      if (length) {
        for (let i = 0; i < length; i++) {
          if (i === length - 1) {
            str += 1
          } else {
            str += 0
          }
        }
      }
      this.$set(this.createForm, 'template', str)
      return str
    },
    getCurrentDate(type) {
      const currentTime = new Date()
      // 获取年份
      const year = currentTime.getFullYear() + ''
      // 获取月份（月份从0开始,需要加1）
      const month =
        currentTime.getMonth() + 1 >= 10
          ? currentTime.getMonth() + 1
          : '0' + (currentTime.getMonth() + 1)
      // 获取日期
      const day = currentTime.getDate() >= 10 ? currentTime.getDate() : '0' + currentTime.getDate()

      type = type.toLowerCase().replace(/\s/g, '')
      if (type === 'yyyy') {
        return year
      } else if (type === 'mmyyyy') {
        return month + '' + year
      } else if (type === 'ddmmyyyy') {
        return day + '' + month + '' + year
      } else if (type === 'ddmm') {
        return day + '' + month
      } else if (type === 'yyyymm') {
        return year + '' + month
      } else if (type === 'yyyymmdd') {
        return year + '' + month + '' + day
      } else if (type === 'yymmdd') {
        const y = year.slice(-2)
        return y + '' + month + '' + day
      } else if (type === 'ddmmyy') {
        const y = year.slice(-2)
        return day + '' + month + '' + y
      }
      return type
    },
    queryOtherMsg() {
      queryOtherMsg({}).then((res) => {
        console.log(res)
        const { dateTypeList, ruleTypeList } = res.data
        this.dateTypeList = dateTypeList || []
        this.ruleTypeList = ruleTypeList || []
      })
    },
    handleAdd() {
      this.reset()
      if (this.propRuleType) {
        this.$set(this.createForm, 'ruleType', this.propRuleType)
      }
    },
    handleUpdate() {
      this.reset()
      queryCodeRuleById({ codeRuleId: this.rowId }).then((res) => {
        this.createForm = res.data || {}
      })
    },
    inputNumberChange(code) {
      this.$refs.createForm.validateField(code)
    },
    reset() {
      this.createForm = {
        ruleType: undefined,
        prefix: undefined,
        dateType: undefined,
        length: undefined,
        template: undefined,
        description: undefined
      }
      this.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2']
      this.resetForm('createForm')
    },

    save(param) {
      const vm = this
      vm.fullscreenLoading = true
      saveCodeRule(param)
        .then((res) => {
          vm.$message.success(
            `${vm
              .$t('ui.addCodeRuleSuccess')
              .replace('$1', param.prefix)
              .replace('$2', param.template)}`
          )
          this.cancel()
          vm.fullscreenLoading = false
        })
        .catch(() => {
          vm.fullscreenLoading = false
        })
    },
    update(param) {
      const vm = this
      vm.fullscreenLoading = true
      updateCodeRule(param)
        .then((res) => {
          vm.$message.success(
            `${vm
              .$t('ui.addCodeRuleSuccess')
              .replace('$1', param.prefix)
              .replace('$2', param.template)}`
          )
          this.cancel()
          vm.fullscreenLoading = false
        })
        .catch(() => {
          vm.fullscreenLoading = false
        })
    },
    // 取消按钮
    cancel() {
      if (this.propRuleType) {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.back()
        return
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/system/createCodeRule' })
    },
    submitForm() {
      const vm = this
      this.$refs.createForm.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          this.$modal.confirm(vm.$t('ui.addCodeRuleConfirm')).then(() => {
            const param = JSON.parse(JSON.stringify(vm.createForm))
            if (this.rowId) {
              vm.update(param)
            } else {
              vm.save(param)
            }
          })
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    }
  }
}
</script>
