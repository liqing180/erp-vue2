<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :title="$t('ui.action')"
    :visible.sync="dialogVisible"
    width="1000px"
    top="5vh"
    @closed="closed"
  >
    <el-form
      ref="releaseForm"
      :model="releaseForm"
      @submit.native.prevent
      :rules="releaseFormRules"
      label-width="200px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="`${$t('issue.todo')}`" prop="todo">
            <el-select
              v-model="releaseForm.todo"
              :disabled="!!cancelRow.id"
              placeholder=""
              style="width: 100%"
              clearable
              @change="todoChg"
            >
              <el-option
                v-for="item in todoOptions"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="isShowStatusTypeRow">
        <el-col :span="12">
          <el-form-item v-if="isShowStatus" :label="`${$t('issue.status')}`" prop="status">
            <el-select v-model="releaseForm.status" class="w100" clearable placeholder="">
              <el-option
                v-for="dict in dict.type.issue_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else :label="`${$t('issue.issueType')}`" prop="typeId">
            <el-select
              v-model="releaseForm.typeId"
              class="w100"
              filterable
              clearable
              placeholder=""
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
      </el-row>

      <el-row v-if="isShowReleaseRow">
        <el-col :span="12">
          <el-form-item :label="`${$t('issue.releasePerson')}`" prop="releasePerson">
            <el-select
              v-model="releaseForm.releasePerson"
              class="w100"
              filterable
              clearable
              placeholder=""
            >
              <el-option
                v-for="item in releasePersonPosition"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('issue.releasedDate')}`" prop="releaseDate">
            <el-date-picker
              v-model="releaseForm.releaseDate"
              :format="fmtForYmd"
              disabled
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

      <el-row v-if="cancelRow.id">
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.modifiedBy')}`">
            <el-input v-model="releaseForm.modifiedBy" disabled class="form-wd" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('ui.modifiedTime')}`">
            <el-date-picker
              v-model="releaseForm.modifiedTime"
              :editable="false"
              disabled
              type="date"
              :format="fmtForYmdhms"
              class="form-wd"
              placeholder
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="isShowCancelledRow">
        <el-col :span="12">
          <el-form-item :label="`${$t('issue.cancelledName')}`">
            <el-input :value="releaseForm.cancelledName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="`${$t('issue.cancelledTime')}`">
            <el-date-picker
              :style="{ width: '100%' }"
              :value="releaseForm.cancellationDate"
              :editable="false"
              disabled
              type="date"
              :format="fmtForYmdhms"
              placeholder
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('issue.reason')}`" prop="reason">
            <MyInput
              type="textarea"
              v-model="releaseForm.reason"
              :autosize="{ minRows: 1, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="200"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item :label="`${$t('ui.remarks')}`" prop="remarks">
            <MyInput
              type="textarea"
              v-model="releaseForm.remarks"
              :autosize="{ minRows: 2, maxRows: 4 }"
              resize="none"
              show-word-limit
              :maxlength="3000"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="ghost" @click="dialogVisible = false">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="handleSave" :loading="submitLoading">{{
        $t('uiBtn.submit')
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { actionIssue } from '@/api/system/issueList'
export default {
  dicts: ['issue_type', 'issue_status'],
  data() {
    const vm = this
    return {
      dialogVisible: false,
      submitLoading: false,
      releaseForm: [],
      releaseFormRules: {
        todo: [
          {
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
        typeId: [
          {
            required: true,
            message: vm.$t('ui.reqMsg'),
            trigger: ['change', 'blur']
          }
        ],
        releasePerson: [
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
      todoOptions: [
        { key: 0, value: 'Release', label: this.$t('issue.release') },
        { key: 1, value: 'Cancel', label: this.$t('issue.cancel') },
        { key: 2, value: 'Edit Status', label: this.$t('issue.editStatus') },
        { key: 3, value: 'Edit Type', label: this.$t('issue.editType') }
      ],
      startDatePickerOption() {
        return {
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 1 * 24 * 60 * 60 * 1000
          }
        }
      },
      ids: [],
      cancelRow: {}
    }
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    isShowStatusTypeRow() {
      const vm = this
      const todo = vm.releaseForm.todo

      if (todo === 'Edit Status' || todo === 'Edit Type') {
        return true
      } else {
        return false
      }
    },

    isShowStatus() {
      const vm = this
      const todo = vm.releaseForm.todo

      if (todo === 'Edit Status') {
        return true
      } else {
        return false
      }
    },

    isShowReleaseRow() {
      const vm = this
      const todo = vm.releaseForm.todo

      if (todo === 'Release') {
        return true
      } else {
        return false
      }
    },

    isShowCancelledRow() {
      const vm = this
      const todo = vm.releaseForm.todo

      if (todo === 'Cancel') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    reset() {
      this.releaseForm = {
        todo: undefined,
        status: undefined,
        typeId: undefined,
        releasePerson: undefined,
        releasedDate: undefined,
        cancelledName: undefined,
        cancellationDate: undefined,
        reason: '',
        remarks: ''
      }
      this.ids = []
      this.cancelRow = {}
      this.resetForm('releaseForm')
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    todoChg() {
      const vm = this
      const todo = vm.releaseForm.todo

      vm.releaseForm = {}

      vm.$set(vm.releaseForm, 'todo', todo)

      if (vm.isShowReleaseRow) {
        vm.$set(vm.releaseForm, 'releasePerson', 'Chen Xiao Zhong')
      }
      if (vm.isShowCancelledRow) {
        vm.$set(vm.releaseForm, 'cancelledName', this.$store.state.user.nickName)
      }

      vm.$nextTick(() => {
        if (vm.$refs.releaseForm) {
          vm.$refs.releaseForm.clearValidate()
        }
      })
    },
    handleAction(ids) {
      this.reset()
      this.ids = ids
      this.dialogVisible = true
    },
    handleCancel(row) {
      const vm = this
      this.reset()
      this.cancelRow = { ...row }
      this.$set(this.cancelRow, 'id', row.id)
      vm.$set(vm.releaseForm, 'todo', 'Cancel')
      vm.$set(vm.releaseForm, 'modifiedId', row.modifiedId)
      vm.$set(vm.releaseForm, 'modifiedBy', row.modifiedBy)
      vm.$set(vm.releaseForm, 'modifiedTime', row.modifiedTime)
      vm.$set(vm.releaseForm, 'cancelledName', this.$store.state.user.nickName)
      this.dialogVisible = true
    },
    handleSave() {
      const vm = this
      this.$refs.releaseForm.validate((valid) => {
        if (valid) {
          this.$modal.confirm(this.$t('issue.releaseConfirm')).then(() => {
            return vm.updateData()
          })
        }
      })
    },
    updateData() {
      const vm = this
      let param = {}

      param = {
        ...vm.releaseForm,
        ids: vm.cancelRow.id ? [vm.cancelRow.id] : vm.ids
      }
      if (!vm.isShowStatusTypeRow) {
        delete param.status

        delete param.typeId
        delete param.typeName
      } else {
        if (vm.isShowStatus) {
          delete param.typeId
          delete param.typeName
        } else {
          delete param.status
        }
      }
      if (!vm.isShowReleaseRow) {
        delete param.releasePerson
        delete param.releaseDate
      }
      if (!vm.isShowCancelledRow) {
        delete param.cancelledId
        delete param.cancelledName
        delete param.cancellationDate
      }
      this.submitLoading = true
      actionIssue(param)
        .then((res) => {
          this.submitLoading = false
          if (res.code === 200) {
            this.dialogVisible = false
            this.$message.success(`${this.$t('issue.releaseSuccess')}`)
            this.$emit('onSuccess')
          }
        })
        .catch(() => {
          this.submitLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.transfer-style {
  text-align: center;
  .el-transfer-panel {
    width: 300px;
    .el-transfer-panel__body {
      height: 500px !important;
      .el-transfer-panel__list.is-filterable {
        height: calc(500px - 62px) !important;
      }
    }
  }
  .el-transfer__buttons {
    display: inline-flex;
    flex-direction: column;
    padding: 0 30px;
    .el-transfer__button:nth-child(2) {
      margin: 0;
    }
  }

  .el-transfer__buttons .el-transfer__button {
    width: 80px !important;
  }
}
</style>
