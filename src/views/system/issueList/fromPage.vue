<template>
  <!-- formClass="form-page-btn--hide" -->
  <FormPageLayout>
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button v-if="isShowCancelBtn" type="primary" size="mini" @click="handleCancel"
        >{{ $t('uiBtn.cancel') }}
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
              ref="form"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="230px"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="`${$t('issue.module')}`" prop="moduleTitles">
                    <el-cascader
                      popper-class="hide-cascader-scrollbar"
                      class="w100"
                      v-model="form.moduleTitles"
                      :options="comRoutes"
                      :placeholder="moduleTitlesStr"
                      :props="{ checkStrictly: true }"
                      clearable
                      @change="moduleChange"
                      :disabled="comDisFrom"
                    >
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.issueType')}`" prop="typeId">
                    <el-select
                      v-model="form.typeId"
                      :disabled="comDisFrom"
                      placeholder=""
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="dict in dict.type.issue_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.issueNo')}`">
                    <el-input v-model="form.issueNo" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.description')">
                    <MyInput
                      type="textarea"
                      v-model="form.description"
                      :disabled="comDisFrom"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.userName')}`" prop="userName">
                    <el-input v-model="form.userName" :disabled="comDisFrom" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.status')}`" prop="status">
                    <el-select
                      v-model="form.status"
                      :disabled="comDisFrom"
                      placeholder=""
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="dict in dict.type.issue_status"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.dept')}`">
                    <el-input v-model="form.dept" maxlength="200" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.priority')}`" prop="priorityId">
                    <el-select
                      v-model="form.priorityId"
                      :disabled="comDisFrom"
                      placeholder=""
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="dict in dict.type.issue_priority"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.position')}`">
                    <el-input v-model="form.position" maxlength="200" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="`${$t('issue.scheduledOptimizationDate')}`"
                    prop="scheduledOptimizationDate"
                  >
                    <el-date-picker
                      v-model="form.scheduledOptimizationDate"
                      :disabled="comDisFrom"
                      :format="fmtForYmd"
                      type="date"
                      placeholder=""
                      :picker-options="startDatePickerOption"
                      clearable
                      default-value
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item :label="$t('ui.remarks')">
                    <MyInput
                      type="textarea"
                      v-model="form.remarks"
                      :disabled="comDisFrom"
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      resize="none"
                      show-word-limit
                      :maxlength="3000"
                    ></MyInput>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.releasePerson')}`" prop="releasePerson">
                    <el-select
                      v-model="form.releasePerson"
                      :disabled="comDisFrom"
                      placeholder=""
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="item in releasePersonPosition"
                        :key="item.key"
                        :label="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('issue.releasedDate')}`" prop="releaseDate">
                    <el-date-picker
                      v-model="form.releaseDate"
                      :disabled="comDisFrom"
                      :format="fmtForYmd"
                      type="date"
                      placeholder=""
                      :picker-options="startDatePickerOption"
                      clearable
                      default-value
                      value-format="timestamp"
                      :style="{ width: '100%' }"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="`${$t('ui.createdBy')}`">
                    <el-input :value="form.createdBy" disabled class="form-wd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="rowId">
                  <el-form-item :label="`${$t('ui.modifiedBy')}`">
                    <el-input
                      :value="form.modifiedBy"
                      :title="form.modifiedBy"
                      disabled
                      class="form-wd"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-else>
                  <el-form-item :label="`${$t('ui.createdTime')}`">
                    <el-date-picker
                      :value="form.createdTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="rowId">
                <el-col :span="12">
                  <el-form-item :label="`${$t('ui.createdTime')}`">
                    <el-date-picker
                      :value="form.createdTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="`${$t('ui.modifiedTime')}`">
                    <el-date-picker
                      :value="form.modifiedTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
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

    <actionDlg ref="actionDlg" @onSuccess="cancel" />
  </FormPageLayout>
</template>

