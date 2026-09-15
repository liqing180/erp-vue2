<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      :title="title"
      :visible.sync="open"
      width="1100px"
      append-to-body
      @closed="closed"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="180px" :disabled="comDisFrom">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('DASHBOARD.reportGroup')" prop="groupName">
              <el-input v-model="form.groupName" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('DASHBOARD.system')" prop="reportType">
              <el-select v-model="form.reportType" clearable style="width: 100%" placeholder="">
                <el-option :label="'ERP'" :value="'ERP'"> </el-option>
                <el-option :label="'WMS'" :value="'WMS'"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('DASHBOARD.report')" prop="reportIds">
              <el-select
                v-model="form.reportIds"
                multiple
                collapse-tags
                clearable
                style="width: 100%"
                placeholder=""
              >
                <el-option
                  v-for="child in reportList"
                  :key="child.dictValue"
                  :label="child.dictLabel"
                  :value="child.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('ui.role')" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                multiple
                collapse-tags
                clearable
                style="width: 100%"
                placeholder=""
              >
                <el-option
                  v-for="child in roleList"
                  :key="child.dictValue"
                  :label="child.dictLabel"
                  :value="child.dictValue"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('ui.createdBy')">
              <el-input disabled v-model="form.createdBy" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.createdTime')}`">
              <el-date-picker
                :value="form.createdTime"
                :format="fmtForYmdhms"
                :style="{ width: '100%' }"
                disabled
                placeholder=""
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="false">
          <el-col :span="12">
            <el-form-item :label="$t('ui.modifiedBy')">
              <el-input disabled v-model="form.modifiedBy" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`${$t('ui.modifiedTime')}`">
              <el-date-picker
                :value="form.modifiedTime"
                :format="fmtForYmdhms"
                :style="{ width: '100%' }"
                disabled
                placeholder=""
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('ui.description')">
              <MyInput
                type="textarea"
                v-model="form.description"
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
            <el-form-item :label="`${$t('ui.isActive')}`">
              <el-switch
                v-model="form.isActive"
                :disabled="comDisFrom"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
        <el-button type="primary" @click="submitForm" :loading="btnLoading" v-if="!comDisFrom"
          >{{ $t('uiBtn.submit') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryReportGroupById,
  saveReportGroup,
  updateReportGroup
} from '@/api/reportManagement/dashboard'
export default {
  props: {
    // 角色
    roleList: {
      type: Array,
      default: () => []
    },
    // 报表
    reportList: {
      type: Array,
      default: () => []
    }
  },
  dicts: ['mdm_plant_type'],
  data() {
    return {
      btnLoading: false,
      open: false,
      title: '',
      form: {},
      rules: {
        groupName: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            message: this.$t('ui.reqMsg').replace('$1', this.$t('DASHBOARD.reportGroup')),
            trigger: ['change', 'blur']
          }
        ],
        reportType: [
          {
            required: true,
            message: this.$t('ui.reqMsg'),
            trigger: ['change']
          }
        ],
        reportIds: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            type: 'array',
            message: this.$t('ui.reqMsg').replace('$1', this.$t('DASHBOARD.report')),
            trigger: ['change', 'blur']
          }
        ],
        roleIds: [
          {
            required: true,
            // eslint-disable-next-line
            pattern: new RegExp(/^(?!(\s+$))/g),
            type: 'array',
            message: this.$t('ui.reqMsg').replace('$1', this.$t('ui.role')),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['reportManagement:dashboardSetup:edit'])
    },
    comDisFrom() {
      if (this.form.reportGroupId) {
        return !this.editAuth
      }
      return false
    }
  },
  methods: {
    reset() {
      this.form = {
        reportType: undefined,
        isActive: '1',
        groupName: '',
        roleIds: [],
        reportIds: [],
        createdBy: this.$store.state.user.name,
        createdTime: ''
      }
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    handleAdd() {
      this.reset()
      this.form.reportType = 'ERP'
      this.title = this.$t('DASHBOARD.group')
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.title = this.$t('DASHBOARD.group')
      queryReportGroupById(row.reportGroupId).then((response) => {
        this.form = response.data
        const { roleIds, reportIds } = this.form

        if (roleIds) {
          const idList = roleIds.split(',')
          const roleIdList = this.roleList
            .filter((x) => idList.indexOf(x.dictValue) !== -1)
            .map((k) => k.dictValue)
          this.$set(this.form, 'roleIds', roleIdList)
        }
        if (reportIds) {
          const idList = reportIds.split(',')
          const reportsIdList = this.reportList
            .filter((x) => idList.indexOf(x.dictValue) !== -1)
            .map((k) => k.dictValue)
          this.$set(this.form, 'reportIds', reportsIdList)
        }
        this.open = true
      })
    },
    // 取消按钮
    cancel() {
      this.reset()
      this.open = false
    },
    closed() {
      this.reset()
    },
    /** 提交按钮 */
    async submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = this.$trimOfObj(JSON.parse(JSON.stringify(this.form)))
          param.roleIds = param.roleIds.join(',')
          param.reportIds = param.reportIds.join(',')
          if (!this.form.reportGroupId) {
            this.$modal
              .confirm(this.$t('ui.submitPageConfirm'))
              .then(() => {
                this.btnLoading = true
                return saveReportGroup(param)
              })
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
                this.open = false
                this.$emit('onSuccess')
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            this.$modal
              .confirm(this.$t('ui.submitPageConfirm'))
              .then(() => {
                this.btnLoading = true
                return updateReportGroup(param)
              })
              .then((response) => {
                this.btnLoading = false
                this.$modal.msgSuccess(this.$t('ui.submitPageSuccess'))
                this.open = false
                this.$emit('onSuccess')
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select ::v-deep .el-select__tags > span {
  display: flex;
  max-width: 200px;
}
</style>