<script>
import { mapGetters } from 'vuex'
import { saveIssue, getById, updateIssue } from '@/api/system/issueList'
import pageMixin from '@/mixins/tableMinx'
import locale from './locale'
import actionDlg from './actionDlg.vue'
export default {
  dicts: ['issue_type', 'issue_status', 'issue_priority'],
  mixins: [pageMixin],
  components: { actionDlg },
  data() {
    const vm = this
    return {
      activeNames: [],
      rowId: '',
      // 是否自动生成 EmployeeNo
      form: {},
      rules: {
        moduleTitles: [
          {
            type: 'array',
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        status: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        description: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        priorityId: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        typeId: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ]
      },
      releasePersonPosition: [
        { key: 0, value: 'Chen Xiao Zhong' },
        { key: 1, value: 'Li. Yi Chen' }
      ],
      initStatus: '',
      collapseWarningForBasicInfo: false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.timeId = this.$route.query.timeId
    this.rowId = this.$route.query.id
    if (this.rowId) {
      this.handleUpdate()
    } else {
      this.handleAdd()
    }
  },
  activated() {
    if (this.$route.query.timeId !== this.timeId) {
      this.timeId = this.$route.query.timeId
      this.rowId = this.$route.query.id
      if (this.rowId) {
        this.handleUpdate()
      } else {
        this.handleAdd()
      }
    }
  },
  computed: {
    ...mapGetters(['topbarRouters']),
    comRoutes() {
      const routes = []
      const traverseTree = (row) => {
        const title = row.meta && row.meta.title
        const item = {
          value: title,
          label: this.getMenuTitle(title)
        }
        if (row.children && row.children.length) {
          item.children = row.children.map((child) => traverseTree(child))
        }
        return item
      }
      if (this.topbarRouters) {
        this.topbarRouters.forEach((menuItem) => {
          routes.push(traverseTree(menuItem))
        })
      }
      return routes
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },

    editAuth() {
      return this.checkPermi(['system:issueList:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    },
    isShowCancelBtn() {
      if (this.rowId) {
        // 是取消状态不显示取消按钮

        return this.editAuth && this.initStatus && this.initStatus !== '11'
      }
      return false
    },
    startDatePickerOption() {
      return {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      }
    },
    moduleTitlesStr() {
      let str = ' '
      if (this.form.moduleTitles && this.form.moduleTitles.length > 0) {
        str = this.form.moduleTitles
          .map((item) => {
            return this.getMenuTitle(item)
          })
          .join(' / ')
      }
      return str
    }
  },
  methods: {
    handleAdd() {
      this.reset()
    },
    handleUpdate() {
      this.reset()
      const rowId = this.rowId
      getById(rowId).then((response) => {
        this.form = response.data || {}
        if (this.form.module) {
          this.$set(this.form, 'moduleTitles', this.form.module.split(','))
        }
        this.initStatus = this.form.status
        setTimeout(() => {
          this.$refs.uploadRef.initFileList(this.form.commonFileList)
        }, 100)
      })
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'IssueList' })
    },

    /* 表单部分 */
    // 表单重置
    reset() {
      this.form = {
        moduleTitles: [],
        description: '',
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      }
      this.initStatus = ''
      this.collapseWarningForBasicInfo = false
      this.activeNames = ['1', '2', '3']
      this.resetForm('form')
    },
    moduleChange(value) {
      console.log(value)
    },

    submitForm: function () {
      const myFileIds = this.$refs.uploadRef.getFileIds()
      if (myFileIds === false) {
        return
      }
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (valid) {
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          param.module = param.moduleTitles.join(',')
          param.commonFileList = myFileIds
          this.$modal
            .confirm(this.$t('issue.submitConfirm'))
            .then(() => {
              if (param.id) {
                return updateIssue(param)
              }
              return saveIssue(param)
            })
            .then((response) => {
              this.$modal.msgSuccess(this.$t('issue.submitSuccess'))
              this.cancel()
            })
            .catch(() => {})
        } else {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
      })
    },

    handleCancel() {
      this.$refs.actionDlg.handleCancel({ ...this.form })
    }
  }
}
</script>
<style lang="scss"></style>
